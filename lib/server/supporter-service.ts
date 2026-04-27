import "server-only";

import {
  CREDITS_PER_USD,
  createEntryId,
  formatCredits,
  formatUsd,
  roundToTwo,
  type FollowUpTask,
  type LedgerEntry,
  type RedemptionGrant,
  type SupporterWalletState,
} from "@/lib/supporter-v1";
import {
  cloneSupporterState,
  createSessionToken,
  mutateSupporterDatabase,
  normalizeSupporterEmail,
  readSupporterDatabase,
} from "@/lib/server/supporter-store";
import { sendEarnrmFollowUpTask, sendEarnrmRedemption } from "@/lib/server/earnrm";

export class SupporterServiceError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export type ServiceActionResponse = {
  ok: boolean;
  message: string;
  state: SupporterWalletState;
  sessionToken?: string;
};

type SessionResolution = {
  email: string;
  state: SupporterWalletState;
};

function ensureEmail(email: string) {
  const normalized = normalizeSupporterEmail(email);
  if (!normalized || !normalized.includes("@")) {
    throw new SupporterServiceError(400, "Enter a valid supporter email.");
  }
  return normalized;
}

function createFollowUpTask(input: {
  title: string;
  detail: string;
  sourceEvent: "registration" | "top_up" | "redeem";
  dueInHours: number;
  externalSystem?: "internal" | "earnrm";
}): FollowUpTask {
  const createdAt = new Date().toISOString();
  const dueAt = new Date(Date.now() + input.dueInHours * 60 * 60 * 1000).toISOString();

  return {
    id: createEntryId("task"),
    title: input.title,
    detail: input.detail,
    sourceEvent: input.sourceEvent,
    status: "open",
    createdAt,
    dueAt,
    externalSystem: input.externalSystem ?? "internal",
  };
}

function applyAllocationIfNeeded(state: SupporterWalletState, occurredAt: string): SupporterWalletState {
  if (state.allocation.allocationStatus === "recorded") {
    return state;
  }

  const allocationAmount = roundToTwo(state.allocation.allocationAmount);
  const entry: LedgerEntry = {
    id: createEntryId("ledger"),
    occurredAt,
    type: "allocation",
    title: "Recorded UNYT allocation applied",
    note: `${formatCredits(allocationAmount)} applied from ${state.allocation.allocationSource} after supporter identity verification.`,
    status: "completed",
    creditsDelta: allocationAmount,
    usdAmount: allocationAmount,
  };

  return {
    ...state,
    allocation: {
      ...state.allocation,
      allocationStatus: "recorded" as const,
    },
    walletBalances: {
      ...state.walletBalances,
      availableCredits: roundToTwo(state.walletBalances.availableCredits + allocationAmount),
    },
    ledger: [entry, ...state.ledger],
  };
}

function resolveSupporterBySession(
  database: {
    sessionsByToken: Record<string, { email: string }>;
    supportersByEmail: Record<string, SupporterWalletState>;
  },
  sessionToken: string | undefined,
): SessionResolution {
  if (!sessionToken) {
    throw new SupporterServiceError(401, "Sign in required.");
  }

  const session = database.sessionsByToken[sessionToken];
  if (!session) {
    throw new SupporterServiceError(401, "Session expired. Sign in again.");
  }

  const state = database.supportersByEmail[session.email];
  if (!state) {
    throw new SupporterServiceError(401, "Supporter account not found for this session.");
  }

  return {
    email: session.email,
    state,
  };
}

async function markTaskAsEarnrm(email: string, taskId: string) {
  await mutateSupporterDatabase((database) => {
    const supporter = database.supportersByEmail[email];
    if (!supporter) {
      return;
    }

    database.supportersByEmail[email] = {
      ...supporter,
      followUpTasks: supporter.followUpTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              externalSystem: "earnrm",
            }
          : task,
      ),
    };
  });
}

export async function getWalletForSession(sessionToken?: string) {
  if (!sessionToken) {
    return {
      authenticated: false,
      state: cloneSupporterState(),
    };
  }

  const database = await readSupporterDatabase();
  const session = database.sessionsByToken[sessionToken];
  if (!session) {
    return {
      authenticated: false,
      state: cloneSupporterState(),
    };
  }

  const state = database.supportersByEmail[session.email];
  if (!state) {
    return {
      authenticated: false,
      state: cloneSupporterState(),
    };
  }

  return {
    authenticated: true,
    state,
  };
}

export async function registerOrLinkSupporter(input: {
  displayName: string;
  email: string;
}): Promise<ServiceActionResponse> {
  const displayName = input.displayName.trim();
  if (!displayName) {
    throw new SupporterServiceError(400, "Enter a supporter name.");
  }

  const email = ensureEmail(input.email);

  const result = await mutateSupporterDatabase((database) => {
    const existing = database.supportersByEmail[email];
    const now = new Date().toISOString();
    const base = existing ?? cloneSupporterState();
    const wasExisting = Boolean(existing);

    const supporterId =
      base.account.supporterId && base.account.supporterId !== "supporter_pending"
        ? base.account.supporterId
        : createEntryId("supporter");
    const accountId =
      base.account.accountId && base.account.accountId !== "supporter_pending"
        ? base.account.accountId
        : createEntryId("account");
    const walletId =
      base.account.walletId && base.account.walletId !== "wallet_pending"
        ? base.account.walletId
        : createEntryId("wallet");

    let updatedState: SupporterWalletState = {
      ...base,
      account: {
        ...base.account,
        accountId,
        supporterId,
        walletId,
        displayName,
        email,
        authState: "registered",
        authProvider: "Email session",
        createdAt: base.account.createdAt || now,
      },
    };

    const registrationEntry: LedgerEntry = {
      id: createEntryId("ledger"),
      occurredAt: now,
      type: "allocation",
      title: wasExisting ? "Supporter account linked" : "Supporter account created",
      note: wasExisting
        ? "Existing supporter account session restored."
        : "Supporter profile created and linked to wallet account.",
      status: "completed",
      creditsDelta: 0,
      usdAmount: 0,
    };

    updatedState = {
      ...updatedState,
      ledger: [registrationEntry, ...updatedState.ledger],
    };

    updatedState = applyAllocationIfNeeded(updatedState, now);

    const followUpTask = createFollowUpTask({
      title: "Verify supporter profile mapping",
      detail: "Confirm account identity mapping and allocation record sync with EarnRM profile.",
      sourceEvent: "registration",
      dueInHours: 24,
    });

    updatedState = {
      ...updatedState,
      followUpTasks: [followUpTask, ...updatedState.followUpTasks],
    };

    database.supportersByEmail[email] = updatedState;

    const sessionToken = createSessionToken();
    database.sessionsByToken[sessionToken] = {
      email,
      createdAt: now,
      lastSeenAt: now,
    };

    return {
      state: updatedState,
      sessionToken,
      followUpTask,
      wasExisting,
    };
  });

  void (async () => {
    const forwarded = await sendEarnrmFollowUpTask({
      taskId: result.followUpTask.id,
      title: result.followUpTask.title,
      detail: result.followUpTask.detail,
      supporterEmail: result.state.account.email,
      supporterId: result.state.account.supporterId,
      walletId: result.state.account.walletId,
      dueAt: result.followUpTask.dueAt,
      sourceEvent: "registration",
    });

    if (forwarded.ok) {
      await markTaskAsEarnrm(result.state.account.email, result.followUpTask.id);
    }
  })();

  return {
    ok: true,
    message: result.wasExisting
      ? `Signed in and linked supporter account for ${email}.`
      : `Supporter account created and linked for ${email}.`,
    state: result.state,
    sessionToken: result.sessionToken,
  };
}

export async function loginSupporter(input: { email: string }): Promise<ServiceActionResponse> {
  const email = ensureEmail(input.email);

  const result = await mutateSupporterDatabase((database) => {
    const state = database.supportersByEmail[email];
    if (!state || state.account.authState !== "registered") {
      throw new SupporterServiceError(404, "No registered supporter account found for this email.");
    }

    const now = new Date().toISOString();
    const sessionToken = createSessionToken();

    database.sessionsByToken[sessionToken] = {
      email,
      createdAt: now,
      lastSeenAt: now,
    };

    return {
      state,
      sessionToken,
    };
  });

  return {
    ok: true,
    message: `Signed in as ${email}.`,
    state: result.state,
    sessionToken: result.sessionToken,
  };
}

export async function logoutSupporter(sessionToken?: string) {
  if (!sessionToken) {
    return {
      ok: true,
      message: "Session cleared.",
      state: cloneSupporterState(),
    };
  }

  await mutateSupporterDatabase((database) => {
    delete database.sessionsByToken[sessionToken];
  });

  return {
    ok: true,
    message: "Signed out.",
    state: cloneSupporterState(),
  };
}

export async function topUpSupporterBySession(
  sessionToken: string | undefined,
  input: { usdAmount: number; methodId: string },
): Promise<ServiceActionResponse> {
  const result = await mutateSupporterDatabase((database) => {
    const resolved = resolveSupporterBySession(database, sessionToken);
    const amount = roundToTwo(input.usdAmount);

    if (!Number.isFinite(amount)) {
      throw new SupporterServiceError(400, "Enter a valid top-up amount.");
    }

    if (amount < resolved.state.walletLimits.minTopUpUsd || amount > resolved.state.walletLimits.maxTopUpUsd) {
      throw new SupporterServiceError(
        400,
        `Top-up amount must be between ${formatUsd(resolved.state.walletLimits.minTopUpUsd)} and ${formatUsd(resolved.state.walletLimits.maxTopUpUsd)}.`,
      );
    }

    const method = resolved.state.topUpMethods.find((item) => item.id === input.methodId);
    if (!method) {
      throw new SupporterServiceError(400, "Select a valid top-up method.");
    }

    if (method.status !== "live") {
      throw new SupporterServiceError(400, `${method.label} is planned and not live yet.`);
    }

    const credited = roundToTwo(amount * CREDITS_PER_USD);
    const now = new Date().toISOString();

    const topUpEntry: LedgerEntry = {
      id: createEntryId("ledger"),
      occurredAt: now,
      type: "top_up",
      title: "Wallet top-up completed",
      note: `${method.label} top-up recorded for supporter wallet account.`,
      status: "completed",
      creditsDelta: credited,
      usdAmount: amount,
    };

    const followUpTask = createFollowUpTask({
      title: "Review top-up settlement confirmation",
      detail: `Validate settlement reference for ${formatUsd(amount)} top-up on supporter wallet.`,
      sourceEvent: "top_up",
      dueInHours: 6,
    });

    const updatedState: SupporterWalletState = {
      ...resolved.state,
      walletBalances: {
        ...resolved.state.walletBalances,
        availableCredits: roundToTwo(resolved.state.walletBalances.availableCredits + credited),
      },
      ledger: [topUpEntry, ...resolved.state.ledger],
      followUpTasks: [followUpTask, ...resolved.state.followUpTasks],
    };

    database.supportersByEmail[resolved.email] = updatedState;

    return {
      state: updatedState,
      email: resolved.email,
      followUpTask,
      amount,
      credited,
    };
  });

  void (async () => {
    const forwarded = await sendEarnrmFollowUpTask({
      taskId: result.followUpTask.id,
      title: result.followUpTask.title,
      detail: result.followUpTask.detail,
      supporterEmail: result.state.account.email,
      supporterId: result.state.account.supporterId,
      walletId: result.state.account.walletId,
      dueAt: result.followUpTask.dueAt,
      sourceEvent: "top_up",
    });

    if (forwarded.ok) {
      await markTaskAsEarnrm(result.email, result.followUpTask.id);
    }
  })();

  return {
    ok: true,
    message: `${formatUsd(result.amount)} top-up recorded. ${formatCredits(result.credited)} added to wallet balance.`,
    state: result.state,
  };
}

export async function redeemSupporterProductBySession(
  sessionToken: string | undefined,
  input: { productId: string; units: number },
): Promise<ServiceActionResponse> {
  const result = await mutateSupporterDatabase((database) => {
    const resolved = resolveSupporterBySession(database, sessionToken);
    const units = Math.trunc(input.units);

    if (!Number.isFinite(units) || units <= 0) {
      throw new SupporterServiceError(400, "Redeem at least 1 unit.");
    }

    const product = resolved.state.redemptionCatalog.find((item) => item.id === input.productId);
    if (!product) {
      throw new SupporterServiceError(404, "Redemption product not found.");
    }

    if (product.status !== "live") {
      throw new SupporterServiceError(400, `${product.name} is currently listed as planned.`);
    }

    const creditsRequired = roundToTwo(product.unitCredits * units);
    if (creditsRequired > resolved.state.walletBalances.availableCredits) {
      throw new SupporterServiceError(
        400,
        `Insufficient balance. ${formatCredits(creditsRequired)} required.`,
      );
    }

    const now = new Date().toISOString();

    const grant: RedemptionGrant = {
      id: createEntryId("grant"),
      productId: product.id,
      productName: product.name,
      unitName: product.unitName,
      units,
      creditsUsed: creditsRequired,
      redeemedAt: now,
      status: "active",
    };

    const entry: LedgerEntry = {
      id: createEntryId("ledger"),
      occurredAt: now,
      type: "redeem",
      title: `${product.name} redemption`,
      note: `${units} ${product.unitName}${units > 1 ? "s" : ""} issued for supporter account usage rights.`,
      status: "completed",
      creditsDelta: -creditsRequired,
      usdAmount: creditsRequired,
    };

    const followUpTask = createFollowUpTask({
      title: `Provision ${product.name} entitlement`,
      detail: `Confirm delivery of ${units} ${product.unitName}${units > 1 ? "s" : ""} to supporter account.`,
      sourceEvent: "redeem",
      dueInHours: 2,
    });

    const updatedState: SupporterWalletState = {
      ...resolved.state,
      walletBalances: {
        ...resolved.state.walletBalances,
        availableCredits: roundToTwo(resolved.state.walletBalances.availableCredits - creditsRequired),
      },
      redemptions: [grant, ...resolved.state.redemptions],
      ledger: [entry, ...resolved.state.ledger],
      followUpTasks: [followUpTask, ...resolved.state.followUpTasks],
    };

    database.supportersByEmail[resolved.email] = updatedState;

    return {
      state: updatedState,
      email: resolved.email,
      followUpTask,
      grant,
      productId: product.id,
    };
  });

  void (async () => {
    const [taskDispatch, redemptionDispatch] = await Promise.all([
      sendEarnrmFollowUpTask({
        taskId: result.followUpTask.id,
        title: result.followUpTask.title,
        detail: result.followUpTask.detail,
        supporterEmail: result.state.account.email,
        supporterId: result.state.account.supporterId,
        walletId: result.state.account.walletId,
        dueAt: result.followUpTask.dueAt,
        sourceEvent: "redeem",
      }),
      result.productId === "earnrm_user_month"
        ? sendEarnrmRedemption({
            grantId: result.grant.id,
            supporterEmail: result.state.account.email,
            supporterId: result.state.account.supporterId,
            walletId: result.state.account.walletId,
            productId: result.grant.productId,
            units: result.grant.units,
            redeemedAt: result.grant.redeemedAt,
          })
        : Promise.resolve({ attempted: false, ok: false, detail: "Not an EarnRM redemption." }),
    ]);

    if (taskDispatch.ok || redemptionDispatch.ok) {
      await markTaskAsEarnrm(result.email, result.followUpTask.id);
    }
  })();

  return {
    ok: true,
    message: `Redemption completed. ${formatCredits(result.grant.creditsUsed)} deducted from wallet balance.`,
    state: result.state,
  };
}

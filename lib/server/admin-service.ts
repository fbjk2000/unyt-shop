import "server-only";

import { createEntryId, roundToTwo, type LedgerEntry, type SupporterWalletState } from "@/lib/supporter-v1";
import {
  createSessionToken,
  mutateSupporterDatabase,
  normalizeSupporterEmail,
  readSupporterDatabase,
  type AdminAuditLogEntry,
  type AdminRole,
} from "@/lib/server/supporter-store";

export class AdminServiceError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

type AdminSessionResponse = {
  ok: boolean;
  message: string;
  email: string;
  role: AdminRole;
  sessionToken?: string;
};

function configuredAdminPassword() {
  return process.env.SUPERADMIN_PASSWORD || "";
}

function assertConfiguredCredentials() {
  const password = configuredAdminPassword();
  if (!password) {
    throw new AdminServiceError(
      500,
      "SUPERADMIN_PASSWORD is not configured in runtime. Set it in Netlify environment variables and redeploy production.",
    );
  }
}

function splitEmailList(value: string | undefined) {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((entry) => normalizeSupporterEmail(entry))
    .filter(Boolean);
}

function resolveAdminRole(email: string): AdminRole | null {
  const primaryEditor = normalizeSupporterEmail(process.env.SUPERADMIN_EMAIL || "admin@unyt.shop");
  const editorEmails = new Set([
    primaryEditor,
    ...splitEmailList(process.env.SUPERADMIN_EDITOR_EMAILS),
  ]);
  const viewerEmails = new Set(splitEmailList(process.env.SUPERADMIN_VIEWER_EMAILS));

  if (editorEmails.has(email)) {
    return "editor";
  }

  if (viewerEmails.has(email)) {
    return "viewer";
  }

  return null;
}

function configuredMaxBalanceDeltaPerEdit() {
  const raw = Number(process.env.ADMIN_MAX_BALANCE_DELTA || "1000");
  if (!Number.isFinite(raw) || raw <= 0) {
    return 1000;
  }
  return roundToTwo(raw);
}

function appendAuditLog(
  database: {
    adminAuditLogs: AdminAuditLogEntry[];
  },
  entry: Omit<AdminAuditLogEntry, "id" | "occurredAt">,
) {
  database.adminAuditLogs.unshift({
    id: createEntryId("audit"),
    occurredAt: new Date().toISOString(),
    ...entry,
  });

  if (database.adminAuditLogs.length > 5000) {
    database.adminAuditLogs = database.adminAuditLogs.slice(0, 5000);
  }
}

export async function loginSuperadmin(input: {
  email: string;
  password: string;
}): Promise<AdminSessionResponse> {
  assertConfiguredCredentials();

  const email = normalizeSupporterEmail(input.email);
  const password = input.password;

  if (!email || !email.includes("@")) {
    throw new AdminServiceError(400, "Enter a valid admin email.");
  }

  const role = resolveAdminRole(email);
  if (!role || password !== configuredAdminPassword()) {
    throw new AdminServiceError(401, "Invalid superadmin credentials.");
  }

  const now = new Date().toISOString();
  const sessionToken = createSessionToken();

  await mutateSupporterDatabase((database) => {
    database.adminSessionsByToken[sessionToken] = {
      email,
      role,
      createdAt: now,
      lastSeenAt: now,
    };

    appendAuditLog(database, {
      adminEmail: email,
      adminRole: role,
      action: "login",
      targetEmail: null,
      reason: "Admin login",
      details: "Superadmin console session established.",
    });
  });

  return {
    ok: true,
    message: `Signed in as ${role} (${email}).`,
    email,
    role,
    sessionToken,
  };
}

export async function logoutSuperadmin(sessionToken?: string) {
  if (sessionToken) {
    await mutateSupporterDatabase((database) => {
      const session = database.adminSessionsByToken[sessionToken];
      if (session) {
        appendAuditLog(database, {
          adminEmail: session.email,
          adminRole: session.role,
          action: "logout",
          targetEmail: null,
          reason: "Admin logout",
          details: "Superadmin console session closed.",
        });
      }

      delete database.adminSessionsByToken[sessionToken];
    });
  }

  return {
    ok: true,
    message: "Superadmin session closed.",
  };
}

export async function getSuperadminSession(sessionToken?: string) {
  if (!sessionToken) {
    return {
      authenticated: false,
      email: null,
      role: null,
    };
  }

  const database = await readSupporterDatabase();
  const session = database.adminSessionsByToken[sessionToken];
  if (!session) {
    return {
      authenticated: false,
      email: null,
      role: null,
    };
  }

  return {
    authenticated: true,
    email: session.email,
    role: session.role,
  };
}

async function requireSuperadminSession(sessionToken?: string) {
  const session = await getSuperadminSession(sessionToken);
  if (!session.authenticated || !session.email || !session.role) {
    throw new AdminServiceError(401, "Superadmin authentication required.");
  }

  return {
    adminEmail: session.email,
    adminRole: session.role,
  };
}

function requireEditorRole(role: AdminRole) {
  if (role !== "editor") {
    throw new AdminServiceError(403, "Editor role required for wallet updates.");
  }
}

export type WalletAdminRecord = {
  email: string;
  displayName: string;
  supporterId: string;
  walletId: string;
  authState: string;
  availableCredits: number;
  pendingCredits: number;
  allocationAmount: number;
  allocationStatus: string;
  ledgerCount: number;
  followUpTaskCount: number;
  updatedAt: string | null;
};

export async function listSupporterWalletsForAdmin(sessionToken?: string) {
  await requireSuperadminSession(sessionToken);
  const database = await readSupporterDatabase();

  const wallets: WalletAdminRecord[] = Object.entries(database.supportersByEmail)
    .map(([email, state]) => ({
      email,
      displayName: state.account.displayName,
      supporterId: state.account.supporterId,
      walletId: state.account.walletId,
      authState: state.account.authState,
      availableCredits: state.walletBalances.availableCredits,
      pendingCredits: state.walletBalances.pendingCredits,
      allocationAmount: state.allocation.allocationAmount,
      allocationStatus: state.allocation.allocationStatus,
      ledgerCount: state.ledger.length,
      followUpTaskCount: state.followUpTasks.length,
      updatedAt: state.ledger[0]?.occurredAt || null,
    }))
    .sort((a, b) => a.email.localeCompare(b.email));

  return wallets;
}

export async function getWalletByEmailForAdmin(sessionToken: string | undefined, email: string) {
  await requireSuperadminSession(sessionToken);
  const normalizedEmail = normalizeSupporterEmail(email);

  const database = await readSupporterDatabase();
  const state = database.supportersByEmail[normalizedEmail];
  if (!state) {
    throw new AdminServiceError(404, "Wallet not found.");
  }

  return state;
}

export async function updateWalletByEmailForAdmin(
  sessionToken: string | undefined,
  targetEmail: string,
  input: {
    displayName?: string;
    email?: string;
    availableCredits?: number;
    pendingCredits?: number;
    allocationAmount?: number;
    allocationStatus?: "pending_identity" | "recorded";
    reason?: string;
  },
): Promise<SupporterWalletState> {
  const { adminEmail, adminRole } = await requireSuperadminSession(sessionToken);
  requireEditorRole(adminRole);

  const reason = (input.reason || "").trim();
  if (!reason) {
    throw new AdminServiceError(400, "Reason is required for wallet edits.");
  }

  const normalizedTargetEmail = normalizeSupporterEmail(targetEmail);
  if (!normalizedTargetEmail) {
    throw new AdminServiceError(400, "Invalid wallet email.");
  }

  const nextEmailRaw = typeof input.email === "string" ? normalizeSupporterEmail(input.email) : normalizedTargetEmail;
  if (!nextEmailRaw || !nextEmailRaw.includes("@")) {
    throw new AdminServiceError(400, "Updated email must be valid.");
  }

  const maxDeltaPerEdit = configuredMaxBalanceDeltaPerEdit();

  const updatedState = await mutateSupporterDatabase((database) => {
    const existing = database.supportersByEmail[normalizedTargetEmail];
    if (!existing) {
      throw new AdminServiceError(404, "Wallet not found.");
    }

    if (nextEmailRaw !== normalizedTargetEmail && database.supportersByEmail[nextEmailRaw]) {
      throw new AdminServiceError(409, "Another wallet already uses that email.");
    }

    const now = new Date().toISOString();
    const displayName =
      typeof input.displayName === "string" && input.displayName.trim().length > 0
        ? input.displayName.trim()
        : existing.account.displayName;

    const availableCredits =
      typeof input.availableCredits === "number" && Number.isFinite(input.availableCredits)
        ? roundToTwo(input.availableCredits)
        : existing.walletBalances.availableCredits;

    const pendingCredits =
      typeof input.pendingCredits === "number" && Number.isFinite(input.pendingCredits)
        ? roundToTwo(input.pendingCredits)
        : existing.walletBalances.pendingCredits;

    const allocationAmount =
      typeof input.allocationAmount === "number" && Number.isFinite(input.allocationAmount)
        ? roundToTwo(input.allocationAmount)
        : existing.allocation.allocationAmount;

    const allocationStatus = input.allocationStatus || existing.allocation.allocationStatus;

    const deltaAvailable = roundToTwo(availableCredits - existing.walletBalances.availableCredits);
    const deltaPending = roundToTwo(pendingCredits - existing.walletBalances.pendingCredits);

    if (Math.abs(deltaAvailable) > maxDeltaPerEdit || Math.abs(deltaPending) > maxDeltaPerEdit) {
      throw new AdminServiceError(
        400,
        `Balance delta exceeds limit. Maximum absolute delta per edit is ${maxDeltaPerEdit.toFixed(2)} UNYTs for available and pending balances.`,
      );
    }

    const profileChanged =
      displayName !== existing.account.displayName || nextEmailRaw !== normalizedTargetEmail;
    const balancesChanged = deltaAvailable !== 0 || deltaPending !== 0;
    const allocationChanged =
      allocationAmount !== existing.allocation.allocationAmount ||
      allocationStatus !== existing.allocation.allocationStatus;

    if (!profileChanged && !balancesChanged && !allocationChanged) {
      throw new AdminServiceError(400, "No wallet changes detected.");
    }

    const ledgerEntries: LedgerEntry[] = [];
    if (profileChanged) {
      ledgerEntries.push({
        id: createEntryId("ledger"),
        occurredAt: now,
        type: "admin_adjustment",
        title: "Profile updated by admin",
        note: `Admin ${adminEmail} updated supporter profile fields. Reason: ${reason}`,
        status: "completed",
        creditsDelta: 0,
        usdAmount: 0,
      });
    }

    if (balancesChanged) {
      ledgerEntries.push({
        id: createEntryId("ledger"),
        occurredAt: now,
        type: "admin_adjustment",
        title: "Wallet balances adjusted by admin",
        note: `Available delta: ${deltaAvailable.toFixed(2)} UNYTs. Pending delta: ${deltaPending.toFixed(2)} UNYTs. Reason: ${reason}`,
        status: "completed",
        creditsDelta: deltaAvailable,
        usdAmount: deltaAvailable,
      });
    }

    if (allocationChanged) {
      ledgerEntries.push({
        id: createEntryId("ledger"),
        occurredAt: now,
        type: "admin_adjustment",
        title: "Allocation record updated by admin",
        note: `Allocation set to ${allocationAmount.toFixed(2)} UNYTs (${allocationStatus}). Reason: ${reason}`,
        status: "completed",
        creditsDelta: 0,
        usdAmount: 0,
      });
    }

    const nextState: SupporterWalletState = {
      ...existing,
      account: {
        ...existing.account,
        displayName,
        email: nextEmailRaw,
      },
      walletBalances: {
        ...existing.walletBalances,
        availableCredits,
        pendingCredits,
      },
      allocation: {
        ...existing.allocation,
        allocationAmount,
        allocationStatus,
      },
      ledger: [...ledgerEntries, ...existing.ledger],
    };

    delete database.supportersByEmail[normalizedTargetEmail];
    database.supportersByEmail[nextEmailRaw] = nextState;

    if (nextEmailRaw !== normalizedTargetEmail) {
      for (const token of Object.keys(database.sessionsByToken)) {
        const session = database.sessionsByToken[token];
        if (session.email === normalizedTargetEmail) {
          database.sessionsByToken[token] = {
            ...session,
            email: nextEmailRaw,
          };
        }
      }
    }

    appendAuditLog(database, {
      adminEmail,
      adminRole,
      action: "wallet_update",
      targetEmail: nextEmailRaw,
      reason,
      details: `Profile changed: ${profileChanged}. Balances changed: ${balancesChanged}. Allocation changed: ${allocationChanged}. Max delta guardrail: ${maxDeltaPerEdit.toFixed(2)}.`,
    });

    return nextState;
  });

  return updatedState;
}

export async function listAdminAuditLogsForAdmin(sessionToken: string | undefined) {
  await requireSuperadminSession(sessionToken);
  const database = await readSupporterDatabase();
  return database.adminAuditLogs.slice(0, 2000);
}

function csvEscape(value: string) {
  return `"${value.replace(/"/g, "\"\"")}"`;
}

export async function buildAdminAuditCsvForAdmin(sessionToken: string | undefined) {
  const logs = await listAdminAuditLogsForAdmin(sessionToken);
  const header = [
    "occurred_at",
    "admin_email",
    "admin_role",
    "action",
    "target_email",
    "reason",
    "details",
  ];

  const rows = logs.map((entry) =>
    [
      entry.occurredAt,
      entry.adminEmail,
      entry.adminRole,
      entry.action,
      entry.targetEmail || "",
      entry.reason,
      entry.details,
    ]
      .map(csvEscape)
      .join(","),
  );

  return [header.join(","), ...rows].join("\n");
}

export async function getAdminCapabilities(sessionToken: string | undefined) {
  const session = await requireSuperadminSession(sessionToken);
  return {
    adminEmail: session.adminEmail,
    adminRole: session.adminRole,
    maxBalanceDeltaPerEdit: configuredMaxBalanceDeltaPerEdit(),
  };
}

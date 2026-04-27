export const SUPPORTER_V1_STORAGE_KEY = "unyt-shop-supporter-v1";
export const CREDITS_PER_USD = 1;

export type AuthState = "registration_required" | "registered" | "integration_pending";
export type TopUpMethodStatus = "live" | "planned";
export type RedemptionProductStatus = "live" | "planned";
export type LedgerEntryType = "allocation" | "top_up" | "redeem" | "admin_adjustment";
export type LedgerEntryStatus = "completed" | "pending" | "failed";
export type AllocationStatus = "pending_identity" | "recorded";
export type FollowUpTaskStatus = "open" | "completed";

export type AccountProfile = {
  accountId: string;
  supporterId: string;
  walletId: string;
  displayName: string;
  email: string;
  authState: AuthState;
  authProvider: string;
  createdAt: string;
};

export type WalletBalances = {
  availableCredits: number;
  pendingCredits: number;
};

export type WalletLimits = {
  minTopUpUsd: number;
  maxTopUpUsd: number;
};

export type TopUpMethod = {
  id: string;
  label: string;
  detail: string;
  status: TopUpMethodStatus;
};

export type RedemptionProduct = {
  id: string;
  name: string;
  detail: string;
  unitName: string;
  unitCredits: number;
  status: RedemptionProductStatus;
};

export type RedemptionGrant = {
  id: string;
  productId: string;
  productName: string;
  unitName: string;
  units: number;
  creditsUsed: number;
  redeemedAt: string;
  status: "active" | "scheduled";
};

export type LedgerEntry = {
  id: string;
  occurredAt: string;
  type: LedgerEntryType;
  title: string;
  note: string;
  status: LedgerEntryStatus;
  creditsDelta: number;
  usdAmount: number;
};

export type AllocationRecord = {
  allocationAmount: number;
  allocationStatus: AllocationStatus;
  allocationSource: string;
  createdAt: string;
};

export type FollowUpTask = {
  id: string;
  title: string;
  detail: string;
  status: FollowUpTaskStatus;
  sourceEvent: "registration" | "top_up" | "redeem";
  createdAt: string;
  dueAt: string;
  externalSystem: "internal" | "earnrm";
};

export type SupporterWalletState = {
  account: AccountProfile;
  allocation: AllocationRecord;
  walletBalances: WalletBalances;
  walletLimits: WalletLimits;
  topUpMethods: TopUpMethod[];
  redemptionCatalog: RedemptionProduct[];
  redemptions: RedemptionGrant[];
  ledger: LedgerEntry[];
  followUpTasks: FollowUpTask[];
  liveNow: string[];
  previewOnly: string[];
};

export const initialSupporterWalletState: SupporterWalletState = {
  account: {
    accountId: "supporter_pending",
    supporterId: "supporter_pending",
    walletId: "wallet_pending",
    displayName: "No active session",
    email: "Sign in required",
    authState: "registration_required",
    authProvider: "Session not established",
    createdAt: "2026-03-25T00:00:00.000Z",
  },
  allocation: {
    allocationAmount: 1240,
    allocationStatus: "pending_identity",
    allocationSource: "supporter_allocation_migration_2026_q1",
    createdAt: "2026-03-25T00:00:00.000Z",
  },
  walletBalances: {
    availableCredits: 0,
    pendingCredits: 0,
  },
  walletLimits: {
    minTopUpUsd: 25,
    maxTopUpUsd: 5000,
  },
  topUpMethods: [
    {
      id: "card_demo",
      label: "Card checkout",
      detail: "Account-linked top-up flow recorded in wallet activity history.",
      status: "live",
    },
    {
      id: "bank_transfer",
      label: "Bank transfer",
      detail: "Planned after card route hardening and operations readiness.",
      status: "planned",
    },
  ],
  redemptionCatalog: [
    {
      id: "earnrm_user_month",
      name: "EarnRM user-month credit",
      detail: "Redeem UNYTs into one month of supported EarnRM usage rights.",
      unitName: "user-month",
      unitCredits: 120,
      status: "live",
    },
    {
      id: "alakai_service_credit",
      name: "Alakai service credit",
      detail: "Planned supporter redemption route with scoped account billing.",
      unitName: "service credit",
      unitCredits: 250,
      status: "planned",
    },
  ],
  redemptions: [],
  ledger: [],
  followUpTasks: [],
  liveNow: [
    "Supporter account registration, sign-in, and account-linked wallet profile.",
    "Recorded UNYT balance visibility after supporter identity is linked.",
    "Allocation and account actions written to activity history.",
    "Top-up flow and EarnRM redemption for registered supporter accounts.",
  ],
  previewOnly: [
    "Automated payment settlement reconciliation webhooks.",
    "Expanded partner redemption provisioning beyond EarnRM.",
    "Swap execution and advanced multi-chain wallet mechanics.",
  ],
};

const creditsFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const datetimeFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function roundToTwo(value: number) {
  return Math.round(value * 100) / 100;
}

export function formatCreditsValue(value: number) {
  return creditsFormatter.format(value);
}

export function formatCredits(value: number) {
  return `${formatCreditsValue(value)} UNYTs`;
}

export function formatUsd(value: number) {
  return usdFormatter.format(value);
}

export function formatDateTime(isoDate: string) {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }
  return datetimeFormatter.format(date);
}

export function createEntryId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

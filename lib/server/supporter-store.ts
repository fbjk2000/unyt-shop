import "server-only";

import { randomBytes } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { getStore } from "@netlify/blobs";
import {
  initialSupporterWalletState,
  type SupporterWalletState,
} from "@/lib/supporter-v1";

export const SUPPORTER_SESSION_COOKIE = "unyt_supporter_session";
export const SUPERADMIN_SESSION_COOKIE = "unyt_superadmin_session";
export type AdminRole = "viewer" | "editor";

export type SupporterSessionRecord = {
  email: string;
  createdAt: string;
  lastSeenAt: string;
};

export type AdminSessionRecord = {
  email: string;
  role: AdminRole;
  createdAt: string;
  lastSeenAt: string;
};

export type AdminAuditLogEntry = {
  id: string;
  occurredAt: string;
  adminEmail: string;
  adminRole: AdminRole;
  action: "login" | "logout" | "wallet_update" | "transfer_intake" | "transfer_update";
  targetEmail: string | null;
  reason: string;
  details: string;
};

export type TransferRequestStatus =
  | "received"
  | "manual_review"
  | "needs_support"
  | "matched"
  | "ready_for_confirmation"
  | "completed"
  | "rejected";

export type TransferRequestRecord = {
  id: string;
  publicReference: string;
  createdAt: string;
  updatedAt: string;
  supporterEmail: string;
  displayName: string;
  walletAddress: string;
  supportNotes: string;
  status: TransferRequestStatus;
  statusNote: string;
  supporterRecordFound: boolean;
  matchedSupporterId: string | null;
  walletSignatureVerified: boolean;
  walletVerifiedAt: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  adminNotes: string;
};

export type TransferWalletChallengeRecord = {
  id: string;
  createdAt: string;
  expiresAt: string;
  usedAt: string | null;
  supporterEmail: string;
  walletAddress: string;
  message: string;
};

export type SupporterDatabase = {
  supportersByEmail: Record<string, SupporterWalletState>;
  sessionsByToken: Record<string, SupporterSessionRecord>;
  adminSessionsByToken: Record<string, AdminSessionRecord>;
  adminAuditLogs: AdminAuditLogEntry[];
  transferRequestsById: Record<string, TransferRequestRecord>;
  transferWalletChallengesById: Record<string, TransferWalletChallengeRecord>;
};

const DATA_DIR =
  process.env.SUPPORTER_DATA_DIR ||
  (process.env.NODE_ENV === "production"
    ? "/tmp/unyt-shop-data"
    : path.join(process.cwd(), "data"));
const DATA_FILE = path.join(DATA_DIR, "supporter-wallet-db.json");
const BLOB_STORE_NAME = process.env.SUPPORTER_BLOB_STORE || "unyt-shop-supporter-db";
const BLOB_DATABASE_KEY = "supporter-wallet-db.json";

let writeQueue: Promise<unknown> = Promise.resolve();

function shouldUseBlobStorage() {
  if (process.env.SUPPORTER_STORAGE_DRIVER === "file") {
    return false;
  }

  if (process.env.SUPPORTER_STORAGE_DRIVER === "blobs") {
    return true;
  }

  return !process.env.SUPPORTER_DATA_DIR && (process.env.NETLIFY === "true" || Boolean(process.env.NETLIFY_BLOBS_CONTEXT));
}

function cloneInitialState() {
  return JSON.parse(JSON.stringify(initialSupporterWalletState)) as SupporterWalletState;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function normalizeSupporterState(value: unknown): SupporterWalletState | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as Partial<SupporterWalletState> & {
    account?: Partial<SupporterWalletState["account"]>;
    allocation?: Partial<SupporterWalletState["allocation"]>;
  };

  const base = cloneInitialState();

  return {
    ...base,
    ...candidate,
    account: {
      ...base.account,
      ...candidate.account,
      email:
        typeof candidate.account?.email === "string" && candidate.account.email.length > 0
          ? normalizeEmail(candidate.account.email)
          : base.account.email,
      authState:
        candidate.account?.authState === "registered" ||
        candidate.account?.authState === "integration_pending" ||
        candidate.account?.authState === "registration_required"
          ? candidate.account.authState
          : base.account.authState,
    },
    allocation: {
      ...base.allocation,
      ...candidate.allocation,
      allocationStatus:
        candidate.allocation?.allocationStatus === "recorded" ||
        candidate.allocation?.allocationStatus === "pending_identity"
          ? candidate.allocation.allocationStatus
          : base.allocation.allocationStatus,
    },
    walletBalances: {
      ...base.walletBalances,
      ...candidate.walletBalances,
    },
    walletLimits: {
      ...base.walletLimits,
      ...candidate.walletLimits,
    },
    topUpMethods: Array.isArray(candidate.topUpMethods) ? candidate.topUpMethods : base.topUpMethods,
    redemptionCatalog: Array.isArray(candidate.redemptionCatalog)
      ? candidate.redemptionCatalog
      : base.redemptionCatalog,
    redemptions: Array.isArray(candidate.redemptions) ? candidate.redemptions : base.redemptions,
    ledger: Array.isArray(candidate.ledger) ? candidate.ledger : base.ledger,
    followUpTasks: Array.isArray(candidate.followUpTasks) ? candidate.followUpTasks : base.followUpTasks,
    liveNow: Array.isArray(candidate.liveNow) ? candidate.liveNow : base.liveNow,
    previewOnly: Array.isArray(candidate.previewOnly) ? candidate.previewOnly : base.previewOnly,
  };
}

function createEmptyDatabase(): SupporterDatabase {
  return {
    supportersByEmail: {},
    sessionsByToken: {},
    adminSessionsByToken: {},
    adminAuditLogs: [],
    transferRequestsById: {},
    transferWalletChallengesById: {},
  };
}

function normalizeTransferStatus(value: unknown): TransferRequestStatus {
  if (
    value === "received" ||
    value === "manual_review" ||
    value === "needs_support" ||
    value === "matched" ||
    value === "ready_for_confirmation" ||
    value === "completed" ||
    value === "rejected"
  ) {
    return value;
  }

  return "received";
}

function normalizeTransferRequest(value: unknown): TransferRequestRecord | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as Partial<TransferRequestRecord>;
  const id = typeof candidate.id === "string" && candidate.id.length > 0 ? candidate.id : createSessionToken();
  const supporterEmail =
    typeof candidate.supporterEmail === "string" && candidate.supporterEmail.length > 0
      ? normalizeEmail(candidate.supporterEmail)
      : "";
  const walletAddress =
    typeof candidate.walletAddress === "string" && candidate.walletAddress.length > 0
      ? candidate.walletAddress.trim().toLowerCase()
      : "";

  if (!supporterEmail || !walletAddress) {
    return null;
  }

  const now = new Date().toISOString();

  return {
    id,
    publicReference:
      typeof candidate.publicReference === "string" && candidate.publicReference.length > 0
        ? candidate.publicReference
        : `UNYT-TX-${id.slice(0, 8).toUpperCase()}`,
    createdAt:
      typeof candidate.createdAt === "string" && candidate.createdAt.length > 0 ? candidate.createdAt : now,
    updatedAt:
      typeof candidate.updatedAt === "string" && candidate.updatedAt.length > 0 ? candidate.updatedAt : now,
    supporterEmail,
    displayName: typeof candidate.displayName === "string" ? candidate.displayName : "",
    walletAddress,
    supportNotes: typeof candidate.supportNotes === "string" ? candidate.supportNotes : "",
    status: normalizeTransferStatus(candidate.status),
    statusNote: typeof candidate.statusNote === "string" ? candidate.statusNote : "",
    supporterRecordFound: Boolean(candidate.supporterRecordFound),
    matchedSupporterId:
      typeof candidate.matchedSupporterId === "string" && candidate.matchedSupporterId.length > 0
        ? candidate.matchedSupporterId
        : null,
    walletSignatureVerified: Boolean(candidate.walletSignatureVerified),
    walletVerifiedAt:
      typeof candidate.walletVerifiedAt === "string" && candidate.walletVerifiedAt.length > 0
        ? candidate.walletVerifiedAt
        : null,
    reviewedBy:
      typeof candidate.reviewedBy === "string" && candidate.reviewedBy.length > 0
        ? normalizeEmail(candidate.reviewedBy)
        : null,
    reviewedAt:
      typeof candidate.reviewedAt === "string" && candidate.reviewedAt.length > 0
        ? candidate.reviewedAt
        : null,
    adminNotes: typeof candidate.adminNotes === "string" ? candidate.adminNotes : "",
  };
}

function normalizeTransferWalletChallenge(value: unknown): TransferWalletChallengeRecord | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as Partial<TransferWalletChallengeRecord>;
  const id = typeof candidate.id === "string" && candidate.id.length > 0 ? candidate.id : createSessionToken();
  const supporterEmail =
    typeof candidate.supporterEmail === "string" && candidate.supporterEmail.length > 0
      ? normalizeEmail(candidate.supporterEmail)
      : "";
  const walletAddress =
    typeof candidate.walletAddress === "string" && candidate.walletAddress.length > 0
      ? candidate.walletAddress.trim().toLowerCase()
      : "";
  const message = typeof candidate.message === "string" && candidate.message.length > 0 ? candidate.message : "";

  if (!supporterEmail || !walletAddress || !message) {
    return null;
  }

  const now = new Date().toISOString();

  return {
    id,
    supporterEmail,
    walletAddress,
    message,
    createdAt:
      typeof candidate.createdAt === "string" && candidate.createdAt.length > 0 ? candidate.createdAt : now,
    expiresAt:
      typeof candidate.expiresAt === "string" && candidate.expiresAt.length > 0 ? candidate.expiresAt : now,
    usedAt:
      typeof candidate.usedAt === "string" && candidate.usedAt.length > 0 ? candidate.usedAt : null,
  };
}

function normalizeDatabase(value: unknown): SupporterDatabase {
  if (!value || typeof value !== "object") {
    return createEmptyDatabase();
  }

  const candidate = value as {
    supportersByEmail?: Record<string, unknown>;
    sessionsByToken?: Record<string, unknown>;
    adminSessionsByToken?: Record<string, unknown>;
    adminAuditLogs?: unknown;
    transferRequestsById?: Record<string, unknown>;
    transferWalletChallengesById?: Record<string, unknown>;
  };

  const supportersByEmail: Record<string, SupporterWalletState> = {};
  if (candidate.supportersByEmail && typeof candidate.supportersByEmail === "object") {
    for (const [emailKey, supporterValue] of Object.entries(candidate.supportersByEmail)) {
      const normalizedState = normalizeSupporterState(supporterValue);
      if (!normalizedState) {
        continue;
      }

      const normalized = normalizeEmail(normalizedState.account.email || emailKey);
      if (!normalized) {
        continue;
      }

      supportersByEmail[normalized] = {
        ...normalizedState,
        account: {
          ...normalizedState.account,
          email: normalized,
        },
      };
    }
  }

  const sessionsByToken: Record<string, SupporterSessionRecord> = {};
  if (candidate.sessionsByToken && typeof candidate.sessionsByToken === "object") {
    for (const [token, record] of Object.entries(candidate.sessionsByToken)) {
      if (!record || typeof record !== "object") {
        continue;
      }

      const parsed = record as Partial<SupporterSessionRecord>;
      if (typeof parsed.email !== "string" || parsed.email.length === 0) {
        continue;
      }

      const email = normalizeEmail(parsed.email);
      if (!supportersByEmail[email]) {
        continue;
      }

      const now = new Date().toISOString();
      sessionsByToken[token] = {
        email,
        createdAt: typeof parsed.createdAt === "string" && parsed.createdAt.length > 0 ? parsed.createdAt : now,
        lastSeenAt:
          typeof parsed.lastSeenAt === "string" && parsed.lastSeenAt.length > 0 ? parsed.lastSeenAt : now,
      };
    }
  }

  const adminSessionsByToken: Record<string, AdminSessionRecord> = {};
  if (candidate.adminSessionsByToken && typeof candidate.adminSessionsByToken === "object") {
    for (const [token, record] of Object.entries(candidate.adminSessionsByToken)) {
      if (!record || typeof record !== "object") {
        continue;
      }

      const parsed = record as Partial<AdminSessionRecord>;
      if (typeof parsed.email !== "string" || parsed.email.length === 0) {
        continue;
      }

      const now = new Date().toISOString();
      adminSessionsByToken[token] = {
        email: normalizeEmail(parsed.email),
        role: parsed.role === "viewer" ? "viewer" : "editor",
        createdAt: typeof parsed.createdAt === "string" && parsed.createdAt.length > 0 ? parsed.createdAt : now,
        lastSeenAt:
          typeof parsed.lastSeenAt === "string" && parsed.lastSeenAt.length > 0 ? parsed.lastSeenAt : now,
      };
    }
  }

  const adminAuditLogs: AdminAuditLogEntry[] = Array.isArray(candidate.adminAuditLogs)
    ? candidate.adminAuditLogs
        .filter((value): value is Partial<AdminAuditLogEntry> => Boolean(value && typeof value === "object"))
        .map((entry) => ({
          id: typeof entry.id === "string" && entry.id.length > 0 ? entry.id : createSessionToken(),
          occurredAt:
            typeof entry.occurredAt === "string" && entry.occurredAt.length > 0
              ? entry.occurredAt
              : new Date().toISOString(),
          adminEmail:
            typeof entry.adminEmail === "string" && entry.adminEmail.length > 0
              ? normalizeEmail(entry.adminEmail)
              : "unknown@admin",
          adminRole: entry.adminRole === "viewer" ? "viewer" : "editor",
          action:
            entry.action === "login" ||
            entry.action === "logout" ||
            entry.action === "wallet_update" ||
            entry.action === "transfer_intake" ||
            entry.action === "transfer_update"
              ? entry.action
              : "wallet_update",
          targetEmail:
            typeof entry.targetEmail === "string" && entry.targetEmail.length > 0
              ? normalizeEmail(entry.targetEmail)
              : null,
          reason: typeof entry.reason === "string" ? entry.reason : "",
          details: typeof entry.details === "string" ? entry.details : "",
        }))
    : [];

  const transferRequestsById: Record<string, TransferRequestRecord> = {};
  if (candidate.transferRequestsById && typeof candidate.transferRequestsById === "object") {
    for (const [requestId, requestValue] of Object.entries(candidate.transferRequestsById)) {
      const normalizedRequest = normalizeTransferRequest(requestValue);
      if (!normalizedRequest) {
        continue;
      }

      transferRequestsById[normalizedRequest.id || requestId] = normalizedRequest;
    }
  }

  const transferWalletChallengesById: Record<string, TransferWalletChallengeRecord> = {};
  if (candidate.transferWalletChallengesById && typeof candidate.transferWalletChallengesById === "object") {
    for (const [challengeId, challengeValue] of Object.entries(candidate.transferWalletChallengesById)) {
      const normalizedChallenge = normalizeTransferWalletChallenge(challengeValue);
      if (!normalizedChallenge) {
        continue;
      }

      transferWalletChallengesById[normalizedChallenge.id || challengeId] = normalizedChallenge;
    }
  }

  return {
    supportersByEmail,
    sessionsByToken,
    adminSessionsByToken,
    adminAuditLogs,
    transferRequestsById,
    transferWalletChallengesById,
  };
}

async function ensureDataFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify(createEmptyDatabase(), null, 2), "utf8");
  }
}

async function readDatabaseFile(): Promise<SupporterDatabase> {
  await ensureDataFile();

  const raw = await fs.readFile(DATA_FILE, "utf8");
  if (!raw.trim()) {
    return createEmptyDatabase();
  }

  try {
    return normalizeDatabase(JSON.parse(raw) as unknown);
  } catch {
    return createEmptyDatabase();
  }
}

async function writeDatabaseFile(database: SupporterDatabase) {
  await ensureDataFile();
  await fs.writeFile(DATA_FILE, JSON.stringify(database, null, 2), "utf8");
}

async function readDatabaseBlob(): Promise<SupporterDatabase> {
  const store = getStore(BLOB_STORE_NAME);
  const raw = await store.get(BLOB_DATABASE_KEY, { type: "json" });

  if (!raw) {
    return createEmptyDatabase();
  }

  return normalizeDatabase(raw);
}

async function writeDatabaseBlob(database: SupporterDatabase) {
  const store = getStore(BLOB_STORE_NAME);
  await store.setJSON(BLOB_DATABASE_KEY, database, {
    metadata: {
      updatedAt: new Date().toISOString(),
      schema: "supporter-wallet-db-v1",
    },
  });
}

async function readDatabaseStore(): Promise<SupporterDatabase> {
  if (shouldUseBlobStorage()) {
    return readDatabaseBlob();
  }

  return readDatabaseFile();
}

async function writeDatabaseStore(database: SupporterDatabase) {
  if (shouldUseBlobStorage()) {
    await writeDatabaseBlob(database);
    return;
  }

  await writeDatabaseFile(database);
}

export async function readSupporterDatabase() {
  return readDatabaseStore();
}

export async function mutateSupporterDatabase<T>(
  operation: (database: SupporterDatabase) => Promise<T> | T,
): Promise<T> {
  const run = async () => {
    const database = await readDatabaseStore();
    const result = await operation(database);
    await writeDatabaseStore(database);
    return result;
  };

  const chained = writeQueue.then(run, run);
  writeQueue = chained.then(() => undefined, () => undefined);
  return chained;
}

export function createSessionToken() {
  return randomBytes(32).toString("hex");
}

export function cloneSupporterState() {
  return cloneInitialState();
}

export function normalizeSupporterEmail(email: string) {
  return normalizeEmail(email);
}

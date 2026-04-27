import "server-only";

import { verifyMessage } from "ethers";
import { createEntryId } from "@/lib/supporter-v1";
import {
  mutateSupporterDatabase,
  normalizeSupporterEmail,
  readSupporterDatabase,
  type AdminAuditLogEntry,
  type AdminRole,
  type TransferRequestRecord,
  type TransferSourceSupporterRecord,
  type TransferRequestStatus,
} from "@/lib/server/supporter-store";

export class TransferServiceError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export type TransferRequestPublicStatus = Pick<
  TransferRequestRecord,
  | "publicReference"
  | "createdAt"
  | "updatedAt"
  | "supporterEmail"
  | "walletAddress"
  | "status"
  | "statusNote"
  | "supporterRecordFound"
  | "matchedSupporterId"
  | "walletSignatureVerified"
  | "walletVerifiedAt"
>;

const TRANSFER_STATUS_LABELS: Record<TransferRequestStatus, string> = {
  received: "Anfrage empfangen. Die nächsten Schritte werden vorbereitet.",
  manual_review: "Manuelle Prüfung läuft. Bitte warten Sie auf die nächste Supporter-Aktualisierung.",
  needs_support: "Support benötigt zusätzliche Klärung, bevor die Zuordnung bestätigt werden kann.",
  matched: "Supporter-Datensatz und Wallet-Adresse wurden für die weitere Bestätigung vorgemerkt.",
  ready_for_confirmation: "Bereit für die nächste Bestätigungsstufe. Die Ausführung ist noch nicht automatisch live.",
  completed: "Transfer wurde als abgeschlossen markiert.",
  rejected: "Anfrage wurde abgelehnt oder geschlossen. Bitte wenden Sie sich an den Support.",
};

type TransferSupporterImportInput = {
  supporterEmail: string;
  displayName?: string;
  sourceSystem?: string;
  sourceReference?: string;
  allocationAmount?: number | string | null;
  allocationUnit?: string;
  transferEligibility?: "eligible" | "hold" | "blocked";
  currentWalletAddress?: string | null;
  notes?: string;
};

function normalizeWalletAddress(value: string) {
  return value.trim().toLowerCase();
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidEvmAddress(value: string) {
  return /^0x[a-fA-F0-9]{40}$/.test(value);
}

function sanitizeFreeText(value: string, maxLength = 1200) {
  return value.replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function looksLikeSecretMaterial(value: string) {
  const normalized = value.toLowerCase();
  if (
    normalized.includes("private key") ||
    normalized.includes("privater schlüssel") ||
    normalized.includes("privater schluessel") ||
    normalized.includes("recovery phrase") ||
    normalized.includes("seed phrase") ||
    normalized.includes("wiederherstellungsphrase")
  ) {
    return true;
  }

  const plainWords = normalized.match(/\b[a-z]{3,12}\b/g) || [];
  return plainWords.length >= 12 && normalized.length < 220;
}

function createPublicReference() {
  return `UNYT-TX-${createEntryId("ref").replace(/^ref_/, "").slice(0, 8).toUpperCase()}`;
}

function parseOptionalAmount(value: number | string | null | undefined) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value.replace(",", ".").trim());
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function normalizeImportEligibility(value: unknown): "eligible" | "hold" | "blocked" {
  if (value === "hold" || value === "blocked") {
    return value;
  }

  return "eligible";
}

function deriveMatchFields(input: {
  fallbackSupporterId?: string | null;
  sourceRecord?: TransferSourceSupporterRecord | null;
}) {
  return {
    supporterRecordFound: Boolean(input.fallbackSupporterId || input.sourceRecord),
    matchedSupporterId: input.sourceRecord?.id || input.fallbackSupporterId || null,
    sourceSupporterRecordId: input.sourceRecord?.id || null,
    sourceReference: input.sourceRecord?.sourceReference || null,
    allocationAmount: input.sourceRecord?.allocationAmount ?? null,
    allocationUnit: input.sourceRecord?.allocationUnit || null,
    transferEligibility: input.sourceRecord?.transferEligibility || "unknown",
  } satisfies Pick<
    TransferRequestRecord,
    | "supporterRecordFound"
    | "matchedSupporterId"
    | "sourceSupporterRecordId"
    | "sourceReference"
    | "allocationAmount"
    | "allocationUnit"
    | "transferEligibility"
  >;
}

function createWalletProofMessage(input: {
  supporterEmail: string;
  walletAddress: string;
  challengeId: string;
  expiresAt: string;
}) {
  return [
    "UNYT Transfer Wallet Verification",
    "",
    "This signature only proves control of the public wallet address for assisted UNYT transfer review.",
    "It does not execute a transfer, approve spending, or give custody to UNYT.",
    "",
    `Supporter email: ${input.supporterEmail}`,
    `Wallet address: ${input.walletAddress}`,
    `Challenge ID: ${input.challengeId}`,
    `Expires at: ${input.expiresAt}`,
  ].join("\n");
}

function appendTransferAuditLog(
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

async function requireAdminSession(sessionToken?: string) {
  if (!sessionToken) {
    throw new TransferServiceError(401, "Superadmin authentication required.");
  }

  const database = await readSupporterDatabase();
  const session = database.adminSessionsByToken[sessionToken];
  if (!session) {
    throw new TransferServiceError(401, "Superadmin authentication required.");
  }

  return {
    adminEmail: session.email,
    adminRole: session.role,
  };
}

function requireEditor(role: AdminRole) {
  if (role !== "editor") {
    throw new TransferServiceError(403, "Editor role required for transfer updates.");
  }
}

function toPublicStatus(record: TransferRequestRecord): TransferRequestPublicStatus {
  return {
    publicReference: record.publicReference,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    supporterEmail: record.supporterEmail,
    walletAddress: record.walletAddress,
    status: record.status,
    statusNote: record.statusNote || TRANSFER_STATUS_LABELS[record.status],
    supporterRecordFound: record.supporterRecordFound,
    matchedSupporterId: record.matchedSupporterId,
    walletSignatureVerified: record.walletSignatureVerified,
    walletVerifiedAt: record.walletVerifiedAt,
  };
}

export async function createTransferRequest(input: {
  supporterEmail: string;
  displayName?: string;
  walletAddress: string;
  supportNotes?: string;
  consent: boolean;
}) {
  const supporterEmail = normalizeSupporterEmail(input.supporterEmail || "");
  const walletAddress = normalizeWalletAddress(input.walletAddress || "");
  const displayName = sanitizeFreeText(input.displayName || "", 160);
  const supportNotes = sanitizeFreeText(input.supportNotes || "");

  if (!isValidEmail(supporterEmail)) {
    throw new TransferServiceError(400, "Bitte geben Sie eine gültige Supporter-E-Mail-Adresse ein.");
  }

  if (!isValidEvmAddress(walletAddress)) {
    throw new TransferServiceError(400, "Bitte geben Sie eine gültige öffentliche Wallet-Adresse ein.");
  }

  if (!input.consent) {
    throw new TransferServiceError(400, "Bitte bestätigen Sie, dass die Angaben zur Transferprüfung verwendet werden dürfen.");
  }

  if (looksLikeSecretMaterial(supportNotes)) {
    throw new TransferServiceError(
      400,
      "Bitte senden Sie keine Recovery Phrase, keinen privaten Schlüssel und kein Passwort.",
    );
  }

  const record = await mutateSupporterDatabase((database) => {
    const now = new Date().toISOString();
    const existingSupporter = database.supportersByEmail[supporterEmail];
    const sourceRecord = database.transferSourceSupportersByEmail[supporterEmail];
    const matchFields = deriveMatchFields({
      fallbackSupporterId: existingSupporter?.account.supporterId,
      sourceRecord,
    });
    const duplicate = Object.values(database.transferRequestsById).find(
      (request) => request.supporterEmail === supporterEmail && request.walletAddress === walletAddress,
    );

    if (duplicate) {
      const nextDuplicate: TransferRequestRecord = {
        ...duplicate,
        displayName: displayName || duplicate.displayName,
        supportNotes: supportNotes || duplicate.supportNotes,
        updatedAt: now,
        status:
          duplicate.status === "rejected" || duplicate.status === "completed"
            ? duplicate.status
            : matchFields.supporterRecordFound
              ? "manual_review"
              : "needs_support",
        statusNote:
          duplicate.status === "rejected" || duplicate.status === "completed"
            ? duplicate.statusNote
            : matchFields.supporterRecordFound
              ? TRANSFER_STATUS_LABELS.manual_review
              : TRANSFER_STATUS_LABELS.needs_support,
        ...matchFields,
        walletSignatureVerified: duplicate.walletSignatureVerified,
        walletVerifiedAt: duplicate.walletVerifiedAt,
      };
      database.transferRequestsById[duplicate.id] = nextDuplicate;
      return nextDuplicate;
    }

    const id = createEntryId("transfer");
    const nextRecord: TransferRequestRecord = {
      id,
      publicReference: createPublicReference(),
      createdAt: now,
      updatedAt: now,
      supporterEmail,
      displayName,
      walletAddress,
      supportNotes,
      status: matchFields.supporterRecordFound ? "manual_review" : "needs_support",
      statusNote: matchFields.supporterRecordFound ? TRANSFER_STATUS_LABELS.manual_review : TRANSFER_STATUS_LABELS.needs_support,
      ...matchFields,
      walletSignatureVerified: false,
      walletVerifiedAt: null,
      reviewedBy: null,
      reviewedAt: null,
      adminNotes: "",
      preparedAt: null,
      completedAt: null,
      executionNetwork: null,
      tokenContractAddress: null,
      transactionHash: null,
    };

    database.transferRequestsById[id] = nextRecord;
    appendTransferAuditLog(database, {
      adminEmail: "system@unyt.shop",
      adminRole: "viewer",
      action: "transfer_intake",
      targetEmail: supporterEmail,
      reason: "Transfer intake submitted",
      details: `Reference ${nextRecord.publicReference}. Supporter record found: ${nextRecord.supporterRecordFound}.`,
    });

    return nextRecord;
  });

  return toPublicStatus(record);
}

export async function createTransferWalletChallenge(input: {
  supporterEmail: string;
  walletAddress: string;
}) {
  const supporterEmail = normalizeSupporterEmail(input.supporterEmail || "");
  const walletAddress = normalizeWalletAddress(input.walletAddress || "");

  if (!isValidEmail(supporterEmail)) {
    throw new TransferServiceError(400, "Bitte geben Sie eine gültige Supporter-E-Mail-Adresse ein.");
  }

  if (!isValidEvmAddress(walletAddress)) {
    throw new TransferServiceError(400, "Bitte geben Sie eine gültige öffentliche Wallet-Adresse ein.");
  }

  const challenge = await mutateSupporterDatabase((database) => {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 10 * 60 * 1000).toISOString();
    const id = createEntryId("challenge");
    const message = createWalletProofMessage({
      supporterEmail,
      walletAddress,
      challengeId: id,
      expiresAt,
    });

    database.transferWalletChallengesById[id] = {
      id,
      supporterEmail,
      walletAddress,
      message,
      createdAt: now.toISOString(),
      expiresAt,
      usedAt: null,
    };

    return database.transferWalletChallengesById[id];
  });

  return {
    challengeId: challenge.id,
    expiresAt: challenge.expiresAt,
    message: challenge.message,
  };
}

export async function verifyTransferWalletSignature(input: {
  challengeId: string;
  signature: string;
}) {
  const challengeId = sanitizeFreeText(input.challengeId || "", 120);
  const signature = sanitizeFreeText(input.signature || "", 1000);

  if (!challengeId || !signature) {
    throw new TransferServiceError(400, "Challenge und Signatur sind erforderlich.");
  }

  const recoveredAddress = await mutateSupporterDatabase((database) => {
    const challenge = database.transferWalletChallengesById[challengeId];
    if (!challenge) {
      throw new TransferServiceError(404, "Wallet-Challenge wurde nicht gefunden.");
    }
    if (challenge.usedAt) {
      throw new TransferServiceError(400, "Diese Wallet-Challenge wurde bereits verwendet.");
    }
    if (new Date(challenge.expiresAt).getTime() < Date.now()) {
      throw new TransferServiceError(400, "Diese Wallet-Challenge ist abgelaufen.");
    }

    let recovered: string;
    try {
      recovered = verifyMessage(challenge.message, signature).toLowerCase();
    } catch {
      throw new TransferServiceError(400, "Die Wallet-Signatur konnte nicht geprüft werden.");
    }

    if (recovered !== challenge.walletAddress) {
      throw new TransferServiceError(400, "Die Signatur passt nicht zur angegebenen Wallet-Adresse.");
    }

    const now = new Date().toISOString();
    challenge.usedAt = now;
    database.transferWalletChallengesById[challenge.id] = challenge;

    const existingSupporter = database.supportersByEmail[challenge.supporterEmail];
    const sourceRecord = database.transferSourceSupportersByEmail[challenge.supporterEmail];
    const matchFields = deriveMatchFields({
      fallbackSupporterId: existingSupporter?.account.supporterId,
      sourceRecord,
    });
    const existingRequest = Object.values(database.transferRequestsById).find(
      (request) =>
        request.supporterEmail === challenge.supporterEmail &&
        request.walletAddress === challenge.walletAddress,
    );

    if (existingRequest) {
      database.transferRequestsById[existingRequest.id] = {
        ...existingRequest,
        updatedAt: now,
        walletSignatureVerified: true,
        walletVerifiedAt: now,
        status:
          existingRequest.status === "completed" || existingRequest.status === "rejected"
            ? existingRequest.status
            : "manual_review",
        statusNote:
          existingRequest.status === "completed" || existingRequest.status === "rejected"
            ? existingRequest.statusNote
            : "Wallet-Adresse wurde per Signatur bestätigt. Manuelle Zuordnung und Transferfreigabe stehen noch aus.",
        ...matchFields,
      };
    } else {
      const id = createEntryId("transfer");
      database.transferRequestsById[id] = {
        id,
        publicReference: createPublicReference(),
        createdAt: now,
        updatedAt: now,
        supporterEmail: challenge.supporterEmail,
        displayName: "",
        walletAddress: challenge.walletAddress,
        supportNotes: "Wallet-Adresse wurde per MetaMask-Signatur bestätigt.",
        status: "manual_review",
        statusNote:
          "Wallet-Adresse wurde per Signatur bestätigt. Manuelle Zuordnung und Transferfreigabe stehen noch aus.",
        ...matchFields,
        walletSignatureVerified: true,
        walletVerifiedAt: now,
        reviewedBy: null,
        reviewedAt: null,
        adminNotes: "",
        preparedAt: null,
        completedAt: null,
        executionNetwork: null,
        tokenContractAddress: null,
        transactionHash: null,
      };
    }

    appendTransferAuditLog(database, {
      adminEmail: "system@unyt.shop",
      adminRole: "viewer",
      action: "transfer_update",
      targetEmail: challenge.supporterEmail,
      reason: "Wallet signature verified",
      details: `Wallet ${challenge.walletAddress} verified by personal_sign challenge ${challenge.id}.`,
    });

    return recovered;
  });

  const database = await readSupporterDatabase();
  const transfer = Object.values(database.transferRequestsById).find(
    (request) =>
      request.walletAddress === recoveredAddress &&
      database.transferWalletChallengesById[challengeId]?.supporterEmail === request.supporterEmail,
  );

  if (!transfer) {
    throw new TransferServiceError(500, "Wallet wurde bestätigt, aber der Transferstatus konnte nicht geladen werden.");
  }

  return toPublicStatus(transfer);
}

export async function lookupTransferStatus(input: { supporterEmail: string; publicReference: string }) {
  const supporterEmail = normalizeSupporterEmail(input.supporterEmail || "");
  const publicReference = sanitizeFreeText(input.publicReference || "", 80).toUpperCase();

  if (!isValidEmail(supporterEmail) || !publicReference) {
    throw new TransferServiceError(400, "Bitte geben Sie E-Mail-Adresse und Referenznummer ein.");
  }

  const database = await readSupporterDatabase();
  const record = Object.values(database.transferRequestsById).find(
    (request) =>
      request.supporterEmail === supporterEmail && request.publicReference.toUpperCase() === publicReference,
  );

  if (!record) {
    throw new TransferServiceError(404, "Es wurde kein Transferstatus für diese Kombination gefunden.");
  }

  return toPublicStatus(record);
}

export async function listTransferRequestsForAdmin(sessionToken?: string) {
  await requireAdminSession(sessionToken);
  const database = await readSupporterDatabase();

  return Object.values(database.transferRequestsById).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function updateTransferRequestForAdmin(
  sessionToken: string | undefined,
  transferId: string,
  input: {
    status?: TransferRequestStatus;
    statusNote?: string;
    adminNotes?: string;
    executionNetwork?: string;
    tokenContractAddress?: string;
    transactionHash?: string;
  },
) {
  const { adminEmail, adminRole } = await requireAdminSession(sessionToken);
  requireEditor(adminRole);

  const nextStatus = input.status ? (Object.keys(TRANSFER_STATUS_LABELS) as TransferRequestStatus[]).find((status) => status === input.status) : undefined;
  if (input.status && !nextStatus) {
    throw new TransferServiceError(400, "Invalid transfer status.");
  }

  const updated = await mutateSupporterDatabase((database) => {
    const existing = database.transferRequestsById[transferId];
    if (!existing) {
      throw new TransferServiceError(404, "Transfer request not found.");
    }

    const now = new Date().toISOString();
    const transactionHash = sanitizeFreeText(input.transactionHash || existing.transactionHash || "", 160) || null;
    if (nextStatus === "completed" && !transactionHash) {
      throw new TransferServiceError(400, "Transaction hash is required before marking a transfer completed.");
    }

    const nextRecord: TransferRequestRecord = {
      ...existing,
      status: nextStatus || existing.status,
      statusNote: sanitizeFreeText(input.statusNote || "", 600) || (nextStatus ? TRANSFER_STATUS_LABELS[nextStatus] : existing.statusNote),
      adminNotes: sanitizeFreeText(input.adminNotes || "", 1400) || existing.adminNotes,
      executionNetwork: sanitizeFreeText(input.executionNetwork || "", 80) || existing.executionNetwork,
      tokenContractAddress: sanitizeFreeText(input.tokenContractAddress || "", 120) || existing.tokenContractAddress,
      transactionHash,
      preparedAt: nextStatus === "ready_for_confirmation" && !existing.preparedAt ? now : existing.preparedAt,
      completedAt: nextStatus === "completed" && !existing.completedAt ? now : existing.completedAt,
      reviewedBy: adminEmail,
      reviewedAt: now,
      updatedAt: now,
    };

    database.transferRequestsById[transferId] = nextRecord;
    appendTransferAuditLog(database, {
      adminEmail,
      adminRole,
      action: "transfer_update",
      targetEmail: nextRecord.supporterEmail,
      reason: `Transfer ${nextRecord.publicReference} updated`,
      details: `Status: ${existing.status} -> ${nextRecord.status}.`,
    });

    return nextRecord;
  });

  return updated;
}

export async function importTransferSupportersForAdmin(
  sessionToken: string | undefined,
  records: TransferSupporterImportInput[],
) {
  const { adminEmail, adminRole } = await requireAdminSession(sessionToken);
  requireEditor(adminRole);

  if (!Array.isArray(records) || records.length === 0) {
    throw new TransferServiceError(400, "No supporter records supplied.");
  }

  if (records.length > 5000) {
    throw new TransferServiceError(400, "Please import 5000 supporter records or fewer per request.");
  }

  const summary = await mutateSupporterDatabase((database) => {
    const now = new Date().toISOString();
    let imported = 0;
    let updated = 0;
    let skipped = 0;
    const matchedTransferIds = new Set<string>();

    for (const rawRecord of records) {
      const supporterEmail = normalizeSupporterEmail(rawRecord.supporterEmail || "");
      if (!isValidEmail(supporterEmail)) {
        skipped += 1;
        continue;
      }

      const existing = database.transferSourceSupportersByEmail[supporterEmail];
      const sourceRecord: TransferSourceSupporterRecord = {
        id: existing?.id || createEntryId("source"),
        importedAt: existing?.importedAt || now,
        updatedAt: now,
        supporterEmail,
        displayName: sanitizeFreeText(rawRecord.displayName || existing?.displayName || "", 160),
        sourceSystem: sanitizeFreeText(rawRecord.sourceSystem || existing?.sourceSystem || "supporter_export", 80),
        sourceReference: sanitizeFreeText(rawRecord.sourceReference || existing?.sourceReference || "", 160),
        allocationAmount: parseOptionalAmount(rawRecord.allocationAmount) ?? existing?.allocationAmount ?? null,
        allocationUnit: sanitizeFreeText(rawRecord.allocationUnit || existing?.allocationUnit || "UNYT", 24),
        transferEligibility: normalizeImportEligibility(rawRecord.transferEligibility || existing?.transferEligibility),
        currentWalletAddress: rawRecord.currentWalletAddress
          ? normalizeWalletAddress(rawRecord.currentWalletAddress)
          : existing?.currentWalletAddress || null,
        notes: sanitizeFreeText(rawRecord.notes || existing?.notes || "", 1000),
      };

      database.transferSourceSupportersByEmail[supporterEmail] = sourceRecord;
      if (existing) {
        updated += 1;
      } else {
        imported += 1;
      }

      for (const transfer of Object.values(database.transferRequestsById)) {
        if (transfer.supporterEmail !== supporterEmail) {
          continue;
        }

        const matchFields = deriveMatchFields({
          fallbackSupporterId: database.supportersByEmail[supporterEmail]?.account.supporterId,
          sourceRecord,
        });
        database.transferRequestsById[transfer.id] = {
          ...transfer,
          ...matchFields,
          status: transfer.status === "needs_support" ? "manual_review" : transfer.status,
          statusNote:
            transfer.status === "needs_support"
              ? "Supporter-Datensatz wurde importiert. Manuelle Zuordnung und Transferfreigabe stehen noch aus."
              : transfer.statusNote,
          updatedAt: now,
        };
        matchedTransferIds.add(transfer.id);
      }
    }

    appendTransferAuditLog(database, {
      adminEmail,
      adminRole,
      action: "transfer_import",
      targetEmail: null,
      reason: "Transfer supporter records imported",
      details: `Imported ${imported}, updated ${updated}, skipped ${skipped}, matched open transfer requests ${matchedTransferIds.size}.`,
    });

    return {
      imported,
      updated,
      skipped,
      matchedTransferRequests: matchedTransferIds.size,
      totalSourceSupporters: Object.keys(database.transferSourceSupportersByEmail).length,
    };
  });

  return summary;
}

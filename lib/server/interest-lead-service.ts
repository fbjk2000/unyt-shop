import "server-only";

import {
  createInterestLeadId,
  mutateInterestLeadDatabase,
  type InterestFocus,
  type InterestIn,
  type InterestLeadRecord,
  type InterestSourcePage,
} from "@/lib/server/interest-lead-store";
import { sendEarnrmInterestLead } from "@/lib/server/earnrm";

const VALID_SOURCE_PAGES = new Set<InterestSourcePage>(["unytbot.com", "unyt.exchange"]);
const VALID_INTEREST_IN = new Set<InterestIn>(["unytbot", "unyt-exchange", "both"]);
const VALID_INTEREST_FOCUS = new Set<InterestFocus>([
  "early_access",
  "product_updates",
  "commercial_use",
  "partnership",
  "backer_ecosystem",
]);

export class InterestLeadServiceError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function requireText(value: string | undefined, label: string) {
  const normalized = (value || "").trim();
  if (!normalized) {
    throw new InterestLeadServiceError(400, `Enter ${label}.`);
  }
  return normalized;
}

function normalizeEmail(value: string | undefined) {
  const normalized = requireText(value, "a valid email").toLowerCase();
  if (!normalized.includes("@")) {
    throw new InterestLeadServiceError(400, "Enter a valid email.");
  }
  return normalized;
}

function normalizeSourcePage(value: string | undefined): InterestSourcePage {
  if (!value || !VALID_SOURCE_PAGES.has(value as InterestSourcePage)) {
    throw new InterestLeadServiceError(400, "Invalid source page.");
  }
  return value as InterestSourcePage;
}

function normalizeInterestIn(value: string | undefined): InterestIn {
  if (!value || !VALID_INTEREST_IN.has(value as InterestIn)) {
    throw new InterestLeadServiceError(400, "Select what you are interested in.");
  }
  return value as InterestIn;
}

function normalizeInterestFocus(value: unknown): InterestFocus[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new InterestLeadServiceError(400, "Select at least one interest focus.");
  }

  const normalized = value.filter((item): item is InterestFocus => {
    return typeof item === "string" && VALID_INTEREST_FOCUS.has(item as InterestFocus);
  });

  if (normalized.length === 0) {
    throw new InterestLeadServiceError(400, "Select at least one valid interest focus.");
  }

  return Array.from(new Set(normalized));
}

export async function registerInterestLead(input: {
  sourcePage?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  company?: string;
  countryRegion?: string;
  interestIn?: string;
  interestFocus?: unknown;
  message?: string;
}) {
  const sourcePage = normalizeSourcePage(input.sourcePage);
  const firstName = requireText(input.firstName, "first name");
  const lastName = requireText(input.lastName, "last name");
  const email = normalizeEmail(input.email);
  const company = (input.company || "").trim();
  const countryRegion = requireText(input.countryRegion, "country or region");
  const interestIn = normalizeInterestIn(input.interestIn);
  const interestFocus = normalizeInterestFocus(input.interestFocus);
  const message = (input.message || "").trim();
  const createdAt = new Date().toISOString();

  const leadRecord: InterestLeadRecord = {
    id: createInterestLeadId(),
    sourcePage,
    createdAt,
    firstName,
    lastName,
    email,
    company,
    countryRegion,
    interestIn,
    interestFocus,
    message,
  };

  await mutateInterestLeadDatabase((database) => {
    database.leads.unshift(leadRecord);
    database.leads = database.leads.slice(0, 2500);
  });

  const forwarded = await sendEarnrmInterestLead({
    leadId: leadRecord.id,
    sourcePage: leadRecord.sourcePage,
    createdAt: leadRecord.createdAt,
    firstName: leadRecord.firstName,
    lastName: leadRecord.lastName,
    email: leadRecord.email,
    company: leadRecord.company,
    countryRegion: leadRecord.countryRegion,
    interestIn: leadRecord.interestIn,
    interestFocus: leadRecord.interestFocus,
    message: leadRecord.message,
  });

  return {
    ok: true,
    message: "Interest registered. We will follow up with updates.",
    leadId: leadRecord.id,
    createdAt: leadRecord.createdAt,
    forwarded,
  };
}

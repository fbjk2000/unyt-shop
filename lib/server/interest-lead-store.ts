import "server-only";

import { randomBytes } from "crypto";
import { promises as fs } from "fs";
import path from "path";

export type InterestSourcePage = "unytbot.com" | "unyt.exchange";
export type InterestIn = "unytbot" | "unyt-exchange" | "both";
export type InterestFocus =
  | "early_access"
  | "product_updates"
  | "commercial_use"
  | "partnership"
  | "backer_ecosystem";

export type InterestLeadRecord = {
  id: string;
  sourcePage: InterestSourcePage;
  createdAt: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  countryRegion: string;
  interestIn: InterestIn;
  interestFocus: InterestFocus[];
  message: string;
};

type InterestLeadDatabase = {
  leads: InterestLeadRecord[];
};

const DATA_DIR =
  process.env.SUPPORTER_DATA_DIR ||
  (process.env.NODE_ENV === "production"
    ? "/tmp/unyt-shop-data"
    : path.join(process.cwd(), "data"));
const DATA_FILE = path.join(DATA_DIR, "interest-leads-db.json");

let writeQueue: Promise<unknown> = Promise.resolve();

function createEmptyDatabase(): InterestLeadDatabase {
  return {
    leads: [],
  };
}

function normalizeDatabase(value: unknown): InterestLeadDatabase {
  if (!value || typeof value !== "object") {
    return createEmptyDatabase();
  }

  const candidate = value as { leads?: unknown };
  if (!Array.isArray(candidate.leads)) {
    return createEmptyDatabase();
  }

  const leads = candidate.leads.filter((entry): entry is InterestLeadRecord => {
    if (!entry || typeof entry !== "object") {
      return false;
    }
    const record = entry as Partial<InterestLeadRecord>;
    return (
      typeof record.id === "string" &&
      typeof record.sourcePage === "string" &&
      typeof record.createdAt === "string" &&
      typeof record.firstName === "string" &&
      typeof record.lastName === "string" &&
      typeof record.email === "string" &&
      typeof record.company === "string" &&
      typeof record.countryRegion === "string" &&
      typeof record.interestIn === "string" &&
      Array.isArray(record.interestFocus) &&
      typeof record.message === "string"
    );
  });

  return { leads };
}

async function ensureDataFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify(createEmptyDatabase(), null, 2), "utf8");
  }
}

async function readDatabaseFile(): Promise<InterestLeadDatabase> {
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

async function writeDatabaseFile(database: InterestLeadDatabase) {
  await ensureDataFile();
  await fs.writeFile(DATA_FILE, JSON.stringify(database, null, 2), "utf8");
}

export async function mutateInterestLeadDatabase<T>(
  operation: (database: InterestLeadDatabase) => Promise<T> | T,
): Promise<T> {
  const run = async () => {
    const database = await readDatabaseFile();
    const result = await operation(database);
    await writeDatabaseFile(database);
    return result;
  };

  const chained = writeQueue.then(run, run);
  writeQueue = chained.then(() => undefined, () => undefined);
  return chained;
}

export function createInterestLeadId() {
  return randomBytes(16).toString("hex");
}

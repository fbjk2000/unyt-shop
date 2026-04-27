#!/usr/bin/env node

import { promises as fs } from "fs";
import path from "path";

const [, , inputPath, outputPath = "data/transfer-supporters.normalized.json"] = process.argv;

if (!inputPath) {
  console.error("Usage: node scripts/transfer/normalize-supporter-export.mjs <input.csv|input.json> [output.json]");
  process.exit(1);
}

function parseCsv(raw) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < raw.length; index += 1) {
    const char = raw[index];
    const next = raw[index + 1];

    if (quoted && char === '"' && next === '"') {
      field += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      quoted = !quoted;
      continue;
    }

    if (!quoted && char === ",") {
      row.push(field);
      field = "";
      continue;
    }

    if (!quoted && (char === "\n" || char === "\r")) {
      if (char === "\r" && next === "\n") {
        index += 1;
      }
      row.push(field);
      if (row.some((value) => value.trim().length > 0)) {
        rows.push(row);
      }
      row = [];
      field = "";
      continue;
    }

    field += char;
  }

  row.push(field);
  if (row.some((value) => value.trim().length > 0)) {
    rows.push(row);
  }

  const headers = rows.shift()?.map((header) => header.trim()) || [];
  return rows.map((values) =>
    Object.fromEntries(headers.map((header, index) => [header, values[index]?.trim() || ""])),
  );
}

function firstPresent(row, names) {
  for (const name of names) {
    if (row[name] !== undefined && String(row[name]).trim()) {
      return String(row[name]).trim();
    }
  }

  return "";
}

function parseAmount(value) {
  if (!value) {
    return null;
  }

  const parsed = Number(String(value).replace(",", ".").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeEligibility(value) {
  const normalized = String(value || "").trim().toLowerCase();
  if (["hold", "paused", "review", "manual_review"].includes(normalized)) {
    return "hold";
  }
  if (["blocked", "rejected", "ineligible"].includes(normalized)) {
    return "blocked";
  }
  return "eligible";
}

const raw = await fs.readFile(inputPath, "utf8");
const sourceRows = inputPath.toLowerCase().endsWith(".json") ? JSON.parse(raw) : parseCsv(raw);
const rows = Array.isArray(sourceRows) ? sourceRows : sourceRows.records;

if (!Array.isArray(rows)) {
  throw new Error("Input must be a CSV file, a JSON array, or a JSON object with a records array.");
}

const records = rows
  .map((row) => ({
    supporterEmail: firstPresent(row, ["supporterEmail", "email", "Email", "E-Mail", "e-mail"]),
    displayName: firstPresent(row, ["displayName", "name", "Name", "full_name"]),
    sourceSystem: firstPresent(row, ["sourceSystem", "source", "Source"]) || "supporter_export",
    sourceReference: firstPresent(row, ["sourceReference", "reference", "Reference", "id", "ID", "backer_id"]),
    allocationAmount: parseAmount(firstPresent(row, ["allocationAmount", "allocation", "amount", "UNYT", "unyts"])),
    allocationUnit: firstPresent(row, ["allocationUnit", "unit", "Unit"]) || "UNYT",
    transferEligibility: normalizeEligibility(firstPresent(row, ["transferEligibility", "eligibility", "status", "Status"])),
    currentWalletAddress: firstPresent(row, ["currentWalletAddress", "wallet", "walletAddress", "Wallet"]) || null,
    notes: firstPresent(row, ["notes", "Notes", "comment", "Comment"]),
  }))
  .filter((record) => record.supporterEmail);

await fs.mkdir(path.dirname(outputPath), { recursive: true });
await fs.writeFile(outputPath, `${JSON.stringify({ records }, null, 2)}\n`, "utf8");

console.log(`Normalized ${records.length} transfer supporter records -> ${outputPath}`);

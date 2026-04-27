import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const messagesDir = path.join(process.cwd(), "messages");
const baseLocale = "en";

function flattenMessages(input, prefix = "", collector = new Map()) {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    collector.set(prefix, input);
    return collector;
  }

  for (const [key, value] of Object.entries(input)) {
    const nextPrefix = prefix ? `${prefix}.${key}` : key;
    flattenMessages(value, nextPrefix, collector);
  }

  return collector;
}

function extractPlaceholders(value) {
  if (typeof value !== "string") {
    return [];
  }

  const matches = value.match(/\{[a-zA-Z0-9_]+\}/g) || [];
  return [...new Set(matches)].sort();
}

async function readLocaleMessages(localeFile) {
  const locale = localeFile.replace(/\.json$/, "");
  const absolutePath = path.join(messagesDir, localeFile);
  const raw = await readFile(absolutePath, "utf8");

  try {
    return {
      locale,
      messages: JSON.parse(raw),
    };
  } catch (error) {
    throw new Error(`Invalid JSON in ${absolutePath}: ${String(error)}`);
  }
}

async function main() {
  const allFiles = await readdir(messagesDir);
  const localeFiles = allFiles.filter((file) => file.endsWith(".json")).sort();

  if (!localeFiles.includes(`${baseLocale}.json`)) {
    throw new Error(`Base locale file ${baseLocale}.json not found in ${messagesDir}`);
  }

  const localeEntries = await Promise.all(localeFiles.map(readLocaleMessages));
  const base = localeEntries.find((entry) => entry.locale === baseLocale);

  if (!base) {
    throw new Error(`Base locale ${baseLocale} is missing`);
  }

  const baseFlat = flattenMessages(base.messages);
  const issues = [];

  for (const entry of localeEntries) {
    const flat = flattenMessages(entry.messages);

    for (const [key, baseValue] of baseFlat.entries()) {
      if (!flat.has(key)) {
        issues.push(`[${entry.locale}] missing key: ${key}`);
        continue;
      }

      const localizedValue = flat.get(key);
      if (typeof localizedValue !== "string") {
        issues.push(`[${entry.locale}] key is not a string: ${key}`);
        continue;
      }

      if (!localizedValue.trim()) {
        issues.push(`[${entry.locale}] empty value for key: ${key}`);
      }

      if (localizedValue.includes("TODO") || localizedValue.includes("[[")) {
        issues.push(`[${entry.locale}] unresolved marker in key: ${key}`);
      }

      const basePlaceholders = extractPlaceholders(baseValue);
      const localizedPlaceholders = extractPlaceholders(localizedValue);
      if (basePlaceholders.join("|") !== localizedPlaceholders.join("|")) {
        issues.push(
          `[${entry.locale}] placeholder mismatch for ${key} (base: ${basePlaceholders.join(", ")} / locale: ${localizedPlaceholders.join(", ")})`,
        );
      }
    }

    for (const key of flat.keys()) {
      if (!baseFlat.has(key)) {
        issues.push(`[${entry.locale}] extra key not in base locale: ${key}`);
      }
    }
  }

  if (issues.length > 0) {
    console.error("Message validation failed:");
    for (const issue of issues) {
      console.error(`- ${issue}`);
    }
    process.exit(1);
  }

  console.log(
    `Message validation passed for ${localeEntries.length} locale(s): ${localeEntries.map((entry) => entry.locale).join(", ")}`,
  );
}

await main();

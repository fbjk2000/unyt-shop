import { readFile, readdir } from "node:fs/promises";
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

async function loadLocale(locale) {
  const localePath = path.join(messagesDir, `${locale}.json`);
  const raw = await readFile(localePath, "utf8");
  return JSON.parse(raw);
}

function isString(value) {
  return typeof value === "string";
}

async function main() {
  const files = (await readdir(messagesDir))
    .filter((file) => file.endsWith(".json"))
    .map((file) => file.replace(/\.json$/, ""))
    .sort();

  if (!files.includes(baseLocale)) {
    throw new Error(`Base locale "${baseLocale}" is missing in ${messagesDir}`);
  }

  const targets = process.argv.slice(2).length > 0 ? process.argv.slice(2) : files.filter((l) => l !== baseLocale);
  const baseMessages = flattenMessages(await loadLocale(baseLocale));

  for (const locale of targets) {
    if (!files.includes(locale)) {
      console.log(`[${locale}] skipped (locale file not found)`);
      continue;
    }

    const localized = flattenMessages(await loadLocale(locale));
    const unchanged = [];

    for (const [key, baseValue] of baseMessages.entries()) {
      if (!localized.has(key)) {
        continue;
      }

      const localizedValue = localized.get(key);
      if (!isString(baseValue) || !isString(localizedValue)) {
        continue;
      }

      if (baseValue.trim() === localizedValue.trim()) {
        unchanged.push(key);
      }
    }

    console.log(`[${locale}] unchanged strings vs ${baseLocale}: ${unchanged.length}`);
    for (const key of unchanged.slice(0, 60)) {
      console.log(`- ${key}`);
    }
    if (unchanged.length > 60) {
      console.log(`...and ${unchanged.length - 60} more`);
    }
  }
}

await main();

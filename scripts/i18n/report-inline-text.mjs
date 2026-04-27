import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const roots = ["app", "components"];
const textPattern = />\s*([^<>{}\n][^<>{}]*)\s*</g;
const minLength = 4;
const failOnFindings = process.argv.includes("--fail-on-findings");

function isLikelyUiText(value) {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length < minLength) {
    return false;
  }

  if (!/[A-Za-z]/.test(normalized)) {
    return false;
  }

  if (normalized.startsWith("http")) {
    return false;
  }

  if (/[=;()[\]{}]/.test(normalized) || normalized.includes("=>")) {
    return false;
  }

  return true;
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(absolute)));
      continue;
    }

    if (entry.isFile() && absolute.endsWith(".tsx")) {
      files.push(absolute);
    }
  }

  return files;
}

function indexToLine(source, index) {
  return source.slice(0, index).split("\n").length;
}

async function main() {
  const files = (await Promise.all(roots.map((root) => walk(path.join(process.cwd(), root))))).flat();
  const findings = [];

  for (const filePath of files) {
    const source = await readFile(filePath, "utf8");
    for (const match of source.matchAll(textPattern)) {
      const value = match[1]?.trim() || "";
      if (!isLikelyUiText(value)) {
        continue;
      }

      findings.push({
        filePath: path.relative(process.cwd(), filePath),
        line: indexToLine(source, match.index ?? 0),
        value,
      });
    }
  }

  if (findings.length === 0) {
    console.log("No likely inline UI text detected.");
    return;
  }

  console.log(`Found ${findings.length} likely inline UI text occurrence(s):`);
  for (const finding of findings) {
    console.log(`- ${finding.filePath}:${finding.line} :: ${finding.value}`);
  }

  if (failOnFindings) {
    process.exit(1);
  }
}

await main();

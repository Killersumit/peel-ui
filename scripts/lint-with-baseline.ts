import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

interface LintMessage {
  ruleId: string;
  severity: number;
  message: string;
  line: number;
  column: number;
}

interface LintResult {
  filePath: string;
  messages: LintMessage[];
}

interface BaselineEntry {
  filePath: string;
  ruleId: string;
  line?: number;
}

const rootDir = process.cwd();
const baselinePath = path.resolve(rootDir, ".github", "lint-baseline.json");

let baseline: BaselineEntry[] = [];
if (fs.existsSync(baselinePath)) {
  baseline = JSON.parse(fs.readFileSync(baselinePath, "utf-8"));
}

const child = spawnSync("npx", ["eslint", "-f", "json"], {
  encoding: "utf-8",
  maxBuffer: 50 * 1024 * 1024,
});

const stdout = child.stdout || "";
if (!stdout.trim()) {
  if (child.status !== 0) {
    console.error(child.stderr);
    process.exit(child.status ?? 1);
  }
  console.log("No lint issues found.");
  process.exit(0);
}

let results: LintResult[] = [];
try {
  results = JSON.parse(stdout);
} catch (err) {
  console.error("Failed to parse eslint JSON output:", err);
  console.error(stdout);
  process.exit(1);
}

const unexpectedErrors: Array<{
  filePath: string;
  message: LintMessage;
}> = [];

for (const res of results) {
  const relPath = path.relative(rootDir, res.filePath);
  for (const msg of res.messages) {
    const isBaseline = baseline.some(
      (b) =>
        b.filePath === relPath &&
        b.ruleId === msg.ruleId &&
        (b.line === undefined || Math.abs(b.line - msg.line) <= 2)
    );

    if (!isBaseline) {
      unexpectedErrors.push({ filePath: relPath, message: msg });
    }
  }
}

if (unexpectedErrors.length > 0) {
  console.error(`\nFound ${unexpectedErrors.length} unexpected lint issue(s):\n`);
  for (const item of unexpectedErrors) {
    const severityStr = item.message.severity === 2 ? "error" : "warning";
    console.error(
      `${item.filePath}:${item.message.line}:${item.message.column} [${severityStr}] ${item.message.ruleId}: ${item.message.message}`
    );
  }
  process.exit(1);
}

console.log("Lint check passed (known baseline issues ignored).");
process.exit(0);

import { spawnSync } from "node:child_process";

const args = process.argv.slice(2).filter((arg) => arg !== "--");
const componentName = args[0];

if (!componentName) {
  console.error("Error: Component name required.");
  console.error("Usage: npm run test:component -- <name>");
  process.exit(1);
}

const cleanName = componentName
  .replace(/^tests\//, "")
  .replace(/\.test\.(tsx|ts)$/, "");

const targetFile = `tests/${cleanName}.test.tsx`;

const result = spawnSync("npx", ["vitest", "run", targetFile], {
  stdio: "inherit",
  shell: true,
});

process.exit(result.status ?? 0);

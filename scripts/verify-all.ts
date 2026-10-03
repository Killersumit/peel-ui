import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const rootDir = process.cwd();
const registryPath = path.join(rootDir, "registry.json");
const registry = JSON.parse(fs.readFileSync(registryPath, "utf-8"));

console.log(`Verifying all ${registry.items.length} components from registry.json...`);

for (const item of registry.items) {
  console.log(`\n======================================================`);
  console.log(`Verifying component: ${item.name}`);
  console.log(`======================================================`);
  execSync(`npm run verify:component -- ${item.name}`, {
    stdio: "inherit",
    cwd: rootDir,
  });
}

console.log("\nAll registry components verified successfully.");

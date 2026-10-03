import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { execSync } from "node:child_process";
import ts from "typescript";
import { ALL_COMPONENTS } from "../src/config/components-data";
import { REGISTRY_COMPONENTS } from "../src/components/registry/registry-data";
import sitemap from "../src/app/sitemap";

interface CheckResult {
  id: string;
  description: string;
  passed: boolean;
  details?: string;
}

const rootDir = process.cwd();
const cliArgs = process.argv.slice(2).filter((arg) => arg !== "--");
const isQuick = cliArgs.includes("--quick");
const rawTargetName = cliArgs.find((arg) => !arg.startsWith("--"))?.trim();

if (!rawTargetName) {
  console.error("Error: Component name argument required.");
  console.error("Usage: npm run verify:component -- <install-name> [--quick]");
  process.exit(1);
}

const targetName: string = rawTargetName;

const results: CheckResult[] = [];

// ============================================================================
// (a) registry.json entry exists with src/ path and a target
// ============================================================================
function checkRegistryEntry(): CheckResult {
  const registryPath = path.join(rootDir, "registry.json");
  if (!fs.existsSync(registryPath)) {
    return {
      id: "a",
      description: "registry.json entry with src/ path and a target",
      passed: false,
      details: "registry.json file does not exist",
    };
  }

  let registry: { items?: Array<{ name: string; files?: Array<{ path: string; target?: string }> }> };
  try {
    registry = JSON.parse(fs.readFileSync(registryPath, "utf-8"));
  } catch (err: unknown) {
    return {
      id: "a",
      description: "registry.json entry with src/ path and a target",
      passed: false,
      details: `Failed to parse registry.json: ${err instanceof Error ? err.message : String(err)}`,
    };
  }

  const item = registry.items?.find((i) => i.name === targetName);
  if (!item) {
    return {
      id: "a",
      description: "registry.json entry with src/ path and a target",
      passed: false,
      details: `Component "${targetName}" not found in registry.json items`,
    };
  }

  if (!Array.isArray(item.files) || item.files.length === 0) {
    return {
      id: "a",
      description: "registry.json entry with src/ path and a target",
      passed: false,
      details: `Component "${targetName}" has no files listed in registry.json`,
    };
  }

  for (const file of item.files) {
    if (!file.path || !file.path.startsWith("src/")) {
      return {
        id: "a",
        description: "registry.json entry with src/ path and a target",
        passed: false,
        details: `File path does not start with src/: ${file.path}`,
      };
    }
    if (!file.target || typeof file.target !== "string" || file.target.trim().length === 0) {
      return {
        id: "a",
        description: "registry.json entry with src/ path and a target",
        passed: false,
        details: `File missing target attribute: ${file.path}`,
      };
    }
    const resolvedPath = path.resolve(rootDir, file.path);
    if (!fs.existsSync(resolvedPath)) {
      return {
        id: "a",
        description: "registry.json entry with src/ path and a target",
        passed: false,
        details: `Source file does not exist: ${file.path}`,
      };
    }
  }

  return {
    id: "a",
    description: "registry.json entry with src/ path and a target",
    passed: true,
  };
}

// ============================================================================
// (b) registry:build output matches committed public/r/<name>.json (no diff)
//     and index.json lists it
// ============================================================================
function checkRegistryBuildOutput(): CheckResult {
  const publicRPath = path.join(rootDir, "public", "r", `${targetName}.json`);
  const indexPath = path.join(rootDir, "public", "r", "index.json");
  const registryPath = path.join(rootDir, "registry.json");

  if (!fs.existsSync(publicRPath)) {
    return {
      id: "b",
      description: "registry:build output matches committed public/r JSON",
      passed: false,
      details: `File does not exist: public/r/${targetName}.json`,
    };
  }

  if (!fs.existsSync(indexPath)) {
    return {
      id: "b",
      description: "registry:build output matches committed public/r JSON",
      passed: false,
      details: "File does not exist: public/r/index.json",
    };
  }

  // Check index.json lists the item
  try {
    const indexData = JSON.parse(fs.readFileSync(indexPath, "utf-8"));
    const inIndex = indexData.items?.some((i: { name: string }) => i.name === targetName);
    if (!inIndex) {
      return {
        id: "b",
        description: "registry:build output matches committed public/r JSON",
        passed: false,
        details: `Component "${targetName}" is not listed in public/r/index.json`,
      };
    }
  } catch (err: unknown) {
    return {
      id: "b",
      description: "registry:build output matches committed public/r JSON",
      passed: false,
      details: `Failed to parse public/r/index.json: ${err instanceof Error ? err.message : String(err)}`,
    };
  }

  // Check expected registry:build content matches on-disk public/r/<name>.json
  try {
    const registry = JSON.parse(fs.readFileSync(registryPath, "utf-8"));
    const item = registry.items.find((i: { name: string }) => i.name === targetName);
    const itemWithContent = {
      ...item,
      files: item.files.map((file: { path: string }) => ({
        ...file,
        content: fs.readFileSync(path.resolve(rootDir, file.path), "utf-8"),
      })),
    };
    const expected = JSON.stringify(itemWithContent, null, 2);
    const actual = fs.readFileSync(publicRPath, "utf-8");
    if (expected !== actual) {
      return {
        id: "b",
        description: "registry:build output matches committed public/r JSON",
        passed: false,
        details: `public/r/${targetName}.json content differs from registry:build output`,
      };
    }
  } catch (err: unknown) {
    return {
      id: "b",
      description: "registry:build output matches committed public/r JSON",
      passed: false,
      details: `Error computing registry:build output: ${err instanceof Error ? err.message : String(err)}`,
    };
  }

  // Check no uncommitted git diff for public/r/<name>.json
  try {
    const gitStatus = execSync(`git status --porcelain "public/r/${targetName}.json"`, {
      cwd: rootDir,
      encoding: "utf-8",
    }).trim();
    if (gitStatus.length > 0) {
      return {
        id: "b",
        description: "registry:build output matches committed public/r JSON",
        passed: false,
        details: `public/r/${targetName}.json has uncommitted changes: ${gitStatus}`,
      };
    }
  } catch (err: unknown) {
    return {
      id: "b",
      description: "registry:build output matches committed public/r JSON",
      passed: false,
      details: `git status check failed: ${err instanceof Error ? err.message : String(err)}`,
    };
  }

  return {
    id: "b",
    description: "registry:build output matches committed public/r JSON",
    passed: true,
  };
}

// ============================================================================
// (c) entries exist in components-data.ts and registry-data.tsx with the same slug
// ============================================================================
function checkMetadataEntries(): CheckResult {
  const inComponentsData = ALL_COMPONENTS.some((comp) => comp.slug === targetName);
  const inRegistryData = REGISTRY_COMPONENTS.some((comp) => comp.slug === targetName);

  if (!inComponentsData && !inRegistryData) {
    return {
      id: "c",
      description: "entries exist in components-data.ts and registry-data.tsx",
      passed: false,
      details: `Slug "${targetName}" missing from both components-data.ts and registry-data.tsx`,
    };
  }
  if (!inComponentsData) {
    return {
      id: "c",
      description: "entries exist in components-data.ts and registry-data.tsx",
      passed: false,
      details: `Slug "${targetName}" missing from src/config/components-data.ts`,
    };
  }
  if (!inRegistryData) {
    return {
      id: "c",
      description: "entries exist in components-data.ts and registry-data.tsx",
      passed: false,
      details: `Slug "${targetName}" missing from src/components/registry/registry-data.tsx`,
    };
  }

  return {
    id: "c",
    description: "entries exist in components-data.ts and registry-data.tsx",
    passed: true,
  };
}

// ============================================================================
// (d) a demo wrapper exists in src/components/demos/
// ============================================================================
function checkDemoWrapper(): CheckResult {
  const demosDir = path.join(rootDir, "src", "components", "demos");
  if (!fs.existsSync(demosDir)) {
    return {
      id: "d",
      description: "demo wrapper exists in src/components/demos/",
      passed: false,
      details: "src/components/demos/ directory not found",
    };
  }

  const files = fs.readdirSync(demosDir);
  const matched = files.some(
    (file) =>
      file === `${targetName}-demo.tsx` ||
      file === `${targetName}-demo.ts` ||
      file === `${targetName}.tsx` ||
      file === `${targetName}.ts` ||
      file.startsWith(`${targetName}-demo`)
  );

  if (!matched) {
    return {
      id: "d",
      description: "demo wrapper exists in src/components/demos/",
      passed: false,
      details: `No demo wrapper found in src/components/demos/ for "${targetName}"`,
    };
  }

  return {
    id: "d",
    description: "demo wrapper exists in src/components/demos/",
    passed: true,
  };
}

// ============================================================================
// (e) the README table has a row
// ============================================================================
function checkReadmeRow(): CheckResult {
  const readmePath = path.join(rootDir, "README.md");
  if (!fs.existsSync(readmePath)) {
    return {
      id: "e",
      description: "README table has a row",
      passed: false,
      details: "README.md file not found",
    };
  }

  const readme = fs.readFileSync(readmePath, "utf-8");
  const hasRow = readme.split("\n").some((line) => {
    return line.includes("|") && line.includes(`\`${targetName}\``);
  });

  if (!hasRow) {
    return {
      id: "e",
      description: "README table has a row",
      passed: false,
      details: `README.md component table has no row for \`${targetName}\``,
    };
  }

  return {
    id: "e",
    description: "README table has a row",
    passed: true,
  };
}

// ============================================================================
// (f) public/llms.txt and public/llms-full.txt mention the install name
// ============================================================================
function checkLlmsFiles(): CheckResult {
  const llmsPath = path.join(rootDir, "public", "llms.txt");
  const llmsFullPath = path.join(rootDir, "public", "llms-full.txt");

  if (!fs.existsSync(llmsPath)) {
    return {
      id: "f",
      description: "public/llms.txt and llms-full.txt mention install name",
      passed: false,
      details: "public/llms.txt not found",
    };
  }
  if (!fs.existsSync(llmsFullPath)) {
    return {
      id: "f",
      description: "public/llms.txt and llms-full.txt mention install name",
      passed: false,
      details: "public/llms-full.txt not found",
    };
  }

  const llms = fs.readFileSync(llmsPath, "utf-8");
  const llmsFull = fs.readFileSync(llmsFullPath, "utf-8");

  const inLlms = llms.includes(targetName);
  const inLlmsFull = llmsFull.includes(targetName);

  if (!inLlms && !inLlmsFull) {
    return {
      id: "f",
      description: "public/llms.txt and llms-full.txt mention install name",
      passed: false,
      details: `"${targetName}" missing from both public/llms.txt and public/llms-full.txt`,
    };
  }
  if (!inLlms) {
    return {
      id: "f",
      description: "public/llms.txt and llms-full.txt mention install name",
      passed: false,
      details: `"${targetName}" missing from public/llms.txt`,
    };
  }
  if (!inLlmsFull) {
    return {
      id: "f",
      description: "public/llms.txt and llms-full.txt mention install name",
      passed: false,
      details: `"${targetName}" missing from public/llms-full.txt`,
    };
  }

  return {
    id: "f",
    description: "public/llms.txt and llms-full.txt mention install name",
    passed: true,
  };
}

// ============================================================================
// (g) /sitemap.xml output includes /components/<name>
// ============================================================================
function checkSitemap(): CheckResult {
  try {
    const entries = sitemap();
    const hasRoute = entries.some((entry) => {
      const url = typeof entry === "string" ? entry : entry.url;
      return url.endsWith(`/components/${targetName}`) || url.includes(`/components/${targetName}`);
    });

    if (!hasRoute) {
      return {
        id: "g",
        description: "sitemap includes /components/<name>",
        passed: false,
        details: `sitemap output does not include route for /components/${targetName}`,
      };
    }
  } catch (err: unknown) {
    return {
      id: "g",
      description: "sitemap includes /components/<name>",
      passed: false,
      details: `Failed to evaluate sitemap: ${err instanceof Error ? err.message : String(err)}`,
    };
  }

  return {
    id: "g",
    description: "sitemap includes /components/<name>",
    passed: true,
  };
}

// ============================================================================
// (h) every import in the item's files is on registry allowlist (no @/lib/motion or @/config)
// ============================================================================
function checkImportsAllowlist(): CheckResult {
  const registryPath = path.join(rootDir, "registry.json");
  const registry = JSON.parse(fs.readFileSync(registryPath, "utf-8"));
  const item = registry.items?.find((i: { name: string }) => i.name === targetName);
  if (!item) {
    return {
      id: "h",
      description: "all imports on registry allowlist",
      passed: false,
      details: `Component "${targetName}" not found in registry.json`,
    };
  }

  const ALLOWED_PACKAGES = new Set([
    "react",
    "react-dom",
    "motion",
    "gsap",
    "@gsap/react",
    "lucide-react",
  ]);

  const itemFilesNormalized = new Set<string>(
    item.files.map((f: { path: string }) => path.resolve(rootDir, f.path).replace(/\.[^/.]+$/, ""))
  );

  const errors: string[] = [];

  for (const file of item.files) {
    const filePath = path.resolve(rootDir, file.path);
    if (!fs.existsSync(filePath)) continue;

    const code = fs.readFileSync(filePath, "utf-8");
    const sf = ts.createSourceFile(filePath, code, ts.ScriptTarget.Latest, true);

    const visit = (node: ts.Node) => {
      let spec: string | null = null;
      if (ts.isImportDeclaration(node)) {
        if (ts.isStringLiteral(node.moduleSpecifier)) {
          spec = node.moduleSpecifier.text;
        }
      } else if (ts.isExportDeclaration(node) && node.moduleSpecifier) {
        if (ts.isStringLiteral(node.moduleSpecifier)) {
          spec = node.moduleSpecifier.text;
        }
      }

      if (spec) {
        if (spec.startsWith("@/lib/motion") || spec.startsWith("@/config")) {
          errors.push(`${file.path}: banned import "${spec}"`);
        } else if (spec.startsWith("@/")) {
          if (spec !== "@/lib/utils") {
            errors.push(`${file.path}: disallowed site import "${spec}" (only @/lib/utils allowed)`);
          }
        } else if (spec.startsWith(".")) {
          const resolved = path.resolve(path.dirname(filePath), spec).replace(/\.[^/.]+$/, "");
          const isItemFile =
            itemFilesNormalized.has(resolved) ||
            itemFilesNormalized.has(path.join(resolved, "index"));
          if (!isItemFile) {
            errors.push(`${file.path}: relative import outside component bundle "${spec}"`);
          }
        } else {
          const pkg = spec.startsWith("@")
            ? spec.split("/").slice(0, 2).join("/")
            : spec.split("/")[0];
          if (!ALLOWED_PACKAGES.has(pkg)) {
            errors.push(`${file.path}: disallowed package import "${spec}"`);
          }
        }
      }

      ts.forEachChild(node, visit);
    };

    visit(sf);
  }

  if (errors.length > 0) {
    return {
      id: "h",
      description: "all imports on registry allowlist",
      passed: false,
      details: errors.join("; "),
    };
  }

  return {
    id: "h",
    description: "all imports on registry allowlist",
    passed: true,
  };
}

// ============================================================================
// (i) dependencies array matches real npm imports
// ============================================================================
function checkDependenciesMatch(): CheckResult {
  const registryPath = path.join(rootDir, "registry.json");
  const registry = JSON.parse(fs.readFileSync(registryPath, "utf-8"));
  const item = registry.items?.find((i: { name: string }) => i.name === targetName);
  if (!item) {
    return {
      id: "i",
      description: "dependencies array matches real npm imports",
      passed: false,
      details: `Component "${targetName}" not found in registry.json`,
    };
  }

  const detected = new Set<string>();

  for (const file of item.files) {
    const filePath = path.resolve(rootDir, file.path);
    if (!fs.existsSync(filePath)) continue;

    const code = fs.readFileSync(filePath, "utf-8");
    const sf = ts.createSourceFile(filePath, code, ts.ScriptTarget.Latest, true);

    const visit = (node: ts.Node) => {
      let spec: string | null = null;
      if (ts.isImportDeclaration(node)) {
        if (ts.isStringLiteral(node.moduleSpecifier)) {
          spec = node.moduleSpecifier.text;
        }
      } else if (ts.isExportDeclaration(node) && node.moduleSpecifier) {
        if (ts.isStringLiteral(node.moduleSpecifier)) {
          spec = node.moduleSpecifier.text;
        }
      }

      if (spec && !spec.startsWith(".") && !spec.startsWith("@/")) {
        if (!spec.startsWith("react") && !spec.startsWith("react-dom")) {
          let pkg = spec;
          if (spec === "motion/react" || spec.startsWith("motion/")) {
            pkg = "motion";
          } else if (spec.startsWith("gsap/")) {
            pkg = "gsap";
          } else if (spec.startsWith("@")) {
            pkg = spec.split("/").slice(0, 2).join("/");
          } else {
            pkg = spec.split("/")[0];
          }
          detected.add(pkg);
        }
      }

      ts.forEachChild(node, visit);
    };

    visit(sf);
  }

  const declaredDeps = (item.dependencies || []).slice().sort();
  const detectedDeps = Array.from(detected).sort();

  const isMatch =
    declaredDeps.length === detectedDeps.length &&
    declaredDeps.every((dep: string, idx: number) => dep === detectedDeps[idx]);

  if (!isMatch) {
    return {
      id: "i",
      description: "dependencies array matches real npm imports",
      passed: false,
      details: `Declared: [${declaredDeps.join(", ")}], Detected: [${detectedDeps.join(", ")}]`,
    };
  }

  return {
    id: "i",
    description: "dependencies array matches real npm imports",
    passed: true,
  };
}

// ============================================================================
// (j) fresh install: in a CACHED throwaway shadcn app under OS temp dir,
//     run `shadcn add` from local JSON and then `tsc --noEmit`
// ============================================================================
function checkFreshInstall(): CheckResult {
  if (isQuick) {
    return {
      id: "j",
      description: "fresh install in cached throwaway app & tsc --noEmit",
      passed: true,
      details: "Skipped via --quick",
    };
  }

  const cacheAppDir = path.join(os.tmpdir(), "peel-ui-shadcn-verify-app");
  const localJsonPath = path.resolve(rootDir, "public", "r", `${targetName}.json`);

  if (!fs.existsSync(localJsonPath)) {
    return {
      id: "j",
      description: "fresh install in cached throwaway app & tsc --noEmit",
      passed: false,
      details: `Local registry JSON not found: ${localJsonPath}`,
    };
  }

  const nodeModulesDir = path.join(cacheAppDir, "node_modules");
  if (!fs.existsSync(nodeModulesDir)) {
    fs.mkdirSync(cacheAppDir, { recursive: true });

    fs.writeFileSync(
      path.join(cacheAppDir, "package.json"),
      JSON.stringify(
        {
          name: "peel-ui-shadcn-verify-app",
          private: true,
          version: "0.1.0",
          dependencies: {
            clsx: "^2.1.1",
            "tailwind-merge": "^3.0.0",
            motion: "^12.0.0",
            gsap: "^3.12.0",
            "@gsap/react": "^2.1.0",
            "lucide-react": "^1.0.0",
          },
          devDependencies: {
            typescript: "^5.0.0",
            "@types/node": "^20.0.0",
            "@types/react": "^19.0.0",
            "@types/react-dom": "^19.0.0",
            react: "^19.0.0",
            "react-dom": "^19.0.0",
          },
        },
        null,
        2
      ),
      "utf-8"
    );

    fs.writeFileSync(
      path.join(cacheAppDir, "tsconfig.json"),
      JSON.stringify(
        {
          compilerOptions: {
            target: "ES2022",
            lib: ["dom", "dom.iterable", "esnext"],
            allowJs: true,
            skipLibCheck: true,
            strict: true,
            noEmit: true,
            esModuleInterop: true,
            module: "esnext",
            moduleResolution: "bundler",
            resolveJsonModule: true,
            isolatedModules: true,
            jsx: "react-jsx",
            types: ["node"],
            paths: {
              "@/*": ["./*"],
            },
          },
          include: ["**/*.ts", "**/*.tsx"],
        },
        null,
        2
      ),
      "utf-8"
    );

    fs.writeFileSync(
      path.join(cacheAppDir, "components.json"),
      JSON.stringify(
        {
          $schema: "https://ui.shadcn.com/schema.json",
          style: "new-york",
          rsc: true,
          tsx: true,
          tailwind: {
            config: "tailwind.config.js",
            css: "src/app/globals.css",
            baseColor: "neutral",
            cssVariables: true,
          },
          aliases: {
            components: "@/components",
            utils: "@/lib/utils",
            ui: "@/components/ui",
            lib: "@/lib",
            hooks: "@/hooks",
          },
        },
        null,
        2
      ),
      "utf-8"
    );

    fs.mkdirSync(path.join(cacheAppDir, "lib"), { recursive: true });
    fs.writeFileSync(
      path.join(cacheAppDir, "lib", "utils.ts"),
      `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`,
      "utf-8"
    );

    try {
      execSync("npm install", { cwd: cacheAppDir, stdio: "pipe" });
    } catch (err: unknown) {
      const execErr = err as { stderr?: Buffer; message: string };
      return {
        id: "j",
        description: "fresh install in cached throwaway app & tsc --noEmit",
        passed: false,
        details: `Failed to initialize throwaway app: ${execErr.stderr?.toString() || execErr.message}`,
      };
    }
  }

  // Clear previous component files to ensure clean verification
  const componentsDir = path.join(cacheAppDir, "components");
  if (fs.existsSync(componentsDir)) {
    fs.rmSync(componentsDir, { recursive: true, force: true });
  }

  // Ensure lib/utils.ts exists
  const utilsFile = path.join(cacheAppDir, "lib", "utils.ts");
  if (!fs.existsSync(utilsFile)) {
    fs.mkdirSync(path.join(cacheAppDir, "lib"), { recursive: true });
    fs.writeFileSync(
      utilsFile,
      `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`,
      "utf-8"
    );
  }

  // Run shadcn add
  try {
    execSync(`npx --yes shadcn@latest add "${localJsonPath}" -y -o`, {
      cwd: cacheAppDir,
      stdio: "pipe",
    });
  } catch (err: unknown) {
    const execErr = err as { stderr?: Buffer; stdout?: Buffer; message: string };
    return {
      id: "j",
      description: "fresh install in cached throwaway app & tsc --noEmit",
      passed: false,
      details: `shadcn add failed: ${execErr.stderr?.toString() || execErr.stdout?.toString() || execErr.message}`,
    };
  }

  // Run tsc --noEmit
  try {
    execSync("npx tsc --noEmit", {
      cwd: cacheAppDir,
      stdio: "pipe",
    });
  } catch (err: unknown) {
    const execErr = err as { stderr?: Buffer; stdout?: Buffer; message: string };
    return {
      id: "j",
      description: "fresh install in cached throwaway app & tsc --noEmit",
      passed: false,
      details: `tsc --noEmit failed: ${execErr.stdout?.toString() || execErr.stderr?.toString() || execErr.message}`,
    };
  }

  return {
    id: "j",
    description: "fresh install in cached throwaway app & tsc --noEmit",
    passed: true,
  };
}

// ============================================================================
// Run all checks
// ============================================================================
results.push(checkRegistryEntry());
results.push(checkRegistryBuildOutput());
results.push(checkMetadataEntries());
results.push(checkDemoWrapper());
results.push(checkReadmeRow());
results.push(checkLlmsFiles());
results.push(checkSitemap());
results.push(checkImportsAllowlist());
results.push(checkDependenciesMatch());
results.push(checkFreshInstall());

// ============================================================================
// Print PASS/FAIL table
// ============================================================================
console.log(`\nVerification Checklist for "${targetName}":\n`);
console.log("┌───┬────────────────────────────────────────────────────────┬────────┐");
console.log("│ # │ Checklist Item                                         │ Status │");
console.log("├───┼────────────────────────────────────────────────────────┼────────┤");

for (const res of results) {
  const statusStr = res.passed ? " PASS " : " FAIL ";
  const paddedDesc = res.description.padEnd(54, " ").slice(0, 54);
  console.log(`│ ${res.id} │ ${paddedDesc} │ ${statusStr} │`);
}

console.log("└───┴────────────────────────────────────────────────────────┴────────┘\n");

const failures = results.filter((r) => !r.passed);

if (failures.length > 0) {
  console.error("FAILURES DETECTED:");
  for (const fail of failures) {
    console.error(`- [${fail.id}] ${fail.description}: ${fail.details}`);
  }
  console.error(`\nChecklist failed with ${failures.length} issue(s).\n`);
  process.exit(1);
} else {
  console.log(`All ${results.length} checks PASSED for "${targetName}".\n`);
  process.exit(0);
}

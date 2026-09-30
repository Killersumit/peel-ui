import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";

interface RegistryItemFile {
  path: string;
  type: string;
  target?: string;
  content?: string;
}

interface RegistryItem {
  name: string;
  type: string;
  title: string;
  description: string;
  dependencies?: string[];
  devDependencies?: string[];
  registryDependencies?: string[];
  files: RegistryItemFile[];
}

interface Registry {
  [key: string]: unknown;
  items: RegistryItem[];
}

const rootDir = process.cwd();
const registryPath = path.join(rootDir, "registry.json");
const publicRDir = path.join(rootDir, "public", "r");

if (!existsSync(registryPath)) {
  throw new Error(`Registry manifest not found: ${registryPath}`);
}

mkdirSync(publicRDir, { recursive: true });

const registry = JSON.parse(
  readFileSync(registryPath, "utf-8")
) as Registry;

if (!Array.isArray(registry.items)) {
  throw new Error("registry.json must include an items array.");
}

for (const item of registry.items) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.name)) {
    throw new Error(`Invalid registry item name: ${item.name}`);
  }

  const itemWithContent: RegistryItem = {
    ...item,
    files: item.files.map((file) => {
      const sourcePath = path.resolve(rootDir, file.path);
      const sourceRelativePath = path.relative(rootDir, sourcePath);
      if (
        sourceRelativePath === ".." ||
        sourceRelativePath.startsWith(`..${path.sep}`) ||
        path.isAbsolute(sourceRelativePath)
      ) {
        throw new Error(`Registry file path escapes the project: ${file.path}`);
      }

      const candidates = [
        sourcePath,
        path.resolve(rootDir, "src", file.path),
      ];
      const resolvedSource = candidates.find((candidate) =>
        existsSync(candidate)
      );

      if (!resolvedSource) {
        throw new Error(
          `Source file not found for ${item.name}: ${file.path}`
        );
      }

      const content = readFileSync(resolvedSource, "utf-8");
      if (content.trim().length === 0) {
        throw new Error(
          `Source file is empty for ${item.name}: ${resolvedSource}`
        );
      }

      return {
        ...file,
        content,
      };
    }),
  };

  const outputPath = path.join(publicRDir, `${item.name}.json`);
  writeFileSync(outputPath, JSON.stringify(itemWithContent, null, 2), "utf-8");
  console.log(`Generated: public/r/${item.name}.json`);
}

writeFileSync(
  path.join(publicRDir, "index.json"),
  JSON.stringify(registry, null, 2),
  "utf-8"
);
console.log("Registry build complete.");

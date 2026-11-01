import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const registryIndexPath = path.join(rootDir, "src", "registry", "index.ts");
const publicRDir = path.join(rootDir, "public", "r");
const publicDir = path.join(rootDir, "public");

if (!fs.existsSync(publicRDir)) {
  fs.mkdirSync(publicRDir, { recursive: true });
}

const content = fs.readFileSync(registryIndexPath, "utf8");

// Parse items from REGISTRY_ITEMS
const items = [];
const itemBlocks = content.split(/\{\s*slug:\s*"/).slice(1);

for (const block of itemBlocks) {
  const slug = block.slice(0, block.indexOf('"'));
  const titleMatch = block.match(/title:\s*"([^"]+)"/);
  const leadPitchMatch = block.match(/leadPitch:\s*"(?:\\"|[^"])+"/);
  const depsMatch = block.match(/dependencies:\s*\[([\s\S]*?)\]/);
  const filePathMatch = block.match(/filePath:\s*"([^"]+)"/);

  let deps = [];
  if (depsMatch && depsMatch[1].trim()) {
    deps = depsMatch[1]
      .split(",")
      .map((d) => d.trim().replace(/^["'\s]+|["'\s]+$/g, ""))
      .filter(Boolean);
  }

  let description = "";
  if (leadPitchMatch) {
    description = leadPitchMatch[0]
      .replace(/^leadPitch:\s*"/, "")
      .replace(/"$/, "")
      .replace(/\\"/g, '"')
      .replace(/\s+/g, " ")
      .trim();
  }

  const filePath = filePathMatch
    ? filePathMatch[1]
    : `src/registry/primitives/${slug}.tsx`;

  items.push({
    slug,
    title: titleMatch ? titleMatch[1] : slug,
    description,
    dependencies: deps,
    filePath,
  });
}

console.log(`[build-registry] Found ${items.length} registry components.`);

const registryItemsManifest = [];

for (const item of items) {
  const fullFilePath = path.join(rootDir, item.filePath);
  if (!fs.existsSync(fullFilePath)) {
    console.error(`[build-registry] ERROR: Source file not found for ${item.slug}: ${fullFilePath}`);
    continue;
  }

  const targetPath = `components/ui/${item.slug}.tsx`;
  const filesList = [];
  const manifestFilesList = [];

  // Main entry file
  const sourceCode = fs.readFileSync(fullFilePath, "utf8");
  filesList.push({
    path: targetPath,
    content: sourceCode,
    type: "registry:ui",
    target: targetPath,
  });
  manifestFilesList.push({
    path: targetPath,
    type: "registry:ui",
    target: targetPath,
  });

  // Check for multi-file component directory (e.g., note-button/)
  const subDirPath = path.join(path.dirname(fullFilePath), item.slug);
  if (fs.existsSync(subDirPath) && fs.statSync(subDirPath).isDirectory()) {
    const subFiles = fs.readdirSync(subDirPath);
    for (const subFile of subFiles) {
      const fullSubPath = path.join(subDirPath, subFile);
      if (fs.statSync(fullSubPath).isFile()) {
        const subContent = fs.readFileSync(fullSubPath, "utf8");
        const subTargetPath = `components/ui/${item.slug}/${subFile}`;
        filesList.push({
          path: subTargetPath,
          content: subContent,
          type: "registry:ui",
          target: subTargetPath,
        });
        manifestFilesList.push({
          path: subTargetPath,
          type: "registry:ui",
          target: subTargetPath,
        });
      }
    }
  }

  // 1. Generate individual public/r/<slug>.json
  const registryItemPayload = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: item.slug,
    type: "registry:ui",
    title: item.title,
    description: item.description,
    dependencies: item.dependencies,
    registryDependencies: [],
    files: filesList,
  };

  const itemJsonPath = path.join(publicRDir, `${item.slug}.json`);
  fs.writeFileSync(
    itemJsonPath,
    JSON.stringify(registryItemPayload, null, 2) + "\n"
  );

  // 2. Add entry to master registry index
  registryItemsManifest.push({
    name: item.slug,
    type: "registry:ui",
    title: item.title,
    description: item.description,
    dependencies: item.dependencies,
    registryDependencies: [],
    files: manifestFilesList,
  });
}

// 3. Generate master public/r/registry.json & public/registry.json
const masterRegistry = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "peel-ui",
  homepage: "https://peel-ui.vercel.app",
  items: registryItemsManifest,
};

const masterRPath = path.join(publicRDir, "registry.json");
const masterRootPath = path.join(publicDir, "registry.json");
const rootRegistryPath = path.join(rootDir, "registry.json");

fs.writeFileSync(masterRPath, JSON.stringify(masterRegistry, null, 2) + "\n");
fs.writeFileSync(masterRootPath, JSON.stringify(masterRegistry, null, 2) + "\n");
fs.writeFileSync(rootRegistryPath, JSON.stringify(masterRegistry, null, 2) + "\n");

// 4. Generate public/sitemap.xml
const sitemapEntries = [
  { loc: "https://peel-ui.vercel.app/", changefreq: "weekly", priority: "1.0" },
  { loc: "https://peel-ui.vercel.app/components", changefreq: "daily", priority: "0.9" },
  { loc: "https://peel-ui.vercel.app/sponsors", changefreq: "weekly", priority: "0.8" },
  { loc: "https://peel-ui.vercel.app/privacy", changefreq: "monthly", priority: "0.5" },
  { loc: "https://peel-ui.vercel.app/terms", changefreq: "monthly", priority: "0.5" },
  { loc: "https://peel-ui.vercel.app/refund", changefreq: "monthly", priority: "0.5" },
  ...items.map((it) => ({
    loc: `https://peel-ui.vercel.app/components/${it.slug}`,
    changefreq: "weekly",
    priority: "0.85",
  })),
];

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Core Pages -->
${sitemapEntries
  .slice(0, 6)
  .map(
    (e) => `  <url>
    <loc>${e.loc}</loc>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`
  )
  .join("\n")}

  <!-- Component Primitives -->
${sitemapEntries
  .slice(6)
  .map(
    (e) => `  <url>
    <loc>${e.loc}</loc>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

const sitemapPath = path.join(publicDir, "sitemap.xml");
fs.writeFileSync(sitemapPath, sitemapXml);

console.log(
  `[build-registry] Successfully generated ${registryItemsManifest.length} item payloads in public/r/, master registry.json, and sitemap.xml!`
);

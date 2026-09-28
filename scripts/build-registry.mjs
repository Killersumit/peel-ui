import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const publicRDir = path.join(rootDir, "public", "r");

if (!fs.existsSync(publicRDir)) {
  fs.mkdirSync(publicRDir, { recursive: true });
}

const registryPath = path.join(rootDir, "registry.json");
const registryData = JSON.parse(fs.readFileSync(registryPath, "utf-8"));

for (const item of registryData.items) {
  const itemJson = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: item.name,
    type: item.type,
    title: item.title,
    description: item.description,
    dependencies: item.dependencies || [],
    registryDependencies: item.registryDependencies || [],
    files: item.files.map((file) => {
      // Look for the source file in components/ or src/components/
      let filePath = path.join(rootDir, file.path);
      if (!fs.existsSync(filePath)) {
        filePath = path.join(rootDir, "src", file.path);
      }
      const content = fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf-8") : "";

      return {
        path: file.path,
        content: content,
        type: file.type || "registry:ui",
        target: file.target || file.path,
      };
    }),
  };

  const outputPath = path.join(publicRDir, `${item.name}.json`);
  fs.writeFileSync(outputPath, JSON.stringify(itemJson, null, 2), "utf-8");
  console.log(`Generated: ${outputPath}`);
}

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const outDir = path.join(rootDir, ".lighthouseci");
fs.mkdirSync(outDir, { recursive: true });

const slug = process.env.COMPONENT_SLUG || "skeleton-handoff";
const urls = [
  "http://localhost:3000/",
  "http://localhost:3000/components",
  `http://localhost:3000/components/${slug}`,
];

interface RunResult {
  url: string;
  runIndex: number;
  performanceScore: number;
  reportPath: string;
}

async function run() {
  console.log("Starting Lighthouse mobile audit (5 runs per URL)...");
  const allResults: Record<string, RunResult[]> = {};

  for (const url of urls) {
    allResults[url] = [];
    console.log(`\nAuditing URL: ${url}`);

    for (let i = 1; i <= 5; i++) {
      console.log(`  Run ${i}/5...`);
      const safeName = url.replace(/[^a-z0-9]/gi, "_").toLowerCase();
      const reportPath = path.join(outDir, `${safeName}_run_${i}.json`);

      const lhArgs = [
        "lighthouse",
        url,
        "--output=json",
        `--output-path=${reportPath}`,
        "--chrome-flags=--headless --no-sandbox --disable-dev-shm-usage",
        "--form-factor=mobile",
        "--screenEmulation.mobile=true",
        "--only-categories=performance,accessibility,best-practices,seo",
      ];

      const res = spawnSync("npx", lhArgs, {
        stdio: "pipe",
        encoding: "utf-8",
      });

      if (!fs.existsSync(reportPath)) {
        console.error(`  Run ${i} failed:`, res.stderr);
        continue;
      }

      const report = JSON.parse(fs.readFileSync(reportPath, "utf-8"));
      const score = (report.categories?.performance?.score ?? 0) * 100;
      console.log(`  Run ${i} performance score: ${score}`);

      allResults[url].push({
        url,
        runIndex: i,
        performanceScore: score,
        reportPath,
      });
    }
  }

  const summary: Record<string, unknown> = {};

  for (const [url, runs] of Object.entries(allResults)) {
    if (runs.length === 0) continue;
    runs.sort((a, b) => a.performanceScore - b.performanceScore);
    const medianIndex = Math.floor(runs.length / 2);
    const medianRun = runs[medianIndex];

    const safeName = url.replace(/[^a-z0-9]/gi, "_").toLowerCase();
    const medianDestPath = path.join(outDir, `${safeName}_median.json`);
    fs.copyFileSync(medianRun.reportPath, medianDestPath);

    summary[url] = {
      medianPerformanceScore: medianRun.performanceScore,
      allScores: runs.map((r) => r.performanceScore),
      medianReportFile: `${safeName}_median.json`,
    };
  }

  fs.writeFileSync(
    path.join(outDir, "median-summary.json"),
    JSON.stringify(summary, null, 2),
    "utf-8"
  );

  console.log("\nLighthouse 5-run median results summary:");
  console.log(JSON.stringify(summary, null, 2));
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

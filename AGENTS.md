# AGENTS.md — Peel UI v0.2.0 Architecture & Micro-Step Execution Spec (Vite + React + Oxlint)

> **Project:** Peel UI (`v0.2.0` — Complete Website & Registry Redesign)
> **Creator & Maintainer:** Sumit Singh (`@killersumit`)
> **Repository:** `https://github.com/killersumit/peel-ui`
> **Production URL:** `https://peel-ui.vercel.app`
> **Stack:** Vite + React + TypeScript + Tailwind CSS v4 + `motion/react` + `@phosphor-icons/react` + `oxlint`

---

## 1. GOLDEN EXECUTION RULE: STRICT MICRO-STEPS ONLY

You are operating as a **Staff Design Engineer**. To prevent context bloat, regressions, and "AI UI Slop," you **MUST** obey the **Micro-Step Execution Protocol**:
1. **Never Bulk-Generate Multiple Pages at Once:** Only write or modify the exact file(s) requested by the user in the current prompt. Leave all other placeholder files untouched until asked.
2. **Read the 3 Root Specs Before Every Turn:**
   - `AGENTS.md` (This file: Vite architecture, file map, registry/SEO build script, and `oxlint` workflow)
   - `RULES.md` (Anti-Slop kill list, Optical Vision math, $\zeta$ Damping Ratio law, and 120fps GPU rules)
   - `DESIGN.md` (Folded Ribbon v2 perceptual tokens, Fibonacci spacing, Concentric Squircles, and bevel/well CSS)
3. **Inspect Existing Placeholder Files First:** All files in the tree below already exist on disk as empty (`0 byte`) or default Vite files. Always read a target file before writing to it.
4. **Zero-Warning `oxlint` Gate:** After editing any `.ts` or `.tsx` file, run `npx oxlint src scripts` to guarantee zero unused variables, broken imports, or type/lint errors.
5. **`src/registry/primitives/**` IS SACRED AND READ-ONLY:** Never run color replacements, border removals, or theme modifications inside `src/registry/primitives/**`. Every primitive's built-in `Light`/`Dark` theme toggles and color options (`Acid Lime`, `Ink`, `Coral`, `Teal`, etc.) must remain 100% untouched.

---

## 2. LOCKED TECH STACK & SCRIPTS

Do **NOT** install unrequested UI kits, ESLint bloat, or extra icon libraries:
* **Bundler & Runtime:** Vite + React 19 + TypeScript + `react-router-dom`
* **Styling:** Tailwind CSS (`@tailwindcss/vite`) + CSS Custom Properties in `src/index.css`
* **Physics Engine:** `motion/react` (strictly compositor-bound `transform` & `opacity` + `useMotionValue` / `useSpring`)
* **Icons:** `@phosphor-icons/react` exclusively (`weight="regular" | "bold" | "fill"`). Never use `lucide-react` or sparkle icons.
* **Syntax Highlighting:** `prism-react-renderer` (single-accent shade derivation in `CodeInspector.tsx`)
* **Linter:** `oxlint` (`npx oxlint src scripts --deny-warnings`)

Recommended `package.json` scripts:
```json
{
  "scripts": {
    "dev": "vite",
    "build:registry": "tsx scripts/build-registry.ts",
    "build": "tsx scripts/build-registry.ts && tsc -b && vite build",
    "lint": "oxlint src scripts --deny-warnings",
    "preview": "vite preview"
  }
}
```

---

## 3. PROJECT FILE TREE & OWNERSHIP MAP

```text
peel-ui/
├── AGENTS.md                                  # [SPEC] Vite architecture, schemas, SEO/LLM generator & micro-step rules
├── RULES.md                                   # [SPEC] Anti-Slop, Optical Vision Math, Damping Ratio & 120fps GPU rules
├── DESIGN.md                                  # [SPEC] Folded Ribbon v2 tokens, Fibonacci scale, Squircles & bevels
├── components.json                            # [CONFIG] Shadcn CLI compatibility config
├── registry.json                              # [GENERATED] Root shadcn registry manifest
├── package.json
├── tsconfig.json
├── vite.config.ts                             # [CONFIG] Vite + React + @tailwindcss/vite + @/* path alias
├── scripts/
│   └── build-registry.ts                      # [SCRIPT] Builds public/r/*.json, sitemap.xml, robots.txt & llms*.txt
├── public/
│   ├── robots.txt                             # [GENERATED] Allows Googlebot, GPTBot, ClaudeBot, PerplexityBot
│   ├── sitemap.xml                            # [GENERATED] Full XML sitemap for /, /components, /components/:slug
│   ├── llms.txt                               # [GENERATED] Concise AI agent directory & CLI install commands
│   ├── llms-full.txt                          # [GENERATED] Full component docs, props & source code for LLMs
│   └── r/
│       ├── registry.json                      # [GENERATED] Public index of all Peel UI components
│       └── [slug].json                        # [GENERATED] Individual `npx shadcn@latest add` JSON payloads
└── src/
    ├── main.tsx                               # [ENTRY] Mounts React root + BrowserRouter
    ├── App.tsx                                # [ROUTER] Routes: "/" -> HomePage, "/components" -> CatalogPage, "/components/:slug" -> WorkspacePage
    ├── index.css                              # [STYLES] @import "tailwindcss"; --peel-* variables, bevel-machined, well-recessed
    ├── pages/
    │   ├── HomePage.tsx                       # [PAGE] Atmospheric Hero + Selected Showcase + Footer
    │   ├── CatalogPage.tsx                    # [PAGE] Categorized 3-Col Component Index Grid (/components)
    │   └── WorkspacePage.tsx                  # [PAGE] Full-Viewport Component Workspace (/components/:slug)
    ├── components/
    │   ├── layout/
    │   │   ├── Navbar.tsx                     # [UI] 3-Island tactile floating top bar (Brand | Nav | GitHub Icon)
    │   │   └── Footer.tsx                     # [UI] Monumental Swiss display footer
    │   ├── catalog/
    │   │   ├── CategoryRow.tsx                # [UI] Quiet category header + count badge + 3-col grid
    │   │   └── ComponentPreviewCard.tsx       # [UI] Squircle preview card (80% open stage + Title + ↗ arrow)
    │   └── workspace/
    │       ├── WorkspaceShell.tsx             # [STATE] Orchestrates Sidebar, Stage, SpecSplit & CodeDrawer
    │       ├── WorkspaceSidebar.tsx           # [UI] Collapsible left tree nav with curved dotted L-connector
    │       ├── WorkspaceToolbar.tsx           # [UI] Top-right floating pill (Morphing CLI Install + Split + </> + Theme)
    │       ├── ComponentStage.tsx             # [UI] Main squircle interactive canvas + bottom swatch/replay dock
    │       ├── SpecPanel.tsx                  # [UI] Golden Ratio right-side spec sheet (Pitch + Deps + Props)
    │       └── CodeInspector.tsx              # [UI] Single-accent monochromatic syntax code drawer + copy trigger
    ├── lib/
    │   ├── utils.ts                           # [LIB] cn() helper + hex-to-monochrome syntax shade generator
    │   ├── motion.ts                          # [LIB] Critically damped spring presets (0.85 <= zeta <= 1.00)
    │   └── seo.ts                             # [LIB] Updates document.title, canonical link & JSON-LD per route
    └── registry/
        ├── schema.ts                          # [SCHEMA] PeelRegistryItem, ComponentPropDef, StageSwatchDef
        ├── index.ts                           # [DATA] Single source of truth array of all Peel UI primitives
        └── primitives/                        # [PRIMITIVES] Self-contained Peel UI interactive components
```

---

## 4. REGISTRY SCHEMA (`src/registry/schema.ts`)

Every page, catalog card, workspace view, CLI JSON payload, sitemap entry, and `llms.txt` section derives from `src/registry/index.ts` typed with this schema:

```typescript
import type { ComponentType } from "react";

export type ComponentCategory =
  | "new-release"
  | "tactile-inputs"
  | "surfaces-navigation"
  | "motion-display"
  | "feedback-status";

export interface ComponentPropDef {
  name: string;
  type: string;
  defaultValue?: string;
  description: string;
  required?: boolean;
}

export interface StageSwatchDef {
  id: string;
  label: string;
  hex: string;
}

export interface PeelRegistryItem {
  slug: string;
  title: string;
  category: ComponentCategory;
  isNew?: boolean;
  /** 85% "dark" (--peel-surface), 15% "light" (--peel-light-surface) for grid visual rhythm */
  catalogCardTheme?: "dark" | "light";
  /** 1-to-2 sentence 25px pitch displayed in SpecPanel */
  leadPitch: string;
  /** Concise explanation of physics & interaction mechanics */
  interactionNotes: string;
  dependencies: string[];
  registryDependencies?: string[];
  filePath: string;
  code: string;
  props: ComponentPropDef[];
  swatches?: StageSwatchDef[];
  supportsReplay?: boolean;
  component: ComponentType<{
    accentHex?: string;
    replayKey?: number;
    theme?: "dark" | "light";
  }>;
}
```

---

## 5. STATIC SHADCN REGISTRY, GOOGLE SEO & LLM BUILDER (`scripts/build-registry.ts`)

Because this is a fast Vite SPA, `scripts/build-registry.ts` pre-generates all static machine-readable endpoints into `public/` before every build (`npm run build:registry`):
1. **Shadcn CLI Payloads (`public/r/[slug].json` & `public/r/registry.json`):**
   Reads the raw source file at `item.filePath` and emits official `https://ui.shadcn.com/schema/registry-item.json` files so users can run `npx shadcn@latest add https://peel-ui.vercel.app/r/<slug>.json`.
2. **Search Engine Indexing (`public/robots.txt` & `public/sitemap.xml`):**
   - `robots.txt` allows `*`, `Googlebot`, `GPTBot`, `OAI-SearchBot`, `ClaudeBot`, and `PerplexityBot`, pointing to `https://peel-ui.vercel.app/sitemap.xml`.
   - `sitemap.xml` lists `/`, `/components`, `/llms.txt`, `/llms-full.txt`, and every `/components/<slug>`.
3. **AI Coding Agent Discovery (`public/llms.txt` & `public/llms-full.txt`):**
   - `public/llms.txt`: Markdown directory of all Peel UI primitives, descriptions, and one-line Shadcn CLI install commands.
   - `public/llms-full.txt`: Complete prop tables, dependencies, and full `.tsx` source code for every primitive in one file.
4. **Client Route SEO (`src/lib/seo.ts`):**
   - Automatically updates `document.title`, `<meta name="description">`, `<link rel="canonical">`, and injects `SoftwareSourceCode` JSON-LD `<script type="application/ld+json">` on route changes.
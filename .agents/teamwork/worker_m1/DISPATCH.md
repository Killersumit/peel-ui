# Worker M1 Dispatch: Unified Component Detail Workstation Implementation

## Mandatory Integrity Warning
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## Objective
Implement the unified, production-grade Component Detail View for Peel UI with responsive 3-pane workstation on desktop and stacked card flow on mobile, driven by dynamic route `src/app/components/[slug]/page.tsx` and central typed registry.

## Authoritative Requirements & Context
- Original Request: `/home/killersumit1191/peel-ui/peel-ui-website/ORIGINAL_REQUEST.md`
- Project Blueprint: `/home/killersumit1191/peel-ui/peel-ui-website/.agents/teamwork/orchestrator/PROJECT.md`
- Design Directives: `/home/killersumit1191/peel-ui/peel-ui-website/AGENTS.md` and `DESIGN_SYSTEM.md`
- Survey Reports:
  - Explorer 1 (Component Codebase & Props): `/home/killersumit1191/peel-ui/peel-ui-website/.agents/teamwork/explorer_survey_1/handoff.md`
  - Explorer 2 (Design Tokens, Surfaces, Typography): `/home/killersumit1191/peel-ui/peel-ui-website/.agents/teamwork/explorer_survey_2/handoff.md`
  - Explorer 3 (Next.js App Router Architecture): `/home/killersumit1191/peel-ui/peel-ui-website/.agents/teamwork/explorer_survey_3/handoff.md`

## Write Ownership
You exclusively own and will create/modify:
- `src/config/components-data.ts` and `config/components-data.ts` (re-export)
- `src/components/detail/stage.tsx` and `components/detail/stage.tsx` (re-export)
- `src/components/detail/sidebar.tsx` and `components/detail/sidebar.tsx` (re-export)
- `src/components/detail/inspector.tsx` and `components/detail/inspector.tsx` (re-export)
- `src/components/detail/workstation.tsx` and `components/detail/workstation.tsx` (re-export)
- `src/app/components/[slug]/page.tsx`

## Core Requirements Breakdown
1. **R1: Central Component Registry (`src/config/components-data.ts` & `config/components-data.ts`)**:
   - Full metadata for all 5 components: `slide-to-confirm`, `magnetic-split-button`, `tactile-otp-input`, `voice-pill`, `privacy-shutter`.
   - Taxonomy categories: `ACTIONS` (`slide-to-confirm`, `magnetic-split-button`), `INPUTS` (`tactile-otp-input`, `voice-pill`), `SECURITY` (`privacy-shutter`).
   - Each entry contains: `slug`, `name`, `category`, `tagline`, `description`, `mechanicalDescription`, `dependencies`, `install` commands (npm, pnpm, yarn, bun), `props` array (name, type, default, description), `usageSnippet`, verbatim raw `sourceCode` string (retrieved from `public/r/*.json` or the component files), and live component export.
   - Export helper functions: `getComponentBySlug(slug: string)`, `getAllComponents()`, `getComponentsByCategory()`.

2. **R2: Interactive Center Stage (`src/components/detail/stage.tsx`)**:
   - Center workspace well with `bg-[#0c0c0e] border border-white/[0.08]` and subtle grid/crosshair accents.
   - 3-dot surface switcher dock at bottom:
     - Obsidian: `#000000`
     - Dark Gray: `#18181b`
     - Light Ceramic: `#f4f4f5` (ensure dark text/contrast framing inside canvas for the component)
   - Floating action pill (top or floating):
     - Quick Install copy command with 1-click clipboard feedback
     - Zen mode toggle (collapses sidebar and inspector for full-width focus)
     - Code view toggle (scrolls to or opens code viewer in inspector)
   - Responsive containment with viewport toggle/pinned mode for mobile testing.

3. **R3: Left Sidebar Index Drawer (`src/components/detail/sidebar.tsx`)**:
   - Collapsible desktop panel / slide-over mobile drawer.
   - Categorized by `ACTIONS`, `INPUTS`, `SECURITY`.
   - Displays all 5 components with slug links.
   - Active component highlighted with Peel UI Lime (`#84ff00`) indicator / subtle background tint.
   - Smooth transition, toggle button (`PanelLeft` icon), keyboard accessibility.

4. **R4: Right Inspector Panel (`src/components/detail/inspector.tsx`)**:
   - Technical telemetry header with title, badge (strict uppercase monospace, no emojis), version, and mechanical physics description.
   - Interactive Props Table: Name, Type, Default, Description with clean monospace styling.
   - Multi-Package Manager Install Tabs: `npm`, `pnpm`, `yarn`, `bun` with 1-click copy button and feedback.
   - Formatted Usage Code Block with 1-click copy.
   - Expandable Source Code Accordion with syntax-highlighted or formatted monospace TSX, line numbers, and 1-click copy.
   - License notice (MIT License) and metadata.

5. **R5: Dynamic Route Controller (`src/app/components/[slug]/page.tsx`)**:
   - Async Next.js Server Component.
   - Exports `generateStaticParams()` returning all 5 component slugs.
   - Exports dynamic `generateMetadata({ params })` generating OpenGraph and SEO tags for each component.
   - Resolves `const { slug } = await params;` and calls `notFound()` if slug does not exist.
   - Renders the interactive 3-pane desktop workstation / stacked mobile flow.

## Verification Required
Worker must run:
1. `npx tsc --noEmit` -> Must pass with 0 errors.
2. `npm run build` -> Must pass with exit code 0 and show prerendered static pages for all 5 components (`● /components/[slug]`).
Document exact command outputs in `handoff.md`.

## 2026-09-29T05:25:48Z
You are a Worker subagent for Peel UI.
Your working directory is: /home/killersumit1191/peel-ui/peel-ui-website/.agents/teamwork/worker_m1
Task: Implement the complete, production-grade Component Detail View for Peel UI with responsive 3-pane workstation on desktop and stacked card flow on mobile (R1 through R5).


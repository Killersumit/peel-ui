# Component Detail View Implementation Plan

## Objective
Implement production-grade unified Component Detail View for Peel UI with responsive 3-pane workstation on desktop and stacked card flow on mobile, driven by dynamic route `src/app/components/[slug]/page.tsx` and central typed registry.

## Architecture & Layout
- Desktop: 3-pane workstation (Left Sidebar Index Drawer, Center Stage with 3-dot surface switcher and floating action pill, Right Inspector Panel).
- Mobile: Stacked card flow (Stage -> Inspector -> Index).
- Strictly adhere to AGENTS.md (Swiss International / Industrial Archetype, no AI-slop, clean typography, hairline borders, no emojis/gradients).

## Phases & Steps
1. **Phase 0: Comprehensive Survey (3 Explorers in parallel)**
   - Explorer 1: Inspect existing components (`slide-to-confirm`, `magnetic-split-button`, `tactile-otp-input`, `voice-pill`, `privacy-shutter`), their props, source files, and exports.
   - Explorer 2: Inspect existing styles, Tailwind configuration, design tokens, AGENTS.md, DESIGN_SYSTEM.md, dependencies, Lucide icons, fonts, and layout structures.
   - Explorer 3: Inspect routing structure, navigation, existing component detail / showcase pages, imports, registry needs, and types.
2. **Phase 1: Milestone 1 (R1) - Central Component Registry (`config/components-data.ts`)**
   - Typed registry holding metadata, code snippets, installation instructions, props definitions, category assignments (ACTIONS, INPUTS, SECURITY), live component imports/renderers.
3. **Phase 2: Milestone 2 (R2) - Interactive Center Stage (`components/detail/stage.tsx`)**
   - 3-dot surface switcher (Obsidian, Dark Gray, Light Ceramic).
   - Floating action pill (quick install, zen toggle, code toggle).
   - Pinned mobile viewport option / responsive containment.
4. **Phase 3: Milestone 3 (R3) - Left Sidebar Index Drawer (`components/detail/sidebar.tsx`)**
   - Collapsible/slide-over drawer with 5 components grouped by ACTIONS, INPUTS, SECURITY.
   - Peel UI Lime active indicator, keyboard navigation, clean Swiss styling.
5. **Phase 4: Milestone 4 (R4) - Right Inspector Panel (`components/detail/inspector.tsx`)**
   - Header, mechanical description, props table, package manager tabs (npm/pnpm/yarn/bun), usage code block, expandable source code accordion with copy, license notice.
6. **Phase 5: Milestone 5 (R5) - Dynamic Controller Route (`src/app/components/[slug]/page.tsx`)**
   - Next.js App Router dynamic route with `generateStaticParams()`, `generateMetadata()`, not-found handling, integrating Stage, Sidebar, and Inspector in a 3-pane workstation layout.
7. **Phase 6: Integration & Verification**
   - Run `npx tsc --noEmit` and build checks.
   - Independent Reviewers, Challengers, and Forensic Auditor checks.

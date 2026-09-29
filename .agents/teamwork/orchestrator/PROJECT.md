# Project: Peel UI Component Detail Workstation

## Architecture
Unified, production-grade Component Detail View for Peel UI with responsive 3-pane workstation on desktop and stacked card flow on mobile, driven by dynamic route `src/app/components/[slug]/page.tsx` and central typed registry.

### Package & Module Boundaries
- `src/config/components-data.ts` (mirrored at `config/components-data.ts`): Central typed registry holding comprehensive metadata, live component instances, props specs, multi-PM install commands, usage snippets, and raw source code for all 5 components.
- `src/components/detail/stage.tsx` (mirrored at `components/detail/stage.tsx`): Interactive Center Stage with 3-dot surface switcher (Obsidian `#000000`, Dark Gray `#18181b`, Light Ceramic `#f4f4f5`), floating action pill (quick install, zen toggle, code toggle), and pinned mobile viewport.
- `src/components/detail/sidebar.tsx` (mirrored at `components/detail/sidebar.tsx`): Left Sidebar Index Drawer collapsible/slide-over drawer with all 5 components categorized under `ACTIONS`, `INPUTS`, and `SECURITY`, active Peel UI Lime (`#84ff00`) indicator, and direct slug routing.
- `src/components/detail/inspector.tsx` (mirrored at `components/detail/inspector.tsx`): Right Inspector Panel with header, mechanical description, props table, package manager tabs (`npm`, `pnpm`, `yarn`, `bun`), usage code block, expandable source code accordion with copy and line numbers, and MIT License notice.
- `src/app/components/[slug]/page.tsx`: Dynamic Server Component controller route with `generateStaticParams()`, `generateMetadata()`, not-found handling, mounting the client workstation.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | R1: Central Component Registry | Full metadata for all 5 components (`slide-to-confirm`, `magnetic-split-button`, `tactile-otp-input`, `voice-pill`, `privacy-shutter`) | M1 | ORIGINAL_REQUEST |
| 2 | R2: Center Stage Surface Switcher | 3-dot contrast switcher (Obsidian, Dark Gray, Light Ceramic) | M1 | ORIGINAL_REQUEST |
| 3 | R2: Center Stage Floating Pill | Quick install command copy, Zen mode toggle, Code view toggle | M1 | ORIGINAL_REQUEST |
| 4 | R2: Responsive Stage Viewport | Desktop workstation framing with pinned mobile viewport option | M1 | ORIGINAL_REQUEST |
| 5 | R3: Left Sidebar Index Drawer | Collapsible/slide-over drawer with 5 components grouped by ACTIONS, INPUTS, SECURITY | M1 | ORIGINAL_REQUEST |
| 6 | R3: Peel UI Lime Active Indicator | Visual marker indicating current active component slug (`#84ff00`) | M1 | ORIGINAL_REQUEST |
| 7 | R4: Right Inspector Header & Mechanics | Technical header, badge, and mechanical physics description | M1 | ORIGINAL_REQUEST |
| 8 | R4: Props Table | Interactive table with prop name, type, default, and description | M1 | ORIGINAL_REQUEST |
| 9 | R4: Package Manager Tabs | 1-click install command tabs for npm, pnpm, yarn, bun | M1 | ORIGINAL_REQUEST |
| 10 | R4: Usage Snippet & Copy | Formatted usage code block with 1-click copy feedback | M1 | ORIGINAL_REQUEST |
| 11 | R4: Expandable Source Code Accordion | Collapsible source code viewer with line numbers and 1-click copy | M1 | ORIGINAL_REQUEST |
| 12 | R4: License Notice | MIT License notice and metadata | M1 | ORIGINAL_REQUEST |
| 13 | R5: Dynamic Route Controller | Async Server Component `src/app/components/[slug]/page.tsx` with static prerendering | M1 | ORIGINAL_REQUEST |
| 14 | R5: Static Generation & Metadata | `generateStaticParams()` for all 5 slugs, dynamic `generateMetadata()` OpenGraph tags | M1 | ORIGINAL_REQUEST |
| 15 | R5: 404 Not Found Handling | Trigger Next.js `notFound()` on invalid component slugs | M1 | ORIGINAL_REQUEST |
| 16 | R5: Responsive 3-Pane / Mobile Layout | Desktop 3-pane workstation (Sidebar / Stage / Inspector) and mobile stacked flow | M1 | ORIGINAL_REQUEST |
| 17 | Design System Adherence | Strict Swiss/Industrial aesthetic, hairline borders, no AI slop, no emojis in badges | M1 | AGENTS.md |
| 18 | Verification & Static Prerender | Pass `npx tsc --noEmit` with 0 errors and `npm run build` with all 5 static pages | M1 | DISPATCH |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M0 | Codebase Survey & Blueprint | Complete survey across codebase, design system, tokens, and routes | None | DONE |
| M1 | Component Detail Workstation (R1-R5) | Full implementation of R1, R2, R3, R4, R5 and 3-pane workstation | M0 | IN_PROGRESS |
| M2 | Integration Verification & Gate | Reviewers, Challengers, Forensic Auditor, and Static Build check | M1 | PLANNED |

## Interface Contracts

### Component Registry Data (`config/components-data.ts`)
```typescript
export type ComponentCategory = "ACTIONS" | "INPUTS" | "SECURITY";

export interface ComponentPropDoc {
  name: string;
  type: string;
  default?: string;
  description: string;
  required?: boolean;
}

export interface ComponentRecord {
  slug: string;
  name: string;
  category: ComponentCategory;
  tagline: string;
  description: string;
  mechanicalDescription: string;
  dependencies: string[];
  install: {
    npm: string;
    pnpm: string;
    yarn: string;
    bun: string;
  };
  props: ComponentPropDoc[];
  usageSnippet: string;
  sourceCode: string;
  component: React.ComponentType<any>;
}
```

### Center Stage (`components/detail/stage.tsx`)
```typescript
export interface StageProps {
  componentRecord: ComponentRecord;
  zenMode: boolean;
  onToggleZen: () => void;
  onToggleCode: () => void;
}
```

### Left Sidebar (`components/detail/sidebar.tsx`)
```typescript
export interface SidebarProps {
  currentSlug: string;
  isOpen: boolean;
  onToggle: () => void;
}
```

### Right Inspector (`components/detail/inspector.tsx`)
```typescript
export interface InspectorProps {
  componentRecord: ComponentRecord;
  isExpanded?: boolean;
}
```

### Dynamic Route (`src/app/components/[slug]/page.tsx`)
```typescript
export function generateStaticParams(): Promise<{ slug: string }[]>;
export function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata>;
export default function ComponentDetailPage(props: { params: Promise<{ slug: string }> }): Promise<JSX.Element>;
```

## Code Layout
- `src/config/components-data.ts`
- `config/components-data.ts` (re-exports `src/config/components-data.ts`)
- `src/components/detail/stage.tsx`
- `components/detail/stage.tsx` (re-exports `src/components/detail/stage.tsx`)
- `src/components/detail/sidebar.tsx`
- `components/detail/sidebar.tsx` (re-exports `src/components/detail/sidebar.tsx`)
- `src/components/detail/inspector.tsx`
- `components/detail/inspector.tsx` (re-exports `src/components/detail/inspector.tsx`)
- `src/components/detail/workstation.tsx`
- `components/detail/workstation.tsx` (re-exports `src/components/detail/workstation.tsx`)
- `src/app/components/[slug]/page.tsx`

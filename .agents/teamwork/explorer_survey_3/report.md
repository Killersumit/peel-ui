# Peel UI — Unified Component Detail Workstation Survey & Architecture Report

## 1. Executive Summary

This report delivers a comprehensive architectural survey and implementation blueprint for the unified **Peel UI Component Detail View** (`src/app/components/[slug]/page.tsx`) and its supporting modules:
- **R1: Central Component Registry** (`config/components-data.ts`)
- **R2: Interactive Center Stage** (`components/detail/stage.tsx`)
- **R3: Left Sidebar Index Drawer** (`components/detail/sidebar.tsx`)
- **R4: Right Inspector Panel** (`components/detail/inspector.tsx`)
- **R5: Dynamic Controller Route** (`src/app/components/[slug]/page.tsx`)

### Key Findings
1. **Framework & Runtime**: The application runs **Next.js 16.3.6** (Turbopack, App Router) with **React 19.2.8**, **Tailwind CSS v4**, and **motion 13.4.4** (`import ... from "motion/react"`).
2. **Current Build & Typecheck Health**:
   - `npx tsc --noEmit`: **PASS (0 errors)**.
   - `npm run build`: **PASS (0 errors)**.
   - Currently, `/components/[slug]` is classified as `ƒ (Dynamic) server-rendered on demand` because it lacks `generateStaticParams()`.
3. **Current State of Component Detail**:
   - `src/app/components/[slug]/page.tsx` currently exists as a barebones, temporary Client Component with static placeholder cards, lacking the 3-pane layout, stage controls, sidebar, inspector, static params, and dynamic metadata.
   - Neither `config/components-data.ts` nor `components/detail/` exists in the repository yet.
4. **All 5 Target Components Are Fully Built & Operational**:
   - `slide-to-confirm` (`src/components/ui/slide-to-confirm.tsx`) — Actions
   - `magnetic-split-button` (`src/components/ui/magnetic-split-button.tsx`) — Actions
   - `tactile-otp-input` (`src/components/ui/tactile-otp-input.tsx`) — Inputs
   - `voice-pill` (`src/components/ui/voice-pill.tsx`) — Inputs
   - `privacy-shutter` (`src/components/ui/privacy-shutter.tsx`) — Security
   - Raw source code and shadcn registry schemas are also present in `public/r/*.json`.

---

## 2. Next.js App Router Structure & Layout Analysis

### 2.1 Route Tree
```
src/app/
├── globals.css               # Tailwind v4 @theme tokens + CSS custom properties
├── layout.tsx                # Root layout (Geist Sans, Geist Mono, metadata, dark mode)
├── page.tsx                  # Landing / Home page with Navbar, Hero, BentoGrid, Footer
├── components/
│   ├── page.tsx              # Component directory listing all 5 primitives by category
│   └── [slug]/
│       └── page.tsx          # Dynamic component detail route (TO BE REPLACED WITH R5)
├── manifest.ts               # Web app manifest
├── opengraph-image.tsx       # Dynamic OG image generation
├── robots.ts                 # Search engine directives
└── sitemap.ts                # Dynamic XML sitemap
```

### 2.2 Root Layout (`src/app/layout.tsx`)
- Configures `Geist` and `Geist_Mono` from `next/font/google` bound to `--font-geist-sans` and `--font-geist-mono`.
- Defines base metadata: `title: { default: "Peel UI — Tactile Motion Primitives for React", template: "%s | Peel UI" }`.
- Sets dark mode background `#08090a`, text `#f5f5f7`, and selection color `#84ff00` (Peel Lime).
- Mounts `<JsonLd type="website" />` and an accessible skip-to-content anchor.
- Child routes render inside `<div id="main-content">{children}</div>`.

### 2.3 Existing Navigation & Shell Components
- **Navbar** (`src/components/navigation/navbar.tsx`):
  - Floating pill header fixed at `top-6 left-1/2 -translate-x-1/2 z-50 max-w-2xl`.
  - Links: `Home` (`/`), `Components` (`/components`), `Showcase` (`/#components`).
  - Active detection via `usePathname()`.
  - Includes brand mark (`/peeluiicon.svg`), GitHub star link (`killersumit/peel-ui`), and mobile dropdown toggle.
- **Footer** (`src/components/navigation/footer.tsx`):
  - Machined baseplate footer dock at bottom with brand lockup, status `v0.1.0`, creator credit (`Killersumit`), GitHub link, and smooth `[ ↑ TOP ]` trigger.

### 2.4 Restructuring Requirements for `src/app/components/[slug]/page.tsx`
In Next.js 15+ / 16.3.6:
- Dynamic route params are typed as a **Promise**: `params: Promise<{ slug: string }>`.
- Route generators `generateStaticParams()` and `generateMetadata()` **must be exported from a Server Component**. They cannot be exported from a file with `"use client"`.
- **Architectural Solution**:
  - `src/app/components/[slug]/page.tsx` will be a **Server Component** that awaits `params`, runs `generateStaticParams()` returning all 5 slugs, generates dynamic SEO metadata via `generateMetadata()`, checks for validity using `getComponentData(slug)` (triggering `notFound()` if invalid), and passes the typed metadata to the client workstation wrapper `<ComponentDetailWorkstation componentData={data} />`.

---

## 3. Package Dependencies, Aliases & Path Resolution

### 3.1 Dependencies
From `package.json`:
- `next`: `16.3.6` (Turbopack)
- `react`: `19.2.8`
- `react-dom`: `19.2.8`
- `motion`: `^13.4.4` (Canonical import: `import { ... } from "motion/react"`)
- `lucide-react`: `^1.48.0`
- `clsx`: `^2.1.1`
- `tailwind-merge`: `^3.7.0`
- `@tailwindcss/postcss`: `^4`
- `tailwindcss`: `^4`
- `typescript`: `^5`

### 3.2 Path Aliasing & Dual Directory Structure
- `tsconfig.json` defines:
  ```json
  "paths": {
    "@/*": ["./src/*"]
  }
  ```
- All existing application code uses `@/components/...` which maps directly to `src/components/...`.
- **Dual directory observation**: A legacy or mirrored `components/` exists at the root, while the active Next.js App Router tree lives in `src/`.
- **Guaranteed Resolution Strategy**:
  1. Implement all primary code in `src/config/components-data.ts` and `src/components/detail/`.
  2. Provide root re-export files at `config/components-data.ts` and `components/detail/` that forward all exports.
  3. Ensure `tsconfig.json` path mapping allows `@/*` to resolve to `src/*` and fall back to root:
     ```json
     "paths": {
       "@/*": ["./src/*", "./*"]
     }
     ```
  This completely eliminates any risk of import resolution failures across CLI scripts, root imports, or App Router modules.

---

## 4. Current State of the 5 Peel UI Primitives

All 5 primitives exist in `src/components/ui/` with complete TypeScript interfaces:

| Component Slug | File Path | Category | Core Mechanics |
| :--- | :--- | :--- | :--- |
| `slide-to-confirm` | `src/components/ui/slide-to-confirm.tsx` | Actions | 75% magnetic gravity pocket, kinematic drag constraints, spring recoil settle, progress fill layer |
| `magnetic-split-button` | `src/components/ui/magnetic-split-button.tsx` | Actions | Magnetic cursor detent, spring separation gap, popover action menu with keyboard navigation |
| `tactile-otp-input` | `src/components/ui/tactile-otp-input.tsx` | Inputs | Spring-loaded floating lens focus frame, digit tumblers, paste parsing, backspace rewind |
| `voice-pill` | `src/components/ui/voice-pill.tsx` | Inputs | Expanding pill shape, simulated or live Web Audio FFT waveform, slide-to-cancel drag physics |
| `privacy-shutter` | `src/components/ui/privacy-shutter.tsx` | Security | Mechanical sliding latch, spring-peek detent, lock toggle, masked/revealed secret copy |

---

## 5. Detailed Specifications & Architecture: R1 through R5

### R1. Central Component Registry (`config/components-data.ts`)

#### Location
- Primary: `src/config/components-data.ts`
- Root re-export: `config/components-data.ts`

#### Type Definitions
```typescript
export type ComponentCategory = "Actions" | "Inputs" | "Security";

export interface ComponentPropDoc {
  name: string;
  type: string;
  description: string;
  default?: string;
}

export interface InstallCommands {
  npm: string;
  pnpm: string;
  yarn: string;
  bun: string;
}

export interface ComponentDetailData {
  slug: string;
  name: string;
  category: ComponentCategory;
  categoryIndex: string; // "01", "02", "03"
  description: string;
  dependencies: string[];
  interactionType: string;
  props: ComponentPropDoc[];
  installCmd: InstallCommands;
  usageCode: string;
  sourceCode: string;
}
```

#### Registry Data Catalog
1. **`slide-to-confirm`**
   - Category: `Actions` (`01`)
   - Interaction Type: `Kinematic Drag & 75% Magnetic Gravity Latch`
   - Dependencies: `["motion", "lucide-react", "clsx", "tailwind-merge"]`
   - Props:
     - `label`: `string` (default: `"Slide to deploy"`)
     - `confirmedLabel`: `string` (default: `"Executed"`)
     - `onConfirm`: `() => void`
     - `onReset`: `() => void`
     - `autoResetTimeout`: `number` (default: `0`)
     - `disabled`: `boolean` (default: `false`)
     - `className`: `string`
   - Install Commands:
     - npm: `npx shadcn@latest add https://peelui.dev/r/slide-to-confirm.json`
     - pnpm: `pnpm dlx shadcn@latest add https://peelui.dev/r/slide-to-confirm.json`
     - yarn: `npx shadcn@latest add https://peelui.dev/r/slide-to-confirm.json`
     - bun: `bunx --bun shadcn@latest add https://peelui.dev/r/slide-to-confirm.json`

2. **`magnetic-split-button`**
   - Category: `Actions` (`01`)
   - Interaction Type: `Magnetic Cursor Detent & Split Separation Recoil`
   - Dependencies: `["motion", "lucide-react", "clsx", "tailwind-merge"]`
   - Props:
     - `defaultAction`: `string` (default: `"Deploy to prod"`)
     - `actions`: `MagneticSplitAction[]` (default: Staging, Preview, Rollback)
     - `onAction`: `(actionLabel: string) => void`
     - `className`: `string`
   - Install Commands:
     - npm: `npx shadcn@latest add https://peelui.dev/r/magnetic-split-button.json`
     - pnpm: `pnpm dlx shadcn@latest add https://peelui.dev/r/magnetic-split-button.json`
     - yarn: `npx shadcn@latest add https://peelui.dev/r/magnetic-split-button.json`
     - bun: `bunx --bun shadcn@latest add https://peelui.dev/r/magnetic-split-button.json`

3. **`tactile-otp-input`**
   - Category: `Inputs` (`02`)
   - Interaction Type: `Spring-Loaded Floating Lens & Digit Tumblers`
   - Dependencies: `["motion", "clsx", "tailwind-merge"]`
   - Props:
     - `length`: `number` (default: `4`)
     - `initialValues`: `string[]` (default: `["3", "8", "1", ""]`)
     - `onComplete`: `(code: string) => void`
     - `className`: `string`
   - Install Commands:
     - npm: `npx shadcn@latest add https://peelui.dev/r/tactile-otp-input.json`
     - pnpm: `pnpm dlx shadcn@latest add https://peelui.dev/r/tactile-otp-input.json`
     - yarn: `npx shadcn@latest add https://peelui.dev/r/tactile-otp-input.json`
     - bun: `bunx --bun shadcn@latest add https://peelui.dev/r/tactile-otp-input.json`

4. **`voice-pill`**
   - Category: `Inputs` (`02`)
   - Interaction Type: `Live FFT Waveform & Slide-To-Cancel Inertia`
   - Dependencies: `["lucide-react", "motion"]`
   - Props:
     - `size`: `number` (default: `40`)
     - `reactive`: `"simulated" | "mic"` (default: `"simulated"`)
     - `mode`: `"auto" | "hold" | "toggle"` (default: `"auto"`)
     - `slideToCancel`: `boolean` (default: `true`)
     - `cancelDistance`: `number` (default: `100`)
     - `waveform`: `boolean` (default: `true`)
     - `showTime`: `boolean` (default: `true`)
     - `onStart`: `(info: { source: "simulated" | "mic" }) => void`
     - `onStop`: `(info: { reason: string; duration: number }) => void`
     - `className`: `string`
   - Install Commands:
     - npm: `npx shadcn@latest add https://peelui.dev/r/voice-pill.json`
     - pnpm: `pnpm dlx shadcn@latest add https://peelui.dev/r/voice-pill.json`
     - yarn: `npx shadcn@latest add https://peelui.dev/r/voice-pill.json`
     - bun: `bunx --bun shadcn@latest add https://peelui.dev/r/voice-pill.json`

5. **`privacy-shutter`**
   - Category: `Security` (`03`)
   - Interaction Type: `Mechanical Shutter Latch & Spring-Peek Detent`
   - Dependencies: `["motion", "lucide-react", "clsx", "tailwind-merge"]`
   - Props:
     - `apiKey`: `string` (default: `"sk_live_51M0x9F4kL2026peel"`)
     - `maskedKey`: `string` (default: `"sk_live_••••••••38f2"`)
     - `label`: `string` (default: `"Production Key"`)
     - `onCopy`: `(key: string) => void`
     - `onToggleLock`: `(isLockedOpen: boolean) => void`
     - `className`: `string`
   - Install Commands:
     - npm: `npx shadcn@latest add https://peelui.dev/r/privacy-shutter.json`
     - pnpm: `pnpm dlx shadcn@latest add https://peelui.dev/r/privacy-shutter.json`
     - yarn: `npx shadcn@latest add https://peelui.dev/r/privacy-shutter.json`
     - bun: `bunx --bun shadcn@latest add https://peelui.dev/r/privacy-shutter.json`

#### Query Functions
- `getAllComponentSlugs(): string[]`
- `getComponentData(slug: string): ComponentDetailData | undefined`
- `getComponentsByCategory(category: ComponentCategory): ComponentDetailData[]`

---

### R2. Interactive Center Stage (`components/detail/stage.tsx`)

#### Specifications & Features
1. **Chassis & Frame**:
   - `bg-[#0c0c0e] border border-white/[0.08] rounded-2xl`
   - Relative positioning with subtle mechanical grid backdrop (`bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.07]`).
   - Mobile: Pinned viewport `h-[45vh] min-h-[340px]`.
   - Desktop: Flex-1 fill inside the workstation viewport (`min-h-[580px]`).
2. **Floating Bottom Dock (Surface Switcher)**:
   - Floating pill positioned at `bottom-4 left-1/2 -translate-x-1/2 z-20`.
   - Glassmorphic / dark chassis: `bg-zinc-950/90 border border-white/[0.08] px-3 py-1.5 rounded-full flex items-center gap-3 shadow-xl`.
   - 3 surface contrast modes:
     - **Obsidian**: `#000000` (Pure black)
     - **Dark Gray**: `#18181b` (Zinc-900 matte)
     - **Light Ceramic**: `#f4f4f5` (Bright ceramic contrast with adaptive foreground)
   - Visual indicator showing current active mode with smooth spring settle.
3. **Floating Top Action Pill**:
   - Anchored at `top-4 right-4 z-20` (or centered top).
   - Contains:
     - **Quick Install Popover / Trigger**: Copies default install command (`npx shadcn@latest add ...`) with feedback checkmark.
     - **Zen / Fullscreen Toggle**: Collapses Left Sidebar and Right Inspector so the Stage takes full 100% viewport width.
     - **Code Toggle (`</>`)**: Smooth-scrolls or expands the source code accordion in the inspector.
4. **Live Dynamic Component Mount**:
   - Centered inside the stage viewport with clean touch and drag event isolation.
   - Clean render mapping for all 5 components:
     - `slide-to-confirm` -> `<SlideToConfirm label="Slide to deploy" />`
     - `magnetic-split-button` -> `<MagneticSplitButton defaultAction="Deploy to prod" />`
     - `tactile-otp-input` -> `<TactileOtpInput initialValues={["3", "8", "1", ""]} />`
     - `voice-pill` -> `<VoicePill reactive="simulated" size={40} />`
     - `privacy-shutter` -> `<PrivacyShutter className="w-full max-w-[340px]" />`

---

### R3. Left Sidebar Index Drawer (`components/detail/sidebar.tsx`)

#### Specifications & Features
1. **Collapsible Workstation Sidebar**:
   - Desktop: Width transitions smoothly between expanded (`w-64` / 256px) and collapsed (`w-0` / `hidden`).
   - Mobile: Slide-over drawer overlay (`fixed inset-0 z-50 md:hidden`) with backdrop blur and escape/click-outside dismiss.
2. **Monospace Category Indexing**:
   - `ACTIONS // 01` -> `Slide to Confirm`, `Magnetic Split Button`
   - `INPUTS // 02` -> `Tactile OTP Input`, `Voice Pill`
   - `SECURITY // 03` -> `Privacy Shutter`
3. **Active Status Highlighting**:
   - Active component has a Peel UI Lime (`#84ff00`) indicator bar / badge (`ACTIVE` or `●`).
   - Active row uses `bg-white/[0.06] text-white border-l-2 border-[#84ff00]`.
   - Inactive rows use `text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.02]`.
   - Direct client navigation via Next.js `<Link href={`/components/${item.slug}`}>`.

---

### R4. Right Inspector Panel (`components/detail/inspector.tsx`)

#### Specifications & Features
1. **Chassis & Sizing**:
   - Desktop: `w-[420px] lg:w-[460px] shrink-0 border-l border-white/[0.08] bg-[#0c0c0e]/60 backdrop-blur-xl flex flex-col h-full overflow-y-auto`.
   - Mobile: Stacks naturally below the Stage as full-width cards with clean spacing.
2. **Modules Breakdown**:
   - **Header**:
     - Category badge (e.g. `[ACTIONS // 01]`).
     - Display Title (e.g. `Slide to Confirm`).
     - Technical description.
     - Dependency badges: `motion`, `lucide-react`, `clsx`, etc. in monospace chips.
   - **Mechanical Interaction Spec**:
     - Telemetry box: "KINETIC INTERACTION SPEC" with concise, objective physical dynamics description.
   - **Interactive Props Table**:
     - Columns: `PROP`, `TYPE`, `DEFAULT`, `DESCRIPTION`.
     - Monospace typography for prop names and types (`text-[#84ff00]` for names, `text-zinc-400` for types).
     - Clean hairline borders (`border-white/[0.06]`).
   - **Multi-Package Manager Install Tabs**:
     - Tabs: `npm`, `pnpm`, `yarn`, `bun`.
     - Terminal display block with 1-click copy button and feedback indicator (`Copied!`).
   - **"How to Use" Code Block**:
     - Minimal TSX code snippet showing canonical component import and usage.
     - 1-click copy button.
   - **Expandable Full Source Code Accordion**:
     - Collapsed by default (or toggleable via Stage action pill).
     - Expands smoothly to show full raw TSX source code with line numbers, monospace font, syntax container, and 1-click copy button.
   - **License Notice**:
     - Monospace footer notice: `"MIT License. Free to use in personal and commercial projects. Built for Peel UI."`

---

### R5. Dynamic Controller Route (`src/app/components/[slug]/page.tsx`)

#### Server Component Architecture
```tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getAllComponentSlugs,
  getComponentData,
} from "@/config/components-data";
import { ComponentWorkstation } from "@/components/detail/workstation";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = getAllComponentSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const comp = getComponentData(slug);

  if (!comp) {
    return {
      title: "Component Not Found | Peel UI",
    };
  }

  return {
    title: `${comp.name} — Tactile Motion Primitive`,
    description: comp.description,
    openGraph: {
      title: `${comp.name} — Peel UI`,
      description: comp.description,
      url: `https://peelui.com/components/${comp.slug}`,
      type: "website",
    },
  };
}

export default async function ComponentDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const comp = getComponentData(slug);

  if (!comp) {
    notFound();
  }

  return <ComponentWorkstation componentData={comp} />;
}
```

#### Client Workstation Wrapper (`ComponentWorkstation`)
- Coordinates the 3-pane layout:
  - Top: Breadcrumbs & workstation controls bar (Sidebar toggle, Zen mode toggle).
  - Main Body:
    - `<Sidebar>` (Left index drawer)
    - `<Stage>` (Center interactive canvas)
    - `<Inspector>` (Right telemetry & documentation panel)
  - Bottom: Reuses site `<Footer />`.
- Manages state:
  - `isSidebarOpen` (desktop collapsible)
  - `isMobileSidebarOpen` (mobile drawer toggle)
  - `isZenMode` (full-width stage toggle)
  - `isCodeExpanded` (synced between Stage pill and Inspector accordion)

---

## 6. Verification and Build Validation

### 6.1 Pre-Investigation Verification Checks
- `npx tsc --noEmit`: Executed cleanly with **0 type errors**.
- `npm run build`: Executed cleanly with **0 compilation errors**.
- Currently `/components/[slug]` builds as a dynamic route `ƒ`. Once `generateStaticParams()` is implemented, it will statically prerender all 5 routes at build time.

### 6.2 Acceptance Verification Steps for Implementers
1. Run `npx tsc --noEmit` and confirm **0 errors**.
2. Run `npm run build` and verify that the output displays all 5 prerendered static routes:
   - `● /components/slide-to-confirm`
   - `● /components/magnetic-split-button`
   - `● /components/tactile-otp-input`
   - `● /components/voice-pill`
   - `● /components/privacy-shutter`
3. Verify not-found handling: requesting `/components/unknown-slug` correctly renders the 404 page.
4. Verify responsive layout:
   - Desktop (>1024px): 3-pane layout with independent scrolling for Inspector.
   - Mobile (<1024px): Sticky/pinned Stage at top, Inspector cards stacked underneath, Sidebar accessible via mobile drawer trigger.
5. Verify interactions:
   - Surface switcher switches between Obsidian, Dark Gray, and Light Ceramic.
   - Zen mode collapses side panels and expands stage.
   - 1-click copy works on install commands, usage snippet, and full source code.
   - Props table accurately reflects the component's TypeScript interface.

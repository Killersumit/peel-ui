# Survey Report: Peel UI Design System, Tokens, Styles, Typography & Motion

**Target:** Peel UI Component Detail View Workstation  
**Author:** Explorer Subagent 2 (`explorer_survey_2`)  
**Workspace:** `/home/killersumit1191/peel-ui/peel-ui-website`  
**Date:** 2026-09-29  

---

## 1. Executive Summary & Architecture Overview

Peel UI is engineered around a **Swiss International / High-Density Industrial Archetype** (Braun / Teenage Engineering sensibility). It relies on:
- High-contrast tonal surfaces (Obsidian, Zinc Dark Gray, Light Ceramic)
- Electric Acid Lime accent (`#84ff00` / `#a3e635`)
- Precision hairline structural borders (`border-white/[0.08]`, `border-[#232730]`)
- Damped kinematic spring motion (`motion/react` with `springTactile` and `springMechanical`)
- Pure Geist Sans and Geist Mono typography with strict tracking discipline
- Strict adherence to the `AGENTS.md` AI-Slop Blacklist (no gradient text, no em-dashes, no emojis in UI badges, no muddy glassmorphism, no 3-icon boxes).

The codebase is built on **Next.js 16.3.6 (App Router)**, **React 19.2.8**, **Tailwind CSS v4**, and **Motion v13.4.4**. All typechecks pass cleanly (`npx tsc --noEmit` exits with code 0).

---

## 2. Color System & Surface Token Specifications

The website uses a hybrid of CSS custom properties defined in `src/app/globals.css`, Tailwind v4 `@theme inline` mappings, and custom utility classes. For the Component Detail View workstation (`stage.tsx`, `sidebar.tsx`, `inspector.tsx`), the following exact values and classes must be utilized:

### 2.1 Canvas & Surface Tokens

| Surface Token | Hex / Value | Tailwind Utility Class | Usage Context in Component Detail View |
| :--- | :--- | :--- | :--- |
| **Obsidian Canvas** | `#000000` | `bg-[#000000]` | Canvas option 1 in Stage 3-dot surface switcher; Page base background (`src/app/components/[slug]/page.tsx`). |
| **Dark Gray Surface** | `#18181b` (zinc-900) | `bg-[#18181b]` | Canvas option 2 in Stage 3-dot surface switcher (contrast canvas). |
| **Light Ceramic Surface** | `#f4f4f5` (zinc-100) | `bg-[#f4f4f5]` | Canvas option 3 in Stage 3-dot surface switcher (warm paper/bone canvas). In light mode, component text becomes `#09090b` / `text-zinc-950`. |
| **Workstation Chassis** | `#0c0c0e` | `bg-[#0c0c0e]` | Primary workstation chassis background for Stage (`components/detail/stage.tsx`), Sidebar, and Inspector panels. |
| **Elevated Surface** | `#12141a` / `#161616` | `bg-[#12141a]` or `bg-[#161616]` | Bento card frames, popover backgrounds, floating docks. |
| **Active / Recessed Well** | `#08090a` / `#050505` | `bg-[#08090a]` or `bg-[#050505]` | Code blocks, recessed telemetry wells, command capsules. |

### 2.2 Accent Token: Peel UI Lime

| Token Key | Hex Value | Foreground Text | Tailwind Utility Classes | Usage Role |
| :--- | :--- | :--- | :--- | :--- |
| **Peel UI Lime** | `#84ff00` | `#000000` / `#08090a` | `bg-[#84ff00] text-black`, `text-[#84ff00]`, `border-[#84ff00]` | Primary interactive triggers, active tab indicators, confirm sliders, status beacons. |
| **Alternate Lime** | `#a3e635` (lime-400) | `#000000` | `bg-lime-400 text-black`, `text-lime-400` | Registry badges, active sidebar indicators, subhead highlights. |
| **Lime Muted Tint** | `rgba(132, 255, 0, 0.10)` | N/A | `bg-[#84ff00]/10` or `selection:bg-[#84ff00]/15` | Text selection highlight, active item background tint in sidebar. |

### 2.3 Structural Lines, Hairline Borders & Dividers

Peel UI uses hairline borders rather than floating card shadows to achieve architectural grounding:

| Role | Specification | Tailwind Class | Implementation Detail |
| :--- | :--- | :--- | :--- |
| **Chassis Perimeter** | 1px hairline border | `border border-white/[0.08]` | Outer border of Center Stage, Sidebar Drawer, and Inspector Panel. |
| **Subtle Interior Lines** | 1px low-contrast line | `border-white/[0.04]` or `border-zinc-800/80` | Inner borders, table cell dividers, secondary tabs. |
| **Section Dividers** | 1px solid separator | `border-b border-white/[0.08]` or `divide-y divide-white/[0.08]` | Drawer headers, inspector metadata rows, props table rows. |
| **Border Collapse Grid** | Zero-gap structural joint | `-mr-px -mt-px border border-white/[0.08]` | Adjoining workstation panes without double-thick borders. |

---

## 3. Spatial Mathematics & Layout Engine

All layout dimensions must strictly adhere to the 8px base Fibonacci scale from `DESIGN_SYSTEM.md`:

| Token | Dimension | Tailwind Class | Application in Component Detail View |
| :--- | :--- | :--- | :--- |
| `micro-1` | 4px / 8px | `p-1`, `p-2`, `gap-2` | 3-dot surface switcher gap, tag padding, icon offsets. |
| `micro-2` | 12px / 16px | `p-3`, `p-4`, `gap-4` | Floating action pill padding, input heights, button gaps. |
| `meso-1` | 24px | `p-6`, `gap-6` | Inspector card interior padding, sidebar list padding. |
| `meso-2` | 40px | `p-10`, `gap-10` | Desktop stage padding around the interactive component. |
| `macro-1` | 64px | `py-16` | Vertical padding of workstation container. |

### 3.1 3-Pane Creative Workstation Architecture (Desktop vs Mobile)

1. **Desktop Viewport (`lg:` / `xl:`):**
   - **Left Sidebar Index Drawer:** Fixed width `w-64` (or `w-72`), collapsible to icon-rail or zero width with smooth mechanical transition.
   - **Center Stage:** Flexible flex-1 workspace chassis (`bg-[#0c0c0e] border border-white/[0.08] rounded-2xl sm:rounded-3xl`) holding:
     - Top floating action pill: Quick install popover, Zen toggle (expands stage full-width by hiding sidebar & inspector), and `</>` code toggle.
     - Center canvas: Dynamically switches background between Obsidian (`#000000`), Dark Gray (`#18181b`), and Light Ceramic (`#f4f4f5`).
     - Bottom floating dock: 3-dot surface switcher dots (`w-3 h-3 rounded-full cursor-pointer transition-all`).
   - **Right Inspector Panel:** Fixed width `w-80` to `w-96`, containing metadata, props table, package manager install tabs, usage snippet, and expandable source code accordion.
2. **Mobile Viewport (`< lg`):**
   - Pinned viewport height on stage: `h-[45vh] min-h-[340px]`.
   - Sidebar becomes a slide-over mobile drawer triggered by top navbar / panel icon.
   - Stacked card flow: Stage stays on top, Inspector cards flow linearly underneath.

---

## 4. Typographic Matrix & Hierarchy

The project loads fonts in `src/app/layout.tsx`:
- Sans: `Geist` (latin subset, variable `--font-geist-sans`)
- Mono: `Geist_Mono` (latin subset, variable `--font-geist-mono`)

### 4.1 Hierarchy & Tracking Rules

| Typographic Level | Size (rem / px) | Font Family | Tracking Class | Leading | Transform | Use Case |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Workstation Title** | 2rem–3rem (32–48px) | `font-sans font-bold` | `tracking-[-0.03em]` to `tracking-[-0.05em]` (`tracking-tight`) | `leading-[1.08]` | Normal | Component name in Inspector and Page Header. **Never use em-dashes.** |
| **Section Heading** | 1.125rem–1.25rem | `font-sans font-semibold` | `tracking-[-0.02em]` | `leading-snug` | Normal | Inspector group titles ("PROPS", "INSTALLATION", "SOURCE"). |
| **Body Reading** | 0.875rem–1.0rem | `font-sans text-zinc-400` | `tracking-normal` | `leading-[1.6]` | Normal | Component description (constrained to `max-w-[55ch]`). |
| **Telemetry / Label** | 0.75rem (12px) | `font-mono text-zinc-400` | `tracking-[0.08em]` (`tracking-wider`) | `leading-none` | `uppercase` | Category tags (`ACTIONS`, `INPUTS`, `SECURITY`), CLI tool labels. |
| **Technical Badge** | 0.6875rem (11px) | `font-mono text-zinc-300` | `tracking-[0.12em]` (`tracking-widest`) | `leading-none` | `uppercase` | Version stamps (`[01]`, `v0.1.0`), dependency chips. **Zero emojis.** |
| **Code / Snippet** | 0.75rem–0.8125rem | `font-mono text-zinc-200` | `tracking-normal` | `leading-[1.5]` | Normal | Package manager commands, TSX props types, source code lines. |

---

## 5. Kinetic Physics & Motion Tokens

Kinetic transitions are centralized in `src/lib/motion.ts` and use `motion/react` (Motion v13):

```typescript
import type { Transition } from "motion/react";

// Tactile spring for buttons, tabs, switches, segmented surface switcher dots
export const springTactile: Transition = {
  type: "spring",
  stiffness: 600,
  damping: 38,
  mass: 0.6,
};

// Mechanical reveal spring for drawers, dropdown menus, expandable code accordion
export const springMechanical: Transition = {
  type: "spring",
  stiffness: 380,
  damping: 32,
  mass: 1.0,
};

// Precise micro-interaction for hover borders, color shifts, copy feedback
export const microTransition = {
  duration: 0.12,
  ease: [0.16, 1, 0.3, 1] as const, // easeOutExpo
};
```

### Accessibility Compliance
Every interactive motion primitive MUST respect reduced motion settings:
```tsx
import { useReducedMotion } from "motion/react";
const shouldReduceMotion = useReducedMotion();
// Conditionally suppress spatial translations: initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
```

---

## 6. Iconography & Telemetry Assets

The project uses `lucide-react` (`^1.48.0`). All icons used in the detail view must be functional instruments rather than decorative slop.

### 6.1 Recommended Icons for Component Detail View

| Component / Area | Lucide Icon | Purpose |
| :--- | :--- | :--- |
| **Sidebar Collapse / Toggle** | `PanelLeft` / `PanelLeftClose` / `PanelLeftOpen` | Toggle Left Index Drawer visibility on desktop and mobile. |
| **Category Icons** | `Activity` (Actions), `Sliders` (Inputs), `Shield` (Security) | Clean semantic category signifiers in sidebar. |
| **Stage Action Pill** | `Terminal` | Trigger Quick Install CLI popover. |
| **Stage Action Pill** | `Maximize2` / `Minimize2` | Toggle Zen mode (full-screen stage expansion). |
| **Stage Action Pill** | `Code2` / `Code` | Jump/toggle Source Code view. |
| **Surface Switcher Dock** | (3 styled dot buttons) | Obsidian (`bg-black`), Dark Gray (`bg-zinc-800`), Light Ceramic (`bg-zinc-200`). |
| **Inspector Copy Actions** | `Copy` and `Check` | 1-click clipboard copy feedback with tactile transition. |
| **Source Accordion** | `ChevronDown` / `ChevronUp` | Expand/collapse source code viewer. |
| **Breadcrumb Back** | `ArrowLeft` | Return to `/components` directory. |

---

## 7. AGENTS.md Compliance & Forbidden AI-Slop Checklist

Before writing or approving code for the Component Detail View, audit against these non-negotiable rules:

| Category | Forbidden Pattern (❌) | Mandatory Peel UI Standard (✅) |
| :--- | :--- | :--- |
| **Headlines & Titles** | Gradient text (`bg-clip-text text-transparent bg-gradient-to-r`). | Solid, high-contrast, flat colors (`text-white`, `text-[#f5f5f7]`). |
| **Copywriting** | Em-dashes (`—`) or en-dashes (`–`) in headlines, titles, or marketing copy. | Clean punctuation (periods, hyphens `-`, slashes `/`, or brackets `[]`). |
| **Badges & UI** | Emojis (🚀, ✨, 🔥, 💡) in headlines, badges, button labels. | Strict monospace uppercase badges (`SYS_READY [200_OK]`, `TACTILE REGISTRY [5]`). |
| **Layouts** | Generic "3 icon boxes" or centered hero with tilted dashboard mockups. | Asymmetric 3-pane workstation or bento grid with shared hairline borders. |
| **Surfaces** | Muddy glassmorphism (`backdrop-blur-md` with `bg-white/5` or `border-white/10`). | Crisp physical chassis (`bg-[#0c0c0e] border border-white/[0.08]`). |
| **Card Borders** | Thin neon glow borders (`border-purple-500/30`, `border-blue-500/20`). | Hairline structural borders (`border-white/[0.08]`, `border-[#232730]`). |
| **Spacing** | Arbitrary Tailwind classes (`mt-7`, `p-5`, `gap-7`, `top-[18px]`). | Strict Fibonacci scale (`p-2`, `p-4`, `p-6`, `p-10`, `py-16`). |
| **Motion** | Continuous looping floating icons, pulsating blobs, or cursor spotlight beams. | Damped spring physics triggered strictly by user interaction (`springTactile`, `springMechanical`). |
| **Copy Buzzwords** | "supercharge", "seamless", "next-gen", "elevate", "cutting-edge", "game-changer", "unleash", "effortless", "all-in-one". | Precise technical vocabulary: "kinematic spring recoil", "floating lens frame", "FFT audio telemetry". |

---

## 8. Component Detail View Implementation Blueprint (R1–R5)

### R1. Central Component Registry (`config/components-data.ts`)
- TypeScript interface `PeelComponentData` with:
  - `slug`: `'slide-to-confirm' | 'magnetic-split-button' | 'tactile-otp-input' | 'voice-pill' | 'privacy-shutter'`
  - `name`: String
  - `category`: `'ACTIONS' | 'INPUTS' | 'SECURITY'`
  - `description`: String (strictly without em-dashes)
  - `dependencies`: `['motion', 'lucide-react']`
  - `interactionType`: String (e.g. "Damped Kinematic Drag & Detent Lock")
  - `props`: Array of `{ name, type, description, default }`
  - `installCmd`: `{ npm, pnpm, yarn, bun }`
  - `usageCode`: Formatted sample TSX snippet
  - `sourceCode`: Raw verbatim string of component TSX file

### R2. Interactive Center Stage (`components/detail/stage.tsx`)
- Container: `rounded-2xl sm:rounded-3xl bg-[#0c0c0e] border border-white/[0.08] relative overflow-hidden flex flex-col justify-between`
- Canvas contrast state: `'obsidian' | 'dark-gray' | 'light-ceramic'`
  - `obsidian`: `bg-[#000000]`
  - `dark-gray`: `bg-[#18181b]`
  - `light-ceramic`: `bg-[#f4f4f5]`
- Top floating action pill: `rounded-full border border-white/[0.12] bg-[#12141a]/90 backdrop-blur-md px-3 py-1.5 flex items-center gap-3`
  - Quick Install popover with copy button
  - Zen / Fullscreen toggle (`isZenMode`)
  - `</>` Code toggle button
- Bottom dock surface switcher: 3 dots (`size-3.5 rounded-full ring-offset-2 ring-offset-[#0c0c0e]` when selected)

### R3. Left Sidebar Index Drawer (`components/detail/sidebar.tsx`)
- Collapsible aside: `w-64 border-r border-white/[0.08] bg-[#0c0c0e]/95 flex flex-col`
- Header: `font-mono text-xs text-zinc-400 tracking-wider uppercase flex items-center justify-between`
- Group headers: `ACTIONS [2]`, `INPUTS [2]`, `SECURITY [1]` in `font-mono text-[10px] text-zinc-500 uppercase tracking-widest`
- Active link item: `bg-[#84ff00]/10 text-white border-l-2 border-[#84ff00]`
- Inactive item: `text-zinc-400 hover:text-white hover:bg-white/[0.03]`

### R4. Right Inspector Panel (`components/detail/inspector.tsx`)
- Aside container: `w-80 xl:w-96 border-l border-white/[0.08] bg-[#0c0c0e] overflow-y-auto`
- Mechanical description box: `bg-zinc-950/60 border border-white/[0.06] p-3 rounded-lg font-mono text-xs text-zinc-400`
- Props Table: Monospace table with `border border-white/[0.06] divide-y divide-white/[0.06]`
- Install tabs: `flex items-center gap-1 border-b border-white/[0.08] font-mono text-xs` (`npm`, `pnpm`, `yarn`, `bun`)
- Expandable Source Code accordion: `springMechanical` reveal, line numbering, syntax formatting, 1-click copy button
- License Notice: `font-mono text-[11px] text-zinc-500 border-t border-white/[0.08] pt-4`

### R5. Dynamic Controller Route (`src/app/components/[slug]/page.tsx`)
- `generateStaticParams()` mapping the 5 slugs
- `generateMetadata()` setting dynamic titles: `${comp.name} | Peel UI`
- Dynamic layout integrating `Sidebar`, `Stage`, and `Inspector` with responsive breakpoint adaptation (`lg:flex-row flex-col`).

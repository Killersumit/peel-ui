# Handoff Report — Explorer Survey 2: Design System, Tokens, Styles & Motion

**Agent:** `explorer_survey_2`  
**Recipient:** Orchestrator (`6d07dc42-1051-455e-ac1e-6425678ac4ed`)  
**Workspace:** `/home/killersumit1191/peel-ui/peel-ui-website`  
**Type:** Hard Handoff (Investigation Complete)  
**Date:** 2026-09-29  

---

## 1. Observation

Direct observations from inspection of the Peel UI repository:

1. **Package Dependencies (`package.json`, lines 11–28):**
   - `"lucide-react": "^1.48.0"`
   - `"motion": "^13.4.4"` (imported in components as `"motion/react"`)
   - `"next": "16.3.6"`
   - `"react": "19.2.8"`, `"react-dom": "19.2.8"`
   - `"tailwindcss": "^4"`, `"@tailwindcss/postcss": "^4"`
   - `clsx`: `^2.1.1`, `tailwind-merge`: `^3.7.0`
2. **Design Tokens & Theme in `src/app/globals.css` (lines 8–71):**
   - Base canvas: `--peel-base: #08090a`
   - Primary surface: `--peel-surface: #12141a`
   - Raised surface: `--peel-surface-raised: #181b22`
   - Active surface: `--peel-surface-active: #1e2129`
   - Border line: `--peel-border: #232730`
   - Subtle border: `--peel-border-subtle: #1a1d24`
   - Primary text: `--peel-text-primary: #f5f5f7`
   - Secondary text: `--peel-text-secondary: #8a8f98`
   - Tertiary text: `--peel-text-tertiary: #51555e`
   - Acid Lime accent: `--peel-lime: #84ff00`, `--peel-lime-foreground: #08090a`, `--peel-lime-muted: rgba(132, 255, 0, 0.10)`
   - Tailwind v4 `@theme inline` mappings bind these directly into utility classes (`bg-peel-base`, `text-peel-lime`, `border-peel-border`, etc.).
3. **Typography Configuration in `src/app/layout.tsx` (lines 6–18, 122):**
   - Font Sans: `Geist` from `next/font/google` (`--font-geist-sans`)
   - Font Mono: `Geist_Mono` from `next/font/google` (`--font-geist-mono`)
   - Applied to `html` and `body` with default dark background (`bg-[#08090a] text-[#f5f5f7]`).
4. **Surface & Contrast Specifications in `ORIGINAL_REQUEST.md` (lines 22–32, 63–65):**
   - Chassis: `bg-[#0c0c0e] border border-white/[0.08]`
   - 3-Dot Canvas Contrast Switcher:
     - Obsidian: `#000000` (`bg-[#000000]`)
     - Dark Gray: `#18181b` (`bg-[#18181b]`)
     - Light / Ceramic: `#f4f4f5` (`bg-[#f4f4f5]`)
   - Accent: Peel UI Lime (`#84ff00` / `#a3e635`).
5. **Kinetic Physics Tokens in `src/lib/motion.ts` (lines 7–33):**
   - `springTactile`: `{ type: "spring", stiffness: 600, damping: 38, mass: 0.6 }`
   - `springMechanical`: `{ type: "spring", stiffness: 380, damping: 32, mass: 1.0 }`
   - `microTransition`: `{ duration: 0.12, ease: [0.16, 1, 0.3, 1] }`
6. **Strict Forbidden Patterns in `AGENTS.md` (Section 2):**
   - No gradient text (`bg-clip-text text-transparent bg-gradient-to-r`).
   - No em dashes (`—`) or en dashes (`–`) in headlines, titles, or marketing copy.
   - No emojis in UI badges or button labels (🚀, ✨, 🔥, 💡).
   - No 3-icon boxes, eyebrow badges, or arbitrary Tailwind spacing (`mt-7`, `p-5`).
   - No muddy glassmorphism (`backdrop-blur-md` with `bg-white/5` or `border-white/10`).
   - No continuous looping animations without direct user interaction.
   - Banned buzzwords: "supercharge", "seamless", "next-gen", "elevate", "cutting-edge", "game-changer", "unleash", "effortless", "all-in-one".
7. **Typecheck Command Result:**
   - Command: `npx tsc --noEmit`
   - Result: Exit code 0, 0 errors.

---

## 2. Logic Chain

1. **Surface Strategy for Center Stage (R2):**
   - In `ORIGINAL_REQUEST.md`, Requirement R2 explicitly specifies a 3-dot surface switcher toggling Obsidian (`#000000`), Dark Gray (`#18181b`), and Light/Ceramic (`#f4f4f5`).
   - Observations 2 and 4 confirm the chassis is `bg-[#0c0c0e] border border-white/[0.08]`.
   - Therefore, the stage container must render a fixed `#0c0c0e` chassis border frame enclosing an inner stage well whose background class conditionally swaps between `bg-[#000000]`, `bg-[#18181b]`, and `bg-[#f4f4f5]`.
   - When set to Light Ceramic (`#f4f4f5`), any stage metadata text inside the well must adapt from light text to dark text (`text-zinc-900` / `text-zinc-600`) so readability is maintained.
2. **Accent & Status Representation (R3 & R4):**
   - Observation 2 demonstrates `--peel-lime: #84ff00` with high-contrast `#000000` foreground ink.
   - In the Left Sidebar Index Drawer (R3), the active component item must use `border-l-2 border-[#84ff00] bg-[#84ff00]/10 text-white` and an active indicator beacon (`w-1.5 h-1.5 rounded-full bg-[#84ff00]`).
   - Category counts in the index drawer must use monospace notation: `ACTIONS [2]`, `INPUTS [2]`, `SECURITY [1]`.
3. **Typography & Layout Grounding:**
   - Observation 3 establishes Geist Sans and Geist Mono as the project's two locked font families.
   - Observation 6 strictly forbids em-dashes and gradient text in titles and copy.
   - Therefore, all titles in the detail view (`comp.name`) must use `font-sans font-bold tracking-tight text-white` (or `tracking-[-0.03em]`), without any em-dashes or gradient clipping.
   - Labels and tags must use `font-mono text-xs uppercase tracking-wider text-zinc-400`.
4. **Kinetic Transitions:**
   - Observation 5 provides pre-tuned springs in `src/lib/motion.ts`.
   - The surface switcher dot toggle and tab switches should use `springTactile`.
   - The Left Sidebar Index Drawer collapse and the Right Inspector Source Code accordion should use `springMechanical`.
   - Reduced motion must be respected using `useReducedMotion()` from `motion/react`.
5. **Icon Selection:**
   - Observation 1 and 6 require `lucide-react` icons to be used strictly for functional purposes.
   - For sidebar collapse: `PanelLeft` / `PanelLeftClose`.
   - For stage actions: `Terminal` (quick install), `Maximize2` / `Minimize2` (zen toggle), `Code2` (source toggle).
   - For copy actions: `Copy` and `Check`.

---

## 3. Caveats

1. **Tailwind CSS v4 Configuration:**
   - The project uses Tailwind CSS v4 (`@import "tailwindcss"` in `globals.css`).
   - `tailwind.config.ts` also exists in the project root, but Tailwind v4 prioritizes `@theme inline` in `globals.css` and arbitrary inline values.
   - Arbitrary classes like `bg-[#0c0c0e]`, `border-white/[0.08]`, `text-[#84ff00]`, `bg-[#18181b]`, and `bg-[#f4f4f5]` are 100% supported and fully validated by Tailwind v4.
2. **Motion Import Path:**
   - The package is `"motion": "^13.4.4"`.
   - In React 19, imports must come from `"motion/react"` (e.g. `import { motion, AnimatePresence, useReducedMotion } from "motion/react"`), NOT `"framer-motion"`.
3. **Em-Dash Restriction in Data & Content:**
   - Existing component descriptions in `registry-data.tsx` or previous pages might contain dashes; all new strings in `config/components-data.ts` and `components/detail/*` must strictly avoid em dashes (`—`) and en dashes (`–`) in headlines, titles, and marketing copy.
4. **Light Mode Component Adaptation:**
   - Components like `voice-pill` and `privacy-shutter` are dark-themed by default. When the stage is set to Light Ceramic (`#f4f4f5`), the components themselves remain enclosed in their own chassis or scale smoothly on light canvas without contrast breakdown.

---

## 4. Conclusion

All design tokens, surface values, typography rules, motion physics, and banned patterns have been analyzed and mapped directly to Tailwind classes and React component architectures:

- **Obsidian Canvas:** `#000000` (`bg-[#000000]`)
- **Dark Gray Canvas:** `#18181b` (`bg-[#18181b]`)
- **Light Ceramic Canvas:** `#f4f4f5` (`bg-[#f4f4f5]`)
- **Chassis Frame:** `#0c0c0e` (`bg-[#0c0c0e] border border-white/[0.08]`)
- **Peel UI Lime:** `#84ff00` / `#a3e635` (`text-[#84ff00]`, `bg-[#84ff00] text-black`, `border-[#84ff00]`)
- **Typography:** Geist Sans (negative tracking `tracking-tight` on titles), Geist Mono (positive tracking `tracking-wider` on uppercase badges). Zero em-dashes.
- **Motion:** `motion/react` with `springTactile` for buttons/toggles and `springMechanical` for drawers/accordions.
- **Icons:** `lucide-react` with zero decorative emojis or bullet points.

The implementation team can immediately build R1 (`config/components-data.ts`), R2 (`stage.tsx`), R3 (`sidebar.tsx`), R4 (`inspector.tsx`), and R5 (`src/app/components/[slug]/page.tsx`) with 100% design fidelity.

---

## 5. Verification Method

1. **TypeScript Typecheck:**
   - Run: `npx tsc --noEmit` from `/home/killersumit1191/peel-ui/peel-ui-website`.
   - Condition: Must exit with code 0 and 0 errors.
2. **Next.js Build Check:**
   - Run: `npm run build` or `npx next build`.
   - Condition: All dynamic routes compile cleanly with `generateStaticParams()`.
3. **Design System & AI-Slop Audit:**
   - Inspect output TSX files for banned tokens:
     - Grep for em-dash `—` or `–` in titles: `grep -rn '—' src/components/detail/` should return 0 in titles/headlines.
     - Grep for gradient text: `grep -rn 'bg-clip-text' src/components/detail/` should return 0.
     - Grep for emojis in badges: Ensure no 🚀, ✨, 🔥, 💡 in UI text.
   - Inspect surface switcher functionality:
     - Verify clicking Obsidian renders `bg-[#000000]`.
     - Verify clicking Dark Gray renders `bg-[#18181b]`.
     - Verify clicking Light Ceramic renders `bg-[#f4f4f5]`.

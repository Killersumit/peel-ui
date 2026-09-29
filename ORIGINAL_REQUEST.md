# Original User Request

## Initial Request — 2026-09-29T05:15:38Z

Build the unified, production-grade Component Detail View for Peel UI with a responsive 3-pane creative workstation layout on desktop and stacked card flow on mobile, driven by a single dynamic route `src/app/components/[slug]/page.tsx` and central typed registry.

Working directory: /home/killersumit1191/peel-ui/peel-ui-website
Integrity mode: development

## Requirements

### R1. Central Component Registry (`config/components-data.ts`)
Create a strongly-typed data file containing full metadata for all 5 real Peel UI components:
- `slide-to-confirm` (Actions)
- `magnetic-split-button` (Actions)
- `tactile-otp-input` (Inputs)
- `voice-pill` (Inputs)
- `privacy-shutter` (Security)

Each record must include `slug`, `name`, `category`, `description`, `dependencies`, `interactionType`, `props` (name, type, description, default), `installCmd` (`npm`, `pnpm`, `yarn`, `bun`), `usageCode`, and the exact raw `sourceCode` string.

### R2. Interactive Center Stage (`components/detail/stage.tsx`)
A massive chassis (`bg-[#0c0c0e] border border-white/[0.08]`) that dynamically loads and displays the live interactive component.
- Floating bottom dock: 3-dot surface/theme switcher toggling Obsidian (`#000000`), Dark Gray (`#18181b`), and Light/Ceramic (`#f4f4f5`) canvas contrast.
- Top floating action pill: Quick install popover, Zen/fullscreen toggle (collapsing side panels), and `</>` code toggle.
- Pinned viewport on mobile (`h-[45vh] min-h-[340px]`).

### R3. Left Sidebar Index Drawer (`components/detail/sidebar.tsx`)
- Collapsible on desktop via top bar icon button (`PanelLeft` / `LayoutGrid`), slide-over drawer on mobile.
- Lists all 5 components categorized under `ACTIONS`, `INPUTS`, and `SECURITY`.
- Monospace category indexing and active status indicator in Peel UI Lime (`#84ff00` / `#a3e635`). Direct routing to `/components/[slug]`.

### R4. Right Inspector Panel (`components/detail/inspector.tsx`)
- Header: Category, Title, description, dependencies badge (e.g. `motion`, `lucide-react`).
- Interaction type mechanical description.
- Interactive Props Table: `PROP`, `TYPE`, `DESCRIPTION` with monospace typography.
- Multi-package manager install snippet tabs (`npm`, `pnpm`, `yarn`, `bun`) with 1-click copy.
- "How to Use" code block with copy button.
- Expandable Full Source Code accordion with line numbers, code styling, and 1-click copy.
- License notice: "MIT License. Free to use in personal and commercial projects. Built for Peel UI."

### R5. Dynamic Controller Route (`src/app/components/[slug]/page.tsx`)
- Single dynamic route controller replacing static boilerplate.
- Implements `generateStaticParams()` returning all 5 slugs.
- Implements `generateMetadata()` for dynamic SEO titles and OpenGraph tags.
- Handles not-found gracefully.

---

## Acceptance Criteria

### Functionality & Routing
- [ ] No duplicate per-component page files; all 5 components resolve cleanly under `/components/[slug]`.
- [ ] Dynamic routes `/components/slide-to-confirm`, `/components/magnetic-split-button`, `/components/tactile-otp-input`, `/components/voice-pill`, and `/components/privacy-shutter` render live, interactive components.
- [ ] Clicking any component in the index drawer immediately switches the route and active state.

### Interactive Workstation Experience
- [ ] Surface switcher in the bottom dock live-toggles the stage between Obsidian, Dark Gray, and Light Ceramic contrast backgrounds.
- [ ] Zen toggle expands stage to full viewport width by collapsing sidebar and inspector.
- [ ] Source code accordion smoothly toggles and copy button accurately copies the component's full TSX source.
- [ ] Install tabs correctly switch between npm, pnpm, yarn, and bun commands.

### Design System Fidelity & Quality
- [ ] Strict Peel UI aesthetic: Pure Black `#000000`, card chassis `#0c0c0e`, hairline borders `border-white/[0.08]`, and Acid Lime accent (`#84ff00` / `#a3e635`). Zero generic external color palettes.
- [ ] Fully responsive: 3-pane desktop workstation collapses into stacked mobile stream (Stage on top, Inspector cards below).
- [ ] `npx tsc --noEmit` passes with 0 type errors.

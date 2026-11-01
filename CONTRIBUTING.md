# Contributing to Peel UI

Thank you for your interest in contributing to **Peel UI**. Every component in this registry is built around a strict standard: tactile hardware-inspired surfaces, 120fps compositor-thread motion, and zero visual bloat.

Please read this guide before opening an Issue or Pull Request.

---

## 1. Local Development Setup

```bash
# 1. Clone the repository
git clone [https://github.com/Killersumit/peel-ui.git](https://github.com/Killersumit/peel-ui.git)
cd peel-ui

# 2. Install dependencies
npm install

# 3. Start the Vite development server
npm run dev

```

Key directories in the project:

* `src/registry/primitives/` — Self-contained `.tsx` source files for each UI primitive.
* `src/registry/index.ts` — Master registry metadata, prop specifications, dependencies, and raw code strings.
* `scripts/build-registry.mjs` — Generates static `shadcn` CLI payloads in `public/r/<slug>.json` and `public/r/registry.json`.

---

## 2. The Peel UI Design & Engineering Bar

Pull requests for new components or refactors must follow these five rules:

1. **0.5-Second Silhouette & Zero Wrapper Slop:**
* A user should understand what the component does immediately from its silhouette and motion.
* Do not wrap components inside extra bordered cards, fake dashboard chrome, or duplicate theme/reset bars—the Peel UI workspace stage already provides `[ Dark | Light ]` and `[ Reset ]` controls.


2. **120fps Compositor-Only Motion:**
* Animate **only** `transform` (`x`, `y`, `scale`, `rotate`) and `opacity`.
* Never animate layout-thrashing CSS properties (`height`, `width`, `margin`, `padding`, `top`, `left`) or heavy live filters (`filter: blur()`).
* Use interruptible springs (`motion/react` `type: "spring"`) or `gsap` timelines so rapid mid-animation clicks never stutter or jump.


3. **Surface & Color Restraint:**
* Support clean `dark` (anodized carbon `#08090A` / `#16171A` with subtle top specular highlights) and `light` (warm editorial paper `#F5F3EF` / `#E6E1D8` with `#1C1917` ink) stage themes.
* Avoid generic neon gradients, bluish slate defaults (`slate-800`), or screaming `UPPERCASE` telemetry labels.


4. **Numeric & Typographic Stability:**
* Apply `tabular-nums` to all counters, timers, and numeric readouts so digits never jitter horizontally during state changes.


5. **Accessibility & Input Honesty:**
* Respect `useReducedMotion()` from `motion/react`.
* Maintain keyboard navigability (`focus-visible` rings and `aria-label` on icon-only controls).



---

## 3. Adding or Updating a Component

If you are fixing a bug in an existing primitive or proposing a new one:

1. **Build the Primitive:**
Create or update `src/registry/primitives/<slug>.tsx`. Ensure it is self-contained, exports clean TypeScript props, and mounts with sensible default props.
2. **Register in `src/registry/index.ts`:**
* Make sure `dependencies` accurately lists only the packages actually imported by the component (e.g., `["motion", "@phosphor-icons/react"]` or `["gsap", "lucide-react"]`).
* Ensure `leadPitch` and `interactionNotes` accurately describe the component's real animation engine (`Motion` vs `GSAP`).
* Update the raw `code` string so the Workspace **Code** tab matches the `.tsx` file.


3. **Build the Registry & Verify Zero Warnings:**
Always run both commands before committing:
```bash
npx oxlint src --deny-warnings
npm run build

```


*(Note: `npm run build` automatically executes `node scripts/build-registry.mjs && tsc -b && vite build`, regenerating `public/r/<slug>.json` and `public/r/registry.json`.)*

---

## 4. Submitting a Pull Request

* Keep each Pull Request focused on a single component or bug fix.
* Include a short screen recording (`.mp4` or `.gif`) or before/after screenshots when modifying visual components or animations.
* Do not include AI co-author trailers or unrelated formatting churn in your commits.

Questions or want to discuss a component concept before building it? Reach out on X at [@Sumit1476136](https://x.com/Sumit1476136).

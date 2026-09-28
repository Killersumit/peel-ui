# COMPONENT_INGESTION.md — Ingestion, De-Slopping & Registry Architecture

## 1. THE INGESTION PHILOSOPHY

External component registries (shadcn/ui, Aceternity UI, Magic UI, 21st.dev, Rare UI, Aceternity) offer valuable mechanical interaction logic, but almost universally suffer from **visual mode collapse**:
* Low-contrast dark mode with muddy glassmorphism (`backdrop-blur-md bg-white/5`).
* Bloated dependencies (unnecessary heavy canvas packages, audio decoders, unoptimized particles).
* Generic rounded pill containers (`rounded-2xl` or `rounded-3xl`) with arbitrary gradient borders.
* Placeholder copy filled with corporate buzzwords ("Supercharge your workflow").

### The Golden Rule of Ingestion
**External components are raw mechanical schematics, not finished visual artifacts.**
Never paste third-party component code directly into `components/ui/`. Every component must pass through the mandatory 5-Stage Ingestion Pipeline detailed below before integration.

---

## 2. THE 5-STAGE DE-SLOPPING PIPELINE

```
┌─────────────────┐     ┌──────────────────┐     ┌──────────────────────┐
│  Raw External   │ ──> │ Stage 1: Strip   │ ──> │ Stage 2: Transmute   │
│  Component Code │     │ "Foreign DNA"    │     │ Tokens & Radii       │
└─────────────────┘     └──────────────────┘     └──────────────────────┘
                                                            │
┌─────────────────┐     ┌──────────────────┐               ▼
│ High-Craft UI   │ <── │ Stage 5: Domain  │ <── ┌──────────────────────┐
│ Production Unit │     │ Microcopy Inject │     │ Stage 3 & 4: Physics │
└─────────────────┘     └──────────────────┘     │ & Typographic Layout │
                                                 └──────────────────────┘
```

### Stage 1: Forensic Stripping (Purging Foreign DNA)
Inspect the external source code and immediately delete:
1. **Background Canvases & Global Listeners:** Strip out all full-page canvas background renderers, mouse spotlight trails, and unthrottled `window.addEventListener('mousemove')` scripts.
2. **Glassmorphism Clutter:** Delete all `backdrop-blur-*`, `bg-white/5`, `bg-white/10`, and thin neon gradient borders (`border-gradient-*` or `border-purple-500/20`).
3. **Decorative Bullet Icons:** Remove all arbitrary Lucide icons (`<Sparkles />`, `<Rocket />`, `<Zap />`, `<Check />`) embedded as visual bullets in feature cards.
4. **Third-Party Wrapper Dependencies:** If the component pulls in extra npm dependencies for trivial CSS tasks (e.g., `tailwind-merge` clones, unneeded canvas libraries), refactor them down to native React, standard SVG primitives, and standard Motion transitions.

### Stage 2: Spatial & Border Transmutation
Map all arbitrary geometry directly into the discrete token system defined in `DESIGN_SYSTEM.md`:
* **Radius Purge:**
  * Replace `rounded-2xl`, `rounded-3xl`, and `rounded-full` with the active archetype tokens:
    * *Archetype A (Swiss Grid):* `rounded-none`
    * *Archetype B (Telemetry):* `rounded-none` or `rounded-sm` (2px max)
    * *Archetype C (Neobrutalism):* `rounded-none`
    * *Archetype D (Tactile Hardware):* `rounded-sm` or `rounded-md` (max 6px) with 1px milled bevels
* **Hairline Border Unification:**
  * Replace floating `gap-6` card layouts with unified hairline border-collapse containers:
    ```tsx
    // BANNED: Loose floating cards with arbitrary gap
    <div className="flex gap-6 p-6">...</div>

    // MANDATORY: Interlocking hairline borders
    <div className="grid grid-cols-1 md:grid-cols-12 -space-x-px border border-[var(--border-structural)] bg-[var(--bg-canvas)]">...</div>
    ```
* **Color Re-anchoring:**
  * Replace all hardcoded colors (`bg-neutral-900`, `text-zinc-400`, `border-gray-800`) with the active project CSS variables (`var(--bg-surface)`, `var(--text-secondary)`, `var(--border-structural)`).

### Stage 3: Kinetic Recalibration (Spring Physics Enforcement)
Never allow default cubic-bezier floats, infinite pulsing loops, or sluggish scroll animations.
* Replace any raw `transition={{ duration: 0.5, ease: "easeInOut" }}` with standard tactile springs imported from `@/lib/motion`:
  ```typescript
  import { springTactile, springMechanical } from "@/lib/motion";
  ```
* Enforce accessibility guards using `useReducedMotion()` on all animated components.

### Stage 4: Typographic & Spatial Measure Alignment
* **Header Reset:** Eliminate all gradient text (`bg-clip-text text-transparent bg-gradient-to-r`). Headlines must be solid high-contrast ink (`text-[var(--text-primary)]`).
* **Telemetry Readouts:** For cards and modules, add technical metadata headers (e.g., coordinate tags, micro status dots, component IDs).
* **Measure Constraints:** Clamp descriptive paragraphs to a strict line-length: `max-w-[55ch]` or `max-w-[65ch]`.

### Stage 5: Domain Microcopy Rewrite
Replace all placeholder marketing copy with cold, functional, technical specifications:
* ❌ *Before:* "Empower your workflow with lightning-fast AI infrastructure built for developers."
* ✅ *After:* "Sub-12ms vector serialization across 8 localized memory nodes. Zero-allocation runtime."

---

## 3. TRANSFORMATION PLAYBOOK: BEFORE & AFTER

### Example 1: The Ubiquitous "Spotlight Bento Card"
Below is a real-world transformation demonstrating how a typical AI-slop component from public registries is re-architected into a precision industrial telemetry card.

#### ❌ The Banned Template Version (The Slop)
```tsx
// BANNED IMPLEMENTATION: Muddy glassmorphism, gradient text, arbitrary spacing, emojis
export function SlopCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="relative rounded-2xl border border-white/10 bg-white/5 p-7 backdrop-blur-md shadow-2xl hover:border-purple-500/50 transition-all duration-300">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white mb-4">
        ✨
      </div>
      <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-400 leading-relaxed">
        {desc}
      </p>
      <button className="mt-5 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-xs font-semibold text-white shadow-lg shadow-purple-500/20">
        Learn More &rarr;
      </button>
    </div>
  );
}
```

#### ✅ The Ingested High-Craft Version (Architected for Archetype A / B)
```tsx
// INGESTED SPECIFICATION: Hairline structural borders, telemetry markers, tactile springs
"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { springTactile } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface SpecCardProps extends React.HTMLAttributes<HTMLDivElement> {
  specId: string;
  label: string;
  metricValue: string;
  metricUnit: string;
  description: string;
  status?: "NOMINAL" | "ACTIVE" | "IDLE";
}

export const SpecCard = React.forwardRef<HTMLDivElement, SpecCardProps>(
  ({ className, specId, label, metricValue, metricUnit, description, status = "NOMINAL", ...props }, ref) => {
    const shouldReduceMotion = useReducedMotion();

    return (
      <div
        ref={ref}
        className={cn(
          "group relative flex flex-col justify-between border border-[var(--border-structural)] bg-[var(--bg-surface)] p-6 transition-colors duration-150 hover:bg-[var(--bg-surface-elevated)]",
          className
        )}
        {...props}
      >
        {/* Top Telemetry Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-structural)] pb-3 font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
          <span className="flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 bg-[var(--accent)]" />
            REF // {specId}
          </span>
          <span className="text-[var(--text-mono-label)]">STATUS: {status}</span>
        </div>

        {/* Primary Content Stage */}
        <div className="my-6">
          <p className="font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)]">
            {label}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-mono text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
              {metricValue}
            </span>
            <span className="font-mono text-xs text-[var(--text-tertiary)]">
              {metricUnit}
            </span>
          </div>
          <p className="mt-3 max-w-[45ch] text-xs leading-relaxed text-[var(--text-secondary)]">
            {description}
          </p>
        </div>

        {/* Bottom Tactile Trigger Action */}
        <div className="flex items-center justify-between border-t border-[var(--border-structural)] pt-4">
          <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-tertiary)]">
            SYS_SPEC.V4
          </span>
          <motion.button
            whileTap={shouldReduceMotion ? undefined : { y: 1 }}
            transition={springTactile}
            className="flex items-center gap-2 border border-[var(--border-structural)] bg-[var(--bg-canvas)] px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-wider text-[var(--text-primary)] transition-colors hover:border-[var(--text-primary)] hover:bg-[var(--bg-surface-active)]"
          >
            EXECUTE
            <span className="inline-block text-[var(--accent)]">→</span>
          </motion.button>
        </div>
      </div>
    );
  }
);

SpecCard.displayName = "SpecCard";
```

---

## 4. REGISTRY ARCHITECTURE & EXPORT STANDARDS

To maintain a clean, CLI-installable registry (mirroring `shadcn` and `rare-ui`), every ingested component must conform to these packaging rules:

### 4.1 Zero-Dependency Isolation
* Every component residing in `components/ui/[name].tsx` must be completely autonomous.
* Allowed local imports:
  * `@/lib/utils` (for `cn` utility)
  * `@/lib/motion` (for standardized spring physics tokens)
* Banned local imports:
  * Relative asset paths (`../../assets/logo.png`)
  * Other sibling components from `components/ui/` unless formally registered as a compound dependency in `registry.json`.

### 4.2 The Registry Entry Schema
Every completed component must register an entry in `registry.json` matching the official CLI distribution schema:

```json
{
  "name": "spec-card",
  "type": "registry:ui",
  "dependencies": ["framer-motion", "clsx", "tailwind-merge"],
  "registryDependencies": [],
  "files": [
    {
      "path": "components/ui/spec-card.tsx",
      "type": "registry:ui",
      "target": "components/ui/spec-card.tsx"
    }
  ]
}
```

### 4.3 The Live Showcase Harness Pattern
For every component published to the library showcase, pair it with a companion demo in `components/demos/[name]-demo.tsx`.

The documentation frame must feature:
1. **Interactive Stage:** The live rendered component running in an isolated viewport with responsive breakpoints (`mobile`, `tablet`, `desktop`).
2. **Terminal Install Readout:** The exact CLI install command (`npx shadcn add @your-org/ui/[name]`).
3. **Props Documentation Table:** A strictly typed data table listing every prop, type, default value, and architectural role.

---

## 5. PRE-COMMIT DE-SLOPPING AUDIT CHECKLIST

Before marking any ingested component as complete or committing it to the repository, pass it through this strict binary checklist. **If any single item fails, the component cannot be accepted:**

- [ ] **No Unchecked Border Radii:** Are all `rounded-xl`, `rounded-2xl`, and `rounded-3xl` stripped and converted to the active design token?
- [ ] **Zero Glassmorphism:** Has all `backdrop-blur-*` and `bg-white/5` translucency been replaced with solid surfaces and hairline borders?
- [ ] **Flat Ink Typography:** Are all gradient text classes (`bg-clip-text text-transparent`) removed in favor of solid high-contrast ink?
- [ ] **No Italic Serif Fluff:** Is the component free of random italic serif accent words?
- [ ] **Zero Emojis:** Are all emojis removed from headings, badges, and action triggers?
- [ ] **Bounded Measure:** Are all paragraph line measures capped at `max-w-[55ch]`?
- [ ] **Snappy Physics:** Are all Motion transitions mapped to `springTactile` or `springMechanical` with `useReducedMotion()` guards?
- [ ] **No Floating Gaps:** Does the component support hairline border collapse rather than loose, ungrounded margins?
- [ ] **Clean TypeScript:** Are props completely typed with comprehensive JSDoc annotations and clean `React.forwardRef` support?
# DESIGN.md — Folded Ribbon v2 Tokens, Fibonacci Spatial System & Squircle Specs (Peel UI v0.2.0)

> **System Version:** `v0.2.0` (Vite + Tailwind CSS v4 + `motion/react`)
> **Aesthetic Identity:** Anodized Neutral Carbon, Perceptual Lightness Steps ($L^*$), Concentric Machined Squircles & Critically Damped Physics.

---

## 1. SPATIAL MATHEMATICS & CONCENTRIC GEOMETRY

### 1.1 Discrete Fibonacci Spatial Scale (`8px` Base Unit)
Never invent random spacing utilities. Use this strict progression across all layouts:

| Token | Value | Tailwind Utility | Usage |
| :--- | :--- | :--- | :--- |
| `space-1` | `4px` | `p-1`, `gap-1` | Toolbar interior padding, micro-dot offsets |
| `space-2` | `8px` | `p-2`, `gap-2` | Pill icon gaps, compact dock padding |
| `space-3` | `12px / 16px` | `p-3`, `p-4`, `gap-4` | Outer workspace viewport frame (`p-3`), catalog grid gap (`gap-4`) |
| `space-4` | `20px / 24px` | `p-5`, `p-6`, `gap-6` | Catalog card padding (`p-5`), SpecPanel rhythm |
| `space-5` | `32px / 40px` | `p-8`, `p-10`, `gap-10` | Stage interior padding, category section breaks |
| `space-6` | `56px / 64px` | `py-14`, `py-16`, `gap-16` | Major section separations |
| `space-7` | `88px / 96px` | `py-24` | Editorial visual breaks |

### 1.2 Concentric Squircle Radius Table ($R_{\text{inner}} = R_{\text{outer}} - \text{Padding}$)

| Component Surface | Outer Radius ($R_{\text{outer}}$) | Padding ($P$) | Inner Radius ($R_{\text{inner}}$) |
| :--- | :--- | :--- | :--- |
| **Workspace Stage / Code Inspector** | `rounded-[28px]` | `12px` (`p-3`) | `rounded-[16px]` (Corner triggers) |
| **Catalog Preview Card** | `rounded-[24px]` | `20px` (`p-5`) | `rounded-[8px]`–`rounded-[12px]` |
| **Bottom Playground Dock** | `rounded-[20px]` | `6px` (`p-1.5`) | `rounded-[14px]` (`Replay`) / `rounded-[10px]` (Swatches) |
| **Top-Right Workspace Toolbar** | `rounded-[18px]` | `4px` (`p-1`) | `rounded-[14px]` (`Install` & icon buttons) |
| **3-Island Top Navbar Capsules** | `rounded-full` (`9999px`) | `4px` (`p-1`) | `rounded-full` (`9999px`) |

---

## 2. TYPOGRAPHIC SCALE & FONT PAIRING

### 2.1 Font Stack (`index.html` / `src/index.css`)
* **`--font-sans`:** `'Switzer'`, `'Satoshi'`, `'Aspekta'`, or `'Inter Display'` (`font-feature-settings: "cv02", "cv03", "cv04", "cv11"`).
* **`--font-mono`:** `'Commit Mono'`, `'Geist Mono'`, or `'JetBrains Mono'` (`font-variant-numeric: tabular-nums`).

### 2.2 Modular Scale & Opacity Contrast

| Role | Size | Weight | Tracking | Leading | Color / Opacity |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`micro-label`** | `11px` (`0.6875rem`) | `500` | `0.08em` (uppercase) | `1.0` | `var(--peel-text-tertiary)` (`#52555A`) |
| **`mono-badge`** | `12px` (`0.75rem`) | `400/500` | `-0.01em` | `1.0` | `var(--peel-text-mono)` (`#A1A5AA`) |
| **`ui-compact`** | `13px` (`0.8125rem`) | `500` | `-0.015em` | `1.25` | `var(--peel-text-primary)` (`#F5F5F7`) |
| **`body-sm`** | `14px` (`0.875rem`) | `400` | `-0.01em` | `1.6` | `var(--peel-text-secondary)` (`#8E9299`) |
| **`pitch-lead`** | `25px` (`1.5625rem`) | `500` | `-0.025em` | `1.32` | `var(--peel-text-primary)` (`#F5F5F7`) |
| **`display-hero`** | `clamp(2.6rem, 4.4vw, 4.75rem)` | `500` | `-0.045em` | `0.97` | Clause 1: `100%` `#F5F5F7` · Clause 2: `46%` `#F5F5F7` |

---

## 3. FOLDED RIBBON v2 COLOR SYSTEM & CSS UTILITIES (`src/index.css`)

Instantiate this exact stylesheet in `src/index.css`:

```css
@import "tailwindcss";

:root {
  /* Perceptual Lightness (L*) Neutral Carbon Steps (De-Blued Folded Ribbon v2) */
  --peel-well: #050607;             /* L* ~3%: Carved recessed slot / track */
  --peel-base: #08090A;             /* L* ~5%: Primary viewport canvas void */
  --peel-surface: #111214;          /* L* ~8%: Raised squircle stage & dark card */
  --peel-surface-raised: #17181B;   /* L* ~11%: Interactive pills, buttons & keycaps */
  --peel-surface-active: #1E2024;   /* L* ~14%: Hover / active surface state */

  /* Light-Mode Contrast Cards (Used on ~15% of Catalog Grid Cards for Rhythm) */
  --peel-light-surface: #F4F4F6;
  --peel-light-raised: #FFFFFF;
  --peel-light-well: #E5E7EB;
  --peel-light-text: #090A0C;
  --peel-light-muted: #686C75;

  /* Whisper-Quiet Hairlines */
  --peel-border: rgba(255, 255, 255, 0.065);
  --peel-border-subtle: rgba(255, 255, 255, 0.04);
  --peel-border-focus: #F5F5F7;

  /* Luminance Typography Hierarchy */
  --peel-text-primary: #F5F5F7;
  --peel-text-secondary: #8E9299;
  --peel-text-tertiary: #52555A;
  --peel-text-mono: #A1A5AA;

  /* 2% Hardware Signal Accents */
  --peel-lime: #84FF00;
  --peel-lime-foreground: #050607;
  --peel-coral: #FF553E;
  --peel-sky: #38BDF8;
  --peel-success: #34D399;
  --peel-danger: #FF453A;
}

body {
  background-color: var(--peel-base);
  color: var(--peel-text-primary);
  font-feature-settings: "cv02", "cv03", "cv04", "cv11";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
}

/* 0ms GPU Hardware Surface Classes */
.bevel-machined {
  background-color: var(--peel-surface);
  border: 1px solid var(--peel-border);
  box-shadow:
    inset 0px 1px 0px 0px rgba(255, 255, 255, 0.075),
    inset 0px -1px 0px 0px rgba(0, 0, 0, 0.65),
    0px 4px 12px -2px rgba(0, 0, 0, 0.45);
}

.well-recessed {
  background-color: var(--peel-well);
  box-shadow:
    inset 0px 2px 4px 0px rgba(0, 0, 0, 0.78),
    inset 0px 0px 0px 1px var(--peel-border-subtle),
    0px 1px 0px 0px rgba(255, 255, 255, 0.04);
}

.glass-specular {
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.11) 0%,
    rgba(255, 255, 255, 0.025) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow:
    inset 0px 1px 0px 0px rgba(255, 255, 255, 0.24),
    0px 10px 24px -6px rgba(0, 0, 0, 0.55);
}
```

---

## 4. CRITICALLY DAMPED SPRING PRESETS (`src/lib/motion.ts`)

All springs are calibrated to the human-vision critical damping sweet spot ($\zeta \in [0.88, 0.98]$):

```typescript
import type { Transition } from "motion/react";

/** zeta = 0.979 — Zero-overshoot tactile snap for buttons, pills & CLI morph */
export const springTactile: Transition = {
  type: "spring",
  stiffness: 520,
  damping: 36,
  mass: 0.65,
};

/** zeta = 0.915 — Mechanical drawer & Golden Ratio workspace split */
export const springMechanical: Transition = {
  type: "spring",
  stiffness: 360,
  damping: 32,
  mass: 0.85,
};

/** zeta = 0.884 — Smooth follow-through for card fanning & stage resets */
export const springGentle: Transition = {
  type: "spring",
  stiffness: 240,
  damping: 26,
  mass: 0.9,
};

/** Architectural cursor-parallax spring for ambient hero light */
export const springAmbient = {
  stiffness: 65,
  damping: 24,
  mass: 1.1,
};
```
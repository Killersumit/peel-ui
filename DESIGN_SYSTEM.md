# DESIGN_SYSTEM.md — Spatial Mathematics, Color Systems & Kinetic Physics

## 1. THE MATHEMATICAL SPATIAL ENGINE

### 1.1 The Golden Ratio & Baseline Unit
All spatial dimensions, container divisions, and grid gutters are derived from an 8px base unit multiplied across a discrete Fibonacci progression, or structured around the Golden Ratio:

$$\phi = \frac{1 + \sqrt{5}}{2} \approx 1.6180339887$$

### 1.2 The Discrete Fibonacci Spatial Token Matrix
Do not invent arbitrary Tailwind spacing (`p-5`, `gap-7`, `top-[22px]`). Every layout dimension must reference these standardized tokens:

| Token Key | Dimension | Tailwind Utility | Semantic Role |
| :--- | :--- | :--- | :--- |
| `space-1` | 4px | `p-1`, `gap-1` | Micro-alignments, dot indicators, hairline offsets |
| `space-2` | 8px | `p-2`, `gap-2` | Icon containers, tag padding, button micro-gaps |
| `space-3` | 13px / 16px | `p-4`, `gap-4` | Input padding, compact card interior spacing |
| `space-4` | 21px / 24px | `p-6`, `gap-6` | Standard card body padding, modular grid gaps |
| `space-5` | 34px / 40px | `p-10`, `gap-10` | Bento subdivisions, modal padding, component boundaries |
| `space-6` | 55px / 64px | `py-16`, `gap-16` | Standard section gaps, hero sub-elements |
| `space-7` | 89px / 96px | `py-24` | Major section vertical padding, editorial visual breaks |
| `space-8` | 144px | `py-36` | Landmark page transitions, monumental hero offsets |

### 1.3 Asymmetric Grid Partitioning (Non-Symmetrical Division)
Major page sections and content partitions must never be split evenly ($50\% / 50\%$ or $33.3\% / 33.3\% / 33.3\%$) unless presenting dense tabular records. Layouts must employ asymmetric visual tension:

*   **Golden Ratio Split:**
    $$\text{Primary Column} = 61.8\%, \quad \text{Secondary Column} = 38.2\%$$
    Tailwind mapping: `grid-cols-12` where the primary pane spans `col-span-12 lg:col-span-7` or `col-span-8`, and the secondary pane spans `col-span-12 lg:col-span-5` or `col-span-4`.
*   **The Command-and-Telemetry Split:**
    $$\text{Telemetry Aside} = 280\text{px (Fixed)}, \quad \text{Canvas / Workspace} = \text{calc}(100\% - 280\text{px})$$
*   **Hairline Border-Collapse Composition:**
    Instead of floating cards separated by loose whitespace, structure showcase modules with zero-gap borders:
    ```tsx
    <div className="grid grid-cols-1 md:grid-cols-12 border border-neutral-800 divide-y md:divide-y-0 md:divide-x divide-neutral-800 bg-neutral-950">
      <div className="col-span-1 md:col-span-7 p-6 lg:p-10">...</div>
      <div className="col-span-1 md:col-span-5 p-6 lg:p-10">...</div>
    </div>
    ```

---

## 2. TYPOGRAPHIC MATRIX & FLUID SCALING

### 2.1 The Typographic Scale
Typographic progression is based on a Major Third ($1.250$) or Augmented Fourth ($1.414$) modular scale:

$$S_n = S_0 \times r^n$$

Where $S_0 = 16\text{px}$ (base body) and $r = 1.250$:

| Level | Size (rem / px) | Tracking | Leading | Target Usage |
| :--- | :--- | :--- | :--- | :--- |
| **`caption`** | `0.6875rem` (11px) | `tracking-[0.12em]` | `leading-none` | Technical mono data, status indicators, hardware labels |
| **`mono-label`** | `0.75rem` (12px) | `tracking-[0.08em]` | `leading-tight` | Metadata tags, telemetry readouts, table headers |
| **`body-sm`** | `0.875rem` (14px) | `tracking-[-0.01em]` | `leading-relaxed` | Secondary explanations, form labels, parameter descriptions |
| **`body-base`** | `1.000rem` (16px) | `tracking-normal` | `leading-[1.65]` | Primary reading measure, technical documentation copy |
| **`heading-sm`** | `1.250rem` (20px) | `tracking-[-0.02em]` | `leading-snug` | Section subheadings, card titles, drawer headers |
| **`heading-md`** | `1.562rem` (25px) | `tracking-[-0.03em]` | `leading-tight` | Module headers, showcase display titles |
| **`heading-lg`** | `1.953rem` (31px) | `tracking-[-0.04em]` | `leading-none` | Major section title, landmark header |
| **`display-hero`** | Fluid Formula below | `tracking-[-0.05em]` | `leading-[0.95]` | Monumental hero statement (flat color, solid ink) |

### 2.2 Fluid Display Hero Formula (CSS Clamp)
Never set static pixel values for monumental display headlines. Use responsive clamp formulations that adapt smoothly between mobile ($390\text{px}$) and wide desktop ($1440\text{px}$):

```css
/* Display Hero Calculation: min 2.5rem (40px), max 5.5rem (88px) */
font-size: clamp(2.5rem, 1.6rem + 3.8vw, 5.5rem);
letter-spacing: -0.05em;
line-height: 0.95;
```

### 2.3 Strict Measure Enforcement (Prose Width)
Body paragraphs and descriptive text must never be left unconstrained. Limit line length to prevent visual fatigue:
* Monospace readouts & code: `max-w-[70ch]`
* Standard descriptive copy: `max-w-[55ch]` (equivalent to Tailwind `max-w-prose`)

---

## 3. COLOR PALETTES & TONAL CONTRAST MATRICES

Never mix palettes within the same project. Choose ONE and instantiate these exact CSS variables in `app/globals.css`.

### Palette A: Precision Monolith (High-Tech Industrial Dark)
Designed for technical tools, CLI registries, code showcases, and hardware telemetry.

```css
:root {
  --bg-canvas: #080808;
  --bg-surface: #0f0f0f;
  --bg-surface-elevated: #161616;
  --bg-surface-active: #1e1e1e;
  
  --border-structural: #1a1a1a;
  --border-subtle: #262626;
  --border-focus: #eeeeee;

  --text-primary: #f0f0f0;
  --text-secondary: #888888;
  --text-tertiary: #525252;
  --text-mono-label: #a3a3a3;

  --accent: #e2fe52;           /* Acid Electrum */
  --accent-foreground: #080808;
  --accent-muted: rgba(226, 254, 82, 0.12);

  --danger: #ff4336;
  --success: #00e599;          /* Telemetry Green */
}
```

### Palette B: International Typographic (Swiss Architectural Light)
Designed for editorial projects, typographic design portfolios, and rigorous documentation.

```css
:root {
  --bg-canvas: #f6f6f2;        /* Warm Paper / Bone */
  --bg-surface: #ffffff;
  --bg-surface-elevated: #eaeae5;
  --bg-surface-active: #dfdfd9;

  --border-structural: #111111; /* Unapologetic structural ink lines */
  --border-subtle: #dcdcd6;
  --border-focus: #111111;

  --text-primary: #111111;
  --text-secondary: #5a5a56;
  --text-tertiary: #8c8c87;
  --text-mono-label: #383835;

  --accent: #ff3e00;           /* International Klein Safety Vermilion */
  --accent-foreground: #ffffff;
  --accent-muted: rgba(255, 62, 0, 0.1);

  --danger: #d90429;
  --success: #007f5f;
}
```

### Palette C: Obsidian & Milled Aluminum (Tactile Hardware)
Designed for physical-computing aesthetics, synth/audio tools, and dense mechanical interfaces.

```css
:root {
  --bg-canvas: #0c0d0e;
  --bg-surface: #131518;
  --bg-surface-elevated: #1a1d22;
  --bg-surface-active: #22262d;

  --border-structural: #252a32;
  --border-subtle: #1c2027;
  --border-focus: #ff9500;

  --text-primary: #ebeef2;
  --text-secondary: #7f8a96;
  --text-tertiary: #4c5561;
  --text-mono-label: #9aa7b5;

  --accent: #ff9500;           /* Industrial Amber */
  --accent-foreground: #0c0d0e;
  --accent-muted: rgba(255, 149, 0, 0.15);

  --danger: #ff453a;
  --success: #32d74b;
}
```

---

## 4. TACTILE SURFACE & SHADOW ARCHITECTURE

### 4.1 Banned Shadow Patterns
- ❌ Do NOT use generic blurry ambient drops: `shadow-lg`, `shadow-2xl`, `shadow-indigo-500/20`.
- ❌ Do NOT apply colorful radial glow shadows under buttons or cards.

### 4.2 Approved Shadow Formulations

#### Technique 1: Hard Offset Ink Shadow (Neobrutalism / Swiss Heavy)
Crisp, unblurred physical drop shadow simulating paper layered over metal:
```css
/* Class: shadow-ink-sm */
box-shadow: 2px 2px 0px 0px var(--border-structural);

/* Class: shadow-ink-md */
box-shadow: 4px 4px 0px 0px var(--border-structural);

/* Class: shadow-ink-lg */
box-shadow: 8px 8px 0px 0px var(--border-structural);
```

#### Technique 2: Directional Machined Bevel (Tactile Hardware)
Creates optical depth using a microscopic 1px specular top highlight and a 1px ambient bottom occlusion:
```css
/* Class: bevel-machined */
box-shadow: 
  inset 0px 1px 0px 0px rgba(255, 255, 255, 0.08),  /* Specular top highlight */
  inset 0px -1px 0px 0px rgba(0, 0, 0, 0.6),        /* Bottom lip shadow */
  0px 2px 4px -1px rgba(0, 0, 0, 0.4);              /* Grounding shadow */
```

#### Technique 3: Recessed Mechanical Wells (Inset Inputs / Enclosures)
Simulates carved physical chassis slots for toggles, indicators, and input fields:
```css
/* Class: well-recessed */
box-shadow: 
  inset 0px 2px 4px 0px rgba(0, 0, 0, 0.6),
  inset 0px 0px 0px 1px var(--border-structural);
background-color: #050505;
```

---

## 5. KINETIC MOTION DYNAMICS (PHYSICS TOKENS)

Motion must always reflect mass, velocity, and mechanical contact. Never use linear or generic cubic-bezier floats.

### 5.1 Physics Spring Configurations
Import and apply these exact configurations across all `motion` components:

```typescript
// @/lib/motion.ts
import { Transition } from "framer-motion";

/**
 * High-stiffness tactile spring for buttons, tabs, switches, segmented controls.
 * Zero perceptual latency; immediate response with crisp physical settle.
 */
export const springTactile: Transition = {
  type: "spring",
  stiffness: 600,
  damping: 38,
  mass: 0.6,
};

/**
 * Mechanical reveal spring for drawers, dropdown menus, and expanding bento modules.
 */
export const springMechanical: Transition = {
  type: "spring",
  stiffness: 380,
  damping: 32,
  mass: 1.0,
};

/**
 * Precise micro-interaction transition for hover borders, color shifts, and tooltips.
 */
export const microTransition = {
  duration: 0.12,
  ease: [0.16, 1, 0.3, 1], // easeOutExpo
};
```

### 5.2 Accessibility Rule (Prefers Reduced Motion)
Every motion component must cleanly degrade:
```tsx
import { useReducedMotion, motion } from "framer-motion";

export function TactilePanel({ children }: { children: React.ReactNode }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springMechanical}
    >
      {children}
    </motion.div>
  );
}
```

---

## 6. COMPONENT TOKEN MAPPING & BLUEPRINTS

### 6.1 Buttons
Buttons are physical triggers, not pill-shaped text links.

*   **Primary Action Trigger:**
    *   Padding: `px-4 py-2` (Micro-Fibonacci `8px` vertical, `16px` horizontal)
    *   Radius: `rounded-none` or `rounded-sm` (2px max)
    *   Surface: `bg-[var(--accent)] text-[var(--accent-foreground)]`
    *   Border: `border border-transparent`
    *   Typography: `font-mono text-xs uppercase tracking-wider font-semibold`
    *   Active State: `active:translate-y-[1px]` or `active:scale-[0.98]`
*   **Secondary Chassis Trigger:**
    *   Surface: `bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)]`
    *   Border: `border border-[var(--border-structural)] hover:border-[var(--border-subtle)]`
    *   Typography: `font-mono text-xs uppercase tracking-wider text-[var(--text-primary)]`

### 6.2 Bento Cells & Component Enclosures
*   Never pad cards unevenly.
*   Enforce shared perimeter hairlines:
    ```tsx
    <div className="group relative border border-[var(--border-structural)] bg-[var(--bg-surface)] p-6 lg:p-8 flex flex-col justify-between">
      {/* Top Telemetry Row */}
      <div className="flex items-center justify-between font-mono text-[10px] text-[var(--text-tertiary)] uppercase tracking-widest border-b border-[var(--border-structural)] pb-3 mb-6">
        <span>LOC // 0x48A</span>
        <span className="inline-block w-1.5 h-1.5 bg-[var(--accent)]" />
      </div>

      {/* Main Interactive Stage */}
      <div className="flex-1 my-4">
        {/* Live Component Render */}
      </div>

      {/* Meta Readout Footer */}
      <div className="pt-4 border-t border-[var(--border-structural)] font-mono text-xs text-[var(--text-secondary)]">
        COMPONENT_SPEC.v1
      </div>
    </div>
    ```

### 6.3 Monospace Telemetry Badges
Never use pastel pills with shiny icons. Use structured technical readouts:
```tsx
<span className="inline-flex items-center gap-2 px-2 py-0.5 border border-[var(--border-structural)] bg-[var(--bg-canvas)] font-mono text-[11px] text-[var(--text-mono-label)] tracking-wider uppercase">
  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
  SYS_READY [200_OK]
</span>
```
# RULES.md — Psychophysical Optical Math, Anti-Slop & 120fps GPU Laws (Peel UI v0.2.0)

> **Enforcement Level:** MANDATORY HARD CONSTRAINTS
> Every component, layout, and animation in **Peel UI v0.2.0** must obey these psychophysical human-vision laws and anti-slop rules. Any violation must be rejected.

---

## 1. THE 2026 "ANTI-SLOP" KILL LIST (ZERO TOLERANCE)

### 1.1 Banned Layout & Visual Clichés
* ❌ **NO 2-Column "Text Left, Demo Box Right" Hero Templates:** Never place a UI component card or demo box in the hero section.
* ❌ **NO Centered SaaS Pyramids:** Never stack a top pill badge $\rightarrow$ centered H1 $\rightarrow$ centered subtitle $\rightarrow$ 2 buttons $\rightarrow$ 3 icon boxes.
* ❌ **NO Fake Telemetry or Bracket Clutter:** Strictly ban decorative labels like `LOC // 0x48A`, `SYS_READY [200_OK]`, `01 — OPEN QUERY`, `SPRING 420 / 28`, `TACTILE REGISTRY [11]`, or `[ ↑ TOP ]`.
* ❌ **NO Warm Cream/Beige/Terracotta Palettes:** Colors like `#F5F3EF`, `#FAF8F5`, warm stone, and burnt orange are strictly banned.
* ❌ **NO Neon Gradients or Bluish-Slate Mud:** Ban purple/indigo/cyan gradients, `bg-slate-800/900`, colored drop shadows, and harsh `4px` neobrutalist offset shadows.
* ❌ **NO Italic Serif Word Injections:** Never italicize or recolor a single word inside a headline (`Instrument Serif`, `Playfair Display`, etc. are banned).

### 1.2 Sacred Original Primitives (Immutable Read-Only Spec)
* 🔒 **`src/registry/primitives/**` IS SACRED AND READ-ONLY:** Never run color replacements, border removals, or theme modifications inside `src/registry/primitives/**`. Every primitive's built-in `Light`/`Dark` theme toggles and color options (`Acid Lime`, `Ink`, `Coral`, `Teal`, etc.) must remain 100% untouched.

---

## 2. PSYCHOPHYSICAL OPTICAL MATH (HUMAN VISION LAWS)

Computers calculate in linear coordinates, but the human retina and visual cortex perceive space, curvature, and brightness **logarithmically**. Always apply Optical Math over raw linear math:

### 2.1 The $-3\%$ Optical Gravity Law (Vertical Centering)
A box placed at the exact mathematical vertical center ($50\%$) appears to sag downward because human eyes scan from top to bottom.
* **Rule:** Place focal stages, hero compositions, and preview primitives at the **Optical Center ($46.5\%\text{–}47\%$ from top)** by making bottom padding slightly larger than top padding (e.g., `pt-10 pb-14` or `translate-y-[-3%]`).

### 2.2 Visual Rivalry & Asymmetric Ratios ($1 : 1.618$)
Splitting any screen $50\% / 50\%$ traps the human eye in **visual rivalry** where neither half feels dominant.
* **Rule:** Use asymmetric Golden Ratio partitioning ($\approx 60\% / 40\%$, or `col-span-7` Stage vs `col-span-5` Companion in a 12-column grid) so the eye immediately knows where the primary focal mass lives.

### 2.3 $G^2$ Curvature Continuity & Concentric Squircle Law
Standard circular `border-radius` creates an abrupt curvature jump from $\kappa = 0$ (flat line) to $\kappa = 1/r$ (circle), producing a visible optical seam at the tangent point.
* **Rule 1:** Use smooth squircle radii across all enclosures (`rounded-[28px]` stages, `rounded-[24px]` catalog cards, `rounded-[20px]` docks).
* **Rule 2 (Concentric Equation):** Nested containers must share the exact same center of curvature:
  $$R_{\text{inner}} = \max\left(4\text{px},\; R_{\text{outer}} - \text{Padding}\right)$$
  *(Example: A `rounded-[20px]` dock with `6px` (`p-1.5`) padding requires `rounded-[14px]` inner buttons).*

### 2.4 The $-1.5\text{px}$ Optical Font-Pairing Law
At identical pixel sizes, monospace fonts (`Commit Mono`, `Geist Mono`) appear physically larger and wider than neo-grotesque sans-serif fonts (`Switzer`, `Inter Display`) due to their wider glyph advance and higher x-height.
* **Rule:** Always scale paired or inline monospace text down by **`1.5px to 2px`** relative to adjacent sans-serif text, and apply `tabular-nums` so numbers never jitter horizontally.

### 2.5 Weber-Fechner Perceptual Lightness ($L^*$) Law
The human eye is hyper-sensitive to small luminance changes in dark environments (Weber-Fechner Law) and perceives yellow-green (`555nm`) as nearly $4\times$ brighter than blue at equal RGB values.
* **Rule 1:** Never separate dark layers with bright chalky `1px` grey outlines. Separate surfaces using **3%–4% Perceptual Lightness ($L^*$) steps** (`#050607` Well $\rightarrow$ `#08090A` Base $\rightarrow$ `#111214` Stage $\rightarrow$ `#17181B` Pill $\rightarrow$ `#1E2024` Active) paired with a `1px` top specular highlight (`rgba(255, 255, 255, 0.07)`).
* **Rule 2 (The 93% / 5% / 2% Signal Ratio):** Keep 93% of pixels neutral carbon, 5% monochrome typography (`#F5F5F7` at `100%` and `48%` opacity), and restrict high-voltage `--peel-lime` (`#84FF00`) and `--peel-coral` (`#FF553E`) to **2% hardware indicators** (active dots, L-connectors, copy checkmarks, `NEW` badges).

---

## 3. THE 120FPS COMPOSITOR & HARMONIC DAMPING RATIO ($\zeta$) LAWS

Every animation in Peel UI must execute at a locked **120fps on integrated/mobile GPUs** and feel like physical hardware with real mass.

### 3.1 The Harmonic Damping Ratio Equation ($\zeta$)
Every spring in `motion/react` (`stiffness` $k$, `damping` $c$, `mass` $m$) is governed by the physical damping ratio:

$$\zeta = \frac{c}{2\sqrt{k \times m}}$$

* **BANNED ($\zeta < 0.72$ — Underdamped AI Slop Bounce):** Causes cheap, rubbery oscillation that makes UI feel like a cartoon.
* **BANNED ($\zeta > 1.15$ — Overdamped Drag):** Causes sluggish, muddy settling.
* **REQUIRED ($\zeta \in [0.85,\; 1.00]$ — Critically Damped Precision):**
  All Peel UI springs must fall between $\zeta = 0.85$ (slight tactile snap) and $\zeta = 1.00$ (zero-overshoot mechanical lock):
  - `springTactile` ($k=520, c=36, m=0.65 \implies \zeta = 0.979$): Instant, zero-wobble snap for buttons, pills, and toolbar morphs.
  - `springMechanical` ($k=360, c=32, m=0.85 \implies \zeta = 0.915$): Crisp structural slide for sidebars and workspace splits.
  - `springGentle` ($k=240, c=26, m=0.90 \implies \zeta = 0.884$): Smooth follow-through for card fanning and ambient resets.

### 3.2 Strict GPU Compositor Lock (Zero Main-Thread Lag)
1. **No `<canvas>` Redraw Loops or `setInterval` Timers:** Never run full-screen 2D `<canvas>` gradient repaints or `setInterval` typewriter loops that choke high-DPI GPUs.
2. **No React `useState` Inside Pointer Events:** Never call `setState` inside `onPointerMove` or `onMouseMove`. Bind continuous tracking exclusively to `useMotionValue`, `useSpring`, and `useTransform` so updates run in C++ on the compositor thread without re-rendering React.
3. **Animate ONLY `transform` and `opacity`:** Never animate `margin`, `padding`, `top`, `left`, `border-width`, or `filter: blur()`.
4. **Zero-Cost Specular Glass:** Instead of stacking heavy live `backdrop-filter: blur(24px)` on moving elements, use `.bevel-machined`, `.well-recessed`, and `.glass-specular` inset rim highlights (`0ms` GPU paint cost).
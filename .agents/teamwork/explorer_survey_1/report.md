# Peel UI Component Survey & Architecture Analysis Report

**Date:** 2026-09-29  
**Agent:** `explorer_survey_1` (Investigation & Synthesis)  
**Target:** Unified 3-Pane Workstation & Component Detail View (`/components/[slug]`)  
**Workspace:** `/home/killersumit1191/peel-ui/peel-ui-website`

---

## 1. Executive Summary & Category Taxonomy

Peel UI provides 5 core tactile primitives engineered with Swiss typography, physical hardware metaphors, and kinetic spring physics. Every component is completely self-contained in `src/components/ui/` (and mirrored in `components/ui/`) and registered in `registry.json` and `public/r/[slug].json`.

### Category Architecture Matrix

| Category | Slug | Title | Primary Interaction Mechanics | Dependencies |
| :--- | :--- | :--- | :--- | :--- |
| **`ACTIONS`** | `slide-to-confirm` | Slide to Confirm | Drag puck across constrained track, 75% magnetic latch pocket, elastic recoil return, pop confirmation | `motion/react`, `lucide-react`, `clsx`, `tailwind-merge` |
| **`ACTIONS`** | `magnetic-split-button` | Magnetic Split Button | Magnetic separation on hover, corner radius morphing, spring recoil, dropdown actions popover | `motion/react`, `lucide-react`, `clsx`, `tailwind-merge` |
| **`INPUTS`** | `tactile-otp-input` | Tactile OTP Input | Invisible native numeric input, floating lens focus ring (`layoutId`), mechanical digit tumblers | `motion/react`, `clsx`, `tailwind-merge` |
| **`INPUTS`** | `voice-pill` | Voice Pill | Expanding obsidian capsule, real-time Web Audio API FFT / simulated cadence, canvas waveform, slide-to-cancel | `lucide-react` *(zero framer-motion)* |
| **`SECURITY`** | `privacy-shutter` | Privacy Shutter | Physical sliding plate, 80% detent latch, spring peek, 1-click clipboard copy, keyboard toggling | `motion/react`, `lucide-react`, `clsx`, `tailwind-merge` |

---

## 2. Component Deep Dive

---

### 2.1 Slide to Confirm (`slide-to-confirm`)

- **Category:** `ACTIONS`
- **Component Name:** `Slide to Confirm`
- **Slug:** `slide-to-confirm`
- **File Paths:**
  - Source: `src/components/ui/slide-to-confirm.tsx` (identical to `components/ui/slide-to-confirm.tsx`)
  - Remote Registry JSON: `public/r/slide-to-confirm.json`
- **Exports:**
  - Component: `SlideToConfirm`
  - Types: `SlideToConfirmProps`

#### Props Specification Table

| Prop | Type | Default | Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| `label` | `string` | `"Slide to deploy"` | No | Label displayed inside track during idle/sliding state |
| `confirmedLabel` | `string` | `"Executed"` | No | Label displayed upon successful confirmation |
| `onConfirm` | `() => void` | `undefined` | No | Callback fired when slide passes 75% magnetic latch |
| `onReset` | `() => void` | `undefined` | No | Callback fired when puck resets back to idle position |
| `autoResetTimeout` | `number` | `0` | No | Milliseconds before auto-resetting back to idle (0 to disable) |
| `disabled` | `boolean` | `false` | No | Disables dragging and keyboard interaction |
| `className` | `string` | `undefined` | No | Additional classes applied to outer wrapper |

#### Kinetic Motion & Interaction Mechanics
1. **Dynamic Drag Boundary:** Calculated dynamically via `ResizeObserver` observing the track container: `maxDrag = Math.max(0, trackWidth - puckWidth(40px) - padding(12px))`.
2. **Zero-Lag Motion Value:** Uses `useMotionValue(0)` coordinate for 60/120fps hardware-accelerated drag without React rerender loops.
3. **75% Magnetic Gravity Pocket:** In `handleDragEnd`, if `currentX >= maxDrag * 0.75`, the puck magnetically snaps to `maxDrag`, enters `isConfirmed = true`, and fires `onConfirm()`.
4. **Elastic Recoil Spring:** If released below 75%, elastically recoils to `0` via `animate(x, 0, { type: "spring", stiffness: 450, damping: 35, mass: 0.8 })`.
5. **Dynamic Label Opacity & Fill:** `idleLabelOpacity` transforms from `1` to `0` as `x` travels from `0` to `75%`. The matte progress fill layer expands dynamically behind the puck.
6. **Confirmation Pop & Feedback:** Puck expands with `{ scale: [1, 1.12, 1] }`, turns Peel Acid Lime (`#84ff00`), and checkmark rotates into view. A subtle reset trigger ("Reset demo" with `RotateCcw`) mounts beneath.
7. **Accessibility & Keyboard:** Has `role="slider"`, `tabIndex={0}`, responds to `ArrowRight`, `Enter`, `Space` to execute, and `Enter`, `Space`, `Escape` to reset. Supports `useReducedMotion()`.

#### Installation Commands
- **npm:** `npx shadcn@latest add https://peelui.dev/r/slide-to-confirm.json`
- **pnpm:** `pnpm dlx shadcn@latest add https://peelui.dev/r/slide-to-confirm.json`
- **yarn:** `npx shadcn@latest add https://peelui.dev/r/slide-to-confirm.json`
- **bun:** `bunx --bun shadcn@latest add https://peelui.dev/r/slide-to-confirm.json`

#### Usage Code Snippet
```tsx
import { SlideToConfirm } from "@/components/ui/slide-to-confirm";

export default function SlideToConfirmDemo() {
  return (
    <SlideToConfirm
      label="Slide to deploy"
      confirmedLabel="Production Deployed"
      onConfirm={() => console.log("Action confirmed")}
      onReset={() => console.log("State reset to idle")}
      className="w-full max-w-[340px]"
    />
  );
}
```

---

### 2.2 Magnetic Split Button (`magnetic-split-button`)

- **Category:** `ACTIONS`
- **Component Name:** `Magnetic Split Button`
- **Slug:** `magnetic-split-button`
- **File Paths:**
  - Source: `src/components/ui/magnetic-split-button.tsx` (identical to `components/ui/magnetic-split-button.tsx`)
  - Remote Registry JSON: `public/r/magnetic-split-button.json`
- **Exports:**
  - Component: `MagneticSplitButton`
  - Types: `MagneticSplitButtonProps`, `MagneticSplitAction`

#### Props Specification Table

| Prop | Type | Default | Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| `defaultAction` | `string` | `"Deploy to prod"` | No | Initial selected primary action label |
| `actions` | `MagneticSplitAction[]` | `DEFAULT_ACTIONS` *(3 items)* | No | Dropdown secondary menu options array |
| `onAction` | `(actionLabel: string) => void` | `undefined` | No | Callback fired when primary button or menu item is clicked |
| `className` | `string` | `undefined` | No | Additional classes applied to container |

#### Nested Type: `MagneticSplitAction`
```typescript
export interface MagneticSplitAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
}
```
*Default actions: `staging` ("Deploy to Staging"), `preview` ("Create Preview Branch"), `rollback` ("Rollback Release").*

#### Kinetic Motion & Interaction Mechanics
1. **Resting Monolith State:** Primary action button and chevron dropdown button sit conjoined with a 1px hairline divider (`w-px h-4 bg-[#383838]`).
2. **Magnetic Separation:** When hovered or when dropdown menu opens (`isSeparated = isHovered || isMenuOpen`), primary button slides left `x: -4px` while its inner right border radii morph from `0px` to pill `9999px`. The chevron trigger slides right `x: +4px` while its left border radii morph to `9999px`.
3. **Divider Dissolve:** The central hairline divider collapses and fades out (`opacity: 0, scaleY: 0.3`).
4. **Spring Recoil Physics:** Smooth kinetic return using `springPhysics`: `{ type: "spring", stiffness: 450, damping: 28, mass: 0.8 }`.
5. **Tactile Trigger Feedback:** Clicking primary button switches the rocket icon to a Peel Lime Check (`#84ff00`, `stroke-[2.5]`) for 1200ms with spring pop (`stiffness: 500, damping: 25`).
6. **Integrated Dropdown:** Chevron button has individual hover scaling (`scale: 1.05`) and 180° rotation when opened. The menu smoothly emerges with spring reveal and auto-closes on outside clicks.
7. **Tactile Press Down:** Micro-interaction `whileTap={{ scale: 0.96 }}` on primary and `scale: 0.92` on chevron.

#### Installation Commands
- **npm:** `npx shadcn@latest add https://peelui.dev/r/magnetic-split-button.json`
- **pnpm:** `pnpm dlx shadcn@latest add https://peelui.dev/r/magnetic-split-button.json`
- **yarn:** `npx shadcn@latest add https://peelui.dev/r/magnetic-split-button.json`
- **bun:** `bunx --bun shadcn@latest add https://peelui.dev/r/magnetic-split-button.json`

#### Usage Code Snippet
```tsx
import { MagneticSplitButton } from "@/components/ui/magnetic-split-button";

export default function MagneticSplitButtonDemo() {
  return (
    <MagneticSplitButton
      defaultAction="Deploy to prod"
      onAction={(action) => console.log("Executed action:", action)}
    />
  );
}
```

---

### 2.3 Tactile OTP Input (`tactile-otp-input`)

- **Category:** `INPUTS`
- **Component Name:** `Tactile OTP Input`
- **Slug:** `tactile-otp-input`
- **File Paths:**
  - Source: `src/components/ui/tactile-otp-input.tsx` (identical to `components/ui/tactile-otp-input.tsx`)
  - Remote Registry JSON: `public/r/tactile-otp-input.json`
- **Exports:**
  - Component: `TactileOtpInput`
  - Types: `TactileOtpInputProps`

#### Props Specification Table

| Prop | Type | Default | Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| `length` | `number` | `4` | No | Number of digit slots in the OTP input |
| `initialValues` | `string[]` | `["3", "8", "1", ""]` | No | Initial preset values for live showcase display |
| `onComplete` | `(code: string) => void` | `undefined` | No | Callback fired when all slots are populated |
| `className` | `string` | `undefined` | No | Additional classes applied to container |

#### Kinetic Motion & Interaction Mechanics
1. **Invisible Native Host Input:** Utilizes an underlying transparent `<input>` (`type="text"`, `inputMode="numeric"`, `autoComplete="one-time-code"`, `pattern="[0-9]*"`) ensuring flawless mobile soft-keyboard invocation, clipboard paste handling, and native accessibility.
2. **Floating Lens Focus Frame:** A high-contrast 2px white focus border (`layoutId="floating-otp-lens"`) glides across slot squircles using layout spring physics (`stiffness: 500, damping: 32`).
3. **Mechanical Tumbler Transition:** Numerical digits flip into position vertically (`initial: y: -8, animate: y: 0, exit: y: 8`) with high-tension spring physics (`stiffness: 600, damping: 30`).
4. **Blinking Indicator Cursor:** Inside the active empty slot, a rounded vertical cursor bar pulses continuously (`animate-pulse`).
5. **Arrow Key Navigation & Direct Slot Selection:** Allows jumping left and right with keyboard arrow keys or clicking directly on any slot.

#### Installation Commands
- **npm:** `npx shadcn@latest add https://peelui.dev/r/tactile-otp-input.json`
- **pnpm:** `pnpm dlx shadcn@latest add https://peelui.dev/r/tactile-otp-input.json`
- **yarn:** `npx shadcn@latest add https://peelui.dev/r/tactile-otp-input.json`
- **bun:** `bunx --bun shadcn@latest add https://peelui.dev/r/tactile-otp-input.json`

#### Usage Code Snippet
```tsx
import { TactileOtpInput } from "@/components/ui/tactile-otp-input";

export default function TactileOtpDemo() {
  return (
    <TactileOtpInput
      length={4}
      initialValues={["", "", "", ""]}
      onComplete={(pin) => console.log("Verified PIN:", pin)}
    />
  );
}
```

---

### 2.4 Voice Pill (`voice-pill`)

- **Category:** `INPUTS`
- **Component Name:** `Voice Pill`
- **Slug:** `voice-pill`
- **File Paths:**
  - Source: `src/components/ui/voice-pill.tsx` (identical to `components/ui/voice-pill.tsx`)
  - Remote Registry JSON: `public/r/voice-pill.json`
- **Exports:**
  - Component: `VoicePill` (forward-ref button component)
  - Types: `VoicePillProps` (extends `React.ButtonHTMLAttributes<HTMLButtonElement>`)

#### Props Specification Table

| Prop | Type | Default | Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| `accentColor` | `string` | `"#84ff00"` | No | Waveform and status accent color (Peel Acid Lime) |
| `stopColor` | `string` | `"#ff553e"` | No | Color for active stop square and cancel indicator (Peel Coral) |
| `iconColor` | `string` | `"#a1a1aa"` | No | Idle microphone icon color |
| `background` | `string` | `"#101216"` | No | Capsule shell chassis background |
| `borderColor` | `string` | `"#232730"` | No | Hairline border stroke color |
| `size` | `number` | `32` | No | Idle height and width in pixels |
| `shape` | `"pill" \| "rounded"` | `"pill"` | No | Capsule corner geometry style |
| `reach` | `number` | `10` | No | Additional extension buffer when expanded |
| `showTime` | `boolean` | `true` | No | Whether to show monospace elapsed clock (`0:00`) |
| `waveform` | `boolean` | `true` | No | Whether to render the dynamic canvas audio waveform |
| `slideToCancel` | `boolean` | `true` | No | Enables horizontal slide-to-cancel drag physics |
| `cancelDistance`| `number` | `64` | No | Pixel distance dragged left before triggering cancel |
| `attack` | `number` | `40` | No | Waveform envelope attack time constant (ms) |
| `release` | `number` | `240` | No | Waveform envelope release decay constant (ms) |
| `sensitivity` | `number` | `1.2` | No | Audio input gain multiplier |
| `floor` | `number` | `0.12` | No | Minimum visible waveform bar height ratio |
| `openDuration` | `number` | `220` | No | Expansion transition duration in ms |
| `pressScale` | `number` | `0.96` | No | Scale transformation on pointer down |
| `mode` | `"auto" \| "hold" \| "toggle"` | `"auto"` | No | Trigger interaction mode |
| `holdAfter` | `number` | `300` | No | Milliseconds before tap transitions into a hold |
| `reactive` | `"simulated" \| "mic"` | `"mic"` | No | Audio source: real microphone or simulated speech |
| `disabled` | `boolean` | `false` | No | Disables recording triggers |
| `ariaLabel` | `string` | `"Voice Memo"` | No | Accessible label |
| `onStart` | `(info: { source: "simulated" \| "mic" }) => void` | `undefined` | No | Fired when voice recording starts |
| `onStop` | `(info: { reason: string; duration: number }) => void` | `undefined` | No | Fired when voice recording terminates |
| `className` | `string` | `""` | No | Additional styling classes |

#### Kinetic Motion & Interaction Mechanics
1. **Zero-Dependency Motion Engine:** Operates without `motion/react`! Uses native Web Audio API (`AudioContext`, `createMediaStreamSource`, `createAnalyser`), HTML5 Canvas (`requestAnimationFrame`), and hardware CSS variables (`--vp-slide`, `--vp-cancel`).
2. **Precision Acoustic Icon:** Features custom built-in SVG `ProCapsuleMic` with acoustic capsule head, mesh baffles, and machined handle. In listening state, morphs into a glowing coral stop jewel.
3. **Horizontal Expansion Kinematics:** Expands horizontally using cubic-bezier easing `cubic-bezier(0.16, 1, 0.3, 1)` over 220ms, revealing the audio waveform canvas and elapsed monospace timer.
4. **Dual Reactive Audio Engine:**
   - `hardware mic`: Queries `navigator.mediaDevices.getUserMedia({ audio: true })`, builds 256-bin FFT frequency analysis, gracefully falling back to simulated mode if permissions are denied.
   - `simulated`: Emulates authentic speech pauses using mathematical cadence modeling (`SYLLABLES` array with acoustic attack/release filters).
5. **DPR-Aware Canvas Equalizer:** Automatically scales for Retina displays (`devicePixelRatio`), maintaining an 80-frame audio buffer with rounded bars.
6. **Slide-to-Cancel Gesture:** On pointer drag left, computes pull distance relative to `cancelDistance: 64px`. If dragged past threshold, immediately cancels with reason `"cancel"`.
7. **Keyboard Accessible:** `Space` or `Enter` toggles recording; `Escape` aborts.

#### Installation Commands
- **npm:** `npx shadcn@latest add https://peelui.dev/r/voice-pill.json`
- **pnpm:** `pnpm dlx shadcn@latest add https://peelui.dev/r/voice-pill.json`
- **yarn:** `npx shadcn@latest add https://peelui.dev/r/voice-pill.json`
- **bun:** `bunx --bun shadcn@latest add https://peelui.dev/r/voice-pill.json`

#### Usage Code Snippet
```tsx
import { VoicePill } from "@/components/ui/voice-pill";

export default function VoicePillDemo() {
  return (
    <VoicePill
      size={40}
      reactive="simulated"
      onStart={(info) => console.log("Audio capture started:", info.source)}
      onStop={(info) => console.log(`Stopped (${info.reason}) after ${info.duration}ms`)}
    />
  );
}
```

---

### 2.5 Privacy Shutter (`privacy-shutter`)

- **Category:** `SECURITY`
- **Component Name:** `Privacy Shutter`
- **Slug:** `privacy-shutter`
- **File Paths:**
  - Source: `src/components/ui/privacy-shutter.tsx` (identical to `components/ui/privacy-shutter.tsx`)
  - Remote Registry JSON: `public/r/privacy-shutter.json`
- **Exports:**
  - Component: `PrivacyShutter`
  - Types: `PrivacyShutterProps`

#### Props Specification Table

| Prop | Type | Default | Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| `apiKey` | `string` | `"sk_live_51M0x9F4kL2026peel"` | No | Sensitive key or credential to conceal/reveal |
| `maskedKey` | `string` | `"sk_live_••••••••38f2"` | No | Masked representation displayed when shutter is shut |
| `label` | `string` | `"Production Key"` | No | Section header title label |
| `onCopy` | `(key: string) => void` | `undefined` | No | Callback fired when API key is copied to clipboard |
| `onToggleLock` | `(isLockedOpen: boolean) => void` | `undefined` | No | Callback fired when lock state toggles |
| `className` | `string` | `undefined` | No | Additional classes applied to outer container |

#### Kinetic Motion & Interaction Mechanics
1. **Physical Sliding Cover Plate:** Chamfered machined cover plate with top specular highlight (`before:bg-white/10`) and 3 vertical etched tactile grip ribs.
2. **Hardware Motion Coordinates:** Drag position tracked smoothly via `useMotionValue(0)` with zero React rerenders during drag motion.
3. **Dynamic Drag Travel:** Uses `ResizeObserver` on track element to calculate `maxDrag = Math.max(80, trackWidth - copyButton(44px) - gripTab(54px))`.
4. **Spring Peek vs. 80% Latch Detent:**
   - Dragging peeks at the unmasked secret in real-time.
   - If released before 80% (`threshold = maxDrag * 0.8`), elastically snaps shut (`snapShut`).
   - If dragged past 80%, latches open into locked state (`snapOpen`).
5. **Tactile Spring Physics:** `type: "spring", stiffness: 500, damping: 32, mass: 0.8`.
6. **Instant State Controls:**
   - Quick lock/unlock toggle button in the header (`Lock` / `Unlock` icons).
   - Clicking on the shutter plate while open snaps it shut.
7. **Integrated Clipboard Action:** Dedicated 32px copy button mounted on `z-30` triggers `navigator.clipboard.writeText(apiKey)` with 1500ms feedback state featuring Peel Lime checkmark and highlight border (`#84ff00`).
8. **Keyboard Navigation:** `Enter` or `Space` toggles lock; `ArrowRight` snaps open; `ArrowLeft` or `Escape` snaps shut.

#### Installation Commands
- **npm:** `npx shadcn@latest add https://peelui.dev/r/privacy-shutter.json`
- **pnpm:** `pnpm dlx shadcn@latest add https://peelui.dev/r/privacy-shutter.json`
- **yarn:** `npx shadcn@latest add https://peelui.dev/r/privacy-shutter.json`
- **bun:** `bunx --bun shadcn@latest add https://peelui.dev/r/privacy-shutter.json`

#### Usage Code Snippet
```tsx
import { PrivacyShutter } from "@/components/ui/privacy-shutter";

export default function PrivacyShutterDemo() {
  return (
    <PrivacyShutter
      label="Secret API Key"
      apiKey="sk_live_994827104928peel"
      maskedKey="sk_live_••••••••7104"
      onCopy={(key) => console.log("Copied key:", key)}
      onToggleLock={(open) => console.log("Shutter open state:", open)}
      className="w-full max-w-[440px]"
    />
  );
}
```

---

## 3. Central Registry Schema Blueprint (`config/components-data.ts`)

To satisfy requirement **R1**, the central registry must provide a strongly-typed data structure containing all metadata, props, install commands, usage code, live renderers, and exact raw source code strings.

### Recommended TypeScript Interface
```typescript
import * as React from "react";

export type ComponentCategory = "Actions" | "Inputs" | "Security";

export interface ComponentPropItem {
  name: string;
  type: string;
  description: string;
  default?: string;
  required?: boolean;
}

export interface ComponentInstallCommands {
  npm: string;
  pnpm: string;
  yarn: string;
  bun: string;
}

export interface ComponentDataRecord {
  slug: string;
  name: string;
  category: ComponentCategory;
  description: string;
  interactionType: string;
  dependencies: string[];
  props: ComponentPropItem[];
  installCmd: ComponentInstallCommands;
  usageCode: string;
  sourceCode: string;
  component: React.ComponentType;
  defaultSurfaceTheme?: "obsidian" | "dark" | "ceramic";
}
```

### Raw Source Code Integration Strategy
The raw TSX files in `src/components/ui/` are mirrored in `public/r/*.json` (under `files[0].content`). Embedding these strings directly in `config/components-data.ts` offers key architectural advantages:
1. **Zero Client Fetch Latency:** The Inspector panel can instantly render line numbers, syntax highlighting, and copy source code without async HTTP delays or loading spinners.
2. **Server-Side Renderable:** `generateStaticParams()` and Next.js SSR / SSG remain fully deterministic and statically optimizable.
3. **Type-Safe Export:** Downstream components can import typed metadata safely.

---

## 4. UI Architecture & Downstream Layout Compliance

### 4.1 Design System & Aesthetic Archetype
- **Archetype:** Archetype B (Industrial / High-Density Telemetry) blended with Archetype A (Swiss International Grid).
- **Core Tonal Palette:**
  - Base Obsidian: `#000000`
  - Card Chassis: `#0c0c0e`
  - Elevated Surface: `#141618`
  - Structural Hairlines: `border-white/[0.08]` (or `#232730`)
  - Accent (Peel Lime): `#84ff00` / `#a3e635`
  - Secondary Accent (Peel Warm Coral): `#ff553e`
  - Primary Typography: `#f5f5f7`
  - Secondary / Monospace: `#8a8f98` / `#9ea3ad`

### 4.2 Workstation 3-Pane Geometry (R2, R3, R4)
- **Left Sidebar Index Drawer (`components/detail/sidebar.tsx`):**
  - Desktop width: `w-64` to `w-72` (280px fixed telemetry aside).
  - Lists 3 categories: `ACTIONS` (2), `INPUTS` (2), `SECURITY` (1).
  - Active indicator in Peel Acid Lime `#84ff00`.
  - Desktop collapse toggle; slide-over drawer on mobile viewports.
- **Center Stage Chassis (`components/detail/stage.tsx`):**
  - Massive container: `bg-[#0c0c0e] border border-white/[0.08]`.
  - Floating bottom dock: 3-dot surface contrast switcher toggling:
    - Obsidian: `#000000`
    - Dark Gray: `#18181b`
    - Light / Ceramic: `#f4f4f5`
  - Top floating action pill: Quick install popover, Zen/fullscreen toggle (collapsing side panels), and `</>` code toggle.
  - Mobile responsiveness: Pinned stage viewport `h-[45vh] min-h-[340px]`.
- **Right Inspector Panel (`components/detail/inspector.tsx`):**
  - Desktop width: `w-80` to `w-96`.
  - Technical telemetry header with category tag, component title, description, and dependencies badges.
  - Mechanical interaction description.
  - Monospace Props Table (`PROP`, `TYPE`, `DESCRIPTION`, `DEFAULT`).
  - Package manager switcher tabs (`npm`, `pnpm`, `yarn`, `bun`) with 1-click clipboard copy.
  - "How to Use" implementation snippet.
  - Expandable source code accordion with line-numbered TSX display.
  - MIT License notice.
- **Dynamic Controller Route (`src/app/components/[slug]/page.tsx`):**
  - Implements `generateStaticParams()` returning `[{ slug: "slide-to-confirm" }, { slug: "magnetic-split-button" }, { slug: "tactile-otp-input" }, { slug: "voice-pill" }, { slug: "privacy-shutter" }]`.
  - Implements dynamic `generateMetadata()`.
  - Renders unified workstation layout with full desktop 3-pane and mobile stacked layout.

---

## 5. Verification & Health Status
- `npx tsc --noEmit`: Exited 0 with **0 type errors**.
- All 5 component files verified in `src/components/ui/` and `components/ui/`.
- All 5 JSON registries verified in `public/r/*.json`.

<div align="center">

<a href="https://peel-ui.vercel.app">
  <img src="public/peel-logo.png" width="88" alt="Peel UI Logo" />
</a>

# Peel UI

**Tactile React components, built around deliberate 120fps motion.**

[Live site](https://peel-ui.vercel.app) · [Components](https://peel-ui.vercel.app/components) · [Sponsors](https://peel-ui.vercel.app/sponsors) · [Follow on X](https://x.com/Sumit1476136)

<br />

[![License: MIT](https://img.shields.io/badge/License-MIT-84ff00?style=flat-square&labelColor=08090a)](LICENSE)
[![shadcn registry](https://img.shields.io/badge/shadcn-registry-84ff00?style=flat-square&labelColor=08090a)](https://ui.shadcn.com)
[![Motion + GSAP](https://img.shields.io/badge/Motion-GSAP-84ff00?style=flat-square&labelColor=08090a)](https://motion.dev)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-84ff00?style=flat-square&labelColor=08090a)](https://tailwindcss.com)

</div>

---

Peel UI is an open-source shadcn registry of React components that treat the screen like machined hardware: drag tracks with magnetic detents, critically damped springs instead of linear easing curves, and controls that settle instead of fade. Install a component and you own the code—there is no black-box package to depend on.

---

## Components

| Component | Install slug | Interaction |
| :--- | :--- | :--- |
| **Morphing Share Island** | `morphing-share-island` | Spring-morphing share pill fanning out into a 4-action radial dock with differential spring stagger and auto-reset confirmation. |
| **Save State Pill** | `save-state-pill` | Spring-morphing toolbar status capsule with offline queuing, error recovery, and relative timestamps. |
| **Skill Pile** | `skill-pile` | Rigid-body 2D physics tag stack driven by Matter.js with realistic gravity, mass, friction, and draggable impulse throwing. |
| **Slide to Confirm** | `slide-to-confirm` | Mechanical verification trigger with high-friction drag track and 75% magnetic snap pocket. |
| **Magnetic Split Button** | `magnetic-split-button` | Dual-capsule action trigger with proximity resistance and spring latching. |
| **Tactile OTP Input** | `tactile-otp-input` | Numeric verification code input with sliding focus box and mechanical digit roll. |
| **Tactile Filter Chips** | `filter-chips` | Hardware-inspired filter group supporting radio selection, multi-select, and spring-bound indicator morphing. |
| **Invite Field** | `invite-field` | Interactive teammate invitation field with real-time email tag chip tokenization and GSAP Flip layout morphing. |
| **Note Button** | `note-button` | Tactile floating notepad trigger expanding into a persistent, line-numbered code note sheet with keyboard management. |
| **Detent Tabs** | `detent-tabs` | Range switcher whose dynamic preview follows the user's thumb and snaps cleanly into magnetic detent positions. |
| **Layout Scrub** | `layout-scrub` | Continuous scrub control morphing card list layout into multi-column grid layout with spatial consistency. |
| **Privacy Shutter** | `privacy-shutter` | Security credential shroud with spring-loaded physical slider and automatic release peek cover. |
| **Cookie Consent** | `cookie-consent` | Quiet, respectful privacy choice card with zero telemetry tracking, keyboard navigation, and machined carbon shell. |
| **Moiré Field** | `moire-field` | Optical interference pattern canvas with dual rotating gratings, gentle falloff masks, and pointer tracking. |
| **Moiré Intro** | `moire-intro` | Full-screen atmospheric page loader with optical grating interference, mechanical lock settle, and slide exit. |
| **Skeleton Handoff** | `skeleton-handoff` | Measured loading blocks that travel directly into resolved content positions using GSAP Flip state transitions. |
| **Release Notes** | `release-notes` | Changelog timeline where monumental pinned version numerals roll smoothly into accent bands during scroll. |
| **Voice Pill** | `voice-pill` | Hardware voice capsule with real-time audio AnalyserNode frequency bars and slide-to-cancel physics. |
| **Waitlist Join** | `waitlist-join` | Tactile email capture card with layout-morphing confirmation, dynamic rank queue position, and instant social sharing. |
| **Next Up** | `next-up` | Setup checklist card focusing human attention on the single next actionable task with calm GSAP Flip reordering. |
| **Roadmap Vote** | `roadmap-vote` | Public feature backlog ranking list where items reorder with GSAP Flip when their vote tallies pass neighbours. |
| **Notification Inbox** | `notification-inbox` | Tactile notification bell trigger with unread badge counter roll and anchored glass inbox panel. |

---

## Install via `shadcn` CLI

Every component in Peel UI is distributed as an official shadcn registry item. You can install any primitive directly into your project using its hosted JSON endpoint:

```bash
npx shadcn@latest add https://peel-ui.vercel.app/r/slide-to-confirm.json
```

Works out of the box with your preferred package manager:

```bash
# pnpm
pnpm dlx shadcn@latest add https://peel-ui.vercel.app/r/slide-to-confirm.json

# bun
bunx --bun shadcn@latest add https://peel-ui.vercel.app/r/slide-to-confirm.json

# yarn
yarn dlx shadcn@latest add https://peel-ui.vercel.app/r/slide-to-confirm.json
```

### Optional: Configure `@peel-ui` Namespace

To install using short component slugs, add the Peel UI registry namespace to your project's `components.json`:

```json
{
  "registries": {
    "@peel-ui": "https://peel-ui.vercel.app/r/{name}.json"
  }
}
```

Now you can add components with clean shorthand:

```bash
npx shadcn@latest add @peel-ui/slide-to-confirm
npx shadcn@latest add @peel-ui/morphing-share-island
```

---

## Using with AI Coding Agents

Peel UI provides machine-readable specifications designed for AI coding agents:

- **Option 1 (`llms.txt` — Zero Setup):** Point Claude Code, Cursor, OpenCode, or Windsurf directly to [`https://peel-ui.vercel.app/llms.txt`](https://peel-ui.vercel.app/llms.txt), or click the **"Copy .md for LLMs"** button on any component workspace page to paste its complete TypeScript props, physics, and interaction specs into your chat.
- **Option 2 (`shadcn` MCP):** Once `@peel-ui` is configured in your `components.json`, initialize the shadcn MCP client in your agent:
  ```bash
  # Claude Code
  npx shadcn@latest mcp init --client claude

  # Cursor
  npx shadcn@latest mcp init --client cursor

  # VS Code / Windsurf
  npx shadcn@latest mcp init --client vscode
  ```
  Then ask your agent naturally:
  > *"Add @peel-ui/morphing-share-island and wire it to my card share button."*

---

## Sponsor Peel UI

Peel UI is 100% free and MIT-licensed. There are no paywalls, hidden tiers, or telemetry tracking.

Ongoing maintenance, physics tuning, and new component engineering are supported directly by our sponsors. If Peel UI saves your team engineering weeks or elevates your product craft, consider becoming a monthly sponsor:

- **Diamond Sponsor** ($500 / month) — Top placement across site hero, catalog header, and README.
- **Gold Sponsor** ($250 / month) — Prominent logo placement on website and component workspace.
- **Silver Sponsor** ($100 / month) — Named attribution across sponsors index and release notes.

View sponsorship tiers at [peel-ui.vercel.app/sponsors](https://peel-ui.vercel.app/sponsors), or reach out directly on [X (@Sumit1476136)](https://x.com/Sumit1476136) or via email at [killer1191x@gmail.com](mailto:killer1191x@gmail.com).

---

## Run Locally

```bash
# Clone repository
git clone https://github.com/killersumit/peel-ui.git
cd peel-ui

# Install dependencies
npm install

# Run dev server
npm run dev

# Re-generate public registry JSON endpoints
npm run registry:build

# Production build
npm run build
```

---

## License

[MIT License](LICENSE) — Free for personal, commercial, and client software.

Built by [@killersumit](https://github.com/killersumit) · [X (@Sumit1476136)](https://x.com/Sumit1476136)

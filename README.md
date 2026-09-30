<div align="center">
  <a href="https://peel-ui.vercel.app/">
    <img src="https://raw.githubusercontent.com/Killersumit/peel-ui/main/public/peel-logo.png" alt="Peel UI" width="144" />
  </a>

  <h1>Peel UI</h1>
  <p><strong>Tactile React components, built around deliberate motion.</strong></p>

  <p>
    <a href="https://peel-ui.vercel.app/">Showcase</a> ·
    <a href="https://github.com/Killersumit/peel-ui">Source</a> ·
    <a href="https://github.com/Killersumit/peel-ui/stargazers">Star the project</a> ·
    <a href="https://github.com/sponsors/Killersumit">Sponsor</a>
  </p>

  <p>
    <a href="https://github.com/Killersumit/peel-ui/blob/main/LICENSE">
      <img src="https://img.shields.io/badge/license-MIT-18181b?style=flat-square" alt="MIT License" />
    </a>
    <img src="https://img.shields.io/badge/Next.js-16-18181b?style=flat-square&logo=next.js&logoColor=white" alt="Next.js 16" />
    <img src="https://img.shields.io/badge/React-19-18181b?style=flat-square&logo=react&logoColor=61dafb" alt="React 19" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-4-18181b?style=flat-square&logo=tailwindcss&logoColor=38bdf8" alt="Tailwind CSS 4" />
    <img src="https://img.shields.io/badge/Motion-13-18181b?style=flat-square" alt="Motion 13" />
  </p>
</div>

---

Peel UI is an open-source collection of copy-ready React components. The library focuses on tactile controls, spring-driven transitions, and clear interaction feedback. Components are installed into your project with the shadcn CLI, so you own the code and can adapt it.

## Components

| Component | Install name | Interaction |
| --- | --- | --- |
| Save State Pill | `save-state-pill` | Save and sync status with offline, retry, and conflict states |
| Slide to Confirm | `slide-to-confirm` | Friction drag with a magnetic confirmation threshold |
| Magnetic Split Button | `magnetic-split-button` | Separated primary and secondary actions with a spring latch |
| Tactile PIN Field | `tactile-pin-field` | Numeric authentication input with a moving focus frame |
| Privacy Shutter | `privacy-shutter` | Drag-to-reveal control for sensitive values |
| Voice Pill | `voice-pill` | Audio capture control with a live waveform |

## Install

Every registry item supports both GitHub shorthand and the hosted JSON registry.

**GitHub shorthand**

```bash
npx shadcn@latest add Killersumit/peel-ui/save-state-pill
```

**Direct registry URL**

```bash
npx shadcn@latest add https://peel-ui.vercel.app/r/save-state-pill.json
```

Replace `save-state-pill` with any install name in the component table. For example:

```bash
npx shadcn@latest add Killersumit/peel-ui/slide-to-confirm
npx shadcn@latest add https://peel-ui.vercel.app/r/slide-to-confirm.json
```

The components use Motion and, where needed, Lucide icons. Install the shared dependencies in your app:

```bash
npm install motion lucide-react clsx tailwind-merge
```

The components that use `cn` expect the standard shadcn utility at `@/lib/utils`. If your project uses a different alias, update that import after installation.

## Usage

```tsx
import { SaveStatePill } from "@/components/ui/save-state-pill";

export function DocumentStatus() {
  return (
    <SaveStatePill
      state="saved"
      lastSavedAt={new Date()}
      onRetry={() => syncDocument()}
      onReviewConflict={() => openConflictReview()}
    />
  );
}
```

Set `state` to `idle`, `saving`, `saved`, `failed`, `offline`, or `conflict`. When the browser reports that it is offline, the pill shows the queued-changes state until connectivity returns.

## Registry development

The root `registry.json` is the manifest for GitHub shorthand installs. Build the hosted item files and index with:

```bash
npm run registry:build
```

The script embeds each component's source into `public/r/{name}.json` and writes `public/r/index.json`. The production build runs this step before Next.js:

```bash
npm run build
```

## Sponsorships

Peel UI accepts project support through [GitHub Sponsors](https://github.com/sponsors/Killersumit). For sponsorship or partnership enquiries, contact [Sumit on X](https://x.com/Sumit1476136).

## License

Peel UI is distributed under the [MIT License](LICENSE).

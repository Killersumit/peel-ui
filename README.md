This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev<div align="center">
  <br />
  <img src="https://raw.githubusercontent.com/Killersumit/peel-ui/main/public/peel-logo.png" alt="Peel UI Logo" width="160" />
  <br />
  <br />

  <h1>Peel UI</h1>
  <p><strong>Tactile, hardware-grade motion primitives for React & Tailwind CSS.</strong></p>

  <p>
    <a href="https://peelui.com">Live Showcase</a> ·
    <a href="https://github.com/Killersumit/peel-ui/stargazers">Star on GitHub</a> ·
    <a href="https://x.com/Sumit1476136">Follow on X</a> ·
    <a href="#sponsors--partnerships">Sponsor</a>
  </p>

  <p>
    <a href="https://github.com/Killersumit/peel-ui/blob/main/LICENSE">
      <img src="https://img.shields.io/badge/License-MIT-08090a?style=flat-square&color=18181b" alt="License" />
    </a>
    <img src="https://img.shields.io/badge/Next.js-15-08090a?style=flat-square&color=18181b" alt="Next.js" />
    <img src="https://img.shields.io/badge/TailwindCSS-v3%2Fv4-08090a?style=flat-square&color=18181b" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Motion-React-08090a?style=flat-square&color=84ff00&labelColor=18181b" alt="Motion" />
    <a href="https://x.com/Sumit1476136">
      <img src="https://img.shields.io/badge/X-@Sumit1476136-08090a?style=flat-square&color=18181b&logo=x&logoColor=ffffff" alt="Twitter/X Follow" />
    </a>
  </p>

  <br />

  <!-- Showcase Media -->
  <a href="https://peelui.com">
    <img src="https://raw.githubusercontent.com/Killersumit/peel-ui/main/public/og.png" alt="Peel UI Showcase" width="100%" style="border-radius: 12px; border: 1px solid #27272a;" />
  </a>
</div>

<br />

## Why Peel UI?

Most modern UI registries copy the same linear CSS curves, pastel glows, and floaty cubic-bezier transitions. 

**Peel UI** treats digital interfaces like machined physical hardware:
- **Kinematic spring physics:** Damped mass, magnetic snap pockets, and mechanical detents instead of rigid ease curves.
- **Zero render throttling:** Driven by GPU-accelerated motion values so pointer gestures never bottleneck React state.
- **Quiet luxury aesthetic:** Matte obsidian finishes, micro-chamfered edges, and high-contrast typography. Zero AI-generated visual noise.
- **Full ownership:** Copy, paste, and adapt the components directly inside your project like Shadcn UI.

---

## Registry Primitives

| Primitive | Category | Physics & Mechanics |
| :--- | :--- | :--- |
| **Slide to Confirm** | Action / Verification | Friction drag, magnetic pull pocket at 78%, mechanical end-stop recoil |
| **Magnetic Split Button** | Action Pill | Dual-half separation on proximity, spring detachment, and latch |
| **Tactile PIN Field** | Form & Auth | Floating lens focus frame with physical layout glide and tumbler micro-springs |
| **Privacy Shutter** | Security & Secret Keys | Spring-loaded physical peek slider with detent latching and instant copy |

---

## Quick Start

### 1. Install Dependencies

Peel UI primitives require `motion` (or `framer-motion`), `lucide-react`, and standard Tailwind helpers:

```bash
npm install motion lucide-react clsx tailwind-merge
# or
pnpm add motion lucide-react clsx tailwind-merge
# or
bun add motion lucide-react clsx tailwind-merge
```

### 2. Configure Tailwind CSS

Ensure your `tailwind.config.ts` includes standard zinc palettes and the Peel brand accent:

```ts
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        accent: '#84ff00', // Acid Lime highlight
      },
    },
  },
};
```

### 3. Add a Component

Drop any primitive into your `components/ui/` folder:

```tsx
import { SlideToConfirm } from "@/components/ui/slide-to-confirm";

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#08090a]">
      <SlideToConfirm
        label="Slide to deploy"
        confirmedLabel="Executed"
        onConfirm={() => console.log("Action confirmed")}
      />
    </div>
  );
}
```

---

## Engineering Directives

```
  PHYSICAL KINEMATICS       QUIET SURFACES           HARDWARE TOUCHPOINTS
  ───────────────────       ──────────────           ────────────────────
  Springs have mass.        No neon glows.           Detents click.
  Rebounds have damping.    No blurry bokeh.         Buttons settle.
  Gestures have friction.   Matte anodized tones.    Latches lock.
```

---

## Sponsors & Partnerships

Support the ongoing development of open-source hardware primitives. 

<a href="https://github.com/sponsors/Killersumit">
  <img src="https://img.shields.io/badge/Sponsor-Peel%20UI-84ff00?style=for-the-badge&logo=githubsponsors&logoColor=08090a&labelColor=18181b" alt="Sponsor Peel UI" />
</a>

*Building a developer tool, auth service, database, or cloud platform? Dedicated showcase slots on peelui.com and the GitHub repository header are available for brand placement.*

- **Inquire:** [killer1191x@gmail.com](mailto:killer1191x@gmail.com)
- **Direct message:** [@Sumit1476136 on X](https://x.com/Sumit1476136)

---

## Author & Community

- Built by **Sumit** ([@Killersumit](https://github.com/Killersumit))
- Updates & interaction clips on **[X / Twitter (@Sumit1476136)](https://x.com/Sumit1476136)**
- Inquiries: [killer1191x@gmail.com](mailto:killer1191x@gmail.com)

## License

Distributed under the [MIT License](LICENSE). Free for personal and commercial applications.
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

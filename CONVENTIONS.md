# CONVENTIONS.md — Peel UI Codebase Conventions

## Folder Architecture

```
src/
├── app/                          # Next.js App Router pages & layouts
│   ├── layout.tsx                # Root layout (fonts, globals, dark mode)
│   ├── page.tsx                  # Landing / hero page
│   └── globals.css               # Tailwind v4 @theme tokens + CSS variables
│
├── components/
│   ├── ui/                       # Registry components (self-contained, installable)
│   │   └── [component-name].tsx  # One file per component, forwardRef, typed props
│   │
│   ├── showcase/                 # Live demo wrappers for the website
│   │   └── [name]-demo.tsx       # Interactive preview of each registry component
│   │
│   └── navigation/               # Site-level navigation (navbar, sidebar, footer)
│       ├── navbar.tsx
│       └── footer.tsx
│
├── lib/
│   ├── utils.ts                  # cn() class merge utility
│   └── motion.ts                 # Spring physics tokens (springTactile, etc.)
│
```

The root `registry.json` is the shadcn registry manifest and points to sources in `src/components/ui/`.

## Naming Rules

| Entity | Convention | Example |
| :--- | :--- | :--- |
| Component files | `kebab-case.tsx` | `spec-card.tsx` |
| Component exports | `PascalCase` | `SpecCard` |
| Utility files | `kebab-case.ts` | `utils.ts` |
| CSS variables | `--peel-*` prefix | `--peel-lime` |
| Tailwind tokens | `peel-*` prefix | `bg-peel-surface` |

## Import Aliases

All imports use the `@/` alias mapped to `src/`:

```tsx
import { cn } from "@/lib/utils";
```

Site-shell components may use shared transitions from `@/lib/motion`; registry components define their own springs.

## Component Standards

1. Every `src/components/ui/` component uses `React.forwardRef` with typed props.
2. Every component accepts a `className` prop merged via `cn()`.
3. Compound components may use relative imports between files shipped together in one registry item.
4. Registry components in `src/components/ui/` must be self-contained. They inline their own spring constants and may import only from `react`, `react-dom`, `motion/react`, `gsap`, `@gsap/react`, `lucide-react`, and `@/lib/utils`. They must NEVER import from `@/lib/motion`, `@/config`, or any other site file.
5. Registry components must not import sibling UI files unless they are shipped together in the same registry item.
6. All animated components must check `useReducedMotion()`.

## Color Usage

Always use Tailwind token classes (`bg-peel-surface`, `text-peel-lime`, `border-peel-border`)
rather than raw hex values. The single source of truth is `src/app/globals.css`.

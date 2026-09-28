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
└── registry/                     # Future: per-component JSON metadata for CLI install
```

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
import { springTactile } from "@/lib/motion";
```

## Component Standards

1. Every `components/ui/` component uses `React.forwardRef` with typed props.
2. Every component accepts a `className` prop merged via `cn()`.
3. No component imports from sibling `components/ui/` files (zero coupling).
4. Allowed local imports: `@/lib/utils`, `@/lib/motion` only.
5. Motion transitions import from `@/lib/motion`, never inline ad-hoc springs.
6. All animated components must check `useReducedMotion()`.

## Color Usage

Always use Tailwind token classes (`bg-peel-surface`, `text-peel-lime`, `border-peel-border`)
rather than raw hex values. The single source of truth is `globals.css`.

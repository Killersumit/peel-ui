/* Central Component Registry for Peel UI */
import * as React from "react";
import { SlideToConfirm } from "@/components/ui/slide-to-confirm";
import { MagneticSplitButton } from "@/components/ui/magnetic-split-button";
import { TactileOtpInput } from "@/components/ui/tactile-otp-input";
import { VoicePill } from "@/components/ui/voice-pill";
import { PrivacyShutter } from "@/components/ui/privacy-shutter";
import { SaveStatePillDemo } from "@/components/ui/save-state-pill";
import { FilterChipsDemo } from "@/components/demos/filter-chips-demo";
import { NoteButtonDemo } from "@/components/demos/note-button-demo";
const SkeletonHandoffDemo = React.lazy(() =>
  import("@/components/demos/skeleton-handoff-demo").then((module) => ({
    default: module.SkeletonHandoffDemo,
  })),
);
import { SAVE_STATE_PILL_SOURCE } from "@/config/save-state-pill-source";
import { FILTER_CHIPS_SOURCE } from "@/config/filter-chips-source";
import { NOTE_BUTTON_SOURCE } from "@/config/note-button-source";

export type ComponentCategory = "ACTIONS" | "INPUTS" | "SECURITY";

export interface ComponentPropDoc {
  name: string;
  type: string;
  default?: string;
  description: string;
  required?: boolean;
}

export interface ComponentInstallCommands {
  npm: string;
  pnpm: string;
  yarn: string;
  bun: string;
}

export interface ComponentRecord {
  slug: string;
  name: string;
  category: ComponentCategory;
  tagline: string;
  description: string;
  mechanicalDescription: string;
  interactionType: string;
  dependencies: string[];
  install: ComponentInstallCommands;
  installCmd: ComponentInstallCommands;
  props: ComponentPropDoc[];
  usageSnippet: string;
  usageCode: string;
  sourceCode: string;
  component: React.ComponentType;
  defaultSurfaceTheme?: "obsidian" | "dark" | "ceramic";
}

export const ALL_COMPONENTS: ComponentRecord[] = [
  {
    slug: "slide-to-confirm",
    name: "Slide to Confirm",
    category: "ACTIONS",
    tagline: "Tactile slide-to-confirm track with spring recoil, dynamic constraints, and matte progress feedback.",
    description: "A high-precision tactile slider with physical drag constraints, 75% magnetic gravity latch pocket, and spring recoil return. Engineered for irreversible production triggers.",
    mechanicalDescription: "Constrained linear drag track with 75% magnetic latch detent. If released below the 75% gravity threshold, high-stiffness spring recoil returns puck to origin. Reaching 75% snaps puck to lock position and triggers irreversible execution.",
    interactionType: "Constrained linear drag track with 75% magnetic latch detent. If released below the 75% gravity threshold, high-stiffness spring recoil returns puck to origin. Reaching 75% snaps puck to lock position and triggers irreversible execution.",
    dependencies: ["motion","lucide-react","clsx","tailwind-merge"],
    install: {
      "npm": "npx shadcn@latest add https://peel-ui.vercel.app/r/slide-to-confirm.json",
      "pnpm": "pnpm dlx shadcn@latest add https://peel-ui.vercel.app/r/slide-to-confirm.json",
      "yarn": "npx shadcn@latest add https://peel-ui.vercel.app/r/slide-to-confirm.json",
      "bun": "bunx --bun shadcn@latest add https://peel-ui.vercel.app/r/slide-to-confirm.json"
},
    installCmd: {
      "npm": "npx shadcn@latest add https://peel-ui.vercel.app/r/slide-to-confirm.json",
      "pnpm": "pnpm dlx shadcn@latest add https://peel-ui.vercel.app/r/slide-to-confirm.json",
      "yarn": "npx shadcn@latest add https://peel-ui.vercel.app/r/slide-to-confirm.json",
      "bun": "bunx --bun shadcn@latest add https://peel-ui.vercel.app/r/slide-to-confirm.json"
},
    props: [
      {
            "name": "label",
            "type": "string",
            "default": "\"Slide to deploy\"",
            "description": "Label displayed inside track during idle or sliding state."
      },
      {
            "name": "confirmedLabel",
            "type": "string",
            "default": "\"Executed\"",
            "description": "Label displayed upon successful confirmation."
      },
      {
            "name": "onConfirm",
            "type": "() => void",
            "default": "undefined",
            "description": "Callback fired when slide passes 75% magnetic latch."
      },
      {
            "name": "onReset",
            "type": "() => void",
            "default": "undefined",
            "description": "Callback fired when puck resets back to idle position."
      },
      {
            "name": "autoResetTimeout",
            "type": "number",
            "default": "0",
            "description": "Milliseconds before auto-resetting back to idle (0 to disable)."
      },
      {
            "name": "disabled",
            "type": "boolean",
            "default": "false",
            "description": "Disables dragging and keyboard interaction."
      },
      {
            "name": "className",
            "type": "string",
            "default": "undefined",
            "description": "Additional classes applied to outer wrapper."
      }
],
    usageSnippet: "import { SlideToConfirm } from \"@/components/ui/slide-to-confirm\";\n\nexport default function SlideToConfirmDemo() {\n  return (\n    <SlideToConfirm\n      label=\"Slide to deploy\"\n      confirmedLabel=\"Production Deployed\"\n      onConfirm={() => console.log(\"Action confirmed\")}\n      onReset={() => console.log(\"State reset to idle\")}\n      className=\"w-full max-w-[340px]\"\n    />\n  );\n}",
    usageCode: "import { SlideToConfirm } from \"@/components/ui/slide-to-confirm\";\n\nexport default function SlideToConfirmDemo() {\n  return (\n    <SlideToConfirm\n      label=\"Slide to deploy\"\n      confirmedLabel=\"Production Deployed\"\n      onConfirm={() => console.log(\"Action confirmed\")}\n      onReset={() => console.log(\"State reset to idle\")}\n      className=\"w-full max-w-[340px]\"\n    />\n  );\n}",
    sourceCode: "\"use client\";\n\nimport * as React from \"react\";\nimport { ArrowRight, Check, RotateCcw } from \"lucide-react\";\nimport {\n  motion,\n  useMotionValue,\n  useTransform,\n  animate,\n  useReducedMotion,\n  AnimatePresence,\n} from \"motion/react\";\nimport { cn } from \"@/lib/utils\";\n\nexport interface SlideToConfirmProps {\n  /** Label displayed in idle state */\n  label?: string;\n  /** Label displayed upon successful confirmation */\n  confirmedLabel?: string;\n  /** Callback fired when slide passes 75% and locks */\n  onConfirm?: () => void;\n  /** Callback fired when state resets back to idle */\n  onReset?: () => void;\n  /** Optional milliseconds before auto-resetting (0 to disable) */\n  autoResetTimeout?: number;\n  /** Additional classes applied to wrapper */\n  className?: string;\n  /** Disable user interaction */\n  disabled?: boolean;\n}\n\nexport function SlideToConfirm({\n  label = \"Slide to deploy\",\n  confirmedLabel = \"Executed\",\n  onConfirm,\n  onReset,\n  autoResetTimeout = 0,\n  className,\n  disabled = false,\n}: SlideToConfirmProps) {\n  const [isConfirmed, setIsConfirmed] = React.useState(false);\n  const trackRef = React.useRef<HTMLDivElement>(null);\n  const shouldReduceMotion = useReducedMotion();\n\n  // Dynamic drag constraint: trackWidth - puckWidth(40) - padding*2(12)\n  const [maxDrag, setMaxDrag] = React.useState<number>(288);\n\n  // Hardware-accelerated drag coordinate (zero React state updates during drag)\n  const x = useMotionValue(0);\n\n  // Measure track width dynamically to calculate precise physical boundaries\n  React.useEffect(() => {\n    const el = trackRef.current;\n    if (!el) return;\n\n    const calculateBounds = () => {\n      const width = el.clientWidth;\n      const calculatedMax = Math.max(0, width - 40 - 12);\n      setMaxDrag(calculatedMax);\n      if (isConfirmed) {\n        x.set(calculatedMax);\n      }\n    };\n\n    calculateBounds();\n\n    const resizeObserver = new ResizeObserver(() => {\n      calculateBounds();\n    });\n\n    resizeObserver.observe(el);\n    return () => {\n      resizeObserver.disconnect();\n    };\n  }, [isConfirmed, x]);\n\n  // Center label opacity fades smoothly from 1 to 0 as the puck advances\n  const idleLabelOpacity = useTransform(x, [0, maxDrag * 0.75 || 1], [1, 0]);\n\n  // Progress fill expands horizontally behind the puck, capped to inner track width\n  const fillWidth = useTransform(x, (currentX) => {\n    const innerTrackWidth = (maxDrag || 288) + 40;\n    const target = Math.max(40, currentX + 40);\n    return `${Math.min(innerTrackWidth, target)}px`;\n  });\n\n  const reset = React.useCallback(() => {\n    setIsConfirmed(false);\n    animate(x, 0, {\n      type: \"spring\",\n      stiffness: shouldReduceMotion ? 1000 : 450,\n      damping: shouldReduceMotion ? 100 : 35,\n      mass: 0.8,\n    });\n    onReset?.();\n  }, [x, shouldReduceMotion, onReset]);\n\n  // Optional auto-reset timer\n  React.useEffect(() => {\n    if (isConfirmed && autoResetTimeout > 0) {\n      const timer = setTimeout(() => {\n        reset();\n      }, autoResetTimeout);\n      return () => clearTimeout(timer);\n    }\n  }, [isConfirmed, autoResetTimeout, reset]);\n\n  const handleDragEnd = () => {\n    if (disabled || isConfirmed) return;\n\n    const currentX = x.get();\n    const threshold = maxDrag * 0.75; // 75% Magnetic Gravity Pocket\n\n    if (currentX >= threshold) {\n      // Magnetically pull into lock position\n      x.set(maxDrag);\n      setIsConfirmed(true);\n      onConfirm?.();\n    } else {\n      // Released under 75%: snap back to 0 with elastic recoil\n      animate(x, 0, {\n        type: \"spring\",\n        stiffness: shouldReduceMotion ? 1000 : 450,\n        damping: shouldReduceMotion ? 100 : 35,\n        mass: 0.8,\n      });\n    }\n  };\n\n  const handleKeyDown = (e: React.KeyboardEvent) => {\n    if (disabled) return;\n    if (isConfirmed) {\n      if (e.key === \"Enter\" || e.key === \" \" || e.key === \"Escape\") {\n        e.preventDefault();\n        reset();\n      }\n      return;\n    }\n    if (e.key === \"ArrowRight\" || e.key === \"Enter\" || e.key === \" \") {\n      e.preventDefault();\n      x.set(maxDrag);\n      setIsConfirmed(true);\n      onConfirm?.();\n    }\n  };\n\n  return (\n    <div className={cn(\"flex flex-col items-center w-full max-w-[340px]\", className)}>\n      {/* ── Outer Track Container (Decisive Track Latch) ── */}\n      <div\n        ref={trackRef}\n        role=\"group\"\n        aria-label=\"Slide to confirm\"\n        className={cn(\n          \"w-full h-[52px] rounded-full p-1.5 relative overflow-hidden flex items-center select-none transition-colors duration-200\",\n          isConfirmed\n            ? \"border border-zinc-700 bg-zinc-900/90 shadow-sm\"\n            : \"border border-zinc-800/80 bg-zinc-950/90\",\n          disabled && \"opacity-50 pointer-events-none\"\n        )}\n      >\n        {/* ── Progress Fill Layer (Matte, zero outer glow) ── */}\n        <motion.div\n          style={{ width: fillWidth }}\n          className={cn(\n            \"absolute left-1.5 top-1.5 bottom-1.5 rounded-full pointer-events-none transition-colors duration-200\",\n            isConfirmed ? \"bg-[#84ff00]/15\" : \"bg-zinc-800/60\"\n          )}\n        />\n\n        {/* ── Center Label: Idle / Sliding ── */}\n        <motion.div\n          style={{ opacity: isConfirmed ? 0 : idleLabelOpacity }}\n          className=\"absolute inset-0 flex items-center justify-center text-xs font-medium text-zinc-400 tracking-tight pointer-events-none select-none z-10\"\n        >\n          {label}\n        </motion.div>\n\n        {/* ── Center Label: Confirmed ── */}\n        <div\n          className={cn(\n            \"absolute inset-0 flex items-center justify-center text-xs font-medium text-white pointer-events-none select-none z-10 transition-opacity duration-200\",\n            isConfirmed ? \"opacity-100\" : \"opacity-0\"\n          )}\n        >\n          {confirmedLabel}\n        </div>\n\n        {/* ── Tactile Draggable Puck (Zero CSS transitions to prevent drag jitter) ── */}\n        <motion.div\n          role=\"slider\"\n          aria-valuemin={0}\n          aria-valuemax={100}\n          aria-valuenow={maxDrag > 0 ? Math.round((x.get() / maxDrag) * 100) : 0}\n          aria-label={isConfirmed ? confirmedLabel : label}\n          title={isConfirmed ? \"Confirmed\" : \"Slide to confirm\"}\n          tabIndex={disabled ? -1 : 0}\n          onKeyDown={handleKeyDown}\n          drag={!isConfirmed && !disabled ? \"x\" : false}\n          dragConstraints={{ left: 0, right: maxDrag }}\n          dragElastic={0.06}\n          dragMomentum={false}\n          onDragEnd={handleDragEnd}\n          animate={\n            isConfirmed && !shouldReduceMotion\n              ? { scale: [1, 1.12, 1] }\n              : { scale: 1 }\n          }\n          transition={{\n            duration: 0.22,\n            times: [0, 0.45, 1],\n            ease: \"easeOut\",\n          }}\n          style={{ x }}\n          className={cn(\n            \"w-10 h-10 rounded-full z-20 flex items-center justify-center touch-none select-none outline-none focus-visible:ring-2 focus-visible:ring-zinc-400\",\n            isConfirmed\n              ? \"bg-[#84ff00] text-zinc-950 shadow-sm\"\n              : \"bg-zinc-100 text-zinc-950 cursor-grab active:cursor-grabbing shadow-sm\"\n          )}\n        >\n          <AnimatePresence mode=\"wait\" initial={false}>\n            {isConfirmed ? (\n              <motion.div\n                key=\"check\"\n                initial={shouldReduceMotion ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -45 }}\n                animate={{ scale: 1, rotate: 0 }}\n                transition={{ type: \"spring\", stiffness: 500, damping: 25 }}\n                className=\"flex items-center justify-center\"\n              >\n                <Check className=\"size-4 stroke-[2.5]\" />\n              </motion.div>\n            ) : (\n              <motion.div\n                key=\"arrow\"\n                initial={{ opacity: 0 }}\n                animate={{ opacity: 1 }}\n                exit={{ opacity: 0 }}\n                transition={{ duration: 0.12 }}\n                className=\"flex items-center justify-center\"\n              >\n                <ArrowRight className=\"size-4 stroke-[2.2]\" />\n              </motion.div>\n            )}\n          </AnimatePresence>\n        </motion.div>\n      </div>\n\n      {/* ── Showcase Reset Trigger ── */}\n      <div className=\"h-6 flex items-center justify-center mt-2.5\">\n        <AnimatePresence>\n          {isConfirmed && (\n            <motion.button\n              type=\"button\"\n              initial={{ opacity: 0, y: -4 }}\n              animate={{ opacity: 1, y: 0 }}\n              exit={{ opacity: 0, y: -4 }}\n              transition={{ duration: 0.15 }}\n              onClick={reset}\n              className=\"inline-flex items-center gap-1.5 text-[11px] font-mono tracking-wider text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer select-none uppercase focus:outline-none\"\n            >\n              <RotateCcw className=\"size-3\" />\n              <span>Reset demo</span>\n            </motion.button>\n          )}\n        </AnimatePresence>\n      </div>\n    </div>\n  );\n}\n",
    component: () => React.createElement("div", { className: "w-full flex items-center justify-center p-2" }, React.createElement(SlideToConfirm, { label: "Slide to deploy", confirmedLabel: "Executed", className: "w-full max-w-[320px]" })),
  },
  {
    slug: "magnetic-split-button",
    name: "Magnetic Split Button",
    category: "ACTIONS",
    tagline: "Tactile split action button with magnetic separation physics, spring recoil, and integrated dropdown menu.",
    description: "Dual-action execution trigger featuring kinetic magnetic separation on hover, corner radius morphing, and an integrated contextual command dropdown.",
    mechanicalDescription: "Conjoined rest state with central hairline divider. Hovering or opening menu induces magnetic repulsion: primary button translates -4px with pill radius morphing while chevron translates +4px with reverse morphing. Central divider dissolves.",
    interactionType: "Conjoined rest state with central hairline divider. Hovering or opening menu induces magnetic repulsion: primary button translates -4px with pill radius morphing while chevron translates +4px with reverse morphing. Central divider dissolves.",
    dependencies: ["motion","lucide-react","clsx","tailwind-merge"],
    install: {
      "npm": "npx shadcn@latest add https://peel-ui.vercel.app/r/magnetic-split-button.json",
      "pnpm": "pnpm dlx shadcn@latest add https://peel-ui.vercel.app/r/magnetic-split-button.json",
      "yarn": "npx shadcn@latest add https://peel-ui.vercel.app/r/magnetic-split-button.json",
      "bun": "bunx --bun shadcn@latest add https://peel-ui.vercel.app/r/magnetic-split-button.json"
},
    installCmd: {
      "npm": "npx shadcn@latest add https://peel-ui.vercel.app/r/magnetic-split-button.json",
      "pnpm": "pnpm dlx shadcn@latest add https://peel-ui.vercel.app/r/magnetic-split-button.json",
      "yarn": "npx shadcn@latest add https://peel-ui.vercel.app/r/magnetic-split-button.json",
      "bun": "bunx --bun shadcn@latest add https://peel-ui.vercel.app/r/magnetic-split-button.json"
},
    props: [
      {
            "name": "defaultAction",
            "type": "string",
            "default": "\"Deploy to prod\"",
            "description": "Initial selected primary action label."
      },
      {
            "name": "actions",
            "type": "MagneticSplitAction[]",
            "default": "DEFAULT_ACTIONS",
            "description": "Dropdown secondary menu options array."
      },
      {
            "name": "onAction",
            "type": "(actionLabel: string) => void",
            "default": "undefined",
            "description": "Callback fired when primary button or menu item is clicked."
      },
      {
            "name": "className",
            "type": "string",
            "default": "undefined",
            "description": "Additional classes applied to container."
      }
],
    usageSnippet: "import { MagneticSplitButton } from \"@/components/ui/magnetic-split-button\";\n\nexport default function MagneticSplitButtonDemo() {\n  return (\n    <MagneticSplitButton\n      defaultAction=\"Deploy to prod\"\n      onAction={(action) => console.log(\"Executed action:\", action)}\n    />\n  );\n}",
    usageCode: "import { MagneticSplitButton } from \"@/components/ui/magnetic-split-button\";\n\nexport default function MagneticSplitButtonDemo() {\n  return (\n    <MagneticSplitButton\n      defaultAction=\"Deploy to prod\"\n      onAction={(action) => console.log(\"Executed action:\", action)}\n    />\n  );\n}",
    sourceCode: "\"use client\";\n\nimport * as React from \"react\";\nimport { ChevronDown, Rocket, GitBranch, RotateCcw, Check } from \"lucide-react\";\nimport {\n  motion,\n  AnimatePresence,\n  useReducedMotion,\n  type Transition,\n} from \"motion/react\";\nimport { cn } from \"@/lib/utils\";\n\nexport interface MagneticSplitAction {\n  id: string;\n  label: string;\n  icon?: React.ReactNode;\n}\n\nexport interface MagneticSplitButtonProps {\n  /** Initial selected action label */\n  defaultAction?: string;\n  /** Dropdown menu actions */\n  actions?: MagneticSplitAction[];\n  /** Callback fired when an action triggers */\n  onAction?: (actionLabel: string) => void;\n  /** Additional container styling */\n  className?: string;\n}\n\nconst DEFAULT_ACTIONS: MagneticSplitAction[] = [\n  {\n    id: \"staging\",\n    label: \"Deploy to Staging\",\n    icon: <Rocket className=\"size-3 text-neutral-400\" />,\n  },\n  {\n    id: \"preview\",\n    label: \"Create Preview Branch\",\n    icon: <GitBranch className=\"size-3 text-neutral-400\" />,\n  },\n  {\n    id: \"rollback\",\n    label: \"Rollback Release\",\n    icon: <RotateCcw className=\"size-3 text-neutral-400\" />,\n  },\n];\n\nexport function MagneticSplitButton({\n  defaultAction = \"Deploy to prod\",\n  actions = DEFAULT_ACTIONS,\n  onAction,\n  className,\n}: MagneticSplitButtonProps) {\n  const [isHovered, setIsHovered] = React.useState(false);\n  const [isChevronHovered, setIsChevronHovered] = React.useState(false);\n  const [isMenuOpen, setIsMenuOpen] = React.useState(false);\n  const [selectedAction, setSelectedAction] = React.useState(defaultAction);\n  const [isTriggered, setIsTriggered] = React.useState(false);\n\n  const containerRef = React.useRef<HTMLDivElement>(null);\n  const shouldReduceMotion = useReducedMotion();\n\n  // Close dropdown on outside click\n  React.useEffect(() => {\n    if (!isMenuOpen) return;\n    const handleClickOutside = (e: MouseEvent) => {\n      if (\n        containerRef.current &&\n        !containerRef.current.contains(e.target as Node)\n      ) {\n        setIsMenuOpen(false);\n      }\n    };\n    document.addEventListener(\"mousedown\", handleClickOutside);\n    return () => document.removeEventListener(\"mousedown\", handleClickOutside);\n  }, [isMenuOpen]);\n\n  const isSeparated = isHovered || isMenuOpen;\n\n  const springPhysics: Transition = {\n    type: \"spring\",\n    stiffness: shouldReduceMotion ? 1000 : 450,\n    damping: shouldReduceMotion ? 100 : 28,\n    mass: 0.8,\n  };\n\n  const handlePrimaryClick = () => {\n    if (isTriggered) return;\n    setIsTriggered(true);\n    onAction?.(selectedAction);\n    setTimeout(() => {\n      setIsTriggered(false);\n    }, 1200);\n  };\n\n  const handleSelectAction = (action: MagneticSplitAction) => {\n    setSelectedAction(action.label);\n    setIsMenuOpen(false);\n    setIsTriggered(true);\n    onAction?.(action.label);\n    setTimeout(() => {\n      setIsTriggered(false);\n    }, 1200);\n  };\n\n  return (\n    <div\n      ref={containerRef}\n      onMouseEnter={() => setIsHovered(true)}\n      onMouseLeave={() => {\n        setIsHovered(false);\n        setIsChevronHovered(false);\n      }}\n      className={cn(\n        \"relative inline-flex items-center justify-center select-none\",\n        className\n      )}\n    >\n      {/* ── Primary Action Button (Pure Neutral Graphite, High Contrast) ── */}\n      <motion.button\n        type=\"button\"\n        onClick={handlePrimaryClick}\n        whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}\n        animate={{\n          x: isSeparated ? -4 : 0,\n          borderTopRightRadius: isSeparated ? \"9999px\" : \"0px\",\n          borderBottomRightRadius: isSeparated ? \"9999px\" : \"0px\",\n          borderTopLeftRadius: \"9999px\",\n          borderBottomLeftRadius: \"9999px\",\n        }}\n        transition={springPhysics}\n        className={cn(\n          \"relative z-10 h-9 px-4 flex items-center gap-2\",\n          \"bg-[#1c1c1c] border border-[#383838] text-xs font-medium text-neutral-100\",\n          \"shadow-[inset_0_1px_0_0_rgba(255,255,255,0.09)]\",\n          \"hover:text-white hover:bg-[#262626] hover:border-[#4d4d4d]\",\n          \"transition-colors duration-150 outline-none cursor-pointer\"\n        )}\n      >\n        <AnimatePresence mode=\"wait\" initial={false}>\n          {isTriggered ? (\n            <motion.span\n              key=\"check\"\n              initial={\n                shouldReduceMotion\n                  ? { scale: 1, rotate: 0 }\n                  : { scale: 0, rotate: -45 }\n              }\n              animate={{ scale: 1, rotate: 0 }}\n              exit={{ scale: 0, opacity: 0 }}\n              transition={{ type: \"spring\", stiffness: 500, damping: 25 }}\n              className=\"text-[#84ff00] flex items-center justify-center shrink-0\"\n            >\n              <Check className=\"size-3.5 stroke-[2.5]\" />\n            </motion.span>\n          ) : (\n            <motion.span\n              key=\"rocket\"\n              initial={{ opacity: 0, scale: 0.8 }}\n              animate={{ opacity: 1, scale: 1 }}\n              exit={{ opacity: 0, scale: 0.8 }}\n              transition={{ duration: 0.12 }}\n              className=\"text-neutral-400 flex items-center justify-center shrink-0\"\n            >\n              <Rocket className=\"size-3.5\" />\n            </motion.span>\n          )}\n        </AnimatePresence>\n\n        {/* Stable text label — never shrinks on trigger to eliminate grid shift */}\n        <span className=\"tracking-tight whitespace-nowrap\">\n          {selectedAction}\n        </span>\n      </motion.button>\n\n      {/* ── Neutral Hairline Divider (fades when separated) ── */}\n      <motion.div\n        aria-hidden=\"true\"\n        animate={{\n          opacity: isSeparated ? 0 : 1,\n          scaleY: isSeparated ? 0.3 : 1,\n        }}\n        transition={{ duration: 0.12 }}\n        className=\"w-px h-4 bg-[#383838] absolute z-20 pointer-events-none\"\n      />\n\n      {/* ── Chevron Menu Trigger (Pure Neutral Graphite) ── */}\n      <motion.button\n        type=\"button\"\n        aria-label=\"Toggle actions menu\"\n        aria-expanded={isMenuOpen}\n        onClick={(e) => {\n          e.stopPropagation();\n          setIsMenuOpen((prev) => !prev);\n        }}\n        onMouseEnter={() => setIsChevronHovered(true)}\n        onMouseLeave={() => setIsChevronHovered(false)}\n        whileTap={shouldReduceMotion ? undefined : { scale: 0.92 }}\n        animate={{\n          x: isSeparated ? 4 : 0,\n          borderTopLeftRadius: isSeparated ? \"9999px\" : \"0px\",\n          borderBottomLeftRadius: isSeparated ? \"9999px\" : \"0px\",\n          borderTopRightRadius: \"9999px\",\n          borderBottomRightRadius: \"9999px\",\n          scale: isChevronHovered && !shouldReduceMotion ? 1.05 : 1,\n        }}\n        transition={springPhysics}\n        className={cn(\n          \"relative z-10 h-9 w-8 flex items-center justify-center\",\n          \"bg-[#1c1c1c] border border-[#383838] text-neutral-300\",\n          \"shadow-[inset_0_1px_0_0_rgba(255,255,255,0.09)]\",\n          \"hover:text-white hover:bg-[#262626] hover:border-[#4d4d4d]\",\n          \"transition-colors duration-150 outline-none cursor-pointer\",\n          isMenuOpen && \"border-[#525252] bg-[#262626] text-white\"\n        )}\n      >\n        <motion.div\n          animate={{ rotate: isMenuOpen ? 180 : 0 }}\n          transition={springPhysics}\n          className=\"flex items-center justify-center\"\n        >\n          <ChevronDown className=\"size-3.5\" />\n        </motion.div>\n      </motion.button>\n\n      {/* ── Tactile Dropdown Menu (Matte Pure Neutral Black, Zero Blue) ── */}\n      <AnimatePresence>\n        {isMenuOpen && (\n          <motion.div\n            initial={\n              shouldReduceMotion\n                ? { opacity: 0 }\n                : { opacity: 0, y: -6, scale: 0.97 }\n            }\n            animate={{ opacity: 1, y: 0, scale: 1 }}\n            exit={\n              shouldReduceMotion\n                ? { opacity: 0 }\n                : { opacity: 0, y: -4, scale: 0.98 }\n            }\n            transition={{\n              type: \"spring\",\n              stiffness: 450,\n              damping: 30,\n              mass: 0.8,\n            }}\n            className=\"absolute top-full mt-2 right-0 w-48 z-40 rounded-2xl border border-[#333333] bg-[#121212] p-1.5 shadow-[0_12px_32px_rgba(0,0,0,0.7)] select-none\"\n          >\n            <div className=\"flex flex-col gap-0.5\">\n              {actions.map((item) => (\n                <button\n                  key={item.id}\n                  type=\"button\"\n                  onClick={() => handleSelectAction(item)}\n                  className=\"w-full flex items-center justify-between px-3 py-2 rounded-xl text-[11px] font-medium text-neutral-300 hover:bg-[#222222] hover:text-white transition-colors cursor-pointer text-left outline-none\"\n                >\n                  <span className=\"flex items-center gap-2\">\n                    {item.icon}\n                    <span>{item.label}</span>\n                  </span>\n                  {selectedAction === item.label && (\n                    <Check className=\"size-3 text-[#84ff00]\" />\n                  )}\n                </button>\n              ))}\n            </div>\n          </motion.div>\n        )}\n      </AnimatePresence>\n    </div>\n  );\n}\n",
    component: () => React.createElement("div", { className: "w-full flex items-center justify-center p-4" }, React.createElement(MagneticSplitButton, { defaultAction: "Deploy to prod" })),
  },
  {
    slug: "tactile-otp-input",
    name: "Tactile OTP Input",
    category: "INPUTS",
    tagline: "Tactile verification input with a spring-loaded floating lens focus frame, digit tumblers, and full mobile support.",
    description: "A physical PIN/OTP verification component powered by an invisible native input, floating lens focus tracking, and vertical tumbler digit animations.",
    mechanicalDescription: "Single hidden native input drives multi-slot visualization. A high-contrast floating lens frame glides across digit slots with layout spring physics. Digits flip into view with vertical spring tumbler transitions.",
    interactionType: "Single hidden native input drives multi-slot visualization. A high-contrast floating lens frame glides across digit slots with layout spring physics. Digits flip into view with vertical spring tumbler transitions.",
    dependencies: ["motion","clsx","tailwind-merge"],
    install: {
      "npm": "npx shadcn@latest add https://peel-ui.vercel.app/r/tactile-otp-input.json",
      "pnpm": "pnpm dlx shadcn@latest add https://peel-ui.vercel.app/r/tactile-otp-input.json",
      "yarn": "npx shadcn@latest add https://peel-ui.vercel.app/r/tactile-otp-input.json",
      "bun": "bunx --bun shadcn@latest add https://peel-ui.vercel.app/r/tactile-otp-input.json"
},
    installCmd: {
      "npm": "npx shadcn@latest add https://peel-ui.vercel.app/r/tactile-otp-input.json",
      "pnpm": "pnpm dlx shadcn@latest add https://peel-ui.vercel.app/r/tactile-otp-input.json",
      "yarn": "npx shadcn@latest add https://peel-ui.vercel.app/r/tactile-otp-input.json",
      "bun": "bunx --bun shadcn@latest add https://peel-ui.vercel.app/r/tactile-otp-input.json"
},
    props: [
      {
            "name": "length",
            "type": "number",
            "default": "4",
            "description": "Number of digit slots in the OTP input."
      },
      {
            "name": "initialValues",
            "type": "string[]",
            "default": "[\"3\", \"8\", \"1\", \"\"]",
            "description": "Initial preset values for live showcase display."
      },
      {
            "name": "onComplete",
            "type": "(code: string) => void",
            "default": "undefined",
            "description": "Callback fired when all slots are populated."
      },
      {
            "name": "className",
            "type": "string",
            "default": "undefined",
            "description": "Additional classes applied to container."
      }
],
    usageSnippet: "import { TactileOtpInput } from \"@/components/ui/tactile-otp-input\";\n\nexport default function TactileOtpDemo() {\n  return (\n    <TactileOtpInput\n      length={4}\n      initialValues={[\"\", \"\", \"\", \"\"]}\n      onComplete={(pin) => console.log(\"Verified PIN:\", pin)}\n    />\n  );\n}",
    usageCode: "import { TactileOtpInput } from \"@/components/ui/tactile-otp-input\";\n\nexport default function TactileOtpDemo() {\n  return (\n    <TactileOtpInput\n      length={4}\n      initialValues={[\"\", \"\", \"\", \"\"]}\n      onComplete={(pin) => console.log(\"Verified PIN:\", pin)}\n    />\n  );\n}",
    sourceCode: "\"use client\";\n\nimport * as React from \"react\";\nimport {\n  motion,\n  AnimatePresence,\n  useReducedMotion,\n  type Transition,\n} from \"motion/react\";\nimport { cn } from \"@/lib/utils\";\n\nexport interface TactileOtpInputProps {\n  /** Number of digits in the OTP field (default: 4) */\n  length?: number;\n  /** Initial preset values for live showcase display (default: [\"3\", \"8\", \"1\", \"\"]) */\n  initialValues?: string[];\n  /** Callback fired when all slots are populated */\n  onComplete?: (code: string) => void;\n  /** Additional container styling */\n  className?: string;\n}\n\nconst DEFAULT_INITIAL = [\"3\", \"8\", \"1\", \"\"];\n\nexport function TactileOtpInput({\n  length = 4,\n  initialValues = DEFAULT_INITIAL,\n  onComplete,\n  className,\n}: TactileOtpInputProps) {\n  const [values, setValues] = React.useState<string[]>(() => {\n    if (initialValues && initialValues.length === length) {\n      return [...initialValues];\n    }\n    return Array(length).fill(\"\");\n  });\n\n  // Start with focus on Slot 4 (index 3)\n  const [activeIndex, setActiveIndex] = React.useState(() => {\n    const firstEmpty = initialValues.findIndex((v) => !v);\n    return firstEmpty === -1 ? length - 1 : firstEmpty;\n  });\n\n  const [isFocused, setIsFocused] = React.useState(true);\n  const inputRef = React.useRef<HTMLInputElement>(null);\n  const shouldReduceMotion = useReducedMotion();\n\n  const lensTransition: Transition = {\n    type: \"spring\",\n    stiffness: shouldReduceMotion ? 1000 : 500,\n    damping: shouldReduceMotion ? 100 : 32,\n  };\n\n  const tumblerTransition: Transition = {\n    type: \"spring\",\n    stiffness: shouldReduceMotion ? 1000 : 600,\n    damping: shouldReduceMotion ? 100 : 30,\n  };\n\n  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {\n    const rawVal = e.target.value.replace(/\\D/g, \"\");\n    const chars = rawVal.slice(0, length).split(\"\");\n    const padded = Array(length)\n      .fill(\"\")\n      .map((_, i) => chars[i] || \"\");\n\n    setValues(padded);\n\n    const nextIndex = Math.min(chars.length, length - 1);\n    setActiveIndex(nextIndex);\n\n    if (chars.length === length && onComplete) {\n      onComplete(chars.join(\"\"));\n    }\n  };\n\n  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {\n    if (e.key === \"ArrowLeft\") {\n      e.preventDefault();\n      setActiveIndex((prev) => Math.max(0, prev - 1));\n    } else if (e.key === \"ArrowRight\") {\n      e.preventDefault();\n      const currentLen = values.filter(Boolean).length;\n      setActiveIndex((prev) => Math.min(currentLen, Math.min(length - 1, prev + 1)));\n    }\n  };\n\n  const handleSlotClick = (index: number) => {\n    const currentLen = values.filter(Boolean).length;\n    const target = Math.min(index, currentLen);\n    setActiveIndex(target);\n    if (inputRef.current) {\n      inputRef.current.focus();\n      inputRef.current.setSelectionRange(target, target);\n    }\n  };\n\n  return (\n    <div\n      onClick={() => inputRef.current?.focus()}\n      className={cn(\n        \"relative flex items-center justify-center gap-2.5 cursor-text select-none\",\n        className\n      )}\n    >\n      {/* Invisible Native Input for Full Keyboard & Mobile Soft-Keyboard Support */}\n      <input\n        ref={inputRef}\n        type=\"text\"\n        inputMode=\"numeric\"\n        autoComplete=\"one-time-code\"\n        pattern=\"[0-9]*\"\n        maxLength={length}\n        value={values.join(\"\")}\n        onChange={handleInputChange}\n        onKeyDown={handleKeyDown}\n        onFocus={() => setIsFocused(true)}\n        onBlur={() => setIsFocused(false)}\n        className=\"absolute inset-0 w-full h-full opacity-0 cursor-text z-30\"\n        aria-label=\"Verification PIN code\"\n      />\n\n      {/* ── 4 Clean, High-Contrast Slot Squircles ── */}\n      {values.map((digit, index) => {\n        const isActive = isFocused && activeIndex === index;\n        const isFilled = Boolean(digit);\n\n        return (\n          <div\n            key={index}\n            onClick={() => handleSlotClick(index)}\n            className={cn(\n              \"w-11 h-[52px] rounded-xl flex items-center justify-center relative overflow-hidden transition-all duration-150\",\n              isFilled\n                ? \"bg-[#202020] border border-[#444444] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]\"\n                : isActive\n                ? \"bg-[#141414] border border-[#2e2e2e]\"\n                : \"bg-[#101010] border border-[#222222]\"\n            )}\n          >\n            {/* Numeral Display */}\n            <AnimatePresence mode=\"popLayout\" initial={false}>\n              {digit && (\n                <motion.span\n                  key={`digit-${digit}`}\n                  initial={\n                    shouldReduceMotion ? { opacity: 0 } : { y: -8, opacity: 0 }\n                  }\n                  animate={{ y: 0, opacity: 1 }}\n                  exit={\n                    shouldReduceMotion ? { opacity: 0 } : { y: 8, opacity: 0 }\n                  }\n                  transition={tumblerTransition}\n                  className=\"font-mono text-xl font-semibold text-white select-none tabular-nums\"\n                >\n                  {digit}\n                </motion.span>\n              )}\n            </AnimatePresence>\n\n            {/* ── Active Floating Lens Focus Ring ── */}\n            {isActive && (\n              <motion.div\n                layoutId=\"floating-otp-lens\"\n                transition={{\n                  layout: lensTransition,\n                  borderColor: { duration: 0.15 },\n                }}\n                className=\"absolute inset-0 rounded-xl border-2 border-white shadow-sm pointer-events-none z-20 flex items-center justify-center\"\n              >\n                {/* Blinking Vertical Cursor Bar in Active Empty Slot */}\n                {!digit && (\n                  <div className=\"w-0.5 h-5 bg-white rounded-full animate-pulse\" />\n                )}\n              </motion.div>\n            )}\n          </div>\n        );\n      })}\n    </div>\n  );\n}\n",
    component: () => React.createElement("div", { className: "w-full flex items-center justify-center p-4" }, React.createElement(TactileOtpInput, { initialValues: ["3", "8", "1", ""] })),
  },
  {
    slug: "voice-pill",
    name: "Voice Pill",
    category: "INPUTS",
    tagline: "Tactile expanding voice memo pill with live audio FFT waveform, slide-to-cancel physics, and hardware mic capture.",
    description: "Zero-dependency audio capture capsule with hardware microphone streaming or simulated speech cadence, real-time DPR-aware canvas FFT visualizer, and slide-to-cancel physics.",
    mechanicalDescription: "Compact resting pill expands horizontally over 220ms via cubic-bezier kinematics. Unfolds real-time 80-frame canvas equalizer and monospace elapsed timer. Dragging left beyond 64px triggers physical slide-to-cancel.",
    interactionType: "Compact resting pill expands horizontally over 220ms via cubic-bezier kinematics. Unfolds real-time 80-frame canvas equalizer and monospace elapsed timer. Dragging left beyond 64px triggers physical slide-to-cancel.",
    dependencies: ["lucide-react"],
    install: {
      "npm": "npx shadcn@latest add https://peel-ui.vercel.app/r/voice-pill.json",
      "pnpm": "pnpm dlx shadcn@latest add https://peel-ui.vercel.app/r/voice-pill.json",
      "yarn": "npx shadcn@latest add https://peel-ui.vercel.app/r/voice-pill.json",
      "bun": "bunx --bun shadcn@latest add https://peel-ui.vercel.app/r/voice-pill.json"
},
    installCmd: {
      "npm": "npx shadcn@latest add https://peel-ui.vercel.app/r/voice-pill.json",
      "pnpm": "pnpm dlx shadcn@latest add https://peel-ui.vercel.app/r/voice-pill.json",
      "yarn": "npx shadcn@latest add https://peel-ui.vercel.app/r/voice-pill.json",
      "bun": "bunx --bun shadcn@latest add https://peel-ui.vercel.app/r/voice-pill.json"
},
    props: [
      {
            "name": "accentColor",
            "type": "string",
            "default": "\"#84ff00\"",
            "description": "Waveform and status accent color (Peel Acid Lime)."
      },
      {
            "name": "stopColor",
            "type": "string",
            "default": "\"#ff553e\"",
            "description": "Color for active stop square and cancel indicator (Peel Coral)."
      },
      {
            "name": "iconColor",
            "type": "string",
            "default": "\"#a1a1aa\"",
            "description": "Idle microphone icon color."
      },
      {
            "name": "background",
            "type": "string",
            "default": "\"#101216\"",
            "description": "Capsule shell chassis background."
      },
      {
            "name": "borderColor",
            "type": "string",
            "default": "\"#232730\"",
            "description": "Hairline border stroke color."
      },
      {
            "name": "size",
            "type": "number",
            "default": "32",
            "description": "Idle height and width in pixels."
      },
      {
            "name": "shape",
            "type": "\"pill\" | \"rounded\"",
            "default": "\"pill\"",
            "description": "Capsule corner geometry style."
      },
      {
            "name": "reach",
            "type": "number",
            "default": "10",
            "description": "Additional extension buffer when expanded."
      },
      {
            "name": "showTime",
            "type": "boolean",
            "default": "true",
            "description": "Whether to show monospace elapsed clock (0:00)."
      },
      {
            "name": "waveform",
            "type": "boolean",
            "default": "true",
            "description": "Whether to render dynamic canvas audio waveform."
      },
      {
            "name": "slideToCancel",
            "type": "boolean",
            "default": "true",
            "description": "Enables horizontal slide-to-cancel drag physics."
      },
      {
            "name": "cancelDistance",
            "type": "number",
            "default": "64",
            "description": "Pixel distance dragged left before triggering cancel."
      },
      {
            "name": "attack",
            "type": "number",
            "default": "40",
            "description": "Waveform envelope attack time constant (ms)."
      },
      {
            "name": "release",
            "type": "number",
            "default": "240",
            "description": "Waveform envelope release decay constant (ms)."
      },
      {
            "name": "sensitivity",
            "type": "number",
            "default": "1.2",
            "description": "Audio input gain multiplier."
      },
      {
            "name": "floor",
            "type": "number",
            "default": "0.12",
            "description": "Minimum visible waveform bar height ratio."
      },
      {
            "name": "openDuration",
            "type": "number",
            "default": "220",
            "description": "Expansion transition duration in ms."
      },
      {
            "name": "pressScale",
            "type": "number",
            "default": "0.96",
            "description": "Scale transformation on pointer down."
      },
      {
            "name": "mode",
            "type": "\"auto\" | \"hold\" | \"toggle\"",
            "default": "\"auto\"",
            "description": "Trigger interaction mode."
      },
      {
            "name": "holdAfter",
            "type": "number",
            "default": "300",
            "description": "Milliseconds before tap transitions into a hold."
      },
      {
            "name": "reactive",
            "type": "\"simulated\" | \"mic\"",
            "default": "\"mic\"",
            "description": "Audio source: real microphone or simulated speech."
      },
      {
            "name": "disabled",
            "type": "boolean",
            "default": "false",
            "description": "Disables recording triggers."
      },
      {
            "name": "ariaLabel",
            "type": "string",
            "default": "\"Voice Memo\"",
            "description": "Accessible label."
      },
      {
            "name": "onStart",
            "type": "(info: { source: \"simulated\" | \"mic\" }) => void",
            "default": "undefined",
            "description": "Fired when voice recording starts."
      },
      {
            "name": "onStop",
            "type": "(info: { reason: string; duration: number }) => void",
            "default": "undefined",
            "description": "Fired when voice recording terminates."
      },
      {
            "name": "className",
            "type": "string",
            "default": "\"\"",
            "description": "Additional styling classes."
      }
],
    usageSnippet: "import { VoicePill } from \"@/components/ui/voice-pill\";\n\nexport default function VoicePillDemo() {\n  return (\n    <VoicePill\n      size={40}\n      reactive=\"simulated\"\n      onStart={(info) => console.log(\"Audio capture started:\", info.source)}\n      onStop={(info) => console.log(`Stopped (${info.reason}) after ${info.duration}ms`)}\n    />\n  );\n}",
    usageCode: "import { VoicePill } from \"@/components/ui/voice-pill\";\n\nexport default function VoicePillDemo() {\n  return (\n    <VoicePill\n      size={40}\n      reactive=\"simulated\"\n      onStart={(info) => console.log(\"Audio capture started:\", info.source)}\n      onStop={(info) => console.log(`Stopped (${info.reason}) after ${info.duration}ms`)}\n    />\n  );\n}",
    sourceCode: "\"use client\";\n\nimport React, { useEffect, useRef, useState, useCallback, forwardRef } from \"react\";\nimport { ArrowLeft } from \"lucide-react\";\n\nexport interface VoicePillProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {\n  accentColor?: string;\n  stopColor?: string;\n  iconColor?: string;\n  background?: string;\n  borderColor?: string;\n  size?: number;\n  shape?: \"pill\" | \"rounded\";\n  reach?: number;\n  showTime?: boolean;\n  waveform?: boolean;\n  slideToCancel?: boolean;\n  cancelDistance?: number;\n  attack?: number;\n  release?: number;\n  sensitivity?: number;\n  floor?: number;\n  openDuration?: number;\n  pressScale?: number;\n  mode?: \"auto\" | \"hold\" | \"toggle\";\n  holdAfter?: number;\n  reactive?: \"simulated\" | \"mic\";\n  disabled?: boolean;\n  ariaLabel?: string;\n  onStart?: (info: { source: \"simulated\" | \"mic\" }) => void;\n  onStop?: (info: { reason: string; duration: number }) => void;\n  className?: string;\n}\n\nconst LOOP = 4.8;\nconst SYLLABLES: [number, number, number][] = [\n  [0.1, 0.16, 0.9],\n  [0.3, 0.12, 0.7],\n  [0.5, 0.2, 1],\n  [0.95, 0.14, 0.8],\n  [1.15, 0.1, 0.6],\n  [1.3, 0.22, 0.95],\n  [1.9, 0.16, 0.85],\n  [2.12, 0.12, 0.7],\n  [2.3, 0.18, 0.9],\n  [2.55, 0.1, 0.5],\n  [3.05, 0.24, 1],\n  [3.4, 0.12, 0.75],\n  [3.6, 0.16, 0.9],\n];\n\nconst MIC_BINS: [number, number][] = [\n  [1, 4],\n  [4, 11],\n  [11, 33],\n];\nconst MIC_GAIN = 2.4;\nconst DT_MAX = 0.05;\nconst SLIDE_MIN = 4;\nconst WAVE_EVERY = 4;\nconst WAVE_MAX = 80;\n\nconst simulatedLevel = (t: number) => {\n  const u = t % LOOP;\n  let a = 0.06;\n  for (const [s, d, p] of SYLLABLES) {\n    const x = (u - s) / d;\n    if (x >= 0 && x <= 1) a = Math.max(a, p * 0.5 * (1 - Math.cos(2 * Math.PI * x)));\n  }\n  return a * (0.7 + 0.3 * Math.abs(Math.sin(2 * Math.PI * 7.1 * u)));\n};\n\nconst micLevel = (analyser: AnalyserNode, buf: Uint8Array) => {\n  analyser.getByteFrequencyData(buf as unknown as Uint8Array<ArrayBuffer>);\n  let total = 0;\n  for (const [lo, hi] of MIC_BINS) {\n    let s = 0;\n    for (let i = lo; i < hi; i += 1) s += buf[i];\n    total += s / ((hi - lo) * 255);\n  }\n  return (total / MIC_BINS.length) * MIC_GAIN;\n};\n\ninterface WaveState {\n  hist: number[];\n  tick: number;\n  acc: number;\n}\n\nconst drawWave = (\n  s: WaveState,\n  canvas: HTMLCanvasElement,\n  level: number,\n  color: string,\n  floor: number\n) => {\n  const dpr = Math.min(2, window.devicePixelRatio || 1);\n  const rect = canvas.getBoundingClientRect();\n  const W = Math.max(1, Math.round(rect.width * dpr));\n  const H = Math.max(1, Math.round(rect.height * dpr));\n  if (canvas.width !== W || canvas.height !== H) {\n    canvas.width = W;\n    canvas.height = H;\n  }\n  const ctx = canvas.getContext(\"2d\");\n  if (!ctx) return;\n\n  s.acc = Math.max(s.acc, level);\n  s.tick = (s.tick + 1) % WAVE_EVERY;\n  if (s.tick === 0) {\n    s.hist.push(s.acc);\n    s.acc = 0;\n    if (s.hist.length > WAVE_MAX) s.hist.shift();\n  }\n\n  const bw = 2.5 * dpr;\n  const step = 4 * dpr;\n  const shift = (s.tick / WAVE_EVERY) * step;\n\n  ctx.clearRect(0, 0, W, H);\n  ctx.fillStyle = color;\n\n  for (let i = 0; i < s.hist.length; i += 1) {\n    const v = s.hist[s.hist.length - 1 - i];\n    const x = W - (i + 1) * step - shift;\n    if (x + bw < 0) break;\n    const h = Math.max(bw, (floor + (1 - floor) * v) * H);\n    const t = Math.min(1, Math.max(0, (x + bw / 2) / (W * 0.55)));\n    const fade = t * t * (3 - 2 * t);\n    ctx.globalAlpha = (0.35 + 0.65 * v) * fade;\n    ctx.beginPath();\n    if (typeof ctx.roundRect === \"function\") {\n      ctx.roundRect(x, (H - h) / 2, bw, h, bw / 2);\n    } else {\n      ctx.rect(x, (H - h) / 2, bw, h);\n    }\n    ctx.fill();\n  }\n  ctx.globalAlpha = 1;\n};\n\nconst formatClock = (ms: number) => {\n  const s = Math.floor(ms / 1000);\n  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, \"0\")}`;\n};\n\ninterface InternalAudioState {\n  ctx: AudioContext;\n  stream?: MediaStream;\n  src?: MediaStreamAudioSourceNode;\n  analyser?: AnalyserNode;\n  buf?: Uint8Array;\n}\n\ninterface InternalConfig {\n  attack: number;\n  release: number;\n  sensitivity: number;\n  floor: number;\n  mode: \"auto\" | \"hold\" | \"toggle\";\n  holdAfter: number;\n  reactive: \"simulated\" | \"mic\";\n  showTime: boolean;\n  waveform: boolean;\n  slideToCancel: boolean;\n  cancelDistance: number;\n  accentColor: string;\n  onStart?: (info: { source: \"simulated\" | \"mic\" }) => void;\n  onStop?: (info: { reason: string; duration: number }) => void;\n}\n\nfunction ProCapsuleMic({\n  size = 20,\n  className = \"\",\n  style,\n}: {\n  size?: number;\n  className?: string;\n  style?: React.CSSProperties;\n}) {\n  return (\n    <svg\n      width={size}\n      height={size}\n      viewBox=\"0 0 24 24\"\n      fill=\"none\"\n      stroke=\"currentColor\"\n      strokeWidth=\"1.8\"\n      strokeLinecap=\"round\"\n      strokeLinejoin=\"round\"\n      className={className}\n      style={style}\n    >\n      {/* Precision cylindrical acoustic capsule head */}\n      <rect x=\"7.5\" y=\"2.5\" width=\"9\" height=\"12\" rx=\"4.5\" fill=\"currentColor\" fillOpacity=\"0.12\" />\n      {/* Fine horizontal acoustic mesh baffles */}\n      <line x1=\"10\" y1=\"5.5\" x2=\"14\" y2=\"5.5\" strokeWidth=\"1.2\" strokeOpacity=\"0.65\" />\n      <line x1=\"9.5\" y1=\"8.5\" x2=\"14.5\" y2=\"8.5\" strokeWidth=\"1.2\" strokeOpacity=\"0.65\" />\n      <line x1=\"10\" y1=\"11.5\" x2=\"14\" y2=\"11.5\" strokeWidth=\"1.2\" strokeOpacity=\"0.65\" />\n      {/* Machined audio collar and handle body */}\n      <path d=\"M9.5 14.5L10.5 21.5H13.5L14.5 14.5\" strokeWidth=\"1.6\" />\n      <line x1=\"10\" y1=\"17.5\" x2=\"14\" y2=\"17.5\" strokeWidth=\"1.2\" strokeOpacity=\"0.4\" />\n    </svg>\n  );\n}\n\nexport const VoicePill = forwardRef<HTMLButtonElement, VoicePillProps>(function VoicePill(\n  {\n    accentColor = \"#84ff00\",       // Peel Acid Lime\n    stopColor = \"#ff553e\",         // Peel Warm Coral\n    iconColor = \"#a1a1aa\",\n    background = \"#101216\",        // Peel Obsidian\n    borderColor = \"#232730\",\n    size = 32,\n    shape = \"pill\",\n    reach = 10,\n    showTime = true,\n    waveform = true,\n    slideToCancel = true,\n    cancelDistance = 64,\n    attack = 40,\n    release = 240,\n    sensitivity = 1.2,\n    floor = 0.12,\n    openDuration = 220,\n    pressScale = 0.96,\n    mode = \"auto\",\n    holdAfter = 300,\n    reactive = \"mic\",\n    disabled = false,\n    ariaLabel = \"Voice Memo\",\n    onStart,\n    onStop,\n    className = \"\",\n    ...props\n  },\n  forwardedRef\n) {\n  const [listening, setListening] = useState(false);\n  const [pressed, setPressed] = useState(false);\n  const [, setInput] = useState<\"pointer\" | \"key\">(\"pointer\");\n\n  const timeRef = useRef<HTMLSpanElement>(null);\n  const rootRef = useRef<HTMLButtonElement | null>(null);\n  const waveRef = useRef<HTMLCanvasElement>(null);\n\n  const st = useRef({\n    listening: false,\n    pointerId: null as number | null,\n    ownPress: false,\n    downX: 0,\n    sliding: false,\n    hist: [] as number[],\n    tick: 0,\n    acc: 0,\n    downAt: 0,\n    startedAt: 0,\n    raf: 0,\n    last: 0,\n    env: 0,\n    t0: 0,\n    audio: null as InternalAudioState | null,\n  });\n\n  const cfg = useRef<InternalConfig>({\n    attack,\n    release,\n    sensitivity,\n    floor,\n    mode,\n    holdAfter,\n    reactive,\n    showTime,\n    waveform,\n    slideToCancel,\n    cancelDistance,\n    accentColor,\n    onStart,\n    onStop,\n  });\n\n  useEffect(() => {\n    cfg.current = {\n      attack,\n      release,\n      sensitivity,\n      floor,\n      mode,\n      holdAfter,\n      reactive,\n      showTime,\n      waveform,\n      slideToCancel,\n      cancelDistance,\n      accentColor,\n      onStart,\n      onStop,\n    };\n  });\n\n  const openMic = async (s: typeof st.current) => {\n    if (typeof window === \"undefined\") return;\n    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;\n    if (!AudioCtx || !navigator.mediaDevices?.getUserMedia) throw new Error(\"unsupported\");\n    s.audio ??= { ctx: new AudioCtx() };\n    const a = s.audio;\n    if (a.ctx.state === \"suspended\") await a.ctx.resume();\n    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });\n    if (!s.listening) {\n      stream.getTracks().forEach((t) => t.stop());\n      return;\n    }\n    a.stream = stream;\n    a.src = a.ctx.createMediaStreamSource(stream);\n    a.analyser = a.ctx.createAnalyser();\n    a.analyser.fftSize = 256;\n    a.analyser.smoothingTimeConstant = 0.2;\n    a.src.connect(a.analyser);\n    a.buf = new Uint8Array(a.analyser.frequencyBinCount);\n  };\n\n  const closeMic = (s: typeof st.current) => {\n    const a = s.audio;\n    if (!a?.stream) return;\n    a.stream.getTracks().forEach((t: MediaStreamTrack) => t.stop());\n    a.src?.disconnect();\n    a.stream = undefined;\n    a.src = undefined;\n    a.analyser = undefined;\n    a.buf = undefined;\n  };\n\n  const end = useCallback((reason: string) => {\n    const s = st.current;\n    const c = cfg.current;\n    if (!s.listening) return;\n    s.listening = false;\n    closeMic(s);\n    setListening(false);\n    setInput(reason === \"key\" || reason === \"escape\" ? \"key\" : \"pointer\");\n    c.onStop?.({ reason, duration: Math.round(performance.now() - s.startedAt) });\n  }, []);\n\n  const frameRef = useRef<(now: number) => void>(() => {});\n\n  const frame = useCallback((now: number) => {\n    const s = st.current;\n    const c = cfg.current;\n    const dt = Math.min((now - s.last) / 1000, DT_MAX);\n    s.last = now;\n\n    let target = 0;\n    if (s.listening) {\n      if (s.audio?.analyser && s.audio.buf) {\n        target = micLevel(s.audio.analyser, s.audio.buf);\n      } else if (c.reactive !== \"mic\") {\n        target = simulatedLevel((now - s.t0) / 1000);\n      }\n    }\n\n    target = Math.min(1, target * c.sensitivity);\n    const tau = Math.max(1, target > s.env ? c.attack : c.release) / 1000;\n    s.env += (target - s.env) * (1 - Math.exp(-dt / tau));\n\n    if (s.listening && c.showTime && timeRef.current) {\n      const text = formatClock(now - s.startedAt);\n      if (timeRef.current.textContent !== text) timeRef.current.textContent = text;\n    }\n\n    if (s.listening && c.waveform && waveRef.current) {\n      drawWave(s, waveRef.current, s.env, c.accentColor, c.floor);\n    }\n\n    s.raf = s.listening ? requestAnimationFrame((nextNow) => frameRef.current(nextNow)) : 0;\n  }, []);\n\n  useEffect(() => {\n    frameRef.current = frame;\n  }, [frame]);\n\n  const begin = (kind: \"pointer\" | \"key\") => {\n    const s = st.current;\n    const c = cfg.current;\n    if (s.listening || disabled) return;\n    s.listening = true;\n    s.hist = [];\n    s.tick = 0;\n    s.acc = 0;\n    s.env = 0;\n    s.startedAt = performance.now();\n    s.t0 = s.startedAt;\n    s.last = s.startedAt;\n    if (timeRef.current) timeRef.current.textContent = \"0:00\";\n    setListening(true);\n    setInput(kind);\n    if (!s.raf) s.raf = requestAnimationFrame((nextNow) => frameRef.current(nextNow));\n    c.onStart?.({ source: c.reactive });\n\n    if (c.reactive === \"mic\") {\n      openMic(s).catch(() => {\n        // Graceful fallback to simulated speech cadence if permission denied\n        c.reactive = \"simulated\";\n      });\n    }\n  };\n\n  const settleSlide = () => {\n    const s = st.current;\n    const root = rootRef.current;\n    s.sliding = false;\n    if (!root) return;\n    delete root.dataset.sliding;\n    root.style.setProperty(\"--vp-slide\", \"0px\");\n    root.style.setProperty(\"--vp-cancel\", \"0\");\n  };\n\n  const onPointerMove = (e: React.PointerEvent) => {\n    const s = st.current;\n    const c = cfg.current;\n    const root = rootRef.current;\n    if (!root || s.pointerId !== e.pointerId || !c.slideToCancel || !s.listening || !s.ownPress) return;\n    const dx = e.clientX - s.downX;\n    if (!s.sliding && dx > -SLIDE_MIN) return;\n    s.sliding = true;\n    root.dataset.sliding = \"\";\n    const pull = Math.min(c.cancelDistance + 24, Math.max(0, -dx));\n    root.style.setProperty(\"--vp-slide\", `${-pull}px`);\n    const progress = Math.min(1, pull / c.cancelDistance);\n    root.style.setProperty(\"--vp-cancel\", progress.toFixed(3));\n    if (progress >= 1) {\n      settleSlide();\n      end(\"cancel\");\n    }\n  };\n\n  const onPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {\n    const s = st.current;\n    if (disabled || e.button !== 0 || !e.isPrimary || s.pointerId !== null) return;\n    s.pointerId = e.pointerId;\n    s.downX = e.clientX;\n    s.downAt = performance.now();\n    try {\n      e.currentTarget.setPointerCapture(e.pointerId);\n    } catch {}\n    setPressed(true);\n    s.ownPress = !s.listening;\n    if (!s.listening) begin(\"pointer\");\n  };\n\n  const onPointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {\n    const s = st.current;\n    const c = cfg.current;\n    if (e.pointerId !== s.pointerId) return;\n    s.pointerId = null;\n    setPressed(false);\n    if (s.sliding) settleSlide();\n    try {\n      if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);\n    } catch {}\n    if (!s.listening) return;\n    const held = performance.now() - s.downAt;\n    const isHold = c.mode === \"hold\" || (c.mode === \"auto\" && held >= c.holdAfter);\n    if (s.ownPress) {\n      if (isHold) end(\"release\");\n    } else {\n      end(held < c.holdAfter ? \"tap\" : \"release\");\n    }\n  };\n\n  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {\n    if (e.key === \"Escape\") {\n      end(\"escape\");\n      return;\n    }\n    if ((e.key === \" \" || e.key === \"Enter\") && !e.repeat) {\n      e.preventDefault();\n      if (st.current.listening) end(\"key\");\n      else begin(\"key\");\n    }\n  };\n\n  useEffect(() => {\n    const s = st.current;\n    return () => {\n      end(\"unmount\");\n      cancelAnimationFrame(s.raf);\n      s.audio?.ctx.close();\n    };\n  }, [end]);\n\n  const radius = shape === \"rounded\" ? Math.round(size * 0.28) : size / 2;\n  const timeSize = Math.max(11, Math.round(size * 0.35));\n  const clockW = showTime ? Math.round(timeSize * 2.8) + 6 : 0;\n  const waveW = waveform ? Math.round(size * 2.4) : 0;\n  const extra = clockW + waveW;\n\n  const handleRef = (node: HTMLButtonElement | null) => {\n    rootRef.current = node;\n    if (typeof forwardedRef === \"function\") {\n      forwardedRef(node);\n    } else if (forwardedRef) {\n      forwardedRef.current = node;\n    }\n  };\n\n  return (\n    <button\n      type=\"button\"\n      ref={handleRef}\n      disabled={disabled}\n      aria-label={props[\"aria-label\"] || ariaLabel}\n      aria-pressed={listening}\n      onPointerDown={onPointerDown}\n      onPointerMove={onPointerMove}\n      onPointerUp={onPointerUp}\n      onPointerCancel={onPointerUp}\n      onKeyDown={onKeyDown}\n      onContextMenu={(e) => e.preventDefault()}\n      className={`group relative inline-flex items-center justify-end select-none outline-none transition-all duration-150 ${\n        listening ? \"border-transparent\" : \"border\"\n      } ${className}`}\n      style={{\n        width: `${size}px`,\n        height: `${size}px`,\n        borderRadius: `${radius}px`,\n        backgroundColor: background,\n        borderColor: listening ? \"transparent\" : borderColor,\n        transform: pressed ? `scale(${pressScale})` : \"scale(1)\",\n        touchAction: \"none\",\n        boxShadow: listening\n          ? \"none\"\n          : \"inset 0 1px 0 0 rgba(255,255,255,0.08), inset 0 -1px 0 0 rgba(0,0,0,0.6), 0 2px 8px -1px rgba(0,0,0,0.5)\",\n      }}\n      {...props}\n    >\n      {/* 1. Expanding Capsule Shell */}\n      <span\n        className=\"pointer-events-none absolute inset-0 transition-all border\"\n        style={{\n          borderRadius: `${radius}px`,\n          backgroundColor: background,\n          borderColor: listening ? borderColor : \"transparent\",\n          left: listening ? `-${reach + extra}px` : \"0px\",\n          transitionDuration: `${openDuration}ms`,\n          transitionTimingFunction: \"cubic-bezier(0.16, 1, 0.3, 1)\",\n          boxShadow: listening\n            ? \"0 8px 24px -4px rgba(0,0,0,0.7), inset 0 1px 0 0 rgba(255,255,255,0.08), inset 0 -1px 0 0 rgba(0,0,0,0.6)\"\n            : \"none\",\n        }}\n      />\n\n      {/* 2. Waveform Realtime Canvas */}\n      {waveform && (\n        <canvas\n          ref={waveRef}\n          className=\"pointer-events-none absolute z-10 transition-opacity duration-200\"\n          style={{\n            top: \"15%\",\n            height: \"70%\",\n            right: `${size + clockW}px`,\n            width: `${waveW}px`,\n            opacity: listening ? 1 : 0,\n          }}\n        />\n      )}\n\n      {/* 3. Slide to Cancel Indicator */}\n      {slideToCancel && (\n        <span\n          className=\"pointer-events-none absolute z-10 flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider transition-opacity opacity-[var(--vp-cancel,0)]\"\n          style={{\n            right: `${size + 8}px`,\n            color: stopColor,\n          }}\n        >\n          <ArrowLeft size={11} strokeWidth={2.5} />\n          <span>Cancel</span>\n        </span>\n      )}\n\n      {/* 4. Monospace Clock */}\n      {showTime && (\n        <span\n          ref={timeRef}\n          className=\"pointer-events-none absolute z-10 flex items-center justify-center font-mono text-zinc-300 tabular-nums transition-opacity duration-200\"\n          style={{\n            right: `${size + 4}px`,\n            width: `${clockW}px`,\n            fontSize: `${timeSize}px`,\n            opacity: listening ? 1 : 0,\n          }}\n        >\n          0:00\n        </span>\n      )}\n\n      {/* 5. Center Icon (Pro Capsule Mic or Solid Coral Stop Jewel) */}\n      <span className=\"relative z-10 flex h-full w-full items-center justify-center\">\n        {listening ? (\n          <span\n            className=\"rounded-xs border border-[#ff7b6b]/50 shadow-[0_0_8px_rgba(255,85,62,0.6)]\"\n            style={{\n              width: `${Math.round(size * 0.28)}px`,\n              height: `${Math.round(size * 0.28)}px`,\n              backgroundColor: stopColor,\n              boxShadow: \"inset 0 1px 0 rgba(255,255,255,0.4), 0 0 8px rgba(255,85,62,0.6)\",\n            }}\n            aria-hidden=\"true\"\n          />\n        ) : (\n          <ProCapsuleMic\n            size={Math.round(size * 0.52)}\n            style={{ color: iconColor }}\n            className=\"group-hover:text-white transition-colors\"\n          />\n        )}\n      </span>\n    </button>\n  );\n});\n",
    component: () => React.createElement("div", { className: "w-full flex items-center justify-center p-4" }, React.createElement(VoicePill, { reactive: "simulated", size: 40 })),
  },
  {
    slug: "privacy-shutter",
    name: "Privacy Shutter",
    category: "SECURITY",
    tagline: "Tactile mechanical privacy shutter primitive for sensitive credential concealment, spring peek, and latch detent.",
    description: "A physical concealment barrier for sensitive credentials featuring mechanical slide-to-peek kinematics, an 80% detent lock latch, and integrated 1-click clipboard actions.",
    mechanicalDescription: "Sliding chamfered aluminum faceplate with tactile grip ribs. Dragging allows elastic spring-peek below 80% travel. Passing the 80% detent locks shutter open into full view with keyboard toggle support.",
    interactionType: "Sliding chamfered aluminum faceplate with tactile grip ribs. Dragging allows elastic spring-peek below 80% travel. Passing the 80% detent locks shutter open into full view with keyboard toggle support.",
    dependencies: ["motion","lucide-react","clsx","tailwind-merge"],
    install: {
      "npm": "npx shadcn@latest add https://peel-ui.vercel.app/r/privacy-shutter.json",
      "pnpm": "pnpm dlx shadcn@latest add https://peel-ui.vercel.app/r/privacy-shutter.json",
      "yarn": "npx shadcn@latest add https://peel-ui.vercel.app/r/privacy-shutter.json",
      "bun": "bunx --bun shadcn@latest add https://peel-ui.vercel.app/r/privacy-shutter.json"
},
    installCmd: {
      "npm": "npx shadcn@latest add https://peel-ui.vercel.app/r/privacy-shutter.json",
      "pnpm": "pnpm dlx shadcn@latest add https://peel-ui.vercel.app/r/privacy-shutter.json",
      "yarn": "npx shadcn@latest add https://peel-ui.vercel.app/r/privacy-shutter.json",
      "bun": "bunx --bun shadcn@latest add https://peel-ui.vercel.app/r/privacy-shutter.json"
},
    props: [
      {
            "name": "apiKey",
            "type": "string",
            "default": "\"sk_live_51M0x9F4kL2026peel\"",
            "description": "Sensitive key or credential to conceal or reveal."
      },
      {
            "name": "maskedKey",
            "type": "string",
            "default": "\"sk_live_••••••••38f2\"",
            "description": "Masked representation displayed when shutter is shut."
      },
      {
            "name": "label",
            "type": "string",
            "default": "\"Production Key\"",
            "description": "Section header title label."
      },
      {
            "name": "onCopy",
            "type": "(key: string) => void",
            "default": "undefined",
            "description": "Callback fired when API key is copied to clipboard."
      },
      {
            "name": "onToggleLock",
            "type": "(isLockedOpen: boolean) => void",
            "default": "undefined",
            "description": "Callback fired when lock state toggles."
      },
      {
            "name": "className",
            "type": "string",
            "default": "undefined",
            "description": "Additional classes applied to outer container."
      }
],
    usageSnippet: "import { PrivacyShutter } from \"@/components/ui/privacy-shutter\";\n\nexport default function PrivacyShutterDemo() {\n  return (\n    <PrivacyShutter\n      label=\"Secret API Key\"\n      apiKey=\"sk_live_994827104928peel\"\n      maskedKey=\"sk_live_••••••••7104\"\n      onCopy={(key) => console.log(\"Copied key:\", key)}\n      onToggleLock={(open) => console.log(\"Shutter open state:\", open)}\n      className=\"w-full max-w-[440px]\"\n    />\n  );\n}",
    usageCode: "import { PrivacyShutter } from \"@/components/ui/privacy-shutter\";\n\nexport default function PrivacyShutterDemo() {\n  return (\n    <PrivacyShutter\n      label=\"Secret API Key\"\n      apiKey=\"sk_live_994827104928peel\"\n      maskedKey=\"sk_live_••••••••7104\"\n      onCopy={(key) => console.log(\"Copied key:\", key)}\n      onToggleLock={(open) => console.log(\"Shutter open state:\", open)}\n      className=\"w-full max-w-[440px]\"\n    />\n  );\n}",
    sourceCode: "\"use client\";\n\nimport * as React from \"react\";\nimport {\n  motion,\n  useMotionValue,\n  useTransform,\n  animate,\n  useReducedMotion,\n  AnimatePresence,\n} from \"motion/react\";\nimport { Lock, Unlock, Copy, Check } from \"lucide-react\";\nimport { cn } from \"@/lib/utils\";\n\nexport interface PrivacyShutterProps {\n  /** The sensitive key to conceal/reveal (default: \"sk_live_51M0x9F4kL2026peel\") */\n  apiKey?: string;\n  /** Masked representation shown when covered (default: \"sk_live_••••••••38f2\") */\n  maskedKey?: string;\n  /** Section label (default: \"Production Key\") */\n  label?: string;\n  /** Callback fired when key is copied */\n  onCopy?: (key: string) => void;\n  /** Callback fired when lock state toggles */\n  onToggleLock?: (isLockedOpen: boolean) => void;\n  /** Additional container styling */\n  className?: string;\n}\n\nconst DEFAULT_KEY = \"sk_live_51M0x9F4kL2026peel\";\nconst DEFAULT_MASKED = \"sk_live_••••••••38f2\";\n\nexport function PrivacyShutter({\n  apiKey = DEFAULT_KEY,\n  maskedKey = DEFAULT_MASKED,\n  label = \"Production Key\",\n  onCopy,\n  onToggleLock,\n  className,\n}: PrivacyShutterProps) {\n  const [isLockedOpen, setIsLockedOpen] = React.useState(false);\n  const [copied, setCopied] = React.useState(false);\n  const [isDragging, setIsDragging] = React.useState(false);\n  const trackRef = React.useRef<HTMLDivElement>(null);\n  const shouldReduceMotion = useReducedMotion();\n\n  // Hardware-accelerated drag coordinate (zero React state updates in the drag loop)\n  const x = useMotionValue(0);\n\n  // Dynamic travel distance: trackWidth - copyButtonArea - gripHandleWidth\n  const [maxDrag, setMaxDrag] = React.useState<number>(170);\n\n  React.useEffect(() => {\n    const el = trackRef.current;\n    if (!el) return;\n\n    const calculateBounds = () => {\n      const width = el.clientWidth;\n      // Copy button takes ~44px on right, leave ~54px grip tab visible at max drag\n      // so the user can easily pull it back shut\n      const calculatedMax = Math.max(80, width - 44 - 54);\n      setMaxDrag(calculatedMax);\n      if (isLockedOpen) {\n        x.set(calculatedMax);\n      }\n    };\n\n    calculateBounds();\n\n    const resizeObserver = new ResizeObserver(() => {\n      calculateBounds();\n    });\n\n    resizeObserver.observe(el);\n    return () => resizeObserver.disconnect();\n  }, [isLockedOpen, x]);\n\n  // Shutter label smoothly fades out as the plate moves right\n  const labelOpacity = useTransform(x, [0, 45], [1, 0]);\n\n  // Spring physics specification (strict tactile mechanical transition)\n  const springConfig = React.useMemo(\n    () => ({\n      type: \"spring\" as const,\n      stiffness: shouldReduceMotion ? 1000 : 500,\n      damping: shouldReduceMotion ? 100 : 32,\n      mass: 0.8,\n    }),\n    [shouldReduceMotion]\n  );\n\n  const snapOpen = React.useCallback(() => {\n    setIsLockedOpen(true);\n    animate(x, maxDrag, springConfig);\n    onToggleLock?.(true);\n  }, [x, maxDrag, springConfig, onToggleLock]);\n\n  const snapShut = React.useCallback(() => {\n    setIsLockedOpen(false);\n    animate(x, 0, springConfig);\n    onToggleLock?.(false);\n  }, [x, springConfig, onToggleLock]);\n\n  const toggleLock = React.useCallback(() => {\n    if (isLockedOpen) {\n      snapShut();\n    } else {\n      snapOpen();\n    }\n  }, [isLockedOpen, snapOpen, snapShut]);\n\n  const handleDragEnd = () => {\n    setIsDragging(false);\n    const currentX = x.get();\n    const threshold = maxDrag * 0.8; // 80% Latch Detent\n\n    if (currentX >= threshold) {\n      snapOpen();\n    } else {\n      snapShut();\n    }\n  };\n\n  const handleCopy = async (e: React.MouseEvent) => {\n    e.stopPropagation();\n    try {\n      if (typeof navigator !== \"undefined\" && navigator.clipboard?.writeText) {\n        await navigator.clipboard.writeText(apiKey);\n      }\n      setCopied(true);\n      onCopy?.(apiKey);\n      setTimeout(() => setCopied(false), 1500);\n    } catch {\n      setCopied(true);\n      setTimeout(() => setCopied(false), 1500);\n    }\n  };\n\n  const handleKeyDown = (e: React.KeyboardEvent) => {\n    if (e.key === \"Enter\" || e.key === \" \") {\n      e.preventDefault();\n      toggleLock();\n    } else if (e.key === \"ArrowRight\") {\n      e.preventDefault();\n      snapOpen();\n    } else if (e.key === \"ArrowLeft\" || e.key === \"Escape\") {\n      e.preventDefault();\n      snapShut();\n    }\n  };\n\n  return (\n    <div\n      className={cn(\n        \"w-full max-w-[440px] mx-auto select-none\",\n        className\n      )}\n    >\n      {/* ── Chassis Container ── */}\n      <div className=\"relative flex flex-col gap-2 p-3.5 rounded-2xl bg-[#121212]/95 border border-[#262626] shadow-inner\">\n        {/* ── Top Label Row ── */}\n        <div className=\"flex items-center justify-between px-0.5\">\n          <div className=\"flex items-center gap-1.5\">\n            <span className=\"w-1.5 h-1.5 rounded-full bg-neutral-400\" />\n            <span className=\"text-[11px] font-medium text-neutral-400 tracking-tight\">\n              {label}\n            </span>\n          </div>\n\n          {/* Quick Lock/Unlock Toggle Button */}\n          <button\n            type=\"button\"\n            onClick={toggleLock}\n            title={isLockedOpen ? \"Lock key (shut shutter)\" : \"Unlock key (open shutter)\"}\n            aria-label={isLockedOpen ? \"Lock key\" : \"Unlock key\"}\n            className=\"size-6 rounded-md bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#444444] flex items-center justify-center text-neutral-400 hover:text-white transition-colors cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-neutral-400\"\n          >\n            {isLockedOpen ? (\n              <Unlock className=\"size-3 text-neutral-200\" />\n            ) : (\n              <Lock className=\"size-3 text-neutral-400\" />\n            )}\n          </button>\n        </div>\n\n        {/* ── Key Track & Sliding Shutter Stage ── */}\n        <div\n          ref={trackRef}\n          role=\"region\"\n          aria-label=\"API key secret track\"\n          className={cn(\n            \"relative h-11 w-full rounded-xl bg-[#09090b] border flex items-center px-1.5 overflow-hidden transition-colors duration-200\",\n            isLockedOpen ? \"border-[#3a3a3a]\" : \"border-[#222222]\"\n          )}\n        >\n          {/* ── Underlying Revealed Key Text (Base Layer) ── */}\n          <div className=\"absolute left-3.5 right-12 inset-y-0 flex items-center overflow-hidden pointer-events-none select-none\">\n            <span className=\"font-mono text-xs text-neutral-200 tracking-wider truncate select-all\">\n              {isLockedOpen || isDragging ? apiKey : maskedKey}\n            </span>\n          </div>\n\n          {/* ── The Sliding Shutter Plate (Physical Chamfered Cover) ── */}\n          <motion.div\n            role=\"slider\"\n            aria-valuemin={0}\n            aria-valuemax={100}\n            aria-valuenow={maxDrag > 0 ? Math.round((x.get() / maxDrag) * 100) : 0}\n            aria-label=\"Drag shutter to reveal key\"\n            tabIndex={0}\n            onKeyDown={handleKeyDown}\n            drag=\"x\"\n            dragConstraints={{ left: 0, right: maxDrag }}\n            dragElastic={0.05}\n            dragMomentum={false}\n            onDragStart={() => setIsDragging(true)}\n            onDragEnd={handleDragEnd}\n            onClick={() => {\n              if (isLockedOpen && !isDragging) {\n                snapShut();\n              }\n            }}\n            style={{ x }}\n            className={cn(\n              \"absolute inset-y-1 left-1 right-12 rounded-lg bg-[#1e1e1e] border border-[#3a3a3a] shadow-md flex items-center justify-between px-3 z-20 touch-none select-none outline-none focus-visible:ring-1 focus-visible:ring-neutral-400\",\n              isDragging ? \"cursor-grabbing\" : \"cursor-grab\",\n              \"before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-white/10\"\n            )}\n          >\n            {/* Shutter Label (Fades out when sliding) */}\n            <motion.div\n              style={{ opacity: labelOpacity }}\n              className=\"flex items-center gap-1.5 pointer-events-none select-none\"\n            >\n              <Lock className=\"size-3 text-neutral-400 shrink-0\" />\n              <span className=\"text-[10px] text-neutral-400 font-sans font-medium uppercase tracking-wider\">\n                Slide to reveal\n              </span>\n            </motion.div>\n\n            {/* Shutter Finger Grip Ribs (3 vertical etched lines) */}\n            <div\n              className=\"flex items-center gap-1 py-1 px-0.5 ml-auto pointer-events-none\"\n              title=\"Grip ribs\"\n            >\n              <div className=\"w-[1.5px] h-3.5 rounded-full bg-[#4a4a4a]\" />\n              <div className=\"w-[1.5px] h-3.5 rounded-full bg-[#4a4a4a]\" />\n              <div className=\"w-[1.5px] h-3.5 rounded-full bg-[#4a4a4a]\" />\n            </div>\n          </motion.div>\n\n          {/* ── Integrated Right Copy Action Button (Always Accessible, z-30) ── */}\n          <button\n            type=\"button\"\n            onClick={handleCopy}\n            title={copied ? \"Copied to clipboard\" : \"Copy API key\"}\n            aria-label={copied ? \"Copied\" : \"Copy API key\"}\n            className={cn(\n              \"w-8 h-8 rounded-lg bg-[#1a1a1a] border border-[#333333] hover:border-[#555555] flex items-center justify-center text-neutral-400 hover:text-white transition-all active:scale-95 ml-auto z-30 shrink-0 cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-neutral-400\",\n              copied && \"border-[#84ff00]/60 text-[#84ff00] bg-[#84ff00]/10\"\n            )}\n          >\n            <AnimatePresence mode=\"wait\" initial={false}>\n              {copied ? (\n                <motion.div\n                  key=\"check\"\n                  initial={shouldReduceMotion ? { opacity: 0 } : { scale: 0.5, opacity: 0 }}\n                  animate={{ scale: 1, opacity: 1 }}\n                  exit={{ scale: 0.5, opacity: 0 }}\n                  transition={{ duration: 0.15 }}\n                >\n                  <Check className=\"size-3.5 stroke-[2.5]\" />\n                </motion.div>\n              ) : (\n                <motion.div\n                  key=\"copy\"\n                  initial={{ opacity: 0 }}\n                  animate={{ opacity: 1 }}\n                  exit={{ opacity: 0 }}\n                  transition={{ duration: 0.15 }}\n                >\n                  <Copy className=\"size-3.5\" />\n                </motion.div>\n              )}\n            </AnimatePresence>\n          </button>\n        </div>\n      </div>\n    </div>\n  );\n}\n",
    component: () => React.createElement("div", { className: "w-full flex items-center justify-center p-4" }, React.createElement(PrivacyShutter, { className: "w-full max-w-[360px]" })),
  },
  {
    slug: "save-state-pill",
    name: "Save State Pill",
    category: "ACTIONS",
    tagline: "A quiet toolbar status pill for document saves and sync health.",
    description: "Spring-morphing toolbar status indicator with offline queuing, error recovery, and relative timestamps.",
    mechanicalDescription: "The status surface expands between six sync states with a layout spring. Saved feedback transitions to a relative timestamp after 2.5 seconds, while browser connectivity can override the supplied state.",
    interactionType: "Spring-driven layout morphing with status transitions and relative time calculation.",
    dependencies: ["motion/react", "lucide-react"],
    install: {
      npm: "npx shadcn@latest add https://peel-ui.vercel.app/r/save-state-pill.json",
      pnpm: "pnpm dlx shadcn@latest add https://peel-ui.vercel.app/r/save-state-pill.json",
      yarn: "npx shadcn@latest add https://peel-ui.vercel.app/r/save-state-pill.json",
      bun: "bunx --bun shadcn@latest add https://peel-ui.vercel.app/r/save-state-pill.json"
    },
    installCmd: {
      npm: "npx shadcn@latest add https://peel-ui.vercel.app/r/save-state-pill.json",
      pnpm: "pnpm dlx shadcn@latest add https://peel-ui.vercel.app/r/save-state-pill.json",
      yarn: "npx shadcn@latest add https://peel-ui.vercel.app/r/save-state-pill.json",
      bun: "bunx --bun shadcn@latest add https://peel-ui.vercel.app/r/save-state-pill.json"
    },
    props: [
      {
        name: "state",
        type: "SaveState",
        default: "\"idle\"",
        description: "Document and synchronization state to display."
      },
      {
        name: "lastSavedAt",
        type: "Date | string | null",
        default: "Current time",
        description: "Timestamp used to calculate the relative saved label."
      },
      {
        name: "onRetry",
        type: "() => void",
        default: "undefined",
        description: "Called when the Retry action is activated."
      },
      {
        name: "onReviewConflict",
        type: "() => void",
        default: "undefined",
        description: "Called when the Review action is activated."
      },
      {
        name: "className",
        type: "string",
        default: "undefined",
        description: "Additional classes applied to the status pill."
      },
      {
        name: "interactiveDemo",
        type: "boolean",
        default: "false",
        description: "Shows six state controls and lets the preview change its own state."
      }
    ],
    usageSnippet: "import { SaveStatePill } from \"@/components/ui/save-state-pill\";\n\nexport function DocumentStatus() {\n  return (\n    <SaveStatePill\n      state=\"saved\"\n      lastSavedAt={new Date()}\n      onRetry={() => syncDocument()}\n      onReviewConflict={() => openConflictReview()}\n    />\n  );\n}",
    usageCode: "import { SaveStatePill } from \"@/components/ui/save-state-pill\";\n\nexport function DocumentStatus() {\n  return (\n    <SaveStatePill\n      state=\"saved\"\n      lastSavedAt={new Date()}\n      onRetry={() => syncDocument()}\n      onReviewConflict={() => openConflictReview()}\n    />\n  );\n}",
    sourceCode: SAVE_STATE_PILL_SOURCE,
    component: () => React.createElement(
      "div",
      { className: "w-full flex items-center justify-center p-4" },
      React.createElement(SaveStatePillDemo)
    )
  },
  {
    slug: "filter-chips",
    name: "Tactile Filter Chips",
    category: "INPUTS",
    tagline:
      "Hardware-inspired filters with radio selection, multi-select, and spring-bound feedback.",
    description:
      "A tactile filter group for issue queues and data views, with accessible single or multiple selection, live counters, and a mechanical shared-layout indicator.",
    mechanicalDescription:
      "Single selection moves one shared indicator between options. Multiple selection gives each chip an isolated damped spring response. Radio arrows, Home, and End move focus and selection.",
    interactionType:
      "Damped spring selection, shared layout morphing, and keyboard-operable radio or pressed-button states.",
    dependencies: ["motion", "lucide-react"],
    install: {
      npm: "npx shadcn@latest add https://peel-ui.vercel.app/r/filter-chips.json",
      pnpm: "pnpm dlx shadcn@latest add https://peel-ui.vercel.app/r/filter-chips.json",
      yarn: "npx shadcn@latest add https://peel-ui.vercel.app/r/filter-chips.json",
      bun: "bunx --bun shadcn@latest add https://peel-ui.vercel.app/r/filter-chips.json",
    },
    installCmd: {
      npm: "npx shadcn@latest add https://peel-ui.vercel.app/r/filter-chips.json",
      pnpm: "pnpm dlx shadcn@latest add https://peel-ui.vercel.app/r/filter-chips.json",
      yarn: "npx shadcn@latest add https://peel-ui.vercel.app/r/filter-chips.json",
      bun: "bunx --bun shadcn@latest add https://peel-ui.vercel.app/r/filter-chips.json",
    },
    props: [
      {
        name: "options",
        type: "FilterChipOption[]",
        required: true,
        description:
          "Filter options with IDs, labels, optional counts, icons, and disabled states.",
      },
      {
        name: "mode",
        type: '"single" | "multiple"',
        default: '"single"',
        description: "Select one filter or toggle several filters.",
      },
      {
        name: "value",
        type: "string | string[]",
        default: "undefined",
        description:
          "Controlled selection; a string in single mode or a string array in multiple mode.",
      },
      {
        name: "defaultValue",
        type: "string | string[]",
        default: "undefined",
        description: "Initial selection for uncontrolled usage.",
      },
      {
        name: "onChange",
        type: "(value: string | string[]) => void",
        default: "undefined",
        description: "Called with the updated selected option ID or IDs.",
      },
      {
        name: "size",
        type: '"sm" | "md"',
        default: '"md"',
        description: "Chip density.",
      },
      {
        name: "showClear",
        type: "boolean",
        default: "false",
        description: "Shows a Reset control when one or more filters are active.",
      },
      {
        name: "className",
        type: "string",
        default: "undefined",
        description: "Additional classes applied to the outer group.",
      },
    ],
    usageSnippet:
      'import { FilterChips } from "@/components/ui/filter-chips";\n\nconst filters = [\n  { id: "all", label: "All Issues" },\n  { id: "open", label: "Open", count: 14 },\n  { id: "pull-requests", label: "Pull Requests", count: 6 },\n];\n\nexport function IssueFilters() {\n  const [filter, setFilter] = React.useState("all");\n  return (\n    <FilterChips\n      options={filters}\n      value={filter}\n      onChange={(next) => {\n        if (typeof next === "string") setFilter(next);\n      }}\n      showClear\n    />\n  );\n}',
    usageCode:
      'import { FilterChips } from "@/components/ui/filter-chips";\n\nconst filters = [\n  { id: "all", label: "All Issues" },\n  { id: "open", label: "Open", count: 14 },\n  { id: "pull-requests", label: "Pull Requests", count: 6 },\n];\n\nexport function IssueFilters() {\n  const [filter, setFilter] = React.useState("all");\n  return (\n    <FilterChips\n      options={filters}\n      value={filter}\n      onChange={(next) => {\n        if (typeof next === "string") setFilter(next);\n      }}\n      showClear\n    />\n  );\n}',
    sourceCode: FILTER_CHIPS_SOURCE,
    component: () => React.createElement(FilterChipsDemo),
    defaultSurfaceTheme: "dark",
  },
  {
    slug: "note-button",
    name: "Note Button",
    category: "ACTIONS",
    tagline:
      "A notebook trigger that opens a quiet, persistent writing surface.",
    description:
      "A portable note primitive with a geometric desktop expansion, adaptive mobile sheet, line-wrap gutter, and private local persistence.",
    mechanicalDescription:
      "The panel expands from the trigger’s live position without scaling its border or typography. On mobile it becomes a bottom sheet that follows the visual viewport when the software keyboard opens.",
    interactionType:
      "GSAP-driven geometric expansion, fullscreen morphing, and visual-viewport-aware mobile sheet.",
    dependencies: ["gsap", "@gsap/react", "lucide-react"],
    install: {
      npm: "npx shadcn@latest add https://peel-ui.vercel.app/r/note-button.json",
      pnpm: "pnpm dlx shadcn@latest add https://peel-ui.vercel.app/r/note-button.json",
      yarn: "npx shadcn@latest add https://peel-ui.vercel.app/r/note-button.json",
      bun: "bunx --bun shadcn@latest add https://peel-ui.vercel.app/r/note-button.json",
    },
    installCmd: {
      npm: "npx shadcn@latest add https://peel-ui.vercel.app/r/note-button.json",
      pnpm: "pnpm dlx shadcn@latest add https://peel-ui.vercel.app/r/note-button.json",
      yarn: "npx shadcn@latest add https://peel-ui.vercel.app/r/note-button.json",
      bun: "bunx --bun shadcn@latest add https://peel-ui.vercel.app/r/note-button.json",
    },
    props: [
      {
        name: "storageKey",
        type: "string",
        default: '"peel-note:v1"',
        description: "Local storage key used to persist note text.",
      },
      {
        name: "open",
        type: "boolean",
        default: "undefined",
        description: "Controls whether the note panel is open.",
      },
      {
        name: "onOpenChange",
        type: "(open: boolean) => void",
        default: "undefined",
        description: "Called when the panel open state changes.",
      },
      {
        name: "defaultOpen",
        type: "boolean",
        default: "false",
        description: "Initial open state for uncontrolled usage.",
      },
      {
        name: "value",
        type: "string",
        default: "undefined",
        description: "Controlled note text.",
      },
      {
        name: "onValueChange",
        type: "(value: string) => void",
        default: "undefined",
        description: "Called when note text changes.",
      },
      {
        name: "placement",
        type: '"auto" | "top-left" | "top-right" | "bottom-left" | "bottom-right"',
        default: '"auto"',
        description: "Expansion quadrant on desktop.",
      },
      {
        name: "width",
        type: "number",
        default: "380",
        description: "Target desktop panel width in pixels.",
      },
      {
        name: "height",
        type: "number",
        default: "340",
        description: "Target desktop panel height in pixels.",
      },
      {
        name: "breakpoint",
        type: "number",
        default: "640",
        description: "Viewport width below which the panel becomes a sheet.",
      },
      {
        name: "showLineNumbers",
        type: "boolean",
        default: "true",
        description: "Displays measured line numbers next to the editor.",
      },
    ],
    usageSnippet:
      'import { Note } from "@/components/ui/note-button";\n\nexport function NotesControl() {\n  return (\n    <Note.Root storageKey="peel-note:v1">\n      <Note.Trigger className="fixed bottom-6 right-6" />\n      <Note.Panel />\n    </Note.Root>\n  );\n}',
    usageCode:
      'import { Note } from "@/components/ui/note-button";\n\nexport function NotesControl() {\n  return (\n    <Note.Root storageKey="peel-note:v1">\n      <Note.Trigger className="fixed bottom-6 right-6" />\n      <Note.Panel />\n    </Note.Root>\n  );\n}',
    sourceCode: NOTE_BUTTON_SOURCE,
    component: () => React.createElement(NoteButtonDemo),
    defaultSurfaceTheme: "dark",
  },
  {
    slug: "skeleton-handoff",
    name: "Skeleton Handoff",
    category: "ACTIONS",
    tagline:
      "Matched loading blocks travel into measured content while the reserved layout eases to its final height.",
    description:
      "Skeleton Handoff measures matching loading blocks and real content, then uses GSAP Flip to move each block into place while revealing the content. Cached results render directly, short loads skip the skeleton, and refetches crossfade without reversing the handoff.",
    mechanicalDescription:
      "A root-level handoff pairs the first block and target for each data-handoff-id. Flip.fit animates each solid block to its target rectangle while real content fades in unscaled. The root height eases once to the measured content height, then all temporary inline animation styles are removed.",
    interactionType:
      "Matched blocks translate and resize into target rectangles with a top-down stagger. Unmatched blocks collapse, unmatched targets fade in, and the root height eases to its final measurement.",
    dependencies: ["gsap", "@gsap/react", "clsx", "tailwind-merge"],
    install: {
      npm: "npx shadcn@latest add https://peel-ui.vercel.app/r/skeleton-handoff.json",
      pnpm: "pnpm dlx shadcn@latest add https://peel-ui.vercel.app/r/skeleton-handoff.json",
      yarn: "npx shadcn@latest add https://peel-ui.vercel.app/r/skeleton-handoff.json",
      bun: "bunx --bun shadcn@latest add https://peel-ui.vercel.app/r/skeleton-handoff.json",
    },
    installCmd: {
      npm: "npx shadcn@latest add https://peel-ui.vercel.app/r/skeleton-handoff.json",
      pnpm: "pnpm dlx shadcn@latest add https://peel-ui.vercel.app/r/skeleton-handoff.json",
      yarn: "npx shadcn@latest add https://peel-ui.vercel.app/r/skeleton-handoff.json",
      bun: "bunx --bun shadcn@latest add https://peel-ui.vercel.app/r/skeleton-handoff.json",
    },
    props: [
      {
        name: "status",
        type: '"loading" | "ready" | "error"',
        description: "Controls the skeleton, handoff, and error states.",
        required: true,
      },
      {
        name: "skeleton",
        type: "React.ReactNode",
        description: "Skeleton markup containing HandoffBlock elements.",
        required: true,
      },
      {
        name: "children",
        type: "React.ReactNode",
        description: "Content rendered when ready and measured during handoff.",
      },
      {
        name: "duration",
        type: "number",
        default: "0.6",
        description: "Travel duration in seconds.",
      },
      {
        name: "stagger",
        type: "number",
        default: "0.04",
        description: "Delay between blocks, in seconds.",
      },
      {
        name: "skipBelow",
        type: "number",
        default: "150",
        description: "Delay in milliseconds before the skeleton becomes visible.",
      },
      {
        name: "loadingLabel",
        type: "string",
        default: '"Loading"',
        description: "Polite live-region text while data is loading.",
      },
      {
        name: "readyLabel",
        type: "string",
        default: '"Loaded"',
        description: "Polite live-region text when data becomes ready.",
      },
      {
        name: "errorLabel",
        type: "string",
        default: '"Failed to load"',
        description: "Visible alert text when the request fails.",
      },
      {
        name: "onHandoffStart",
        type: "() => void",
        description: "Called when a loading-to-ready handoff begins.",
      },
      {
        name: "onHandoffComplete",
        type: "() => void",
        description: "Called after the handoff animation completes.",
      },
      {
        name: "className",
        type: "string",
        description: "Additional classes for the root element.",
      },
      {
        name: "HandoffBlock",
        type: '{ id: string; className?: string; as?: React.ElementType }',
        default: 'as: "div"',
        description: "Creates a solid skeleton block with a matching identifier.",
      },
      {
        name: "HandoffTarget",
        type: '{ id: string; className?: string; as?: React.ElementType; children: React.ReactNode }',
        default: 'as: "div"',
        description: "Marks real content that matches a skeleton block.",
      },
    ],
    usageSnippet: `import {
  Handoff,
  HandoffBlock,
  HandoffTarget,
} from "@/components/ui/skeleton-handoff";

export function CommitStatus({ loading }: { loading: boolean }) {
  return (
    <Handoff
      status={loading ? "loading" : "ready"}
      skeleton={<HandoffBlock id="message" className="h-16 w-full" />}
    >
      <HandoffTarget id="message" as="p">
        Changes requested: reuse the current commit data.
      </HandoffTarget>
    </Handoff>
  );
}`,
    usageCode: `import {
  Handoff,
  HandoffBlock,
  HandoffTarget,
} from "@/components/ui/skeleton-handoff";

export function CommitStatus({ loading }: { loading: boolean }) {
  return (
    <Handoff
      status={loading ? "loading" : "ready"}
      skeleton={<HandoffBlock id="message" className="h-16 w-full" />}
    >
      <HandoffTarget id="message" as="p">
        Changes requested: reuse the current commit data.
      </HandoffTarget>
    </Handoff>
  );
}`,
    sourceCode: `import { Handoff, HandoffBlock, HandoffTarget } from "@/components/ui/skeleton-handoff";

<Handoff
  status={loading ? "loading" : "ready"}
  skeleton={<HandoffBlock id="message" className="h-16 w-full" />}
>
  <HandoffTarget id="message">Commit details loaded.</HandoffTarget>
</Handoff>`,
    component: () =>
      React.createElement(
        React.Suspense,
        { fallback: null },
        React.createElement(SkeletonHandoffDemo),
      ),
    defaultSurfaceTheme: "dark",
  },
];

export function getAllComponents(): ComponentRecord[] {
  return ALL_COMPONENTS;
}

export function getComponentBySlug(slug: string): ComponentRecord | undefined {
  return ALL_COMPONENTS.find((c) => c.slug === slug);
}

export function getComponentsByCategory(category: string): ComponentRecord[] {
  return ALL_COMPONENTS.filter(
    (c) => c.category.toUpperCase() === category.toUpperCase()
  );
}

export const CATEGORIES: ComponentCategory[] = [
  "ACTIONS",
  "INPUTS",
  "SECURITY",
];

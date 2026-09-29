"use client";

import * as React from "react";
import { ChevronDown, Rocket, GitBranch, RotateCcw, Check } from "lucide-react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  type Transition,
} from "motion/react";
import { cn } from "@/lib/utils";

export interface MagneticSplitAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

export interface MagneticSplitButtonProps {
  /** Initial selected action label */
  defaultAction?: string;
  /** Dropdown menu actions */
  actions?: MagneticSplitAction[];
  /** Callback fired when an action triggers */
  onAction?: (actionLabel: string) => void;
  /** Additional container styling */
  className?: string;
}

const DEFAULT_ACTIONS: MagneticSplitAction[] = [
  {
    id: "staging",
    label: "Deploy to Staging",
    icon: <Rocket className="size-3 text-neutral-400" />,
  },
  {
    id: "preview",
    label: "Create Preview Branch",
    icon: <GitBranch className="size-3 text-neutral-400" />,
  },
  {
    id: "rollback",
    label: "Rollback Release",
    icon: <RotateCcw className="size-3 text-neutral-400" />,
  },
];

export function MagneticSplitButton({
  defaultAction = "Deploy to prod",
  actions = DEFAULT_ACTIONS,
  onAction,
  className,
}: MagneticSplitButtonProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isChevronHovered, setIsChevronHovered] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [selectedAction, setSelectedAction] = React.useState(defaultAction);
  const [isTriggered, setIsTriggered] = React.useState(false);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Close dropdown on outside click
  React.useEffect(() => {
    if (!isMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  const isSeparated = isHovered || isMenuOpen;

  const springPhysics: Transition = {
    type: "spring",
    stiffness: shouldReduceMotion ? 1000 : 450,
    damping: shouldReduceMotion ? 100 : 28,
    mass: 0.8,
  };

  const handlePrimaryClick = () => {
    if (isTriggered) return;
    setIsTriggered(true);
    onAction?.(selectedAction);
    setTimeout(() => {
      setIsTriggered(false);
    }, 1200);
  };

  const handleSelectAction = (action: MagneticSplitAction) => {
    setSelectedAction(action.label);
    setIsMenuOpen(false);
    setIsTriggered(true);
    onAction?.(action.label);
    setTimeout(() => {
      setIsTriggered(false);
    }, 1200);
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsChevronHovered(false);
      }}
      className={cn(
        "relative inline-flex items-center justify-center select-none",
        className
      )}
    >
      {/* ── Primary Action Button (Pure Neutral Graphite, High Contrast) ── */}
      <motion.button
        type="button"
        onClick={handlePrimaryClick}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
        animate={{
          x: isSeparated ? -4 : 0,
          borderTopRightRadius: isSeparated ? "9999px" : "0px",
          borderBottomRightRadius: isSeparated ? "9999px" : "0px",
          borderTopLeftRadius: "9999px",
          borderBottomLeftRadius: "9999px",
        }}
        transition={springPhysics}
        className={cn(
          "relative z-10 h-9 px-4 flex items-center gap-2",
          "bg-[#1c1c1c] border border-[#383838] text-xs font-medium text-neutral-100",
          "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.09)]",
          "hover:text-white hover:bg-[#262626] hover:border-[#4d4d4d]",
          "transition-colors duration-150 outline-none cursor-pointer"
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isTriggered ? (
            <motion.span
              key="check"
              initial={
                shouldReduceMotion
                  ? { scale: 1, rotate: 0 }
                  : { scale: 0, rotate: -45 }
              }
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
              className="text-[#84ff00] flex items-center justify-center shrink-0"
            >
              <Check className="size-3.5 stroke-[2.5]" />
            </motion.span>
          ) : (
            <motion.span
              key="rocket"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.12 }}
              className="text-neutral-400 flex items-center justify-center shrink-0"
            >
              <Rocket className="size-3.5" />
            </motion.span>
          )}
        </AnimatePresence>

        {/* Stable text label — never shrinks on trigger to eliminate grid shift */}
        <span className="tracking-tight whitespace-nowrap">
          {selectedAction}
        </span>
      </motion.button>

      {/* ── Neutral Hairline Divider (fades when separated) ── */}
      <motion.div
        aria-hidden="true"
        animate={{
          opacity: isSeparated ? 0 : 1,
          scaleY: isSeparated ? 0.3 : 1,
        }}
        transition={{ duration: 0.12 }}
        className="w-px h-4 bg-[#383838] absolute z-20 pointer-events-none"
      />

      {/* ── Chevron Menu Trigger (Pure Neutral Graphite) ── */}
      <motion.button
        type="button"
        aria-label="Toggle actions menu"
        aria-expanded={isMenuOpen}
        onClick={(e) => {
          e.stopPropagation();
          setIsMenuOpen((prev) => !prev);
        }}
        onMouseEnter={() => setIsChevronHovered(true)}
        onMouseLeave={() => setIsChevronHovered(false)}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.92 }}
        animate={{
          x: isSeparated ? 4 : 0,
          borderTopLeftRadius: isSeparated ? "9999px" : "0px",
          borderBottomLeftRadius: isSeparated ? "9999px" : "0px",
          borderTopRightRadius: "9999px",
          borderBottomRightRadius: "9999px",
          scale: isChevronHovered && !shouldReduceMotion ? 1.05 : 1,
        }}
        transition={springPhysics}
        className={cn(
          "relative z-10 h-9 w-8 flex items-center justify-center",
          "bg-[#1c1c1c] border border-[#383838] text-neutral-300",
          "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.09)]",
          "hover:text-white hover:bg-[#262626] hover:border-[#4d4d4d]",
          "transition-colors duration-150 outline-none cursor-pointer",
          isMenuOpen && "border-[#525252] bg-[#262626] text-white"
        )}
      >
        <motion.div
          animate={{ rotate: isMenuOpen ? 180 : 0 }}
          transition={springPhysics}
          className="flex items-center justify-center"
        >
          <ChevronDown className="size-3.5" />
        </motion.div>
      </motion.button>

      {/* ── Tactile Dropdown Menu (Matte Pure Neutral Black, Zero Blue) ── */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: -6, scale: 0.97 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, y: -4, scale: 0.98 }
            }
            transition={{
              type: "spring",
              stiffness: 450,
              damping: 30,
              mass: 0.8,
            }}
            className="absolute top-full mt-2 right-0 w-48 z-40 rounded-2xl border border-[#333333] bg-[#121212] p-1.5 shadow-[0_12px_32px_rgba(0,0,0,0.7)] select-none"
          >
            <div className="flex flex-col gap-0.5">
              {actions.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectAction(item)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[11px] font-medium text-neutral-300 hover:bg-[#222222] hover:text-white transition-colors cursor-pointer text-left outline-none"
                >
                  <span className="flex items-center gap-2">
                    {item.icon}
                    <span>{item.label}</span>
                  </span>
                  {selectedAction === item.label && (
                    <Check className="size-3 text-[#84ff00]" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

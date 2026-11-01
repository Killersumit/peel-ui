"use client";

import * as React from "react";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  MagnifyingGlass,
  Plus,
  Archive,
  Check,
  X,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export type ThemeMode = "light" | "dark";

export interface ShortcutDefinition {
  id: "search" | "archive" | "new";
  label: string;
  key: string;
  code: string;
  mod: boolean;
  icon: typeof MagnifyingGlass;
}

export const SHORTCUT_REGISTRY: ShortcutDefinition[] = [
  {
    id: "search",
    label: "Search",
    key: "k",
    code: "KeyK",
    mod: true,
    icon: MagnifyingGlass,
  },
  {
    id: "archive",
    label: "Archive",
    key: "e",
    code: "KeyE",
    mod: false,
    icon: Archive,
  },
  {
    id: "new",
    label: "New",
    key: "c",
    code: "KeyC",
    mod: false,
    icon: Plus,
  },
];

interface ActionState {
  count: number;
  learned: boolean;
  dismissed: boolean;
}

const INITIAL_ACTIONS: Record<"search" | "archive" | "new", ActionState> = {
  search: { count: 0, learned: false, dismissed: false },
  archive: { count: 0, learned: false, dismissed: false },
  new: { count: 0, learned: false, dismissed: false },
};

export interface ShortcutTeacherProps {
  className?: string;
  theme?: ThemeMode;
  onAction?: (actionId: string, method: "pointer" | "keyboard") => void;
  replayKey?: number;
}

export function ShortcutTeacher({
  className,
  theme = "dark",
  onAction,
  replayKey,
}: ShortcutTeacherProps) {
  const shouldReduceMotion = useReducedMotion();

  // Platform detection for Mac (⌘) vs Windows/Linux (Ctrl)
  const isMac = useMemo(() => {
    if (typeof navigator === "undefined") return true;
    return /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform || navigator.userAgent);
  }, []);

  // Action status records stored in fresh React state
  const [, setActions] = useState<Record<string, ActionState>>(INITIAL_ACTIONS);

  // Active hint shown above an action
  const [activeHintId, setActiveHintId] = useState<string | null>(null);

  // Active checkmark feedback for 650ms
  const [checkedActionId, setCheckedActionId] = useState<string | null>(null);
  const checkTimerRef = useRef<number | null>(null);

  const clearCheckTimer = useCallback(() => {
    if (checkTimerRef.current !== null) {
      window.clearTimeout(checkTimerRef.current);
      checkTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => clearCheckTimer();
  }, [clearCheckTimer]);

  // Reset all learned/dismissed shortcuts and counts
  const handleReset = useCallback(() => {
    clearCheckTimer();
    setCheckedActionId(null);
    setActiveHintId(null);
    setActions(INITIAL_ACTIONS);
  }, [clearCheckTimer]);

  useEffect(() => {
    if (replayKey !== undefined) {
      handleReset();
    }
  }, [replayKey, handleReset]);

  // Trigger action logic
  const triggerAction = useCallback(
    (actionId: "search" | "archive" | "new", isPointerClick: boolean, isKeyboardTrigger = false) => {
      onAction?.(actionId, isKeyboardTrigger ? "keyboard" : "pointer");

      // Tactile checkmark feedback for 650ms
      clearCheckTimer();
      setCheckedActionId(actionId);
      checkTimerRef.current = window.setTimeout(() => {
        setCheckedActionId(null);
      }, 650);

      // Deterministic hint trigger & learning logic
      setActions((prev) => {
        const current = prev[actionId] || { count: 0, learned: false, dismissed: false };

        if (isKeyboardTrigger) {
          // Pressing the actual physical keyboard shortcut executes and marks learned
          if (activeHintId === actionId) {
            setActiveHintId(null);
          }
          return {
            ...prev,
            [actionId]: { ...current, learned: true },
          };
        }

        if (isPointerClick) {
          const nextCount = current.count + 1;

          // Deterministically spring open the hint on 2nd click if not learned or dismissed
          if (!current.learned && !current.dismissed) {
            if (nextCount >= 2) {
              setActiveHintId(actionId);
            }
          }

          return {
            ...prev,
            [actionId]: { ...current, count: nextCount },
          };
        }

        return prev;
      });
    },
    [onAction, activeHintId, clearCheckTimer]
  );

  // Dismiss a hint for that action
  const dismissHint = useCallback((actionId: string) => {
    setActiveHintId((curr) => (curr === actionId ? null : curr));
    setActions((prev) => {
      const current = prev[actionId] || { count: 0, learned: false, dismissed: false };
      return {
        ...prev,
        [actionId]: { ...current, dismissed: true },
      };
    });
  }, []);

  // Keyboard shortcut listener
  const triggerActionRef = useRef(triggerAction);
  triggerActionRef.current = triggerAction;

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      for (const sc of SHORTCUT_REGISTRY) {
        const modMatches = sc.mod
          ? e.metaKey || e.ctrlKey
          : !e.metaKey && !e.ctrlKey && !e.altKey;

        const keyMatches =
          e.code === sc.code ||
          e.key.toLowerCase() === sc.key.toLowerCase();

        if (modMatches && keyMatches) {
          e.preventDefault();
          triggerActionRef.current(sc.id, false, true);
          break;
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const isDark = theme === "dark";

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center select-none",
        className
      )}
    >
      {/* ── 3-Button Action Dock ── */}
      <div
        className={cn(
          "p-1.5 rounded-[16px] inline-flex items-center gap-1.5 relative border transition-colors duration-200",
          isDark
            ? "bg-[#16171A] border-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_10px_24px_-6px_rgba(0,0,0,0.65)]"
            : "bg-[#E6E1D8] border-[#DDD7CD] shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_8px_20px_-6px_rgba(28,25,23,0.12)]"
        )}
      >
        {SHORTCUT_REGISTRY.map((sc) => {
          const Icon = sc.icon;
          const isHintShown = activeHintId === sc.id;
          const isChecked = checkedActionId === sc.id;

          return (
            <div key={sc.id} className="relative">
              {/* Anchored Minimal Keycap Hint */}
              <AnimatePresence>
                {isHintShown && (
                  <motion.div
                    role="tooltip"
                    aria-label={`Shortcut: ${sc.mod ? (isMac ? "⌘ " : "Ctrl ") : ""}${sc.key.toUpperCase()}`}
                    initial={{ opacity: 0, y: 4, scale: 0.94 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 2, scale: 0.94 }}
                    transition={
                      shouldReduceMotion
                        ? { duration: 0.1 }
                        : {
                            type: "spring",
                            stiffness: 500,
                            damping: 32,
                          }
                    }
                    className={cn(
                      "absolute -top-11 left-1/2 -translate-x-1/2 z-30 px-2 py-1 rounded-[8px] flex items-center gap-1 whitespace-nowrap border select-none",
                      isDark
                        ? "bg-[#1E2025] text-[#F5F5F7] border-white/[0.08] shadow-[0_6px_16px_rgba(0,0,0,0.5)]"
                        : "bg-[#FFFFFF] text-[#1C1917] border-[#DDD7CD] shadow-[0_4px_14px_rgba(28,25,23,0.12)]"
                    )}
                  >
                    {sc.mod && (
                      <kbd
                        className={cn(
                          "font-mono text-[11px] leading-none px-1.5 py-1 rounded-[5px] border",
                          isDark
                            ? "bg-[#121316] border-white/[0.1] text-[#F5F5F7]"
                            : "bg-[#F5F3EF] border-[#DDD7CD] text-[#1C1917]"
                        )}
                      >
                        {isMac ? "⌘" : "Ctrl"}
                      </kbd>
                    )}
                    <kbd
                      className={cn(
                        "font-mono text-[11px] leading-none px-1.5 py-1 rounded-[5px] border",
                        isDark
                          ? "bg-[#121316] border-white/[0.1] text-[#F5F5F7]"
                          : "bg-[#F5F3EF] border-[#DDD7CD] text-[#1C1917]"
                      )}
                    >
                      {sc.key.toUpperCase()}
                    </kbd>

                    {/* Quiet × Dismiss */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        dismissHint(sc.id);
                      }}
                      className={cn(
                        "size-4 ml-0.5 rounded-full flex items-center justify-center transition-colors cursor-pointer focus:outline-none",
                        isDark
                          ? "text-[#8E9299] hover:text-[#F5F5F7] hover:bg-white/[0.08]"
                          : "text-[#78716C] hover:text-[#1C1917] hover:bg-black/[0.06]"
                      )}
                      aria-label="Dismiss shortcut hint"
                    >
                      <X size={10} weight="bold" />
                    </button>

                    {/* Downward Caret */}
                    <div
                      className={cn(
                        "absolute -bottom-1 left-1/2 -translate-x-1/2 size-2 rotate-45 pointer-events-none",
                        isDark
                          ? "bg-[#1E2025] border-r border-b border-white/[0.08]"
                          : "bg-[#FFFFFF] border-r border-b border-[#DDD7CD]"
                      )}
                      aria-hidden="true"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Tactile Action Button */}
              <motion.button
                type="button"
                whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
                onClick={(e) => {
                  const isPointer = e.detail > 0;
                  triggerAction(sc.id, isPointer, false);
                }}
                className={cn(
                  "px-3.5 py-2 rounded-[10px] text-[13px] font-medium tracking-[-0.01em] inline-flex items-center gap-2 transition-colors cursor-pointer select-none focus:outline-none",
                  isDark
                    ? "text-[#F5F5F7] hover:bg-[#1E2025] active:bg-[#252830]"
                    : "text-[#1C1917] hover:bg-[#DCD6CB] active:bg-[#D2CBC0]"
                )}
                aria-label={sc.label}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isChecked ? (
                    <motion.span
                      key="checked"
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.6, opacity: 0 }}
                      transition={{ duration: 0.12 }}
                      className={isDark ? "text-[#5E9E5A]" : "text-[#15803D]"}
                    >
                      <Check size={15} weight="bold" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="icon"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      transition={{ duration: 0.12 }}
                      className={isDark ? "text-[#8E9299]" : "text-[#78716C]"}
                    >
                      <Icon size={15} weight="bold" />
                    </motion.span>
                  )}
                </AnimatePresence>
                <span>{sc.label}</span>
              </motion.button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ShortcutTeacher;

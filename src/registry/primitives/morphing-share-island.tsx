"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  ShareNetwork,
  LinkSimple,
  XLogo,
  PaperPlaneTilt,
  QrCode,
  X,
  CheckCircle,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export type ThemeMode = "light" | "dark";
export type ShareAction = "copy" | "post" | "send" | "qr";

export interface MorphingShareIslandProps {
  shareUrl?: string;
  onAction?: (action: ShareAction) => void;
  className?: string;
  theme?: ThemeMode;
  replayKey?: number;
}

interface ActionDef {
  id: ShareAction;
  label: string;
  confirmation: string;
  icon: typeof LinkSimple;
}

const ACTIONS: ActionDef[] = [
  { id: "copy", label: "Copy", confirmation: "Copied", icon: LinkSimple },
  { id: "post", label: "Post", confirmation: "Posted", icon: XLogo },
  { id: "send", label: "Send", confirmation: "Sent", icon: PaperPlaneTilt },
  { id: "qr", label: "QR", confirmation: "Saved", icon: QrCode },
];

export function MorphingShareIsland({
  shareUrl = "https://peel-ui.vercel.app",
  onAction,
  className,
  theme = "dark",
  replayKey,
}: MorphingShareIslandProps) {
  const shouldReduceMotion = useReducedMotion();
  const [state, setState] = useState<"idle" | "expanded" | "confirmed">("idle");
  const [confirmedAction, setConfirmedAction] = useState<ActionDef | null>(null);

  const resetTimerRef = useRef<number | null>(null);

  const clearResetTimer = useCallback(() => {
    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => clearResetTimer();
  }, [clearResetTimer]);

  useEffect(() => {
    if (replayKey !== undefined) {
      clearResetTimer();
      setState("idle");
      setConfirmedAction(null);
    }
  }, [replayKey, clearResetTimer]);

  const handleAction = useCallback(
    (actionDef: ActionDef) => {
      clearResetTimer();

      if (actionDef.id === "copy" && typeof navigator !== "undefined" && navigator.clipboard) {
        navigator.clipboard.writeText(shareUrl).catch(() => {});
      }

      onAction?.(actionDef.id);
      setConfirmedAction(actionDef);
      setState("confirmed");

      // Auto-revert back to idle after 1300ms
      resetTimerRef.current = window.setTimeout(() => {
        setState("idle");
        setConfirmedAction(null);
      }, 1300);
    },
    [clearResetTimer, onAction, shareUrl]
  );

  const isDark = theme === "dark";

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center select-none",
        isDark ? "text-[#F5F5F7]" : "text-[#1C1917]",
        className
      )}
    >
      <motion.div
        layout
        transition={
          shouldReduceMotion
            ? { duration: 0.15 }
            : { type: "spring", stiffness: 420, damping: 30, mass: 0.75 }
        }
        className={cn(
          "relative z-10 transition-colors duration-200 border",
          state === "expanded"
            ? cn(
                "p-1.5 rounded-full flex items-center gap-1.5",
                isDark
                  ? "bg-[#16171A] border-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_10px_24px_-6px_rgba(0,0,0,0.65)]"
                  : "bg-[#E6E1D8] border-[#DDD7CD] shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_8px_20px_-6px_rgba(28,25,23,0.12)]"
              )
            : cn(
                "rounded-full px-4 py-2.5 inline-flex items-center gap-2 cursor-pointer",
                isDark
                  ? "bg-[#16171A] border-white/[0.06] hover:bg-[#1E2025] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_10px_24px_-6px_rgba(0,0,0,0.65)]"
                  : "bg-[#E6E1D8] border-[#DDD7CD] hover:bg-[#DCD6CB] shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_8px_20px_-6px_rgba(28,25,23,0.12)]"
              )
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          {/* 1. IDLE STATE: Resting Pill */}
          {state === "idle" && (
            <motion.button
              key="idle"
              type="button"
              onClick={() => setState("expanded")}
              whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              className="inline-flex items-center gap-2 cursor-pointer focus:outline-none"
              aria-label="Open share options"
            >
              <ShareNetwork size={15} weight="bold" />
              <span className="font-sans text-[13.5px] font-medium tracking-[-0.015em] whitespace-nowrap">
                Share
              </span>
            </motion.button>
          )}

          {/* 2. EXPANDED STATE: 4 Actions + Hairline Divider + Close */}
          {state === "expanded" && (
            <motion.div
              key="expanded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.14 }}
              className="flex items-center gap-1.5"
            >
              {ACTIONS.map((act) => {
                const Icon = act.icon;
                return (
                  <motion.button
                    key={act.id}
                    type="button"
                    onClick={() => handleAction(act)}
                    whileHover={shouldReduceMotion ? undefined : { scale: 1.06 }}
                    whileTap={shouldReduceMotion ? undefined : { scale: 0.92 }}
                    aria-label={act.label}
                    title={act.label}
                    className={cn(
                      "size-9 rounded-full flex items-center justify-center cursor-pointer focus:outline-none transition-colors",
                      isDark
                        ? "bg-[#202227] text-[#F5F5F7] hover:bg-[#282B32]"
                        : "bg-[#FFFFFF] text-[#1C1917] hover:bg-[#F2EFE9] shadow-[0_1px_2px_rgba(28,25,23,0.06)]"
                    )}
                  >
                    <Icon size={16} weight="bold" />
                  </motion.button>
                );
              })}

              {/* Hairline Divider */}
              <div
                className={cn("w-[1px] h-4 mx-0.5", isDark ? "bg-white/10" : "bg-black/10")}
                aria-hidden="true"
              />

              {/* Circular Close Button */}
              <button
                type="button"
                onClick={() => setState("idle")}
                aria-label="Close share menu"
                className={cn(
                  "size-8 rounded-full flex items-center justify-center cursor-pointer focus:outline-none transition-colors",
                  isDark
                    ? "text-[#8E9299] hover:text-[#F5F5F7] hover:bg-[#202227]"
                    : "text-[#78716C] hover:text-[#1C1917] hover:bg-[#FFFFFF]"
                )}
              >
                <X size={13} weight="bold" />
              </button>
            </motion.div>
          )}

          {/* 3. CONFIRMED STATE: Icon + 1-Word Confirmation */}
          {state === "confirmed" && confirmedAction && (
            <motion.div
              key="confirmed"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{
                type: "spring",
                stiffness: 440,
                damping: 28,
                mass: 0.7,
              }}
              className="inline-flex items-center gap-2 px-1 cursor-default select-none"
            >
              <span className={isDark ? "text-[#5E9E5A]" : "text-[#15803D]"}>
                <CheckCircle size={15} weight="fill" />
              </span>
              <span className="font-sans text-[13.5px] font-medium tracking-[-0.015em] whitespace-nowrap">
                {confirmedAction.confirmation}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default MorphingShareIsland;

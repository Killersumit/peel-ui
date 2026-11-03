"use client";

import { useState, useRef, useEffect, useCallback, useId } from "react";
import { motion, AnimatePresence, LayoutGroup, useReducedMotion } from "motion/react";
import { ChatTeardropText } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export type FeedbackStage = "idle" | "open" | "sent";
export type FeedbackCategory = "Bug" | "Idea" | "Praise";

export const CATEGORIES: FeedbackCategory[] = ["Bug", "Idea", "Praise"];

export interface MorphingFeedbackProps {
  theme?: "dark" | "light";
  replayKey?: number;
  onSubmitFeedback?: (feedback: { category: FeedbackCategory; text: string }) => void;
  className?: string;
}

export function MorphingFeedback({
  theme: explicitTheme,
  replayKey,
  onSubmitFeedback,
  className,
}: MorphingFeedbackProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Unique layout ID for safe multi-instance LayoutGroup projection
  const rawId = useId();
  const uid = `feedback-${rawId.replace(/:/g, "")}`;

  // State: "idle" | "open" | "sent"
  const [stage, setStage] = useState<FeedbackStage>("idle");
  const [selectedCategory, setSelectedCategory] = useState<FeedbackCategory>("Idea");
  const [feedbackText, setFeedbackText] = useState("");

  // Sync theme with Peel UI stage theme and DOM
  const [domTheme, setDomTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    if (explicitTheme) return;

    const updateFromContext = () => {
      const parent = containerRef.current?.closest("[data-stage-theme]");
      if (parent) {
        const val = parent.getAttribute("data-stage-theme");
        if (val === "light" || val === "dark") {
          setDomTheme(val);
          return;
        }
      }
      const isDocDark = document.documentElement.classList.contains("dark");
      setDomTheme(isDocDark ? "dark" : "light");
    };

    updateFromContext();

    const observer = new MutationObserver(updateFromContext);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, [explicitTheme]);

  const currentTheme = explicitTheme || domTheme || "dark";
  const isDark = currentTheme === "dark";

  // Replay key resets to idle
  useEffect(() => {
    if (replayKey !== undefined && replayKey > 0) {
      setStage("idle");
      setFeedbackText("");
      setSelectedCategory("Idea");
    }
  }, [replayKey]);

  // Focus textarea when composer opens
  useEffect(() => {
    if (stage === "open") {
      const focusTimer = window.setTimeout(() => {
        textareaRef.current?.focus();
      }, 50);
      return () => window.clearTimeout(focusTimer);
    }
  }, [stage]);

  // Click outside to dismiss back to idle
  useEffect(() => {
    if (stage !== "open") return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setStage("idle");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [stage]);

  // Global Escape key dismiss
  useEffect(() => {
    if (stage !== "open") return;

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setStage("idle");
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [stage]);

  // Auto-dismiss confirmed state after 1600ms
  useEffect(() => {
    if (stage === "sent") {
      const timer = window.setTimeout(() => {
        setStage("idle");
        setFeedbackText("");
      }, 1600);
      return () => window.clearTimeout(timer);
    }
  }, [stage]);

  // Handle Send action
  const handleSend = useCallback(() => {
    onSubmitFeedback?.({
      category: selectedCategory,
      text: feedbackText,
    });
    setStage("sent");
  }, [feedbackText, onSubmitFeedback, selectedCategory]);

  // Handle Textarea shortcuts
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setStage("idle");
      } else if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  return (
    <div
      ref={containerRef}
      className={cn("w-full flex items-center justify-center select-none", className)}
      style={{
        fontFamily:
          "Switzer, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <LayoutGroup id={uid}>
        <AnimatePresence mode="wait">
          {/* =================================================================
              STAGE 1: IDLE (Compact Trigger Pill)
              ================================================================= */}
          {stage === "idle" && (
            <motion.button
              key="idle"
              type="button"
              layoutId={`${uid}-shell`}
              style={{ borderRadius: 20 }}
              onClick={() => setStage("open")}
              whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
              transition={{
                type: "spring",
                stiffness: 420,
                damping: 32,
                mass: 0.7,
              }}
              className={cn(
                "h-10 px-4 inline-flex items-center gap-2 cursor-pointer select-none transition-colors",
                isDark
                  ? "bg-[#15161A] text-[#F5F5F7] shadow-[inset_0_1px_0_rgba(255,255,255,0.09),0_18px_38px_-10px_rgba(0,0,0,0.78)]"
                  : "bg-[#EAE6DF] text-[#1C1917] shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_16px_32px_-10px_rgba(28,25,23,0.14)]"
              )}
            >
              <span
                className={cn(
                  "inline-flex items-center shrink-0 transition-colors",
                  isDark ? "text-[#8E9299]" : "text-[#78716C]"
                )}
              >
                <ChatTeardropText size={15} weight="duotone" />
              </span>

              <motion.span
                layoutId={`${uid}-title`}
                layout="position"
                transition={{
                  type: "spring",
                  stiffness: 450,
                  damping: 34,
                  mass: 0.6,
                }}
                className="text-[13.5px] font-medium tracking-[-0.015em] whitespace-nowrap"
              >
                Feedback
              </motion.span>
            </motion.button>
          )}

          {/* =================================================================
              STAGE 2: OPEN (Concentric 2-Zone Composer Card — w-[336px])
              ================================================================= */}
          {stage === "open" && (
            <motion.div
              key="open"
              ref={cardRef}
              layoutId={`${uid}-shell`}
              style={{ borderRadius: 24 }}
              transition={{
                type: "spring",
                stiffness: 420,
                damping: 32,
                mass: 0.7,
              }}
              className={cn(
                "w-[336px] p-2 flex flex-col select-none relative",
                isDark
                  ? "bg-[#15161A] text-[#F5F5F7] shadow-[inset_0_1px_0_rgba(255,255,255,0.09),0_18px_38px_-10px_rgba(0,0,0,0.78)]"
                  : "bg-[#EAE6DF] text-[#1C1917] shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_16px_32px_-10px_rgba(28,25,23,0.14)]"
              )}
            >
              {/* Header Bar */}
              <div className="px-2.5 pt-1.5 pb-2 flex items-center justify-between">
                <motion.span
                  layoutId={`${uid}-title`}
                  layout="position"
                  transition={{
                    type: "spring",
                    stiffness: 450,
                    damping: 34,
                    mass: 0.6,
                  }}
                  className="text-[13.5px] font-medium tracking-[-0.015em]"
                >
                  Feedback
                </motion.span>

                <button
                  type="button"
                  onClick={() => setStage("idle")}
                  aria-label="Close feedback composer"
                  className={cn(
                    "font-mono text-[10.5px] leading-none px-1.5 py-1 rounded-[6px] cursor-pointer transition-colors",
                    isDark
                      ? "bg-[#22242B] text-[#8E9299] hover:text-[#F5F5F7] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                      : "bg-[#DFDAD0] text-[#78716C] hover:text-[#1C1917] shadow-[0_1px_1px_rgba(28,25,23,0.06)]"
                  )}
                >
                  Esc
                </button>
              </div>

              {/* Recessed Textarea Well (R_inner = 24 - 8 = 16px) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.97, y: 4 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  transition: {
                    duration: shouldReduceMotion ? 0 : 0.18,
                    delay: shouldReduceMotion ? 0 : 0.04,
                    ease: [0.22, 1, 0.36, 1],
                  },
                }}
                exit={{
                  opacity: 0,
                  scale: 0.97,
                  transition: {
                    duration: shouldReduceMotion ? 0 : 0.09,
                    ease: [0.32, 0, 0.67, 0],
                  },
                }}
                className={cn(
                  "rounded-[16px] p-3 transition-colors",
                  isDark
                    ? "bg-[#090A0C] shadow-[inset_0_1.5px_4px_rgba(0,0,0,0.85),inset_0_0_0_1px_rgba(255,255,255,0.03)]"
                    : "bg-[#DFDAD0] shadow-[inset_0_1.5px_3px_rgba(28,25,23,0.08)]"
                )}
              >
                <textarea
                  ref={textareaRef}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="What can we improve?"
                  rows={3}
                  className={cn(
                    "w-full h-[68px] resize-none bg-transparent text-[13.5px] leading-[1.5] focus:outline-none",
                    isDark
                      ? "text-[#F5F5F7] placeholder-[#555961]"
                      : "text-[#1C1917] placeholder-[#A8A29E]"
                  )}
                />
              </motion.div>

              {/* Action Footer */}
              <motion.div
                initial={{ opacity: 0, y: 2 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: shouldReduceMotion ? 0 : 0.16,
                    delay: shouldReduceMotion ? 0 : 0.06,
                  },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: shouldReduceMotion ? 0 : 0.08 },
                }}
                className="pt-2 px-1 pb-0.5 flex items-center justify-between gap-2"
              >
                {/* 3 Category Pills (Bug · Idea · Praise) */}
                <div
                  className="flex items-center gap-0.5 relative"
                  role="radiogroup"
                  aria-label="Feedback category"
                >
                  {CATEGORIES.map((cat) => {
                    const isSelected = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => setSelectedCategory(cat)}
                        className={cn(
                          "h-7 px-2.5 rounded-[9px] text-[12px] font-medium tracking-[-0.01em] relative z-10 cursor-pointer transition-colors inline-flex items-center gap-1.5",
                          isSelected
                            ? isDark
                              ? "text-[#F5F5F7]"
                              : "text-[#1C1917]"
                            : isDark
                              ? "text-[#8E9299] hover:text-[#F5F5F7]"
                              : "text-[#78716C] hover:text-[#1C1917]"
                        )}
                      >
                        {isSelected && (
                          <motion.div
                            layoutId={`${uid}-chip`}
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              damping: 35,
                              mass: 0.5,
                            }}
                            className={cn(
                              "absolute inset-0 rounded-[9px] -z-10",
                              isDark
                                ? "bg-[#22242B] shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]"
                                : "bg-[#F5F3EF] shadow-[0_1px_2px_rgba(28,25,23,0.08)]"
                            )}
                          />
                        )}
                        {isSelected && (
                          <span className="size-1.5 rounded-full bg-[#5E9E5A] shrink-0" />
                        )}
                        <span>{cat}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Primary Send Button */}
                <button
                  type="button"
                  onClick={handleSend}
                  className={cn(
                    "h-7 px-2.5 rounded-[10px] inline-flex items-center gap-1.5 text-[12.5px] font-medium tracking-[-0.01em] cursor-pointer transition-colors shadow-sm",
                    isDark
                      ? "bg-[#F5F5F7] hover:bg-[#FFFFFF] text-[#08090A]"
                      : "bg-[#1C1917] hover:bg-[#2E2A27] text-[#F5F3EF]"
                  )}
                >
                  <span>Send</span>
                  <span className="opacity-60 text-[11px] leading-none">↵</span>
                </button>
              </motion.div>
            </motion.div>
          )}

          {/* =================================================================
              STAGE 3: SENT (Self-Drawing Confirmation Pill)
              ================================================================= */}
          {stage === "sent" && (
            <motion.div
              key="sent"
              layoutId={`${uid}-shell`}
              style={{ borderRadius: 20 }}
              transition={{
                type: "spring",
                stiffness: 420,
                damping: 32,
                mass: 0.7,
              }}
              className={cn(
                "h-10 px-4 inline-flex items-center gap-2 select-none",
                isDark
                  ? "bg-[#15161A] text-[#F5F5F7] shadow-[inset_0_1px_0_rgba(255,255,255,0.09),0_18px_38px_-10px_rgba(0,0,0,0.78)]"
                  : "bg-[#EAE6DF] text-[#1C1917] shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_16px_32px_-10px_rgba(28,25,23,0.14)]"
              )}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="shrink-0"
                aria-hidden="true"
              >
                <motion.path
                  d="M3.5 8.5L6.5 11.5L12.5 4.5"
                  stroke="#5E9E5A"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.24,
                    ease: "easeOut",
                    delay: shouldReduceMotion ? 0 : 0.08,
                  }}
                />
              </svg>

              <span className="text-[13.5px] font-medium tracking-[-0.015em] whitespace-nowrap">
                Feedback sent
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </LayoutGroup>
    </div>
  );
}

export default MorphingFeedback;

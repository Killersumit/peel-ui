"use client";

import * as React from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  type Transition,
} from "motion/react";
import { cn } from "@/lib/utils";

export interface TactileOtpInputProps {
  /** Number of digits in the OTP field (default: 4) */
  length?: number;
  /** Initial preset values for live showcase display (default: ["3", "8", "1", ""]) */
  initialValues?: string[];
  /** Callback fired when all slots are populated */
  onComplete?: (code: string) => void;
  /** Additional container styling */
  className?: string;
}

const DEFAULT_INITIAL = ["3", "8", "1", ""];

export function TactileOtpInput({
  length = 4,
  initialValues = DEFAULT_INITIAL,
  onComplete,
  className,
}: TactileOtpInputProps) {
  const [values, setValues] = React.useState<string[]>(() => {
    if (initialValues && initialValues.length === length) {
      return [...initialValues];
    }
    return Array(length).fill("");
  });

  // Start with focus on Slot 4 (index 3)
  const [activeIndex, setActiveIndex] = React.useState(() => {
    const firstEmpty = initialValues.findIndex((v) => !v);
    return firstEmpty === -1 ? length - 1 : firstEmpty;
  });

  const [isFocused, setIsFocused] = React.useState(true);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const lensTransition: Transition = {
    type: "spring",
    stiffness: shouldReduceMotion ? 1000 : 500,
    damping: shouldReduceMotion ? 100 : 32,
  };

  const tumblerTransition: Transition = {
    type: "spring",
    stiffness: shouldReduceMotion ? 1000 : 600,
    damping: shouldReduceMotion ? 100 : 30,
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, "").slice(0, length);
    const newValues = Array.from({ length }, (_, i) => rawVal[i] || "");
    setValues(newValues);

    const nextIndex = Math.min(rawVal.length, length - 1);
    setActiveIndex(nextIndex);

    if (rawVal.length === length) {
      onComplete?.(rawVal);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(0, prev - 1));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      const currentLen = values.filter(Boolean).length;
      setActiveIndex((prev) => Math.min(currentLen, Math.min(length - 1, prev + 1)));
    }
  };

  const handleSlotClick = (index: number) => {
    const currentLen = values.filter(Boolean).length;
    const target = Math.min(index, currentLen);
    setActiveIndex(target);
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(target, target);
    }
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className={cn(
        "relative flex items-center justify-center gap-2.5 cursor-text select-none",
        className
      )}
    >
      {/* Invisible Native Input for Full Keyboard & Mobile Soft-Keyboard Support */}
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="[0-9]*"
        maxLength={length}
        value={values.join("")}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="absolute inset-0 w-full h-full opacity-0 cursor-text z-30"
        aria-label="Verification PIN code"
      />

      {/* ── 4 Clean, High-Contrast Slot Squircles (Neutral Carbon / Zero Blue) ── */}
      {values.map((digit, index) => {
        const isActive = isFocused && activeIndex === index;
        const isFilled = Boolean(digit);

        return (
          <div
            key={index}
            onClick={() => handleSlotClick(index)}
            className={cn(
              "w-11 h-[52px] rounded-xl flex items-center justify-center relative overflow-hidden transition-all duration-150",
              isFilled
                ? "bg-[#202020] border border-[#444444] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
                : isActive
                ? "bg-[#141414] border border-[#2e2e2e]"
                : "bg-[#101010] border border-[#222222]"
            )}
          >
            {/* Numeral Display (High-Contrast White, Zero Tint) */}
            <AnimatePresence mode="popLayout" initial={false}>
              {digit && (
                <motion.span
                  key={`digit-${digit}`}
                  initial={
                    shouldReduceMotion ? { opacity: 0 } : { y: -8, opacity: 0 }
                  }
                  animate={{ y: 0, opacity: 1 }}
                  exit={
                    shouldReduceMotion ? { opacity: 0 } : { y: 8, opacity: 0 }
                  }
                  transition={tumblerTransition}
                  className="font-mono text-xl font-semibold text-white select-none tabular-nums"
                >
                  {digit}
                </motion.span>
              )}
            </AnimatePresence>

            {/* ── Active Floating Lens Focus Ring ── */}
            {isActive && (
              <motion.div
                layoutId="floating-otp-lens"
                transition={{
                  layout: lensTransition,
                  borderColor: { duration: 0.15 },
                }}
                className="absolute inset-0 rounded-xl border-2 border-white shadow-sm pointer-events-none z-20 flex items-center justify-center"
              >
                {/* Blinking Vertical Cursor Bar in Active Empty Slot */}
                {!digit && (
                  <div className="w-0.5 h-5 bg-white rounded-full animate-pulse" />
                )}
              </motion.div>
            )}
          </div>
        );
      })}
    </div>
  );
}

"use client";

import * as React from "react";
import { motion, useReducedMotion, AnimatePresence } from "motion/react";

export function StepperCard() {
  const [count, setCount] = React.useState(1);
  const [direction, setDirection] = React.useState(1);
  const shouldReduceMotion = useReducedMotion();

  const increment = () => {
    setDirection(1);
    setCount((c) => Math.min(c + 1, 99));
  };

  const decrement = () => {
    setDirection(-1);
    setCount((c) => Math.max(c - 1, 0));
  };

  return (
    <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/40 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group hover:border-zinc-700 transition-all min-h-[280px]">
      {/* Center: Indented Stepper Tray */}
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-zinc-950/80 border border-zinc-800/80 p-3 rounded-2xl flex items-center gap-4 shadow-inner">
          {/* Decrement Button */}
          <motion.button
            type="button"
            onClick={decrement}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.9 }}
            className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 flex items-center justify-center text-lg text-white font-bold active:scale-90 transition-transform cursor-pointer outline-none"
            aria-label="Decrease"
          >
            <svg className="w-5 h-5 stroke-current stroke-[2.5] fill-none text-zinc-300" viewBox="0 0 24 24">
              <line x1="6" y1="12" x2="18" y2="12" />
            </svg>
          </motion.button>

          {/* Large Monospace Value Display */}
          <div className="min-w-[3.5rem] h-12 flex items-center justify-center relative overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={count}
                initial={
                  shouldReduceMotion
                    ? { opacity: 1 }
                    : { y: direction * 24, opacity: 0 }
                }
                animate={{ y: 0, opacity: 1 }}
                exit={
                  shouldReduceMotion
                    ? { opacity: 0 }
                    : { y: direction * -24, opacity: 0 }
                }
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 28,
                }}
                className="text-3xl font-bold font-mono text-white tabular-nums"
              >
                {count}
              </motion.span>
            </AnimatePresence>
          </div>

          {/* Increment Button */}
          <motion.button
            type="button"
            onClick={increment}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.9 }}
            className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 flex items-center justify-center text-lg text-white font-bold active:scale-90 transition-transform cursor-pointer outline-none"
            aria-label="Increase"
          >
            <svg className="w-5 h-5 stroke-current stroke-[2.5] fill-none text-zinc-300" viewBox="0 0 24 24">
              <line x1="12" y1="6" x2="12" y2="18" />
              <line x1="6" y1="12" x2="18" y2="12" />
            </svg>
          </motion.button>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-zinc-400 group-hover:text-white transition-colors">
          Spring Stepper
        </span>
        <span className="text-xs font-mono text-zinc-400 group-hover:text-white transition-colors">
          ↗
        </span>
      </div>
    </div>
  );
}

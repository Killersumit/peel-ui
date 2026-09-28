"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";

export function HoldButtonCard() {
  const [isHolding, setIsHolding] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [completed, setCompleted] = React.useState(false);
  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const HOLD_DURATION_MS = 1200;
  const TICK_MS = 16;

  const startHold = () => {
    if (completed) {
      setCompleted(false);
      setProgress(0);
      return;
    }
    setIsHolding(true);
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const next = prev + TICK_MS / HOLD_DURATION_MS;
        if (next >= 1) {
          clearInterval(intervalRef.current!);
          setIsHolding(false);
          setCompleted(true);
          return 1;
        }
        return next;
      });
    }, TICK_MS);
  };

  const endHold = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsHolding(false);
    if (!completed) setProgress(0);
  };

  React.useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/50 p-5 flex flex-col justify-between relative overflow-hidden group hover:border-zinc-700 transition-all min-h-[240px]">
      {/* White Interior Stage */}
      <div className="w-full h-40 rounded-2xl bg-zinc-100 shadow-inner flex items-center justify-center p-4 relative overflow-hidden">
        <motion.button
          type="button"
          onMouseDown={startHold}
          onMouseUp={endHold}
          onMouseLeave={endHold}
          onTouchStart={startHold}
          onTouchEnd={endHold}
          animate={
            isHolding && !shouldReduceMotion
              ? { x: [0, -1.5, 1.5, -1.5, 0] }
              : { x: 0 }
          }
          transition={
            isHolding
              ? { repeat: Infinity, duration: 0.1 }
              : { type: "spring", stiffness: 300, damping: 20 }
          }
          className="relative flex items-center justify-center gap-2.5 px-7 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-sm font-medium text-white shadow-lg cursor-pointer select-none active:scale-[0.97] transition-all overflow-hidden outline-none"
        >
          {/* Fill Layer */}
          <motion.div
            className="absolute inset-0 bg-[#84ff00]/20"
            style={{ transformOrigin: "left" }}
            animate={{ scaleX: progress }}
            transition={isHolding ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 25 }}
          />

          {/* Lime Progress Border */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 200 48" fill="none" preserveAspectRatio="none">
            <rect x="1" y="1" width="198" height="46" rx="11" stroke={completed ? "#84ff00" : progress > 0 ? "#84ff00" : "transparent"} strokeWidth="2" strokeDasharray="492" strokeDashoffset={492 - progress * 492} />
          </svg>

          <span className="relative z-10 flex items-center gap-2">
            {completed ? (
              <>
                <motion.svg initial={shouldReduceMotion ? undefined : { scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 18 }} className="w-4 h-4 text-[#84ff00] stroke-current stroke-[2.5] fill-none" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></motion.svg>
                <span className="text-[#84ff00] font-semibold text-xs">Deployed</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 text-zinc-400 stroke-current stroke-2 fill-none shrink-0" viewBox="0 0 24 24"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
                <span className="text-zinc-200 text-xs">Hold to Deploy</span>
              </>
            )}
          </span>
        </motion.button>

        {/* Status below button */}
        <span className="absolute bottom-2.5 left-1/2 -translate-x-1/2 text-[9px] font-mono text-zinc-400 uppercase tracking-widest">
          {isHolding ? `${Math.round(progress * 100)}%` : completed ? "Tap to reset" : "Press & hold"}
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-3">
        <span className="text-sm font-medium text-zinc-400 group-hover:text-white transition-colors">Hold-to-Confirm</span>
        <span className="text-sm font-medium text-zinc-400 group-hover:text-white transition-colors">↗</span>
      </div>
    </div>
  );
}

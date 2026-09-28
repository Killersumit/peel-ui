"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";

export function SwitchCard() {
  const [isOn, setIsOn] = React.useState(false);
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/40 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group hover:border-zinc-700 transition-all min-h-[280px]">
      {/* Center: Hardware Rocker Chassis */}
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => setIsOn(!isOn)}
          className="w-36 h-20 rounded-2xl bg-zinc-950 border border-zinc-800 p-2 flex items-center justify-between shadow-2xl relative cursor-pointer outline-none"
          role="switch"
          aria-checked={isOn}
          aria-label="Toggle switch"
        >
          {/* Left Indicator: Dim Red Dot */}
          <div
            className={`w-2.5 h-2.5 rounded-full shrink-0 transition-all duration-300 ${
              isOn
                ? "bg-red-500/20 border border-red-500/30"
                : "bg-red-500/40 border border-red-500/60 shadow-[0_0_6px_rgba(239,68,68,0.3)]"
            }`}
          />

          {/* Toggle Thumb */}
          <motion.div
            layout
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { type: "spring", stiffness: 500, damping: 30, mass: 0.8 }
            }
            className={`absolute w-14 h-16 rounded-xl shadow-md flex flex-col items-center justify-center gap-1 transition-colors duration-200 ${
              isOn
                ? "bg-zinc-800 border border-[#84ff00]/60 right-2"
                : "bg-zinc-900 border border-zinc-700/80 left-2"
            }`}
            style={{ top: "50%", transform: "translateY(-50%)" }}
          >
            {/* Knurled Grip Lines */}
            <div className={`w-5 h-0.5 rounded-full transition-colors ${isOn ? "bg-[#84ff00]/40" : "bg-zinc-600"}`} />
            <div className={`w-5 h-0.5 rounded-full transition-colors ${isOn ? "bg-[#84ff00]/40" : "bg-zinc-600"}`} />
            <div className={`w-5 h-0.5 rounded-full transition-colors ${isOn ? "bg-[#84ff00]/40" : "bg-zinc-600"}`} />
          </motion.div>

          {/* Right Indicator: Acid Lime Dot */}
          <div
            className={`w-2.5 h-2.5 rounded-full shrink-0 transition-all duration-300 ${
              isOn
                ? "bg-[#84ff00] shadow-[0_0_12px_#84ff00] border border-[#84ff00]"
                : "bg-[#84ff00]/20 border border-[#84ff00]/30"
            }`}
          />
        </button>

        {/* State Label */}
        <span
          className={`text-[11px] font-mono tracking-[0.15em] uppercase transition-colors duration-300 ${
            isOn ? "text-[#84ff00]" : "text-zinc-500"
          }`}
        >
          {isOn ? "SYSTEM ACTIVE" : "STANDBY"}
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-zinc-400 group-hover:text-white transition-colors">
          Tactile Switch
        </span>
        <span className="text-xs font-mono text-zinc-400 group-hover:text-white transition-colors">
          ↗
        </span>
      </div>
    </div>
  );
}

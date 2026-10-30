"use client";

import * as React from "react";
import { VoicePill } from "@/registry/primitives/voice-pill";
import { Copy, Check, Radio, Sliders } from "lucide-react";

const CLI_ADD_COMMAND = "npx shadcn@latest add https://peel-ui.vercel.app/r/voice-pill.json";

export function VoicePillDemo() {
  const [copied, setCopied] = React.useState(false);
  const [status, setStatus] = React.useState<"idle" | "recording">("idle");
  const [reactiveMode, setReactiveMode] = React.useState<"mic" | "simulated">("simulated");
  const [pillSize, setPillSize] = React.useState<number>(40);
  const [lastEvent, setLastEvent] = React.useState<string>("Ready");
  const [duration, setDuration] = React.useState<number>(0);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(CLI_ADD_COMMAND);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="relative flex flex-col justify-between border border-[#232730] bg-[#101216] rounded-2xl p-3 sm:p-6 lg:p-8 w-full max-w-2xl mx-auto overflow-hidden">
      {/* Corner Registration Markings */}
      <span
        aria-hidden="true"
        className="absolute top-2 left-2 font-mono text-[10px] text-[#51555e] select-none pointer-events-none"
      >
        +
      </span>
      <span
        aria-hidden="true"
        className="absolute top-2 right-2 font-mono text-[10px] text-[#51555e] select-none pointer-events-none"
      >
        +
      </span>
      <span
        aria-hidden="true"
        className="absolute bottom-2 left-2 font-mono text-[10px] text-[#51555e] select-none pointer-events-none"
      >
        +
      </span>
      <span
        aria-hidden="true"
        className="absolute bottom-2 right-2 font-mono text-[10px] text-[#51555e] select-none pointer-events-none"
      >
        +
      </span>

      {/* 1. Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#232730] pb-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="font-sans text-xs font-medium tracking-tight text-[#f5f5f7]">
            Voice Pill
          </span>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2 px-2.5 py-1 border border-[#232730] bg-[#0c0d0e]">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              status === "recording" ? "bg-[#F5F5F7] animate-pulse" : "bg-[#84ff00]"
            }`}
          />
          <span className="font-mono text-[11px] tracking-wide text-[#f5f5f7] uppercase tabular-nums">
            {status === "recording" ? "Recording" : "Ready"}
          </span>
        </div>
      </div>

      {/* 2. Interactive Parameter Configuration Switchboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        {/* Signal Mode Segmented Switch */}
        <div className="flex items-center justify-between border border-[#1a1d24] bg-[#0c0d0e] px-3 py-2">
          <span className="font-mono text-[11px] text-[#8a8f98] uppercase tracking-wider flex items-center gap-1.5">
            <Radio size={12} className="text-[#84ff00]" />
            <span>SIGNAL</span>
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setReactiveMode("simulated")}
              className={`font-mono text-[11px] px-2 py-0.5 border transition-all cursor-pointer ${
                reactiveMode === "simulated"
                  ? "border-[#84ff00] text-[#84ff00] bg-[#84ff00]/10"
                  : "border-transparent text-[#8a8f98] hover:text-[#f5f5f7]"
              }`}
            >
              SIMULATED
            </button>
            <button
              type="button"
              onClick={() => setReactiveMode("mic")}
              className={`font-mono text-[11px] px-2 py-0.5 border transition-all cursor-pointer ${
                reactiveMode === "mic"
                  ? "border-[#84ff00] text-[#84ff00] bg-[#84ff00]/10"
                  : "border-transparent text-[#8a8f98] hover:text-[#f5f5f7]"
              }`}
            >
              HARDWARE MIC
            </button>
          </div>
        </div>

        {/* Dimension Scale Switch */}
        <div className="flex items-center justify-between border border-[#1a1d24] bg-[#0c0d0e] px-3 py-2">
          <span className="font-mono text-[11px] text-[#8a8f98] uppercase tracking-wider flex items-center gap-1.5">
            <Sliders size={12} className="text-[#84ff00]" />
            <span>CALIB_SIZE</span>
          </span>
          <div className="flex items-center gap-1">
            {[32, 40, 48].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setPillSize(s)}
                className={`font-mono text-[11px] px-2 py-0.5 border transition-all cursor-pointer ${
                  pillSize === s
                    ? "border-[#84ff00] text-[#84ff00] bg-[#84ff00]/10"
                    : "border-transparent text-[#8a8f98] hover:text-[#f5f5f7]"
                }`}
              >
                {s}PX
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Central Tactile Stage */}
      <div className="relative flex flex-col items-center justify-center min-h-[190px] border border-[#1a1d24] bg-[#08090a] p-8 mb-6">
        {/* Background Subtle Metric Grid Hairlines */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#232730_1px,transparent_1px)] [background-size:16px_16px]"
        />

        {/* Live VoicePill Component Mounted */}
        <div className="relative z-10 flex items-center justify-center py-4">
          <VoicePill
            key={`${reactiveMode}-${pillSize}`}
            size={pillSize}
            reactive={reactiveMode}
            onStart={(info) => {
              setStatus("recording");
              setLastEvent(`Recording (${info.source})`);
            }}
            onStop={(info) => {
              setStatus("idle");
              setDuration(info.duration);
              setLastEvent(`Stopped (${info.reason}) · ${info.duration}ms`);
            }}
          />
        </div>

        {/* Operational Guidance */}
        <div className="relative z-10 mt-6 font-mono text-[11px] text-[#8a8f98] text-center tracking-wide">
          Tap or hold capsule to speak &middot; Drag left to cancel
        </div>
      </div>

      {/* 4. Live Telemetry Readout Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-b border-[#232730] py-2.5 px-3 bg-[#0c0d0e] mb-6 font-mono text-[11px]">
        <div className="flex items-center gap-2">
          <span className="text-[#51555e]">LOG:</span>
          <span className="text-[#84ff00]">{lastEvent}</span>
        </div>
        <div className="flex items-center gap-4 text-[#8a8f98]">
          <span>
            CAPTURE_DUR: <strong className="text-[#f5f5f7]">{duration}ms</strong>
          </span>
          <span className="text-[#51555e]">|</span>
          <span>
            FFT: <strong className="text-[#f5f5f7]">256_BINS</strong>
          </span>
        </div>
      </div>

      {/* 5. CLI Installation Command Badge */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border border-[#232730] bg-[#08090a] p-2.5">
        <div className="flex items-center gap-2 px-2 overflow-hidden truncate">
          <span className="font-mono text-xs text-[#51555e] select-none shrink-0">$</span>
          <span className="font-mono text-xs text-[#f5f5f7] truncate">
            {CLI_ADD_COMMAND}
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center justify-center gap-1.5 px-3 py-1.5 border border-[#232730] bg-[#12141a] hover:bg-[#181b22] hover:border-[#84ff00]/40 text-[#f5f5f7] font-mono text-xs tracking-wider uppercase transition-all cursor-pointer shrink-0"
        >
          {copied ? (
            <>
              <Check size={12} className="text-[#84ff00]" />
              <span className="text-[#84ff00]">COPIED</span>
            </>
          ) : (
            <>
              <Copy size={12} className="text-[#8a8f98]" />
              <span>COPY CLI</span>
            </>
          )}
        </button>
      </div>

      {/* 6. Technical Spec Footer */}
      <div className="mt-4 pt-3 flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] text-[#51555e] uppercase tracking-wider">
        <span>ARCH: SHADCN_REMOTE_REGISTRY</span>
        <span>DEPENDENCIES: [LUCIDE-REACT]</span>
        <span>AUDIO_CTX: NATIVE_HARDWARE</span>
      </div>
    </div>
  );
}

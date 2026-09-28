"use client";

import * as React from "react";
import {
  FileCode,
  FileImage,
  FileText,
  Download,
  Plus,
  Check,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

/* ─────────────────────────────────────────────────────────────
   Peel UI — File Manager Card Primitive
   Obsidian palette (#0e1015), tactile springs, hardware telemetry.
   Zero macOS window dots, zero generic tables.
   ───────────────────────────────────────────────────────────── */

type FileCategory = "vector" | "code" | "doc";

interface FileItem {
  id: string;
  name: string;
  size: string;
  category: FileCategory;
}

const INITIAL_FILES: Record<"assets" | "code", FileItem[]> = {
  assets: [
    {
      id: "a1",
      name: "mesh-gradient.svg",
      size: "42 KB",
      category: "vector",
    },
    {
      id: "a2",
      name: "brand-mark.png",
      size: "1.8 MB",
      category: "vector",
    },
    {
      id: "a3",
      name: "design-system.pdf",
      size: "3.4 MB",
      category: "doc",
    },
  ],
  code: [
    {
      id: "c1",
      name: "motion-primitives.ts",
      size: "14.2 KB",
      category: "code",
    },
    {
      id: "c2",
      name: "kernel-config.json",
      size: "2.8 KB",
      category: "code",
    },
    {
      id: "c3",
      name: "telemetry-hook.tsx",
      size: "8.6 KB",
      category: "code",
    },
  ],
};

const SPRING_TRANSITION = {
  type: "spring",
  stiffness: 400,
  damping: 28,
} as const;

export function FileManagerCard() {
  const [folder, setFolder] = React.useState<"assets" | "code">("assets");
  const [files, setFiles] = React.useState(INITIAL_FILES);
  const [uploadState, setUploadState] = React.useState<
    "idle" | "uploading" | "complete"
  >("idle");

  const shouldReduceMotion = useReducedMotion();

  const handleUpload = () => {
    if (uploadState !== "idle") return;

    setUploadState("uploading");

    // 1.2s simulated upload progress
    const timer = setTimeout(() => {
      setUploadState("complete");

      // Flash checkmark for 450ms then insert uploaded file
      const finishTimer = setTimeout(() => {
        const newFile: FileItem = {
          id: `upload-${Date.now()}`,
          name: "patch-v2.bin",
          size: "5.4 KB",
          category: "code",
        };

        setFiles((prev) => ({
          ...prev,
          [folder]: [newFile, ...prev[folder].slice(0, 2)],
        }));
        setUploadState("idle");
      }, 450);

      return () => clearTimeout(finishTimer);
    }, 1200);

    return () => clearTimeout(timer);
  };

  const currentFiles = files[folder];

  return (
    <div className="w-full max-w-md mx-auto rounded-2xl border border-zinc-800/80 bg-[#0e1015] p-5 shadow-2xl overflow-hidden select-none">
      {/* ── Top Header Row ── */}
      <div className="flex items-center justify-between gap-3 pb-4 border-b border-zinc-800/60">
        {/* Left: Tactile Breadcrumb Toggle */}
        <div className="inline-flex items-center gap-1.5 font-mono text-xs">
          <span className="text-zinc-500">vault</span>
          <span className="text-zinc-700">/</span>
          <div className="flex items-center gap-1 bg-zinc-950/80 p-0.5 rounded-lg border border-zinc-800/80">
            <button
              type="button"
              onClick={() => setFolder("assets")}
              className={`px-2.5 py-1 rounded-md text-xs font-mono transition-all cursor-pointer ${
                folder === "assets"
                  ? "bg-zinc-800 text-white shadow-sm"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              assets
            </button>
            <button
              type="button"
              onClick={() => setFolder("code")}
              className={`px-2.5 py-1 rounded-md text-xs font-mono transition-all cursor-pointer ${
                folder === "code"
                  ? "bg-zinc-800 text-white shadow-sm"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              code
            </button>
          </div>
        </div>

        {/* Right: Tactile "+ Upload" button */}
        <button
          type="button"
          onClick={handleUpload}
          disabled={uploadState !== "idle"}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs font-medium text-white transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {uploadState === "complete" ? (
            <>
              <Check className="size-3 text-[#84ff00]" />
              <span className="text-[#84ff00]">Synced</span>
            </>
          ) : (
            <>
              <Plus className="size-3 text-zinc-400" />
              <span>+ Upload</span>
            </>
          )}
        </button>
      </div>

      {/* ── File List Stage ── */}
      <div className="py-3 space-y-1 relative min-h-[178px] flex flex-col justify-start">
        {/* Upload Progress Simulation Strip */}
        <AnimatePresence>
          {uploadState === "uploading" && (
            <motion.div
              initial={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, y: -6, height: 0 }
              }
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden mb-2"
            >
              <div className="rounded-xl border border-zinc-800/90 bg-zinc-950/90 p-2.5 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-zinc-300 truncate">
                    Uploading patch-v2.bin...
                  </span>
                  <span className="text-[#84ff00] text-[10px]">1.2s SIM</span>
                </div>
                {/* Hairline progress track filling up with #84ff00 over 1.2s */}
                <div className="w-full h-1 rounded-full bg-zinc-900 overflow-hidden">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.2, ease: "linear" }}
                    className="h-full bg-[#84ff00]"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3 File Rows with spring transitions */}
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={folder}
            initial={
              shouldReduceMotion
                ? { opacity: 1 }
                : { y: 8, opacity: 0 }
            }
            animate={{ y: 0, opacity: 1 }}
            exit={
              shouldReduceMotion
                ? { opacity: 0 }
                : { y: -8, opacity: 0 }
            }
            transition={SPRING_TRANSITION}
            className="space-y-1 w-full"
          >
            {currentFiles.map((file) => {
              return (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-zinc-900/60 transition-colors group cursor-pointer border border-transparent hover:border-zinc-800/40"
                >
                  {/* Left: Icon Squircle + File Name */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center shrink-0">
                      {file.category === "vector" && (
                        <FileImage className="size-4 text-[#ff553e]" />
                      )}
                      {file.category === "code" && (
                        <FileCode className="size-4 text-[#84ff00]" />
                      )}
                      {file.category === "doc" && (
                        <FileText className="size-4 text-zinc-300" />
                      )}
                    </div>
                    <span className="text-xs font-medium text-zinc-200 group-hover:text-white truncate">
                      {file.name}
                    </span>
                  </div>

                  {/* Right: File Size + Hover Action Icon */}
                  <div className="flex items-center gap-2.5 shrink-0 pl-3">
                    <span className="font-mono text-[11px] text-zinc-500">
                      {file.size}
                    </span>
                    <Download className="size-3.5 text-zinc-600 group-hover:text-zinc-300 transition-colors" />
                  </div>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Bottom Hardware Telemetry Bar ── */}
      <div className="pt-3.5 border-t border-zinc-800/60 space-y-2">
        {/* Top telemetry line */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
            STORAGE
          </span>
          <span className="text-xs font-mono text-zinc-300">18.4 / 32 GB</span>
        </div>

        {/* Segmented hardware-style meter */}
        <div className="w-full h-1.5 rounded-full bg-zinc-900 overflow-hidden flex">
          <div className="w-[38%] bg-[#ff553e] h-full" />
          <div className="w-[20%] bg-[#84ff00] h-full" />
          <div className="flex-1 bg-zinc-800/50 h-full" />
        </div>

        {/* Legend dots */}
        <div className="flex items-center gap-4 pt-0.5">
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-zinc-500">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ff553e]" />
            <span>12.2 GB Media</span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-zinc-500">
            <span className="h-1.5 w-1.5 rounded-full bg-[#84ff00]" />
            <span>6.2 GB System</span>
          </div>
        </div>
      </div>
    </div>
  );
}

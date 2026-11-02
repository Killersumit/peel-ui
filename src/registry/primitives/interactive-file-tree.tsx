"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  FolderSimple,
  CaretRight,
  FileCode,
  BracketsCurly,
  Copy,
  CaretUp,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export type SurfaceMode = "obsidian" | "paper";
export type TokenType = "kw" | "fn" | "lit" | "punc" | "id";

export interface Token {
  t: string;
  k?: TokenType;
}

export interface FileDefinition {
  id: string;
  name: string;
  type: "code" | "json";
  folderId?: string;
  lines: Token[][];
  rawCode: string;
}

export interface FolderDefinition {
  id: string;
  name: string;
  files: FileDefinition[];
}

// Locked Emerald Green Syntax Palette
export const EMERALD_PALETTE = {
  dot: "#22C55E",
  dark: { kw: "#4ADE80", lit: "#86EFAC" },
  paper: { kw: "#15803D", lit: "#166534" },
};

// =============================================================================
// PRE-TOKENIZED 8-LINE SNIPPETS (Guaranteed < 42 chars per line, NO Regex parse)
// =============================================================================

export const FILE_ORBIT: FileDefinition = {
  id: "components/Orbit.tsx",
  name: "Orbit.tsx",
  type: "code",
  folderId: "components",
  rawCode: `import { motion } from "motion/react";

export const Orbit = ({ r = 48 }) => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ ease: "linear" }}
    style={{ width: r, height: r }}
  />
);`,
  lines: [
    [
      { t: "import", k: "kw" },
      { t: " { " },
      { t: "motion", k: "id" },
      { t: " } " },
      { t: "from", k: "kw" },
      { t: " " },
      { t: '"motion/react"', k: "lit" },
      { t: ";" },
    ],
    [],
    [
      { t: "export", k: "kw" },
      { t: " " },
      { t: "const", k: "kw" },
      { t: " " },
      { t: "Orbit", k: "fn" },
      { t: " = ({ " },
      { t: "r", k: "id" },
      { t: " = " },
      { t: "48", k: "lit" },
      { t: " }) => (" },
    ],
    [{ t: "  <" }, { t: "motion.div", k: "fn" }],
    [
      { t: "    " },
      { t: "animate", k: "id" },
      { t: "={{ " },
      { t: "rotate", k: "id" },
      { t: ": " },
      { t: "360", k: "lit" },
      { t: " }}" },
    ],
    [
      { t: "    " },
      { t: "transition", k: "id" },
      { t: "={{ " },
      { t: "ease", k: "id" },
      { t: ": " },
      { t: '"linear"', k: "lit" },
      { t: " }}" },
    ],
    [
      { t: "    " },
      { t: "style", k: "id" },
      { t: "={{ " },
      { t: "width", k: "id" },
      { t: ": " },
      { t: "r", k: "id" },
      { t: ", " },
      { t: "height", k: "id" },
      { t: ": " },
      { t: "r", k: "id" },
      { t: " }}" },
    ],
    [{ t: "  />);" }],
  ],
};

export const FILE_MARQUEE: FileDefinition = {
  id: "components/Marquee.tsx",
  name: "Marquee.tsx",
  type: "code",
  folderId: "components",
  rawCode: `import { motion } from "motion/react";

export const Marquee = ({ text }) => (
  <motion.div
    animate={{ x: [0, -100] }}
    transition={{ repeat: Infinity }}
    className="flex gap-4"
  >{text}</motion.div>
);`,
  lines: [
    [
      { t: "import", k: "kw" },
      { t: " { " },
      { t: "motion", k: "id" },
      { t: " } " },
      { t: "from", k: "kw" },
      { t: " " },
      { t: '"motion/react"', k: "lit" },
      { t: ";" },
    ],
    [],
    [
      { t: "export", k: "kw" },
      { t: " " },
      { t: "const", k: "kw" },
      { t: " " },
      { t: "Marquee", k: "fn" },
      { t: " = ({ " },
      { t: "text", k: "id" },
      { t: " }) => (" },
    ],
    [{ t: "  <" }, { t: "motion.div", k: "fn" }],
    [
      { t: "    " },
      { t: "animate", k: "id" },
      { t: "={{ " },
      { t: "x", k: "id" },
      { t: ": [" },
      { t: "0", k: "lit" },
      { t: ", " },
      { t: "-100", k: "lit" },
      { t: "] }}" },
    ],
    [
      { t: "    " },
      { t: "transition", k: "id" },
      { t: "={{ " },
      { t: "repeat", k: "id" },
      { t: ": " },
      { t: "Infinity", k: "id" },
      { t: " }}" },
    ],
    [
      { t: "    " },
      { t: "className", k: "id" },
      { t: "=" },
      { t: '"flex gap-4"', k: "lit" },
    ],
    [
      { t: "  >{" },
      { t: "text", k: "id" },
      { t: "}</" },
      { t: "motion.div", k: "fn" },
      { t: ");" },
    ],
  ],
};

export const FILE_USE_SPRING: FileDefinition = {
  id: "hooks/use-spring.ts",
  name: "use-spring.ts",
  type: "code",
  folderId: "hooks",
  rawCode: `import { useSpring } from "motion/react";
import { useEffect } from "react";

export function useVal(target: number) {
  const v = useSpring(0, { bounce: 0 });
  useEffect(() => v.set(target));
  return v;
}`,
  lines: [
    [
      { t: "import", k: "kw" },
      { t: " { " },
      { t: "useSpring", k: "fn" },
      { t: " } " },
      { t: "from", k: "kw" },
      { t: " " },
      { t: '"motion/react"', k: "lit" },
      { t: ";" },
    ],
    [
      { t: "import", k: "kw" },
      { t: " { " },
      { t: "useEffect", k: "fn" },
      { t: " } " },
      { t: "from", k: "kw" },
      { t: " " },
      { t: '"react"', k: "lit" },
      { t: ";" },
    ],
    [],
    [
      { t: "export", k: "kw" },
      { t: " " },
      { t: "function", k: "kw" },
      { t: " " },
      { t: "useVal", k: "fn" },
      { t: "(" },
      { t: "target", k: "id" },
      { t: ": " },
      { t: "number", k: "id" },
      { t: ") {" },
    ],
    [
      { t: "  " },
      { t: "const", k: "kw" },
      { t: " " },
      { t: "v", k: "id" },
      { t: " = " },
      { t: "useSpring", k: "fn" },
      { t: "(" },
      { t: "0", k: "lit" },
      { t: ", { " },
      { t: "bounce", k: "id" },
      { t: ": " },
      { t: "0", k: "lit" },
      { t: " });" },
    ],
    [
      { t: "  " },
      { t: "useEffect", k: "fn" },
      { t: "(() => " },
      { t: "v", k: "id" },
      { t: "." },
      { t: "set", k: "fn" },
      { t: "(" },
      { t: "target", k: "id" },
      { t: "));" },
    ],
    [
      { t: "  " },
      { t: "return", k: "kw" },
      { t: " " },
      { t: "v", k: "id" },
      { t: ";" },
    ],
    [{ t: "}" }],
  ],
};

export const FILE_USE_REVEAL: FileDefinition = {
  id: "hooks/use-reveal.ts",
  name: "use-reveal.ts",
  type: "code",
  folderId: "hooks",
  rawCode: `import { useState, useId } from "react";

export function useReveal(init = false) {
  const [open, setOpen] = useState(init);
  const id = useId();
  const toggle = () => setOpen(v => !v);
  return { open, toggle, id };
}`,
  lines: [
    [
      { t: "import", k: "kw" },
      { t: " { " },
      { t: "useState", k: "fn" },
      { t: ", " },
      { t: "useId", k: "fn" },
      { t: " } " },
      { t: "from", k: "kw" },
      { t: " " },
      { t: '"react"', k: "lit" },
      { t: ";" },
    ],
    [],
    [
      { t: "export", k: "kw" },
      { t: " " },
      { t: "function", k: "kw" },
      { t: " " },
      { t: "useReveal", k: "fn" },
      { t: "(" },
      { t: "init", k: "id" },
      { t: " = " },
      { t: "false", k: "kw" },
      { t: ") {" },
    ],
    [
      { t: "  " },
      { t: "const", k: "kw" },
      { t: " [" },
      { t: "open", k: "id" },
      { t: ", " },
      { t: "setOpen", k: "fn" },
      { t: "] = " },
      { t: "useState", k: "fn" },
      { t: "(" },
      { t: "init", k: "id" },
      { t: ");" },
    ],
    [
      { t: "  " },
      { t: "const", k: "kw" },
      { t: " " },
      { t: "id", k: "id" },
      { t: " = " },
      { t: "useId", k: "fn" },
      { t: "();" },
    ],
    [
      { t: "  " },
      { t: "const", k: "kw" },
      { t: " " },
      { t: "toggle", k: "fn" },
      { t: " = () => " },
      { t: "setOpen", k: "fn" },
      { t: "(" },
      { t: "v", k: "id" },
      { t: " => !" },
      { t: "v", k: "id" },
      { t: ");" },
    ],
    [
      { t: "  " },
      { t: "return", k: "kw" },
      { t: " { " },
      { t: "open", k: "id" },
      { t: ", " },
      { t: "toggle", k: "id" },
      { t: ", " },
      { t: "id", k: "id" },
      { t: " };" },
    ],
    [{ t: "}" }],
  ],
};

export const FILE_REGISTRY_JSON: FileDefinition = {
  id: "registry.json",
  name: "registry.json",
  type: "json",
  rawCode: `{
  "name": "@peel/motion",
  "version": "0.2.0",
  "author": "@killersumit",
  "primitives": 24,
  "license": "MIT",
  "engine": "react-19"
}`,
  lines: [
    [{ t: "{" }],
    [
      { t: '  "name"', k: "id" },
      { t: ": " },
      { t: '"@peel/motion"', k: "lit" },
      { t: "," },
    ],
    [
      { t: '  "version"', k: "id" },
      { t: ": " },
      { t: '"0.2.0"', k: "lit" },
      { t: "," },
    ],
    [
      { t: '  "author"', k: "id" },
      { t: ": " },
      { t: '"@killersumit"', k: "lit" },
      { t: "," },
    ],
    [
      { t: '  "primitives"', k: "id" },
      { t: ": " },
      { t: "24", k: "lit" },
      { t: "," },
    ],
    [
      { t: '  "license"', k: "id" },
      { t: ": " },
      { t: '"MIT"', k: "lit" },
      { t: "," },
    ],
    [{ t: '  "engine"', k: "id" }, { t: ": " }, { t: '"react-19"', k: "lit" }],
    [{ t: "}" }],
  ],
};

export const FOLDERS_DATA: FolderDefinition[] = [
  {
    id: "components",
    name: "components",
    files: [FILE_ORBIT, FILE_MARQUEE],
  },
  {
    id: "hooks",
    name: "hooks",
    files: [FILE_USE_SPRING, FILE_USE_REVEAL],
  },
];

export const ALL_FILES: Record<string, FileDefinition> = {
  "components/Orbit.tsx": FILE_ORBIT,
  "components/Marquee.tsx": FILE_MARQUEE,
  "hooks/use-spring.ts": FILE_USE_SPRING,
  "hooks/use-reveal.ts": FILE_USE_REVEAL,
  "registry.json": FILE_REGISTRY_JSON,
};

// =============================================================================
// COMPONENT PROPS
// =============================================================================

export interface InteractiveFileTreeProps {
  theme?: "light" | "dark";
  replayKey?: number;
  className?: string;
}

export function InteractiveFileTree({
  theme: explicitTheme,
  replayKey,
  className,
}: InteractiveFileTreeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Internal Theme: Obsidian vs Paper (Synchronized with Peel UI header & DOM theme)
  const [internalMode, setInternalMode] = useState<SurfaceMode>(() =>
    explicitTheme === "light" ? "paper" : "obsidian"
  );

  useEffect(() => {
    if (explicitTheme) {
      setInternalMode(explicitTheme === "light" ? "paper" : "obsidian");
      return;
    }

    const updateFromContext = () => {
      const parent = containerRef.current?.closest("[data-stage-theme]");
      if (parent) {
        const val = parent.getAttribute("data-stage-theme");
        if (val === "light") {
          setInternalMode("paper");
          return;
        }
        if (val === "dark") {
          setInternalMode("obsidian");
          return;
        }
      }
      const isDocDark = document.documentElement.classList.contains("dark");
      setInternalMode(isDocDark ? "obsidian" : "paper");
    };

    updateFromContext();

    const observer = new MutationObserver(updateFromContext);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, [explicitTheme]);

  const isDark = internalMode === "obsidian";

  // Single-Folder Accordion State: Only one folder open at a time
  const [openFolderId, setOpenFolderId] = useState<string | null>("components");
  const [selectedFileId, setSelectedFileId] = useState<string>("components/Orbit.tsx");

  // Code Block Visibility State
  const [isCodeOpen, setIsCodeOpen] = useState(true);

  // Copy state for the top-right button
  const [isCopied, setIsCopied] = useState(false);
  const copyTimeoutRef = useRef<number | null>(null);

  const selectedFile = useMemo(() => {
    return ALL_FILES[selectedFileId] || FILE_ORBIT;
  }, [selectedFileId]);

  // Handle Folder Accordion Click: AUTO-SELECT RULE to prevent layoutId orphan unmounting
  const handleFolderClick = useCallback((folder: FolderDefinition) => {
    setOpenFolderId(folder.id);
    setSelectedFileId(folder.files[0].id);
    setIsCodeOpen(true);
  }, []);

  // Handle Direct File Click (Toggle hide/show if already selected; open if different)
  const handleFileClick = useCallback(
    (file: FileDefinition) => {
      if (selectedFileId === file.id) {
        setIsCodeOpen((prev) => !prev);
      } else {
        setSelectedFileId(file.id);
        setIsCodeOpen(true);
      }
    },
    [selectedFileId]
  );

  // Copy Code Handler
  const handleCopy = useCallback(() => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(selectedFile.rawCode).catch(() => {});
    }
    setIsCopied(true);
    if (copyTimeoutRef.current) window.clearTimeout(copyTimeoutRef.current);
    copyTimeoutRef.current = window.setTimeout(() => {
      setIsCopied(false);
    }, 1500);
  }, [selectedFile]);

  // Reset trigger when workspace Reset button is clicked
  useEffect(() => {
    if (replayKey !== undefined && replayKey > 0) {
      setOpenFolderId("components");
      setSelectedFileId("components/Orbit.tsx");
      setIsCodeOpen(true);
      setIsCopied(false);
    }
  }, [replayKey]);

  return (
    <div
      ref={containerRef}
      className={cn("w-full flex items-center justify-center select-none", className)}
      style={{
        fontFamily:
          "Switzer, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* ===================================================================
          CONCENTRIC 2-ZONE CHASSIS (Responsive width, no min-h-screen)
          =================================================================== */}
      <div
        className={cn(
          "w-full max-w-[340px] sm:max-w-[380px] mx-auto rounded-[28px] p-2 transition-colors duration-200",
          isDark
            ? "bg-[#121214] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_28px_60px_rgba(0,0,0,0.75)]"
            : "bg-[#EAE6DF] border border-stone-900/[0.07] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.75),0_20px_40px_rgba(28,25,23,0.08)]"
        )}
      >
        {/* ===================================================================
            ZONE 1: SINGLE-FOLDER ACCORDION TREE
            =================================================================== */}
        <div className="px-1.5 pt-1.5 pb-1">
          {/* Top Root Header */}
          <div className="h-8 px-2 flex items-center gap-2 mb-1">
            <span
              className={cn(
                "inline-flex items-center",
                isDark ? "text-[#71717A]" : "text-[#78716C]"
              )}
            >
              <FolderSimple size={15} weight="fill" />
            </span>
            <span
              className={cn(
                "text-[12px] font-medium tracking-tight",
                isDark ? "text-[#71717A]" : "text-[#78716C]"
              )}
            >
              registry / motion
            </span>
          </div>

          {/* Folder & File Tree List */}
          <div className="flex flex-col gap-0.5">
            {FOLDERS_DATA.map((folder) => {
              const isOpen = openFolderId === folder.id;

              return (
                <div key={folder.id} className="flex flex-col">
                  {/* Folder Row Header */}
                  <button
                    type="button"
                    onClick={() => handleFolderClick(folder)}
                    className={cn(
                      "h-8 px-2 rounded-[8px] flex items-center gap-2 text-left cursor-pointer transition-colors relative group",
                      isDark
                        ? "text-[#D4D4D8] hover:bg-white/[0.04]"
                        : "text-[#292524] hover:bg-black/[0.04]"
                    )}
                  >
                    {/* Animated Chevron Caret */}
                    <motion.span
                      animate={{ rotate: isOpen ? 90 : 0 }}
                      transition={{
                        duration: shouldReduceMotion ? 0 : 0.18,
                        ease: "easeOut",
                      }}
                      className={cn(
                        "inline-flex items-center shrink-0",
                        isDark ? "text-[#71717A]" : "text-[#78716C]"
                      )}
                    >
                      <CaretRight size={11} weight="bold" />
                    </motion.span>

                    {/* Folder Icon (Neutral Zinc) */}
                    <span
                      className={cn(
                        "inline-flex items-center shrink-0",
                        isDark ? "text-[#71717A]" : "text-[#78716C]"
                      )}
                    >
                      <FolderSimple size={15} weight="fill" />
                    </span>

                    {/* Folder Name */}
                    <span className="text-[13.5px] font-medium tracking-[-0.015em] antialiased">
                      {folder.name}
                    </span>
                  </button>

                  {/* Folder Children Accordion */}
                  <motion.div
                    initial={false}
                    animate={{
                      height: isOpen ? "auto" : 0,
                      opacity: isOpen ? 1 : 0,
                    }}
                    transition={{
                      type: "spring",
                      bounce: 0,
                      duration: shouldReduceMotion ? 0 : 0.28,
                    }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col gap-0.5 pt-0.5 pb-1">
                      {folder.files.map((file) => {
                        const isSelected = selectedFileId === file.id;

                        return (
                          <button
                            key={file.id}
                            type="button"
                            onClick={() => handleFileClick(file)}
                            className={cn(
                              "h-8 pl-6 pr-2.5 rounded-[9px] flex items-center justify-between text-left cursor-pointer relative transition-colors",
                              isSelected
                                ? isDark
                                  ? "text-[#F4F4F5]"
                                  : "text-[#1C1917]"
                                : isDark
                                  ? "text-[#A1A1AA] hover:text-[#F4F4F5] hover:bg-white/[0.03]"
                                  : "text-[#57534E] hover:text-[#1C1917] hover:bg-black/[0.03]"
                            )}
                          >
                            {/* Borderless Active Row Pill */}
                            {isSelected && (
                              <motion.div
                                layoutId="active-file-pill"
                                transition={{
                                  type: "spring",
                                  stiffness: 450,
                                  damping: 34,
                                  mass: 0.7,
                                }}
                                className={cn(
                                  "absolute inset-0 rounded-[9px] -z-0",
                                  isDark
                                    ? "bg-[#1E1F24] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                                    : "bg-[#DDD8CF] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]"
                                )}
                              />
                            )}

                            {/* Left: Icon + Filename */}
                            <div className="flex items-center gap-2 relative z-10 min-w-0">
                              <span
                                className={cn(
                                  "inline-flex items-center shrink-0 transition-colors",
                                  isSelected
                                    ? isDark
                                      ? "text-[#E4E4E7]"
                                      : "text-[#1C1917]"
                                    : isDark
                                      ? "text-[#71717A]"
                                      : "text-[#78716C]"
                                )}
                              >
                                {file.type === "json" ? (
                                  <BracketsCurly size={14} weight="bold" />
                                ) : (
                                  <FileCode size={15} weight="duotone" />
                                )}
                              </span>
                              <span className="text-[13.5px] font-medium tracking-[-0.015em] antialiased truncate">
                                {file.name}
                              </span>
                            </div>

                            {/* Right: 6px Emerald Accent Dot */}
                            {isSelected && (
                              <motion.span
                                layoutId="active-file-dot"
                                transition={{
                                  type: "spring",
                                  stiffness: 450,
                                  damping: 34,
                                  mass: 0.7,
                                }}
                                className="size-1.5 rounded-full shrink-0 relative z-10"
                                style={{ backgroundColor: EMERALD_PALETTE.dot }}
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                </div>
              );
            })}

            {/* Root File: registry.json */}
            {(() => {
              const file = FILE_REGISTRY_JSON;
              const isSelected = selectedFileId === file.id;

              return (
                <button
                  type="button"
                  onClick={() => handleFileClick(file)}
                  className={cn(
                    "h-8 px-2 rounded-[9px] flex items-center justify-between text-left cursor-pointer relative transition-colors mt-0.5",
                    isSelected
                      ? isDark
                        ? "text-[#F4F4F5]"
                        : "text-[#1C1917]"
                      : isDark
                        ? "text-[#A1A1AA] hover:text-[#F4F4F5] hover:bg-white/[0.03]"
                        : "text-[#57534E] hover:text-[#1C1917] hover:bg-black/[0.03]"
                  )}
                >
                  {/* Borderless Active Row Pill */}
                  {isSelected && (
                    <motion.div
                      layoutId="active-file-pill"
                      transition={{
                        type: "spring",
                        stiffness: 450,
                        damping: 34,
                        mass: 0.7,
                      }}
                      className={cn(
                        "absolute inset-0 rounded-[9px] -z-0",
                        isDark
                          ? "bg-[#1E1F24] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                          : "bg-[#DDD8CF] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]"
                      )}
                    />
                  )}

                  {/* Left: Icon + Filename */}
                  <div className="flex items-center gap-2 relative z-10 min-w-0">
                    <span
                      className={cn(
                        "inline-flex items-center shrink-0 transition-colors",
                        isSelected
                          ? isDark
                            ? "text-[#E4E4E7]"
                            : "text-[#1C1917]"
                          : isDark
                            ? "text-[#71717A]"
                            : "text-[#78716C]"
                      )}
                    >
                      <BracketsCurly size={14} weight="bold" />
                    </span>
                    <span className="text-[13.5px] font-medium tracking-[-0.015em] antialiased truncate">
                      {file.name}
                    </span>
                  </div>

                  {/* Right: 6px Emerald Accent Dot */}
                  {isSelected && (
                    <motion.span
                      layoutId="active-file-dot"
                      transition={{
                        type: "spring",
                        stiffness: 450,
                        damping: 34,
                        mass: 0.7,
                      }}
                      className="size-1.5 rounded-full shrink-0 relative z-10"
                      style={{ backgroundColor: EMERALD_PALETTE.dot }}
                    />
                  )}
                </button>
              );
            })()}
          </div>
        </div>

        {/* ===================================================================
            ZONE 2: COLLAPSIBLE RECESSED CODE WELL (Smooth spring transition)
            =================================================================== */}
        <AnimatePresence initial={false}>
          {isCodeOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0, marginTop: 0 }}
              animate={{ height: 196, opacity: 1, marginTop: 6 }}
              exit={{ height: 0, opacity: 0, marginTop: 0 }}
              transition={{
                type: "spring",
                bounce: 0,
                duration: shouldReduceMotion ? 0 : 0.28,
              }}
              className={cn(
                "rounded-[20px] p-3.5 relative overflow-hidden transition-colors duration-200",
                isDark
                  ? "bg-[#0B0B0D] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"
                  : "bg-[#E2DDD4] shadow-[inset_0_1px_2px_rgba(28,25,23,0.06)] border border-stone-900/[0.05]"
              )}
            >
              {/* Top-Right Corner Controls: Copy + Hide Buttons */}
              <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-20">
                {/* Copy Button */}
                <button
                  type="button"
                  onClick={handleCopy}
                  aria-label="Copy file snippet"
                  title="Copy snippet"
                  className={cn(
                    "size-7 rounded-[10px] flex items-center justify-center transition-colors cursor-pointer backdrop-blur-sm",
                    isDark
                      ? "bg-[#18181B]/80 hover:bg-[#222226] text-[#A1A1AA] hover:text-[#F4F4F5] border border-white/[0.06]"
                      : "bg-[#D7D2C8]/80 hover:bg-[#CDC8BD] text-[#78716C] hover:text-[#1C1917] border border-black/[0.06]"
                  )}
                >
                  {isCopied ? (
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                      <motion.path
                        d="M3.5 8.5L6.5 11.5L12.5 4.5"
                        stroke={EMERALD_PALETTE.dot}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.22, ease: "easeOut" }}
                      />
                    </svg>
                  ) : (
                    <Copy size={13} />
                  )}
                </button>

                {/* Hide / Collapse Code Button */}
                <button
                  type="button"
                  onClick={() => setIsCodeOpen(false)}
                  aria-label="Hide code"
                  title="Hide code"
                  className={cn(
                    "size-7 rounded-[10px] flex items-center justify-center transition-colors cursor-pointer backdrop-blur-sm",
                    isDark
                      ? "bg-[#18181B]/80 hover:bg-[#222226] text-[#A1A1AA] hover:text-[#F4F4F5] border border-white/[0.06]"
                      : "bg-[#D7D2C8]/80 hover:bg-[#CDC8BD] text-[#78716C] hover:text-[#1C1917] border border-black/[0.06]"
                  )}
                >
                  <CaretUp size={13} weight="bold" />
                </button>
              </div>

              {/* 8-Line Monochromatic Code Display with Mobile Overflow Guard */}
              <div
                className="h-full select-text overflow-x-auto no-scrollbar"
                style={{
                  fontFamily:
                    "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedFile.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: shouldReduceMotion ? 0 : 0.14 }}
                    className="flex flex-col text-[12px] leading-[1.7] tabular-nums min-w-max pr-16"
                  >
                    {selectedFile.lines.map((lineTokens, lineIdx) => (
                      <div key={lineIdx} className="flex items-baseline whitespace-pre">
                        {/* Line Number */}
                        <span
                          className={cn(
                            "w-5 select-none text-right pr-3 font-mono text-[11px] tabular-nums shrink-0",
                            isDark ? "text-[#3F3F46]" : "text-[#A8A29E]"
                          )}
                        >
                          {lineIdx + 1}
                        </span>

                        {/* Tokens */}
                        <span className="flex-1">
                          {lineTokens.length === 0 ? (
                            <span>&nbsp;</span>
                          ) : (
                            lineTokens.map((token, tokIdx) => {
                              let colorStyle: string = isDark ? "#71717A" : "#78716C";

                              if (token.k === "kw") {
                                colorStyle = isDark
                                  ? EMERALD_PALETTE.dark.kw
                                  : EMERALD_PALETTE.paper.kw;
                              } else if (token.k === "lit") {
                                colorStyle = isDark
                                  ? EMERALD_PALETTE.dark.lit
                                  : EMERALD_PALETTE.paper.lit;
                              } else if (token.k === "fn" || token.k === "id") {
                                colorStyle = isDark ? "#F4F4F5" : "#1C1917";
                              }

                              return (
                                <span
                                  key={tokIdx}
                                  style={{ color: colorStyle }}
                                  className={
                                    token.k === "kw" || token.k === "fn"
                                      ? "font-medium"
                                      : "font-normal"
                                  }
                                >
                                  {token.t}
                                </span>
                              );
                            })
                          )}
                        </span>
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default InteractiveFileTree;

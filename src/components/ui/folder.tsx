"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";

export interface FolderItem {
  id: string;
  title: string;
  tag: string;
  desc: string;
  accent?: string;
}

export interface FolderProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  tabLabel?: string;
  items?: FolderItem[];
  className?: string;
}

const DEFAULT_ITEMS: FolderItem[] = [
  {
    id: "01",
    title: "slide-to-confirm.tsx",
    tag: "PRIMITIVE",
    desc: "spring(500, 32)",
  },
  {
    id: "02",
    title: "spring-tabs.tsx",
    tag: "PRIMITIVE",
    desc: "layoutId spring",
  },
  {
    id: "03",
    title: "3d-folder.tsx",
    tag: "ACTIVE",
    desc: "60fps perspective",
    accent: "#84ff00",
  },
];

const SPRING_FLAP = {
  type: "spring",
  stiffness: 300,
  damping: 24,
} as const;

const SPRING_CARD = {
  type: "spring",
  stiffness: 340,
  damping: 26,
} as const;

export function Folder({
  label = "peel-ui / registry",
  tabLabel = "SRC",
  items = DEFAULT_ITEMS,
  className = "",
  ...props
}: FolderProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const [hoveredCardIdx, setHoveredCardIdx] = React.useState<number | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const active = isOpen || isHovered;

  // Card fan-out configurations
  const cardTransforms = [
    { y: -44, rotate: -4, z: 10 },
    { y: -30, rotate: 2, z: 20 },
    { y: -16, rotate: 0, z: 30 },
  ];

  return (
    <div
      role="region"
      aria-label="3D Interactive Folder"
      className={`relative select-none cursor-pointer flex items-center justify-center p-8 ${className}`}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => {
        setIsHovered(false);
        setHoveredCardIdx(null);
      }}
      onClick={() => setIsOpen((prev) => !prev)}
      style={{ perspective: 800 }}
      {...props}
    >
      {/* 3D Preserving Stage */}
      <div
        className="relative w-56 h-36"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Top-Left Folder Tab */}
        <div
          className="absolute -top-5 left-3 bg-[#181b22] border-t border-x border-zinc-800 rounded-t-lg px-3 py-0.5 text-[10px] font-mono text-zinc-400 flex items-center gap-1.5 select-none z-0"
          style={{ transform: "translateZ(-2px)" }}
        >
          <span className="w-1 h-1 rounded-full bg-[#84ff00]" />
          <span>{tabLabel}</span>
        </div>

        {/* Back Folder Plate */}
        <div
          className="absolute inset-0 bg-[#12141a] border border-zinc-800 rounded-2xl shadow-xl z-0"
          style={{ transform: "translateZ(-1px)" }}
        />

        {/* 3 Nested Document Cards */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ transformStyle: "preserve-3d" }}
        >
          {items.slice(0, 3).map((item, idx) => {
            const base = cardTransforms[idx] || { y: -16, rotate: 0, z: 10 };
            const isCardHovered = hoveredCardIdx === idx;

            // Target transform states
            const targetY = shouldReduceMotion
              ? 0
              : isCardHovered
              ? -56
              : active
              ? base.y
              : 0;

            const targetRotate = shouldReduceMotion
              ? 0
              : isCardHovered
              ? 0
              : active
              ? base.rotate
              : 0;

            const targetScale = isCardHovered ? 1.04 : 1;
            const targetZ = isCardHovered ? 40 : base.z;

            return (
              <motion.div
                key={item.id}
                initial={false}
                animate={{
                  y: targetY,
                  rotate: targetRotate,
                  scale: targetScale,
                }}
                transition={SPRING_CARD}
                onPointerEnter={(e) => {
                  e.stopPropagation();
                  if (active) setHoveredCardIdx(idx);
                }}
                onPointerLeave={(e) => {
                  e.stopPropagation();
                  setHoveredCardIdx(null);
                }}
                className={`absolute w-48 h-28 rounded-xl p-3 flex flex-col justify-between border shadow-lg transition-colors pointer-events-auto ${
                  idx === 0
                    ? "bg-zinc-900 border-zinc-800/80 text-zinc-400"
                    : idx === 1
                    ? "bg-[#16181f] border-zinc-800 text-zinc-300"
                    : "bg-[#1c1f28] border-zinc-700/80 text-white shadow-xl"
                }`}
                style={{
                  transformOrigin: "bottom center",
                  transformStyle: "preserve-3d",
                  zIndex: targetZ,
                }}
              >
                {/* Card Header */}
                <div className="flex items-center justify-between font-mono text-[10px] text-zinc-500">
                  <span
                    style={{
                      color: item.accent ? item.accent : undefined,
                    }}
                  >
                    {`${item.id} · ${item.tag}`}
                  </span>
                  <span className="text-zinc-600">TSX</span>
                </div>

                {/* Card Body */}
                <div className="my-auto">
                  <div className="font-mono text-[11px] font-medium text-zinc-200 truncate">
                    {item.title}
                  </div>
                  <div className="text-[10px] font-mono text-zinc-500 mt-0.5">
                    {item.desc}
                  </div>
                </div>

                {/* Card Micro Footer */}
                <div className="w-full flex items-center justify-between pt-1 border-t border-zinc-800/40 font-mono text-[9px] text-zinc-600">
                  <span>COMPONENT</span>
                  <span className="text-[#84ff00]">READY</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Front Folder Flap (Tilts forward with 3D Perspective) */}
        <motion.div
          initial={false}
          animate={{
            rotateX: shouldReduceMotion ? 0 : active ? -32 : 0,
          }}
          transition={SPRING_FLAP}
          className="absolute inset-0 bg-[#14171f]/95 border border-zinc-800 rounded-2xl p-3 flex items-end justify-between shadow-2xl backdrop-blur-xs select-none pointer-events-none"
          style={{
            transformOrigin: "bottom center",
            transformStyle: "preserve-3d",
            zIndex: 50,
            boxShadow: active
              ? "0 20px 30px -8px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
              : "0 10px 20px -4px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
          }}
        >
          {/* Label on Front Face */}
          <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-[#84ff00]" />
            <span>{label}</span>
          </div>

          {/* Micro Geometric Ticks */}
          <div className="flex items-center gap-1 font-mono text-[10px] text-zinc-600">
            <span>+</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

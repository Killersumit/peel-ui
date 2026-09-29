"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ComponentMetadata } from "./registry-data";

export interface ComponentCardProps {
  component: ComponentMetadata;
  isFeatured?: boolean;
}

export function ComponentCard({
  component,
  isFeatured = false,
}: ComponentCardProps) {
  const PreviewComponent = component.component;
  const isLight = component.theme === "light";

  return (
    <Link
      href={`/components/${component.slug}`}
      className={`group rounded-2xl bg-[#0c0c0e] border border-white/[0.08] hover:border-white/20 transition-all duration-300 p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden shadow-xl min-h-[260px] ${
        isFeatured ? "col-span-full md:col-span-2" : ""
      }`}
    >
      {/* Live Preview Well with Light / Dark Theme Support */}
      <div
        className={`relative w-full rounded-xl flex items-center justify-center p-4 overflow-hidden pointer-events-none select-none transition-colors duration-300 ${
          isFeatured ? "h-64 sm:h-72" : "h-52 sm:h-56"
        } ${
          isLight
            ? "bg-white border border-zinc-200"
            : "bg-[#000000] border border-white/[0.04] bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:16px_16px]"
        }`}
      >
        <div className="relative z-10 w-full flex items-center justify-center">
          <PreviewComponent />
        </div>
      </div>

      {/* Clean Card Footer: Strictly Component Name (Left) + Arrow Icon (Right) */}
      <div className="flex items-center justify-between pt-4 px-1 pb-0.5">
        <span className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">
          {component.name}
        </span>

        <ArrowUpRight className="size-4 text-zinc-500 group-hover:text-lime-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200 shrink-0" />
      </div>
    </Link>
  );
}

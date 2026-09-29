"use client";

import * as React from "react";
import { ComponentCard } from "./component-card";
import type { ComponentMetadata } from "./registry-data";

export interface CategorySectionProps {
  category: string;
  components: ComponentMetadata[];
}

export function CategorySection({
  category,
  components,
}: CategorySectionProps) {
  if (components.length === 0) return null;

  return (
    <section className="mb-14">
      {/* Category Header with Clean Monospace Indexing */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-6">
        <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
          <span>{category}</span>
          <span className="font-mono text-xs font-semibold text-lime-400">
            [{components.length}]
          </span>
        </h2>
        <span className="font-mono text-[11px] text-zinc-500 hidden sm:inline">
          v0.1.0
        </span>
      </div>

      {/* Grid of Real Components: Responsive 2-column grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {components.map((comp) => {
          const isSingle = components.length === 1;
          return (
            <ComponentCard
              key={comp.slug}
              component={comp}
              isFeatured={isSingle}
            />
          );
        })}
      </div>
    </section>
  );
}

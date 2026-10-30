import type { PeelRegistryItem } from "@/registry/schema";
import { ComponentPreviewCard } from "./ComponentPreviewCard";

interface CategoryRowProps {
  title: string;
  category: string;
  items: PeelRegistryItem[];
}

export function CategoryRow({ title, category, items }: CategoryRowProps) {
  if (items.length === 0) return null;

  const isNew = category === "new-release";
  const isTwoCards = items.length === 2;

  return (
    <section className="w-full">
      {/* Quiet Left-Aligned Header */}
      <div className="flex items-baseline gap-2 mb-4">
        <h2 className="text-[14px] font-medium tracking-[-0.015em] leading-[1.3] text-[#F5F5F7]">
          {title}
        </h2>
        <span
          className={`font-mono text-[11px] tabular-nums ${
            isNew
              ? "text-[#76B872]"
              : "text-[var(--text-tertiary)]"
          }`}
        >
          {items.length}
        </span>
      </div>

      {/* Responsive Grid */}
      <div
        className={
          isTwoCards
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4"
            : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        }
      >
        {items.map((item, index) => {
          // If a category has an orphan in a 3-column grid (e.g., 4 items), the final macro card spans cleanly
          const isWide = !isTwoCards && items.length % 3 === 1 && index === items.length - 1;
          return (
            <ComponentPreviewCard
              key={item.slug}
              item={item}
              isWide={isWide}
            />
          );
        })}
      </div>
    </section>
  );
}

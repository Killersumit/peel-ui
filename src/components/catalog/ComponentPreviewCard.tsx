import { Link } from "react-router-dom";
import { ArrowUpRight } from "@phosphor-icons/react";
import type { PeelRegistryItem } from "@/registry/schema";
import { cn } from "@/lib/utils";

interface ComponentPreviewCardProps {
  item: PeelRegistryItem;
  isWide?: boolean;
}

const COMPACT_PRIMITIVES = new Set([
  "save-state-pill",
  "slide-to-confirm",
  "magnetic-split-button",
  "tactile-otp-input",
  "filter-chips",
  "tactile-filter-chips",
  "note-button",
  "voice-pill",
]);

export function ComponentPreviewCard({ item, isWide = false }: ComponentPreviewCardProps) {
  const ItemComponent = item.component;
  const isCompact = Boolean(item.isCompactHeroFeatured || COMPACT_PRIMITIVES.has(item.slug));

  return (
    <div
      className={cn(
        "group relative rounded-[20px] p-1.5 bg-gradient-to-b from-[#16181E] to-[#101216] hover:from-[#1B1E25] hover:to-[#14161B] shadow-[inset_0_1px_0_rgba(255,255,255,0.085),inset_0_0_0_1px_rgba(255,255,255,0.03),inset_0_-1px_0_rgba(0,0,0,0.85),0_14px_28px_-8px_rgba(0,0,0,0.78)] transition-all duration-200 flex flex-col justify-between",
        isWide && "col-span-1 md:col-span-2 lg:col-span-3"
      )}
    >
      {/* Background card navigation link (underneath interactive stage) */}
      <Link
        to={`/components/${item.slug}`}
        aria-label={`View ${item.title} primitive`}
        className="absolute inset-0 z-0"
      />

      {/* INSIDE: Sunken Recessed Stage Well (Concentric squircle + Layout/Paint containment) */}
      {item.previewImage ? (
        <Link
          to={`/components/${item.slug}`}
          className={cn(
            "relative w-full rounded-[14px] bg-[#060709] shadow-[inset_0_2px_8px_0_rgba(0,0,0,0.92),inset_0_0_0_1px_rgba(255,255,255,0.035),0_1px_0_0_rgba(255,255,255,0.05)] flex items-center justify-center p-5 overflow-hidden [contain:layout_paint] z-10 block cursor-pointer group/stage",
            isWide ? "h-[220px] sm:h-[260px]" : "aspect-[16/10]"
          )}
        >
          {/* Subtle radial center spotlight */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03)_0%,transparent_70%)]" />
          <img
            src={item.previewImage}
            alt={item.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover rounded-[10px] relative z-10 transition-transform duration-300 group-hover/stage:scale-[1.015]"
          />
        </Link>
      ) : (
        <div
          onClick={(e) => e.stopPropagation()}
          className={cn(
            "relative w-full rounded-[14px] bg-[#060709] shadow-[inset_0_2px_8px_0_rgba(0,0,0,0.92),inset_0_0_0_1px_rgba(255,255,255,0.035),0_1px_0_0_rgba(255,255,255,0.05)] flex items-center justify-center p-5 overflow-hidden [contain:layout_paint] z-10",
            isWide ? "h-[220px] sm:h-[260px]" : "aspect-[16/10]"
          )}
        >
          {/* Subtle radial center spotlight */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03)_0%,transparent_70%)]" />
          {isCompact ? (
            <div className="relative z-10 flex items-center justify-center w-full h-full">
              <ItemComponent theme="dark" />
            </div>
          ) : (
            <div className="w-[520px] h-[320px] scale-[0.52] sm:scale-[0.55] origin-center flex items-center justify-center shrink-0 pointer-events-auto relative z-10">
              <ItemComponent theme="dark" />
            </div>
          )}
        </div>
      )}

      {/* OUTSIDE: Raised Chassis Bottom Bar */}
      <Link
        to={`/components/${item.slug}`}
        className="relative z-10 px-3 pt-2.5 pb-1.5 flex items-center justify-between text-[#F5F5F7] focus:outline-none whitespace-nowrap"
      >
        <span className="inline-flex items-center gap-2 text-[13px] font-medium tracking-[-0.015em] leading-none whitespace-nowrap">
          {item.title}
          {item.isNew && (
            <span className="text-[11px] font-medium leading-none text-[#76B872] bg-[#5E9E5A]/12 px-1.5 py-0.5 rounded-[5px] whitespace-nowrap shrink-0">
              New
            </span>
          )}
        </span>
        <span className="text-[#555961] group-hover:text-[#F5F5F7] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200 inline-flex items-center shrink-0">
          <ArrowUpRight size={14} weight="bold" />
        </span>
      </Link>
    </div>
  );
}

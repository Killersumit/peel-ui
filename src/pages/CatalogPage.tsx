import { useState, useRef, useEffect } from "react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { REGISTRY_ITEMS, getRegistryByCategories } from "@/registry";
import { CategoryRow } from "@/components/catalog/CategoryRow";
import Footer from "@/components/layout/Footer";
import { usePageMeta } from "@/lib/usePageMeta";

export default function CatalogPage() {
  const categorized = getRegistryByCategories();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  usePageMeta({
    title: "Components — Peel UI",
    description:
      "Browse all physics-based, tactile UI primitives crafted with concentric geometry and critically damped springs.",
  });

  // Global '/' keyboard shortcut to focus the search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        !(
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          (e.target as HTMLElement)?.isContentEditable
        )
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const cleanQuery = query.trim().toLowerCase();
  const filteredCategorized = categorized
    .map((cat) => ({
      ...cat,
      items: cat.items.filter(
        (item) =>
          !cleanQuery ||
          item.title.toLowerCase().includes(cleanQuery) ||
          item.slug.toLowerCase().includes(cleanQuery) ||
          cat.title.toLowerCase().includes(cleanQuery) ||
          item.leadPitch.toLowerCase().includes(cleanQuery)
      ),
    }))
    .filter((cat) => cat.items.length > 0);

  const totalFilteredCount = filteredCategorized.reduce(
    (sum, cat) => sum + cat.items.length,
    0
  );

  return (
    <div className="relative min-h-screen w-full bg-[var(--peel-base)] text-[var(--peel-text-primary)] selection:bg-[var(--peel-lime)] selection:text-[var(--peel-lime-foreground)]">
      {/* Background Dot Matrix (Fixed & Composited: Zero Repaint on Scroll) */}
      <div
        className="pointer-events-none fixed inset-0 -z-20 [background-image:radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_20%,#000_20%,transparent_100%)] transform-gpu"
        aria-hidden="true"
      />

      {/* Header with Integrated Instant Search Bar */}
      <header className="max-w-[1040px] mx-auto w-full px-5 sm:px-6 pt-32 pb-12 text-center">
        <h1 className="font-sans font-medium tracking-[-0.038em] leading-[1.06] text-[clamp(1.75rem,3.4vw,2.75rem)] text-[#F5F5F7] text-balance">
          <span className="tabular-nums">{REGISTRY_ITEMS.length}</span>+ tactile &amp; hardware-inspired components
        </h1>
        <p className="mt-3 text-[15px] text-[var(--peel-text-secondary)] max-w-[48ch] mx-auto leading-[1.6] tracking-[-0.012em] text-pretty">
          Physics-based primitives crafted with concentric geometry, machined
          surfaces, and critically damped compositor springs.
        </p>

        {/* Sleek Sunken Search Bar */}
        <div className="max-w-[380px] mx-auto mt-6">
          <div className="h-10 px-3.5 rounded-[12px] bg-[#0E1014] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_0_0_1px_rgba(255,255,255,0.03)] flex items-center gap-2.5 focus-within:ring-1 focus-within:ring-[#F5F5F7]/30 transition-shadow">
            <span className="text-[#555961] shrink-0 inline-flex items-center">
              <MagnifyingGlass size={16} />
            </span>
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search components..."
              aria-label="Search components"
              className="w-full bg-transparent text-[13.5px] text-[#F5F5F7] placeholder:text-[#555961] focus:outline-none"
            />
            {!query && (
              <kbd className="font-mono text-[11px] text-[#555961] px-1.5 py-0.5 rounded bg-white/[0.04] shrink-0 select-none">
                /
              </kbd>
            )}
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="text-[#8E9299] hover:text-[#F5F5F7] text-[12px] shrink-0 cursor-pointer"
                aria-label="Clear search input"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Landmark */}
      <main id="main-content" className="max-w-[1040px] mx-auto w-full px-5 sm:px-6 pb-24 space-y-14">
        {totalFilteredCount > 0 ? (
          filteredCategorized.map((cat) => (
            <CategoryRow
              key={cat.category}
              category={cat.category}
              title={cat.title}
              items={cat.items}
            />
          ))
        ) : (
          <div className="text-center py-20">
            <p className="text-[14px] text-[#8E9299]">
              No components matching &ldquo;{query}&rdquo;
            </p>
            <button
              type="button"
              onClick={() => setQuery("")}
              className="mt-3 text-[13px] font-medium text-[#F5F5F7] underline underline-offset-4 decoration-white/30 hover:decoration-white cursor-pointer"
            >
              Clear search
            </button>
          </div>
        )}
      </main>

      {/* Quiet Architectural Footer */}
      <Footer />
    </div>
  );
}

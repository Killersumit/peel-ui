import { Link } from "react-router-dom";
import { Plus, ArrowRight } from "@phosphor-icons/react";

export function BackedBySection() {
  return (
    <section className="max-w-[1040px] mx-auto w-full px-5 sm:px-6 py-24 flex flex-col items-center select-none">
      {/* ── Centered Editorial Heading ── */}
      <h2 className="text-center font-sans font-medium tracking-[-0.038em] leading-[1.06] text-[clamp(1.75rem,3.4vw,2.75rem)] text-[#F5F5F7] text-balance">
        Peel UI is backed and
        <br />
        supported by the finest
      </h2>

      {/* ── Tier 1 — Diamond sponsors ── */}
      <div className="w-full mt-12 flex flex-col items-center">
        <span className="text-[13px] font-medium tracking-[-0.01em] text-[#8E9299] mb-4 whitespace-nowrap">
          Diamond sponsors
        </span>

        {/* Top Row: 2 wide squircle tiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <Link
            to="/sponsors"
            aria-label="Become a Diamond Sponsor"
            className="h-[132px] rounded-[22px] bg-gradient-to-b from-[#14161B] to-[#0E1013] hover:from-[#191C22] hover:to-[#121418] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_0_0_1px_rgba(255,255,255,0.025),0_12px_24px_-10px_rgba(0,0,0,0.7)] flex items-center justify-center gap-2 p-6 transition-all duration-200 group focus:outline-none"
          >
            <span className="text-[var(--peel-text-tertiary)] group-hover:text-[#F5F5F7] transition-colors inline-flex items-center">
              <Plus size={14} />
            </span>
            <span className="text-[13px] font-medium text-[var(--peel-text-tertiary)] group-hover:text-[#F5F5F7] transition-colors">
              Your logo here
            </span>
          </Link>

          <Link
            to="/sponsors"
            aria-label="Become a Diamond Sponsor"
            className="h-[132px] rounded-[22px] bg-gradient-to-b from-[#14161B] to-[#0E1013] hover:from-[#191C22] hover:to-[#121418] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_0_0_1px_rgba(255,255,255,0.025),0_12px_24px_-10px_rgba(0,0,0,0.7)] flex items-center justify-center gap-2 p-6 transition-all duration-200 group focus:outline-none"
          >
            <span className="text-[var(--peel-text-tertiary)] group-hover:text-[#F5F5F7] transition-colors inline-flex items-center">
              <Plus size={14} />
            </span>
            <span className="text-[13px] font-medium text-[var(--peel-text-tertiary)] group-hover:text-[#F5F5F7] transition-colors">
              Your logo here
            </span>
          </Link>
        </div>

        {/* Bottom Row: 1 centered wide squircle tile */}
        <Link
          to="/sponsors"
          aria-label="Become a Diamond Sponsor"
          className="mt-4 w-full md:w-[calc(50%-8px)] mx-auto h-[132px] rounded-[22px] bg-gradient-to-b from-[#14161B] to-[#0E1013] hover:from-[#191C22] hover:to-[#121418] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_0_0_1px_rgba(255,255,255,0.025),0_12px_24px_-10px_rgba(0,0,0,0.7)] flex items-center justify-center gap-2 p-6 transition-all duration-200 group focus:outline-none"
        >
          <span className="text-[var(--peel-text-tertiary)] group-hover:text-[#F5F5F7] transition-colors inline-flex items-center">
            <Plus size={14} />
          </span>
          <span className="text-[13px] font-medium text-[var(--peel-text-tertiary)] group-hover:text-[#F5F5F7] transition-colors">
            Your logo here
          </span>
        </Link>
      </div>

      {/* ── Tier 2 — Gold sponsors ── */}
      <div className="w-full mt-12 flex flex-col items-center">
        <span className="text-[13px] font-medium tracking-[-0.01em] text-[#8E9299] mb-4 whitespace-nowrap">
          Gold sponsors
        </span>

        {/* 3-column symmetric row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          {/* Tile 1: Open Gold Slot */}
          <Link
            to="/sponsors"
            aria-label="Become a Gold Sponsor"
            className="h-[104px] rounded-[18px] bg-gradient-to-b from-[#14161B] to-[#0E1013] hover:from-[#191C22] hover:to-[#121418] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_0_0_1px_rgba(255,255,255,0.025),0_12px_24px_-10px_rgba(0,0,0,0.7)] flex flex-col items-center justify-center gap-1.5 p-5 transition-all duration-200 group focus:outline-none"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-[var(--peel-text-tertiary)] group-hover:text-[#F5F5F7] transition-colors inline-flex items-center">
                <Plus size={13} />
              </span>
              <span className="text-[13px] font-medium text-[var(--peel-text-tertiary)] group-hover:text-[#F5F5F7] transition-colors">
                Your logo here
              </span>
            </div>
            <span className="text-[11px] font-medium tracking-[-0.01em] text-[var(--peel-text-tertiary)]">
              Gold slot
            </span>
          </Link>

          {/* Tile 2: Open Gold Slot */}
          <Link
            to="/sponsors"
            aria-label="Become a Gold Sponsor"
            className="h-[104px] rounded-[18px] bg-gradient-to-b from-[#14161B] to-[#0E1013] hover:from-[#191C22] hover:to-[#121418] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_0_0_1px_rgba(255,255,255,0.025),0_12px_24px_-10px_rgba(0,0,0,0.7)] flex flex-col items-center justify-center gap-1.5 p-5 transition-all duration-200 group focus:outline-none"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-[var(--peel-text-tertiary)] group-hover:text-[#F5F5F7] transition-colors inline-flex items-center">
                <Plus size={13} />
              </span>
              <span className="text-[13px] font-medium text-[var(--peel-text-tertiary)] group-hover:text-[#F5F5F7] transition-colors">
                Your logo here
              </span>
            </div>
            <span className="text-[11px] font-medium tracking-[-0.01em] text-[var(--peel-text-tertiary)]">
              Gold slot
            </span>
          </Link>

          {/* Tile 3: Open Gold Slot */}
          <Link
            to="/sponsors"
            aria-label="Become a Gold Sponsor"
            className="h-[104px] rounded-[18px] bg-gradient-to-b from-[#14161B] to-[#0E1013] hover:from-[#191C22] hover:to-[#121418] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_0_0_1px_rgba(255,255,255,0.025),0_12px_24px_-10px_rgba(0,0,0,0.7)] flex flex-col items-center justify-center gap-1.5 p-5 transition-all duration-200 group focus:outline-none"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-[var(--peel-text-tertiary)] group-hover:text-[#F5F5F7] transition-colors inline-flex items-center">
                <Plus size={13} />
              </span>
              <span className="text-[13px] font-medium text-[var(--peel-text-tertiary)] group-hover:text-[#F5F5F7] transition-colors">
                Your logo here
              </span>
            </div>
            <span className="text-[11px] font-medium tracking-[-0.01em] text-[var(--peel-text-tertiary)]">
              Gold slot
            </span>
          </Link>
        </div>
      </div>

      {/* ── Bottom CTA Link ── */}
      <div className="mt-10">
        <Link
          to="/sponsors"
          className="text-[13px] font-medium text-[var(--peel-text-secondary)] hover:text-[#F5F5F7] underline underline-offset-4 decoration-white/25 hover:decoration-white transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
        >
          <span>Become a sponsor</span>
          <ArrowRight size={13} weight="bold" />
        </Link>
      </div>
    </section>
  );
}

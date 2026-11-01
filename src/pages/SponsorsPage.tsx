import { Check } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { BackedBySection } from "@/components/layout/BackedBySection";
import Footer from "@/components/layout/Footer";
import { usePageMeta } from "@/lib/usePageMeta";

export default function SponsorsPage() {
  usePageMeta({
    title: "Sponsors — Peel UI",
    description:
      "Support independent open-source development of Peel UI. Pick a tier, get your logo in front of frontend engineers.",
  });
  return (
    <div className="relative min-h-screen w-full bg-[var(--peel-base)] text-[var(--peel-text-primary)] selection:bg-[var(--peel-lime)] selection:text-[var(--peel-lime-foreground)]">
      {/* Background Dot Matrix (Fixed & Composited: Zero Repaint on Scroll) */}
      <div
        className="pointer-events-none fixed inset-0 -z-20 [background-image:radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_20%,#000_20%,transparent_100%)] transform-gpu"
        aria-hidden="true"
      />

      <main id="main-content" className="max-w-[1040px] mx-auto w-full px-5 sm:px-6 pt-32 pb-20">
        {/* ── 1. Centered Header ── */}
        <header className="text-center pb-12">
          <h1 className="text-center font-sans font-medium tracking-[-0.038em] leading-[1.06] text-[clamp(1.75rem,3.4vw,2.75rem)] text-[#F5F5F7] text-balance">
            Power a growing open-source UI library
          </h1>
          <p className="mt-3.5 text-center text-[15px] leading-[1.6] tracking-[-0.012em] text-[var(--peel-text-secondary)] max-w-[48ch] mx-auto text-pretty">
            Pick a tier, get your logo in front of the developers building with Peel UI. Cancel anytime.
          </p>
        </header>

        {/* ── 2. 3-Column Tier Grid (Diamond -> Gold -> Silver) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
          {/* =====================================================================
              CARD 1: Diamond ($150 / month — Flagship Anodized Monochrome)
              ===================================================================== */}
          <div className="rounded-[22px] p-7 bg-gradient-to-b from-[#1A1D24] to-[#111318] shadow-[inset_0_1px_0_rgba(255,255,255,0.16),inset_0_0_0_1px_rgba(255,255,255,0.06),0_16px_32px_-12px_rgba(0,0,0,0.8)] flex flex-col justify-between">
            <div>
              {/* Tier Name */}
              <h2 className="text-[18px] font-medium tracking-[-0.015em] text-[#F5F5F7] whitespace-nowrap">
                Diamond
              </h2>

              {/* Price */}
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-[44px] font-semibold tracking-[-0.045em] tabular-nums text-[#F5F5F7] leading-none">
                  $150
                </span>
                <span className="text-[14px] text-[var(--peel-text-secondary)] whitespace-nowrap">
                  /month
                </span>
              </div>

              {/* Divider */}
              <div className="my-6 h-[1px] w-full bg-white/[0.06]" />

              {/* Perks List */}
              <ul className="space-y-3.5 text-[13.5px] leading-[1.5] text-[var(--peel-text-secondary)]">
                <li className="flex items-center gap-2.5">
                  <span className="text-[#F5F5F7] shrink-0 inline-flex items-center">
                    <Check size={14} weight="bold" />
                  </span>
                  <span>Largest logo on the sponsors page</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-[#F5F5F7] shrink-0 inline-flex items-center">
                    <Check size={14} weight="bold" />
                  </span>
                  <span>Largest logo on the home page</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-[#F5F5F7] shrink-0 inline-flex items-center">
                    <Check size={14} weight="bold" />
                  </span>
                  <span>Largest logo in the README</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-[#F5F5F7] shrink-0 inline-flex items-center">
                    <Check size={14} weight="bold" />
                  </span>
                  <span>Shoutout on X</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-[#F5F5F7] shrink-0 inline-flex items-center">
                    <Check size={14} weight="bold" />
                  </span>
                  <span>Direct line for feedback and requests</span>
                </li>
              </ul>
            </div>

            {/* Bottom CTA Button */}
            <a
              href="https://x.com/Sumit1476136"
              target="_blank"
              rel="noreferrer"
              className="mt-8 w-full h-11 rounded-[12px] bg-[#F5F5F7] hover:bg-white text-[#08090A] font-medium text-[13.5px] tracking-[-0.015em] flex items-center justify-center transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              Sponsor as Diamond
            </a>
          </div>

          {/* =====================================================================
              CARD 2: Gold ($75 / month)
              ===================================================================== */}
          <div className="rounded-[22px] p-7 bg-gradient-to-b from-[#14161B] to-[#0E1013] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_0_0_1px_rgba(255,255,255,0.025),0_12px_28px_-10px_rgba(0,0,0,0.7)] flex flex-col justify-between">
            <div>
              {/* Tier Name */}
              <h2 className="text-[18px] font-medium tracking-[-0.015em] text-[#F5F5F7] whitespace-nowrap">
                Gold
              </h2>

              {/* Price */}
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-[44px] font-semibold tracking-[-0.045em] tabular-nums text-[#F5F5F7] leading-none">
                  $75
                </span>
                <span className="text-[14px] text-[var(--peel-text-secondary)] whitespace-nowrap">
                  /month
                </span>
              </div>

              {/* Divider */}
              <div className="my-6 h-[1px] w-full bg-white/[0.06]" />

              {/* Perks List */}
              <ul className="space-y-3.5 text-[13.5px] leading-[1.5] text-[var(--peel-text-secondary)]">
                <li className="flex items-center gap-2.5">
                  <span className="text-[#555961] shrink-0 inline-flex items-center">
                    <Check size={14} weight="bold" />
                  </span>
                  <span>Larger logo on the sponsors page</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-[#555961] shrink-0 inline-flex items-center">
                    <Check size={14} weight="bold" />
                  </span>
                  <span>Logo on the home page</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-[#555961] shrink-0 inline-flex items-center">
                    <Check size={14} weight="bold" />
                  </span>
                  <span>Larger logo in the README</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-[#555961] shrink-0 inline-flex items-center">
                    <Check size={14} weight="bold" />
                  </span>
                  <span>Shoutout on X</span>
                </li>
              </ul>
            </div>

            {/* Bottom CTA Button */}
            <a
              href="https://x.com/Sumit1476136"
              target="_blank"
              rel="noreferrer"
              className="mt-8 w-full h-11 rounded-[12px] bg-[#1B1E25] hover:bg-[#232730] text-[#F5F5F7] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] font-medium text-[13.5px] tracking-[-0.015em] flex items-center justify-center transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              Sponsor as Gold
            </a>
          </div>

          {/* =====================================================================
              CARD 3: Silver ($25 / month)
              ===================================================================== */}
          <div className="rounded-[22px] p-7 bg-gradient-to-b from-[#14161B] to-[#0E1013] shadow-[inset_0_1px_0_rgba(255,255,255,0.06),inset_0_0_0_1px_rgba(255,255,255,0.025),0_12px_28px_-10px_rgba(0,0,0,0.7)] flex flex-col justify-between">
            <div>
              {/* Tier Name */}
              <h2 className="text-[18px] font-medium tracking-[-0.015em] text-[#F5F5F7] whitespace-nowrap">
                Silver
              </h2>

              {/* Price */}
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-[44px] font-semibold tracking-[-0.045em] tabular-nums text-[#F5F5F7] leading-none">
                  $25
                </span>
                <span className="text-[14px] text-[var(--peel-text-secondary)] whitespace-nowrap">
                  /month
                </span>
              </div>

              {/* Divider */}
              <div className="my-6 h-[1px] w-full bg-white/[0.06]" />

              {/* Perks List */}
              <ul className="space-y-3.5 text-[13.5px] leading-[1.5] text-[var(--peel-text-secondary)]">
                <li className="flex items-center gap-2.5">
                  <span className="text-[#555961] shrink-0 inline-flex items-center">
                    <Check size={14} weight="bold" />
                  </span>
                  <span>Logo on the sponsors page</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-[#555961] shrink-0 inline-flex items-center">
                    <Check size={14} weight="bold" />
                  </span>
                  <span>Logo in the README</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-[#555961] shrink-0 inline-flex items-center">
                    <Check size={14} weight="bold" />
                  </span>
                  <span>Shoutout on X</span>
                </li>
              </ul>
            </div>

            {/* Bottom CTA Button */}
            <a
              href="https://x.com/Sumit1476136"
              target="_blank"
              rel="noreferrer"
              className="mt-8 w-full h-11 rounded-[12px] bg-[#1B1E25] hover:bg-[#232730] text-[#F5F5F7] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] font-medium text-[13.5px] tracking-[-0.015em] flex items-center justify-center transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              Sponsor as Silver
            </a>
          </div>
        </div>

        {/* ── 3. Single Quiet Policy & Email Link Row ── */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[13px]">
          <span className="text-[#555961]">
            All sponsorships are subject to our{" "}
            <Link
              to="/refund"
              className="text-[#8E9299] hover:text-[#F5F5F7] transition-colors underline underline-offset-4 decoration-white/20"
            >
              Refund &amp; Sponsorship Policy
            </Link>
          </span>
          <a
            href="mailto:killer1191x@gmail.com?subject=Peel%20UI%20Sponsorship"
            className="text-[#686C75] hover:text-[#F5F5F7] transition-colors duration-150 inline-flex items-center gap-1 self-start sm:self-auto whitespace-nowrap shrink-0"
          >
            or email me →
          </a>
        </div>
      </main>

      {/* Sponsor Logo Wall */}
      <BackedBySection />

      {/* Quiet Architectural Footer */}
      <Footer />
    </div>
  );
}

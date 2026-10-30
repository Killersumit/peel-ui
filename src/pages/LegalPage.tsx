import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import Footer from "@/components/layout/Footer";
import { usePageMeta } from "@/lib/usePageMeta";

type LegalTab = "privacy" | "terms" | "refund";

export default function LegalPage() {
  const location = useLocation();

  // Determine active document from URL pathname
  let activeTab: LegalTab = "privacy";
  if (location.pathname === "/terms") {
    activeTab = "terms";
  } else if (location.pathname === "/refund") {
    activeTab = "refund";
  }

  const pageTitle =
    activeTab === "privacy"
      ? "Privacy Policy"
      : activeTab === "terms"
        ? "Terms of Service"
        : "Refund & Sponsorship";

  const pageDesc =
    activeTab === "privacy"
      ? "Peel UI does not track you, does not use cookies, and never sends anything you type in component demos to a server."
      : activeTab === "terms"
        ? "All Peel UI components are 100% free to use in personal and commercial projects under the MIT License."
        : "Sponsorship policy, net-of-tax refund rules, and active month rate-lock terms.";

  // Update page title & meta per route
  usePageMeta({
    title: `${pageTitle} — Peel UI`,
    description: pageDesc,
  });

  // Storage clear handler for Privacy Policy
  const [clearedNotice, setClearedNotice] = useState(false);

  const clearStorage = () => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem("peel-pkg-manager");
      localStorage.removeItem("peel-note:demo");
      localStorage.removeItem("peel-note:v1");
      setClearedNotice(true);
      setTimeout(() => setClearedNotice(false), 3000);
    } catch {
      // Ignore
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[var(--peel-base)] text-[var(--peel-text-primary)] selection:bg-[var(--peel-lime)] selection:text-[var(--peel-lime-foreground)]">
      {/* Background Dot Matrix (Fixed & Composited) */}
      <div
        className="pointer-events-none fixed inset-0 -z-20 [background-image:radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_20%,#000_20%,transparent_100%)] transform-gpu"
        aria-hidden="true"
      />

      {/* Clean Unboxed Editorial Container */}
      <main id="main-content" className="max-w-[680px] mx-auto w-full px-5 sm:px-6 pt-32 pb-24">
        {/* ── 1. Header & Minimal Switcher ── */}
        <header className="pb-8 border-b border-white/[0.07]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="font-sans font-medium tracking-[-0.04em] text-[clamp(2rem,3.6vw,2.75rem)] leading-none text-[#F5F5F7]">
              {activeTab === "privacy" && "Privacy Policy"}
              {activeTab === "terms" && "Terms of Service"}
              {activeTab === "refund" && "Refund & Sponsorship"}
            </h1>

            {/* Compact 3-Tab Pill Switcher */}
            <div className="p-1 rounded-[12px] bg-[#060709] shadow-[inset_0_1px_4px_rgba(0,0,0,0.9),inset_0_0_0_1px_rgba(255,255,255,0.04)] inline-flex items-center gap-1 self-start sm:self-auto select-none">
              <Link
                to="/privacy"
                className={`h-8 px-3.5 rounded-[8px] text-[12.5px] font-medium tracking-[-0.01em] whitespace-nowrap transition-colors flex items-center ${
                  activeTab === "privacy"
                    ? "bg-[#1B1E25] text-[#F5F5F7] shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_2px_4px_rgba(0,0,0,0.4)]"
                    : "text-[#8E9299] hover:text-[#F5F5F7]"
                }`}
              >
                Privacy
              </Link>
              <Link
                to="/terms"
                className={`h-8 px-3.5 rounded-[8px] text-[12.5px] font-medium tracking-[-0.01em] whitespace-nowrap transition-colors flex items-center ${
                  activeTab === "terms"
                    ? "bg-[#1B1E25] text-[#F5F5F7] shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_2px_4px_rgba(0,0,0,0.4)]"
                    : "text-[#8E9299] hover:text-[#F5F5F7]"
                }`}
              >
                Terms
              </Link>
              <Link
                to="/refund"
                className={`h-8 px-3.5 rounded-[8px] text-[12.5px] font-medium tracking-[-0.01em] whitespace-nowrap transition-colors flex items-center ${
                  activeTab === "refund"
                    ? "bg-[#1B1E25] text-[#F5F5F7] shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_2px_4px_rgba(0,0,0,0.4)]"
                    : "text-[#8E9299] hover:text-[#F5F5F7]"
                }`}
              >
                Refund
              </Link>
            </div>
          </div>

          {/* 1-Sentence Plain-English Summary */}
          <p className="mt-5 text-[16px] leading-[1.6] text-[#F5F5F7]/90 font-normal text-pretty">
            {activeTab === "privacy" &&
              "Peel UI does not track you, does not use cookies, and never sends anything you type in component demos to a server."}
            {activeTab === "terms" &&
              "All Peel UI components are 100% free to use in personal and commercial projects under the MIT License—just don't clone our website and pretend to be us."}
            {activeTab === "refund" &&
              "Sponsorships directly support the creator (@Sumit1476136) and buy logo placement—not guaranteed traffic or profit—with strict net-of-tax refund and monthly price-lock terms."}
          </p>
        </header>

        {/* ── 2. Unboxed Document Sections ── */}
        <div className="divide-y divide-white/[0.06]">
          {/* =================================================================
              DOCUMENT 1: PRIVACY POLICY (/privacy)
              ================================================================= */}
          {activeTab === "privacy" && (
            <>
              {/* Section 1 */}
              <section className="py-8 space-y-3">
                <h2 className="text-[16px] font-medium tracking-[-0.015em] text-[#F5F5F7]">
                  Zero Analytics &amp; Zero Cookies
                </h2>
                <p className="text-[14.5px] leading-[1.72] text-[#8E9299] text-pretty">
                  We do not run Google Analytics, Vercel Analytics, tracking pixels, or cookies. Your browsing activity on Peel UI is never tracked, recorded, or sold.
                </p>
              </section>

              {/* Section 2 */}
              <section className="py-8 space-y-3">
                <h2 className="text-[16px] font-medium tracking-[-0.015em] text-[#F5F5F7]">
                  Local Browser Storage
                </h2>
                <p className="text-[14.5px] leading-[1.72] text-[#8E9299] text-pretty">
                  We only use your browser&apos;s local storage for two optional conveniences:{" "}
                  <code className="text-[#F5F5F7] font-mono text-[13px]">peel-pkg-manager</code> (to remember if you prefer pnpm, npm, yarn, or bun) and{" "}
                  <code className="text-[#F5F5F7] font-mono text-[13px]">peel-note:demo</code> (to keep text typed in the Note Button demo across reloads). This data never leaves your device.{" "}
                  <button
                    type="button"
                    onClick={clearStorage}
                    className="text-[#F5F5F7] underline underline-offset-4 decoration-white/30 hover:decoration-white cursor-pointer"
                  >
                    Click here to clear saved browser data
                  </button>
                  {clearedNotice && (
                    <span className="text-[var(--peel-lime)] ml-1.5 font-medium">
                      (Cleared!)
                    </span>
                  )}
                </p>
              </section>

              {/* Section 3 */}
              <section className="py-8 space-y-3">
                <h2 className="text-[16px] font-medium tracking-[-0.015em] text-[#F5F5F7]">
                  Component Demo Inputs
                </h2>
                <p className="text-[14.5px] leading-[1.72] text-[#8E9299] text-pretty">
                  Every interactive component on this site runs strictly in your browser&apos;s temporary memory. Emails, OTP numbers, notes, or votes typed into demos are never sent to any backend server.
                </p>
              </section>

              {/* Section 4 */}
              <section className="py-8 space-y-3">
                <h2 className="text-[16px] font-medium tracking-[-0.015em] text-[#F5F5F7]">
                  Contact
                </h2>
                <p className="text-[14.5px] leading-[1.72] text-[#8E9299] text-pretty">
                  Questions about privacy? Reach out on X at{" "}
                  <a
                    href="https://x.com/Sumit1476136"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#F5F5F7] underline underline-offset-4"
                  >
                    @Sumit1476136
                  </a>{" "}
                  or email{" "}
                  <a
                    href="mailto:killer1191x@gmail.com"
                    className="text-[#F5F5F7] underline underline-offset-4"
                  >
                    killer1191x@gmail.com
                  </a>
                  .
                </p>
              </section>
            </>
          )}

          {/* =================================================================
              DOCUMENT 2: TERMS OF SERVICE (/terms)
              ================================================================= */}
          {activeTab === "terms" && (
            <>
              {/* Section 1 */}
              <section className="py-8 space-y-3">
                <h2 className="text-[16px] font-medium tracking-[-0.015em] text-[#F5F5F7]">
                  MIT License for All Components
                </h2>
                <p className="text-[14.5px] leading-[1.72] text-[#8E9299] text-pretty">
                  All UI primitives and source code in Peel UI are licensed under the{" "}
                  <strong className="text-[#F5F5F7] font-medium">MIT License</strong>. You can copy, paste, modify, and ship them inside unlimited personal, client, or commercial projects for free without attribution.
                </p>
              </section>

              {/* Section 2 */}
              <section className="py-8 space-y-3">
                <h2 className="text-[16px] font-medium tracking-[-0.015em] text-[#F5F5F7]">
                  Brand &amp; Website Identity
                </h2>
                <p className="text-[14.5px] leading-[1.72] text-[#8E9299] text-pretty">
                  While the components are free to use anywhere, you may not clone the Peel UI website, logo mark, or brand name to launch a competing component directory or impersonate Peel UI.
                </p>
              </section>

              {/* Section 3 */}
              <section className="py-8 space-y-3">
                <h2 className="text-[16px] font-medium tracking-[-0.015em] text-[#F5F5F7]">
                  Provided &quot;As-Is&quot;
                </h2>
                <p className="text-[14.5px] leading-[1.72] text-[#8E9299] text-pretty">
                  All code is provided &quot;as is&quot; without warranty of any kind. The owner (@Sumit1476136) is not liable for any damages or issues arising from using these components in production.
                </p>
              </section>

              {/* Section 4 */}
              <section className="py-8 space-y-3">
                <h2 className="text-[16px] font-medium tracking-[-0.015em] text-[#F5F5F7]">
                  Contact
                </h2>
                <p className="text-[14.5px] leading-[1.72] text-[#8E9299] text-pretty">
                  For any legal or licensing questions, message{" "}
                  <a
                    href="https://x.com/Sumit1476136"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#F5F5F7] underline underline-offset-4"
                  >
                    @Sumit1476136 on X
                  </a>{" "}
                  or email{" "}
                  <a
                    href="mailto:killer1191x@gmail.com"
                    className="text-[#F5F5F7] underline underline-offset-4"
                  >
                    killer1191x@gmail.com
                  </a>{" "}
                  /{" "}
                  <a
                    href="mailto:killersumit1191@gmail.com"
                    className="text-[#F5F5F7] underline underline-offset-4"
                  >
                    killersumit1191@gmail.com
                  </a>
                  .
                </p>
              </section>
            </>
          )}

          {/* =================================================================
              DOCUMENT 3: REFUND & SPONSORSHIP (/refund)
              ================================================================= */}
          {activeTab === "refund" && (
            <>
              {/* Section 1 */}
              <section className="py-8 space-y-3">
                <h2 className="text-[16px] font-medium tracking-[-0.015em] text-[#F5F5F7]">
                  Direct Support &amp; No Profit Guarantee
                </h2>
                <p className="text-[14.5px] leading-[1.72] text-[#8E9299] text-pretty">
                  Every monthly sponsorship goes directly to the owner (
                  <a
                    href="https://x.com/Sumit1476136"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#F5F5F7] underline underline-offset-4"
                  >
                    @Sumit1476136
                  </a>
                  ) to help fund and maintain Peel UI as a free open-source library.{" "}
                  <strong className="text-[#F5F5F7] font-medium">
                    Sponsoring Peel UI does NOT guarantee that you will gain any profit, sales, signups, or traffic.
                  </strong>{" "}
                  Sponsorship only provides logo placement and an X shoutout—whether anyone visits your link depends 100% on luck and the mood of the visitors browsing our website.
                </p>
              </section>

              {/* Section 2 */}
              <section className="py-8 space-y-3">
                <h2 className="text-[16px] font-medium tracking-[-0.015em] text-[#F5F5F7]">
                  72-Hour Refund Rule &amp; Tax Subtraction
                </h2>
                <p className="text-[14.5px] leading-[1.72] text-[#8E9299] text-pretty">
                  You may request a refund within{" "}
                  <strong className="text-[#F5F5F7] font-medium">72 hours of payment</strong>{" "}
                  only if your logo and X shoutout have not been published yet. Once your brand is live on the website, README, or X, the month is non-refundable.
                </p>
                <p className="text-[14.5px] leading-[1.72] text-[#8E9299] text-pretty">
                  <strong className="text-[#F5F5F7] font-medium">
                    We never refund 100% of the full amount you sent—we only refund the exact net amount we received after subtracting tax and payment fees.
                  </strong>{" "}
                  For example, if you pay{" "}
                  <strong className="text-[#F5F5F7] font-medium">$150</strong> and{" "}
                  <strong className="text-[#F5F5F7] font-medium">$2</strong> is deducted in tax/fees when we receive it, we will only send back{" "}
                  <strong className="text-[#F5F5F7] font-medium">$148</strong>. If your bank or payment processor deducts an additional tax or fee when receiving the refund, we are not responsible for that deduction.
                </p>
              </section>

              {/* Section 3 */}
              <section className="py-8 space-y-3">
                <h2 className="text-[16px] font-medium tracking-[-0.015em] text-[#F5F5F7]">
                  Price Changes &amp; Active Month Protection
                </h2>
                <p className="text-[14.5px] leading-[1.72] text-[#8E9299] text-pretty">
                  The owner can change sponsorship prices at any time. However,{" "}
                  <strong className="text-[#F5F5F7] font-medium">
                    if you already paid for an active month, a price increase will never affect you during that month.
                  </strong>{" "}
                  For example, if you pay{" "}
                  <strong className="text-[#F5F5F7] font-medium">$150 on January 1</strong>{" "}
                  for the Diamond tier and the price increases from{" "}
                  <strong className="text-[#F5F5F7] font-medium">$150 to $200 on January 4</strong>, you do not pay anything extra for January. When your monthly cycle ends on{" "}
                  <strong className="text-[#F5F5F7] font-medium">January 31</strong>, the new{" "}
                  <strong className="text-[#F5F5F7] font-medium">$200</strong> rate will apply if you choose to renew for February.
                </p>
              </section>

              {/* Section 4 */}
              <section className="py-8 space-y-3">
                <h2 className="text-[16px] font-medium tracking-[-0.015em] text-[#F5F5F7]">
                  How to Contact (X or Email Only)
                </h2>
                <p className="text-[14.5px] leading-[1.72] text-[#8E9299] text-pretty">
                  Do not use GitHub to request refunds or send sponsor assets. Contact the owner directly on X at{" "}
                  <a
                    href="https://x.com/Sumit1476136"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#F5F5F7] underline underline-offset-4 decoration-white/30 hover:decoration-white"
                  >
                    @Sumit1476136
                  </a>{" "}
                  or email{" "}
                  <a
                    href="mailto:killer1191x@gmail.com"
                    className="text-[#F5F5F7] underline underline-offset-4 decoration-white/30 hover:decoration-white"
                  >
                    killer1191x@gmail.com
                  </a>{" "}
                  /{" "}
                  <a
                    href="mailto:killersumit1191@gmail.com"
                    className="text-[#F5F5F7] underline underline-offset-4 decoration-white/30 hover:decoration-white"
                  >
                    killersumit1191@gmail.com
                  </a>
                  .
                </p>
              </section>
            </>
          )}
        </div>
      </main>

      {/* Quiet Architectural Footer (Minimal mode auto-detected) */}
      <Footer minimal />
    </div>
  );
}

"use client";

import * as React from "react";
import { WaitlistJoin } from "@/registry/primitives/waitlist-join";

export function WaitlistJoinDemo() {
  const [remountKey, setRemountKey] = React.useState(0);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const handleSubmit = async (email: string) => {
    await new Promise((resolve) => setTimeout(resolve, 900));
    if (email.includes("error")) {
      throw new Error("Simulated failure");
    }
    setIsSuccess(true);
    return { position: 1285 };
  };

  const handleReplay = () => {
    setIsSuccess(false);
    setRemountKey((k) => k + 1);
  };

  return (
    <div className="w-full max-w-[540px] mx-auto p-0 sm:p-2">
      <div className="relative flex min-h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-[var(--peel-border,#232730)] bg-[var(--peel-base,#08090a)] px-3 sm:px-6 py-8 sm:py-12 gap-[24px] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.5)]">
        <span className="inline-flex items-center rounded-full border border-[var(--peel-border,#232730)] px-[12px] py-[6px] text-[12px] font-medium leading-none text-[var(--peel-text-primary,#f5f5f7)]">
          Early access
        </span>

        <h2 className="max-w-[20ch] text-center font-sans text-[clamp(36px,5vw,56px)] font-semibold leading-tight tracking-[-0.03em] text-[var(--peel-text-primary,#f5f5f7)]">
          Northfield opens soon.
        </h2>

        <p className="max-w-[36ch] text-center text-[15px] leading-relaxed text-[var(--peel-text-secondary,#8a8f98)]">
          Join the waitlist and we&apos;ll let you in when the doors open.
        </p>

        <WaitlistJoin
          key={remountKey}
          inviteUrl="https://northfield.app/join?ref=maya"
          onSubmit={handleSubmit}
        />

        {isSuccess && (
          <button
            type="button"
            onClick={handleReplay}
            className="inline-flex items-center rounded-full border border-[var(--peel-border,#232730)] px-3 py-1 text-[12px] font-medium text-[var(--peel-text-secondary,#8a8f98)] transition-colors hover:border-[var(--peel-border-strong,#3a3f4a)] hover:text-[var(--peel-text-primary,#f5f5f7)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--peel-border-focus,#f5f5f7)]"
          >
            Replay
          </button>
        )}
      </div>
    </div>
  );
}

export default WaitlistJoinDemo;

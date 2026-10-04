"use client";

import * as React from "react";
import { WaitlistJoin } from "@/components/ui/waitlist-join";

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
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6">
      <div className="relative flex min-h-[560px] w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-[var(--peel-border,#232730)] bg-[var(--peel-base,#08090a)] px-4 py-12 gap-[24px]">
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

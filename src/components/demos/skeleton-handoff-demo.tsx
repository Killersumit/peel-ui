"use client";

import * as React from "react";
import {
  Handoff,
  HandoffBlock,
  HandoffTarget,
} from "@/components/ui/skeleton-handoff";

type LoadStatus = "loading" | "ready" | "error";

const latencyOptions = [100, 900, 2400] as const;

function CommitSkeleton() {
  return (
    <div className="flex gap-4">
      <HandoffBlock id="avatar" className="size-10 shrink-0 rounded-full" />
      <div className="min-w-0 flex-1 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <HandoffBlock id="author" className="h-4 w-1/3 rounded-sm" />
          <HandoffBlock id="hash" className="h-3 w-20 rounded-sm" />
        </div>
        <HandoffBlock id="message" className="h-16 w-full rounded-sm" />
        <div className="flex items-center gap-3">
          <HandoffBlock id="stat-one" className="h-1.5 w-10 rounded-full" />
          <HandoffBlock id="stat-two" className="h-1.5 w-8 rounded-full" />
          <HandoffBlock id="stat-three" className="h-1.5 w-12 rounded-full" />
        </div>
      </div>
    </div>
  );
}

function CommitContent() {
  return (
    <div className="flex gap-4">
      <HandoffTarget
        id="avatar"
        className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#84ff00] text-xs font-semibold text-[#08090a]"
      >
        AL
      </HandoffTarget>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-4">
          <HandoffTarget
            id="author"
            as="span"
            className="text-sm font-medium text-[var(--peel-text-primary)]"
          >
            Ada Lovelace
          </HandoffTarget>
          <HandoffTarget
            id="hash"
            as="code"
            className="font-mono text-xs tracking-[0.08em] text-[var(--peel-text-mono)]"
          >
            a84c1e7
          </HandoffTarget>
        </div>
        <HandoffTarget
          id="message"
          as="p"
          className="mt-4 text-sm leading-5 text-[var(--peel-text-secondary)]"
        >
          Reuse commit scheduling.
          <br />
          Keep author and status.
          <br />
          Remove the loading frame.
        </HandoffTarget>
        <div className="mt-4 flex items-center gap-3">
          <HandoffTarget
            id="stat-one"
            as="span"
            className="inline-flex items-center"
          >
            <span className="block h-1.5 w-10 rounded-full bg-[#51555e]" />
          </HandoffTarget>
          <HandoffTarget
            id="stat-two"
            as="span"
            className="inline-flex items-center"
          >
            <span className="block h-1.5 w-8 rounded-full bg-[#51555e]" />
          </HandoffTarget>
          <HandoffTarget
            id="stat-three"
            as="span"
            className="inline-flex items-center"
          >
            <span className="block h-1.5 w-12 rounded-full bg-[#51555e]" />
          </HandoffTarget>
        </div>
      </div>
    </div>
  );
}

function HardCutCard({ status }: { status: LoadStatus }) {
  return (
    <section className="border border-[#232730] bg-[var(--peel-surface,#12141a)] p-4">
      <h3 className="mb-4 font-mono text-xs uppercase tracking-[0.12em] text-[var(--peel-text-secondary)]">
        Hard cut
      </h3>
      {status === "loading" ? (
        <CommitSkeleton />
      ) : status === "error" ? (
        <p role="alert" className="text-sm text-[var(--peel-coral,#ff553e)]">
          Failed to load
        </p>
      ) : (
        <CommitContent />
      )}
    </section>
  );
}

function HandoffCard({ status }: { status: LoadStatus }) {
  return (
    <section className="border border-[#232730] bg-[var(--peel-surface,#12141a)] p-4">
      <h3 className="mb-4 font-mono text-xs uppercase tracking-[0.12em] text-[var(--peel-text-secondary)]">
        Skeleton Handoff
      </h3>
      <Handoff status={status} skeleton={<CommitSkeleton />}>
        <CommitContent />
      </Handoff>
    </section>
  );
}

export function SkeletonHandoffDemo() {
  const [latency, setLatency] = React.useState<number>(900);
  const [status, setStatus] = React.useState<LoadStatus>("loading");
  const [request, setRequest] = React.useState({ id: 0, fails: false });

  React.useEffect(() => {
    if (status !== "loading") return;
    const timer = window.setTimeout(
      () => setStatus(request.fails ? "error" : "ready"),
      latency,
    );
    return () => window.clearTimeout(timer);
  }, [latency, request, status]);

  const startRequest = (fails = false) => {
    setStatus("loading");
    setRequest((current) => ({ id: current.id + 1, fails }));
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between gap-2 border-b border-[#232730] pb-4">
        <fieldset className="flex shrink-0 items-center gap-0">
          <legend className="sr-only">Latency</legend>
          <span className="mr-1 font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--peel-text-secondary)]">
            Latency
          </span>
          {latencyOptions.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={latency === option}
              onClick={() => setLatency(option)}
              className="whitespace-nowrap border border-[#232730] px-0 py-1 font-mono text-[10px] text-[var(--peel-text-secondary)] transition-colors hover:text-[var(--peel-text-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#84ff00] aria-pressed:border-[#84ff00] aria-pressed:text-[var(--peel-text-primary)]"
            >
              {option} ms
            </button>
          ))}
        </fieldset>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => startRequest(false)}
            className="whitespace-nowrap border border-[#232730] px-0 py-1 font-mono text-[10px] text-[var(--peel-text-primary)] transition-colors hover:bg-[var(--peel-surface-raised,#181b22)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#84ff00]"
          >
            Reload
          </button>
          <button
            type="button"
            onClick={() => startRequest(true)}
            className="whitespace-nowrap border border-[#232730] px-0 py-1 font-mono text-[10px] text-[var(--peel-text-primary)] transition-colors hover:bg-[var(--peel-surface-raised,#181b22)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#84ff00]"
          >
            Fail
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <HardCutCard status={status} />
        <HandoffCard status={status} />
      </div>
    </div>
  );
}

export function SkeletonHandoffPreview() {
  const [status, setStatus] = React.useState<LoadStatus>("loading");

  React.useEffect(() => {
    const timer = window.setTimeout(() => setStatus("ready"), 900);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="w-full max-w-md p-4">
      <Handoff status={status} skeleton={<CommitSkeleton />}>
        <CommitContent />
      </Handoff>
    </div>
  );
}

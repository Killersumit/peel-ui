"use client";

import * as React from "react";
import { Check, ChevronDown, Copy, X } from "lucide-react";
import { ComponentRecord } from "@/config/components-data";

export interface CodeViewProps {
  componentRecord: ComponentRecord;
  onClose?: () => void;
}

function NumberedCode({ value }: { value: string }) {
  const lines = value.split("\n");

  return (
    <div className="max-h-[42vh] overflow-auto border border-peel-border-subtle bg-peel-surface text-[10px] leading-[1.8]">
      <div className="flex min-w-max">
        <div
          aria-hidden="true"
          className="sticky left-0 select-none border-r border-peel-border-subtle bg-peel-surface px-3 py-3 text-right text-peel-text-mono"
        >
          {lines.map((_, index) => (
            <div key={index}>{index + 1}</div>
          ))}
        </div>
        <pre className="select-text px-4 py-3 font-mono text-peel-text-secondary">
          <code>{value}</code>
        </pre>
      </div>
    </div>
  );
}

export default function CodeView({
  componentRecord,
  onClose,
}: CodeViewProps) {
  const [copied, setCopied] = React.useState<"usage" | "source" | null>(null);
  const [copyError, setCopyError] = React.useState<"usage" | "source" | null>(
    null
  );
  const sourceLineCount = React.useMemo(
    () => componentRecord.sourceCode.split("\n").length,
    [componentRecord.sourceCode]
  );

  const copyText = async (value: string, target: "usage" | "source") => {
    setCopyError(null);
    try {
      await navigator.clipboard.writeText(value);
      setCopied(target);
      window.setTimeout(() => {
        setCopied((current) => (current === target ? null : current));
      }, 1800);
    } catch {
      setCopyError(target);
    }
  };

  const copyButton = (target: "usage" | "source", value: string) => (
    <button
      type="button"
      onClick={() => copyText(value, target)}
      aria-label={`Copy ${target === "usage" ? "usage example" : "source code"}`}
      className="inline-flex min-h-8 items-center gap-1.5 px-2 text-[11px] text-peel-text-secondary transition-colors hover:text-peel-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-peel-border-focus"
    >
      {copied === target ? <Check size={12} /> : <Copy size={12} />}
      Copy
    </button>
  );

  return (
    <div className="flex h-full min-h-0 flex-col text-peel-text-primary">
      <header className="flex min-h-12 items-center justify-between border-b border-peel-border-subtle px-6 md:px-8">
        <div className="flex items-baseline gap-2">
          <h2 className="text-[12px] font-medium text-peel-text-primary">Code</h2>
          <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-peel-text-mono">
            TSX
          </span>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close code view"
            className="hidden size-8 items-center justify-center text-peel-text-secondary transition-colors hover:bg-peel-surface-raised hover:text-peel-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-peel-border-focus md:inline-flex"
          >
            <X size={14} />
          </button>
        )}
      </header>
      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-6 py-6 md:px-8">
        <section aria-labelledby="usage-code-heading">
          <div className="mb-2 flex items-center justify-between gap-3">
            <h3
              id="usage-code-heading"
              className="font-mono text-[10px] uppercase tracking-[0.12em] text-peel-text-mono"
            >
              Usage
            </h3>
            {copyButton("usage", componentRecord.usageSnippet)}
          </div>
          {copyError === "usage" && (
            <p className="mb-2 text-[10px] text-peel-text-secondary" role="status">
              Clipboard unavailable. Select the code to copy.
            </p>
          )}
          <NumberedCode value={componentRecord.usageSnippet} />
        </section>

        <details className="group relative border-t border-peel-border-subtle pt-4">
          <summary className="flex min-h-10 cursor-pointer list-none items-center justify-between pr-16 text-[12px] text-peel-text-secondary hover:text-peel-text-primary">
            <span className="flex items-center gap-2">
              <span
                id="source-code-heading"
                className="font-mono text-[10px] uppercase tracking-[0.12em]"
              >
                Source
              </span>
              <span className="font-mono text-[9px] text-peel-text-mono">
                {sourceLineCount} lines
              </span>
            </span>
            <ChevronDown
              size={14}
              aria-hidden="true"
              className="transition-transform motion-reduce:transition-none group-open:rotate-180"
            />
          </summary>
          <div className="absolute right-0 top-4">
            {copyButton("source", componentRecord.sourceCode)}
          </div>
          {copyError === "source" && (
            <p className="mb-2 text-[10px] text-peel-text-secondary" role="status">
              Clipboard unavailable. Select the code to copy.
            </p>
          )}
          <div aria-labelledby="source-code-heading" className="mt-2">
            <NumberedCode value={componentRecord.sourceCode} />
          </div>
        </details>
      </div>
    </div>
  );
}

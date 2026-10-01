"use client";

import { X } from "lucide-react";
import { ComponentRecord } from "@/config/components-data";

export interface InspectorProps {
  componentRecord: ComponentRecord;
  onClose?: () => void;
}

export function Inspector({
  componentRecord,
  onClose,
}: InspectorProps) {
  return (
    <div className="flex h-full min-h-0 flex-col text-zinc-100">
      <div className="flex min-h-0 flex-1 flex-col gap-8 overflow-y-auto px-6 pb-8 pt-16 md:px-8 md:pt-20">
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-sm font-medium text-zinc-400">
              {componentRecord.name}
            </h1>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close component details"
                className="hidden size-7 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-white/[0.06] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-lime-400 md:inline-flex"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <p className="max-w-[34ch] text-xl font-medium leading-[1.45] tracking-[-0.02em] text-zinc-200">
            {componentRecord.description}
          </p>
          <div className="space-y-2 pt-6" aria-label="Dependencies">
            <h2 className="text-[10px] font-medium uppercase tracking-[0.13em] text-zinc-500">
              Dependencies
            </h2>
            <div className="flex flex-wrap gap-2">
              {componentRecord.dependencies.map((dependency) => (
                <span
                  key={dependency}
                  className="rounded-full bg-[#1b1b1d] px-2.5 py-1 text-[11px] text-zinc-300"
                >
                  {dependency}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-[10px] font-medium uppercase tracking-[0.13em] text-zinc-500">
            Interaction
          </h2>
          <p className="text-[13px] leading-[1.7] text-zinc-400">
            {componentRecord.mechanicalDescription}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-[10px] font-medium uppercase tracking-[0.13em] text-zinc-500">
            Props
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full table-fixed border-collapse text-left">
              <colgroup>
                <col className="w-[24%]" />
                <col className="w-[31%]" />
                <col className="w-[45%]" />
              </colgroup>
              <thead>
                <tr className="border-b border-white/[0.08] text-[9px] uppercase tracking-[0.1em] text-zinc-600">
                  <th className="py-2 pr-2 font-normal">Prop</th>
                  <th className="py-2 pr-2 font-normal">Type</th>
                  <th className="py-2 font-normal">Description</th>
                </tr>
              </thead>
              <tbody>
                {componentRecord.props.map((prop) => (
                  <tr key={prop.name} className="border-b border-white/[0.06] align-top">
                    <td className="break-words py-3 pr-2 font-mono text-[10px] text-zinc-300">
                      {prop.name}
                    </td>
                    <td className="break-words py-3 pr-2 font-mono text-[10px] leading-relaxed text-zinc-500">
                      {prop.type}
                    </td>
                    <td className="break-words py-3 text-[11px] leading-relaxed text-zinc-400">
                      {prop.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <p className="border-t border-white/[0.07] pt-4 text-[10px] leading-relaxed text-zinc-600">
          MIT License. Free to use in personal and commercial projects. Built for Peel UI.
        </p>
      </div>
    </div>
  );
}

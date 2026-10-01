"use client";

import { Note } from "@/components/ui/note-button";

export function NoteButtonDemo() {
  return (
    <Note.Root storageKey="peel-note:demo">
      <div className="flex flex-col items-center gap-3">
        <Note.Trigger
          aria-label="Open personal note"
          className="static size-12 focus-visible:ring-offset-[#111113]"
        />
        <span className="text-xs text-zinc-500">Personal note</span>
      </div>
      <Note.Panel />
    </Note.Root>
  );
}

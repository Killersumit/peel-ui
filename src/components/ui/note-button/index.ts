"use client";

import { NoteRoot } from "./note-root";
import { NoteTrigger } from "./note-trigger";
import { NotePanel } from "./note-panel";

export { LineGutter } from "./line-gutter";
export { NoteRoot, NoteTrigger, NotePanel };
export type {
  NoteContextValue,
  NotePlacement,
  NoteRootProps,
} from "./note-root";
export type { NoteTriggerProps } from "./note-trigger";

export const Note = {
  Root: NoteRoot,
  Trigger: NoteTrigger,
  Panel: NotePanel,
};

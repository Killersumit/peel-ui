"use client";

import * as React from "react";
import { NotebookPen } from "lucide-react";
import { useNoteContext } from "./note-root";

export interface NoteTriggerProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export const NoteTrigger = React.forwardRef<
  HTMLButtonElement,
  NoteTriggerProps
>(function NoteTrigger(
  {
    children,
    className,
    disabled,
    onClick,
    type = "button",
    ...buttonProps
  },
  forwardedRef
) {
  const { open, setOpen, panelId, registerTrigger } = useNoteContext();

  const setRefs = React.useCallback(
    (element: HTMLButtonElement | null) => {
      registerTrigger(element);
      if (typeof forwardedRef === "function") forwardedRef(element);
      else if (forwardedRef) forwardedRef.current = element;
    },
    [forwardedRef, registerTrigger]
  );

  return (
    <button
      {...buttonProps}
      ref={setRefs}
      type={type}
      disabled={disabled}
      aria-label={buttonProps["aria-label"] ?? "Notes"}
      aria-expanded={open}
      aria-controls={panelId}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented && !disabled) setOpen(!open);
      }}
      className={[
        "inline-flex size-11 items-center justify-center rounded-full border border-white/[0.12] bg-[#1f1f21] text-[#c4c4cc] shadow-[0_2px_8px_rgba(0,0,0,0.35)] transition-colors hover:bg-[#2a2a2d] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#84ff00] focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:cursor-not-allowed disabled:opacity-50",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children ?? <NotebookPen aria-hidden="true" className="size-4" />}
    </button>
  );
});

NoteTrigger.displayName = "NoteTrigger";

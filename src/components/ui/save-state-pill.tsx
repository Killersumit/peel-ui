"use client";

import * as React from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";
import { Eye, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export type SaveState =
  | "idle"
  | "saving"
  | "saved"
  | "failed"
  | "offline"
  | "conflict";

export interface SaveStatePillProps {
  state?: SaveState;
  lastSavedAt?: Date | string | null;
  onRetry?: () => void;
  onReviewConflict?: () => void;
  className?: string;
  interactiveDemo?: boolean;
}

const STATES: { id: SaveState; label: string }[] = [
  { id: "idle", label: "Idle" },
  { id: "saving", label: "Saving" },
  { id: "saved", label: "Saved" },
  { id: "failed", label: "Failed" },
  { id: "offline", label: "Offline" },
  { id: "conflict", label: "Conflict" },
];

const subscribeToConnection = (notify: () => void) => {
  window.addEventListener("online", notify);
  window.addEventListener("offline", notify);
  return () => {
    window.removeEventListener("online", notify);
    window.removeEventListener("offline", notify);
  };
};

const getConnectionSnapshot = () =>
  typeof navigator === "undefined" ? true : navigator.onLine;

const getServerConnectionSnapshot = () => true;

function parseSavedAt(value: Date | string | null | undefined) {
  if (value instanceof Date && Number.isFinite(value.getTime())) return value;
  if (typeof value === "string") {
    const date = new Date(value);
    if (Number.isFinite(date.getTime())) return date;
  }
  return null;
}

function formatRelativeTime(savedAt: Date, now: number) {
  const elapsed = Math.max(0, now - savedAt.getTime());
  const minutes = Math.floor(elapsed / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return minutes + "m ago";
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return hours + "h ago";
  const days = Math.floor(hours / 24);
  return days + "d ago";
}

function SavedLabel({ lastSavedAt }: { lastSavedAt?: Date | string | null }) {
  const [savedAt] = React.useState(
    () => parseSavedAt(lastSavedAt) ?? new Date()
  );
  const [showRelativeTime, setShowRelativeTime] = React.useState(false);
  const [now, setNow] = React.useState(() => Date.now());
  const shouldReduceMotion = useReducedMotion();

  React.useEffect(() => {
    const revealTimer = window.setTimeout(() => {
      setNow(Date.now());
      setShowRelativeTime(true);
    }, 2500);
    const refreshTimer = window.setInterval(() => {
      setNow(Date.now());
    }, 60_000);

    return () => {
      window.clearTimeout(revealTimer);
      window.clearInterval(refreshTimer);
    };
  }, [savedAt]);

  const text = showRelativeTime
    ? "Saved " + formatRelativeTime(savedAt, now)
    : "Saved";

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.span
        key={showRelativeTime ? "relative-time" : "saved"}
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -5 }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { duration: 0.16, ease: [0.16, 1, 0.3, 1] }
        }
        className="whitespace-nowrap"
      >
        {text}
      </motion.span>
    </AnimatePresence>
  );
}

export function SaveStatePill({
  state,
  lastSavedAt,
  onRetry,
  onReviewConflict,
  className,
  interactiveDemo = false,
}: SaveStatePillProps) {
  const [demoState, setDemoState] = React.useState<SaveState>(state ?? "idle");
  const isOnline = React.useSyncExternalStore(
    subscribeToConnection,
    getConnectionSnapshot,
    getServerConnectionSnapshot
  );
  const shouldReduceMotion = useReducedMotion();
  const activeState = interactiveDemo ? demoState : state ?? "idle";
  const visibleState: SaveState = isOnline ? activeState : "offline";
  const layoutTransition = shouldReduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 500, damping: 32 };

  const retry = () => {
    if (onRetry) {
      onRetry();
    } else if (interactiveDemo) {
      setDemoState("saving");
    }
  };

  const reviewConflict = () => {
    if (onReviewConflict) {
      onReviewConflict();
    } else if (interactiveDemo) {
      setDemoState("saved");
    }
  };

  const statusContentKey =
    visibleState === "saved"
      ? "saved-" + (parseSavedAt(lastSavedAt)?.getTime() ?? "current")
      : visibleState;

  const pill = (
    <motion.div
      layout={!shouldReduceMotion}
      transition={layoutTransition}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={cn(
        "inline-flex h-7 items-center gap-2 rounded-full border border-white/[0.08] bg-[#0c0c0e] px-2.5 text-xs font-medium text-zinc-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_2px_8px_rgba(0,0,0,0.6)] transition-colors duration-200 hover:border-white/20 hover:bg-[#121215]",
        className
      )}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={statusContentKey}
          layout={!shouldReduceMotion}
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -5 }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { duration: 0.16, ease: [0.16, 1, 0.3, 1] }
          }
          className="inline-flex shrink-0 items-center gap-2"
        >
          <motion.span
            aria-hidden="true"
            className={cn(
              "size-1.5 shrink-0 rounded-full",
              visibleState === "idle" && "bg-zinc-600",
              visibleState === "saving" && "bg-amber-300",
              visibleState === "saved" &&
                "bg-lime-400 shadow-[0_0_8px_rgba(163,230,53,0.5)]",
              visibleState === "failed" && "bg-rose-400",
              visibleState === "offline" && "bg-zinc-500",
              visibleState === "conflict" && "bg-amber-400"
            )}
            animate={
              visibleState === "saving" && !shouldReduceMotion
                ? { opacity: [0.4, 1, 0.4] }
                : { opacity: 1 }
            }
            transition={
              visibleState === "saving" && !shouldReduceMotion
                ? { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
                : { duration: 0.18 }
            }
          />
          {visibleState === "saved" ? (
            <SavedLabel
              key={statusContentKey}
              lastSavedAt={lastSavedAt}
            />
          ) : (
            <span className="whitespace-nowrap">
              {visibleState === "idle" && "All changes saved"}
              {visibleState === "saving" && "Saving..."}
              {visibleState === "failed" && "Sync failed"}
              {visibleState === "offline" && "Offline — changes queued"}
              {visibleState === "conflict" && "Version conflict"}
            </span>
          )}
        </motion.span>
      </AnimatePresence>

      <AnimatePresence mode="popLayout" initial={false}>
        {visibleState === "failed" && (
          <motion.button
            key="retry"
            type="button"
            onClick={retry}
            disabled={!onRetry && !interactiveDemo}
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -5 }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { duration: 0.16, ease: [0.16, 1, 0.3, 1] }
            }
            className="inline-flex items-center gap-1 text-xs text-rose-300 underline-offset-2 transition-transform hover:text-white hover:underline active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:no-underline"
          >
            <RotateCcw aria-hidden="true" size={11} />
            Retry
          </motion.button>
        )}
        {visibleState === "conflict" && (
          <motion.button
            key="review"
            type="button"
            onClick={reviewConflict}
            disabled={!onReviewConflict && !interactiveDemo}
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -5 }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { duration: 0.16, ease: [0.16, 1, 0.3, 1] }
            }
            className="inline-flex items-center gap-1 text-xs text-amber-300 underline-offset-2 transition-transform hover:text-white hover:underline active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:no-underline"
          >
            <Eye aria-hidden="true" size={12} />
            Review
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );

  if (!interactiveDemo) return pill;

  return (
    <div className="flex flex-col items-center gap-4">
      {pill}
      <div
        role="group"
        aria-label="Choose save state for preview"
        className="inline-flex flex-wrap items-center justify-center gap-1 rounded-lg border border-white/[0.06] bg-white/[0.04] p-1"
      >
        {STATES.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={activeState === item.id}
            onClick={() => setDemoState(item.id)}
            className={cn(
              "rounded-md px-2 py-1.5 text-[11px] font-medium text-zinc-400 transition-colors hover:bg-white/[0.08] hover:text-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-lime-400",
              activeState === item.id && "bg-white/[0.08] text-white"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function SaveStatePillDemo() {
  return <SaveStatePill interactiveDemo />;
}

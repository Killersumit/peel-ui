"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface NextUpStep {
  id: string;
  title: string;
  description: string;
  actionLabel: string;
  duration?: string;
}

export interface NextUpProps extends React.HTMLAttributes<HTMLElement> {
  steps: NextUpStep[];
  title?: string;
  completedIds?: string[];
  defaultCompletedIds?: string[];
  onStepComplete?: (id: string) => void;
  doneMessage?: string;
  className?: string;
}

const RING_RADIUS = 18.5;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export const NextUp = React.forwardRef<HTMLElement, NextUpProps>(function NextUp(
  {
    steps,
    title = "Get started",
    completedIds: controlledCompletedIds,
    defaultCompletedIds = [],
    onStepComplete,
    doneMessage = "All done. You are set.",
    className,
    ...rest
  },
  ref
) {
  const isControlled = controlledCompletedIds !== undefined;
  const [uncontrolledCompleted, setUncontrolledCompleted] = React.useState<string[]>(
    () => defaultCompletedIds
  );

  const activeCompletedIds = React.useMemo(() => {
    return isControlled
      ? controlledCompletedIds ?? []
      : uncontrolledCompleted;
  }, [isControlled, controlledCompletedIds, uncontrolledCompleted]);

  const [completionOrder, setCompletionOrder] = React.useState<string[]>(() => {
    return isControlled ? (controlledCompletedIds ?? []) : defaultCompletedIds;
  });

  const [liveMessage, setLiveMessage] = React.useState<string>("");
  const titleId = React.useId();

  React.useEffect(() => {
    if (isControlled && controlledCompletedIds) {
      setCompletionOrder((prev) => {
        const next = prev.filter((id) => controlledCompletedIds.includes(id));
        for (const id of controlledCompletedIds) {
          if (!next.includes(id)) {
            next.push(id);
          }
        }
        return next;
      });
    }
  }, [isControlled, controlledCompletedIds]);

  const completedSet = React.useMemo(
    () => new Set(activeCompletedIds),
    [activeCompletedIds]
  );

  const totalCount = steps.length;
  const doneCount = steps.filter((s) => completedSet.has(s.id)).length;
  const allDone = totalCount > 0 && doneCount === totalCount;

  const currentStep = React.useMemo(
    () => steps.find((s) => !completedSet.has(s.id)),
    [steps, completedSet]
  );

  const laterSteps = React.useMemo(() => {
    if (!currentStep) return [];
    const currentIndex = steps.findIndex((s) => s.id === currentStep.id);
    return steps.slice(currentIndex + 1).filter((s) => !completedSet.has(s.id));
  }, [steps, currentStep, completedSet]);

  const finishedSteps = React.useMemo(() => {
    const finishedMap = new Map(steps.map((s) => [s.id, s]));
    return completionOrder
      .filter((id) => completedSet.has(id) && finishedMap.has(id))
      .map((id) => finishedMap.get(id)!);
  }, [steps, completionOrder, completedSet]);

  const handleComplete = (id: string) => {
    setCompletionOrder((prev) => (prev.includes(id) ? prev : [...prev, id]));
    if (!isControlled) {
      setUncontrolledCompleted((prev) => (prev.includes(id) ? prev : [...prev, id]));
    }

    const step = steps.find((s) => s.id === id);
    const nextDoneCount = completedSet.has(id) ? doneCount : doneCount + 1;
    if (step) {
      setLiveMessage(`${step.title} done. ${nextDoneCount} of ${totalCount} done.`);
    }

    onStepComplete?.(id);
  };

  const progressFraction = totalCount > 0 ? doneCount / totalCount : 0;
  const dashOffset = RING_CIRCUMFERENCE * (1 - progressFraction);

  return (
    <section
      ref={ref}
      aria-labelledby={titleId}
      className={cn(
        "w-full rounded-2xl border border-border bg-card p-3.5 sm:p-4 text-foreground",
        className
      )}
      {...rest}
    >
      <div className="flex items-center justify-between gap-3 pb-3">
        <div className="min-w-0">
          <h2
            id={titleId}
            className="text-[17px] font-semibold tracking-[-0.02em] text-foreground"
          >
            {title}
          </h2>
          <p className="mt-0.5 text-[13px] text-muted-foreground">
            {doneCount} of {totalCount} done
          </p>
        </div>

        <div className="relative flex size-[42px] shrink-0 items-center justify-center">
          <svg
            className="size-full -rotate-90"
            viewBox="0 0 42 42"
            aria-hidden="true"
          >
            <circle
              cx="21"
              cy="21"
              r={RING_RADIUS}
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
              className="text-border"
            />
            {doneCount > 0 && (
              <circle
                cx="21"
                cy="21"
                r={RING_RADIUS}
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeDasharray={RING_CIRCUMFERENCE}
                strokeDashoffset={dashOffset}
                className="text-primary"
              />
            )}
          </svg>
          <span className="absolute text-[11px] font-medium tabular-nums text-foreground">
            {doneCount}/{totalCount}
          </span>
        </div>
      </div>

      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {liveMessage}
      </div>

      {allDone ? (
        <p className="py-2.5 px-3 text-[13.5px] text-muted-foreground">
          {doneMessage}
        </p>
      ) : (
        <ol className="flex flex-col gap-1 list-none p-0 m-0">
          {currentStep && (
            <li
              key={currentStep.id}
              aria-current="step"
              className="rounded-xl bg-muted p-3 sm:p-3.5"
            >
              <div className="flex items-start gap-3">
                <div className="size-5 rounded-full border-2 border-primary shrink-0 mt-0.5 flex items-center justify-center">
                  <span className="sr-only">Next</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {currentStep.title}
                    </span>
                    {currentStep.duration && (
                      <span className="text-[12px] text-muted-foreground tabular-nums shrink-0">
                        {currentStep.duration}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-[13.5px] leading-normal text-muted-foreground max-w-[36ch]">
                    {currentStep.description}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleComplete(currentStep.id)}
                    className="mt-3 inline-flex items-center justify-center rounded-lg bg-primary px-3.5 py-2 text-[13.5px] font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:!outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-muted"
                  >
                    {currentStep.actionLabel}
                  </button>
                </div>
              </div>
            </li>
          )}

          {laterSteps.map((step) => (
            <li
              key={step.id}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5"
            >
              <div className="size-5 rounded-full border-2 border-border shrink-0 flex items-center justify-center">
                <span className="sr-only">Later</span>
              </div>
              <span className="text-sm font-medium text-foreground">
                {step.title}
              </span>
              {step.duration && (
                <span className="ml-auto text-[12px] text-muted-foreground tabular-nums shrink-0">
                  {step.duration}
                </span>
              )}
            </li>
          ))}

          {finishedSteps.map((step) => (
            <li
              key={step.id}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5"
            >
              <div className="size-5 rounded-full bg-primary shrink-0 flex items-center justify-center text-primary-foreground">
                <span className="sr-only">Done</span>
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-3"
                  aria-hidden="true"
                >
                  <path d="M3.5 8.5 6.5 11.5 12.5 4.5" />
                </svg>
              </div>
              <span className="text-sm font-normal text-muted-foreground line-through decoration-border">
                {step.title}
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
});
NextUp.displayName = "NextUp";

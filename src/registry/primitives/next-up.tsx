"use client";

import * as React from "react";
import * as ReactDOM from "react-dom";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(Flip);
}

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

  const rootRef = React.useRef<HTMLElement | null>(null);
  const listRef = React.useRef<HTMLOListElement | null>(null);
  const progressCircleRef = React.useRef<SVGCircleElement | null>(null);
  const isBusyRef = React.useRef(false);
  const activeTimelineRef = React.useRef<gsap.core.Timeline | null>(null);

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

  useGSAP(
    () => {
      return () => {
        activeTimelineRef.current?.kill();
      };
    },
    { scope: rootRef }
  );

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
    if (isBusyRef.current) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const applyState = () => {
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

    if (prefersReducedMotion || !listRef.current) {
      applyState();
      return;
    }

    isBusyRef.current = true;
    const isLastStep = doneCount + 1 === totalCount;

    const currentRow = listRef.current.querySelector<HTMLElement>(
      `[data-step-id="${id}"]`
    );
    const marker = currentRow?.querySelector<HTMLElement>("[data-marker]");
    const checkPath = marker?.querySelector<SVGPathElement>("path");
    const panel = currentRow?.querySelector<HTMLElement>("[data-panel]");

    const seq = gsap.timeline();
    activeTimelineRef.current = seq;

    if (marker && checkPath && panel && currentRow) {
      seq.to(
        marker,
        {
          backgroundColor: "var(--primary)",
          borderColor: "var(--primary)",
          duration: 0.2,
          ease: "power2.out",
        },
        0
      );
      seq.to(
        checkPath,
        {
          strokeDashoffset: 0,
          opacity: 1,
          duration: 0.2,
          ease: "power2.out",
        },
        0
      );
      seq.to(
        panel,
        {
          opacity: 0,
          duration: 0.2,
          ease: "power2.out",
        },
        0
      );
      seq.to(
        currentRow,
        {
          backgroundColor: "transparent",
          duration: 0.2,
          ease: "power2.out",
        },
        0
      );

      seq.to(currentRow, {
        opacity: 0,
        duration: 0.12,
        ease: "power2.out",
      });
    }

    seq.add(() => {
      const nextDoneCount = doneCount + 1;
      const nextProgressFraction = totalCount > 0 ? nextDoneCount / totalCount : 0;
      const nextDashOffset = RING_CIRCUMFERENCE * (1 - nextProgressFraction);

      if (progressCircleRef.current) {
        gsap.to(progressCircleRef.current, {
          strokeDashoffset: nextDashOffset,
          duration: 0.4,
          ease: "power2.out",
        });
      }

      if (isLastStep) {
        ReactDOM.flushSync(() => {
          applyState();
        });
        const doneMsgEl = rootRef.current?.querySelector<HTMLElement>("[data-done-message]");
        if (doneMsgEl) {
          gsap.fromTo(
            doneMsgEl,
            { opacity: 0 },
            {
              opacity: 1,
              duration: 0.2,
              ease: "power2.out",
              onComplete: () => {
                isBusyRef.current = false;
                activeTimelineRef.current = null;
              },
            }
          );
        } else {
          isBusyRef.current = false;
          activeTimelineRef.current = null;
        }
        return;
      }

      const otherRows = Array.from(
        listRef.current?.querySelectorAll<HTMLElement>("[data-step-id]") ?? []
      ).filter((el) => el.getAttribute("data-step-id") !== id);

      const flipState = Flip.getState(otherRows);

      ReactDOM.flushSync(() => {
        applyState();
      });

      const finishedRow = listRef.current?.querySelector<HTMLElement>(
        `[data-step-id="${id}"]`
      );
      if (finishedRow) {
        gsap.set(finishedRow, { opacity: 0 });
        gsap.to(finishedRow, {
          opacity: 1,
          duration: 0.2,
          ease: "power2.out",
        });
      }

      const nextPanel = listRef.current?.querySelector<HTMLElement>("[data-panel]");
      const nextRow = listRef.current?.querySelector<HTMLElement>('[aria-current="step"]');
      if (nextPanel) {
        gsap.set(nextPanel, { height: 0, opacity: 0, overflow: "hidden" });
      }
      if (nextRow) {
        gsap.set(nextRow, { backgroundColor: "transparent" });
      }

      Flip.from(flipState, {
        duration: 0.3,
        ease: "power2.out",
        scale: false,
        onComplete: () => {
          const openTl = gsap.timeline({
            onComplete: () => {
              isBusyRef.current = false;
              activeTimelineRef.current = null;
            },
          });
          activeTimelineRef.current = openTl;

          if (nextPanel) {
            openTl.fromTo(
              nextPanel,
              { height: 0, opacity: 0 },
              {
                height: "auto",
                opacity: 1,
                duration: 0.25,
                ease: "power2.out",
                clearProps: "overflow",
              },
              0
            );
          }
          if (nextRow) {
            openTl.to(
              nextRow,
              {
                backgroundColor: "var(--muted)",
                duration: 0.25,
                ease: "power2.out",
                clearProps: "backgroundColor",
              },
              0
            );
          }
        },
      });
    });
  };

  const progressFraction = totalCount > 0 ? doneCount / totalCount : 0;
  const dashOffset = RING_CIRCUMFERENCE * (1 - progressFraction);

  const setCombinedRefs = (node: HTMLElement | null) => {
    rootRef.current = node;
    if (typeof ref === "function") {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  };

  return (
    <section
      ref={setCombinedRefs}
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
                ref={progressCircleRef}
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
        <p data-done-message className="py-2.5 px-3 text-[13.5px] text-muted-foreground">
          {doneMessage}
        </p>
      ) : (
        <ol ref={listRef} className="flex flex-col gap-1 list-none p-0 m-0">
          {currentStep && (
            <li
              key={currentStep.id}
              data-step-id={currentStep.id}
              aria-current="step"
              className="rounded-xl bg-muted p-3 sm:p-3.5"
            >
              <div className="flex items-start gap-3">
                <div
                  data-marker
                  className="size-5 rounded-full border-2 border-primary shrink-0 mt-0.5 flex items-center justify-center"
                >
                  <span className="sr-only">Next</span>
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-3 text-primary-foreground"
                    aria-hidden="true"
                  >
                    <path
                      d="M3.5 8.5 6.5 11.5 12.5 4.5"
                      pathLength={1}
                      strokeDasharray={1}
                      strokeDashoffset={1}
                    />
                  </svg>
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
                  <div data-panel>
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
              </div>
            </li>
          )}

          {laterSteps.map((step) => (
            <li
              key={step.id}
              data-step-id={step.id}
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
              data-step-id={step.id}
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
                  <path
                    d="M3.5 8.5 6.5 11.5 12.5 4.5"
                    pathLength={1}
                    strokeDasharray={1}
                    strokeDashoffset={0}
                  />
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

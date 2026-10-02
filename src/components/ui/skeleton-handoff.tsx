"use client";

import * as React from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { cn } from "@/lib/utils";

type HandoffStatus = "loading" | "ready" | "error";
type HandoffPhase =
  | "pending"
  | "loading"
  | "handoff"
  | "refetch-pending"
  | "refetch"
  | "error"
  | "ready";
type BlockState = "idle" | "loading" | "error";

const BlockStateContext = React.createContext<BlockState>("idle");

interface HandoffProps {
  status: HandoffStatus;
  skeleton: React.ReactNode;
  children?: React.ReactNode;
  duration?: number;
  stagger?: number;
  skipBelow?: number;
  loadingLabel?: string;
  readyLabel?: string;
  errorLabel?: string;
  onHandoffStart?: () => void;
  onHandoffComplete?: () => void;
  className?: string;
}

interface HandoffBlockProps {
  id: string;
  className?: string;
  as?: React.ElementType;
}

interface HandoffTargetProps extends HandoffBlockProps {
  children: React.ReactNode;
}

function getInitialPhase(status: HandoffStatus): HandoffPhase {
  if (status === "loading") return "pending";
  if (status === "error") return "error";
  return "ready";
}

function firstById(
  elements: HTMLElement[],
  label: "block" | "target",
): Map<string, HTMLElement> {
  const result = new Map<string, HTMLElement>();

  for (const element of elements) {
    const id = element.dataset.handoffId;
    if (!id) continue;
    if (result.has(id)) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(`Handoff has duplicate ${label} id "${id}". The first match is used.`);
      }
      continue;
    }
    result.set(id, element);
  }

  return result;
}

function byTopPosition(elements: HTMLElement[]): HTMLElement[] {
  return [...elements].sort(
    (first, second) =>
      first.getBoundingClientRect().top - second.getBoundingClientRect().top,
  );
}

export const HandoffBlock = ({
  id,
  className,
  as: Component = "div",
}: HandoffBlockProps) => {
  const state = React.useContext(BlockStateContext);

  return React.createElement(
    Component,
    {
      "data-handoff-id": id,
      className: cn(
        "bg-[var(--peel-surface-active,#1e2129)]",
        state === "loading" && "sh-pulse",
        state === "error" && "[outline:1px_solid_var(--peel-coral,#ff553e)]",
        className,
      ),
    },
  );
};

export const HandoffTarget = ({
  id,
  className,
  as: Component = "div",
  children,
}: HandoffTargetProps) =>
  React.createElement(
    Component,
    {
      "data-handoff-id": id,
      className,
    },
    children,
  );

export const Handoff = React.forwardRef<HTMLDivElement, HandoffProps>(
  function Handoff(
    {
      status,
      skeleton,
      children,
      duration = 0.6,
      stagger = 0.04,
      skipBelow = 150,
      loadingLabel = "Loading",
      readyLabel = "Loaded",
      errorLabel = "Failed to load",
      onHandoffStart,
      onHandoffComplete,
      className,
    },
    forwardedRef,
  ) {
    const rootRef = React.useRef<HTMLDivElement>(null);
    const skeletonRef = React.useRef<HTMLDivElement>(null);
    const contentRef = React.useRef<HTMLDivElement>(null);
    const lastStatusRef = React.useRef(status);
    const lastAnnouncementStatusRef = React.useRef(status);
    const loadStartedAtRef = React.useRef(0);
    const phaseRef = React.useRef<HandoffPhase>(getInitialPhase(status));
    const [phase, setPhase] = React.useState<HandoffPhase>(() =>
      getInitialPhase(status),
    );
    const [announcement, setAnnouncement] = React.useState(
      status === "loading" ? loadingLabel : "",
    );
    const statusRef = React.useRef(status);
    const onStartRef = React.useRef(onHandoffStart);
    const onCompleteRef = React.useRef(onHandoffComplete);
    const updatePhase = React.useCallback((nextPhase: HandoffPhase) => {
      phaseRef.current = nextPhase;
      setPhase(nextPhase);
    }, []);

    React.useImperativeHandle(forwardedRef, () => rootRef.current!);

    React.useEffect(() => {
      const previousStatus = lastStatusRef.current;
      lastStatusRef.current = status;
      statusRef.current = status;
      let phaseTimer = 0;
      let thresholdTimer = 0;

      if (status === "loading") {
        if (previousStatus !== "loading") {
          loadStartedAtRef.current = Date.now();
        }
        const isRefetch = previousStatus === "ready";
        if (previousStatus !== "loading") {
          phaseTimer = window.setTimeout(
            () => updatePhase(isRefetch ? "refetch-pending" : "pending"),
            0,
          );
        } else if (loadStartedAtRef.current === 0) {
          loadStartedAtRef.current = Date.now();
        }

        const remaining = Math.max(
          0,
          skipBelow - (Date.now() - loadStartedAtRef.current),
        );
        thresholdTimer = window.setTimeout(() => {
          if (statusRef.current === "loading") {
            updatePhase(isRefetch ? "refetch" : "loading");
          }
        }, remaining);
        return () => {
          window.clearTimeout(phaseTimer);
          window.clearTimeout(thresholdTimer);
        };
      }

      if (status === "ready") {
        let nextPhase: HandoffPhase = "ready";
        if (previousStatus === "loading") {
          const elapsed = Date.now() - loadStartedAtRef.current;
          if (
            elapsed < skipBelow ||
            phaseRef.current === "pending" ||
            phaseRef.current === "refetch-pending"
          ) {
            nextPhase = "ready";
          } else if (phaseRef.current === "loading") {
            nextPhase = "handoff";
          }
        }
        phaseTimer = window.setTimeout(() => updatePhase(nextPhase), 0);
      } else {
        phaseTimer = window.setTimeout(() => updatePhase("error"), 0);
      }

      return () => window.clearTimeout(phaseTimer);
    }, [skipBelow, status, updatePhase]);

    React.useEffect(() => {
      const previousStatus = lastAnnouncementStatusRef.current;
      lastAnnouncementStatusRef.current = status;

      const timer = window.setTimeout(() => {
        if (status === "loading") {
          setAnnouncement(loadingLabel);
        } else if (status === "ready" && previousStatus !== "ready") {
          setAnnouncement(readyLabel);
        } else {
          setAnnouncement("");
        }
      }, 0);
      return () => window.clearTimeout(timer);
    }, [loadingLabel, readyLabel, status]);

    React.useEffect(() => {
      onStartRef.current = onHandoffStart;
      onCompleteRef.current = onHandoffComplete;
    }, [onHandoffComplete, onHandoffStart]);

    const renderedPhase: HandoffPhase =
      status === "error"
        ? "error"
        : status === "ready"
          ? phase === "loading"
            ? "handoff"
            : phase === "pending" ||
                phase === "refetch-pending" ||
                phase === "error" ||
                phase === "refetch"
              ? "ready"
              : phase
          : phase === "ready"
            ? "refetch-pending"
            : phase === "error"
              ? "pending"
            : phase;

    useGSAP(
      () => {
        const root = rootRef.current;
        if (!root) return;

        gsap.registerPlugin(Flip);
        const media = gsap.matchMedia(rootRef);

        const finish = () => {
          root.style.removeProperty("height");
          updatePhase("ready");
          onCompleteRef.current?.();
        };

        const runHandoff = (reducedMotion: boolean) => {
          const skeletonLayer = skeletonRef.current;
          const contentLayer = contentRef.current;
          if (!skeletonLayer || !contentLayer) return;

          const blockMap = firstById(
            Array.from(
              skeletonLayer.querySelectorAll<HTMLElement>("[data-handoff-id]"),
            ),
            "block",
          );
          const targetMap = firstById(
            Array.from(
              contentLayer.querySelectorAll<HTMLElement>("[data-handoff-id]"),
            ),
            "target",
          );
          const orderedBlocks = byTopPosition([...blockMap.values()]);
          const orderedUnmatchedTargets = byTopPosition(
            [...targetMap.entries()]
              .filter(([id]) => !blockMap.has(id))
              .map(([, target]) => target),
          );
          const finalHeight = contentLayer.scrollHeight;
          const totalDuration = reducedMotion
            ? 0.15
            : duration +
              Math.max(
                0,
                orderedBlocks.length - 1,
                orderedUnmatchedTargets.length - 1,
              ) *
                stagger;
          let completed = false;
          const complete = () => {
            if (completed) return;
            completed = true;
            if (statusRef.current !== "ready") return;
            finish();
          };

          gsap.set(contentLayer, { visibility: "visible" });
          gsap.set([...targetMap.values()], { opacity: 0 });

          if (reducedMotion) {
            onStartRef.current?.();
            gsap.set(root, { height: finalHeight });
            gsap.to(skeletonLayer, {
              opacity: 0,
              duration: 0.15,
              onComplete: complete,
            });
            gsap.to([...targetMap.values()], {
              opacity: 1,
              duration: 0.15,
            });
            return;
          }

          onStartRef.current?.();
          // Ease the reserved skeleton height to the measured content height once per handoff.
          gsap.to(root, {
            height: finalHeight,
            duration: totalDuration,
            ease: "power2.inOut",
          });

          orderedBlocks.forEach((block, index) => {
            const id = block.dataset.handoffId;
            const target = id ? targetMap.get(id) : undefined;
            const delay = index * stagger;
            if (!target) {
              gsap.to(block, {
                height: 0,
                minHeight: 0,
                marginTop: 0,
                marginBottom: 0,
                paddingTop: 0,
                paddingBottom: 0,
                opacity: 0,
                overflow: "hidden",
                duration,
                delay,
                ease: "power2.inOut",
              });
              return;
            }

            Flip.fit(block, target, {
              scale: true,
              duration,
              delay,
              ease: "power2.inOut",
            });
            const revealDelay = delay + (duration * 2) / 3;
            const revealDuration = duration / 3;
            gsap.to(block, {
              opacity: 0,
              duration: revealDuration,
              delay: revealDelay,
              ease: "power2.out",
            });
            gsap.to(target, {
              opacity: 1,
              duration: revealDuration,
              delay: revealDelay,
              ease: "power2.out",
            });
          });

          orderedUnmatchedTargets.forEach((target, index) => {
            gsap.set(target, reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 });
            gsap.to(target, {
              opacity: 1,
              ...(reducedMotion ? {} : { y: 0 }),
              duration: reducedMotion ? 0.15 : duration / 3,
              delay: reducedMotion ? 0 : index * stagger,
              ease: "power2.out",
            });
          });

          gsap.delayedCall(totalDuration, complete);
        };

        const runRefetch = (reducedMotion: boolean) => {
          const skeletonLayer = skeletonRef.current;
          const contentLayer = contentRef.current;
          if (!skeletonLayer || !contentLayer) return;

          const totalHeight = skeletonLayer.scrollHeight;
          const fadeDuration = reducedMotion ? 0.15 : 0.2;
          gsap.set(skeletonLayer, { opacity: 0 });
          if (reducedMotion) {
            gsap.set(root, { height: totalHeight });
          } else {
            gsap.to(root, {
              height: totalHeight,
              duration: fadeDuration,
              ease: "power2.out",
            });
          }
          gsap.to(skeletonLayer, { opacity: 1, duration: fadeDuration });
          gsap.to(contentLayer, {
            opacity: 0,
            duration: fadeDuration,
            onComplete: () => {
              if (statusRef.current !== "loading") return;
              root.style.removeProperty("height");
              updatePhase("loading");
            },
          });
        };

        if (renderedPhase === "handoff") {
          media.add("(prefers-reduced-motion: reduce)", () => {
            runHandoff(true);
          });
          media.add("(prefers-reduced-motion: no-preference)", () => {
            runHandoff(false);
          });
        } else if (renderedPhase === "refetch") {
          media.add("(prefers-reduced-motion: reduce)", () => {
            runRefetch(true);
          });
          media.add("(prefers-reduced-motion: no-preference)", () => {
            runRefetch(false);
          });
        }

        return () => media.revert();
      },
      {
        scope: rootRef,
        dependencies: [duration, renderedPhase, stagger],
        revertOnUpdate: true,
      },
    );

    const blockState: BlockState =
      renderedPhase === "error"
        ? "error"
        : renderedPhase === "loading"
          ? "loading"
          : "idle";
    const showSkeleton =
      renderedPhase === "pending" ||
      renderedPhase === "loading" ||
      renderedPhase === "handoff" ||
      renderedPhase === "error" ||
      renderedPhase === "refetch";

    const skeletonLayer = showSkeleton ? (
      <div
        ref={skeletonRef}
        aria-hidden="true"
        className={cn(
          "w-full",
          renderedPhase === "handoff" && "relative",
          renderedPhase === "refetch" && "absolute inset-0",
          renderedPhase === "pending" && "invisible",
          renderedPhase === "refetch" && "opacity-0",
        )}
      >
        <BlockStateContext.Provider value={blockState}>
          {skeleton}
        </BlockStateContext.Provider>
      </div>
    ) : null;

    return (
      <div
        ref={rootRef}
        className={cn("relative", className)}
        aria-busy={status === "loading"}
      >
        <style>{`
          @keyframes skeleton-handoff-pulse {
            0%, 100% { opacity: 0.55; }
            50% { opacity: 0.8; }
          }
          .sh-pulse {
            animation: skeleton-handoff-pulse 1.8s ease-in-out infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .sh-pulse { animation: none !important; }
          }
        `}</style>
        <span className="sr-only" role="status" aria-live="polite">
          {announcement}
        </span>
        {(renderedPhase === "ready" ||
          renderedPhase === "refetch-pending") &&
          children}
        {(renderedPhase === "pending" ||
          renderedPhase === "loading" ||
          renderedPhase === "error" ||
          renderedPhase === "handoff" ||
          renderedPhase === "refetch") &&
          skeletonLayer}
        {renderedPhase === "handoff" && (
          <div
            ref={contentRef}
            className="invisible absolute inset-0 w-full"
          >
            {children}
          </div>
        )}
        {renderedPhase === "refetch" && (
          <div ref={contentRef} className="relative w-full">
            {children}
          </div>
        )}
        {renderedPhase === "error" && (
          <div role="alert" className="mt-2 text-sm text-[var(--peel-coral,#ff553e)]">
            {errorLabel}
          </div>
        )}
      </div>
    );
  },
);

Handoff.displayName = "Handoff";

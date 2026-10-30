"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { Maximize2, Minimize2, X } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { LineGutter } from "./line-gutter";
import { useNoteContext } from "./note-root";

gsap.registerPlugin(useGSAP);

const subscribeToNothing = () => () => {};
const getClientMountedSnapshot = () => true;
const getServerMountedSnapshot = () => false;

function getFourCornerRadius(trigger: HTMLElement) {
  const rectangle = trigger.getBoundingClientRect();
  const computedRadius = window.getComputedStyle(trigger).borderRadius;
  const values = computedRadius.split("/")[0].trim().split(/\s+/);
  const fourValues =
    values.length === 1
      ? [values[0], values[0], values[0], values[0]]
      : values.length === 2
        ? [values[0], values[1], values[0], values[1]]
        : values.length === 3
          ? [values[0], values[1], values[2], values[1]]
          : values.slice(0, 4);

  return fourValues
    .map((value) => {
      const amount = Number.parseFloat(value);
      const pixels = value.endsWith("%")
        ? (Math.min(rectangle.width, rectangle.height) * amount) / 100
        : amount;
      return `${Math.min(Math.max(0, pixels), Math.min(rectangle.width, rectangle.height) / 2)}px`;
    })
    .join(" ");
}

function getTargetBounds(
  trigger: HTMLElement,
  width: number,
  height: number,
  placement: ReturnType<typeof useNoteContext>["placement"]
) {
  const rect = trigger.getBoundingClientRect();
  const scaleX = (gsap.getProperty(trigger, "scaleX") as number) || 1;
  const scaleY = (gsap.getProperty(trigger, "scaleY") as number) || 1;
  const unscaledWidth = scaleX !== 0 ? rect.width / scaleX : rect.width;
  const unscaledHeight = scaleY !== 0 ? rect.height / scaleY : rect.height;
  const triggerRect = {
    left: rect.left - (unscaledWidth - rect.width) / 2,
    top: rect.top - (unscaledHeight - rect.height) / 2,
    right: rect.left - (unscaledWidth - rect.width) / 2 + unscaledWidth,
    bottom: rect.top - (unscaledHeight - rect.height) / 2 + unscaledHeight,
    width: unscaledWidth,
    height: unscaledHeight,
  };
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const targetWidth = Math.max(1, Math.min(width, viewportWidth - 48));
  const targetHeight = Math.max(1, Math.min(height, viewportHeight - 72));
  const autoRight =
    triggerRect.left + triggerRect.width / 2 >= viewportWidth / 2;
  const autoBottom =
    triggerRect.top + triggerRect.height / 2 >= viewportHeight / 2;
  const right = placement === "auto" ? autoRight : placement.endsWith("right");
  const bottom =
    placement === "auto" ? autoBottom : placement.startsWith("bottom");
  const targetLeft = right
    ? triggerRect.right - targetWidth
    : triggerRect.left;
  const targetTop = bottom
    ? triggerRect.bottom - targetHeight
    : triggerRect.top;

  return {
    left: Math.max(16, Math.min(targetLeft, viewportWidth - targetWidth - 16)),
    top: Math.max(16, Math.min(targetTop, viewportHeight - targetHeight - 16)),
    width: targetWidth,
    height: targetHeight,
    borderRadius: "22px 22px 22px 22px",
  };
}

export function NotePanel() {
  const {
    open,
    requestClose,
    value,
    setValue,
    width,
    height,
    breakpoint,
    placement,
    showLineNumbers,
    panelId,
    triggerRef,
  } = useNoteContext();
  const panelRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const scrimRef = React.useRef<HTMLDivElement>(null);
  const timelineRef = React.useRef<gsap.core.Timeline | null>(null);
  const isReducedMotionRef = React.useRef(
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false
  );
  const targetBoundsRef = React.useRef<{
    left: number;
    top: number;
    width: number;
    height: number;
    borderRadius: string;
  } | null>(null);
  const fullscreenRef = React.useRef(false);
  const hasOpenedRef = React.useRef(false);
  const isCurrentlyOpenRef = React.useRef(false);
  const fullscreenHandlerRef = React.useRef<() => void>(() => {});
  const removeViewportListenersRef = React.useRef<(() => void) | null>(null);
  const mounted = React.useSyncExternalStore(
    subscribeToNothing,
    getClientMountedSnapshot,
    getServerMountedSnapshot
  );
  const [isMobile, setIsMobile] = React.useState(
    () => typeof window !== "undefined" && window.innerWidth < breakpoint
  );
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  React.useEffect(() => {
    const updateViewportMode = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };
    window.addEventListener("resize", updateViewportMode);
    return () => window.removeEventListener("resize", updateViewportMode);
  }, [breakpoint]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia(panelRef);

      mm.add(
        {
          reduceMotion: "(prefers-reduced-motion: reduce)",
          noPreference: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const { reduceMotion } = context.conditions as {
            reduceMotion: boolean;
            noPreference: boolean;
          };
          isReducedMotionRef.current = reduceMotion;

          if (isCurrentlyOpenRef.current && panelRef.current) {
            const panel = panelRef.current;
            const trigger = triggerRef.current;
            timelineRef.current?.kill();

            if (reduceMotion) {
              if (isMobile) {
                gsap.set(panel, {
                  position: "fixed",
                  top: "auto",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  width: "100%",
                  height: fullscreenRef.current
                    ? "calc(100dvh - max(12px, env(safe-area-inset-top, 0px) + 8px))"
                    : "60dvh",
                  maxHeight: "calc(100dvh - 16px)",
                  borderRadius: fullscreenRef.current
                    ? "22px 22px 0px 0px"
                    : "26px 26px 0px 0px",
                  yPercent: 0,
                  opacity: 1,
                });
                if (scrimRef.current) gsap.set(scrimRef.current, { autoAlpha: 1 });
              } else if (trigger) {
                const target = fullscreenRef.current
                  ? {
                      left: 16,
                      top: 16,
                      width: window.innerWidth - 32,
                      height: window.innerHeight - 32,
                      borderRadius: "22px 22px 22px 22px",
                    }
                  : (targetBoundsRef.current ?? getTargetBounds(trigger, width, height, placement));

                gsap.set(panel, {
                  position: "fixed",
                  ...target,
                  yPercent: 0,
                  opacity: 1,
                });
                gsap.set(trigger, { opacity: 0, scale: 1 });
              }
              if (contentRef.current) {
                gsap.set(contentRef.current, { opacity: 1, y: 0 });
              }
            } else {
              if (isMobile) {
                gsap.set(panel, {
                  position: "fixed",
                  top: "auto",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  width: "100%",
                  height: fullscreenRef.current
                    ? "calc(100dvh - max(12px, env(safe-area-inset-top, 0px) + 8px))"
                    : "60dvh",
                  maxHeight: "calc(100dvh - 16px)",
                  borderRadius: fullscreenRef.current
                    ? "22px 22px 0px 0px"
                    : "26px 26px 0px 0px",
                  yPercent: 0,
                  opacity: 1,
                });
                if (scrimRef.current) gsap.set(scrimRef.current, { autoAlpha: 1 });
              } else if (trigger) {
                const target = fullscreenRef.current
                  ? {
                      left: 16,
                      top: 16,
                      width: window.innerWidth - 32,
                      height: window.innerHeight - 32,
                      borderRadius: "22px 22px 22px 22px",
                    }
                  : (targetBoundsRef.current ?? getTargetBounds(trigger, width, height, placement));

                gsap.set(panel, {
                  position: "fixed",
                  ...target,
                  yPercent: 0,
                  opacity: 1,
                });
                gsap.set(trigger, { opacity: 0, scale: 0.7 });
              }
              if (contentRef.current) {
                gsap.set(contentRef.current, { opacity: 1, y: 0 });
              }
            }
          }
        }
      );

      return () => {
        mm.revert();
      };
    },
    { scope: panelRef }
  );

  useGSAP(
    (_, contextSafe) => {
      if (!mounted) return;
      const makeContextSafe =
        contextSafe ?? ((callback: () => void) => callback);

      const panel = panelRef.current;
      const trigger = triggerRef.current;
      if (!panel || !trigger) return;

      timelineRef.current?.kill();
      removeViewportListenersRef.current?.();
      removeViewportListenersRef.current = null;

      const reduceMotion = isReducedMotionRef.current;

          const safeToggleFullscreen = makeContextSafe(() => {
            if (!open) return;
            timelineRef.current?.kill();
            const nextFullscreen = !fullscreenRef.current;
            fullscreenRef.current = nextFullscreen;
            setIsFullscreen(nextFullscreen);

            if (reduceMotion) {
              if (isMobile) {
                const viewportHeight =
                  window.visualViewport?.height ?? window.innerHeight;
                gsap.set(panel, {
                  height: nextFullscreen
                    ? "calc(100dvh - max(12px, env(safe-area-inset-top, 0px) + 8px))"
                    : "60dvh",
                  maxHeight: `${Math.max(160, viewportHeight - 16)}px`,
                  bottom: 0,
                  borderRadius: nextFullscreen
                    ? "22px 22px 0px 0px"
                    : "26px 26px 0px 0px",
                });
                return;
              }

              const target = nextFullscreen
                ? {
                    left: 16,
                    top: 16,
                    width: window.innerWidth - 32,
                    height: window.innerHeight - 32,
                    borderRadius: "22px 22px 22px 22px",
                  }
                : getTargetBounds(trigger, width, height, placement);

              gsap.set(panel, {
                ...target,
              });
              return;
            }

            if (isMobile) {
              const viewportHeight =
                window.visualViewport?.height ?? window.innerHeight;
              gsap.to(panel, {
                height: nextFullscreen
                  ? "calc(100dvh - max(12px, env(safe-area-inset-top, 0px) + 8px))"
                  : "60dvh",
                maxHeight: `${Math.max(160, viewportHeight - 16)}px`,
                bottom: 0,
                borderRadius: nextFullscreen
                  ? "22px 22px 0px 0px"
                  : "26px 26px 0px 0px",
                duration: 0.65,
                ease: "expo.inOut",
                overwrite: "auto",
              });
              return;
            }

            const target = nextFullscreen
              ? {
                  left: 16,
                  top: 16,
                  width: window.innerWidth - 32,
                  height: window.innerHeight - 32,
                  borderRadius: "22px 22px 22px 22px",
                }
              : getTargetBounds(trigger, width, height, placement);

            gsap.to(panel, {
              ...target,
              duration: 0.65,
              ease: "expo.inOut",
              overwrite: "auto",
            });
          });
          fullscreenHandlerRef.current = safeToggleFullscreen;

          const safeViewportUpdate = makeContextSafe(() => {
            if (!open || !isMobile) return;
            const viewport = window.visualViewport;
            const keyboardHeight = viewport
              ? Math.max(
                  0,
                  window.innerHeight - viewport.height - viewport.offsetTop
                )
              : 0;
            const availableHeight = viewport
              ? Math.max(160, viewport.height - 16)
              : Math.max(160, window.innerHeight - 16);

            if (reduceMotion) {
              gsap.set(panel, {
                bottom: keyboardHeight,
                maxHeight: `${availableHeight}px`,
              });
              return;
            }

            gsap.to(panel, {
              bottom: keyboardHeight,
              maxHeight: `${availableHeight}px`,
              duration: 0.25,
              ease: "power2.out",
              overwrite: "auto",
            });
          });

          if (open) {
            const wasVisible =
              panel.style.visibility === "visible" ||
              isCurrentlyOpenRef.current;
            panel.style.visibility = "visible";
            panel.style.pointerEvents = "auto";
            isCurrentlyOpenRef.current = true;

            if (reduceMotion) {
              timelineRef.current?.kill();

              if (isMobile) {
                gsap.set(panel, {
                  position: "fixed",
                  top: "auto",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  width: "100%",
                  height: fullscreenRef.current
                    ? "calc(100dvh - max(12px, env(safe-area-inset-top, 0px) + 8px))"
                    : "60dvh",
                  maxHeight: "calc(100dvh - 16px)",
                  borderRadius: fullscreenRef.current
                    ? "22px 22px 0px 0px"
                    : "26px 26px 0px 0px",
                  yPercent: 0,
                });
                if (scrimRef.current) gsap.to(scrimRef.current, { autoAlpha: 1, duration: wasVisible ? 0 : 0.08 });
                if (contentRef.current) gsap.set(contentRef.current, { opacity: 1, y: 0 });
              } else {
                const target = fullscreenRef.current
                  ? {
                      left: 16,
                      top: 16,
                      width: window.innerWidth - 32,
                      height: window.innerHeight - 32,
                      borderRadius: "22px 22px 22px 22px",
                    }
                  : getTargetBounds(trigger, width, height, placement);
                targetBoundsRef.current = target;

                gsap.set(panel, {
                  position: "fixed",
                  ...target,
                  yPercent: 0,
                });
                gsap.set(trigger, { opacity: 0, scale: 1 });
                if (contentRef.current) {
                  gsap.set(contentRef.current, { opacity: 1, y: 0 });
                }
              }

              const timeline = gsap.timeline({
                onComplete: () => {
                  if (open) textareaRef.current?.focus({ preventScroll: true });
                },
              });
              timelineRef.current = timeline;
              timeline.fromTo(
                panel,
                { opacity: wasVisible ? 1 : 0 },
                { opacity: 1, duration: wasVisible ? 0 : 0.08 }
              );

              hasOpenedRef.current = true;
            } else {
              const timeline = gsap.timeline();
              timelineRef.current = timeline;

              if (isMobile) {
                gsap.set(panel, {
                  position: "fixed",
                  top: "auto",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  width: "100%",
                  height: fullscreenRef.current
                    ? "calc(100dvh - max(12px, env(safe-area-inset-top, 0px) + 8px))"
                    : "60dvh",
                  maxHeight: "calc(100dvh - 16px)",
                  borderRadius: fullscreenRef.current
                    ? "22px 22px 0px 0px"
                    : "26px 26px 0px 0px",
                  ...(wasVisible ? {} : { yPercent: 100 }),
                });
                gsap.set(scrimRef.current, { autoAlpha: wasVisible ? 1 : 0 });
                if (!wasVisible) {
                  timeline.to(scrimRef.current, {
                    autoAlpha: 1,
                    duration: 0.4,
                    ease: "power2.out",
                  });
                }
                timeline.to(
                  panel,
                  { yPercent: 0, duration: 0.65, ease: "expo.out" },
                  0
                );
                if (contentRef.current) {
                  timeline.to(
                    contentRef.current,
                    { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" },
                    wasVisible ? 0 : 0.22
                  );
                }
              } else {
                const triggerRect = trigger.getBoundingClientRect();
                if (!wasVisible) {
                  gsap.set(panel, {
                    position: "fixed",
                    left: triggerRect.left,
                    top: triggerRect.top,
                    width: triggerRect.width,
                    height: triggerRect.height,
                    borderRadius: getFourCornerRadius(trigger),
                    yPercent: 0,
                  });
                  gsap.set(trigger, {
                    opacity: 1,
                    scale: 1,
                    transformOrigin: "center",
                  });
                  if (contentRef.current) {
                    gsap.set(contentRef.current, { opacity: 0, y: 10 });
                  }
                  timeline.to(
                    trigger,
                    {
                      opacity: 0,
                      scale: 0.7,
                      duration: 0.2,
                      ease: "power2.in",
                    },
                    0
                  );
                } else {
                  gsap.set(trigger, { opacity: 0, scale: 0.7 });
                  const currentRect = panel.getBoundingClientRect();
                  gsap.set(panel, {
                    left: currentRect.left,
                    top: currentRect.top,
                    width: currentRect.width,
                    height: currentRect.height,
                    yPercent: 0,
                  });
                }

                const target = fullscreenRef.current
                  ? {
                      left: 16,
                      top: 16,
                      width: window.innerWidth - 32,
                      height: window.innerHeight - 32,
                      borderRadius: "22px 22px 22px 22px",
                    }
                  : getTargetBounds(trigger, width, height, placement);
                targetBoundsRef.current = target;

                timeline.to(
                  panel,
                  {
                    ...target,
                    duration: 0.75,
                    ease: "expo.inOut",
                    overwrite: "auto",
                  },
                  0
                );
                if (contentRef.current) {
                  timeline.to(
                    contentRef.current,
                    { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
                    wasVisible ? 0 : 0.34
                  );
                }
              }

              timeline.eventCallback("onComplete", () => {
                if (open) textareaRef.current?.focus({ preventScroll: true });
              });
              hasOpenedRef.current = true;
            }
          } else if (hasOpenedRef.current) {
            isCurrentlyOpenRef.current = false;
            targetBoundsRef.current = null;
            if (reduceMotion) {
              timelineRef.current?.kill();
              const timeline = gsap.timeline({
                onComplete: () => {
                  panel.style.visibility = "hidden";
                  panel.style.pointerEvents = "none";
                  fullscreenRef.current = false;
                  setIsFullscreen(false);
                  trigger.focus({ preventScroll: true });
                },
              });
              timelineRef.current = timeline;

              if (scrimRef.current) {
                timeline.to(scrimRef.current, { autoAlpha: 0, duration: 0.08 }, 0);
              }
              if (contentRef.current) {
                timeline.to(contentRef.current, { opacity: 0, duration: 0.08 }, 0);
              }
              timeline.to(panel, { opacity: 0, duration: 0.08 }, 0);
              if (!isMobile) {
                timeline.fromTo(
                  trigger,
                  { opacity: 0, scale: 1 },
                  { opacity: 1, scale: 1, duration: 0.08 },
                  0
                );
              }
            } else {
              const timeline = gsap.timeline({
                onComplete: () => {
                  panel.style.visibility = "hidden";
                  panel.style.pointerEvents = "none";
                  fullscreenRef.current = false;
                  setIsFullscreen(false);
                  trigger.focus({ preventScroll: true });
                },
              });
              timelineRef.current = timeline;

              if (isMobile) {
                if (contentRef.current) {
                  timeline.to(
                    contentRef.current,
                    { opacity: 0, y: 6, duration: 0.18, ease: "power2.in" },
                    0
                  );
                }
                timeline.to(
                  panel,
                  { yPercent: 100, duration: 0.65, ease: "expo.in" },
                  0.06
                );
                timeline.to(
                  scrimRef.current,
                  { autoAlpha: 0, duration: 0.4, ease: "power2.in" },
                  0
                );
              } else {
                gsap.set(trigger, { scale: 1, transformOrigin: "center" });
                const triggerRect = trigger.getBoundingClientRect();
                const triggerRadius = getFourCornerRadius(trigger);
                if (contentRef.current) {
                  timeline.to(
                    contentRef.current,
                    { opacity: 0, y: 6, duration: 0.18, ease: "power2.in" },
                    0
                  );
                }
                timeline.to(
                  panel,
                  {
                    left: triggerRect.left,
                    top: triggerRect.top,
                    width: triggerRect.width,
                    height: triggerRect.height,
                    borderRadius: triggerRadius,
                    duration: 0.65,
                    ease: "expo.inOut",
                    overwrite: "auto",
                  },
                  0.06
                );
                timeline.fromTo(
                  trigger,
                  { opacity: 0, scale: 0.7, transformOrigin: "center" },
                  {
                    opacity: 1,
                    scale: 1,
                    duration: 0.4,
                    ease: "back.out(2)",
                  },
                  0.5
                );
              }
            }
          }

          const viewport = window.visualViewport;
          if (open && isMobile && viewport) {
            viewport.addEventListener("resize", safeViewportUpdate);
            viewport.addEventListener("scroll", safeViewportUpdate);
            removeViewportListenersRef.current = () => {
              viewport.removeEventListener("resize", safeViewportUpdate);
              viewport.removeEventListener("scroll", safeViewportUpdate);
            };
            safeViewportUpdate();
          }

          return () => {
            timelineRef.current?.kill();
            removeViewportListenersRef.current?.();
            removeViewportListenersRef.current = null;
          };
        },
        {
          scope: panelRef,
          dependencies: [mounted, open, isMobile, width, height, placement],
        }
      );

      React.useEffect(
        () => () => {
          timelineRef.current?.kill();
          removeViewportListenersRef.current?.();
          removeViewportListenersRef.current = null;
        },
        []
      );

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      requestClose();
      return;
    }
    if (event.key !== "Tab" || !panelRef.current) return;

    const focusable = panelRef.current.querySelectorAll<HTMLElement>(
      'button:not([disabled]), textarea:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  if (!mounted) return null;

  return createPortal(
    <>
      <div
        ref={scrimRef}
        aria-hidden="true"
        onClick={requestClose}
        className="fixed inset-0 z-[9998] bg-black/[0.28]"
        style={{
          opacity: 0,
          visibility: "hidden",
          pointerEvents: open && isMobile ? "auto" : "none",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
        }}
      />
      <div
        ref={panelRef}
        id={panelId}
        role="dialog"
        aria-label="Notes"
        aria-modal={open || undefined}
        aria-hidden={!open}
        onKeyDown={handleKeyDown}
        className="fixed z-[9999] box-border flex min-h-0 flex-col overflow-hidden border-[3px] border-black bg-[#1f1f21] text-[#e8e8ea] shadow-[0_0_0_1px_rgba(255,255,255,0.14),0_22px_50px_-14px_rgba(0,0,0,0.5)]"
        style={{
          left: 0,
          top: 0,
          width: 0,
          height: 0,
          borderRadius: "22px 22px 22px 22px",
          visibility: "hidden",
          pointerEvents: "none",
          boxSizing: "border-box",
          opacity: 1,
        }}
      >
        <div
          ref={contentRef}
          className="flex min-h-0 flex-1 flex-col"
          style={{ opacity: 0, transform: "translateY(10px)" }}
        >
          <div className="relative flex min-h-0 flex-1 overflow-hidden">
            <LineGutter
              textareaRef={textareaRef}
              value={value}
              showLineNumbers={showLineNumbers}
            />
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(event) => setValue(event.currentTarget.value)}
              aria-label="Note text"
              placeholder="Write a note..."
              spellCheck
              className="note-button-editor relative z-0 min-h-0 min-w-0 flex-1 resize-none overflow-y-auto bg-transparent px-3 py-3 font-mono text-[13px] leading-[22px] text-[#e8e8ea] caret-[#84ff00] outline-none placeholder:text-zinc-600 selection:bg-[#84ff00]/30 selection:text-white"
              style={{
                scrollbarWidth: "none",
                overflowWrap: "anywhere",
                whiteSpace: "pre-wrap",
                wordBreak: "normal",
                tabSize: 2,
              }}
            />
            <style>{`
              .note-button-editor::-webkit-scrollbar { display: none; }
            `}</style>
          </div>
        </div>

        <div className="absolute right-0 top-0 flex h-11 items-center gap-1 rounded-bl-xl bg-black pl-2 pr-1">
          <button
            type="button"
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            aria-pressed={isFullscreen}
            onClick={() => fullscreenHandlerRef.current()}
            className="inline-flex size-10 items-center justify-center rounded-lg text-[#c4c4cc] transition-colors motion-reduce:transition-none hover:bg-white/[0.12] hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#84ff00] sm:size-[30px]"
          >
            {isFullscreen ? (
              <Minimize2 aria-hidden="true" className="size-3.5" />
            ) : (
              <Maximize2 aria-hidden="true" className="size-3.5" />
            )}
          </button>
          <button
            type="button"
            aria-label="Close notes"
            onClick={requestClose}
            className="inline-flex size-10 items-center justify-center rounded-lg text-[#c4c4cc] transition-colors motion-reduce:transition-none hover:bg-white/[0.12] hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#84ff00] sm:size-[30px]"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        </div>
      </div>
    </>,
    document.body
  );
}

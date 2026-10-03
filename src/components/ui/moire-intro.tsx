"use client";

import * as React from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

export interface MoireIntroProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  progress?: number;
  duration?: number;
  onComplete?: () => void;
  label?: string;
  position?: "fixed" | "absolute";
  lockScroll?: boolean;
  pitch?: number;
  thickness?: number;
  angle?: number;
  colorA?: string;
  colorB?: string;
  background?: string;
  className?: string;
}

export const MoireIntro = React.forwardRef<HTMLDivElement, MoireIntroProps>(
  function MoireIntro(
    {
      open = true,
      progress: controlledProgress,
      duration = 3.2,
      onComplete,
      label,
      position = "fixed",
      lockScroll = true,
      pitch = 9,
      thickness = 0.4,
      angle = -24,
      colorA,
      colorB,
      background,
      className,
      ...props
    },
    forwardedRef
  ) {
    const rootRef = React.useRef<HTMLDivElement | null>(null);
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
    const counterRef = React.useRef<HTMLDivElement | null>(null);
    const plateRef = React.useRef<HTMLDivElement | null>(null);
    const labelRef = React.useRef<HTMLDivElement | null>(null);
    const overlayRef = React.useRef<HTMLDivElement | null>(null);

    const [mounted, setMounted] = React.useState(false);
    const [isComplete, setIsComplete] = React.useState(false);
    const [ariaProgress, setAriaProgress] = React.useState(0);
    const [statusText, setStatusText] = React.useState("Loading");

    const [computedTheme, setComputedTheme] = React.useState({
      text: "#f5f5f7",
      lime: "#84ff00",
      bg: "#08090a",
    });

    React.useImperativeHandle(
      forwardedRef,
      () => rootRef.current as HTMLDivElement
    );

    React.useEffect(() => {
      setMounted(true);
      if (rootRef.current) {
        const styles = window.getComputedStyle(rootRef.current);
        const text = styles.getPropertyValue("--peel-text-primary").trim();
        const lime = styles.getPropertyValue("--peel-lime").trim();
        const bg = styles.getPropertyValue("--peel-base").trim();
        setComputedTheme({
          text: text || "#f5f5f7",
          lime: lime || "#84ff00",
          bg: bg || "#08090a",
        });
      }
    }, []);

    React.useEffect(() => {
      if (!open) {
        setIsComplete(false);
        setStatusText("Loading");
        setAriaProgress(0);
      }
    }, [open]);

    const resolvedColorA = colorA || computedTheme.text;
    const resolvedColorB = colorB || computedTheme.lime;
    const resolvedBg = background || computedTheme.bg;

    const clampedPitch = Math.min(32, Math.max(6, pitch));
    const clampedThickness = Math.min(1, Math.max(0, thickness));
    const coverage = 0.20 + 0.50 * clampedThickness;
    const clampedDuration = Math.min(12, Math.max(0.05, duration));

    const onCompleteRef = React.useRef(onComplete);
    onCompleteRef.current = onComplete;

    const propsRef = React.useRef({
      pitch: clampedPitch,
      coverage,
      angle,
      colorA: resolvedColorA,
      colorB: resolvedColorB,
      bg: resolvedBg,
    });
    propsRef.current = {
      pitch: clampedPitch,
      coverage,
      angle,
      colorA: resolvedColorA,
      colorB: resolvedColorB,
      bg: resolvedBg,
    };

    const renderRef = React.useRef<(() => void) | null>(null);

    React.useEffect(() => {
      renderRef.current?.();
    }, [clampedPitch, coverage, angle, resolvedColorA, resolvedColorB, resolvedBg]);

    React.useEffect(() => {
      if (!open || isComplete) return;
      if (position === "fixed" && lockScroll) {
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
          document.body.style.overflow = prevOverflow;
        };
      }
    }, [open, isComplete, position, lockScroll]);

    useGSAP(
      () => {
        if (!open || !mounted || isComplete) return;

        const canvas = canvasRef.current;
        const root = rootRef.current;
        const overlay = overlayRef.current;
        if (!canvas || !root || !overlay) return;

        const ctx = canvas.getContext("2d", { alpha: false });
        if (!ctx) return;

        let dpr = Math.min(window.devicePixelRatio || 1, 2);
        let width = root.clientWidth || 300;
        let height = root.clientHeight || 150;

        function resize() {
          if (!canvas || !root) return;
          width = root.clientWidth;
          height = root.clientHeight;
          canvas.width = Math.round(width * dpr);
          canvas.height = Math.round(height * dpr);
        }
        resize();

        const resizeObserver = new ResizeObserver(() => {
          resize();
          render();
        });
        resizeObserver.observe(root);

        const animState = {
          p: 0,
          delta: 11,
          slideOffset: 0,
          isExiting: false,
        };

        const frameTimes: number[] = [];

        function render() {
          if (!ctx || animState.isExiting) return;
          const t0 = performance.now();
          const { pitch: pPitch, coverage: pCoverage, angle: pAngle, colorA: pColA, colorB: pColB, bg: pBg } = propsRef.current;

          ctx.save();
          ctx.scale(dpr, dpr);
          ctx.fillStyle = pBg;
          ctx.fillRect(0, 0, width, height);

          const cx = width / 2;
          const cy = height / 2;
          const diag = Math.hypot(width, height);
          const R = diag / 2 + pPitch * 2;
          const lineWidth = pCoverage * pPitch;

          const baseRad = (pAngle * Math.PI) / 180;
          const deltaRad = (animState.delta * Math.PI) / 180;

          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(baseRad);
          ctx.strokeStyle = pColA;
          ctx.globalAlpha = 0.28;
          ctx.lineWidth = lineWidth;
          ctx.beginPath();
          for (let d = -R; d <= R; d += pPitch) {
            ctx.moveTo(-R, d);
            ctx.lineTo(R, d);
          }
          ctx.stroke();
          ctx.restore();

          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(baseRad + deltaRad);
          ctx.strokeStyle = pColB;
          ctx.globalAlpha = 1.0;
          ctx.lineWidth = lineWidth;
          ctx.beginPath();
          const startOffset = -R - pPitch + (animState.slideOffset % pPitch);
          for (let d = startOffset; d <= R + pPitch; d += pPitch) {
            ctx.moveTo(-R, d);
            ctx.lineTo(R, d);
          }
          ctx.stroke();
          ctx.restore();

          ctx.restore();

          const dur = performance.now() - t0;
          if (frameTimes.length < 30) {
            frameTimes.push(dur);
          } else {
            frameTimes.shift();
            frameTimes.push(dur);
            const avg = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
            if (avg > 20 && dpr > 1) {
              dpr = dpr > 1.5 ? 1.5 : 1.0;
              resize();
            }
          }
        }

        renderRef.current = render;

        let lastAriaUpdate = 0;
        function updateCounter(val: number) {
          const clampedVal = Math.min(100, Math.max(0, Math.round(val)));
          if (counterRef.current) {
            counterRef.current.textContent = String(clampedVal).padStart(3, "0");
          }
          const now = performance.now();
          if (now - lastAriaUpdate > 250 || clampedVal === 100) {
            lastAriaUpdate = now;
            setAriaProgress(clampedVal);
          }
        }

        let completedCalled = false;
        function finishIntro() {
          if (completedCalled) return;
          completedCalled = true;
          setStatusText("Loaded");
          setIsComplete(true);
          onCompleteRef.current?.();
        }

        function playExitSequence() {
          animState.isExiting = true;
          const diag = Math.hypot(width, height) * 1.3;
          const perpAngle = ((propsRef.current.angle + 90) * Math.PI) / 180;
          const moveX = Math.cos(perpAngle) * diag;
          const moveY = Math.sin(perpAngle) * diag;

          const exitTl = gsap.timeline({
            onComplete: finishIntro,
          });

          const fadeTargets = [plateRef.current, labelRef.current].filter(Boolean);
          const isFast = clampedDuration < 1;
          const fadeDur = isFast ? clampedDuration * 0.1 : 0.2;
          const exitDur = isFast ? clampedDuration * 0.3 : 1.0;

          if (fadeTargets.length > 0) {
            exitTl.to(fadeTargets, {
              opacity: 0,
              duration: fadeDur,
              ease: "power2.out",
            });
          }

          exitTl.to(overlay, {
            x: moveX,
            y: moveY,
            duration: exitDur,
            ease: "power4.inOut",
          });

          return exitTl;
        }

        const mm = gsap.matchMedia(rootRef.current ?? undefined);

        mm.add("(prefers-reduced-motion: reduce)", () => {
          animState.delta = 0;
          animState.slideOffset = 0;
          render();

          if (controlledProgress !== undefined) {
            updateCounter(controlledProgress);
            if (controlledProgress >= 100) {
              gsap.to(overlay, {
                opacity: 0,
                duration: 0.2,
                ease: "power2.out",
                onComplete: finishIntro,
              });
            }
          } else {
            const isFast = clampedDuration < 1;
            const reduceDur = isFast ? clampedDuration * 0.5 : Math.min(clampedDuration, 1.2);
            const fadeDur = isFast ? clampedDuration * 0.5 : 0.2;
            const state = { val: 0 };
            gsap.to(state, {
              val: 100,
              duration: reduceDur,
              ease: "none",
              onUpdate: () => {
                updateCounter(state.val);
              },
              onComplete: () => {
                gsap.to(overlay, {
                  opacity: 0,
                  duration: fadeDur,
                  ease: "power2.out",
                  onComplete: finishIntro,
                });
              },
            });
          }
        });

        mm.add("(prefers-reduced-motion: no-preference)", () => {
          if (controlledProgress !== undefined) {
            const targetP = Math.min(100, Math.max(0, controlledProgress));
            const progressFraction = targetP / 100;
            const targetDelta = targetP >= 100 ? 0 : 11 * Math.pow(1 - progressFraction, 1.4);

            let driftTween: gsap.core.Tween | null = null;
            if (targetP < 100) {
              driftTween = gsap.to(animState, {
                slideOffset: `+=${propsRef.current.pitch * 0.12 * (1 - progressFraction) * 10}`,
                duration: 10,
                ease: "none",
                repeat: -1,
                onUpdate: render,
              });
            }

            gsap.to(animState, {
              p: targetP,
              delta: targetDelta,
              duration: 0.35,
              ease: "power1.out",
              onUpdate: () => {
                updateCounter(animState.p);
                render();
              },
              onComplete: () => {
                if (targetP >= 100) {
                  driftTween?.kill();
                  animState.slideOffset = Math.round(animState.slideOffset / propsRef.current.pitch) * propsRef.current.pitch;
                  const settleTl = gsap.timeline();
                  settleTl.to(animState, {
                    delta: -0.35,
                    duration: 0.14,
                    ease: "power2.in",
                    onUpdate: render,
                  });
                  settleTl.to(animState, {
                    delta: 0,
                    duration: 0.14,
                    ease: "back.out(3)",
                    onUpdate: render,
                  });
                  settleTl.to({}, { duration: 0.3 });
                  settleTl.add(playExitSequence);
                }
              },
            });
          } else {
            const isFast = clampedDuration < 1;
            const runDuration = isFast
              ? clampedDuration * 0.4
              : Math.max(0.6, clampedDuration - 0.78);
            const settlePartDur = isFast ? clampedDuration * 0.1 : 0.14;
            const holdDur = isFast ? clampedDuration * 0.1 : 0.3;

            const introTl = gsap.timeline();

            introTl.to(animState, {
              p: 100,
              slideOffset: propsRef.current.pitch * 0.12 * runDuration,
              duration: runDuration,
              ease: "power2.inOut",
              onUpdate: () => {
                const normP = animState.p / 100;
                animState.delta = 11 * Math.pow(1 - normP, 1.4);
                updateCounter(animState.p);
                render();
              },
            });

            introTl.to(animState, {
              delta: -0.35,
              slideOffset: Math.round(animState.slideOffset / propsRef.current.pitch) * propsRef.current.pitch,
              duration: settlePartDur,
              ease: "power2.in",
              onUpdate: render,
            });

            introTl.to(animState, {
              delta: 0,
              duration: settlePartDur,
              ease: "back.out(3)",
              onUpdate: render,
            });

            introTl.to({}, { duration: holdDur });
            introTl.add(playExitSequence);
          }
        });

        render();

        return () => {
          renderRef.current = null;
          mm.revert();
          resizeObserver.disconnect();
        };
      },
      {
        scope: rootRef,
        dependencies: [
          open,
          mounted,
          isComplete,
          controlledProgress,
          clampedDuration,
        ],
      }
    );

    if (!open || isComplete) {
      return null;
    }

    return (
      <div
        {...props}
        ref={rootRef}
        role="progressbar"
        aria-label="Loading"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={ariaProgress}
        className={cn(
          position === "fixed" ? "fixed inset-0 z-50" : "absolute inset-0 z-20",
          "overflow-hidden select-none",
          className
        )}
        style={{
          backgroundColor: resolvedBg,
          ...props.style,
        }}
      >
        <div ref={overlayRef} className="absolute inset-0 size-full">
          {mounted && (
            <canvas
              ref={canvasRef}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 size-full"
            />
          )}

          {label && (
            <div
              ref={labelRef}
              className="absolute left-6 top-6 md:left-10 md:top-10 text-[13px] font-sans font-medium"
              style={{
                color: resolvedColorA,
                opacity: 0.7,
              }}
            >
              {label}
            </div>
          )}

          <div
            ref={plateRef}
            className="absolute bottom-6 left-6 md:bottom-10 md:left-10 p-4 rounded-xl"
            style={{ backgroundColor: resolvedBg }}
          >
            <div
              ref={counterRef}
              className="text-[clamp(88px,16vw,220px)] font-medium font-sans tabular-nums tracking-[-0.04em] leading-[0.8] select-none"
              style={{ color: resolvedColorA }}
            >
              000
            </div>
          </div>
        </div>

        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {statusText}
        </div>
      </div>
    );
  }
);

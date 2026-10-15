"use client";

import * as React from "react";
import { Engine, Bodies, Composite, Constraint, Sleeping, type Body as MatterBody } from "matter-js";
import { cn } from "@/lib/utils";

export interface SkillItem {
  label: string;
  tone?: "accent" | "ink" | "outline";
}

export interface SkillPileProps {
  skills: SkillItem[];
  height?: number | string;
  hint?: string;
  resetLabel?: string;
  className?: string;
}

const WALL_THICKNESS = 120;

export function SkillPile({
  skills,
  height = "min(400px, 64vh)",
  hint = "Grab one. Throw it.",
  resetLabel = "Drop again",
  className,
}: SkillPileProps) {
  const activeSkills = React.useMemo(() => skills.slice(0, 24), [skills]);
  const [isPhysicsActive, setIsPhysicsActive] = React.useState(false);
  const [pillVisibility, setPillVisibility] = React.useState<boolean[]>(() =>
    new Array(activeSkills.length).fill(false)
  );

  const containerRef = React.useRef<HTMLDivElement>(null);
  const trayRef = React.useRef<HTMLDivElement>(null);
  const pillRefs = React.useRef<(HTMLSpanElement | null)[]>([]);

  const engineRef = React.useRef<Engine | null>(null);
  const bodiesRef = React.useRef<MatterBody[]>([]);
  const sizesRef = React.useRef<{ width: number; height: number }[]>([]);
  const wasSleepingRef = React.useRef<boolean[]>([]);
  const timersRef = React.useRef<ReturnType<typeof setTimeout>[]>([]);
  const pendingPillsRef = React.useRef(0);

  const activeConstraintRef = React.useRef<Constraint | null>(null);
  const activePillIndexRef = React.useRef<number>(-1);

  const trayWidthRef = React.useRef(0);
  const trayHeightRef = React.useRef(0);
  const lastWidthRef = React.useRef(0);

  const frameIdRef = React.useRef<number | null>(null);
  const isPausedRef = React.useRef(false);
  const isInViewRef = React.useRef(false);
  const hasStartedRef = React.useRef(false);

  const clearTimers = React.useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const stopLoop = React.useCallback(() => {
    if (frameIdRef.current !== null) {
      cancelAnimationFrame(frameIdRef.current);
      frameIdRef.current = null;
    }
  }, []);

  const loopRef = React.useRef<() => void>(() => {});

  const loop = React.useCallback(() => {
    if (isPausedRef.current || !engineRef.current) {
      frameIdRef.current = null;
      return;
    }

    Engine.update(engineRef.current, 1000 / 60);

    const bodies = bodiesRef.current;
    const sizes = sizesRef.current;
    let anyAwake = false;

    for (let i = 0; i < bodies.length; i++) {
      const body = bodies[i];
      const el = pillRefs.current[i];
      if (!body || !el) continue;

      if (!body.isSleeping) {
        anyAwake = true;
        wasSleepingRef.current[i] = false;
        const s = sizes[i];
        el.style.transform = `translate3d(${body.position.x - s.width / 2}px, ${body.position.y - s.height / 2}px, 0) rotate(${body.angle}rad)`;
      } else if (!wasSleepingRef.current[i]) {
        wasSleepingRef.current[i] = true;
        const s = sizes[i];
        el.style.transform = `translate3d(${body.position.x - s.width / 2}px, ${body.position.y - s.height / 2}px, 0) rotate(${body.angle}rad)`;
      }
    }

    const hasPending = pendingPillsRef.current > 0;
    const isDragging = activeConstraintRef.current !== null;

    if (!hasPending && !isDragging && !anyAwake) {
      frameIdRef.current = null;
      return;
    }

    frameIdRef.current = requestAnimationFrame(loopRef.current);
  }, []);

  React.useEffect(() => {
    loopRef.current = loop;
  }, [loop]);

  const startLoop = React.useCallback(() => {
    if (frameIdRef.current === null && !isPausedRef.current && isPhysicsActive) {
      frameIdRef.current = requestAnimationFrame(loopRef.current);
    }
  }, [isPhysicsActive]);

  const updateWalls = React.useCallback(
    (engine: Engine, width: number, height: number) => {
      const existingWalls = Composite.allBodies(engine.world).filter(
        (b) => b.label === "wall"
      );
      if (existingWalls.length > 0) {
        Composite.remove(engine.world, existingWalls);
      }

      const floor = Bodies.rectangle(
        width / 2,
        height + WALL_THICKNESS / 2,
        width + WALL_THICKNESS * 2,
        WALL_THICKNESS,
        { isStatic: true, label: "wall" }
      );
      const leftWall = Bodies.rectangle(
        -WALL_THICKNESS / 2,
        -height / 2,
        WALL_THICKNESS,
        height * 4,
        { isStatic: true, label: "wall" }
      );
      const rightWall = Bodies.rectangle(
        width + WALL_THICKNESS / 2,
        -height / 2,
        WALL_THICKNESS,
        height * 4,
        { isStatic: true, label: "wall" }
      );

      Composite.add(engine.world, [floor, leftWall, rightWall]);
    },
    []
  );

  const startDropSequence = React.useCallback(
    (engine: Engine, instant = false) => {
      clearTimers();
      stopLoop();

      if (activeConstraintRef.current) {
        Composite.remove(engine.world, activeConstraintRef.current);
        activeConstraintRef.current = null;
        activePillIndexRef.current = -1;
      }

      const existingPills = Composite.allBodies(engine.world).filter(
        (b) => b.label === "pill"
      );
      if (existingPills.length > 0) {
        Composite.remove(engine.world, existingPills);
      }

      const trayW = trayWidthRef.current;
      const trayH = trayHeightRef.current;
      const sizes = sizesRef.current;
      const newBodies: MatterBody[] = [];

      for (let i = 0; i < activeSkills.length; i++) {
        const s = sizes[i] ?? { width: 120, height: 50 };
        const minX = 10 + s.width / 2;
        const maxX = Math.max(minX, trayW - 10 - s.width / 2);
        const spawnX = minX + Math.random() * (maxX - minX);
        const spawnY = -0.9 * trayH + Math.random() * (0.9 * trayH - 60);
        const startAngle = (Math.random() - 0.5) * 0.8;

        const body = Bodies.rectangle(spawnX, spawnY, s.width, s.height, {
          chamfer: { radius: s.height / 2 },
          restitution: 0.32,
          friction: 0.5,
          frictionStatic: 0.6,
          frictionAir: 0.012,
          density: 0.0016,
          angle: startAngle,
          label: "pill",
        });

        newBodies.push(body);
      }

      bodiesRef.current = newBodies;
      wasSleepingRef.current = new Array(activeSkills.length).fill(false);

      if (instant) {
        Composite.add(engine.world, newBodies);
        setPillVisibility(new Array(activeSkills.length).fill(true));
        pendingPillsRef.current = 0;

        // Step simulation directly to avoid jarring drop animation when settling instantly
        for (let s = 0; s < 220; s++) {
          Engine.update(engine, 1000 / 60);
        }

        for (let i = 0; i < newBodies.length; i++) {
          const b = newBodies[i];
          const el = pillRefs.current[i];
          const s = sizes[i];
          if (b && el && s) {
            el.style.transform = `translate3d(${b.position.x - s.width / 2}px, ${b.position.y - s.height / 2}px, 0) rotate(${b.angle}rad)`;
          }
        }
        return;
      }

      setPillVisibility(new Array(activeSkills.length).fill(false));
      pendingPillsRef.current = activeSkills.length;

      const initialTimer = setTimeout(() => {
        newBodies.forEach((body, index) => {
          const pillTimer = setTimeout(() => {
            Composite.add(engine.world, body);
            pendingPillsRef.current = Math.max(0, pendingPillsRef.current - 1);
            setPillVisibility((prev) => {
              const next = [...prev];
              next[index] = true;
              return next;
            });
            startLoop();
          }, index * 110);

          timersRef.current.push(pillTimer);
        });
      }, 260);

      timersRef.current.push(initialTimer);
      startLoop();
    },
    [activeSkills.length, clearTimers, startLoop, stopLoop]
  );

  const initPhysics = React.useCallback(async () => {
    try {
      const tray = trayRef.current;
      if (!tray) return;

      // Cap font readiness check so layout measurement never stalls
      if (typeof document !== "undefined" && document.fonts) {
        await Promise.race([
          document.fonts.ready,
          new Promise((resolve) => setTimeout(resolve, 1200)),
        ]);
      }

      const rect = tray.getBoundingClientRect();
      const trayW = rect.width;
      const trayH = rect.height;
      trayWidthRef.current = trayW;
      trayHeightRef.current = trayH;
      lastWidthRef.current = trayW;

      sizesRef.current = pillRefs.current.map((el) => ({
        width: el ? el.offsetWidth : 120,
        height: el ? el.offsetHeight : 50,
      }));

      const engine = Engine.create({
        enableSleeping: true,
        positionIterations: 4,
        velocityIterations: 3,
      });
      engine.gravity.y = 1.2;
      engineRef.current = engine;

      updateWalls(engine, trayW, trayH);
      setIsPhysicsActive(true);

      const prefersReduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      startDropSequence(engine, prefersReduced);
    } catch {
      setIsPhysicsActive(false);
    }
  }, [startDropSequence, updateWalls]);

  React.useEffect(() => {
    const tray = trayRef.current;
    if (!tray) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
          isInViewRef.current = true;
          if (!hasStartedRef.current) {
            hasStartedRef.current = true;
            void initPhysics();
          } else {
            isPausedRef.current = false;
            startLoop();
          }
        } else {
          isInViewRef.current = false;
          isPausedRef.current = true;
          stopLoop();
        }
      },
      { threshold: 0.3 }
    );

    io.observe(tray);

    const handleVisibility = () => {
      if (document.hidden) {
        isPausedRef.current = true;
        stopLoop();
      } else if (isInViewRef.current) {
        isPausedRef.current = false;
        startLoop();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newW = Math.round(entry.contentRect.width);
        if (newW > 0 && Math.abs(newW - lastWidthRef.current) > 2) {
          if (resizeTimer) clearTimeout(resizeTimer);
          resizeTimer = setTimeout(() => {
            const currentTray = trayRef.current;
            const currentEngine = engineRef.current;
            if (currentTray && currentEngine) {
              const currentH = currentTray.clientHeight;
              trayWidthRef.current = newW;
              trayHeightRef.current = currentH;
              lastWidthRef.current = newW;
              updateWalls(currentEngine, newW, currentH);
              startDropSequence(currentEngine, true);
            }
          }, 200);
        }
      }
    });

    ro.observe(tray);

    return () => {
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
      if (resizeTimer) clearTimeout(resizeTimer);
      clearTimers();
      stopLoop();

      if (engineRef.current) {
        Composite.clear(engineRef.current.world, false);
        Engine.clear(engineRef.current);
        engineRef.current = null;
      }
    };
  }, [clearTimers, initPhysics, startDropSequence, startLoop, stopLoop, updateWalls]);

  const handlePointerDown = (
    index: number,
    e: React.PointerEvent<HTMLSpanElement>
  ) => {
    if (!isPhysicsActive || !engineRef.current) return;
    const body = bodiesRef.current[index];
    if (!body || !pillVisibility[index]) return;

    const tray = trayRef.current;
    if (!tray) return;

    const trayRect = tray.getBoundingClientRect();
    const pointerX = e.clientX - trayRect.left;
    const pointerY = e.clientY - trayRect.top;

    Sleeping.set(body, false);

    const dx = pointerX - body.position.x;
    const dy = pointerY - body.position.y;
    const cosA = Math.cos(-body.angle);
    const sinA = Math.sin(-body.angle);
    const localX = dx * cosA - dy * sinA;
    const localY = dx * sinA + dy * cosA;

    const constraint = Constraint.create({
      pointA: { x: pointerX, y: pointerY },
      bodyB: body,
      pointB: { x: localX, y: localY },
      stiffness: 0.16,
      damping: 0.14,
      length: 0,
    });

    Composite.add(engineRef.current.world, constraint);
    activeConstraintRef.current = constraint;
    activePillIndexRef.current = index;

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}

    startLoop();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLSpanElement>) => {
    const constraint = activeConstraintRef.current;
    if (!constraint) return;

    const tray = trayRef.current;
    if (!tray) return;

    const trayRect = tray.getBoundingClientRect();
    const rawX = e.clientX - trayRect.left;
    const rawY = e.clientY - trayRect.top;

    const clampedX = Math.max(0, Math.min(trayWidthRef.current, rawX));
    const clampedY = Math.max(
      -trayHeightRef.current,
      Math.min(trayHeightRef.current, rawY)
    );

    constraint.pointA.x = clampedX;
    constraint.pointA.y = clampedY;

    const body = bodiesRef.current[activePillIndexRef.current];
    if (body) {
      Sleeping.set(body, false);
    }

    startLoop();
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLSpanElement>) => {
    if (activeConstraintRef.current && engineRef.current) {
      Composite.remove(engineRef.current.world, activeConstraintRef.current);
      activeConstraintRef.current = null;
      activePillIndexRef.current = -1;
    }
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
  };

  const handleReset = () => {
    if (engineRef.current && isPhysicsActive) {
      startDropSequence(engineRef.current, false);
    }
  };

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <ul aria-label="Skills" className="sr-only">
        {activeSkills.map((skill, index) => (
          <li key={index}>{skill.label}</li>
        ))}
      </ul>

      <div
        ref={trayRef}
        aria-hidden="true"
        style={isPhysicsActive ? { height } : { minHeight: height }}
        className={cn(
          "relative w-full overflow-hidden border border-foreground bg-transparent rounded-none",
          !isPhysicsActive && "flex flex-col justify-end p-3 sm:p-4"
        )}
      >
        <div
          className={cn(
            !isPhysicsActive &&
              "flex flex-wrap content-end items-end justify-start gap-2"
          )}
        >
          {activeSkills.map((skill, index) => {
            const tone = skill.tone ?? "outline";
            const isVisible = !isPhysicsActive || pillVisibility[index];

            return (
              <span
                key={index}
                ref={(el) => {
                  pillRefs.current[index] = el;
                }}
                onPointerDown={(e) => handlePointerDown(index, e)}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                className={cn(
                  "h-[50px] px-6 rounded-full whitespace-nowrap font-serif text-[25px] leading-none tracking-[-0.01em] select-none cursor-grab inline-flex items-center justify-center",
                  isPhysicsActive
                    ? "absolute top-0 left-0 origin-center touch-none active:cursor-grabbing"
                    : "",
                  !isVisible && "opacity-0 pointer-events-none",
                  tone === "accent" && "bg-primary text-primary-foreground",
                  tone === "ink" && "bg-foreground text-background",
                  tone === "outline" &&
                    "bg-background text-foreground [box-shadow:inset_0_0_0_2px_currentColor]"
                )}
              >
                {skill.label}
              </span>
            );
          })}
        </div>
      </div>

      <div className="mt-3.5 flex items-center justify-between gap-4 w-full">
        <span className="font-mono text-[12px] uppercase tracking-[0.09em] text-muted-foreground">
          {hint}
        </span>
        {resetLabel ? (
          <button
            type="button"
            disabled={!isPhysicsActive}
            onClick={handleReset}
            className="font-mono text-[12px] uppercase tracking-[0.09em] text-foreground underline underline-offset-4 decoration-1 decoration-foreground bg-transparent border-0 cursor-pointer disabled:cursor-default disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {resetLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
}
SkillPile.displayName = "SkillPile";

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface MoireFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "lines" | "rings" | "dots";
  pitch?: number;
  angle?: number;
  drift?: number;
  interactive?: boolean;
  calm?: "none" | "left" | "right" | "center" | "bottom";
  calmAmount?: number;
  colorA?: string;
  colorB?: string;
  background?: string;
  paused?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const VERTEX_SHADER_SOURCE = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = (a_pos + 1.0) * 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER_SOURCE = `
precision mediump float;
varying vec2 v_uv;

uniform vec2 u_resolution;
uniform int u_variant;
uniform float u_pitch;
uniform float u_angle;
uniform float u_relAngle;
uniform vec2 u_offsetB;
uniform float u_pitchScaleB;
uniform vec3 u_colorA;
uniform vec3 u_colorB;
uniform vec3 u_bg;
uniform int u_calm;
uniform float u_calmAmount;

void main() {
  vec2 p = v_uv * u_resolution;
  float covA = 0.0;
  float covB = 0.0;

  if (u_variant == 0) {
    vec2 nA = vec2(cos(u_angle), sin(u_angle));
    float dA = dot(p, nA);
    float distA = abs(mod(dA + 0.5 * u_pitch, u_pitch) - 0.5 * u_pitch);
    float wA = 0.45 * u_pitch;
    covA = 1.0 - smoothstep(wA * 0.5 - 0.5, wA * 0.5 + 0.5, distA);

    float angB = u_angle + u_relAngle;
    vec2 nB = vec2(cos(angB), sin(angB));
    float pB = u_pitch * u_pitchScaleB;
    float dB = dot(p, nB) - u_offsetB.x;
    float distB = abs(mod(dB + 0.5 * pB, pB) - 0.5 * pB);
    float wB = 0.45 * pB;
    covB = 1.0 - smoothstep(wB * 0.5 - 0.5, wB * 0.5 + 0.5, distB);
  } else if (u_variant == 1) {
    vec2 cA = u_resolution * 0.5;
    float rA = length(p - cA);
    float distA = abs(mod(rA + 0.5 * u_pitch, u_pitch) - 0.5 * u_pitch);
    float wA = 0.45 * u_pitch;
    covA = 1.0 - smoothstep(wA * 0.5 - 0.5, wA * 0.5 + 0.5, distA);

    vec2 cB = cA + u_offsetB;
    float rB = length(p - cB);
    float pB = u_pitch * u_pitchScaleB;
    float distB = abs(mod(rB + 0.5 * pB, pB) - 0.5 * pB);
    float wB = 0.45 * pB;
    covB = 1.0 - smoothstep(wB * 0.5 - 0.5, wB * 0.5 + 0.5, distB);
  } else {
    float cA = cos(-u_angle);
    float sA = sin(-u_angle);
    vec2 pRotA = vec2(cA * p.x - sA * p.y, sA * p.x + cA * p.y);
    vec2 dCellA = mod(pRotA + 0.5 * u_pitch, u_pitch) - 0.5 * u_pitch;
    float rA = length(dCellA);
    float radA = 0.28 * u_pitch;
    covA = 1.0 - smoothstep(radA - 0.5, radA + 0.5, rA);

    float angB = u_angle + u_relAngle;
    float cB = cos(-angB);
    float sB = sin(-angB);
    vec2 pShiftB = p - u_offsetB;
    vec2 pRotB = vec2(cB * pShiftB.x - sB * pShiftB.y, sB * pShiftB.x + cB * pShiftB.y);
    float pB = u_pitch * u_pitchScaleB;
    vec2 dCellB = mod(pRotB + 0.5 * pB, pB) - 0.5 * pB;
    float rB = length(dCellB);
    float radB = 0.28 * pB;
    covB = 1.0 - smoothstep(radB - 0.5, radB + 0.5, rB);
  }

  float edgeX = smoothstep(0.0, 0.08, v_uv.x) * (1.0 - smoothstep(0.92, 1.0, v_uv.x));
  float edgeY = smoothstep(0.0, 0.08, v_uv.y) * (1.0 - smoothstep(0.92, 1.0, v_uv.y));
  float edgeFade = edgeX * edgeY;

  float calmMask = 1.0;
  if (u_calm == 1) {
    calmMask = mix(1.0 - u_calmAmount, 1.0, smoothstep(0.15, 0.7, v_uv.x));
  } else if (u_calm == 2) {
    calmMask = mix(1.0 - u_calmAmount, 1.0, smoothstep(0.85, 0.3, v_uv.x));
  } else if (u_calm == 3) {
    float dCenter = length(v_uv - vec2(0.5)) * 2.0;
    calmMask = mix(1.0 - u_calmAmount, 1.0, smoothstep(0.2, 0.8, dCenter));
  } else if (u_calm == 4) {
    calmMask = mix(1.0 - u_calmAmount, 1.0, smoothstep(0.25, 0.8, v_uv.y));
  }

  float totalMask = edgeFade * calmMask;
  float alphaA = covA * totalMask;
  float alphaB = covB * 0.35 * totalMask;

  vec3 rgbA = u_colorA * alphaA;
  vec3 rgbB = u_colorB * alphaB;
  vec3 moire = rgbA + rgbB - (rgbA * rgbB);

  vec3 finalColor = u_bg + moire * (vec3(1.0) - u_bg);
  gl_FragColor = vec4(finalColor, 1.0);
}
`;

function parseColorToRgb(str: string): [number, number, number] {
  if (str.startsWith("#")) {
    let hex = str.slice(1);
    if (hex.length === 3) {
      hex = hex.split("").map((c) => c + c).join("");
    }
    const num = parseInt(hex.slice(0, 6), 16);
    return [
      ((num >> 16) & 255) / 255,
      ((num >> 8) & 255) / 255,
      (num & 255) / 255,
    ];
  }
  const match = str.match(/\d+/g);
  if (match && match.length >= 3) {
    return [
      Number(match[0]) / 255,
      Number(match[1]) / 255,
      Number(match[2]) / 255,
    ];
  }
  return [0, 0, 0];
}

export const MoireField = React.forwardRef<HTMLDivElement, MoireFieldProps>(
  function MoireField(
    {
      variant = "lines",
      pitch = 9,
      angle = -24,
      drift = 0.5,
      interactive = true,
      calm = "none",
      calmAmount = 0.7,
      colorA,
      colorB,
      background,
      paused = false,
      className,
      children,
      ...props
    },
    forwardedRef
  ) {
    const rootRef = React.useRef<HTMLDivElement | null>(null);
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
    const [fallbackActive, setFallbackActive] = React.useState(false);
    const [canvasVisible, setCanvasVisible] = React.useState(false);

    const [computedTheme, setComputedTheme] = React.useState({
      lime: "#84ff00",
      text: "#f5f5f7",
      bg: "#08090a",
    });

    React.useImperativeHandle(
      forwardedRef,
      () => rootRef.current as HTMLDivElement
    );

    React.useEffect(() => {
      if (!rootRef.current) return;
      const styles = window.getComputedStyle(rootRef.current);
      const lime = styles.getPropertyValue("--peel-lime").trim();
      const text = styles.getPropertyValue("--peel-text-primary").trim();
      const bg = styles.getPropertyValue("--peel-base").trim();
      setComputedTheme({
        lime: lime || "#84ff00",
        text: text || "#f5f5f7",
        bg: bg || "#08090a",
      });
    }, []);

    const resolvedColorA = colorA || computedTheme.lime;
    const resolvedColorB = colorB || computedTheme.text;
    const resolvedBg = background || computedTheme.bg;

    const clampedPitch = Math.min(24, Math.max(6, pitch));
    const variantId = variant === "rings" ? 1 : variant === "dots" ? 2 : 0;
    const calmId =
      calm === "left"
        ? 1
        : calm === "right"
          ? 2
          : calm === "center"
            ? 3
            : calm === "bottom"
              ? 4
              : 0;

    React.useEffect(() => {
      const canvas = canvasRef.current;
      const root = rootRef.current;
      if (!canvas || !root) return;

      const glOpts = {
        alpha: false,
        antialias: false,
        powerPreference: "low-power" as const,
      };
      let gl = (canvas.getContext("webgl2", glOpts) ||
        canvas.getContext("webgl", glOpts)) as WebGLRenderingContext | null;

      if (!gl) {
        setFallbackActive(true);
        return;
      }

      function createShader(glCtx: WebGLRenderingContext, type: number, src: string) {
        const shader = glCtx.createShader(type);
        if (!shader) return null;
        glCtx.shaderSource(shader, src);
        glCtx.compileShader(shader);
        if (!glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS)) {
          glCtx.deleteShader(shader);
          return null;
        }
        return shader;
      }

      function initProgram(glCtx: WebGLRenderingContext) {
        const vs = createShader(glCtx, glCtx.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
        const fs = createShader(glCtx, glCtx.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE);
        if (!vs || !fs) return null;
        const prog = glCtx.createProgram();
        if (!prog) return null;
        glCtx.attachShader(prog, vs);
        glCtx.attachShader(prog, fs);
        glCtx.linkProgram(prog);
        if (!glCtx.getProgramParameter(prog, glCtx.LINK_STATUS)) {
          glCtx.deleteProgram(prog);
          return null;
        }
        return prog;
      }

      let program = initProgram(gl);
      if (!program) {
        setFallbackActive(true);
        return;
      }

      const positionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 3, -1, -1, 3]),
        gl.STATIC_DRAW
      );

      let uniformLocations = {
        resolution: gl.getUniformLocation(program, "u_resolution"),
        variant: gl.getUniformLocation(program, "u_variant"),
        pitch: gl.getUniformLocation(program, "u_pitch"),
        angle: gl.getUniformLocation(program, "u_angle"),
        relAngle: gl.getUniformLocation(program, "u_relAngle"),
        offsetB: gl.getUniformLocation(program, "u_offsetB"),
        pitchScaleB: gl.getUniformLocation(program, "u_pitchScaleB"),
        colorA: gl.getUniformLocation(program, "u_colorA"),
        colorB: gl.getUniformLocation(program, "u_colorB"),
        bg: gl.getUniformLocation(program, "u_bg"),
        calm: gl.getUniformLocation(program, "u_calm"),
        calmAmount: gl.getUniformLocation(program, "u_calmAmount"),
      };

      // Cap DPR at 2 to balance fillrate and sharpness
      let dpr = Math.min(window.devicePixelRatio || 1, 2);
      let cssWidth = root.clientWidth || 300;
      let cssHeight = root.clientHeight || 150;

      function resize() {
        if (!canvas || !root || !gl) return;
        cssWidth = root.clientWidth;
        cssHeight = root.clientHeight;
        canvas.width = Math.round(cssWidth * dpr);
        canvas.height = Math.round(cssHeight * dpr);
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
      resize();

      let targetNudgeAngle = 0;
      let targetNudgeOffset = 0;
      let currentNudgeAngle = 0;
      let currentNudgeOffset = 0;
      let targetPitchScale = 1.0;
      let currentPitchScale = 1.0;

      let isIntersecting = true;
      let isVisible = document.visibilityState === "visible";
      let prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      let animId = 0;
      const startTime = performance.now();
      let lastTime = startTime;
      const frameTimes: number[] = [];
      let contextLostTimer: number | null = null;

      function drawFrame(now: number) {
        if (!gl || !program) return;
        const dt = Math.min((now - lastTime) / 1000, 0.1);
        lastTime = now;
        const elapsed = (now - startTime) / 1000;

        if (frameTimes.length < 40) {
          frameTimes.push(dt * 1000);
        } else {
          frameTimes.shift();
          frameTimes.push(dt * 1000);
          const avg = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
          if (avg > 22 && dpr > 0.75) {
            dpr = dpr > 1.5 ? 1.5 : dpr > 1.0 ? 1.0 : 0.75;
            resize();
          }
        }

        const alphaDamp = 1.0 - Math.exp(-dt / 0.35);
        currentNudgeAngle += (targetNudgeAngle - currentNudgeAngle) * alphaDamp;
        currentNudgeOffset += (targetNudgeOffset - currentNudgeOffset) * alphaDamp;

        const pitchDamp = 1.0 - Math.exp(-dt / 0.4);
        currentPitchScale += (targetPitchScale - currentPitchScale) * pitchDamp;

        let relAngleRad = 2.0 * (Math.PI / 180);
        let offsetB: [number, number] = [0, 0];

        if (!prefersReducedMotion) {
          const breathingDeg = 1.8 + 0.8 * Math.sin((2 * Math.PI * elapsed) / 18.0) * drift;
          relAngleRad = (breathingDeg + currentNudgeAngle) * (Math.PI / 180);

          if (variantId === 0) {
            const idleSlide = elapsed * 0.15 * clampedPitch * drift;
            offsetB = [idleSlide + currentNudgeOffset, 0];
          } else if (variantId === 1) {
            const orbitRad = 0.6 * clampedPitch * drift;
            const orbitAng = (2 * Math.PI * elapsed) / 24.0;
            offsetB = [
              orbitRad * Math.cos(orbitAng) + currentNudgeOffset,
              orbitRad * Math.sin(orbitAng) + currentNudgeOffset,
            ];
          } else {
            const idleSlide = elapsed * 0.05 * clampedPitch * drift;
            offsetB = [idleSlide + currentNudgeOffset, currentNudgeOffset];
          }
        }

        gl.useProgram(program);

        const posAttr = gl.getAttribLocation(program, "a_pos");
        gl.enableVertexAttribArray(posAttr);
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

        gl.uniform2f(uniformLocations.resolution, cssWidth, cssHeight);
        gl.uniform1i(uniformLocations.variant, variantId);
        gl.uniform1f(uniformLocations.pitch, clampedPitch);
        gl.uniform1f(uniformLocations.angle, angle * (Math.PI / 180));
        gl.uniform1f(uniformLocations.relAngle, relAngleRad);
        gl.uniform2f(uniformLocations.offsetB, offsetB[0], offsetB[1]);
        gl.uniform1f(
          uniformLocations.pitchScaleB,
          prefersReducedMotion ? 1.0 : currentPitchScale
        );

        const [rA, gA, bA] = parseColorToRgb(resolvedColorA);
        const [rB, gB, bB] = parseColorToRgb(resolvedColorB);
        const [rBg, gBg, bBg] = parseColorToRgb(resolvedBg);

        gl.uniform3f(uniformLocations.colorA, rA, gA, bA);
        gl.uniform3f(uniformLocations.colorB, rB, gB, bB);
        gl.uniform3f(uniformLocations.bg, rBg, gBg, bBg);
        gl.uniform1i(uniformLocations.calm, calmId);
        gl.uniform1f(uniformLocations.calmAmount, calmAmount);

        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }

      function loop(now: number) {
        if (!paused && isIntersecting && isVisible && !prefersReducedMotion) {
          drawFrame(now);
          animId = requestAnimationFrame(loop);
        }
      }

      drawFrame(performance.now());
      setCanvasVisible(true);

      if (!prefersReducedMotion && !paused) {
        animId = requestAnimationFrame(loop);
      }

      const observer = new IntersectionObserver(([entry]) => {
        isIntersecting = entry.isIntersecting;
        if (isIntersecting && isVisible && !paused && !prefersReducedMotion) {
          cancelAnimationFrame(animId);
          lastTime = performance.now();
          animId = requestAnimationFrame(loop);
        }
      });
      observer.observe(root);

      const resizeObserver = new ResizeObserver(() => {
        resize();
        drawFrame(performance.now());
      });
      resizeObserver.observe(root);

      function onVisibility() {
        isVisible = document.visibilityState === "visible";
        if (isVisible && isIntersecting && !paused && !prefersReducedMotion) {
          cancelAnimationFrame(animId);
          lastTime = performance.now();
          animId = requestAnimationFrame(loop);
        }
      }
      document.addEventListener("visibilitychange", onVisibility);

      const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      function onMotionChange(e: MediaQueryListEvent) {
        prefersReducedMotion = e.matches;
        if (prefersReducedMotion) {
          cancelAnimationFrame(animId);
          drawFrame(performance.now());
        } else if (isIntersecting && isVisible && !paused) {
          lastTime = performance.now();
          animId = requestAnimationFrame(loop);
        }
      }
      motionQuery.addEventListener("change", onMotionChange);

      function onPointerMove(e: PointerEvent) {
        if (!interactive || prefersReducedMotion) return;
        const rect = root?.getBoundingClientRect();
        if (!rect) return;
        const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        targetNudgeAngle = nx * 3.0;
        targetNudgeOffset = ny * 2.0 * clampedPitch;
      }

      function onPointerDown() {
        if (!interactive || prefersReducedMotion) return;
        targetPitchScale = 0.85;
      }

      function onPointerUp() {
        if (!interactive || prefersReducedMotion) return;
        targetPitchScale = 1.0;
      }

      function onPointerLeave() {
        targetNudgeAngle = 0;
        targetNudgeOffset = 0;
        targetPitchScale = 1.0;
      }

      root.addEventListener("pointermove", onPointerMove, { passive: true });
      root.addEventListener("pointerdown", onPointerDown, { passive: true });
      window.addEventListener("pointerup", onPointerUp, { passive: true });
      root.addEventListener("pointerleave", onPointerLeave, { passive: true });

      function onContextLost(e: Event) {
        // Prevent browser default context discard on loss
        e.preventDefault();
        cancelAnimationFrame(animId);
        // WebGL context loss recovery timeout
        contextLostTimer = window.setTimeout(() => {
          setFallbackActive(true);
        }, 2000);
      }

      function onContextRestored() {
        if (contextLostTimer) clearTimeout(contextLostTimer);
        setFallbackActive(false);
        if (!canvas) return;
        gl = (canvas.getContext("webgl2", glOpts) ||
          canvas.getContext("webgl", glOpts)) as WebGLRenderingContext | null;
        if (gl) {
          program = initProgram(gl);
          if (program) {
            uniformLocations = {
              resolution: gl.getUniformLocation(program, "u_resolution"),
              variant: gl.getUniformLocation(program, "u_variant"),
              pitch: gl.getUniformLocation(program, "u_pitch"),
              angle: gl.getUniformLocation(program, "u_angle"),
              relAngle: gl.getUniformLocation(program, "u_relAngle"),
              offsetB: gl.getUniformLocation(program, "u_offsetB"),
              pitchScaleB: gl.getUniformLocation(program, "u_pitchScaleB"),
              colorA: gl.getUniformLocation(program, "u_colorA"),
              colorB: gl.getUniformLocation(program, "u_colorB"),
              bg: gl.getUniformLocation(program, "u_bg"),
              calm: gl.getUniformLocation(program, "u_calm"),
              calmAmount: gl.getUniformLocation(program, "u_calmAmount"),
            };
            resize();
            drawFrame(performance.now());
            if (!prefersReducedMotion && !paused) {
              animId = requestAnimationFrame(loop);
            }
          }
        }
      }

      canvas.addEventListener("webglcontextlost", onContextLost);
      canvas.addEventListener("webglcontextrestored", onContextRestored);

      return () => {
        cancelAnimationFrame(animId);
        if (contextLostTimer) clearTimeout(contextLostTimer);
        observer.disconnect();
        resizeObserver.disconnect();
        document.removeEventListener("visibilitychange", onVisibility);
        motionQuery.removeEventListener("change", onMotionChange);
        root.removeEventListener("pointermove", onPointerMove);
        root.removeEventListener("pointerdown", onPointerDown);
        window.removeEventListener("pointerup", onPointerUp);
        root.removeEventListener("pointerleave", onPointerLeave);
        canvas.removeEventListener("webglcontextlost", onContextLost);
        canvas.removeEventListener("webglcontextrestored", onContextRestored);
        if (gl && program) {
          gl.deleteProgram(program);
        }
      };
    }, [
      variantId,
      clampedPitch,
      angle,
      drift,
      interactive,
      calmId,
      calmAmount,
      resolvedColorA,
      resolvedColorB,
      resolvedBg,
      paused,
    ]);

    return (
      <div
        {...props}
        ref={rootRef}
        className={cn("relative overflow-hidden", className)}
        style={{
          backgroundColor: resolvedBg,
          ...props.style,
        }}
      >
        {fallbackActive ? (
          <div
            aria-hidden="true"
            data-testid="moire-fallback"
            className="pointer-events-none absolute inset-0 size-full"
            style={{
              backgroundColor: resolvedBg,
              backgroundImage: `
                repeating-linear-gradient(${angle + 2.0}deg, rgba(245, 245, 247, 0.35) 0px, rgba(245, 245, 247, 0.35) ${clampedPitch * 0.45}px, transparent ${clampedPitch * 0.45}px, transparent ${clampedPitch}px),
                repeating-linear-gradient(${angle}deg, rgba(132, 255, 0, 0.25) 0px, rgba(132, 255, 0, 0.25) ${clampedPitch * 0.45}px, transparent ${clampedPitch * 0.45}px, transparent ${clampedPitch}px)
              `,
              opacity: 0.85,
              maskImage: "radial-gradient(ellipse at center, black 65%, transparent 95%)",
              WebkitMaskImage: "radial-gradient(ellipse at center, black 65%, transparent 95%)",
            }}
          />
        ) : (
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 size-full"
            style={{
              opacity: canvasVisible ? 1 : 0,
              transition: "opacity 0.4s ease-out",
            }}
          />
        )}
        {children && <div className="relative z-10 size-full">{children}</div>}
      </div>
    );
  }
);

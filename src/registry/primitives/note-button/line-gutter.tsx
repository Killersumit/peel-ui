"use client";

import * as React from "react";

interface LineGutterProps {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  value: string;
  showLineNumbers: boolean;
}

interface MirrorMetrics {
  width: number;
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  fontStyle: string;
  lineHeight: string;
  letterSpacing: string;
  paddingTop: string;
  paddingRight: string;
  paddingBottom: string;
  paddingLeft: string;
  boxSizing: string;
  tabSize: string;
}

const defaultLineHeight = 22;

export function LineGutter({
  textareaRef,
  value,
  showLineNumbers,
}: LineGutterProps) {
  const lines = value.split("\n");
  const mirrorRef = React.useRef<HTMLDivElement>(null);
  const mirrorLineRefs = React.useRef<Array<HTMLDivElement | null>>([]);
  const [metrics, setMetrics] = React.useState<MirrorMetrics | null>(null);
  const [lineHeights, setLineHeights] = React.useState<number[]>(
    () => lines.map(() => defaultLineHeight)
  );
  const [scrollTop, setScrollTop] = React.useState(0);

  React.useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea || !mirrorRef.current) return;

    let frame = 0;
    const measure = () => {
      const computed = window.getComputedStyle(textarea);
      setMetrics({
        width: textarea.clientWidth,
        fontFamily: computed.fontFamily,
        fontSize: computed.fontSize,
        fontWeight: computed.fontWeight,
        fontStyle: computed.fontStyle,
        lineHeight: computed.lineHeight,
        letterSpacing: computed.letterSpacing,
        paddingTop: computed.paddingTop,
        paddingRight: computed.paddingRight,
        paddingBottom: computed.paddingBottom,
        paddingLeft: computed.paddingLeft,
        boxSizing: computed.boxSizing,
        tabSize: computed.tabSize,
      });

      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const nextHeights = mirrorLineRefs.current.map(
          (line) => line?.offsetHeight ?? defaultLineHeight
        );
        setLineHeights((previous) =>
          previous.length === nextHeights.length &&
          previous.every((height, index) => height === nextHeights[index])
            ? previous
            : nextHeights
        );
      });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(textarea);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, [textareaRef, value]);

  React.useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const syncScroll = () => setScrollTop(textarea.scrollTop);
    textarea.addEventListener("scroll", syncScroll, { passive: false });
    syncScroll();
    return () => textarea.removeEventListener("scroll", syncScroll);
  }, [textareaRef]);

  return (
    <>
      {showLineNumbers && (
        <div
          aria-hidden="true"
          className="relative z-10 w-11 shrink-0 overflow-hidden border-r border-white/[0.06] bg-[#1b1b1d] pt-3"
        >
          <div
            className="will-change-transform"
            style={{ transform: `translateY(-${scrollTop}px)` }}
          >
            {lines.map((_, index) => (
              <div
                key={index}
                className="pr-2 text-right font-mono text-xs leading-[22px] tabular-nums text-[#6b6b74]"
                style={{
                  height: `${lineHeights[index] ?? defaultLineHeight}px`,
                }}
              >
                {index + 1}
              </div>
            ))}
          </div>
        </div>
      )}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 h-0 overflow-hidden"
        style={{ visibility: "hidden" }}
      >
        <div
          ref={mirrorRef}
          className="whitespace-pre-wrap"
          style={{
            width: metrics ? `${metrics.width}px` : 0,
            fontFamily: metrics?.fontFamily ?? "Geist Mono, ui-monospace, monospace",
            fontSize: metrics?.fontSize ?? "13px",
            fontWeight: metrics?.fontWeight ?? "400",
            fontStyle: metrics?.fontStyle ?? "normal",
            lineHeight: metrics?.lineHeight ?? `${defaultLineHeight}px`,
            letterSpacing: metrics?.letterSpacing ?? "normal",
            paddingTop: metrics?.paddingTop ?? "12px",
            paddingRight: metrics?.paddingRight ?? "12px",
            paddingBottom: metrics?.paddingBottom ?? "12px",
            paddingLeft: metrics?.paddingLeft ?? "12px",
            boxSizing:
              metrics?.boxSizing === "content-box" ? "content-box" : "border-box",
            tabSize: metrics?.tabSize ?? 2,
            overflowWrap: "anywhere",
            wordBreak: "normal",
          }}
        >
          {lines.map((line, index) => (
            <div
              key={index}
              ref={(element) => {
                mirrorLineRefs.current[index] = element;
              }}
              className="whitespace-pre-wrap"
              style={{
                minHeight: metrics?.lineHeight ?? `${defaultLineHeight}px`,
                overflowWrap: "anywhere",
                wordBreak: "normal",
              }}
            >
              {line || "\u200b"}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

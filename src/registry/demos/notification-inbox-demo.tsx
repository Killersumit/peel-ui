"use client";

import * as React from "react";
import {
  NotificationInbox,
  type NotificationItem,
} from "@/registry/primitives/notification-inbox";
import { StageControlBar, type ColorOption } from "@/components/ui/StageControlBar";
import { cn } from "@/lib/utils";

type ThemeMode = "light" | "dark";
type AccentColor = "lime" | "ink" | "coral" | "teal";

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "init-1",
    title: "Maya replied to your note",
    body: "Sounds right. I will move it to Planned.",
    time: "5m",
    read: false,
  },
  {
    id: "init-2",
    title: "Build 481 passed",
    body: "Deployed to staging in 38 seconds.",
    time: "1h",
    read: false,
  },
  {
    id: "init-3",
    title: "Sam joined the workspace",
    body: "Say hello in the team channel.",
    time: "3h",
    read: true,
  },
  {
    id: "init-4",
    title: "Weekly summary is ready",
    body: "You wrote 14 notes and shared 3.",
    time: "1d",
    read: true,
  },
];

const ARRIVAL_POOL: { title: string; body: string }[] = [
  {
    title: "Maya commented on Offline mode",
    body: "Looks good. Can we ship it on Friday?",
  },
  {
    title: "Build 482 passed",
    body: "Deployed to production in 41 seconds.",
  },
  {
    title: "Sam invited you to Design",
    body: "Join the team to see the shared notes.",
  },
  {
    title: "Your export is ready",
    body: "notes-2026-10.zip, 12 MB.",
  },
  {
    title: "Payment received",
    body: "$29.00 from Northwind Studio.",
  },
  {
    title: "Dev mentioned you",
    body: "Can you review the changelog before noon?",
  },
  {
    title: "Release 2.5 is live",
    body: "Folders, a widget and 40 small fixes.",
  },
  {
    title: "New sign-in on Android",
    body: "If this was you, nothing to do.",
  },
];

const COLOR_OPTIONS: ColorOption<AccentColor>[] = [
  { id: "lime", label: "Acid Lime", swatchHex: "#84FF00" },
  { id: "ink", label: "Ink", swatchHex: "#18181B" },
  { id: "coral", label: "Coral", swatchHex: "#FF553E" },
  { id: "teal", label: "Teal", swatchHex: "#14B8A6" },
];

const ACCENTS: Record<
  AccentColor,
  {
    name: string;
    swatch: string;
    light: { primary: string; foreground: string; ring: string };
    dark: { primary: string; foreground: string; ring: string };
  }
> = {
  lime: {
    name: "Acid Lime",
    swatch: "#84FF00",
    light: {
      primary: "#3f6e00",
      foreground: "#ffffff",
      ring: "#3f6e00",
    },
    dark: {
      primary: "#84FF00",
      foreground: "#08090A",
      ring: "#84FF00",
    },
  },
  ink: {
    name: "Ink",
    swatch: "#18181B",
    light: {
      primary: "#0f0f10",
      foreground: "#ffffff",
      ring: "#0f0f10",
    },
    dark: {
      primary: "#f5f5f7",
      foreground: "#08090A",
      ring: "#f5f5f7",
    },
  },
  coral: {
    name: "Coral",
    swatch: "#FF553E",
    light: {
      primary: "#FF553E",
      foreground: "#ffffff",
      ring: "#FF553E",
    },
    dark: {
      primary: "#FF553E",
      foreground: "#ffffff",
      ring: "#FF553E",
    },
  },
  teal: {
    name: "Teal",
    swatch: "#14B8A6",
    light: {
      primary: "#0D9488",
      foreground: "#ffffff",
      ring: "#0D9488",
    },
    dark: {
      primary: "#14B8A6",
      foreground: "#08090A",
      ring: "#14B8A6",
    },
  },
};

export function NotificationInboxDemo() {
  const [mode, setMode] = React.useState<ThemeMode>("dark");
  const [accent, setAccent] = React.useState<AccentColor>("lime");
  const [notifications, setNotifications] = React.useState<NotificationItem[]>(
    INITIAL_NOTIFICATIONS
  );

  const arrivalIndexRef = React.useRef(0);
  const arrivalTimerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  const addArrival = React.useCallback(() => {
    const poolItem = ARRIVAL_POOL[arrivalIndexRef.current % ARRIVAL_POOL.length];
    arrivalIndexRef.current += 1;
    const nextItem: NotificationItem = {
      id: `arr-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      title: poolItem.title,
      body: poolItem.body,
      time: "just now",
      read: false,
    };
    setNotifications((prev) => [nextItem, ...prev]);
  }, []);

  React.useEffect(() => {
    arrivalTimerRef.current = setInterval(() => {
      addArrival();
    }, 7000);

    return () => {
      if (arrivalTimerRef.current) clearInterval(arrivalTimerRef.current);
    };
  }, [addArrival]);

  const handleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleReadAll = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const isLight = mode === "light";
  const activeAccent = ACCENTS[accent];
  const accentTokens = isLight ? activeAccent.light : activeAccent.dark;

  const themeVars: Record<string, string> = isLight
    ? {
        "--background": "#f6f6f7",
        "--foreground": "#0f0f10",
        "--card": "#ffffff",
        "--card-foreground": "#0f0f10",
        "--muted": "#f1f1f3",
        "--muted-foreground": "#6b6f76",
        "--border": "rgba(15, 15, 16, 0.12)",
        "--input": "#e4e4e7",
        "--primary": accentTokens.primary,
        "--primary-foreground": accentTokens.foreground,
        "--ring": accentTokens.ring,
      }
    : {
        "--background": "#0b0b0c",
        "--foreground": "#f4f4f5",
        "--card": "#17171a",
        "--card-foreground": "#f4f4f5",
        "--muted": "#202024",
        "--muted-foreground": "#9a9ea6",
        "--border": "rgba(255, 255, 255, 0.12)",
        "--input": "#2c2f38",
        "--primary": accentTokens.primary,
        "--primary-foreground": accentTokens.foreground,
        "--ring": accentTokens.ring,
      };

  return (
    <div className="w-full max-w-5xl mx-auto p-0 sm:p-2 flex flex-col items-center">
      {/* Unified Top Stage Control Bar */}
      <StageControlBar
        theme={mode}
        onThemeChange={setMode}
        colors={COLOR_OPTIONS}
        activeColorId={accent}
        onColorChange={setAccent}
      >
        <button
          type="button"
          onClick={addArrival}
          className="h-7 px-2.5 rounded-[8px] bg-[#16181E] hover:bg-[#1E2129] text-[11px] font-medium text-[#8E9299] hover:text-[#F5F5F7] inline-flex items-center gap-1 cursor-pointer transition-colors whitespace-nowrap shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
        >
          Send one
        </button>
      </StageControlBar>

      <div
        style={themeVars as React.CSSProperties}
        className={cn(
          "relative w-full max-w-[420px] sm:max-w-[460px] min-h-[500px] rounded-2xl border border-border bg-background text-foreground flex flex-col justify-between overflow-hidden shadow-[0_4px_24px_-4px_rgba(0,0,0,0.5)] transition-colors duration-200",
          mode === "dark" && "dark"
        )}
      >
        <header className="h-16 border-b border-border px-4 flex items-center justify-between shrink-0">
          <span className="text-xl font-medium uppercase tracking-[-0.02em] select-none text-foreground">
            Fieldnotes
          </span>
          <NotificationInbox
            notifications={notifications}
            onRead={handleRead}
            onReadAll={handleReadAll}
          />
        </header>

        <div className="flex-1 p-6 flex flex-col justify-end">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground select-none">
            A new notification arrives every few seconds.
          </span>
        </div>
      </div>
    </div>
  );
}

NotificationInboxDemo.displayName = "NotificationInboxDemo";

export default NotificationInboxDemo;

"use client";

import * as React from "react";
import {
  NotificationInbox,
  type NotificationItem,
} from "@/components/ui/notification-inbox";
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
    swatch: "#84ff00",
    light: {
      primary: "#3f6e00",
      foreground: "#ffffff",
      ring: "#3f6e00",
    },
    dark: {
      primary: "#84ff00",
      foreground: "#08090a",
      ring: "#84ff00",
    },
  },
  ink: {
    name: "Ink",
    swatch: "#111113",
    light: {
      primary: "#0f0f10",
      foreground: "#ffffff",
      ring: "#0f0f10",
    },
    dark: {
      primary: "#f5f5f7",
      foreground: "#08090a",
      ring: "#f5f5f7",
    },
  },
  coral: {
    name: "Coral",
    swatch: "#ff553e",
    light: {
      primary: "#ff553e",
      foreground: "#ffffff",
      ring: "#ff553e",
    },
    dark: {
      primary: "#ff553e",
      foreground: "#ffffff",
      ring: "#ff553e",
    },
  },
  teal: {
    name: "Teal",
    swatch: "#14b8a6",
    light: {
      primary: "#0d9488",
      foreground: "#ffffff",
      ring: "#0d9488",
    },
    dark: {
      primary: "#14b8a6",
      foreground: "#08090a",
      ring: "#14b8a6",
    },
  },
};

export function NotificationInboxDemo() {
  const [mode, setMode] = React.useState<ThemeMode>("dark");
  const [accent, setAccent] = React.useState<AccentColor>("lime");
  const [notifications, setNotifications] =
    React.useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const arrivalIndexRef = React.useRef(0);

  const addArrival = React.useCallback(() => {
    const poolItem =
      ARRIVAL_POOL[arrivalIndexRef.current % ARRIVAL_POOL.length];
    arrivalIndexRef.current += 1;
    const newNotification: NotificationItem = {
      id: `arrival-${Date.now()}-${arrivalIndexRef.current}`,
      title: poolItem.title,
      body: poolItem.body,
      time: "now",
      read: false,
    };

    setNotifications((prev) => [
      newNotification,
      ...prev.map((item) =>
        item.time === "now" ? { ...item, time: "1m" } : item
      ),
    ]);
  }, []);

  React.useEffect(() => {
    if (
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).get("auto") === "false"
    ) {
      return;
    }
    let count = 0;
    const timer = setInterval(() => {
      if (count >= 4) {
        clearInterval(timer);
        return;
      }
      count += 1;
      addArrival();
    }, 4200);

    return () => clearInterval(timer);
  }, [addArrival]);

  const handleRead = React.useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true } : item))
    );
  }, []);

  const handleReadAll = React.useCallback(() => {
    setNotifications((prev) =>
      prev.map((item) => ({ ...item, read: true }))
    );
  }, []);

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
    <div
      style={themeVars as React.CSSProperties}
      className={cn(
        "w-full min-h-screen py-10 px-4 flex flex-col items-center justify-center gap-6 bg-background text-foreground transition-colors duration-200",
        mode === "dark" && "dark"
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs w-full max-w-[460px]">
        <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-0.5 sm:p-1">
          <button
            type="button"
            onClick={() => setMode("light")}
            className={cn(
              "px-2 py-1 rounded-md font-medium transition-colors text-[11px] sm:text-xs",
              mode === "light"
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Light
          </button>
          <button
            type="button"
            onClick={() => setMode("dark")}
            className={cn(
              "px-2 py-1 rounded-md font-medium transition-colors text-[11px] sm:text-xs",
              mode === "dark"
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Dark
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-0.5 sm:p-1">
            {(Object.keys(ACCENTS) as AccentColor[]).map((key) => {
              const sw = ACCENTS[key];
              const isActive = accent === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setAccent(key)}
                  className={cn(
                    "flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors text-[11px] sm:text-xs",
                    isActive
                      ? "bg-muted text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  title={sw.name}
                >
                  <span
                    className={cn(
                      "size-2.5 sm:size-3 rounded-full shrink-0",
                      key === "ink"
                        ? "border border-zinc-400 dark:border-zinc-500"
                        : "border border-black/20"
                    )}
                    style={{ backgroundColor: sw.swatch }}
                  />
                  <span className="hidden min-[420px]:inline">{sw.name}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={addArrival}
            className="px-2.5 py-1.5 rounded-lg border border-border bg-card text-foreground hover:bg-muted font-medium text-[11px] sm:text-xs transition-colors shrink-0"
          >
            Send one
          </button>
        </div>
      </div>

      <div className="relative w-full max-w-[460px] min-h-[560px] border border-foreground bg-background flex flex-col justify-between">
        <header className="h-16 border-b border-foreground px-4 flex items-center justify-between shrink-0">
          <span className="text-2xl font-black uppercase tracking-tight [font-stretch:62%] select-none text-foreground">
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

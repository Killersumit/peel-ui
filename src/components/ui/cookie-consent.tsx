"use client";

import * as React from "react";
import { Cookie, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CookieCategory {
  id: string;
  label: string;
  description: string;
  required?: boolean;
}

export interface CookieConsentProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  categories?: CookieCategory[];
  value?: Record<string, boolean>;
  defaultValue?: Record<string, boolean>;
  onSave?: (choices: Record<string, boolean>) => void;
  defaultView?: "banner" | "button";
  title?: string;
  description?: string;
  policyHref?: string;
  placement?: "bottom-left" | "bottom-right" | "bottom-center";
  fixed?: boolean;
  className?: string;
}

const DEFAULT_CATEGORIES: CookieCategory[] = [
  {
    id: "essential",
    label: "Essential",
    description: "Keeps the site working, like staying signed in.",
    required: true,
  },
  {
    id: "analytics",
    label: "Analytics",
    description: "Shows us which pages are useful. No ads.",
  },
  {
    id: "marketing",
    label: "Marketing",
    description: "Lets us show relevant offers on other sites.",
  },
];

export const CookieConsent = React.forwardRef<HTMLDivElement, CookieConsentProps>(
  function CookieConsent(
    {
      categories = DEFAULT_CATEGORIES,
      value,
      defaultValue,
      onSave,
      defaultView = "banner",
      title = "We use cookies",
      description = "Some keep the site working. Others help us see how it's used. You choose which ones we can use.",
      policyHref,
      placement = "bottom-left",
      fixed = true,
      className,
      ...props
    },
    ref
  ) {
    const isControlled = value !== undefined;
    const [internalChoices, setInternalChoices] = React.useState<
      Record<string, boolean>
    >(() => {
      const initial: Record<string, boolean> = {};
      categories.forEach((cat) => {
        if (cat.required) {
          initial[cat.id] = true;
        } else if (defaultValue && typeof defaultValue[cat.id] === "boolean") {
          initial[cat.id] = defaultValue[cat.id];
        } else {
          initial[cat.id] = false;
        }
      });
      return initial;
    });

    const activeChoices = isControlled ? value : internalChoices;

    const [view, setView] = React.useState<"banner" | "choices" | "saved" | "button">(
      defaultView
    );
    const [liveText, setLiveText] = React.useState<string>("");

    const hasSavedRef = React.useRef(false);
    const openedFromButtonRef = React.useRef(defaultView === "button");
    const saveTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    const choicesHeadingRef = React.useRef<HTMLHeadingElement | null>(null);
    const customizeButtonRef = React.useRef<HTMLButtonElement | null>(null);
    const triggerButtonRef = React.useRef<HTMLButtonElement | null>(null);
    const cardRef = React.useRef<HTMLDivElement | null>(null);

    React.useEffect(() => {
      return () => {
        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      };
    }, []);

    const executeSave = (savedResult: Record<string, boolean>) => {
      hasSavedRef.current = true;
      if (!isControlled) {
        setInternalChoices(savedResult);
      }
      onSave?.(savedResult);
      setLiveText("Preferences saved");
      setView("saved");

      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => {
        const wasFocusedInside =
          cardRef.current &&
          typeof document !== "undefined" &&
          cardRef.current.contains(document.activeElement);

        setView("button");
        if (wasFocusedInside) {
          setTimeout(() => {
            triggerButtonRef.current?.focus();
          }, 30);
        }
      }, 1600);
    };

    const handleAcceptAll = () => {
      const next: Record<string, boolean> = {};
      categories.forEach((cat) => {
        next[cat.id] = true;
      });
      executeSave(next);
    };

    const handleRejectAll = () => {
      const next: Record<string, boolean> = {};
      categories.forEach((cat) => {
        next[cat.id] = !!cat.required;
      });
      executeSave(next);
    };

    const handleSaveChoices = () => {
      const next: Record<string, boolean> = {};
      categories.forEach((cat) => {
        next[cat.id] = cat.required ? true : !!activeChoices[cat.id];
      });
      executeSave(next);
    };

    const handleToggle = (id: string) => {
      if (isControlled) return;
      setInternalChoices((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
    };

    const handleCustomize = () => {
      setView("choices");
      setTimeout(() => {
        choicesHeadingRef.current?.focus();
      }, 30);
    };

    const handleBack = () => {
      if (openedFromButtonRef.current || hasSavedRef.current) {
        setView("button");
        setTimeout(() => {
          triggerButtonRef.current?.focus();
        }, 30);
      } else {
        setView("banner");
        setTimeout(() => {
          customizeButtonRef.current?.focus();
        }, 30);
      }
    };

    const handleOpenFromButton = () => {
      openedFromButtonRef.current = true;
      setView("choices");
      setTimeout(() => {
        choicesHeadingRef.current?.focus();
      }, 30);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        if (view === "choices") {
          e.preventDefault();
          e.stopPropagation();
          handleBack();
        }
      }
    };

    const placementClass =
      placement === "bottom-right"
        ? "right-0 bottom-0"
        : placement === "bottom-center"
          ? "left-1/2 -translate-x-1/2 bottom-0"
          : "left-0 bottom-0";

    const positionClass = fixed ? "fixed z-50" : "absolute z-50";

    const marginClasses =
      placement === "bottom-center"
        ? "mb-[calc(20px+env(safe-area-inset-bottom,0px))] max-[560px]:mb-[calc(12px+env(safe-area-inset-bottom,0px))]"
        : "m-[20px] max-[560px]:m-[12px] mb-[calc(20px+env(safe-area-inset-bottom,0px))] max-[560px]:mb-[calc(12px+env(safe-area-inset-bottom,0px))]";

    if (view === "button") {
      return (
        <button
          ref={triggerButtonRef}
          type="button"
          onClick={handleOpenFromButton}
          aria-label="Cookie settings"
          className={cn(
            positionClass,
            placementClass,
            marginClasses,
            "flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full border border-border bg-card text-card-foreground shadow-[0_1px_2px_rgba(0,0,0,0.05),0_18px_40px_-12px_rgba(0,0,0,0.22)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.2),0_18px_40px_-12px_rgba(0,0,0,0.6)] transition-colors hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card",
            className
          )}
        >
          <Cookie className="h-[20px] w-[20px]" aria-hidden="true" />
        </button>
      );
    }

    return (
      <div
        ref={(el) => {
          cardRef.current = el;
          if (typeof ref === "function") ref(el);
          else if (ref) ref.current = el;
        }}
        role="region"
        aria-label="Cookie consent"
        onKeyDown={handleKeyDown}
        className={cn(
          positionClass,
          placementClass,
          marginClasses,
          "w-[min(380px,calc(100%-40px))] max-[560px]:w-[calc(100%-24px)] rounded-[20px] border border-border bg-card p-[20px] text-card-foreground shadow-[0_1px_2px_rgba(0,0,0,0.05),0_18px_40px_-12px_rgba(0,0,0,0.22)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.2),0_18px_40px_-12px_rgba(0,0,0,0.6)] overflow-hidden",
          className
        )}
        {...props}
      >
        <div role="status" aria-live="polite" className="sr-only">
          {liveText}
        </div>

        {view === "banner" && (
          <div>
            <div className="flex items-center gap-[12px]">
              <div className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[12px] bg-foreground/10 text-foreground">
                <Cookie className="h-[20px] w-[20px]" aria-hidden="true" />
              </div>
              <h2 className="text-[16px] font-semibold tracking-[-0.01em] text-card-foreground">
                {title}
              </h2>
            </div>

            <p className="mt-[12px] text-[14px] leading-[1.55] text-muted-foreground">
              {description}
            </p>

            <div className="mt-[18px] grid grid-cols-2 gap-[8px]">
              <button
                type="button"
                onClick={handleRejectAll}
                className="flex h-[44px] items-center justify-center rounded-[12px] bg-foreground/10 px-3 text-[14px] font-medium text-foreground transition-colors hover:bg-foreground/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
              >
                Reject all
              </button>
              <button
                type="button"
                onClick={handleAcceptAll}
                className="flex h-[44px] items-center justify-center rounded-[12px] bg-primary px-3 text-[14px] font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
              >
                Accept all
              </button>
            </div>

            <div className="mt-[14px] flex items-center justify-between">
              <button
                ref={customizeButtonRef}
                type="button"
                onClick={handleCustomize}
                className="group inline-flex items-center gap-1 rounded-sm text-[13px] text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
              >
                <span>Customize</span>
                <ChevronRight
                  className="h-[14px] w-[14px] transition-transform duration-150 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </button>
              {policyHref && (
                <a
                  href={policyHref}
                  className="rounded-sm text-[13px] text-muted-foreground underline underline-offset-[3px] transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                >
                  Cookie policy
                </a>
              )}
            </div>
          </div>
        )}

        {view === "choices" && (
          <div>
            <div className="flex items-center gap-[8px]">
              <button
                type="button"
                onClick={handleBack}
                aria-label="Back"
                className="-ml-[8px] flex h-[32px] w-[32px] items-center justify-center rounded-[10px] text-card-foreground transition-colors hover:bg-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
              >
                <ChevronLeft className="h-[18px] w-[18px]" aria-hidden="true" />
              </button>
              <h2
                ref={choicesHeadingRef}
                tabIndex={-1}
                className="text-[16px] font-semibold text-card-foreground outline-none"
              >
                Cookie choices
              </h2>
            </div>

            <div className="mt-[8px] divide-y divide-border border-t border-border">
              {categories.map((category) => {
                const isRequired = !!category.required;
                const isChecked = isRequired ? true : !!activeChoices[category.id];
                const descId = `cookie-desc-${category.id}`;
                return (
                  <div
                    key={category.id}
                    className="flex items-center justify-between gap-4 py-[14px]"
                  >
                    <div className="flex flex-col pr-2">
                      <span className="text-[14px] font-medium text-card-foreground">
                        {category.label}
                      </span>
                      <span
                        id={descId}
                        className="mt-0.5 text-[13px] leading-[1.45] text-muted-foreground"
                      >
                        {category.description}
                      </span>
                    </div>
                    {isRequired ? (
                      <span className="rounded-full bg-foreground/10 px-2.5 py-1 text-[12px] text-muted-foreground whitespace-nowrap select-none">
                        Always on
                      </span>
                    ) : (
                      <button
                        type="button"
                        role="switch"
                        aria-checked={isChecked}
                        aria-label={category.label}
                        aria-describedby={descId}
                        onClick={() => handleToggle(category.id)}
                        className={cn(
                          "relative inline-flex h-[26px] w-[42px] shrink-0 cursor-pointer items-center rounded-full p-[3px] transition-colors duration-200 before:absolute before:-inset-y-[9px] before:-inset-x-[3px] before:content-[''] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card",
                          isChecked ? "bg-primary" : "bg-foreground/20"
                        )}
                      >
                        <span
                          className={cn(
                            "pointer-events-none block h-[20px] w-[20px] rounded-full shadow-sm transition-transform duration-200",
                            isChecked
                              ? "translate-x-[16px] bg-primary-foreground"
                              : "translate-x-0 bg-background"
                          )}
                        />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-[6px] grid grid-cols-2 gap-[8px]">
              <button
                type="button"
                onClick={handleAcceptAll}
                className="flex h-[44px] items-center justify-center rounded-[12px] bg-foreground/10 px-3 text-[14px] font-medium text-foreground transition-colors hover:bg-foreground/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
              >
                Accept all
              </button>
              <button
                type="button"
                onClick={handleSaveChoices}
                className="flex h-[44px] items-center justify-center rounded-[12px] bg-primary px-3 text-[14px] font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
              >
                Save choices
              </button>
            </div>
          </div>
        )}

        {view === "saved" && (
          <div className="flex items-center gap-[12px]">
            <div className="flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Check className="h-[14px] w-[14px]" aria-hidden="true" />
            </div>
            <span className="text-[14px] font-medium text-card-foreground">
              Preferences saved
            </span>
          </div>
        )}
      </div>
    );
  }
);

CookieConsent.displayName = "CookieConsent";

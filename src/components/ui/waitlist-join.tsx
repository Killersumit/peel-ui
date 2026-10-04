"use client";

import * as React from "react";
import { Check, Link } from "lucide-react";
import { cn } from "@/lib/utils";

export interface WaitlistJoinProps
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit"> {
  onSubmit?: (
    email: string
  ) => Promise<{ position: number } | void> | { position: number } | void;
  count?: number;
  avatars?: { name: string; src?: string }[];
  inviteUrl?: string;
  placeholder?: string;
  buttonLabel?: string;
  className?: string;
}

const DEFAULT_AVATARS: { name: string; src?: string }[] = [
  { name: "Maya R" },
  { name: "Dev K" },
  { name: "Lena S" },
  { name: "Omar A" },
];

const AVATAR_BG_COLORS = ["#1e2129", "#232730", "#2a2f3a", "#181b22"];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export const WaitlistJoin = React.forwardRef<HTMLFormElement, WaitlistJoinProps>(
  function WaitlistJoin(
    {
      onSubmit,
      count = 1284,
      avatars = DEFAULT_AVATARS,
      inviteUrl,
      placeholder = "name@company.com",
      buttonLabel = "Join waitlist",
      className,
      ...props
    },
    ref
  ) {
    const [email, setEmail] = React.useState("");
    const [status, setStatus] = React.useState<
      "idle" | "submitting" | "success" | "error"
    >("idle");
    const [isInvalid, setIsInvalid] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);
    const [position, setPosition] = React.useState<number | null>(null);
    const [copyState, setCopyState] = React.useState<
      "idle" | "copied" | "error"
    >("idle");
    const [liveMessage, setLiveMessage] = React.useState("");

    const inputRef = React.useRef<HTMLInputElement>(null);
    const cardRef = React.useRef<HTMLDivElement>(null);
    const copyTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(
      null
    );

    const inputId = React.useId();
    const errorId = React.useId();

    React.useEffect(() => {
      if (status === "success") {
        cardRef.current?.focus();
      }
    }, [status]);

    React.useEffect(() => {
      return () => {
        if (copyTimeoutRef.current) {
          clearTimeout(copyTimeoutRef.current);
        }
      };
    }, []);

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(e.target.value);
      if (isInvalid) setIsInvalid(false);
      if (status === "error") setStatus("idle");
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (status === "submitting") return;

      const trimmedEmail = email.trim();
      if (!trimmedEmail || !EMAIL_REGEX.test(trimmedEmail)) {
        setIsInvalid(true);
        setLiveMessage("Enter a valid email");
        inputRef.current?.focus();
        return;
      }

      setStatus("submitting");
      setIsInvalid(false);
      setLiveMessage("Joining the waitlist");

      const startTime = Date.now();
      try {
        let result: { position?: number } | void = undefined;
        if (onSubmit) {
          result = await onSubmit(trimmedEmail);
        }
        const elapsed = Date.now() - startTime;
        if (elapsed < 450) {
          await new Promise((resolve) => setTimeout(resolve, 450 - elapsed));
        }
        const resolvedPosition =
          typeof result?.position === "number" ? result.position : count + 1;
        setPosition(resolvedPosition);
        setStatus("success");
        setLiveMessage(
          `You're in. Your place is ${new Intl.NumberFormat("en-US").format(
            resolvedPosition
          )}.`
        );
      } catch {
        const elapsed = Date.now() - startTime;
        if (elapsed < 450) {
          await new Promise((resolve) => setTimeout(resolve, 450 - elapsed));
        }
        setStatus("error");
        setLiveMessage("Couldn't join. Try again.");
        inputRef.current?.focus();
      }
    };

    const handleCopy = async () => {
      if (!inviteUrl) return;
      try {
        if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(inviteUrl);
          setCopyState("copied");
        } else {
          throw new Error("Clipboard unavailable");
        }
      } catch {
        setCopyState("error");
      }

      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
      copyTimeoutRef.current = setTimeout(() => {
        setCopyState("idle");
      }, 2000);
    };

    const displayedCount = status === "success" ? count + 1 : count;
    const formattedCount = new Intl.NumberFormat("en-US").format(displayedCount);
    const displayedAvatars = avatars.slice(0, 4);

    const isSubmitting = status === "submitting";
    const isSuccess = status === "success";

    const containerBorderClass = isInvalid
      ? "border-[var(--peel-coral,#ff553e)]"
      : isFocused
        ? "border-[var(--peel-border-focus,#f5f5f7)]"
        : "border-[var(--peel-border,#232730)]";

    const resolvedButtonLabel =
      status === "error" ? "Try again" : buttonLabel;

    return (
      <form
        ref={ref}
        onSubmit={handleSubmit}
        noValidate
        className={cn("w-full max-w-[448px] mx-auto", className)}
        {...props}
      >
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {liveMessage}
        </div>

        {!isSuccess ? (
          <>
            <div
              className={cn(
                "relative flex h-[56px] w-full items-center justify-between rounded-[28px] border bg-[var(--peel-surface,#12141a)] pr-[6px] transition-colors",
                containerBorderClass
              )}
            >
              <label htmlFor={inputId} className="sr-only">
                Email address
              </label>
              <input
                ref={inputRef}
                id={inputId}
                type="email"
                autoComplete="email"
                inputMode="email"
                disabled={isSubmitting}
                placeholder={placeholder}
                value={email}
                onChange={handleEmailChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                aria-invalid={isInvalid || status === "error" ? true : undefined}
                aria-describedby={
                  isInvalid || status === "error" ? errorId : undefined
                }
                className="h-full flex-1 min-w-0 bg-transparent pl-[22px] pr-2 text-[16px] font-normal text-[var(--peel-text-primary,#f5f5f7)] placeholder-[var(--peel-text-tertiary,#51555e)] outline-none focus:outline-none focus-visible:outline-none disabled:cursor-not-allowed"
                style={{ outline: "none" }}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex h-[44px] shrink-0 items-center justify-center gap-2 rounded-[22px] bg-[var(--peel-lime,#84ff00)] px-[20px] text-[15px] font-medium text-[var(--peel-lime-foreground,#08090a)] transition-all hover:brightness-105 active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--peel-border-focus,#f5f5f7)] disabled:pointer-events-none"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="h-4 w-4 animate-spin text-[var(--peel-lime-foreground,#08090a)]"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="3"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    <span>Joining</span>
                  </>
                ) : resolvedButtonLabel === "Join waitlist" ? (
                  <>
                    <span className="sr-only">Join waitlist</span>
                    <span
                      aria-hidden="true"
                      className="hidden min-[381px]:inline"
                    >
                      Join waitlist
                    </span>
                    <span aria-hidden="true" className="min-[381px]:hidden">
                      Join
                    </span>
                  </>
                ) : (
                  <span>{resolvedButtonLabel}</span>
                )}
              </button>
            </div>

            {isInvalid && (
              <p
                id={errorId}
                role="alert"
                className="mt-2 text-center text-[13px] text-[var(--peel-coral,#ff553e)]"
              >
                Enter a valid email
              </p>
            )}

            {status === "error" && (
              <p
                id={errorId}
                role="alert"
                className="mt-2 text-center text-[13px] text-[var(--peel-coral,#ff553e)]"
              >
                Couldn&apos;t join. Try again.
              </p>
            )}
          </>
        ) : (
          <div
            ref={cardRef}
            tabIndex={-1}
            className="w-full rounded-[20px] border border-[var(--peel-border,#232730)] bg-[var(--peel-surface,#12141a)] p-[20px] outline-none focus:outline-none focus:ring-0"
          >
            <div className="flex items-start gap-3.5">
              <div className="mt-0.5 flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-full bg-[var(--peel-lime,#84ff00)] text-[var(--peel-lime-foreground,#08090a)]">
                <Check className="h-4 w-4 stroke-[2.5]" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-[20px] font-semibold leading-tight text-[var(--peel-text-primary,#f5f5f7)]">
                  You&apos;re in
                </h3>
                <p className="mt-1 truncate text-[14px] text-[var(--peel-text-secondary,#8a8f98)]">
                  We&apos;ll email you at {email}.
                </p>
              </div>
            </div>

            <div className="my-[16px] h-px w-full bg-[var(--peel-border-subtle,#1a1d24)]" />

            <div className="flex items-center justify-between gap-4 max-[400px]:flex-col max-[400px]:items-stretch">
              <div className="flex flex-col">
                <span className="text-[13px] text-[var(--peel-text-secondary,#8a8f98)]">
                  Your place in line
                </span>
                <span className="mt-1 text-[40px] font-semibold leading-none tabular-nums text-[var(--peel-text-primary,#f5f5f7)]">
                  #{new Intl.NumberFormat("en-US").format(position ?? count + 1)}
                </span>
              </div>

              {inviteUrl && (
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex h-[40px] shrink-0 whitespace-nowrap items-center justify-center gap-2 rounded-[20px] border border-[var(--peel-border-strong,#3a3f4a)] px-[16px] text-[14px] font-medium text-[var(--peel-text-primary,#f5f5f7)] transition-colors hover:bg-[var(--peel-surface-hover,#181b22)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--peel-border-focus,#f5f5f7)] max-[400px]:w-full"
                >
                  {copyState === "copied" ? (
                    <>
                      <Check className="h-4 w-4 shrink-0 text-[var(--peel-lime,#84ff00)]" />
                      <span>Link copied</span>
                    </>
                  ) : copyState === "error" ? (
                    <span>Couldn&apos;t copy</span>
                  ) : (
                    <>
                      <Link className="h-4 w-4 shrink-0" />
                      <span>Copy invite link</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}

        <div className="mt-4 flex items-center justify-center gap-[10px]">
          <div className="flex items-center">
            {displayedAvatars.map((avatar, i) => (
              <div
                key={i}
                className={cn(
                  "flex h-[28px] w-[28px] shrink-0 items-center justify-center overflow-hidden rounded-full ring-2 ring-[var(--peel-base,#08090a)]",
                  i > 0 && "-ml-[8px]"
                )}
                style={{
                  backgroundColor:
                    AVATAR_BG_COLORS[i % AVATAR_BG_COLORS.length],
                }}
              >
                {avatar.src ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={avatar.src}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-[11px] font-medium text-[var(--peel-text-secondary,#8a8f98)]">
                    {getInitials(avatar.name)}
                  </span>
                )}
              </div>
            ))}
          </div>
          <p className="text-[14px]">
            <span className="font-medium text-[var(--peel-text-primary,#f5f5f7)]">
              {formattedCount}
            </span>
            <span className="text-[var(--peel-text-secondary,#8a8f98)]">
              {" "}people joined
            </span>
          </p>
        </div>
      </form>
    );
  }
);

WaitlistJoin.displayName = "WaitlistJoin";

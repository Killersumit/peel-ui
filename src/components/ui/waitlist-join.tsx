"use client";

import * as React from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
} from "motion/react";
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

const springLayout = {
  type: "spring" as const,
  stiffness: 380,
  damping: 32,
  mass: 1,
};

const springPress = {
  type: "spring" as const,
  stiffness: 600,
  damping: 38,
  mass: 0.6,
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function PositionNumber({
  position,
  shouldReduceMotion,
}: {
  position: number;
  shouldReduceMotion: boolean | null;
}) {
  const nodeRef = React.useRef<HTMLSpanElement>(null);
  const start = Math.max(1, position - 25);
  const motionVal = useMotionValue(start);

  React.useEffect(() => {
    if (shouldReduceMotion) {
      if (nodeRef.current) {
        nodeRef.current.textContent =
          "#" + new Intl.NumberFormat("en-US").format(position);
      }
      return;
    }

    if (nodeRef.current) {
      nodeRef.current.textContent =
        "#" + new Intl.NumberFormat("en-US").format(start);
    }

    const controls = animate(motionVal, position, {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        if (nodeRef.current) {
          nodeRef.current.textContent =
            "#" + new Intl.NumberFormat("en-US").format(Math.round(latest));
        }
      },
    });

    return () => controls.stop();
  }, [position, motionVal, shouldReduceMotion, start]);

  return (
    <span
      ref={nodeRef}
      className="mt-1 text-[40px] font-semibold leading-none tabular-nums text-[var(--peel-text-primary,#f5f5f7)]"
    >
      #{new Intl.NumberFormat("en-US").format(position)}
    </span>
  );
}

function SocialCount({
  count,
  isSuccess,
  shouldReduceMotion,
}: {
  count: number;
  isSuccess: boolean;
  shouldReduceMotion: boolean | null;
}) {
  const prevStr = new Intl.NumberFormat("en-US").format(count);
  const nextStr = new Intl.NumberFormat("en-US").format(count + 1);
  const currentStr = isSuccess ? nextStr : prevStr;

  return (
    <span className="inline-flex h-[1.2em] items-center overflow-hidden font-medium text-[var(--peel-text-primary,#f5f5f7)]">
      {currentStr.split("").map((char, index) => {
        const prevChar = prevStr[index];
        const hasChanged = isSuccess && char !== prevChar;

        if (!hasChanged || shouldReduceMotion) {
          return <span key={index}>{char}</span>;
        }

        return (
          <span
            key={index}
            className="relative inline-block h-[1.2em] overflow-hidden"
          >
            <motion.span
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="inline-block"
            >
              {char}
            </motion.span>
          </span>
        );
      })}
    </span>
  );
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
    const shouldReduceMotion = useReducedMotion();
    const [email, setEmail] = React.useState("");
    const [status, setStatus] = React.useState<
      "idle" | "submitting" | "success" | "error"
    >("idle");
    const [isInvalid, setIsInvalid] = React.useState(false);
    const [shakeTrigger, setShakeTrigger] = React.useState(0);
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
        setShakeTrigger((prev) => prev + 1);
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

        <motion.div
          layout
          transition={shouldReduceMotion ? { duration: 0 } : springLayout}
          animate={
            shakeTrigger > 0 && !shouldReduceMotion
              ? { x: [0, -6, 6, -4, 3, 0] }
              : { x: 0 }
          }
          style={{
            borderRadius: isSuccess ? 20 : 28,
          }}
          className={cn(
            "relative w-full overflow-hidden border bg-[var(--peel-surface,#12141a)] transition-colors",
            containerBorderClass,
            !isSuccess ? "h-[56px] pr-[6px]" : "p-[20px]"
          )}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {!isSuccess ? (
              <motion.div
                key="form-fields"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: shouldReduceMotion ? 0.1 : 0.12,
                  ease: "easeOut",
                }}
                className="flex h-full w-full items-center justify-between"
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
                  aria-invalid={
                    isInvalid || status === "error" ? true : undefined
                  }
                  aria-describedby={
                    isInvalid || status === "error" ? errorId : undefined
                  }
                  className="h-full flex-1 min-w-0 bg-transparent pl-[22px] pr-2 text-[16px] font-normal text-[var(--peel-text-primary,#f5f5f7)] placeholder-[var(--peel-text-tertiary,#51555e)] outline-none focus:outline-none focus-visible:outline-none disabled:cursor-not-allowed"
                  style={{ outline: "none" }}
                />
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
                  transition={springPress}
                  className="flex h-[44px] shrink-0 items-center justify-center gap-2 rounded-[22px] bg-[var(--peel-lime,#84ff00)] px-[20px] text-[15px] font-medium text-[var(--peel-lime-foreground,#08090a)] transition-colors hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--peel-border-focus,#f5f5f7)] disabled:pointer-events-none"
                >
                  {isSubmitting ? (
                    <>
                      <motion.svg
                        animate={
                          shouldReduceMotion ? undefined : { rotate: 360 }
                        }
                        transition={
                          shouldReduceMotion
                            ? undefined
                            : {
                                repeat: Infinity,
                                duration: 0.8,
                                ease: "linear",
                              }
                        }
                        className="h-4 w-4 text-[var(--peel-lime-foreground,#08090a)]"
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
                      </motion.svg>
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
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="confirmation-card"
                ref={(el) => {
                  cardRef.current = el;
                  el?.focus();
                }}
                tabIndex={-1}
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      delayChildren: shouldReduceMotion ? 0 : 0.1,
                      staggerChildren: shouldReduceMotion ? 0 : 0.05,
                    },
                  },
                }}
                className="w-full outline-none focus:outline-none focus:ring-0"
              >
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 8 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: shouldReduceMotion ? 0.1 : 0.25,
                        ease: "easeOut",
                      },
                    },
                  }}
                  className="flex items-start gap-3.5"
                >
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
                </motion.div>

                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 8 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: shouldReduceMotion ? 0.1 : 0.25,
                        ease: "easeOut",
                      },
                    },
                  }}
                  className="my-[16px] h-px w-full bg-[var(--peel-border-subtle,#1a1d24)]"
                />

                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 8 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: shouldReduceMotion ? 0.1 : 0.25,
                        ease: "easeOut",
                      },
                    },
                  }}
                  className="flex items-center justify-between gap-4 max-[400px]:flex-col max-[400px]:items-stretch"
                >
                  <div className="flex flex-col">
                    <span className="text-[13px] text-[var(--peel-text-secondary,#8a8f98)]">
                      Your place in line
                    </span>
                    <PositionNumber
                      position={position ?? count + 1}
                      shouldReduceMotion={shouldReduceMotion}
                    />
                  </div>

                  {inviteUrl && (
                    <motion.button
                      type="button"
                      onClick={handleCopy}
                      whileTap={
                        shouldReduceMotion ? undefined : { scale: 0.97 }
                      }
                      transition={springPress}
                      className="flex h-[40px] shrink-0 whitespace-nowrap items-center justify-center gap-2 rounded-[20px] border border-[var(--peel-border-strong,#3a3f4a)] px-[16px] text-[14px] font-medium text-[var(--peel-text-primary,#f5f5f7)] transition-colors hover:bg-[var(--peel-surface-hover,#181b22)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--peel-border-focus,#f5f5f7)] max-[400px]:w-full"
                    >
                      {copyState === "copied" ? (
                        <>
                          <Check className="h-4 w-4 shrink-0 text-[var(--peel-lime,#84ff00)]" />
                          <span>Link copied</span>
                        </>
                      ) : copyState === "error" ? (
                        <span role="alert">Couldn&apos;t copy</span>
                      ) : (
                        <>
                          <Link className="h-4 w-4 shrink-0" />
                          <span>Copy invite link</span>
                        </>
                      )}
                    </motion.button>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {!isSuccess && isInvalid && (
          <p
            id={errorId}
            role="alert"
            className="mt-2 text-center text-[13px] text-[var(--peel-coral,#ff553e)]"
          >
            Enter a valid email
          </p>
        )}

        {!isSuccess && status === "error" && (
          <p
            id={errorId}
            role="alert"
            className="mt-2 text-center text-[13px] text-[var(--peel-coral,#ff553e)]"
          >
            Couldn&apos;t join. Try again.
          </p>
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
            <SocialCount
              count={count}
              isSuccess={isSuccess}
              shouldReduceMotion={shouldReduceMotion}
            />
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

"use client";

import * as React from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(Flip);
}

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

export interface InviteFieldProps {
  value?: string[];
  defaultValue?: string[];
  onChange?: (emails: string[]) => void;
  onSend?: (validEmails: string[]) => void | Promise<void>;
  label?: string;
  sentLabel?: string;
  placeholder?: string;
  className?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type FlipState = ReturnType<typeof Flip.getState>;

const isReducedMotion = () => {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

export function InviteField({
  value,
  defaultValue = [],
  onChange,
  onSend,
  label = "Invite teammates",
  sentLabel = "Invites sent",
  placeholder = "name@company.com",
  className,
}: InviteFieldProps) {
  const isControlled = value !== undefined;
  const [uncontrolledEmails, setUncontrolledEmails] =
    React.useState<string[]>(defaultValue);
  const emails = isControlled ? value : uncontrolledEmails;

  const [inputValue, setInputValue] = React.useState("");
  const [announcement, setAnnouncement] = React.useState("");
  const [isSending, setIsSending] = React.useState(false);
  const [sendError, setSendError] = React.useState<string | null>(null);
  const [isSent, setIsSent] = React.useState(false);

  const inputId = React.useId();
  const metaId = React.useId();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const isComposingRef = React.useRef(false);

  const pendingAddRef = React.useRef<{
    emails: string[];
    inputRect: DOMRect;
    state: FlipState;
  } | null>(null);
  const pendingRemoveRef = React.useRef<{ state: FlipState } | null>(null);
  const pendingPullBackRef = React.useRef<{
    state: FlipState;
    chipRect?: DOMRect;
  } | null>(null);
  const pendingSentRef = React.useRef<{ state: FlipState } | null>(null);

  useGSAP(
    () => {
      return () => {
        gsap.killTweensOf("*");
      };
    },
    { scope: containerRef }
  );

  const validEmails = React.useMemo(
    () => emails.filter((email) => EMAIL_REGEX.test(email)),
    [emails]
  );
  const validCount = validEmails.length;
  const invalidCount = emails.length - validCount;

  useIsomorphicLayoutEffect(() => {
    if (isReducedMotion() || !containerRef.current) return;

    if (pendingAddRef.current) {
      const {
        emails: addedParts,
        inputRect: oldInputRect,
        state: flipState,
      } = pendingAddRef.current;
      pendingAddRef.current = null;

      const allChips = Array.from(
        containerRef.current.querySelectorAll<HTMLElement>("[data-chip-email]")
      );
      const existingChips = allChips.filter((el) => {
        const mail = el.getAttribute("data-chip-email");
        return mail && !addedParts.includes(mail);
      });

      Flip.from(flipState, {
        targets: [...existingChips, inputRef.current].filter(Boolean),
        duration: 0.32,
        ease: "power3.out",
        scale: false,
      });

      addedParts.forEach((part, i) => {
        const chipEl = allChips.find(
          (el) => el.getAttribute("data-chip-email") === part
        );
        if (!chipEl) return;
        const chipRect = chipEl.getBoundingClientRect();
        const targetX = oldInputRect.left - 12;
        const targetY =
          oldInputRect.top - (chipRect.height - oldInputRect.height) / 2;
        const dx = targetX - chipRect.left;
        const dy = targetY - chipRect.top;
        const delay = i * 0.045;

        gsap.fromTo(
          chipEl,
          { x: dx, y: dy },
          { x: 0, y: 0, duration: 0.36, ease: "power3.out", delay }
        );
        gsap.fromTo(
          chipEl,
          { opacity: 0 },
          { opacity: 1, duration: 0.36 * 0.25, ease: "power3.out", delay }
        );
      });
    } else if (pendingRemoveRef.current) {
      const { state: flipState } = pendingRemoveRef.current;
      pendingRemoveRef.current = null;
      Flip.from(flipState, {
        duration: 0.32,
        ease: "power3.out",
        scale: false,
      });
    } else if (pendingPullBackRef.current) {
      const { state: flipState, chipRect: oldChipRect } =
        pendingPullBackRef.current;
      pendingPullBackRef.current = null;

      Flip.from(flipState, {
        duration: 0.32,
        ease: "power3.out",
        scale: false,
      });

      if (oldChipRect && inputRef.current) {
        const inputRect = inputRef.current.getBoundingClientRect();
        const dx = oldChipRect.left - inputRect.left;
        const dy = oldChipRect.top - inputRect.top;
        gsap.fromTo(
          inputRef.current,
          { x: dx, y: dy },
          { x: 0, y: 0, duration: 0.32, ease: "power3.out" }
        );
      }
    } else if (pendingSentRef.current) {
      const { state: flipState } = pendingSentRef.current;
      pendingSentRef.current = null;

      Flip.from(flipState, {
        duration: 0.32,
        ease: "power3.out",
        scale: false,
        stagger: 0.04,
      });

      const rowBgs =
        containerRef.current.querySelectorAll<HTMLElement>("[data-row-bg]");
      if (rowBgs.length > 0) {
        gsap.to(rowBgs, {
          opacity: 0,
          duration: 0.3,
          ease: "power3.out",
          stagger: 0.04,
        });
      }

      const checkPaths =
        containerRef.current.querySelectorAll<SVGPathElement>(
          "[data-check-path]"
        );
      if (checkPaths.length > 0) {
        checkPaths.forEach((path, i) => {
          gsap.fromTo(
            path,
            { strokeDashoffset: 14 },
            {
              strokeDashoffset: 0,
              duration: 0.35,
              ease: "power2.out",
              delay: 0.32 + 0.12 + i * 0.04 + i * 0.09,
            }
          );
        });
      }
    }
  }, [emails, isSent]);

  const commitEmails = React.useCallback(
    (raw: string) => {
      const parts = raw
        .split(/[\s,;]+/)
        .map((p) => p.trim().toLowerCase())
        .filter(Boolean);

      if (parts.length === 0) return;

      const next = [...emails];
      const addedParts: string[] = [];
      let foundDupIndex: number | null = null;

      for (const part of parts) {
        const existingIndex = next.indexOf(part);
        if (existingIndex !== -1) {
          foundDupIndex = existingIndex;
        } else {
          next.push(part);
          addedParts.push(part);
        }
      }

      if (foundDupIndex !== null && addedParts.length === 0) {
        setAnnouncement(`${next[foundDupIndex]} already added`);
        if (!isReducedMotion() && containerRef.current) {
          const dupEl = Array.from(
            containerRef.current.querySelectorAll<HTMLElement>(
              "[data-chip-email]"
            )
          ).find(
            (el) => el.getAttribute("data-chip-email") === next[foundDupIndex!]
          );
          if (dupEl) {
            gsap.fromTo(
              dupEl,
              { boxShadow: "0 0 0 2px var(--foreground, #f5f5f7)" },
              {
                boxShadow: "0 0 0 0px transparent",
                duration: 0.5,
                ease: "power3.out",
              }
            );
          }
        }
      }

      if (addedParts.length > 0) {
        if (
          typeof window !== "undefined" &&
          !isReducedMotion() &&
          containerRef.current &&
          inputRef.current
        ) {
          const inputRect = inputRef.current.getBoundingClientRect();
          const chipEls = Array.from(
            containerRef.current.querySelectorAll<HTMLElement>(
              "[data-chip-email]"
            )
          );
          const flipTargets = [...chipEls, inputRef.current];
          const flipState = Flip.getState(flipTargets);
          pendingAddRef.current = {
            emails: addedParts,
            inputRect,
            state: flipState,
          };
        }

        if (!isControlled) {
          setUncontrolledEmails(next);
        }
        onChange?.(next);
        setSendError(null);
        if (addedParts.length === 1) {
          setAnnouncement(`${addedParts[0]} added`);
        } else {
          setAnnouncement(`${addedParts.length} emails added`);
        }
      }

      setInputValue("");
    },
    [emails, isControlled, onChange]
  );

  const removeChip = React.useCallback(
    (indexToRemove: number) => {
      const emailToRemove = emails[indexToRemove];
      if (!emailToRemove) return;

      if (isReducedMotion() || !containerRef.current) {
        const next = emails.filter((_, idx) => idx !== indexToRemove);
        if (!isControlled) setUncontrolledEmails(next);
        onChange?.(next);
        setAnnouncement(`${emailToRemove} removed`);
        return;
      }

      const chipEl = Array.from(
        containerRef.current.querySelectorAll<HTMLElement>("[data-chip-email]")
      ).find((el) => el.getAttribute("data-chip-email") === emailToRemove);

      const performRemoval = () => {
        const remainingChipEls = Array.from(
          containerRef.current?.querySelectorAll<HTMLElement>(
            "[data-chip-email]"
          ) || []
        ).filter((el) => el !== chipEl);
        const flipState = Flip.getState(
          [...remainingChipEls, inputRef.current].filter(Boolean)
        );
        pendingRemoveRef.current = { state: flipState };

        const next = emails.filter((_, idx) => idx !== indexToRemove);
        if (!isControlled) setUncontrolledEmails(next);
        onChange?.(next);
        setAnnouncement(`${emailToRemove} removed`);
      };

      if (chipEl) {
        gsap.to(chipEl, {
          opacity: 0,
          duration: 0.14,
          ease: "power3.out",
          onComplete: performRemoval,
        });
      } else {
        performRemoval();
      }
    },
    [emails, isControlled, onChange]
  );

  const handleChipClick = React.useCallback(
    (emailToEdit: string, indexToEdit: number) => {
      if (inputValue.trim()) {
        commitEmails(inputValue);
      }

      if (isReducedMotion() || !containerRef.current) {
        const next = emails.filter((_, idx) => idx !== indexToEdit);
        if (!isControlled) setUncontrolledEmails(next);
        onChange?.(next);
        setInputValue(emailToEdit);
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
            inputRef.current.setSelectionRange(
              emailToEdit.length,
              emailToEdit.length
            );
          }
        }, 0);
        return;
      }

      const chipEl = Array.from(
        containerRef.current.querySelectorAll<HTMLElement>("[data-chip-email]")
      ).find((el) => el.getAttribute("data-chip-email") === emailToEdit);
      const chipRect = chipEl?.getBoundingClientRect();

      const otherChipEls = Array.from(
        containerRef.current.querySelectorAll<HTMLElement>("[data-chip-email]")
      ).filter((el) => el !== chipEl);
      const flipState = Flip.getState(otherChipEls);

      pendingPullBackRef.current = { state: flipState, chipRect };

      const next = emails.filter((_, idx) => idx !== indexToEdit);
      if (!isControlled) setUncontrolledEmails(next);
      onChange?.(next);
      setInputValue(emailToEdit);

      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.setSelectionRange(
            emailToEdit.length,
            emailToEdit.length
          );
        }
      }, 0);
    },
    [emails, inputValue, isControlled, onChange, commitEmails]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isComposingRef.current) return;

    if (e.key === "Enter" || e.key === "," || e.key === ";" || e.key === " ") {
      e.preventDefault();
      if (inputValue.trim()) {
        commitEmails(inputValue);
      }
      return;
    }

    if (e.key === "Tab") {
      if (inputValue.trim()) {
        e.preventDefault();
        commitEmails(inputValue);
      }
      return;
    }

    if (e.key === "Backspace" && inputValue === "" && emails.length > 0) {
      e.preventDefault();
      const lastIndex = emails.length - 1;
      const lastEmail = emails[lastIndex];
      handleChipClick(lastEmail, lastIndex);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/[\s,;]/.test(val)) {
      commitEmails(val);
    } else {
      setInputValue(val);
      if (sendError) setSendError(null);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData("text");
    if (/[\s,;]/.test(text)) {
      e.preventDefault();
      const combined = inputValue ? `${inputValue} ${text}` : text;
      commitEmails(combined);
    }
  };

  const handleBlur = () => {
    if (inputValue.trim()) {
      commitEmails(inputValue);
    }
  };

  const handleSend = async () => {
    if (isSending || validCount === 0 || invalidCount > 0) return;
    setIsSending(true);
    setSendError(null);
    const startTime = Date.now();
    try {
      if (onSend) {
        await onSend(validEmails);
      }
      const elapsed = Date.now() - startTime;
      if (elapsed < 450) {
        await new Promise((r) => setTimeout(r, 450 - elapsed));
      }

      if (
        typeof window !== "undefined" &&
        !isReducedMotion() &&
        containerRef.current
      ) {
        const chipEls = Array.from(
          containerRef.current.querySelectorAll<HTMLElement>("[data-flip-id]")
        );
        const flipState = Flip.getState(chipEls);
        pendingSentRef.current = { state: flipState };
      }

      setIsSent(true);
      setAnnouncement(
        `${validCount} ${validCount === 1 ? "invite" : "invites"} sent`
      );
    } catch {
      setSendError("Couldn't send. Try again.");
    } finally {
      setIsSending(false);
    }
  };

  const handleInviteMore = () => {
    setIsSent(false);
    if (!isControlled) {
      setUncontrolledEmails([]);
    }
    onChange?.([]);
    setInputValue("");
    setSendError(null);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  if (isSent) {
    return (
      <div
        ref={containerRef}
        className={cn("w-full text-foreground", className)}
      >
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {announcement}
        </div>
        <p className="mb-3 text-[14.5px] font-medium text-foreground">
          {sentLabel}
        </p>
        <ul className="m-0 list-none p-0 w-full">
          {validEmails.map((email, idx) => {
            const atIndex = email.indexOf("@");
            const name = atIndex !== -1 ? email.slice(0, atIndex) : email;
            const domain = atIndex !== -1 ? email.slice(atIndex) : "";
            return (
              <li
                key={`${email}-${idx}`}
                data-flip-id={`email-${email}`}
                className="relative flex h-[46px] w-full items-center justify-between border-b border-border text-[14px]"
              >
                <div
                  data-row-bg
                  className="pointer-events-none absolute inset-0 bg-muted rounded-full"
                  style={{ opacity: isReducedMotion() ? 0 : 1 }}
                />
                <div className="flex items-baseline relative z-10">
                  <span className="font-medium text-foreground">{name}</span>
                  <span className="text-muted-foreground">{domain}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground relative z-10">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-foreground shrink-0"
                    aria-hidden="true"
                  >
                    <path
                      data-check-path
                      d="M2.5 7.5L5.5 10.5L11.5 3.5"
                      style={{
                        strokeDasharray: 14,
                        strokeDashoffset: isReducedMotion() ? 0 : 14,
                      }}
                    />
                  </svg>
                  <span>Invited</span>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="mt-4 flex items-center justify-between text-[13px]">
          <span className="text-muted-foreground">
            {validCount} {validCount === 1 ? "invite" : "invites"} sent just now
          </span>
          <button
            type="button"
            onClick={handleInviteMore}
            className="rounded-sm font-medium text-foreground underline underline-offset-[3px] transition-colors hover:text-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Invite more
          </button>
        </div>
      </div>
    );
  }

  const sendButtonText = isSending
    ? "Sending…"
    : validCount > 0
      ? `Send ${validCount} ${validCount === 1 ? "invite" : "invites"}`
      : "Send invites";

  return (
    <div
      ref={containerRef}
      className={cn("w-full text-foreground", className)}
    >
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>

      <label
        htmlFor={inputId}
        className="mb-3 block text-[14.5px] font-medium text-foreground"
      >
        {label}
      </label>

      <div
        onClick={() => inputRef.current?.focus()}
        className="flex flex-wrap items-center gap-2 border-b border-border pb-3 transition-colors duration-200 focus-within:border-foreground cursor-text"
      >
        <ul className="contents list-none p-0 m-0">
          {emails.map((email, idx) => {
            const isInvalid = !EMAIL_REGEX.test(email);
            const atIndex = email.indexOf("@");
            const name = atIndex !== -1 ? email.slice(0, atIndex) : email;
            const domain = atIndex !== -1 ? email.slice(atIndex) : "";

            return (
              <li
                key={`${email}-${idx}`}
                data-chip-email={email}
                data-flip-id={`email-${email}`}
                className="inline-flex m-0 p-0"
              >
                <div
                  className={cn(
                    "group inline-flex items-center rounded-full py-1 pl-3 pr-2 text-[13px] leading-tight transition-colors",
                    isInvalid
                      ? "bg-destructive/10 text-destructive"
                      : "bg-muted text-foreground"
                  )}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleChipClick(email, idx);
                    }}
                    aria-label={`Edit ${email}`}
                    className="flex items-baseline cursor-pointer text-left focus-visible:outline-none"
                  >
                    <span className="font-medium">{name}</span>
                    <span
                      className={
                        isInvalid
                          ? "text-destructive/80"
                          : "text-muted-foreground"
                      }
                    >
                      {domain}
                    </span>
                    {isInvalid && (
                      <span className="sr-only">, invalid email</span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeChip(idx);
                    }}
                    aria-label={`Remove ${email}`}
                    className={cn(
                      "ml-1 flex size-5 items-center justify-center rounded-full text-[13px] leading-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      isInvalid
                        ? "text-destructive/70 hover:text-destructive"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    x
                  </button>
                </div>
              </li>
            );
          })}
        </ul>

        <input
          ref={inputRef}
          id={inputId}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onBlur={handleBlur}
          onCompositionStart={() => {
            isComposingRef.current = true;
          }}
          onCompositionEnd={() => {
            isComposingRef.current = false;
          }}
          placeholder={placeholder}
          style={{ outline: "none" }}
          className="h-8 min-w-[150px] flex-1 border-none bg-transparent p-0 text-[13px] text-foreground placeholder:text-muted-foreground outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0"
        />
      </div>

      <div
        id={metaId}
        className="mb-6 mt-3 flex items-center justify-between text-[13px] text-muted-foreground"
      >
        <div>
          {sendError ? (
            <span className="text-destructive font-medium">{sendError}</span>
          ) : emails.length === 0 ? (
            <span>Add at least one email.</span>
          ) : (
            <span>
              {validCount} {validCount === 1 ? "person" : "people"}
              {invalidCount > 0 && (
                <span className="text-destructive font-medium">
                  {` · ${invalidCount} ${invalidCount === 1 ? "needs" : "need"} fixing`}
                </span>
              )}
            </span>
          )}
        </div>
        <div>Press Enter or comma to add</div>
      </div>

      <button
        type="button"
        onClick={handleSend}
        disabled={isSending || validCount === 0 || invalidCount > 0}
        aria-describedby={metaId}
        className={cn(
          "w-full rounded-xl bg-primary py-3 text-[14px] font-medium text-primary-foreground transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-40"
        )}
      >
        {sendButtonText}
      </button>
    </div>
  );
}
InviteField.displayName = "InviteField";

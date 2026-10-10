"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

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
  const [uncontrolledEmails, setUncontrolledEmails] = React.useState<string[]>(defaultValue);
  const emails = isControlled ? value : uncontrolledEmails;

  const [inputValue, setInputValue] = React.useState("");
  const [duplicateIndex, setDuplicateIndex] = React.useState<number | null>(null);
  const [announcement, setAnnouncement] = React.useState("");
  const [isSending, setIsSending] = React.useState(false);
  const [sendError, setSendError] = React.useState<string | null>(null);
  const [isSent, setIsSent] = React.useState(false);

  const inputId = React.useId();
  const metaId = React.useId();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const isComposingRef = React.useRef(false);
  const pulseTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    return () => {
      if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current);
    };
  }, []);

  const validEmails = React.useMemo(
    () => emails.filter((email) => EMAIL_REGEX.test(email)),
    [emails]
  );
  const validCount = validEmails.length;
  const invalidCount = emails.length - validCount;

  const commitEmails = React.useCallback(
    (raw: string) => {
      const parts = raw
        .split(/[\s,;]+/)
        .map((p) => p.trim().toLowerCase())
        .filter(Boolean);

      if (parts.length === 0) return;

      const next = [...emails];
      let addedCount = 0;
      let lastAdded = "";
      let foundDupIndex: number | null = null;

      for (const part of parts) {
        const existingIndex = next.indexOf(part);
        if (existingIndex !== -1) {
          foundDupIndex = existingIndex;
        } else {
          next.push(part);
          addedCount++;
          lastAdded = part;
        }
      }

      if (foundDupIndex !== null && addedCount === 0) {
        setDuplicateIndex(foundDupIndex);
        if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current);
        pulseTimerRef.current = setTimeout(() => {
          setDuplicateIndex(null);
        }, 500);
        setAnnouncement(`${next[foundDupIndex]} already added`);
      }

      if (addedCount > 0) {
        if (!isControlled) {
          setUncontrolledEmails(next);
        }
        onChange?.(next);
        setSendError(null);
        if (addedCount === 1) {
          setAnnouncement(`${lastAdded} added`);
        } else {
          setAnnouncement(`${addedCount} emails added`);
        }
      }

      setInputValue("");
    },
    [emails, isControlled, onChange]
  );

  const editChip = React.useCallback(
    (index: number) => {
      if (inputValue.trim()) {
        commitEmails(inputValue);
      }
      const target = emails[index];
      const next = emails.filter((_, i) => i !== index);
      if (!isControlled) {
        setUncontrolledEmails(next);
      }
      onChange?.(next);
      setInputValue(target);
      setSendError(null);
      inputRef.current?.focus();
      requestAnimationFrame(() => {
        if (inputRef.current) {
          inputRef.current.selectionStart = target.length;
          inputRef.current.selectionEnd = target.length;
        }
      });
    },
    [commitEmails, emails, inputValue, isControlled, onChange]
  );

  const removeChip = React.useCallback(
    (index: number) => {
      const removed = emails[index];
      const next = emails.filter((_, i) => i !== index);
      if (!isControlled) {
        setUncontrolledEmails(next);
      }
      onChange?.(next);
      setSendError(null);
      setAnnouncement(`${removed} removed`);
    },
    [emails, isControlled, onChange]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isComposingRef.current) return;

    if (e.key === "Enter" || e.key === "," || e.key === ";" || e.key === " ") {
      if (inputValue.trim()) {
        e.preventDefault();
        commitEmails(inputValue);
      } else if (e.key === " ") {
        e.preventDefault();
      }
    } else if (e.key === "Tab") {
      if (inputValue.trim()) {
        e.preventDefault();
        commitEmails(inputValue);
      }
    } else if (e.key === "Backspace") {
      if (inputValue === "" && emails.length > 0) {
        e.preventDefault();
        editChip(emails.length - 1);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (isComposingRef.current) {
      setInputValue(val);
      return;
    }
    // Mobile keyboards often emit trailing separator without a keydown event
    if (/[,;\s]$/.test(val)) {
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
    try {
      if (onSend) {
        await onSend(validEmails);
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
    if (!isControlled) {
      setUncontrolledEmails([]);
    }
    onChange?.([]);
    setIsSent(false);
    setSendError(null);
    setInputValue("");
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  if (isSent) {
    return (
      <div className={cn("w-full select-none text-foreground", className)}>
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
                className="flex h-[46px] w-full items-center justify-between border-b border-border text-[14px]"
              >
                <div className="flex items-baseline">
                  <span className="font-medium text-foreground">{name}</span>
                  <span className="text-muted-foreground">{domain}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
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
                    <path d="M2.5 7.5L5.5 10.5L11.5 3.5" />
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
    <div className={cn("w-full text-foreground", className)}>
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
              <li key={`${email}-${idx}`} className="inline-flex items-center">
                <div
                  className={cn(
                    "inline-flex h-8 items-center rounded-full pl-3 pr-1.5 transition-all text-[13px] select-none",
                    isInvalid
                      ? "bg-destructive/10 text-destructive"
                      : "bg-muted text-foreground",
                    duplicateIndex === idx && "ring-2 ring-foreground"
                  )}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      editChip(idx);
                    }}
                    aria-label={`Edit ${email}`}
                    className="inline-flex items-baseline rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span
                      className={cn(
                        "font-medium",
                        isInvalid && "text-destructive"
                      )}
                    >
                      {name}
                    </span>
                    <span
                      className={cn(
                        isInvalid ? "text-destructive" : "text-muted-foreground"
                      )}
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

"use client";

import * as React from "react";
import { LayoutGroup, motion, useReducedMotion } from "motion/react";

export interface FilterChipOption {
  id: string;
  label: string;
  count?: number;
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
}

export interface FilterChipsProps {
  options: FilterChipOption[];
  value?: string | string[];
  defaultValue?: string | string[];
  onChange?: (value: string | string[]) => void;
  mode?: "single" | "multiple";
  size?: "sm" | "md";
  showClear?: boolean;
  className?: string;
}

const springTransition = {
  type: "spring" as const,
  stiffness: 450,
  damping: 32,
  mass: 0.8,
};

function normalizeValue(
  value: string | string[] | undefined,
  mode: "single" | "multiple"
): string | string[] {
  if (mode === "multiple") {
    if (Array.isArray(value)) return value;
    return value ? [value] : [];
  }

  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export function FilterChips({
  options,
  value,
  defaultValue,
  onChange,
  mode = "single",
  size = "md",
  showClear = false,
  className,
}: FilterChipsProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState<
    string | string[]
  >(() => normalizeValue(defaultValue, mode));
  const shouldReduceMotion = useReducedMotion();
  const groupId = React.useId();
  const buttonRefs = React.useRef(new Map<string, HTMLButtonElement>());
  const isControlled = value !== undefined;
  const selectedValue = normalizeValue(
    isControlled ? value : uncontrolledValue,
    mode
  );
  const selectedIds = Array.isArray(selectedValue)
    ? selectedValue
    : selectedValue
      ? [selectedValue]
      : [];
  const selectedSet = new Set(selectedIds);
  const firstEnabledId = options.find((option) => !option.disabled)?.id;
  const tabStopId =
    selectedIds.find((id) => {
      const option = options.find((item) => item.id === id);
      return option && !option.disabled;
    }) ?? firstEnabledId;
  const hasSelection = selectedIds.length > 0;
  const motionTransition = shouldReduceMotion
    ? { duration: 0 }
    : springTransition;

  const updateValue = (nextValue: string | string[]) => {
    if (!isControlled) setUncontrolledValue(nextValue);
    onChange?.(nextValue);
  };

  const selectOption = (id: string) => {
    if (mode === "single") {
      if (selectedValue !== id) updateValue(id);
      return;
    }

    const nextValue = selectedSet.has(id)
      ? selectedIds.filter((selectedId) => selectedId !== id)
      : [...selectedIds, id];
    updateValue(nextValue);
  };

  const clearSelection = () => {
    updateValue(mode === "single" ? "" : []);
  };

  const handleRadioKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    currentIndex: number
  ) => {
    let nextIndex: number | undefined;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = currentIndex + 1;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = currentIndex - 1;
    } else if (event.key === "Home") {
      nextIndex = options.findIndex((option) => !option.disabled);
    } else if (event.key === "End") {
      nextIndex = options.length - 1;
      while (nextIndex >= 0 && options[nextIndex].disabled) nextIndex -= 1;
    }

    if (nextIndex === undefined) return;
    event.preventDefault();

    if (event.key.startsWith("Arrow")) {
      const direction =
        event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1;
      for (let offset = 0; offset < options.length; offset += 1) {
        const candidate =
          (currentIndex + direction * (offset + 1) + options.length) %
          options.length;
        if (!options[candidate].disabled) {
          nextIndex = candidate;
          break;
        }
      }
    }

    if (nextIndex !== undefined && nextIndex >= 0) {
      const option = options[nextIndex];
      selectOption(option.id);
      buttonRefs.current.get(option.id)?.focus();
    }
  };

  return (
    <div
      className={[
        "flex flex-wrap items-center gap-1.5 rounded-xl border border-zinc-900 bg-zinc-950/80 p-1",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <LayoutGroup id={groupId}>
        <div
          role={mode === "single" ? "radiogroup" : "group"}
          aria-label="Filter options"
          className="flex flex-wrap items-center gap-1.5"
        >
          {options.map((option, index) => {
            const isSelected = selectedSet.has(option.id);
            const Icon = option.icon;
            const buttonClassName = [
              "relative isolate inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-transparent outline-none focus-visible:ring-1 focus-visible:ring-zinc-400",
              size === "sm" ? "min-h-8 px-2.5 py-1.5 text-[11px]" : "min-h-9 px-3 py-2 text-xs",
              isSelected
                ? "font-medium text-zinc-100"
                : "bg-transparent text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200",
              option.disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer",
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <motion.button
                key={option.id}
                ref={(element) => {
                  if (element) buttonRefs.current.set(option.id, element);
                  else buttonRefs.current.delete(option.id);
                }}
                type="button"
                role={mode === "single" ? "radio" : undefined}
                aria-checked={mode === "single" ? isSelected : undefined}
                aria-pressed={mode === "multiple" ? isSelected : undefined}
                tabIndex={
                  mode === "single"
                    ? option.id === tabStopId && !option.disabled
                      ? 0
                      : -1
                    : undefined
                }
                disabled={option.disabled}
                onClick={() => selectOption(option.id)}
                onKeyDown={
                  mode === "single"
                    ? (event) => handleRadioKeyDown(event, index)
                    : undefined
                }
                layout={mode === "multiple" && !shouldReduceMotion}
                initial={false}
                animate={
                  mode === "multiple" && !shouldReduceMotion
                    ? { scale: isSelected ? 1.015 : 1 }
                    : { scale: 1 }
                }
                whileTap={
                  shouldReduceMotion || option.disabled
                    ? undefined
                    : { scale: 0.95 }
                }
                transition={motionTransition}
                className={buttonClassName}
              >
                {mode === "single" && isSelected && !shouldReduceMotion && (
                  <motion.span
                    aria-hidden="true"
                    layoutId="active-filter-indicator"
                    initial={false}
                    transition={springTransition}
                    className="absolute inset-0 -z-10 rounded-lg border border-zinc-700/60 bg-zinc-800/90 shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
                  />
                )}
                {mode === "single" && isSelected && shouldReduceMotion && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 -z-10 rounded-lg border border-zinc-700/60 bg-zinc-800/90 shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
                  />
                )}
                {mode === "multiple" && (
                  <motion.span
                    aria-hidden="true"
                    initial={false}
                    animate={{
                      opacity: isSelected ? 1 : 0,
                      scale: isSelected || shouldReduceMotion ? 1 : 0.96,
                    }}
                    transition={motionTransition}
                    className="absolute inset-0 -z-10 rounded-lg border border-zinc-700/60 bg-zinc-800/90 shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
                  />
                )}
                {Icon && (
                  <Icon
                    aria-hidden="true"
                    className="size-3.5 shrink-0"
                  />
                )}
                <span className="whitespace-nowrap">{option.label}</span>
                {option.count !== undefined && (
                  <span
                    className={[
                      "rounded px-1.5 py-0.5 font-mono text-[10px] tabular-nums",
                      isSelected
                        ? "bg-zinc-700/60 text-zinc-300"
                        : "bg-zinc-900/80 text-zinc-500",
                    ].join(" ")}
                  >
                    {option.count}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </LayoutGroup>

      {showClear && hasSelection && (
        <motion.button
          type="button"
          whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
          transition={motionTransition}
          onClick={clearSelection}
          className="inline-flex min-h-8 items-center rounded-lg px-2.5 text-[11px] font-medium text-zinc-500 hover:bg-zinc-900/50 hover:text-zinc-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400"
        >
          Reset
        </motion.button>
      )}
    </div>
  );
}

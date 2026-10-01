"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, X } from "lucide-react";
import {
  ALL_COMPONENTS,
  CATEGORIES,
  ComponentCategory,
  ComponentRecord,
} from "@/config/components-data";
import { microTransition, springMechanical } from "@/lib/motion";
import { cn } from "@/lib/utils";

const MotionLink = motion.create(Link);

export interface SidebarProps {
  currentSlug: string;
  isOpen: boolean;
  isMobileOpen: boolean;
  onClose: () => void;
}

const groupComponents = () => {
  const groups: Record<ComponentCategory, ComponentRecord[]> = {
    ACTIONS: [],
    INPUTS: [],
    SECURITY: [],
  };
  ALL_COMPONENTS.forEach((component) => groups[component.category].push(component));
  return groups;
};

export function Sidebar({
  currentSlug,
  isOpen,
  isMobileOpen,
  onClose,
}: SidebarProps) {
  const shouldReduceMotion = useReducedMotion();
  const groupedComponents = React.useMemo(() => groupComponents(), []);

  React.useEffect(() => {
    if (!isMobileOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [isMobileOpen, onClose]);

  const navigation = (
    <div className="flex h-full min-h-0 flex-col">
      <header className="border-b border-peel-border-subtle px-6 pb-5 pt-5">
        <Link
          href="/"
          onClick={onClose}
          className="mb-5 inline-flex items-center gap-2.5 rounded-sm text-peel-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-peel-border-focus"
        >
          <span className="relative size-7 overflow-hidden rounded-sm border border-peel-border bg-peel-surface">
            <Image src="/peeluiicon.svg" alt="" fill sizes="28px" />
          </span>
          <span className="text-[14px] font-semibold tracking-[-0.02em]">
            Peel UI
          </span>
        </Link>
        <Link
          href="/components"
          onClick={onClose}
          className="flex min-h-10 items-center gap-2 font-mono text-[11px] tracking-[0.04em] text-peel-text-secondary transition-colors hover:text-peel-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-peel-border-focus"
        >
          <ArrowLeft size={13} aria-hidden="true" />
          All components
        </Link>
        <div className="flex items-center justify-between pt-2">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.12em] text-peel-text-mono">
            Index
          </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close component index"
          className="inline-flex size-8 items-center justify-center text-peel-text-secondary transition-colors hover:bg-peel-surface-raised hover:text-peel-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-peel-border-focus md:hidden"
        >
          <X size={15} />
        </button>
        </div>
      </header>
      <nav
        aria-label="Component index"
        className="min-h-0 flex-1 overflow-y-auto px-4 pb-5 pt-4"
      >
        {CATEGORIES.map((category) => {
          const items = groupedComponents[category];
          return (
            <section
              key={category}
              aria-labelledby={`group-${category}`}
              className="pb-4 pt-3 first:pt-0"
            >
              <div
                className="mb-2 flex items-center justify-between border-b border-peel-border-subtle px-2 pb-2 font-mono text-[10px] uppercase tracking-[0.12em] text-peel-text-mono"
              >
                <h2 id={`group-${category}`}>{category}</h2>
                <span aria-label={`${items.length} components`}>
                  {String(items.length).padStart(2, "0")}
                </span>
              </div>
              <ul className="space-y-1">
                {items.map((component) => {
                  const active = component.slug === currentSlug;
                  const index = ALL_COMPONENTS.findIndex(
                    (entry) => entry.slug === component.slug
                  ) + 1;
                  return (
                    <li key={component.slug}>
                      <MotionLink
                        transition={shouldReduceMotion ? { duration: 0 } : microTransition}
                        whileHover={
                          shouldReduceMotion
                            ? undefined
                            : { backgroundColor: "var(--peel-surface-raised)" }
                        }
                        href={`/components/${component.slug}`}
                        onClick={onClose}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "relative flex min-h-10 items-center gap-3 px-2 font-sans text-[13px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-peel-border-focus",
                          active
                            ? "text-peel-text-primary"
                            : "text-peel-text-secondary hover:text-peel-text-primary"
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className="absolute inset-y-1 left-0 w-0.5 bg-peel-lime"
                          style={{ opacity: active ? 1 : 0 }}
                        />
                        <span className="w-5 shrink-0 font-mono text-[10px] tabular-nums text-peel-text-mono">
                          {String(index).padStart(2, "0")}
                        </span>
                        <span className="min-w-0 truncate">
                          {component.name}
                        </span>
                      </MotionLink>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </nav>
      <footer className="flex items-center justify-between border-t border-peel-border-subtle px-6 py-4 font-mono text-[10px] tracking-[0.06em] text-peel-text-mono">
        <Link
          href="https://github.com/killersumit/peel-ui"
          target="_blank"
          rel="noreferrer"
          className="rounded-sm transition-colors hover:text-peel-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-peel-border-focus"
        >
          GitHub
        </Link>
        <span>v0.1.0</span>
      </footer>
    </div>
  );

  return (
    <>
      <motion.aside
        initial={false}
        animate={{ width: isOpen ? 256 : 0, opacity: isOpen ? 1 : 0 }}
        transition={shouldReduceMotion ? { duration: 0 } : springMechanical}
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={cn(
          "hidden h-full shrink-0 overflow-hidden border-r border-peel-border md:flex md:flex-col",
          !isOpen && "pointer-events-none border-r-0"
        )}
      >
        <div className="flex h-full w-64 min-w-64 flex-col">{navigation}</div>
      </motion.aside>

      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-[70] flex md:hidden">
            <motion.button
              type="button"
              aria-label="Dismiss component index"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.16 }}
              onClick={onClose}
              className="absolute inset-0 bg-black/75"
            />
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label="Component index"
              initial={{ x: shouldReduceMotion ? 0 : "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: shouldReduceMotion ? 0 : "-100%" }}
              transition={shouldReduceMotion ? { duration: 0 } : springMechanical}
              className="relative z-10 flex h-full w-[min(19rem,86vw)] flex-col border-r border-peel-border bg-[#0c0c0e]"
            >
              {navigation}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

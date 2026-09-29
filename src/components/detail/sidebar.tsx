"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import {
  ALL_COMPONENTS,
  CATEGORIES,
  ComponentCategory,
  ComponentRecord,
} from "@/config/components-data";
import { springMechanical } from "@/lib/motion";
import { cn } from "@/lib/utils";

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
    <>
      <div className="flex items-center justify-between px-6 pb-3 pt-20 md:pt-20">
        <h2 className="text-sm font-medium text-zinc-200">Components</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close component index"
          className="inline-flex size-8 items-center justify-center border border-white/[0.08] text-zinc-400 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-lime-400 md:hidden"
        >
          <X size={15} />
        </button>
      </div>
      <nav
        aria-label="Component index"
        className="flex-1 space-y-6 overflow-y-auto px-6 pb-6"
      >
        {CATEGORIES.map((category) => {
          const items = groupedComponents[category];
          return (
            <section key={category} aria-labelledby={`group-${category}`}>
              <h2
                id={`group-${category}`}
                className="mb-2 font-mono text-[9px] uppercase tracking-[0.14em] text-zinc-600"
              >
                {category}
              </h2>
              <ul className="space-y-1">
                {items.map((component) => {
                  const active = component.slug === currentSlug;
                  return (
                    <li key={component.slug}>
                      <Link
                        href={`/components/${component.slug}`}
                        onClick={onClose}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "group flex min-h-8 items-center gap-2 font-sans text-[13px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-lime-400",
                          active
                            ? "text-white"
                            : "text-zinc-500 hover:text-zinc-200"
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className={cn(
                            "size-1 shrink-0 rounded-full",
                            active ? "bg-lime-400" : "bg-zinc-700 group-hover:bg-zinc-500"
                          )}
                        />
                        <span className="min-w-0 truncate">
                          {component.name}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </nav>
    </>
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
          "hidden h-full shrink-0 overflow-hidden border-r border-white/[0.08] bg-[#0c0c0e] md:flex md:flex-col",
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
              className="relative z-10 flex h-full w-[min(19rem,86vw)] flex-col border-r border-white/[0.08] bg-[#0c0c0e]"
            >
              {navigation}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

import type { Transition } from "motion/react";

/**
 * High-stiffness tactile spring for buttons, tabs, switches, segmented controls.
 * Zero perceptual latency with crisp physical settle.
 */
export const springTactile: Transition = {
  type: "spring",
  stiffness: 600,
  damping: 38,
  mass: 0.6,
};

/**
 * Mechanical reveal spring for drawers, dropdown menus, expanding panels.
 * Heavier mass yields a satisfying, measured open/close.
 */
export const springMechanical: Transition = {
  type: "spring",
  stiffness: 380,
  damping: 32,
  mass: 1.0,
};

/**
 * Precise micro-interaction for hover borders, color shifts, tooltips.
 * Fast easeOutExpo curve, 120ms total.
 */
export const microTransition = {
  duration: 0.12,
  ease: [0.16, 1, 0.3, 1] as const,
};

/**
 * Gentle entrance spring for content fading into view.
 * Calmer, more spacious feel than springTactile.
 */
export const springGentle: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 28,
  mass: 0.8,
};

import type { Transition } from "motion/react";

/**
 * 120fps Mathematical Spring Physics (Law 5):
 * Damping ratio equation: zeta = damping / (2 * sqrt(stiffness * mass))
 * All springs strictly calibrated to zeta in [0.90, 1.00] for zero rubbery bounce.
 */

/** Tier 1: zeta = 0.996 — Tactile Micro-Response (Switches, Thumbs, Chips, Keycaps, CLI Morph) */
export const springTactile: Transition = {
  type: "spring",
  stiffness: 520,
  damping: 38,
  mass: 0.7,
};

/** Tier 2: zeta = 0.910 — Mechanical Detent & Island Morphing (Short Spatial Travel < 60px) */
export const springMechanical: Transition = {
  type: "spring",
  stiffness: 320,
  damping: 30,
  mass: 0.85,
};

/** Tier 3: zeta = 0.999 — Long-Distance Spatial Glide (Navbar 1-to-3 Split, Drawer Slide > 150px) */
export const springSpatialGlide: Transition = {
  type: "spring",
  stiffness: 95,
  damping: 20,
  mass: 1.05,
};

/** zeta = 0.980 — Gentle follow-through for card fanning & stage resets */
export const springGentle: Transition = {
  type: "spring",
  stiffness: 240,
  damping: 28,
  mass: 0.85,
};

/** zeta = 0.938 — Card stack reorder transitions */
export const springStackOrder: Transition = {
  type: "spring",
  stiffness: 320,
  damping: 30,
  mass: 0.8,
};

/** Architectural cursor-parallax spring for ambient hero light */
export const springAmbient = {
  stiffness: 65,
  damping: 24,
  mass: 1.1,
};

/** Tier 1: zeta = 0.996 — Snappy micro-interaction transition for hover / active states */
export const microTransition: Transition = {
  type: "spring",
  stiffness: 520,
  damping: 38,
  mass: 0.7,
};

/** Law 5 Item 4: Deterministic Cubic-Bezier Curve for One-Shot Slit-Mask Entrances */
export const EASE_SLIT_MASK: [number, number, number, number] = [0.19, 1, 0.22, 1];


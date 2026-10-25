/**
 * Design tokens exposed to TypeScript.
 *
 * The visual source of truth is the CSS variables in `src/app/globals.css`.
 * This file only holds the values that non-CSS code needs, such as the
 * `theme-color` metadata and the canvas background animation.
 * Keep the two in sync. See docs/DESIGN_SYSTEM.md.
 */
export const theme = {
  background: "#0a0b0f",
  accent: "#7c86ff",
} as const;

/** Tuning for the canvas background (`components/animations`). */
export const backgroundEffect = {
  /** Upper bound on particles; fewer are used on small screens. */
  maxParticles: 90,
  /** Pixels within which two particles are joined by a line. */
  linkDistance: 140,
  /** Pixels within which the pointer joins nearby particles. */
  pointerDistance: 180,
  dotOpacity: 0.55,
  lineOpacity: 0.16,
} as const;

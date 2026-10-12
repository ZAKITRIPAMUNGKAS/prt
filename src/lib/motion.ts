/**
 * Shared motion tokens and easing curves for consistent animations.
 * Complies with performance and prefers-reduced-motion guidelines.
 */

export const DURATION = {
  instant: 0,
  fast: 0.15, // 150ms
  normal: 0.25, // 250ms
  page: 0.35, // 350ms
  slow: 0.45, // 450ms
} as const;

export const EASING = {
  // Smooth spring-like decel curve (out-quart / out-expo feel)
  easeOut: [0.22, 1, 0.36, 1] as const,
  easeInOut: [0.65, 0, 0.35, 1] as const,
  easeIn: [0.32, 0, 0.67, 0] as const,
} as const;

export const TRANSITION = {
  micro: {
    duration: DURATION.fast,
    ease: EASING.easeOut,
  },
  standard: {
    duration: DURATION.normal,
    ease: EASING.easeOut,
  },
  page: {
    duration: DURATION.page,
    ease: EASING.easeOut,
  },
  reducedMotion: {
    duration: DURATION.fast,
    ease: "linear",
  },
} as const;

/**
 * Check if the user prefers reduced motion on client side.
 */
export function getPrefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

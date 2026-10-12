/**
 * Helper utilities for View Transitions API.
 * Provides shared-element navigation transitions and circular theme toggle animations.
 * Complies with prefers-reduced-motion and provides seamless zero-error fallbacks.
 */

export function navigateWithViewTransition(
  navigateFn: () => void,
  options?: { skipTransition?: boolean }
) {
  if (
    options?.skipTransition ||
    typeof document === "undefined" ||
    !document.startViewTransition ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    navigateFn();
    return;
  }

  document.startViewTransition(() => {
    navigateFn();
  });
}

/**
 * Circular clip-path theme toggle transition radiating out from the trigger button position.
 */
export function toggleThemeWithCircularTransition(
  e: React.MouseEvent | React.TouchEvent,
  newTheme: string,
  setTheme: (t: string) => void
) {
  if (
    typeof document === "undefined" ||
    !document.startViewTransition ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    setTheme(newTheme);
    return;
  }

  const target = e.currentTarget as HTMLElement | null;
  const rect = target?.getBoundingClientRect();
  const x = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
  const y = rect ? rect.top + rect.height / 2 : window.innerHeight / 2;
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  );

  const transition = document.startViewTransition(() => {
    setTheme(newTheme);
  });

  transition.ready.then(() => {
    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 350,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        pseudoElement: "::view-transition-new(root)",
      }
    );
  });
}

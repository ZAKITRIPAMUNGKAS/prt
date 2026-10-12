"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

import { toggleThemeWithCircularTransition } from "@/lib/view-transition";

// Hydration-safe hook to detect if component is mounted on client
const emptySubscribe = () => () => {};
const useIsMounted = () =>
  useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

// Dashboard page Theme Toggle - instant without transition as per rule
export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <Sun className="h-6 w-[1.3rem] dark:hidden" color="#000" />
      <Moon className="hidden h-5 w-5 dark:block" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

// Home page Theme Switch with circular clip-path transition
export function ThemeSwitch() {
  const mounted = useIsMounted();
  const { setTheme, resolvedTheme: theme } = useTheme();

  if (!mounted) {
    return <Switch checked={false} disabled aria-label="Toggle theme" />;
  }

  const isDark = theme === "dark";

  return (
    <Switch
      checked={isDark}
      onClick={(e) => {
        const nextTheme = isDark ? "light" : "dark";
        toggleThemeWithCircularTransition(e, nextTheme, setTheme);
      }}
      aria-label="Toggle theme"
    />
  );
}

import * as React from "react";
import { cn } from "@/lib/utils";

export function Squircle({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "absolute inset-0 rounded-[20px] pointer-events-none transition-colors",
        className
      )}
    />
  );
}

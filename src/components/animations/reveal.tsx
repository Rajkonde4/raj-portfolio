import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Fade-and-rise entrance animation, done in CSS (`.reveal` in globals.css),
 * so it needs no client JavaScript. Reduced-motion users get the final state
 * immediately. Content stays visible if animations are unsupported.
 */
export function Reveal({
  delay = 0,
  className,
  children,
}: {
  /** Milliseconds before the animation starts. */
  delay?: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn("reveal", className)}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

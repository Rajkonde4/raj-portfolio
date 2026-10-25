"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Cycles through the roles from `siteConfig.roles`.
 *
 * Accessibility: screen readers get the full list once (visually hidden) and
 * ignore the animated text. Under `prefers-reduced-motion`, or with a single
 * role, the first role is shown and never changes. Server render shows the
 * first role, so there is no layout jump and no content without JavaScript.
 *
 * Performance: the visible span is never replaced, only its text changes and
 * it is animated in place. Replacing the element on every swap made Chrome
 * count each new role as a fresh "largest contentful paint", which pushed the
 * measured LCP out to the first swap (about 3 s on a throttled phone).
 */
export function RoleRotator({
  roles,
  intervalMs = 2800,
}: {
  roles: readonly string[];
  intervalMs?: number;
}) {
  const [index, setIndex] = useState(0);
  const textRef = useRef<HTMLSpanElement>(null);
  const firstRender = useRef(true);

  useEffect(() => {
    if (roles.length < 2) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;
    const id = window.setInterval(
      () => setIndex((current) => (current + 1) % roles.length),
      intervalMs,
    );
    return () => window.clearInterval(id);
  }, [roles, intervalMs]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    textRef.current?.animate(
      [
        { opacity: 0, transform: "translateY(0.5em)" },
        { opacity: 1, transform: "none" },
      ],
      { duration: 450, easing: "ease-out" },
    );
  }, [index]);

  return (
    <>
      <span className="sr-only">{roles.join(", ")}</span>
      <span ref={textRef} aria-hidden="true" className="role-swap inline-block">
        {roles[index]}
      </span>
    </>
  );
}

"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Id of the section currently crossing the middle of the viewport, or null.
 * Only active on the home page, where the sections live.
 */
export function useActiveSection(ids: string[]): string | null {
  const pathname = usePathname();
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join("|");

  useEffect(() => {
    if (pathname !== "/") return;
    const elements = key
      .split("|")
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    // A thin band across the middle of the screen decides which section is "current".
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
          else
            setActive((current) =>
              current === entry.target.id ? null : current,
            );
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [key, pathname]);

  // Derived rather than reset in the effect: off the home page nothing is current.
  return pathname === "/" ? active : null;
}

"use client";

import Link from "next/link";

import { useActiveSection } from "@/components/layout/use-active-section";
import { cn } from "@/lib/utils";

export interface NavItem {
  id: string;
  label: string;
  anchor: string;
}

/** Inline navigation for `md` and up. Marks the current section. */
export function DesktopNav({ items }: { items: NavItem[] }) {
  const active = useActiveSection(items.map((item) => item.id));

  return (
    <nav aria-label="Primary" className="hidden md:block">
      <ul className="flex items-center gap-6 text-sm text-muted">
        {items.map((item) => {
          const current = active === item.id;
          return (
            <li key={item.id}>
              <Link
                href={`/${item.anchor}`}
                aria-current={current ? "location" : undefined}
                className={cn(
                  "rounded-sm border-b border-transparent pb-0.5 transition-colors hover:text-foreground",
                  current && "border-accent text-foreground",
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

import type { ReactNode } from "react";

import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { cn } from "@/lib/utils";

/**
 * Standard home-page section: anchor id, labelled heading, consistent rhythm.
 * `id` is also the anchor in the section registry (`#id`).
 */
export function Section({
  id,
  eyebrow,
  title,
  className,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={cn("scroll-mt-20 pt-28 sm:pt-40", className)}
    >
      <Container>
        <SectionHeading id={`${id}-heading`} eyebrow={eyebrow} title={title} />
        {children}
      </Container>
    </section>
  );
}

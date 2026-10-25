import { ArrowUpRight } from "lucide-react";

import { Section } from "@/components/shared/section";
import { achievements } from "@/content/achievements";
import { formatMonth } from "@/lib/format";
import type { Achievement } from "@/types/content";

const categoryLabel: Record<Achievement["category"], string> = {
  achievement: "Achievements",
  event: "Events",
  presentation: "Presentations",
  certification: "Certifications",
};

export function Achievements() {
  const groups = (Object.keys(categoryLabel) as Achievement["category"][])
    .map((category) => ({
      category,
      items: achievements.filter((item) => item.category === category),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <Section
      id="achievements"
      eyebrow="Credentials"
      title="Certifications and achievements"
    >
      {groups.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border-strong p-8 text-muted">
          Verified achievements will appear here once they are added.
        </p>
      ) : (
        <div className="space-y-12">
          {groups.map((group) => (
            <div key={group.category}>
              <h3 className="font-mono text-xs tracking-[0.2em] text-accent uppercase">
                {categoryLabel[group.category]}
              </h3>
              <ul className="mt-4 border-t border-border">
                {group.items.map((item) => (
                  <li
                    key={item.id}
                    className="scroll-reveal grid gap-1 border-b border-border py-5 sm:grid-cols-[1fr_auto] sm:gap-8"
                  >
                    <div>
                      <p className="text-lg">
                        {item.url ? (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 hover:text-accent"
                          >
                            {item.title}
                            <ArrowUpRight aria-hidden className="size-4" />
                          </a>
                        ) : (
                          item.title
                        )}
                      </p>
                      {item.issuer && (
                        <p className="text-sm text-muted">{item.issuer}</p>
                      )}
                      {item.description && (
                        <p className="mt-2 max-w-2xl text-sm text-muted">
                          {item.description}
                        </p>
                      )}
                    </div>
                    {item.date && (
                      <p className="font-mono text-sm text-muted">
                        {formatMonth(item.date)}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}

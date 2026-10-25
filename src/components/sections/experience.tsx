import { Section } from "@/components/shared/section";
import { experience } from "@/content/experience";
import { formatRange } from "@/lib/format";
import type { Experience as ExperienceEntry } from "@/types/content";

const typeLabel: Record<ExperienceEntry["type"], string> = {
  internship: "Internship",
  development: "Development",
  leadership: "Leadership",
};

function Timeline({ entries }: { entries: ExperienceEntry[] }) {
  return (
    <ol className="relative ml-1.5 border-l border-border">
      {entries.map((entry) => {
        const period = formatRange(entry.start, entry.end);
        return (
          <li
            key={entry.id}
            className="scroll-reveal relative pb-12 pl-8 last:pb-0"
          >
            <span
              aria-hidden="true"
              className="absolute top-2 -left-[5px] size-2.5 rounded-full border border-accent bg-background"
            />
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <h4 className="font-serif text-2xl tracking-tight sm:text-3xl">
                {entry.role}
              </h4>
              <span className="font-mono text-xs tracking-wide text-accent uppercase">
                {typeLabel[entry.type]}
              </span>
            </div>
            <p className="mt-1 text-muted">
              {entry.organization}
              {period && (
                <>
                  <span aria-hidden="true">{"  /  "}</span>
                  <span className="sr-only">, </span>
                  <span className="font-mono text-sm">{period}</span>
                </>
              )}
            </p>
            {entry.summary && (
              <p className="mt-3 max-w-2xl text-foreground/90">
                {entry.summary}
              </p>
            )}
            {entry.highlights.length > 0 && (
              <ul className="mt-4 max-w-2xl list-disc space-y-2 pl-5 text-muted marker:text-muted">
                {entry.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </li>
        );
      })}
    </ol>
  );
}

export function Experience() {
  const work = experience.filter((e) => e.type !== "leadership");
  const leadership = experience.filter((e) => e.type === "leadership");

  return (
    <Section id="experience" eyebrow="Experience" title="Work and leadership">
      {experience.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border-strong p-8 text-muted">
          Experience will appear here once it is added.
        </p>
      ) : (
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
          {work.length > 0 && (
            <div>
              <h3 className="mb-8 font-mono text-xs tracking-[0.2em] text-muted uppercase">
                Internships and development
              </h3>
              <Timeline entries={work} />
            </div>
          )}
          {leadership.length > 0 && (
            <div>
              <h3 className="mb-8 font-mono text-xs tracking-[0.2em] text-muted uppercase">
                Leadership and activities
              </h3>
              <Timeline entries={leadership} />
            </div>
          )}
        </div>
      )}
    </Section>
  );
}

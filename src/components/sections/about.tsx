import { Section } from "@/components/shared/section";
import { siteConfig } from "@/config/site";
import { education } from "@/content/education";
import { formatMonth } from "@/lib/format";

export function About() {
  const { about, focusAreas, location } = siteConfig;

  return (
    <Section id="about" eyebrow="About" title="Background and direction">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
        <div className="max-w-2xl space-y-5 text-lg leading-relaxed">
          {about.paragraphs.map((paragraph) => (
            <p
              key={paragraph}
              className="first:text-foreground [&:not(:first-child)]:text-muted"
            >
              {paragraph}
            </p>
          ))}
          <p className="border-l-2 border-accent pl-5 font-serif text-2xl leading-snug">
            {about.direction}
          </p>
        </div>

        <div className="space-y-10">
          <div>
            <h3 className="font-mono text-xs tracking-[0.2em] text-accent uppercase">
              Interests
            </h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {focusAreas.map((area) => (
                <li
                  key={area}
                  className="rounded-full border border-border px-3 py-1 font-mono text-xs text-muted"
                >
                  {area}
                </li>
              ))}
            </ul>
          </div>

          {education.length > 0 && (
            <div>
              <h3 className="font-mono text-xs tracking-[0.2em] text-accent uppercase">
                Education
              </h3>
              <ul className="mt-4 space-y-6">
                {education.map((entry) => (
                  <li key={entry.id}>
                    <p className="font-serif text-2xl leading-tight">
                      {entry.degree}
                    </p>
                    <p className="mt-1 text-muted">
                      {entry.institution}
                      {entry.location ? `, ${entry.location}` : ""}
                    </p>
                    {(entry.end || entry.grade) && (
                      <p className="mt-2 font-mono text-xs text-muted">
                        {[
                          entry.end
                            ? `${entry.graduation === "expected" ? "Expected " : ""}${formatMonth(entry.end)}`
                            : null,
                          entry.grade,
                        ]
                          .filter(Boolean)
                          .join("  /  ")}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {location && (
            <p className="font-mono text-xs text-muted">Based in {location}</p>
          )}
        </div>
      </div>
    </Section>
  );
}

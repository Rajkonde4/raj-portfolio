import { Section } from "@/components/shared/section";
import { getVisibleSkillGroups } from "@/lib/content";

/** Skills by area, names only: no bars, no percentages. */
export function Skills() {
  const groups = getVisibleSkillGroups();

  return (
    <Section id="skills" eyebrow="Technical expertise" title="Skills">
      {groups.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border-strong p-8 text-muted">
          Skills will appear here once they are added.
        </p>
      ) : (
        <dl className="border-t border-border">
          {groups.map((group) => (
            <div
              key={group.id}
              className="scroll-reveal grid gap-3 border-b border-border py-6 sm:grid-cols-[14rem_1fr] sm:gap-8"
            >
              <dt>
                <span className="font-serif text-2xl tracking-tight">
                  {group.label}
                </span>
                {group.note && (
                  <span className="mt-1 block max-w-[16rem] text-sm text-muted">
                    {group.note}
                  </span>
                )}
              </dt>
              <dd>
                <ul className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-border px-3 py-1 font-mono text-xs text-foreground/90"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      )}
    </Section>
  );
}

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { PipelineFlow } from "@/components/projects/pipeline-flow";
import { Section } from "@/components/shared/section";
import { getFeaturedProject } from "@/lib/content";

/**
 * Spotlight for the featured project: what it does, how the system fits
 * together, and what actually works today. Renders nothing when there is no
 * featured project with a pipeline.
 */
export function GeovisionSpotlight() {
  const project = getFeaturedProject();
  if (!project?.pipeline?.length) return null;

  const { pipeline, features, limitations } = project;
  const counts = {
    implemented: pipeline.filter((s) => s.status === "implemented").length,
    inProgress: pipeline.filter((s) => s.status === "in-progress").length,
    planned: pipeline.filter((s) => s.status === "planned").length,
  };

  return (
    <Section id="geovision" eyebrow="Featured project" title={project.title}>
      <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div>
          <p className="font-serif text-2xl leading-snug sm:text-3xl">
            {project.tagline}
          </p>
          {project.problem && (
            <p className="mt-6 leading-relaxed text-muted">{project.problem}</p>
          )}

          <p
            className="mt-8 font-mono text-xs tracking-wide text-muted uppercase"
            aria-label="Pipeline status summary"
          >
            {counts.implemented} implemented &middot; {counts.inProgress} in
            progress &middot; {counts.planned} planned
          </p>

          {limitations && limitations.length > 0 && (
            <div className="mt-8 rounded-lg border border-dashed border-border-strong p-5">
              <h3 className="font-mono text-xs tracking-[0.2em] text-accent uppercase">
                Current limitations
              </h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted marker:text-muted">
                {limitations.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {features && features.implemented.length > 0 && (
            <div className="mt-8">
              <h3 className="font-mono text-xs tracking-[0.2em] text-accent uppercase">
                Works today
              </h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm marker:text-muted">
                {features.implemented.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          <Link
            href={`/projects/${project.slug}`}
            className="group mt-10 inline-flex items-center gap-2 rounded-full border border-border-strong px-5 py-2.5 text-sm transition-[color,background-color,border-color,opacity,transform] hover:border-accent hover:text-accent"
          >
            Read the case study
            <ArrowUpRight
              aria-hidden
              className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>

        <div>
          <h3 className="sr-only">System pipeline</h3>
          <PipelineFlow stages={pipeline} />
        </div>
      </div>
    </Section>
  );
}

import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { PipelineFlow } from "@/components/projects/pipeline-flow";
import { Container } from "@/components/shared/container";
import type { Project } from "@/types/content";

const statusLabel: Record<Project["status"], string> = {
  completed: "Completed",
  "in-progress": "In progress",
  prototype: "Prototype",
};

function Block({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-14 border-t border-border pt-8">
      <h2 className="font-mono text-xs tracking-[0.2em] text-accent uppercase">
        {title}
      </h2>
      <div className="mt-4 max-w-2xl leading-relaxed text-foreground/90">
        {children}
      </div>
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5 marker:text-muted">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

/** Reusable case-study layout. Optional sections render only when present. */
export function ProjectCaseStudy({ project }: { project: Project }) {
  const { links, features } = project;
  const hasImplemented = (features?.implemented.length ?? 0) > 0;
  const hasInProgress = (features?.inProgress?.length ?? 0) > 0;
  const hasPlanned = (features?.planned.length ?? 0) > 0;
  const hasLimitations = (project.limitations?.length ?? 0) > 0;

  return (
    <article className="pt-12 sm:pt-20">
      <Container>
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 rounded-sm text-sm text-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft aria-hidden className="size-4" />
          All projects
        </Link>

        <p className="mt-10 font-mono text-xs tracking-[0.2em] text-accent uppercase">
          {statusLabel[project.status]}
        </p>
        <h1 className="mt-4 font-serif text-5xl leading-none tracking-tight sm:text-7xl">
          {project.title}
        </h1>
        <p className="mt-6 max-w-2xl text-xl leading-snug">{project.tagline}</p>
        <p className="mt-4 max-w-2xl leading-relaxed text-muted">
          {project.summary}
        </p>

        {project.tags.length > 0 && (
          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Technologies">
            {project.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-border px-3 py-1 font-mono text-xs text-muted"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}

        {(links.repository || links.demo) && (
          <div className="mt-8 flex flex-wrap gap-3">
            {links.repository && (
              <a
                href={links.repository}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border-strong px-5 py-2.5 text-sm transition-colors hover:border-accent hover:text-accent"
              >
                Source code
                <ArrowUpRight aria-hidden className="size-4" />
              </a>
            )}
            {links.demo && (
              <a
                href={links.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
              >
                Live demo
                <ArrowUpRight aria-hidden className="size-4" />
              </a>
            )}
          </div>
        )}

        {project.preview && (
          <figure className="mt-12 overflow-hidden rounded-lg border border-border">
            <Image
              src={project.preview.src}
              alt={project.preview.alt}
              width={1600}
              height={900}
              sizes="(min-width: 1152px) 1088px, 100vw"
              className="h-auto w-full"
              priority
            />
          </figure>
        )}

        {project.problem && (
          <Block title="Problem">
            <p>{project.problem}</p>
          </Block>
        )}
        {project.architecture && project.architecture.length > 0 && (
          <Block title="Architecture">
            <BulletList items={project.architecture} />
          </Block>
        )}
        {project.contribution && (
          <Block title="My contribution">
            <p>{project.contribution}</p>
          </Block>
        )}
        {project.pipeline && project.pipeline.length > 0 && (
          <section className="mt-14 border-t border-border pt-8">
            <h2 className="font-mono text-xs tracking-[0.2em] text-accent uppercase">
              How it works
            </h2>
            <div className="mt-4 max-w-3xl">
              <PipelineFlow stages={project.pipeline} />
            </div>
          </section>
        )}
        {hasImplemented && features && (
          <Block title="Implemented">
            <BulletList items={features.implemented} />
          </Block>
        )}
        {hasInProgress && features?.inProgress && (
          <Block title="In progress">
            <BulletList items={features.inProgress} />
          </Block>
        )}
        {hasPlanned && features && (
          <Block title="Planned">
            <BulletList items={features.planned} />
          </Block>
        )}
        {hasLimitations && project.limitations && (
          <Block title="Current limitations">
            <BulletList items={project.limitations} />
          </Block>
        )}
      </Container>
    </article>
  );
}

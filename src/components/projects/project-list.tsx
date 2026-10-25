"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { cn } from "@/lib/utils";
import type { ProjectCategory } from "@/types/content";

export interface ProjectListItem {
  slug: string;
  title: string;
  tagline: string;
  tags: string[];
  category: ProjectCategory;
}

/**
 * Project rows with a category filter. Filtering is plain client state; with
 * JavaScript disabled the server-rendered list shows every project. The filter
 * is hidden when there is only one category to choose from.
 */
export function ProjectList({
  projects,
  categories,
  labels,
}: {
  projects: ProjectListItem[];
  categories: ProjectCategory[];
  labels: Record<ProjectCategory, string>;
}) {
  const [selected, setSelected] = useState<ProjectCategory | "all">("all");
  const visible =
    selected === "all"
      ? projects
      : projects.filter((project) => project.category === selected);

  return (
    <div>
      {categories.length > 1 && (
        <div
          role="group"
          aria-label="Filter projects by category"
          className="mb-8 flex flex-wrap gap-2"
        >
          {(["all", ...categories] as const).map((category) => {
            const pressed = selected === category;
            return (
              <button
                key={category}
                type="button"
                aria-pressed={pressed}
                onClick={() => setSelected(category)}
                className={cn(
                  "rounded-full border px-4 py-1.5 font-mono text-xs transition-colors",
                  pressed
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border text-muted hover:border-border-strong hover:text-foreground",
                )}
              >
                {category === "all" ? "All" : labels[category]}
              </button>
            );
          })}
        </div>
      )}

      <p role="status" aria-live="polite" className="sr-only">
        Showing {visible.length} of {projects.length} projects
      </p>

      <ul className="border-t border-border">
        {visible.map((project, index) => (
          <li
            key={project.slug}
            className="scroll-reveal border-b border-border"
          >
            <Link
              href={`/projects/${project.slug}`}
              className="group grid gap-4 py-8 transition-colors hover:bg-white/[0.02] sm:grid-cols-[4rem_1fr_auto] sm:items-start sm:gap-8 sm:px-2"
            >
              <span className="font-mono text-sm text-muted">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>
                <span className="block font-serif text-3xl tracking-tight sm:text-4xl">
                  {project.title}
                </span>
                <span className="mt-2 block max-w-2xl text-muted">
                  {project.tagline}
                </span>
                {project.tags.length > 0 && (
                  <span className="mt-4 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-border px-3 py-1 font-mono text-xs text-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </span>
                )}
              </span>
              <span className="inline-flex items-center gap-1 text-sm text-muted transition-colors group-hover:text-accent">
                Case study
                <ArrowUpRight
                  aria-hidden
                  className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { PipelineFlow } from "@/components/projects/pipeline-flow";
import { ProjectCaseStudy } from "@/components/projects/project-case-study";
import { StatusBadge } from "@/components/shared/status-badge";
import { getFeaturedProject, getPublishedProjects } from "@/lib/content";
import type { Project } from "@/types/content";

function geovision(): Project {
  const project = getPublishedProjects().find((p) => p.slug === "geovision-ai");
  if (!project) throw new Error("geovision-ai must be published");
  return project;
}

describe("StatusBadge", () => {
  it("states the status in words, not only color", () => {
    expect(
      renderToStaticMarkup(<StatusBadge status="implemented" />),
    ).toContain("Implemented");
    expect(
      renderToStaticMarkup(<StatusBadge status="in-progress" />),
    ).toContain("In progress");
    expect(renderToStaticMarkup(<StatusBadge status="planned" />)).toContain(
      "Planned",
    );
  });
});

describe("PipelineFlow", () => {
  it("renders every stage in order with its own status", () => {
    const stages = geovision().pipeline ?? [];
    expect(stages.length).toBeGreaterThan(0);
    const html = renderToStaticMarkup(<PipelineFlow stages={stages} />);

    let last = -1;
    for (const stage of stages) {
      const at = html.indexOf(stage.label);
      expect(at, stage.label).toBeGreaterThan(last);
      last = at;
    }
    expect(html.startsWith("<ol")).toBe(true);
  });

  it("never labels a planned stage as implemented", () => {
    const planned = (geovision().pipeline ?? []).filter(
      (s) => s.status === "planned",
    );
    expect(planned.length).toBeGreaterThan(0);
    for (const stage of planned) {
      const html = renderToStaticMarkup(<PipelineFlow stages={[stage]} />);
      expect(html).toContain("Planned");
      expect(html).not.toContain("Implemented");
    }
  });
});

describe("ProjectCaseStudy preview image", () => {
  const base = geovision();

  it("renders the preview with its alt text when one is set", () => {
    const html = renderToStaticMarkup(
      <ProjectCaseStudy
        project={{
          ...base,
          preview: {
            src: "/images/projects/geovision-ai.png",
            alt: "Dashboard",
          },
        }}
      />,
    );
    expect(html).toContain("<img");
    expect(html).toContain('alt="Dashboard"');
  });

  it("renders no image when there is no preview", () => {
    const html = renderToStaticMarkup(
      <ProjectCaseStudy project={{ ...base, preview: undefined }} />,
    );
    expect(html).not.toContain("<img");
  });
});

describe("featured project", () => {
  it("is published and has a pipeline for the spotlight", () => {
    const featured = getFeaturedProject();
    expect(featured?.visibility).toBe("published");
    expect(featured?.pipeline?.length).toBeGreaterThan(0);
  });
});

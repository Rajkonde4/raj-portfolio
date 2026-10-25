import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ContactPanel } from "@/components/contact/contact-panel";
import { ProjectList } from "@/components/projects/project-list";
import {
  getProjectCategories,
  getPublishedProjects,
  projectCategoryLabels,
} from "@/lib/content";

describe("ContactPanel", () => {
  it("shows the form when the server has it enabled", () => {
    const html = renderToStaticMarkup(<ContactPanel formEnabled showResume />);
    expect(html).toContain("<form");
    expect(html).toContain('name="message"');
    expect(html).not.toContain("not enabled");
  });

  it("shows an honest notice and no form when it is not enabled", () => {
    const html = renderToStaticMarkup(
      <ContactPanel formEnabled={false} showResume={false} />,
    );
    expect(html).not.toContain("<form");
    expect(html).toContain("not enabled on this deployment");
    expect(html).toContain("linkedin.com");
    expect(html).toContain("github.com");
    expect(html).not.toContain("Resume");
  });

  it("has a labelled input for every field and a hidden honeypot", () => {
    const html = renderToStaticMarkup(
      <ContactPanel formEnabled showResume={false} />,
    );
    for (const label of ["Name", "Email", "Message"]) {
      expect(html).toContain(`>${label}</label>`);
    }
    expect(html).toMatch(/aria-hidden="true"[^>]*>[\s\S]*name="website"/);
  });
});

describe("ProjectList", () => {
  const projects = getPublishedProjects().map(
    ({ slug, title, tagline, tags, category }) => ({
      slug,
      title,
      tagline,
      tags,
      category,
    }),
  );

  it("renders every project and a filter when there are several categories", () => {
    const categories = getProjectCategories(getPublishedProjects());
    expect(categories.length).toBeGreaterThan(1);
    const html = renderToStaticMarkup(
      <ProjectList
        projects={projects}
        categories={categories}
        labels={projectCategoryLabels}
      />,
    );
    for (const project of projects) expect(html).toContain(project.title);
    expect(html).toContain('aria-label="Filter projects by category"');
    expect(html).toContain('aria-pressed="true"');
  });

  it("hides the filter when only one category exists", () => {
    const html = renderToStaticMarkup(
      <ProjectList
        projects={projects.slice(0, 1)}
        categories={[projects[0].category]}
        labels={projectCategoryLabels}
      />,
    );
    expect(html).not.toContain("Filter projects by category");
  });
});

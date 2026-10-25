import { ProjectList } from "@/components/projects/project-list";
import { Section } from "@/components/shared/section";
import {
  getProjectCategories,
  getPublishedProjects,
  projectCategoryLabels,
} from "@/lib/content";

export function ProjectsSection() {
  const projects = getPublishedProjects();

  return (
    <Section id="projects" eyebrow="Selected work" title="Projects">
      {projects.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border-strong p-8 text-muted">
          Projects will appear here once they are published.
        </p>
      ) : (
        <ProjectList
          projects={projects.map(
            ({ slug, title, tagline, tags, category }) => ({
              slug,
              title,
              tagline,
              tags,
              category,
            }),
          )}
          categories={getProjectCategories(projects)}
          labels={projectCategoryLabels}
        />
      )}
    </Section>
  );
}

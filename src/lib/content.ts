import { projects } from "@/content/projects";
import { skillGroups } from "@/content/skills";
import type { Project, ProjectCategory, SkillGroup } from "@/types/content";

/**
 * Read-only accessors over the content files. Components import these
 * instead of the raw arrays so that draft filtering lives in one place.
 */

export function getPublishedProjects(): Project[] {
  const published = projects.filter(
    (project) => project.visibility === "published",
  );
  // Featured first; otherwise keep the order written in the content file.
  return [...published].sort((a, b) => Number(b.featured) - Number(a.featured));
}

/** The first published project marked `featured`, if any. */
export function getFeaturedProject(): Project | undefined {
  return getPublishedProjects().find((project) => project.featured);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return getPublishedProjects().find((project) => project.slug === slug);
}

export function getVisibleSkillGroups(): SkillGroup[] {
  return skillGroups.filter((group) => group.items.length > 0);
}

export const projectCategoryLabels: Record<ProjectCategory, string> = {
  "ai-ml": "AI / ML",
  "computer-vision": "Computer Vision",
  nlp: "NLP",
  "full-stack": "Full-stack",
  other: "Other",
};

/** Categories that at least one published project uses, in label order above. */
export function getProjectCategories(projects: Project[]): ProjectCategory[] {
  const used = new Set(projects.map((project) => project.category));
  return (Object.keys(projectCategoryLabels) as ProjectCategory[]).filter(
    (category) => used.has(category),
  );
}

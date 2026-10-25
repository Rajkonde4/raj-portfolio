import { describe, expect, it } from "vitest";

import { getEnabledSections, isSectionEnabled } from "@/config/navigation";
import { projects } from "@/content/projects";
import { skillGroups } from "@/content/skills";
import {
  getProjectBySlug,
  getPublishedProjects,
  getVisibleSkillGroups,
} from "@/lib/content";
import { absoluteUrl, buildPageMetadata } from "@/lib/seo";

describe("project accessors", () => {
  it("never returns drafts", () => {
    const published = getPublishedProjects();
    expect(published.every((p) => p.visibility === "published")).toBe(true);
  });

  it("lists featured projects first", () => {
    const flags = getPublishedProjects().map((p) => p.featured);
    expect(flags).toEqual([...flags].sort((a, b) => Number(b) - Number(a)));
  });

  it("finds published projects by slug and hides drafts", () => {
    const published = projects.find((p) => p.visibility === "published");
    const draft = projects.find((p) => p.visibility === "draft");
    expect(published && getProjectBySlug(published.slug)).toBeDefined();
    expect(draft && getProjectBySlug(draft.slug)).toBeUndefined();
    expect(getProjectBySlug("does-not-exist")).toBeUndefined();
  });
});

describe("skills", () => {
  it("hides empty groups", () => {
    const visible = getVisibleSkillGroups();
    expect(visible.every((g) => g.items.length > 0)).toBe(true);
    expect(visible.length).toBe(
      skillGroups.filter((g) => g.items.length > 0).length,
    );
  });
});

describe("section registry", () => {
  it("only reports enabled sections", () => {
    const enabled = getEnabledSections();
    expect(enabled.every((s) => isSectionEnabled(s.id))).toBe(true);
    expect(isSectionEnabled("not-a-section")).toBe(false);
  });
});

describe("seo helpers", () => {
  it("builds absolute URLs on the site origin", () => {
    expect(absoluteUrl("/projects/x")).toMatch(/^https?:\/\/.+\/projects\/x$/);
  });

  it("sets canonical and Open Graph URLs", () => {
    const meta = buildPageMetadata({ title: "T", path: "/projects/x" });
    expect(meta.alternates?.canonical).toBe(absoluteUrl("/projects/x"));
    expect(meta.openGraph?.url).toBe(absoluteUrl("/projects/x"));
  });
});

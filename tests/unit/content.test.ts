import { describe, expect, it } from "vitest";

import { siteConfig } from "@/config/site";
import { achievements } from "@/content/achievements";
import { education } from "@/content/education";
import { experience } from "@/content/experience";
import { projects } from "@/content/projects";
import { skillGroups } from "@/content/skills";
import {
  achievementSchema,
  educationSchema,
  experienceSchema,
  projectSchema,
  siteConfigSchema,
  skillGroupSchema,
} from "@/lib/validations/content";

function expectUniqueIds(ids: string[]) {
  expect(new Set(ids).size).toBe(ids.length);
}

describe("content files match their schemas", () => {
  it("site config", () => {
    expect(siteConfigSchema.safeParse(siteConfig).success).toBe(true);
  });

  it("projects", () => {
    for (const project of projects) {
      const result = projectSchema.safeParse(project);
      expect(result.success, `project "${project.slug}"`).toBe(true);
    }
    expectUniqueIds(projects.map((p) => p.slug));
  });

  it("experience", () => {
    for (const item of experience) {
      expect(experienceSchema.safeParse(item).success, item.id).toBe(true);
    }
    expectUniqueIds(experience.map((e) => e.id));
  });

  it("education", () => {
    for (const item of education) {
      expect(educationSchema.safeParse(item).success, item.id).toBe(true);
    }
    expectUniqueIds(education.map((e) => e.id));
  });

  it("skills", () => {
    for (const group of skillGroups) {
      expect(skillGroupSchema.safeParse(group).success, group.id).toBe(true);
    }
    expectUniqueIds(skillGroups.map((g) => g.id));
  });

  it("achievements", () => {
    for (const item of achievements) {
      expect(achievementSchema.safeParse(item).success, item.id).toBe(true);
    }
    expectUniqueIds(achievements.map((a) => a.id));
  });
});

describe("content honesty", () => {
  it("never shows a project as implemented-and-planned at once", () => {
    for (const project of projects) {
      const { features } = project;
      if (!features) continue;
      const all = [
        ...features.implemented,
        ...(features.inProgress ?? []),
        ...features.planned,
      ];
      expect(new Set(all).size, project.slug).toBe(all.length);
    }
  });

  it("has no proficiency percentages in skills", () => {
    for (const group of skillGroups) {
      for (const item of group.items) expect(item).not.toMatch(/%/);
    }
  });
});

describe("pipeline and timeline data", () => {
  it("has unique pipeline stage ids per project", () => {
    for (const project of projects) {
      const ids = (project.pipeline ?? []).map((s) => s.id);
      expect(new Set(ids).size, project.slug).toBe(ids.length);
    }
  });

  it("lists planned work as planned, never under implemented", () => {
    for (const project of projects) {
      const implemented = new Set(project.features?.implemented ?? []);
      for (const item of project.features?.planned ?? []) {
        expect(implemented.has(item), `${project.slug}: ${item}`).toBe(false);
      }
    }
  });
});

describe("schema rules", () => {
  it("rejects slugs that are not lowercase-hyphenated", () => {
    const base = projects[0];
    expect(
      projectSchema.safeParse({ ...base, slug: "Geo Vision" }).success,
    ).toBe(false);
  });

  it("rejects non-http repository links", () => {
    const base = projects[0];
    const result = projectSchema.safeParse({
      ...base,
      links: { repository: "javascript:alert(1)" },
    });
    expect(result.success).toBe(false);
  });

  it("rejects malformed months", () => {
    const base = experience[0];
    expect(
      experienceSchema.safeParse({ ...base, start: "05/2026" }).success,
    ).toBe(false);
  });
});

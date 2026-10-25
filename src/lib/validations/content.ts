import { z } from "zod";

/**
 * Runtime schemas for every piece of editable portfolio content.
 *
 * These are the single source of truth: the TypeScript types in
 * `src/types/content.ts` are inferred from them, and the unit tests in
 * `tests/unit/content.test.ts` validate all files in `src/content` and
 * `src/config` against them. A typo in your content fails `npm test`
 * instead of silently breaking the site.
 */

export const slugSchema = z
  .string()
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Use lowercase letters, numbers and single hyphens only (e.g. geovision-ai).",
  );

const httpUrlSchema = z.url({ protocol: /^https?$/ });
const monthSchema = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Use the YYYY-MM format (e.g. 2026-05).");

/* -------------------------------------------------------------------------- */
/* Site                                                                       */
/* -------------------------------------------------------------------------- */

export const siteConfigSchema = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  url: httpUrlSchema,
  locale: z.string().min(2),
  location: z.string().optional(),
  roles: z.array(z.string().min(1)).min(1),
  headline: z.string().min(1),
  summary: z.string().min(1),
  focusAreas: z.array(z.string().min(1)),
  about: z.object({
    /** The professional story, one paragraph per entry. */
    paragraphs: z.array(z.string().min(1)).min(1),
    /** One sentence on the roles you are looking for. */
    direction: z.string().min(1),
  }),
  email: z.email().optional(),
  social: z.object({
    github: httpUrlSchema,
    linkedin: httpUrlSchema,
  }),
  resume: z.object({
    /** Public URL path. The file itself lives in `public/resume/`. */
    path: z.string().startsWith("/"),
    label: z.string().min(1),
  }),
  copyrightYear: z.number().int().min(2000),
});

/* -------------------------------------------------------------------------- */
/* Projects                                                                   */
/* -------------------------------------------------------------------------- */

export const projectCategorySchema = z.enum([
  "ai-ml",
  "computer-vision",
  "nlp",
  "full-stack",
  "other",
]);

export const projectSchema = z.object({
  slug: slugSchema,
  title: z.string().min(1),
  tagline: z.string().min(1),
  summary: z.string().min(1),
  category: projectCategorySchema,
  status: z.enum(["completed", "in-progress", "prototype"]),
  /** `draft` projects are hidden from the site, sitemap and static params. */
  visibility: z.enum(["published", "draft"]),
  featured: z.boolean(),
  tags: z.array(z.string().min(1)),
  problem: z.string().optional(),
  architecture: z.array(z.string().min(1)).optional(),
  contribution: z.string().optional(),
  /**
   * Keep implemented, in-progress and planned work clearly separated.
   * Only list something as implemented when it works today.
   */
  features: z
    .object({
      implemented: z.array(z.string().min(1)),
      inProgress: z.array(z.string().min(1)).optional(),
      planned: z.array(z.string().min(1)),
    })
    .optional(),
  /**
   * Optional stage-by-stage view of how the system works. Each stage carries
   * its own honest status, so unfinished stages are never shown as done.
   */
  pipeline: z
    .array(
      z.object({
        id: slugSchema,
        label: z.string().min(1),
        technology: z.string().optional(),
        description: z.string().min(1),
        status: z.enum(["implemented", "in-progress", "planned"]),
      }),
    )
    .optional(),
  /** Honest gaps, for example "accuracy has not been evaluated yet". */
  limitations: z.array(z.string().min(1)).optional(),
  links: z.object({
    repository: httpUrlSchema.optional(),
    demo: httpUrlSchema.optional(),
  }),
  preview: z
    .object({
      /** Path under `public/`, e.g. `/images/projects/geovision-ai.png`. */
      src: z.string().startsWith("/"),
      alt: z.string().min(1),
    })
    .optional(),
});

/* -------------------------------------------------------------------------- */
/* Experience, education, skills, achievements                                */
/* -------------------------------------------------------------------------- */

export const experienceSchema = z.object({
  id: slugSchema,
  role: z.string().min(1),
  organization: z.string().min(1),
  type: z.enum(["internship", "development", "leadership"]),
  start: monthSchema.optional(),
  end: z.union([monthSchema, z.literal("present")]).optional(),
  summary: z.string().optional(),
  highlights: z.array(z.string().min(1)),
});

export const educationSchema = z.object({
  id: slugSchema,
  degree: z.string().min(1),
  institution: z.string().min(1),
  location: z.string().optional(),
  /** Free text exactly as on the resume, e.g. "CGPA 8.86". */
  grade: z.string().optional(),
  /** Defaults to "completed". Use "expected" while still studying. */
  graduation: z.enum(["expected", "completed"]).optional(),
  start: monthSchema.optional(),
  end: z.union([monthSchema, z.literal("present")]).optional(),
});

export const skillGroupSchema = z.object({
  id: slugSchema,
  label: z.string().min(1),
  /** Short context shown under the label, e.g. why a group is separate. */
  note: z.string().optional(),
  /** Names only. Never add fabricated proficiency percentages. */
  items: z.array(z.string().min(1)),
});

export const achievementSchema = z.object({
  id: slugSchema,
  title: z.string().min(1),
  category: z.enum(["achievement", "event", "presentation", "certification"]),
  issuer: z.string().optional(),
  date: monthSchema.optional(),
  url: httpUrlSchema.optional(),
  description: z.string().optional(),
});

import type { z } from "zod";

import type {
  achievementSchema,
  educationSchema,
  experienceSchema,
  projectCategorySchema,
  projectSchema,
  siteConfigSchema,
  skillGroupSchema,
} from "@/lib/validations/content";

export type SiteConfig = z.infer<typeof siteConfigSchema>;
export type Project = z.infer<typeof projectSchema>;
export type PipelineStage = NonNullable<Project["pipeline"]>[number];
export type FeatureStatus = PipelineStage["status"];
export type ProjectCategory = z.infer<typeof projectCategorySchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type Education = z.infer<typeof educationSchema>;
export type SkillGroup = z.infer<typeof skillGroupSchema>;
export type Achievement = z.infer<typeof achievementSchema>;

/** One entry in the section registry (`src/config/navigation.ts`). */
export interface SectionConfig {
  id: string;
  label: string;
  /** Hash link on the home page, e.g. `#projects`. */
  anchor: string;
  /** Only enabled sections render and appear in the navigation. */
  enabled: boolean;
}

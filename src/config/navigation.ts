import type { SectionConfig } from "@/types/content";

/**
 * Section registry. Set `enabled` to false to hide a section and its
 * navigation link; reorder entries to reorder the navigation.
 *
 * The home page renders enabled sections in this order (see
 * `src/app/page.tsx`). Sections marked `enabled: false` are planned in
 * docs/DEVELOPMENT_ROADMAP.md and are not built yet.
 */
export const sections: SectionConfig[] = [
  { id: "projects", label: "Projects", anchor: "#projects", enabled: true },
  { id: "geovision", label: "GeoVision", anchor: "#geovision", enabled: true },
  { id: "about", label: "About", anchor: "#about", enabled: true },
  { id: "skills", label: "Skills", anchor: "#skills", enabled: true },
  {
    id: "experience",
    label: "Experience",
    anchor: "#experience",
    enabled: true,
  },
  {
    id: "achievements",
    label: "Credentials",
    anchor: "#achievements",
    enabled: true,
  },
  { id: "contact", label: "Contact", anchor: "#contact", enabled: true },
];

export function getEnabledSections(): SectionConfig[] {
  return sections.filter((section) => section.enabled);
}

export function isSectionEnabled(id: string): boolean {
  return sections.some((section) => section.id === id && section.enabled);
}

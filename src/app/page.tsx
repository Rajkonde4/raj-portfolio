import { Suspense, type ReactNode } from "react";

import { ProjectsSection } from "@/components/projects/projects-section";
import { Contact } from "@/components/sections/contact";
import { Achievements } from "@/components/sections/achievements";
import { About } from "@/components/sections/about";
import { Experience } from "@/components/sections/experience";
import { GeovisionSpotlight } from "@/components/sections/geovision-spotlight";
import { Hero } from "@/components/sections/hero";
import { Section } from "@/components/shared/section";
import { Skills } from "@/components/sections/skills";
import { getEnabledSections } from "@/config/navigation";
import { buildPersonJsonLd, serializeJsonLd } from "@/lib/seo";

/**
 * Component for each section id in `src/config/navigation.ts`. The registry
 * decides which sections render and in which order; a registry entry without
 * a component here is skipped, so a half-added section never breaks the page.
 */
const sectionComponents: Record<string, ReactNode> = {
  projects: <ProjectsSection />,
  geovision: <GeovisionSpotlight />,
  about: <About />,
  skills: <Skills />,
  experience: <Experience />,
  achievements: <Achievements />,
  // Reads mail settings at request time, so it gets its own boundary: the rest
  // of the page stays in the prerendered HTML instead of waiting behind it.
  contact: (
    <Suspense
      fallback={
        <Section id="contact" eyebrow="Contact" title="Get in touch">
          <p className="text-muted">Loading contact options&hellip;</p>
        </Section>
      }
    >
      <Contact />
    </Suspense>
  ),
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(buildPersonJsonLd()),
        }}
      />
      <Hero />
      {getEnabledSections().map((section) => (
        <div key={section.id}>{sectionComponents[section.id] ?? null}</div>
      ))}
    </>
  );
}

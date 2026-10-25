import { ArrowDown, ArrowUpRight, Download } from "lucide-react";

import { Reveal } from "@/components/animations/reveal";
import { RoleRotator } from "@/components/hero/role-rotator";
import { Container } from "@/components/shared/container";
import { isSectionEnabled } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { isResumeAvailable } from "@/lib/resume";

const primaryButton =
  "inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-background transition-[color,background-color,border-color,opacity,transform] hover:opacity-90 active:scale-[0.98]";
const secondaryButton =
  "inline-flex items-center gap-2 rounded-full border border-border-strong px-5 py-2.5 text-sm transition-[color,background-color,border-color,opacity,transform] hover:border-accent hover:text-accent active:scale-[0.98]";

export function Hero() {
  const { name, roles, headline, summary, location, social, resume } =
    siteConfig;
  const showResume = isResumeAvailable();

  return (
    <section aria-labelledby="hero-heading" className="pt-20 sm:pt-32">
      <Container>
        {/* No entrance animation here: this line and the name below paint
            immediately so the real hero is the largest-contentful-paint element. */}
        <p className="font-mono text-xs tracking-[0.2em] text-accent uppercase">
          <RoleRotator roles={roles} />
          {location && <span aria-hidden="true">{"  /  "}</span>}
          {location}
        </p>
        <h1
          id="hero-heading"
          className="mt-6 font-serif text-[clamp(3.5rem,11vw,8rem)] leading-[0.92] tracking-tight"
        >
          {name}
        </h1>
        <Reveal delay={220}>
          <p className="mt-8 max-w-2xl text-xl leading-snug text-foreground sm:text-2xl">
            {headline}
          </p>
          <p className="mt-5 max-w-2xl leading-relaxed text-muted">{summary}</p>
        </Reveal>

        <Reveal delay={340} className="mt-10 flex flex-wrap items-center gap-3">
          {isSectionEnabled("projects") && (
            <a href="#projects" className={primaryButton}>
              Explore projects
              <ArrowDown aria-hidden className="size-4" />
            </a>
          )}
          {showResume && (
            <a href={resume.path} download className={secondaryButton}>
              {resume.label}
              <Download aria-hidden className="size-4" />
            </a>
          )}
          <a
            href={social.github}
            target="_blank"
            rel="noopener noreferrer"
            className={secondaryButton}
          >
            GitHub
            <ArrowUpRight aria-hidden className="size-4" />
          </a>
          <a
            href={social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className={secondaryButton}
          >
            LinkedIn
            <ArrowUpRight aria-hidden className="size-4" />
          </a>
        </Reveal>
      </Container>
    </section>
  );
}

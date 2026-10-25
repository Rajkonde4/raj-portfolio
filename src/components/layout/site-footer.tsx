import { Container } from "@/components/shared/container";
import { siteConfig } from "@/config/site";

export function SiteFooter() {
  const { social, name, copyrightYear } = siteConfig;

  return (
    <footer className="mt-24 border-t border-border py-8 text-sm text-muted">
      <Container className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p>
          &copy; {copyrightYear} {name}
        </p>
        <ul className="flex gap-6">
          <li>
            <a
              href={social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-sm transition-colors hover:text-foreground"
            >
              GitHub
            </a>
          </li>
          <li>
            <a
              href={social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-sm transition-colors hover:text-foreground"
            >
              LinkedIn
            </a>
          </li>
        </ul>
      </Container>
    </footer>
  );
}

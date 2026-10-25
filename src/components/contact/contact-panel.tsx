import { ArrowUpRight, Download } from "lucide-react";

import { ContactForm } from "@/components/contact/contact-form";
import { siteConfig } from "@/config/site";

const linkClass =
  "group inline-flex items-center gap-2 border-b border-border-strong py-3 text-lg transition-colors hover:border-accent hover:text-accent";

/**
 * Contact links, plus the form when the server has a mail provider configured.
 * `formEnabled` is decided on the server; when false the form is not rendered
 * at all and the page says so, instead of showing a form that cannot work.
 */
export function ContactPanel({
  formEnabled,
  showResume,
}: {
  formEnabled: boolean;
  showResume: boolean;
}) {
  const { email, social, resume } = siteConfig;

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
      <div>
        <p className="font-serif text-2xl leading-snug sm:text-3xl">
          Open to AI/ML engineering roles and interesting projects.
        </p>
        <ul className="mt-8 flex flex-col items-start">
          {email && (
            <li>
              <a href={`mailto:${email}`} className={linkClass}>
                {email}
              </a>
            </li>
          )}
          <li>
            <a
              href={social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              LinkedIn
              <ArrowUpRight aria-hidden className="size-4" />
            </a>
          </li>
          <li>
            <a
              href={social.github}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              GitHub
              <ArrowUpRight aria-hidden className="size-4" />
            </a>
          </li>
          {showResume && (
            <li>
              <a href={resume.path} download className={linkClass}>
                {resume.label}
                <Download aria-hidden className="size-4" />
              </a>
            </li>
          )}
        </ul>
      </div>

      <div>
        {formEnabled ? (
          <ContactForm />
        ) : (
          <p className="rounded-lg border border-dashed border-border-strong p-8 text-muted">
            The contact form is not enabled on this deployment. Please use the
            links to reach me.
          </p>
        )}
      </div>
    </div>
  );
}

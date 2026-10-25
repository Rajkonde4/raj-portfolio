import { connection } from "next/server";

import { ContactPanel } from "@/components/contact/contact-panel";
import { Section } from "@/components/shared/section";
import { isContactFormEnabled } from "@/lib/contact-config";
import { isResumeAvailable } from "@/lib/resume";

/**
 * Reads the mail configuration at request time (`connection()`), so enabling
 * the form means setting environment variables and restarting, not rebuilding.
 * Everything else on the page stays statically prerendered.
 */
export async function Contact() {
  await connection();

  return (
    <Section id="contact" eyebrow="Contact" title="Get in touch">
      <ContactPanel
        formEnabled={isContactFormEnabled()}
        showResume={isResumeAvailable()}
      />
    </Section>
  );
}

/**
 * Server-side contact-form configuration. Import this only from server code
 * (the API route and server components): the values include an API key.
 *
 * The form is enabled only when all three variables are set; otherwise the
 * site shows plain contact links and the API answers 503.
 */
export interface ContactConfig {
  apiKey: string;
  to: string;
  from: string;
  /** Overridable so tests can point at a local fake mail server. */
  apiUrl: string;
}

const DEFAULT_API_URL = "https://api.resend.com/emails";

export function getContactConfig(
  env: Record<string, string | undefined> = process.env,
): ContactConfig | null {
  const apiKey = env.RESEND_API_KEY?.trim();
  const to = env.CONTACT_TO_EMAIL?.trim();
  const from = env.CONTACT_FROM_EMAIL?.trim();
  if (!apiKey || !to || !from) return null;
  return {
    apiKey,
    to,
    from,
    apiUrl: env.RESEND_API_URL?.trim() || DEFAULT_API_URL,
  };
}

export function isContactFormEnabled(
  env: Record<string, string | undefined> = process.env,
): boolean {
  return getContactConfig(env) !== null;
}

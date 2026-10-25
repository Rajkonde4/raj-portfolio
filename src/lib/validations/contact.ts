import { z } from "zod";

export const CONTACT_LIMITS = {
  nameMax: 100,
  emailMax: 254,
  messageMin: 10,
  messageMax: 2000,
} as const;

/**
 * Contact form payload. Shared by the browser form (instant feedback) and the
 * API route (the check that actually counts: never trust the client).
 *
 * `website` is a honeypot: real visitors never see or fill it, so any value
 * means an automated submission.
 */
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Please enter your name.")
    .max(CONTACT_LIMITS.nameMax, "Please use a shorter name."),
  email: z
    .string()
    .trim()
    .max(CONTACT_LIMITS.emailMax, "That email address is too long.")
    .pipe(z.email("Please enter a valid email address.")),
  message: z
    .string()
    .trim()
    .min(
      CONTACT_LIMITS.messageMin,
      `Please write at least ${CONTACT_LIMITS.messageMin} characters.`,
    )
    .max(
      CONTACT_LIMITS.messageMax,
      `Please keep the message under ${CONTACT_LIMITS.messageMax} characters.`,
    ),
  website: z.string().max(0).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ContactField = "name" | "email" | "message";

/** First error message per field, for display next to each input. */
export function fieldErrors(
  error: z.ZodError,
): Partial<Record<ContactField, string>> {
  const result: Partial<Record<ContactField, string>> = {};
  for (const issue of error.issues) {
    const field = issue.path[0];
    if (
      (field === "name" || field === "email" || field === "message") &&
      !result[field]
    ) {
      result[field] = issue.message;
    }
  }
  return result;
}

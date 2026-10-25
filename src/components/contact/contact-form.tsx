"use client";

import { LoaderCircle } from "lucide-react";
import { useId, useState, type FormEvent } from "react";

import {
  CONTACT_LIMITS,
  contactSchema,
  fieldErrors,
  type ContactField,
} from "@/lib/validations/contact";

type Status = "idle" | "sending" | "sent" | "error";
type Errors = Partial<Record<ContactField, string>>;

const serverMessages: Record<string, string> = {
  rate_limited:
    "Too many messages from your connection. Please try again later.",
  send_failed:
    "The message could not be sent right now. Please try again, or use the links above.",
  forbidden: "The message was blocked. Please reload the page and try again.",
  too_large: "That message is too long to send.",
  not_configured: "The contact form is not available at the moment.",
};

const inputClass =
  "mt-2 w-full rounded-md border border-border-strong bg-background/60 px-4 py-3 text-foreground placeholder:text-muted/70 focus-visible:border-accent aria-[invalid=true]:border-red-400/70 disabled:opacity-60";

/**
 * Contact form. Validates in the browser for fast feedback, then posts to
 * /api/contact, which validates again. A success message appears only after
 * the server confirms the message was handed to the mail provider.
 */
export function ContactForm() {
  const formId = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const input = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      message: String(data.get("message") ?? ""),
      website: String(data.get("website") ?? ""),
    };

    const parsed = contactSchema.safeParse(input);
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      setFormError(null);
      setStatus("idle");
      const first = (["name", "email", "message"] as const).find(
        (field) => fieldErrors(parsed.error)[field],
      );
      if (first) form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setErrors({});
    setFormError(null);
    setStatus("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (response.ok) {
        form.reset();
        setMessage("");
        setStatus("sent");
        return;
      }
      const body = (await response.json().catch(() => null)) as {
        error?: string;
        fields?: Errors;
      } | null;
      if (body?.error === "validation" && body.fields) {
        setErrors(body.fields);
      } else {
        setFormError(
          serverMessages[body?.error ?? ""] ??
            "Something went wrong. Please try again.",
        );
      }
      setStatus("error");
    } catch {
      setFormError(
        "Could not reach the server. Check your connection and try again.",
      );
      setStatus("error");
    }
  }

  const sending = status === "sending";

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <div>
        <label htmlFor={`${formId}-name`} className="text-sm text-muted">
          Name
        </label>
        <input
          id={`${formId}-name`}
          name="name"
          type="text"
          autoComplete="name"
          maxLength={CONTACT_LIMITS.nameMax}
          disabled={sending}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? `${formId}-name-error` : undefined}
          className={inputClass}
        />
        {errors.name && (
          <p id={`${formId}-name-error`} className="mt-2 text-sm text-red-300">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor={`${formId}-email`} className="text-sm text-muted">
          Email
        </label>
        <input
          id={`${formId}-email`}
          name="email"
          type="email"
          autoComplete="email"
          maxLength={CONTACT_LIMITS.emailMax}
          disabled={sending}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? `${formId}-email-error` : undefined}
          className={inputClass}
        />
        {errors.email && (
          <p id={`${formId}-email-error`} className="mt-2 text-sm text-red-300">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor={`${formId}-message`} className="text-sm text-muted">
          Message
        </label>
        <textarea
          id={`${formId}-message`}
          name="message"
          rows={6}
          maxLength={CONTACT_LIMITS.messageMax}
          disabled={sending}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={
            errors.message
              ? `${formId}-message-error`
              : `${formId}-message-count`
          }
          className={inputClass}
        />
        <div className="mt-2 flex justify-between gap-4 text-sm">
          {errors.message ? (
            <p id={`${formId}-message-error`} className="text-red-300">
              {errors.message}
            </p>
          ) : (
            <span />
          )}
          <p
            id={`${formId}-message-count`}
            className="font-mono text-xs text-muted"
          >
            {message.length}/{CONTACT_LIMITS.messageMax}
          </p>
        </div>
      </div>

      {/* Honeypot: invisible and unreachable for people; bots tend to fill it. */}
      <div
        aria-hidden="true"
        inert
        className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
      >
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={sending}
          className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-background transition-[color,background-color,border-color,opacity,transform] hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
        >
          {sending && (
            <LoaderCircle aria-hidden className="size-4 animate-spin" />
          )}
          {sending ? "Sending" : "Send message"}
        </button>
        <p role="status" aria-live="polite" className="text-sm">
          {status === "sent" && (
            <span className="text-accent">
              Thanks, your message was sent. I will reply by email.
            </span>
          )}
          {formError && <span className="text-red-300">{formError}</span>}
        </p>
      </div>
    </form>
  );
}

import { getContactConfig, type ContactConfig } from "@/lib/contact-config";
import { createRateLimiter } from "@/lib/rate-limit";
import { contactSchema, fieldErrors } from "@/lib/validations/contact";

const MAX_BODY_BYTES = 10_000;

/**
 * Messages allowed per hour per visitor address. Default 5; override with
 * CONTACT_RATE_LIMIT_PER_HOUR (a positive whole number).
 */
export function rateLimitFromEnv(
  env: Record<string, string | undefined> = process.env,
): number {
  const value = Number(env.CONTACT_RATE_LIMIT_PER_HOUR);
  return Number.isInteger(value) && value >= 1 ? value : 5;
}

const defaultLimiter = createRateLimiter({
  limit: rateLimitFromEnv(),
  windowMs: 60 * 60 * 1000,
});

export interface ContactDeps {
  config?: ContactConfig | null;
  fetchImpl?: typeof fetch;
  limiter?: Pick<ReturnType<typeof createRateLimiter>, "check">;
}

function json(body: unknown, status: number, headers?: HeadersInit) {
  return Response.json(body, { status, headers });
}

/** The request must come from this site's own pages. */
function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  let originHost: string;
  try {
    originHost = new URL(origin).host;
  } catch {
    return false;
  }
  const hosts = [
    request.headers.get("host"),
    request.headers.get("x-forwarded-host"),
  ].filter(Boolean);
  return hosts.includes(originHost);
}

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

/** Subject lines must never contain line breaks (header injection). */
function singleLine(value: string): string {
  return value.replace(/[\r\n\t]+/g, " ").trim();
}

/**
 * POST /api/contact. Order matters: configuration, origin, size, rate limit,
 * JSON, validation, honeypot, then send. Errors never echo internals.
 */
export async function handleContactRequest(
  request: Request,
  {
    config = getContactConfig(),
    fetchImpl = fetch,
    limiter = defaultLimiter,
  }: ContactDeps = {},
): Promise<Response> {
  if (!config) return json({ error: "not_configured" }, 503);
  if (!isSameOrigin(request)) return json({ error: "forbidden" }, 403);

  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_BODY_BYTES) {
    return json({ error: "too_large" }, 413);
  }

  const limit = limiter.check(clientKey(request));
  if (!limit.allowed) {
    return json({ error: "rate_limited" }, 429, {
      "Retry-After": String(limit.retryAfterSeconds),
    });
  }

  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return json({ error: "invalid" }, 400);
  }
  if (raw.length > MAX_BODY_BYTES) return json({ error: "too_large" }, 413);

  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch {
    return json({ error: "invalid" }, 400);
  }

  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    return json(
      { error: "validation", fields: fieldErrors(parsed.error) },
      400,
    );
  }
  if (parsed.data.website) return json({ error: "invalid" }, 400);

  const { name, email, message } = parsed.data;
  try {
    const response = await fetchImpl(config.apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: config.from,
        to: [config.to],
        reply_to: email,
        subject: `Portfolio message from ${singleLine(name)}`,
        text: `From: ${singleLine(name)} <${email}>\n\n${message}`,
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) {
      console.error(`Contact form: mail provider returned ${response.status}`);
      return json({ error: "send_failed" }, 502);
    }
  } catch (error) {
    console.error(
      "Contact form: mail provider unreachable:",
      error instanceof Error ? error.name : "unknown error",
    );
    return json({ error: "send_failed" }, 502);
  }

  return json({ ok: true }, 200);
}

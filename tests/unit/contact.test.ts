import { describe, expect, it, vi } from "vitest";

import { getContactConfig, isContactFormEnabled } from "@/lib/contact-config";
import { handleContactRequest, rateLimitFromEnv } from "@/lib/contact-handler";
import { createRateLimiter } from "@/lib/rate-limit";
import { contactSchema, fieldErrors } from "@/lib/validations/contact";

const config = {
  apiKey: "test-key",
  to: "me@example.com",
  from: "Portfolio <noreply@example.com>",
  apiUrl: "https://mail.example.test/emails",
};

const valid = {
  name: "Asha",
  email: "asha@example.com",
  message: "Hello, I would like to talk about a role.",
};

function request(
  body: unknown,
  headers: Record<string, string> = {},
  raw?: string,
) {
  return new Request("https://site.test/api/contact", {
    method: "POST",
    headers: {
      host: "site.test",
      origin: "https://site.test",
      "content-type": "application/json",
      ...headers,
    },
    body: raw ?? JSON.stringify(body),
  });
}

function okFetch() {
  return vi.fn(async () => new Response("{}", { status: 200 }));
}

describe("contactSchema", () => {
  it("accepts a valid message and trims whitespace", () => {
    const result = contactSchema.safeParse({
      ...valid,
      name: "  Asha  ",
      message: "  Hello there, nice to meet you.  ",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Asha");
      expect(result.data.message).toBe("Hello there, nice to meet you.");
    }
  });

  it("reports one message per bad field", () => {
    const result = contactSchema.safeParse({
      name: "",
      email: "nope",
      message: "short",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = fieldErrors(result.error);
      expect(Object.keys(errors).sort()).toEqual(["email", "message", "name"]);
    }
  });

  it("rejects over-long messages and a filled honeypot", () => {
    expect(
      contactSchema.safeParse({ ...valid, message: "x".repeat(2001) }).success,
    ).toBe(false);
    expect(
      contactSchema.safeParse({ ...valid, website: "http://spam" }).success,
    ).toBe(false);
    expect(contactSchema.safeParse({ ...valid, website: "" }).success).toBe(
      true,
    );
  });
});

describe("createRateLimiter", () => {
  it("blocks after the limit, then allows again after the window", () => {
    let time = 0;
    const limiter = createRateLimiter({
      limit: 2,
      windowMs: 1000,
      now: () => time,
    });
    expect(limiter.check("a").allowed).toBe(true);
    expect(limiter.check("a").allowed).toBe(true);
    const blocked = limiter.check("a");
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSeconds).toBe(1);
    expect(limiter.check("b").allowed).toBe(true);
    time = 1001;
    expect(limiter.check("a").allowed).toBe(true);
  });
});

describe("getContactConfig", () => {
  it("needs all three variables", () => {
    expect(getContactConfig({})).toBeNull();
    expect(
      getContactConfig({ RESEND_API_KEY: "k", CONTACT_TO_EMAIL: "a@b.c" }),
    ).toBeNull();
    expect(isContactFormEnabled({ RESEND_API_KEY: "  " })).toBe(false);
  });

  it("returns the settings and defaults the API URL", () => {
    const result = getContactConfig({
      RESEND_API_KEY: "k",
      CONTACT_TO_EMAIL: "to@x.y",
      CONTACT_FROM_EMAIL: "from@x.y",
    });
    expect(result?.apiUrl).toBe("https://api.resend.com/emails");
  });
});

describe("rateLimitFromEnv", () => {
  it("defaults to 5 and ignores invalid values", () => {
    expect(rateLimitFromEnv({})).toBe(5);
    expect(rateLimitFromEnv({ CONTACT_RATE_LIMIT_PER_HOUR: "0" })).toBe(5);
    expect(rateLimitFromEnv({ CONTACT_RATE_LIMIT_PER_HOUR: "abc" })).toBe(5);
    expect(rateLimitFromEnv({ CONTACT_RATE_LIMIT_PER_HOUR: "20" })).toBe(20);
  });
});

describe("handleContactRequest", () => {
  const limiter = () => createRateLimiter({ limit: 100, windowMs: 1000 });

  it("answers 503 when the form is not configured and sends nothing", async () => {
    const fetchImpl = okFetch();
    const response = await handleContactRequest(request(valid), {
      config: null,
      fetchImpl,
      limiter: limiter(),
    });
    expect(response.status).toBe(503);
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("rejects requests from another origin or with no origin", async () => {
    for (const headers of [{ origin: "https://evil.test" }, { origin: "" }]) {
      const fetchImpl = okFetch();
      const response = await handleContactRequest(request(valid, headers), {
        config,
        fetchImpl,
        limiter: limiter(),
      });
      expect(response.status).toBe(403);
      expect(fetchImpl).not.toHaveBeenCalled();
    }
  });

  it("sends a valid message with reply-to and the server-side key", async () => {
    const fetchImpl = okFetch();
    const response = await handleContactRequest(request(valid), {
      config,
      fetchImpl,
      limiter: limiter(),
    });
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });

    expect(fetchImpl).toHaveBeenCalledTimes(1);
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [
      string,
      RequestInit,
    ];
    expect(url).toBe(config.apiUrl);
    expect((init.headers as Record<string, string>).Authorization).toBe(
      "Bearer test-key",
    );
    const sent = JSON.parse(init.body as string);
    expect(sent).toMatchObject({
      from: config.from,
      to: [config.to],
      reply_to: valid.email,
      subject: "Portfolio message from Asha",
    });
    expect(sent.text).toContain(valid.message);
  });

  it("keeps line breaks out of the subject", async () => {
    const fetchImpl = okFetch();
    await handleContactRequest(
      request({ ...valid, name: "Eve\r\nBcc: evil@example.com" }),
      { config, fetchImpl, limiter: limiter() },
    );
    const [, init] = fetchImpl.mock.calls[0] as unknown as [
      string,
      RequestInit,
    ];
    expect(JSON.parse(init.body as string).subject).not.toMatch(/[\r\n]/);
  });

  it("returns field errors for invalid input without sending", async () => {
    const fetchImpl = okFetch();
    const response = await handleContactRequest(
      request({ name: "", email: "x", message: "y" }),
      { config, fetchImpl, limiter: limiter() },
    );
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe("validation");
    expect(body.fields.email).toBeTruthy();
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("rejects the honeypot, bad JSON and oversized bodies", async () => {
    const fetchImpl = okFetch();
    const deps = { config, fetchImpl, limiter: limiter() };
    expect(
      (await handleContactRequest(request({ ...valid, website: "spam" }), deps))
        .status,
    ).toBe(400);
    expect(
      (await handleContactRequest(request(null, {}, "{not json"), deps)).status,
    ).toBe(400);
    expect(
      (
        await handleContactRequest(
          request({ ...valid, message: "x".repeat(20_000) }),
          deps,
        )
      ).status,
    ).toBe(413);
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("limits repeated sends and says when to retry", async () => {
    const deps = {
      config,
      fetchImpl: okFetch(),
      limiter: createRateLimiter({ limit: 1, windowMs: 60_000 }),
    };
    expect((await handleContactRequest(request(valid), deps)).status).toBe(200);
    const blocked = await handleContactRequest(request(valid), deps);
    expect(blocked.status).toBe(429);
    expect(Number(blocked.headers.get("retry-after"))).toBeGreaterThan(0);
  });

  it("reports a provider failure without leaking details", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const failing = vi.fn(
      async () => new Response("secret provider error", { status: 500 }),
    );
    const response = await handleContactRequest(request(valid), {
      config,
      fetchImpl: failing,
      limiter: limiter(),
    });
    expect(response.status).toBe(502);
    const text = await response.text();
    expect(text).toContain("send_failed");
    expect(text).not.toContain("secret");

    const throwing = vi.fn(async () => {
      throw new Error("ECONNREFUSED key=test-key");
    });
    const second = await handleContactRequest(request(valid), {
      config,
      fetchImpl: throwing,
      limiter: limiter(),
    });
    expect(second.status).toBe(502);
    expect(await second.text()).not.toContain("test-key");
    vi.restoreAllMocks();
  });
});

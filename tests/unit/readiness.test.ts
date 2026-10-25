import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { collectChecks, summarize } from "../../scripts/readiness.mjs";
import { isLocalUrl, resolveSiteUrl } from "@/lib/site-url";
import { buildPersonJsonLd, serializeJsonLd } from "@/lib/seo";

function fixture(projects: string, withResume = true) {
  const root = mkdtempSync(join(tmpdir(), "ready-"));
  mkdirSync(join(root, "src/content"), { recursive: true });
  mkdirSync(join(root, "public/resume"), { recursive: true });
  writeFileSync(join(root, "src/content/projects.ts"), projects);
  if (withResume)
    writeFileSync(join(root, "public/resume/Raj_Konde_Resume.pdf"), "x");
  return root;
}

describe("readiness script", () => {
  it("flags placeholders, missing resume and localhost URL as blockers", () => {
    const root = fixture('const a = "Details to be added";', false);
    const checks = collectChecks(root, {
      NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
    });
    expect(summarize(checks).blockers).toBe(3);
  });

  it("warns about TODOs and missing links but has no blockers when complete enough", () => {
    const root = fixture("// TODO(Raj): x\n");
    const s = summarize(collectChecks(root, {}));
    expect(s.blockers).toBe(0);
    expect(s.warnings).toBeGreaterThanOrEqual(3);
  });

  it("is quiet about links when projects declare them", () => {
    const root = fixture('x = { repository: "a", contribution: "b" }');
    const titles = collectChecks(root, {
      NEXT_PUBLIC_SITE_URL: "https://a.dev",
    }).map((c: { title: string }) => c.title);
    expect(titles.join()).not.toMatch(/repository|contribution|NEXT_PUBLIC/);
  });
});

describe("resolveSiteUrl", () => {
  it("prefers the explicit URL and trims slashes", () => {
    expect(
      resolveSiteUrl({
        NEXT_PUBLIC_SITE_URL: "https://a.dev/",
        VERCEL_URL: "x.vercel.app",
      }),
    ).toBe("https://a.dev");
  });
  it("falls back to Vercel production, then preview, then localhost", () => {
    expect(
      resolveSiteUrl({
        VERCEL_PROJECT_PRODUCTION_URL: "raj.dev",
        VERCEL_URL: "p.vercel.app",
      }),
    ).toBe("https://raj.dev");
    expect(resolveSiteUrl({ VERCEL_URL: "p.vercel.app" })).toBe(
      "https://p.vercel.app",
    );
    expect(resolveSiteUrl({})).toBe("http://localhost:3000");
  });
  it("detects local URLs", () => {
    expect(isLocalUrl("http://localhost:3000")).toBe(true);
    expect(isLocalUrl("https://raj.dev")).toBe(false);
    expect(isLocalUrl("nonsense")).toBe(false);
  });
});

describe("structured data", () => {
  it("builds a Person and escapes < so it cannot close the script tag", () => {
    const person = buildPersonJsonLd();
    expect(person["@type"]).toBe("Person");
    expect(serializeJsonLd({ a: "</script><b>" })).not.toContain("<");
  });
});

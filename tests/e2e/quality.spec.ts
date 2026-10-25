import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

/**
 * Phase 5 quality checks: accessibility (axe), SEO metadata, links, keyboard
 * focus, and a clean browser console (which also proves the Content Security
 * Policy blocks nothing the site needs).
 */

const PAGES = [
  { name: "home", path: "/" },
  { name: "GeoVision AI case study", path: "/projects/geovision-ai" },
  { name: "TrustChain AI case study", path: "/projects/trustchain-ai" },
  { name: "not found", path: "/projects/does-not-exist" },
];

async function axeViolations(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"])
    .analyze();
  return results.violations.map((v) => ({
    id: v.id,
    impact: v.impact,
    help: v.help,
    nodes: v.nodes.slice(0, 3).map((n) => n.target.join(" ")),
  }));
}

for (const { name, path } of PAGES) {
  test(`axe finds no accessibility violations: ${name}`, async ({ page }) => {
    await page.goto(path);
    // Let entrance animations finish so contrast is measured at full opacity.
    await page.waitForTimeout(1200);
    expect(await axeViolations(page)).toEqual([]);
  });
}

test("axe: mobile menu open", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile menu only");
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  await page.waitForTimeout(500);
  expect(await axeViolations(page)).toEqual([]);
});

test("axe: contact form with validation errors showing", async ({ page }) => {
  await page.goto("/");
  await page
    .locator("#contact form")
    .getByRole("button", { name: "Send message" })
    .click();
  await page.waitForTimeout(500);
  expect(await axeViolations(page)).toEqual([]);
});

test("axe: reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  expect(await axeViolations(page)).toEqual([]);
});

for (const { name, path } of PAGES.slice(0, 3)) {
  test(`SEO metadata is complete: ${name}`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");

    const title = await page.title();
    expect(title.length).toBeGreaterThan(10);
    expect(title.length).toBeLessThanOrEqual(70);

    const description = await page
      .locator('meta[name="description"]')
      .getAttribute("content");
    expect(description?.length).toBeGreaterThan(50);
    expect(description?.length).toBeLessThanOrEqual(200);

    const canonical = await page
      .locator('link[rel="canonical"]')
      .getAttribute("href");
    expect(canonical).toMatch(/^https?:\/\//);
    expect(canonical).toContain(path === "/" ? "" : path);

    for (const property of [
      "og:title",
      "og:description",
      "og:url",
      "og:image",
    ]) {
      await expect(
        page.locator(`meta[property="${property}"]`),
        property,
      ).toHaveCount(1);
    }
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      "content",
      "summary_large_image",
    );
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator('meta[name="viewport"]')).toHaveCount(1);
  });
}

test("not-found pages are kept out of search results", async ({ page }) => {
  const response = await page.goto("/projects/does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );
});

test("home page has person structured data built from the site config", async ({
  page,
}) => {
  await page.goto("/");
  const raw = await page
    .locator('script[type="application/ld+json"]')
    .first()
    .textContent();
  const data = JSON.parse(raw ?? "{}");
  expect(data["@type"]).toBe("Person");
  expect(data.name).toBe("Raj Konde");
  expect(data.sameAs).toEqual(
    expect.arrayContaining([
      "https://github.com/Rajkonde4",
      "https://www.linkedin.com/in/rajkonde/",
    ]),
  );
});

test("social preview image is a 1200x630 PNG", async ({ page, request }) => {
  await page.goto("/");
  const url = await page
    .locator('meta[property="og:image"]')
    .getAttribute("content");
  expect(url).toBeTruthy();
  const path = new URL(url ?? "").pathname;
  const response = await request.get(path);
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("image/png");
  const body = await response.body();
  // PNG header: width and height are big-endian ints at bytes 16 and 20.
  expect(body.readUInt32BE(16)).toBe(1200);
  expect(body.readUInt32BE(20)).toBe(630);
});

test("every in-page anchor has a target and every external link is safe", async ({
  page,
}) => {
  await page.goto("/");
  const anchors = await page
    .locator('a[href^="/#"], a[href^="#"]')
    .evaluateAll((els) =>
      els.map((el) => (el.getAttribute("href") ?? "").replace(/^\/?#/, "")),
    );
  expect(anchors.length).toBeGreaterThan(3);
  for (const id of new Set(anchors)) {
    await expect(page.locator(`#${id}`), `#${id}`).toHaveCount(1);
  }

  const external = await page.locator('a[href^="http"]').evaluateAll((els) =>
    els.map((el) => ({
      href: el.getAttribute("href"),
      target: el.getAttribute("target"),
      rel: el.getAttribute("rel") ?? "",
    })),
  );
  expect(external.length).toBeGreaterThan(2);
  for (const link of external) {
    expect(link.target, link.href ?? "").toBe("_blank");
    expect(link.rel, link.href ?? "").toContain("noopener");
  }
});

test("every internal page link works", async ({ page, request }) => {
  await page.goto("/");
  const hrefs = await page
    .locator('a[href^="/projects/"]')
    .evaluateAll((els) => els.map((el) => el.getAttribute("href") ?? ""));
  expect(hrefs.length).toBeGreaterThanOrEqual(4);
  for (const href of new Set(hrefs)) {
    expect((await request.get(href)).status(), href).toBe(200);
  }
  expect((await request.get("/resume/Raj_Konde_Resume.pdf")).status()).toBe(
    200,
  );
});

test("keyboard: tab stops are visibly focused and nothing is trapped", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "keyboard test is desktop only");
  await page.goto("/");
  const seen = new Set<string>();
  for (let i = 0; i < 30; i++) {
    await page.keyboard.press("Tab");
    const info = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      if (!el || el === document.body) return null;
      const style = getComputedStyle(el);
      return {
        label: (el.getAttribute("aria-label") || el.textContent || el.tagName)
          .trim()
          .slice(0, 40),
        outlineWidth: parseFloat(style.outlineWidth),
        outlineStyle: style.outlineStyle,
        hasBorderFocus: style.borderColor !== "" && el.tagName === "INPUT",
      };
    });
    if (!info) continue;
    seen.add(info.label);
    const visible =
      (info.outlineStyle !== "none" && info.outlineWidth > 0) ||
      info.hasBorderFocus;
    expect(visible, `no visible focus on "${info.label}"`).toBe(true);
  }
  expect(seen.size).toBeGreaterThan(12);
});

test("the browser console stays clean (no errors, no CSP violations)", async ({
  page,
}) => {
  const problems: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error" || message.type() === "warning") {
      problems.push(`${message.type()}: ${message.text()}`);
    }
  });
  page.on("pageerror", (error) => problems.push(`pageerror: ${error.message}`));
  for (const path of ["/projects/geovision-ai", "/"]) {
    await page.goto(path);
    await page.waitForTimeout(800);
  }
  await page
    .locator("#projects")
    .getByRole("button", { name: "Computer Vision" })
    .click();
  expect(problems).toEqual([]);
});

test("security headers are present", async ({ request }) => {
  const response = await request.get("/");
  const headers = response.headers();
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(headers["x-frame-options"]).toBe("DENY");
  expect(headers["permissions-policy"]).toContain("camera=()");
  expect(headers["content-security-policy"]).toContain(
    "frame-ancestors 'none'",
  );
  expect(headers["content-security-policy"]).toContain("object-src 'none'");
  expect(headers["x-powered-by"]).toBeUndefined();
});

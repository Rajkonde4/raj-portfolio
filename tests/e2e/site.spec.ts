import { expect, test } from "@playwright/test";

test("home page renders the hero and project list", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Raj Konde",
  );
  await expect(
    page.getByRole("heading", { name: "Projects", level: 2 }),
  ).toBeVisible();
  await expect(
    page.locator("#projects").getByRole("link", { name: /GeoVision AI/ }),
  ).toBeVisible();
});

test("resume button downloads the committed PDF", async ({ page, request }) => {
  await page.goto("/");
  const link = page
    .locator("section[aria-labelledby=hero-heading]")
    .getByRole("link", { name: /^Resume/ });
  await expect(link).toHaveAttribute("href", "/resume/Raj_Konde_Resume.pdf");
  const response = await request.get("/resume/Raj_Konde_Resume.pdf");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("pdf");
});

test("skip link is the first focusable element", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
});

test("a published project opens its case-study page", async ({ page }) => {
  await page.goto("/");
  await page
    .locator("#projects")
    .getByRole("link", { name: /GeoVision AI/ })
    .click();
  await expect(page).toHaveURL(/\/projects\/geovision-ai$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "GeoVision AI",
  );
});

test("unknown project slugs return 404", async ({ page }) => {
  const response = await page.goto("/projects/does-not-exist");
  expect(response?.status()).toBe(404);
});

test("GeoVision AI keeps implemented, in-progress and planned work apart", async ({
  page,
}) => {
  await page.goto("/projects/geovision-ai");
  for (const name of [
    "Implemented",
    "In progress",
    "Planned",
    "Current limitations",
  ]) {
    await expect(page.getByRole("heading", { name, level: 2 })).toBeVisible();
  }
  // Planned features must not appear under "Implemented".
  const implemented = page
    .locator("section")
    .filter({ has: page.getByRole("heading", { name: "Implemented" }) });
  await expect(implemented).not.toContainText("change detection");
});

test("sitemap lists every published project", async ({ request }) => {
  const body = await (await request.get("/sitemap.xml")).text();
  for (const slug of [
    "geovision-ai",
    "trustchain-ai",
    "aqua-mind",
    "regional-slang-recognition",
  ]) {
    expect(body).toContain(`/projects/${slug}`);
  }
});

test("robots.txt points at the sitemap", async ({ request }) => {
  const body = await (await request.get("/robots.txt")).text();
  expect(body).toContain("Sitemap:");
});

test("background canvas is decorative and sized to the viewport", async ({
  page,
}) => {
  await page.goto("/");
  const canvas = page.locator('canvas[aria-hidden="true"]');
  await expect(canvas).toHaveCount(1);
  const box = await canvas.boundingBox();
  const viewport = page.viewportSize();
  expect(box?.width).toBe(viewport?.width);
  expect(box?.height).toBe(viewport?.height);
  // It must never block clicks.
  const pointerEvents = await canvas.evaluate(
    (el) => getComputedStyle(el).pointerEvents,
  );
  expect(pointerEvents).toBe("none");
});

test("no horizontal scrolling", async ({ page }) => {
  await page.goto("/");
  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});

test("role text rotates, and exposes every role to screen readers", async ({
  page,
}) => {
  await page.goto("/");
  const eyebrow = page
    .locator("section[aria-labelledby=hero-heading] p")
    .first();
  await expect(eyebrow.locator(".sr-only")).toContainText("AI/ML Engineer");
  await expect(eyebrow.locator(".sr-only")).toContainText(
    "Aspiring Generative AI Engineer",
  );
  const rotating = eyebrow.locator('[aria-hidden="true"].role-swap');
  await expect(rotating).toHaveText("AI/ML Engineer");
  await expect(rotating).toHaveText("Aspiring Generative AI Engineer", {
    timeout: 6000,
  });
});

test("role text stays still with reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const rotating = page.locator(".role-swap");
  await expect(rotating).toHaveText("AI/ML Engineer");
  await page.waitForTimeout(3500);
  await expect(rotating).toHaveText("AI/ML Engineer");
});

test("navigation adapts to the screen size", async ({ page, isMobile }) => {
  await page.goto("/");
  const menuButton = page.getByRole("button", { name: "Open menu" });
  if (!isMobile) {
    await expect(
      page.getByRole("navigation", { name: "Primary" }),
    ).toBeVisible();
    await expect(menuButton).toBeHidden();
    return;
  }

  await expect(page.getByRole("navigation", { name: "Primary" })).toBeHidden();
  await menuButton.click();
  const mobileNav = page.getByRole("navigation", { name: "Mobile" });
  await expect(mobileNav.getByRole("link", { name: "Projects" })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Close menu" }),
  ).toHaveAttribute("aria-expanded", "true");

  await page.keyboard.press("Escape");
  await expect(mobileNav).toBeHidden();
  await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();

  await menuButton.click();
  await mobileNav.getByRole("link", { name: "Projects" }).click();
  await expect(mobileNav).toBeHidden();
  await expect(page).toHaveURL(/#projects$/);
});

test("home page renders every enabled section in registry order", async ({
  page,
}) => {
  await page.goto("/");
  const ids = await page
    .locator("main section[id]")
    .evaluateAll((els) => els.map((el) => el.id));
  expect(ids).toEqual([
    "projects",
    "geovision",
    "about",
    "skills",
    "experience",
    "achievements",
    "contact",
  ]);
});

test("GeoVision spotlight shows honest per-stage status", async ({ page }) => {
  await page.goto("/");
  const spotlight = page.locator("#geovision");
  await expect(
    spotlight.getByRole("heading", { level: 2, name: "GeoVision AI" }),
  ).toBeVisible();
  await expect(spotlight.getByText("1 implemented")).toBeVisible();
  const planned = spotlight
    .locator("li")
    .filter({ hasText: "Answer verification" });
  await expect(planned).toContainText("Planned");
  await expect(planned).not.toContainText("Implemented");
  const detection = spotlight
    .locator("li")
    .filter({ hasText: "Object detection" });
  await expect(detection).toContainText("In progress");
  await expect(spotlight).toContainText("Current limitations");
  await expect(spotlight).toContainText("sample data");
  await spotlight.getByRole("link", { name: /Read the case study/ }).click();
  await expect(page).toHaveURL(/\/projects\/geovision-ai$/);
  await expect(
    page.getByRole("heading", { name: "How it works" }),
  ).toBeVisible();
});

test("about section shows the story and the expected graduation", async ({
  page,
}) => {
  await page.goto("/");
  const about = page.locator("#about");
  await expect(about).toContainText("Pimpri Chinchwad University");
  await expect(about).toContainText("Expected Jun 2027");
  await expect(about).toContainText("CGPA 8.86");
});

test("skills are grouped by name with no percentages", async ({ page }) => {
  await page.goto("/");
  const skills = page.locator("#skills");
  await expect(skills.getByText("Python", { exact: true })).toBeVisible();
  await expect(skills.getByText("Scikit-learn", { exact: true })).toBeVisible();
  expect(await skills.innerText()).not.toContain("%");
  // Tools still being learned are kept apart and labelled as such.
  const exploring = skills
    .locator("div")
    .filter({ hasText: /^Exploring/ })
    .first();
  await expect(exploring).toContainText("Not listed as confident skills");
});

test("experience timeline lists roles with formatted dates", async ({
  page,
}) => {
  await page.goto("/");
  const experience = page.locator("#experience");
  await expect(
    experience.getByRole("heading", { name: "Web Development Intern" }),
  ).toBeVisible();
  await expect(experience).toContainText("May 2026 \u2013 Aug 2026");
  await expect(experience).toContainText("Documentation Team Lead");
  await expect(experience).toContainText("Jul 2024 \u2013 Sep 2024");
  expect(await experience.locator("ol > li").count()).toBeGreaterThanOrEqual(8);
});

test("certifications are listed and dated", async ({ page }) => {
  await page.goto("/");
  const achievements = page.locator("#achievements");
  await expect(achievements).toContainText("AWS Academy Cloud Foundations");
  await expect(achievements).toContainText("May 2026");
  expect(await achievements.locator("li").count()).toBe(4);
});

test("navigation links jump to their sections", async ({ page, isMobile }) => {
  test.skip(isMobile, "desktop navigation only");
  await page.goto("/");
  await page
    .getByRole("navigation", { name: "Primary" })
    .getByRole("link", { name: "Skills" })
    .click();
  await expect(page).toHaveURL(/#skills$/);
  await expect(page.locator("#skills")).toBeInViewport();
});

test("project filter narrows the list and can be reset", async ({ page }) => {
  await page.goto("/");
  const projects = page.locator("#projects");
  const rows = projects.locator("ul > li");
  await expect(rows).toHaveCount(4);

  const filter = projects.getByRole("group", {
    name: "Filter projects by category",
  });
  await expect(filter.getByRole("button", { name: "All" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );

  await filter.getByRole("button", { name: "Computer Vision" }).click();
  await expect(rows).toHaveCount(1);
  await expect(rows.first()).toContainText("GeoVision AI");
  await expect(
    filter.getByRole("button", { name: "Computer Vision" }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(projects.getByRole("status")).toHaveText(
    "Showing 1 of 4 projects",
  );

  await filter.getByRole("button", { name: "All" }).click();
  await expect(rows).toHaveCount(4);
});

test("navigation marks the section being read", async ({ page, isMobile }) => {
  test.skip(isMobile, "desktop navigation only");
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Primary" });
  await expect(nav.locator('[aria-current="location"]')).toHaveCount(0);

  await page.locator("#skills").scrollIntoViewIfNeeded();
  await page.evaluate(() =>
    document.getElementById("skills")?.scrollIntoView({ block: "center" }),
  );
  await expect(nav.getByRole("link", { name: "Skills" })).toHaveAttribute(
    "aria-current",
    "location",
  );
  await expect(nav.locator('[aria-current="location"]')).toHaveCount(1);
});

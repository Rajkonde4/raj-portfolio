import { expect, test } from "@playwright/test";

// Runs against a server started without RESEND_API_KEY / CONTACT_TO_EMAIL /
// CONTACT_FROM_EMAIL (see playwright.config.ts, project "unconfigured").

test("no form is shown, and the page says so and keeps the links", async ({
  page,
}) => {
  await page.goto("/");
  const contact = page.locator("#contact");
  await expect(contact.locator("form")).toHaveCount(0);
  await expect(contact).toContainText("contact form is not enabled");
  await expect(contact.getByRole("link", { name: /LinkedIn/ })).toHaveAttribute(
    "href",
    /linkedin\.com/,
  );
  await expect(contact.getByRole("link", { name: /GitHub/ })).toBeVisible();
});

test("the API refuses to send when mail is not configured", async ({
  request,
  baseURL,
}) => {
  const response = await request.post("/api/contact", {
    data: {
      name: "Asha",
      email: "asha@example.com",
      message: "A perfectly valid message body.",
    },
    headers: { origin: baseURL ?? "" },
  });
  expect(response.status()).toBe(503);
  expect(await response.json()).toEqual({ error: "not_configured" });
});

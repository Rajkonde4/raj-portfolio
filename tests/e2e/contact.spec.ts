import { expect, test, type Page } from "@playwright/test";

const MAIL = "http://localhost:4010";

interface Mail {
  to: string[];
  reply_to: string;
  subject: string;
  text: string;
}

async function received(page: Page): Promise<Mail[]> {
  const response = await page.request.get(`${MAIL}/received`);
  return response.json();
}

/** Unique per test run so parallel tests never see each other's mail. */
function token(label: string) {
  return `${label}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

async function fill(page: Page, message: string, name = "Asha Rao") {
  const form = page.locator("#contact form");
  await form.getByLabel("Name").fill(name);
  await form.getByLabel("Email").fill("asha@example.com");
  await form.getByLabel("Message").fill(message);
  return form;
}

test("form has labelled fields and a honeypot nobody can see", async ({
  page,
}) => {
  await page.goto("/");
  const form = page.locator("#contact form");
  await expect(form.getByLabel("Name")).toBeVisible();
  await expect(form.getByLabel("Email")).toBeVisible();
  await expect(form.getByLabel("Message")).toBeVisible();
  await expect(
    form.getByRole("button", { name: "Send message" }),
  ).toBeVisible();
  // The honeypot sits far off-screen and is inert: no focus, no screen reader.
  const honeypot = form.locator('input[name="website"]');
  const box = await honeypot.boundingBox();
  expect(box === null || box.x < -5000).toBe(true);
  await expect(form.locator('[inert]:has(input[name="website"])')).toHaveCount(
    1,
  );
  await form.getByLabel("Message").focus();
  await page.keyboard.press("Tab");
  await expect(
    form.getByRole("button", { name: "Send message" }),
  ).toBeFocused();
});

test("empty submit shows field errors, focuses the first, sends nothing", async ({
  page,
}) => {
  const posts: string[] = [];
  page.on("request", (r) => {
    if (r.url().includes("/api/contact")) posts.push(r.url());
  });
  await page.goto("/");
  const form = page.locator("#contact form");
  await form.getByRole("button", { name: "Send message" }).click();

  await expect(form.getByText("Please enter your name.")).toBeVisible();
  await expect(
    form.getByText("Please enter a valid email address."),
  ).toBeVisible();
  await expect(form.getByText(/at least 10 characters/)).toBeVisible();
  await expect(form.getByLabel("Name")).toBeFocused();
  await expect(form.getByLabel("Name")).toHaveAttribute("aria-invalid", "true");
  expect(posts).toHaveLength(0);
});

test("a valid message is delivered and the form clears", async ({ page }) => {
  const id = token("deliver");
  await page.goto("/");
  const form = await fill(page, `Hello Raj, ${id}. Let us talk about a role.`);
  await form.getByRole("button", { name: "Send message" }).click();

  await expect(page.getByText(/your message was sent/)).toBeVisible();
  await expect(form.getByLabel("Name")).toHaveValue("");
  await expect(form.getByLabel("Message")).toHaveValue("");

  const mail = (await received(page)).find((m) => m.text.includes(id));
  expect(mail).toBeDefined();
  expect(mail?.to).toEqual(["inbox@example.com"]);
  expect(mail?.reply_to).toBe("asha@example.com");
  expect(mail?.subject).toBe("Portfolio message from Asha Rao");
});

test("a provider failure shows an error, keeps the text, claims no success", async ({
  page,
}) => {
  const id = token("fail");
  await page.goto("/");
  const form = await fill(page, `FORCE_FAIL ${id} please send this one`);
  await form.getByRole("button", { name: "Send message" }).click();

  await expect(page.getByText(/could not be sent right now/)).toBeVisible();
  await expect(page.getByText(/your message was sent/)).toHaveCount(0);
  await expect(form.getByLabel("Message")).toHaveValue(
    `FORCE_FAIL ${id} please send this one`,
  );
  expect((await received(page)).some((m) => m.text.includes(id))).toBe(false);
});

test.describe("API", () => {
  const url = "/api/contact";
  const valid = {
    name: "Asha",
    email: "asha@example.com",
    message: "A perfectly valid message body.",
  };
  const origin = "http://localhost:3100";

  test("rejects a missing or foreign origin", async ({ request }) => {
    expect((await request.post(url, { data: valid })).status()).toBe(403);
    const foreign = await request.post(url, {
      data: valid,
      headers: { origin: "https://evil.example" },
    });
    expect(foreign.status()).toBe(403);
  });

  test("rejects invalid input and the honeypot", async ({ request }) => {
    const bad = await request.post(url, {
      data: { ...valid, email: "nope" },
      headers: { origin },
    });
    expect(bad.status()).toBe(400);
    expect((await bad.json()).fields.email).toBeTruthy();

    const bot = await request.post(url, {
      data: { ...valid, website: "http://spam.example" },
      headers: { origin },
    });
    expect(bot.status()).toBe(400);
  });

  test("keeps line breaks out of the email subject", async ({ request }) => {
    const id = token("inject");
    const response = await request.post(url, {
      data: {
        ...valid,
        name: "Eve\r\nBcc: evil@example.com",
        message: `Header injection attempt ${id}`,
      },
      headers: { origin },
    });
    expect(response.status()).toBe(200);
    const mails: Mail[] = await (await request.get(`${MAIL}/received`)).json();
    const mail = mails.find((m) => m.text.includes(id));
    expect(mail?.subject).not.toMatch(/[\r\n]/);
  });
});

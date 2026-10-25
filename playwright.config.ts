import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;
/** Second server of the same build, started without any mail settings. */
const UNCONFIGURED_PORT = 3101;

/**
 * End-to-end tests run against a production build:
 *   npm run build && npm run test:e2e
 * Set PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH to use an existing Chromium binary.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      testIgnore: /contact-unconfigured/,
      use: {
        ...devices["Desktop Chrome"],
        launchOptions: {
          executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
        },
      },
    },
    {
      name: "mobile",
      testIgnore: /contact-unconfigured/,
      use: {
        ...devices["Pixel 7"],
        launchOptions: {
          executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
        },
      },
    },
    {
      name: "unconfigured",
      testMatch: /contact-unconfigured/,
      use: {
        ...devices["Desktop Chrome"],
        baseURL: `http://localhost:${UNCONFIGURED_PORT}`,
        launchOptions: {
          executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
        },
      },
    },
  ],
  webServer: [
    {
      // Stand-in mail provider so the contact form can be tested for real.
      command: "node tests/e2e/fake-resend.mjs",
      url: "http://localhost:4010/health",
      reuseExistingServer: !process.env.CI,
      timeout: 20_000,
    },
    {
      command: `npm run start -- --port ${PORT}`,
      url: `http://localhost:${PORT}`,
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
      env: {
        RESEND_API_KEY: "e2e-key",
        CONTACT_TO_EMAIL: "inbox@example.com",
        CONTACT_FROM_EMAIL: "Portfolio <noreply@example.com>",
        RESEND_API_URL: "http://localhost:4010/emails",
        CONTACT_RATE_LIMIT_PER_HOUR: "100",
      },
    },
    {
      // Same build, no mail settings: the contact form must not appear.
      command: `npm run start -- --port ${UNCONFIGURED_PORT}`,
      url: `http://localhost:${UNCONFIGURED_PORT}`,
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
      env: {
        RESEND_API_KEY: "",
        CONTACT_TO_EMAIL: "",
        CONTACT_FROM_EMAIL: "",
      },
    },
  ],
});

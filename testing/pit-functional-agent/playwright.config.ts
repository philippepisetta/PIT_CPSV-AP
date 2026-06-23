import { defineConfig, devices } from "@playwright/test";
import * as path from "path";

/**
 * Playwright Config for PIT Functional Testing Agent
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: false, // Run tests sequentially to prevent Supabase connection pools exhaustion
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1, // Single worker to avoid DB collision during CRUD
  timeout: 30000,
  expect: {
    timeout: 5000
  },
  outputDir: "./test-results",
  reporter: [
    ["list"],
    ["json", { outputFile: "./reports/test-results.json" }],
    ["html", { outputFolder: "./reports/playwright-html", open: "never" }]
  ],
  use: {
    baseURL: process.env.PIT_TARGET_URL || "http://localhost:3000",
    viewport: { width: 1280, height: 800 },
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "off",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    }
  ]
});

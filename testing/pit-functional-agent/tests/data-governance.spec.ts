import { test, expect } from "@playwright/test";
import { switchToWorkspace } from "./helpers";

test.describe("Data Governance & Quality Monitoring Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Switch to Espace Données (using helper)
    await page.goto("/data");
    await switchToWorkspace(page, "data");
    await page.waitForLoadState("networkidle");
  });

  test("Verify Espace Données header & Source Systems", async ({ page }) => {
    // Verify active workspace tag
    const sidebarHeader = page.locator("aside span").first();
    await expect(sidebarHeader).toHaveText("Espace Données");

    // Check page header
    await expect(page.locator("h1")).toContainText("Workspace Interopérabilité & Alignement Sémantique");

    // Verify list of source systems (SoR)
    const bceSource = page.locator("text=BCE").first();
    await expect(bceSource).toBeVisible();
  });

  test("Verify Data Quality Dashboard and 9 Quality Dimensions", async ({ page }) => {
    // Navigate to Quality
    await page.goto("/data/quality");
    await switchToWorkspace(page, "data");
    await page.waitForLoadState("networkidle");

    // Check page header
    await expect(page.locator("h1")).toContainText("Qualité des Données Territoriales");

    // Verify presence of quality dimensions
    await expect(page.locator("text=Complétude").first()).toBeVisible();
    await expect(page.locator("text=Conformité").first()).toBeVisible();
    await expect(page.locator("text=Unicité").first()).toBeVisible();
    await expect(page.locator("text=Cohérence").first()).toBeVisible();
    await expect(page.locator("text=Traçabilité").first()).toBeVisible();

    // Verify global quality index ring/value
    const qualityIndex = page.locator("text=Score de qualité").first();
    await expect(qualityIndex).toBeVisible();
  });

  test("Verify Mappings & API configuration", async ({ page }) => {
    // Navigate to Mappings & API
    await page.goto("/data/api-exports");
    await switchToWorkspace(page, "data");
    await page.waitForLoadState("networkidle");

    // Check page header
    await expect(page.locator("h1")).toContainText("API & Exports Sémantiques");

    // Verify list of endpoints or export configurations
    await expect(page.locator("text=CPSV-AP").first()).toBeVisible();
    await expect(page.locator("text=NGSI-LD").first()).toBeVisible();
  });
});

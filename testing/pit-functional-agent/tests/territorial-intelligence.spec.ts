import { test, expect } from "@playwright/test";

test.describe("Territorial Intelligence & Graph Explorer Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Make sure we are in accompaniment or pilotage workspace
    await page.goto("/territories");
    await page.waitForLoadState("networkidle");
  });

  test("Verify Territoires page loads regional data and maps", async ({ page }) => {
    // Check page header
    await expect(page.locator("h1")).toContainText("Territoires");
    
    // Check if provinces/arrondissements are listed or visual indicators exist
    const provinceRows = page.locator("tbody tr, .grid > div");
    expect(await provinceRows.count()).toBeGreaterThan(0);
  });

  test("Verify Filières S3 page shows industrial sectors", async ({ page }) => {
    await page.goto("/filieres");
    await page.waitForLoadState("networkidle");

    // Check page header
    await expect(page.locator("h1")).toContainText("Filières S3");

    // Verify S3 DIS domains list contains key sectors
    const filieres = page.locator("button:has-text('Santé'), button:has-text('Hydrogène'), button:has-text('Construction')");
    expect(await filieres.count()).toBeGreaterThan(0);
  });

  test("Verify Value Chain Explorer allows drill-down", async ({ page }) => {
    await page.goto("/value-chain-explorer");
    await page.waitForLoadState("networkidle");

    // Check page header
    await expect(page.locator("h1")).toContainText("Value Chain Visual Explorer");

    // Verify selecting a chain button works
    const buttonChain = page.locator("button:has-text('Santé Numérique')").first();
    if (await buttonChain.isVisible()) {
      await buttonChain.click();
      await page.waitForTimeout(1000);
      
      // Verify value chain stages are shown
      const stages = page.locator(".grid > div, button");
      expect(await stages.count()).toBeGreaterThan(0);
    }
  });

  test("Verify Écosystèmes (Organizations) lists actors and hubs", async ({ page }) => {
    await page.goto("/organizations");
    await page.waitForLoadState("networkidle");

    // Check page header
    await expect(page.locator("h1")).toContainText("Cockpit Acteurs & Organisations");

    // Verify organizations table lists key partners
    const adnRow = page.locator("text=Agence du Numérique").first();
    await expect(adnRow).toBeVisible();
  });

  test("Verify Graph Explorer visualizes the ssemantic network", async ({ page }) => {
    await page.goto("/intelligence/graph");
    await page.waitForLoadState("networkidle");

    // Check page header
    await expect(page.locator("h1")).toContainText("Explorateur de Graphe Sémantique");

    // Verify graph canvas is rendered (usually svg or canvas or split view)
    const graphElement = page.locator("svg, canvas, div[class*='react-flow']");
    expect(await graphElement.count()).toBeGreaterThan(0);
  });
});

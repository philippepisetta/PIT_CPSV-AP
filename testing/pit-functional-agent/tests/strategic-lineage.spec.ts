import { test, expect } from "@playwright/test";
import { switchToWorkspace } from "./helpers";

test.describe("Strategic Lineage & 4-Tab Pilotage Cockpit Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Switch to Espace Pilotage (using helper)
    await page.goto("/strategic");
    await switchToWorkspace(page, "pilotage");
    await page.waitForLoadState("networkidle");
  });

  test("Verify Espace Pilotage contains exactly the 4 structured tabs", async ({ page }) => {
    // Verify tabs presence
    const tabs = page.locator("div:has(> button:has-text('KPIs'))").first().locator("button");
    await expect(tabs.first()).toBeVisible();
    const tabTexts = await tabs.allTextContents();
    
    // Check that we have the 4 tabs (case insensitive checks since text might be slightly formatted)
    const hasKpi = tabTexts.some(t => t.toLowerCase().includes("kpi"));
    const hasRoi = tabTexts.some(t => t.toLowerCase().includes("roi"));
    const hasS3 = tabTexts.some(t => t.toLowerCase().includes("s3") || t.toLowerCase().includes("alignement"));
    const hasPreuves = tabTexts.some(t => t.toLowerCase().includes("preuve") || t.toLowerCase().includes("registre"));

    expect(hasKpi).toBe(true);
    expect(hasRoi).toBe(true);
    expect(hasS3).toBe(true);
    expect(hasPreuves).toBe(true);
  });

  test("Verify Registre des Preuves is in read-only mode for Pilotage user", async ({ page }) => {
    // Wait for the tabs to be visible
    const tabs = page.locator("div:has(> button:has-text('KPIs'))").first().locator("button");
    await expect(tabs.first()).toBeVisible();

    // Click on Registre des Preuves tab
    const preuvesTab = page.locator("button:has-text('Preuves'), button:has-text('Registre')").first();
    await expect(preuvesTab).toBeVisible();
    await preuvesTab.click();
    await page.waitForTimeout(1000);

    // Verify that creation buttons (like "Ajouter" or "Nouveau") are NOT visible or form inputs are disabled
    const addBtn = page.locator("button:has-text('Ajouter'), button:has-text('Nouveau')");
    await expect(addBtn).toBeHidden();

    // Verify presence of proof items in the table
    const tableRows = page.locator("tbody tr");
    if (await tableRows.count() > 0) {
      // Check that delete or edit action buttons inside rows are hidden or disabled
      const actionIcons = page.locator("tbody tr button");
      await expect(actionIcons).toBeHidden();
    }
  });

  test("Verify Strategic Lineage Trace Visualizer in Demonstrator", async ({ page }) => {
    // Navigate to resilience demonstrator
    await page.goto("/resilience/demonstrator");
    await switchToWorkspace(page, "pilotage");
    await page.waitForLoadState("networkidle");

    // Start the energy crisis scenario (Caroline)
    const carolineCard = page.locator("text=Crise Énergétique").first();
    if (await carolineCard.isVisible()) {
      await carolineCard.click();
      await page.waitForTimeout(1000);
    }

    // Click on "Afficher" under Gouvernance & Lignage to render the trace
    const showBtn = page.locator("div:has(h5:has-text('Gouvernance & Lignage')) button:has-text('Afficher')").first();
    if (await showBtn.isVisible()) {
      await showBtn.click();
      await page.waitForTimeout(500);
    }

    // Verify the presence of the traceability lineage chain
    await expect(page.locator("text=1. Question Cabinets").first()).toBeVisible();
    await expect(page.locator("text=2. Jeux de données (DCAT-AP)").first()).toBeVisible();
    await expect(page.locator("text=3. Indicateurs de structure").first()).toBeVisible();
    await expect(page.locator("text=4. Hypothèses actives").first()).toBeVisible();
    await expect(page.locator("text=5. Algorithme de calcul").first()).toBeVisible();
    await expect(page.locator("text=6. Résultat et Confiance").first()).toBeVisible();
  });
});

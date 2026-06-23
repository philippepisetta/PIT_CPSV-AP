import { test, expect } from "@playwright/test";
import { switchToWorkspace } from "./helpers";

test.describe("Resilience Framework & Scenario Caroline Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to Espace Résilience and switch to pilotage workspace
    await page.goto("/analysis-views/resilience");
    await switchToWorkspace(page, "pilotage");
    await page.waitForLoadState("networkidle");
  });

  test("Verify Espace Résilience contains 6 OECD Dimensions & crises selection", async ({ page }) => {
    // Check that we see the non-crisis notice
    await expect(page.locator("text=La PIT ne constitue pas un outil de gestion opérationnelle de crise")).toBeVisible();

    // Check crisis selection buttons/tabs
    await expect(page.locator("text=Crise Énergétique").first()).toBeVisible();
    await expect(page.locator("text=Inondations").first()).toBeVisible();
    await expect(page.locator("text=Pandémie").first()).toBeVisible();

    // Check presence of OECD dimensions
    await expect(page.locator("text=Exposition").first()).toBeVisible();
    await expect(page.locator("text=Sensibilité").first()).toBeVisible();
    await expect(page.locator("text=Vulnérabilité").first()).toBeVisible();
    await expect(page.locator("text=Absorption").first()).toBeVisible();
    await expect(page.locator("text=Adaptation").first()).toBeVisible();
    await expect(page.locator("text=Rebond").first()).toBeVisible();
  });

  test("Verify Caroline Demonstrator Wizard Step-by-Step Flow", async ({ page }) => {
    // Go to the demonstrator
    await page.goto("/resilience/demonstrator");
    await switchToWorkspace(page, "pilotage");
    await page.waitForLoadState("networkidle");

    // Click on "Crise Énergétique" card to start simulation
    await page.click("text=Crise Énergétique");
    await page.waitForTimeout(1000);

    // Check that we are on Step 1: Hypothèses
    const step1Title = page.locator("text=Hypothèses Utilisées (Assumptions)").first();
    await expect(step1Title).toBeVisible();
    await expect(page.locator("text=Seuil de vulnérabilité")).toBeVisible();
    await expect(page.locator("text=Prix du gaz de marché")).toBeVisible();

    // Go to Step 2: Impacts & Confiance
    await page.click("button:has-text('Suivant')");
    await page.waitForTimeout(1000);

    // Verify key KPIs are calculated and visible
    await expect(page.locator("text=142 structures").first()).toBeVisible(); // Exposed structures
    await expect(page.locator("text=18 500 ETP").first()).toBeVisible(); // Exposed ETP
    await expect(page.locator("text=4.2 Mrds €").first()).toBeVisible(); // Exposed CA

    // Verify confidence badges
    await expect(page.locator("span:has-text('MEDIUM')").first()).toBeVisible(); 
    await expect(page.locator("span:has-text('HIGH')").first()).toBeVisible(); 

    // Verify calculation explainability accordion
    const formulaToggle = page.locator("button:has-text('Comment cette valeur')").first();
    if (await formulaToggle.isVisible()) {
      await formulaToggle.click();
      await page.waitForTimeout(500);
      await expect(page.locator("text=Méthodologie").first()).toBeVisible();
    }

    // Go to Step 3: Data Gaps Panel
    await page.click("button:has-text('Suivant')");
    await page.waitForTimeout(1000);

    // Verify Data Gaps panel lists missing datasets
    await expect(page.locator("text=Comment affiner cette estimation ?").first()).toBeVisible();
    await expect(page.locator("text=Consommation réelle de gaz par entreprise").first()).toBeVisible();
    await expect(page.locator("span:has-text('Manquante')").first()).toBeVisible(); 

    // Go to Step 4: Plan d'Action Recommandé
    await page.click("button:has-text('Suivant')");
    await page.waitForTimeout(1000);

    // Verify recommendations
    await expect(page.locator("text=Dispositifs Activés & Plan d'Action Recommandé").first()).toBeVisible();
    await expect(page.locator("text=Subvention conjoncturelle gaz/électricité").first()).toBeVisible();
  });
});

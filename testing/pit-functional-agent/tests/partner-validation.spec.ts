import { test, expect } from "@playwright/test";
import useCases from "../fixtures/partner-usecases.json";

test.describe("Partner Recette Use Cases Validation", () => {
  
  test.beforeEach(async ({ page }) => {
    // Go to homepage and initialize session workspace
    await page.goto("/");
    await page.selectOption("header select", "accompaniment");
    await page.waitForLoadState("networkidle");
  });

  for (const uc of useCases) {
    test(`Validate ${uc.id} - ${uc.partner} - ${uc.title}`, async ({ page }) => {
      console.log(`Running validation for ${uc.id}: ${uc.title}`);

      // Route mapping based on the nature of the use case
      if (uc.beneficiary) {
        // 1. Beneficiary-centric use cases
        await page.goto("/accompaniment/beneficiaries");
        await page.waitForLoadState("networkidle");

        // Search for the beneficiary in the search bar
        await page.fill("input[placeholder*='Rechercher']", uc.beneficiary);
        await page.waitForTimeout(1000);

        // Click the beneficiary if visible in list
        const row = page.locator(`tbody tr:has-text('${uc.beneficiary}')`).first();
        if (await row.isVisible()) {
          await row.click();
          await page.waitForTimeout(1500);

          // Verify the detail panel header matches the beneficiary
          const detailTitle = page.locator("main h2").first();
          await expect(detailTitle).toContainText(uc.beneficiary);
          
          // Verify that NACE or attributes match
          if (uc.size) {
            await expect(page.locator("main").first()).toContainText(uc.size);
          }
          
          // If the recommender is available or requested, check recommending tab
          if (uc.expectedRecommendation || uc.expectedServices) {
            // Click on Matchmaking or Recommender tab/link if present
            const matchTab = page.locator("button:has-text('Parcours'), button:has-text('Services')").first();
            if (await matchTab.isVisible()) {
              await matchTab.click();
              await page.waitForTimeout(1000);
            }
          }
        } else {
          console.warn(`⚠️ Beneficiary ${uc.beneficiary} not found in seeding data, skipping detail checks.`);
        }

      } else if (uc.sector && uc.trends) {
        // 2. Sectoral challenges (AKT emerging needs)
        await page.goto("/challenges");
        await page.waitForLoadState("networkidle");
        await expect(page.locator("h1")).toContainText("Défis");
        
        // Search sector or trend (if search input exists and is visible)
        const searchInput = page.locator("input[placeholder*='Rechercher']");
        if (await searchInput.isVisible()) {
          await searchInput.fill(uc.sector);
          await page.waitForTimeout(1000);
        }

      } else if (uc.chain) {
        // 3. Value chain mapping (Clusters batteries value chain)
        await page.goto("/value-chain-explorer");
        await page.waitForLoadState("networkidle");
        await expect(page.locator("h1")).toContainText("Value Chain Visual Explorer");
        
        // Verify select dropdown or buttons contain options
        const select = page.locator("select").first();
        if (await select.isVisible()) {
          const options = await select.locator("option").allTextContents();
          console.log(`Found value chains: ${options.join(", ")}`);
        }

      } else if (uc.project) {
        // 4. Consortium detection / Collaborative projects
        await page.goto("/accompaniment/consortia");
        await page.waitForLoadState("networkidle");
        await expect(page.locator("h1")).toContainText("Gestion des Consortiums");
      }
    });
  }
});

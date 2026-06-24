import { test, expect } from "@playwright/test";

test.describe("S3 / DIS & Data Spaces Reference Registry Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage first to authenticate/load default workspace
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
  });

  test("Verify Référentiels navigation and tabs", async ({ page }) => {
    // Navigate to referentiels page S3 / DIS tab
    await page.goto("/governance/referentiels?tab=s3-dis");
    await page.waitForLoadState("networkidle");

    // Verify page title and header
    await expect(page.locator("h1")).toContainText("Registre des Référentiels Stables");

    // Check S3 framework is visible
    await expect(page.locator("text=Smart Specialisation Community of Practice")).toBeVisible();
    await expect(page.locator("text=EU_OFFICIAL").first()).toBeVisible();

    // Switch to Taxonomies tab
    await page.goto("/governance/referentiels?tab=taxonomies-s3");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("text=Taxonomie de Spécialisation Intelligente")).toBeVisible();
    await expect(page.locator("text=Processus de Découverte Entrepreneuriale")).toBeVisible();

    // Switch to Data Spaces tab
    await page.goto("/governance/referentiels?tab=dataspaces");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("text=AGRICULTURE").first()).toBeVisible();
    await expect(page.locator("text=HEALTH").first()).toBeVisible();

    // Switch to Interop tab
    await page.goto("/governance/referentiels?tab=interop");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("text=DCAT-AP").first()).toBeVisible();
    await expect(page.locator("text=CPSV-AP").first()).toBeVisible();

    // Switch to Secteurs tab
    await page.goto("/governance/referentiels?tab=sectors");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("text=Fabrication de composants électroniques")).toBeVisible();

    // Switch to Legal/RDI tab
    await page.goto("/governance/referentiels?tab=legal");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("text=Recherche spatiale ou aéronautique")).toBeVisible();

    // Switch to Internal tab
    await page.goto("/governance/referentiels?tab=internal");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("text=Définition des DIS de la S3 Wallonie – GTS3 – 11 mai 2026")).toBeVisible();
    await expect(page.locator("text=Interne / Consultance").first()).toBeVisible();

    // Switch to Mappings tab
    await page.goto("/governance/referentiels?tab=mappings");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("text=RELATED").first()).toBeVisible();
  });

  test("Verify S3 Observatory Cockpit & Clusters", async ({ page }) => {
    // Navigate to S3 page
    await page.goto("/s3");
    await page.waitForLoadState("networkidle");

    // Verify S3 page header
    await expect(page.locator("h1")).toContainText("Observatoire de Spécialisation Intelligente (S3)");

    // Verify 7 tabs are present
    await expect(page.locator("button:has-text('Filières & Drilldown S3')")).toBeVisible();
    await expect(page.locator("button:has-text('Marchés Applicatifs')")).toBeVisible();
    await expect(page.locator("button:has-text('Clusters Technopolis')")).toBeVisible();
    await expect(page.locator("button:has-text('Regroupements DIS')")).toBeVisible();
    await expect(page.locator("button:has-text('Scoring Multicritère')")).toBeVisible();
    await expect(page.locator("button:has-text('Cartographie Sémantique')")).toBeVisible();
    await expect(page.locator("button:has-text('Qualité des données & Limites')")).toBeVisible();

    // Go to Marchés Applicatifs tab
    await page.click("button:has-text('Marchés Applicatifs')");
    await expect(page.locator("text=Maintenance prédictive et Industrie 4.0")).toBeVisible();

    // Go to Clusters Technopolis tab
    await page.click("button:has-text('Clusters Technopolis')");
    await expect(page.locator("text=Systèmes industriels intelligents")).toBeVisible();
    await expect(page.locator("text=Proxy").first()).toBeVisible();

    // Go to Regroupements DIS tab
    await page.click("button:has-text('Regroupements DIS')");
    await expect(page.locator("text=Génie mécanique, matériaux et Industrie du futur")).toBeVisible();

    // Go to Scoring tab
    await page.click("button:has-text('Scoring Multicritère')");
    await expect(page.locator("text=CL-19")).toBeVisible();

    // Go to Mappings tab
    await page.click("button:has-text('Cartographie Sémantique')");
    await expect(page.locator("text=Lignage Métier (Lineage Logique)")).toBeVisible();

    // Go to Quality/Methodology tab
    await page.click("button:has-text('Qualité des données & Limites')");
    await expect(page.locator("text=Notion de Proxy S3")).toBeVisible();
  });
});

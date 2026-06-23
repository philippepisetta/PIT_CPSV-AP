import { test, expect } from "@playwright/test";

test.describe("UX Navigation & Workspace Isolation Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
  });

  test("Verify default workspace is Espace Accompagnement", async ({ page }) => {
    // Check that default workspace in sidebar tag is Espace Accompagnement
    const workspaceSelector = page.locator("header select");
    await expect(workspaceSelector).toHaveValue("accompaniment");

    const sidebarHeader = page.locator("aside span").first();
    await expect(sidebarHeader).toHaveText("Espace Accompagnement");

    // Check visible sections for accompaniment workspace
    await expect(page.locator("aside h3:has-text('Accompagnement')")).toBeVisible();
    await expect(page.locator("aside h3:has-text('Défis & Programmes')")).toBeVisible();
    await expect(page.locator("aside h3:has-text('Intelligence Territoriale')")).toBeVisible();
    await expect(page.locator("aside h3:has-text('Gouvernance')")).toBeVisible();

    // Check hidden sections for accompaniment workspace
    await expect(page.locator("aside h3:has-text('Résilience')")).toBeHidden();
    await expect(page.locator("aside h3:has-text('Pilotage')")).toBeHidden();
    await expect(page.locator("aside h3:has-text('Données')")).toBeHidden();
  });

  test("Switch workspace to Espace Pilotage (Décideur role) and verify isolation", async ({ page }) => {
    // Switch workspace
    await page.selectOption("header select", "pilotage");
    await page.waitForTimeout(1000);

    // Verify workspace active tag is Espace Pilotage
    const sidebarHeader = page.locator("aside span").first();
    await expect(sidebarHeader).toHaveText("Espace Pilotage");

    // Check visible sections for pilotage workspace
    await expect(page.locator("aside h3:has-text('Défis & Programmes')")).toBeVisible();
    await expect(page.locator("aside h3:has-text('Résilience')")).toBeVisible();
    await expect(page.locator("aside h3:has-text('Pilotage')")).toBeVisible();
    await expect(page.locator("aside h3:has-text('Intelligence Territoriale')")).toBeVisible();
    await expect(page.locator("aside h3:has-text('Gouvernance')")).toBeVisible();

    // Check hidden sections for pilotage workspace
    await expect(page.locator("aside h3:has-text('Accompagnement')")).toBeHidden();
    await expect(page.locator("aside h3:has-text('Données')")).toBeHidden();
  });

  test("Switch workspace to Espace Données (Data Steward role) and verify isolation", async ({ page }) => {
    // Switch workspace
    await page.selectOption("header select", "data");
    await page.waitForTimeout(1000);

    // Verify workspace active tag is Espace Données
    const sidebarHeader = page.locator("aside span").first();
    await expect(sidebarHeader).toHaveText("Espace Données");

    // Check visible sections for data workspace
    await expect(page.locator("aside h3:has-text('Données')")).toBeVisible();
    await expect(page.locator("aside h3:has-text('Gouvernance')")).toBeVisible();

    // Check hidden sections for data workspace
    await expect(page.locator("aside h3:has-text('Accompagnement')")).toBeHidden();
    await expect(page.locator("aside h3:has-text('Défis & Programmes')")).toBeHidden();
    await expect(page.locator("aside h3:has-text('Résilience')")).toBeHidden();
    await expect(page.locator("aside h3:has-text('Pilotage')")).toBeHidden();
    await expect(page.locator("aside h3:has-text('Intelligence Territoriale')")).toBeHidden();
  });
  
  test("Check routing redirections from Next.js config", async ({ page }) => {
    // Navigate to /beneficiaries directly, should redirect to /accompaniment/beneficiaries
    await page.goto("/beneficiaries");
    await page.waitForLoadState("networkidle");
    expect(page.url()).toContain("/accompaniment/beneficiaries");
    
    // Navigate to /services directly, should redirect to /accompaniment/services
    await page.goto("/services");
    await page.waitForLoadState("networkidle");
    expect(page.url()).toContain("/accompaniment/services");
    
    // Navigate to /interoperability directly, should redirect to /data
    await page.goto("/interoperability");
    await page.waitForLoadState("networkidle");
    expect(page.url()).toContain("/data");
  });
});

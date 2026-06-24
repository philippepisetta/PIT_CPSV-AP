import { test, expect } from "@playwright/test";
import { switchToWorkspace } from "./helpers";
import { PrismaClient } from "@prisma/client";

test.describe("ServiceDeliveries (Prestations Réalisées) CRUD & History Integration Tests", () => {
  test.beforeAll(async () => {
    const prisma = new PrismaClient();
    try {
      await prisma.serviceDelivery.deleteMany({
        where: {
          title: {
            contains: "Test Prestation"
          }
        }
      });
    } catch (err) {
      console.error("Failed to clean up test service deliveries before run:", err);
    } finally {
      await prisma.$disconnect();
    }
  });

  test.beforeEach(async ({ page }) => {
    // Intercept API requests to inject user role
    await page.route("**/api/v2/**", async (route) => {
      const headers = {
        ...route.request().headers(),
        "x-user-role": "CONSEILLER"
      };
      await route.continue({ headers });
    });

    // Navigate to Prestations page in Espace Accompagnement
    await page.goto("/accompaniment/prestations");
    await switchToWorkspace(page, "accompaniment");
    await page.waitForLoadState("networkidle");
  });

  test("Should create a prestation, edit it, verify it appears in beneficiary history, and delete it", async ({ page }) => {
    const randomSuffix = Math.floor(Math.random() * 10000);
    const testTitle = `Test Prestation ${randomSuffix}`;

    // 1. Create Prestation
    await page.click("button:has-text('Enregistrer une prestation')");
    await page.waitForSelector("form:visible");

    await page.fill("form:visible label:has-text(\"Titre de l'accompagnement\") + input", testTitle);
    await page.selectOption("form:visible label:has-text('Bénéficiaire') + select", { label: "BioPlast SA" });
    await page.selectOption("form:visible label:has-text('Service CPSV') + select", { index: 0 });
    await page.selectOption("form:visible label:has-text('Opérateur Prestataire') + select", { index: 1 });
    await page.selectOption("form:visible label:has-text('Statut') + select", "planned");
    await page.selectOption("form:visible label:has-text(\"Canal d'accès\") + select", "mail");
    await page.fill("form:visible label:has-text('Description') + textarea", "Description de test");
    await page.fill("form:visible label:has-text('Livrables réels') + textarea", "Livrables de test");

    await page.click("form:visible button:has-text(\"Enregistrer l'accompagnement\")");
    await page.waitForTimeout(2000);

    // Verify it is in the list
    const listRow = page.locator(`tbody tr:has-text('${testTitle}')`).first();
    await expect(listRow).toBeVisible();

    // 2. Edit Prestation
    await listRow.locator("button[title='Modifier']").click();
    await page.waitForSelector("form:visible");

    await page.selectOption("form:visible label:has-text('Statut') + select", "delivered");
    await page.fill("form:visible label:has-text('Note de satisfaction') + input", "5");
    await page.fill("form:visible label:has-text('Livrables réels') + textarea", "Livrables de test modifiés");

    await page.click("form:visible button:has-text('Enregistrer les modifications')");
    await page.waitForTimeout(2000);

    // Verify updated status in list
    const updatedRow = page.locator(`tbody tr:has-text('${testTitle}')`).first();
    await expect(updatedRow.locator("span:has-text('Délivré')")).toBeVisible();

    // 3. Verify in Beneficiary Fiche
    await page.goto("/accompaniment/beneficiaries");
    await page.waitForLoadState("networkidle");
    await page.fill("input[placeholder*='Rechercher']", "BioPlast SA");
    await page.waitForTimeout(1000);

    const beneficiaryRow = page.locator("tbody tr:has-text('BioPlast SA')").first();
    await beneficiaryRow.click();
    await page.waitForTimeout(1500);

    // Switch to history tab
    await page.click("button:has-text('Historique')");
    await page.waitForTimeout(1000);

    // Verify test prestation is visible in history
    const historyItem = page.locator(`h5:has-text('${testTitle}')`);
    await expect(historyItem).toBeVisible();
    await expect(page.locator(`div:has-text('Livrables de test modifiés')`).first()).toBeVisible();

    // 4. Delete Prestation
    await page.goto("/accompaniment/prestations");
    await page.waitForLoadState("networkidle");

    const rowToDelete = page.locator(`tbody tr:has-text('${testTitle}')`).first();
    await expect(rowToDelete).toBeVisible();

    // Accept confirm dialog
    page.once("dialog", async (dialog) => {
      expect(dialog.message()).toContain("Êtes-vous sûr de vouloir supprimer cet accompagnement");
      await dialog.accept();
    });

    await rowToDelete.locator("button[title='Supprimer']").click();
    await page.waitForTimeout(2000);

    // Verify it is removed
    const missingRow = page.locator(`tbody tr:has-text('${testTitle}')`);
    await expect(missingRow).toBeHidden();
  });
});

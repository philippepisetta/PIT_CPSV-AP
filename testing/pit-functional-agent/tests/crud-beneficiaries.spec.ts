import { test, expect } from "@playwright/test";
import { switchToWorkspace } from "./helpers";
import { PrismaClient } from "@prisma/client";

test.describe("Beneficiaries CRUD & Soft-Delete Tests", () => {
  test.beforeAll(async () => {
    const prisma = new PrismaClient();
    try {
      await prisma.beneficiary.deleteMany({
        where: {
          name: {
            contains: "Test Enterprise"
          }
        }
      });
    } catch (err) {
      console.error("Failed to clean up test beneficiaries before run:", err);
    } finally {
      await prisma.$disconnect();
    }
  });

  test.beforeEach(async ({ page }) => {
    // Intercept API requests to inject user role (use ADMIN for contacts endpoint due to backend permissions config)
    await page.route("**/api/v2/**", async (route) => {
      const url = route.request().url();
      const role = url.includes("/api/v2/contacts") ? "ADMIN" : "CONSEILLER";
      const headers = {
        ...route.request().headers(),
        "x-user-role": role
      };
      await route.continue({ headers });
    });

    // Make sure we are in Espace Accompagnement
    await page.goto("/accompaniment/beneficiaries");
    await switchToWorkspace(page, "accompaniment");
    await page.waitForLoadState("networkidle");
  });

  test("Should create, edit, add contact, and soft-delete a beneficiary", async ({ page }) => {
    // 1. Create a new Beneficiary
    const randomSuffix = Math.floor(Math.random() * 10000);
    const testBeneName = `Test Enterprise ${randomSuffix}`;
    const testBce = `0999.${randomSuffix}.999`;

    await page.click("button:has-text('Nouveau')");
    await page.waitForSelector("form:visible");

    await page.fill("form:visible label:has-text('Nom du Bénéficiaire') + input", testBeneName);
    await page.selectOption("form:visible label:has-text('Type de Bénéficiaire') + select", "STARTUP");
    await page.fill("form:visible label:has-text('Numéro BCE') + input", testBce);
    await page.selectOption("form:visible label:has-text('Taille') + select", "TPE");
    await page.fill("form:visible label:has-text(\"Nombre d'employés\") + input", "5");
    await page.fill("form:visible label:has-text(\"Chiffre d'affaires\") + input", "120000");
    await page.fill("form:visible label:has-text('Ville / Commune') + input", "Liège");
    await page.fill("form:visible label:has-text('Province') + input", "Liège");
    await page.fill("form:visible label:has-text('Arrondissement') + input", "Liège");
    await page.fill("form:visible label:has-text('Demande / Problématique Initiale') + textarea", "Besoin d'accompagnement cyber de niveau 1");

    await page.click("form:visible button:has-text('Créer')");
    await page.waitForTimeout(2000);

    // Verify it is in the list
    await page.fill("input[placeholder*='Rechercher']", testBeneName);
    await page.waitForTimeout(1000);
    const listRow = page.locator(`tbody tr:has-text('${testBeneName}')`).first();
    await expect(listRow).toBeVisible();

    // 2. View details
    await listRow.click();
    await page.waitForTimeout(1500);

    const detailHeader = page.locator("main h2").first();
    await expect(detailHeader).toHaveText(testBeneName);

    // Verify admin and business values are displayed correctly
    await expect(page.locator("main span:has-text('Source: PIT Manual Input')").first()).toBeVisible();
    await expect(page.locator("main span:has-text('ENTREPRISE')").first()).toBeVisible();

    // 3. Add a contact
    await page.click("button:has-text('Ajouter')");
    await page.waitForSelector("form:visible");
    
    await page.fill("form:visible label:has-text('Nom complet') + input", "Jean Dupont");
    await page.fill("form:visible label:has-text('Email') + input", "jean.dupont@test-enterprise.be");
    await page.fill("form:visible label:has-text('Téléphone') + input", "+32499123456");
    await page.fill("form:visible label:has-text('Rôle / Fonction') + input", "Responsable Cyber");
    await page.selectOption("form:visible label:has-text('Type de Contact') + select", "TECHNICAL");
    await page.check("form:visible input#isPrimary"); // Primary contact

    await page.click("form:visible button:has-text('Ajouter')");
    await page.waitForTimeout(1500);

    // Verify contact was added
    await expect(page.locator("main div:has-text('Jean Dupont')").first()).toBeVisible();
    await expect(page.locator("main span:has-text('Principal')").first()).toBeVisible();

    // 4. Edit the Beneficiary
    await page.click("main button:has-text('Modifier')");
    await page.waitForSelector("form:visible");
    
    const editedName = `${testBeneName} Edited`;
    await page.fill("form:visible label:has-text('Nom du Bénéficiaire') + input", editedName);
    await page.click("form:visible button:has-text('Sauvegarder')");
    await page.waitForTimeout(2000);

    // Verify updated details
    const updatedHeader = page.locator("main h2").first();
    await expect(updatedHeader).toHaveText(editedName);

    // 5. Soft-Delete (Archive) the Beneficiary
    // Handle the window confirm dialog
    page.once("dialog", async (dialog) => {
      expect(dialog.message()).toContain("Voulez-vous vraiment archiver ce bénéficiaire");
      await dialog.accept();
    });

    await page.click("main button:has-text('Archiver')");
    await page.waitForTimeout(2000);

    // Verify it was removed from the list (soft deleted and status changed to ARCHIVED)
    await page.fill("input[placeholder*='Rechercher']", editedName);
    await page.waitForTimeout(1000);
    const missingRow = page.locator(`tbody tr:has-text('${editedName}')`);
    await expect(missingRow).toBeHidden();
  });
});

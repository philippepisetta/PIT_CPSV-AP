import { Page, expect } from "@playwright/test";

export async function switchToWorkspace(page: Page, workspace: "accompaniment" | "pilotage" | "data") {
  const expectedLabels = {
    accompaniment: "Espace Accompagnement",
    pilotage: "Espace Pilotage",
    data: "Espace Données",
  };

  const expectedLabel = expectedLabels[workspace];

  // Try to wait for the select element to be visible first
  await page.waitForSelector("header select", { state: "visible" });

  const select = page.locator("header select");
  const currentValue = await select.inputValue().catch(() => "");

  if (currentValue === workspace) {
    // Already in this workspace, just verify sidebar tag is visible and has correct text
    await expect(page.locator("aside span").first()).toHaveText(expectedLabel);
    return;
  }

  // Select the option
  await select.selectOption(workspace);

  // Wait for the workspace tag in the sidebar to update to the expected text (auto-polls)
  await expect(page.locator("aside span").first()).toHaveText(expectedLabel);
}

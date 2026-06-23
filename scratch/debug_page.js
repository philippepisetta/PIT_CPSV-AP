const { chromium } = require('playwright');

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log("Going to /resilience...");
  await page.goto("http://localhost:3000/resilience");
  await page.waitForLoadState("networkidle");

  console.log("Title:", await page.title());
  console.log("URL:", page.url());
  console.log("H1 text:", await page.locator("h1").innerText().catch(() => "N/A"));

  // Check select options
  const selectExists = await page.locator("header select").count();
  console.log("Select exists:", selectExists);
  if (selectExists) {
    console.log("Current select value:", await page.locator("header select").inputValue());
  }

  // Take screenshot
  await page.screenshot({ path: "scratch/resilience-page.png" });
  console.log("Screenshot saved to scratch/resilience-page.png");

  // Check for the notice
  const textExists = await page.locator("text=La PIT ne constitue pas un outil de gestion opérationnelle de crise").count();
  console.log("Notice exists:", textExists);

  await browser.close();
}

run().catch(console.error);

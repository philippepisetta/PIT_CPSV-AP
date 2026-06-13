import { chromium, Page, Response } from "playwright";
import * as fs from "fs";
import * as path from "path";

// Configuration
const BASE_URL = process.env.PIT_TARGET_URL || "http://localhost:3000";
const SCREENSHOTS_DIR = path.join(__dirname, "screenshots");
const REPORT_MD_PATH = path.join(__dirname, "../../TEST_REPORT.md");
const REPORT_HTML_PATH = path.join(__dirname, "pit-audit-report.html");

interface ApiTestResult {
  endpoint: string;
  status: number;
  responseTimeMs: number;
  payloadSizeBytes: number;
  objectCount: number;
  success: boolean;
  error?: string;
}

interface UiTestResult {
  route: string;
  accessible: boolean;
  responseTimeMs: number;
  jsErrors: string[];
  reactErrors: string[];
  networkErrors: string[];
  layoutPresent: boolean;
  elementCount: number;
  status: "PASS" | "WARNING" | "FAIL";
  message: string;
  screenshotPath?: string;
}

async function runAudit() {
  console.log(`🚀 Démarrage de l'audit PIT sur ${BASE_URL}...`);

  // S'assurer que le dossier des captures d'écran existe
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
  }

  // 1. Initialiser Playwright
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    userAgent: "PIT-Auditor-Agent/1.0"
  });

  const uiResults: UiTestResult[] = [];
  const apiResults: ApiTestResult[] = [];
  let programChainResult: { success: boolean; message: string; steps: string[] } = { success: false, message: "Non exécuté", steps: [] };
  let serviceChainResult: { success: boolean; message: string; steps: string[] } = { success: false, message: "Non exécuté", steps: [] };

  try {
    // --- PARTIE 1: TESTS API DIRECTS (via Request Context) ---
    console.log("\n📡 Test des endpoints API v2...");
    const requestContext = context.request;
    const apiEndpoints = [
      "/api/v2/programs",
      "/api/v2/capabilities",
      "/api/v2/services",
      "/api/v2/journeys",
      "/api/v2/beneficiaries",
      "/api/v2/ecosystems",
      "/api/v2/s3-domains"
    ];

    for (const endpoint of apiEndpoints) {
      const start = Date.now();
      try {
        const response = await requestContext.get(`${BASE_URL}${endpoint}`, { timeout: 5000 });
        const responseTimeMs = Date.now() - start;
        const status = response.status();
        const success = status === 200;
        let payloadSizeBytes = 0;
        let objectCount = 0;
        let errorMsg = undefined;

        if (success) {
          const text = await response.text();
          payloadSizeBytes = Buffer.byteLength(text, "utf8");
          try {
            const json = JSON.parse(text);
            const data = json.data || json;
            objectCount = Array.isArray(data) ? data.length : 0;
          } catch (e) {
            // Pas du JSON valide
            errorMsg = "Payload JSON invalide";
          }
        } else {
          errorMsg = `HTTP Status ${status}`;
        }

        apiResults.push({
          endpoint,
          status,
          responseTimeMs,
          payloadSizeBytes,
          objectCount,
          success: success && !errorMsg,
          error: errorMsg
        });
        console.log(`  ✓ API ${endpoint} : Status ${status} (${responseTimeMs}ms) - ${objectCount} objets`);
      } catch (err: any) {
        apiResults.push({
          endpoint,
          status: 0,
          responseTimeMs: Date.now() - start,
          payloadSizeBytes: 0,
          objectCount: 0,
          success: false,
          error: err.message || "Erreur de connexion"
        });
        console.log(`  ✗ API ${endpoint} : Échec - ${err.message}`);
      }
    }

    // --- PARTIE 2: TESTS INTERFACE UTILISATEUR (UI) ---
    console.log("\n🖥️ Parcours des routes de l'application...");
    const uiRoutes = [
      "/",
      "/programs",
      "/projects",
      "/actions",
      "/activities",
      "/challenges",
      "/capabilities",
      "/services",
      "/journeys",
      "/beneficiaries",
      "/organizations",
      "/territories",
      "/ecosystems",
      "/s3",
      "/drbest",
      "/graph"
    ];

    for (const route of uiRoutes) {
      console.log(`  Analyse de la route: ${route}`);
      const page = await context.newPage();
      const jsErrors: string[] = [];
      const reactErrors: string[] = [];
      const networkErrors: string[] = [];

      // Intercepter les erreurs JS/React
      page.on("pageerror", (err) => {
        jsErrors.push(err.message);
        if (err.stack && (err.stack.includes("react") || err.stack.includes("React"))) {
          reactErrors.push(err.message);
        }
      });

      page.on("console", (msg) => {
        if (msg.type() === "error") {
          const txt = msg.text();
          // Ignorer les avertissements bénins de dev
          if (!txt.includes("Download the React DevTools") && !txt.includes("Failed to load resource")) {
            jsErrors.push(txt);
          }
        }
      });

      // Intercepter les erreurs réseau
      page.on("requestfailed", (req) => {
        // Ignorer les requêtes analytiques ou publicitaires tierces si présentes
        if (req.url().startsWith(BASE_URL)) {
          networkErrors.push(`${req.url()} - Échec: ${req.failure()?.errorText || "Inconnu"}`);
        }
      });

      page.on("response", (res) => {
        if (res.url().startsWith(BASE_URL) && res.status() >= 400) {
          networkErrors.push(`${res.url()} - HTTP ${res.status()}`);
        }
      });

      const start = Date.now();
      let accessible = false;
      let layoutPresent = false;
      let elementCount = 0;
      let status: "PASS" | "WARNING" | "FAIL" = "PASS";
      let message = "Visite réussie";
      let screenshotFilename = "";

      try {
        const response = await page.goto(`${BASE_URL}${route}`, { timeout: 10000, waitUntil: "domcontentloaded" });
        const loadTime = Date.now() - start;

        if (response) {
          accessible = response.status() < 400;
          if (response.status() === 404) {
            message = "Page 404";
            status = "WARNING";
          }
        }

        // Attendre que la page se charge complètement
        await page.waitForTimeout(1500);

        // Vérification du layout PIT (Sidebar 'aside' et 'main')
        const asideVisible = await page.locator("aside").isVisible().catch(() => false);
        const mainVisible = await page.locator("main").isVisible().catch(() => false);
        layoutPresent = asideVisible && mainVisible;

        // Détection de chargement infini
        const loadingIndicatorVisible = await page.locator(".animate-spin, .animate-pulse, text=Chargement").first().isVisible().catch(() => false);
        let infiniteLoading = false;
        if (loadingIndicatorVisible) {
          // Attendre 2 secondes de plus pour voir s'il disparaît
          await page.waitForTimeout(2000);
          const stillLoading = await page.locator(".animate-spin, .animate-pulse, text=Chargement").first().isVisible().catch(() => false);
          if (stillLoading) {
            infiniteLoading = true;
            status = "FAIL";
            message = "Chargement infini détecté";
          }
        }

        // Comptage des éléments si la page est chargée et est un cockpit
        const isCockpit = ["/programs", "/capabilities", "/services", "/journeys", "/beneficiaries", "/ecosystems", "/s3"].includes(route);
        if (isCockpit && !infiniteLoading && status !== "FAIL") {
          // Chercher les lignes de tableau
          const rows = page.locator("tbody tr");
          const rowCount = await rows.count().catch(() => 0);
          
          if (rowCount > 0) {
            const firstRowText = await rows.first().textContent().catch(() => "");
            if (firstRowText && (firstRowText.includes("Aucun") || firstRowText.includes("Aucune") || firstRowText.includes("vide"))) {
              elementCount = 0;
              status = "WARNING";
              message = "0 résultat affiché";
            } else {
              elementCount = rowCount;
            }
          } else {
            // Chercher des éléments de grille/cartes
            const cards = page.locator(".grid > div, .card, [class*='card']");
            const cardCount = await cards.count().catch(() => 0);
            elementCount = cardCount;
            if (elementCount === 0) {
              status = "WARNING";
              message = "0 résultat affiché";
            }
          }
        }

        // Alerte si la performance dépasse 3 secondes
        if (loadTime > 3000 && status !== "FAIL") {
          status = "WARNING";
          message = `Chargement lent (${(loadTime/1000).toFixed(1)}s)`;
        }

        // Vérifier s'il y a des erreurs console graves
        if (jsErrors.length > 0 && status === "PASS") {
          status = "WARNING";
          message = "Erreurs console détectées";
        }

        // Captures d'écran pour les cockpits requis ou en cas d'erreur
        const requiredScreenshots = ["/programs", "/capabilities", "/services", "/journeys", "/beneficiaries"];
        const needsScreenshot = requiredScreenshots.includes(route) || status === "FAIL";

        if (needsScreenshot) {
          const cleanName = route === "/" ? "dashboard" : route.replace("/", "");
          screenshotFilename = status === "FAIL" ? `error-${cleanName}.png` : `${cleanName}.png`;
          const screenshotPath = path.join(SCREENSHOTS_DIR, screenshotFilename);
          await page.screenshot({ path: screenshotPath });
          console.log(`    📷 Capture d'écran enregistrée: ${screenshotFilename}`);
        }

        uiResults.push({
          route,
          accessible,
          responseTimeMs: loadTime,
          jsErrors,
          reactErrors,
          networkErrors,
          layoutPresent,
          elementCount,
          status,
          message,
          screenshotPath: screenshotFilename ? `screenshots/${screenshotFilename}` : undefined
        });

      } catch (err: any) {
        console.error(`    ✗ Erreur lors de l'accès à ${route}:`, err.message);
        
        // Capture d'écran de l'erreur
        const cleanName = route === "/" ? "dashboard" : route.replace("/", "");
        screenshotFilename = `error-${cleanName}.png`;
        const screenshotPath = path.join(SCREENSHOTS_DIR, screenshotFilename);
        await page.screenshot({ path: screenshotPath }).catch(() => {});

        uiResults.push({
          route,
          accessible: false,
          responseTimeMs: Date.now() - start,
          jsErrors: [err.message],
          reactErrors: [],
          networkErrors: [],
          layoutPresent: false,
          elementCount: 0,
          status: "FAIL",
          message: err.message || "Timeout de connexion",
          screenshotPath: `screenshots/${screenshotFilename}`
        });
      } finally {
        await page.close();
      }
    }

    // --- PARTIE 3: TESTS DES CHAINES METIERS PIT ---
    console.log("\n⛓️ Test des chaînes métiers PIT sémantiques...");

    // 3.1 Test de la Program Chain (Program -> Project -> Action -> Activity)
    console.log("  3.1 Vérification de la Program Chain...");
    const programPage = await context.newPage();
    const progSteps: string[] = [];
    try {
      await programPage.goto(`${BASE_URL}/programs`, { timeout: 10000, waitUntil: "domcontentloaded" });
      await programPage.waitForTimeout(2000);
      progSteps.push("Visite de la page /programs");

      // Cliquer sur le premier programme dans le tableau
      const firstRow = programPage.locator("tbody tr").first();
      if (await firstRow.isVisible()) {
        const progName = await firstRow.locator("td").first().textContent().then(t => t?.trim() || "Programme inconnu");
        await firstRow.click();
        await programPage.waitForTimeout(1500);
        progSteps.push(`Sélection du premier programme: "${progName}"`);

        // Cliquer sur l'onglet "Hiérarchie S3" dans le panneau de détails
        const hierarchyTab = programPage.locator("button:has-text('Hiérarchie S3'), button:has-text('S3')").first();
        if (await hierarchyTab.isVisible()) {
          await hierarchyTab.click();
          await programPage.waitForTimeout(1500);
          progSteps.push("Ouverture de l'onglet 'Hiérarchie S3'");

          // Développer le premier Projet
          const projectNode = programPage.locator("text=PROJET").first();
          if (await projectNode.isVisible()) {
            await projectNode.click();
            await programPage.waitForTimeout(1500);
            progSteps.push("Développement du premier Projet");

            // Développer la première Action
            const actionNode = programPage.locator("text=ACTION").first();
            if (await actionNode.isVisible()) {
              await actionNode.click();
              await programPage.waitForTimeout(1500);
              progSteps.push("Développement de la première Action");

              // Vérifier si l'activité finale est affichée
              const activityNode = programPage.locator("text=ACTIVITE").first();
              if (await activityNode.isVisible()) {
                progSteps.push("Vérification de la présence de l'Activité finale");
                programChainResult = {
                  success: true,
                  message: "Program Chain valide : Program ➔ Project ➔ Action ➔ Activity validé dans le DOM.",
                  steps: progSteps
                };
                console.log("    ✓ Program Chain validée avec succès !");
              } else {
                programChainResult = {
                  success: false,
                  message: "Activité finale manquante ou non visible dans l'arborescence.",
                  steps: progSteps
                };
                console.log("    ✗ Échec Program Chain : Activité manquante");
              }
            } else {
              programChainResult = {
                success: false,
                message: "Aucune Action visible sous le projet développé.",
                steps: progSteps
              };
              console.log("    ✗ Échec Program Chain : Action manquante");
            }
          } else {
            programChainResult = {
              success: false,
              message: "Aucun Projet associé ou visible dans la hiérarchie.",
              steps: progSteps
            };
            console.log("    ✗ Échec Program Chain : Projet manquant");
          }
        } else {
          programChainResult = {
            success: false,
            message: "Onglet 'Hiérarchie S3' introuvable dans les détails du programme.",
            steps: progSteps
          };
          console.log("    ✗ Échec Program Chain : Onglet 'Hiérarchie S3' manquant");
        }
      } else {
        programChainResult = {
          success: false,
          message: "Aucun programme disponible dans la liste principale.",
          steps: progSteps
        };
        console.log("    ✗ Échec Program Chain : Aucun programme");
      }
    } catch (err: any) {
      programChainResult = {
        success: false,
        message: `Erreur lors de la vérification : ${err.message}`,
        steps: progSteps
      };
      console.log(`    ✗ Échec Program Chain : ${err.message}`);
    } finally {
      await programPage.close();
    }

    // 3.2 Test de la Service Chain (Challenge -> Capability -> Service -> Journey -> Beneficiary)
    console.log("  3.2 Vérification de la Service Chain...");
    const benePage = await context.newPage();
    const svcSteps: string[] = [];
    try {
      await benePage.goto(`${BASE_URL}/beneficiaries`, { timeout: 10000, waitUntil: "domcontentloaded" });
      await benePage.waitForTimeout(2000);
      svcSteps.push("Visite de la page /beneficiaries");

      // Cliquer sur le premier bénéficiaire
      const firstBene = benePage.locator("tbody tr").first();
      if (await firstBene.isVisible()) {
        const beneName = await firstBene.locator("td").first().textContent().then(t => t?.trim() || "Bénéficiaire inconnu");
        await firstBene.click();
        await benePage.waitForTimeout(1500);
        svcSteps.push(`Sélection du premier bénéficiaire: "${beneName}"`);

        // Ouvrir l'onglet "Parcours PIT"
        const pathwayTab = benePage.locator("button:has-text('Parcours PIT')").first();
        if (await pathwayTab.isVisible()) {
          await pathwayTab.click();
          await benePage.waitForTimeout(1500);
          svcSteps.push("Ouverture de l'onglet 'Parcours PIT'");

          // Vérifier la présence des éléments de la chaîne
          const hasChallenge = await benePage.locator("text=Challenge").first().isVisible().catch(() => false);
          const hasCapability = await benePage.locator("text=Capability").first().isVisible().catch(() => false);
          const hasService = await benePage.locator("text=Service").first().isVisible().catch(() => false);
          const hasJourney = await benePage.locator("text=Journey").first().isVisible().catch(() => false);
          const hasBeneficiary = await benePage.locator("text=Bénéficiaire").first().isVisible().catch(() => false);

          if (hasChallenge && hasCapability && hasService && hasJourney && hasBeneficiary) {
            svcSteps.push("Validation de la chaîne complète : Challenge ➔ Capability ➔ Service ➔ Journey ➔ Bénéficiaire");
            serviceChainResult = {
              success: true,
              message: "Service Chain valide : Séquence sémantique complète affichée.",
              steps: svcSteps
            };
            console.log("    ✓ Service Chain validée avec succès !");
          } else {
            const missing = [];
            if (!hasChallenge) missing.push("Challenge");
            if (!hasCapability) missing.push("Capability");
            if (!hasService) missing.push("Service");
            if (!hasJourney) missing.push("Journey");
            if (!hasBeneficiary) missing.push("Bénéficiaire");

            serviceChainResult = {
              success: false,
              message: `Éléments manquants dans la chaîne : ${missing.join(", ")}`,
              steps: svcSteps
            };
            console.log(`    ✗ Échec Service Chain : Éléments manquants (${missing.join(", ")})`);
          }
        } else {
          serviceChainResult = {
            success: false,
            message: "Onglet 'Parcours PIT' introuvable dans le profil du bénéficiaire.",
            steps: svcSteps
          };
          console.log("    ✗ Échec Service Chain : Onglet 'Parcours PIT' manquant");
        }
      } else {
        serviceChainResult = {
          success: false,
          message: "Aucun bénéficiaire disponible dans la liste principale.",
          steps: svcSteps
        };
        console.log("    ✗ Échec Service Chain : Aucun bénéficiaire");
      }
    } catch (err: any) {
      serviceChainResult = {
        success: false,
        message: `Erreur lors de la vérification : ${err.message}`,
        steps: svcSteps
      };
      console.log(`    ✗ Échec Service Chain : ${err.message}`);
    } finally {
      await benePage.close();
    }

  } catch (globalErr: any) {
    console.error("❌ Erreur critique lors de l'exécution de l'audit:", globalErr);
  } finally {
    await browser.close();
  }

  // --- PARTIE 4: CALCUL DES SCORES ET GENERATION DES RAPPORTS ---
  console.log("\n📊 Calcul des scores d'audit...");

  // Calcul du score UI
  const totalUiRoutes = uiResults.length;
  const passedUiRoutes = uiResults.filter(r => r.status === "PASS").length;
  const warningUiRoutes = uiResults.filter(r => r.status === "WARNING").length;
  const uiScore = totalUiRoutes > 0 
    ? Math.round(((passedUiRoutes + (warningUiRoutes * 0.5)) / totalUiRoutes) * 100) 
    : 0;

  // Calcul du score API
  const totalApi = apiResults.length;
  const passedApi = apiResults.filter(r => r.success).length;
  const apiScore = totalApi > 0 
    ? Math.round((passedApi / totalApi) * 100) 
    : 0;

  // Calcul du score de Données
  // Un cockpit est correct s'il est accessible, n'a pas de chargement infini (non FAIL) et renvoie des éléments > 0 (non WARNING)
  const cockpits = uiResults.filter(r => ["/programs", "/capabilities", "/services", "/journeys", "/beneficiaries", "/ecosystems", "/s3"].includes(r.route));
  const totalCockpits = cockpits.length;
  const healthyCockpits = cockpits.filter(c => c.accessible && c.status === "PASS" && c.elementCount > 0).length;
  const dataScore = totalCockpits > 0 
    ? Math.round((healthyCockpits / totalCockpits) * 100) 
    : 0;

  // Calcul du score PIT (métier)
  let pitScore = 0;
  if (programChainResult.success) pitScore += 50;
  if (serviceChainResult.success) pitScore += 50;

  // Global Score
  const globalScore = Math.round((uiScore + apiScore + dataScore + pitScore) / 4);

  console.log(`  UI Score   : ${uiScore}%`);
  console.log(`  API Score  : ${apiScore}%`);
  console.log(`  Data Score : ${dataScore}%`);
  console.log(`  PIT Score  : ${pitScore}%`);
  console.log(`  -----------------`);
  console.log(`  GLOBAL SCORE : ${globalScore}%`);

  // 4.1 Générer TEST_REPORT.md
  console.log(`\n✍️ Génération de ${REPORT_MD_PATH}...`);
  let mdReport = `# TEST REPORT – PIT QUALITY AGENT

**Date de l'audit** : ${new Date().toLocaleString("fr-BE")}  
**Cible de l'audit** : [${BASE_URL}](${BASE_URL})  
**Score global de conformité** : **${globalScore}/100**

---

## Synthèse des Scores

| Composant | Score | Statut |
| :--- | :---: | :---: |
| **Global PIT Compliance** | **${globalScore}%** | ${globalScore >= 85 ? "✓ PASS" : globalScore >= 50 ? "⚠ WARNING" : "✗ FAIL"} |
| **Interface Utilisateur (UI)** | **${uiScore}%** | ${uiScore >= 85 ? "✓ PASS" : "⚠ WARNING"} |
| **Endpoints API v2** | **${apiScore}%** | ${apiScore >= 85 ? "✓ PASS" : "✗ FAIL"} |
| **Cockpits & Données** | **${dataScore}%** | ${dataScore >= 85 ? "✓ PASS" : "⚠ WARNING"} |
| **Modèle Sémantique PIT** | **${pitScore}%** | ${pitScore === 100 ? "✓ PASS" : "✗ FAIL"} |

---

## Rapport Détaillé de l'Interface (UI)

| Route | Statut | Latence | Layout PIT | Eléments | Remarque / Erreur |
| :--- | :---: | :---: | :---: | :---: | :--- |
`;

  for (const r of uiResults) {
    const statusEmoji = r.status === "PASS" ? "✓ PASS" : r.status === "WARNING" ? "⚠ WARN" : "✗ FAIL";
    mdReport += `| \`${r.route}\` | ${statusEmoji} | ${r.responseTimeMs}ms | ${r.layoutPresent ? "Oui" : "Non"} | ${r.elementCount} | ${r.message} ${r.jsErrors.length > 0 ? `(${r.jsErrors.length} err console)` : ""} |\n`;
  }

  mdReport += `
---

## Rapport Détaillé des Endpoints API v2

| Endpoint | Statut HTTP | Latence | Taille Payload | Objets | Résultat |
| :--- | :---: | :---: | :---: | :---: | :--- |
`;

  for (const a of apiResults) {
    mdReport += `| \`${a.endpoint}\` | ${a.status} | ${a.responseTimeMs}ms | ${(a.payloadSizeBytes / 1024).toFixed(1)} KB | ${a.objectCount} | ${a.success ? "✓ OK" : `✗ FAIL (${a.error})`} |\n`;
  }

  mdReport += `
---

## Alignements Sémantiques Métier (Attentes PIT)

### 1. Program Chain (Program ➔ Project ➔ Action ➔ Activity)
* **Statut** : ${programChainResult.success ? "✓ PASS" : "✗ FAIL"}
* **Message** : ${programChainResult.message}
* **Étapes de validation** :
${programChainResult.steps.map(s => `  - ${s}`).join("\n")}

### 2. Service Chain (Challenge ➔ Capability ➔ Service ➔ Journey ➔ Beneficiary)
* **Statut** : ${serviceChainResult.success ? "✓ PASS" : "✗ FAIL"}
* **Message** : ${serviceChainResult.message}
* **Étapes de validation** :
${serviceChainResult.steps.map(s => `  - ${s}`).join("\n")}

---

*Généré automatiquement par l'Agent Testeur Permanent PIT.*
`;

  fs.writeFileSync(REPORT_MD_PATH, mdReport, "utf8");

  // 4.2 Générer pit-audit-report.html
  console.log(`✍️ Génération de ${REPORT_HTML_PATH}...`);
  const htmlReport = `<!DOCTYPE html>
<html lang="fr" class="h-full">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>PIT Quality Auditor Dashboard</title>
  <!-- Google Fonts Outfit & Inter -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <!-- Tailwind CSS via Play CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
            outfit: ['Outfit', 'sans-serif'],
          },
          colors: {
            darkbg: '#0F172A',
            panelbg: '#1E293B',
            accentTeal: '#0D9488',
            accentAmber: '#D97706',
            accentRose: '#E11D48',
          }
        }
      }
    }
  </script>
  <style>
    body {
      background: radial-gradient(circle at top right, #1E1B4B, #0F172A 40%, #020617);
    }
    .glass {
      background: rgba(30, 41, 59, 0.45);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.05);
    }
    .glass-card:hover {
      border-color: rgba(13, 148, 136, 0.3);
      box-shadow: 0 0 20px rgba(13, 148, 136, 0.15);
      transform: translateY(-2px);
    }
  </style>
</head>
<body class="text-slate-100 font-sans min-h-screen py-8 px-4 sm:px-6 lg:px-8">
  <div class="max-w-7xl mx-auto space-y-8">
    
    <!-- Header -->
    <header class="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-800 pb-6 gap-4">
      <div>
        <div class="flex items-center gap-3">
          <span class="px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 text-xs font-bold tracking-widest uppercase border border-teal-500/20">
            Qualité & Audit
          </span>
          <span class="text-xs text-slate-400 font-mono">v1.0.0</span>
        </div>
        <h1 class="font-outfit text-3xl font-black mt-2 tracking-tight">
          PIT Quality Auditor <span class="bg-gradient-to-r from-teal-400 to-indigo-400 bg-clip-text text-transparent">Agent Dashboard</span>
        </h1>
        <p class="text-slate-400 text-xs mt-1">
          Cible d'audit : <a href="${BASE_URL}" target="_blank" class="text-teal-400 font-bold hover:underline font-mono">${BASE_URL}</a> — Exécuté le : ${new Date().toLocaleString("fr-BE")}
        </p>
      </div>
      
      <!-- Global Score Ring -->
      <div class="flex items-center gap-4 bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
        <div class="relative w-16 h-16">
          <svg class="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path class="text-slate-800" stroke-width="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            <path class="text-teal-500 transition-all duration-1000 ease-out" stroke-dasharray="${globalScore}, 100" stroke-width="3" stroke-linecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
          </svg>
          <div class="absolute inset-0 flex items-center justify-center">
            <span class="font-outfit text-lg font-black text-teal-400">${globalScore}%</span>
          </div>
        </div>
        <div>
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Score Global</span>
          <span class="font-outfit text-sm font-bold uppercase tracking-wide ${globalScore >= 85 ? "text-teal-400" : globalScore >= 50 ? "text-amber-400" : "text-rose-500"}">
            ${globalScore >= 85 ? "PIT Conforme" : globalScore >= 50 ? "PIT Avertissement" : "PIT Non Conforme"}
          </span>
        </div>
      </div>
    </header>

    <!-- Score Grid -->
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      
      <!-- UI Score -->
      <div class="glass p-5 rounded-2xl space-y-4">
        <div class="flex justify-between items-center">
          <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Interface (UI)</span>
          <span class="px-2 py-0.5 rounded text-[10px] font-bold ${uiScore >= 85 ? "bg-teal-500/10 text-teal-400" : "bg-amber-500/10 text-amber-400"}">${uiScore >= 85 ? "PASS" : "WARN"}</span>
        </div>
        <div class="flex items-baseline justify-between">
          <span class="font-outfit text-3xl font-black text-slate-100">${uiScore}%</span>
          <span class="text-xs text-slate-400 font-mono">${passedUiRoutes}/${totalUiRoutes} routes OK</span>
        </div>
        <div class="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div class="bg-teal-500 h-full rounded-full" style="width: ${uiScore}%"></div>
        </div>
      </div>

      <!-- API Score -->
      <div class="glass p-5 rounded-2xl space-y-4">
        <div class="flex justify-between items-center">
          <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Endpoints API v2</span>
          <span class="px-2 py-0.5 rounded text-[10px] font-bold ${apiScore >= 85 ? "bg-teal-500/10 text-teal-400" : "bg-rose-500/10 text-rose-400"}">${apiScore >= 85 ? "PASS" : "FAIL"}</span>
        </div>
        <div class="flex items-baseline justify-between">
          <span class="font-outfit text-3xl font-black text-slate-100">${apiScore}%</span>
          <span class="text-xs text-slate-400 font-mono">${passedApi}/${totalApi} endpoints OK</span>
        </div>
        <div class="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div class="bg-indigo-500 h-full rounded-full" style="width: ${apiScore}%"></div>
        </div>
      </div>

      <!-- Data Score -->
      <div class="glass p-5 rounded-2xl space-y-4">
        <div class="flex justify-between items-center">
          <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Cockpits & Données</span>
          <span class="px-2 py-0.5 rounded text-[10px] font-bold ${dataScore >= 85 ? "bg-teal-500/10 text-teal-400" : "bg-amber-500/10 text-amber-400"}">${dataScore >= 85 ? "PASS" : "WARN"}</span>
        </div>
        <div class="flex items-baseline justify-between">
          <span class="font-outfit text-3xl font-black text-slate-100">${dataScore}%</span>
          <span class="text-xs text-slate-400 font-mono">${healthyCockpits}/${totalCockpits} cockpits OK</span>
        </div>
        <div class="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div class="bg-amber-500 h-full rounded-full" style="width: ${dataScore}%"></div>
        </div>
      </div>

      <!-- PIT Semantic Score -->
      <div class="glass p-5 rounded-2xl space-y-4">
        <div class="flex justify-between items-center">
          <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Modèle Métier PIT</span>
          <span class="px-2 py-0.5 rounded text-[10px] font-bold ${pitScore === 100 ? "bg-teal-500/10 text-teal-400" : "bg-rose-500/10 text-rose-400"}">${pitScore === 100 ? "PASS" : "FAIL"}</span>
        </div>
        <div class="flex items-baseline justify-between">
          <span class="font-outfit text-3xl font-black text-slate-100">${pitScore}%</span>
          <span class="text-xs text-slate-400 font-mono">2/2 Chaînes sémantiques</span>
        </div>
        <div class="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div class="bg-purple-500 h-full rounded-full" style="width: ${pitScore}%"></div>
        </div>
      </div>
      
    </section>

    <!-- Business Chain Validation Details -->
    <section class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      <!-- Program Chain Card -->
      <div class="glass p-6 rounded-2xl space-y-4">
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 class="font-outfit font-extrabold text-sm uppercase tracking-wider text-teal-400">
            Program Chain (Hiérarchie S3)
          </h3>
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${programChainResult.success ? "bg-teal-500/10 text-teal-400 border border-teal-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"}">
            ${programChainResult.success ? "Conforme" : "Erreur"}
          </span>
        </div>
        <p class="text-xs text-slate-300 leading-relaxed font-semibold">${programChainResult.message}</p>
        <div class="space-y-2.5 pl-3 border-l-2 border-slate-700 text-xs text-slate-400 font-semibold">
          ${programChainResult.steps.map(s => `<div class="flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
            <span>${s}</span>
          </div>`).join("")}
        </div>
      </div>

      <!-- Service Chain Card -->
      <div class="glass p-6 rounded-2xl space-y-4">
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 class="font-outfit font-extrabold text-sm uppercase tracking-wider text-teal-400">
            Service Chain (Parcours PIT)
          </h3>
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${serviceChainResult.success ? "bg-teal-500/10 text-teal-400 border border-teal-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"}">
            ${serviceChainResult.success ? "Conforme" : "Erreur"}
          </span>
        </div>
        <p class="text-xs text-slate-300 leading-relaxed font-semibold">${serviceChainResult.message}</p>
        <div class="space-y-2.5 pl-3 border-l-2 border-slate-700 text-xs text-slate-400 font-semibold">
          ${serviceChainResult.steps.map(s => `<div class="flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
            <span>${s}</span>
          </div>`).join("")}
        </div>
      </div>
      
    </section>

    <!-- UI Test Table -->
    <section class="glass rounded-2xl overflow-hidden p-6 space-y-4">
      <h3 class="font-outfit font-black text-lg text-slate-100 uppercase tracking-tight">Rapport d'Intégrité de l'Interface Utilisateur (UI)</h3>
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="bg-slate-900/60 border-b border-slate-800 text-slate-400 uppercase tracking-widest font-bold">
              <th class="px-4 py-3">Route</th>
              <th class="px-4 py-3">Statut</th>
              <th class="px-4 py-3">Latence</th>
              <th class="px-4 py-3">Layout PIT</th>
              <th class="px-4 py-3">Objets</th>
              <th class="px-4 py-3">Remarques / Erreurs</th>
              <th class="px-4 py-3 text-center">Capture d'écran</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/50">
            ${uiResults.map(r => `
              <tr class="hover:bg-slate-800/30 transition-colors">
                <td class="px-4 py-3.5 font-bold font-mono text-slate-300">${r.route}</td>
                <td class="px-4 py-3.5">
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold ${r.status === "PASS" ? "bg-teal-500/10 text-teal-400" : r.status === "WARNING" ? "bg-amber-500/10 text-amber-400" : "bg-rose-500/10 text-rose-400"}">
                    ${r.status}
                  </span>
                </td>
                <td class="px-4 py-3.5 font-mono text-slate-400">${r.responseTimeMs}ms</td>
                <td class="px-4 py-3.5 font-bold ${r.layoutPresent ? "text-teal-400" : "text-rose-500"}">${r.layoutPresent ? "Oui" : "Non"}</td>
                <td class="px-4 py-3.5 font-mono">${r.elementCount}</td>
                <td class="px-4 py-3.5 text-slate-400 font-medium max-w-xs truncate" title="${r.message}">
                  ${r.message}
                  ${r.jsErrors.length > 0 ? `<span class="block text-[10px] text-rose-400">${r.jsErrors.length} err console</span>` : ""}
                  ${r.networkErrors.length > 0 ? `<span class="block text-[10px] text-amber-400">${r.networkErrors.length} err reseau</span>` : ""}
                </td>
                <td class="px-4 py-3.5 text-center">
                  ${r.screenshotPath ? `<a href="${r.screenshotPath}" target="_blank" class="text-teal-400 font-bold hover:underline">Voir PNG</a>` : `<span class="text-slate-600">-</span>`}
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </section>

    <!-- API Test Table -->
    <section class="glass rounded-2xl overflow-hidden p-6 space-y-4">
      <h3 class="font-outfit font-black text-lg text-slate-100 uppercase tracking-tight">Rapport des Services API v2</h3>
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse text-xs">
          <thead>
            <tr class="bg-slate-900/60 border-b border-slate-800 text-slate-400 uppercase tracking-widest font-bold">
              <th class="px-4 py-3">Endpoint API</th>
              <th class="px-4 py-3">Code HTTP</th>
              <th class="px-4 py-3">Latence</th>
              <th class="px-4 py-3">Taille Payload</th>
              <th class="px-4 py-3">Nombre d'Objets</th>
              <th class="px-4 py-3">Statut</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/50">
            ${apiResults.map(a => `
              <tr class="hover:bg-slate-800/30 transition-colors">
                <td class="px-4 py-3.5 font-bold font-mono text-slate-300">${a.endpoint}</td>
                <td class="px-4 py-3.5 font-mono font-bold ${a.status === 200 ? "text-teal-400" : "text-rose-500"}">${a.status}</td>
                <td class="px-4 py-3.5 font-mono text-slate-400">${a.responseTimeMs}ms</td>
                <td class="px-4 py-3.5 font-mono text-slate-400">${(a.payloadSizeBytes / 1024).toFixed(1)} KB</td>
                <td class="px-4 py-3.5 font-mono font-bold">${a.objectCount}</td>
                <td class="px-4 py-3.5">
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold ${a.success ? "bg-teal-500/10 text-teal-400" : "bg-rose-500/10 text-rose-500"}">
                    ${a.success ? "OK" : "ÉCHEC"}
                  </span>
                  ${a.error ? `<span class="block text-[10px] text-rose-400 font-mono mt-0.5">${a.error}</span>` : ""}
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </section>

    <!-- Footer -->
    <footer class="text-center py-6 text-[10px] text-slate-500 border-t border-slate-800">
      PIT Quality Agent • Rapport généré à la demande du Sprint 4.6 • © 2026 Wallonie EER
    </footer>

  </div>
</body>
</html>
`;

  fs.writeFileSync(REPORT_HTML_PATH, htmlReport, "utf8");
  console.log("🏁 Audit complété ! Les rapports ont été générés.");
}

runAudit();

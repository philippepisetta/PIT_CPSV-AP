# PIT Functional Test Agent 🤖

Ce dossier contient l'Agent de Test Fonctionnel Automatisé de la **Plateforme d'Intelligence Territoriale (PIT) vNext** (Région wallonne).

Cet agent s'appuie sur **Playwright** et **TypeScript** pour exécuter les scénarios de recette métier officiels (définis par les partenaires wallons : WE, SPW EER, UCM, AKT, AWEX, WBI, pôles et clusters), valider l'intégrité de la plateforme, mesurer la performance et contrôler la conformité de la gouvernance et de la résilience territoriale.

---

## 📂 Structure du Dossier

```text
testing/pit-functional-agent/
├── README.md                  # Ce guide d'utilisation
├── test-plan.md               # Plan de test fonctionnel détaillé (scénarios partenaires)
├── playwright.config.ts       # Configuration Playwright de l'agent
├── pit-test-agent.ts          # Script orchestrateur & générateur de rapports
├── fixtures/                  # Données de test JSON (Source de Vérité #1)
│   └── partner-usecases.json  # Données extraites du document joint
├── tests/                     # Scripts de tests Playwright (.spec.ts)
│   ├── workspace-navigation.spec.ts  # Visibilité & isolation des workspaces/rôles
│   ├── crud-beneficiaries.spec.ts    # Enregistrement & archivage logique
│   ├── strategic-lineage.spec.ts     # Traceur d'alignement S3 & Preuves
│   ├── resilience-scenarios.spec.ts  # Scénario Caroline (Gaz x3) & Data Gaps
│   └── partner-validation.spec.ts    # Exécution des 15 scénarios partenaires
└── reports/                   # Livrables de rapports de test générés
    ├── pit-functional-test-report.md  # Rapport complet en Markdown
    └── pit-functional-test-report.html # Rapport visuel interactif Premium
```

---

## ⚙️ Configuration & Prérequis

L'agent nécessite que les deux serveurs de la PIT soient démarrés localement :
1. **Express Backend** : Démarré sur `http://localhost:3001` (gère les APIs v2).
2. **Next.js Frontend** : Démarré sur `http://localhost:3000` (interface utilisateur).

Les commandes globales de lancement lancent automatiquement ces services en arrière-plan si nécessaire.

---

## 🚀 Commandes de Test

Pour lancer les tests, utilisez les commandes npm suivantes à la racine du projet :

### 1. Exécuter tous les tests (Headless)
Cette commande exécute l'agent de test, joue l'ensemble des scénarios de recette en arrière-plan, capture les écrans en cas de panne et génère les rapports détaillés.
```bash
npm run test:pit
```

### 2. Exécuter les tests en mode visuel (Headed)
Utile pour voir l'agent manipuler l'interface en temps réel.
```bash
npm run test:pit:headed
```

### 3. Afficher le rapport interactif de Playwright
Pour analyser les détails techniques d'exécution, le lignage réseau et les logs de console de chaque étape.
```bash
npm run test:pit:report
```

---

## 📊 Rapports Générés
À la fin de chaque exécution, l'agent compile les résultats et produit :
* Un rapport de recette synthétique en Markdown sous [reports/pit-functional-test-report.md](reports/pit-functional-test-report.md).
* Une interface web interactive et premium sous [reports/pit-functional-test-report.html](reports/pit-functional-test-report.html).
* Les captures d'écran des étapes clés et des erreurs éventuelles sous `screenshots/`.

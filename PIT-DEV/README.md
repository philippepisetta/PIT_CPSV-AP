# PIT-DEV : Espaces Données (Interpérabilité) & Résilience (Policy Analysis)

Ce répertoire contient le dump fonctionnel complet de la refonte des espaces **Données** et **Résilience** de la Plateforme d'Intelligence Territoriale (PIT). Il a été conçu pour vous permettre d'intégrer et d'itérer facilement sur cette partie du projet.

---

## 📂 Structure du Dump

```text
PIT-DEV/
├── README.md                          # Ce guide d'explication
├── next.config.ts                     # Configuration des réécritures et redirections Next.js
├── prisma/
│   ├── schema.prisma                  # Schéma Prisma enrichi (Datasets, Sources, Mappings sémantiques, APIs, Référentiels)
│   └── seed.ts                        # Script de seeding (taxonomies de base et données de démo interop/résilience)
├── components/
│   └── Sidebar.tsx                    # Barre latérale avec gestion des rôles, sous-onglets et styles actifs sans blanc-sur-blanc
├── design-system/
│   └── PITWorkspaceProvider.tsx       # Fournisseur de contexte incluant le nouveau workspace 'resilience' (couleur rouge)
└── src/
    ├── server.ts                      # Serveur backend Express (endpoints CRUD sous /api/v2 pour l'interopérabilité)
    └── app/
        ├── api/[...path]/route.ts     # Route d'API Next.js servant de proxy vers le backend Express
        ├── interoperability/          # --- ESPACE DONNÉES (Interoperabilité) ---
        │   ├── page.tsx               # Tableau de bord principal, formulaires de création et onglets
        │   ├── quality/page.tsx       # Gestion fine de la qualité
        │   ├── api-exports/page.tsx   # Exports APIs
        │   └── resilience-data-catalogue/page.tsx
        ├── analysis-views/resilience/ # --- ESPACE RÉSILIENCE (Policy Cockpit) ---
        │   └── page.tsx               # Tableau de bord Résilience (Scénarios, Indicateurs OCDE, Chaînes critiques, Plans d'actions)
        ├── resilience/
        │   └── page.tsx               # Point d'accès redirigé / configuré
        └── strategic/
            └── demonstrator/page.tsx  # Démonstrateur Cabinet (Caroline) avec wizard en 3 étapes (Explicabilité, Data Gaps)
```

---

## ⚙️ Intégration dans votre environnement

Pour déployer et tester ces modules de votre côté, suivez ces étapes :

### 1. Base de données & Prisma
1. Remplacez ou fusionnez votre fichier `prisma/schema.prisma` avec celui fourni sous `PIT-DEV/prisma/schema.prisma`. Les modèles clés ajoutés/modifiés sont :
   * **`Dataset`** : support de la maturité data space (`dataSpaceReadiness`, `dataSpaceMaturityScore`), des métadonnées de gouvernance et des contraintes RGPD.
   * **`PitDataSource`** : attributs techniques et mode de synchronisation (SoR).
   * **`DataQualityRule`** : règles de contrôle de qualité liées aux dimensions F.A.I.R.
   * **`SemanticMapping`** : registre d'alignement des sources vers des ontologies (CPSV-AP, DCAT-AP).
   * **`Api` & `ApiRoute`** : gestionnaire d'exposition des endpoints de données.
   * **`ReferenceModel`** : registre des 15 taxonomies de référence.
2. Exécutez la mise à jour de la base de données :
   ```bash
   npx prisma db push
   # ou si vous utilisez les migrations :
   # npx prisma migrate dev --name init_interop_resilience
   ```
3. Regénérez le client Prisma :
   ```bash
   npx prisma generate
   ```

### 2. Alimentation des Référentiels (Seeding)
Copiez ou adaptez le script `seed.ts` pour précharger les taxonomies requises :
```bash
npm run seed
```
Le seed charge automatiquement **15 taxonomies de référence** (NACE, RIS3, D4WTA-AP, European AI Taxonomy, CPSV-AP, DCAT-AP, DMAT, TRL, IRL, MRL, DigComp, ESCO, O-RAMA, CORTEX, OECD) ainsi que les structures de démonstration de data products et de scénarios de résilience.

### 3. Backend Express (`src/server.ts`)
Les endpoints d'administration et d'API v2 nécessaires sont tous inclus dans `PIT-DEV/src/server.ts`. Ils gèrent les opérations de lecture/écriture pour :
* Les systèmes sources de données.
* Les datasets / data products (et calcul du score Data Space).
* Les règles de qualité et seuils.
* Les alignements ontologiques (mappings sémantiques).
* La configuration des routes d'API.

### 4. Configuration & Navigation du Frontend
1. Remplacez `next.config.ts` par `PIT-DEV/next.config.ts` (ou fusionnez les rewrites/redirects). Ce fichier assure les alias d'URL, notamment :
   * `/data` vers la page `/interoperability` (Espace Données).
   * `/resilience` vers `/analysis-views/resilience` (Espace Résilience).
   * `/resilience/demonstrator` vers `/strategic/demonstrator` (Caroline Demonstrator).
2. Intégrez `PIT-DEV/components/Sidebar.tsx` et `PIT-DEV/design-system/PITWorkspaceProvider.tsx` pour activer l'Espace Résilience et ses couleurs de thème associées, ainsi que la détection correcte des onglets actifs de la barre latérale basée sur les paramètres de requête (`?tab=...`).

---

## 🧪 Validation & Exécution des Tests

Une fois les fichiers copiés, l'application est prête à compiler et à être testée de manière automatisée.

1. **Compilation** :
   ```bash
   npm run build
   ```
2. **Exécution des tests de recette (Playwright)** :
   ```bash
   npm run test:pit
   ```
   *Ce script lance automatiquement le serveur backend, le serveur frontend Next.js et valide les 36 cas d'usages et contraintes d'isolation.*

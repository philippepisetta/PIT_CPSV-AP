# Plan d'Implémentation — API Core & Compatibilité V10 (Sprint 4.2)

## Référence : PIT_CORE_API_IMPLEMENTATION_PLAN_v2.5.0

Ce document définit la stratégie, la structure des points d'accès (endpoints REST) et la gouvernance technique pour l'implémentation de la couche d'API Core (vNext) au sein du serveur Express (`src/server.ts`), tout en assurant une compatibilité ascendante pour l'application cliente V10.

---

## ❓ Questions Ouvertes / Cadrage Validé

> [!NOTE]
> - **Versioning Global** : L'Option A (`/api/v2/...`) est adoptée. Toutes les nouvelles routes Core s'inscriront sous ce préfixe.
> - **DELETE = 0** : Aucun drop physique en base. Les endpoints V1 dépréciés écriront de manière synchrone dans les tables vNext via un double-écriture (Dual-Write) ciblé.
> - **Gouvernance et Normalisation** : Les réponses d'API de type collection sont normalisées au format `{ data: [...], meta: { page, pageSize, total, totalPages, hasNextPage, hasPreviousPage } }`. Les réponses individuelles sont retournées sous la forme `{ data: {...} }`.

---

## 📅 Historique des versions
* **v1.X.X** : Cadrage architectural (Sprints 0 à 4.0).
* **v2.0.0** : Sprint 4.1. Implémentation du schéma Prisma et du seed de données.
* **v2.1.0** : Première version du plan d'API Core.
* **v2.2.0** : Validation globale du plan (retrait définitif des suffixes `-vnext`).
* **v2.3.0** : Ajout des Service APIs, Journey APIs, ValueChainStage APIs, Taxonomy APIs, OpenAPI Strategy, et matrices de couverture PIT, CPSV et DR-BEST.
* **v2.4.0** : Intégration des APIs de navigation hiérarchique, de relations (Service/Journey), des filtres DR-BEST & S3, et de la Search API transverse.
* **v2.5.0** (Actuelle) : Intégration finale des Beneficiary et Organization APIs (CRUD & relations), des endpoints placeholders du Sprint 5 (Assessments & Benchmarks), du format enrichi de pagination, et mise à jour de la matrice de couverture complète à 17 entités.

---

## 🛠️ 1. Modifications Proposées (`src/server.ts`)

### A. Beneficiary APIs
Le point d'ancrage final du parcours utilisateur PIT.
* **`GET /api/v2/beneficiaries`** :
  - *Description* : Liste les bénéficiaires territoriaux (entreprises, organisations publiques ou privées, structures partenaires, bénéficiaires EDIH/PIT).
  - *Pagination* : `page` (défaut 1), `pageSize` (défaut 10), avec structure de métadonnées enrichie.
  - *Filtres/Recherche* : Recherche textuelle via paramètre `q`. Filtrage par `size`, `province`, `primaryNaceSectorId`, `territoryId`.
* **`GET /api/v2/beneficiaries/:id`** : Détail d'un bénéficiaire avec l'ensemble de ses attributs et de sa maturité.
* **`POST /api/v2/beneficiaries`** : Crée un nouveau bénéficiaire.
* **`PATCH /api/v2/beneficiaries/:id`** : Met à jour un bénéficiaire.
* **APIs de relations (Bénéficiaire 360°)** :
  - `GET /api/v2/beneficiaries/:id/journeys` : Liste les parcours d'accompagnement suivis par ce bénéficiaire (Prisma : `enrolledJourneys` / `journeyEnrollments`).
  - `GET /api/v2/beneficiaries/:id/services` : Liste les services publics consommés par ce bénéficiaire (Prisma : `deliveries` / `activitiesNew`).
  - `GET /api/v2/beneficiaries/:id/programs` : Liste les programmes d'aides dont il bénéficie.
  - `GET /api/v2/beneficiaries/:id/projects` : Liste les projets de transformation actifs créés pour ce bénéficiaire (Prisma : `projects`).

### B. Organization APIs
Organization est l'entité représentant les acteurs et autorités compétentes du modèle PIT.
* **`GET /api/v2/organizations`** : Liste les organisations. Recherche par `q`, filtrage par `type` (ex: Cluster, Centre de recherche, Pôle de compétitivité...).
* **`GET /api/v2/organizations/:id`** : Détail d'une organisation.
* **`POST /api/v2/organizations`** : Crée une organisation.
* **`PATCH /api/v2/organizations/:id`** : Met à jour une organisation.
* **APIs de relations (Organisation 360°)** :
  - `GET /api/v2/organizations/:id/services` : Liste les services publics proposés par cette organisation.
  - `GET /api/v2/organizations/:id/programs` : Liste les programmes portés ou co-portés par elle.
  - `GET /api/v2/organizations/:id/projects` : Liste les projets dans lesquels elle intervient.
  - `GET /api/v2/organizations/:id/ecosystems` : Liste les écosystèmes auxquels elle appartient (Prisma : `ecosystems` / `ecosystemMemberships`).
  - `GET /api/v2/organizations/:id/territories` : Liste les territoires couverts.

### C. Hierarchical & Relations APIs (Navigation Métier)
* **Hierarchical Navigation** :
  - `GET /api/v2/programs/:id/projects` : Liste les projets d'un programme.
  - `GET /api/v2/projects/:id/actions` : Liste les actions d'un projet.
  - `GET /api/v2/actions/:id/activities` : Liste les réalisations d'activités pour une action.
* **Service Relations** : `GET /api/v2/services/:id/challenges`, `/capabilities`, `/journeys`, `/programs`, `/projects`.
* **Journey Relations** : `GET /api/v2/journeys/:id/services`, `/challenges`, `/capabilities`, `/business-events`, `/life-events`, `/beneficiaries`.

### D. DR-BEST & S3 comme Filtres Fonctionnels
Les routes collections (`services`, `journeys`, `programs`, `projects`) acceptent les filtres :
- `drbest` (DATA, REMOTE, BUSINESS, ECOSYSTEM, SKILLS, TECHNOLOGY).
- `s3Domain`, `valueChain`, `valueChainStage` (Identifiants uniques pour filtrer par axe de spécialisation intelligente S3).

### E. Search API Transverse (Recherche Simple Multi-Entités)
* **`GET /api/v2/search?q=`** : Recherche insensible à la casse sur les 12 entités Core de la PIT. Limite fixe de 5 à 10 résultats par entité pour les performances.
* *Structure de réponse* :
  ```json
  {
    "data": {
      "programs": [],
      "projects": [],
      "services": [],
      "journeys": [],
      "challenges": [],
      "capabilities": []
    }
  }
  ```

### F. Placeholders pour le Sprint 5 (Évaluation & Scoring)
Points d'accès stubs sans base de données pour stabiliser les contrats d'API et préparer le Sprint 5 :
* **`GET /api/v2/assessment-frameworks`** : Référentiels d'évaluation.
* **`GET /api/v2/questionnaires`** : Questionnaires de maturité.
* **`GET /api/v2/assessment-results`** : Résultats des audits de maturité.
* **`GET /api/v2/benchmarks`** : Points de comparaison sectoriels.
* *Réponse JSON temporaire* : `{"status": "planned_for_sprint_5"}` (Statut HTTP 200).

---

## 📜 2. OpenAPI / Swagger Strategy & Pagination

### A. Stratégie OpenAPI / Swagger
* Spécification JSON dynamique à `/api/v2/openapi.json` générée via les commentaires JSDoc.
* Swagger UI interactive disponible sur `/api/v2/docs`.
* Script post-build `npm run generate-api-types` pour générer automatiquement les interfaces TypeScript pour le client Next.js.

### B. Format Complet de Pagination
Afin de faciliter les développements du client React, le format de réponse pour toutes les collections de l'API v2 est standardisé :
```json
{
  "data": [],
  "meta": {
    "page": 1,
    "pageSize": 10,
    "total": 125,
    "totalPages": 13,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

---

## 🎯 3. Matrice de Couverture Complète (PIT API Coverage Matrix)

| Entité PIT | API Exposée | Relations accessibles | Recherche textuelle |
| :--- | :--- | :--- | :---: |
| **`Organization`** | `GET/POST/PATCH /api/v2/organizations` | Services, Programs, Projects, Ecosystems, Territories | Oui (`q`) |
| **`Beneficiary`** | `GET/POST/PATCH /api/v2/beneficiaries` | Journeys, Services, Programs, Projects | Oui (`q`) |
| **`Program`** | `GET/POST/PATCH /api/v2/programs` | Projects, Owner, Strategies, S3 | Oui (`q`) |
| **`Project`** | `GET/POST/PATCH /api/v2/projects` | Actions, Program, Beneficiary, Ecosystems | Oui (`q`) |
| **`Action`** | `GET/POST/PATCH /api/v2/actions` | Project, Activities | Oui (`q`) |
| **`Activity`** | `GET/POST/PATCH /api/v2/activities` | Service, Operator, Beneficiary, Action, Journey | Oui (`q`) |
| **`Challenge`** | `GET/POST/PATCH /api/v2/challenges` | Capabilities, Services, Journeys | Oui (`q`) |
| **`Capability`** | `GET/POST/PATCH /api/v2/capabilities` | Challenges, Services, parent/child | Oui (`q`) |
| **`Service`** | `GET/POST/PATCH /api/v2/services` | Org, Requirements, Journeys, S3, Challenges | Oui (`q`) |
| **`Journey`** | `GET/POST/PATCH /api/v2/journeys` | Stages, Services, Challenges, S3, Companies | Oui (`q`) |
| **`BusinessEvent`**| `GET/POST/PATCH /api/v2/business-events`| Services | Oui (`q`) |
| **`LifeEvent`** | `GET/POST/PATCH /api/v2/life-events` | Services | Oui (`q`) |
| **`Territory`** | `GET/POST/PATCH /api/v2/territories` | parent/child, Beneficiaries, Programs | Oui (`q`) |
| **`Ecosystem`** | `GET/POST/PATCH /api/v2/ecosystems` | Actors, Services, Journeys, S3, Challenges | Oui (`q`) |
| **`S3Domain`** | `GET/POST/PATCH /api/v2/s3-domains` | ValueChains | Oui (`q`) |
| **`ValueChain`** | `GET/POST/PATCH /api/v2/value-chains` | S3Domain, Stages, Activities | Oui (`q`) |
| **`ValueChainStage`**| `GET/POST/PATCH /api/v2/value-chain-stages`| ValueChain, Services, Beneficiaries | Oui (`q`) |

---

## 🔄 4. Stratégie de Double-Écriture (Dual-Write)

| Endpoint V1 | Déclencheur client V10 | Cible Table vNext (v2) | Logique de Synchronisation |
| :--- | :---: | :---: | :--- |
| `POST /api/action-instances` | Création d'un diagnostic/action | `Action` | Crée une ligne `Action` avec le titre et le statut. |
| `PATCH /api/action-instances/:id` | Mise à jour du statut | `Action` | Met à jour le statut dans la table `Action` correspondante. |
| `POST /api/service-deliveries` | Enregistrement de service | `Activity` | Crée une `Activity` (type `INDIVIDUAL`), lie le service et le bénéficiaire. |
| `POST /api/collective-deliveries`| Enregistrement d'animation | `Activity` | Crée une `Activity` (type `COLLECTIVE`), lie les bénéficiaires participants. |
| `POST/PATCH /api/beneficiaries` | Enregistrement d'une PME | `Beneficiary` | Maintient de manière synchrone les 5 colonnes de maturité legacy de la table `beneficiaries`. |

---

## 🧪 5. Plan de Vérification Technique

### Tests d'Intégration API
Création du script `/scratch/test_api_vnext.ts` pour valider :
* **Vérification double-écriture** : Écriture sur `/api/action-instances` et `/api/service-deliveries` ➔ vérification de la création des entités vNext correspondantes.
* **Vérification de structure** : Requêtes sur `/api/v2/search?q=` et validation du schéma JSON unifié.
* **Vérification des filtres DR-BEST & S3** : Filtrer `/api/v2/services` par `drbest=TECHNOLOGY` et valider les résultats.
* **TypeScript Gate** : Exécution de `npx tsc --noEmit` à la racine et dans `cpsv-ap-app`.

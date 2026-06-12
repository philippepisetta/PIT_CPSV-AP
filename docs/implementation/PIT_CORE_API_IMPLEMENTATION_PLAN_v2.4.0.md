# Plan d'Implémentation — API Core & Compatibilité V10 (Sprint 4.2)

## Référence : PIT_CORE_API_IMPLEMENTATION_PLAN_v2.4.0

Ce document définit la stratégie, la structure des points d'accès (endpoints REST) et la gouvernance technique pour l'implémentation de la couche d'API Core (vNext) au sein du serveur Express (`src/server.ts`), tout en assurant une compatibilité ascendante pour l'application cliente V10.

---

## ❓ Questions Ouvertes / Cadrage Validé

> [!NOTE]
> - **Versioning Global** : L'Option A (`/api/v2/...`) est adoptée. Toutes les nouvelles routes Core s'inscriront sous ce préfixe.
> - **DELETE = 0** : Aucun drop physique en base. Les endpoints V1 dépréciés écriront de manière synchrone dans les tables vNext via un double-écriture (Dual-Write) ciblé.
> - **Gouvernance et Normalisation** : Les réponses d'API de type collection sont normalisées au format `{ data: [...], meta: { page, pageSize, total } }`. Les réponses individuelles sont retournées sous la forme `{ data: {...} }`.

---

## 📅 Historique des versions
* **v1.X.X** : Cadrage architectural (Sprints 0 à 4.0).
* **v2.0.0** : Sprint 4.1. Implémentation du schéma Prisma et du seed de données.
* **v2.1.0** : Première version du plan d'API Core.
* **v2.2.0** : Validation globale du plan (retrait définitif des suffixes `-vnext`).
* **v2.3.0** : Ajout des Service APIs, Journey APIs, ValueChainStage APIs, Taxonomy APIs, OpenAPI Strategy, et matrices de couverture PIT, CPSV et DR-BEST.
* **v2.4.0** (Actuelle) : Intégration des APIs hiérarchiques de navigation, des APIs de relations (Service & Journey), activation de DR-BEST et de S3 comme filtres fonctionnels, Search API transverse, et APIs de navigation du Knowledge Graph.

---

## 🛠️ 1. Modifications Proposées (`src/server.ts`)

### A. Hierarchical APIs (Navigation Métier)
Permet de naviguer dans l'arborescence métier sans reconstruire les jointures côté frontend.
* **`GET /api/v2/programs/:id/projects`** : Liste les projets liés à un programme.
  - *Pagination* : `page` (défaut 1), `pageSize` (défaut 10).
  - *Tri/Filtres* : Tri par `name`, filtre par `status`.
  - *Réponse* : `{ data: Project[], meta: { page, pageSize, total } }` avec compteurs de relations.
* **`GET /api/v2/projects/:id/actions`** : Liste les actions liées à un projet.
  - *Pagination/Tri* : Standard. Filtre par `status`.
* **`GET /api/v2/actions/:id/activities`** : Liste les activités réelles associées à une action théorique.
  - *Pagination/Tri* : Standard. Filtre par `activityType` (INDIVIDUAL, COLLECTIVE, SECOND_LINE) et `status`.

### B. Service Relation APIs (Vue 360° Service)
Endpoints pour extraire les relations associées à un service CPSV-AP spécifique.
* **`GET /api/v2/services/:id/challenges`** : Liste les défis associés à un service.
* **`GET /api/v2/services/:id/capabilities`** : Liste les capabilités associées à un service.
* **`GET /api/v2/services/:id/journeys`** : Liste les modèles de parcours intégrant ce service.
* **`GET /api/v2/services/:id/programs`** : Liste les programmes de financement ou d'accompagnement associés (via les relations indirectes ou initiatives).
* **`GET /api/v2/services/:id/projects`** : Liste les projets actifs liés à ce service.

### C. Journey Relation APIs (Recommandation & Vues 360°)
Endpoints pour extraire les entités connectées à un modèle de parcours.
* **`GET /api/v2/journeys/:id/services`** : Liste les services intégrés aux étapes de ce parcours.
* **`GET /api/v2/journeys/:id/challenges`** : Liste les défis ciblés par ce parcours.
* **`GET /api/v2/journeys/:id/capabilities`** : Liste les capabilités développées par ce parcours.
* **`GET /api/v2/journeys/:id/business-events`** : Liste les événements professionnels associés aux services de ce parcours.
* **`GET /api/v2/journeys/:id/life-events`** : Liste les événements de vie associés.
* **`GET /api/v2/journeys/:id/beneficiaries`** : Liste les bénéficiaires inscrits à ce parcours.

### D. DR-BEST & S3 comme Filtres Fonctionnels
Faire de DR-BEST (Data, Remote, Business, Ecosystem, Skills, Technology) et de l'alignement S3 (S3Domain, ValueChain, ValueChainStage) de véritables axes de filtrage sur les collections.
* **Filtre `drbest`** :
  - Applicable sur `/api/v2/services`, `/api/v2/journeys`, `/api/v2/programs`, et `/api/v2/projects`.
  - Valeurs acceptées : `DATA`, `REMOTE`, `BUSINESS`, `ECOSYSTEM`, `SKILLS`, `TECHNOLOGY`.
  - Implémentation Prisma : Mappage sur la table `TransformationDimension` reliée (Codes de dimension : `D`, `R`, `B`, `E`, `S`, `T`).
* **Filtres `s3Domain`, `valueChain`, `valueChainStage`** :
  - Applicable sur `/api/v2/services`, `/api/v2/journeys`, `/api/v2/programs`, et `/api/v2/projects`.
  - Implémentation Prisma : Jointures et filtres imbriqués sur les relations `filieresS3`, `stages`, `valueChains`, `stagesTransverses`, ou `StrategicDomainDimension` selon le modèle.

### E. Search API Transverse (Recherche Simple Multi-Entités)
Fournir un point d'accès unifié pour la recherche de mots-clés sur le futur portail PIT.
* **`GET /api/v2/search?q=`** :
  - *Description* : Recherche textuelle simple (insensible à la casse, match partiel sur `name`, `title` ou `code`) sur les 12 entités Core.
  - *Réponse* :
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
  - *Optimisation* : Limite à 5 ou 10 résultats maximum par type d'entité pour garantir des temps de réponse rapides.

### F. API de Navigation du Knowledge Graph (Préparation Sprint 6)
Fournir des sous-graphes locaux centrés sur une entité spécifique en utilisant les relations Prisma existantes.
* **`GET /api/v2/graph/services/:id`** : Retourne les nœuds et arêtes adjacents à un service (Organization, Challenges, ValueChains, JourneyStages).
* **`GET /api/v2/graph/challenges/:id`** : Retourne le voisinage sémantique d'un défi (Capabilities, Services, Journeys, Ecosystems).
* **`GET /api/v2/graph/capabilities/:id`** : Retourne l'arbre de dépendance d'une capabilité (parent, enfants, services).
* **`GET /api/v2/graph/programs/:id`** : Retourne le réseau d'un programme (Projects, Organization, Strategies).
* *Format de réponse* : `{ data: { nodes: Array<{ id, label, type }>, edges: Array<{ id, source, target, label }> } }`

---

## 📜 2. OpenAPI / Swagger Strategy

Toutes les nouvelles APIs v2 seront documentées et exposées via Swagger.
1. **Spécification JSON dynamique** : **`GET /api/v2/openapi.json`** via `swagger-jsdoc`.
2. **Interface Interactive Swagger UI** : **`/api/v2/docs`** via `swagger-ui-express`.
3. **Typage TypeScript** : script `npm run generate-api-types` utilisant `openapi-typescript` pour générer `cpsv-ap-app/src/types/api-v2.ts`.

---

## 🎯 3. Matrice de Couverture Détaillée (PIT API Coverage Matrix)

| Entité PIT | CRUD v2 | Relations exposées | Filtres actifs | Recherche textuelle | Navigation Graph |
| :--- | :---: | :--- | :--- | :---: | :---: |
| **`Program`** | Oui | Projects, Owner, Strategies, S3 | `drbest`, `s3Domain`, `valueChain`, `status` | Oui (`q`) | Oui |
| **`Project`** | Oui | Actions, Program, Beneficiary, Ecosystems | `drbest`, `s3Domain`, `valueChain`, `status`, `programId` | Oui (`q`) | Non (direct) |
| **`Action`** | Oui | Project, Activities | `projectId`, `status` | Oui (`q`) | Non (direct) |
| **`Activity`** | Oui | Service, Operator, Beneficiary, Action, Journey | `actionId`, `serviceId`, `activityType`, `status` | Oui (`q`) | Non (direct) |
| **`Challenge`** | Oui | Capabilities, Services, Journeys | `challengeCategoryId` | Oui (`q`) | Oui |
| **`Capability`** | Oui | Challenges, Services, parent/child | `parentCapabilityId`, `capabilityType` | Oui (`q`) | Oui |
| **`Service`** | Oui | Org, Requirements, Journeys, S3, Challenges | `drbest`, `s3Domain`, `valueChain`, `valueChainStage`, `organizationId` | Oui (`q`) | Oui |
| **`Journey`** | Oui | Stages, Services, Challenges, S3, Companies | `drbest`, `s3Domain`, `valueChain`, `valueChainStage` | Oui (`q`) | Non (direct) |
| **`BusinessEvent`** | Oui | Services | Aucun | Oui (`q`) | Non (direct) |
| **`LifeEvent`** | Oui | Services | Aucun | Oui (`q`) | Non (direct) |
| **`Territory`** | Oui | parent/child, Beneficiaries, Programs | `parentTerritoryId`, `type` | Oui (`q`) | Non (direct) |
| **`Ecosystem`** | Oui | Actors, Services, Journeys, S3, Challenges | `typeId` | Oui (`q`) | Non (direct) |
| **`S3Domain`** | Oui | ValueChains | Aucun | Oui (`q`) | Non (direct) |
| **`ValueChain`** | Oui | S3Domain, Stages, Activities | `s3DomainId` | Oui (`q`) | Non (direct) |
| **`ValueChainStage`** | Oui | ValueChain, Services, Beneficiaries | `valueChainId`, `category` | Oui (`q`) | Non (direct) |

---

## 🇪🇺 4. Matrice de Couverture CPSV-AP

Alignement de la couche d'API avec les standards européens CPSV-AP :

| Concept CPSV-AP | Endpoint V2 Associé | Couverture | Rationale / Précisions |
| :--- | :--- | :---: | :--- |
| **`PublicService`** | `/api/v2/services` | **Présent** | API REST complète pour `PublicService` avec ses relations. |
| **`BusinessEvent`** | `/api/v2/business-events` | **Présent** | Déclencheur sémantique lié aux entreprises. |
| **`LifeEvent`** | `/api/v2/life-events` | **Présent** | Déclencheur sémantique lié au cycle de vie. |
| **`Channel`** | `/api/v2/channels` | **Partiel** | Retourné dans les services; route taxonomique dédiée. |
| **`Requirement`** | *N/A (Imbriqué)* | **Partiel** | Géré directement via le payload dans `/services`. |
| **`Evidence`** | `/api/v2/activities` (evidences) | **Partiel** | Preuves associées aux activités et réalisations réelles. |
| **`Output`** | *N/A (Imbriqué)* | **Partiel** | Livrable théorique modélisé comme relation de `PublicService`. |
| **`Rule`** | *N/A (Imbriqué)* | **Différé** | Règles d'éligibilité gérées au niveau du scoring (Sprint 5). |
| **`TargetAudience`** | `/api/v2/taxonomies/target-audiences` | **Partiel** | Publics cibles disponibles (PME, Startup, Commune...). |
| **`CompetentAuthority`**| `/api/v2/organizations` | **Partiel** | Mappé sur `ownerOrganization` ou via memberships d'écosystème. |

---

## 📈 5. Matrice de Couverture DR-BEST

| Dimension DR-BEST | Endpoint Exposé | Mode de Récupération | Usages & Intégration |
| :--- | :--- | :--- | :--- |
| **Data** | `/api/v2/beneficiaries/:id` | Clé `maturityData` dans le profil. | Modélise la maturité de gestion de données (radar PME). |
| **Remote** | `/api/v2/beneficiaries/:id` | Clé `maturityRemote`. | Télétravail, connectivité et infrastructure cloud. |
| **Business** | `/api/v2/beneficiaries/:id` | Clé `maturityBusiness`. | Modélise la durabilité et l'économie circulaire. |
| **Ecosystem** | `/api/v2/beneficiaries/:id` | Clé `maturityEcosystem`. | Capacité de collaboration avec les pôles régionaux. |
| **Skills** | `/api/v2/beneficiaries/:id` | Clé `maturitySkills`. | Besoins en upskilling, formation continue. |
| **Technology** | `/api/v2/beneficiaries/:id` | Clé `maturityTechnology`. | Adoption des technologies avancées (IA/Cyber). |

### Note d'implémentation de la Maturité (Sprint 4.2) :
Le serveur convertira de manière transparente la maturité pour la V10 client :
* `maturityTechnology` calculé en lecture comme la moyenne de `maturityIa` et `maturityCyber`.
* `maturityData` mapped sur `maturityDigital`.
* `maturityBusiness` mapped sur `maturityDurability`.
Les écritures PATCH sur `/api/beneficiaries` mettront à jour automatiquement les colonnes legacy pour préserver les graphiques radars existants.

---

## 🔄 6. Stratégie de Double-Écriture (Dual-Write)

| Endpoint V1 | Déclencheur client V10 | Cible Table vNext (v2) | Logique de Synchronisation |
| :--- | :---: | :---: | :--- |
| `POST /api/action-instances` | Création d'un diagnostic/action | `Action` | Crée une ligne `Action` avec le titre et le statut. |
| `PATCH /api/action-instances/:id` | Mise à jour du statut | `Action` | Met à jour le statut dans la table `Action` correspondante. |
| `POST /api/service-deliveries` | Enregistrement de service | `Activity` | Crée une `Activity` (type `INDIVIDUAL`), lie le service et le bénéficiaire. |
| `POST /api/collective-deliveries`| Enregistrement d'animation | `Activity` | Crée une `Activity` (type `COLLECTIVE`), lie les bénéficiaires participants. |
| `POST/PATCH /api/beneficiaries` | Enregistrement d'une PME | `Beneficiary` | Maintient de manière synchrone les 5 colonnes de maturité legacy de la table `beneficiaries`. |

---

## ⚖️ 7. Matrice de Compatibilité API V1 vs V2

| Endpoint Legacy (V1) | Endpoint Cible (V2) | Statut Applicatif | Rationale |
| :--- | :--- | :---: | :--- |
| `GET /api/services` | `/api/v2/services` | **ADAPT** | Modifié en interne pour lire/lier les nouvelles capabilités, mais retourne le format V1. |
| `GET /api/meta` | `/api/v2/meta` | **ADAPT** | Fusionne les taxonomies legacy et vNext en lecture pour les cockpits V10. |
| `GET /api/journeys` | `/api/v2/journeys` | **DEPRECATE** | Redirigé temporairement vers les nouveaux endpoints. |
| `GET /api/action-instances` | `/api/v2/actions` | **DEPRECATE** | Remplacé par Actions. V1 maintenu via Dual-Write. |
| `GET /api/service-deliveries` | `/api/v2/activities` | **DEPRECATE** | Remplacé par Activities. V1 maintenu via Dual-Write. |
| `GET /api/collective-deliveries`| `/api/v2/activities` | **DEPRECATE** | Remplacé par Activities. V1 maintenu via Dual-Write. |
| `GET /api/second-line-missions` | `/api/v2/activities` | **DEPRECATE** | Remplacé par Activities. V1 maintenu. |
| *Aucun* | `/api/v2/programs` | **KEEP** | Nouveau dans la v2. |
| *Aucun* | `/api/v2/projects` | **KEEP** | Nouveau dans la v2. |
| *Aucun* | `/api/v2/business-events` | **KEEP** | Nouveau dans la v2 (Standard CPSV-AP). |
| *Aucun* | `/api/v2/life-events` | **KEEP** | Nouveau dans la v2 (Standard CPSV-AP). |
| `GET /api/territories` | `/api/v2/territories` | **ADAPT** | Migré vers l'API v2 avec standard de réponse et pagination. |
| `GET /api/ecosystems` | `/api/v2/ecosystems` | **ADAPT** | Migré vers l'API v2 avec format unifié. |

---

## 🏛️ 8. API Governance (API Design Principles)

1. **API First** : Définition des schémas d'entrée/sortie et codes de réponse HTTP standardisés.
2. **Backward Compatibility** : Maintien strict de la compatibilité V10 via versioning `/api/v2` et Dual-Write synchrone.
3. **Taxonomy Driven** : Les réponses d'API reflètent les concepts validés (W3C ORG, CPSV-AP, S3).
4. **Pagination Obligatoire** : Format `meta` (page, pageSize, total) pour toutes les collections.
5. **Filtrage et Tri Standardisés** : Utilisation des paramètres `sortBy`, `sortOrder`, et filtres typés.
6. **Documentation OpenAPI** : Extraction automatique et interfaces Swagger interactives.

---

## 🧪 9. Plan de Vérification Technique

### Tests d'Intégration API
Création du script `/scratch/test_api_vnext.ts` pour valider :
* **Vérification double-écriture** : Écriture sur `/api/action-instances` et `/api/service-deliveries` ➔ vérification de la création des entités vNext correspondantes.
* **Vérification de structure** : Requêtes sur `/api/v2/search?q=` et validation du schéma JSON unifié.
* **Vérification des filtres DR-BEST & S3** : Filtrer `/api/v2/services` par `drbest=TECHNOLOGY` et valider les résultats.
* **TypeScript Gate** : Exécution de `npx tsc --noEmit` à la racine et dans `cpsv-ap-app`.

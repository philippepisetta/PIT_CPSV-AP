# Plan d'Implémentation — API Core & Compatibilité V10 (Sprint 4.2)

## Référence : PIT_CORE_API_IMPLEMENTATION_PLAN_v2.3.0

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
* **v2.1.0** : Première version du plan d'API Core (Action/Activity/Capability/Challenge/S3).
* **v2.2.0** : Validation globale du plan par le client (retrait définitif des suffixes `-vnext`).
* **v2.3.0** (Actuelle) : Intégration complète des compléments du Core Domain (Service APIs, Journey APIs, ValueChainStage APIs, Taxonomy APIs, OpenAPI Strategy, et matrices de couverture PIT, CPSV et DR-BEST).

---

## 🛠️ 1. Modifications Proposées (`src/server.ts`)

### A. Service APIs (CPSV-AP Pivot)
Service est l'entité pivot de l'alignement CPSV-AP.
* **`GET /api/v2/services`** :
  - *Description* : Liste les services publics (CPSV-AP).
  - *Pagination* : `page` (défaut 1), `pageSize` (défaut 10).
  - *Filtrage* : `organizationId` (Int), `interventionLevelId` (Int), `challengeId` (Int), `valueChainStageId` (Int).
  - *Tri/Recherche* : Recherche textuelle via paramètre `q`. Tri par `name` ou `createdAt` (ASC/DESC).
  - *Relations incluses* :
    - Capability: `capabilitiesNew` (Capabilités PIT v7/v11).
    - Journey: via `journeyStages.journey` (Modèles de parcours associés).
    - S3: `filieresS3` (Filières S3) et `stages` (ValueChainStages).
    - DR-BEST: calculé ou extrait via les `transformationDimensions` (Data, Remote, Business, Ecosystem, Skills, Technology) reliées au service.
* **`GET /api/v2/services/:id`** : Renvoie le détail d'un service individuel avec l'ensemble de ses relations sémantiques et CPSV (Requirement, Evidence, Output, Cost, Channel, Rule, Criterion).
* **`POST /api/v2/services`** : Crée un nouveau service public (avec connexion de ses relations associées).
* **`PATCH /api/v2/services/:id`** : Met à jour un service public.

### B. Journey APIs
Journey représente l'un des objets centraux de la PIT pour cartographier le parcours de la PME.
* **`GET /api/v2/journeys`** :
  - *Description* : Liste les modèles de parcours.
  - *Pagination/Recherche* : `page`, `pageSize`, recherche textuelle `q`.
  - *Relations incluses* :
    - Service: les services associés via les étapes du parcours (`stages.services`).
    - Challenge: les défis d'affaires liés (`challenges`).
    - Capability: les capabilités requises (via les dimensions de transformation).
    - Beneficiary: les bénéficiaires inscrits (`companies`).
    - BusinessEvent / LifeEvent: récupérés dynamiquement depuis les services associés aux étapes.
* **`GET /api/v2/journeys/:id`** : Détail d'un parcours individuel avec ses étapes (`stages`) ordonnées par position, incluant les services de chaque étape.
* **`POST /api/v2/journeys`** : Crée un nouveau modèle de parcours.
* **`PATCH /api/v2/journeys/:id`** : Met à jour un modèle de parcours.

### C. ValueChainStage APIs (Strategic Domain S3)
Structure hiérarchique S3 : S3Domain ➔ ValueChain ➔ ValueChainStage.
* **`GET /api/v2/value-chain-stages`** :
  - *Description* : Liste les maillons transverses.
  - *Filtrage* : `valueChainId` (Int), `category` (String).
  - *Relations* : `valueChain` (Filière S3 parente), `services` (Services associés), `beneficiaries` (Bénéficiaires à ce stade), `journeys` (Parcours traversant ce maillon).
  - *Navigation hiérarchique* : Possibilité de filtrer et naviguer depuis `s3DomainId` (via la ValueChain).
* **`GET /api/v2/value-chain-stages/:id`** : Renvoie un maillon spécifique.
* **`POST /api/v2/value-chain-stages`** : Crée un maillon.
* **`PATCH /api/v2/value-chain-stages/:id`** : Modifie un maillon.

### D. Taxonomy APIs (Couche Référentiel Dédiée)
Centralise l'accès aux référentiels et nomenclatures contrôlées de la PIT sous un point d'accès unifié.
* **`GET /api/v2/taxonomies`** : Renvoie la liste de toutes les taxonomies disponibles et de leurs sous-routes.
* **`GET /api/v2/taxonomies/drbest`** : Renvoie les 6 dimensions du référentiel DR-BEST (Data, Remote, Business, Ecosystem, Skills, Technology) depuis les `TransformationDimension` en base.
* **`GET /api/v2/taxonomies/capabilities`** : Renvoie l'arbre complet des capabilités (gestion de la relation réflexive `parentCapabilityId`/`childCapabilities`).
* **`GET /api/v2/taxonomies/challenges`** : Renvoie les défis catégorisés (groupement par `ChallengeCategory`).
* **`GET /api/v2/taxonomies/s3`** : Renvoie la hiérarchie stratégique S3 complète (`S3Domain` -> `ValueChain` -> `ValueChainStage`).
* **`GET /api/v2/taxonomies/territories`** : Renvoie l'arborescence hiérarchique des territoires wallons (`Territory` avec `parentTerritory` et `childTerritories`).
* **`GET /api/v2/taxonomies/ecosystem-types`** : Liste les types d'écosystèmes (EDIH, Cluster, Pôle de compétitivité...).
* **`GET /api/v2/taxonomies/intervention-types`** : Liste les types d'interventions (Service, Financement, Projet, Événement...).
* **`GET /api/v2/taxonomies/organization-roles`** : Liste les rôles des organisations (Coordinateur, Partenaire, Financeur, Opérateur...).

---

## 📜 2. OpenAPI / Swagger Strategy

Toutes les nouvelles APIs v2 doivent être documentées automatiquement pour assurer l'intégration des clients frontend, futurs connecteurs et partenaires PIT.

1. **Spécification JSON dynamique** :
   - Route : **`GET /api/v2/openapi.json`**
   - Implémentation : Utilisation de `swagger-jsdoc` pour générer dynamiquement la spécification OpenAPI v3 à partir des annotations JSDoc documentées directement au-dessus des gestionnaires de routes dans `src/server.ts`.
2. **Interface Interactive Swagger UI** :
   - Route : **`/api/v2/docs`**
   - Implémentation : Rendu visuel de la spécification OpenAPI via `swagger-ui-express`.
3. **Typage TypeScript généré** :
   - Un script `npm run generate-api-types` utilisera l'outil CLI `openapi-typescript` pour générer automatiquement le fichier de types TypeScript `cpsv-ap-app/src/types/api-v2.ts` à partir de `http://localhost:3001/api/v2/openapi.json`.

---

## 🎯 3. Matrice de Couverture du Modèle PIT Core

Cette matrice certifie que toutes les entités identifiées du Core Domain disposent d'un accès API v2 cohérent :

| Entité PIT | API Exposée | Statut API v2 | Rationale / Modèle Prisma |
| :--- | :--- | :---: | :--- |
| **`Program`** | `GET/POST/PATCH /api/v2/programs` | **Présent** | Modèle `Program` |
| **`Project`** | `GET/POST/PATCH /api/v2/projects` | **Présent** | Modèle `Project` |
| **`Action`** | `GET/POST/PATCH /api/v2/actions` | **Présent** | Modèle `Action` (vNext unifié) |
| **`Activity`** | `GET/POST/PATCH /api/v2/activities` | **Présent** | Modèle `Activity` (vNext unifié) |
| **`Challenge`** | `GET/POST/PATCH /api/v2/challenges` | **Présent** | Modèle `Challenge` (remplace BusinessChallenge) |
| **`Capability`** | `GET/POST/PATCH /api/v2/capabilities` | **Présent** | Modèle `Capability` (remplace CapabilityDimension) |
| **`Service`** | `GET/POST/PATCH /api/v2/services` | **Présent** | Modèle `PublicService` (CPSV-AP pivot) |
| **`Journey`** | `GET/POST/PATCH /api/v2/journeys` | **Présent** | Modèle `Journey` (Modèles de parcours) |
| **`BusinessEvent`** | `GET/POST/PATCH /api/v2/business-events` | **Présent** | Modèle `BusinessEvent` |
| **`LifeEvent`** | `GET/POST/PATCH /api/v2/life-events` | **Présent** | Modèle `LifeEvent` |
| **`Territory`** | `GET/POST/PATCH /api/v2/territories` | **Présent** | Modèle `Territory` |
| **`Ecosystem`** | `GET/POST/PATCH /api/v2/ecosystems` | **Présent** | Modèle `Ecosystem` |
| **`S3Domain`** | `GET/POST/PATCH /api/v2/s3-domains` | **Présent** | Modèle `S3Domain` |
| **`ValueChain`** | `GET/POST/PATCH /api/v2/value-chains` | **Présent** | Modèle `ValueChain` |
| **`ValueChainStage`** | `GET/POST/PATCH /api/v2/value-chain-stages` | **Présent** | Modèle `ValueChainStage` |

---

## 🇪🇺 4. Matrice de Couverture CPSV-AP

Alignement de la couche d'API avec les standards européens CPSV-AP (Common Public Service Vocabulary Application Profile) :

| Concept CPSV-AP | Endpoint V2 Associé | Statut | Rationale / Précisions |
| :--- | :--- | :---: | :--- |
| **`PublicService`** | `/api/v2/services` | **Présent** | API REST complète pour `PublicService` avec ses relations. |
| **`BusinessEvent`** | `/api/v2/business-events` | **Présent** | Déclencheur sémantique lié aux entreprises. |
| **`LifeEvent`** | `/api/v2/life-events` | **Présent** | Déclencheur sémantique lié au cycle de vie. |
| **`Channel`** | `/api/v2/channels` | **Partiel** | Retourné imbriqué dans les services; route taxonomique dédiée. |
| **`Requirement`** | *N/A (Imbriqué)* | **Partiel** | Géré directement via le payload dans `GET/POST/PATCH /services`. |
| **`Evidence`** | `/api/v2/activities` (evidences) | **Partiel** | Preuves associées aux activités et réalisations réelles. |
| **`Output`** | *N/A (Imbriqué)* | **Partiel** | Livrable théorique modélisé comme relation de `PublicService`. |
| **`Rule`** | *N/A (Imbriqué)* | **Différé** | Règles d'éligibilité gérées au niveau du scoring (Sprint 5). |
| **`TargetAudience`** | `/api/v2/taxonomies/target-audiences` | **Partiel** | Publics cibles disponibles (PME, Startup, Commune...). |
| **`CompetentAuthority`**| `/api/v2/organizations` | **Partiel** | Mappé sur `ownerOrganization` ou via memberships d'écosystème. |

---

## 📈 5. Matrice de Couverture DR-BEST

Description de l'exposition et du traitement des 6 dimensions de maturité du référentiel **DR-BEST** (Data, Remote, Business, Ecosystem, Skills, Technology) :

| Dimension DR-BEST | Endpoint Exposé | Mode de Récupération | Usages & Intégration |
| :--- | :--- | :--- | :--- |
| **Data** | `/api/v2/beneficiaries/:id` | Clé `maturityData` dans le profil. | Modélise la maturité de gestion de données (radar PME). |
| **Remote** | `/api/v2/beneficiaries/:id` | Clé `maturityRemote`. | Télétravail, connectivité et infrastructure cloud. |
| **Business** | `/api/v2/beneficiaries/:id` | Clé `maturityBusiness`. | Modélise la durabilité et l'économie circulaire de l'entreprise. |
| **Ecosystem** | `/api/v2/beneficiaries/:id` | Clé `maturityEcosystem`. | Capacité de collaboration avec les pôles régionaux. |
| **Skills** | `/api/v2/beneficiaries/:id` | Clé `maturitySkills`. | Besoins en upskilling, formation continue. |
| **Technology** | `/api/v2/beneficiaries/:id` | Clé `maturityTechnology`. | Adoption des technologies avancées (IA et Cybersécurité). |

### Règle de calcul et de transition en lecture/écriture (Sprint 4.2) :
Pendant la phase de transition et pour conserver la compatibilité V10, le serveur convertira les champs de maturité comme suit :
* **Technology** : `maturityTechnology` sera calculé en lecture comme la moyenne de `maturityIa` et `maturityCyber`.
* **Data** : `maturityData` sera mappé directement sur la colonne `maturityDigital`.
* **Business** : `maturityBusiness` sera mappé directement sur la colonne `maturityDurability`.
Les requêtes PATCH d'écriture sur `/api/beneficiaries` mettront à jour automatiquement les colonnes legacy (`maturityDigital`, `maturityDurability`, etc.) pour maintenir la cohérence des radars V10.

---

## 🔄 6. Stratégie de Double-Écriture (Dual-Write)

Pour garantir que les clients V10 existants continuent de fonctionner sans rupture, les transactions d'écriture sur les anciennes routes V1 répercuteront immédiatement les données dans les tables vNext correspondantes :

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
| `GET /api/services` | `/api/v2/services` | **ADAPT** | Modifié en interne pour lire/lier les nouvelles capabilités, mais retourne le format V1 pour la V10. |
| `GET /api/meta` | `/api/v2/meta` | **ADAPT** | Fusionne les taxonomies legacy et vNext en lecture pour les cockpits V10. |
| `GET /api/journeys` | `/api/v2/journeys` | **DEPRECATE** | Redirigé temporairement vers les nouveaux endpoints. |
| `GET /api/action-instances` | `/api/v2/actions` | **DEPRECATE** | Remplacé par Actions. V1 maintenu via Dual-Write. |
| `GET /api/service-deliveries` | `/api/v2/activities` | **DEPRECATE** | Remplacé par Activities. V1 maintenu via Dual-Write. |
| `GET /api/collective-deliveries` | `/api/v2/activities` | **DEPRECATE** | Remplacé par Activities. V1 maintenu via Dual-Write. |
| `GET /api/second-line-missions` | `/api/v2/activities` | **DEPRECATE** | Remplacé par Activities. V1 maintenu. |
| *Aucun* | `/api/v2/programs` | **KEEP** | Nouveau dans la v2. |
| *Aucun* | `/api/v2/projects` | **KEEP** | Nouveau dans la v2. |
| *Aucun* | `/api/v2/business-events` | **KEEP** | Nouveau dans la v2 (Standard CPSV-AP). |
| *Aucun* | `/api/v2/life-events` | **KEEP** | Nouveau dans la v2 (Standard CPSV-AP). |
| `GET /api/territories` | `/api/v2/territories` | **ADAPT** | Migré vers l'API v2 avec standard de réponse et pagination. |
| `GET /api/ecosystems` | `/api/v2/ecosystems` | **ADAPT** | Migré vers l'API v2 avec format unifié. |

---

## 🏛️ 8. API Governance (API Design Principles)

1. **API First** : La structure des contrats d'API (formats d'entrée/sortie et codes HTTP) doit être documentée avant d'implémenter les contrôleurs ou les accès aux données.
2. **Backward Compatibility** : Tout changement dans l'API ne doit pas casser les clients existants. Utilisation de versioning clair (`/api/v2`) et de double-écriture pour assurer la continuité.
3. **Taxonomy Driven** : Les réponses d'API doivent directement refléter les concepts validés du modèle PIT (W3C ORG, CPSV-AP, S3).
4. **Pagination Obligatoire** : Aucun endpoint de type collection ne doit renvoyer un tableau brut sans pagination. Le format `meta` (page, pageSize, total) est obligatoire.
5. **Filtrage et Tri Standardisés** : Utilisation uniforme des paramètres de requête `sortBy`, `sortOrder`, et de filtres typés.
6. **Documentation OpenAPI** : Structurer le code pour pouvoir extraire automatiquement une documentation OpenAPI (Swagger).

---

## 🧪 9. Plan de Vérification Technique

### Tests d'Intégration API
Création du script `/scratch/test_api_vnext.ts` pour automatiser la validation :
* **Vérification double-écriture** : Écriture sur `/api/action-instances` ➔ vérification de l'existence de la ligne correspondante dans `actions` en base de données.
* **Vérification de structure** : Requêter `/api/v2/programs` et valider que la réponse est paginée et encapsulée dans la clé `"data"`.
* **TypeScript Gate** : Exécution de `npx tsc --noEmit` à la racine et dans `cpsv-ap-app`.

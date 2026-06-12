# 🚀 Plan d'Implémentation — API Core & Compatibilité V10 (Sprint 4.2)

## Référence : PIT_CORE_API_IMPLEMENTATION_PLAN_v2.1.0

Ce document définit la stratégie, la structure des points d'accès (endpoints REST) et la gouvernance technique pour l'implémentation de la couche d'API Core (vNext) au sein du serveur Express (`src/server.ts`), tout en assurant une compatibilité ascendante pour l'application cliente V10.

---

## ❓ Questions Ouvertes / Cadrage Validé

> [!NOTE]
> - **Versioning Global** : L'Option A (`/api/v2/...`) est adoptée. Toutes les nouvelles routes Core s'inscriront sous ce préfixe.
> - **DELETE = 0** : Aucun drop physique en base. Les endpoints V1 dépréciés écriront de manière synchrone dans les tables vNext via un double-écriture (Dual-Write) ciblé.

---

## 📅 Historique des versions
* **v1.X.X** : Cadrage architectural (Sprints 0 à 4.0).
* **v2.0.0** : Première version du plan d'API Core (Action/Activity/Capability/Challenge/S3).
* **v2.1.0** (Actuelle) : Compléments majeurs du modèle métier (Service APIs, Journey APIs, ValueChainStage APIs, Taxonomy APIs, OpenAPI Strategy, et matrices de couverture PIT, CPSV et DR-BEST).

---

## 🛠️ 1. Modifications Proposées (`src/server.ts`)

### A. Service APIs (CPSV-AP Pivot)
- **`GET /api/v2/services`** :
  - *Description* : Liste les services publics (CPSV-AP).
  - *Pagination* : `page` (défaut 1), `pageSize` (défaut 10).
  - *Filtrage* : `organizationId` (Int), `interventionLevelId` (Int).
  - *Tri/Recherche* : Recherche textuelle via paramètre `q`. Tri par `name` (ASC/DESC).
  - *Relations incluses* : `capabilitiesNew` (Capabilités), `journeys` (Parcours associés), `filieresS3` (Filières S3).
- **`GET /api/v2/services/:id`** : Renvoie le détail d'un service avec toutes ses relations (Requirement, Evidence, Output, Cost, Channel).
- **`POST /api/v2/services`** : Crée un nouveau service public.
- **`PATCH /api/v2/services/:id`** : Met à jour un service public.

### B. Journey APIs
- **`GET /api/v2/journeys`** :
  - *Description* : Liste les modèles de parcours.
  - *Relations incluses* : `services` (via stages), `challenges`, `ecosystems`, `territories`.
  - *Pagination/Recherche* : `page`, `pageSize`, recherche textuelle `q`.
- **`GET /api/v2/journeys/:id`** : Détail d'un parcours avec ses étapes (`stages`) ordonnées.
- **`POST /api/v2/journeys`** : Crée un nouveau modèle de parcours.
- **`PATCH /api/v2/journeys/:id`** : Met à jour le parcours.

### C. ValueChainStage APIs (Strategic Domain)
- **`GET /api/v2/value-chain-stages`** : Liste tous les maillons. Filtre par `valueChainId`, `category`.
- **`GET /api/v2/value-chain-stages/:id`** : Renvoie un maillon spécifique.
- **`POST /api/v2/value-chain-stages`** : Crée un maillon.
- **`PATCH /api/v2/value-chain-stages/:id`** : Modifie un maillon.

### D. Centralisation des Taxonomies (Taxonomy APIs)
- **`GET /api/v2/taxonomies`** : Renvoie la liste de toutes les taxonomies disponibles.
- **`GET /api/v2/taxonomies/drbest`** : Renvoie la définition des dimensions DR-BEST (Data, Remote, Business, Ecosystem, Skills, Technology).
- **`GET /api/v2/taxonomies/capabilities`** : Renvoie l'arbre complet des capabilités.
- **`GET /api/v2/taxonomies/challenges`** : Renvoie les défis catégorisés.
- **`GET /api/v2/taxonomies/s3`** : Renvoie l'alignement S3 complet (S3Domain -> ValueChain -> ValueChainStage).
- **`GET /api/v2/taxonomies/territories`** : Renvoie l'arborescence des territoires wallons.
- **`GET /api/v2/taxonomies/ecosystem-types`** : Liste les types d'écosystèmes.
- **`GET /api/v2/taxonomies/intervention-types`** : Liste les types d'interventions.
- **`GET /api/v2/taxonomies/organization-roles`** : Liste les rôles des organisations (Coordinateur, Partenaire...).

---

## 📜 2. OpenAPI / Swagger Strategy

Toutes les routes de l'API v2 seront documentées et accessibles aux tiers et intégrateurs.

1. **Génération OpenAPI JSON** :
   - Route : **`GET /api/v2/openapi.json`**
   - Implémentation : Utilisation de `swagger-jsdoc` pour générer dynamiquement la spécification OpenAPI v3 sur base des commentaires JSDoc annotés sur les contrôleurs de routes dans `src/server.ts`.
2. **Interface Interactive** :
   - Route : **`/api/v2/docs`** (ou `/api/v2/swagger`)
   - Implémentation : Rendu de l'UI interactive Swagger via le middleware `swagger-ui-express`.
3. **Génération de Types TypeScript** :
   - Déploiement d'un script post-build `npm run generate-api-types` utilisant `openapi-typescript` pour générer automatiquement les interfaces TypeScript typées destinées au frontend `cpsv-ap-app`.

---

## 🎯 3. Matrice de Couverture du Modèle PIT Core

Cette matrice vérifie que toutes les entités du Core Domain disposent d'un point d'accès API v2 dédié :

| Entité PIT | API Exposée | Statut |
| :--- | :--- | :---: |
| **`Program`** | `GET/POST/PATCH /api/v2/programs` | **EXPOSÉ** |
| **`Project`** | `GET/POST/PATCH /api/v2/projects` | **EXPOSÉ** |
| **`Action`** | `GET/POST/PATCH /api/v2/actions` | **EXPOSÉ** |
| **`Activity`** | `GET/POST/PATCH /api/v2/activities` | **EXPOSÉ** |
| **`Challenge`** | `GET/POST /api/v2/challenges` | **EXPOSÉ** |
| **`Capability`** | `GET/POST /api/v2/capabilities` | **EXPOSÉ** |
| **`Service`** | `GET/POST/PATCH /api/v2/services` | **EXPOSÉ** |
| **`Journey`** | `GET/POST/PATCH /api/v2/journeys` | **EXPOSÉ** |
| **`BusinessEvent`** | `GET/POST /api/v2/business-events` | **EXPOSÉ** |
| **`LifeEvent`** | `GET/POST /api/v2/life-events` | **EXPOSÉ** |
| **`Territory`** | `GET/POST /api/v2/territories` | **EXPOSÉ** |
| **`Ecosystem`** | `GET/POST /api/v2/ecosystems` | **EXPOSÉ** |
| **`S3Domain`** | `GET/POST /api/v2/s3-domains` | **EXPOSÉ** |
| **`ValueChain`** | `GET/POST /api/v2/value-chains` | **EXPOSÉ** |
| **`ValueChainStage`** | `GET/POST/PATCH /api/v2/value-chain-stages` | **EXPOSÉ** |

---

## 🇪🇺 4. Matrice de Couverture CPSV-AP

Audit d'alignement des endpoints API v2 par rapport aux concepts CPSV-AP européens :

| Concept CPSV-AP | Endpoint V2 Associé | Couverture | Rationale / Précisions |
| :--- | :--- | :---: | :--- |
| **`PublicService`** | `/api/v2/services` | **Présent** | API REST complète avec gestion des relations fortes. |
| **`BusinessEvent`** | `/api/v2/business-events` | **Présent** | Déclencheur métier de recherche d'aides. |
| **`LifeEvent`** | `/api/v2/life-events` | **Présent** | Déclencheur de cycle de vie de l'entreprise. |
| **`Channel`** | `/api/v2/taxonomies/channels` | **Partiel** | Retourné sous forme imbriquée dans les services. |
| **`Requirement`** | *N/A (Imbriqué)* | **Partiel** | Retourné et géré dans le payload d'un service individuel. |
| **`Evidence`** | *N/A (Imbriqué)* | **Partiel** | Livré comme preuve liée à un diagnostic ou une activité. |
| **`Output`** | *N/A (Imbriqué)* | **Partiel** | Géré directement sous forme de relation dans `/services`. |
| **`Rule`** | *N/A (Imbriqué)* | **Différé** | Les règles d'éligibilité seront unifiées au Sprint 5 (Scoring). |
| **`TargetAudience`** | `/api/v2/taxonomies/target-audiences` | **Partiel** | Liste des publics cibles disponibles pour filtres. |
| **`CompetentAuthority`** | `/api/v2/ecosystems` / `organizations` | **Partiel** | Mappé sur le champ `ownerOrganization` des services. |

---

## 📈 5. Matrice de Couverture DR-BEST

Le modèle de diagnostic sémantique de maturité s'appuie sur les 6 dimensions du référentiel **DR-BEST** :

| Dimension DR-BEST | Endpoint Exposé | Mode de Récupération | Usages & Intégration |
| :--- | :--- | :--- | :--- |
| **Data** | `/api/v2/beneficiaries/:id` | Clé `maturityData` dans le profil bénéficiaire. | Permet d'alimenter le graphique en radar de l'UI PME. |
| **Remote** | `/api/v2/beneficiaries/:id` | Clé `maturityRemote`. | Utilisé pour le calcul d'éligibilité au télétravail. |
| **Business** | `/api/v2/beneficiaries/:id` | Clé `maturityBusiness`. | Utilisé pour mesurer l'intégration de la circularité. |
| **Ecosystem** | `/api/v2/beneficiaries/:id` | Clé `maturityEcosystem`. | Mesure l'adhérence aux pôles régionaux. |
| **Skills** | `/api/v2/beneficiaries/:id` | Clé `maturitySkills`. | Identifie les besoins de upskilling/formations. |
| **Technology** | `/api/v2/beneficiaries/:id` | Clé `maturityTechnology`. | Mesure l'adoption de l'IA et de la cybersécurité. |

### Note d'implémentation de la Maturité (Sprint 4.2) :
Pendant la phase de transition (Sprint 4.2), le serveur effectuera la conversion en lecture :
- `maturityTechnology` calculé comme moyenne de `maturityIa` et `maturityCyber`.
- `maturityData` mapped sur `maturityDigital`.
- `maturityBusiness` mapped sur `maturityDurability`.
Les requêtes PATCH d'écriture sur `/api/beneficiaries` mettront à jour automatiquement les colonnes legacy pour préserver les radars V10 existants.

---

## 🔄 6. Stratégie de Double-Écriture (Dual-Write)

| Endpoint Legacy V1 | Utilisé par l'UI V10 | Dual Write requis | Action Serveur (Sync v2) |
| :--- | :---: | :---: | :--- |
| `POST /api/action-instances` | **Oui** | **Oui** | Crée une ligne correspondante dans `actions` liée au `Project`. |
| `PATCH /api/action-instances/:id` | **Oui** | **Oui** | Met à jour le statut dans la table `actions`. |
| `POST /api/service-deliveries` | **Oui** | **Oui** | Insère dans `activities` (Type: `INDIVIDUAL`, `serviceId`, `beneficiaryId`, `operatorId`). |
| `POST /api/collective-deliveries` | **Oui** | **Oui** | Insère dans `activities` (Type: `COLLECTIVE`). |
| `POST /api/beneficiaries` / `companies` | **Oui** | **Oui** | Maintient en écriture les 5 colonnes de maturité legacy de `Beneficiary`. |

---

## ⚖️ 7. Matrice de Compatibilité API V1 vs V2

| Endpoint Legacy (V1) | Endpoint Cible (V2) | Statut Applicatif | Rationale |
| :--- | :--- | :---: | :--- |
| `GET /api/services` | `/api/v2/services` | **ADAPT** | Modifié en interne pour lire/lier les nouvelles capabilités, mais retourne le format V1. |
| `GET /api/meta` | `/api/v2/meta` | **ADAPT** | Fusionne les taxonomies legacy et vNext en lecture pour les cockpits V10. |
| `GET /api/journeys` | `/api/v2/journeys` (alias) | **DEPRECATE** | Redirigé temporairement vers les nouveaux endpoints. |
| `GET /api/action-instances` | `/api/v2/actions` | **DEPRECATE** | Remplacé par Actions. V1 maintenu en lecture/écriture via Dual-Write. |
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

Les principes de gouvernance applicables à l'ensemble du développement des API de la PIT sont définis comme suit :

1. **API First** : La structure des contrats d'API (formats d'entrée/sortie et codes HTTP) doit être gelée et documentée avant d'implémenter les contrôleurs ou les accès aux données.
2. **Backward Compatibility** : Tout changement dans l'API ne doit pas casser les clients existants. Utilisation de versioning clair (`/api/v2`) et de double-écriture pour assurer la continuité.
3. **Taxonomy Driven** : Les réponses d'API doivent directement refléter les concepts validés du modèle PIT (W3C ORG, CPSV-AP, S3).
4. **Pagination Obligatoire** : Aucun endpoint de type collection ne doit renvoyer un tableau brut sans pagination. Le format `meta` (page, pageSize, total) est obligatoire.
5. **Filtrage et Tri Standardisés** : Utilisation uniforme des paramètres de requête `sortBy`, `sortOrder`, et de filtres typés.
6. **Documentation OpenAPI** : Structurer le code pour pouvoir extraire automatiquement une documentation OpenAPI (Swagger).

---

## 🧪 9. Plan de Vérification Technique

### Tests d'Intégration API
Création du script `/scratch/test_api_vnext.ts` pour automatiser la validation :
- **Vérification double-écriture** : Écriture sur `/api/action-instances` ➔ vérification de l'existence de la ligne correspondante dans `actions` en base de données.
- **Vérification de structure** : Requêter `/api/v2/programs` et valider que la réponse est paginée et encapsulée dans la clé `"data"`.
- **TypeScript Gate** : Exécution de `npx tsc --noEmit` à la racine et dans `cpsv-ap-app`.

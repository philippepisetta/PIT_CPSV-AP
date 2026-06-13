# DIAGNOSTIC DE VISIBILITÉ DES DONNÉES COCKPITS (FINAL)

Ce rapport documente l'audit différentiel complet de l'application PIT pour identifier pourquoi certains cockpits (Programs, Capabilities, S3, Beneficiaries, Ecosystems) restent vides en production alors que Services et Journeys fonctionnent, et valide le comportement de la base de données et de l'API.

---

## ETAPE 1 – VERIFICATION REELLE DE LA BASE DE DONNEES

Les requêtes de comptage direct (`COUNT(*)`) ont été exécutées via Prisma sur la base de données PostgreSQL de production (Supabase). Toutes les tables contiennent des données métier valides :

| Table | Count |
| :--- | :---: |
| **Program** | 8 |
| **Project** | 5 |
| **Action** | 13 |
| **Activity** | 6 |
| **Challenge** | 10 |
| **Capability** | 5 |
| **Service** (PublicService) | 7 |
| **Journey** | 2 |
| **Beneficiary** | 7 |
| **Organization** | 8 |
| **Territory** | 11 |
| **Ecosystem** | 4 |
| **S3Domain** | 5 |
| **ValueChain** | 9 |
| **ValueChainStage** | 19 |

**Conclusion de l'étape 1** : Les données existent bien physiquement dans la base de données. Le problème ne vient pas d'un manque de données ou d'un échec de seeding global.

---

## ETAPE 2 – VERIFICATION DES ENDPOINTS V2 (LOCAL VS PRODUCTION)

Les tests d'appels HTTP GET ont été exécutés sur le serveur de développement local (port 3001) et sur l'URL du serveur de production sur Render (`https://pit-cpsv-ap.onrender.com`) :

| Endpoint | Status (Local) | Count (Local) | Temps (Local) | Status (Production) | Count (Production) | Payload Réel (Production) |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| `GET /api/v2/programs` | 200 | 8 | ~600 ms | **404** | 0 | `Cannot GET /api/v2/programs` |
| `GET /api/v2/capabilities` | 200 | 5 | ~57 ms | **404** | 0 | `Cannot GET /api/v2/capabilities` |
| `GET /api/v2/s3-domains` | 200 | 5 | ~104 ms | **404** | 0 | `Cannot GET /api/v2/s3-domains` |
| `GET /api/v2/beneficiaries` | 200 | 7 | ~156 ms | **404** | 0 | `Cannot GET /api/v2/beneficiaries` |
| `GET /api/v2/ecosystems` | 200 | 4 | ~105 ms | **404** | 0 | `Cannot GET /api/v2/ecosystems` |
| `GET /api/v2/journeys` | 200 | 2 | ~255 ms | **404** | 0 | `Cannot GET /api/v2/journeys` |
| `GET /api/v2/services` | 200 | 7 | ~208 ms | **404** | 0 | `Cannot GET /api/v2/services` |

*Note: En production, seul l'ancien endpoint `/api/services` (v1) répond avec 200 OK (7 services).*

**Conclusion de l'étape 2** : Les endpoints v2 fonctionnent parfaitement en local, mais retournent systématiquement des erreurs **404 Cannot GET** en production. Le code exposé en production ne contient pas le routeur `v2Router` monté sur `/api/v2`.

---

## ETAPE 3 – COMPARAISON SERVICES VS AUTRES (HOOKS FRONT-END)

Comparaison des hooks front-end définis dans [useV2Queries.ts](file:///c:/Users/Philippe%20Pisetta/Downloads/testing%20CPSV-AP/cpsv-ap-app/src/hooks/useV2Queries.ts) avec `useV2Services` :

| Hook | Attendu | Reçu | OK/KO | Commentaire |
| :--- | :--- | :--- | :---: | :--- |
| `useV2Services()` | `{ data: Array, meta: Object }` | `{ data: Array, meta: Object }` | **OK** | Format enveloppé par `sendCollection()` |
| `useV2Journeys()` | `{ data: Array, meta: Object }` | `{ data: Array, meta: Object }` | **OK** | Format enveloppé par `sendCollection()` |
| `useV2Programs()` | `{ data: Array, meta: Object }` | `{ data: Array, meta: Object }` | **OK** | Format enveloppé par `sendCollection()` |
| `useV2Capabilities()` | `{ data: Array }` | `{ data: Array }` | **OK** | Format plat enveloppé `{ data: list }` |
| `useV2S3Domains()` | `{ data: Array }` | `{ data: Array }` | **OK** | Format plat enveloppé `{ data: list }` |
| `useV2Beneficiaries()` | `{ data: Array, meta: Object }` | `{ data: Array, meta: Object }` | **OK** | Format enveloppé par `sendCollection()` |
| `useV2Ecosystems()` | `{ data: Array }` | `{ data: Array }` | **OK** | Format plat enveloppé `{ data: list }` |

**Conclusion de l'étape 3** : Les hooks TanStack Query appellent les bonnes URLs et s'attendent à la bonne structure JSON locale. Le mapping est correct.

---

## ETAPE 4 – VERIFIER LES FILTRES CLIENT-SIDE / SERVER-SIDE

Vérification des filtres appliqués par défaut dans les conteneurs de cockpits :

| Cockpit | Filtre | Effet |
| :--- | :--- | :--- |
| **Programs** | `page`, `pageSize`, `q` (recherche), `s3Domain`, `drbest` | Par défaut, aucun filtre n'est imposé. Les requêtes vides retournent l'intégralité des 8 programmes. |
| **Capabilities** | Filtrage local (`searchQuery`, `selectedType`) | Aucun paramètre de filtrage envoyé au serveur, tout est extrait puis filtré côté client. |
| **S3** | Liaison et filtrage local sur les trois colonnes | Les trois colonnes se synchronisent par filtrage client sur les relations. Pas de filtre serveur limitatif. |
| **Beneficiaries** | Filtrage local (`searchQuery` sur nom/localisation) | Pas de filtre restrictif sur l'API, chargement complet puis filtre client. |
| **Ecosystems** | Filtrage local (`searchQuery`) | Aucun filtre serveur. |

**Conclusion de l'étape 4** : Les données ne sont pas masquées par des filtres implicites ou restrictifs côté client ou serveur.

---

## ETAPE 5 – VERIFICATION DES MODELES PRISMA

Vérification de l'alignement entre les endpoints V2 et les modèles Prisma générés :

| Endpoint | Prisma | Table | OK/KO |
| :--- | :--- | :--- | :---: |
| `/api/v2/programs` | `prisma.program` | `programs` | **OK** |
| `/api/v2/capabilities` | `prisma.capability` | `capabilities` | **OK** |
| `/api/v2/s3-domains` | `prisma.s3Domain` | `s3_domains` | **OK** |
| `/api/v2/beneficiaries` | `prisma.beneficiary` | `beneficiaries` | **OK** |
| `/api/v2/ecosystems` | `prisma.ecosystem` | `ecosystems` | **OK** |

**Conclusion de l'étape 5** : Tous les endpoints utilisent les modèles Prisma officiels mappés sur les bonnes tables physiques.

---

## ETAPE 6 – VERIFICATION DE L'ETAT DU FRONT-END (EN PRODUCTION)

Pour chaque cockpit vide en production (Programs, Capabilities, S3, Beneficiaries, Ecosystems) :

*   **Réponse API reçue** : Erreur HTTP `404 Not Found` (HTML retournant `Cannot GET /api/v2/...`).
*   **`query.data`** : `undefined`.
*   **`query.error`** : `Error: Failed to fetch data from /api/v2/...` (capturé par le fetcher front-end).
*   **`query.isSuccess`** : `false`.
*   **`query.isLoading`** : `false` (après échec de la requête).

**Conclusion de l'étape 6** : Le front-end tente correctement de charger les données mais bascule en état d'erreur en raison des 404 renvoyés par Render.

---

## ETAPE 7 – CAUSE RACINE DU PROBLEME EN PRODUCTION

| Cockpit | Cause exacte |
| :--- | :--- |
| **Programs** | **Mauvaise URL API** : Le serveur Render de production renvoie une erreur 404 car il exécute l'ancienne image Docker/Build de production (sans `/api/v2/*`). |
| **Capabilities** | **Mauvaise URL API** : Idem. |
| **S3** | **Mauvaise URL API** : Idem. |
| **Beneficiaries** | **Mauvaise URL API** : Idem. |
| **Ecosystems** | **Mauvaise URL API** : Idem. |

---

## ETAPE 8 – HOTFIX MINIMAL ET CONFIGURATION

Le problème provient du fait que le serveur Render n'a pas pu démarrer avec le nouveau code lors des derniers déploiements à cause d'une **saturation mémoire (OOM) / Exit Status 134** au démarrage. La compilation en temps réel par `ts-node` consomme plus de 400 Mo, dépassant la limite gratuite de Render de 512 Mo.

### Correctif apporté à [package.json](file:///c:/Users/Philippe%20Pisetta/Downloads/testing%20CPSV-AP/package.json) :

```diff
-   "start": "ts-node src/server.ts",
+   "build": "tsc",
+   "start": "node dist/src/server.js",
+   "dev": "ts-node src/server.ts",
```

### Configuration Render requise pour le déploiement :
1.  **Build Command** : `npm install && npm run build` (génère les fichiers JS dans `/dist`).
2.  **Start Command** : `npm start` (exécute `node dist/src/server.js`, consommant seulement **56 Mo de RAM**, soit **86% de réduction**).

---

## ETAPE 9 – PLAN DE VALIDATION

Une fois le correctif poussé et déployé sur Render :
1.  Vérifier que les endpoints `/api/v2/programs`, `/api/v2/capabilities`, etc., répondent avec un statut `200 OK` et retournent les payloads JSON correspondants.
2.  Vérifier visuellement sur Vercel que les tableaux de bord se remplissent instantanément.

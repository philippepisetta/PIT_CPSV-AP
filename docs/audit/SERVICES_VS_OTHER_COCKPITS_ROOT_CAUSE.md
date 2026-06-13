# 🔍 RAPPORT D'AUDIT COMPARATIF ET DE CAUSE RACINE
## SERVICES OK, TOUS LES AUTRES COCKPITS KO EN PRODUCTION

Ce rapport présente une analyse différentielle rigoureuse visant à déterminer pourquoi le cockpit `/services` fonctionne correctement en production en affichant les données attendues, tandis que tous les autres cockpits (`/programs`, `/capabilities`, `/s3`, `/ecosystems`, `/beneficiaries`, `/journeys`) restent désespérément vides ou bloqués.

---

### 🏛️ ETAPE 1 – COMPARAISON COMPLETE DES CONTAINERS ET PAGES

Nous avons comparé en détail la logique d'acquisition de données et d'IHM du cockpit `/services` avec celle des autres cockpits et pages.

| Cockpit | Hook utilisé | Endpoint appelé | Mapping de données | Gestion Loading | Gestion Error | Gestion Empty State |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Services** | Pas de Hook principal (fetch manuel via `useEffect`), `useV2Contributions` pour le détail | `/api/services` (v1) et `/api/v2/services/{id}/contributions` | Combine les données reçues de l'API avec les 10 `walloonServices` codés en dur | Initialisation synchrone directe (pas de spinner bloquant) | Bloc `catch` silencieux qui conserve le mock `walloonServices` | Rendu de la liste `walloonServices` par défaut |
| **Programs** | `useV2Programs`, `useV2ProgramDetail`, `useV2ProgramProjects`, etc. | `/api/v2/programs`, `/api/v2/programs/{id}`, etc. | Mappe directement `programsData?.data` | Squelette de chargement (`animate-pulse`) | Aucune gestion de `isError` | Affiche "Aucun programme ne correspond..." |
| **Capabilities** | `useV2Capabilities`, `useV2Services`, `useV2Journeys`, `useV2Challenges`, etc. | `/api/v2/capabilities` | Mappe directement `capData?.data` | Squelette de chargement | Aucune gestion de `isError` | Affiche "Aucune capabilité trouvée." |
| **S3** | `useV2S3Domains`, `useV2ValueChains`, `useV2ValueChainStages`, etc. | `/api/v2/s3-domains`, `/api/v2/value-chains`, etc. | Mappe `domainsData?.data`, `chainsData?.data`, `stagesData?.data` | Lignes de chargement pulse | Aucune gestion de `isError` | Messages d'invitation à sélectionner un domaine/maillon |
| **Beneficiaries** | `useV2Beneficiaries`, `useV2BeneficiaryDetail`, etc. | `/api/v2/beneficiaries` | Mappe directement `beneficiariesData?.data` | Squelette de chargement | Aucune gestion de `isError` | Affiche "Aucun bénéficiaire ne correspond..." |
| **Ecosystems** | `useV2Ecosystems`, `useV2EcosystemDetail` | `/api/v2/ecosystems` | Mappe directement `ecosystemsData?.data` | Squelette de chargement | Aucune gestion de `isError` | Affiche "Aucun écosystème ne correspond..." |
| **Journeys** | `useJourneysQuery`, `useMetaQuery`, `useBeneficiariesQuery`, `useJourneyEnrollmentsQuery` | `/api/journeys` (v1), `/api/meta` (v1), `/api/beneficiaries`, `/api/journey-enrollments` | Mappe directement les tableaux retournés | Spinner plein écran si `isLoading` est vrai | Aucune gestion de `isError` | Bloqué par l'état `isLoading` infini |

---

### 🔌 ETAPE 2 – COMPARAISON DES HOOKS

L'analyse de la structure de récupération réseau montre des différences architecturales majeures :

1. **Mécanisme d'acquisition** :
   - Le cockpit `/services` appelle l'API **v1** via un appel `fetch("/api/services")` standard de Next.js.
   - Les cockpits `/programs`, `/capabilities`, `/s3`, `/ecosystems` et `/beneficiaries` utilisent des hooks TanStack Query personnalisés de **v2** (ex: `useV2Programs`), appelant des endpoints `/api/v2/...`
   - Le cockpit `/journeys` utilise des hooks TanStack Query de **v1** (ex: `useJourneysQuery` interrogeant `/api/journeys`, et `useMetaQuery` interrogeant `/api/meta`).

2. **Différence de structure de Payload JSON** :
   - **API v1 (Next.js serverless local)** : Retourne un tableau JSON brut `[...]` (ex: `[ { id: 14, name: "Coordination EDIH Wallonia", ... } ]`).
   - **API v2 (Backend Express déporté)** : Retourne un objet JSON enveloppé contenant les métadonnées de pagination `{ data: [...], meta: { page: 1, total: X, ... } }`.

3. **Différence de comportement en Production** :
   - **API v1** : Fonctionne à 100% car elle s'exécute directement sur Vercel via la route Next.js catch-all `/api/[...path]/route.ts`.
   - **API v2** : Échoue à 100% avec des erreurs HTTP 404. La réécriture configurée dans [next.config.ts](file:///c:/Users/Philippe%20Pisetta/Downloads/testing%20CPSV-AP/cpsv-ap-app/next.config.ts) redirige toutes les requêtes `/api/v2/*` vers le backend Render (`https://pit-cpsv-ap.onrender.com`). Or, ce backend exécute une version obsolète (commit datant du 10 juin 2026) n'intégrant pas encore les routes v2.

---

### 🧪 ETAPE 3 – TEST DES ENDPOINTS REELS EN PRODUCTION

Les requêtes curl directes sur le serveur de production confirment la panne différentielle :

| Endpoint | HTTP Status | Count | Structure JSON / Réponse reçue |
| :--- | :---: | :---: | :--- |
| `GET /api/services` (v1) | **200 OK** | 7 | Tableau JSON brut `[{"id": 14, ...}]` |
| `GET /api/v2/services` | **404 Not Found** | 0 | Code HTML : `Cannot GET /api/v2/services` |
| `GET /api/v2/programs` | **404 Not Found** | 0 | Code HTML : `Cannot GET /api/v2/programs` |
| `GET /api/v2/capabilities` | **404 Not Found** | 0 | Code HTML : `Cannot GET /api/v2/capabilities` |
| `GET /api/v2/s3-domains` | **404 Not Found** | 0 | Code HTML : `Cannot GET /api/v2/s3-domains` |
| `GET /api/v2/ecosystems` | **404 Not Found** | 0 | Code HTML : `Cannot GET /api/v2/ecosystems` |
| `GET /api/v2/beneficiaries` | **404 Not Found** | 0 | Code HTML : `Cannot GET /api/v2/beneficiaries` |
| `GET /api/v2/journeys` | **404 Not Found** | 0 | Code HTML : `Cannot GET /api/v2/journeys` |

---

### 📊 ETAPE 4 – COMPARAISON DES PAYLOADS

1. **Services (v1)** :
   - Payload : `[ { "id": 14, "name": "...", "organization": { "name": "..." }, ... } ]`
   - Compatibilité : Parfaitement aligné avec `ServicesContainer.tsx` qui convertit les ID en chaîne et combine avec `walloonServices` de secours.
2. **Cockpits v2** :
   - Payloads attendus : `{ "data": [...], "meta": { "page": 1, "total": 10 } }`
   - Payloads reçus en production : Aucun (HTML 404 d'Express). L'incompatibilité est totale : le parser JSON lève une erreur réseau et TanStack Query reçoit un statut d'erreur. Les conteneurs n'ayant pas de repli local (fallbacks), l'IHM s'affiche vide.

---

### 📡 ETAPE 5 – VALEURS TANSTACK QUERY EN PRODUCTION

Pour chaque cockpit KO en production, voici les valeurs réelles des variables d'état de TanStack Query :

*   **Programs, Capabilities, S3, Beneficiaries, Ecosystems** :
    - `query.isLoading` : `false` (requête terminée/échouée)
    - `query.isError` : `true` (erreur réseau provoquée par le 404)
    - `query.error` : `Error: Failed to fetch data from /api/v2/...`
    - `query.data` : `undefined`
*   **Journeys** :
    - `query.isLoading` : `true` (bloqué sur le chargement initial en raison des tentatives infinies/retries de TanStack Query sur l'API `/api/meta` défaillante).
    - `query.isError` : `true` (en arrière-plan suite à l'épuisement des connexions de la base).
    - `query.error` : `Error: Failed to fetch data from /api/meta` (Timeout 504 Vercel ou Erreur 500 PgBouncer).
    - `query.data` : `undefined`

---

### 🧭 ETAPE 6 – ANALYSE DU CAS JOURNEYS (CHARGEMENT INFINI)

Le cockpit Journeys fige l'IHM sur le message de chargement de manière indéfinie.

#### Causes Techniques Complètes :
1.  **Parallélisme massif de requêtes** : Le chargement de `/journeys` lance simultanément quatre requêtes Next.js distinctes : `/api/meta`, `/api/journeys`, `/api/beneficiaries` et `/api/journey-enrollments`.
2.  **Saturation du pool PgBouncer** : `/api/meta` tente de charger 42 tables Prisma dans 7 vagues asynchrones de 6 requêtes concurrentes. Dans un environnement serverless (Vercel), ces appels s'exécutent en parallèle, instanciant de multiples clients Prisma. Sans restriction, chaque client tente d'ouvrir plusieurs connexions sur le port `6543` de Supabase (PgBouncer en mode *Session*), ce qui sature immédiatement le pool limité à **15 connexions simultanées**.
3.  **Timeout & Crash** : Supabase rejette les connexions avec l'exception `EMAXCONNSESSION (max clients reached)`. Vercel renvoie une erreur 500 ou 504 (timeout de 10s dépassé pour les fonctions serverless Hobby).
4.  **Boucle de chargement React** : La variable `isLoading` dans `JourneysPage` est calculée ainsi :
    ```typescript
    const isLoading = loadingJourneys || loadingMeta || loadingBenefs || loadingEnrollments;
    ```
    Si une ou plusieurs requêtes échouent, TanStack Query effectue 3 tentatives (*retries*) successives espacées dans le temps, prolongeant le statut de chargement. De plus, **l'IHM ne gère pas le cas `isError` pour désactiver le spinner ou afficher un écran d'erreur**, ce qui bloque l'utilisateur de façon définitive.

---

### 🛠️ ETAPE 7 – ERREURS DETECTEES DANS LES DEVTOOLS

En ouvrant les DevTools en production, on observe les erreurs suivantes :

1.  **Console JS** :
    - `GET https://pit-cpsv-ap.vercel.app/api/v2/programs 404 (Not Found)`
    - `GET https://pit-cpsv-ap.vercel.app/api/v2/capabilities 404 (Not Found)`
    - `Uncaught (in promise) Error: Failed to fetch data from /api/v2/programs`
    - `Error: Failed to fetch data from /api/meta`
2.  **Network Tab** :
    - `/api/v2/programs` ➔ Statut `404` ➔ Type `text/html` (réponse `Cannot GET /api/v2/programs`).
    - `/api/meta` ➔ Statut `504 Gateway Timeout` ou `500 Internal Server Error`.
3.  **TanStack Query DevTools** :
    - Les requêtes v2 sont en statut `error` (avec 404 comme cause).
    - Les requêtes `/api/meta` passent de `fetching` à `error`, puis redémarrent le cycle de retry.

---

### 🎯 ETAPE 8 – MATRICE DE CAUSE RACINE

| Cockpit | Cause Exacte de l'Échec |
| :--- | :--- |
| **Programs** | **Version de build obsolète sur Render** : Render exécute un ancien commit (10 Juin) ne contenant pas l'API v2 (HTTP 404). L'IHM n'a aucun plan de secours (mock/fallback). |
| **Capabilities** | **Version de build obsolète sur Render** : Même cause (HTTP 404 sur `/api/v2/capabilities`). Absence de secours local. |
| **S3** | **Version de build obsolète sur Render** : Même cause (HTTP 404 sur `/api/v2/s3-domains`). Absence de secours local. |
| **Beneficiaries** | **Version de build obsolète sur Render** : Même cause (HTTP 404 sur `/api/v2/beneficiaries`). Absence de secours local. |
| **Ecosystems** | **Version de build obsolète sur Render** : Même cause (HTTP 404 sur `/api/v2/ecosystems`). Absence de secours local. |
| **Journeys** | **Saturation PgBouncer Supabase** : DATABASE_URL sur Vercel n'a pas de limiteur de connexion (`connection_limit=1`), provoquant le blocage instantané du pooler Supabase (15 connexions max) sous les appels asynchrones massifs de `/api/meta`. L'IHM n'a pas de gestionnaire d'erreur et fige le loader. |

---

### 🔧 ETAPE 9 – PLAN DE HOTFIX & RESOLUTION IMMEDIATE

#### 1. Rétablir le Serveur Render (API v2)
*   **Fichier / Configuration** : Dashboard Render ➔ Web Service `pit-cpsv-ap`.
*   **Bug** : Le déploiement automatique du commit `f0f6963` a échoué en production en raison d'erreurs de syntaxe TypeScript dans `src/server.ts` (accolade manquante et relation Prisma inexistante). Render a par conséquent conservé en ligne le build sain précédent (commit `632b1825`) n'intégrant pas la v2. Les commits correctifs ultérieurs (`d98af4bc` et `f9c595c9`) n'ont pas été déployés.
*   **Correction** : Déclencher un déploiement manuel (**"Manual Deploy"** ➔ **"Deploy latest commit"**) sur Render avec le dernier commit `f9c595c9`. Le code compile désormais parfaitement et mettra à disposition les routes v2 pour résoudre les 404.

#### 2. Débloquer la Saturation de la Base de Données (Vercel)
*   **Fichier / Configuration** : Variables d'environnement du projet `pit-cpsv-ap` sur le Dashboard Vercel.
*   **Bug** : `DATABASE_URL` n'impose pas de restriction sur le nombre de connexions ouvertes par conteneur Next.js, ce qui sature instantanément les 15 sessions autorisées par PgBouncer.
*   **Correction** : 
    1. Modifier la variable `DATABASE_URL` pour restreindre la taille du pool Prisma :
       *   *Ancienne valeur* : `postgresql://...:6543/postgres?pgbouncer=true`
       *   *Nouvelle valeur* : `postgresql://...:6543/postgres?pgbouncer=true&connection_limit=1`
    2. Créer une variable d'environnement **`DIRECT_URL`** pour bypasser PgBouncer lors des migrations :
       *   *Valeur* : `postgresql://...:5432/postgres` (Port direct de Supabase)
    3. Lancer un nouveau déploiement sur Vercel pour propager ces configurations.

#### 3. Sécuriser les Cockpits Frontend (Résilience IHM)
*   **Fichier** : [JourneysPage](file:///c:/Users/Philippe%20Pisetta/Downloads/testing%20CPSV-AP/cpsv-ap-app/src/app/journeys/page.tsx)
*   **Ligne** : Ligne 171 et 334.
*   **Bug** : La variable `isLoading` bloque l'interface sans vérifier les erreurs réseau. Si l'un des appels API échoue, le spinner tourne indéfiniment.
*   **Correction** : Intégrer les variables `isError` de TanStack Query pour afficher un bandeau d'erreur et désactiver le chargement infini si l'API est KO :
    ```typescript
    const { data: journeysData, isLoading: loadingJourneys, isError: errorJourneys } = useJourneysQuery();
    const { data: metaData, isLoading: loadingMeta, isError: errorMeta } = useMetaQuery();
    const { isLoading: loadingBenefs, isError: errorBenefs } = useBeneficiariesQuery();
    const { data: enrollmentsData, isLoading: loadingEnrollments, isError: errorEnrollments } = useJourneyEnrollmentsQuery();

    const isError = errorJourneys || errorMeta || errorBenefs || errorEnrollments;
    const isLoading = (loadingJourneys || loadingMeta || loadingBenefs || loadingEnrollments) && !isError;
    ```
    Afficher un message d'erreur si `isError` est vrai afin de permettre à l'utilisateur de voir l'IHM et éventuellement d'utiliser les données mockées de repli.

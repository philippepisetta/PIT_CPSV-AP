# AUDIT DE VALIDATION DES DONNÉES DE PRODUCTION & API (PIT)

## CONTEXTE & ANALYSE DU FLUX

Suite au déploiement en production, les cockpits PIT (Programs, Capabilities, S3, Ecosystems, Beneficiaries, Journeys) apparaissent vides ou bloqués. Ce rapport documente l'audit complet du flux de données :
$$\text{Prisma} \rightarrow \text{Base de données (Supabase)} \rightarrow \text{API v2 (Render)} \rightarrow \text{TanStack Query} \rightarrow \text{Interface Utilisateur (Vercel)}$$

---

## ETAPE 1 – INVENTAIRE DES DONNÉES (PRODUCTION)

L'inventaire réel de la base de données de production (récupéré via le script de diagnostic Prisma) montre que **les données existent bel et bien** dans la base Supabase :

| Entité | Nombre d'enregistrements en production |
|:---|:---:|
| **Programs** | 8 |
| **Projects** | 5 |
| **Actions** | 13 |
| **Activities** | 6 |
| **Challenges** | 10 |
| **Capabilities** | 5 |
| **Services** | 7 |
| **Journeys** | 2 |
| **Beneficiaries** | 7 |
| **Organizations** | 8 |
| **Territories** | 11 |
| **Ecosystems** | 4 |
| **S3Domains** | 5 |
| **ValueChains** | 9 |
| **ValueChainStages** | 19 |

> [!NOTE]
> Le nombre d'enregistrements présents en base montre que la base de données de production n'est pas vide et a été correctement initialisée.

---

## ETAPE 2 – VÉRIFICATION DES SEEDS

L'analyse de `prisma/seed.ts` et la comparaison avec l'inventaire de l'Étape 1 montre que le seed a été **prévu et exécuté à 100%** sur la base de données de production.

| Entité | Seed prévue | Seed exécutée | Statut / Constat |
|:---|:---:|:---:|:---|
| **Organizations** | Oui (8) | Oui (8) | Entièrement seedée (AdN, WE, AWEX, UCM, Sirris...) |
| **S3Domains** | Oui (5) | Oui (5) | Entièrement seedée |
| **ValueChains** | Oui (9) | Oui (9) | Entièrement seedée |
| **Ecosystems** | Oui (4) | Oui (4) | Entièrement seedée (EDIH, Digital Wallonia, BioWin, TWEED) |
| **Journeys** | Oui (2) | Oui (2) | Entièrement seedée |
| **Programs & Projects**| Oui | Oui | Entièrement seedée |

* **Seeds absentes / partielles / non déployées** : Aucun problème à ce niveau. La base de données contient le modèle métier PIT complet.

---

## ETAPE 3 – VÉRIFICATION API V2 (RENDER)

Les requêtes vers les endpoints de l'API v2 (hébergée sur Render à l'adresse `https://pit-cpsv-ap.onrender.com`) échouent toutes en **HTTP 404 (Not Found)** ou n'aboutissent pas (Timeout) :

| Endpoint | Status | Nb éléments | Erreur éventuelle / Constat |
|:---|:---:|:---:|:---|
| `/api/v2/programs` | **404** | 0 | API inaccessible (Serveur Render hors service ou en échec de build) |
| `/api/v2/capabilities` | **404** | 0 | Même cause |
| `/api/v2/s3-domains` | **404** | 0 | Même cause |
| `/api/v2/ecosystems` | **404** | 0 | Même cause |
| `/api/v2/beneficiaries` | **404** | 0 | Même cause |
| `/api/v2/journeys` | **404** | 0 | Même cause |

### Cause technique de la défaillance de l'API v2 (Render) :
Le serveur Express `src/server.ts` contient des **erreurs de compilation TypeScript majeures** qui bloquent le build et le démarrage de l'application sur la plateforme Render :

1. **Erreur de syntaxe (accolade manquante) aux lignes 4532-4533** :
   ```typescript
   // Ligne 4532
   { services: { some: { activitiesNew: { some: { action: { project: { programId: id } } } } } }
   ```
   Il manque deux accolades fermantes pour clore correctement les blocs `some` et `services`. Le compilateur lève une erreur syntaxique `TS1005: ',' expected`.
   
2. **Erreurs de relation Prisma aux lignes 5292 et 5298** :
   ```typescript
   // Lignes 5292 & 5298
   projects: { some: { beneficiaryProjects: { some: { id } } } }
   beneficiaryProjects: { some: { id } }
   ```
   Le champ ou la relation `beneficiaryProjects` n'existe pas dans le modèle `Project`. La relation correcte déclarée dans `schema.prisma` est `beneficiary` (ou l'utilisation de la clé étrangère `beneficiaryId`). Le compilateur lève l'erreur `TS2353: Object literal may only specify known properties`.

---

## ETAPE 4 – VÉRIFICATION VERCEL (VARIABLES D'ENVIRONNEMENT)

| Variable | Présente | Statut | Rôle / Analyse |
|:---|:---:|:---:|:---|
| `DATABASE_URL` | **Oui** | Incorrecte | Pointe vers le pooler Supabase en mode Session (`port 6543` avec `?pgbouncer=true`). Le mode Session limite sévèrement les connexions simultanées (max 15), provoquant des plantages sous charge parallèle. |
| `NEXT_PUBLIC_API_URL` | **Oui** | Correcte | Pointe vers `https://pit-cpsv-ap.onrender.com` (qui héberge le serveur Express en panne). |
| `DIRECT_URL` | **Non** | Absente | Devrait être configurée pour permettre à Prisma d'effectuer des connexions directes pour les migrations et éviter de surcharger le pooler. |

---

## ETAPE 5 – VÉRIFICATION TANSTACK QUERY

Chaque cockpit du frontend effectue des requêtes TanStack Query vers l'API réécrite par Next.js :

* **Routage Next.js** : `next.config.ts` réécrit `/api/v2/*` vers `NEXT_PUBLIC_API_URL/api/v2/*` (Render).
* **Comportement des Cockpits** :
  * **Programs, Capabilities, S3, Ecosystems, Beneficiaries** : Ces cockpits appellent exclusivement l'API v2. Comme Render répond par un code **404**, TanStack Query passe en échec. Le frontend n'affichant pas de message d'erreur d'API explicite, les écrans de chargement se terminent et laissent les tableaux vides (0 éléments).
  * **Services** : Ce cockpit fonctionne et affiche environ 10 services car il interroge un **mock local** (`/mock/services.json` dans `src/lib/hooks.ts`) au lieu de requêter l'API de production.

---

## ETAPE 6 – CAS PARTICULIER : BLOCAGE DU COCKPIT JOURNEYS

Le cockpit Journeys reste bloqué indéfiniment sur la mention **"Chargement des parcours"**.

### Cause racine du blocage :
1. Dans `src/app/journeys/page.tsx`, l'écran attend la résolution de 4 requêtes TanStack Query :
   $$\text{isLoading} = \text{loadingJourneys} \lor \text{loadingMeta} \lor \text{loadingBenefs} \lor \text{loadingEnrollments}$$
2. L'une de ces requêtes, `useMetaQuery` (qui appelle `/api/meta` sur les API Routes locales de Next.js), **crash systématiquement en erreur HTTP 500**.
3. Dans `src/app/api/[...path]/route.ts`, le handler de `/api/meta` exécute un `Promise.all` géant qui lance **42 requêtes Prisma simultanées** pour charger toutes les tables.
4. Cette rafale de requêtes parallèles sature instantanément le pooler de connexions Supabase en mode Session, renvoyant l'erreur fatale :
   `FATAL: (EMAXCONNSESSION) max clients reached in session mode - max clients are limited to pool_size: 15`.
5. En l'absence de gestion d'erreur robuste sur ce cockpit (le code n'attrape pas `isError` pour désactiver le loader), l'interface reste bloquée à l'état de chargement initial.

---

## ETAPE 7 – MATRICE DE CAUSE RACINE

| Cockpit | Statut en Production | Cause Racine |
|:---|:---:|:---|
| **Programs** | Vide (0 données) | API v2 KO (Erreurs de compilation TypeScript dans le serveur Express de Render). |
| **Capabilities** | Vide (0 données) | Même cause (API v2 Render renvoie 404). |
| **S3** | Vide (0 domaines) | Même cause (API v2 Render renvoie 404). |
| **Ecosystems** | Vide (0 écosystèmes) | Même cause (API v2 Render renvoie 404). |
| **Beneficiaries** | Vide (0 bénéficiaires) | Même cause (API v2 Render renvoie 404). |
| **Journeys** | **Bloqué sur chargement** | Crash de la route Next.js locale `/api/meta` (Erreur Supabase `max clients reached` due aux 42 requêtes Prisma en parallèle) + absence de gestion d'erreur dans l'UI. |

---

## ETAPE 8 – PLAN DE CORRECTION PROPOSÉ

> [!IMPORTANT]
> Les corrections doivent être appliquées en priorité selon les niveaux de criticité ci-dessous.

### 1. Niveau Critique (Restauration immédiate des services)
* **Correction dans `src/server.ts`** :
  * Corriger l'accolade manquante à la ligne 4532 en complétant avec `} } } } } } }`.
  * Remplacer la relation invalide `beneficiaryProjects` par `beneficiaryId: id` (ou `beneficiary: { id }`) aux lignes 5292 et 5298.
  * *Objectif* : Permettre au serveur Express de compiler et d'être déployé avec succès sur Render.
* **Correction dans `/api/meta` (`src/app/api/[...path]/route.ts`)** :
  * Découper le chargement parallèle géant de 42 tables ou sérialiser les requêtes Prisma pour éviter d'ouvrir 42 connexions PostgreSQL en même temps.
  * Limiter la taille du pool Prisma ou configurer Supabase Connection Pooler en mode **Transaction** (plutôt que Session) pour recycler efficacement les connexions.

### 2. Niveau Important (Robustesse)
* **Configuration Prisma / Supabase** :
  * Configurer explicitement la variable `DIRECT_URL` dans Vercel et dans `schema.prisma` pour dissocier les connexions directes des connexions poolées.
* **Frontend UI** :
  * Ajouter un affichage des états d'erreur TanStack Query dans tous les cockpits pour éviter les écrans bloqués ou les tableaux vides silencieux.

### 3. Niveau Cosmétique
* Mettre en place un indicateur visuel de "cold start" (temps de réveil du serveur Render gratuit) pour informer l'utilisateur lors du premier chargement d'un cockpit.

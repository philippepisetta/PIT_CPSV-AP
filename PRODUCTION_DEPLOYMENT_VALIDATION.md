# RAPPORT DE VALIDATION DU DÉPLOIEMENT EN PRODUCTION (HOTFIX)

## CONTEXTE & CONSTAT

Le walkthrough indique que les corrections du Sprint 4.5.B (erreurs de compilation TypeScript et saturation du pool de connexions Supabase) sont terminées. Cependant, la production observée (Vercel/Render) présente toujours des cockpits vides et le cockpit Journeys bloqué.

Ce rapport documente la validation du déploiement en production pour identifier précisément l'écart entre le code local corrigé et la production.

---

## 1. BACKEND (RENDER)

### Informations de Déploiement :
* **URL de l'API de Production** : `https://pit-cpsv-ap.onrender.com`
* **Dernier Commit local sur `origin/main`** : `f0f6963e65b945eeb6ce36726effea07d09e69e6` ("final refacto1")
* **État de Déploiement** : **Le code corrigé localement du Sprint 4.5.B n'est pas encore déployé.** Les modifications locales de [server.ts](file:///c:/Users/Philippe%20Pisetta/Downloads/testing%20CPSV-AP/src/server.ts) et [route.ts](file:///c:/Users/Philippe%20Pisetta/Downloads/testing%20CPSV-AP/cpsv-ap-app/src/app/api/[...path]/route.ts) n'ont pas été commitées ni poussées sur GitHub.
* **Comportement Observé de Render** : 
  * Le build du commit `f0f6963` a échoué en production en raison des erreurs de compilation TypeScript dans `src/server.ts`.
  * En cas d'échec de build, Render conserve par défaut la **version stable précédente** en ligne (Zero-Downtime deploy).
  * Cette version précédente stable ne contient pas du tout l'API v2, ce qui explique pourquoi l'API v1 (`/api/services`) fonctionne, mais l'API v2 renvoie des 404.

### Tests des Endpoints API v2 (Production) :

| Endpoint | HTTP Status | Nb Éléments | Temps de réponse | Payload / Erreur observée |
|:---|:---:|:---:|:---:|:---|
| `/api/v2/programs` | **404** | 0 | ~240ms | `Cannot GET /api/v2/programs` |
| `/api/v2/capabilities` | **404** | 0 | ~126ms | `Cannot GET /api/v2/capabilities` |
| `/api/v2/s3-domains` | **404** | 0 | ~125ms | `Cannot GET /api/v2/s3-domains` |
| `/api/v2/ecosystems` | **404** | 0 | ~310ms | `Cannot GET /api/v2/ecosystems` |
| `/api/v2/beneficiaries` | **404** | 0 | ~130ms | `Cannot GET /api/v2/beneficiaries` |
| `/api/v2/journeys` | **404** | 0 | ~126ms | `Cannot GET /api/v2/journeys` |

---

## 2. FRONTEND (VERCEL)

### Diagnostic Environnement :
* **Variable d'Environnement `NEXT_PUBLIC_API_URL`** : `https://pit-cpsv-ap.onrender.com`
* **URL de l'API réellement appelée par Vercel** : `https://pit-cpsv-ap.onrender.com/api/v2/...`
* **Vérification du Mapping** :
  * **API attendue** : `https://pit-cpsv-ap.onrender.com`
  * **API réellement utilisée** : `https://pit-cpsv-ap.onrender.com`
  * *Constat* : Le mapping d'environnement Vercel $\rightarrow$ Render est **correct et cohérent**. Le problème vient uniquement du fait que l'API cible (Render) n'expose pas l'API v2 (build KO non déployé).

---

## 3. CAS PARTICULIER : COCKPIT JOURNEYS

Le cockpit Journeys effectue des requêtes locales Next.js (sur Vercel) vers `/api/meta`, `/api/journeys`, `/api/beneficiaries` et `/api/journey-enrollments`.

* **Endpoint appelé** : `/api/meta`
* **Payload reçu** : Vide ou intermittent sous charge.
* **Erreur constatée en production** :
  * La route `/api/meta` non segmentée lance 42 requêtes Prisma parallèles.
  * Le pooler de Supabase en mode Session est limité à 15 connexions simultanées, ce qui provoque de fréquentes erreurs critiques :
    `FATAL: (EMAXCONNSESSION) max clients reached in session mode - max clients are limited to pool_size: 15`
  * TanStack Query retente la requête à plusieurs reprises, ce qui maintient l'état `isLoading` à `true` et fige l'interface sur "Chargement des parcours".

---

## 4. CONCLUSION & PLAN D'ACTION

### Causes Précises identifiées :
1. **Problème de déploiement (Majeur)** : Le code corrigé en local (correctifs TypeScript de `server.ts` et segmentation de `route.ts`) n'a pas été poussé sur le dépôt GitHub.
2. **Problème de compilation (Bloquant)** : Le dernier commit déployé sur Render a échoué en build TypeScript, forçant Render à servir l'ancienne version stable sans API v2.
3. **Problème d'environnement (Majeur)** : La connexion Supabase en mode Session limite trop fortement le nombre de connexions Prisma parallèles autorisées.

### Actions pour la mise en production :
1. **Commiter et Pousser** les modifications locales fonctionnelles vers la branche `main` du dépôt GitHub `https://github.com/philippepisetta/PIT_CPSV-AP.git`.
2. **Déclencher un nouveau build** sur Render pour déployer la version Express corrigée.
3. **Déclencher un nouveau build** sur Vercel pour déployer la version Next.js segmentée.

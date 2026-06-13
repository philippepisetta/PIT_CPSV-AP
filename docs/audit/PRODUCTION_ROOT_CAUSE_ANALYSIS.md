# 🔍 RAPPORT D'AUDIT ET ANALYSE DE CAUSE RACINE (PRODUCTION_ROOT_CAUSE_ANALYSIS.md)

Ce document présente le diagnostic technique et factuel de la production réellement déployée pour l'application PIT (Plateforme d'Intelligence Territoriale), afin d'expliquer pourquoi les cockpits (*Programs, Capabilities, S3, Ecosystems, Beneficiaries*) apparaissent vides et le cockpit *Journeys* bloqué, contrairement aux annonces du Sprint 4.5.B.

---

## 🏛️ ETAPE 1 – IDENTIFIER LE COMMIT RÉELLEMENT DEPLOYÉ

Les vérifications des états locaux du dépôt et des déploiements réels en production montrent les informations suivantes :

### 1. Frontend Vercel
*   **Commit SHA** : `f9c595c94ba78d325a1ac61a3610ad0b6efe7ca4`
*   **Date du Commit** : `2026-06-13T11:27:00+02:00`
*   **Branche** : `main` (poussé sur `origin/main`)
*   **Constat** : Vercel est à jour avec le dernier code source local du Sprint 4.5.B.

### 2. Backend Render
*   **Commit SHA** : `632b1825cf9b34c27defdb9a809c9427cb09eb4a`
*   **Date du Commit** : `2026-06-10T10:35:14+02:00` (soit il y a 3 jours)
*   **Branche** : `main`
*   **Constat** : Le backend Render est en retard de plusieurs commits. Il exécute une version obsolète qui ne contient pas du tout l'API v2 (le routeur `v2Router` n'y est pas défini).

### 3. Pourquoi cet écart ?
Le build du commit `f0f6963e65b945eeb6ce36726effea07d09e69e6` ("final refacto1") a échoué en production Render en raison d'erreurs de compilation TypeScript majeures dans `src/server.ts` (une accolade fermante manquante à la ligne 4532 et la relation `beneficiaryProjects` inexistante). 

Render utilise un mécanisme de déploiement sécurisé sans interruption de service (Zero-Downtime deploy). En cas d'échec de compilation d'un nouveau commit, **Render conserve en ligne la dernière version stable connue** (qui est le commit `632b1825` antérieur à l'intégration de l'API v2). Les commits suivants de correction (`d98af4bc` et `f9c595c9`) n'ont pas encore été redéployés avec succès sur Render.

### Comparaison avec Sprint 4.5.B
*   **Expected Commit (Sprint 4.5.B)** : `d98af4bc` / `f9c595c9`
*   **Actual Commit (Vercel)** : `f9c595c9` (Conforme)
*   **Actual Commit (Render)** : `632b1825` (Non conforme / Legacy)

### Le code Sprint 4.5.B est-il réellement déployé ?
> [!CAUTION]
> **NON**
> Seul le frontend Vercel est déployé avec le code du Sprint 4.5.B. Le backend Render exécute toujours une version obsolète et n'a pas mis en ligne l'API v2.

---

## 🔌 ETAPE 2 – VERIFIER LES VARIABLES D'ENVIRONNEMENT

Voici la comparaison des variables d'environnement configurées par rapport aux valeurs attendues pour faire fonctionner la production :

| Variable | Valeur Attendue (Correction) | Valeur Réellement Utilisée | Statut / Risque |
| :--- | :--- | :--- | :--- |
| **`NEXT_PUBLIC_API_URL`** | `https://pit-cpsv-ap.onrender.com` | `https://pit-cpsv-ap.onrender.com` | **Correct** (Utilisé pour les rewrites de `/api/v2/*`) |
| **`DATABASE_URL` (Vercel)** | `postgresql://...:6543/postgres?pgbouncer=true&connection_limit=1` | `postgresql://...:6543/postgres?pgbouncer=true` | **Incorrect** (Pas de `connection_limit=1`, provoquant la saturation du pooler Supabase) |
| **`DATABASE_URL` (Render)** | `postgresql://...:5432/postgres` (Direct) | `postgresql://...:5432/postgres` | **Correct** |
| **`DIRECT_URL`** | `postgresql://...:5432/postgres` | *Absente* (Non définie sur Vercel) | **Risqué** (Prisma ne peut pas dissocier les connexions directes de schéma) |
| **`SUPABASE_URL`** | `https://cmfbineqwwlqvecthidk.supabase.co` | `https://cmfbineqwwlqvecthidk.supabase.co` | **Correct** |
| **`SUPABASE_PROJECT`** | `cmfbineqwwlqvecthidk` | `cmfbineqwwlqvecthidk` | **Correct** |

---

## 🧪 ETAPE 3 – TESTER LES ENDPOINTS REELS

Les tests d'appels directs sur l'API de production Render (`https://pit-cpsv-ap.onrender.com`) confirment que l'ensemble des routes de l'API v2 renvoient des erreurs **HTTP 404 (Not Found)** car elles n'existent pas sur la version legacy en ligne :

| Endpoint | Status | Count | Temps de réponse | Payload / Erreur observée |
| :--- | :---: | :---: | :---: | :--- |
| `GET /api/v2/programs` | **404** | 0 | ~61355 ms | `Cannot GET /api/v2/programs` (Temps incluant le cold start) |
| `GET /api/v2/capabilities` | **404** | 0 | ~161 ms | `Cannot GET /api/v2/capabilities` |
| `GET /api/v2/s3-domains` | **404** | 0 | ~128 ms | `Cannot GET /api/v2/s3-domains` |
| `GET /api/v2/ecosystems` | **404** | 0 | ~124 ms | `Cannot GET /api/v2/ecosystems` |
| `GET /api/v2/beneficiaries` | **404** | 0 | ~122 ms | `Cannot GET /api/v2/beneficiaries` |
| `GET /api/v2/journeys` | **404** | 0 | ~120 ms | `Cannot GET /api/v2/journeys` |

---

## 🗄️ ETAPE 4 – VERIFIER LA BASE REELLE

Les données d'exécution réelles récupérées via des requêtes `COUNT(*)` directes sur la base de données de production Supabase montrent que **les données existent et sont bien présentes** :

| Table Prisma | Count (Production) | Statut des données |
| :--- | :---: | :--- |
| **Program** | **8** | Données présentes (EDIH, Circular Wallonia, etc.) |
| **Capability** | **5** | Données présentes |
| **S3Domain** | **5** | Données présentes |
| **Ecosystem** | **4** | Données présentes (EDIH, BioWin, etc.) |
| **Beneficiary** | **7** | Données présentes |
| **Journey** | **2** | Données présentes |
| **Service (PublicService)** | **7** | Données présentes |
| **Organization** | **8** | Données présentes |
| **Territory** | **11** | Données présentes |

*Constat* : Les données métier ont été correctement seedées et ne sont pas absentes. Le problème de visibilité est uniquement applicatif.

---

## 💻 ETAPE 5 – VERIFIER LE FRONTEND

L'analyse réseau et les logs de l'application Next.js déployée sur Vercel montrent le comportement suivant pour chaque cockpit :

| Cockpit | Endpoint appelé | Résultat | Erreur TanStack Query / JS / UI |
| :--- | :--- | :--- | :--- |
| **Programs** | `/api/v2/programs` | **Vide (0)** | TanStack Query lève une erreur réseau (HTTP 404). L'IHM affiche un tableau vide. |
| **Capabilities** | `/api/v2/capabilities` | **Vide (0)** | TanStack Query lève une erreur réseau (HTTP 404). L'IHM affiche un cockpit vide. |
| **S3** | `/api/v2/s3-domains` | **Vide (0)** | TanStack Query lève une erreur réseau (HTTP 404). L'IHM affiche 0 domaine. |
| **Ecosystems** | `/api/v2/ecosystems` | **Vide (0)** | TanStack Query lève une erreur réseau (HTTP 404). L'IHM affiche 0 écosystème. |
| **Beneficiaries** | `/api/v2/beneficiaries` | **Vide (0)** | TanStack Query lève une erreur réseau (HTTP 404). L'IHM affiche 0 bénéficiaire. |
| **Journeys** | `/api/meta` (local Vercel) | **Bloqué** | L'appel local Next.js `/api/meta` timeout ou échoue en 500. Le loader d'attente fige l'IHM. |

---

## 🧭 ETAPE 6 – CAS JOURNEYS

Le cockpit Journeys fige l'interface utilisateur sur la mention *"Chargement des parcours de transformation..."*.

### Preuves Techniques :
1.  **Requêtes Réseau** : Au chargement de `/journeys`, le navigateur lance 4 requêtes locales Next.js parallèles vers `/api/meta`, `/api/journeys`, `/api/beneficiaries` et `/api/journey-enrollments`.
2.  **Réponse API** : `/api/meta` tente de charger la totalité de la base de données. Même avec le découpage en 7 vagues séquentielles de 6 requêtes Prisma, l'appel prend plus de 12 secondes et échoue régulièrement en timeout de fonction serverless (Vercel limite les requêtes Hobby à 10s).
3.  **Erreur Prisma & Saturation** : Dans un environnement serverless (Vercel), chaque requête parallèle engendre sa propre instance Prisma. Sans restriction, chaque instance ouvre plusieurs connexions vers le pooler Supabase (port 6543) configuré en mode **Session**.
4.  **Exception Levée** : PgBouncer renvoie une exception fatale :
    `FATAL: (EMAXCONNSESSION) max clients reached in session mode - max clients are limited to pool_size: 15`.
5.  **TanStack Query & React** : TanStack Query intercepte l'erreur réseau (500 ou 504) et retente la requête à plusieurs reprises. L'interface de `/journeys` ne gérant pas l'état d'erreur (`isError`) pour masquer le spinner, l'interface reste bloquée indéfiniment en mode chargement.

> [!IMPORTANT]
> **CAUSE RACINE UNIQUE**
> La saturation du pool de connexions Supabase (PgBouncer en mode Session limité à 15 connexions simultanées) provoquée par des appels Prisma concurrents lancés depuis l'environnement serverless de Vercel sans limitation du nombre de connexions autorisées par instance (`connection_limit`).

---

## 📊 ETAPE 7 – MATRICE DE CAUSE RACINE

| Cockpit | Cause Réelle |
| :--- | :--- |
| **Programs** | **Mauvais commit** (Render exécute le commit obsolète `632b1825` et renvoie une 404 sur l'API v2). |
| **Capabilities** | **Mauvais commit** (Render exécute le commit obsolète `632b1825` et renvoie une 404 sur l'API v2). |
| **S3** | **Mauvais commit** (Render exécute le commit obsolète `632b1825` et renvoie une 404 sur l'API v2). |
| **Ecosystems** | **Mauvais commit** (Render exécute le commit obsolète `632b1825` et renvoie une 404 sur l'API v2). |
| **Beneficiaries** | **Mauvais commit** (Render exécute le commit obsolète `632b1825` et renvoie une 404 sur l'API v2). |
| **Journeys** | **Variable d'environnement incorrecte** (DATABASE_URL sur Vercel n'a pas de paramètre `connection_limit=1`, ce qui sature le pooler de 15 connexions Supabase sous requêtes serverless parallèles). |

---

## 🛠️ ETAPE 8 – PLAN DE DEPLOIEMENT & RECOUVREMENT

Les actions à mener pour restaurer l'application et la rendre conforme au Sprint 4.5.B sans modification architecturale ou fonctionnelle sont décrites dans le livrable :
👉 **[HOTFIX_PLAN.md](file:///c:/Users/Philippe%20Pisetta/Downloads/testing%20CPSV-AP/HOTFIX_PLAN.md)**

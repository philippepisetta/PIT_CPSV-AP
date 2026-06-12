# PRODUCTION DEPLOYMENT VALIDATION – SPRINT 4.5.B

Ce document présente un diagnostic factuel et complet de l'état du déploiement en production (Vercel et Render) de la plateforme PIT, afin d'identifier précisément pourquoi les cockpits (Programs, Capabilities, S3, Ecosystems, Beneficiaries) apparaissent vides et le cockpit Journeys bloqué.

---

## ETAPE 1 – IDENTIFIER LE BACKEND REELLEMENT UTILISE

*   **`NEXT_PUBLIC_API_URL` (Vercel)** : `https://pit-cpsv-ap.onrender.com`
*   **URL backend réellement appelée (via rewrites Next.js)** : `https://pit-cpsv-ap.onrender.com/api/v2/...`
*   **Backend attendu** : `https://pit-cpsv-ap.onrender.com` exécutant le code avec les endpoints de l'API v2 (commit `d98af4bc`).
*   **Backend réellement utilisé** : `https://pit-cpsv-ap.onrender.com` exécutant une version héritée (legacy) ne contenant pas l'API v2, mais uniquement l'API v1 (ex: `/api/services` répond avec succès tandis que `/api/v2/...` renvoie un 404).

---

## ETAPE 2 – TESTER LES ENDPOINTS V2 DEPUIS LA PRODUCTION

Les tests d'appels HTTP directs sur les endpoints v2 de l'API de production Render ont donné les résultats suivants :

| Endpoint | Status | Count | Temps de réponse | Payload réel / Message d'erreur |
| :--- | :---: | :---: | :---: | :--- |
| `/api/v2/programs` | **404** | 0 | ~230ms | `<!DOCTYPE html>... Cannot GET /api/v2/programs` |
| `/api/v2/capabilities` | **404** | 0 | ~130ms | `<!DOCTYPE html>... Cannot GET /api/v2/capabilities` |
| `/api/v2/s3-domains` | **404** | 0 | ~140ms | `<!DOCTYPE html>... Cannot GET /api/v2/s3-domains` |
| `/api/v2/ecosystems` | **404** | 0 | ~130ms | `<!DOCTYPE html>... Cannot GET /api/v2/ecosystems` |
| `/api/v2/beneficiaries` | **404** | 0 | ~130ms | `<!DOCTYPE html>... Cannot GET /api/v2/beneficiaries` |
| `/api/v2/journeys` | **404** | 0 | ~130ms | `<!DOCTYPE html>... Cannot GET /api/v2/journeys` |

---

## ETAPE 3 – VERIFIER LA BASE REELLEMENT UTILISEE

### Configuration des variables de base de données :

*   **`DATABASE_URL` (Vercel)** : `postgresql://postgres.cmfbineqwwlqvecthidk:AdN2024%2B2024@aws-1-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true` (Port 6543 - Pooler Supabase en mode Session).
*   **`DATABASE_URL` (Local & Render)** : `postgresql://postgres.cmfbineqwwlqvecthidk:AdN2024%2B2024@aws-1-eu-central-1.pooler.supabase.com:5432/postgres` (Port 5432 - Connexion directe).
*   **`SUPABASE_URL`** : `https://cmfbineqwwlqvecthidk.supabase.co`
*   **`SUPABASE_PROJECT`** : `cmfbineqwwlqvecthidk` (PIT Wallonie - EDIH)

### Comparaison :
*   **Base attendue** : L'instance Supabase de production `cmfbineqwwlqvecthidk`.
*   **Base réellement utilisée** : La même instance Supabase de production `cmfbineqwwlqvecthidk`. 
*   *Constat* : Il n'y a pas d'erreur sur l'adresse de la base de données. Toutes les configurations pointent vers la même base Supabase contenant les données métier seedées.

---

## ETAPE 4 – VERIFIER LES DONNEES

Requêtes directes effectuées en base de données de production :

| Entité | Nombre réel |
| :--- | :---: |
| **Programs** | 8 |
| **Capabilities** | 5 |
| **S3Domains** | 5 |
| **Ecosystems** | 4 |
| **Beneficiaries** | 7 |
| **Journeys** | 2 |
| **Services (PublicService)** | 7 |

*   *Constat* : Les données existent bel et bien en base. La base n'est pas vide et le seed a été correctement exécuté.

---

## ETAPE 5 – VERIFIER LE DEPLOIEMENT

*   **Commit Sprint 4.5.B attendu** : `d98af4bc` ("debug1")
*   **Commit actuellement déployé sur Render** : Un commit hérité (legacy, probablement antérieur à `f0f6963` ou `675d572`). Le build automatique sur Render du commit précédent `f0f6963` a échoué en raison d'erreurs de compilation TypeScript majeures dans `src/server.ts` (accolade manquante à la ligne 4532 et relation `beneficiaryProjects` inexistante). Render a donc conservé l'ancienne version stable (Zero-Downtime deploy), qui ne contenait pas l'API v2. Bien que le commit corrigé `d98af4bc` ait été poussé sur GitHub, Render n'a pas encore redéployé la nouvelle version fonctionnelle (soit parce que le build est encore en cours, soit parce que le déploiement automatique est désactivé et nécessite une action manuelle).
*   **Commit actuellement déployé sur Vercel** : `d98af4bc` ("debug1").

### Comparaison des Commits :
*   **Expected Commit** : `d98af4bc` (avec correctifs TypeScript et requêtes Next.js segmentées).
*   **Actual Commit** :
    *   **Vercel** : `d98af4bc` (Correct/À jour)
    *   **Render** : Ancien commit stable sans API v2 (Incorrect/En retard)

---

## ETAPE 6 – ANALYSER LE CAS JOURNEYS

Le cockpit Journeys figeait l'interface sur la mention *"Chargement des parcours de transformation..."*.

### Diagnostic technique :
1.  **Requêtes et endpoints appelés** : Le cockpit effectue des requêtes locales Next.js (Vercel) vers `/api/meta`, `/api/journeys`, `/api/beneficiaries` et `/api/journey-enrollments`.
2.  **Comportement de `/api/meta`** : Précédemment, l'appel à `/api/meta` déclenchait 42 requêtes Prisma simultanées dans un unique bloc `Promise.all`. Cette rafale saturait instantanément le pooler Supabase configuré en mode Session sur Vercel (limité à 15 clients maximum), provoquant une erreur fatale `EMAXCONNSESSION (max clients reached)`.
3.  **Réponse API et Erreur** : La route Next.js renvoyait une erreur HTTP 500. L'UI (utilisant TanStack Query) restait bloquée indéfiniment en mode chargement faute de gestion d'erreur appropriée.
4.  **État actuel** : Avec le déploiement du commit `d98af4bc` sur Vercel, la route `/api/meta` a été segmentée en 7 blocs séquentiels de maximum 6 requêtes Prisma parallèles. Les tests de production confirment que `/api/meta`, `/api/journeys`, `/api/beneficiaries` et `/api/journey-enrollments` retournent désormais tous un **HTTP Status 200** avec les données sémantiques correctes en moins de 3.5 secondes. Le cockpit Journeys est donc entièrement débloqué.

---

## ETAPE 7 – MATRICE DE CAUSE RACINE

| Cockpit | Cause |
| :--- | :--- |
| **Programs** | **backend KO / mauvais commit** (Render n'exécute pas encore le dernier commit `d98af4bc` et renvoie une 404 pour l'API v2). |
| **Capabilities** | **backend KO / mauvais commit** (Render n'exécute pas encore le dernier commit `d98af4bc` et renvoie une 404 pour l'API v2). |
| **S3** | **backend KO / mauvais commit** (Render n'exécute pas encore le dernier commit `d98af4bc` et renvoie une 404 pour l'API v2). |
| **Ecosystems** | **backend KO / mauvais commit** (Render n'exécute pas encore le dernier commit `d98af4bc` et renvoie une 404 pour l'API v2). |
| **Beneficiaries** | **backend KO / mauvais commit** (Render n'exécute pas encore le dernier commit `d98af4bc` et renvoie une 404 pour l'API v2). |
| **Journeys** | **Résolu** (Fonctionne correctement sur Vercel depuis le déploiement du commit `d98af4bc` qui segmente les requêtes Prisma et évite la saturation du pooler). |

---

## ETAPE 8 – PLAN DE CORRECTION

Conformément à la consigne, aucun nouveau développement n'est réalisé. Seules les actions de déploiement et d'infrastructure nécessaires sont listées.

### CRITIQUE (Restauration immédiate des cockpits)
*   **Déclenchement manuel du build Render** : Forcer le build et le déploiement du commit `d98af4bc` sur le tableau de bord Render pour l'application `pit-cpsv-ap`.
*   *Raison* : Le code local a été entièrement corrigé et poussé. Il compile sans aucune erreur (`npx tsc` local valide à 100%). Seule la mise en ligne effective sur Render de cette version débloquera les cockpits Programs, Capabilities, S3, Ecosystems et Beneficiaries en rendant les routes `/api/v2/...` opérationnelles.

### IMPORTANT (Stabilité future)
*   **Surveillance des déploiements automatiques** : Vérifier sur le tableau de bord Render que les futurs pushs sur la branche `main` déclenchent bien un build automatique, ou corriger la configuration webhooks GitHub -> Render si nécessaire.

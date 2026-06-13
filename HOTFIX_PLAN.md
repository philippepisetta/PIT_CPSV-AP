# 🛠️ PLAN DE CORRECTION (HOTFIX_PLAN.md)

Ce document liste les corrections d'infrastructure et de déploiement à appliquer pour résoudre immédiatement le dysfonctionnement de la production PIT et la rendre 100% conforme aux spécifications du Sprint 4.5.B.

---

## 1. CORRECTIF 1 : DÉPLOIEMENT DU BACKEND API V2 (RENDER)

*   **Fichier / Élément concerné** : Dashboard Render -> Service API `pit-cpsv-ap`
*   **Ligne / Configuration concernée** : Trigger de déploiement (Manual Deploy)
*   **Cause** : 
    Le build automatique du commit `f0f6963` avait échoué en production Render en raison d'erreurs de syntaxe TypeScript dans `src/server.ts` (accolade manquante et relation Prisma incorrecte). Render a par conséquent conservé en ligne l'ancienne version stable `632b1825` (Zero-Downtime deploy) qui ne contient pas le routeur `/api/v2`.
    Les commits correctifs (`d98af4bc` et `f9c595c9`) ont été poussés sur GitHub, mais n'ont pas encore été compilés et déployés sur Render.
*   **Correction** :
    1. Ouvrir le tableau de bord Render.
    2. Aller sur le service web `pit-cpsv-ap`.
    3. Cliquer sur **"Manual Deploy"** -> **"Deploy latest commit"** (ou forcer le build du commit `f9c595c94ba78d325a1ac61a3610ad0b6efe7ca4`).
    4. *Note* : La compilation TypeScript réussira à 100% (le code a été validé en local par `npx tsc --noEmit` avec succès).
    
    *Résultat attendu* : Rétablissement instantané de tous les cockpits (*Programs, Capabilities, S3, Ecosystems, Beneficiaries*) en rendant opérationnels les endpoints `/api/v2/...`.

---

## 2. CORRECTIF 2 : LIMITE DE CONNEXION DB POUR LES SERVERLESS FUNCTIONS (VERCEL)

*   **Fichier / Élément concerné** : Dashboard Vercel -> Variables d'environnement du projet `pit-cpsv-ap`
*   **Ligne / Configuration concernée** : Valeur de la variable d'environnement `DATABASE_URL`
*   **Cause** : 
    Le pooler PgBouncer de Supabase sur le port 6543 est configuré en mode **Session** et limite les connexions simultanées à **15**.
    Au chargement du cockpit *Journeys*, Next.js lance 4 requêtes Prisma concurrentes. En serverless, chaque requête s'exécute dans une instance de conteneur distincte et tente d'ouvrir plusieurs connexions Prisma. Les 15 connexions autorisées sont instantanément épuisées, provoquant des erreurs Prisma critiques `EMAXCONNSESSION (max clients reached)` et des timeouts (504 Vercel), ce qui bloque l'IHM sur *"Chargement des parcours..."*.
*   **Correction** :
    1. Aller sur le dashboard Vercel, projet `pit-cpsv-ap`.
    2. Naviguer dans **Settings** -> **Environment Variables**.
    3. Modifier la variable `DATABASE_URL` pour y ajouter le paramètre de limitation de connexion Prisma `connection_limit=1`.
       *   **Ancienne valeur** :
           `postgresql://postgres.cmfbineqwwlqvecthidk:AdN2024%2B2024@aws-1-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true`
       *   **Nouvelle valeur** :
           `postgresql://postgres.cmfbineqwwlqvecthidk:AdN2024%2B2024@aws-1-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1`
    4. Ajouter également la variable d'environnement **`DIRECT_URL`** pour permettre à Prisma d'exécuter des migrations directes sans passer par PgBouncer :
       *   **Nom** : `DIRECT_URL`
       *   **Valeur** :
           `postgresql://postgres.cmfbineqwwlqvecthidk:AdN2024%2B2024@aws-1-eu-central-1.pooler.supabase.com:5432/postgres` (Port 5432)
    5. Redéployer l'application sur Vercel pour propager les nouvelles variables d'environnement.

    *Résultat attendu* : Déblocage complet du cockpit *Journeys* en empêchant toute saturation ou plantage lié au pool de connexions Supabase.

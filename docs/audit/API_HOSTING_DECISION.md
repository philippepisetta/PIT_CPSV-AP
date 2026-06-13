# ÉVALUATION STRATÉGIQUE ET DÉCISION D'HÉBERGEMENT BACKEND (API V2)

Ce document présente l'audit d'hébergement du serveur backend API v2 pour l'application PIT (CPSV-AP Wallonie) et compare les options pour résoudre définitivement les instabilités de production.

---

## 1. COMPRÉHENSION DES INSTABILITÉS RÉCURRENTES DE RENDER

Les pannes et lenteurs observées sur l'API v2 déployée sur Render s'expliquent par trois facteurs techniques combinés :

### A. Le mode "Mise en veille" (Spin-down) de l'offre Free de Render
* **Comportement** : Render arrête automatiquement le conteneur après **15 minutes d'inactivité**.
* **Impact** : Le premier utilisateur qui arrive sur l'application déclenche un démarrage à froid (*cold start*) qui prend entre **30 et 60 secondes**.
* **Conséquence** : Pendant ce temps, le frontend sur Vercel renvoie des erreurs de timeout, affiche un chargement infini, ou affiche l'erreur *"API v2 Hors Ligne (Erreur HTTP 404)"* parce que les requêtes proxyfiées échouent.

### B. Le crash de mémoire (OOM - Out of Memory)
* **Comportement** : L'offre gratuite de Render limite la RAM à **512 Mo**.
* **Impact** : L'exécution historique via `ts-node src/server.ts` nécessitait la compilation à la volée du fichier `server.ts` (qui fait plus de **5400 lignes**). Ce processus consommait plus de 450 Mo, provoquant des plantages système au démarrage (Code d'erreur : `Exit Status 134`).
* **Résolution** : Bien que ce point soit résolu par notre pré-compilation (`node dist/src/server.js` qui ne consomme que **56 Mo**), la marge de manœuvre reste faible sur 512 Mo en cas de forte charge.

### C. Le routage Next.js Rewrites (Vercel)
* **Comportement** : Le frontend redirige les appels `/api/v2/*` vers le backend via un mécanisme de reverse proxy (`next.config.ts`).
* **Impact** : Si Render est éteint ou met trop de temps à répondre, la route `/api/v2/...` de Vercel renvoie une erreur HTTP `504 Gateway Timeout` ou `502 Bad Gateway`, interprétée par le client comme une indisponibilité (HTTP 404/500).

---

## 2. COMPARAISON DES 3 OPTIONS D'HÉBERGEMENT

### OPTION 1 : Stabiliser Render (Maintien avec optimisations)

Cette option consiste à conserver l'architecture actuelle sur Render en appliquant les configurations recommandées de production.

> [!NOTE]
> L'optimisation du démarrage (`dist/src/server.js`) a déjà été implémentée dans la base de code locale et résout le problème OOM.

* **Actions requises** :
  1. **Passer à l'offre Starter** (7 $/mois) : Supprime la mise en veille, garantit 100% de disponibilité et augmente la RAM à 2 Go.
  2. **Configurer le Healthcheck Path** : Configurer `/api/v2/services` dans le tableau de bord de Render pour que le routeur attende que le serveur soit prêt avant d'acheminer le trafic.
  3. **Mettre en place un Keep-Alive (UptimeRobot)** : Si l'offre Free est maintenue, configurer un ping toutes les 10 minutes pour éviter l'endormissement.
* **Effort d'implémentation** : **Nul** (Uniquement de la configuration).
* **Coût** : 0 $ (Free avec Keep-alive) ou 7 $/mois (Starter).
* **Risques** : 
  * Offre Free : Délais occasionnels si le ping de keep-alive échoue ou est retardé.
  * Offre Starter : Aucun risque technique majeur, solution très robuste.

---

### OPTION 2 : Migrer l'API v2 dans Vercel (Routes API Next.js Serverless)

Cette option consiste à supprimer complètement le serveur Node/Express indépendant et à intégrer l'ensemble de la logique d'API directement dans le projet Next.js sous forme de Serverless Functions.

> [!WARNING]
> Le fichier `src/server.ts` contient plus de **5400 lignes de code**, des dizaines d'endpoints et utilise un cache mémoire d'état (*stateful cache*). Une migration serverless casserait ce cache.

* **Problématique majeure du cache mémoire (Stateful Cache)** :
  Le backend actuel utilise un cache en mémoire globale (`cachedServices`, `cachedMeta`, etc.) pour éviter de surcharger Supabase :
  ```typescript
  let cachedServices: any = null;
  let cachedServicesTime = 0;
  // ...
  if (cachedServices && (now - cachedServicesTime < CACHE_TTL_MS)) {
    return res.json(cachedServices);
  }
  ```
  En Serverless (Vercel API Routes), chaque requête peut lancer une nouvelle instance indépendante. **L'état en mémoire est perdu entre les requêtes**, ce qui provoquerait :
  * Un effondrement des performances (temps de réponse dépendants de Supabase).
  * Une explosion des connexions à Supabase (risque de saturation de la base de données).
  * La nécessité de déployer un serveur de cache externe (type Redis), augmentant la complexité et les coûts.
* **Effort d'implémentation** : **Très Élevé** (2 à 3 semaines de refactoring complet de 5400 lignes de code, mise en place de Redis, réécriture des routes Express en routes Next.js App Router).
* **Coût** : Gratuit sur Vercel Hobby, mais frais additionnels à prévoir pour une base Redis managée (ex. Upstash).
* **Risques** : Dépassement de la limite de connexions de Supabase, latence accrue due aux *cold starts* serverless, erreurs de régression lors du portage de l'API.

---

### OPTION 3 : Migrer vers Railway / Fly.io

Cette option consiste à déplacer le conteneur Node.js/Express tel quel de Render vers un autre hébergeur de conteneurs persistent (PaaS).

* **Railway** :
  * **Avantages** : Les applications ne sont jamais mises en veille, même sur les plans peu coûteux (Developer Plan à 5 $/mois). La plateforme détecte automatiquement le projet Node/Express et le déploie en quelques secondes. Les builds sont extrêmement rapides grâce à Nixpacks.
  * **Inconvénients** : Pas de niveau 100% gratuit permanent (crédit d'essai limité à 5 $ puis passage au Developer Plan).
* **Fly.io** :
  * **Avantages** : Offre un niveau gratuit décent (3 micro-instances de 256 Mo).
  * **Inconvénients** : Configuration plus complexe (nécessite l'outil CLI `flyctl`, un fichier `fly.toml` et la gestion manuelle des déploiements).
* **Effort d'implémentation** : **Très Faible** (1 à 2 heures pour lier le dépôt GitHub à Railway et configurer les variables d'environnement).
* **Coût** : ~5 $/mois (Railway) ou 0 $ (Fly.io).
* **Risques** : Aucun. L'architecture technique reste identique à celle validée localement.

---

## 3. MATRICE D'ÉVALUATION ET DE DÉCISION

| Critère | OPTION 1 : Render (Starter) | OPTION 2 : Vercel Serverless | OPTION 3 : Railway |
| :--- | :---: | :---: | :---: |
| **Stabilité de la production** | **Excellente** (Pas de veille) | **Moyenne** (Risque DB Pool) | **Excellente** (Pas de veille) |
| **Effort de migration** | **Nul (0 ligne de code)** | **Extrêmement élevé** | **Très faible (< 2h)** |
| **Temps de boot / Latence** | < 100 ms | Variable (Cold starts ~1s) | < 100 ms |
| **Gestion du Cache** | ✅ Préservée (Persistant) | ❌ Brisée (Requiert Redis) | ✅ Préservée (Persistant) |
| **Coût mensuel** | 7 $ | 0 $ + Coût Redis | 5 $ |
| **Complexité de déploiement**| Simple (GitHub intégré) | Simple (GitHub intégré) | Simple (GitHub intégré) |
| **Verdict** | **RECOMMANDÉ (Choix 1)** | **REJETÉ** | **RECOMMANDÉ (Choix 2)** |

---

## 4. CAUSE DES ERREURS RENDER RÉCURRENTES ET DIAGNOSTIC

Les dysfonctionnements réguliers ne provenaient pas du code de l'API lui-même, mais d'une **mauvaise configuration et de contraintes d'infrastructure** :

1. **Le build Render crashait** en mode silencieux au démarrage lors du passage au sprint 4.5.B car le script de démarrage utilisait `ts-node` au lieu de `node` compilé. Render affichait donc un statut réussi sur la console mais le processus crashait en tâche de fond (Exit Status 134), laissant l'ancienne version active ou retournant un port non alloué.
2. **Le serveur tombait en veille** après 15 minutes, rompant le tunnel Next.js rewrites. Le frontend affichait alors des erreurs `404` car la cible du reverse proxy n'existait plus temporairement ou le temps d'attente dépassait le timeout de Vercel.

---

## 5. RECOMMANDATION CLAIRE & DÉCISION TECHNIQUE

> [!IMPORTANT]
> **RECOMMANDATION : Stabiliser l'hébergement actuel sur Render en passant à l'offre Starter (7 $/mois) OU migrer vers Railway (5 $/mois).**
> 
> **Le passage sur Vercel (Option 2) doit être formellement rejeté** en raison de la nature monolithique et stateful du backend actuel. Les 5400+ lignes de code d'API Express ont été conçues pour tourner sur un serveur persistant avec cache mémoire global. Forcer cette structure dans un modèle Serverless sans refactoring majeur causerait de graves régressions de performance et mettrait en péril la base de données PostgreSQL de Supabase.

---

## 6. PLAN D'ACTIONS POUR UNE STABILISATION IMMÉDIATE

### Scénario A : Vous souhaitez conserver Render (Recommandé - Option la plus simple)

1. **Pousser le correctif local** :
   Pousser le commit `ecdd485` contenant la compilation TypeScript (`npm run build` + `node dist/src/server.js`) qui élimine les plantages de mémoire.
2. **Passer à l'offre payante sur Render** :
   Dans le tableau de bord Render, allez sur le service web `pit-cpsv-ap`, cliquez sur **Settings** -> **Instance Type** et sélectionnez **Starter** (7 $/mois). Cela désactive la mise en veille de l'API.
3. **Configurer le Health Check** :
   Dans les **Settings** de Render, ajoutez le chemin de Health Check suivant :
   * Path : `/api/v2/services`
   Cela garantira que Render n'envoie de requêtes qu'une fois le conteneur actif et connecté à la base de données.

---

### Scénario B : Vous préférez migrer vers Railway (Alternative très stable et économique)

1. **Créer un compte Railway** :
   Connectez-vous sur [Railway.app](https://railway.app) avec votre compte GitHub.
2. **Déployer le dépôt** :
   * Cliquez sur **New Project** -> **Deploy from GitHub repository**.
   * Sélectionnez le dépôt `philippepisetta/PIT_CPSV-AP`.
3. **Configurer les Variables d'Environnement** :
   Dans l'onglet **Variables** de Railway, ajoutez les variables du fichier `.env` :
   * `DATABASE_URL` = `"postgresql://postgres.cmfbineqwwlqvecthidk:AdN2024%2B2024@aws-1-eu-central-1.pooler.supabase.com:5432/postgres"`
   * `PORT` = `3001`
4. **Configurer la commande de Build et Start** (détectée automatiquement via `package.json`) :
   * Build Command : `npm install && npm run build`
   * Start Command : `npm start`
5. **Mettre à jour Vercel** :
   Dans le tableau de bord Vercel de votre application frontend, changez la variable d'environnement `NEXT_PUBLIC_API_URL` pour pointer vers la nouvelle URL fournie par Railway (ex. `https://xxx.up.railway.app`). Redéployez le frontend sur Vercel.

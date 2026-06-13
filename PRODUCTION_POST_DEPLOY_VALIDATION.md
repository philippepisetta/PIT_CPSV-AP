# VALIDATION DE DÉPLOIEMENT – CORRECTIF RENDER PIT

Ce document récapitule les étapes de validation pour s'assurer que le correctif de démarrage du backend Render est déployé et que les endpoints de l'API v2 répondent avec succès.

---

## 1. CONFIGURATION RENDER ATTENDUE

Pour résoudre définitivement l'erreur OOM (Out Of Memory / Exit Code 134) causée par `ts-node` au démarrage sur les instances Render gratuites (512 Mo de RAM), assurez-vous que les paramètres suivants sont configurés dans votre tableau de bord Render :

*   **Build Command** : `npm install && npm run build`
    *(Ceci exécute `tsc` pour compiler le code TypeScript dans le dossier `dist/`)*
*   **Start Command** : `npm start`
    *(Ceci exécute le code compilé `node dist/src/server.js`, réduisant l'empreinte mémoire de 405 Mo à seulement 56 Mo)*

---

## 2. RAPPORTS DES TESTS (PRE-DEPLOYMENT)

### Compilation Locale
Le script de build a été testé avec succès en local :
*   Command : `npm run build`
*   Status : **SUCCESS** (0 erreur de compilation TypeScript)

### Serveur Local (Développement)
Toutes les routes répondent correctement sur `http://localhost:3001` :
*   `GET /api/v2/programs` ➔ **200 OK** (8 programmes)
*   `GET /api/v2/capabilities` ➔ **200 OK** (5 capabilités)
*   `GET /api/v2/s3-domains` ➔ **200 OK** (5 domaines)
*   `GET /api/v2/beneficiaries` ➔ **200 OK** (7 bénéficiaires)
*   `GET /api/v2/ecosystems` ➔ **200 OK** (4 écosystèmes)
*   `GET /api/v2/journeys` ➔ **200 OK** (2 parcours)

### Production Live (Avant Déploiement du Correctif)
Le serveur de production actuel renvoie des erreurs 404 car le routeur v2 n'est pas déployé :
*   `GET https://pit-cpsv-ap.onrender.com/api/v2/programs` ➔ **404 Introuvable**
*   `GET https://pit-cpsv-ap.onrender.com/api/v2/capabilities` ➔ **404 Introuvable**

---

## 3. ÉTAPES DE MISE EN PRODUCTION (ACTION REQUISE)

N'ayant pas l'outil `git` disponible dans le PATH système, vous devez effectuer l'envoi vers GitHub pour déclencher le déploiement sur Render :

1.  **Commitez et poussez les fichiers modifiés** sur votre dépôt GitHub :
    - [package.json](file:///c:/Users/Philippe%20Pisetta/Downloads/testing%20CPSV-AP/package.json)
    - [docs/audit/FINAL_DATA_VISIBILITY_ROOT_CAUSE.md](file:///c:/Users/Philippe%20Pisetta/Downloads/testing%20CPSV-AP/docs/audit/FINAL_DATA_VISIBILITY_ROOT_CAUSE.md)
    - [PRODUCTION_POST_DEPLOY_VALIDATION.md](file:///c:/Users/Philippe%20Pisetta/Downloads/testing%20CPSV-AP/PRODUCTION_POST_DEPLOY_VALIDATION.md)
2.  **Surveillez le tableau de bord Render** :
    - Attendez que le statut de déploiement passe à **"Live"** (le build doit compiler en moins de 2 minutes).

---

## 4. TABLEAU DE DIAGNOSTIC POST-DÉPLOIEMENT

Après que le statut sur Render est passé au vert (Live), exécutez les tests et complétez les valeurs suivantes :

| Endpoint | HTTP Status | Count | Temps de réponse | OK/KO |
| :--- | :---: | :---: | :---: | :---: |
| `GET /api/v2/programs` | 200 | 8 | < 300 ms | |
| `GET /api/v2/capabilities` | 200 | 5 | < 150 ms | |
| `GET /api/v2/s3-domains` | 200 | 5 | < 150 ms | |
| `GET /api/v2/beneficiaries` | 200 | 7 | < 300 ms | |
| `GET /api/v2/ecosystems` | 200 | 4 | < 200 ms | |
| `GET /api/v2/journeys` | 200 | 2 | < 300 ms | |

---

## 5. VERIFICATION VISUELLE SUR VERCEL

Une fois le serveur Render opérationnel en v2, ouvrez l'application front-end Vercel (`https://pit-cpsv-ap.vercel.app`) et vérifiez visuellement les cockpits suivants :

| Cockpit / Page | Statut Visuel | Données Affichées | OK/KO |
| :--- | :--- | :--- | :---: |
| `/programs` | Rendu OK (Grille & Détails) | Liste des 8 programmes de financement | |
| `/capabilities` | Rendu OK (Table & Détails) | Liste des 5 capabilités (IoT, Cloud, IA...) | |
| `/s3` | Rendu OK (3 colonnes) | Alignement des domaines, filières et maillons | |
| `/beneficiaries` | Rendu OK (Profil 360°) | Liste des 7 entreprises wallonnes | |
| `/ecosystems` | Rendu OK (Réseaux) | Liste des 4 écosystèmes (EDIH, BioWin...) | |

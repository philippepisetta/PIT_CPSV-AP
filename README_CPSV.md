# 📘 Guide Lab CPSV-AP (PIT Wallonie) - PostgreSQL & Prisma

Bienvenue dans l'environnement de test (Lab) pour l'implémentation du modèle **CPSV-AP** (Core Public Service Vocabulary Application Profile) de la Commission Européenne (**SEMIC**), adapté au contexte de la **PIT (Plateforme d'Intelligence Territoriale) en Wallonie**.

Ce Lab permet de tester de bout en bout la transposition relationnelle sémantique du modèle d'interopérabilité pour modéliser des catalogues de services territoriaux destinés aux entreprises (WE, AWEX, UCM, AdN, AKT, etc.).

---

## 🛠️ Étape 1 : Création de la Base de données sur votre Conteneur Docker Existant

Puisque PostgreSQL s'exécute déjà dans votre conteneur Docker configuré avec les identifiants récupérés (`postgres:postgres` sur le port `5432`), il vous suffit de créer la nouvelle base de données `cpsv_lab` à l'intérieur.

Exécutez l'une de ces méthodes simples depuis votre terminal (Windows, PowerShell ou WSL) :

### Option A : Via une commande CLI Docker (Recommandée & Rapide)
Exécutez cette commande pour créer la base `cpsv_lab` directement dans votre conteneur :
```bash
# Remplacez <nom-du-conteneur> par le nom ou l'ID de votre conteneur existant
docker exec -it <nom-du-conteneur> createdb -U postgres cpsv_lab
```
*(Pour trouver le nom du conteneur en cours d'exécution, vous pouvez faire un simple `docker ps`)*.

### Option B : Via DBeaver, pgAdmin ou votre outil GUI préféré
1. Connectez-vous à votre instance PostgreSQL existante (`localhost:5432`, utilisateur: `postgres`, mot de passe: `postgres`).
2. Créez une nouvelle base de données nommée **`cpsv_lab`**.

---

## 🚀 Étape 2 : Installation & Lancement du Projet Node / Prisma

Ouvrez un terminal dans le répertoire du projet (`c:\Users\Philippe Pisetta\Downloads\testing CPSV-AP`) et exécutez les commandes suivantes :

### 1. Installation des dépendances locales
```bash
npm install
```
*Cette commande installera TypeScript, ts-node, et le moteur Prisma.*

### 2. Pousser le schéma dans PostgreSQL
Appliquez directement la structure relationnelle dans votre nouvelle base de données `cpsv_lab` :
```bash
npx prisma db push
```

### 3. Générer le client Prisma
Générez le client Prisma fortement typé pour le développement :
```bash
npx prisma generate
```

### 4. Alimenter la base de données (Seeding)
Insérez le jeu de données sémantiques et fonctionnels fondé sur les cas d'usage wallons :
```bash
npm run seed
```

---

## 🔍 Étape 3 : Exploration visuelle avec Prisma Studio

Une fois la base peuplée avec succès, lancez l'interface web **Prisma Studio** pour explorer de manière fluide les relations et tables créées :

```bash
npx prisma studio
```
L'interface sera disponible dans votre navigateur à l'adresse : **[http://localhost:5555](http://localhost:5555)**.

---

## 🏛️ Transposition Relationnelle Sémantique (SEMIC CPSV-AP)

Afin de concilier la performance de PostgreSQL (modèle relationnel) et le futur de l'interopérabilité (graphes RDF, JSON-LD, NGSI-LD), chaque entité intègre un champ **`uri` unique** (ex: `https://pit.wallonie.be/id/public-service/diagnostic-maturite-numerique`). Ce champ permet d'exporter les données directement sous forme de graphe sémantique en JSON-LD sans complexité logicielle additionnelle.

### 📋 Mappage des tables implémentées :
*   `organizations` : Représente les **Agents** / **Autorités publiques compétentes** fournissant les services (AdN, WE, AWEX, UCM, etc.).
*   `public_services` : L'entité centrale **PublicService** décrivant l'action publique.
*   `channels` : Les **Channels** ou canaux de délivrance (Web, guichets, réunions individuelles).
*   `target_audiences` : Les **Target Audiences** ciblées (PME, Startup, Indépendants).
*   `business_events` / `life_events` : Les déclencheurs métiers / événements clés guidant l'utilisateur (Transformation digitale, export, création d'entreprise).
*   `requirements` : Les conditions à satisfaire pour avoir droit au service (**Requirement**).
*   `evidences` : Les pièces justificatives ou preuves (**Evidence**) exigées par les exigences (ex: Extrait BCE, certificat).
*   `outputs` : Le livrable produit (**Output**) (ex: Plan stratégique, audit PDF).
*   `costs` : Les aspects financiers liés (**Cost**) (valeurs numériques et devises).
*   `contact_points` : Informations de contact direct (**ContactPoint**).
*   `criterions` & `rules` : Critères d'éligibilité fins et règles juridiques de minimis (**Criterion** et **Rule**).
*   `catalogues` : La structure conteneur (**Dataset / CatalogueReference**) pour l'interopérabilité multilatérale territoriale future.

---

## 🧬 Données de Test Insérées par le Seed (PIT Wallonie)

Le script de seed injecte automatiquement un ensemble complet de relations interconnectées reflétant les cas d'usage réels :

1.  **Agence du Numérique (AdN)** ➡️ Offre le service *« Diagnostic de maturité numérique »* lié à l'événement *« Transformation digitale d'une PME »*. Il exige une preuve de siège d'exploitation en Wallonie via un extrait BCE. Il génère en sortie un *« Rapport de diagnostic »* et est **100% gratuit**.
2.  **Wallonie Entreprendre (WE)** ➡️ Offre l'accompagnement d'un coach numérique (co-financé à 150 €) et le service *« Recherche de financement innovation »* lié à l'événement *« Recherche de financement »*, produisant un *« Dossier de financement structuré »*.
3.  **AWEX** ➡️ Offre le service de *« Support à l'internationalisation digitale »* ciblant l'événement *« Développement international »* et menant à une décision d'octroi de subsides pour l'export.
4.  **UCM** ➡️ Offre l' *« Assistant administratif PME »* facilitant les formalités BCE lors de la création d'entreprise ou de la reprise (Life Event).

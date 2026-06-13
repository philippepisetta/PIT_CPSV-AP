# GUIDE DE L'UTILISATEUR (PIT USER GUIDE)
## Observatoire & Cockpits de la Plateforme d'Intelligence Territoriale

Bienvenue dans le guide utilisateur de la **Plateforme d'Intelligence Territoriale (PIT)**. Ce document vous accompagne pas à pas dans l'utilisation de l'interface de la PIT et vous montre comment exploiter ses cockpits à l'aide de cas d'usage réels issus du tissu industriel wallon.

---

## 🖥️ 1. Navigation Initiale : Le Tableau de Bord Territorial

Lorsque vous vous connectez à la PIT, vous arrivez sur le **Tableau de Bord Territorial** (la page d'accueil). Il s'agit du cockpit de pilotage stratégique de haut niveau.

![Tableau de Bord Territorial](/docs/demo/images/dashboard.png)

### Fonctionnalités Clés :
* **Indicateurs macro-économiques (KPIs)** : Suivi en temps réel du nombre de PME accompagnées, de services CPSV-AP répertoriés, de parcours actifs, et du nombre total de relations sémantiques dans le graphe.
* **Statistiques d'Activités** : Mesure de l'impact collectif (nombre de participants aux workshops, taux de satisfaction moyen) et des missions d'écosystème de deuxième ligne.
* **Distribution Géographique** : Cartographie de la répartition des bénéficiaires par province wallonne (Liège, Namur, Hainaut, Brabant Wallon, Luxembourg).
* **Répartition des Défis** : Diagramme illustrant les principaux défis rencontrés par les PME (Transition Circulaire, IA, Cybersécurité, Export, etc.).

---

## 🏛️ 2. Cockpit des Programmes : Aligner les Politiques Publiques

Pour accéder à ce cockpit, cliquez sur **Programmes** dans la barre latérale. Il liste les grands dispositifs de financement et d'accompagnement de la Wallonie (EDIH, Circular Wallonia, Plan de Relance).

![Cockpit des Programmes](/docs/demo/images/programs.png)

### Comment l'utiliser ?
1. **Filtrer par Thématique** : Utilisez la barre de filtres pour sélectionner un *Axe S3* (ex: Économie Circulaire) ou une *Dimension DR-BEST* (ex: Technology).
2. **Explorer un Programme** : Cliquez sur une ligne de tableau (ex: `PROG-CIRCULAR-DESIGN` - *Circular Design & Materials*).
3. **Onglet "Vue d'ensemble"** : Affiche le budget alloué, le statut du programme et sa description.
4. **Onglet "Hiérarchie S3" (Intervention Tree)** : Affiche l'arborescence des actions publiques associées (Mesure ➔ Initiative ➔ Projet ➔ Action ➔ Activité).
5. **Onglet "Relations Graphe"** : Affiche le réseau local d'impact du programme sous forme de graphe interactif.

### 💡 Cas Pratique : Éco-conception
* **Scénario** : La PME **BioPlast SA** veut migrer ses emballages vers des matériaux bio-sourcés.
* **Dans la PIT** : Le conseiller sélectionne le programme **Circular Design & Materials** (`PROG-CIRCULAR-DESIGN`). Il y découvre les initiatives associées comme le *Coaching en Éco-conception* (`INI-ECODESIGN-COACHING`), piloté par **Wallonie Entreprendre (WE)** et **Sirris**.

---

## 🏢 3. Cockpit des Bénéficiaires : Profil 360° et Radar de Maturité

Sélectionnez **Bénéficiaires** dans le menu latéral. Ce cockpit permet aux conseillers d'avoir une vision globale de la maturité des entreprises et de concevoir leur feuille de route d'accompagnement.

![Cockpit des Bénéficiaires](/docs/demo/images/beneficiaries.png)

### Fonctionnalités Clés :
1. **Fiche d'identité** : Numéro BCE légal de la PME, taille, effectifs et localisation.
2. **Le Radar DR-BEST** : Visualisation sous forme de graphique des scores de maturité de l'entreprise sur les 6 dimensions (Data, Remote, Business, Ecosystem, Skills, Technology).
3. **Onglet "Parcours PIT"** : Affiche la progression en pourcentage sur les parcours enrôlés.
4. **Onglet "Historique"** : Journal de bord chronologique des diagnostics et prestations délivrées à l'entreprise par les différents opérateurs du territoire (CETIC, Sirris, AdN, WE).

### 💡 Cas Pratique : Cybersécurité
* **Scénario** : **Menuiserie Dupont** (TPE de 8 ETP à Namur) a subi une cyberattaque et doit sécuriser ses machines à commande numérique.
* **Dans la PIT** : Son profil affiche des scores de maturité très bas sur les axes **Cyber (C)** et **Technology (T)**. Le conseiller l'enrôle dans le parcours **Cybersécurité PME** (`JOURNEY-CYBERSECURITY`). Les jalons de son accompagnement y sont tracés chronologiquement.

---

## 📄 4. Cockpit des Services : Catalogue Unifié CPSV-AP

Cliquez sur **Services** pour consulter le catalogue sémantique des aides régionales.

![Cockpit des Services](/docs/demo/images/services.png)

### Comment l'utiliser ?
* **Rechercher un Service** : Tapez un mot-clé (ex: "ia", "cyber", "éco") dans la barre de recherche.
* **Inspecter les Métadonnées CPSV-AP** : Cliquez sur un service (ex: `S-DIAG-CYBER` - *Diagnostic Cybersécurité PME*).
  * **Opérateur responsable** : L'organisation qui délivre le service (ex: CETIC).
  * **Canaux & Coûts** : Guichet physique, rendez-vous en ligne, chèque entreprise.
  * **Résultats attendus** : Les `Outputs` (ex: Rapport d'audit de vulnérabilité) et les `Outcomes` théoriques (ex: Plan d'action de sécurité).

---

## 🛤️ 5. Cockpit des Parcours : Chemins de Transformation

Le cockpit **Parcours** structure l'enchaînement des aides publiques pour guider pas à pas les PME vers des cibles de maturité élevées.

![Cockpit des Parcours](/docs/demo/images/journeys.png)

### Comment l'utiliser ?
* **Modélisation** : Visualisez les modèles de parcours types (`JourneyTemplate`) comme le *Parcours Circularité* ou le *Parcours Cybersécurité*.
* **Étapes du Parcours** : Chaque parcours est découpé en étapes chronologiques standardisées (Sensibilisation ➔ Diagnostic ➔ Coaching ➔ Expérimentation ➔ Déploiement ➔ Suivi).
* **Assignation des Services** : À chaque étape, des services CPSV-AP précis sont affectés pour guider le conseiller dans sa prescription.

---

## 🕸️ 6. Cockpit du Graphe : Territorial Knowledge Graph

Cliquez sur **Visualisation Graphe** dans le menu latéral. C'est l'outil de Business Intelligence sémantique de la PIT.

![Visualisation Graphe](/docs/demo/images/graph.png)

### Fonctionnalités Clés :
* **Rendu Réseau Interactif** : Affiche les entités sous forme de nœuds reliés par des arcs dynamiques.
* **Légende colorée par type de concept** :
  * Nœuds roses : Écosystèmes.
  * Nœuds violets : Opérateurs et PME.
  * Nœuds bleus : Défis et Métadonnées.
  * Nœuds oranges : Territoires géographiques.
* **Exploration visuelle** : Cliquez sur un nœud pour mettre en surbrillance ses connexions immédiates (prédicats sémantiques comme `LOCATED_IN`, `PROVIDES`, `ACCELERATES`, `ADDRESSES`).

---

## 🌐 7. Cockpits Complémentaires

### 7.1 L'Observatoire S3 (`/s3`)
Fournit une vue sur l'alignement des aides régionales avec les domaines de Spécialisation Intelligente de la Wallonie (Agroalimentaire durable, Économie Circulaire, Numérique, Biotech, Santé, Énergie).

![Observatoire S3](/docs/demo/images/s3.png)

### 7.2 Le Cockpit DR-BEST (`/drbest`)
Fournit des statistiques d'impact agrégées sur l'évolution globale de la maturité des PME wallonnes sur les 6 dimensions du référentiel européen.

![Cockpit DR-BEST](/docs/demo/images/drbest.png)

### 7.3 Le Cockpit Écosystèmes (`/ecosystems`)
Cartographie les structures de coopération régionale telles que l'**EDIH Wallonia** ou le **Circular Wallonia Network**, en affichant la liste des opérateurs membres, les territoires de couverture, et les indicateurs d'impact du réseau.

![Cockpit Écosystèmes](/docs/demo/images/ecosystems.png)

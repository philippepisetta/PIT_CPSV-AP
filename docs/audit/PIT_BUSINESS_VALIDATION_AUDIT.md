# AUDIT DE VALIDATION MÉTIER PIT (PIT BUSINESS VALIDATION AUDIT)

Ce document présente l'analyse de conformité de l'implémentation actuelle de la Plateforme d'Intégration Territoriale (PIT) par rapport au modèle métier de référence (V10 / Target PIT Architecture). Cet audit se concentre exclusivement sur les aspects fonctionnels, sémantiques et métiers du système.

---

## 1. PROGRAM CHAIN (Chaîne d'Exécution)
**Modèle Cible** : `Program ➔ Project ➔ Action ➔ Activity`

*   **Visibilité** : **Excellente**. La chaîne d'exécution est visible dans le cockpit des programmes (`/programs`) via le tiroir de détails d'un programme sélectionné. Les relations physiques de la base de données (Prisma) sont correctement exploitées.
*   **Navigabilité** : **Très bonne**. La navigation se fait par drilldown (clic sur un Projet ➔ déplie ses jalons d'Actions ➔ déplie ses Activités d'exécution). 
*   **Compréhensibilité** : **Très bonne**. Le découpage sémantique permet de comprendre immédiatement comment les fonds alloués à un programme (ex: EDIH WallonIA) se traduisent concrètement par des projets chez les bénéficiaires, jalonnés par des actions et matérialisés par des activités d'accompagnement (diagnostics, workshops).
*   **Manque Métier** : Il manque une vue tabulaire consolidée à l'échelle du programme permettant de voir d'un seul coup d'œil l'état d'avancement (complétude des jalons d'action) de tous les projets associés, sans devoir faire un drilldown individuel par projet.

---

## 2. SERVICE CHAIN (Chaîne d'Alignement)
**Modèle Cible** : `Challenge ➔ Capability ➔ Service ➔ Journey ➔ Beneficiary`

*   **Visibilité** : **Excellente**. L'alignement logique est pleinement matérialisé dans le cockpit des bénéficiaires (`/beneficiaries`) sous l'onglet **"Parcours PIT"**.
*   **Navigabilité** : **Excellente**. Chaque brique de l'alignement (Capability, Service, Journey) est cliquable et redirige instantanément l'utilisateur vers la fiche détaillée correspondante du cockpit associé, permettant une navigation fluide.
*   **Compréhensibilité** : **Maximale**. C'est le cœur de l'alignement sémantique du modèle PIT. On comprend immédiatement pourquoi une entreprise (Bénéficiaire) s'engage dans un parcours (Journey) pour consommer un service public (Service) afin d'acquérir une aptitude (Capability) répondant à son problème d'affaires (Challenge).
*   **Manque Métier** : Le cockpit des services (`/services`) n'expose pas visuellement cette chaîne complète de manière ascendante (remonter du service vers le challenge).

---

## 3. BENEFICIARY CHAIN (Vue 360° du Bénéficiaire)
**Modèle Cible** : `Beneficiary ➔ Services | Journeys | Programs | Projects | Actions | Activities`

*   **Visibilité & Consolidation** : **Excellente**. Le cockpit `/beneficiaries` propose une vue à 360° complète grâce à deux onglets structurés :
    1.  *Parcours PIT* : Alignement sémantique théorique.
    2.  *Programmes & Projets* : Chaîne d'exécution opérationnelle.
    3.  *Impact & Diagnostics* (via `PITImpactPanel`) : Évolution de sa maturité.
*   **Navigation** : L'accès aux détails des services reçus, des parcours suivis et des programmes associés est direct.
*   **Compréhensibilité** : Très élevée. On dispose d'une fiche signalétique claire de la PME (taille, ETP, CA, NACE) corrélée à son profil de maturité de départ et à l'impact réel des interventions publiques.

---

## 4. ORGANIZATION CHAIN (Chaîne des Acteurs)
**Modèle Cible** : `Organization ➔ Services | Programs | Ecosystems | Territories`

*   **Visibilité** : **Excellente**. Le cockpit `/organizations` structure l'ensemble des relations institutionnelles de l'acteur public ou privé (opérateurs, universités, administrations, clusters).
*   **Navigabilité** : La fiche détaillée `/organizations` permet de naviguer vers les services qu'elle propose, les programmes qu'elle pilote, et ses écosystèmes et territoires d'impact.
*   **Compréhensibilité** : Parfaite pour cartographier le réseau d'acteurs de l'innovation wallonne.
*   **Manque Métier** : Il n'y a pas de distinction claire dans l'interface entre les services proposés en propre par l'organisation et ceux qu'elle délègue à des tiers ou des partenaires.

---

## 5. ECOSYSTEM CHAIN (Chaîne Écosystémique)
**Modèle Cible** : `Challenge ➔ Capability ➔ Service ➔ Journey ➔ Beneficiary` au sein d'un écosystème

*   **Visibilité** : **Excellente**. Le cockpit `/ecosystems` consolidé affiche l'intégralité des dimensions au sein de l'écosystème territorial sélectionné (ex: Hub BioWin ou EDIH).
*   **Compréhensibilité** : L'onglet de détail permet de visualiser comment l'écosystème fédère ses acteurs (centres de recherche, entreprises), ses services d'accompagnement, et ses défis d'affaires.

---

## 6. GRAPH READINESS (Graphe de Connaissance)
**Analyse de `PITGraphView`** :

*   **Relations affichées** : L'API `/api/v2/graph/*/:id` génère un sous-graphe local de relations à 1 niveau (ex: pour un programme ➔ affiche l'organisation propriétaire et ses projets associés ; pour un service ➔ affiche l'organisation, les challenges et la valeur S3).
*   **Limites métiers** :
    1.  Le graphe est local et segmenté. Il n'y a pas de vue globale permettant de naviguer visuellement de nœud en nœud à travers toute la base de connaissances (ex: double-cliquer sur un projet dans le graphe du programme pour charger son sous-graphe).
    2.  Les relations faibles transverses (mises en œuvre via `EntityRelation`) ne sont pas encore projetées dans le visualiseur de graphe.

---

## 7. RECOMMENDER READINESS (Moteur de Recommandation)

Les structures actuelles sont-elles suffisantes pour construire le moteur de recommandation du Sprint 6 ?
*   **DR-BEST & S3 Classification** : **Oui, largement**. L'alignement systématique des PME (maturité de départ) et des services publics sur les 6 dimensions (Data, Remote, Business, Ecosystem, Skills, Technology) et les 3 niveaux S3 fournit les métadonnées indispensables pour calculer la pertinence.
*   **Contributions & ImpactPanel** : **Oui**. Le payload unifié `/contributions` calcule en temps réel les signatures d'impact de chaque entité. Il permet au moteur de recommandation de faire correspondre le profil de carence d'une PME (ex: maturité IA faible + challenge IA) avec la signature d'impact d'un service (ex: impact IA fort).
*   **Verdict** : Le socle de données et d'APIs v2 est prêt à 100% pour accueillir l'intelligence de recommandation.

---

## 8. USER JOURNEY REVIEW (Simulation de Parcours Utilisateurs)

### 8.1 Wallonie Entreprendre (WE)
*   *Objectif* : Mesurer l'impact des financements injectés dans les programmes sur la transition numérique des PME.
*   *Parcours* : WE navigue dans `/programs` pour analyser les budgets alloués, puis dans `/beneficiaries` pour observer les deltas de maturité.
*   *Manques* : Pas d'historisation chronologique des courbes de maturité par entreprise (seul le score de maturité instantané actuel est visible).

### 8.2 AWEX
*   *Objectif* : Identifier les PME wallonnes prêtes pour l'exportation.
*   *Parcours* : AWEX consulte le cockpit `/beneficiaries` pour cibler les entreprises ayant une maturité Export élevée (ex: > 3/5).
*   *Manques* : Absence de filtres multicritères sur les scores de maturité dans la vue liste des bénéficiaires (la recherche ne se fait que par texte).

### 8.3 SPW (Administration)
*   *Objectif* : Piloter et auditer l'exécution de la Fiche 138.
*   *Parcours* : SPW suit la hiérarchie opérationnelle des projets et actions dans `/programs`.
*   *Manques* : Pas d'alertes ou de système de notifications visuelles en cas d'activité en retard ou de jalon d'action non complété après la date butoir.

### 8.4 EDIH (Hub d'innovation)
*   *Objectif* : Guider une PME à travers un parcours complet.
*   *Parcours* : L'opérateur EDIH utilise le "Parcours PIT" dans `/beneficiaries` pour structurer l'accompagnement.
*   *Manques* : Manque d'indicateurs visuels sur le statut d'avancement physique de la PME dans son parcours (ex: "Diagnostic signé ➔ Diagnostic en cours ➔ Terminé").

### 8.5 PIT (Administrateur Plateforme)
*   *Objectif* : Auditer la qualité et la complétude des données.
*   *Parcours* : PIT observe l'onglet "Gouvernance des données" de `PITImpactPanel`.
*   *Manques* : Lecture seule des indicateurs de gouvernance. Pas de possibilité de lancer un re-calcul ou un rafraîchissement manuel de la qualité des données depuis l'IHM.

---

## 9. GAP ANALYSIS (Analyse des Écarts)

### Critique (Bloquant pour le déploiement de la gouvernance)
*   *Filtres de maturité absents* : Impossibilité pour les opérateurs (AWEX, WE) de filtrer la liste des PME par niveau de maturité (IA, Export, etc.) pour mener des campagnes ciblées.

### Important (Nuisible à l'efficacité opérationnelle)
*   *Graphe segmenté (Lecture seule à 1 niveau)* : Pas de navigation sémantique interactive fluide à travers le réseau global.
*   *Suivi d'avancement des jalons* : Absence de vue consolidée des jalons d'actions et retards pour l'administration (SPW).

### Cosmétique (Confort visuel)
*   *Visualisation des deltas de maturité* : Présentation sous forme brute au lieu de graphes d'évolution temporelle.

---

## 10. ROADMAP DE CORRECTION (Sprint 5 / 6)

### Phase 1 : Filtres multicritères de Maturité (Sprint 5 - Assessment)
*   Ajouter dans la barre de filtres `/beneficiaries` des curseurs de sélection pour filtrer les entreprises par maturité (ex: IA < 2, Export > 3).

### Phase 2 : Tableaux de Bord d'Avancement SPW (Sprint 5)
*   Intégrer dans `/programs` une table d'avancement global des projets listant le taux de complétude des actions et mettant en évidence les retards.

### Phase 3 : Graphe Interactif Multi-niveaux (Sprint 6 - Knowledge Graph)
*   Permettre la navigation fluide au clic dans `PITGraphView` pour recharger dynamiquement le graphe centré sur le nouveau nœud sélectionné.

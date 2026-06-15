# Spécification du Minimum Adoptable Product (MAP) – PIT vNext

Ce document définit le **Minimum Adoptable Product (MAP)**, c'est-à-dire la version la plus épurée et la plus pragmatique de la PIT vNext qu'un opérateur réel accepterait d'utiliser quotidiennement dès son déploiement, en éliminant les fonctionnalités perçues comme trop complexes ou redondantes.

---

## 🇪🇺 1. EDIH : Le MAP de Diagnostic
Pour les EDIH, la PIT doit se limiter à un outil d'accompagnement numérique simple et direct.

* **Version Minimale Acceptable** :
  * Un écran de diagnostic numérique (**DR-BEST**) clair.
  * Un moteur de recommandation de premier niveau reliant le diagnostic au catalogue de services publics.
  * Un export PDF simple pour le reporting Commission Européenne.
* **Fonctionnalités Obligatoires** : Questionnaire DR-BEST, matching de services, Journey Progress de base.
* **Fonctionnalités Facultatives** : Modélisation des relations sémantiques complexes.
* **Fonctionnalités Inutiles (À masquer pour EDIH)** : Consortium Builder, pilotage stratégique S3.

---

## 👥 2. Pôles & Clusters : Le MAP de Consortium & Gaps
Pour les pôles et clusters, la PIT est un accélérateur de montage de projets collaboratifs et de pilotage de filière.

* **Version Minimale Acceptable** :
  * Le **Consortium Builder** pour assembler rapidement des consortiums de R&D multipartenaires.
  * Le **Value Chain Explorer** pour visualiser les gaps de filières sous forme de feux tricolores (Vert/Orange/Rouge).
  * L'annuaire qualifié des membres et de leurs compétences clés.
* **Fonctionnalités Obligatoires** : Création de consortiums, indexation de défis (gaps), catalogue de services, Graph Explorer (WOW UX de présentation).
* **Fonctionnalités Facultatives** : Calcul de la maturité individuelle des grandes entreprises.
* **Fonctionnalités Inutiles (À masquer pour les Pôles)** : Les questionnaires européens DMA complexes (hors EDIH).

---

## 💼 3. WE (Wallonie Entreprendre) : Le MAP Financier Passif
Pour WE, la PIT doit être un cockpit de lecture d'impact déconnecté des outils transactionnels d'investissement.

* **Version Minimale Acceptable** :
  * Un dashboard de type "Lecture Seule" agrégeant le ROI d'impact territorial des subventions (SUM financements, outcomes obtenus).
  * L'accès aux justificatifs certifiés (Evidences) pour valider la réalité des résultats.
* **Fonctionnalités Obligatoires** : Dashboard d'impact consolidé, registre des preuves (APPROVED), filières S3.
* **Fonctionnalités Facultatives** : Le moteur de matchmaking R&D.
* **Fonctionnalités Inutiles (À masquer pour WE)** : Les interfaces opérationnelles d'animation de communautés et de cercles thématiques.

---

## 🏛️ 4. SPW : Le MAP Stratégique Exécutif
Pour le SPW, la PIT est le cockpit de décision macro-économique de la Wallonie.

* **Version Minimale Acceptable** :
  * Le **Strategic Framework Explorer** pour visualiser le lignage direct de la S3 aux résultats de terrain.
  * Le registre d'audit des preuves d'impact (Evidence Audit Board).
  * La carte globale des gaps industriels et territoriaux de la Wallonie.
* **Fonctionnalités Obligatoires** : Arbre stratégique S3, KPI Headers obligatoires, diagnostics de gaps territoriaux.
* **Fonctionnalités Facultatives** : L'espace de diagnostics de maturité des entreprises individuelles.
* **Fonctionnalités Inutiles (À masquer pour le SPW)** : Les outils opérationnels d'animation et d'événementiel des clusters.

---

## 📊 5. Synthèse des Fonctionnalités du MAP

| Module Fonctionnel | Statut EDIH | Statut Pôle | Statut WE | Statut SPW |
| :--- | :---: | :---: | :---: | :---: |
| **Workspace Switcher** | **Obligatoire** | **Obligatoire** | **Obligatoire** | **Obligatoire** |
| **Diagnostics DR-BEST** | **Obligatoire** | Facultatif | Inutile | Inutile |
| **Moteur Matchmaking** | **Obligatoire** | **Obligatoire** | Inutile | Inutile |
| **Consortium Builder** | Inutile | **Obligatoire** | Inutile | Inutile |
| **Value Chain Explorer** | Inutile | **Obligatoire** | Facultatif | **Obligatoire** |
| **Gap Analysis** | Inutile | **Obligatoire** | Facultatif | **Obligatoire** |
| **Evidence Audit Board** | Facultatif | **Obligatoire** | **Obligatoire** | **Obligatoire** |
| **Strategic Tree S3** | Inutile | Facultatif | **Obligatoire** | **Obligatoire** |

# 🏁 Plateforme d'Intelligence Territoriale (PIT) — Validation Finale du Modèle Métier

## Document de Référence de l'Architecture de Données & du Knowledge Graph (v1.2)

Ce document constitue la **référence officielle, finale et définitive** pour le gel du modèle de données de la Plateforme d'Intelligence Territoriale (PIT). Il présente les arbitrages métiers et d'architecture requis pour clore la phase de conception avant d'entamer l'implémentation physique (Sprint 4).

Ce document statue de manière définitive sur la simplification de la gouvernance programmatique, la modélisation des événements CPSV-AP, le statut de la Capabilité, le sous-système d'évaluation et de benchmarking, l'intégration du référentiel NACE, la gestion des preuves d'audits (`Evidence`), et le choix de l'architecture du Knowledge Graph.

---

## 🗺️ 1. Validation de la Gouvernance Programmatique

Pour structurer la gouvernance stratégique régionale et les projets d'accompagnement en base de données, deux modélisations ont été comparées :

*   **Modèle A (Hiérarchique / Administratif V10)** : `Strategy ➔ StrategicPriority ➔ Program ➔ Measure ➔ Initiative ➔ Project`
*   **Modèle B (Générique / Opérationnel Simplifié Cible)** : `Strategy ➔ Program ➔ Project ➔ Action ➔ Activity`

### Analyse d'Adéquation avec les Cas d'Usage de la Wallonie et de l'Europe

| Programme / Dispositif Réel | Modélisation selon le Modèle A (V10) | Modélisation selon le Modèle B (Cible Rétrocompatible) |
| :--- | :--- | :--- |
| **EDIH WallonIA** | EDIH ➔ Priorité Digitale ➔ Programme EDIH ➔ Mesure TBI ➔ Accompagnement PME ➔ Fiche Projet. (Sur-dimensionné) | **`Program`** : EDIH WallonIA<br>**`Project`** : Diagnostic & POC Cyber de la PME X<br>**`Action`** : Réunion de cadrage ➔ Audit ➔ Test de vulnérabilités<br>**`Activity`** : Passation du DMAT (activité individuelle) |
| **Fiche 138 PIT** | Plan Relance ➔ Priorité Interopérabilité ➔ Projet Fiche 138 ➔ Tâches de développement. (Trop rigide) | **`Strategy`** : Plan de Relance de la Wallonie (PRW)<br>**`Program`** : Fiche 138 (Déploiement Plateforme PIT)<br>**`Project`** : Module Sémantique & Matchmaking (AdN/WE)<br>**`Action`** : Gel du modèle ➔ Codage Prisma ➔ Seed BDD<br>**`Activity`** : Comité éditorial sémantique (activité collective) |
| **Data4Wallonia** | Stratégie Data ➔ Priorité Valorisation ➔ Fiche Data4Wallonia ➔ Audit de données. | **`Strategy`** : Wallonie Data Space (Stratégie Data Régionale)<br>**`Program`** : Data4Wallonia (Programme de valorisation Open Data)<br>**`Project`** : Audit de qualité de données de l'Opérateur Y<br>**`Action`** : Cartographie des datasets ➔ Passage de la grille de qualité<br>**`Activity`** : Publication du catalogue DCAT-AP (activité de publication) |
| **TART IA** | Stratégie IA ➔ DigitalWallonia4.ai ➔ Dispositif TART IA ➔ Audit ROI express PME. | **`Strategy`** : Stratégie IA Wallonie (DigitalWallonia4.ai)<br>**`Program`** : TART IA (Diagnostic express ROI de l'IA PME)<br>**`Project`** : Diagnostic IA express de la PME Z<br>**`Action`** : Entretien de cadrage IA ➔ Simulation de ROI<br>**`Activity`** : Livraison du rapport d'éligibilité IA (activité de diagnostic) |
| **Digital Wallonia** | Stratégie ➔ Priorité sectorielle ➔ Programme thématique ➔ Mesure chèque ➔ Accompagnement. | **`Strategy`** : Wallonie Numérique (Digital Wallonia)<br>**`Program`** : Tremplin Cyber / Start IA<br>**`Project`** : Projet de sécurisation de la PME W<br>**`Action`** : Installation firewall ➔ Configuration règles de sécurité<br>**`Activity`** : Audit de conformité final (activité individuelle) |
| **Circular Wallonia** | Économie Circulaire ➔ Axe de tri ➔ Programme Chèques ➔ Projet Pilote ➔ Prestation. | **`Strategy`** : Circular Wallonia (Plan d'action régional)<br>**`Program`** : Portefeuille d'aides à l'éco-conception<br>**`Project`** : Projet pilote de recyclage de la PME V<br>**`Action`** : Conception moule recyclable ➔ Test de résistance<br>**`Activity`** : Audit de circularité matières (activité individuelle) |
| **FEDER** | Axe FEDER ➔ Mesure FEDER ➔ Portefeuille ➔ Projet de consortium. | **`Strategy`** : Axe prioritaire FEDER (ex: Innovation)<br>**`Program`** : Portefeuille FEDER (ex: R&D Wallonie)<br>**`Project`** : Projet collaboratif de recherche (Consortium)<br>**`Action`** : Jalons de Work Packages et rapports d'avancement<br>**`Activity`** : Livrables techniques et dépenses (activités collectives) |
| **Horizon Europe** | HE ➔ Pillar ➔ Cluster ➔ Work Programme ➔ Call ➔ Project. | **`Strategy`** : Horizon Europe (Pillar II)<br>**`Program`** : Cluster 4 Digital (Niveaux d'appels à projets)<br>**`Project`** : Projet collaboratif de recherche (Consortium européen)<br>**`Action`** : Livrables des Work Packages (WP1, WP2...)<br>**`Activity`** : Réunions de consortium et validations techniques |

### Décision d'Arbitrage et Justification :
Le **Modèle B (Générique / Opérationnel Simplifié)** est officiellement validé comme la structure unique de la PIT.
*   *Justification* : Ce modèle permet de représenter l'ensemble des cas d'usages wallons et européens sans aucune création d'entité physique spécifique supplémentaire. Les concepts de *StrategicPriority* ou de *Measure* de la V10 sont supprimés en tant que tables physiques pour éviter des jointures SQL lentes à 6 niveaux. Leurs données qualificatives sont intégrées directement au modèle `Program` sous forme de métadonnées sémantiques (tri, tags) ou via des liaisons légères dans le Knowledge Graph (`EntityRelation`).

---

## ❓ 2. Business Event / Life Event / Challenge

Pour orienter efficacement une PME dans le Territorial Knowledge Graph, nous structurons et distinguons formellement trois concepts sémantiques :

1.  **`BusinessEvent`** (Événement d'affaires) : Action opérationnelle, déclenchée volontairement par l'entreprise (le **"QUOI faire"**).
    *   *Rôle Métier* : Capturer l'intention immédiate pour l'orienter sémantiquement vers les solutions.
    *   *Exemples* : Exporter, Recruter, Lever des fonds, Numériser, Décarboner, Industrialiser.
2.  **`LifeEvent`** (Événement de cycle de vie) : Jalon temporel ou transition structurelle dans le développement de l'entreprise (le **"QUAND"**).
    *   *Rôle Métier* : Segmenter le degré de maturité global et la phase temporelle de la PME.
    *   *Exemples* : Créer une entreprise, Transmettre / Céder la structure, Croissance rapide.
3.  **`Challenge`** (Défi métier) : Obstacle technique, difficulté ou besoin de transformation structurelle à résoudre (le **"POURQUOI"** ou le problème sous-jacent).
    *   *Rôle Métier* : Expression du besoin technique/affaires à résoudre par l'offre de services.
    *   *Exemples* : Adopter l'IA, Sécuriser mes serveurs, Recycler mes déchets.

### Analyse de la relation entre `BusinessEvent` et `Challenge` :
Ces deux concepts sont **complémentaires et connectés sémantiquement, mais ne sont ni redondants ni hiérarchiques**.
*   L'événement (`BusinessEvent` ou `LifeEvent`) exprime **l'intention de la PME** ("Je veux Exporter").
*   Le défi (`Challenge`) exprime **le problème ou l'obstacle** qui fait face à cette intention ("J'ai un défi de conformité réglementaire" ou "J'ai un manque de compétences en interne").
*   *Liaison dans le graphe* :
    `BusinessEvent (Exporter)` ➔ `:triggersChallenge` ➔ `Challenge (Conformité douanière)` ➔ `:requiresCapability` ➔ `Capability (Regulatory Compliance)` ➔ `:resolvedByService` ➔ `PublicService (Audit Douanes)`.
    Cette complémentarité est indispensable pour concevoir une orientation de précision.

---

## 🧠 3. Décision d'Architecture sur le Graphe de Connaissances

Deux approches de conception de graphe de connaissances ont été évaluées pour structurer la base de données :

### OPTION A : Knowledge Graph Pur (Toutes les relations via `EntityRelation`)
Toutes les liaisons entre entités sont dynamiques et stockées dans une table de jointure générique unique.
*   *Avantages* : Souplesse sémantique totale, pas de contraintes d'intégrité SQL dures, schéma physique statique.
*   *Inconvénients* :
    *   Perte de l'intégrité référentielle native de PostgreSQL (pas d' `on delete cascade` physique).
    *   Performances SQL médiocres pour les navigations applicatives de base (ex: charger les étapes d'un parcours exige d'interroger la table générique puis de faire des jointures manuelles en JS).
    *   Absence de typage strict des relations dans Prisma Client.
*   *Performance / Maintenabilité* : Faible / Difficile.
*   *Compatibilité Recommender* : Excellente.

### OPTION B : Knowledge Graph Hybride (Relations fortes Prisma native, relations transverses faibles via `EntityRelation`)
Découplage strict. Les relations de structure et de cycle de vie sont codées en dur (natively Prisma-backed). Les relations de classification sémantique et de matchmaking sont gérées dynamiquement (via `EntityRelation`).
*   *Avantages* :
    *   Performances SQL optimales grâce aux clés étrangères indexées par le moteur relationnel.
    *   Intégrité référentielle absolue garantie par PostgreSQL.
    *   Typage strict des entités de base dans Prisma.
    *   Flexibilité préservée pour les algorithmes du Recommender Engine via la table `EntityRelation`.
*   *Inconvénients* : Requiert de distinguer clairement la nature de chaque relation lors de la conception.
*   *Performance / Maintenabilité* : Excellente / Excellente.
*   *Compatibilité Recommender* : Excellente.

### Décision Arbitrée :
L'**Option B (Knowledge Graph Hybride)** est officiellement retenue.
*   *Justification* : Elle offre le meilleur compromis en garantissant la robustesse transactionnelle et les performances d'affichage de l'application V10 via Prisma, tout en offrant la flexibilité sémantique nécessaire au moteur de recommandation territoriale.

---

## 📊 4. Section : Program Mapping Validation

Ce tableau démontre comment le modèle unique `Strategy ➔ Program ➔ Project ➔ Action ➔ Activity` permet de modéliser les 5 dispositifs territoriaux majeurs sans création d'entités spécifiques :

| Concept PIT | EDIH WallonIA | PIT (Fiche 138) | Circular Wallonia | TART IA | Digital Wallonia |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`Strategy`** | Digital Wallonia | Plan de Relance (PRW) | Circular Wallonia | DigitalWallonia4.ai | Digital Wallonia |
| **`Program`** | EDIH WallonIA | Fiche 138 | Chèques Circulaires | TART IA | Tremplin Cyber |
| **`Project`** | Accompagnement de la PME X | Module Sémantique (AdN) | Diagnostic PME Y | Diagnostic IA PME Z | Sécurisation PME W |
| **`Action`** | Diagnostic DMAT | Conception du schéma | Cartographie flux | Session cadrage IA | Configuration Pare-feu |
| **`Activity`** | Prestation du DMAT (individuelle) | Comité éditorial (collective) | Audit de circularité (individuelle) | Livraison rapport (individuelle) | Audit de conformité (individuelle) |

---

## 📝 5. Complétions des Modèles d'Évaluation, Benchmarking et Preuves

### A. Modèle d'Évaluation (Assessment)
*   **`FrameworkVersion`** : Table gérant l'évolution des versions de référentiels (ex: DMAT 2025 vs DMAT 2028).
*   **`AssessmentSource`** : Enum typant l'origine (`SELF_ASSESSMENT`, `EXPERT_AUDIT`, `API_IMPORT`, `ALGORITHMIC_MATCH`).
*   **`AssessmentConfidence`** : Flottant de `0.0` (déclaratif) à `1.0` (certifié par auditeur) qualifiant la confiance du score.
*   **`AssessmentReviewer`** : Organisation ou expert responsable de la validation de l'audit.
*   **`AssessmentMethod`** : Enum gérant la méthode (`ONLINE`, `INTERVIEW`, `TECHNICAL_SCAN`, `ALGORITHMIC_CALCULATION`).

### B. Modèle de Benchmarking
*   **`BenchmarkGroup`** : Cohorte de comparaison (ex : PME du Hainaut du secteur NACE 24) définie par des critères JSON.
*   **`BenchmarkDimension`** : L'axe de comparaison (correspondant à la `Capability` évaluée).
*   **`BenchmarkScore`** : Valeurs agrégées de la cohorte (moyenne, médiane, écart-type).
*   **`BenchmarkPercentile`** : Distribution des centiles (25%, 50%, 75%, 90%) pour situer l'entreprise par rapport à ses pairs.
*   **`BenchmarkComparison`** : Objet de positionnement instantané de la PME.
*   **`BenchmarkSnapshot`** : Historisation du positionnement de la PME au fil du temps.

### C. Référentiel NACE
*   **`NaceSector`** : Taxonomie externe officielle référencée en base de données.
*   **Segmentation** : Le rattachement au code NACE principal (`primaryNaceSectorId`) est obligatoire pour toute PME afin d'assurer la cohérence du benchmark, de la recommandation, du reporting SPW et des audits de maturité.

### D. Modèle d'Evidence (Preuves)
*   **`Evidence`** : Justificatif physique ou preuve d'audit.
    *   *Attributs* : `uri`, `name`, `description`, `file` (chemin blob), `url` (lien externe).
    *   *Enums* : `type` (`DOCUMENT`, `CERTIFICATE`, `SCREENSHOT`...), `source` (`USER_UPLOAD`, `AUDITOR_CERTIFIED`...), `status` (`SUBMITTED`, `APPROVED`, `REJECTED`).
    *   *Raccordements* : `AssessmentResult` (justifie les scores), `Activity` (prouve les réalisations), `Requirement` (prouve l'éligibilité).

---

## 🏁 6. Matrice de Stabilisation Finale des Entités PIT

Voici l'inventaire final gelé de l'ensemble des entités physiques de la base de données PIT :

| Entité Cible | Statut | Rôle de l'Entité |
| :--- | :---: | :--- |
| **`BaseEntity`** | **Créée (Conceptuel)** | Modèle d'attributs sémantiques obligatoires pour l'interopérabilité. |
| **`EntityRelation`** | **Créée** | Table de stockage des arcs du Territorial Knowledge Graph. |
| **`Organization`** | **Conservée** | Opérateurs et coordinateurs. Alignée sur W3C ORG. |
| **`Beneficiary`** | **Conservée** | Profil PME (Les 5 colonnes legacy sont marquées `@deprecated` pour compatibilité V10). |
| **`NaceSector`** | **Conservée** | Classification Eurostat de l'activité économique (Segment obligatoire). |
| **`PublicService`** | **Conservée** | Fiche descriptive standardisée CPSV-AP. |
| **`JourneyTemplate`** | **Renommée** | Anciennement `Journey` (Modèle Compass de parcours). |
| **`JourneyStage`** | **Conservée** | Étape théorique d'un parcours. |
| **`JourneyEnrollment`** | **Conservée** | Suivi de l'engagement réel d'une PME dans un parcours. |
| **`JourneyTrigger`** | **Créée** | Conditions de déclenchement d'un parcours en base de données. |
| **`JourneyRecommendationRule`**| **Créée** | Règles métier de matching des parcours. |
| **`Program`** | **Conservée** | Dispositif régional. **Absorbe `StrategicPriority` et `Measure`**. |
| **`Project`** | **Conservée** | Initiative d'innovation ou dossier d'accompagnement de PME. |
| **`Action`** | **Renommée** | Anciennement `ActionInstance` (Jalons de projets). |
| **`Activity`** | **Fusionnée** | **Unifie `ServiceDelivery`, `CollectiveDelivery` et `SecondLineMission`** (discriminant `activityType`). |
| **`Challenge`** | **Renommée** | Anciennement `BusinessChallenge` (Défis d'affaires). |
| **`ChallengeCategory`** | **Créée** | Catégorisation des défis métiers. |
| **`Capability`** | **Renommée** | Anciennement `CapabilityDimension`. Devient un nœud central pivot. |
| **`S3Domain`** | **Créée** | Premier niveau de la hiérarchie S3 de la Wallonie. |
| **`ValueChain`** | **Renommée** | Anciennement `StrategicValueChain` (Filières S3). |
| **`ValueChainStage`** | **Conservée** | Maillons opérationnels d'innovation S3. |
| **`Ecosystem`** | **Conservée** | Hubs régionaux (EDIH, Clusters...). |
| **`EcosystemType`** | **Conservée** | Nomenclatures d'écosystèmes. |
| **`EcosystemMembership`** | **Conservée** | Raccordement des opérateurs aux hubs. |
| **`Territory`** | **Conservée** | Délimitations géographiques et codes territoriaux. |
| **`Dataset`** | **Conservée** | Catalogage de données Open Data aligné sur DCAT-AP. |
| **`KnowledgeAsset`** | **Conservée** | Livres blancs, guides et outils sémantiques. |
| **`ImpactDimension`** | **Conservée** | Axe de pilotage stratégique de l'action publique. |
| **`ImpactIndicator`** | **Renommée** | Anciennement `OutcomeIndicator`. |
| **`ImpactMeasurement`** | **Renommée** | Anciennement `Impact` (Mesure unitaire). |
| **`AssessmentFramework`**| **Créée** | Modèle racine des référentiels d'évaluation (DMAT, Digiscore). |
| **`Questionnaire`** | **Créée** | Structure d'affichage du questionnaire. |
| **`QuestionGroup`** | **Créée** | Sections d'un formulaire. |
| **`Question`** | **Créée** | Questions individuelles associées à des Capabilités. |
| **`AnswerOption`** | **Créée** | Réponses possibles et poids. |
| **`ScoringRule`** | **Créée** | Formules d'attribution de scores. |
| **`AssessmentCampaign`**| **Créée** | Campagnes de diagnostic territorial. |
| **`AssessmentResult`** | **Créée** | Snapshot global du diagnostic d'une PME. |
| **`DimensionScore`** | **Créée** | Score unitaire d'une Capability pour une PME. |
| **`BenchmarkGroup`** | **Créée** | Cohorte de comparaison. |
| **`BenchmarkScore`** | **Créée** | Scores de référence des cohortes. |
| **`BenchmarkPercentile`** | **Créée** | Distribution des centiles des cohortes. |
| **`BenchmarkComparison`** | **Créée** | Objet d'analyse comparatif. |
| **`BenchmarkSnapshot`** | **Créée** | Cliché historique de positionnement. |
| **`BusinessEvent`** | **Créée** | Événement d'intention de PME (CPSV-AP). |
| **`LifeEvent`** | **Créée** | Phase de vie de la PME (CPSV-AP). |
| **`Evidence`** | **Créée** | Preuve d'audit et de livraison. |

---

## 🏁 11. Conclusion Obligatoire & Feuille de Route du Sprint 4

### Modèle PIT validé
*   **Modèle de Gouvernance Cible** : `Strategy ➔ Program ➔ Project ➔ Action ➔ Activity` (avec `Activity` unifiant les réalisations individuelles, collectives et missions de deuxième ligne).
*   **Architecture du Knowledge Graph** : L'Option B (Modèle Hybride) est validée.
*   **Méta-modèle d'Évaluation et Preuves** : Le sous-système dynamique de questionnaires rattachés à des Capabilités et la structure d' `Evidence` de justification sont validés.
*   **Modèle de Benchmarking** : Les objets `BenchmarkGroup`, `BenchmarkScore` et `BenchmarkPercentile` sont validés.
*   **Taxonomie NACE** : L'obligation d'un code NACE principal sur les bénéficiaires est validée.
*   **Prédicats de Graphe** : Les liaisons transverses dynamiques de la table `EntityRelation` sont validées.

### Modèle PIT différé
*   **Événements CPSV-AP (`BusinessEvent` et `LifeEvent`)** : L'implémentation physique et l'intégration des interfaces d'édition sont différées en phase finale du projet.
*   **Clichés de benchmarking historiques (`BenchmarkSnapshot`, `BenchmarkComparison`)** : Le stockage et le calcul régulier des courbes d'évolution centiles en BDD sont différés après stabilisation du moteur d'évaluation.

### Modèle PIT abandonné
*   **Les tables physiques dures d'administration publique de la V10** : Les tables `StrategicPriority` et `Measure` de la V10 sont supprimées pour alléger le schéma. Leurs données qualificatives sont intégrées sous forme de métadonnées sémantiques ou de tags de tri de `Program`.
*   **La maturité stockée en colonnes physiques** : Le stockage en dur de la maturité sur le profil de `Beneficiary` est supprimé pour être remplacé par les clichés de diagnostics dynamiques de la table `AssessmentResult`.

### Décisions définitives
*   La table `Capability` devient l'unique point d'alignement pivot entre les questions d'audits, les scores de maturité des PME, et l'offre d'aides.
*   L'écriture double (Dual-Write) vers les 5 colonnes legacy de `Beneficiary` est requise durant tout le temps de la transition pour préserver l'affichage de l'interface V10.
*   L'intégrité référentielle stricte (`on delete cascade`) est imposée sur toutes les relations Prisma fortes.

### Prérequis Sprint 4
*   Génération de la migration SQL de base à partir du schéma Prisma cible vNext (déploiement des tables d'évaluation, capability circulaire, preuves et relation de graphe).
*   Développement du script de seed de référence pour injecter les 23 capabilités, les frameworks DMAT et Cyber Fundamentals, et relier les services CPSV-AP existants en base de données.
*   Implémentation des triggers/hooks de double-écriture backend pour synchroniser les nouveaux scores de diagnostics avec les 5 colonnes legacy de la table bénéficiaire.

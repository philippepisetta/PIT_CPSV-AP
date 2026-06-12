# 🚀 Plateforme d'Intelligence Territoriale (PIT) — Plan d'Implémentation du Modèle Core (Phase 1)

## Référentiel de Migration & de Cadrage Technique (v1.0)

Ce document constitue la **feuille de route officielle d'implémentation** du modèle de données Core de la Plateforme d'Intelligence Territoriale (PIT). Il détaille la stratégie de migration incrémentale de la base de données, la réorganisation des relations Prisma, la compatibilité ascendante avec les écrans et API de la V10, et planifie les phases de développement pour garantir un déploiement sécurisé sans interruption de service.

---

## 🗺️ 1. Matrice des Entités Cibles (Core Entities Matrix)

L'implémentation du modèle sémantique PIT est segmentée en trois phases pour assurer des cycles de développement stables et incrémentaux :

| Entité PIT | Core (Sprint 4) | Phase 2 (Sprint 5) | Phase 3 (Sprint 6) | Commentaires / Raccordement |
| :--- | :---: | :---: | :---: | :--- |
| **`Organization`** | **X** | | | Conservée de la V10 (W3C ORG). |
| **`Beneficiary`** | **X** | | | Conservée (avec colonnes de maturité `@deprecated`). |
| **`PublicService`** | **X** | | | Conservée (standard CPSV-AP). |
| **`JourneyTemplate`** | **X** | | | Renommage et adaptation de la table `Journey` de la V10. |
| **`Program`** | **X** | | | Conservée (absorbe *StrategicPriority* et *Measure*). |
| **`Project`** | **X** | | | Conservée (représente le dossier d'accompagnement PME). |
| **`Action`** | **X** | | | Renommage et adaptation d' `ActionInstance`. |
| **`Activity`** | **X** | | | **Fusionne `ServiceDelivery`, `CollectiveDelivery` et `SecondLineMission`**. |
| **`Challenge`** | **X** | | | Renommage de `BusinessChallenge`. |
| **`ChallengeCategory`**| **X** | | | Nouvelle table de classification des défis. |
| **`Capability`** | **X** | | | Renommage de `CapabilityDimension` (entité pivot). |
| **`BusinessEvent`** | **X** | | | Nouvelle entité d'intention de PME (CPSV-AP). |
| **`LifeEvent`** | **X** | | | Nouvelle entité de cycle de vie PME (CPSV-AP). |
| **`Territory`** | **X** | | | Conservée (hiérarchie géographique wallonne). |
| **`Ecosystem`** | **X** | | | Conservée (EDIH, clusters...). |
| **`AssessmentFramework`**| | **X** | | Modèle racine des référentiels d'évaluation (DMAT...). |
| **`Questionnaire`** | | **X** | | Versions physiques des grilles d'audit. |
| **`Question`** | | **X** | | Questions d'évaluation ciblées sur des capabilités. |
| **`AnswerOption`** | | **X** | | Choix de réponse et points associés. |
| **`ScoringRule`** | | **X** | | Formules réglementaires de calcul de maturité. |
| **`AssessmentResult`** | | **X** | | Snapshot de score global d'une PME. |
| **`DimensionScore`** | | **X** | | Score unitaire d'une Capability pour une PME. |
| **`BenchmarkGroup`** | | **X** | | Cohortes sectorielles ou géographiques de pairs. |
| **`BenchmarkScore`** | | **X** | | Scores moyens et médians des cohortes. |
| **`BenchmarkPercentile`**| | **X** | | Seuil de distribution par tranches de centiles. |
| **`ImpactDimension`** | | **X** | | Axes stratégiques (décarbonation, circularité...). |
| **`ImpactIndicator`** | | **X** | | Métriques d'impact (ex: Tonnes de CO2). |
| **`ImpactMeasurement`**| | **X** | | Mesure physique unitaire d'impact (ex: -12t CO2). |
| **`KnowledgeAsset`** | | | **X** | Livres blancs, guides et outils d'écosystème. |
| **`EntityRelation`** | | | **X** | Table dynamique des arcs du graphe transverse. |

---

## 🔄 2. Stratégie de Migration Prisma (Prisma Target Mapping)

Le tableau suivant définit précisément les opérations physiques à réaliser sur le fichier `schema.prisma` actuel lors du Sprint 4 :

| Nom Table Physique V10 | Opération Physique | Modèle Cible (vNext) | Impact Base de Données (PostgreSQL) |
| :--- | :---: | :--- | :--- |
| `organizations` | **Conserver** | `Organization` | Aucun changement de structure. |
| `beneficiaries` | **Conserver** | `Beneficiary` | Maintien temporaire des 5 colonnes de maturité en lecture (Dual-Write sur écriture). |
| `public_services` | **Conserver** | `PublicService` | Aucun changement de structure. |
| `journeys` | **Renommer** | `JourneyTemplate` | Renommer la table en `journey_templates` (migration SQL de renommage). |
| `journey_stages` | **Conserver** | `JourneyStage` | Mise à jour de la clé étrangère pour pointer vers `journey_templates`. |
| `journey_enrollments`| **Conserver** | `JourneyEnrollment` | Mise à jour de la clé étrangère pour pointer vers `journey_templates`. |
| `service_deliveries` | **Fusionner** | `Activity` | **Supprimer** et fusionner dans la nouvelle table commune `activities`. |
| `collective_deliveries`| **Fusionner** | `Activity` | **Supprimer** et fusionner dans la nouvelle table commune `activities`. |
| `second_line_missions`| **Fusionner** | `Activity` | **Supprimer** et fusionner dans la nouvelle table commune `activities`. |
| `action_instances` | **Renommer** | `Action` | Renommer la table en `actions` (migration SQL). |
| `business_challenges`| **Renommer** | `Challenge` | Renommer la table en `challenges` et lier à `ChallengeCategory`. |
| *Aucune* | **Créer** | `ChallengeCategory` | Créer la table `challenge_categories` (Nomenclatures). |
| `capability_dimensions`| **Renommer** | `Capability` | Renommer la table en `capabilities` et ajouter le champ `parentCapabilityId`. |
| `strategic_domain_dimensions` | **Supprimer** | `S3Domain` | Remplacée par la hiérarchie S3 Wallonne propre (`S3Domain` ➔ `ValueChain` ➔ `ValueChainStage`). |
| `strategic_value_chains` | **Renommer** | `ValueChain` | Renommer en `value_chains` pour s'aligner sur la cible S3. |
| `value_chain_stages`| **Conserver** | `ValueChainStage` | Adapté pour pointer vers la nouvelle `ValueChain`. |
| `ecosystems` | **Conserver** | `Ecosystem` | Aucun changement. |
| `ecosystem_types` | **Conserver** | `EcosystemType` | Aucun changement. |
| `territories` | **Conserver** | `Territory` | Mise à jour de l'enum `TerritoryType` en base de données. |
| *Aucune* | **Créer** | `BusinessEvent` | Créer la table `business_events` (Intentions d'aides). |
| *Aucune* | **Créer** | `LifeEvent` | Créer la table `life_events` (Cycle de vie PME). |
| `programs` | **Conserver** | `Program` | **Suppression de `strategic_priorities` et `measures`** (absorbés sous forme de tags JSON dans `Program`). |
| `projects` | **Conserver** | `Project` | Aucun changement. |

---

## 🏛️ 3. Validation de Mapping des Programmes Réels (Program Mapping Validation)

Le modèle de gouvernance opérationnelle simplifiée (`Strategy ➔ Program ➔ Project ➔ Action ➔ Activity`) permet de modéliser avec précision et sans création d'entité spécifique l'ensemble des programmes d'aides wallons et européens :

### 1. EDIH WallonIA
*   **`Strategy`** : Wallonie Numérique (Digital Wallonia).
*   **`Program`** : EDIH WallonIA (European Digital Innovation Hub co-financé par l'UE et la Région).
*   **`Project`** : Diagnostic & POC Cyber de la PME *Menuiserie Dupont*.
*   **`Action`** : Jalon 1: Cadrage initial ➔ Jalon 2: Passation de questionnaire ➔ Jalon 3: Audit technique.
*   **`Activity`** : Passation du DMAT (activité d'accompagnement de type diagnostic individuel).

### 2. PIT (Fiche 138)
*   **`Strategy`** : Plan de Relance de la Wallonie (PRW).
*   **`Program`** : Fiche 138 (Déploiement Plateforme d'Intelligence Territoriale).
*   **`Project`** : Conception et implémentation du Moteur Sémantique et de la BDD.
*   **`Action`** : Jalon 1: Rédaction de la validation ➔ Jalon 2: Codage Prisma ➔ Jalon 3: Seeding.
*   **`Activity`** : Workshop technique inter-opérateurs AdN/WE (activité collective d'animation).

### 3. Data4Wallonia
*   **`Strategy`** : Wallonie Data Space (Valorisation de la donnée territoriale).
*   **`Program`** : Data4Wallonia (Programme d'aide à l'ouverture des données publiques).
*   **`Project`** : Projet d'audit de qualité open data de l'opérateur Forem.
*   **`Action`** : Jalon 1: Identification des silos de données ➔ Jalon 2: Évaluation de la conformité DCAT-AP.
*   **`Activity`** : Publication du catalogue de métadonnées du Forem (activité de publication sémantique).

### 4. Circular Wallonia
*   **`Strategy`** : Circular Wallonia (Plan d'action d'économie circulaire régional).
*   **`Program`** : Portefeuille d'aides à la transition bas carbone.
*   **`Project`** : Transition éco-conception plastique de la PME *BioPlast*.
*   **`Action`** : Jalon 1: Étude de biodégradabilité ➔ Jalon 2: prototypage de moules recyclables.
*   **`Activity`** : Audit de circularité et diagnostic de cycle de vie (activité individuelle).

### 5. TART IA
*   **`Strategy`** : Stratégie IA Wallonie (DigitalWallonia4.ai).
*   **`Program`** : TART IA (Qualification ROI IA rapide).
*   **`Project`** : Audit d'opportunités IA express de la PME *LogiTrans*.
*   **`Action`** : Jalon 1: Session d'idéation IA ➔ Jalon 2: Estimation du coût du modèle de langage.
*   **`Activity`** : Remise officielle du rapport de diagnostic d'éligibilité IA (activité individuelle).

### 6. Digital Wallonia
*   **`Strategy`** : Wallonie Numérique (Digital Wallonia).
*   **`Program`** : Tremplin Cyber / Start IA.
*   **`Project`** : Sécurisation réseau et NIS2 de la PME *MecaParts*.
*   **`Action`** : Jalon 1: Pentest initial ➔ Jalon 2: Déploiement de pare-feu et MFA.
*   **`Activity`** : Audit final et certification de sécurité (activité individuelle).

---

## 🧠 4. Modélisation de Capability (Option B - Entité du Graphe)

Conformément aux décisions d'arbitrage sémantique, `Capability` est modélisée comme une **entité physique majeure** pivot du Knowledge Graph.

### Structure Prisma du modèle `Capability` :
```prisma
model Capability {
  id                 Int                  @id @default(autoincrement())
  uri                String               @unique // ex: https://pit.wallonie.be/id/capability/ai
  code               String               @unique // ex: CAP-DIG-AI
  name               String               // ex: "Intelligence Artificielle"
  description        String?              @db.Text
  capabilityType     String               // TECHNOLOGICAL, BUSINESS, REGULATORY
  synonyms           String[]             // ex: ["Machine Learning", "RAG", "LLM"] pour la recherche
  status             String               @default("ACTIVE")
  createdAt          DateTime             @default(now())
  updatedAt          DateTime             @updatedAt

  // Hiérarchie Circulaire
  parentCapabilityId Int?
  parentCapability   Capability?          @relation("CapabilityHierarchy", fields: [parentCapabilityId], references: [id], onDelete: SetNull)
  childCapabilities  Capability[]          @relation("CapabilityHierarchy")

  // Relations transactionnelles fortes (Phase 2 & 3)
  questions          Question[]           // Questions d'évaluation associées
  services           PublicService[]      @relation("ServiceCapabilities")
  datasets           Dataset[]            @relation("DatasetCapabilities")
  knowledgeAssets    KnowledgeAsset[]     @relation("AssetCapabilities")

  @@map("capabilities")
}
```

---

## ❓ 5. Business Event / Life Event Model

Les événements sont modélisés comme des entités sémantiques connectées dynamiquement via `EntityRelation` pour orienter les PME selon leurs intentions de transformation.

### Matrice d'Orientation Sémantique :
Ce tableau illustre comment le moteur de recommandation traverse le graphe en partant des intentions de l'entreprise :

| Événement Déclencheur (`Event`) | Défi Métier Associé (`Challenge`) | Parcours Recommandé (`JourneyTemplate`) | Service Public Recommandé (`PublicService`) |
| :--- | :--- | :--- | :--- |
| **Exporter** *(BusinessEvent)* | • Risques réglementaires douaniers<br>• Conformité logistique transfrontalière | Parcours d'Accompagnement à l'Exportation (AWEX) | Diagnostic réglementaire export (AWEX) |
| **Recruter** *(BusinessEvent)* | • Pénurie de profils techniques R&D<br>• Upskilling des opérateurs internes | Parcours Compétences Industrie 4.0 | Chèques Formation (SPW Économie) |
| **Lever des fonds** *(BusinessEvent)* | • Valorisation financière de l'innovation<br>• Rédaction du pitch deck investisseurs | Parcours de Préparation Levée de Fonds | Prêt subordonné (Wallonie Entreprendre) |
| **Créer une entreprise** *(LifeEvent)* | • Montage du plan financier de départ<br>• Choix de la forme juridique d'établissement | Parcours de Création d'Activité Start-up | Chèque Starter de diagnostic initial |
| **Transmettre** *(LifeEvent)* | • Valorisation d'actifs incorporels<br>• Audit de conformité repreneur | Parcours Reprise & Transmission PME | Diagnostic de valorisation financière |

---

## 🌍 6. Modélisation Géographique (Territory Model)

Le modèle territorial structure le raisonnement spatial du Knowledge Graph (détection de zones blanches, couverture des aides).

### Niveaux de la Hiérarchie Géographique (`TerritoryType`) :
```
EUROPE ➔ COUNTRY ➔ REGION ➔ PROVINCE ➔ ECONOMIC_BASIN ➔ ARRONDISSEMENT ➔ MUNICIPALITY ➔ BUSINESS_PARK / INNOVATION_DISTRICT
                                                                        └─ CROSS_BORDER (transfrontalier)
```

### Relations avec les entités d'exécution :
*   **`Organization` ➔ `Territory`** (Relation `coversTerritory`) : Zone de compétence territoriale de l'opérateur (ex: la SPI couvre la Province de Liège).
*   **`Beneficiary` ➔ `Territory`** (Relation `locatedInTerritory`) : Localisation physique de la PME (rattachement automatique à la Commune et à la Province sur base du code postal de la BCE).
*   **`PublicService` ➔ `Territory`** (Relation `availableInTerritory`) : Limite d'éligibilité d'un service d'aide (ex: aide réservée aux PME de l'arrondissement de Charleroi).
*   **`JourneyTemplate` ➔ `Territory`** (Relation `availableInTerritory`) : Disponibilité d'un parcours thématique.
*   **`Ecosystem` ➔ `Territory`** (Relation `coversTerritory`) : Rayonnement régional ou local du hub.
*   **`Program` ➔ `Territory`** (Relation `fundedInTerritory`) : Délimitation de l'enveloppe budgétaire (ex: fonds FEDER réservés aux bassins en transition de Wallonie).

---

## 🕸️ 7. Stratégie de Graphe Hybride (Option B)

L'implémentation physique sépare strictement les relations de structure (fortes) des relations sémantiques (faibles).

### 1. Relations transactionnelles fortes (Natives Prisma)
Bénéficient des index relationnels SQL, des clés étrangères physiques et de la suppression en cascade.
*   `Program` ➔ `Project` (`Program.projects`)
*   `Project` ➔ `Action` (`Project.actions`)
*   `Action` ➔ `Activity` (`Action.activities`)
*   `Organization` ➔ `PublicService` (`Organization.services`)
*   `JourneyTemplate` ➔ `JourneyStage` (`JourneyTemplate.stages`)
*   `Beneficiary` ➔ `JourneyEnrollment` (`Beneficiary.journeyEnrollments`)

### 2. Relations transversales faibles (Dans la table `EntityRelation`)
Bénéficient d'une flexibilité totale pour le matchmaking et l'explorateur de graphe.
*   `Challenge` ↔ `Capability` (`requiresCapability` / `targetedByChallenge`)
*   `Capability` ↔ `PublicService` (`resolvedByService` / `developsCapability`)
*   `PublicService` ↔ `S3Domain` (`targetsValueChain` / `alignedWithS3`)
*   `KnowledgeAsset` ↔ `Ecosystem` (`sharedInEcosystem` / `documentsEcosystem`)
*   `Challenge` ↔ `Impact` (`contributesToImpact` / `measuredByChallenge`)
*   `BusinessEvent` / `LifeEvent` ➔ `Challenge` (`triggersChallenge`)

---

## 📊 8. Matrice de Compatibilité V10 (Compatibility Matrix)

Ce tableau analyse les impacts de la restructuration du modèle sur les modules existants de l'application V10 et détaille les mitigations appliquées :

| Entité Modifiée | Écrans V10 Impactés | APIs V10 Impactées | Risques identifiés | Mesures de Mitigation & Alignement |
| :--- | :--- | :--- | :--- | :--- |
| **`Journey` renommée en `JourneyTemplate`** | • Cockpit `/journeys`<br>• Détail service (parcours liés) | • `/api/journeys`<br>• `/api/meta` | Rupture de typage TypeScript et plantage des imports frontend. | • Créer un script de migration SQL renommant la table en base.<br>• Mettre en place un routeur API alias redirigeant temporairement `/api/journeys` vers `/api/journey-templates`. |
| **`ServiceDelivery` / `CollectiveDelivery` / `SecondLineMission` fusionnées dans `Activity`** | • Liste des activités `/activities`<br>• Statistiques de pilotage `/pilotage` | • `/api/activities`<br>• `/api/service-deliveries` | Perte de données historiques de réalisation lors de la suppression des 3 anciennes tables. | • Développer un script de migration de données SQL extrayant les lignes de réalisation pour les insérer dans la nouvelle table `activities` en typant le champ discriminant `activityType`. |
| **`Beneficiary` (Maturité en dur `@deprecated`)** | • Dashboard `/beneficiaries`<br>• Radar de maturité | • `/api/beneficiaries` | Plantage de l'affichage des graphiques radar et des scores PME. | • Conserver physiquement les 5 colonnes de maturité en BDD.<br>• Implémenter un trigger Prisma au niveau de la création de diagnostic (`AssessmentResult`) pour recalculer la moyenne des scores et mettre à jour automatiquement les colonnes legacy (double-écriture). |
| **`BusinessChallenge` renommée en `Challenge`** | • Formulaire d'édition de services<br>• Filtres de recherche | • `/api/meta`<br>• `/api/services` | Rupture de jointure lors du requêtage des services liés à des défis. | • Renommer la table de jointure physique SQL.<br>• Créer un adaptateur dans le handler GET `/api/services` pour mapper les anciens objets défis vers le nouveau format. |
| **`CapabilityDimension` renommée en `Capability`** | • Cockpit relationnel du Graph Explorer | • `/api/meta`<br>• `/api/graph` | Rupture des nœuds du graphe d'expertise technologique. | • Exécuter le script de renommage SQL de la table.<br>• Mettre à jour les requêtes d'assemblage du JSON du graphe pour lire depuis la nouvelle table `capabilities`. |

---

## 📅 9. Feuille de Route d'Implémentation Détaillée (Roadmap)

L'implémentation physique s'articule en 3 phases successives :

### Phase 1 : Core Domain (Sprint 4)
*   **Actions** :
    1.  Mettre à jour `schema.prisma` avec les renommages de tables (`JourneyTemplate`, `Challenge`, `Capability`, `Action`).
    2.  Créer la table unifiée `activities` (fusion des 3 anciennes tables de réalisations).
    3.  Créer les tables `business_events`, `life_events` et `challenge_categories`.
    4.  Écrire le script de migration de données SQL pour migrer les réalisations historiques vers `activities`.
    5.  Développer les triggers Prisma de double-écriture pour maintenir à jour les 5 axes de maturité legacy de `Beneficiary`.
*   *Effort* : Moyen (3-4 jours de développement).
*   *Risques* : Risque de blocage lors de la migration des clés étrangères de réalisation de services.
*   *Dépendance* : Validation finale de la matrice de stabilisation.

### Phase 2 : Assessment Framework (Sprint 5)
*   **Actions** :
    1.  Déployer les tables physiques du modèle d'évaluation de maturité (`AssessmentFramework`, `Questionnaire`, `QuestionGroup`, `Question`, `AnswerOption`, `ScoringRule`, `AssessmentResult`, `DimensionScore`).
    2.  Créer les tables de Benchmarking (`BenchmarkGroup`, `BenchmarkScore`, `BenchmarkPercentile`).
    3.  Développer le script de seeding pour importer les formulaires d'audits officiels (DMAT, Digiscore, Cyber Fundamentals).
    4.  Refactoriser le cockpit `/beneficiaries` pour lire les diagnostics et afficher les radar charts dynamiques.
*   *Effort* : Élevé (5-6 jours de développement).
*   *Risques* : Complexité des algorithmes de calcul de centiles et d'agrégation de scores de dimensions.
*   *Dépendance* : Phase 1 finalisée et validée en base.

### Phase 3 : Knowledge Graph & Matchmaking (Sprint 6)
*   **Actions** :
    1.  Déployer la table physique `entity_relations` et la table d' `Evidence`.
    2.  Migrer les liaisons transversales en base de données.
    3.  Refactoriser le Recommender Engine pour interroger la table de graphe dynamique et filtrer selon le positionnement de benchmarking de la PME.
    4.  Déployer l'explorateur réseau (Graph Explorer) mis à jour.
*   *Effort* : Moyen (4 jours de développement).
*   *Risques* : Latence de requêtage du graphe sur de grands volumes d'interconnexions.
*   *Dépendance* : Phase 1 & 2 finalisées.

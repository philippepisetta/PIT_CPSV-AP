# 🧬 Plateforme d'Intelligence Territoriale (PIT) — Feuille de Route de Convergence du Modèle de Données

## Référentiel de Convergence & Alignement du Modèle Cible (v1.0)

Ce document constitue la **feuille de route officielle de convergence** du modèle de données de la Plateforme d'Intelligence Territoriale (PIT). Il analyse les écarts entre l'implémentation physique actuelle (schéma Prisma V10, base PostgreSQL, API, écrans) et les spécifications d'architecture cible. Il définit la stratégie de migration, l'architecture hybride de relations et propose le schéma Prisma conceptuel cible (`vNext`) pour guider les prochains développements.

---

## 🗺️ 1. Inventaire et Cartographie du Modèle Réel (V10)

L'analyse du schéma Prisma réel de la V10 met en évidence une base de données de **59 tables**, structurées en 6 domaines fonctionnels majeurs.

```
📁 Modèle de Données Physique (schema.prisma V10)
├── 🏢 Acteurs & Écosystèmes
│   ├── organizations (Organization)
│   ├── ecosystems (Ecosystem)
│   ├── ecosystem_types (EcosystemType)
│   ├── ecosystem_memberships (EcosystemMembership)
│   └── ecosystem_roles (EcosystemRole)
├── 📄 Catalogue de Services Publics (CPSV-AP)
│   ├── public_services (PublicService)
│   ├── channels (Channel), requirements (Requirement), evidences (Evidence)
│   ├── outputs (Output), outcomes (Outcome), costs (Cost)
│   ├── contact_points (ContactPoint), rules (Rule), criterions (Criterion)
│   └── catalogues (Catalogue)
├── ⚙️ Parcours, Réalisations & Activités
│   ├── journeys (Journey - Modèle de parcours théorique)
│   ├── journey_stages (JourneyStage - Étape de parcours)
│   ├── journey_enrollments (JourneyEnrollment - Inscription réelle d'une PME)
│   ├── service_deliveries (ServiceDelivery - Réalisation de service individuelle)
│   ├── collective_deliveries (CollectiveDelivery - Prestation collective)
│   ├── second_line_missions (SecondLineMission - Mission d'animation d'écosystème)
│   ├── intervention_levels (InterventionLevel)
│   ├── intervention_types (InterventionType)
│   ├── interventions (Intervention)
│   └── action_instances (ActionInstance)
├── 🏢 Bénéficiaires & Territoires
│   ├── beneficiaries (Beneficiary - Profil PME avec indices de maturité en dur)
│   ├── nace_sectors (NaceSector - Activité économique)
│   └── territories (Territory - Hiérarchie géographique)
├── 📊 Gouvernance Stratégique
│   ├── strategies (Strategy), strategic_priorities (StrategicPriority)
│   ├── programs (Program), measures (Measure), initiatives (Initiative)
│   ├── program_participations, initiative_participations
│   ├── beneficiary_engagements, outcome_indicators (OutcomeIndicator)
│   ├── impacts (Impact), funding_instruments (FundingInstrument)
│   ├── projects (Project) et objectives (Objective)
│   └── event_resources (EventResource)
└── 🌐 Dimensions Transversales
    ├── transformation_dimensions (TransformationDimension - Mappe le DR-BEST)
    ├── strategic_domain_dimensions (StrategicDomainDimension - Mappe les axes S3)
    ├── strategic_value_chains (StrategicValueChain - Mappe les filières S3)
    ├── value_chain_stages (ValueChainStage - Mappe les maillons S3)
    ├── capability_dimensions (CapabilityDimension - Mappe les capabilités technologiques)
    ├── impact_dimensions (ImpactDimension - Mappe les dimensions d'impact)
    ├── knowledge_dimensions (KnowledgeDimension)
    └── data_quality_dimensions (DataQualityDimension)
```

---

## 🔍 2. Comparaison et Alignement avec le Modèle Cible

Le tableau ci-dessous analyse l'alignement de l'implémentation physique V10 avec le modèle de connaissances cible de la PIT :

| Entité Cible PIT | Statut dans la V10 | Écart identifié / Commentaires | Priorité |
| :--- | :---: | :--- | :---: |
| **`BaseEntity`** | **Partiel** | Pas d'héritage formel. Les champs sémantiques (`uri`, `code`, `name`, `description`, `createdAt`, `updatedAt`) sont dupliqués manuellement sur chaque table. | Moyenne |
| **`EntityRelation`** | **Absent** | Le graphe transverse est modélisé par des tables de jointure SQL classiques en dur (ex: `_ServiceValueChains`, `_ServiceCapabilities`), limitant l'évolutivité. | Haute |
| **`Organization`** | **Présent** | Bien implémenté et aligné sur W3C ORG, mais manque d'attributs pour la gestion des sous-structures. | Basse |
| **`Beneficiary`** | **Partiel** | Profil complet existant, mais contient les 5 colonnes de maturité en dur (`maturityDigital`, `maturityIa`, etc.) contraires au modèle d'évaluation dynamique. | Haute |
| **`Service`** | **Présent** | Implémenté sous le nom de `PublicService`, alignement CPSV-AP v3.0 très complet. | Basse |
| **`JourneyTemplate`** | **Partiel** | Implémenté sous le nom de `Journey` dans la V10. Prête à confusion avec l'engagement réel de l'entreprise. Doit être renommé en `JourneyTemplate`. | Moyenne |
| **`JourneyStage`** | **Présent** | Actif et correctement modélisé. | Basse |
| **`JourneyEnrollment`** | **Présent** | Actif et correctement modélisé pour le suivi réel d'un bénéficiaire. | Basse |
| **`JourneyOutcome`** | **Partiel** | Les résultats réels observés sont stockés comme des chaînes de texte brutes (`outcomeReal`) sur `ServiceDelivery`. | Moyenne |
| **`JourneyTrigger`** | **Absent** | Non matérialisé en base. Les déclenchements de parcours se font par logique de code côté client. | Haute |
| **`JourneyRecommendationRule`** | **Absent** | Logique de recommandation codée en dur dans le frontend. Doit être persistée en base. | Haute |
| **`Program`** / **`Project`** | **Présent** | Présents et structurés pour le pilotage de la gouvernance stratégique régionale. | Basse |
| **`Action`** | **Partiel** | Implémenté sous le nom d' `ActionInstance`. | Basse |
| **`Activity`** | **Partiel** | Représenté par la scission de `ServiceDelivery` (individuel), `CollectiveDelivery` (collectif) et `SecondLineMission` (deuxième ligne). | Moyenne |
| **`Challenge`** | **Partiel** | Implémenté sous le nom de `BusinessChallenge` sans catégorisation logique. | Haute |
| **`ChallengeCategory`** | **Absent** | Manquant pour structurer les défis métiers par grandes thématiques. | Haute |
| **`Capability`** | **Partiel** | Implémenté sous le nom de `CapabilityDimension`. | Moyenne |
| **`S3Domain`** | **Partiel** | Mappé via `StrategicDomainDimension` mais avec des risques de confusion hiérarchique. | Moyenne |
| **`ValueChain`** | **Partiel** | Implémenté sous le nom de `StrategicValueChain`. | Moyenne |
| **`ValueChainStage`** | **Présent** | Actif et correctement modélisé. | Basse |
| **`Ecosystem`** | **Présent** | Actif. Modélise les EDIH et clusters régionaux. | Basse |
| **`Territory`** | **Présent** | Actif. Représente la hiérarchie géographique wallonne. | Basse |
| **`Dataset`** / **`KnowledgeAsset`** | **Présent** | Présents et alignés sur les métadonnées DCAT-AP. | Basse |
| **`ImpactDimension`** | **Présent** | Actif. Gère les axes de pilotage (décarbonation, circularité...). | Basse |
| **`ImpactIndicator`** | **Présent** | Mappé sous le nom d' `OutcomeIndicator`. | Basse |
| **`ImpactMeasurement`** | **Présent** | Mappé sous le nom d' `Impact`. | Basse |
| **`AssessmentFramework`** | **Absent** | Manquant. Absolument requis pour la V10. | Haute |
| **`Questionnaire`** | **Absent** | Manquant. Nécessaire pour instancier les formulaires d'audit (DMAT, NIS2). | Haute |
| **`Question`** / **`AnswerOption`** | **Absent** | Manquant. Gère la granularité des questionnaires en base de données. | Haute |
| **`ScoringRule`** | **Absent** | Manquant. Gère les barèmes de notation. | Haute |
| **`AssessmentCampaign`** | **Absent** | Manquant. Nécessaire pour organiser les vagues d'audits régionaux. | Moyenne |
| **`BenchmarkGroup`** / **`BenchmarkScore`** | **Absent** | Manquants. Nécessaires pour le positionnement des PME par rapport à leurs pairs. | Moyenne |

---

## 🔄 3. Matrice de Migration des Données

Cette matrice définit le traitement de chaque entité de la base de données actuelle pour atteindre le modèle cible :

| Entité Cible | Entité Actuelle V10 | Action Sémantique | Justification & Impact Technique |
| :--- | :--- | :---: | :--- |
| **`BaseEntity`** | *Aucune* | **Conception** | Uniformiser par héritage conceptuel les attributs `id`, `uri`, `code`, `name`, `description`, `status`, `owner`, `tags`, `createdAt`, `updatedAt` sur toutes les tables de référence. |
| **`EntityRelation`** | *Aucune* | **Création** | Nouvelle table prisma `entity_relations` pour stocker le graphe de connaissances dynamique (source, cible, type de relation, poids, confiance). |
| **`JourneyTemplate`** | `Journey` | **Renommage** | Éviter la confusion : `Journey` représente la définition théorique du parcours. Elle sera renommée en `JourneyTemplate` (ou `journey_templates` en SQL). |
| **`JourneyStage`** | `JourneyStage` | **Réutilisation** | Conservé. Raccordé au nouveau `JourneyTemplate`. |
| **`JourneyOutcome`** | `Outcome` / `outcomeReal` | **Fusion** | Fusionner le modèle théorique `Outcome` et les champs réels pour en faire des indicateurs d'impact qualitatifs ou quantitatifs. |
| **`JourneyTrigger`** | *Aucune* | **Création** | Persister les conditions de déclenchement automatique de parcours (ex: "Score Cyber < 2.0"). |
| **`JourneyRecommendationRule`**| *Aucune* | **Création** | Enregistrer les règles métier régissant les recommandations personnalisées. |
| **`Challenge`** | `BusinessChallenge` | **Renommage** | Renommer `BusinessChallenge` en `Challenge` pour l'aligner sur la terminologie du graphe. |
| **`ChallengeCategory`** | *Aucune* | **Création** | Classifier les défis par grandes familles (Énergétique, Numérique, Export...). |
| **`Capability`** | `CapabilityDimension` | **Renommage** | Renommer `CapabilityDimension` en `Capability` pour simplifier le modèle transverse. |
| **`S3Domain`** | `StrategicDomainDimension`| **Scission** | Extraire les domaines S3 de la table générique des domaines stratégiques de gouvernance. |
| **`ValueChain`** | `StrategicValueChain` | **Renommage** | Renommer `StrategicValueChain` en `ValueChain`. |
| **`AssessmentFramework`** | *Aucune* | **Création** | Nouvelle table racine pour déclarer les référentiels d'évaluation (Digiscore, DMAT, etc.). |
| **`Questionnaire`** | *Aucune* | **Création** | Nouvelle table gérant les versions de formulaires physiques associés aux frameworks. |
| **`QuestionGroup`** | *Aucune* | **Création** | Nouvelle table structurant les sections de questionnaires (Infrastructures, Compétences...). |
| **`Question`** | *Aucune* | **Création** | Nouvelle table. Chaque question est rattachée sémantiquement à un code de `Capability`. |
| **`AnswerOption`** | *Aucune* | **Création** | Nouvelle table stockant les choix de réponse et les points de score associés. |
| **`ScoringRule`** | *Aucune* | **Création** | Nouvelle table définissant les barèmes réglementaires d'attribution de scores. |
| **`AssessmentCampaign`** | *Aucune* | **Création** | Nouvelle table gérant les campagnes d'audits (dates, territoires cibles, écosystèmes coordinateurs). |
| **`BenchmarkGroup`** | *Aucune* | **Création** | Nouvelle table regroupant les cohortes d'entreprises (Taille, Province, Secteur NACE). |
| **`BenchmarkScore`** | *Aucune* | **Création** | Nouvelle table stockant les moyennes et centiles des cohortes de référence. |
| **`ImpactDimension`** | `ImpactDimension` | **Réutilisation** | Conservé en l'état. |
| **`ImpactIndicator`** | `OutcomeIndicator` | **Renommage** | Renommer `OutcomeIndicator` en `ImpactIndicator` pour plus de cohérence. |
| **`ImpactMeasurement`** | `Impact` | **Renommage** | Renommer `Impact` en `ImpactMeasurement` pour le distinguer de la dimension macro-économique. |

---

## 🏛️ 4. Analyse de la Structure Commune `BaseEntity`

Prisma ne prenant pas en charge l'héritage de classes physiques, le concept de **`BaseEntity`** est implémenté sous la forme d'un **socle de champs obligatoires et standardisés** recopié sur chaque modèle du graphe. Cela garantit l'uniformité des URI et facilite le requêtage générique du Knowledge Graph.

### Structure standardisée de `BaseEntity` dans Prisma :
```prisma
// Socle commun Conceptuel recopié sur les entités cibles
id          Int      @id @default(autoincrement())
uri         String   @unique // ex: https://pit.wallonie.be/id/organization/adn
code        String   @unique // ex: ORG-ADN
name        String   // Titre ou Nom de l'entité
description String?  @db.Text
status      String   @default("ACTIVE") // DRAFT, ACTIVE, DEPRECATED, ARCHIVED
owner       String?  // Organisation propriétaire
tags        String[] // Mots-clés transversaux
createdAt   DateTime @default(now())
updatedAt   DateTime @updatedAt
version     String?  @default("1.0")
```

### Entités devant obligatoirement implémenter `BaseEntity` :
*   `Organization`
*   `PublicService` (CPSV-AP)
*   `JourneyTemplate`
*   `Ecosystem`
*   `Challenge`
*   `Capability`
*   `Territory`
*   `Dataset`
*   `KnowledgeAsset`
*   `Program`
*   `Project`
*   `AssessmentFramework`

---

## 🕸️ 5. Analyse d'EntityRelation & Stratégie de Graphe Hybride

L'implémentation d'un Graphe de Connaissances peut être sujette à des dérives de performance si elle est mal encadrée. Nous préconisons une **architecture hybride** associant la performance du SQL relationnel natif à la flexibilité d'un graphe sémantique dynamique.

```
       ┌─────────────────────────────────────────────────────────┐
       │             Territorial Knowledge Graph                 │
       └────────────────────────────┬────────────────────────────┘
                                    │
            ┌───────────────────────┴───────────────────────┐
            ▼                                               ▼
  Relations Métier Fortes                       Relations Transversales Faibles
 (Prisma Native Foreign Keys)                     (Table Dynamique EntityRelation)
  - Cohérence transactionnelle                   - Flexibilité sémantique
  - Intégrité référentielle cascade              - Matchmaking du Recommender Engine
  - Performance d'indexation SQL                 - Requêtes de graphe exploratoires
            │                                               │
  - ex: Organization ↔ Service                   - ex: Challenge ↔ Capability
  - ex: Journey ↔ JourneyStage                   - ex: Capability ↔ Service
  - ex: Enrollment ↔ Beneficiary                 - ex: KnowledgeAsset ↔ Ecosystem
```

### 1. Relations Métier Fortes (Natives Prisma)
Elles sont structurées en dur dans le schéma avec des clés primaires/étrangères pour garantir la cohérence transactionnelle et les suppressions en cascade.
*   **`Organization` ↔ `PublicService`** : Un service est obligatoirement publié par une autorité compétente (`organizationId`).
*   **`JourneyTemplate` ↔ `JourneyStage`** : Les étapes appartiennent physiquement à un parcours parent unique (`journeyId`).
*   **`JourneyEnrollment` ↔ `Beneficiary`** : L'inscription d'une PME est liée de manière forte à son profil client.
*   **`ServiceDelivery` ↔ `Beneficiary`** : La réalisation d'un service nécessite une PME et un opérateur physique.

### 2. Relations Transversales Faibles (Table de Graphe `EntityRelation`)
Elles modélisent les liens sémantiques ou algorithmiques, volatiles ou multidimensionnels, qui alimentent le moteur de recommandation et l'explorateur de graphe.
*   **`Challenge` ↔ `Capability`** (ex : Résoudre *Adoption IA* requiert la capability *AI*).
*   **`Capability` ↔ `PublicService`** (ex : Le service *Diagnostic Cyber* soutient la capability *Cybersecurity*).
*   **`KnowledgeAsset` ↔ `Ecosystem`** (ex : Le *Guide RGPD* est partagé dans l'écosystème *EDIH*).
*   **`JourneyTemplate` ↔ `Challenge`** (ex : Le parcours *Export* est déclenché par le défi *Internationalisation*).
*   **`PublicService` ↔ `Territory`** (ex : Un service est disponible sur une zone géographique).

### Structure Prisma de la table `EntityRelation` :
```prisma
model EntityRelation {
  id             Int       @id @default(autoincrement())
  sourceUri      String    // URI de l'entité source (ex: https://pit.wallonie.be/id/challenge/cyber)
  targetUri      String    // URI de l'entité cible (ex: https://pit.wallonie.be/id/capability/cybersecurity)
  relationType   String    // Prédicat (requiresCapability, resolvesChallenge, recommends, covers)
  strength       Float     @default(1.0)  // Poids de 0.0 à 1.0 (matchmaking)
  confidence     Float     @default(1.0)  // Indice de certitude (généré par IA ou certifié par expert)
  validFrom      DateTime?
  validTo        DateTime?
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt

  @@unique([sourceUri, targetUri, relationType])
  @@index([sourceUri])
  @@index([targetUri])
  @@map("entity_relations")
}
```

---

## 📊 6. Analyse et Alignement des Taxonomies

| Taxonomie PIT | Statut dans la V10 | Plan de Convergence / Action |
| :--- | :---: | :--- |
| **DR-BEST** | **Partiel** | Actuellement nommé `TransformationDimension` avec les codes `D, R, B, E, S, T`. **Action** : Conserver la table Prisma mais standardiser les descriptions et les labels conformément à la norme européenne des EDIH. Assurer que ces dimensions classifient l'offre uniquement (Services, Journeys, Activités, Programmes) et ne sont jamais écrites directement sur le bénéficiaire. |
| **Capability** | **Partiel** | Nommé `CapabilityDimension` dans la V10. **Action** : Renommer la table en `Capability` et y injecter lors du seed les 23 codes officiels normalisés (ex: `CAP-DIG-AI`, `CAP-DIG-CYBER`) avec leurs synonymes textuels pour l'auto-complétion du moteur de recherche. |
| **Challenge** | **Partiel** | Présent sous le nom de `BusinessChallenge`. **Action** : Renommer en `Challenge` et ajouter une relation avec une nouvelle table `ChallengeCategory` pour structurer les défis métiers par famille macro-économique. |
| **InterventionType**| **Partiel** | Mappé partiellement sur `InterventionType` et `InterventionLevel`. **Action** : Restructurer pour imposer l'utilisation stricte d'une liste contrôlée de 14 typologies (Diagnostic, Formation, Test Before Invest...). |
| **Territory** | **Présent** | Bien structuré dans `Territory` avec relation d'auto-parenté (`parentTerritoryId`). **Action** : Mettre à jour l'enum `TerritoryType` pour ajouter les valeurs manquantes `EUROPE`, `COUNTRY`, `CROSS_BORDER` afin de supporter les projets transfrontaliers (Interreg). |
| **OrganizationRole**| **Partiel** | Les rôles sont éparpillés sous forme de chaînes de texte libres dans plusieurs tables de participation. **Action** : Formaliser une liste contrôlée sémantique conforme à W3C ORG (Competent Authority, Service Provider, Funding Body...). |
| **EcosystemType** | **Présent** | Table `EcosystemType` déjà implémentée. **Action** : Aligner les codes en base sur les 10 types officiels (Cluster, Pôle, EDIH, Living Lab...). |
| **ImpactDimension** | **Présent** | Présent sous le nom d'`ImpactDimension`. **Action** : Aligner la table sur les 12 dimensions d'impact régionales. |
| **S3** | **Partiel** | Redondances entre `StrategicValueChain`, `ValueChainStage` et `StrategicDomainDimension`. **Action** : Fusionner ces modèles en une hiérarchie stricte à 3 niveaux : `S3Domain` (Ex: Advanced Manufacturing) ➔ `ValueChain` (Ex: Robotique) ➔ `ValueChainStage` (Ex: Intégration). |

---

## 📈 7. Analyse du Sous-système d'Évaluation (Assessments)

L'audit de la V10 révèle l'usage de 5 colonnes physiques stockées en dur dans la table `Beneficiary` :
*   `maturityDigital`, `maturityIa`, `maturityCyber`, `maturityExport`, `maturityDurability`.

Cette architecture rigide empêche de gérer de nouveaux questionnaires (NIS2, DMAT...) sans modifier la structure physique de la base de données.

### Stratégie de Transition Progressive & Double Écriture (Dual-Write)
Pour éviter de casser l'interface utilisateur de la V10 (cockpits, graphiques radar, exports) tout en déployant la structure dynamique d'évaluations, la transition s'organise en 4 phases :

```
┌──────────────────────────────────────────────────────────────────────────┐
│ PHASE 1 : Dépréciation conceptuelle (Sprint 3)                           │
│ - Maintien des 5 colonnes legacy sur la table `Beneficiary`              │
│ - Marquage comme `@deprecated` dans le schéma Prisma et le code TS       │
└────────────────────────────────────┬─────────────────────────────────────┘
                                     │
                                     ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ PHASE 2 : Écriture Miroir (Dual-Write - Sprint 4)                        │
│ - Déploiement des tables dynamiques `Assessment` & `DimensionScore`      │
│ - Les API écrivent en base les scores granulaires                        │
│ - Un hook Prisma intercepte l'écriture et met à jour en parallèle les    │
│   5 colonnes legacy de `Beneficiary` en calculant les moyennes           │
└────────────────────────────────────┬─────────────────────────────────────┘
                                     │
                                     ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ PHASE 3 : Migration des données historiques (Sprint 4.1)                  │
│ - Exécution d'un script SQL de migration lisant les scores legacy de     │
│   toutes les PME pour générer des snapshots dynamiques fictifs           │
└────────────────────────────────────┬─────────────────────────────────────┘
                                     │
                                     ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ PHASE 4 : Nettoyage & Suppression (Sprint 5)                             │
│ - Refactoring des composants UI V10 pour requêter la nouvelle API        │
│ - Suppression des 5 colonnes de `schema.prisma` et exécution du script   │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 🇪🇺 8. Alignement avec les Standards Européens CPSV-AP & DCAT-AP

### 1. Diagnostic d'Alignement CPSV-AP (Public Services)
Le modèle V10 de `PublicService` possède déjà un excellent taux d'alignement avec le standard de métadonnées de la Commission Européenne :
*   **Conformité validée** : Les relations avec `Channel`, `Requirement`, `Evidence`, `Output`, `Cost`, `Rule`, `Criterion`, `TargetAudience` et `Catalogue` sont fidèles aux spécifications du W3C.
*   **Écarts identifiés** :
    *   Les modèles `Output` (livrable théorique) et `Outcome` (résultat théorique) sont séparés. Ils devront être raccordés de manière plus étroite avec les mesures réelles observées lors de l'accompagnement (`ServiceDelivery.outputReal`).
    *   Il manque des URI canoniques pour caractériser les types de canaux officiels et de coûts selon la nomenclature européenne SEMIC.

### 2. Diagnostic d'Alignement DCAT-AP (Catalogues de Données)
La V10 intègre les notions de `Dataset` et `Catalogue`, nécessaires pour l'interopérabilité Open Data :
*   **Conformité validée** : L'organisation propriétaire (`ownerOrganizationId`) fait office de `Publisher` conforme à DCAT-AP. Le score de qualité est modélisé.
*   **Écarts identifiés** :
    *   Manque d'un modèle de `Distribution` (le fichier ou l'URL de téléchargement réel associé au dataset).
    *   Les politiques d'accès (`AccessPolicy`) et de sensibilité (`DataSensitivity`) doivent être formellement typées avec des vocabulaires contrôlés plutôt que des chaînes de texte libres.

---

## ⚡ 9. Performance du Modèle & Recommandations de Conception

L'analyse de la complexité du graphe V10 met en évidence 3 risques majeurs de performance qu'il convient de mitiger :

### 1. Risque d'explosion des requêtes N+1
*   *Problème* : L'accès aux cockpits `/journeys` et `/services` requiert le chargement imbriqué de nombreuses tables associatives (S3, capabilités, défis). Sans gestion rigoureuse, Prisma génère des dizaines de requêtes SQL secondaires.
*   *Mitigation* : Utiliser des sélections de champs restrictives (`select`) et des inclusions d'un seul niveau (`include`) dans les requêtes de liste. Pour les détails complets d'une entité, privilégier des requêtes ciblées exécutées de manière asynchrone par TanStack Query.

### 2. Profondeur excessive des relations de gouvernance
*   *Problème* : La chaîne de dépendance `Strategy ➔ Priority ➔ Program ➔ Measure ➔ Initiative ➔ Service ➔ JourneyStage` est trop profonde. Toute agrégation de données (ex: calculer le budget global investi pour une PME dans une filière S3) nécessite des jointures complexes à 7 niveaux.
*   *Mitigation* : Dénormaliser et stocker les métadonnées clés de niveau supérieur (comme `S3DomainId` ou `ProgramId`) directement sur les tables d'exécution `ServiceDelivery` et `BeneficiaryEngagement` pour aplatir l'arbre de recherche.

### 3. Caching des taxonomies statiques
*   *Problème* : Les tables d'écosystèmes, de territoires, de secteurs NACE et de capabilités changent très rarement mais sont interrogées à chaque chargement de page.
*   *Mitigation* : Implémenter un cache applicatif (ex: cache de route Next.js ou React Context côté client) pour éviter des accès base de données inutiles pour les référentiels statiques.

---

## 💾 10. Schéma Prisma Cible Conceptuel (vNext)

Voici la proposition conceptuelle du schéma Prisma cible (`schema.prisma` vNext) intégrant le socle commun `BaseEntity`, la structure de graphe `EntityRelation`, le nouveau sous-système d'évaluations et l'alignement des taxonomies de manière unifiée :

```prisma
// ==========================================
// 1. SOCLE TRANSVERSAL ET CONNAISSANCES
// ==========================================

model EntityRelation {
  id           Int       @id @default(autoincrement())
  sourceUri    String
  targetUri    String
  relationType String    // e.g., "requiresCapability", "targetsS3"
  strength     Float     @default(1.0)
  confidence   Float     @default(1.0)
  validFrom    DateTime?
  validTo      DateTime?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt

  @@unique([sourceUri, targetUri, relationType])
  @@index([sourceUri])
  @@index([targetUri])
  @@map("entity_relations")
}

model Capability {
  id          Int               @id @default(autoincrement())
  uri         String            @unique
  code        String            @unique // e.g., CAP-DIG-AI
  name        String
  description String?           @db.Text
  status      String            @default("ACTIVE")
  synonyms    String[]          // Alternative tags for matching
  createdAt   DateTime          @default(now())
  updatedAt   DateTime          @updatedAt
  
  // Relations Fortes
  questions   Question[]
  services    PublicService[]   @relation("ServiceCapabilities")
  datasets    Dataset[]         @relation("DatasetCapabilities")

  @@map("capabilities")
}

model ChallengeCategory {
  id          Int         @id @default(autoincrement())
  code        String      @unique
  name        String
  description String?     @db.Text
  challenges  Challenge[]
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  @@map("challenge_categories")
}

model Challenge {
  id          Int               @id @default(autoincrement())
  uri         String            @unique
  code        String            @unique
  name        String
  description String?           @db.Text
  status      String            @default("ACTIVE")
  type        String            // STRATEGIC, OPERATIONAL, REGULATORY
  categoryId  Int
  category    ChallengeCategory @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  createdAt   DateTime          @default(now())
  updatedAt   DateTime          @updatedAt

  @@map("challenges")
}

// ==========================================
// 2. SOUS-SYSTÈME D'ÉVALUATION (ASSESSMENT)
// ==========================================

model AssessmentFramework {
  id          Int                  @id @default(autoincrement())
  uri         String               @unique
  code        String               @unique // e.g., DMAT, DIGISCORE
  name        String
  description String?              @db.Text
  status      String               @default("ACTIVE")
  type        String               // MATURITY, READINESS, COMPLIANCE
  authority   String               // e.g., "AdN", "Commission Européenne"
  createdAt   DateTime             @default(now())
  updatedAt   DateTime             @updatedAt
  
  questionnaires Questionnaire[]
  campaigns      AssessmentCampaign[]

  @@map("assessment_frameworks")
}

model Questionnaire {
  id          Int             @id @default(autoincrement())
  frameworkId Int
  framework   AssessmentFramework @relation(fields: [frameworkId], references: [id], onDelete: Cascade)
  title       String
  version     String
  status      String          @default("ACTIVE")
  groups      QuestionGroup[]
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt

  @@map("questionnaires")
}

model QuestionGroup {
  id              Int           @id @default(autoincrement())
  questionnaireId Int
  questionnaire   Questionnaire @relation(fields: [questionnaireId], references: [id], onDelete: Cascade)
  name            String
  position        Int
  questions       Question[]
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  @@map("question_groups")
}

model Question {
  id               Int           @id @default(autoincrement())
  groupId          Int
  group            QuestionGroup @relation(fields: [groupId], references: [id], onDelete: Cascade)
  code             String        @unique // e.g., Q-DMAT-CYBER-1
  label            String
  text             String        @db.Text
  type             String        // SINGLE_CHOICE, MULTI_CHOICE
  position         Int
  targetCapabilityId Int
  targetCapability Capability    @relation(fields: [targetCapabilityId], references: [id])
  options          AnswerOption[]
  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @updatedAt

  @@map("questions")
}

model AnswerOption {
  id          Int          @id @default(autoincrement())
  questionId  Int
  question    Question     @relation(fields: [questionId], references: [id], onDelete: Cascade)
  label       String
  value       Float        // Point weighting
  position    Int
  scoringRule ScoringRule?
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt

  @@map("answer_options")
}

model ScoringRule {
  id             Int          @id @default(autoincrement())
  answerOptionId Int          @unique
  answerOption   AnswerOption @relation(fields: [answerOptionId], references: [id], onDelete: Cascade)
  scorePoints    Float
  formula        String?
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt

  @@map("scoring_rules")
}

model AssessmentCampaign {
  id             Int                 @id @default(autoincrement())
  code           String              @unique
  name           String
  startDate      DateTime
  endDate        DateTime?
  status         String              @default("ACTIVE") // ACTIVE, COMPLETED
  frameworkId    Int
  framework      AssessmentFramework @relation(fields: [frameworkId], references: [id])
  results        AssessmentResult[]
  createdAt      DateTime            @default(now())
  updatedAt      DateTime            @updatedAt

  @@map("assessment_campaigns")
}

model AssessmentResult {
  id             Int                @id @default(autoincrement())
  beneficiaryId  Int
  beneficiary    Beneficiary        @relation(fields: [beneficiaryId], references: [id], onDelete: Cascade)
  campaignId     Int?
  campaign       AssessmentCampaign? @relation(fields: [campaignId], references: [id], onDelete: SetNull)
  scoreGlobal    Float
  confidence     Float              @default(1.0)
  source         String             // SELF_ASSESSMENT, EXPERT_AUDIT
  measuredAt     DateTime           @default(now())
  dimensionScores DimensionScore[]
  createdAt      DateTime           @default(now())
  updatedAt      DateTime           @updatedAt

  @@map("assessment_results")
}

model DimensionScore {
  id                 Int              @id @default(autoincrement())
  resultId           Int
  result             AssessmentResult @relation(fields: [resultId], references: [id], onDelete: Cascade)
  capabilityCode     String           // Link to Capability
  scoreValue         Float
  trend              String           @default("STABLE") // UP, DOWN, STABLE
  createdAt          DateTime         @default(now())
  updatedAt          DateTime         @updatedAt

  @@map("dimension_scores")
}

// ==========================================
// 3. RÉFÉRENTIELS ET PARCOURS (COMPASS)
// ==========================================

model JourneyTemplate {
  id             Int               @id @default(autoincrement())
  uri            String            @unique
  code           String            @unique
  name           String
  description    String?           @db.Text
  provider       String
  objective      String?           @db.Text
  status         String            @default("ACTIVE")
  targetAudience String[]
  stages         JourneyStage[]
  enrollments    JourneyEnrollment[]
  createdAt      DateTime          @default(now())
  updatedAt      DateTime          @updatedAt

  @@map("journey_templates")
}

// Note: Les autres modèles (Beneficiary, PublicService, etc.) continuent d'exister 
// en héritant conceptuellement de la structure standardisée BaseEntity.
```

---

## 📅 11. Feuille de Route Détaillée de Convergence (Roadmap)

Le déploiement du nouveau modèle s'organise en 5 étapes successives pour minimiser les risques d'interruption de service :

### 🏁 Phase 1 : Consolidation & Double Écriture (Sprint 3.1)
*   *Objectifs* : Préparer la structure, déclarer la dépréciation des 5 axes de maturité legacy de `Beneficiary`.
*   *Livrables* :
    *   Documentation technique mise à jour avec les annotations `@deprecated`.
    *   Implémentation du trigger d'écriture double (Dual-Write) dans l'API des bénéficiaires pour synchroniser les modifications.

### 🏷️ Phase 2 : Standardisation des Taxonomies (Sprint 3.2)
*   *Objectifs* : Aligner et nettoyer l'ensemble des référentiels taxonomiques de la Wallonie (DR-BEST, S3, Capabilités, Rôles).
*   *Livrables* :
    *   Scripts de seeding complets (`prisma/seed.ts`) injectant les 23 capabilités de base, les 14 modes d'interventions, les 10 types d'écosystèmes et la hiérarchie S3.

### 📝 Phase 3 : Déploiement des Frameworks d'Évaluation (Sprint 4.0)
*   *Objectifs* : Remplacer l'évaluation rigide de la V10 par le moteur de questionnaires dynamique.
*   *Livrables* :
    *   Nouvelles tables Prisma en production (`AssessmentFramework`, `Questionnaire`, `Question`, etc.).
    *   Script de migration SQL pour importer l'historique des PME.
    *   Cockpit UI pour créer des questionnaires en ligne et historiser les scores des entreprises.

### 🕸️ Phase 4 : Raccordement du Territorial Knowledge Graph (Sprint 4.1)
*   *Objectifs* : Déployer la table `EntityRelation` pour connecter dynamiquement l'ensemble des entités régionales.
*   *Livrables* :
    *   Migration Prisma créant la table `EntityRelation`.
    *   Exportation du graphe au format JSON-LD pour l'interopérabilité européenne.
    *   Interface d'administration pour connecter visuellement des entités (Ex: relier un service à un défi).

### 🤖 Phase 5 : Matchmaking & Recommandations Cibles (Sprint 5.0)
*   *Objectifs* : Activer le moteur d'intelligence territoriale.
*   *Livrables* :
    *   Moteur de recommandation s'appuyant sur les règles de déclenchement persistées (`JourneyRecommendationRule`) et le positionnement par cohortes (`BenchmarkScore`).

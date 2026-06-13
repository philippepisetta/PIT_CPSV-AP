# STRATÉGIE DE MIGRATION ÉVOLUTIVE : PIT vNext (SANS RUPTURE)

Ce document décrit la trajectoire de migration et la stratégie d'architecture évolutive pour la transition vers la PIT vNext. Contrairement à une refonte de type "Big Bang", cette approche garantit la préservation du MVP actuel, la compatibilité ascendante des APIs et la continuité de service des cockpits existants.

---

## 1. VISION TECHNIQUE & ARCHITECTURE EVOLUTIVE

L'architecture évolutive repose sur le principe de **coexistence et double écriture/lecture** :
* **Aucune suppression de table** : Les entités du MVP (`Program`, `Project`, `Action`, `Activity`, `S3Domain`, `ValueChain`, `ValueChainStage`, `Journey`) restent physiques, actives et peuplées.
* **Ajout parallélisé** : Les nouveaux modèles génériques (`ClassificationFramework`, `ClassificationTerm`, `EntityClassification`, `JourneyTemplate`, `JourneyInstance`, `JourneyProgress`, `ServiceDelivery`, `InterventionNode`) sont introduits de manière additive dans le schéma Prisma.
* **Couplage sémantique** : Les entités existantes sont reliées de manière optionnelle aux nouveaux frameworks sous-jacents, permettant une transition douce et une projection progressive.

```mermaid
graph TD
    subgraph COUCHE TRANSITOIRE (MVP ACTUEL)
        P[Program] --> Pr[Project] --> A[Action] --> Act[Activity]
        S3[S3Domain] --> VC[ValueChain] --> VCS[ValueChainStage]
        J[Journey]
    end
    
    subgraph COUCHE GENERIQUE (vNext PARALLÈLE)
        IN[InterventionNode] -->|Récursif| IN
        JT[JourneyTemplate] --> JS[JourneyStage]
        JI[JourneyInstance] --> JP[JourneyProgress]
        CF[ClassificationFramework] --> CT[ClassificationTerm]
        EC[EntityClassification]
        SD[ServiceDelivery]
    end
    
    %% Liaisons de transition
    P -.->|Spécialisation| IN
    Pr -.->|Spécialisation| IN
    A -.->|Spécialisation| IN
    Act -.->|Spécialisation| IN
    
    S3 -.->|Propulse| CF
    J -.->|Migre vers| JT
    Act -.->|Historise| SD
```

---

## 2. TRAJECTOIRE DE MIGRATION EN 5 PHASES

Pour éliminer les risques d'intégration, la migration est découpée en 5 phases séquentielles indépendantes. Le passage à la phase suivante est conditionné par le succès de la phase précédente.

### Phase 1 : Classification Framework (Référentiels sémantiques)
* **Objectif** : Mettre en place la structure générique des référentiels de qualification.
* **Actions** :
  1. Ajouter les tables `ClassificationFramework`, `ClassificationTerm`, `EntityClassification` dans le schéma Prisma.
  2. Créer les frameworks pour `DR-BEST`, `S3`, `NACE`, `TRL`, `DMAT`.
  3. Relier sémantiquement les `PublicService` existants aux termes de classification sans toucher à leurs attributs actuels.
  4. **Validation** : Les cockpits continuent de filtrer sur les tables existantes, tandis que l'API expose en parallèle les classifications génériques sous `/api/v2/frameworks`.

### Phase 2 : Journey Framework (Modélisation des parcours découpés)
* **Objectif** : Découpler les modèles de parcours types et l'avancement individuel des entreprises.
* **Actions** :
  1. Ajouter les tables `JourneyTemplate`, `JourneyStage`, `JourneyInstance`, `JourneyProgress` dans Prisma.
  2. Traduire les `Journey` existants en `JourneyTemplate` équivalents.
  3. Associer les bénéficiaires inscrits à des `JourneyInstance`.
  4. **Validation** : Le cockpit Parcours affiche toujours la table `Journey` historique, tandis que le moteur de recommandation commence à être alimenté en tâche de fond par le calcul des phases actives via `JourneyProgress`.

### Phase 3 : Service Delivery (Exécution réelle des prestations)
* **Objectif** : Tracer les prestations de services réellement délivrées aux bénéficiaires.
* **Actions** :
  1. Relier `ServiceDelivery` aux nouvelles tables de parcours `JourneyInstance` et `JourneyStage`.
  2. Migrer les logs d'activité existants (`Activity` individuelles de diagnostic) vers des fiches `ServiceDelivery` pour lever l'ambiguïté EDIH.
  3. **Validation** : Conservation des historiques d'activités individuelles tout en structurant les données pour les audits de livraison réels.

### Phase 4 : InterventionNode (Arbre de gouvernance générique)
* **Objectif** : Déployer la structure arborescente pour unifier le pilotage.
* **Actions** :
  1. Introduire le modèle récursif `InterventionNode` dans Prisma.
  2. Projeter automatiquement les `Program`, `Project` et `Action` existants sous forme d'`InterventionNode` équivalents à l'aide de triggers ou de requêtes lors du seed.
  3. **Validation** : Le cockpit Programmes s'appuie toujours sur la structure rigide, mais l'API v2 commence à exposer l'arbre complet sous `/api/v2/interventions` pour les nouveaux cockpits.

### Phase 5 : Migration progressive des écrans front-end
* **Objectif** : Basculer les interfaces utilisateur vers la couche générique.
* **Actions** :
  1. **Services** : Afficher les tags de classification génériques (`DR-BEST`, `S3`) à côté du service.
  2. **Programmes** : Ajouter une vue arborescente optionnelle affichant l'arbre d'`InterventionNode`.
  3. **Parcours** : Remplacer l'affichage linéaire par la vue des templates et étapes dynamiques.

---

## 3. IMPACTS DU SCHÉMA DE DONNÉES (ADDITIF)

Toutes les modifications du schéma Prisma sont strictement additives. Les tables existantes conservent leurs structures et contraintes d'origine.

```prisma
// ==========================================
// MIGRATION PHASE 1 : Classification Framework
// ==========================================

model ClassificationFramework {
  id          Int                  @id @default(autoincrement())
  code        String               @unique // ex: DR-BEST, S3, NACE, TRL, DMAT, TRL, IRL, DigComp, AI-TAXONOMY, D4WTA
  name        String
  description String?              @db.Text
  terms       ClassificationTerm[]
  createdAt   DateTime             @default(now())
  updatedAt   DateTime             @updatedAt

  @@map("classification_frameworks")
}

model ClassificationTerm {
  id             Int                  @id @default(autoincrement())
  code           String               @unique // ex: DRBEST-D, S3-NUM, TRL-4
  name           String
  description    String?              @db.Text
  frameworkId    Int
  framework      ClassificationFramework @relation(fields: [frameworkId], references: [id], onDelete: Cascade)
  parentId       Int?
  parent         ClassificationTerm?  @relation("TermHierarchy", fields: [parentId], references: [id], onDelete: SetNull)
  children       ClassificationTerm[] @relation("TermHierarchy")
  classifications EntityClassification[]
  createdAt      DateTime             @default(now())
  updatedAt      DateTime             @updatedAt

  @@map("classification_terms")
}

model EntityClassification {
  id             Int                 @id @default(autoincrement())
  entityType     String              // ex: Service, Beneficiary, Activity, InterventionNode...
  entityId       Int
  termId         Int
  term           ClassificationTerm  @relation(fields: [termId], references: [id], onDelete: Cascade)
  
  // Relations d'intégration optionnelles pour Prisma
  serviceId      Int?
  service        PublicService?      @relation(fields: [serviceId], references: [id], onDelete: Cascade)
  beneficiaryId  Int?
  beneficiary    Beneficiary?        @relation(fields: [beneficiaryId], references: [id], onDelete: Cascade)
  nodeId         Int?
  node           InterventionNode?   @relation(fields: [nodeId], references: [id], onDelete: Cascade)
  journeyTemplateId Int?
  journeyTemplate JourneyTemplate?   @relation(fields: [journeyTemplateId], references: [id], onDelete: Cascade)
  journeyInstanceId Int?
  journeyInstance JourneyInstance?   @relation(fields: [journeyInstanceId], references: [id], onDelete: Cascade)
  organizationId Int?
  organization   Organization?       @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  ecosystemId    Int?
  ecosystem      Ecosystem?          @relation(fields: [ecosystemId], references: [id], onDelete: Cascade)

  createdAt      DateTime            @default(now())
  updatedAt      DateTime            @updatedAt

  @@unique([entityType, entityId, termId])
  @@index([entityType, entityId])
  @@map("entity_classifications")
}

// ==========================================
// MIGRATION PHASE 2 : Journey Framework
// ==========================================

model JourneyTemplate {
  id          Int                   @id @default(autoincrement())
  code        String                @unique // ex: JT-DIGITAL, JT-IA, JT-CYBER
  name        String
  description String?               @db.Text
  stages      JourneyStage[]
  instances   JourneyInstance[]
  classifications EntityClassification[]
  createdAt   DateTime              @default(now())
  updatedAt   DateTime              @updatedAt

  @@map("journey_templates")
}

model JourneyInstance {
  id            Int               @id @default(autoincrement())
  status        String            @default("ACTIVE") // ACTIVE, COMPLETED, CANCELLED
  startDate     DateTime          @default(now())
  endDate       DateTime?
  beneficiaryId Int
  beneficiary   Beneficiary       @relation(fields: [beneficiaryId], references: [id], onDelete: Cascade)
  templateId    Int
  template      JourneyTemplate   @relation(fields: [templateId], references: [id], onDelete: Cascade)
  progresses    JourneyProgress[]
  classifications EntityClassification[]
  createdAt     DateTime          @default(now())
  updatedAt     DateTime          @updatedAt

  @@map("journey_instances")
}

model JourneyProgress {
  id          Int             @id @default(autoincrement())
  status      String          @default("TODO") // TODO, IN_PROGRESS, COMPLETED
  validatedAt DateTime?
  notes       String?         @db.Text
  instanceId  Int
  instance    JourneyInstance @relation(fields: [instanceId], references: [id], onDelete: Cascade)
  stageId     Int
  stage       JourneyStage    @relation(fields: [stageId], references: [id], onDelete: Cascade)
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt

  @@unique([instanceId, stageId])
  @@map("journey_progresses")
}

// ==========================================
// MIGRATION PHASE 4 : InterventionNode
// ==========================================

enum InterventionNodeType {
  STRATEGY
  PRIORITY
  OBJECTIVE
  MEASURE
  INITIATIVE
  PROGRAM
  PROJECT
  ACTION
  ACTIVITY
}

model InterventionNode {
  id                  Int                  @id @default(autoincrement())
  code                String               @unique // ex: NODE-S3, NODE-EDIH-WP1
  label               String
  description         String?              @db.Text
  type                InterventionNodeType
  parentId            Int?
  parent              InterventionNode?    @relation("InterventionHierarchy", fields: [parentId], references: [id], onDelete: SetNull)
  children            InterventionNode[]   @relation("InterventionHierarchy")
  startDate           DateTime?
  endDate             DateTime?
  status              String               @default("PLANNED") // PLANNED, IN_PROGRESS, COMPLETED
  budget              Float?
  ownerOrganizationId Int?
  ownerOrganization   Organization?        @relation("OrganizationNodes", fields: [ownerOrganizationId], references: [id], onDelete: SetNull)
  classifications     EntityClassification[]
  createdAt           DateTime             @default(now())
  updatedAt           DateTime             @updatedAt

  @@map("intervention_nodes")
}
```

---

## 4. COMPATIBILITÉ DES PROGRAMMES MAJEURS ET CADRES DE RÉFÉRENCE

Le modèle vNext permet d'unifier la représentation des programmes actuels sans rupture :

### A. EDIH (European Digital Innovation Hub)
* **Catalogue** : Les 30 services EDIH sont répertoriés dans `PublicService` (ex: "Test before Invest IA").
* **Dispositif opérationnel** : Modélisé dans `Action` (ex: "Jalon 1: Sensibilisation").
* **Exécution réelle** : L'acte de délivrer le service à une PME est consigné dans `ServiceDelivery` (ex: "Audit cybersécurité délivré à Dupont S.A. le 12/06/2026").
* **Classification** : Qualifié de manière transverse par le framework `DR-BEST` (ex: classification `TECHNOLOGY` et `READINESS`).

### B. S3 (Stratégie de Spécialisation Intelligente)
* **Préservation** : Les entités `S3Domain`, `ValueChain` et `ValueChainStage` sont conservées pour maintenir le cockpit S3 existant.
* **Généralisation vNext** : Les domaines et maillons S3 sont également insérés en tant que termes dans le framework de classification `S3`. Ainsi, n'importe quelle entité peut être associée à la S3 par le moteur générique d'agrégation, tandis que les relations de clés étrangères historiques restent opérationnelles.

### C. Circular Wallonia & Digital Wallonia
* **Modélisation de la gouvernance** : Leurs axes, objectifs stratégiques, mesures et programmes de financement sont modélisés dans l'arbre d'`InterventionNode` (types: `STRATEGY` → `PRIORITY` → `MEASURE` → `PROGRAM`).
* **Visualisation** : L'utilisateur navigue dans la hiérarchie à l'aide de la vue arborescente sans interférer avec la table `Program` classique.

---

## 5. MIGRATION ET SYNC DU SEED (JEU DE DONNÉES DEMO)

Le script `prisma/seed.ts` sera étendu pour :
1. **Conserver** la totalité des enregistrements actuels (organisations, programmes, services, bénéficiaires et défis).
2. **Insérer** les définitions des frameworks de classification (`DR-BEST`, `S3`, `NACE`, `TRL`, `DMAT`).
3. **Créer** les équivalents génériques (`InterventionNode` et `EntityClassification`) pour les enregistrements existants lors de la phase d'initialisation, garantissant que les données historiques soient immédiatement visibles dans les deux couches (MVP et vNext).
4. **Étendre** le dataset avec les 6 templates de parcours types, 20 étapes et 30 livraisons réelles pour présenter les fonctionnalités vNext à la direction.

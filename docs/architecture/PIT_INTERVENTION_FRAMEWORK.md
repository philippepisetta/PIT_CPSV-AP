# INTERVENTION FRAMEWORK (CADRE D'INTERVENTION UNIFIÉ)

Ce document décrit le modèle générique récursif de pilotage et de gouvernance territoriale implémenté dans la PIT vNext. Il unifie les programmes, projets, stratégies, jalons et activités sous une même entité arborescente.

---

## 1. COMPRENDRE L'UNIFICATION DES COUCHES D'INTERVENTION

Auparavant, la PIT imposait une structure de gouvernance rigide à 4 niveaux :
`Program` → `Project` → `Action` → `Activity`.

Cette approche posait un problème majeur d'adaptabilité d'une stratégie territoriale à l'autre :
* **La Stratégie S3 (Wallonie)** nécessite un découpage à plus de 7 niveaux :
  `S3` (Stratégie) → `Priorité` → `Objectif Stratégique` → `Mesure` → `Initiative` → `Programme` → `Projet` → `Activité`.
* **Circular Wallonia** utilise un modèle à 5 niveaux :
  `Stratégie` → `Axe Stratégique` → `Mesure` → `Initiative` → `Action` → `Activité`.
* **Un Hub EDIH** s'articule plus simplement autour de :
  `EDIH` (Programme) → `Work Package` → `Activité`.

Le framework d'intervention vNext résout cette complexité en remplaçant les tables rigides par un modèle arborescent récursif basé sur l'entité unique **`InterventionNode`**.

---

## 2. MODÈLE HIÉRARCHIQUE RÉCURSIF DE LA vNext

Chaque `InterventionNode` peut pointer vers un node parent (`parentId`), permettant de concevoir des arbres de n'importe quelle profondeur :

```
[Strategy: S3 Wallonie]
       └─ [Priority: Priorité Santé]
             └─ [Objective: Objectif 1: Souveraineté Sanitaire]
                   └─ [Measure: Mesure 2: R&D Biotech]
                         └─ [Initiative: Initiative 3: Hub BioWin]
                               └─ [Program: Programme FEDER Santé]
                                     └─ [Project: Projet BioPlast]
                                           └─ [Action: Jalon 1: Étude de biodégradabilité]
                                                 └─ [Activity: Diagnostic plastique]
```

---

## 3. TYPES DE NOEUDS D'INTERVENTION (INTERVENTION NODE TYPES)

Le champ `type` qualifie le rôle du noeud au sein de l'arbre stratégique :

| Type | Description | Exemple |
| :--- | :--- | :--- |
| `STRATEGY` | Vision politique ou plan à long terme d'un territoire. | *Digital Wallonia 2025*, *S3 Wallonie* |
| `PRIORITY` | Axe ou pilier d'une stratégie globale. | *Axe 1 : Économie circulaire dans la construction* |
| `OBJECTIVE` | Cible à atteindre au sein d'une priorité. | *Objectif 1.2 : Réduction des déchets de plâtre* |
| `MEASURE` | Dispositif d'action publique d'accompagnement. | *Mesure 2.1 : Chèques Entreprises* |
| `INITIATIVE` | Appel à projets ou regroupement thématique temporaire. | *Initiative IA Tremplin* |
| `PROGRAM` | Enveloppe budgétaire ou cadre opérationnel pluri-annuel. | *Programme FEDER Wallonie 2021-2027* |
| `PROJECT` | Projet collaboratif ou individuel mené par un consortium. | *Projet MecaWall 4.0* |
| `ACTION` | Jalon ou lot de travail (Work Package) dans un projet. | *Jalon 1 : Audit cybersécurité de la ligne de montage*|
| `ACTIVITY` | Action concrète délivrée (workshop, réunion, livrable). | *Atelier de sensibilisation du 15 mai* |

---

## 4. SCHÉMA PRISMA DU CADRE D'INTERVENTION

Le schéma de données utilise une clé étrangère auto-référencée et des contraintes d'intégrité de suppression cascade ou set-null adéquates :

```prisma
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
  code                String               @unique // ex: STRAT-S3, PROJ-MECAWALL
  label               String
  description         String?              @db.Text
  type                InterventionNodeType
  
  // Hiérarchie récursive
  parentId            Int?
  parent              InterventionNode?    @relation("InterventionHierarchy", fields: [parentId], references: [id], onDelete: SetNull)
  children            InterventionNode[]   @relation("InterventionHierarchy")
  
  startDate           DateTime?
  endDate             DateTime?
  status              String               @default("PLANNED") // PLANNED, IN_PROGRESS, COMPLETED
  budget              Float?
  
  // Lien avec l'organisation responsable du noeud
  ownerOrganizationId Int?
  ownerOrganization   Organization?        @relation("OrganizationNodes", fields: [ownerOrganizationId], references: [id], onDelete: SetNull)
  
  // Relations avec les classifications transversales
  classifications     EntityClassification[]
  
  createdAt           DateTime             @default(now())
  updatedAt           DateTime             @updatedAt

  @@map("intervention_nodes")
}
```

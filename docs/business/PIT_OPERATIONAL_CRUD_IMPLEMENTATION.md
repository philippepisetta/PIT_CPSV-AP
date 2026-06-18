# Plan d'Implémentation CRUD Opérationnel — PIT vNext

Ce document détaille le plan technique et fonctionnel mis à jour pour mettre en œuvre les priorités opérationnelles de la **Plateforme d'Intelligence Territoriale (PIT) vNext**, intégrant les retours de la validation globale.

---

## 🎯 OBJECTIFS ET SPÉCIFICATIONS MIS À JOUR

L'animateur ou le conseiller d'écosystème (BioWin, GreenWin, EDIH, etc.) doit pouvoir gérer l'intégralité du cycle de vie des bénéficiaires et de leurs relations.
1. **Bénéficiaires (Beneficiary)** : Interface de création, modification, et archivage (Soft Delete).
2. **Contacts (Contact)** : Création du modèle de contacts physiques avec type de contact (`contactType`) et indicateur de contact principal (`isPrimaryContact`).
3. **Adhésions (CommunityMembership)** : Adhésion portée directement par le `Beneficiary`, avec qualification du contexte (`membershipContext` : COMMUNITY, CLUSTER, POLE, PROGRAM, CONSORTIUM).
4. **Administration des Communautés** : Formulaires CRUD pour gérer les cercles et les inscriptions.

---

## 💾 1. EVOLUTION DE LA BASE DE DONNÉES (PRISMA)

Nous modifions les modèles dans le fichier `prisma/schema.prisma` :

### A. Nouveau Modèle `Contact` :
```prisma
model Contact {
  id               Int          @id @default(autoincrement())
  name             String
  email            String?
  phone            String?
  role             String?      // ex: Directeur R&D, Gérant...
  contactType      String       @default("OPERATIONAL") // TECHNICAL, ADMINISTRATIVE, EXECUTIVE, OPERATIONAL
  isPrimaryContact Boolean      @default(false)
  beneficiaryId    Int
  beneficiary      Beneficiary  @relation(fields: [beneficiaryId], references: [id], onDelete: Cascade)
  createdAt        DateTime     @default(now())
  updatedAt        DateTime     @updatedAt

  @@index([beneficiaryId])
  @@map("contacts")
}
```

### B. Modifications du modèle `Beneficiary` :
* **Nouveaux Champs d'Interopérabilité & Archivage** :
  - `status` : `String` à valeur `"ACTIVE"` ou `"ARCHIVED"` (`@default("ACTIVE")`) pour le Soft Delete.
  - `sourceSystem` : `String?` (provenance de la donnée, ex: BCE, DMAT, AWEX).
  - `sourceAuthority` : `String?` (autorité gestionnaire, ex: SPW, WE).
  - `lastSyncDate` : `DateTime?`
* **Nouvelles Relations** :
  - `contacts` : `Contact[]`
  - `memberships` : `CommunityMembership[]`

### C. Modifications du modèle `CommunityMembership` :
* Remplacement de `memberId` par `beneficiaryId`.
* Ajout du champ `membershipContext` :
```prisma
model CommunityMembership {
  id                Int         @id @default(autoincrement())
  beneficiaryId     Int
  beneficiary       Beneficiary @relation(fields: [beneficiaryId], references: [id], onDelete: Cascade)
  communityId       Int
  community         Community   @relation(fields: [communityId], references: [id], onDelete: Cascade)
  role              String?     // ex: Coordinateur, Animateur, Membre...
  joinedAt          DateTime    @default(now())
  status            String      @default("ACTIVE") // ACTIVE, INACTIVE
  membershipContext String      @default("COMMUNITY") // COMMUNITY, CLUSTER, POLE, PROGRAM, CONSORTIUM

  @@unique([beneficiaryId, communityId])
  @@map("community_memberships")
}
```

### D. Modifications du modèle `Member` :
* Retrait de `memberships` de `Member`.

---

## 🔌 2. SERVICES BACKEND & API (SERVER.TS)

### CRUD des Contacts (`/api/v2/contacts`) :
* `GET /api/v2/contacts` : Liste.
* `GET /api/v2/beneficiaries/:id/contacts` : Liste les contacts de l'entreprise.
* `POST /api/v2/contacts` : Crée avec `contactType` et `isPrimaryContact`.
* `PUT /api/v2/contacts/:id` : Mise à jour.
* `DELETE /api/v2/contacts/:id` : Suppression.

### CRUD des Bénéficiaires (`/api/v2/beneficiaries`) :
* `POST /api/v2/beneficiaries` : Enregistre une entreprise avec ses métadonnées interop.
* `PUT /api/v2/beneficiaries/:id` : Met à jour.
* `DELETE /api/v2/beneficiaries/:id` : **Soft Delete** (Met le statut à `"ARCHIVED"` au lieu de supprimer physiquement la ligne).
* Les requêtes de lecture existantes filtreront les bénéficiaires pour masquer ceux ayant le statut `"ARCHIVED"`.

### CRUD des Inscriptions (`/api/v2/community-memberships`) :
* Repenser l'intégration avec `beneficiaryId` et `membershipContext`.

---

## 💻 3. ÉCRANS ET WORKFLOWS UTILISATEUR (UI)

### A. Workspace Conseiller 360 (`/beneficiaries`)
* **Nouveau Bénéficiaire** : Formulaire modulaire incluant les champs d'interopérabilité (système source, autorité source) et de maturité.
* **Archivage** : L'action de suppression passe l'état à "Archivé", le masquant des listes actives.
* **Fiche Contact** : Liste des contacts de l'entreprise dans le volet 360, permettant de définir un contact principal (badge visuel) et de spécifier son type (Technique, Exécutif, etc.).

### B. Dashboard des Communautés (`/communities`)
* **Inscriptions par Contexte** :
  * Lors de l'inscription d'une entreprise au cercle, l'animateur sélectionne également le contexte d'adhésion (`membershipContext` : COMMUNITY, CLUSTER, POLE, PROGRAM, CONSORTIUM).

---

## 🚀 4. PRÉPARATION DU PROCHAIN SPRINT : ECOSYSTEMCHALLENGE CRUD

Le prochain sprint étendra la gestion opérationnelle des verrous technologiques (gaps) territoriaux :
* **Concept** : Permettre d'associer un `Challenge` d'écosystème à des financements, programmes et mesures au-delà du modèle de relation standard.
* **Écrans** : Formulaire avancé d'EcosystemChallenge avec ciblage territorial (Liaison à des communes/provinces) et indicateurs d'impact du plan de relance.
* **API** : Ajout d'endpoints de croisement `POST /api/v2/challenges/:id/align-strategic`.

# Spécifications Back-office CRUD Opérationnel – PIT vNext

Ce document définit les spécifications techniques et fonctionnelles du back-office CRUD opérationnel de la Plateforme d'Intégration Territoriale (PIT) vNext. Il détaille la matrice de sécurité, la sérialisation des métadonnées pour les structures figées, et le dictionnaire d'API.

---

## 🔒 1. Matrice de Sécurité et Rôles

Les écritures (création, modification, archivage) sont protégées par un contrôle d'accès basé sur le rôle envoyé dans l'entête HTTP `x-user-role` (transmis depuis le Workspace Next.js).

| Module CRUD | Entité Prisma | Actions CRUD | Rôles Autorisés |
| :--- | :--- | :--- | :--- |
| **Membres / Acteurs** | `prisma.member` | GET, POST, PUT, DELETE | `ADMIN`, `ANIMATEUR` |
| **Défis Territoriaux** | `prisma.challenge` | GET, POST, PUT, DELETE | `ADMIN`, `ANIMATEUR`, `ENTREPRISE` |
| **Services CPSV-AP** | `prisma.publicService` | GET, POST, PUT, DELETE | `ADMIN`, `ANIMATEUR` |
| **Parcours de Transformation** | `prisma.journey` / `JourneyInstance` | GET, POST, PUT, DELETE | `ADMIN`, `CONSEILLER` |
| **Opportunités** | `prisma.opportunity` | GET, POST, PUT, DELETE | `ADMIN`, `ANIMATEUR` |
| **Consortiums** | `prisma.consortium` | GET, POST, PUT, DELETE | `ADMIN`, `ANIMATEUR` |
| **Projets Collaboratifs** | `prisma.project` | GET, POST, PUT, DELETE | `ADMIN`, `ANIMATEUR` |
| **Outcomes (Résultats)** | `prisma.outcome` | GET, POST, PUT, DELETE | `ADMIN`, `ANIMATEUR` |
| **Preuves d'Impact (Evidences)**| `prisma.evidence` | GET, POST, PUT, DELETE | `ADMIN`, `CONSEILLER`, `DG` (validation) |
| **Événements** | `prisma.eventResource` | GET, POST, PUT, DELETE | `ADMIN`, `ANIMATEUR` |
| **Interventions & S3** | `prisma.program`, `prisma.filiere`, etc.| GET, POST, PUT, DELETE | `ADMIN`, `ANIMATEUR` |

---

## 🔄 2. Cycle de Vie et Workflows

Les objets majeurs suivent un cycle de vie caractérisé par le champ `status` :

*   **DRAFT** : Enregistrement initial. Modifiable et supprimable par son créateur. Non visible sur le Graph Explorer public.
*   **SUBMITTED** : Soumis pour révision. Verrouillé en modification pour les utilisateurs standards. Visible par les conseillers/animateurs pour validation.
*   **APPROVED / VALIDATED** : Validé. Intégré de manière permanente au Knowledge Graph Territorial. Visible par tous.
*   **ARCHIVED** : Soft-deleted. Retiré du graphe opérationnel et des visualisations courantes, mais conservé pour des raisons d'historique et d'audit des politiques publiques.

---

## 📦 3. Stratégie de Sérialisation des Métadonnées

Puisque le schéma Prisma est figé, toute métadonnée stratégique ou technique requise par les écosystèmes (ex. : urgence de défi, critères d'éligibilité avancés, coûts détaillés, baselines et cibles de KPI) mais non modélisée par un champ SQL natif sera sérialisée en JSON structuré dans les champs textuels `description` ou `notes` sous la forme :

```json
{
  "__meta__": true,
  "urgency": "HIGH",
  "baseline": 12.5,
  "target": 50.0,
  "customProperties": {
    "costDetail": "Gratuit sous réserve de diagnostic préalable",
    "eligibleSectors": ["NACE-62", "NACE-63"]
  }
}
```

Un parseur backend garantira l'extraction automatique de ces métadonnées lors des requêtes de lecture.

---

## 🛣️ 4. Dictionnaire d'API v2 (CRUD Restauration)

Toutes les routes sont préfixées par `/api/v2` et requièrent l'envoi de `x-user-role`.

### 4.1. Membres (`/api/v2/members`)
*   **GET `/`** : Filtres par mot-clé `q` et type `type`.
*   **POST `/`** : Crée un membre.
    *   *Payload* : `{ name, type, description, email, phone, website, location, competencies: [], size, nace, digitalMaturity, iaMaturity, cyberMaturity }`
*   **PUT `/:id`** : Modifie le membre spécifié.
*   **DELETE `/:id`** : Archive le membre.

### 4.2. Défis (`/api/v2/challenges`)
*   **GET `/`** : Liste les défis opérationnels.
*   **POST `/`** : Crée un défi.
    *   *Payload* : `{ name, code, description, challengeCategoryId }`
*   **PUT `/:id`** : Modifie un défi.
*   **DELETE `/:id`** : Supprime ou archive un défi.

### 4.3. Services CPSV-AP (`/api/v2/services`)
Aligné sur le vocabulaire CPSV-AP.
*   **POST `/`** et **PUT `/:id`** : Enregistrement avec ses sous-structures.
    *   *Payload* :
        ```json
        {
          "name": "Diagnostic IA",
          "description": "Analyse de maturité algorithmique pour PME",
          "code": "S-EDIH-DIAG-IA",
          "organizationId": 5,
          "interventionLevelId": 1,
          "channels": ["Web", "Présentiel"],
          "costs": [{ "name": "Standard", "value": 0.0, "currency": "EUR" }],
          "rules": [{ "name": "Règlement EDIH", "description": "Conditions d'octroi de l'aide de minimis" }],
          "requirements": [{ "name": "BCE active", "description": "Avoir un numéro BCE valide" }],
          "targetAudiences": ["PME", "Startup"],
          "outputs": [{ "name": "Rapport de maturité IA", "description": "Document de synthèse DMAT" }],
          "outcomes": [{ "name": "Augmentation maturité IA", "description": "Score DMAT +1" }],
          "challenges": [12, 14],
          "filieresS3": [1, 2]
        }
        ```
*   **DELETE `/:id`** : Soft-delete (archivage) du service public.

### 4.4. Parcours (`/api/v2/journeys` & `/api/v2/journey-instances`)
*   **POST `/journeys`** : Crée un JourneyTemplate.
*   **POST `/journey-instances`** : Assigne un modèle de parcours à une entreprise membre.
    *   *Payload* : `{ memberId, templateId, status: "ACTIVE" }`
*   **PUT `/journey-instances/:id`** : Avance ou met à jour le statut des étapes dans `journey_progress`.
*   **DELETE `/journeys/:id`** et `/journey-instances/:id` : Supprime/archive.

### 4.5. Consortiums et Projets (`/api/v2/consortia` & `/api/v2/projects`)
*   **POST `/consortia`** et **PUT `/consortia/:id`** : Enregistre le consortium et gère la table associative `consortium_members` (insertions/suppressions réactives des membres partenaires et de leurs rôles).
*   **POST `/projects`** et **PUT `/projects/:id`** : Crée/modifie un projet. Permet de le lier à un programme (`programId`), une initiative (`initiativeId`) et un bénéficiaire (`beneficiaryId`).
*   **DELETE `/:id`** : Archive le consortium ou le projet.

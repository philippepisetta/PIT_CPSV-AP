# CADRE DE TYPAGE DES RÉFÉRENTIELS (FRAMEWORK TYPES)

Ce document décrit la typologie des cadres de classification au sein de la PIT vNext. Il formalise le concept de **FrameworkType** pour typer qualitativement les différents référentiels gérés par le `ClassificationFramework`.

---

## 1. PROBLÉMATIQUE DU TYPAGE QUALITATIF

Dans le modèle unifié `ClassificationFramework`, nous gérons une multitude de référentiels sectoriels, techniques, académiques et réglementaires (S3, NACE, DR-BEST, DMAT, DigComp, TRL, etc.).

Cependant, ces référentiels ne partagent pas la même nature intrinsèque :
* Certains décrivent des nomenclatures d'activités économiques standardisées.
* D'autres décrivent des modèles de maturité par étapes successives.
* D'autres encore définissent des grilles de compétences individuelles ou des modèles d'impact.

Sans typage explicite de chaque framework, la PIT ne peut pas :
1. **Adapter son comportement de rendu UI** (ex: afficher une jauge linéaire progressive pour un modèle de maturité, ou un arbre à facettes pour une taxonomie).
2. **Valider la cohérence des liens de dépendance** (ex: s'assurer qu'un indicateur de résultat n'est lié qu'à un modèle de maturité ou d'impact).
3. **Optimiser les algorithmes de recommandation** (le moteur de recommandation traite différemment un tag de compétence et un tag de secteur industriel).

---

## 2. LE CONCEPT FRAMEWORKTYPE

Pour classifier structurellement nos référentiels, la PIT vNext introduit le concept de `FrameworkType`. Il s'agit d'une énumération définissant la nature conceptuelle d'un `ClassificationFramework`.

### Valeurs de l'énumération :

* **`TAXONOMY`** : Nomenclature structurée et généralement hiérarchique servant à classifier des entités selon des catégories métier ou des domaines d'activité.
* **`VOCABULARY`** : Thésaurus, glossaire ou vocabulaire contrôlé de termes normalisés facilitant l'interopérabilité sémantique.
* **`MATURITY_MODEL`** : Grille d'évaluation par niveaux successifs décrivant l'évolution progressive d'une capacité ou d'une technologie.
* **`SKILL_MODEL`** : Référentiel de compétences, de savoir-faire ou de connaissances requis ou acquis par des individus ou des organisations.
* **`IMPACT_MODEL`** : Modèle de mesure d'impact sociétal, environnemental, économique ou d'innovation permettant d'auditer des indicateurs clés.
* **`CLASSIFICATION_MODEL`** : Modèle de qualification multidimensionnel ou à facettes servant à typer la nature d'une intervention ou d'un service.

---

## 3. CARTOGRAPHIE DES RÉFÉRENTIELS DE LA PIT

Le tableau ci-dessous illustre l'affectation du `FrameworkType` aux référentiels existants et futurs de la PIT :

| Référentiel | FrameworkType Cible | Exemples de Termes (`ClassificationTerm`) | Rôle & Usage dans la PIT |
| :--- | :--- | :--- | :--- |
| **S3** (Smart Specialisation Strategy) | `TAXONOMY` | `S3-NUM` (Numérique), `S3-HEALTH` (Santé) | Classification des projets et services selon les priorités stratégiques régionales. |
| **NACE** (Belge/Européenne) | `TAXONOMY` | `62.02` (Conseil informatique), `22.21` (Plasturgie) | Classification sectorielle officielle des bénéficiaires (BCE). |
| **AI Taxonomy** | `TAXONOMY` | `Computer Vision`, `Natural Language Processing` | Qualification technologique fine des compétences et services de l'écosystème. |
| **CPSV Controlled Vocabularies** | `VOCABULARY` | `Life Event`, `Business Event`, `Output Type` | Alignement avec le modèle européen Common Public Service Vocabulary (interopérabilité). |
| **DMAT** (Digital Maturity Assessment) | `MATURITY_MODEL` | `DMAT-1` (Initial), `DMAT-4` (Optimisé) | Mesure du niveau de maturité digitale globale de la PME. |
| **TRL** (Technology Readiness Level) | `MATURITY_MODEL` | `TRL-4` (Validation labo), `TRL-9` (Système opérationnel) | Évaluation de la maturité technologique des projets de recherche et innovation. |
| **IRL** (Investment Readiness Level) | `MATURITY_MODEL` | `IRL-3` (Modèle économique validé), `IRL-7` (Prêt à investir) | Évaluation de l'éligibilité financière et de l'attractivité pour les investisseurs. |
| **MRL** (Manufacturing Readiness Level) | `MATURITY_MODEL` | `MRL-5` (Composants en environnement représentatif) | Évaluation de l'aptitude à l'industrialisation et à la production de masse. |
| **DigComp** (European Digital Competence) | `SKILL_MODEL` | `Information & data literacy`, `Safety` | Évaluation des compétences numériques individuelles des collaborateurs du bénéficiaire. |
| **DR-BEST** | `CLASSIFICATION_MODEL` | `D` (Demonstration), `R` (Readiness), `B` (Business)... | Qualification fonctionnelle de la nature des accompagnements délivrés par les opérateurs. |

---

## 4. IMPACT SUR LE SCHÉMA PHYSIQUE PRISMA

Dans le cadre du Sprint 1, le modèle `ClassificationFramework` inclura le champ `frameworkType` basé sur l'énumération Prisma correspondante :

```prisma
enum FrameworkType {
  TAXONOMY
  VOCABULARY
  MATURITY_MODEL
  SKILL_MODEL
  IMPACT_MODEL
  CLASSIFICATION_MODEL
}

model ClassificationFramework {
  id          Int                  @id @default(autoincrement())
  code        String               @unique // ex: DR-BEST, S3, NACE, TRL
  name        String
  description String?              @db.Text
  frameworkType FrameworkType        @default(TAXONOMY) // Nouveau champ introduit
  
  terms       ClassificationTerm[]
  
  createdAt   DateTime             @default(now())
  updatedAt   DateTime             @updatedAt

  @@map("classification_frameworks")
}
```

### Avantages de cette modélisation :
1. **Contraintes au niveau de la DB** : L'utilisation d'une énumération native empêche l'injection de types incohérents.
2. **Exploitation par le Frontend** : Les API REST renverront cette propriété, permettant au Cockpit de rendu dynamique d'ajuster les contrôles de saisie de manière appropriée (ex: les curseurs/sliders pour les `MATURITY_MODEL`, ou des sélecteurs hiérarchiques pour les `TAXONOMY`).

# SÉPARATION ARCHITECTURALE : PARCOURS DE TRANSFORMATION & DR-BEST

Ce document formalise la refonte méthodologique et technique du modèle PIT afin de distinguer proprement le **Parcours de Transformation** (axe principal de progression) et le cadre **DR-BEST** (axe secondaire de caractérisation des interventions).

---

## 1. CONTEXTE ET JUSTIFICATION MÉTIER

Dans les versions antérieures de la PIT, le modèle **DR-BEST** (*Demo, Readiness, Business, Ecosystem, Support, Technology*) était implicitement assimilé à un parcours séquentiel (l'utilisateur progressant de "Demo" vers "Technology"). 

Cette modélisation présente une faille conceptuelle majeure :
* **DR-BEST n'est pas un cycle de vie** : Une entreprise n'a pas vocation à passer séquentiellement de "Ecosystem" à "Support". DR-BEST qualifie la *nature intrinsèque* d'un service (ex. : un atelier de démonstration technologique vs un accompagnement à la levée de fonds).
* **Le parcours client est temporel et logique** : L'accompagnement d'un bénéficiaire suit un processus de maturation classique (de la sensibilisation initiale jusqu'au suivi après investissement), indépendamment de la dimension DR-BEST du service rendu.

### Décision d'Architecture Métier
Pour aligner la PIT sur les meilleures pratiques européennes et industrielles, nous séparons strictement ces deux concepts :

```mermaid
graph TD
    B[Bénéficiaire] -->|Se situe dans| JP[JourneyPhase - Axe Principal]
    B -->|Bénéficie de| S[PublicService]
    S -->|Positionné sur| JP
    S -->|Classifié par| DR[DR-BEST - Axe Secondaire / Tags]
    
    subgraph JourneyPhase (Temporel / Progression)
        AMORCAGE --> DIAGNOSTIC --> COACHING --> PLANIFICATION --> MISE_EN_OEUVRE --> INVESTISSEMENT --> SUIVI
    end
    
    subgraph DR-BEST (Nature / Typologie)
        DEMO
        READINESS
        BUSINESS
        ECOSYSTEM
        SUPPORT
        TECHNOLOGY
    end
```

---

## 2. BENCHMARK EUROPÉEN & PRATIQUES DE CONSEIL

Cette refonte s'inspire directement des cadres de référence de la Commission Européenne et des grands cabinets de conseil :

### A. Le Cadre des EDIH (European Digital Innovation Hubs)
Le programme *Digital Europe* définit le parcours de transformation d'une PME selon des étapes clés d'accompagnement :
1. **Sensibilisation & Découverte** (Amorçage)
2. **Évaluation de la maturité** (Diagnostic via le DMAT européen)
3. **Test before Invest** (Mise en œuvre / Prototypage)
4. **Recherche de financements** (Investissement)
5. **Formations et compétences** (Coaching / Readiness)

### B. Méthodologies de Cabinets de Conseil (BCG, McKinsey, Gartner)
Les cycles de transformation digitale dans le secteur privé suivent une séquence de jalons rigoureuse :
* *Alignement & Inspiration* → **Amorçage**
* *As-Is Assessment / Gap Analysis* → **Diagnostic**
* *Target Operating Model & Roadmap* → **Planification**
* *Pilotage & Minimum Viable Product (MVP)* → **Mise en œuvre**
* *Scale-Up & Financement* → **Investissement**
* *Value Realization & Continuous Improvement* → **Suivi**

---

## 3. COMPARAISON TECHNIQUE DU MODÈLE

| Service type | Phase du Parcours (Principal) | Caractérisation DR-BEST (Secondaire / Tags) |
| :--- | :--- | :--- |
| **Atelier de sensibilisation à l'IA** | `AMORCAGE` | `DEMO`, `TECHNOLOGY` |
| **Diagnostic de maturité cyber (DMAT)** | `DIAGNOSTIC` | `READINESS`, `TECHNOLOGY` |
| **Coaching stratégique IA pour managers**| `COACHING` | `BUSINESS`, `READINESS` |
| **Rédaction de feuille de route (Roadmap)**| `PLANIFICATION` | `BUSINESS` |
| **Prototypage / Test Before Invest IoT** | `MISE_EN_OEUVRE` | `TECHNOLOGY`, `READINESS` |
| **Aide au montage de dossier FEDER** | `INVESTISSEMENT` | `SUPPORT`, `BUSINESS` |
| **Suivi d'impact et monitoring de valeur**| `SUIVI` | `SUPPORT` |

---

## 4. IMPACTS SUR LE SCHÉMA DE DONNÉES (PRISMA)

### A. Nouvelle Entité : `JourneyPhase`
Un nouveau référentiel physique est créé pour centraliser les phases de transformation globale.
```prisma
model JourneyPhase {
  id          Int             @id @default(autoincrement())
  code        String          @unique // AMORCAGE, DIAGNOSTIC, etc.
  label       String          // e.g. "Amorçage"
  description String?         @db.Text
  order       Int             @default(0)

  services    PublicService[] @relation("ServiceJourneyPhase")
  activities  Activity[]      @relation("ActivityJourneyPhase")
  journeyStages JourneyStage[] @relation("JourneyStageJourneyPhase")

  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt
}
```

### B. Relations Ajoutées
1. **`PublicService`** : Lié à sa `JourneyPhase` attitrée (une relation N:1, car un service appartient à une phase principale du cycle de vie).
2. **`Activity`** : Liée à sa `JourneyPhase` pour tracer à quelle étape du parcours s'est déroulée l'activité concrète du bénéficiaire.
3. **`JourneyStage`** (ou *JourneyStep*) : Lié à sa `JourneyPhase` de rattachement pour aligner les étapes des parcours types sur le référentiel global.

### C. Préservation de DR-BEST (TransformationDimension)
La relation de classification `Service` ↔ `TransformationDimension` (`DRBEST[]`) est conservée telle quelle en tant que taxonomie secondaire multidimensionnelle (tags).

# CADRES DE RÉFÉRENCE COMPLÉMENTAIRES (METAMODEL EXTENSIONS) – PIT

Ce document décrit les trois cadres sémantiques complémentaires intégrés à la PIT pour formaliser les parcours des entreprises, le cycle de vie des financements, et la topologie des relations territoriales.

---

## 🧭 1. JOURNEY FRAMEWORK (Gestion des Parcours)
Le Journey Framework sépare le modèle théorique d'un parcours (Template) et l'exécution opérationnelle réelle par un bénéficiaire (Instance).

```
[JourneyTemplate] ─── (Contient) ───► [JourneyStage]
       │                                     │
       ▼ (Instanciation)                     ▼ (Liaison service/livraison)
[JourneyInstance] ─── (Mesure) ────► [JourneyProgress]
```

### ÉLÉMENTS :
1.  **JourneyTemplate** : Le modèle de parcours défini par un pôle ou un programme (ex: *"Parcours d'Innovation IA"* ou *"Parcours Transformation Verte"*).
2.  **JourneyStage** : Une étape jalonnant le template (ex: *Diagnostic*, *Sélection technologique*, *Test d'intégration*, *Mesure d'impact*).
3.  **JourneyInstance** : L'exécution du parcours par une entreprise spécifique (ex: *"Parcours IA de BioPlast SA"*).
4.  **JourneyProgress** : Suivi en temps réel de la progression (étape courante, étapes validées, date de passage, documents de complétion).

---

## 💰 2. FUNDING FRAMEWORK (Cycle de Vie des Financements)
Le Funding Framework structure le cycle de vie financier, reliant les programmes stratégiques à la création effective de projets et d'impacts.

```
[FundingProgram] ── (Lance) ──► [FundingCall] ── (Reçoit) ──► [FundingApplication]
                                                                     │
[Project] ◄────── (Génère) ────── [FundingAward] ◄─── (Valide) ──────┘
```

### ÉLÉMENTS :
1.  **FundingProgram** : Programme budgétaire régional ou européen (ex: *"FEDER Wallonie 2021-2027"*, *"Plan de Relance Wallonie"*).
2.  **FundingCall** : Un appel à projets spécifique daté et thématisé (ex: *"Appel Tremplin IA 2026 - Vague 3"*).
3.  **FundingApplication** : La candidature soumise par une entreprise ou un consortium pour répondre à un appel.
4.  **FundingAward** : L'octroi officiel de la subvention, définissant le montant accordé, l'organisme financeur et les jalons, et initiant automatiquement le **Projet** lié.

---

## 🕸️ 3. RELATIONSHIP FRAMEWORK (Réseau Territorial)
Le Relationship Framework permet de modéliser les liens d'affaires, de recherche et de sous-traitance, faisant de la PIT un véritable graphe social et économique territorial.

```
[Member A] ◄─── [Relationship (Type, Strength)] ───► [Member B]
```

### ÉLÉMENTS :
1.  **Relationship** : Liaison orientée ou bidirectionnelle reliant deux entités (ex: *CHU Liège* et *UCLouvain*).
2.  **RelationshipType** : Nature formelle de la relation (ex: `RESEARCH_COLLABORATION`, `SUBCONTRACTING`, `CONSORTIUM_PARTNER`, `TECHNOLOGY_SUPPLIER`, `EXPERT_ADVISOR`).
3.  **RelationshipStrength** : Intensité de la collaboration (`STRONG`, `MEDIUM`, `WEAK`), calculée automatiquement sur la base du nombre de projets partagés ou déclarée manuellement.

---

## 🔄 4. BOUCLE INTÉGRÉE DE CRÉATION DE VALEUR

Grâce à ces extensions, le réseau territorial de la PIT est entièrement interconnecté :

```
[Entreprise (Member)]
       │
       ▼ (Déclare)
[Challenge (Besoin)]
       │
       ▼ (S'inscrit dans)
[JourneyInstance (Parcours)]
       │
       ▼ (Consomme)
[PublicService (Service)]
       │
       ▼ (Candidature via Consortium)
[FundingApplication (Financement)]
       │
       ▼ (Approuvé par)
[FundingAward]
       │
       ▼ (Génère)
[Project (Projet collaboratif)]
       │
       ▼ (Produit)
[Outcome (Livrables)]
       │
       ▼ (Contribue à)
[StrategicContribution] ➔ [StrategicFramework (ex: S3)]
```
*Le DG de pôle ou l'agent public peut ainsi remonter le lignage complet depuis un impact macro-économique (ex: Emplois créés dans la S3 Santé) jusqu'au diagnostic initial d'une PME spécifique.*

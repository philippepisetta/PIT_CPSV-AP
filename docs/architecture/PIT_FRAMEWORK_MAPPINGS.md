# CARTOGRAPHIE ET CORRÉLATION DE RÉFÉRENTIELS (FRAMEWORK MAPPINGS)

Ce document décrit le modèle d'alignement sémantique et d'interopérabilité des référentiels (S3, NACE, DR-BEST, DMAT, TRL, etc.) dans la PIT vNext. Il formalise le concept de **FrameworkMapping** pour structurer le graphe de connaissances territorial.

---

## 1. COMPRENDRE L'INTEROPÉRABILITÉ SÉMANTIQUE

L'un des apports majeurs de la PIT vNext est sa capacité à croiser les grilles d'analyse régionales et européennes. Stocker indépendamment le DMAT (maturité), la S3 (stratégie) ou le TRL (innovation) ne suffit pas : la plateforme doit savoir **comment ils s'influencent mutuellement**.

> [!NOTE]
> **Définition** : Un **FrameworkMapping** (ou *Alignement de Termes*) est une relation sémantique orientée et typée reliant un terme de classification d'un framework donné à un autre terme d'un framework distinct.

```
┌───────────────────────────┐                 ┌───────────────────────────┐
│        Framework A        │                 │        Framework B        │
│    (ex: DMAT-Cyber)       │                 │    (ex: DigComp-Safety)   │
│                           │                 │                           │
│   Terme A: "Cyber Audit"  ├─[IMPLEMENTS]───►│  Terme B: "Data Security" │
└───────────────────────────┘                 └───────────────────────────┘
```

---

## 2. MODÈLE CONCEPTUEL DU MAPPING

Chaque alignement de référentiel est modélisé par un triplet sémantique (Sujet → Prédicat → Objet) liant deux termes de classification :

### Les Predicats / Relations typées
Pour exprimer la nuance de l'influence sémantique, nous définissons 7 types de relations d'alignement :

1. **`RELATED_TO`** (Association simple) : Les deux concepts partagent un domaine commun sans influence causale directe.
   * *Exemple* : `DRBEST-T` (Technology) ↔ `S3-NUM` (Numérique).
2. **`CONTRIBUTES_TO`** (Contribution d'impact) : L'atteinte d'un niveau ou l'usage d'un concept aide à en accomplir un autre.
   * *Exemple* : `TRL-4` (Validation en labo) → `CONTRIBUTES_TO` → `IRL-2` (Intérêt client validé).
3. **`SUPPORTS`** (Alignement stratégique) : Un maillon opérationnel soutient un objectif de plus haut niveau.
   * *Exemple* : `NACE-21.20` (Pharma) → `SUPPORTS` → `S3-SANTE`.
4. **`IMPLEMENTS`** (Spécialisation d'un cadre par un autre) : Une activité ou compétence met en œuvre une consigne de maturité.
   * *Exemple* : `DMAT-Cyber-Maturity` → `IMPLEMENTS` → `DigComp-Safety`.
5. **`MEASURES`** (Évaluation qualitative/quantitative) : Un indicateur ou cadre d'évaluation évalue un domaine d'activité.
   * *Exemple* : `DMAT` → `MEASURES` → `DRBEST-R` (Readiness).
6. **`ENABLES`** (Capacité opérationnelle) : Une compétence ou technologie active un maillon de chaîne de valeur.
   * *Exemple* : `AI-Taxonomy-ComputerVision` → `ENABLES` → `S3-INDUSTRIE-FUTUR` (Contrôle qualité automatique).
7. **`DEPENDS_ON`** (Prérequis technologique ou métier) : Un terme requiert l'activation préalable d'un autre.
   * *Exemple* : `TRL-5` (Validation dans l'environnement) → `DEPENDS_ON` → `TRL-4`.

---

## 3. IMPACT SUR LE MOTEUR DE RECOMMANDATION ET LE KNOWLEDGE GRAPH

L'introduction du modèle de mapping sémantique permet de passer d'un moteur de recommandation basé sur des règles statiques à un **moteur de recommandation sémantique (Knowledge Graph-driven)** :

### A. Explications contextuelles de la recommandation (Explicabilité)
Grâce au graphe de relations, la PIT peut générer des justifications intelligentes et personnalisées pour l'utilisateur :
* *Recommandation brute* : "Nous vous suggérons le service 'Coaching NIS2'."
* *Explication sémantique* : "Ce service est recommandé car votre audit **DMAT** indique une faiblesse en Cybersécurité (score < 2), ce qui impacte votre conformité réglementaire (**DigComp-Safety**) nécessaire pour la filière **S3-INDUSTRIE-FUTUR** sur laquelle votre entreprise est positionnée."

### B. Transitivité des recommandations
Si un bénéficiaire a un défi lié à l'intégration de l'IA (`CH-IA`), le système peut inférer les besoins sous-jacents en compétences en naviguant dans le graphe :
`CH-IA` ──[RELATED_TO]──► `CAP-DIG-AI` ──[DEPENDS_ON]──► `CAP-DIG-DATA` (Compétences de gestion des données).
Le moteur recommandera alors en premier lieu un diagnostic de qualité des données avant de proposer des prototypes de modèles IA.

---

## 4. SCHÉMA DE DONNÉES PRISMA (AJOUT ADDITIF PHASE 0)

```prisma
enum MappingRelationshipType {
  RELATED_TO
  CONTRIBUTES_TO
  SUPPORTS
  IMPLEMENTS
  MEASURES
  ENABLES
  DEPENDS_ON
}

model FrameworkMapping {
  id               Int                     @id @default(autoincrement())
  relationship     MappingRelationshipType
  description      String?                 @db.Text
  
  // Terme Source (Sujet)
  sourceTermId     Int
  sourceTerm       ClassificationTerm      @relation("SourceMapping", fields: [sourceTermId], references: [id], onDelete: Cascade)
  
  // Terme Cible (Objet)
  targetTermId     Int
  targetTerm       ClassificationTerm      @relation("TargetMapping", fields: [targetTermId], references: [id], onDelete: Cascade)
  
  createdAt        DateTime                @default(now())
  updatedAt        DateTime                @updatedAt

  @@unique([sourceTermId, targetTermId, relationship])
  @@index([sourceTermId])
  @@index([targetTermId])
  @@map("framework_mappings")
}
```

*Note : Les relations bidirectionnelles inverses dans le modèle `ClassificationTerm` de Prisma s'écrivent ainsi :*
```prisma
// Ajouté dans model ClassificationTerm :
// sourceMappings FrameworkMapping[] @relation("SourceMapping")
// targetMappings FrameworkMapping[] @relation("TargetMapping")
```

---

## 5. TRAÇABILITÉ ET PROVENANCE DES MAPPINGS (MAPPING PROVENANCE)

Dans un graphe de connaissances partagé à l'échelle d'un territoire, la confiance et la traçabilité des liens sémantiques sont fondamentales. Pour savoir à tout moment d'où provient une relation et quelle est sa fiabilité, la PIT vNext introduit le concept de **MappingProvenance**.

* **Définition** : La provenance qualifie le mode de création et le degré de certitude d'une relation `FrameworkMapping`.
* **Valeurs et niveaux de provenance** :
  * `MANUAL` (Saisie humaine) : Le mapping a été encodé par un administrateur ou un expert méthodologique. C'est le niveau de confiance maximal (**100%**).
    * *Exemple* : `DMAT-Cyber` → [IMPLEMENTS] → `DigComp-Safety` (Saisie par les experts AdN).
  * `INFERRED` (Déduction logique) : La relation a été générée automatiquement par le moteur de règles ou par transitivité sémantique (**90%**).
    * *Exemple* : Si `A` est lié à `B` et `B` est lié à `C` dans la hiérarchie NACE, alors le lien direct `A` → `C` est inféré logiquement.
  * `AI_GENERATED` (Génération par IA) : La relation a été suggérée par un grand modèle de langage (LLM) ou un algorithme d'apprentissage automatique en analysant les descriptions textuelles des taxonomies (**70%**).
    * *Exemple* : `AI-Taxonomy-ComputerVision` → [ENABLES] → `S3-INDUSTRIE-FUTUR` (Proposé par IA par analyse textuelle des fiches).
* **Impact sur le pilotage** :
  * **Modération** : Les liens labellisés `AI_GENERATED` sont stockés en état "brouillon" dans la PIT et soumis à la validation des administrateurs pour passer au statut `MANUAL`.
  * **Transparence d'explication** : Lors d'une recommandation IA à une PME, le moteur sémantique peut préciser : *"Ce service vous est suggéré sur base d'un alignement sémantique identifié automatiquement par IA entre votre activité et le référentiel S3."*

### Modélisation Prisma enrichie :
```prisma
enum MappingProvenance {
  MANUAL
  INFERRED
  AI_GENERATED
}

// Ajouté au modèle FrameworkMapping :
// model FrameworkMapping {
//   ...
//   provenance   MappingProvenance @default(MANUAL)
//   confidence   Float             @default(1.0) // Score de confiance entre 0.0 et 1.0
// }
```

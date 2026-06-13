# STRATÉGIE D'IDENTIFICATION SÉMANTIQUE (SEMANTIC IDENTIFIER STRATEGY)

Ce document décrit la stratégie d'identification sémantique unifiée de la PIT vNext. Il formalise l'intégration des concepts de **`semanticId`** et de **`uri`** au sein du modèle de données afin de préparer l'interopérabilité native de la plateforme avec les espaces de données européens, les graphes de connaissances (GraphDB) et les protocoles temps-réel (NGSI-LD).

---

## 1. CONTEXTE ET ENJEUX DE L'INTEROPÉRABILITÉ SÉMANTIQUE

La PIT évolue vers un **Territorial Knowledge Graph** (Graphe de Connaissances Territorial). Pour que cette base de connaissances soit exploitable à l'échelle européenne et s'intègre dans les initiatives telles que le *Digital for Wallonia (D4WMO)* ou le modèle de services publics *CPSV-AP*, les entités de la PIT doivent posséder une identité globale et non locale.

### Problématique des Identifiants Physiques :
Aujourd'hui, les entités de la PIT utilisent des identifiants numériques auto-incrémentés en base de données (ex: `PublicService.id = 145`).
Ces IDs :
* Sont uniquement valables dans le périmètre de la base de données SQL locale de la PIT.
* Ne peuvent pas être directement liés dans un graphe de connaissances décentralisé (Linked Data).
* Nécessitent des tables de correspondances complexes lors de l'intégration avec des plateformes partenaires.

### La Solution : L'Identifiant Sémantique unique (URI)
En ajoutant un attribut `semanticId` (ou `uri`) à chaque entité clé dès la Phase 0, nous préparons l'exposition de nos données au format **JSON-LD** et **NGSI-LD** sans devoir modifier l'implémentation physique ni migrer les bases de données ultérieurement.

---

## 2. RÈGLES DE CONSTITUTION DES URIs (SYNTAXE CIBLE)

Pour garantir la pérennité et la standardisation des identifiants, nous adoptons deux approches selon la provenance de l'entité.

### A. Espace de Noms de la PIT (Données nées dans la PIT)
Pour les entités créées et gérées directement par la PIT, la syntaxe cible est la suivante :

```text
https://pit.wallonie.be/id/{entityType}/{localIdentifier}
```

* **Base URI** : `https://pit.wallonie.be/id/` (Espace de noms faisant autorité pour le territoire wallon).
* **`entityType`** : Le nom du modèle au format kebab-case (ex: `journey-template`, `intervention-node`, `service-delivery`).
* **`localIdentifier`** : L'identifiant interne de l'entité (UUID généré ou code métier invariant).

*Exemples* :
* Un modèle de parcours : `https://pit.wallonie.be/id/journey-template/jt-digital-growth-2026`
* Une étape de parcours : `https://pit.wallonie.be/id/journey-stage/js-ia-readiness-audit`
* Un noeud d'intervention : `https://pit.wallonie.be/id/intervention-node/node-s3-numerique`

### B. Espaces de Noms Externes (Données importées)
Pour les données issues de systèmes d'autorité externes, nous conservons ou forgeons des URIs basées sur les référentiels de ces partenaires :

* **BCE (Entreprises)** : `https://bce.wallonie.be/id/organization/{numero_bce}`
* **DMAT (Maturité Digitale)** : `https://dmat.europa.eu/id/assessment/{dmat_id}`
* **CPSV Controlled Vocabularies** : `http://data.europa.eu/m8g/public-services/{vocab_code}`
* **NACE Nomenclatures** : `http://data.europa.eu/ux2/nace2/{nace_code}`

---

## 3. APPLICABILITÉ ET MODÈLE DE DONNÉES CIBLE

L'attribut `semanticId` (type `String`, unique et indexé) est applicable à l'ensemble des entités stratégiques du graphe :

| Entité | Nom de l'Attribut | Exemple de Valeur (URI) | Usage / Alignement |
| :--- | :--- | :--- | :--- |
| **ClassificationTerm** | `semanticId` | `http://data.europa.eu/ux2/nace2/6202` | Liaison avec les taxonomies officielles européennes. |
| **InterventionNode** | `semanticId` | `https://pit.wallonie.be/id/intervention-node/s3-priorite-num` | Ancrage dans la hiérarchie des politiques publiques. |
| **JourneyTemplate** | `semanticId` | `https://pit.wallonie.be/id/journey-template/circular-transition` | Modélisation sémantique des parcours d'accompagnement. |
| **JourneyStage** | `semanticId` | `https://pit.wallonie.be/id/journey-stage/stage-coaching` | Identification sémantique des jalons de progression. |
| **Outcome** | `semanticId` | `https://pit.wallonie.be/id/outcome/dmat-score-validation` | Publication du résultat d'accompagnement dans les Data Spaces. |
| **Beneficiary** | `semanticId` | `https://bce.wallonie.be/id/organization/0123456789` | Alignement avec le registre légal belge des entreprises. |
| **Organization** | `semanticId` | `https://pit.wallonie.be/id/organization/wallonie-entreprendre` | Référencement de l'opérateur dans le graphe territorial. |
| **Ecosystem** | `semanticId` | `https://pit.wallonie.be/id/ecosystem/eco-digital-wallonia` | Regroupement sémantique d'acteurs de l'écosystème. |
| **ServiceDelivery** | `semanticId` | `https://pit.wallonie.be/id/service-delivery/del-987654321` | Traçabilité des prestations sous forme d'événements sémantiques. |

---

## 4. IMPACT PRISMA ADDITIF (À PARTIR DU SPRINT 1)

Dans les schémas Prisma physiques des sprints futurs, l'attribut `semanticId` sera configuré comme une colonne optionnelle dans un premier temps pour assurer la compatibilité MVP, puis obligatoire pour les nouvelles entités.

```prisma
// Exemple d'application additive sur le modèle ClassificationTerm du Sprint 1
model ClassificationTerm {
  id             Int                  @id @default(autoincrement())
  code           String               @unique // ex: S3-NUM
  name           String
  description    String?              @db.Text
  
  // Attribut sémantique unique
  semanticId     String?              @unique // ex: http://data.europa.eu/ux2/nace2/6202
  
  frameworkId    Int
  framework      ClassificationFramework @relation(fields: [frameworkId], references: [id], onDelete: Cascade)
  
  parentId       Int?
  parent         ClassificationTerm?  @relation("TermHierarchy", fields: [parentId], references: [id], onDelete: SetNull)
  children       ClassificationTerm[] @relation("TermHierarchy")
  
  classifications EntityClassification[]
  
  createdAt      DateTime             @default(now())
  updatedAt      DateTime             @updatedAt

  @@map("classification_terms")
  @@index([semanticId]) // Indexation pour les requêtes de recherche sémantique
}
```

---

## 5. SCÉNARIOS D'EXPLOITATION SÉMANTIQUE (FUTUR)

L'implémentation de la `Semantic Identifier Strategy` ouvre trois cas d'usage majeurs sans coût de développement additionnel :

### A. Sérialisation JSON-LD (Web Sémantique)
Lorsqu'un client demandera un service public via l'API REST de la PIT en spécifiant l'en-tête `Accept: application/ld+json`, le serveur sérialisera dynamiquement les entités en injectant les `@context` et `@id` sémantiques basés sur les `semanticId` stockés :

```json
{
  "@context": "https://data.europa.eu/m8g/context/public-service-ap.jsonld",
  "@id": "https://pit.wallonie.be/id/public-service/diagnostic-cyber",
  "@type": "PublicService",
  "name": "Diagnostic de Cybersécurité EDIH",
  "hasClassification": {
    "@id": "http://data.europa.eu/ux2/nace2/6202",
    "@type": "ClassificationTerm",
    "prefLabel": "Conseil informatique"
  }
}
```

### B. Exposition NGSI-LD (Data Spaces temps réel)
Pour publier des événements de livraison de services (`ServiceDelivery`) sur un broker NGSI-LD (ex: Scorpio, Orion-LD), le payload requiert impérativement des identifiants au format URN/URI. L'attribut `semanticId` servira directement de clé d'entité NGSI-LD :

```json
{
  "id": "urn:ngsi-ld:ServiceDelivery:del-987654321",
  "type": "ServiceDelivery",
  "deliveredTo": {
    "type": "Relationship",
    "object": "urn:ngsi-ld:Organization:0123456789"
  },
  "lastSyncDate": {
    "type": "Property",
    "value": "2026-06-13T14:53:51Z"
  }
}
```

### C. Import dans GraphDB / RDF Store
Les exports nocturnes de la base SQL relationnelle vers GraphDB s'effectueront via un convertisseur R2RML très simple qui mappera chaque champ `semanticId` en noeud sujet/objet RDF, éliminant le besoin de réconcilier des clés physiques différentes.

# CONFIGURATION ET ARCHITECTURE DES VUES MÉTIER (BUSINESS VIEWS)

Ce document décrit le concept de **Business Views** (ou *Projections Métier*) de la PIT vNext. Il détaille la couche d'abstraction qui permet de projeter la base de données générique et unifiée de la PIT dans des contextes métier spécifiques et familiers aux utilisateurs (S3, EDIH, Circular Wallonia, Plan de Relance, etc.).

---

## 1. LE CONCEPT DE BUSINESS VIEW

Dans la PIT vNext, l'intégralité des données d'intervention, de qualification et de progression est stockée sous une forme hautement normalisée et générique :
* Les stratégies, projets et activités sont des `InterventionNode`.
* Les taxonomies et référentiels sont des `ClassificationTerm`.
* Les étapes de progression sont des `JourneyProgress` liés à des `JourneyTemplate`.

Pour éviter d'exposer cette complexité d'ingénierie brute aux utilisateurs et aux partenaires administratifs, la PIT introduit la notion de **Business View** (ou *Projection Métier*).

> [!NOTE]
> **Définition** : Une Business View est une représentation métier spécialisée, dynamique et contextuelle, construite en agrégeant et en filtrant les données issues des différents frameworks sous-jacents de la PIT.

```
┌────────────────────────────────────────────────────────┐
│                  COUCHE APPLICATIVE                    │
│   S3 View    │    EDIH View    │   Circular Wallonia   │  <-- Business Views
└───────┬───────────────┬─────────────────┬──────────────┘
        │               │                 │
┌───────▼───────────────▼─────────────────▼──────────────┐
│                    COUCHE GÊNÉRIQUE                    │
│   InterventionNode  │  JourneyTemplate  │  Outcome...  │  <-- Core Frameworks
└────────────────────────────────────────────────────────┘
```

---

## 2. SPÉCIFICATIONS DES PROJECTIONS MAJEURES

### A. La Vue "S3 (Stratégie de Spécialisation Intelligente)"
La S3 nécessite un pilotage axé sur l'alignement technologique régional et le monitoring d'impact global.

* **Composants sous-jacents mobilisés** :
  * `InterventionNode` (type = `STRATEGY` (S3) → `PRIORITY` → `MEASURE` → `PROGRAM`).
  * `ClassificationTerm` (framework = `S3` (Domaines et chaînes de valeur)).
  * `ServiceDelivery` (prestations de services publics délivrées).
  * `Indicator` (mesures d'impact S3 comme le TRL ou le taux d'investissement privé levé).
* **Règle de projection** : L'écran S3 filtre tous les `InterventionNode` descendants de la stratégie S3 et compile les indicateurs de résultats de l'ensemble des `ServiceDelivery` associés aux termes sémantiques S3, indépendamment du programme financier qui a supporté la prestation.

### B. La Vue "EDIH (European Digital Innovation Hub)"
L'EDIH WallonIA a des exigences de rapportage strictes vis-à-vis de la Commission Européenne (indicateurs d'activité DMAT et types de services).

* **Composants sous-jacents mobilisés** :
  * `InterventionNode` (type = `PROGRAM` (EDIH) → `PROJECT` (Work Packages) → `ACTION`).
  * `ClassificationTerm` (framework = `DR-BEST` et `DMAT`).
  * `JourneyTemplate` (Parcours type EDIH WallonIA).
  * `ServiceDelivery` (prestations exécutées sous le modèle "Test before Invest").
  * `Evidence` (rapports de maturité DMAT requis).
* **Règle de projection** : L'écran EDIH présente la liste des bénéficiaires ayant une `JourneyInstance` active sur le modèle de parcours EDIH, affiche leur score DMAT (indicateur) et valide l'avancement des Work Packages (représentés par les jalons d'`InterventionNode`).

### C. La Vue "Circular Wallonia"
Cette vue est centrée sur le cycle de vie industriel, les flux de matière et la transition écologique.

* **Composants sous-jacents mobilisés** :
  * `InterventionNode` (type = `STRATEGY` (Circular Wallonia) → `PRIORITY` (Axe de transition) → `MEASURE`).
  * `ClassificationTerm` (framework = `NACE` (secteurs industriels) et `Circularité` (taxonomie de recyclage/réemploi)).
  * `Indicator` (réduction en tonnes de CO2, valorisation des déchets de plâtre/plastique).
* **Règle de projection** : L'écran projette la progression des industriels sur les axes circulaires régionaux et comptabilise l'impact physique (indicateurs de réduction carbone) généré par les livraisons de services.

---

## 3. IMPLÉMENTATION TECHNIQUE DE LA COUCHES DE PROJECTION

Les Business Views ne sont pas stockées sous forme de tables physiques redondantes. Elles sont implémentées via :

1. **Des Vues de Base de Données (PostgreSQL Views)** :
   Vues sémantiques matérialisées ou dynamiques pour simplifier les requêtes complexes de jointure (ex: `view_s3_metrics` joignant `entity_classifications` et `service_deliveries`).
2. **Des résolveurs d'API spécifiques (GraphQL / Prisma Controllers)** :
   Au niveau du serveur API, des résolveurs métier consolidés traduisent les requêtes UI en filtres Prisma normalisés.
   * Exemple de résolveur sémantique :
     ```typescript
     // Simulation conceptuelle de récupération S3
     const s3ViewData = await prisma.interventionNode.findMany({
       where: {
         classifications: {
           some: { term: { framework: { code: "S3" } } }
         }
       },
       include: {
         children: true,
         classifications: true
       }
     });
     ```
3. **Des Mappings en Entrée d'Interface (UI Hydrators)** :
   Des adaptateurs côté client traduisent les payloads génériques en structures prêtes pour l'affichage (ex: groupement des étapes par ordre de parcours dynamique).

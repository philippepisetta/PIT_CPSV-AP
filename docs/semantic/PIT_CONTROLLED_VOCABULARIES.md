# 🌐 Plateforme d'Intelligence Territoriale (PIT) — Référentiel des Vocabulaires Contrôlés & Taxonomies

## Référentiel Sémantique Officiel du Territorial Knowledge Graph (v1.0)

Ce document constitue le référentiel sémantique officiel de la **Plateforme d'Intelligence Territoriale (PIT)**. Il répertorie et structure l'ensemble des taxonomies, vocabulaires contrôlés, thésaurus, échelles de mesure et classifications sémantiques qui alimentent le graphe de connaissances territorial et orchestrent le matchmaking automatique du moteur de recommandation.

---

## 🗺️ 1. Carte Générale des Taxonomies PIT

Les référentiels de la PIT sont structurés en 4 grands domaines sémantiques :

```
📁 Référentiel Sémantique PIT
├── 🎯 Domaine Stratégique & Innovation (S3)
│   ├── S3 Domain Hierarchy (S3Domain ➔ ValueChain ➔ ValueChainStage)
│   └── Cadre d'impact régional (ImpactDimensions)
├── ⚙️ Domaine Opérationnel & Matchmaking
│   ├── Classification de l'offre publique (DR-BEST)
│   ├── Domaines de compétences (Capability Domains)
│   ├── Besoins & Problématiques (Challenge Taxonomy)
│   └── Niveaux & Typologies d'intervention (InterventionTypes)
├── 🏢 Domaine Acteurs & Écosystèmes
│   ├── Rôles des Organisations (OrganizationRole)
│   ├── Spécialisations des structures (EcosystemType)
│   └── Délimitations spatiales (TerritoryType)
└── 📊 Domaine Métadonnées & Gouvernance des Données
    ├── Modèles d'audit (Assessment Taxonomies)
    ├── Actifs de connaissances (KnowledgeAssetType)
    └── Standardisation Open Data (Data Governance / DCAT-AP)
```

---

## 🎯 2. Taxonomie Stratégique : Spécialisation Intelligente (S3)

L'alignement avec la Stratégie de Spécialisation Intelligente (S3) de la Wallonie s'impose sous forme de hiérarchie stricte à 3 niveaux :

$$\text{S3Domain} \implies \text{ValueChain} \implies \text{ValueChainStage}$$

```
📁 S3 Domain Hierarchy
├── 🏭 Industrie du Futur / Advanced Manufacturing (S3-IND)
│   ├── Manufacturing de pointe & Robotique (VC-IND-ROB)
│   └── Matériaux avancés & Métallurgie (VC-IND-MAT)
├── 🧬 Santé & Sciences du Vivant (S3-SAN)
│   ├── Biotechnologies & Pharma (VC-SAN-BIO)
│   └── Dispositifs médicaux & Technologies de santé (VC-SAN-MED)
├── ♻️ Économie Circulaire & Chimie verte (S3-CIRC)
│   ├── Construction & Matériaux circulaires (VC-CIRC-CONST)
│   └── Chimie verte, polymères & bio-matériaux (VC-CIRC-CHEM)
├── ⚡ Énergie Propre & Vecteur Hydrogène (S3-ENER)
│   ├── Infrastructures et vecteurs Hydrogène (VC-ENER-H2)
│   └── Réseaux d'énergie intelligents & Stockage (VC-ENER-GRID)
├── 🌾 Agroalimentaire Durable (S3-AGRO)
│   ├── Agriculture de précision (VC-AGRO-PREC)
│   └── Transformation alimentaire locale & saine (VC-AGRO-PROC)
└── 💻 Numérique & Technologies Clés (S3-DIGITAL)
    ├── Intelligence Artificielle & Data Science (VC-DIG-AI)
    └── Cybersécurité & Systèmes embarqués sécurisés (VC-DIG-CYBER)
```

### Raccordement au Modèle PIT (Predicates) :
*   `Service` ➔ `ValueChainStage` : Le service cible un maillon opérationnel (prédicat `:targetsStage`).
*   `Journey` ➔ `ValueChain` : Le parcours est aligné avec une filière d'innovation S3 (prédicat `:alignedWithValueChain`).
*   `Capability` ➔ `ValueChainStage` : La compétence technique est requise sur un maillon (prédicat `:applicableToStage`).
*   `Organization` ➔ `ValueChain` : L'opérateur pilote ou intervient dans une filière (prédicat `:operatesInValueChain`).
*   `Challenge` ➔ `ValueChain` : Le défi métier concerne une filière spécifique (prédicat `:challengesValueChain`).
*   `Program` & `Project` ➔ `S3Domain` : Le programme de financement ou le projet de recherche s'inscrit dans un axe S3 (prédicat `:fundedUnderS3Domain`).

---

## ⚙️ 3. Le Cadre de Classification DR-BEST

Le framework **DR-BEST** (Data, Remote, Business, Ecosystem, Skills, Technology) sert exclusivement à classifier l'**offre** (les ressources publiques régionales). 

> [!IMPORTANT]
> **Règle d'application absolue** : DR-BEST classifie les **Services**, **Parcours**, **Activités** et **Programmes** (l'offre d'accompagnement). Il ne doit jamais être utilisé pour classifier directement le profil d'un bénéficiaire (qui est audité via les évaluations de maturité).

```
📁 Classification DR-BEST
├── 📊 D = Data (Diagnostics de données, architectures de bases de données, Open Data)
├── 🌐 R = Remote (Outils collaboratifs, travail décentralisé, capteurs distants)
├── 💼 B = Business (Business models, rentabilité, marketing, coaching stratégique)
├── 💗 E = Ecosystem (Réseautage, clusters, mise en relation, événements d'écosystème)
├── 🎓 S = Skills (Formations technologiques, upskilling des ingénieurs et techniciens)
└── 🛠️ T = Technology (Test Before Invest, implémentation IA/OT/Cyber, prototypage)
```

---

## 🧠 4. Référentiel des Capabilités (Capability Domains)

La taxonomie des capabilités modélise les technologies clés et les compétences d'affaires maîtrisées ou recherchées sur le territoire.

```
📁 Capability Domains
├── 💻 Numérique & Technologies Clés (CAP-DIG)
│   ├── Intelligence Artificielle & GenAI (CAP-DIG-AI) [Synonyme: ML, RAG, Deep Learning]
│   ├── Data Analytics & Data Management (CAP-DIG-DATA) [Synonyme: Big Data, ETL]
│   ├── Cybersécurité (CAP-DIG-CYBER) [Synonyme: Pentesting, InfoSec, NIS2]
│   ├── Cloud Computing & Edge (CAP-DIG-CLOUD) [Synonyme: SaaS, PaaS, AWS]
│   ├── Internet of Things - IoT (CAP-DIG-IOT) [Synonyme: Capteurs, Smart Devices]
│   ├── GIS / Systèmes d'information géographique (CAP-DIG-GIS) [Synonyme: Cartographie]
│   ├── Jumeau Numérique / Digital Twin (CAP-DIG-TWIN) [Synonyme: Simulation 3D]
│   ├── Robotique & Cobotique (CAP-DIG-ROB) [Synonyme: Automatisation physique]
│   ├── Réalité Étendue - XR / VR / AR (CAP-DIG-XR) [Synonyme: Métavers, simulation immersive]
│   ├── Blockchain & DLT (CAP-DIG-BLOCK) [Synonyme: Smart Contracts]
│   └── Calcul Haute Performance - HPC (CAP-DIG-HPC) [Synonyme: Supercomputing]
├── ⚙️ Excellence Opérationnelle (CAP-OPS)
│   ├── Automatisation des Processus / RPA (CAP-OPS-AUTO)
│   └── Industrie 4.0 & Intégration OT (CAP-OPS-IND4)
├── ♻️ Transition Environnementale (CAP-ENV)
│   ├── Circularité & Éco-conception (CAP-ENV-CIRC)
│   └── Décarbonation & Efficacité Énergétique (CAP-ENV-DECARB)
└── 💼 Croissance & Gouvernance d'Entreprise (CAP-BUS)
    ├── Internationalisation (CAP-BUS-INT)
    ├── Préparation à l'Exportation (CAP-BUS-EXPORT)
    ├── Finance & Accès au Capital (CAP-BUS-FIN)
    ├── Compétences & Upskilling (CAP-BUS-SKILLS)
    ├── Gouvernance & Compliance réglementaire (CAP-BUS-GOV)
    └── Résilience & Gestion de risques (CAP-BUS-RES)
```

---

## ❓ 5. Taxonomie des Défis (`Challenge`)

Un défi modélise une problématique d'affaires ou technique rencontrée par une PME.

*   **`ChallengeCategory`** : Regroupement macro-économique (ex: `TRANSITION_NUMERIQUE`, `TRANSITION_ECOLOGIQUE`, `CROISSANCE_AFFAIRES`, `CONFORMITE`).
*   **`ChallengeType`** : Nature du défi (ex : `STRATEGIC`, `OPERATIONAL`, `REGULATORY`).

### Mappage et Propagation Sémantique :
*   `Challenge ➔ Capability` (prédicat `:requiresCapability`) : Relever le défi *Adoption IA* requiert la capabilité *AI*.
*   `Challenge ➔ Service` (prédicat `:resolvedByService`) : Le défi *Cybersécurité* est résolu par le service *Audit Cybersécurité*.
*   `Challenge ➔ Journey` (prédicat `:triggersJourney`) : Le défi *Export* déclenche le *Parcours Exportation*.
*   `Challenge ➔ Impact` (prédicat `:contributesToImpact`) : Résoudre le défi *Décarbonation* contribue à l'impact *Décarbonation* (tonnes de CO2 économisées).

---

## 🛠️ 6. Typologies d'Intervention (`InterventionType`)

Cette classification regroupe les différentes typologies d'actions proposées par les opérateurs régionaux :

*   **`Service`** : Prestation de base standardisée.
*   **`Diagnostic`** : Audit initial visant à évaluer la maturité et qualifier les défis.
*   **`Formation`** : Transfert de compétences théorique ou pratique.
*   **`Coaching`** : Accompagnement individuel régulier sur la durée.
*   **`Financement`** : Subsides, chèques entreprises ou investissement en capital.
*   **`Evénement`** : Séances collectives d'information ou de réseautage.
*   **`Mission Ecosystème`** : Animation de filières de deuxième ligne.
*   **`Audit`** : Évaluation formelle de conformité réglementaire (ex: NIS2).
*   **`Conseil`** : Prestation d'expertise ponctuelle.
*   **`Appel à projets`** : Financement collaboratif de R&D par vagues.
*   **`Démonstrateur`** : Infrastructure physique de démonstration technologique.
*   **`Test Before Invest`** : Validation technique en laboratoire (PoC).
*   **`Networking`** : Mise en relation qualifiée d'acteurs de la chaîne de valeur.
*   **`Mentorat`** : Partage d'expérience pair-à-pair.

---

## 💗 7. Typologies d'Écosystèmes (`EcosystemType`)

Définit la nature juridique et opérationnelle des hubs d'innovation :

*   **`Cluster`** : Réseau d'entreprises, de centres de recherche et d'institutions sur un domaine d'affaires (ex: TWEED).
*   **`Pôle de compétitivité`** : Structure majeure d'innovation collaborative (ex: BioWin, MecaTech).
*   **`Communauté`** : Groupe d'échange informel de praticiens.
*   **`Réseau`** : Structure régionale transverse d'animation économique (ex: Digital Wallonia).
*   **`Partenariat`** : Consortium ou alliance public-privé contractuelle.
*   **`Living Lab`** : Laboratoire d'innovation ouverte centré sur l'utilisateur final.
*   **`Hub`** : Structure d'accueil de proximité.
*   **`EDIH`** : European Digital Innovation Hub cofinancé par la Commission Européenne (ex: EDIH Wallonia).
*   **`Plateforme`** : Infrastructure technologique ou de services en ligne partagée.
*   **`Programme collaboratif`** : Initiative thématique à grande échelle.

---

## 🏛️ 8. Rôles des Organisations (`OrganizationRole`)

Rôles sémantiques portés par les acteurs de la plateforme conformément à W3C ORG :

*   **`Competent Authority`** : Autorité publique responsable d'un service public (dct:publisher dans CPSV-AP).
*   **`Service Provider`** : Opérateur qui fournit le service d'accompagnement.
*   **`Funding Authority`** : Administration qui définit les budgets d'aides.
*   **`Funding Body`** : Organisme financier qui alloue les chèques ou les subsides (ex : WE).
*   **`Operator`** : Acteur opérationnel sur le terrain.
*   **`Coordinator`** : Chef de file d'un programme ou d'un écosystème (ex: AdN pour l'EDIH).
*   **`Ecosystem Manager`** : Structure chargée d'animer un cluster.
*   **`Data Provider`** : Organisation qui publie des catalogues de données (DCAT-AP).
*   **`Data Consumer`** : Organisation exploitant des données pour ses diagnostics.
*   **`Knowledge Provider`** : Université ou centre de recherche publiant des livres blancs.
*   **`Partner`** : Membre actif participant à la gouvernance.
*   **`Beneficiary Representative`** : Fédération ou guichet d'accueil des PME (ex : UCM).

---

## 🌍 9. Référentiel des Territoires (`TerritoryType`)

Pour le raisonnement spatial et la détection de "zones blanches", le graphe structure la hiérarchie géographique wallonne comme suit (prédicat `:subTerritoryOf`) :

$$\text{Europe} \implies \text{Country} \implies \text{Region} \implies \text{Province} \implies \text{Economic Basin} \implies \text{Municipality} \implies \text{Business Park / Innovation District}$$

*   *Cross-border Territory* : Territoires transfrontaliers (ex: Grande Région, projets Interreg).
*   *Spatial Reasoner rules* : Si un service est disponible dans la `Région Wallonne`, il est par défaut hérité comme disponible dans la `Province de Liège` et dans la `Ville de Liège`.

---

## 📈 10. Dimensions d'Impact (`ImpactDimension`)

Classification sémantique des impacts pour le pilotage stratégique de la Wallonie :

```
📁 Impact Dimensions
├── 💡 Innovation (IMP-INNO)
│   └── Indicateur: Brevets déposés, Projets R&D financés
├── ⚔️ Competitiveness (IMP-COMP)
│   └── Indicateur: Part de marché à l'export, ROI technologique
├── ⚙️ Productivity (IMP-PROD)
│   └── Indicateur: Gain de temps process, Taux de rebus
├── 🍃 Decarbonisation (IMP-CO2)
│   └── Indicateur: Tonnes équivalent CO2 évitées par an
├── ♻️ Circularité (IMP-CIRC)
│   └── Indicateur: Tonnes de matières recyclées, Taux d'éco-conception
├── 🎓 Skills (IMP-SKILLS)
│   └── Indicateur: Personnes formées, Emplois qualifiés créés
├── ✈️ Internationalisation (IMP-EXPO)
│   └── Indicateur: Nouveaux pays exportés, Chiffre d'affaires export
├── 🛡️ Resilience (IMP-RESIL)
│   └── Indicateur: Temps d'arrêt d'infrastructures évité, NIS2 compliant
├── 👥 Job Creation (IMP-JOBS)
│   └── Indicateur: Emplois nets créés (ETP)
├── 💻 Digital Transformation (IMP-DIGITAL)
│   └── Indicateur: Points gagnés sur l'échelle Digiscore
├── 🌲 Environmental Transition (IMP-TRANSITION)
│   └── Indicateur: Efficacité énergétique globale
└── 🌍 Territorial Cohesion (IMP-COHESION)
    └── Indicateur: Réduction de la fracture numérique territoriale
```

---

## 📊 11. Référentiels d'Évaluation (Assessment Taxonomies)

Conformes au modèle générique défini dans `PIT_ASSESSMENT_FRAMEWORKS.md` :

*   **`FrameworkType`** : `MATURITY`, `READINESS`, `COMPLIANCE`, `DIAGNOSTIC`, `SATISFACTION`, `IMPACT`, `BENCHMARK`, `SURVEY`.
*   **`QuestionType`** : `SINGLE_CHOICE`, `MULTI_CHOICE`, `TEXT_FREE`, `NUMERIC_VALUE`, `RATING_SCALE`.
*   **`ScoreType`** : `GLOBAL_SCORE`, `DIMENSION_SCORE`, `COMPOSITE_INDEX`, `PERCENTILE_RANK`, `DELTA_GAIN`.
*   **`BenchmarkType`** : `SECTOR_NACE`, `GEOGRAPHIC_PROVINCE`, `SIZE_COHORT`, `ECOSYSTEM_cohort`.
*   **`AssessmentSource`** : `SELF_ASSESSMENT`, `EXPERT_AUDIT`, `ALGORITHMIC_MATCH`.
*   **`AssessmentConfidence`** : Flottant de `0.0` (Incertain) à `1.0` (Certifié par audit tiers).

---

## 📘 12. Typologies des Actifs de Connaissance (`KnowledgeAssetType`)

Classement des ressources d'intelligence territoriale de la plateforme :

*   **`Methodology`** : Cadre d'analyse officiel (ex: guides méthodologiques Circular Wallonia).
*   **`Guide`** : Livret pratique à destination des PME.
*   **`Publication`** : Article scientifique ou de recherche.
*   **`White Paper`** : Positionnement ou synthèse technologique d'opérateurs.
*   **`Benchmark`** : Étude comparative de performance industrielle.
*   **`Dataset`** : Fiche descriptive de données brutes.
*   **`Dashboard`** : Visualisations interactives et KPI régionaux.
*   **`Training Material`** : Contenu pédagogique de formation.
*   **`Case Study`** : Retour d'expérience sur un projet d'innovation réussi.
*   **`Best Practice`** : Fiche de recommandations techniques.
*   **`Tool`** : Script ou micro-logiciel mis à disposition par l'écosystème.
*   **`Template`** : Gabarit de document type (ex: cahier des charges).

---

## 📂 13. Référentiels de Gouvernance des Données (DCAT-AP)

Conformes aux métadonnées du standard européen d'interopérabilité Open Data :

*   **`DatasetType`** : `CORE_DATASET`, `REFERENCE_DATA`, `REALTIME_FEED`, `STATISTICAL_SERIES`.
*   **`DataQualityDimension`** : `Completeness`, `Accuracy`, `Validity`, `Consistency`, `Timeliness`, `Uniqueness`.
*   **`AccessPolicy`** : `PUBLIC_OPEN`, `RESTRICTED_Ecosystem`, `CONFIDENTIAL_OPERATOR`, `PRIVATE_BENEFICIARY`.
*   **`UpdateFrequency`** : `CONTINUOUS`, `DAILY`, `WEEKLY`, `MONTHLY`, `ANNUAL`, `STATIC`.
*   **`DataSensitivity`** : `LOW` (Anonyme), `MEDIUM` (Commercial), `HIGH` (Données nominatives PME, secret industriel).

---

## 🇪🇺 14. Matrice d'Alignement aux Standards Européens

La PIT garantit une conformité stricte avec les nomenclatures officielles européennes et belges.

| Taxonomie PIT | Référentiel Source de Référence | Rôle de l'Alignement & Modèle PIT |
| :--- | :--- | :--- |
| **`Service`** | **CPSV-AP v3.0** (SEMIC) | Modélisation normalisée des fiches descriptives des services d'aides régionales. |
| **`Dataset`** | **DCAT-AP** (W3C / EU) | Métadonnées de catalogage pour l'échange de données territoriales. |
| **`Organization`** | **W3C ORG Ontology** | Représentation standardisée des rôles et de la hiérarchie des opérateurs. |
| **`Location`** | **W3C LOCN / INSPIRE** | Représentation géomatique des territoires et codes postaux. |
| **`S3Domain`** | **Smart Specialisation platform** (JRC)| Alignement des aides publiques sur les priorités de recherche Horizon Europe. |
| **`DR-BEST`** | **EDIH Network framework** (EC) | Classification sémantique de l'offre d'aides à la transition numérique. |
| **`Capability`** | **European AI Ecosystem Taxonomy** | Classification harmonisée des compétences technologiques de pointe de l'UE. |
| **`NaceSector`** | **Nomenclature NACE Rev. 2** (Eurostat) | Identification officielle de l'activité économique du bénéficiaire. |

---

## 🏛️ 15. Gouvernance des Taxonomies & Cycle de Vie

| Taxonomie | Source Officielle | Propriétaire PIT | Version Cible | Mode de Maintenance | Fréquence de mise à jour |
| :--- | :--- | :--- | :---: | :--- | :---: |
| **S3** | Commission Européenne | Wallonie Entreprendre | v3.0 (2026) | Manuel (via validation S3) | Annuelle |
| **DR-BEST** | Commission Européenne | Agence du Numérique | v1.1 | Alignement sur les guides EDIH | Ponctuelle |
| **Capability** | JRC / AI Alliance | Agence du Numérique | v2.0 | Extension collaborative | Semestrielle |
| **Challenge** | PIT Wallonie | SPW Économie / WE | v1.5 | Comité éditorial PIT | Semestrielle |
| **Intervention** | CPSV-AP / PIT | SPW Économie | v1.0 | Standardisé dans le code | Statique |
| **Ecosystem** | SPW Économie | SPW Économie | v1.0 | Comité éditorial PIT | Annuelle |
| **Territory** | SPW / Statbel | SPW Territoire | v2026 | Synchronisation automatique | Annuelle |
| **NaceSector** | Eurostat | SPF Économie | Rev. 2 | Synchro automatique API | Pluriannuelle |

---

## 🏁 16. Matrice de Mapping Final (Entités ➔ Taxonomies)

| Entité PIT | Taxonomies obligatoires à utiliser |
| :--- | :--- |
| **`Service` (CPSV-AP)** | `DR-BEST` • `Capability` • `S3` • `InterventionType` • `Challenge` • `Territory` • `ImpactDimension` |
| **`Journey`** | `DR-BEST` • `Challenge` • `Capability` • `S3` • `ImpactDimension` |
| **`Beneficiary`** | `Territory` • `Capability` • `NaceSector` • `Challenge` • `EcosystemRole` |
| **`Organization`** | `EcosystemType` • `Territory` • `OrganizationRole` |
| **`Dataset` (DCAT-AP)** | `DatasetType` • `DataQualityDimension` • `AccessPolicy` • `UpdateFrequency` • `Capability` |
| **`AssessmentResult`** | `FrameworkType` • `QuestionType` • `ScoreType` • `BenchmarkType` • `Capability` |
| **`Ecosystem`** | `EcosystemType` • `Territory` • `S3` • `Challenge` |
| **`Project`** | `S3` • `Capability` • `ImpactDimension` • `Territory` |
| **`Program`** | `DR-BEST` • `S3` • `Territory` • `ImpactDimension` |

---

## 🚀 17. Recommandations de Gouvernance Sémantique

### A. Taxonomies Prioritaires (P0 - À implémenter immédiatement dans le seed)
1.  **DR-BEST** : Unifier le typage des services et parcours sous les codes stricts `D`, `R`, `B`, `E`, `S`, `T`.
2.  **Capability Domains** : Intégrer les 23 codes techniques de base (AI, CYBER, CLOUD, CIRCULARITY...) pour assurer la cohérence du Graph Explorer.
3.  **S3** : Importer la liste hiérarchique des 11 filières S3 et de leurs maillons.

### B. Risques de duplication sémantique & Mitigations
*   **Risque** : Que les opérateurs créent des capabilités ou des défis synonymes en doublon (ex : "IA" vs "Intelligence Artificielle" vs "Deep Learning").
*   **Mitigation** : Le schéma de base de données doit imposer des contraintes d'unicité (`@unique` sur le `code` technique) et utiliser le champ `uri` sémantique globale. Les synonymes doivent être résolus côté client par auto-complétion guidée.

### C. Plan de Gouvernance Sémantique (Comité Éditorial)
*   Mettre en place un **Comité Éditorial Sémantique** composé de l'AdN, WE et du SPW.
*   Ce comité se réunit semestriellement pour acter de l'ajout de nouveaux codes de capabilités, de nouvelles filières S3, de nouveaux types d'écosystèmes ou de nouvelles dimensions d'impact dans les dictionnaires de référence de la PIT.

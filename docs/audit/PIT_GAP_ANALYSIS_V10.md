# 🔍 Rapport d'Audit & Analyse d'Écart — PIT Wallonie v10.0 vs Architecture Cible v3.0

Ce document dresse l'état des lieux complet et factuel de la version 10.0 de la **Plateforme d'Intelligence Territoriale (PIT)** au regard des spécifications de l'**Architecture Cible v3.0 (PIT_TARGET_ARCHITECTURE.md)**. 

L'audit couvre le code TypeScript/React, les schémas Prisma, les routes API Next.js et la base de données réelle (seeding et structures).

---

## 📅 1. Inventaire des Modules Réels (V10.0)

| Module / Zone Fonctionnelle | Présence | État réel | Niveau de Maturité (0 à 5) | Description & Observations |
| :--- | :---: | :---: | :---: | :--- |
| **Services (CPSV-AP)** | **Oui** | Complet | **5 / 5** | Catalogue complet d'aides. Modèle de données riche basé sur CPSV-AP. Encodage wizard présent. |
| **Parcours** | **Oui** | Complet | **5 / 5** | CRUD entièrement persistant en base de données. Alignements sémantiques complets et timeline opérationnelle. |
| **Organisations** | **Oui** | Complet | **4 / 5** | Acteurs bien intégrés (AdN, WE, AWEX...). Alignement W3C ORG partiel (pas de sous-structures modélisées). |
| **Bénéficiaires** | **Oui** | Complet | **4 / 5** | Profil 360° avec secteurs NACE et indices de maturité. Gaps sur les 6 axes DR-BEST (5 axes présents). |
| **Filières (S3)** | **Oui** | Complet | **4 / 5** | 11 filières (S3) mappées. Relations gérées par jointures dures Prisma. |
| **Chaînes de valeur (Maillons)** | **Oui** | Complet | **4 / 5** | 19 maillons transversaux modélisés. Pas de hiérarchie stricte avec les filières en base de données. |
| **Écosystèmes** | **Oui** | Complet | **4 / 5** | Regroupement des acteurs, services, parcours, filières. Mappages solides avec `EcosystemType`. |
| **Datasets (DCAT-AP)** | **Oui** | Partiel | **2 / 5** | Présent dans la DB mais manque d'attributs de distribution, licences, formats, URLs. |
| **Knowledge Assets** | **Oui** | Complet | **4 / 5** | Actifs de connaissances (guides, benchmarks) rattachés aux écosystèmes et services. |
| **Recommender** | **Oui** | Prototype | **3 / 5** | Moteur de recommandation basé sur les besoins métiers et défis, mais tourne en filtrage lourd côté serveur. |
| **Graph Explorer** | **Oui** | Complet | **4 / 5** | Rendu réseau complet interactif via ReactFlow. Goulot d'étranglement de performance sur le chargement. |
| **Administration** | **Non** | Absent | **0 / 5** | Aucune interface d'administration pour gérer les taxonomies, NACE ou défis (seeding SQL uniquement). |
| **Taxonomies** | **Oui** | Partiel | **3 / 5** | Présence des défis, secteurs NACE, mais manque le DR-BEST 6-axes et les catégories de défis. |
| **Référentiels** | **Oui** | Complet | **4 / 5** | Territoires hiérarchiques et fonctions d'entreprise bien intégrés. |

---

## 🧬 2. Audit du Domain Model (Prisma vs Cible v3.0)

L'architecture cible v3.0 définit **27 classes métier héritant d'un socle commun**. En V10.0, l'héritage n'étant pas pris en charge nativement par Prisma, les structures sont à plat et dupliquées.

| Classe Cible v3.0 | Statut réel | Modèle Prisma / DTO V10.0 | Commentaires & Gaps Identifiés |
| :--- | :---: | :--- | :--- |
| **1. `BaseEntity`** | **Absent** | *N/A* | Pas d'héritage de base. Les attributs (`id`, `uri`, `name`, `createdAt`, `updatedAt`) sont dupliqués manuellement sur toutes les tables. |
| **2. `Organization`** | **Présent** | `Organization` | Conforme. Lié aux services, écosystèmes, et structures stratégiques. |
| **3. `Beneficiary`** | **Présent** | `Beneficiary` | Conforme, mais stocke les 5 dimensions de maturité obsolètes (voir section 3). |
| **4. `Service`** | **Présent** | `PublicService` | Très complet. Mappe l'ensemble des relations CPSV-AP. |
| **5. `JourneyTemplate`** | **Partiel** | `Journey` | Le gabarit de parcours (`Journey`) est stocké, mais n'est pas séparé des instances ou engagements réels dans le modèle conceptuel (confusion Template vs Instance). |
| **6. `JourneyStage`** | **Présent** | `JourneyStage` | Conforme. Gère l'ordre des étapes (`position`) et les services liés. |
| **7. `JourneyEnrollment`** | **Présent** | `JourneyEnrollment` | Conforme. Suit le taux de complétion et l'état d'avancement d'un bénéficiaire. |
| **8. `JourneyOutcome`** | **Absent** | *N/A* | Aucun modèle en base de données. Seuls les `Outcome` théoriques des services existent. |
| **9. `JourneyTrigger`** | **Absent** | *N/A* | Absent de la base de données. Les déclenchements de parcours se font via des règles de match complexes codées en dur. |
| **10. `JourneyRecommendationRule`** | **Absent** | *N/A* | Les règles de recommandation sont stockées en JSON lâche dans `BusinessNeed.rule` plutôt que dans une table dédiée. |
| **11. `Program`** | **Présent** | `Program` | Conforme. Lié au budget, stratégies et territoires. |
| **12. `Project`** | **Présent** | `Project` | Conforme. Gère le cycle de vie des consortia. |
| **13. `Action`** | **Partiel** | `ActionInstance` | Partiellement conforme. Modélisé sous le nom `ActionInstance`. |
| **14. `Activity`** | **Absent** | *N/A* | Représenté de manière éclatée par `ServiceDelivery`, `CollectiveDelivery` et `SecondLineMission` au lieu d'hériter d'une classe parente `Activity`. |
| **15. `Ecosystem`** | **Présent** | `Ecosystem` | Conforme. Modèle central raccordé aux écosystèmes, acteurs et maillons. |
| **16. `S3Domain`** | **Absent** | *N/A* | Représenté par `StrategicDomainDimension` sous un modèle de dimension hiérarchique plat. |
| **17. `ValueChain`** | **Présent** | `StrategicValueChain` | Conforme (représente les filières S3). |
| **18. `ValueChainStage`** | **Présent** | `ValueChainStage` | Conforme. |
| **19. `Dataset`** | **Présent** | `Dataset` | Conforme, mais le modèle de données est lâche (JSON pour les thèmes/mots-clés). |
| **20. `KnowledgeAsset`** | **Présent** | `KnowledgeAsset` | Conforme. Catégorisé par `KnowledgeAssetType` (Enum). |
| **21. `Indicator`** | **Partiel** | `OutcomeIndicator` | Modélisé sous le nom `OutcomeIndicator`. Manque les notions de valeurs cibles (`targetValue`) et courantes (`currentValue`) par indicateur. |
| **22. `ImpactDimension`** | **Présent** | `ImpactDimension` | Conforme. Catégorise les objectifs de transition (SDG, Green Deal, etc.). |
| **23. `ImpactMeasurement`** | **Partiel** | `Impact` | Modélisé sous le nom `Impact`. Mappe la valeur numérique ou textuelle liée à un bénéficiaire. |
| **24. `Challenge`** | **Présent** | `BusinessChallenge` | Mappé sous le nom `BusinessChallenge`. |
| **25. `ChallengeCategory`** | **Absent** | *N/A* | Aucune table pour catégoriser les défis. |
| **26. `Territory`** | **Présent** | `Territory` | Conforme. Structure hiérarchique imbriquée (`parentTerritoryId`). |
| **27. `EntityRelation`** | **Absent** | *N/A* | **Majeur** : Les relations du graphe sont codées de manière dure via des tables d'association Prisma (ex: `_ServiceValueChains`, `_EcosystemActors`) au lieu du modèle dynamique `EntityRelation` requis. |

---

## 🏷️ 3. Audit des Taxonomies & Alignements Métiers

### A. Le Cadre de Maturité DR-BEST (Incohérence Majeure)
L'architecture cible v3.0 exige l'adoption du référentiel européen officiel **DR-BEST** (Data, Remote, Business, Ecosystem, Skills, Technology) pour classifier les services et profils.
*   **Dans la base de données réelle (V10.0)** : La table `Beneficiary` utilise toujours un modèle à **5 dimensions obsolètes** :
    *   `maturityDigital` (Digitalisation générale)
    *   `maturityIa` (IA)
    *   `maturityCyber` (Cybersécurité)
    *   `maturityExport` (Export)
    *   `maturityDurability` (Durabilité / Transition verte)
*   **Dans le modèle des dimensions transversales** : La table `TransformationDimension` possède bien les codes `D`, `R`, `B`, `E`, `S`, `T` mais le profil des entreprises n'y est pas raccordé. **Il y a une rupture sémantique majeure entre le profil du bénéficiaire (5 axes) et les dimensions des services (6 axes DR-BEST).**

### B. Le Modèle S3 (Smart Specialisation Strategy)
*   La cible v3.0 demande : $\text{S3 Domain} \implies \text{Value Chain} \implies \text{Value Chain Stage}$.
*   **En V10.0** :
    *   `StrategicDomainDimension` représente le domaine S3.
    *   `StrategicValueChain` représente la filière S3 (liée au domaine par `strategicDomainId`).
    *   `ValueChainStage` représente le maillon transverse. **Gap** : Le maillon transverse n'est pas structurellement fils de la filière en base de données. Un maillon est autonome et rattaché lâchement aux entités (Services, Bénéficiaires, Parcours) sans contrainte hiérarchique avec la filière S3.

### C. La Taxonomie des Défis (`Challenge`)
*   La cible v3.0 demande : $\text{ChallengeCategory} \implies \text{Challenge}$.
*   **En V10.0** : Seule la table `BusinessChallenge` existe. La catégorisation en familles (ex: transition environnementale vs numérique) n'est pas modélisée en DB.

### D. Le Référentiel des Capabilités (`Capability`)
*   Seuls **AI, DATA, CYBER, CLOUD, IOT, ROBOTICS, XR, HPC, DIGITAL TWIN, AUTOMATION, GIS, BLOCKCHAIN** doivent être présents.
*   **En V10.0** : Entièrement conforme. La table `CapabilityDimension` stocke et restreint ces codes de manière rigoureuse dans le seed et le schéma.

### E. Typologie des Écosystèmes (`EcosystemType`)
*   La cible v3.0 cible : *Cluster, Pôle, Communauté, Réseau, Partenariat, Plateforme, Programme collaboratif, Living Lab, EDIH, Hub*.
*   **En V10.0** : L'enum Prisma et le seed couvrent : `EDIH`, `CLUSTER`, `POLE_COMPETITIVITE`, `LIVING_LAB`, `HUB_INNOVATION`, `NETWORK`, `COMMUNITY`. **Gaps** : `Partenariat`, `Plateforme` et `Programme collaboratif` sont absents de la base de données.

### F. Typologie des Interventions (`InterventionType`)
*   La cible v3.0 cible : *Service, Diagnostic, Formation, Coaching, Financement, Evénement, Mission Ecosystème, Appel à projets, Conseil, Audit, Démonstrateur, Test Before Invest, Networking*.
*   **En V10.0** : Mappage grossier dans la table `InterventionType` avec les valeurs : `SERVICE`, `FUNDING`, `PROJECT`, `EVENT`, `KNOWLEDGE_ASSET`, `MISSION`. Les typologies fines (Diagnostic, Formation, Coaching...) ne sont pas typées mais écrites en texte libre.

### G. Dimensions d'Impact (`ImpactDimension`)
*   La cible v3.0 cible : *Innovation, Compétitivité, Productivité, Décarbonation, Circularité, Compétences, Internationalisation, Résilience, Création d'emploi, Transition Numérique, Transition Environnementale*.
*   **En V10.0** : La table `ImpactDimension` existe en DB. **Gap majeur** : Le catalogue de services publics (`PublicService`) n'utilise pas cette table. Il intègre à la place un champ lâche `impacts Json?` (contenant des clés codées en dur : `carbon`, `jobs`, `sovereignty`, `resilience`, `competitiveness`, `digiscoreBoost`), ce qui casse la cohérence relationnelle.

---

## 🏛️ 4. Audit de Conformité CPSV-AP (Services)

Le module Services modélise de manière exhaustive le standard européen **CPSV-AP v3.0**.

| Concept CPSV-AP | Présence en DB (V10.0) | Niveau d'alignement | Gap / Limite |
| :--- | :---: | :---: | :--- |
| **`PublicService`** | Oui (`PublicService`) | Excellent | Aucun |
| **`CompetentAuthority`** | Oui (`Organization`) | Correct | Représenté par une simple liaison d'organisation sans métadonnées d'autorité. |
| **`Channel`** | Oui (`Channel`) | Excellent | Aucun |
| **`BusinessEvent`** | Oui (`BusinessEvent`) | Excellent | Aucun |
| **`LifeEvent`** | Oui (`LifeEvent`) | Excellent | Aucun |
| **`Requirement`** | Oui (`Requirement`) | Excellent | Aucun |
| **`Evidence`** | Oui (`Evidence`) | Excellent | Lié à `Requirement` ou aux réalisations d'activités. |
| **`Output`** | Oui (`Output`) | Excellent | Aucun |
| **`Cost`** | Oui (`Cost`) | Excellent | Valeur numérique + devise persistées en base. |
| **`Rule`** | Oui (`Rule`) | Excellent | Aucun |
| **`Target Audience`** | Oui (`TargetAudience`) | Excellent | Aucun |

### 📊 Score de Couverture CPSV-AP V10.0
$$\text{Couverture CPSV-AP} = \frac{11 \text{ concepts mappés}}{11 \text{ concepts cibles}} = \mathbf{100\%}$$

*L'implémentation physique et fonctionnelle des fiches CPSV-AP est le point fort de la V10.0.*

---

## 📊 5. Audit de Conformité DCAT-AP (Données)

Le module Datasets est censé s'aligner sur le standard de catalogue de métadonnées européen **DCAT-AP**.

| Concept DCAT-AP | Présence en DB (V10.0) | Niveau d'alignement | Gap / Spécification manquante |
| :--- | :---: | :---: | :--- |
| **`Dataset`** | Oui (`Dataset`) | Partiel | Table existante mais simplifiée à l'extrême. |
| **`Distribution`** | **Non** | Absent | Pas de table pour modéliser les distributions physiques ou API d'un même jeu de données. |
| **`Catalog`** | **Non** | Absent | La table `Catalogue` en DB ne sert qu'à regrouper des services CPSV, pas des jeux de données DCAT-AP. |
| **`Publisher`** | Oui (`Organization`) | Correct | Représenté par la relation `ownerOrganizationId` rattachée à l'acteur. |
| **`Frequency`** | Oui | Basique | Champ texte simple `updateFrequency` au lieu d'une URI contrôlée (Nomenclature EU Publications Office). |
| **`License`** | **Non** | Absent | Aucun champ de licence (ex: CC-BY, Open Data) sur la table. |
| **`Theme`** | Oui | Basique | Mappé sous forme de tableau JSON lâche `themes Json?` sur la table. |
| **`Format`** | **Non** | Absent | Absent du modèle physique. |
| **`Access URL`** | **Non** | Absent | Absent du modèle physique. |
| **`Download URL`** | **Non** | Absent | Absent du modèle physique. |

### 📊 Score de Couverture DCAT-AP V10.0
$$\text{Couverture DCAT-AP} = \frac{4 \text{ concepts partiels}}{10 \text{ concepts cibles}} = \mathbf{40\%}$$

*Le module Datasets est un prototype incomplet et n'assure pas la conformité européenne d'interopérabilité sémantique DCAT-AP.*

---

## 🎨 6. Audit UI/UX & Conformité Design System

L'application est structurée en Next.js avec un thème sombre glassmorphism par défaut. L'utilisation des composants standardisés du PIT Design System a été auditée sur l'ensemble des 16 pages/routes de l'Observatoire Territorial.

### A. Conformité par Route
*   **Routes 100% Compliantes** : `/` (Tableau de bord), `/strategies`, `/pilotage`, `/beneficiaries`, `/activities`, `/datasets`, `/ecosystems`, `/graph`, `/guide`, `/journeys`, `/knowledge-assets`, `/recommender`, `/settings`, `/value-chains`. Elles intègrent toutes les structures asymétriques standard et respectent la charte graphique sémantique.
*   **Routes Divergentes (Non Compliantes)** :
    *   `/services` : Utilise un composant colossal autonome `ServicesContainer.tsx` (247 Ko). Ce dernier réimplémente ses propres barres latérales de navigation, ses propres onglets complexes, ses formulaires et ses boutons d'action en dehors de la charte du design system.
    *   `/services/encode` : Utilise un assistant d'encodage `Wizard.tsx` développé sur-mesure avec des classes CSS ad-hoc, en dehors du conteneur `PITLayout`.

### B. État d'utilisation des Composants du Design System
1.  **`PITLayout`** : Utilisé sur 14/16 pages. Assure la cohérence de la navigation globale et de la barre latérale.
2.  **`PITDetailLayout`** : Utilisé sur 8/16 pages (Recommender, Écosystèmes, Bénéficiaires, Stratégies, etc.) pour diviser l'écran en un cockpit asymétrique.
3.  **`PITTabs`** : Très utilisé via `PITDetailLayout` et dans `/journeys`.
4.  **`PITForm`** : Utilisé pour la création et l'édition de la majorité des entités (hors services publics).
5.  **`PITEntityCard`** : Composant central des listes de gauche (conforme au style glassmorphism).
6.  **`PITGraphView`** : Intégration impeccable avec ReactFlow (couleur teal `#14b8a6` et outlines brillants sur sélection).
7.  **`PITContextRibbon`** : **Dette UX** : Le composant est implémenté mais n'est utilisé dans aucune page de l'application (uniquement importé par `PITEntityWorkspace`, lui-même inutilisé).
8.  **`PITRelationsPanel`** : Composant de référence pour cartographier les connexions du graphe territorial. Utilisé avec brio sur 9 pages.
9.  **`PITStatCard`** : Utilisé sur 5 pages clés.

### 📊 Score de Conformité du Design System
$$\text{Score de Conformité DS} = \frac{14 \text{ routes conformes}}{16 \text{ routes totales}} = \mathbf{87.5\%}$$

*La rupture esthétique et d'architecture front-end est localisée à 100% dans le module Services.*

---

## ⚡ 7. Audit de Performance & Analyse Système

Les blocages de performances identifiés dans la V10.0 sont causés par une centralisation abusive des requêtes et un manque de pagination.

### 1. La Requête Monolithe `/api/meta` (P0 - Critique)
*   **Le Problème** : Pratiquement toutes les pages de l'application font appel au hook `useMetaQuery()`, qui interroge l'API unique `/api/meta`.
*   **L'impact en DB** : Le handler API exécute **43 requêtes SQL en parallèle via `Promise.all`** pour charger la quasi-totalité de la base de données PostgreSQL (organisations, canaux, maillons, services, défis, datasets, stratégies, programmes...).
*   **L'impact réseau** : Charger n'importe quelle page (comme `/settings` ou `/guide`) déclenche le transfert d'un payload JSON massif contenant l'intégralité de la configuration sémantique territoriale de la Wallonie.
*   **L'échec du cache** : Le cache en mémoire dans l'API catch-all (`route.ts`) est local aux instances de serveurs. Dans un déploiement Vercel Serverless, ce cache est volatile, isolé entre les conteneurs et réinitialisé toutes les 30 secondes, ce qui provoque des surcharges régulières sur le pool de connexions de la DB.

### 2. Le Coût de Génération du Graphe `/api/graph` (P1 - Important)
*   **Le Problème** : La route `/api/graph` charge 27 tables en base de données à chaque appel et effectue des boucles imbriquées complexes en CPU pour générer les nœuds et les arcs (edges) de l'explorateur ReactFlow.
*   **L'impact** : Goulot d'étranglement CPU côté API et freeze potentiel de l'UI lors de l'affichage de plus de 500 relations simultanées.

### 3. DOM Bloquant dans `ServicesContainer.tsx` (P1 - Important)
*   **Le Problème** : Les 10 onglets du cockpit de modification de service (CPSV-AP) sont montés simultanément dans le DOM.
*   **L'impact** : Les composants lourds (champs de formulaires imbriqués, checkboxes multiples pour les maillons) ralentissent le re-rendu de la page à chaque frappe de clavier dans un champ de texte.

### 4. Absence totale de Pagination (P2 - Moyen)
*   Toutes les routes API (`/api/beneficiaries`, `/api/services`, etc.) exécutent des requêtes `findMany` sans clauses `take` ou `skip`. L'application fonctionnera de manière dégradée dès que le nombre de bénéficiaires dépassera quelques centaines.

---

## 🕸️ 8. Audit du Knowledge Graph (Couverture des Relations)

La cible v3.0 modélise 12 arcs de relations critiques pour l'intelligence territoriale.

```
1.  Organization ↔ Service        [V10: OK]
2.  Service ↔ Journey             [V10: OK - Via JourneyStage]
3.  Journey ↔ Beneficiary         [V10: OK - Via JourneyEnrollment]
4.  Beneficiary ↔ Challenge       [V10: OK]
5.  Challenge ↔ Capability        [V10: ABSENT]  ❌ Pas de liaison directe en DB
6.  Capability ↔ Service          [V10: OK]
7.  Service ↔ ValueChain          [V10: OK]
8.  ValueChain ↔ S3Domain         [V10: OK - Via relation hiérarchique DB]
9.  Organization ↔ Ecosystem      [V10: OK]
10. Ecosystem ↔ Territory         [V10: OK]
11. Dataset ↔ Territory           [V10: ABSENT]  ❌ Pas de liaison de territoire pour les datasets
12. KnowledgeAsset ↔ Ecosystem    [V10: OK]
```

### Gaps Majeurs identifiés sur le Graphe :
1.  **Challenge ↔ Capability** : Impossible de savoir de manière sémantique quelles capabilités technologiques (ex: IA, Cyber) répondent à quel défi d'affaires (ex: décarbonation, optimisation). Le matchmaking automatique du recommender est donc incomplet.
2.  **Dataset ↔ Territory** : Les catalogues de données DCAT-AP ne possèdent pas d'ancrage géographique (`Territory`), limitant les requêtes spatiales de "zones blanches" de données.
3.  **Absence d'arcs dynamiques (`EntityRelation`)** : Toutes les liaisons sont codées de manière dure, empêchant l'évaluation de l'intensité de liaison (`strength`) ou du niveau de confiance (`confidence`) requis pour les algorithmes prédictifs par IA.

### 📊 Score de Couverture des Relations Cibles
$$\text{Taux de Couverture des Relations} = \frac{10 \text{ relations présentes}}{12 \text{ relations cibles}} = \mathbf{83.3\%}$$

---

## 🏁 9. Matrice d'Écart Finale (Gap Matrix)

| Domaine / Concept | Cible v3.0 | État Réel (V10.0) | Gravité de l'Écart | Priorité de convergence | Action Requise |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **Relations Graphe** | Table dynamique `EntityRelation` | Jointures dures multiples Prisma | Majeure | **P1** | Créer le modèle `EntityRelation` et migrer les relations clés. |
| **Cadre de Maturité** | DR-BEST (6 axes) sur Bénéficiaire | 5 axes obsolètes (dont Export/Durabilité) | Majeure | **P0** | Modifier la table `Beneficiary` et synchroniser avec `TransformationDimension`. |
| **CPSV-AP (Services)** | Standard CPSV-AP V3.0 | Base de données conforme à 100% | Nulle | **P3** | Conserver la structure physique de la DB. |
| **DCAT-AP (Datasets)** | Modèle complet + Distributions | Table lâche sans formats, URLs, licences | Majeure | **P2** | Créer la table `Distribution` et ajouter les attributs manquants sur `Dataset`. |
| **Interface Services** | Composants du PIT Design System | UI divergent (`ServicesContainer` & `Wizard` custom) | Moyenne | **P1** | Refactoriser `/services` pour utiliser `PITLayout` et `PITForm`. |
| **Performances** | Requêtes ciblées & Paginated API | API globale `/api/meta` lourde bloquante | Critique | **P0** | Découper `/api/meta` en sous-API REST ciblées et implémenter la pagination. |
| **Graphe : Liens** | Challenge ↔ Capability & Dataset ↔ Territory | Relations manquantes en base | Moyenne | **P1** | Ajouter les clés étrangères et relations correspondantes dans le schéma Prisma. |
| **Gouvernance** | Projets, Indicateurs, Budgets | Tables présentes dans la DB | Nulle | **P3** | Raccorder l'interface pour visualiser ces tables rattachées. |

---

## 🗺️ 10. Roadmap de Migration Stratégique (Sprints 2 à 6)

### ⚡ Quick Wins (Moins de 2 jours)
1.  **Optimisation UX / Services** : Mettre en place le rendu paresseux (lazy-rendering) des onglets dans `ServicesContainer.tsx` pour éliminer les latences d'édition en limitant le nombre de nœuds DOM actifs simultanés.
2.  **Nettoyage du Design System** : Supprimer le composant orphelin `PITEntityWorkspace` et son sous-composant `PITContextRibbon` ou les documenter comme "réservés pour une phase ultérieure".
3.  **Correction d'attributs DCAT-AP** : Ajouter les champs `format`, `license`, `accessUrl` et `downloadUrl` directement sur le modèle `Dataset` dans le schéma Prisma sans créer de table intermédiaire dans un premier temps.

---

### 📅 Sprint 2 — Alignement des Taxonomies (P0)
*   **Objectif** : Résoudre l'incohérence sémantique majeure du référentiel de maturité.
*   **Actions** :
    1.  Modifier la table `Beneficiary` dans `schema.prisma` pour remplacer les 5 colonnes obsolètes par les 6 axes officiels **DR-BEST** (`maturityD`, `maturityR`, `maturityB`, `maturityE`, `maturityS`, `maturityT`).
    2.  Mettre à jour le script de seed (`seed.ts`) pour générer les maturités DR-BEST des bénéficiaires de démonstration.
    3.  Ajuster les formulaires de création de PME et l'algorithme du recommender pour s'aligner sur la classification à 6 axes.

---

### 📅 Sprint 3 — Consolidation du Domain Model (P1)
*   **Objectif** : Mettre en place la traçabilité et les entités d'orchestration manquantes.
*   **Actions** :
    1.  Créer les tables physiques `JourneyOutcome`, `JourneyTrigger` en base de données.
    2.  Formaliser la table `ChallengeCategory` et y rattacher les `BusinessChallenge` existants.
    3.  Ajouter les attributs `targetValue` et `currentValue` sur la table `OutcomeIndicator` pour en faire un vrai modèle d'évaluation de performance.

---

### 📅 Sprint 4 — Convergence Design System & Refactoring CPSV-AP (P1)
*   **Objectif** : Résoudre la divergence UI du module Services pour obtenir 100% de conformité Design System.
*   **Actions** :
    1.  Démanteler le fichier massif `ServicesContainer.tsx` (247 Ko) et extraire les composants dans des sous-fichiers focused.
    2.  Refactoriser la page `/services` pour utiliser la structure standard `PITDetailLayout` raccordée à `PITLayout`.
    3.  Remplacer les formulaires personnalisés du catalogue et du wizard d'encodage par le composant standardisé `PITForm`.

---

### 📅 Sprint 5 — Écosystèmes, Datasets & DCAT-AP (P2)
*   **Objectif** : Atteindre 100% de conformité sémantique pour l'Open Data régional.
*   **Actions** :
    1.  Créer le modèle `Distribution` lié aux `Dataset` dans Prisma pour séparer les métadonnées de la structure physique des fichiers de données.
    2.  Raccorder la table `Catalogue` existante aux Datasets pour permettre la génération sémantique d'un catalogue DCAT-AP complet exportable en RDF/JSON-LD.
    3.  Ajouter les types d'écosystèmes manquants (`Partenariat`, `Plateforme`, `Programme`) dans le référentiel.

---

### 📅 Sprint 6 — Territorial Knowledge Graph & Recommender (P1)
*   **Objectif** : Rendre le graphe dynamique et optimiser les performances d'accès.
*   **Actions** :
    1.  Implémenter le modèle physique `EntityRelation` dans `schema.prisma`. Migrer les tables de relations many-to-many statiques vers ce modèle dynamique.
    2.  Lier sémantiquement les `BusinessChallenge` (Défis) aux `CapabilityDimension` (Capabilités) et les `Dataset` aux `Territory`.
    3.  **Résoudre la lenteur système** : Diviser l'API monolithe `/api/meta` en routes REST segmentées (ex: `/api/meta/taxonomies`, `/api/meta/sectors`) et utiliser React Query avec des caches edge persistants pour garantir des temps de réponse ultra-rapides.

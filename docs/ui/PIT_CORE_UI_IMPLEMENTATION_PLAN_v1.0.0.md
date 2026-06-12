# Plan d'Implémentation UI/UX — PIT Core UI (Sprint 4.3)

## Référence : PIT_CORE_UI_IMPLEMENTATION_PLAN_v1.0.0
## Version 1.0.0 (Spécifications UI/UX & Roadmap)

Ce document décrit les spécifications fonctionnelles, graphiques, techniques et la roadmap d'implémentation pour le déploiement de l'interface utilisateur (UI/UX) du Core Domain de la Plateforme d'Intégration Territoriale (PIT) Wallonie, en s'appuyant exclusivement sur les APIs `/api/v2` et le Design System existant.

---

## 🎨 1. Uniformisation UI / Design System PIT

Tous les nouveaux cockpits et écrans doivent hériter de l'identité visuelle unifiée de la PIT, dont le cockpit **Services** est la référence graphique officielle (look & feel, couleurs, espacements, typographies). 

### A. Composants réutilisés de la bibliothèque `design-system`
*   **`PITLayout`** : Conteneur principal avec barre latérale et en-tête.
*   **`PITDetailLayout`** : Mise en page divisée (Split Pane) pour la sélection et l'affichage des détails d'une entité.
*   **`PITFilterBar`** : Barre de recherche textuelle et de sélection de filtres (Secteurs, DR-BEST, S3, Territoires).
*   **`PITStatCard`** : Cartes KPIs en grille (ex: Budget, Nombre de projets, Taux de réussite).
*   **`PITRelationsPanel`** : Panneau d'affichage tabulaire des entités connectées (ex: Services d'un parcours, Projets d'un programme).
*   **`PITGraphView`** : Visualisation interactive des dépendances locales du graphe.
*   **`PITEntityCard`** & **`PITEntityWorkspace`** : Composants de structure de cartes et d'espace de travail.
*   **`PITColors`**, **`PITSpacing`**, **`PITTypography`** : Jetons de style globaux pour garantir des espacements et des harmonies de couleurs identiques.
*   **`badge.tsx`** : Badges standardisés de couleur pour les taxonomies.

---

## ⚙️ 2. APIs V2 Uniquement (Zéro dépendance `/api/meta`)

Tous les nouveaux cockpits appelleront exclusivement la couche d'API `/api/v2/...` :
*   Aucun appel à `/api/meta` ne sera toléré dans les nouveaux composants pour éviter les goulots d'étranglement de performance historiques.
*   Les requêtes s'effectueront de manière ciblée et paginée à l'aide de **TanStack Query** (React Query).

---

## 🏛️ 3. Spécifications des Nouveaux Cockpits

### A. Program Cockpit (`/programs`)
Affiche la hiérarchie opérationnelle S3 de la Wallonie : **`Program ➔ Project ➔ Action ➔ Activity`**.
*   **Vue Liste** : Tableau paginé des programmes (`GET /api/v2/programs`) avec barre de recherche et filtres par S3 Domain et DR-BEST.
*   **Vue Détail** (`GET /api/v2/programs/:id`) :
    *   **KPIs** : Budget total, nombre de projets actifs, nombre d'actions complétées.
    *   **Projets associés** : Liste déroulante paginée utilisant `/api/v2/programs/:id/projects`.
    *   **Relations directes** : Affichage des organisations partenaires et des territoires couverts.
    *   **Axes stratégiques** : Badges de classification DR-BEST et S3 du programme.

### B. Capability Cockpit (`/capabilities`)
Expose l'arbre des capabilités métiers et technologiques disponibles pour les entreprises.
*   **Vue Liste** : Arborescence interactive (`GET /api/v2/capabilities` et `/api/v2/taxonomies/capabilities`) permettant de naviguer des nœuds parents aux enfants.
*   **Vue Détail** :
    *   Informations textuelles et type de capabilité (Technologique, Humaine, Opérationnelle).
    *   Relations : Défis d'affaires associés, Services associés (`GET /api/v2/services/:id/capabilities` croisé), et Parcours reliés.

### C. Territory Cockpit (`/territories`)
Affiche l'organisation géographique et économique de l'écosystème wallon.
*   **Vue Liste** : Représentation hiérarchique : **`Europe ➔ Pays ➔ Région (Wallonie) ➔ Province ➔ Commune / Parc scientifique`**.
*   **Vue Détail** : Liste des organisations basées sur ce territoire, des programmes actifs et des services géolocalisés disponibles.

### D. Ecosystem Cockpit (`/ecosystems`)
Cockpit dédié aux hubs régionaux (ex: EDIH Wallonia, BioWin).
*   **Vue Détail** : Affiche les acteurs membres de l'écosystème, les services labellisés, les parcours portés, et les capabilités couvertes par le pôle.

### E. S3 Cockpit (`/s3`)
Axe stratégique majeur structurant les filières d'innovation.
*   **Navigation** : **`S3 Domain ➔ Value Chain ➔ Value Chain Stage`** (via `/api/v2/taxonomies/s3`).
*   **Affichage** : Filtrage croisé pour afficher instantanément tous les services publics, programmes et capabilités rattachés à un maillon spécifique.

### F. DR-BEST Dashboard (`/drbest`)
Tableau de bord de maturité et d'accompagnement.
*   **Interface** : Graphique radar global et 6 sections dédiées (Data, Remote, Business, Ecosystem, Skills, Technology).
*   **Navigation** : Cliquer sur une dimension filtre dynamiquement les services, parcours, programmes et projets qui adressent cette dimension via le paramètre de requête `?drbest=`.

---

## 🔄 4. Évolution des Cockpits Existants (Vues 360°)

### A. Service 360° Cockpit (`/services`)
Le cockpit actuel de service est enrichi pour afficher la chaîne sémantique complète : **`Challenge ➔ Capability ➔ Service ➔ Journey ➔ Beneficiary`**.
*   **Intégrations** :
    *   Défis d'affaires adressés et Capabilités requises.
    *   Programmes et Projets dans lesquels le service est consommé.
    *   Événements professionnels et de vie associés (Business/Life Events).
    *   Tags de catégorisation S3 et DR-BEST.

### B. Journey 360° Cockpit (`/journeys`)
Le cockpit de parcours intègre désormais toutes les connexions nécessaires pour alimenter le futur moteur de recommandation :
*   Services de chaque étape, défis ciblés, capabilités développées, et liste des bénéficiaires engagés.

### C. Graph View Preparation (`PITGraphPanel`)
Intégration d'un onglet "Relations Graphe" sur les fiches détails des Services, Challenges, Capabilités et Programmes. Ce panneau affichera une représentation locale de graphe (nœuds et arêtes) récupérée dynamiquement depuis `/api/v2/graph/*/:id`.

---

## ⚡ 5. Stratégie de Performance

1.  **TanStack Query Caching** :
    *   Configuration d'un `staleTime` global de 30 secondes pour les lectures collections.
    *   Invalidation automatique du cache lors de requêtes de mutation (`POST`, `PATCH`).
2.  **Pagination Serveur Obligatoire** : Les listes ne chargeront jamais l'ensemble des données. Elles s'appuieront sur la pagination standard via les paramètres `page` et `pageSize`.
3.  **Lazy Loading des Détails** : Les relations complexes ne seront récupérées que lors de l'activation des onglets correspondants sur le panneau détail (chargement à la demande).

---

## 📅 6. Roadmap d'Implémentation UI

Le développement de la couche d'interface utilisateur s'articulera autour de 5 phases logiques :

```mermaid
grid
  caption "Roadmap d'Implémentation UI (Sprint 4.3)"
  "Phase 1: Programs & Capabilities" : "Cockpit Programmes (Hiérarchie Opérationnelle) + Capabilités (Tree View)"
  "Phase 2: Territories & Ecosystems" : "Cockpit Territoires (Hiérarchie Géographique) + Écosystèmes (Hubs régionaux)"
  "Phase 3: S3 & DR-BEST" : "Cockpit S3 (Spécialisation) + Dashboard Interactif DR-BEST (Maturité)"
  "Phase 4: Service 360 & Journey 360" : "Intégration des vues 360° et des nouvelles relations API v2"
  "Phase 5: Graph Preparation" : "Composant visuel de graphe local interactif (GraphPanel)"
```

### Détail des Phases :
*   **Phase 1** : Déploiement de `/programs` (navigation hiérarchique) et de `/capabilities` (arbre technologique).
*   **Phase 2** : Déploiement de `/territories` (arborescence wallonne) et de `/ecosystems` (EDIH / Pôles).
*   **Phase 3** : Déploiement de `/s3` (filières et maillons) et `/drbest` (axes de maturité).
*   **Phase 4** : Refonte de `/services` et `/journeys` pour afficher les relations sémantiques 360°.
*   **Phase 5** : Déploiement du panneau de graphe local interactif.

# Plan d'Implémentation UI/UX — PIT Core UI (Sprint 4.3)

## Référence : PIT_CORE_UI_IMPLEMENTATION_PLAN_v2.0.0
## Version 2.0.0 (Spécifications UI/UX & Roadmap)

Ce document décrit en détail les spécifications graphiques, techniques, ergonomiques et la roadmap d'implémentation pour le déploiement de l'interface utilisateur (UI/UX) du Core Domain de la Plateforme d'Intégration Territoriale (PIT) Wallonie. Ce plan s'appuie exclusivement sur les APIs `/api/v2` et réutilise strictement le Design System existant, en prenant comme unique modèle graphique le cockpit **Services** actuel (`ServicesContainer.tsx`).

> [!IMPORTANT]
> **Règle d'or du Sprint 4.3** : Aucune modification ou création de code React dans ce sprint. Ce livrable est strictement documentaire et sert à valider l'architecture de navigation et la stratégie API avant tout codage.

---

## 🎨 1. Uniformisation UI / Design System PIT

Tous les nouveaux cockpits doivent être construits à l'image du cockpit **Services** (`ServicesContainer.tsx`). Ils doivent réutiliser les mêmes composants du Design System et adopter le même look & feel, les mêmes harmonies de couleurs (tons verts/sarcelle "teal" et violet "purple", thème sombre dynamique), les mêmes patterns de cartes et de filtres.

### A. Composants UI Réutilisés (`src/design-system/` & `src/components/ui/`)
*   **`PITLayout`** ([PITLayout.tsx](file:///c:/Users/Philippe%20Pisetta/Downloads/testing%20CPSV-AP/cpsv-ap-app/src/design-system/PITLayout.tsx)) : Structure globale de la page avec la barre latérale gauche (`Sidebar`) et le bandeau d'en-tête supérieur (`Topbar`).
*   **`PITDetailLayout`** ([PITDetailLayout.tsx](file:///c:/Users/Philippe%20Pisetta/Downloads/testing%20CPSV-AP/cpsv-ap-app/src/design-system/PITDetailLayout.tsx)) : Mise en page double (Split Layout) :
    *   *Gauche* : Liste/Tableau de recherche et de sélection.
    *   *Droite* : Panneau détaillé sur l'entité sélectionnée avec onglets ("Vue d'ensemble", "Relations", "Parcours", "Métadonnées", "Historique").
*   **`PITFilterBar`** ([PITFilterBar.tsx](file:///c:/Users/Philippe%20Pisetta/Downloads/testing%20CPSV-AP/cpsv-ap-app/src/design-system/PITFilterBar.tsx)) : Barre de filtrage unifiée incluant :
    *   Le champ de recherche textuel avec icône loupe et bouton de remise à zéro.
    *   Les filtres sélecteurs (S3, Territoire, DR-BEST, etc.).
    *   Les boutons de filtres rapides (Quick Filters).
*   **`PITStatCard`** ([PITStatCard.tsx](file:///c:/Users/Philippe%20Pisetta/Downloads/testing%20CPSV-AP/cpsv-ap-app/src/design-system/PITStatCard.tsx)) : Cartes de KPIs sous forme de grille en haut du panneau de détails (ex. : Budget, Taux de complétion, Nombre de sous-projets).
*   **`PITRelationsPanel`** ([PITRelationsPanel.tsx](file:///c:/Users/Philippe%20Pisetta/Downloads/testing%20CPSV-AP/cpsv-ap-app/src/design-system/PITRelationsPanel.tsx)) : Equivalent de `PITRelationshipPanel` pour afficher les grilles de relations associées dans le panneau de détails.
*   **`PITGraphView`** ([PITGraphView.tsx](file:///c:/Users/Philippe%20Pisetta/Downloads/testing%20CPSV-AP/cpsv-ap-app/src/design-system/PITGraphView.tsx)) : Equivalent de `PITGraphPanel`. Permet de visualiser le graphe de dépendance local d'un service ou d'un programme en s'appuyant sur `@xyflow/react`.
*   **`badge.tsx`** ([badge.tsx](file:///c:/Users/Philippe%20Pisetta/Downloads/testing%20CPSV-AP/cpsv-ap-app/src/components/ui/badge.tsx)) : Equivalent de `PITTaxonomyBadge`. Badges de couleurs spécifiques pour les thématiques et les taxonomies.
*   **Airtable-like Data Table** : Implémentation du tableau standardisé reprenant exactement le style CSS de `ServicesContainer.tsx` (lignes 1640-1700), avec lignes alternées, surbrillance au survol (`hover:bg-teal-50/35 dark:hover:bg-teal-950/15`), et typographie compacte (`text-xs`).

---

## ⚙️ 2. API v2 Uniquement (Zéro dépendance `/api/meta`)

Pour garantir des temps de réponse rapides, les cockpits n'appelleront plus l'ancien endpoint global `/api/meta`. Chaque cockpit consommera des appels ciblés et paginés via les routes `/api/v2/...` implémentées dans le backend.

### A. Nouveaux Hooks TanStack Query à créer
Ces hooks seront définis de manière centralisée dans `src/hooks/useV2Queries.ts` :

1.  **`useV2Programs(filters)`** : Récupère la liste paginée des programmes.
    *   `GET /api/v2/programs?page=x&pageSize=y&s3DomainId=z&drbest=a&search=b`
2.  **`useV2ProgramDetail(id)`** : Récupère les détails d'un programme.
    *   `GET /api/v2/programs/:id`
3.  **`useV2ProgramProjects(id)`** : Récupère les projets imbriqués d'un programme.
    *   `GET /api/v2/programs/:id/projects`
4.  **`useV2Capabilities(filters)`** : Récupère l'arbre des capabilités.
    *   `GET /api/v2/capabilities`
5.  **`useV2Territories(filters)`** : Récupère la liste hiérarchique des territoires.
    *   `GET /api/v2/territories`
6.  **`useV2Ecosystems(filters)`** : Récupère les pôles d'innovation/EDIH.
    *   `GET /api/v2/ecosystems`
7.  **`useV2S3Taxonomy()`** : Récupère l'arborescence structurelle S3.
    *   `GET /api/v2/taxonomies/s3`
8.  **`useV2DrBestTaxonomy()`** : Récupère les axes DR-BEST.
    *   `GET /api/v2/taxonomies/drbest`
9.  **`useV2GraphQuery(entityType, id)`** : Récupère les nœuds et liens du graphe local.
    *   `GET /api/v2/graph/:entityType/:id`

---

## 🏛️ 3. Spécifications des Nouveaux Cockpits

### A. Program Cockpit (`/programs`)
Permet de naviguer dans l'arborescence opérationnelle : **`Program ➔ Project ➔ Action ➔ Activity`**.
*   **Composants de page** :
    *   `PITLayout` contenant une barre de recherche globale, des filtres S3 Domain et DR-BEST (`PITFilterBar`).
    *   Un tableau compact de type Airtable listant les programmes.
    *   `PITDetailLayout` pour le panneau latéral droit de détails du programme sélectionné.
*   **Vue Détail** :
    *   **KPIs** (`PITStatCard`) : Budget total, nombre de projets rattachés, taux d'avancement des actions.
    *   **Onglet Vue d'ensemble** : Description, chef de file, dates de début et fin, badges de taxonomie S3 et DR-BEST.
    *   **Onglet Projets associés** (`PITRelationsPanel`) : Liste sous forme de tableau compact des projets rattachés au programme. Au clic sur un projet, l'utilisateur peut étendre la vue pour voir ses Actions associées, puis les Activités rattachées.
    *   **Onglet Services & Organisations** : Liste des services et des acteurs (organisations) engagés dans le programme.
*   **APIs Utilisées** :
    *   `GET /api/v2/programs`
    *   `GET /api/v2/programs/:id`
    *   `GET /api/v2/programs/:id/projects` (récupération à la demande)

---

### B. Capability Cockpit (`/capabilities`)
Cartographie les aptitudes technologiques et d'affaires requises ou acquises par les PME.
*   **Composants de page** :
    *   `PITLayout` et `PITFilterBar` (recherche et filtre par axe DR-BEST).
    *   `PITDetailLayout` affichant la capabilité sélectionnée.
*   **Vue Liste** :
    *   Arborescence imbriquée de capabilités, permettant d'étendre les dossiers parents pour afficher les capabilités enfants.
*   **Vue Détail** :
    *   **Onglet Vue d'ensemble** : Définition, description, type de capabilité, badges d'alignement S3 et DR-BEST.
    *   **Onglet Relations** (`PITRelationsPanel`) :
        *   Défis (Challenges) associés.
        *   Services publics et privés associés qui développent ou exploitent cette capabilité.
        *   Parcours (Journeys) intégrant cette capabilité.
        *   Programmes d'innovation qui financent ou soutiennent cette capabilité.
*   **APIs Utilisées** :
    *   `GET /api/v2/capabilities`
    *   `GET /api/v2/taxonomies/capabilities`
    *   `GET /api/v2/services/:id/capabilities` (croisé)

---

### C. Territory Cockpit (`/territories`)
Affiche l'organisation géographique et économique des services et programmes de la Région Wallonne.
*   **Composants de page** :
    *   `PITLayout` pour la mise en page.
    *   `PITDetailLayout` pour l'affichage détaillé.
*   **Vue Liste / Hiérarchie** :
    *   Arborescence repliable : **`Europe ➔ Pays ➔ Région (Wallonie) ➔ Province ➔ Commune ➔ Parc scientifique / ZAE`**.
*   **Vue Détail** :
    *   **KPIs** : Nombre d'entreprises actives sur le territoire, nombre de services locaux disponibles.
    *   **Onglet Acteurs locaux** : Liste des organisations implantées sur ce territoire.
    *   **Onglet Activités territoriales** : Liste des programmes, projets, services et parcours actifs à cette échelle géographique.
*   **APIs Utilisées** :
    *   `GET /api/v2/territories`
    *   `GET /api/v2/taxonomies/territories`

---

### D. Ecosystem Cockpit (`/ecosystems`)
Cockpit dédié aux hubs régionaux, EDIH et clusters (ex. : EDIH Wallonia, Cluster Tweed, Pôle Mecatech).
*   **Composants de page** :
    *   `PITLayout` avec grille de sélection des écosystèmes.
    *   `PITDetailLayout` pour la fiche descriptive complète du hub.
*   **Vue Détail** :
    *   **KPIs** : Nombre de membres, services labellisés portés par l'écosystème, nombre de parcours actifs.
    *   **Onglet Acteurs** : Organisations membres du hub.
    *   **Onglet Services & Parcours** : Liste des services et parcours pilotés par l'écosystème.
    *   **Onglet Capabilités** : Capabilités technologiques ou d'affaires couvertes par les membres du hub.
*   **APIs Utilisées** :
    *   `GET /api/v2/ecosystems`
    *   `GET /api/v2/taxonomies/ecosystem-types`

---

### E. S3 Cockpit (`/s3`)
Axe stratégique structurant de la Spécialisation Intelligente de la Wallonie (filières d'innovation prioritaires).
*   **Composants de page** :
    *   Navigation à trois niveaux sous forme de colonnes ou d'onglets de sélection : **`S3 Domain ➔ Value Chain ➔ Value Chain Stage`**.
*   **Affichage des relations** :
    *   Sélectionner un maillon (Value Chain Stage) affiche instantanément la liste des :
        *   Services publics et privés associés à ce maillon.
        *   Programmes et Projets d'innovation rattachés.
        *   Capabilités métiers ciblées par ce maillon stratégique.
*   **APIs Utilisées** :
    *   `GET /api/v2/s3-domains`
    *   `GET /api/v2/value-chains`
    *   `GET /api/v2/value-chain-stages`
    *   `GET /api/v2/taxonomies/s3`

---

### F. DR-BEST Dashboard (`/drbest`)
Tableau de bord interactif mesurant la maturité digitale des bénéficiaires et l'alignement des services sur les 6 axes DR-BEST.
*   **Interface graphique** :
    *   Graphique radar/spider unifié affichant la répartition globale des services et projets sur les 6 axes :
        *   **D** (Data)
        *   **R** (Remote / Mobilité)
        *   **B** (Business / Business Models)
        *   **E** (Ecosystem / Collaborations)
        *   **S** (Skills / Compétences)
        *   **T** (Technology / IA, Cloud, IoT)
    *   Au clic sur un axe du radar ou sur une carte dédiée, la vue filtre dynamiquement l'affichage.
*   **Vue de Liste filtrée** :
    *   Services, parcours, programmes et projets adressant la dimension sélectionnée.
*   **APIs Utilisées** :
    *   `GET /api/v2/taxonomies/drbest`
    *   Filtrage via le paramètre de requête `?drbest=TECHNOLOGY` sur les collections `/api/v2/services`, `/api/v2/journeys`, `/api/v2/programs`.

---

## 🔄 4. Évolution des Cockpits Existants (Vues 360°)

### A. Service 360° Cockpit (`/services`)
Le cockpit actuel de gestion des services publics et privés wallons doit être mis à jour pour représenter la chaîne de valeur sémantique complète : **`Challenge ➔ Capability ➔ Service ➔ Journey ➔ Beneficiary`**.
*   **Ajouts graphiques au panneau de détails** :
    *   **Onglet Défis d'affaires** : Liste des défis adressés par ce service.
    *   **Onglet Capabilités requises** : Liste des capabilités que le service requiert ou aide à acquérir.
    *   **Onglet Programmes et Projets** : Liste des programmes et projets opérationnels de financement wallons intégrant ou mobilisant ce service.
    *   **Onglet Événements professionnels & Événements de vie** : Intégration des `BusinessEvents` et `LifeEvents` associés (ex. : "Créer une entreprise", "Recruter du personnel").
    *   **Badges de catégorisation** : Tags S3 et DR-BEST dans l'en-tête de la fiche de détails.
*   **APIs Utilisées** :
    *   `GET /api/v2/services/:id/challenges`
    *   `GET /api/v2/services/:id/capabilities`
    *   `GET /api/v2/services/:id/journeys`
    *   `GET /api/v2/services/:id/programs`
    *   `GET /api/v2/services/:id/projects`

---

### B. Journey 360° Cockpit (`/journeys`)
Le cockpit de parcours (fiches d'accompagnement de la PME) intègre désormais toutes les relations nécessaires pour alimenter le moteur de recommandation :
*   **Vue Détail** :
    *   **Services associés** : Services constituant chaque étape du parcours (Amorçage, Diagnostic, Coaching, Planification, Implémentation, Investissement).
    *   **Défis d'affaires ciblés** : Défis globaux adressés par le parcours.
    *   **Capabilités développées** : Badges des capabilités acquises à la fin du parcours.
    *   **Événements déclencheurs** : Événements professionnels et personnels rattachés au parcours.
    *   **Bénéficiaires engagés** : Tableau des entreprises (PME, start-ups) engagées dans ce parcours avec leur score de maturité (Digiscore).
*   **APIs Utilisées** :
    *   `GET /api/v2/journeys/:id/services`
    *   `GET /api/v2/journeys/:id/challenges`
    *   `GET /api/v2/journeys/:id/capabilities`
    *   `GET /api/v2/journeys/:id/business-events`
    *   `GET /api/v2/journeys/:id/life-events`
    *   `GET /api/v2/journeys/:id/beneficiaries`

---

### C. Graph View Preparation (`PITGraphPanel`)
Intégration d'un panneau interactif "Relations Graphe" sur les fiches de détails des entités pivot (Services, Défis, Capabilités et Programmes).
*   Ce composant utilisera `PITGraphView.tsx` pour afficher un sous-graphe local (nœuds colorés représentant les entités connectées, lignes représentant les relations).
*   **APIs Utilisées** :
    *   `GET /api/v2/graph/services/:id`
    *   `GET /api/v2/graph/challenges/:id`
    *   `GET /api/v2/graph/capabilities/:id`
    *   `GET /api/v2/graph/programs/:id`

---

## ⚡ 5. Stratégie de Performance & Ergonomie (UX)

Pour éviter les congestions historiques dues aux appels en boucle et aux chargements inutiles :

1.  **TanStack Query Caching & Invalidation** :
    *   Déclaration d'un `staleTime` par défaut de 30 secondes sur toutes les requêtes collections.
    *   Invalidation automatique des caches lors des requêtes d'écriture (`POST`, `PATCH`) pour actualiser les tableaux sans rechargement complet de la page.
2.  **Pagination Serveur Obligatoire** :
    *   Les collections de données volumineuses (Programmes, Écosystèmes, Capabilités, Territoires) utiliseront des paramètres de pagination `page` et `pageSize` dans les requêtes API v2.
    *   L'interface affichera une barre de pagination fluide en bas des tableaux.
3.  **Lazy Loading des Onglets de Détails** :
    *   Les onglets secondaires du panneau `PITDetailLayout` (comme "Relations Graphe", "Services associés" ou "Acteurs locaux") ne déclencheront leurs requêtes TanStack Query correspondantes *que* lorsque l'utilisateur cliquera sur l'onglet en question (`enabled: activeTab === 'tabName'`).
4.  **Optimisation des Appels API** :
    *   Éliminer les appels multiples à des endpoints redondants. Aucun recours au endpoint global `/api/meta`. Les données de filtres seront récupérées via les taxonomies v2 ciblées.

---

## 📅 6. Roadmap d'Implémentation UI

Le développement de la couche d'interface utilisateur s'articulera autour de 5 phases logiques, dépendantes les unes des autres :

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

#### 🔹 Phase 1 : Programmes & Capabilités
*   Création de la page `/programs` :
    *   Intégration de la liste paginée et des filtres.
    *   Implémentation de la vue imbriquée (Programmes ➔ Projets ➔ Actions ➔ Activités) dans l'onglet des relations.
*   Création de la page `/capabilities` :
    *   Rendu sous forme d'arbre hiérarchique repliable.
    *   Mise en relation avec les Défis, Services, Parcours et Programmes associés.

#### 🔹 Phase 2 : Territoires & Écosystèmes
*   Création de la page `/territories` :
    *   Navigation hiérarchique géographique (Europe ➔ Pays ➔ Région ➔ Province ➔ Commune ➔ Parc).
    *   Liaison aux organisations et aux services locaux disponibles.
*   Création de la page `/ecosystems` :
    *   Liste et détails des EDIH / clusters wallons.
    *   Affichage des acteurs membres, des services labellisés, et des parcours pilotés.

#### 🔹 Phase 3 : S3 & DR-BEST
*   Création de la page `/s3` :
    *   Mise en place de la navigation structurée en 3 colonnes (Domaines S3, Chaînes de Valeur, Maillons).
    *   Affichage filtré dynamique des services, programmes, projets et capabilités associés au maillon.
*   Création de la page `/drbest` :
    *   Intégration d'un graphique radar interactif représentant les 6 axes.
    *   Mise en place du filtrage croisé sur l'ensemble du catalogue de services et parcours selon l'axe sélectionné.

#### 🔹 Phase 4 : Évolutions 360° (Services & Parcours)
*   Refonte de `/services` :
    *   Enrichissement de l'en-tête (badges S3 et DR-BEST).
    *   Ajout des onglets relations : Défis d'affaires, Capabilités requises, Programmes/Projets d'innovation, Business/Life Events.
*   Refonte de `/journeys` :
    *   Ajout des onglets relations : Défis, Capabilités, Événements de vie/professionnels, et liste des Bénéficiaires accompagnés (PME).

#### 🔹 Phase 5 : Préparation du Graphe Local (`PITGraphPanel`)
*   Intégration du composant `PITGraphView` dans un onglet dédié des détails de `/services`, `/capabilities`, `/programs` et `/challenges`.
*   Consommation des APIs de sous-graphe locaux `/api/v2/graph/...` avec gestion des nœuds et arêtes de dépendance.

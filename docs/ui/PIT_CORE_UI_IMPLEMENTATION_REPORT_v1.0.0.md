# Rapport d'Implémentation UI/UX — PIT Core UI (Sprint 4.3.A)

## Référence : PIT_CORE_UI_IMPLEMENTATION_REPORT_v1.0.0
## Version 1.0.0 (Livrable d'Implémentation & Diagnostics)

Ce rapport documente le travail d'intégration graphique et de raccordement de la couche d'interface utilisateur (UI/UX) pour le Core Domain de la Plateforme d'Intégration Territoriale (PIT) Wallonie, réalisé dans le cadre du Sprint 4.3.A (Phase 1).

---

## 🖥️ 1. Écrans Créés

Nous avons créé trois cockpits complets et interopérables sous les routes correspondantes de Next.js :

1.  **Cockpit Programmes (`/programs`)** :
    *   **Vue Liste** : Tableau compact Airtable-like listant les programmes d'innovation wallons avec leur code, opérateur lead, statut, et nombre de projets. Intègre une recherche textuelle dynamique, ainsi que des filtres par axe S3 et dimension DR-BEST.
    *   **Vue Détail** : Panneau double (Split Layout) doté de 5 onglets :
        *   *Vue d'ensemble* : Présente les informations synthétiques (KPIs de budget, lead operator, échelle territoriale, badges d'alignement S3 et DR-BEST).
        *   *Hiérarchie S3 (drill-down)* : Arbre interactif repliable permettant de déplier un **Projet**, puis de déplier ses **Actions** (jalons), et enfin d'afficher les **Activités** d'exécution associées.
        *   *Relations Graphe* : Visualisation interactive locale du réseau du programme via `PITGraphView` ( xyflow ).
        *   *Métadonnées* : Affiche les URIs, identifiants uniques et dates d'exécution du modèle Prisma.
        *   *Historique* : Trame de suivi de l'intégration du programme.
2.  **Cockpit Capabilités (`/capabilities`)** :
    *   **Vue Liste** : Tableau compact affichant le code, le nom de la compétence, son type (technologique, opérationnel, humain) et la capabilité parente.
    *   **Vue Détail** :
        *   *Vue d'ensemble* : Présentation descriptive, classification typologique, capabilité parente et mots-clés synonymes.
        *   *Relations Métier* : Affiche sous forme de grilles de cartes (`RelationshipCard`) les Défis d'affaires adressés, les Services publics associés et les Parcours de transformation reliés.
        *   *Relations Graphe* : Dessine le graphe de dépendances locales de la compétence (parent, enfants, etc.).
        *   *Métadonnées* : URIs et identifiants techniques.
3.  **Observatoire S3 (`/s3`)** :
    *   **Vue Drilldown à 3 colonnes** : Navigation fluide de gauche à droite : **`Domaines Stratégiques S3 ➔ Chaînes de Valeur ➔ Maillons (Stages)`**.
    *   **Vue Détail du Maillon** :
        *   *Vue d'ensemble* : KPIs et fil d'ariane stratégique du positionnement sémantique S3 de la Wallonie.
        *   *Services & Parcours* : Liste des services d'accompagnement et des parcours PME rattachés à ce maillon de chaîne de valeur.
        *   *Programmes & Projets* : Liste des financements et projets associés au domaine stratégique S3 parent.

---

## 🎨 2. Composants Réutilisés & Alignement Design System

Conformément à la règle de cohérence graphique stricte, aucun nouveau composant "maison" ou nouvelle approche de couleurs n'a été introduit. Tous les cockpits imitent à l'identique l'interface de référence du cockpit **Services** actuel (`ServicesContainer.tsx`) en réutilisant :
*   **`PITLayout`** ([PITLayout.tsx](file:///c:/Users/Philippe%20Pisetta/Downloads/testing%20CPSV-AP/cpsv-ap-app/src/design-system/PITLayout.tsx)) : Conteneur de page avec Sidebar unifiée et Topbar.
*   **`PITDetailLayout`** ([PITDetailLayout.tsx](file:///c:/Users/Philippe%20Pisetta/Downloads/testing%20CPSV-AP/cpsv-ap-app/src/design-system/PITDetailLayout.tsx)) : Gestionnaire des onglets et du panneau de détails double-colonne.
*   **`PITFilterBar`** ([PITFilterBar.tsx](file:///c:/Users/Philippe%20Pisetta/Downloads/testing%20CPSV-AP/cpsv-ap-app/src/design-system/PITFilterBar.tsx)) : Barre de recherche et de filtres.
*   **`PITStatCard`** ([PITStatCard.tsx](file:///c:/Users/Philippe%20Pisetta/Downloads/testing%20CPSV-AP/cpsv-ap-app/src/design-system/PITStatCard.tsx)) : Cartes KPI à bords arrondis avec ombrage léger.
*   **`PITRelationsPanel`** ([PITRelationsPanel.tsx](file:///c:/Users/Philippe%20Pisetta/Downloads/testing%20CPSV-AP/cpsv-ap-app/src/design-system/PITRelationsPanel.tsx)) et **`RelationshipCard`** ([RelationshipCard.tsx](file:///c:/Users/Philippe%20Pisetta/Downloads/testing%20CPSV-AP/cpsv-ap-app/src/components/ui/RelationshipCard.tsx)) : Rendu des grilles de cartes de relations.
*   **`PITGraphView`** ([PITGraphView.tsx](file:///c:/Users/Philippe%20Pisetta/Downloads/testing%20CPSV-AP/cpsv-ap-app/src/design-system/PITGraphView.tsx)) : Visualisation de graphes locaux.
*   **Airtable-like Data Table** : Grille HTML épurée avec lignes alternées, surbrillance au survol (`hover:bg-teal-50/35 dark:hover:bg-teal-950/15`) et typographie text-xs.
*   **`badge.tsx`** ([badge.tsx](file:///c:/Users/Philippe%20Pisetta/Downloads/testing%20CPSV-AP/cpsv-ap-app/src/components/ui/badge.tsx)) : Badges unifiés pour les dimensions DR-BEST et axes S3.

---

## ⚙️ 3. Intégration des APIs V2 & Hooks de Données

Les données sont consommées exclusivement via les endpoints `/api/v2/...` sans aucune requête vers `/api/meta`. Les hooks React Query créés dans [useV2Queries.ts](file:///c:/Users/Philippe%20Pisetta/Downloads/testing%20CPSV-AP/cpsv-ap-app/src/hooks/useV2Queries.ts) sont les suivants :
*   `useV2Programs(filters)` ➔ `GET /api/v2/programs`
*   `useV2ProgramDetail(id)` ➔ `GET /api/v2/programs/:id`
*   `useV2ProgramProjects(id, page, size)` ➔ `GET /api/v2/programs/:id/projects`
*   `useV2ProjectActions(id, page, size)` ➔ `GET /api/v2/projects/:id/actions`
*   `useV2ActionActivities(id, page, size)` ➔ `GET /api/v2/actions/:id/activities`
*   `useV2Capabilities()` ➔ `GET /api/v2/capabilities`
*   `useV2S3Domains()` ➔ `GET /api/v2/s3-domains`
*   `useV2ValueChains()` ➔ `GET /api/v2/value-chains`
*   `useV2ValueChainStages()` ➔ `GET /api/v2/value-chain-stages`
*   `useV2Services(filters)` ➔ `GET /api/v2/services`
*   `useV2Journeys(filters)` ➔ `GET /api/v2/journeys`
*   `useV2GraphQuery(type, id)` ➔ `GET /api/v2/graph/:type/:id`

---

## ⚡ 4. Diagnostics de Performance

*   **Query Caching** : Chaque requête s'appuie sur TanStack Query avec un `staleTime` global de 30 secondes pour économiser les lectures SQL.
*   **Pagination côté Serveur** : Les programmes, projets, actions et activités utilisent la pagination native retournée par l'API (avec métadonnées `page`, `pageSize`, `total`, `totalPages`).
*   **Lazy Loading** : Les relations imbriquées de l'arborescence (Projets ➔ Actions ➔ Activités) ne sont déclenchées qu'à l'expansion du nœud de l'arbre (`enabled: isOpen`), évitant tout goulot d'étranglement initial.

---

## 🔍 5. Gaps Techniques Documentés (Relations v2)

Conformément à la Règle N°2, nous documentons les éléments structurels non disponibles dans les endpoints `/api/v2` actuels du backend :

1.  **Program list counts** : L'API `GET /api/v2/programs` ne renvoie pas directement les agrégats SQL `actionsCount` et `activitiesCount` ni de champ `updatedAt` sur le modèle `Program`. Nous avons affiché `-` pour ces colonnes et documenté le besoin d'une vue ou d'un service de calcul côté backend pour les prochains sprints.
2.  **Capability Relations** : L'API `/api/v2/capabilities` retourne uniquement les entités d'aptitudes. Les jointures d'associations (`Capability ↔ Challenge`, `Capability ↔ PublicService`, `Capability ↔ Journey`) ne possèdent pas de point d'entrée dédié dans l'API v2 (ex. `/api/v2/capabilities/:id/services`).
    *   *Mitigation* : Les relations correspondantes sont filtrées dynamiquement côté client à partir des listes complètes retournées par `/api/v2/services` (qui inclut `capabilitiesNew`) et `/api/v2/challenges`.
3.  **Program ↔ Capability / Project ↔ Capability** : Il n'y a pas de lien direct exposé par l'API v2 pour relier les programmes et projets aux capabilités. Ces données sont laissées de côté ou simulées via le graphe en attente du Sprint 6.
4.  **S3 Level-2 & Level-3 for Programs/Projects** : L'API v2 permet uniquement de filtrer les programmes et projets par `s3Domain` ID (priorités régionales) mais pas à l'échelle des maillons individuels. Les cockpits affichent donc le portefeuille complet rattaché au domaine stratégique S3 parent.

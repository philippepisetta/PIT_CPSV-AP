# Plan de Test Fonctionnel (Test Plan) — PIT vNext

Ce document définit la stratégie de test et les scénarios de recette fonctionnels de la **Plateforme d'Intelligence Territoriale (PIT) vNext**. La source de vérité principale est le document joint `UseCases_CPSV_PIT_Wallonie.docx`, qui prime sur tout autre référentiel.

---

## 🎯 1. Stratégie & Axes de Validation

L'agent de test fonctionnel vérifie l'application sur 5 axes majeurs :

1.  **UX & Navigation** : Transition fluide entre les workspaces, visibilité conditionnelle des menus de la sidebar et de la topbar selon le rôle actif.
2.  **CRUD Bénéficiaires** : Création d'une entité (BCE, NACE, Type de structure), modification des contacts rattachés, mise à jour des jauges DMAT de maturité, et archivage logique (Soft Delete).
3.  **Résilience & Policy Intelligence** : Validation du wizard de simulation de chocs (ex: Caroline / Crise Énergétique Gaz x3), vérification de la présence des hypothèses actives, du panneau d'explicabilité, du diagnostic des manques de données (Data Gaps) et du graphe de traçabilité.
4.  **Alignement S3 & Preuves (Lignage)** : Vérification de la chaîne de causalité du pilotage (`Défi ➔ Programme ➔ Parcours ➔ Services ➔ Bénéficiaires ➔ Résultats ➔ Preuves d'Impact`).
5.  **15 Cas d'Usage Partenaires** : Exécution des scénarios métier réels pour valider que la PIT répond aux cas concrets d'usage des administrations wallonnes (WE, SPW EER, AKT, UCM, AWEX, WBI, Clusters).

---

## 🗺️ 2. Les 15 Scénarios de Recette Partenaires (Source de Vérité)

| ID | Partenaire | Titre du Scénario | Données de Test Cibles | Résultat / Recommandation Attendue |
| :--- | :--- | :--- | :--- | :--- |
| **CAS-01** | **WE** | Orientation Financement PME | MecaTech SRL, 38 ETP, Projet Robot de 180 k€, Charleroi | Recommandation : diagnostic EDIH, accompagnement WE, contact intégrateur |
| **CAS-02** | **WE** | Détection proactive d'entreprises | GreenSensor SA, IoT, Croissance +28%, Brevet déposé | Identification automatique comme candidate accompagnement Croissance/Export |
| **CAS-03** | **SPW / S3** | Cartographie dynamique S3 | Projet Smart Factory Wallonia, DIS Industrie du futur | Visualisation claire des projets, financements (€) et impacts régionaux |
| **CAS-04** | **SPW / S3** | Détection de synergies inter-DIS | Projets IA Agriculture & Maintenance prédictive | Détection de technologies communes et proposition de consortium |
| **CAS-05** | **AKT** | Matching entreprises / partenaires | BuildTech SRL recherchant solution BIM + IA | Proposition automatique de partenaires qualifiés (ex: CETIC, Sirris) |
| **CAS-06** | **AKT** | Détection besoins sectoriels | Hausse des besoins BIM et Cyber dans la construction | Notification suggérant la création d'une action collective de formation |
| **CAS-07** | **UCM** | Assistant administratif PME | Boulangerie Dupont, besoin digitalisation des commandes | Génération d'un parcours simplifié d'accès aux chèques-entreprises |
| **CAS-08** | **UCM** | Détection fragilités PME | Salon Clara, baisse de CA de 18%, faible maturité cyber | Alerte proactive pour recommandation d'un audit de rebond |
| **CAS-09** | **AWEX** | Recommandation marchés export | GreenSensor SA, IoT Smart City, mature technologiquement | Recommandation mission économique pays cible (ex: Pays-Bas) |
| **CAS-10** | **AWEX** | Détection d'entreprises exportables | BioPack Wallonia, emballages biosourcés, TRL élevé | Identification automatique comme entreprise "export-ready" |
| **CAS-11** | **WBI** | Recommandation programmes UE | Projet IA efficacité énergétique, consortium académique | Matching et orientation vers appels Horizon Europe et Interreg |
| **CAS-12** | **Clusters** | Détection automatique consortium | Projet Maintenance vibratoire | Proposition d'assemblage : PME + Startup IA + Centre de recherche |
| **CAS-13** | **Clusters** | Cartographie chaînes de valeur | Filière Batteries en Wallonie | Identification visuelle des maillons absents sur le territoire |
| **CAS-14** | **Transversal**| Moteur de recommandation global | DataWood SRL, automatisation devis & bois connecté | Recommandation intégrée multi-acteurs (EDIH + WE + AWEX) |
| **CAS-15** | **Transversal**| Customer Journey territorial | FoodProcess SA, transition énergétique et isolation | Parcours séquentiel fluide (Sensibilisation ➔ Diagnostic ➔ Financement) |

---

## 🔒 3. Matrice de Sécurité & Workspace Isolation

L'agent simule 4 profils utilisateurs pour valider les règles de visibilité et d'isolation de la sidebar :

*   **Administrateur** : Accès complet à tous les workspaces (`accompaniment`, `pilotage`, `data`).
*   **Accompagnateur** (Conseiller / Animateur) : Accès limité à l'espace `accompaniment` et `pilotage` partiels.
*   **Décideur** (DG / Cabinet) : Accès limité à l'espace `pilotage` et `resilience`. Les formulaires d'écriture CRUD doivent être désactivés (Preuves en lecture seule).
*   **Gestionnaire de données** (Data Steward) : Accès limité à l'espace `data` (interoperabilité).

---

## ⏱️ 4. Métriques de Performance & Stabilité

Pour chaque scénario exécuté, l'agent mesure :
*   **Latence de transition** (Navigation entre pages / Chargement sémantique < 1500ms attendu).
*   **Absence de chargement infini** (Aucun spinner bloqué à l'écran).
*   **Erreurs de console** (Zéro erreur JavaScript critique ou exception React non gérée).
*   **Erreurs réseau** (Zéro code HTTP 4xx ou 5xx sur les requêtes sémantiques ou API).

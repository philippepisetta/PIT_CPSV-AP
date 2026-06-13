# MATRICE DE COUVERTURE DU DATASET DE DÉMONSTRATION (PIT_DATASET_COVERAGE_MATRIX)

Ce document présente la matrice de couverture reliant les 15 cas d'usage décrits dans [PIT_USE_CASES_CATALOG.md](file:///c:/Users/Philippe%20Pisetta/Downloads/testing%20CPSV-AP/docs/demo/PIT_USE_CASES_CATALOG.md) aux différents cockpits, parties prenantes (Stakeholders) et alignements politiques régionaux (Strategic Contributions) de la PIT.

---

## 1. TABLEAU DE COUVERTURE GLOBALE

Ce tableau cartographie chaque cas d'usage par rapport aux cockpits techniques de l'application, au pilote de l'accompagnement (Primary Stakeholder) et aux cadres stratégiques soutenus (Strategic Contributions).

| Cas d'Usage | Primary Stakeholder | Strategic Contributions | Cockpits Couverts |
| :--- | :--- | :--- | :--- |
| **CAS 1 (BioPlast)** | `Wallonie Entreprendre (WE)` | Circular Wallonia, S3, Green Deal | /programs, /services, /s3, /journeys, /activities, /pilotage |
| **CAS 2 (Menuiserie)** | `CETIC` | EDIH, Digital Wallonia | /programs, /services, /capabilities, /journeys, /activities |
| **CAS 3 (LogiTrans)** | `CETIC` | Digital Wallonia, S3 | /programs, /services, /s3, /journeys, /recommender, /activities |
| **CAS 4 (MedTech)** | `BioWin` (Pôle) | S3, Digital Europe | /programs, /services, /s3, /recommender, /ecosystems, /pilotage |
| **CAS 5 (HydroGreen)** | `Sirris` | S3, Plan de Relance, Green Deal | /programs, /services, /s3, /activities, /ecosystems, /pilotage |
| **CAS 6 (SmartFarm)** | `Sirris` | Digital Wallonia, S3, Green Deal | /services, /capabilities, /s3, /activities, /pilotage |
| **CAS 7 (DataWall)** | `Agence du Numérique (AdN)` | Digital Wallonia, Digital Europe | /programs, /services, /capabilities, /journeys, /activities |
| **CAS 8 (RecyTech)** | `Wallonie Entreprendre (WE)` | Circular Wallonia, S3, Green Deal | /programs, /services, /s3, /activities, /ecosystems, /pilotage |
| **CAS 9 (CyberForge)** | `CETIC` | EDIH, Digital Europe | /programs, /services, /journeys, /recommender, /pilotage |
| **CAS 10 (Mobility)** | `Sirris` | S3, Plan de Relance | /programs, /services, /s3, /activities, /ecosystems, /pilotage |
| **CAS 11 (EcoBâtiment)**| `Wallonie Entreprendre (WE)` | Circular Wallonia, Green Deal | /programs, /services, /s3, /activities, /pilotage |
| **CAS 12 (AgroFood)** | `CETIC` | Digital Wallonia, S3 | /services, /capabilities, /s3, /recommender, /activities, /pilotage |
| **CAS 13 (NanoTech)** | `Sirris` | S3, Plan de Relance | /programs, /services, /s3, /journeys, /activities, /pilotage |
| **CAS 14 (GlassAlps)** | `GreenWin` (Pôle) | Plan de Relance, Green Deal, S3 | /programs, /services, /s3, /activities, /pilotage |
| **CAS 15 (SmartCity)** | `CETIC` | Digital Wallonia, S3 | /services, /capabilities, /s3, /activities, /pilotage |

---

## 2. COUVERTURE DÉTAILLÉE PAR COCKPIT

### A. Cockpit `/programs` (Programmes & Gouvernance)
Affiche la structure hiérarchique et budgétaire de l'action publique stratégique.
*   *Exemple de démonstration* : Un partenaire peut voir le budget de 4,5M EUR d'EDIH WallonIA alimenté par les actions de cybersécurité (**CAS 2**, **CAS 9**) et d'IA (**CAS 3**, **CAS 12**).

### B. Cockpit `/services` (Catalogue des Services Territoriaux)
Recense les prestations d'accompagnement proposées par les opérateurs territoriaux.
*   *Exemple de démonstration* : Visualisation dynamique des services de Sirris (`S-TEST-INVEST-IA`, `S-INNOV-HYDRO`) et CETIC (`S-DIAG-CYBER`, `S-PROTO-MED-IA`).

### C. Cockpit `/capabilities` (Compétences de l'Écosystème)
Cartographie la hiérarchie des expertises techniques mobilisées pour aider les PME.
*   *Exemple de démonstration* : Le cas **CAS 6** (SmartFarm) montre la liaison entre les capteurs LoRaWAN et la capabilité `Compétences Numériques` -> `IoT`.

### D. Cockpit `/s3` (Spécialisation Intelligente S3)
Affiche la ventilation de l'impact économique et environnemental par priorités industrielles régionales.
*   *Exemple de démonstration* : Agrégation immédiate de l'impact des domaines `S3-CIRCULAR-ECON` (BioPlast, RecyTech, EcoBâtiment, GlassAlps) et `S3-ENERGY` (HydroGreen, NanoTech Lab).

### E. Cockpit `/journeys` (Suivi de Progression des Parcours)
Enregistre la progression des bénéficiaires sur des modèles de parcours types régionaux.
*   *Exemple de démonstration* : Le parcours `Cybersécurité PME` montre l'avancement comparatif de **Menuiserie Dupont** (étape 2 validée, étape 3 en cours) et **CyberForge** (parcours complété).

### F. Cockpit `/recommender` (Moteur de Recommandation)
Produit des préconisations de services adaptées à l'étape active, la S3 et le NACE du bénéficiaire.
*   *Exemple de démonstration* : **LogiTrans** (**CAS 3**), ayant validé son diagnostic IA, se voit recommander automatiquement le service `Test Before Invest - IA` de Sirris.

### G. Cockpit `/activities` (Historique des Prestations Réelles)
Consigne les rapports et dates réels des prestations d'accompagnement individuelles ou collectives.
*   *Exemple de démonstration* : Liste chronologique des diagnostics cybersécurité complétés par CETIC pour Dupont (**CAS 2**) et CyberForge (**CAS 9**).

### H. Cockpit `/ecosystems` (Réseaux Régionaux & Acteurs)
Permet de visualiser les relations d'adhésion et de collaboration des acteurs territoriaux.
*   *Exemple de démonstration* : L'écosystème `EDIH Wallonia` rassemble l'AdN, WE, UCM et Sirris, tous impliqués dans l'accompagnement de nos bénéficiaires de test.

### I. Cockpit `/pilotage` (Impact global & ROI territorial)
Agrège les indicateurs d'impact réels (emplois, CO2, financements) mesurés chez les PME.
*   *Exemple de démonstration* : Somme globale du CO2 évité sur le territoire wallon (1 507 tonnes CO2/an) ou des financements injectés (500 000 EUR).

---

## 3. COUVERTURE DES PARTIES PRENANTES ET DES CONTRIBUTIONS STRATÉGIQUES

Le dataset `PIT_DEMO_DATASET_1.0` démontre les flux sémantiques complets reliant le bénéficiaire final aux politiques de haut niveau :

### A. Représentation des Parties Prenantes (Stakeholders)
*   **Primary Stakeholders (Opérateurs Leaders)** :
    *   `CETIC` : Pilote technique de l'adoption de l'IA et de la cybersécurité (CAS 2, CAS 3, CAS 9, CAS 12, CAS 15).
    *   `Sirris` : Leader sur le prototypage physique, l'énergie, l'IoT et l'ingénierie mécanique (CAS 5, CAS 6, CAS 10, CAS 13).
    *   `Wallonie Entreprendre (WE)` : Moteur du financement et de l'économie circulaire (CAS 1, CAS 8, CAS 11).
    *   `BioWin`, `GreenWin` (Pôles) : Accompagnement sectoriel d'excellence en santé et décarbonation lourde (CAS 4, CAS 14).
*   **Secondary Stakeholders (Réseaux de Support)** :
    *   `AWEX` : Exportation (CAS 9).
    *   `AdN` : Gouvernance et promotion régionale (CAS 2, CAS 3, CAS 6, CAS 7, CAS 9, CAS 12, CAS 15).
    *   `UCM` : Relais d'accompagnement de proximité (CAS 2, CAS 7).
    *   `SPW` : Administration de tutelle et financeur de dispositifs (CAS 1, CAS 4, CAS 5, CAS 6, CAS 7, CAS 8, CAS 11, CAS 13, CAS 14, CAS 15).

### B. Représentation des Contributions Stratégiques (Strategic Contributions)
*   **S3 (Smart Specialisation Strategy)** : Mapped sur 11 cas d'usage, illustrant comment les priorités de spécialisation industrielle se matérialisent par des projets concrets.
*   **Circular Wallonia** : Mapped sur 3 cas d'usage (BioPlast, RecyTech, EcoBâtiment), démontrant les boucles de matières et la réduction de l'empreinte carbone territoriale.
*   **EDIH** : Mapped sur 2 cas d'usage (Menuiserie Dupont, CyberForge), illustrant le guichet unique d'innovation européen.
*   **Digital Wallonia** : Mapped sur 6 cas d'usage (Dupont, LogiTrans, SmartFarm, DataWall, AgroFood, SmartCity), démontrant l'accélération numérique transversale de l'économie.
*   **Plan de Relance (PRW)** : Mapped sur 3 cas d'usage (HydroGreen, Mobility Next, GlassAlps), démontrant les investissements de transition régionaux majeurs.
*   **Green Deal** : Mapped sur 5 cas d'usage d'impact environnemental (BioPlast, HydroGreen, SmartFarm, RecyTech, GlassAlps) alignés avec les directives de décarbonation européennes.
*   **Digital Europe** : Mapped sur 3 cas d'usage (MedTech, DataWall, CyberForge) montrant l'articulation de la Wallonie dans le réseau de données européen.

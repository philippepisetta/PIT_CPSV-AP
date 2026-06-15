# Spécifications d'Alignement CPSV-AP – PIT vNext

Ce document définit les règles d'alignement des services publics territoriaux de la PIT sur le standard européen **CPSV-AP (Common Public Service Vocabulary Application Profile)** et assure la compatibilité avec le reporting des hubs européens (EDIH).

---

## 📋 1. Cartographie (Mapping) CPSV-AP des Services

Le modèle de données de la PIT utilise les classes et propriétés standardisées du CPSV-AP pour décrire les services territoriaux d'innovation :

| Concept CPSV-AP | Attribut / Relation dans la PIT | Description & Format standardisé |
| :--- | :--- | :--- |
| **Public Service** | `PublicService` (table centrale) | L'offre d'accompagnement public (ex. Audit de Cybersécurité). |
| **Title** | `PublicService.name` | Nom du service public en format texte court. |
| **Description** | `PublicService.description` | Descriptif textuel complet des bénéfices et du contenu. |
| **Identifier** | `PublicService.code` | Identifiant unique métier (ex. `SRV-CYBER-DIAG`). |
| **Homepage / URI** | `PublicService.uri` | URI unique d'interopérabilité (ex. `https://pit.wallonie.be/id/service/12`). |
| **Public Organization** | `PublicService.organizationId` | L'organisme fournisseur du service (ex. CETIC, Sirris, BioWin). |
| **Channel** | `Channel` (relation) | Le canal de délivrance (ex. Physique, En ligne, Email). |
| **Cost** | `Cost` (relation / description JSON) | Le coût financier ou la gratuité sous conditions (ex. Aide de minimis). |
| **Rule** | `Rule` (relation) | La règle juridique ou le décret régional encadrant l'aide. |
| **Requirement** | `Requirement` (relation) | La condition d'accès (ex. Être une PME wallonne). |
| **Evidence** | `Evidence` (relation) | Le document justificatif requis (ex. Bilan comptable, attestation). |
| **Output** | `Output` (relation) | Le livrable délivré à l'entreprise (ex. Rapport d'audit final). |
| **Outcome** | `Outcome` (relation) | L'impact attendu mesuré chez l'entreprise (ex. Réduction CO2, NIS2). |

---

## 🛠️ 2. Structure du Formulaire CRUD Alignée CPSV-AP

Le formulaire de création/modification de services dans le back-office organise les champs en 4 onglets logiques CPSV-AP :

### Onglet 1 : Informations Générales (Core Meta)
* **Nom du Service (Title)** [Obligatoire] : Saisie texte.
* **Code Métier (Identifier)** [Obligatoire] : Code unique en majuscules (ex: `SRV-IA-DIAG`).
* **URI Sémantique** [Facultatif] : Format URL. Généré automatiquement par défaut.
* **Fournisseur (Public Organization)** [Obligatoire] : Liste déroulante des organisations enregistrées.
* **Description (Description)** [Obligatoire] : Bloc de texte détaillé.

### Onglet 2 : Conditions & Canaux (Requirements & Channels)
* **Public Cible (Target Group)** : Choix multiples (PME, Startup, Grande Entreprise, Chercheur).
* **Conditions d'accès (Requirements)** : Texte libre décrivant les critères.
* **Justificatifs requis (Evidences)** : Types de documents acceptés (Rapport, Certificat, Formulaire).
* **Canaux de délivrance (Channels)** : Choix multiples (En ligne, Présentiel, Hybride).

### Onglet 3 : Coûts & Règles (Costs & Rules)
* **Tarification (Cost)** : Saisie numérique + devise + description (ex. "Gratuit sous régime de minimis").
* **Réglementation (Rule)** : Lien optionnel vers la base légale ou description textuelle.

### Onglet 4 : Résultats & Livrables (Outputs & Outcomes)
* **Livrables attendus (Outputs)** : Liste des documents techniques remis (ex. Rapport d'audit cyber).
* **Impacts mesurés (Outcomes)** : Choix d'indicateurs cibles (ex. Indice de maturité cyber augmenté de 1).

---

## 🇪🇺 3. Compatibilité avec le reporting EDIH (DMA)

Les EDIH doivent remonter des indicateurs standardisés à la Commission européenne (Digital Maturity Assessment). Le formulaire CPSV-AP intègre cette exigence :
* **Référentiel DR-BEST / DMAT** : Lors de la liaison d'un service avec des compétences, on associe les taxonomies européennes d'IA, de cybersécurité et de compétences numériques.
* **Génération automatique de preuves** : L'output validé par le conseiller dans la PIT génère instantanément l'attestation requise pour le reporting de l'EDIH à l'Europe, éliminant les doubles saisies administratives.

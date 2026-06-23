# Script de Démonstration Exécutive de la PIT Wallonie (v1)
*Guide de Storytelling Stratégique à destination du Cabinet, du SPW, de WE, de l'AWEX, de l'AdN et de CORTEX.*

---

## 💡 INTRODUCTION MÉTHODOLOGIQUE
La Plateforme d'Intelligence Territoriale (**PIT**) n'est pas un outil opérationnel de gestion de crise à la minute (rôle dévolu aux centres de crise). C'est un outil d'**aide à la décision stratégique à froid** et d'**évaluation de la résilience** territoriale. 

Le rôle de la PIT est de répondre à des questions de politique publique ("Evidence-Based Policy") en reliant les vulnérabilités structurelles aux services publics d'accompagnement et de financement disponibles. Elle met également en évidence la qualité de la donnée et les **gaps de données** à combler pour éclairer la gouvernance.

---

## 🎭 STRUCTURE COMMUNE DU STORYTELLING DE CHAQUE SCÉNARIO

Chaque scénario suit rigoureusement la trame suivante :
1. **Story** : Contexte narratif concret de la crise.
2. **Decision Question** : Question stratégique formulée par le décideur (Cabinet/Direction).
3. **Vulnerability** : Vulnérabilité structurelle identifiée et son code unique.
4. **Impact Path** : Enchaînement causal de l'impact (du déclencheur aux conséquences macro-économiques).
5. **Programs** : Programmes d'accompagnement ou de relance mobilisables.
6. **Services** : Services publics d'appui technique (CPSV-AP).
7. **Data Gaps** : Données connues, données manquantes et sources futures cibles.
8. **Response Options** : Options d'arbitrage politique recommandées par la PIT.

---

### 1️⃣ Scénario 1 : Crise Énergétique (Choc Thermique Gaz)
* **Story** : Une crise géopolitique majeure provoque une rupture d'approvisionnement en gaz et un triplement des prix spot. L'industrie lourde wallonne est frappée de plein fouet.
* **Decision Question** : *Quelles filières S3 sont les plus exposées à la dépendance au gaz naturel importé ?*
* **Vulnerability** : `VULN-GAS-NET` (Dépendance critique au gaz naturel de process importé).
* **Impact Path** : 
  Choc sur les prix du gaz 
  ➔ Exposition de la Province de Liège (Bassin de Seraing)
  ➔ Paralysie de la Filière S3 Métallurgie (Sidérurgie NACE 24)
  ➔ Risque de chômage partiel pour 18 500 ETP
  ➔ Risque de faillite pour 142 structures industrielles
  ➔ Perte de valeur ajoutée estimée à 4.2 Mrds €
* **Programs** :
  - *Programme de Transition Énergétique Industrielle* (Wallonie Entreprendre)
  - *Chèques Entreprises - Volet Transition* (SPW)
* **Services** :
  - `S-OPTIM-PROCESS` (Optimisation Énergétique des Procédés - Sirris)
  - `S-AUDIT-DECARBON` (Audit Décarbonation Industrielle - GreenWin)
* **Data Gaps** :
  - *Connues* : Codes NACE sectoriels, effectifs ONSS, adresses BCE.
  - *Manquantes* : Consommation de gaz réelle par site, nature des contrats d'énergie (fixe/indexé), couverture de hedging.
  - *Sources Cibles* : Gestionnaires de Réseaux de Distribution (ORES / RESA), Fluxys, SPF Économie.
* **Response Options** : Activer le guichet de subvention d'urgence, prioriser les audits d'efficacité de Sirris pour les 142 sidérurgistes ciblés, et négocier l'accès aux données de consommation auprès des GRD.

---

### 2️⃣ Scénario 2 : Résilience Cyber (Ransomware Cloud Unique)
* **Story** : Une cyberattaque par ransomware paralyse le principal fournisseur cloud régional, bloquant les outils métiers de centaines de PME.
* **Decision Question** : *Quelles organisations critiques dépendent d'un unique fournisseur Cloud ?*
* **Vulnerability** : `VULN-CLOUD-SINGLE` (Concentration critique des données sur un hébergeur unique sans redondance).
* **Impact Path** : 
  Attaque logique par ransomware
  ➔ Blocage des architectures applicatives des sous-traitants
  ➔ Interruption d'activité dans le Brabant Wallon (ZAE Wavre)
  ➔ Paralysie de la logistique et des services numériques (NACE 62)
  ➔ Risque d'interruption pour 58 structures
  ➔ Perte de chiffre d'affaires cumulée de 185 M € (sur 72h)
* **Programs** :
  - *Programme Cyber Résilience Wallonie* (AdN)
  - *Chèques Cybersécurité PME* (SPW)
* **Services** :
  - `S-CYBER-ASSESSMENT` (AI Cyber Assessment - CETIC)
  - `S-INCIDENT-RESPONSE` (Support Réponse sur Incident Cyber - CETIC)
* **Data Gaps** :
  - *Connues* : Fiches de maturité numérique déclaratives de la PIT, coordonnées des DPD NIS2.
  - *Manquantes* : Emplacement géographique réel des sauvegardes (DRP), architecture d'hébergement effective.
  - *Sources Cibles* : Fiches de conformité NIS2 du CCB (Centre pour la Cybersécurité Belgique), rapports d'audits AdN.
* **Response Options** : Lancer un plan d'urgence de cofinancement de plans de reprise d'activité (DRP) multi-cloud et auditer en priorité les 58 structures du bassin de Wavre.

---

### 3️⃣ Scénario 3 : Pénurie de Compétences IA (Skills Shortage)
* **Story** : La transition numérique de l'économie wallonne est freinée par une pénurie aiguë de profils qualifiés en intelligence artificielle et data science.
* **Decision Question** : *Où se situent les plus fortes pénuries de compétences en intelligence artificielle ?*
* **Vulnerability** : `VULN-AI-SKILLS` (Pénurie régionale de talents spécialisés en Deep Learning et Data Engineering).
* **Impact Path** : 
  Retard technologique européen
  ➔ Exode des diplômés universitaires vers Bruxelles/étranger
  ➔ Sous-effectif chronique de data scientists dans les pôles (LLN, Liège)
  ➔ Retard de livraison de projets R&D pour 420 structures
  ➔ Perte de valeur ajoutée industrielle estimée à 650 M €
* **Programs** :
  - *EDIH Wallonia* (AdN)
  - *Digital Wallonia - Plan Talents* (AdN)
* **Services** :
  - `S-AI-READINESS` (Diagnostic IA & Maturité Algorithmique - CETIC)
  - `S-TEST-INVEST-IA` (Test Before Invest - IA - Sirris)
* **Data Gaps** :
  - *Connues* : Offres d'emploi Forem non pourvues, nombre de diplômés par université, indices de maturité DMAT.
  - *Manquantes* : Compétences réelles du personnel en poste, budgets réels consacrés à la formation continue en PME.
  - *Sources Cibles* : Forem, Fédérations sectorielles (Agoria), Universités wallonnes.
* **Response Options** : Financer des bootcamps de requalification accélérée, doubler le budget d'expérimentation "Test Before Invest" et intégrer les données d'insertion professionnelle universitaires.

---

### 4️⃣ Scénario 4 : Circular Wallonia (Rupture Matières Premières)
* **Story** : Un embargo logistique mondial bloque l'importation de métaux critiques et terres rares requis pour la transition verte wallonne.
* **Decision Question** : *Quelles dépendances matières menacent la compétitivité de la manufacture ?*
* **Vulnerability** : `VULN-RAW-MAT` (Dépendance critique aux importations de minéraux stratégiques : cobalt, lithium, iridium).
* **Impact Path** : 
  Tensions géopolitiques internationales
  ➔ Rupture d'approvisionnement en terres rares
  ➔ Blocage des chaînes de production de batteries et équipements électriques (NACE 27)
  ➔ Menace sur 8 200 ETP industriels
  ➔ Blocage de 2.1 Mrds € de chiffre d'affaires exportateur
* **Programs** :
  - *Circular Design & Materials* (Wallonie Entreprendre)
  - *Plan de Relance de la Wallonie - Économie Circulaire* (SPW)
* **Services** :
  - `S-MATERIAL-FLOW` (Analyse des Flux de Matières critiques - Sirris)
  - `S-CIRCULAR-ECON` (Diagnostic Économie Circulaire Global - Wallonie Entreprendre)
* **Data Gaps** :
  - *Connues* : Statistiques générales d'import/export de l'AWEX, liste des industriels S3.
  - *Manquantes* : Stocks physiques réels sur site, origine géographique exacte des minéraux bruts.
  - *Sources Cibles* : Douanes Fédérales, Audits d'approvisionnement des fédérations industrielles.
* **Response Options** : Cofinancer en urgence les programmes de substitution de matières de Sirris et déployer des diagnostics d'économie circulaire pour les 62 structures manufacturières identifiées.

---

### 5️⃣ Scénario 5 : Stratégie S3 (Sciences du Vivant / BioWin)
* **Story** : Évaluation stratégique intermédiaire de l'allocation des fonds de R&D collaborative afin de s'assurer de leur impact socio-économique réel.
* **Decision Question** : *Quels programmes régionaux génèrent le plus fort impact stratégique ?*
* **Vulnerability** : `VULN-S3-ALIGNMENT` (Risque de désalignement de la R&D régionale par rapport aux besoins du marché).
* **Impact Path** : 
  Subventions publiques de recherche R&D
  ➔ Projets collaboratifs universités/PME
  ➔ Création de brevets et publications académiques
  ➔ Difficulté de transfert technologique (faible TRL)
  ➔ Risque de perte de compétitivité pour 850 structures actives
  ➔ Risque de dilution de 140 M € d'aides annuelles
* **Programs** :
  - *S3 Innovation Santé* (BioWin / Wallonie Entreprendre)
  - *Data4Wallonia* (AdN)
* **Services** :
  - `S-PROTO-MED-IA` (Prototype Médical IA - CETIC)
  - `S-FUND-INNOV` (Financement Innovation Santé - Wallonie Entreprendre)
* **Data Gaps** :
  - *Connues* : Enveloppes budgétaires allouées par projet, composition des consortia de recherche.
  - *Manquantes* : Niveau de maturité technologique (TRL) à la fin du projet, chiffre d'affaires découlant directement du produit développé.
  - *Sources Cibles* : Pôles de compétitivité (BioWin, MecaTech), Secrétariat du SPW Recherche.
* **Response Options** : Imposer le suivi du TRL dans le Cockpit PIT, indexer le refinancement des projets sur le taux de transfert industriel effectif, et croiser les brevets avec les données d'exportation de l'AWEX.

---

### 6️⃣ Scénario 6 : Résilience Inondation (Vallée de la Vesdre)
* **Story** : Des précipitations extrêmes provoquent une crue majeure de la Vesdre, inondant les zones industrielles de Verviers et Pepinster. Les usines métallurgiques et logistiques sont paralysées.
* **Decision Question** : *Quel impact économique anticiper suite à une crue majeure et quel budget mobiliser ?*
* **Vulnerability** : `VULN-FLOODPLAIN-EXP` (Exposition physique critique d'usines et d'infrastructures en zone d'aléa d'inondation élevé).
* **Impact Path** : 
  Cumul extrême de précipitations (>150mm)
  ➔ Débordement des voies hydrauliques (La Vesdre)
  ➔ Paralysie des infrastructures (Électricité, Transports, Télécoms)
  ➔ Arrêt de production et dégâts aux machines pour 32 structures
  ➔ Chômage technique de force majeure pour 2 800 ETP
  ➔ Perte de chiffre d'affaires de 450 M € (sur 15 jours de paralysie)
  ➔ Besoin financier d'urgence de 25 M € pour relancer l'activité
* **Programs** :
  - *Plan de Relance Wallon - Résilience Territoriale* (SPW)
  - *Fonds des Calamités Publiques de la Région Wallonne* (SPW)
* **Services** :
  - `S-BIZ-CONTINUITY` (Aide au Plan de Continuité d'Activité - PCA - SPW)
  - `S-RECONSTRUCT-ADVISORY` (Conseil en Reconstruction Industrielle Résiliente - Sirris)
  - `S-FUND-SUPPORT` (Support Financement d'Urgence Calamités - Wallonie Entreprendre)
* **Data Gaps** :
  - *Connues* : Adresses précises des entreprises, polygones de zonage industriel, couches géospatiales d'aléa inondation du SPW.
  - *Manquantes* : Taux réel de couverture d'assurance contre les catastrophes, présence d'un PCA à jour, hauteur d'installation physique des transformateurs électriques d'usine.
  - *Sources Cibles* : Assureurs régionaux (via Assuralia), communes de Verviers/Pepinster, Service de gestion des Voies Hydrauliques.
* **Response Options** : Débloquer en urgence des avances de trésorerie garanties par WE pour pallier les retards d'indemnisation des assurances, et financer systématiquement la rédaction de PCA via les Chèques Entreprises.

---

## ❓ FOIRE AUX QUESTIONS DES PARTENAIRES STRATÉGIQUES (Q&A)

### 👑 1. CABINET DU MINISTRE
* **Q** : *La PIT fait-elle doublon avec notre cellule de crise ?*
  * **A** : **Non**. La cellule de crise gère l'opérationnel en temps réel (évacuation, sécurité publique). La PIT intervient **à froid** comme un outil de simulation stratégique et d'évaluation structurelle. Elle permet de savoir, avant la crise ou après celle-ci, quelles sont nos vulnérabilités économiques latentes (dépendance au gaz, exposition géographique, compétences) et d'adapter les aides financières et techniques en conséquence.
* **Q** : *Puis-je utiliser la PIT pour arbitrer l'attribution de budgets de relance ?*
  * **A** : **Oui**. C'est son rôle principal. La PIT permet de simuler des chocs (énergétiques, climatiques) et d'estimer l'impact financier et humain (ETP menacés, CA exposé) afin de calibrer les enveloppes d'urgence ou de transition énergétique.

### 🏢 2. SPW (ADMINISTRATION CENTRALE)
* **Q** : *Comment la PIT s'articule-t-elle avec nos bases de données métiers existantes ?*
  * **A** : La PIT utilise le standard européen de métadonnées **CPSV-AP** pour décrire les services publics de manière interopérable. Elle n'aspire pas vos bases mais s'y connecte pour mapper le lignage : Question exécutive ➔ Données NACE/BCE ➔ Indicateurs S3 ➔ Services d'accompagnement.
* **Q** : *Qui est responsable de la mise à jour des données géospatiales (ex: inondations) ?*
  * **A** : La PIT applique le principe du "dites-le nous une seule fois". Les couches d'aléas sont lues directement depuis le **GéoPortail de la Wallonie (SPW)**. La PIT n'héberge pas de données géographiques propres, elle consomme vos flux de référence.

### 🌐 3. WALLONIE ENTREPRENDRE (WE)
* **Q** : *Comment la PIT nous aide-t-elle à cibler nos interventions financières de crise ?*
  * **A** : En croisant les données géographiques et sectorielles, la PIT vous fournit instantanément la liste nominative des structures exposées (ex: les 32 usines inondables de la Vesdre ou les 142 usines dépendantes du gaz). Vous pouvez ainsi faire du **ciblage proactif** au lieu d'attendre passivement les demandes d'aides.
* **Q** : *Pouvons-nous mesurer le retour sur investissement (ROI) de nos subventions de relance ?*
  * **A** : **Oui**. Le graphe de connaissances de la PIT relie l'instrument financier (`FundingInstrument`) aux indicateurs de résultats (`OutcomeIndicator`) et aux impacts réels mesurés sur le terrain (ex: `indRiskMitig` pour les emplois sauvegardés).

### 📡 4. AWEX (AGENCE À L'EXPORTATION)
* **Q** : *La PIT expose-t-elle nos données d'exportation sensibles ?*
  * **A** : **Non**. Les données d'exportations individuelles sont protégées. La PIT effectue des agrégations anonymisées au niveau des filières de la chaîne de valeur (TRL, maillons exports) pour évaluer la résilience macro-économique sans exposer le secret industriel.
* **Q** : *Comment le scénario "Circular Wallonia" peut-il soutenir nos entreprises à l'international ?*
  * **A** : En détectant précocement les dépendances aux métaux critiques importés, la PIT signale les risques de rupture d'exportation et oriente les PME vers les services de substitution de Sirris, sécurisant ainsi leurs contrats d'export (comme pour `CyberForge` et ses contrats NIS2 en Allemagne).

### 🛠️ 5. CORTEX
* **Q** : *En quoi la PIT et CORTEX sont-ils complémentaires ?*
  * **A** : **CORTEX qualifie le risque** à l'échelle régionale (gravité, occurrence, définition de la menace). **La PIT matérialise l'impact structurel** en reliant le risque aux réalités territoriales (NACE, ETP) et en identifiant les capacités d'absorption et de rebond (Services Publics CPSV-AP, Financements WE). CORTEX est le "détecteur d'alertes", la PIT est le "modélisateur d'impacts et le planificateur de réponses".

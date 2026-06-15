# Reality Check de la Gouvernance des Données – PIT vNext

Ce document établit le cadre de gouvernance, de propriété et de droits d'accès aux données collectées et consolidées au sein du Knowledge Graph Territorial de la PIT vNext.

---

## 📊 1. Matrice des Droits et de Gouvernance des Données

| Acteur Territorial | Données gérées | Droits d'Accès | Restrictions Majeures | Motivations au Partage |
| :--- | :--- | :--- | :--- | :--- |
| **EDIH** | Diagnostics de maturité (DR-BEST), parcours d'innovation, services délivrés. | **Lecture & Écriture** sur ses bénéficiaires ; **Lecture seule** sur le catalogue global. | Interdiction de voir les données d'investissement privées de WE. | Simplification et automatisation du reporting Commission Européenne. |
| **Pôles de Compétitivité** | Consortiums, projets R&D, verrous technologiques (gaps), catalogues de services. | **Lecture & Écriture** sur son écosystème ; **Lecture seule** sur les projets des pôles concurrents. | Interdiction d'accéder aux détails d'IP ou de brevets en cours de dépôt des autres pôles. | Accélérer le montage de projets R&D et valoriser son impact auprès du SPW. |
| **Wallonie Entreprendre (WE)** | Programmes de financements publics, enveloppes attribuées, portefeuilles d'entreprises. | **Lecture seule** sur le graphe d'innovation ; **Lecture & Écriture** sur ses opportunités financières. | Masquage complet des investissements en capital-risque et des prises de participations privées. | Valider la réalité technique et l'impact S3 des projets financés par ses subventions. |
| **AWEX** | Fiches de capacités d'exportation des PMEs, opportunités de marchés internationaux. | **Lecture seule** sur le graphe territorial ; **Lecture & Écriture** sur les aides à l'export. | Interdiction de modifier les diagnostics de maturité ou les projets S3. | Détecter de nouvelles PMEs matures prêtes à l'exportation et cartographier les filières. |
| **SPW (Administration)** | Cadres stratégiques (S3), indicateurs régionaux, rapports d'impact consolidés. | **Lecture seule** sur le graphe global ; **Écriture** sur les politiques stratégiques. | Pas d'accès direct aux négociations privées de consortiums avant leur dépôt officiel. | Piloter l'efficacité des subventions régionales de manière continue et auditable. |
| **Entreprise (Bénéficiaire)** | Profil technologique, défis internes, demandes d'accompagnement. | **Lecture & Écriture** sur son propre profil ; **Lecture seule** sur ses recommandations. | Pas d'accès aux diagnostics d'autres PMEs concurrentes. | Accéder en un clic aux aides régionales adaptées et aux partenaires académiques de confiance. |

---

## 🔍 2. Classification de la Sensibilité des Données

### A. Les Données Réellement Partageables (Open-Territory)
Ces données ne présentent pas de risque concurrentiel et peuvent être publiées sur le graphe sémantique :
* **Le catalogue public de services territoriaux (modèle CPSV-AP)**.
* **Les descriptions des programmes de financement régionaux et européens**.
* **Les statistiques d'impact agrégées par filière** (ex. nombre total d'entreprises décarbonées ou d'emplois créés au niveau régional).
* **Les verrous technologiques (Gaps) collectifs** d'une chaîne de valeur.

### B. Les Données Sensibles (Cloisonnement Requis)
Ces données doivent être protégées par des accès restreints (authentification forte par rôles) :
* **Les diagnostics de maturité individuels des PMEs** (leurs faiblesses cyber ou numériques).
* **Les consortiums en cours de montage** (avant soumission officielle de l'appel à projets).
* **Les rapports physiques de preuves (Evidences)** (hébergés sur les serveurs de l'opérateur et protégés par droits d'accès).

### C. Les Données Impossibles à Mutualiser (No-Go Zones)
Ces données doivent être totalement exclues de la PIT pour éviter le rejet immédiat du projet :
* **Les données nominatives confidentielles d'affaires** (contrats de vente, marges, clients privés des PMEs).
* **Le capital-investissement privé de WE** (négociations de participations, valorisations de scale-ups).
* **Les propriétés intellectuelles (IP) non protégées** (molécules cliniques de BioWin, secrets de fabrication industriels de MecaTech).

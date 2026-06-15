# Analyse d'Écart : PIT vs Outils Existants

Ce document détaille le positionnement technologique et fonctionnel de la PIT vNext par rapport aux applications logicielles couramment utilisées par les opérateurs territoriaux wallons.

---

## 📊 1. Tableau Comparatif Global

| Outil existant | Ce qui est remplacé par la PIT | Ce qui est complémentaire avec la PIT | Ce qui reste hors périmètre de la PIT |
| :--- | :--- | :--- | :--- |
| **EDIH Tool** (Outils de diagnostic DMA/Europe) | L'outil de calcul isolé du diagnostic de maturité digitale (DMA). | L'export de rapports standardisés conformes aux règles de la Commission européenne. | La gestion administrative et la facturation directe des hubs européens. |
| **Salesforce** (CRM d'agence ex. WE) | Les bases de données de contacts et d'opportunités d'investissements dispersées. | Synchronisation des portefeuilles d'entreprises financées et de leurs données d'investissement. | L'instruction financière poussée, la gestion des transactions en capital et les workflows de recouvrement. |
| **HubSpot** (CRM marketing et commercial) | L'envoi de newsletters et le suivi de prospection commerciale basique des pôles. | La capture automatique de nouveaux leads (startups) s'enregistrant sur les landing pages du pôle. | Le marketing automation complexe, le lead nurturing commercial et les tunnels de vente privés. |
| **Excel** (Fichiers de suivi de projet & d'impact) | **Remplacement total** : fin des tableaux d'agrégation d'impact, de suivi de roadmaps S3 et de listes de consortiums. | Aucun. Excel doit être banni pour la gestion du graphe territorial. | Les calculs financiers ad-hoc des contrôleurs de gestion internes. |
| **SharePoint** (Portails documentaires & stockage) | Les dossiers partagés de stockage de livrables et de rapports d'impact non reliés au projet. | Le stockage physique de fichiers de preuves (Evidences) pointés par des URIs sémantiques sécurisées. | La gestion fine des droits d'accès intranet et la collaboration sur documents Office en temps réel. |
| **Airtable** (Bases de données relationnelles PME/Clusters) | Les mini-bases de données bricolées pour suivre les projets S3 ou les compétences des membres. | Importation en masse de données via des scripts ou APIs REST standardisées. | Les applications collaboratives internes spécifiques à un pôle (ex. planning de présence). |
| **CRM Cluster typique** (ex. Zoho, Odoo CRM) | L'annuaire d'écosystème statique et le catalogue de services PDF non interactif. | L'alimentation des fiches membres par les fiches d'entreprises de la PIT. | La facturation des cotisations annuelles des membres et la comptabilité générale. |

---

## 🛠️ 2. Analyse Détaillée

### A. Ce qui est remplacé par la PIT
1. **L'agrégation manuelle et déclarative d'impact** : Auparavant, les pôles et clusters compilaient manuellement des données d'impact (Word/Excel) pour le SPW. La PIT remplace cette méthode par un système d'**agrégation continue et automatisée** basée sur des preuves physiques.
2. **Le catalogue de services statique** : Le catalogue papier ou PDF des pôles est remplacé par un **catalogue territorial dynamique (modèle CPSV-AP)** interconnecté avec les diagnostics de maturité des PMEs.
3. **Le montage de consortium artisanal** : Le matching de partenaires R&D par "mémoire humaine" des conseillers est remplacé par le **moteur de recommandation sémantique**.

### B. Ce qui est complémentaire
1. **Les CRMs d'agence (Salesforce/Odoo)** : La PIT agit comme un **fédérateur sémantique**. Elle se connecte à Salesforce via API pour récupérer l'historique financier et renvoie vers le CRM les indices de maturité et les besoins d'accompagnement de l'entreprise.
2. **Les plateformes de stockage cloud (SharePoint/Nextcloud)** : La PIT stocke les métadonnées et l'URI (lien unique) de la preuve (*Evidence*). Le fichier physique (PDF du rapport) reste hébergé sur le serveur sécurisé de l'opérateur (ex. SharePoint du CETIC ou du CHU).

### C. Ce qui reste hors périmètre (No-Go zones pour la PIT)
1. **La gestion financière interne et la comptabilité** : La PIT ne gère pas les budgets de fonctionnement des pôles, la facturation des cotisations ou les lignes de crédit de WE.
2. **Le CRM commercial privé** : La PIT est une plateforme publique territoriale de collaboration. Les données d'affaires purement privées (négociations de contrats de vente, CRM interne exclusif d'un pôle) n'ont pas leur place dans le graphe territorial partagé.
3. **L'instruction administrative légale** : La gestion réglementaire complexe de la passation de marchés publics ou de l'analyse juridique approfondie reste du ressort des applications métiers de l'administration wallonne.

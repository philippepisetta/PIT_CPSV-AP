# Évaluation Go / No-Go de Déploiement – PIT vNext

Ce document présente une évaluation objective et critique de la maturité fonctionnelle et de la pertinence de la PIT vNext pour entamer des projets pilotes avec 4 cibles territoriales distinctes.

---

## 🇪🇺 1. Pilote EDIH (IA & Cyber) : GO
La PIT vNext est pleinement prête pour un déploiement pilote auprès des EDIH wallons.

* **Justification** :
  * Le module de diagnostic de maturité (**DR-BEST**) est fonctionnel et prêt pour les évaluations d'entreprises.
  * Le catalogue de services et le moteur de recommandation fournissent des suggestions pertinentes immédiatement applicables.
  * Le volume d'accompagnement élevé des PMEs par les EDIH fournit un jeu de données réel parfait pour rôder les workflows de la plateforme.
* **Conditions à remplir pour le lancement** :
  * Valider l'exportation des données de diagnostics au format compatible européen.
  * Organiser une session de formation de 2 heures avec les conseillers de diagnostics.

---

## 👥 2. Pilote Clusters & Pôles (BioWin, GreenWin, MecaTech) : GO AVEC RÉSERVES
Le lancement d'un pilote avec les pôles de compétitivité est envisageable, mais requiert des garde-fous clairs sur la gouvernance de la donnée.

* **Justification** :
  * Les fonctionnalités clés (**Consortium Builder**, **Value Chain Explorer**) sont prêtes et compilées sans erreur.
  * Le besoin d'accélérer le montage de consortiums R&D est une réalité métier.
  * *Réserves* : Risque élevé de blocage par les DGs de pôles en raison de la compétition pour les subventions et de la confidentialité de la R&D.
* **Conditions à remplir pour lever les réserves** :
  * Faire signer la **Charte de Gouvernance des Données** garantissant le cloisonnement des fiches d'entreprises et le masquage des projets en cours de montage.
  * Configurer l'import initial de données depuis leurs Salesforce respectifs pour éviter tout double encodage.

---

## 💼 3. Pilote Wallonie Entreprendre (WE) : NO GO (Temporaire)
Un déploiement pilote avec WE à ce stade est prématuré et présenterait un risque de rejet immédiat.

* **Justification** :
  * WE utilise Salesforce de manière critique pour toute son instruction financière et son capital-investissement.
  * Les API de synchronisation de la PIT avec Salesforce n'ont pas encore été testées avec les environnements de sécurité de WE.
  * L'effort d'intégration IT est sous-estimé et WE rejettera tout outil ajoutant de la saisie manuelle ou doublonnant ses dashboards Power BI.
* **Conditions à remplir pour passer en GO** :
  * Finaliser et tester le connecteur d'API Salesforce en lecture seule dans un environnement sandbox de WE.
  * Limiter l'usage de la PIT chez WE à la consultation passive d'indicateurs d'impact S3 validés par les pôles.

---

## 🏛️ 4. Pilote SPW (Administration wallonne) : GO AVEC RÉSERVES
Le SPW est prêt à utiliser la PIT comme cockpit stratégique, mais l'administration n'a pas les ressources pour en assurer la gestion au quotidien.

* **Justification** :
  * Le cockpit stratégique (**Strategic Framework Explorer** et **Tab DG**) est complet et consolidé.
  * L'administration a un besoin urgent de justifier l'impact de ses dépenses publiques.
  * *Réserves* : Risque d'asphyxie administrative. Le SPW n'a pas le personnel technique pour valider individuellement chaque document de preuve (*Evidence*) soumis par les bénéficiaires.
* **Conditions à remplir pour lever les réserves** :
  * Déléguer contractuellement la validation des preuves d'impact aux pôles et aux EDIH (le SPW n'agit qu'en auditeur de second niveau par sondage).
  * Désigner officiellement un "Garant du Graphe" (Data Steward) à l'Agence du Numérique (AdN) pour la gestion technique quotidienne de la plateforme.

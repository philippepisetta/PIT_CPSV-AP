# Mémorandum de Décision Exécutive – PIT vNext

**À l'attention de** : Direction Générale et Cabinets Ministériels  
**Objet** : Validation d'opportunité, plan de déploiement et évaluation des risques de la PIT vNext  
**Statut** : Document d'aide à la décision stratégique  

---

## 1. La PIT vNext est-elle prête techniquement ?
**Oui.** D'un point de vue architectural et applicatif, la plateforme est finalisée. 
* L'ensemble des 40 routes Next.js compilent sans erreur.
* Les fonctionnalités clés (**Graph Explorer**, **ContextPanel**, **Value Chain Explorer**, **Consortium Builder**, **Evidence Audit Board**, et **Strategic Framework Explorer**) sont pleinement fonctionnelles.
* Le méta-modèle métier sémantique (compatible standard européen CPSV-AP) est gelé et stable.
* **Aucun développement technique supplémentaire n'est requis.**

---

## 2. Que faut-il encore valider sur le terrain ?
Avant toute généralisation, le projet doit affronter le **Reality Check** des pratiques des opérateurs. Il reste à valider :
1. **L'interopérabilité des APIs** : Valider la connexion automatique en lecture seule entre la PIT et le Salesforce de WE / des pôles pour éliminer le risque de double encodage.
2. **La charte de gouvernance** : Faire signer l'accord de partage de données définissant la confidentialité des prospects de recherche et des données cliniques sensibles.
3. **L'appropriation par les conseillers** : Valider que l'usage quotidien du diagnostic de maturité (DR-BEST) génère un gain de temps administratif réel.

---

## 3. Quel pilote lancer en premier ?
Nous recommandons de lancer en priorité absolue le pilote **EDIH (Maturité IA & Cyber)**.
* **Pourquoi ?** : Il présente un taux de réussite estimé à 90% avec un effort technique minimal. Les conseillers EDIH travaillent déjà de manière structurée sur des diagnostics numériques (DMA).
* **Périmètre** : 10 conseillers pilotes, 50 PMEs évaluées et 10 services publics recommandés en direct.
* **Pilote n°2 (Mois 3)** : Le pôle *Logistics in Wallonia* sur la sécurisation réglementaire NIS2 de la chaîne d'approvisionnement logistique.

---

## 4. Quels résultats attendre dans les 6 prochains mois ?
Si la feuille de route est respectée, le projet produira les résultats concrets suivants :
* **Mois 3** : 50 diagnostics de maturité cyber/IA de PMEs finalisés et centralisés dans la PIT.
* **Mois 4** : Cartographie en temps réel des gaps et verrous technologiques (gaps de compétences, acteurs manquants) de la filière logistique.
* **Mois 5** : Montage et indexation sémantique de 3 consortiums de R&D pilotes via le *Consortium Builder*.
* **Mois 6** : Ouverture du premier cockpit d'alignement stratégique S3 connecté à des données terrain réelles et auditables pour le SPW.

---

## 5. Quels risques restent ouverts ?

### A. Le risque de double encodage (Friction opérationnelle)
* *Description* : Si la connexion API avec les Salesforce internes prend du retard, les conseillers devront encoder deux fois les informations, entraînant l'abandon immédiat de la PIT.
* *Atténuation* : Fournir dès le départ des scripts d'import-export Excel simplifiés comme solution de secours en attendant la synchronisation automatique des APIs.

### B. Le risque de rétention d'information (Guerre de territoires)
* *Description* : Les pôles refusent de partager leurs consortiums R&D naissants par peur d'ingérence ou de concurrence budgétaire.
* *Atténuation* : Cloisonner par design technique l'accès aux projets en statut "Draft" (seuls les partenaires du consortium et le conseiller y ont accès ; le SPW ne voit le projet qu'une fois officiellement soumis).

### C. Le risque d'inertie administrative (Pérennité IT)
* *Description* : Le manque de ressources internes au SPW pour assurer la maintenance applicative après le départ du prestataire initial.
* *Atténuation* : Transférer la responsabilité technique de la plateforme à l'Agence du Numérique (AdN) et y nommer un "Garant du Graphe" (Data Steward) officiel.

# Revue Red Team & Stress Test Stratégique – PIT vNext

Ce document présente une analyse critique indépendante de la PIT vNext. L'objectif est d'adopter la posture d'acteurs sceptiques et d'auditeurs rigoureux pour identifier les faiblesses structurelles et les freins à l'adoption de la plateforme avant sa mise en œuvre opérationnelle.

---

## 🏥 ROLE 1 – LE DG DE BIOWIN (Santé)

Le DG de BioWin gère un écosystème d'excellence (Biotech, MedTech) très structuré, doté de budgets importants et de données hautement sensibles.

* **Pourquoi changer / utiliser la PIT ?**
  * *Position sceptique* : Aucune raison évidente. Nos processus actuels fonctionnent. Salesforce gère nos contacts et notre prospection R&D, et nos rapports Word conviennent au SPW depuis des années.
* **Pourquoi abandonner ou compléter Salesforce ?**
  * *Position sceptique* : Remplacer Salesforce est exclu (coût d'implémentation et de formation historique). Le compléter signifie ajouter une double saisie ou payer des frais de développement pour interfacer Salesforce avec l'API de la PIT.
* **Pourquoi demander un nouvel encodage aux équipes ?**
  * *Position sceptique* : Les conseillers passent déjà 30% de leur temps dans l'administration. Les forcer à encoder des indicateurs S3 dans la PIT va nuire à leur temps passé sur le terrain avec les entreprises.
* **Quel ROI concret ?**
  * *Position sceptique* : Non démontré à court terme. Les outcomes de santé (ex. essais cliniques réussis, mise sur le marché) prennent 5 à 10 ans.
* **Quels risques ?**
  * *Position sceptique* : Fuite de données propriétaires (IP sur les molécules ou dispositifs médicaux) vers d'autres pôles ou des administrations publiques peu habituées au secret industriel.

### 📊 Fiche d'Évaluation : BioWin
* **Forces** : Standardisation du catalogue de services et moteur de recommandation pour le montage de consortiums de recherche complexes.
* **Faiblesses** : Manque de prise en compte du secret d'affaires sur les innovations médicales en phase précoce.
* **Objections** : *« Pourquoi donner au SPW un droit de regard quotidien sur nos prospects alors qu'il n'est censé évaluer que nos rapports de performance annuels ? »*
* **Réponses possibles (Atténuation)** : Masquage total des données d'innovation confidentielles. Seule la preuve d'outcome validée en fin de parcours est partagée sur le graphe public.
* **Probabilité d'adoption** : **Faible** (sans obligation légale ou financière du SPW).

---

## 🍃 ROLE 2 – LE DG DE GREENWIN (Chimie Verte & Matériaux)

Le DG de GreenWin anime une communauté axée sur la transition industrielle, la décarbonation et les matériaux de construction durables.

* **Pourquoi partager mes données ?**
  * *Position sceptique* : Mes membres sont des industriels traditionnels de la chimie ou du ciment. Ils détestent partager des données opérationnelles sur leurs chaînes d'approvisionnement ou leurs bilans carbone réels.
* **Pourquoi mutualiser avec d'autres opérateurs ?**
  * *Position sceptique* : Les pôles sont en concurrence directe pour les enveloppes budgétaires régionales de R&D. Mutualiser nos données d'écosystème avec MecaTech ou Logistics réduit notre avantage compétitif lors des appels à projets.
* **Quel avantage immédiat ?**
  * *Position sceptique* : Quasi nul pour notre pôle. Nous connaissons déjà nos 80 membres actifs par cœur sans avoir besoin d'un graphe sémantique pour nous les présenter.
* **Quelles pertes d'autonomie ?**
  * *Position sceptique* : Si le SPW utilise la Gap Analysis de la PIT pour décider où financer de nouvelles infrastructures de recyclage, nous perdons notre pouvoir d'influence politique direct auprès du ministre.

### 📊 Fiche d'Évaluation : GreenWin
* **Forces** : Cartographie claire de la chaîne de valeur du plastique et du béton circulaire (visualisation des maillons).
* **Faiblesses** : Résistance intrinsèque à la transparence inter-pôles.
* **Objections** : *« Si nous montrons que nous avons un gap critique sur un maillon, la Région va-t-elle couper nos subventions ou les réorienter vers Sirris ? »*
* **Réponses possibles (Atténuation)** : Présenter la détection des gaps comme un levier d'obtention de nouveaux financements de relance, et non comme un outil de sanction.
* **Probabilité d'adoption** : **Moyenne** (valeur forte pour la visualisation des chaînes de valeur, mais réticence au partage).

---

## 🌾 ROLE 3 – LE DG DE WAGRALIM (Agroalimentaire)

Wagralim gère des membres de taille très diverse, allant de l'artisan local à la multinationale agroalimentaire.

* **Animation de communauté** :
  * *Position sceptique* : Notre force réside dans la relation humaine et le réseautage physique (salons, ateliers de dégustation). Un outil numérique froid comme la PIT n'anime pas une communauté agroalimentaire.
* **Gestion des membres** :
  * *Position sceptique* : La plupart de nos membres (agriculteurs, petits transformateurs) n'ont pas d'ordinateur au bureau et n'utiliseront jamais l'espace "Entreprise".
* **Projets collaboratifs** :
  * *Position sceptique* : Les projets agroalimentaires sont basés sur des secrets de fabrication locaux. Les structurer sémantiquement sous forme de graphe public expose nos recettes et nos procédés.

### 📊 Fiche d'Évaluation : Wagralim
* **Forces** : Visualisation de l'alignement sur la souveraineté alimentaire et les circuits courts.
* **Faiblesses** : Fracture numérique importante des membres du pôle.
* **Objections** : *« L'agroalimentaire a besoin de pragmatisme. Un graphe de connaissances sémantiques est une usine à gaz technologique inadaptée à nos PMEs. »*
* **Réponses possibles (Atténuation)** : Le pôle centralise l'encodage. L'entreprise reçoit uniquement des recommandations de subventions ciblées sur son mobile sans devoir naviguer dans le graphe.
* **Probabilité d'adoption** : **Moyenne-Faible** (utilité pour le pôle, rejet probable par la base d'entreprises).

---

## 🇪🇺 ROLE 4 – LE RESPONSABLE D'UN EDIH (IA ou Cyber)

Les EDIH sont financés à 50% par l'Europe et ont des exigences strictes de reporting (DMA).

* **Pourquoi remplacer ou intégrer l'outil EDIH ?**
  * *Position sceptique* : L'outil imposé par la Commission Européenne (JRC) est obligatoire pour justifier nos financements. La PIT est une initiative wallonne de plus qui se surajoute.
* **Qu'est-ce qui est réellement meilleur ?**
  * *Position sceptique* : Le fait qu'elle calcule le diagnostic numérique de l'entreprise est identique à notre outil actuel.
* **Que vais-je perdre ?**
  * *Position sceptique* : Du temps à faire des imports-exports et à former nos équipes sur une double saisie si la passerelle API avec le système européen dysfonctionne.
* **Que vais-je gagner ?**
  * *Position sceptique* : Rien d'un point de vue européen. La PIT nous permet seulement de lier notre diagnostic aux aides de WE, mais c'est le travail du conseiller, pas le nôtre.

### 📊 Fiche d'Évaluation : EDIH
* **Forces** : Intégration du diagnostic de maturité (DR-BEST) avec le catalogue de services wallons (recommandations automatiques).
* **Faiblesses** : Dépendance aux directives et outils imposés par Bruxelles.
* **Objections** : *« Si l'Europe change son questionnaire DMA le mois prochain, la PIT va-t-elle mettre à jour ses algorithmes de calcul en 24h ou devrons-nous bloquer nos reportings ? »*
* **Réponses possibles (Atténuation)** : Interface de configuration dynamique des questionnaires dans la PIT pour refléter les changements européens sans code.
* **Probabilité d'adoption** : **Élevée** (si l'interopérabilité sémantique est garantie et validée).

---

## 💼 ROLE 5 – LE DG DE WALLONIE ENTREPRENDRE (WE)

WE est l'outil financier de la Wallonie (fonds propres, capital-risque, garanties).

* **Pourquoi la PIT plutôt que Salesforce ?**
  * *Position sceptique* : Salesforce est notre outil central d'investissement. La PIT ne gère pas les aspects financiers complexes (diligence raisonnable, cash-flow). Nous n'abandonnerons jamais Salesforce pour la PIT.
* **Pourquoi la PIT plutôt que Power BI ?**
  * *Position sceptique* : Nous avons déjà des analystes Power BI qui créent d'excellents dashboards financiers. Pourquoi financer une nouvelle plateforme sur mesure ?
* **Quel coût de maintenance et de gouvernance ?**
  * *Position sceptique* : Qui va payer pour maintenir ce graphe de connaissances à jour ? Quel est le coût annuel des licences ou de l'hébergement cloud de la PIT ?
* **Qui est propriétaire ?**
  * *Position sceptique* : Si le SPW est propriétaire, WE risque de voir ses données d'investissements stratégiques publiques et exploitées politiquement par d'autres cabinets.

### 📊 Fiche d'Évaluation : Wallonie Entreprendre
* **Forces** : Permet de lier l'octroi d'une aide financière (prêt/subvention) à la preuve physique d'impact technologique (outcomes validés par les pôles).
* **Faiblesses** : Coût d'intégration IT élevé avec leur Salesforce historique.
* **Objections** : *« Nous gérons du risque financier. L'impact S3 est une priorité secondaire par rapport à la viabilité économique de nos participations. »*
* **Réponses possibles (Atténuation)** : Positionner la PIT comme un outil de réduction des risques de l'investissement R&D grâce à la validation des étapes par les pôles.
* **Probabilité d'adoption** : **Moyenne-Faible** (WE utilisera la PIT uniquement si le SPW l'exige comme condition d'octroi des budgets).

---

## 🌍 ROLE 6 – LE DIRECTEUR DE L'AWEX (Export)

L'AWEX soutient les entreprises wallonnes à l'international et attire les investisseurs étrangers.

* **Que m'apporte la PIT que je n'ai pas déjà ?**
  * *Position sceptique* : Nous avons déjà notre propre base de données des exportateurs wallons et des fiches sectorielles papier complètes.
* **Comment la PIT aide l'export ?**
  * *Position sceptique* : La PIT est un outil sémantique technique régional. Elle ne fournit aucun contact client à l'étranger ni de réseau de distribution physique à Singapour ou Munich.
* **Comment la PIT améliore le matchmaking international ?**
  * *Position sceptique* : Nos conseillers économiques à l'étranger travaillent sur des opportunités de marché réelles, pas sur des "graphes territoriaux d'innovation".

### 📊 Fiche d'Évaluation : AWEX
* **Forces** : Capacité à présenter visuellement les chaînes de valeur wallonnes complètes (ex. Hydrogène) pour attirer les investisseurs étrangers.
* **Faiblesses** : Outil trop focalisé sur la R&D régionale, pas assez sur le business international.
* **Objections** : *« Pourquoi devrions-nous connecter nos bases d'exportateurs à un graphe public, risquant de révéler nos champions industriels à des concurrents étrangers ? »*
* **Réponses possibles (Atténuation)** : Données exposées anonymisées au niveau des capacités collectives de la chaîne de valeur, sans ciblage individuel des PMEs sans leur accord.
* **Probabilité d'adoption** : **Faible** (usage occasionnel en lecture seule pour la promotion territoriale).

---

## 🏛️ ROLE 7 – LE SPW (Administration wallonne)

Le SPW est l'administration chargée d'exécuter les politiques publiques régionales.

* **Pourquoi la PIT plutôt qu'un Data Warehouse ou un catalogue de données ?**
  * *Position sceptique* : Nous construisons déjà un Data Warehouse régional pour stocker toutes les données des administrations. La PIT fait doublon.
* **Pourquoi la PIT plutôt qu'une plateforme open data ?**
  * *Position sceptique* : L'Open Data wallon (odwall) expose déjà les subventions. La PIT est une surcouche coûteuse.
* **Quelle gouvernance & pérennité ?**
  * *Position sceptique* : Qui assure la gouvernance de la donnée ? Si le prestataire technique s'en va ou fait faillite, l'administration se retrouve avec un code personnalisé impossible à maintenir.

### 📊 Fiche d'Évaluation : SPW
* **Forces** : Traçabilité totale reliant le cadre de référence politique (S3) jusqu'à la preuve d'impact physique du bénéficiaire final.
* **Faiblesses** : Inertie administrative légendaire face aux nouvelles plateformes agiles.
* **Objections** : *« Nous n'avons pas les ressources humaines en interne pour auditer en continu les 'Evidences' remontées par les pôles. »*
* **Réponses possibles (Atténuation)** : Déléguer la responsabilité de la validation des preuves aux pôles de compétitivité et aux EDIH. Le SPW ne fait que contrôler les statistiques agrégées.
* **Probabilité d'adoption** : **Moyenne** (soutien de la hiérarchie mais blocage possible par les équipes IT).

---

## 👑 ROLE 8 – LE CABINET MINISTÉRIEL (Politique)

Le cabinet cherche des résultats rapides (visibles avant les prochaines élections) et une gestion des risques politiques sans faille.

* **Combien cela coûte ?**
  * *Position sceptique* : Les budgets de la Région sont en déficit. Comment justifier le financement d'une nouvelle plateforme face aux priorités de santé ou d'enseignement ?
* **Combien cela rapporte ?**
  * *Position sceptique* : Le ROI de la R&D est trop tardif. Nous ne verrons aucun emploi créé grâce à la PIT avant la fin de notre mandat.
* **Quels résultats dans 12 mois ?**
  * *Position sceptique* : Si nous ne pouvons pas annoncer des résultats majeurs et tangibles (ex. 1000 PMEs sauvées de la faillite ou décarbonées) dans les 12 mois, le projet n'a aucun intérêt politique.
* **Pourquoi maintenant ?**
  * *Position sceptique* : Nous pouvons reporter ce projet au prochain gouvernement.
* **Quel risque politique ?**
  * *Position sceptique* : Si la PIT révèle publiquement que 40% des fonds alloués à la transition énergétique n'ont généré aucune réduction carbone prouvée (Gaps critiques), c'est un suicide politique pour le ministre de l'Énergie.

### 📊 Fiche d'Évaluation : Cabinet Ministériel
* **Forces** : Effet visuel immédiat (Graph Explorer) pour démontrer la modernisation de l'action publique territoriale.
* **Faiblesses** : Transparence de la donnée qui peut se retourner contre les décisions politiques passées.
* **Objections** : *« Si la PIT montre des inefficacités ou des gaps dans nos investissements, l'opposition va l'utiliser pour nous attaquer. »*
* **Réponses possibles (Atténuation)** : Présenter la PIT comme l'outil d'optimisation budgétaire courageux du ministre pour corriger les inefficacités du passé.
* **Probabilité d'adoption** : **Élevée** (si le storytelling politique de transparence et d'efficacité est bien cadré).

---

## 🏢 ROLE 9 – L'ENTREPRISE (Bénéficiaire Final)

L'entreprise cherche la croissance, des ventes, du cash-flow et à minimiser ses charges administratives.

* **Pourquoi créer un profil ?**
  * *Position sceptique* : Nous avons déjà 15 comptes différents sur les portails publics (guichet unique, TVA, e-sub, Forem). Créer un profil supplémentaire est une perte de temps.
* **Pourquoi partager mes données ?**
  * *Position sceptique* : Nous n'avons aucun intérêt à ce que la Région sache que nous avons des faiblesses cyber critiques (NIS2 non conforme) ou que nos projets R&D précédents ont échoué.
* **Quel bénéfice concret & immédiat ?**
  * *Position sceptique* : Si la PIT ne me garantit pas l'obtention d'une subvention de 100 k€ en 48h, cela ne sert à rien.

### 📊 Fiche d'Évaluation : Entreprise
* **Forces** : Moteur de recommandation d'aides et de partenaires de confiance en un clic.
* **Faiblesses** : Manque d'incitations financières directes liées à l'usage de la plateforme.
* **Objections** : *« C'est encore de la bureaucratie déguisée en outil digital. »*
* **Réponses possibles (Atténuation)** : Garantir que l'usage de la PIT accélère de 50% le temps de traitement des demandes d'aides régionales auprès de WE.
* **Probabilité d'adoption** : **Faible** (sans carotte financière ou obligation).

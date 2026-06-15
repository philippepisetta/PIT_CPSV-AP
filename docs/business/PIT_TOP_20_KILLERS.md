# Les 20 Facteurs d'Échec de la PIT (Red Team Review)

Ce document répertorie de manière brute et objective les 20 risques majeurs de rejet, d'abandon ou d'échec opérationnel de la PIT vNext, accompagnés de leurs probabilités, impacts et mesures d'atténuation.

---

## 🛑 1. Le Syndrome du « Nouvel Outil de Trop »
* **Description** : Les conseillers de pôles et clusters saturent d'outils. L'introduction de la PIT est vécue comme une contrainte administrative supplémentaire inutile.
* **Probabilité** : **Élevée** | **Impact** : **Élevé**
* **Atténuation** : Rendre la saisie automatique via API et interdire la saisie manuelle de rapports Word de performance annuels (la PIT devient l'unique canal de reporting légal).

## 🛑 2. La Résistance Active des Pôles (Compétition Budgétaire)
* **Description** : Les pôles refusent de partager leurs portefeuilles de membres par peur que des pôles concurrents (ex. BioWin vs GreenWin sur la biopharma) ne capturent leurs prospects R&D.
* **Probabilité** : **Élevée** | **Impact** : **Élevé**
* **Atténuation** : Garantir par design technique le masquage des opportunités précoces et des prospects. Seule la donnée finale d'outcome validé est consolidée.

## 🛑 3. Le Doublon avec les CRMs Existants (Salesforce WE / Pôles)
* **Description** : Rejet de la PIT sous prétexte qu'elle fait doublon avec Salesforce. WE et les grands pôles refusent de payer pour une double maintenance.
* **Probabilité** : **Élevée** | **Impact** : **Élevé**
* **Atténuation** : Connecter la PIT en tant que couche sémantique de fédération de données, sans jamais chercher à remplacer la gestion transactionnelle ou commerciale interne de Salesforce.

## 🛑 4. L'Absence d'Obligation d'Usage par le SPW
* **Description** : Si le SPW continue de valider les subventions de fonctionnement des pôles sur la base de rapports PDF classiques, personne n'utilisera la PIT.
* **Probabilité** : **Élevée** | **Impact** : **Critique**
* **Atténuation** : Lier contractuellement le versement des tranches de subventionnement S3 à la validation de la donnée et des preuves (Evidences) dans la PIT.

## 🛑 5. Le Rejet des Entreprises (Bénéficiaires)
* **Description** : Les PMEs refusent de créer un profil supplémentaire et de déclarer leurs faiblesses techniques (NIS2 non conforme, retard IA) sur une plateforme publique.
* **Probabilité** : **Élevée** | **Impact** : **Moyen**
* **Atténuation** : Masquer totalement les fiches d'entreprises individuelles du grand public. Offrir une carotte financière (ex. bonus de 10% sur les aides ou traitement prioritaire en 48h).

## 🛑 6. La Faible Qualité des Données (Graphe Obsolète)
* **Description** : Les données ne sont pas mises à jour par les conseillers après le lancement initial. Le graphe devient obsolète en 6 mois, perdant toute crédibilité.
* **Probabilité** : **Élevée** | **Impact** : **Élevé**
* **Atténuation** : Mettre en place des alertes automatiques et des tâches de validation périodiques forçant la vérification de la donnée pour maintenir le statut « Certifié ».

## 🛑 7. La Complexité Sémantique (Usine à Gaz pour Décideurs)
* **Description** : Le modèle technique (CPSV-AP, URI, RDF, Graphes) est trop complexe pour les DGs et Cabinets, qui le rejettent au profit de graphiques Power BI simples.
* **Probabilité** : Moyenne | **Impact** : **Élevé**
* **Atténuation** : Cacher la complexité sémantique. L'utilisateur ne voit que des KPI Headers clairs, des feux tricolores (Vert/Orange/Rouge) et des pipelines de chaînes de valeur intuitifs.

## 🛑 8. L'Instabilité Politique (Changement de S3)
* **Description** : Une nouvelle coalition politique redéfinit les priorités S3, rendant les roadmaps implémentées caduques.
* **Probabilité** : Moyenne | **Impact** : **Élevé**
* **Atténuation** : S'assurer que le méta-modèle de la PIT permette de re-mapper dynamiquement les projets et outcomes vers de nouveaux objectifs gouvernementaux en quelques clics.

## 🛑 9. L'Effet « Big Brother » du Cabinet Ministériel
* **Description** : La transparence totale de la PIT révèle en direct les retards ou inefficacités de certains investissements publics, effrayant le cabinet qui préfère étouffer l'outil.
* **Probabilité** : Moyenne | **Impact** : **Critique**
* **Atténuation** : Créer un espace de pré-validation politique permettant de modérer et d'expliquer les gaps territoriaux avant leur affichage public.

## 🛑 10. Le Risque d'Usure des Conseillers (Fatigue IT)
* **Description** : Les conseillers de terrain démissionnent de leur rôle de validateur d'Evidence car ils ne se perçoivent pas comme des contrôleurs administratifs.
* **Probabilité** : **Élevée** | **Impact** : Moyenne
* **Atténuation** : Simplifier l'interface d'audit de preuve (validation en 1 clic depuis le mobile).

## 🛑 11. Le Manque de Ressources Internes pour la Maintenance IT
* **Description** : Le projet s'arrête dès que le prestataire externe d'origine termine son contrat de développement, par manque d'expertise sémantique interne au SPW.
* **Probabilité** : Moyenne | **Impact** : **Élevé**
* **Atténuation** : Standardiser le code (Next.js/Express) et documenter l'architecture pour permettre une reprise par les équipes de l'Agence du Numérique (AdN).

## 🛑 12. Les Blocages de Confidentialité Juridique (GDPR & IP)
* **Description** : Les délégués à la protection des données (DPO) bloquent l'interconnexion des bases d'entreprises sous prétexte de conformité GDPR.
* **Probabilité** : Moyenne | **Impact** : **Élevé**
* **Atténuation** : Ne stocker aucune donnée personnelle sensible d'employés. Anonymiser les fiches techniques des PMEs non partagées en consortium.

## 🛑 13. Le Décalage de ROI (Rentabilité trop tardive)
* **Description** : Le Cabinet Ministériel coupe les budgets de la PIT après 12 mois car aucun emploi n'a encore été créé directement grâce à l'outil.
* **Probabilité** : Moyenne | **Impact** : **Élevé**
* **Atténuation** : Communiquer massivement sur les "Quick Wins" administratifs (ex. réduction du temps de diagnostic, détection immédiate de gaps) dès le mois 3.

## 🛑 14. La Résistance de Wallonie Entreprendre (WE)
* **Description** : WE refuse de connecter ses bases de données d'aides financières et d'investissements par crainte d'ingérence politique du SPW ou d'autres cabinets.
* **Probabilité** : Moyenne | **Impact** : **Élevé**
* **Atténuation** : Limiter la connexion de WE aux financements publics de R&D (ex. appels à projets) en excluant totalement les prises de participation en capital privées.

## 🛑 15. Le Conflit d'Interopérabilité avec l'Europe (EDIH vs PIT)
* **Description** : Les exigences de reporting EDIH européen changent radicalement, rendant le module DR-BEST wallon obsolète ou incompatible.
* **Probabilité** : Moyenne | **Impact** : Moyenne
* **Atténuation** : Maintenir un alignement permanent avec le Centre Commun de Recherche (JRC) de la Commission européenne.

## 🛑 16. La Bureaucratisation du Processus de Preuve (Evidence)
* **Description** : Exiger trop de justificatifs physiques pour valider un simple indicateur bloque les projets et décourage les bénéficiaires.
* **Probabilité** : Moyenne | **Impact** : Moyenne
* **Atténuation** : N'exiger des preuves (rapports officiels) que pour les étapes clés à fort impact budgétaire (ex. obtention de brevet, certification CE).

## 🛑 17. L'Absence de Chef de File Opérationnel (Orphelinat du Graphe)
* **Description** : Personne ne se sent responsable de la qualité globale du Knowledge Graph Territorial. La donnée dépérit.
* **Probabilité** : Moyenne | **Impact** : **Élevé**
* **Atténuation** : Nommer un "Garant du Graphe" (Data Steward) officiel au sein du SPW ou de l'Agence du Numérique.

## 🛑 18. Le Coût d'Intégration IT sous-estimé chez les Partenaires
* **Description** : Les pôles n'ont pas le budget interne pour développer les connecteurs d'API avec leurs propres bases, bloquant l'alimentation automatique.
* **Probabilité** : **Élevée** | **Impact** : Moyenne
* **Atténuation** : Fournir un kit d'intégration open-source standard et allouer une enveloppe d'aide IT unique pour chaque pôle pilote.

## 🛑 19. La Dérive de Périmètre (Scope Creep)
* **Description** : Les utilisateurs demandent d'ajouter des modules de facturation, de gestion d'événements ou de messagerie, surchargeant et tuant la clarté du produit.
* **Probabilité** : Moyenne | **Impact** : Moyenne
* **Atténuation** : Sanctuariser le méta-modèle stabilisé actuel. Refuser tout développement hors périmètre Knowledge Graph et Recommandation.

## 🛑 20. La Bulle de Storytelling (Déception Post-Démonstration)
* **Description** : La démo est magnifique (WOW UX), mais l'usage réel s'avère décevant car la base de données réelle est vide ou mal qualifiée après le lancement.
* **Probabilité** : **Élevée** | **Impact** : **Élevé**
* **Atténuation** : Lancer le pilote avec un jeu de données réel restreint mais 100% qualifié (EDIH) plutôt qu'un grand lancement sur un graphe vide.

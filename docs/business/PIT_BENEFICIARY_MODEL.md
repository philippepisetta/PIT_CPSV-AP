# Modèle Métier — Bénéficiaire Territorial (Beneficiary First)

Ce document décrit le modèle d'objet unifié mettant le **Bénéficiaire** au centre du dispositif de la PIT Wallonie (vNext).

## 1. Vision "Beneficiary First"

Historiquement, plusieurs écrans et démonstrateurs de la PIT faisaient référence à l'entité "Entreprise". Cependant, la réalité de l'accompagnement public en Wallonie montre qu'un pôle de compétitivité ou un EDIH accompagne une diversité de structures.

Le modèle unifié remplace toute référence exclusive à l'entreprise par le concept élargi de **Bénéficiaire**, qui couvre l'ensemble des acteurs éligibles à l'aide publique.

---

## 2. Typologie des Bénéficiaires (beneficiaryType)

Le champ `beneficiaryType` est ajouté au modèle pour classifier la nature juridique et opérationnelle du bénéficiaire. Les valeurs autorisées sont :

| Code | Label UI | Description |
| :--- | :--- | :--- |
| **ENTREPRISE** | Entreprise | Société commerciale établie (TPE, PME, Grande Entreprise). |
| **STARTUP** | Startup | Jeune entreprise innovante à forte croissance. |
| **UNIVERSITE** | Université | Institution académique d'enseignement et de recherche. |
| **CENTRE_RECHERCHE** | Centre de Recherche | Centre de recherche agréé (CRA, Sirris, CETIC, etc.). |
| **ECOLE** | École | Établissement d'enseignement primaire, secondaire ou supérieur non universitaire. |
| **EPN** | EPN (Espace Public Numérique) | Structure locale d'accès au numérique. |
| **ASBL** | ASBL / Association | Association sans but lucratif ou collectif citoyen. |
| **ADMINISTRATION** | Administration | Organisme d'administration publique régionale ou fédérale. |
| **COMMUNE** | Commune / Ville | Administration communale locale. |
| **PARTENAIRE_PUBLIC** | Partenaire Public | Opérateur public d'animation territoriale (EDIH, Pôle, Intercommunale). |
| **AUTRE** | Autre Organisation | Structure non classifiable dans les catégories précédentes. |

---

## 3. Vue 360° du Bénéficiaire

Afin de procurer au conseiller une vision intégrale de la structure, la fiche **Bénéficiaire 360** regroupe les éléments transversaux suivants :

* **Nom & Identité** : Dénomination officielle, numéro BCE, adresse et territoire d'appartenance.
* **Type de bénéficiaire** : Classification typée (ex: STARTUP).
* **Source System & Sync** : Métadonnées d'interopérabilité indiquant d'où provient la donnée (Salesforce, DMAT, BCE) et sa dernière date de synchronisation.
* **Statut** : Statut opérationnel (`ACTIVE`, `ARCHIVED`).
* **Contacts** : Liste des points de contact avec indication du contact principal et du type de contact (Opérationnel, Technique, etc.).
* **Memberships** : Cercles sectoriels d'animation auxquels le bénéficiaire adhère, et son contexte d'adhésion (COMMUNITY, CLUSTER, POLE, etc.).
* **Parcours** : Diagnostics de maturité et parcours de transformation (DMAT, NIS2) dans lesquels le bénéficiaire est engagé.
* **Services** : Récapitulatif des livraisons de services publics individuels reçus par le bénéficiaire.
* **Activités** : Historique des participations aux ateliers collectifs, formations et séances de matchmaking.
* **Financements** : Liste des aides financières obtenues ou mobilisées.
* **Projets** : Projets de R&D collaboratifs ou individuels en cours ou terminés.
* **Outcomes** : Impacts quantitatifs et qualitatifs mesurés (emplois créés, réduction de CO₂, pilotes IA déployés).

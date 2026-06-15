# CADRE D'ÉVALUATION DES POLITIQUES PUBLIQUES (POLICY EVALUATION) – PIT

Ce document décrit l'intégration des concepts de gouvernance publique et d'évaluation d'impact au sein du modèle sémantique de la **Plateforme d'Intégration Territoriale (PIT) Wallonie**. Il formalise le lignage complet reliant la vision politique d'un cabinet jusqu'à la preuve physique d'un résultat sur le terrain.

---

## 🎯 1. NOUVEAUX CONCEPTS D'INTERVENTION ET D'ÉVALUATION

Pour unifier et modéliser l'évaluation d'impact des politiques wallonnes, la PIT introduit les quatre concepts suivants :

### A. INTERVENTIONFRAMEWORK
Le cadre de politique publique globale ou le plan stratégique de référence.
*   *Exemples* : S3 Wallonie, Plan de Relance de la Wallonie (PRW), Green Deal européen.

### B. INTERVENTIONNODE
Une structure d'arbre récursive unifiée pour représenter n'importe quelle hiérarchie de décision publique (sans multiplier les tables rigides). Un node possède un `type` (Priorité, Objectif, Mesure, Initiative, Action) et pointe vers son `parentNode` :
1.  **Priorité (Priority)** : Orientation politique majeure.
2.  **Objectif (Objective)** : Cible quantitative ou qualitative.
3.  **Mesure (Measure)** : Enveloppe budgétaire ou axe d'action.
4.  **Initiative** : Dispositif opérationnel (ex: Appel à projets).
5.  **Action / Service** : L'unité de prestation sur le terrain.

### C. INDICATOR (Indicateur)
La métrique de performance ou d'impact définie pour évaluer la complétion d'un objectif de politique publique.
*   *Exemples* : Nombre d'entreprises digitalisées, ETP créés, tonnes de CO2 économisées.

### D. EVIDENCE (Preuve physique)
Le document physique, rapport ou livrable officiel téléversé par l'opérateur de terrain pour justifier la réalisation d'un service et valider la valeur d'un indicateur.
*   *Exemples* : Rapport de diagnostic cybersécurité en PDF, attestation d'éco-conception signée, capture d'écran de l'algorithme IA opérationnel.

---

## 🔗 2. CASCADE COMPLÈTE DE LA POLITIQUE PUBLIQUE À LA PREUVE

La boucle de rétroaction complète de la PIT relie les dimensions politiques et opérationnelles :

```
[Priorité S3 / Plan de Relance (InterventionNode L1)]
       │
       ▼
[Objectif (InterventionNode L2)]
       │
       ▼
[Mesure (InterventionNode L3)]
       │
       ▼
[Initiative / Appel (InterventionNode L4)]
       │
       ▼
[Action / Service du Catalogue (InterventionNode L5)]
       │
       ▼ (Déclenche)
[Challenge (Besoin entreprise)]
       │
       ▼ (Recommandé dans)
[Funding / Projet collaboratif]
       │
       ▼ (Génère)
[Outcome (Résultat de l'accompagnement)]
       │
       ▼ (Évalué par)
[Indicator (Métrique)] ◄─── (Prouvé par) ─── [Evidence (PDF/Rapport)]
       │
       ▼ (Cumulé dans)
[Strategic Contribution (Axe régional)]
```

*Cette cascade permet de prouver en un clic à la Commission Européenne ou au Parlement Wallon la légitimité d'une subvention publique, en remontant du livrable audité jusqu'à l'axe politique d'origine.*

---

## 📊 3. DÉMONSTRATION DANS LES 5 USE CASES DE CLUSTERS

Chaque use case présente désormais le lignage complet :

### Use Case 1 : BioWin (Santé Connectée)
*   **Priorité (L1)** : Développer la médecine préventive et de précision.
*   **Objectif (L2)** : Améliorer de 20% la détection précoce des cancers d'ici 2028.
*   **Mesure (L3)** : Axe de financement des technologies biomédicales (FEDER).
*   **Initiative (L4)** : Appel à projets "Santé Numérique 2026".
*   **Action / Service (L5)** : Coaching réglementaire de certification médicale.
*   **Challenge** : Homologation clinique de logiciels IA d'imagerie.
*   **Funding & Project** : Projet collaboratif "MedTech IA Image".
*   **Outcome** : Modèle de détection des tumeurs validé cliniquement.
*   **Indicator** : Nombre d'outils médicaux IA certifiés (Valeur : 1).
*   **Evidence** : `validation_report_chu_liege.pdf` (Rapport clinique signé).
*   **Strategic Contribution** : Contribution S3 Santé et Digital Europe.

### Use Case 2 : Logistics in Wallonia (Fret Décarboné)
*   **Priorité (L1)** : Transport et logistique durables.
*   **Objectif (L2)** : Réduire les émissions du transport de fret de 15% d'ici 2030.
*   **Mesure (L3)** : Plan de décarbonation du transport routier.
*   **Initiative (L4)** : Appel d'offres "Smart Logistique Wallonie".
*   **Action / Service (L5)** : Audit d'optimisation de flotte Tremplin IA.
*   **Challenge** : Surconsommation de carburant des camions de LogiTrans.
*   **Funding & Project** : Consortium "LogiTrans Optimisation IA".
*   **Outcome** : Algorithme d'optimisation de tournées déployé.
*   **Indicator** : Émission de CO2 évitée (Valeur : 110t / an).
*   **Evidence** : `fuel_consumption_report_2026.pdf` (Rapport de consommation audité).
*   **Strategic Contribution** : Contribution Plan de Relance et Digital Wallonia.

### Use Case 3 : GreenWin (Plastiques Circulaires)
*   **Priorité (L1)** : Souveraineté des matériaux et économie circulaire.
*   **Objectif (L2)** : Réintégrer 30% de matières plastiques recyclées dans l'industrie locale.
*   **Mesure (L3)** : Programme Circular Wallonia - Emballages.
*   **Initiative (L4)** : Guichet d'aides à l'éco-conception.
*   **Action / Service (L5)** : Coaching technique en éco-conception de matériaux.
*   **Challenge** : Remplacement des polymères vierges de BioPlast SA.
*   **Funding & Project** : Subside Circular Wallonia.
*   **Outcome** : Spécification technique d'emballage 100% recyclable.
*   **Indicator** : Plastique vierge économisé (Valeur : 120t / an).
*   **Evidence** : `polymer_test_report_sirris.pdf` (Fiche technique laboratoire).
*   **Strategic Contribution** : Contribution Circular Wallonia et Green Deal.

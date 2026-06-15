# MÉCANISMES DE MESURE, D'ÉVALUATION ET D'AGRÉGATION D'IMPACTS – PIT

Ce document décrit les règles et logiques d'intégration, de validation et de consolidation des indicateurs d'impact territoriaux au sein de la **Plateforme d'Intégration Territoriale (PIT) Wallonie**.

---

## 📊 1. MÉCANISMES DE MESURE (MEASUREMENT)

Chaque réalisation de service ou projet collaboratif produit des résultats opérationnels qualifiés d'**Outcomes**. Ces résultats sont traduits en indicateurs d'impact (**Indicators**) mesurés de deux façons :

### A. MESURE QUANTITATIVE (IMPACT NUMÉRIQUE)
*   **Valeur numérique** : Stockage de valeurs décimales (ex: `120` tonnes de CO2, `350 000` € levés, `+3` ETPs).
*   **Maturité Delta (DMAT)** : Mesure de l'évolution de la maturité d'une PME sur les 5 axes (Digital, IA, Cyber, Export, Durabilité) entre l'état initial (ex: 1/5) et l'état final (ex: 3/5). Le delta calculé est de `+2`.

### B. MESURE QUALITATIVE (VALEURS TEXTUELLES & STATUTS)
*   **Preuve textuelle** : Descriptif textuel du résultat validé (ex: *"Charte d'éco-conception d'emballages en plastique recyclé rédigée et validée par le comité technique"*).
*   **Statut d'étape** : Complétion réussie d'une phase clé de transition (ex: *"Diagnostic complété"* ou *"Certification clinique obtenue"*).

---

## 🔍 2. PROCESSUS D'ÉVALUATION ET DE VALIDATION (EVALUATION)

Pour garantir la fiabilité et la traçabilité des impacts territoriaux, les indicateurs suivent un cycle de validation strict fondé sur la preuve de résultat :

```
[1. Encodage Outcome par l'Opérateur] ➔ [2. Téléversement de l'Evidence (PDF/Rapport)]
                                                              │
[4. Intégration dans le Graphe d'Impact] ◄── [3. Validation du Conseiller (Audit)]
```

1.  **Saisie de l'Outcome** : Le conseiller d'accompagnement ou l'opérateur technique déclare le résultat de sa prestation.
2.  **Téléversement de l'Evidence** : Un document preuve (fiche technique de labo, rapport d'audit, attestation signée) est rattaché à l'indicateur. Le statut de l'Evidence est alors **PENDING** (En attente).
3.  **Audit / Validation** : Le chargé de mission du pôle (Animateur) ou le coordinateur du programme vérifie l'Evidence. Il valide le statut :
    *   **APPROVED** : L'impact est validé et consolidé dans la base de données.
    *   **REJECTED** : L'impact n'est pas pris en compte, une demande de correction est renvoyée à l'opérateur.

---

## 📈 3. RÈGLES D'AGRÉGATION DE L'OPERATIONNEL AU STRATÉGIQUE (AGGREGATION)

Pour éviter toute saisie manuelle au niveau de la Direction Générale ou des Cabinets, les indicateurs d'impact s'agrègent automatiquement le long de l'arbre stratégique des **InterventionNodes** :

```
[Outcomes Validés des Projets (Terrain)]
                 │
                 ▼ (Règles d'agrégation de maillons)
[Indicateurs des Roadmaps Opérationnelles]
                 │
                 ▼ (Consolidation sectorielle)
[Indicateurs des Thèmes Stratégiques]
                 │
                 ▼ (Agrégation Politique Publique)
[Cockpit Global des Cadres Stratégiques (S3 / Plan de Relance)]
```

### LES TROIS LOGIQUES D'AGRÉGATION D'IMPACT :

| Type d'agrégation | Formule mathématique | Exemple d'indicateur |
| :--- | :--- | :--- |
| **Somme Cumulative (SUM)** | $\sum X_i$ | Budgets mobilisés (€), CO2 économisé (tonnes), Emplois créés (ETP), Matières vierges économisées (tonnes). |
| **Moyenne Pondérée (AVG)** | $\frac{\sum X_i}{N}$ | Taux de satisfaction client, Amélioration de l'indice de maturité digitale (Delta moyen). |
| **Dénombrement (COUNT)** | Nombre d'entités distinctes | Nombre de PMEs accompagnées, Nombre de consortiums créés, Nombre de brevets déposés. |

---

## 📈 4. APPLICATION AUX 5 USE CASES

Les impacts opérationnels de chaque pôle se consolident automatiquement dans les cockpits exécutifs respectifs :

*   **BioWin (Santé)** :
    *   *Opérationnel* : Certification du MVP de MedTech Namur (1 evidence approuvée).
    *   *Agrégation* : Incrémente de `+1` le KPI *"Nombre d'outils médicaux IA certifiés"* de la Roadmap e-Santé et de la S3 Santé.
*   **Logistics in Wallonia (Transport)** :
    *   *Opérationnel* : 110 tonnes de CO2 économisées par LogiTrans (evidence approuvée).
    *   *Agrégation* : Cumulé dans le KPI *"Tonnes de CO2 évitées"* du Portefeuille Fret Vert du Plan de Relance.
*   **GreenWin (Économie Circulaire)** :
    *   *Opérationnel* : 120 tonnes de plastique vierge économisées par BioPlast.
    *   *Agrégation* : Cumulé dans les KPIs de la priorité *"Circular Wallonia - Plastiques"*.

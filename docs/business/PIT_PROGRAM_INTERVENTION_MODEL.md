# Modèle d'Intervention des Programmes – PIT vNext

Ce document décrit le modèle d'intervention hiérarchique et le mécanisme d'évaluation stratégique reliant les politiques publiques de la Wallonie (S3, Plan de Relance, etc.) aux résultats opérationnels de terrain.

---

## 🏛️ 1. Structure Hiérarchique de l'Intervention Public

Le modèle de pilotage de la PIT s'organise en cascade descendante de la vision politique globale jusqu'aux actions opérationnelles :

```
[Program / Programme] (ex. Plan de Relance Wallon, S3 Régionale)
        ↓
[Priority / Priorité] (ex. Priorité 1 : Transition Hydrogène Vert)
        ↓
[Initiative / Initiative] (ex. Initiative Innovation Décarbonation)
        ↓
[Action / Action] (ex. Appel à projets Métallurgie Bas Carbone)
        ↓
[Service / Service] (ex. Accompagnement technique Sirris / Sirris 700 bars test)
```

### Définitions du Métamodèle :
1. **Program (Programme)** : Cadre pluriannuel d'action publique doté d'un budget global et d'un porteur politique. Mappé sur le modèle `Program` de la base de données.
2. **Priority (Priorité)** : Axe stratégique du programme (ex. Digitalisation, Éco-conception). Mappé sur `StrategicPriority`.
3. **Initiative (Initiative)** : Dispositif opérationnel regroupant des moyens techniques et des consortiums d'acteurs. Mappé sur `Initiative`.
4. **Action (Action)** : L'événement ou l'appel public déclencheur mobilisant les entreprises (ex. un appel à propositions Horizon Europe, un atelier thématique). Mappé sur `Action` ou `Activity`.

---

## 📈 2. Lignage Opérationnel vers l'Impact (Outcomes & Evidences)

L'évaluation d'une politique ne se fait pas par simple comptabilité budgétaire, mais en traçant le lignage sémantique de l'action jusqu'à la preuve d'impact :

1. **L'Action** finance un **Projet** collaboratif de R&D issu d'un **Consortium** d'acteurs.
2. Le **Projet** consomme des **Services** publics (CPSV-AP) délivrés par les pôles ou clusters.
3. Le projet produit des résultats quantifiables ou qualitatifs (**Outcomes**).
4. Chaque résultat marquant fait l'objet d'un justificatif certifié (une **Evidence**, ex. rapport clinique, brevet, certificat carbone).
5. Une fois l'Evidence auditée et validée (*status: APPROVED*), le système calcule une **StrategicContribution** associée à un objectif du programme.
6. La contribution stratégique met à jour instantanément les indicateurs du **Cockpit DG Exécutif** de manière transparente et infalsifiable.

---

## 📊 3. Exemples d'Intervention par Programme

### Scénario A : Plan de Relance Wallon (PRW)
* **Program** : Plan de Relance de la Wallonie (PRW).
* **Priority** : Axe 3 - Transition environnementale et énergétique.
* **Initiative** : Initiative d'Innovation Stratégique (IIS) Hydrogène.
* **Action** : Appel à propositions "Stockage Hydrogène 2026".
* **Service associé** : Plateforme d'essais haute pression 700 bars (Sirris).
* **Projet financé** : Projet *HydroSeraing* (John Cockerill & Sirris).
* **Outcome** : Réservoir 700 bars certifié étanche.
* **Evidence** : Attestation technique Sirris (APPROVED).
* **Strategic Contribution** : +1 technologie de stockage hydrogène validée sur le territoire wallon.

### Scénario B : S3 Wallonie (Santé & BioWin)
* **Program** : Smart Specialisation Strategy (S3) Wallonie.
* **Priority** : Priorité 1 - Santé et Sciences du vivant.
* **Initiative** : Dispositif e-Santé et Intelligence Artificielle.
* **Action** : Appel Innovation Clinique Santé 2026.
* **Service associé** : Diagnostic IA Clinique (BioWin / CHU Liège).
* **Projet financé** : Projet *MedTech IA Imagerie*.
* **Outcome** : Certification logicielle MDR classe IIa obtenue.
* **Evidence** : Rapport d'homologation réglementaire (APPROVED).
* **Strategic Contribution** : +1 outil d'IA médicale certifié conforme S3.

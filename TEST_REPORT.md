# TEST REPORT – PIT QUALITY AGENT

**Date de l'audit** : 13/06/2026 16:12:50  
**Cible de l'audit** : [http://localhost:3000](http://localhost:3000)  
**Score global de conformité** : **64/100**

---

## Synthèse des Scores

| Composant | Score | Statut |
| :--- | :---: | :---: |
| **Global PIT Compliance** | **64%** | ⚠ WARNING |
| **Interface Utilisateur (UI)** | **84%** | ⚠ WARNING |
| **Endpoints API v2** | **100%** | ✓ PASS |
| **Cockpits & Données** | **71%** | ⚠ WARNING |
| **Modèle Sémantique PIT** | **0%** | ✗ FAIL |

---

## Rapport Détaillé de l'Interface (UI)

| Route | Statut | Latence | Layout PIT | Eléments | Remarque / Erreur |
| :--- | :---: | :---: | :---: | :---: | :--- |
| `/` | ✓ PASS | 71ms | Oui | 0 | Visite réussie  |
| `/programs` | ✓ PASS | 63ms | Oui | 10 | Visite réussie  |
| `/projects` | ⚠ WARN | 62ms | Oui | 0 | Page 404  |
| `/actions` | ⚠ WARN | 53ms | Oui | 0 | Page 404  |
| `/activities` | ✓ PASS | 60ms | Oui | 0 | Visite réussie  |
| `/challenges` | ⚠ WARN | 56ms | Oui | 0 | Page 404  |
| `/capabilities` | ⚠ WARN | 53ms | Oui | 0 | 0 résultat affiché  |
| `/services` | ⚠ WARN | 72ms | Oui | 33 | Erreurs console détectées (20 err console) |
| `/journeys` | ✓ PASS | 48ms | Oui | 46 | Visite réussie  |
| `/beneficiaries` | ✓ PASS | 55ms | Oui | 10 | Visite réussie  |
| `/organizations` | ✓ PASS | 63ms | Oui | 0 | Visite réussie  |
| `/territories` | ✓ PASS | 76ms | Oui | 0 | Visite réussie  |
| `/ecosystems` | ✓ PASS | 59ms | Oui | 5 | Visite réussie  |
| `/s3` | ✓ PASS | 53ms | Oui | 4 | Visite réussie  |
| `/drbest` | ✓ PASS | 53ms | Oui | 0 | Visite réussie  |
| `/graph` | ✓ PASS | 68ms | Oui | 0 | Visite réussie  |

---

## Rapport Détaillé des Endpoints API v2

| Endpoint | Statut HTTP | Latence | Taille Payload | Objets | Résultat |
| :--- | :---: | :---: | :---: | :---: | :--- |
| `/api/v2/programs` | 200 | 188ms | 5.0 KB | 10 | ✓ OK |
| `/api/v2/capabilities` | 200 | 36ms | 0.0 KB | 0 | ✓ OK |
| `/api/v2/services` | 200 | 97ms | 5.7 KB | 10 | ✓ OK |
| `/api/v2/journeys` | 200 | 91ms | 1.8 KB | 5 | ✓ OK |
| `/api/v2/beneficiaries` | 200 | 113ms | 8.1 KB | 10 | ✓ OK |
| `/api/v2/ecosystems` | 200 | 68ms | 1.7 KB | 5 | ✓ OK |
| `/api/v2/s3-domains` | 200 | 90ms | 2.1 KB | 6 | ✓ OK |

---

## Alignements Sémantiques Métier (Attentes PIT)

### 1. Program Chain (Program ➔ Project ➔ Action ➔ Activity)
* **Statut** : ✗ FAIL
* **Message** : Activité finale manquante ou non visible dans l'arborescence.
* **Étapes de validation** :
  - Visite de la page /programs
  - Sélection du premier programme: "PROG-CHEQUESChèques Entreprises"
  - Ouverture de l'onglet 'Hiérarchie S3'
  - Développement du premier Projet
  - Développement de la première Action

### 2. Service Chain (Challenge ➔ Capability ➔ Service ➔ Journey ➔ Beneficiary)
* **Statut** : ✗ FAIL
* **Message** : Éléments manquants dans la chaîne : Challenge, Capability, Journey
* **Étapes de validation** :
  - Visite de la page /beneficiaries
  - Sélection du premier bénéficiaire: "BCEAgroFood Wallonia"
  - Ouverture de l'onglet 'Parcours PIT'

---

*Généré automatiquement par l'Agent Testeur Permanent PIT.*

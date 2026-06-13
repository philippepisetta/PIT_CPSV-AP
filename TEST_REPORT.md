# TEST REPORT – PIT QUALITY AGENT

**Date de l'audit** : 13/06/2026 12:16:52  
**Cible de l'audit** : [https://pit-cpsv-ap.vercel.app](https://pit-cpsv-ap.vercel.app)  
**Score global de conformité** : **44/100**

---

## Synthèse des Scores

| Composant | Score | Statut |
| :--- | :---: | :---: |
| **Global PIT Compliance** | **44%** | ✗ FAIL |
| **Interface Utilisateur (UI)** | **88%** | ✓ PASS |
| **Endpoints API v2** | **0%** | ✗ FAIL |
| **Cockpits & Données** | **86%** | ✓ PASS |
| **Modèle Sémantique PIT** | **0%** | ✗ FAIL |

---

## Rapport Détaillé de l'Interface (UI)

| Route | Statut | Latence | Layout PIT | Eléments | Remarque / Erreur |
| :--- | :---: | :---: | :---: | :---: | :--- |
| `/` | ✓ PASS | 142ms | Oui | 0 | Visite réussie  |
| `/programs` | ✓ PASS | 38ms | Oui | 5 | Visite réussie  |
| `/projects` | ⚠ WARN | 77ms | Oui | 0 | Page 404  |
| `/actions` | ⚠ WARN | 35ms | Oui | 0 | Page 404  |
| `/activities` | ✓ PASS | 37ms | Oui | 0 | Visite réussie  |
| `/challenges` | ⚠ WARN | 37ms | Oui | 0 | Page 404  |
| `/capabilities` | ✓ PASS | 114ms | Oui | 5 | Visite réussie  |
| `/services` | ✓ PASS | 42ms | Oui | 10 | Visite réussie  |
| `/journeys` | ⚠ WARN | 41ms | Oui | 0 | 0 résultat affiché  |
| `/beneficiaries` | ✓ PASS | 49ms | Oui | 6 | Visite réussie  |
| `/organizations` | ✓ PASS | 235ms | Oui | 0 | Visite réussie  |
| `/territories` | ✓ PASS | 126ms | Oui | 0 | Visite réussie  |
| `/ecosystems` | ✓ PASS | 41ms | Oui | 5 | Visite réussie  |
| `/s3` | ✓ PASS | 39ms | Oui | 4 | Visite réussie  |
| `/drbest` | ✓ PASS | 46ms | Oui | 0 | Visite réussie  |
| `/graph` | ✓ PASS | 40ms | Oui | 0 | Visite réussie  |

---

## Rapport Détaillé des Endpoints API v2

| Endpoint | Statut HTTP | Latence | Taille Payload | Objets | Résultat |
| :--- | :---: | :---: | :---: | :---: | :--- |
| `/api/v2/programs` | 404 | 242ms | 0.0 KB | 0 | ✗ FAIL (HTTP Status 404) |
| `/api/v2/capabilities` | 404 | 209ms | 0.0 KB | 0 | ✗ FAIL (HTTP Status 404) |
| `/api/v2/services` | 404 | 135ms | 0.0 KB | 0 | ✗ FAIL (HTTP Status 404) |
| `/api/v2/journeys` | 404 | 161ms | 0.0 KB | 0 | ✗ FAIL (HTTP Status 404) |
| `/api/v2/beneficiaries` | 404 | 125ms | 0.0 KB | 0 | ✗ FAIL (HTTP Status 404) |
| `/api/v2/ecosystems` | 404 | 140ms | 0.0 KB | 0 | ✗ FAIL (HTTP Status 404) |
| `/api/v2/s3-domains` | 404 | 141ms | 0.0 KB | 0 | ✗ FAIL (HTTP Status 404) |

---

## Alignements Sémantiques Métier (Attentes PIT)

### 1. Program Chain (Program ➔ Project ➔ Action ➔ Activity)
* **Statut** : ✗ FAIL
* **Message** : Onglet 'Hiérarchie S3' introuvable dans les détails du programme.
* **Étapes de validation** :
  - Visite de la page /programs
  - Sélection du premier programme: "Programme inconnu"

### 2. Service Chain (Challenge ➔ Capability ➔ Service ➔ Journey ➔ Beneficiary)
* **Statut** : ✗ FAIL
* **Message** : Onglet 'Parcours PIT' introuvable dans le profil du bénéficiaire.
* **Étapes de validation** :
  - Visite de la page /beneficiaries
  - Sélection du premier bénéficiaire: "Bénéficiaire inconnu"

---

*Généré automatiquement par l'Agent Testeur Permanent PIT.*

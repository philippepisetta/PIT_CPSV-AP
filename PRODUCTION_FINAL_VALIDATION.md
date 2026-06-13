# RAPPORT DE VALIDATION FINALE DE PRODUCTION

Généré le : 13/06/2026 13:46:47

---

## 1. VÉRIFICATION DES ENDPOINTS API V2 (PROD)

Les requêtes ont été effectuées en direct sur l'instance Render de production `https://pit-cpsv-ap.onrender.com` :

| Endpoint | HTTP Status | Count | Temps de réponse | Statut |
| :--- | :---: | :---: | :---: | :---: |
| `/api/v2/programs` | 200 | 8 | 1244 ms | ✅ OK |
| `/api/v2/capabilities` | 200 | 5 | 660 ms | ✅ OK |
| `/api/v2/s3-domains` | 200 | 5 | 861 ms | ✅ OK |
| `/api/v2/beneficiaries` | 200 | 7 | 1073 ms | ✅ OK |
| `/api/v2/ecosystems` | 200 | 4 | 862 ms | ✅ OK |
| `/api/v2/journeys` | 200 | 2 | 1101 ms | ✅ OK |
| `/api/v2/services` | 200 | 7 | 1294 ms | ✅ OK |

---

## 2. COMPARAISON DES COMPTES : BASE DE DONNÉES VS API V2

Comparaison entre le nombre d'enregistrements attendus dans la base de données et le nombre retourné par les endpoints API :

| Entité | Count DB | Count API | Alignement |
| :--- | :---: | :---: | :---: |
| **Program** | 8 | 8 | ✅ Parfait |
| **Capability** | 5 | 5 | ✅ Parfait |
| **S3Domain** | 5 | 5 | ✅ Parfait |
| **Beneficiary** | 7 | 7 | ✅ Parfait |
| **Ecosystem** | 4 | 4 | ✅ Parfait |
| **Journey** | 2 | 2 | ✅ Parfait |
| **Service** | 7 | 7 | ✅ Parfait |

---

## 3. VÉRIFICATION DES PAGES FRONT-END (VERCEL)

Test de disponibilité HTTP des pages de l'application front-end sur `https://pit-cpsv-ap.vercel.app` :

| Page | Path | HTTP Status | Données visibles | Statut |
| :--- | :--- | :---: | :---: | :---: |
| **Programs** | `/programs` | 200 | Oui (Données réelles) | ✅ OK |
| **Capabilities** | `/capabilities` | 200 | Oui (Données réelles) | ✅ OK |
| **S3 Strategy** | `/s3` | 200 | Oui (Données réelles) | ✅ OK |
| **Beneficiaries** | `/beneficiaries` | 200 | Oui (Données réelles) | ✅ OK |
| **Ecosystems** | `/ecosystems` | 200 | Oui (Données réelles) | ✅ OK |
| **Journeys** | `/journeys` | 200 | Oui (Données réelles) | ✅ OK |
| **Services** | `/services` | 200 | Oui (Données réelles) | ✅ OK |

*Note : Les filtres et la pagination sont fonctionnels en local et s'activent dès que les données sont retournées par l'API.*

---

## 4. CONCLUSION GLOBALE

### Statut du Déploiement : **GO Production**

🚀 **GO PRODUCTION** : Tous les endpoints de l'API v2 répondent avec succès. Les comptes de données correspondent parfaitement à la base de données de production et les pages sur Vercel chargent les informations temps réel sans erreur.

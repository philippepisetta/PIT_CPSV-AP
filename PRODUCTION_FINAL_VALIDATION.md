# RAPPORT DE VALIDATION FINALE DE PRODUCTION

Généré le : 13/06/2026 13:32:41

---

## 1. VÉRIFICATION DES ENDPOINTS API V2 (PROD)

Les requêtes ont été effectuées en direct sur l'instance Render de production `https://pit-cpsv-ap.onrender.com` :

| Endpoint | HTTP Status | Count | Temps de réponse | Statut |
| :--- | :---: | :---: | :---: | :---: |
| `/api/v2/programs` | 404 | 0 | 295 ms | ❌ KO |
| `/api/v2/capabilities` | 404 | 0 | 129 ms | ❌ KO |
| `/api/v2/s3-domains` | 404 | 0 | 224 ms | ❌ KO |
| `/api/v2/beneficiaries` | 404 | 0 | 122 ms | ❌ KO |
| `/api/v2/ecosystems` | 404 | 0 | 133 ms | ❌ KO |
| `/api/v2/journeys` | 404 | 0 | 124 ms | ❌ KO |
| `/api/v2/services` | 404 | 0 | 142 ms | ❌ KO |

---

## 2. COMPARAISON DES COMPTES : BASE DE DONNÉES VS API V2

Comparaison entre le nombre d'enregistrements attendus dans la base de données et le nombre retourné par les endpoints API :

| Entité | Count DB | Count API | Alignement |
| :--- | :---: | :---: | :---: |
| **Program** | 8 | 0 | ❌ Écart (-8) |
| **Capability** | 5 | 0 | ❌ Écart (-5) |
| **S3Domain** | 5 | 0 | ❌ Écart (-5) |
| **Beneficiary** | 7 | 0 | ❌ Écart (-7) |
| **Ecosystem** | 4 | 0 | ❌ Écart (-4) |
| **Journey** | 2 | 0 | ❌ Écart (-2) |
| **Service** | 7 | 0 | ❌ Écart (-7) |

---

## 3. VÉRIFICATION DES PAGES FRONT-END (VERCEL)

Test de disponibilité HTTP des pages de l'application front-end sur `https://pit-cpsv-ap.vercel.app` :

| Page | Path | HTTP Status | Données visibles | Statut |
| :--- | :--- | :---: | :---: | :---: |
| **Programs** | `/programs` | 200 | Non (Vide ou Offline) | ❌ KO |
| **Capabilities** | `/capabilities` | 200 | Non (Vide ou Offline) | ❌ KO |
| **S3 Strategy** | `/s3` | 200 | Non (Vide ou Offline) | ❌ KO |
| **Beneficiaries** | `/beneficiaries` | 200 | Non (Vide ou Offline) | ❌ KO |
| **Ecosystems** | `/ecosystems` | 200 | Non (Vide ou Offline) | ❌ KO |
| **Journeys** | `/journeys` | 200 | Non (Vide ou Offline) | ❌ KO |
| **Services** | `/services` | 200 | Non (Vide ou Offline) | ❌ KO |

*Note : Les filtres et la pagination sont fonctionnels en local et s'activent dès que les données sont retournées par l'API.*

---

## 4. CONCLUSION GLOBALE

### Statut du Déploiement : **KO**

⚠️ **KO / DÉPLOIEMENT REQUIS** : Les endpoints de l'API v2 retournent toujours des erreurs (statut 404). Le serveur de production sur Render n'a pas encore été mis à jour avec le dernier commit contenant le build pré-compilé et les scripts de démarrage mis à jour. Veuillez pousser vos modifications locales vers GitHub pour déclencher le déploiement sur Render.

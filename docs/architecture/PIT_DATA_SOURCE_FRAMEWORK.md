# CADRE DE TRAÇABILITÉ DES SOURCES DE DONNÉES (DATA SOURCE FRAMEWORK)

Ce document décrit le cadre de gouvernance et de provenance des données de la PIT vNext. Il formalise le concept de **System of Record (SoR)** et de **DataSource** pour structurer l'interopérabilité fédérée de la plateforme.

---

## 1. LA PROBLÉMATIQUE DE LA GOUVERNANCE FÉDÉRÉE

La PIT n'est pas un système isolé ; c'est un point d'intégration territorial. Les données y sont importées, synchronisées ou poussées par une multitude d'acteurs de l'écosystème wallon et européen (EDIH, BCE, AWEX, WE, Forem, Supabase, etc.).

Sans traçabilité de la source, la plateforme s'expose à de graves conflits de gouvernance :
* **Conflits de modification** : Un opérateur peut écraser par mégarde une donnée d'identité d'entreprise officiellement fournie par la Banque-Carrefour des Entreprises (BCE).
* **Obsolescence** : Impossibilité de savoir à quand remonte la dernière synchronisation d'un score de maturité DMAT d'un bénéficiaire.
* **Perte d'autorité** : Difficulté à déterminer quel système fait foi en cas de divergence sur le statut d'un projet d'accompagnement.

---

## 2. LE CONCEPT DE SYSTEM OF RECORD (SoR) & DATA SOURCE

Pour garantir la traçabilité de chaque information, la PIT vNext introduit des métadonnées de provenance applicables à toutes les entités du Territorial Knowledge Graph.

### Attributs du modèle de provenance sémantique :
* **`sourceSystem`** (Système émetteur) : Identifie la plateforme d'origine de la donnée.
  * *Exemples* : `BCE`, `DMAT-PORTAL`, `EDIH-CRM`, `WE-APPMANAGER`.
* **`sourceEntityId`** (Identifiant d'origine) : Clé primaire de l'enregistrement dans le système source pour assurer la correspondance lors des synchronisations.
* **`authoritative`** (Autorité de la donnée) : Booléen spécifiant si le système source est l'unique source de vérité (*Source of Truth*). Si `true`, la modification locale de l'entité via l'UI de la PIT est désactivée (lecture seule, mise à jour uniquement par API).
* **`syncStatus`** (Statut de synchronisation) : État du flux d'intégration.
  * *Valeurs* : `SYNCED` (À jour), `STALE` (Obsolète, requiert mise à jour), `FAILED` (Échec de synchro), `LOCAL_ONLY` (Créé localement dans la PIT).
* **`lastSyncDate`** (Dernière synchronisation) : Horodatage du dernier échange réussi.
* **`syncMode`** (Mode de transfert) : `PULL` (Récupéré par la PIT), `PUSH` (Poussé vers la PIT par webhook/API), `MANUAL` (Saisie manuelle).

---

## 3. EXEMPLES DE MAPPING DE SYSTÈMES AUTORITAIRES

| Entité PIT | Système Source (`sourceSystem`) | Fait Autorité (`authoritative`) | Mode d'intégration | Description |
| :--- | :--- | :---: | :---: | :--- |
| **Beneficiary** (Identité) | `BCE` (Banque-Carrefour) | **Oui** | `PULL` (Auto) | Les données de raison sociale, adresse légale et secteur NACE sont verrouillées sur les données officielles de la BCE. |
| **IndicatorValue** (DMAT) | `DMAT-PORTAL` | **Oui** | `PUSH` (Webhook) | Le score de maturité digitale provient de l'outil d'audit officiel européen et ne peut être altéré dans la PIT. |
| **ServiceDelivery** | `EDIH-CRM` | Non | `PUSH` | Les fiches de livraisons de services sont poussées par le CRM EDIH mais peuvent être complétées manuellement par les experts. |
| **InterventionNode** | `WE-PORTAL` | **Oui** | `PULL` | Les programmes financiers de Wallonie Entreprendre sont synchronisés depuis leur système d'octroi de subsides. |

---

## 4. IMPACT TECHNIQUE SUR LES SCHÉMAS PRISMA FUTURS

L'intégration de ces attributs se fera de manière non intrusive, soit par héritage d'un modèle abstrait (si supporté), soit par l'ajout additif d'une relation vers une table de métadonnées de provenance :

```prisma
enum SyncStatus {
  SYNCED
  STALE
  FAILED
  LOCAL_ONLY
}

enum SyncMode {
  PULL
  PUSH
  MANUAL
}

model DataSourceMetadata {
  id               Int            @id @default(autoincrement())
  entityType       String         // ex: Beneficiary, ServiceDelivery, InterventionNode
  entityId         Int
  
  sourceSystem     String         // ex: BCE, DMAT, EDIH
  sourceEntityId   String         // ID dans le système source
  authoritative    Boolean        @default(false)
  syncStatus       SyncStatus     @default(LOCAL_ONLY)
  syncMode         SyncMode       @default(MANUAL)
  lastSyncDate     DateTime?
  
  createdAt        DateTime       @default(now())
  updatedAt        DateTime       @updatedAt

  @@unique([entityType, entityId])
  @@index([sourceSystem, sourceEntityId])
  @@map("datasource_metadata")
}
```
Dans l'application, tout contrôleur d'écriture (mutation Prisma) vérifiera la présence de `DataSourceMetadata` pour l'entité concernée : si `authoritative: true`, l'écriture locale sera rejetée avec un code d'erreur `403 Forbidden - Authoritative System of Record`.

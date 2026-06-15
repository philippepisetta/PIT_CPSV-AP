# USER JOURNEYS (PARCOURS UTILISATEURS) – PIT

Ce document décrit en détail les parcours utilisateurs cibles au sein de la PIT pour chacun des 4 personas principaux, illustrant comment les modules de données collaborent pour guider l'utilisateur de manière fluide.

---

## 📈 PARCOURS 1 : L'ANIMATEUR DE CLUSTER (Exemple : BioWin)
*Objectif : Faire émerger un consortium pour répondre à un défi de santé.*

```
[1. Connexion] ➔ [2. Analyse des défis] ➔ [3. Recherche de partenaires]
                                                        │
[7. Suivi impact] 👤 💾 💻 📊 ⬅ [6. Soumission] ⬅ [5. Financement] ⬅ [4. Consortium]
```

1. **Connexion & Dashboard** : L'animateur de BioWin se connecte sur son **Workspace Animateur**. Il accède à la vue globale de son écosystème "Mon Écosystème".
2. **Analyse des défis émergents** : Il clique sur l'onglet **Défis** (Challenges) et filtre les défis récemment déclarés par les membres de la communauté **IA Santé**. Il identifie un défi récurrent de plusieurs membres : *"Besoin d'analyse de données massives d'imagerie médicale par IA"*.
3. **Recherche de partenaires (Matching)** : L'animateur clique sur le défi pour l'ouvrir. Il accède à la liste des **Capabilities** (Compétences) requises associées à ce défi (ex: Deep Learning, Traitement d'Images, Infrastructures GPU). Il clique sur le bouton **"Trouver des partenaires"**. Le moteur de matching de la PIT analyse l'écosystème et propose :
   * **CHU Liège** (Expertise clinique / Données patients)
   * **UCLouvain** (R&D algorithmique de traitement d'images)
   * **MedTech Namur** (Intégrateur technologique certifié médical)
4. **Création du Consortium** : Depuis les résultats de recommandation, l'animateur clique sur **"Créer un consortium"**. Il sélectionne les 3 membres recommandés, nomme le consortium *"Consortium IA Imagerie Namur-Liège"*, et affecte les rôles de chacun.
5. **Recherche de financement** : L'animateur recherche dans le **Catalogue Territorial / Financements** les appels d'offres en cours. Il associe le consortium à l'opportunité de financement *"Digital Europe - Health AI Call"*.
6. **Soumission & Lancement du projet** : Une fois le projet monté et financé, l'animateur marque le consortium comme **"Accepté"** et génère automatiquement un **Projet** lié à l'opportunité.
7. **Suivi d'impact** : Le projet démarre. L'animateur suit la livraison des livrables sans saisie manuelle. Les outcomes du projet (ex: Algorithme entraîné et certifié) se répercutent automatiquement dans le portefeuille d'innovation.

---

## 💼 PARCOURS 2 : LE CONSEILLER/ACCOMPAGNATEUR (Exemple : EDIH)
*Objectif : Accompagner une PME dans sa transition numérique de A à Z.*

```
[1. Fiche Entreprise] ➔ [2. Diagnostic Maturité] ➔ [3. Recommandation]
                                                            │
[6. Impact territorial] 🏢 🤝 💻 ⬅ [5. Outcome & Preuves] ⬅ [4. Inscription Parcours]
```

1. **Sélection de l'Entreprise** : Le conseiller EDIH ouvre son **Workspace Conseiller** et clique sur la liste des **Entreprises** de son portefeuille. Il sélectionne *"LogiTrans"*.
2. **Diagnostic de Maturité** : Le conseiller et l'entreprise remplissent conjointement le questionnaire de maturité directement dans la PIT. L'algorithme calcule le profil de maturité (ex: Digital: 2/5, Cyber: 1/5, IA: 1/5).
3. **Recommandation de Services** : Sur la base du diagnostic, l'onglet **Recommandations** suggère :
   * Le parcours *"Parcours Transformation Numérique PME"*
   * Le service *"Diagnostic Cyber PME"* (fourni par le CETIC)
   * L'aide *"Chèque Entreprise Cybersécurité"* de Wallonie Entreprendre.
4. **Inscription au Parcours** : Le conseiller inscrit LogiTrans au *"Parcours Transformation Numérique PME"*. L'entreprise reçoit sa feuille de route (Roadmap PME).
5. **Livraison du Service & Outcomes** : Le CETIC effectue le diagnostic de sécurité. Une fois terminé, le conseiller marque la prestation comme **"Délivrée"** et télécharge le rapport de vulnérabilité comme preuve (**Evidence**). L'outcome est enregistré : la maturité Cyber passe de 1 à 3.
6. **Remontée d'Impact** : Cette évolution incrémente automatiquement l'indicateur territorial d'impact de l'EDIH (ex: *"Nombre de PMEs sécurisées"*).

---

## 🏢 PARCOURS 3 : L'ENTREPRISE BÉNÉFICIAIRE (Exemple : BioPlast)
*Objectif : Résoudre un défi opérationnel d'économie circulaire.*

```
[1. Déclaration Défi] ➔ [2. Recommandations] ➔ [3. Demande de Service]
                                                        │
[6. Mesure Impact] 🏢 💻 🔄 ⬅ [5. Projet / Financement] ⬅ [4. Mise en relation]
```

1. **Déclaration du Défi** : L'entreprise BioPlast se connecte sur son **Workspace Entreprise**. Dans l'onglet **Mes Défis**, elle clique sur "Déclarer un défi" et choisit *"Réduction des déchets plastiques de production"*.
2. **Recommandations automatiques** : Instantanément, la PIT affiche les recommandations adaptées à son profil et à ce défi :
   * **Service** : *"Coaching Éco-conception"* (opéré par GreenWin)
   * **Parcours** : *"Parcours Transition Circulaire"*
   * **Financement** : *"Subside Wallonie Entreprendre - Économie Circulaire"*
   * **Partenaire** : *"Centre de recherche Certech"* (expertise en polymères recyclables)
3. **Demande de Service** : BioPlast clique sur *"Demander l'accompagnement Éco-conception"*. La demande est transmise à l'animateur de GreenWin.
4. **Mise en relation & Consortium** : L'animateur de GreenWin valide la demande et suggère de former un consortium avec le *Certech* pour déposer une demande de financement conjointe.
5. **Financement & Projet** : La demande de subvention est approuvée, se traduisant par un projet collaboratif actif sur la PIT.
6. **Résultats** : Le projet permet d'éliminer 25% de pertes de plastique. Le résultat est enregistré, valorisant l'entreprise et qualifiant le projet au sein du portefeuille régional.

---

## 📊 PARCOURS 4 : LE DIRECTEUR GÉNÉRAL (Cockpit DG)
*Objectif : Piloter la vision stratégique globale d'un pôle d'innovation.*

```
[1. Consultation Mission] ➔ [2. Visualisation Roadmap] ➔ [3. Analyse Portefeuille]
                                                                  │
[6. Décision stratégique] 📊 👤 💻 ⬅ [5. Gap Analysis] ⬅ [4. Outcomes & Impacts]
```

1. **Consultation de la Mission** : Le DG de MecaTech se connecte sur son **Workspace DG** (Cockpit Exécutif). Il consulte la mission stratégique *"Digitalisation Industrielle & Industrie 5.0"*.
2. **Visualisation de la Roadmap** : Sous cette mission, il clique sur la Roadmap *"Usine du Futur 2026"*. Il observe le taux de complétion global calculé automatiquement à partir des projets labellisés associés.
3. **Analyse du Portefeuille** : Il plonge dans le Portefeuille *"Smart Manufacturing"*. Il voit la liste des projets actifs de ce portefeuille et les financements globaux mobilisés.
4. **Vérification des Outcomes & Impacts** : Il constate que les indicateurs (ex: *"Nombre de robots connectés installés"*, *"Gains énergétiques"*) sont mis à jour en temps réel à partir des services délivrés et validés sur le terrain par ses chargés de mission.
5. **Gap Analysis (Écarts)** : L'outil de Gap Analysis lui signale une alerte : *"Manque critique de compétences en Cybersécurité industrielle (OT) pour répondre aux défis d'usines connectées déclarés par 12 PMEs en province de Hainaut"*.
6. **Décision stratégique** : Sans aucune réunion d'audit lourde, le DG décide de :
   * Publier une nouvelle opportunité de consortium ciblant ce besoin.
   * Lancer un appel à l'AWEX et à l'AdN pour identifier des experts OT.
   * Créer un nouveau service d'accompagnement spécifique dans le catalogue.

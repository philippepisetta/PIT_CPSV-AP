import { PrismaClient } from '@prisma/client';

export async function cleanVNext(prisma: PrismaClient) {
  console.log('🧹 Nettoyage des anciennes données vNext...');
  
  // Deletion in cascade-safe order
  await prisma.pitRecommendation.deleteMany({});
  await prisma.lessonLearned.deleteMany({});
  await prisma.territorialEventImpact.deleteMany({});
  await prisma.territorialEvent.deleteMany({});
  await prisma.policyEvidenceSource.deleteMany({});
  await prisma.policyEvaluation.deleteMany({});
  await prisma.policyOutcome.deleteMany({});
  await prisma.policyMeasure.deleteMany({});
  await prisma.challengeObjective.deleteMany({});
  await prisma.policyObjective.deleteMany({});
  await prisma.territorialObservation.deleteMany({});
  await prisma.territorialIndicator.deleteMany({});
  await prisma.territorialChallenge.deleteMany({});
  await prisma.filiere.deleteMany({}); // Nettoyage de Filière
  await prisma.resilienceProfile.deleteMany({});
  await prisma.resilienceMeasure.deleteMany({});
  await prisma.resilienceImpact.deleteMany({});
  await prisma.impactAssessment.deleteMany({});
  await prisma.impactRule.deleteMany({});
  await prisma.impactDimension.deleteMany({});
  await prisma.riskAssessment.deleteMany({});
  await prisma.policyEvidence.deleteMany({});
  await prisma.scenario.deleteMany({});
  await prisma.hazard.deleteMany({});
  await prisma.threat.deleteMany({});
  await prisma.risk.deleteMany({});
  await prisma.riskRegister.deleteMany({});
  await prisma.dependency.deleteMany({});
  await prisma.criticalInfrastructure.deleteMany({});
  await prisma.vulnerability.deleteMany({});
  await prisma.territorialAsset.deleteMany({});
  await prisma.organizationalCapacity.deleteMany({});
  await prisma.contextEntityRelationship.deleteMany({});
  await prisma.contextEntityObservation.deleteMany({});
  await prisma.contextEntity.deleteMany({});
  
  console.log('🧹 Nettoyage vNext effectué avec succès.');
}

interface SeedContext {
  tWall: any;
  tLiege: any;
  tNamur: any;
  tHainaut: any;
  tBrabant: any;
  tLux: any;
  cNamurCity: any;
  cCharleroi: any;
  cLiegeCity: any;
  cWavre: any;
  bBassinSambre: any;
  orgAdn: any;
  orgWe: any;
  orgAwex: any;
  orgUcm: any;
  orgSirris: any;
  orgBioWin: any;
  orgMecaTech: any;
  orgTweed: any;
  s3Num: any;
  s3Indus: any;
  s3Sante: any;
  s3Circ: any;
  s3Ener: any;
  vcNum: any;
  vcIndus: any;
  vcSante: any;
  vcBiotech: any;
  vcAgri: any;
  vcHydro: any;
  vcEner: any;
  vcConst: any;
  vcCirc: any;
  chDigital: any;
  chIa: any;
  chCyber: any;
  chExport: any;
  chDecarb: any;
  chInno: any;
  chRh: any;
  chFund: any;
  chCirc: any;
  chConf: any;
  fiFeder: any;
  fiCheques: any;
  fiHorizon: any;
  fiDigitalEurope: any;
  ecoEdih: any;
  ecoDw: any;
  ecoBioWin: any;
  ecoTweed: any;
}

export async function seedVNext(prisma: PrismaClient, ctx: SeedContext) {
  console.log('🌱 Début du seeding vNext (Résilience, Intelligence, Policy)...');

  // =========================================================================
  // 0. FILIÈRES DE RÉFÉRENCE
  // =========================================================================
  console.log('  -> Création des Filières de référence...');
  const filiereNum = await prisma.filiere.create({
    data: {
      name: 'Numérique',
      description: 'Filière des technologies numériques, logicielles et de l\'intelligence artificielle.',
      ecosystemId: ctx.ecoEdih.id
    }
  });

  const filiereIndus = await prisma.filiere.create({
    data: {
      name: 'Industrie du Futur',
      description: 'Filière de la modernisation industrielle, du manufacturing avancé et de l\'automatisation.',
      ecosystemId: ctx.ecoEdih.id
    }
  });

  const filiereCirc = await prisma.filiere.create({
    data: {
      name: 'Économie Circulaire',
      description: 'Filière de la transition écologique, du recyclage et de la valorisation des ressources.',
      ecosystemId: ctx.ecoTweed.id
    }
  });

  const filiereEner = await prisma.filiere.create({
    data: {
      name: 'Énergie & Hydrogène',
      description: 'Filière de la transition énergétique, des vecteurs énergétiques décarbonés et de l\'hydrogène.',
      ecosystemId: ctx.ecoTweed.id
    }
  });

  // =========================================================================
  // 1. GOUVERNANCE ET CAPACITÉS (OrganizationalCapacity)
  // =========================================================================
  console.log('  -> Création des Capacités Organisationnelles...');
  await prisma.organizationalCapacity.create({
    data: {
      organizationId: ctx.orgAdn.id,
      capacityType: 'DIGITAL',
      name: 'Expertise technique IA & Data',
      description: 'Capacité de cadrage de projets d\'intelligence artificielle et gouvernance des données. L\'AdN dispose d\'une équipe de data scientists et d\'architectes sémantiques hautement qualifiés.',
      value: 8.5,
      unit: 'Maturité (0-10)'
    }
  });

  await prisma.organizationalCapacity.create({
    data: {
      organizationId: ctx.orgSirris.id,
      capacityType: 'PRODUCTION',
      name: 'Laboratoires de prototypage industriel',
      description: 'Infrastructures physiques de test pour le manufacturing avancé et l\'Industrie 4.0. Équipements de pointe pour la fabrication additive et la mécatronique.',
      value: 9.0,
      unit: 'Score infrastructure (0-10)'
    }
  });

  // =========================================================================
  // 2. ASSETS TERRITORIAUX ET INFRASTRUCTURES CRITIQUES (TerritorialAsset & Dependency)
  // =========================================================================
  console.log('  -> Création des Assets et Infrastructures Critiques...');
  const assetDatacenter = await prisma.territorialAsset.create({
    data: {
      name: 'Datacenter régional Wallonie Cloud (WCloud)',
      description: 'Centre de données hébergeant la Plateforme d\'Intelligence Territoriale et les services souverains wallons.',
      assetType: 'DIGITAL',
      subType: 'datacenter',
      owner: 'Agence du Numérique',
      location: 'Namur',
      estimatedValue: 15000000.0,
      currency: 'EUR',
      metadata: { rackCount: 120, securityLevel: 'Tier-III', coolingType: 'Free cooling' },
      uri: 'https://pit.wallonie.be/id/asset/datacenter-wcloud',
      organizationId: ctx.orgAdn.id,
      territoryId: ctx.tNamur.id
    }
  });

  const assetElectrolyseur = await prisma.territorialAsset.create({
    data: {
      name: 'Électrolyseur pilote H2 Sambre',
      description: 'Électrolyseur de production d\'hydrogène vert pour la décarbonation du bassin industriel.',
      assetType: 'INFRASTRUCTURE',
      subType: 'factory',
      owner: 'Wallonie Entreprendre',
      location: 'Charleroi',
      estimatedValue: 8500000.0,
      currency: 'EUR',
      metadata: { capacityMw: 10.0, purityLevel: '99.999%', inputEnergySource: 'Photovoltaic' },
      uri: 'https://pit.wallonie.be/id/asset/electrolyseur-h2-sambre',
      organizationId: ctx.orgWe.id,
      territoryId: ctx.bBassinSambre.id
    }
  });

  const infraElia = await prisma.criticalInfrastructure.create({
    data: {
      name: 'Réseau de transport d\'électricité haute tension Elia Wallonie',
      description: 'Lignes de transport et postes d\'interconnexion pour l\'alimentation industrielle.',
      type: 'ENERGY',
      operator: 'Elia',
      territory: 'Wallonie',
      isCrossBorder: true,
      uri: 'https://pit.wallonie.be/id/infrastructure/elia-ht-wallonia',
      territories: { connect: [{ id: ctx.tWall.id }, { id: ctx.tLiege.id }, { id: ctx.tNamur.id }] }
    }
  });

  const infraSofico = await prisma.criticalInfrastructure.create({
    data: {
      name: 'Réseau haut débit de télécommunications wallon (SOFICO)',
      description: 'Dorsale de fibre optique reliant les zonings industriels et les administrations publiques.',
      type: 'DIGITAL',
      operator: 'SOFICO',
      territory: 'Wallonie',
      isCrossBorder: false,
      uri: 'https://pit.wallonie.be/id/infrastructure/sofico-fiber-network'
    }
  });

  // Dépendances
  const depEnergy = await prisma.dependency.create({
    data: {
      name: 'Dépendance au réseau électrique haute tension',
      description: 'Alimentation continue requise pour le fonctionnement de l\'électrolyseur pilote.',
      category: 'ENERGY',
      criticalLevel: 'HIGH',
      substitutability: 'DIFFICULT',
      uri: 'https://pit.wallonie.be/id/dependency/h2-electricity-ht',
      criticalInfrastructureId: infraElia.id,
      assets: { connect: [{ id: assetElectrolyseur.id }] }
    }
  });

  const depFibre = await prisma.dependency.create({
    data: {
      name: 'Dépendance à la connectivité fibre haut débit',
      description: 'Lien réseau principal pour la synchronisation en temps réel de l\'infrastructure cloud.',
      category: 'DIGITAL',
      criticalLevel: 'CRITICAL',
      substitutability: 'POSSIBLE',
      uri: 'https://pit.wallonie.be/id/dependency/wcloud-sofico-fiber',
      criticalInfrastructureId: infraSofico.id,
      assets: { connect: [{ id: assetDatacenter.id }] }
    }
  });

  // Vulnérabilités
  const vulneSupplier = await prisma.vulnerability.create({
    data: {
      name: 'Dépendance exclusive envers des fournisseurs de métaux rares hors-UE',
      description: 'Risque de rupture d\'approvisionnement en membranes d\'électrolyseur contenant de l\'iridium et du platine.',
      category: 'SUPPLY',
      severity: 'CRITICAL',
      indicator: 'IND-RAW-DEP',
      assets: { connect: [{ id: assetElectrolyseur.id }] }
    }
  });

  const vulneCyberBackup = await prisma.vulnerability.create({
    data: {
      name: 'Faiblesse des plans de continuité d\'activité (DRP) cyber des sous-traitants',
      description: 'Risque d\'effet domino si un prestataire d\'infogérance tiers subit un ransomware.',
      category: 'DIGITAL',
      severity: 'HIGH',
      assets: { connect: [{ id: assetDatacenter.id }] }
    }
  });

  // =========================================================================
  // 3. REGISTRE DES RISQUES, SÉCENARIOS ET ÉVALUATIONS (Risk & Scenario)
  // =========================================================================
  console.log('  -> Création des Risques, Scénarios et Registres...');
  const register2026 = await prisma.riskRegister.create({
    data: {
      name: 'Registre de Résilience Territoriale - Campagne 2026',
      description: 'Identification et évaluation des risques systémiques majeurs pour l\'industrie et les infrastructures wallonnes.',
      status: 'ACTIVE',
      campaignCode: 'RESILIENCE-2026',
      validFrom: new Date('2026-01-01'),
      validTo: new Date('2026-12-31'),
      uri: 'https://pit.wallonie.be/id/risk-register/campaign-2026'
    }
  });

  const riskH2Supply = await prisma.risk.create({
    data: {
      code: 'RISK-H2-SUPPLY',
      name: 'Rupture prolongée d\'approvisionnement en hydrogène propre',
      description: 'Interruption critique de la chaîne logistique hydrogène pénalisant les transports publics et la sidérurgie verte.',
      category: 'ECONOMIC',
      subcategory: 'Logistique & Transport',
      severity: 4,
      likelihood: 3,
      riskScore: 12,
      uri: 'https://pit.wallonie.be/id/risk/h2-supply-disruption',
      riskRegisterId: register2026.id,
      territories: { connect: [{ id: ctx.tWall.id }, { id: ctx.tLiege.id }] },
      assets: { connect: [{ id: assetElectrolyseur.id }] }
    }
  });

  const riskCyberIntrusion = await prisma.risk.create({
    data: {
      code: 'RISK-CYBER-INFRA',
      name: 'Cyberattaque par ransomware sur le cloud régional souverain',
      description: 'Chiffrement des données critiques et paralysie des services administratifs et d\'intelligence territoriale.',
      category: 'CYBER',
      subcategory: 'Infrastructures Cloud',
      severity: 5,
      likelihood: 3,
      riskScore: 15,
      uri: 'https://pit.wallonie.be/id/risk/regional-cloud-ransomware',
      riskRegisterId: register2026.id,
      territories: { connect: [{ id: ctx.tWall.id }, { id: ctx.tNamur.id }] },
      assets: { connect: [{ id: assetDatacenter.id }] }
    }
  });

  const riskSambreFlood = await prisma.risk.create({
    data: {
      code: 'RISK-NAT-FLOOD',
      name: 'Inondation centennale de la vallée de la Sambre',
      description: 'Crues majeures menaçant les zones industrielles riveraines et les réseaux de transport sous l\'effet du dérèglement climatique.',
      category: 'NATURAL',
      subcategory: 'Hydrologie',
      severity: 5,
      likelihood: 2,
      riskScore: 10,
      uri: 'https://pit.wallonie.be/id/risk/sambre-valley-flood',
      riskRegisterId: register2026.id,
      territories: { connect: [{ id: ctx.tWall.id }, { id: ctx.tHainaut.id }, { id: ctx.bBassinSambre.id }] }
    }
  });

  // Menaces et Aléas (Threat & Hazard)
  await prisma.threat.create({
    data: {
      name: 'Groupe criminel organisé / Ransomware-as-a-Service',
      description: 'Attaque ciblée exploitant des vulnérabilités zero-day ou du phishing pour s\'infiltrer sur le réseau.',
      threatType: 'INTENTIONAL',
      uri: 'https://pit.wallonie.be/id/threat/ransomware-group',
      riskId: riskCyberIntrusion.id
    }
  });

  await prisma.threat.create({
    data: {
      name: 'Faillite subite du principal transporteur logistique d\'hydrogène',
      description: 'Défaillance opérationnelle ou financière arrêtant les rotations de camions-citernes.',
      threatType: 'ACCIDENTAL',
      uri: 'https://pit.wallonie.be/id/threat/h2-carrier-bankruptcy',
      riskId: riskH2Supply.id
    }
  });

  await prisma.hazard.create({
    data: {
      name: 'Épisode météorologique de blocage atmosphérique',
      description: 'Précipitations de forte intensité prolongées pendant plus de 72 heures sur un sol déjà saturé.',
      hazardType: 'FLOOD',
      source: 'BNRA',
      uri: 'https://pit.wallonie.be/id/hazard/meteorological-blocking-flood',
      riskId: riskSambreFlood.id
    }
  });

  // Scénarios
  const scenarioH2disruption = await prisma.scenario.create({
    data: {
      name: 'Rupture d\'approvisionnement H2 de 7 jours en hiver',
      description: 'Indisponibilité totale de l\'électrolyseur Sambre combinée à des difficultés d\'importation transfrontalière.',
      horizon: 'MEDIUM',
      probability: 0.15,
      severity: 'CRITICAL',
      uri: 'https://pit.wallonie.be/id/scenario/h2-supply-7days-winter',
      riskId: riskH2Supply.id
    }
  });

  const scenarioCyberAdn = await prisma.scenario.create({
    data: {
      name: 'Paralysie du Datacenter WCloud pendant 72h',
      description: 'Attaque réussie par ransomware impactant 80% des serveurs virtuels de la Plateforme d\'Intelligence Territoriale.',
      horizon: 'SHORT',
      probability: 0.25,
      severity: 'HIGH',
      uri: 'https://pit.wallonie.be/id/scenario/wcloud-ransomware-72h',
      riskId: riskCyberIntrusion.id
    }
  });

  // Évaluations de risques
  await prisma.riskAssessment.create({
    data: {
      assessmentType: 'BNRA',
      methodology: 'Méthodologie standard fédérale BNRA de cotation matricielle (1-10)',
      exposureScore: 8,
      vulnerabilityScore: 7,
      consequenceScore: 9,
      overallScore: 8,
      notes: 'Le manque de sources d\'approvisionnement H2 alternatives augmente drastiquement la vulnérabilité.',
      scenarioId: scenarioH2disruption.id,
      territoryId: ctx.tWall.id,
      riskId: riskH2Supply.id
    }
  });

  await prisma.riskAssessment.create({
    data: {
      assessmentType: 'CORTEX',
      methodology: 'Analyse d\'impact cyber CORTEX 2026',
      exposureScore: 9,
      vulnerabilityScore: 5,
      consequenceScore: 8,
      overallScore: 7,
      notes: 'Exposition élevée due au niveau d\'intégration des APIs, mais atténuée par une bonne segmentation réseau.',
      scenarioId: scenarioCyberAdn.id,
      organizationId: ctx.orgAdn.id,
      riskId: riskCyberIntrusion.id
    }
  });

  // =========================================================================
  // 4. IMPACTS ET MESURES DE RÉSILIENCE (ResilienceImpact & Measure)
  // =========================================================================
  console.log('  -> Création des Impacts et Mesures de Résilience...');
  
  // Profil de Résilience (ResilienceProfile) pour Territoire et Organisation
  await prisma.resilienceProfile.create({
    data: {
      exposure: 6.0,
      sensitivity: 5.0,
      vulnerability: 5.5,
      absorptionCapacity: 6.0,
      adaptiveCapacity: 7.0,
      recoveryCapacity: 6.5,
      overallResilience: 6.5,
      methodology: 'Cadre OCDE de résilience territoriale économique',
      notes: 'La Wallonie dispose d\'une bonne capacité d\'adaptation stratégique, mais sa sensibilité sectorielle industrielle reste élevée.',
      territoryId: ctx.tWall.id
    }
  });

  await prisma.resilienceProfile.create({
    data: {
      exposure: 3.5,
      sensitivity: 3.0,
      vulnerability: 3.2,
      absorptionCapacity: 8.0,
      adaptiveCapacity: 8.5,
      recoveryCapacity: 9.0,
      overallResilience: 8.5,
      methodology: 'Audit de résilience opérationnelle ITIL v4',
      notes: 'L\'Agence du Numérique a mis en place des processus rigoureux de sauvegarde et de redondance géographique.',
      organizationId: ctx.orgAdn.id
    }
  });

  // Impacts de Résilience
  const impactH2Eco = await prisma.resilienceImpact.create({
    data: {
      name: 'Perte de chiffre d\'affaires direct de l\'écosystème sidérurgique Sambre',
      description: 'Chômage technique et arrêt temporaire des fours industriels par manque de combustible H2.',
      category: 'ECONOMIC',
      magnitude: 12.5,
      unit: 'Millions EUR / jour',
      timeHorizon: 'SHORT',
      scenarioId: scenarioH2disruption.id,
      territoryId: ctx.bBassinSambre.id,
      ecosystemId: ctx.ecoTweed.id // Lié à l'écosystème TWEED
    }
  });

  const impactCyberOps = await prisma.resilienceImpact.create({
    data: {
      name: 'Indisponibilité totale des services de la Plateforme d\'Intelligence Territoriale',
      description: 'Interruption de l\'accès aux données d\'aide à la décision pour le cabinet du Ministre et les administrations publiques.',
      category: 'OPERATIONAL',
      magnitude: 100.0,
      unit: 'Pourcentage d\'interruption',
      timeHorizon: 'SHORT',
      scenarioId: scenarioCyberAdn.id,
      organizationId: ctx.orgAdn.id
    }
  });

  // Mesures de résilience
  await prisma.resilienceMeasure.create({
    data: {
      name: 'Constitution de stocks de sécurité physiques d\'iridium pour électrolyseurs',
      description: 'Achat centralisé régional d\'un stock stratégique de rechange pour pallier les interruptions fournisseurs.',
      measureType: 'PREVENTION',
      targetDimension: 'VULNERABILITY',
      status: 'PLANNED',
      uri: 'https://pit.wallonie.be/id/resilience-measure/h2-strategic-stock',
      resilienceImpacts: { connect: [{ id: impactH2Eco.id }] }
    }
  });

  await prisma.resilienceMeasure.create({
    data: {
      name: 'Plan de reprise d\'activité (DRP) décentralisé multi-cloud',
      description: 'Mise en place d\'une réplication continue hors-région sur un fournisseur alternatif avec basculement automatisé.',
      measureType: 'RECOVERY',
      targetDimension: 'RECOVERY',
      status: 'ACTIVE',
      uri: 'https://pit.wallonie.be/id/resilience-measure/wcloud-drp-multicloud',
      resilienceImpacts: { connect: [{ id: impactCyberOps.id }] }
    }
  });

  // =========================================================================
  // 5. INDICATEURS ET OBSERVATIONS (Indicator & Observation Framework)
  // =========================================================================
  console.log('  -> Création des Indicateurs Territoriaux et Observations...');
  const indRawDep = await prisma.territorialIndicator.create({
    data: {
      code: 'IND-RAW-DEP',
      name: 'Taux de dépendance aux matières premières critiques importées',
      description: 'Part des métaux rares et matières premières critiques importées hors-UE dans les chaînes de valeur clés wallonnes (S3).',
      unit: 'Pourcentage (%)',
      category: 'ECONOMIC',
      source: 'IWEPS',
      owner: 'Wallonie Entreprendre',
      frequency: 'ANNUAL',
      aggregationType: 'LAST',
      dataType: 'NUMERIC',
      computationType: 'DIRECT',
      uri: 'https://pit.wallonie.be/id/indicator/raw-material-dependency',
      territories: { connect: [{ id: ctx.tWall.id }] },
      filieres: { connect: [{ id: filiereIndus.id }, { id: filiereCirc.id }] }
    }
  });

  const indCyberMat = await prisma.territorialIndicator.create({
    data: {
      code: 'IND-CYBER-MAT',
      name: 'Indice composite de maturité cyber des PME stratégiques',
      description: 'Score moyen évaluant la sensibilisation, la sécurisation des serveurs et les plans de secours (0 à 5).',
      unit: 'Score (0-5)',
      category: 'DIGITAL',
      source: 'Agence du Numérique',
      owner: 'AdN',
      frequency: 'ANNUAL',
      aggregationType: 'AVG',
      dataType: 'NUMERIC',
      computationType: 'COMPOSITE',
      formula: '0.3 * formation + 0.4 * securite_reseau + 0.3 * plan_reprise',
      isComposite: true,
      uri: 'https://pit.wallonie.be/id/indicator/cyber-maturity-pme',
      territories: { connect: [{ id: ctx.tWall.id }, { id: ctx.tLiege.id }, { id: ctx.tNamur.id }] },
      ecosystems: { connect: [{ id: ctx.ecoEdih.id }] } // Connecté à l'ecoEdih
    }
  });

  const indH2Cap = await prisma.territorialIndicator.create({
    data: {
      code: 'IND-H2-CAP',
      name: 'Capacité nominale installée d\'électrolyse hydrogène',
      description: 'Puissance totale cumulée des électrolyseurs en service pour la production d\'hydrogène vert.',
      unit: 'Megawatt (MW)',
      category: 'ENERGY',
      source: 'Cluster TWEED',
      owner: 'TWEED',
      frequency: 'QUARTERLY',
      aggregationType: 'SUM',
      dataType: 'NUMERIC',
      computationType: 'DIRECT',
      uri: 'https://pit.wallonie.be/id/indicator/h2-electrolysis-capacity',
      territories: { connect: [{ id: ctx.tWall.id }, { id: ctx.bBassinSambre.id }] }
    }
  });

  // Observations
  await prisma.territorialObservation.create({
    data: {
      value: 82.4,
      period: '2024',
      observedAt: new Date('2024-12-31'),
      source: 'IWEPS - Rapport matières premières 2024',
      confidenceLevel: 0.95,
      qualityNote: 'Données basées sur les flux douaniers réels, excellente fiabilité.',
      indicatorId: indRawDep.id,
      territoryId: ctx.tWall.id,
      filiereId: filiereIndus.id
    }
  });

  await prisma.territorialObservation.create({
    data: {
      value: 79.8,
      period: '2025',
      observedAt: new Date('2025-12-31'),
      source: 'IWEPS - Enquête S3 2025',
      confidenceLevel: 0.90,
      qualityNote: 'Légère baisse suite aux projets de recyclage locaux.',
      indicatorId: indRawDep.id,
      territoryId: ctx.tWall.id,
      filiereId: filiereIndus.id
    }
  });

  await prisma.territorialObservation.create({
    data: {
      value: 2.85,
      period: '2024',
      observedAt: new Date('2024-10-15'),
      source: 'AdN - Audit Cyber-Check 2024',
      confidenceLevel: 0.85,
      qualityNote: 'Échantillonnage représentatif de 450 PME wallonnes.',
      indicatorId: indCyberMat.id,
      territoryId: ctx.tLiege.id,
      organizationId: ctx.orgAdn.id
    }
  });

  await prisma.territorialObservation.create({
    data: {
      value: 3.12,
      period: '2025',
      observedAt: new Date('2025-10-20'),
      source: 'AdN - Enquête maturité digitale 2025',
      confidenceLevel: 0.88,
      qualityNote: 'Amélioration suite aux programmes d\'accompagnement EDIH.',
      indicatorId: indCyberMat.id,
      territoryId: ctx.tLiege.id,
      organizationId: ctx.orgAdn.id
    }
  });

  await prisma.territorialObservation.create({
    data: {
      value: 5.0,
      period: '2024',
      observedAt: new Date('2024-12-31'),
      source: 'TWEED H2 Dashboard',
      confidenceLevel: 1.0,
      indicatorId: indH2Cap.id,
      territoryId: ctx.bBassinSambre.id
    }
  });

  await prisma.territorialObservation.create({
    data: {
      value: 15.0,
      period: '2025',
      observedAt: new Date('2025-12-31'),
      source: 'TWEED H2 Dashboard',
      confidenceLevel: 1.0,
      indicatorId: indH2Cap.id,
      territoryId: ctx.bBassinSambre.id
    }
  });

  // =========================================================================
  // 6. DÉFIS TERRITORIAUX ET OBJECTIFS (TerritorialChallenge & Objectives)
  // =========================================================================
  console.log('  -> Création des Défis Territoriaux et Objectifs...');
  const challengeRawSupply = await prisma.territorialChallenge.create({
    data: {
      code: 'CHALL-RAW-SUPPLY',
      name: 'Autocapacité de recyclage des métaux industriels critiques',
      description: 'Développer des boucles régionales d\'économie circulaire pour réutiliser le platine et l\'iridium issus des composants électroniques et de l\'électrolyse.',
      category: 'CIRCULAR',
      horizon: 'MEDIUM',
      priority: 'HIGH',
      status: 'ACTIVE',
      uri: 'https://pit.wallonie.be/id/challenge/circular-metals-recycling',
      territories: { connect: [{ id: ctx.tWall.id }, { id: ctx.tLiege.id }] },
      filieres: { connect: [{ id: filiereCirc.id }] }
    }
  });

  const challengeH2Transit = await prisma.territorialChallenge.create({
    data: {
      code: 'CHALL-H2-INFRA',
      name: 'Réseau de distribution d\'hydrogène de deuxième génération (dorsale Sambre)',
      description: 'Construire l\'infrastructure physique de canalisations reliant les producteurs d\'H2 aux aciéries et verreries.',
      category: 'RESILIENCE',
      horizon: 'LONG',
      priority: 'CRITICAL',
      status: 'ACTIVE',
      uri: 'https://pit.wallonie.be/id/challenge/h2-distribution-spine',
      territories: { connect: [{ id: ctx.tWall.id }, { id: ctx.bBassinSambre.id }] },
      filieres: { connect: [{ id: filiereEner.id }] }
    }
  });

  // Objectifs associés aux défis (ChallengeObjective)
  const objReduceDep = await prisma.challengeObjective.create({
    data: {
      code: 'OBJ-DEP-RAW-2030',
      name: 'Ramener le taux de dépendance aux métaux critiques sous les 60%',
      description: 'Augmenter le recyclage industriel pour réduire le recours aux importations brutes non-UE.',
      targetValue: 60.0,
      targetUnit: 'Pourcentage (%)',
      targetYear: 2030,
      currentValue: 79.8,
      status: 'IN_PROGRESS',
      territorialChallengeId: challengeRawSupply.id,
      indicatorId: indRawDep.id
    }
  });

  const objBuildSpine = await prisma.challengeObjective.create({
    data: {
      code: 'OBJ-H2-CAP-2028',
      name: 'Déployer 50 MW de capacité d\'électrolyse d\'ici 2028',
      description: 'Atteindre le seuil critique de puissance installée pour alimenter la dorsale Sambre-Meuse.',
      targetValue: 50.0,
      targetUnit: 'Megawatt (MW)',
      targetYear: 2028,
      currentValue: 15.0,
      status: 'IN_PROGRESS',
      territorialChallengeId: challengeH2Transit.id,
      indicatorId: indH2Cap.id
    }
  });

  // =========================================================================
  // 7. CADRE DES POLITIQUES ET ÉVALUATION (Policy & Evidence Domain)
  // =========================================================================
  console.log('  -> Création des Politiques, Mesures et Évaluations...');
  const policyGreen = await prisma.policyObjective.create({
    data: {
      code: 'POL-OBJ-GREEN-TECH',
      name: 'Indépendance et Souveraineté Énergétique Régionale',
      description: 'Objectif de politique publique visant à développer et maîtriser les filières d\'énergies renouvelables et d\'hydrogène en Wallonie.',
      level: 'REGIONAL',
      framework: 'S3',
      uri: 'https://pit.wallonie.be/id/policy-objective/green-sovereignty',
      challengeObjectives: { connect: [{ id: objBuildSpine.id }] }
    }
  });

  const policyCyber = await prisma.policyObjective.create({
    data: {
      code: 'POL-OBJ-CYBER-RES',
      name: 'Résilience numérique des PME et Opérateurs S3',
      description: 'Renforcer le niveau de défense cyber général des petites et moyennes entreprises pour prévenir les vols de propriété intellectuelle et les pannes.',
      level: 'REGIONAL',
      framework: 'DIGITAL',
      uri: 'https://pit.wallonie.be/id/policy-objective/digital-resilience'
    }
  });

  // Mesures de politiques publiques (PolicyMeasure)
  const measureH2Plan = await prisma.policyMeasure.create({
    data: {
      code: 'POL-MEAS-H2-2030',
      name: 'Plan Régional Hydrogène Propre Wallonie 2030',
      description: 'Financement et facilitation administrative pour la mise en place d\'électrolyseurs et de la logistique associée.',
      measureType: 'FINANCIAL',
      status: 'ACTIVE',
      uri: 'https://pit.wallonie.be/id/policy-measure/regional-h2-plan',
      policyObjectiveId: policyGreen.id
    }
  });

  const measureCyberAct = await prisma.policyMeasure.create({
    data: {
      code: 'POL-MEAS-CYBER-ACT',
      name: 'Cyber-Protection Act : Aides et Chèques Cyber NIS2',
      description: 'Subventionnement des audits de cybersécurité et de la mise aux normes NIS2 pour les PME industrielles stratégiques.',
      measureType: 'FINANCIAL',
      status: 'ACTIVE',
      uri: 'https://pit.wallonie.be/id/policy-measure/cyber-protection-act',
      policyObjectiveId: policyCyber.id
    }
  });

  // Évaluation de la mesure (PolicyEvaluation)
  await prisma.policyEvaluation.create({
    data: {
      evaluator: 'Groupe d\'experts indépendants OCDE & IWEPS',
      methodology: 'Évaluation quantitative d\'efficience des dépenses publiques',
      overallJudgment: 'PARTIAL',
      achievementRate: 48.5,
      notes: 'L\'aide financière a stimulé les projets pilotes, mais le cadre réglementaire de distribution physique transfrontalière traîne, limitant l\'essor commercial.',
      evaluatedAt: new Date('2026-03-10'),
      policyMeasureId: measureH2Plan.id
    }
  });

  // Évidence et Sources (PolicyEvidence & Source)
  const evidenceIwepsReport = await prisma.policyEvidence.create({
    data: {
      title: 'Étude d\'impact économique de la transition hydrogène en Wallonie 2025',
      description: 'Rapport complet simulant l\'impact de la substitution des énergies fossiles par l\'hydrogène vert sur l\'emploi et la balance commerciale.',
      evidenceType: 'STUDY',
      publicationDate: new Date('2025-10-12'),
      publisher: 'IWEPS',
      url: 'https://iweps.wallonie.be/etudes/impact-h2-2025',
      qualityLevel: 'INSTITUTIONAL',
      uri: 'https://pit.wallonie.be/id/evidence/h2-economic-study-2025',
      policyMeasures: { connect: [{ id: measureH2Plan.id }] }
    }
  });

  await prisma.policyEvidenceSource.create({
    data: {
      name: 'Modèle macroéconomique HERMES IWEPS',
      sourceType: 'IWEPS',
      url: 'https://iweps.wallonie.be/modeles/hermes',
      reliability: 'HIGH',
      policyEvidenceId: evidenceIwepsReport.id
    }
  });

  // =========================================================================
  // 8. ÉVÉNEMENTS TERRITORIAUX, LEÇONS APPRISES ET RECOMMANDATIONS
  // (TerritorialEvent, LessonLearned & PitRecommendation)
  // =========================================================================
  console.log('  -> Création des Événements Territoriaux, Retours d\'Expérience et Recommandations...');
  const eventSoficoBreakdown = await prisma.territorialEvent.create({
    data: {
      name: 'Incident de connectivité réseau SOFICO - Bassin Liégeois',
      description: 'Coupure accidentelle d\'un câble de fibre optique principal lors de travaux publics, paralysant les transmissions de données industrielles pendant 14 heures.',
      location: 'Liège (Zoning des Hauts-Sarts)',
      isHistorical: false,
      eventType: 'CYBER', // standard CYBER for network outage
      severity: 'HIGH',
      eventDate: new Date('2026-04-18T08:30:00Z'),
      endDate: new Date('2026-04-18T22:30:00Z'),
      uri: 'https://pit.wallonie.be/id/event/sofico-fiber-cut-2026',
      riskId: riskCyberIntrusion.id
    }
  });

  // Impact de l'événement (TerritorialEventImpact)
  await prisma.territorialEventImpact.create({
    data: {
      description: 'Paralysie logistique et perte de production industrielle. Impossibilité pour 45 PME de se connecter à leurs progiciels cloud (ERP/WMS), bloquant les expéditions de marchandises.',
      impactType: 'ECONOMIC',
      magnitude: 1.85,
      unit: 'Millions EUR',
      territorialEventId: eventSoficoBreakdown.id
    }
  });

  // Leçons apprises (LessonLearned)
  const lessonFiberRedundancy = await prisma.lessonLearned.create({
    data: {
      title: 'Défaut de redondance physique systématique des parcs d\'activités économiques',
      description: 'Le fait que l\'ensemble des parcs industriels transitent par une seule armoire de dérivation locale sans boucle de sécurité physique a transformé une simple coupure de câble en panne systémique.',
      category: 'PREVENTION',
      validatedAt: new Date(),
      territorialEventId: eventSoficoBreakdown.id,
      policyMeasures: { connect: [{ id: measureCyberAct.id }] } // Lié à la sécurité numérique
    }
  });

  // Recommandation d'Action (PitRecommendation)
  await prisma.pitRecommendation.create({
    data: {
      title: 'Obligation de double routage de connectivité dans les parcs d\'activités critiques',
      description: 'Mettre à jour les cahiers des charges d\'aménagement des parcs de la SOFICO et du SPW pour imposer deux tracés de fibre distincts (Est/Ouest) pour tout nouveau développement. Investissement estimé à 4.2 M€ sur 3 ans, mais évitant des millions de pertes opérationnelles.',
      status: 'DRAFT',
      relevanceScore: 0.9,
      policyMeasures: { connect: [{ id: measureCyberAct.id }] }
    }
  });

  console.log('✅ Seeding vNext terminé avec succès !');
}

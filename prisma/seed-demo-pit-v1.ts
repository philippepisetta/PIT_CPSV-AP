import { PrismaClient, TerritoryType, ProgramStatus, InitiativeStatus, ParticipationRole, ServiceDeliveryStatus, ActivityType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du peuplement du Dataset Démonstrateur 1.0 (seed)...');

  // 1. Nettoyage de la base de données en respectant l'ordre des contraintes d'intégrité
  console.log('🧹 Nettoyage des anciennes données...');
  await prisma.evidence.deleteMany({});
  await prisma.activity.deleteMany({});
  await prisma.serviceDelivery.deleteMany({});
  await prisma.collectiveDelivery.deleteMany({});
  await prisma.secondLineMission.deleteMany({});
  await prisma.action.deleteMany({});
  await prisma.actionInstance.deleteMany({});
  await prisma.journeyEnrollment.deleteMany({});
  await prisma.ecosystemMembership.deleteMany({});
  await prisma.dataset.deleteMany({});
  await prisma.impact.deleteMany({});
  await prisma.outcomeIndicator.deleteMany({});
  await prisma.beneficiaryEngagement.deleteMany({});
  await prisma.initiativeParticipation.deleteMany({});
  await prisma.programParticipation.deleteMany({});
  await prisma.initiative.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.measure.deleteMany({});
  await prisma.program.deleteMany({});
  await prisma.strategicPriority.deleteMany({});
  await prisma.strategy.deleteMany({});
  await prisma.fundingInstrument.deleteMany({});
  await prisma.knowledgeAsset.deleteMany({});
  await prisma.eventResource.deleteMany({});
  await prisma.publicService.deleteMany({});
  await prisma.intervention.deleteMany({});
  await prisma.interventionType.deleteMany({});
  await prisma.ecosystem.deleteMany({});
  await prisma.ecosystemType.deleteMany({});
  await prisma.beneficiary.deleteMany({});
  await prisma.territory.deleteMany({});
  await prisma.journeyStage.deleteMany({});
  await prisma.journey.deleteMany({});
  await prisma.businessNeed.deleteMany({});
  await prisma.ecosystemRole.deleteMany({});
  await prisma.valueChainStage.deleteMany({});
  await prisma.valueChain.deleteMany({});
  await prisma.strategicValueChain.deleteMany({});
  await prisma.challenge.deleteMany({});
  await prisma.businessChallenge.deleteMany({});
  await prisma.challengeCategory.deleteMany({});
  await prisma.capability.deleteMany({});
  await prisma.capabilityDimension.deleteMany({});
  await prisma.s3Domain.deleteMany({});
  await prisma.strategicDomainDimension.deleteMany({});
  await prisma.enterpriseFunction.deleteMany({});
  await prisma.naceSector.deleteMany({});
  await prisma.interventionLevel.deleteMany({});
  await prisma.catalogue.deleteMany({});
  await prisma.rule.deleteMany({});
  await prisma.criterion.deleteMany({});
  await prisma.contactPoint.deleteMany({});
  await prisma.cost.deleteMany({});
  await prisma.requirement.deleteMany({});
  await prisma.output.deleteMany({});
  await prisma.outcome.deleteMany({});
  await prisma.channel.deleteMany({});
  await prisma.targetAudience.deleteMany({});
  await prisma.businessEvent.deleteMany({});
  await prisma.lifeEvent.deleteMany({});
  await prisma.organization.deleteMany({});

  // 2. Canaux (Channels)
  console.log('📥 Création des Canaux...');
  const chWeb = await prisma.channel.create({ data: { uri: 'https://pit.wallonie.be/id/channel/ch-web', name: 'Plateforme Web', code: 'CH-WEB' } });
  const chRdv = await prisma.channel.create({ data: { uri: 'https://pit.wallonie.be/id/channel/ch-rdv', name: 'Rendez-vous individuel', code: 'CH-RDV' } });

  // 3. Publics Cibles (TargetAudiences)
  console.log('👥 Création des Publics Cibles...');
  const taPme = await prisma.targetAudience.create({ data: { uri: 'https://pit.wallonie.be/id/target-audience/pme', name: 'PME wallonne', code: 'TA-PME' } });
  const taStartup = await prisma.targetAudience.create({ data: { uri: 'https://pit.wallonie.be/id/target-audience/startup', name: 'Startup', code: 'TA-STARTUP' } });

  // 3b. Catalogue / Dataset de Référence
  console.log('📚 Création du Catalogue / Dataset de référence...');
  const cataloguePIT = await prisma.catalogue.create({
    data: {
      uri: 'https://pit.wallonie.be/id/catalogue/pit-services',
      name: 'Catalogue des Services Territoriaux de la PIT',
      description: 'Référentiel des aides, diagnostics et accompagnements pour les entreprises wallonnes.',
      code: 'CAT-PIT',
    },
  });

  // 4. Événements Professionnels & Niveaux d'intervention
  console.log('📊 Création des Niveaux d\'Intervention...');
  const ilIndiv = await prisma.interventionLevel.create({ data: { code: 'INDIVIDUAL', name: 'Accompagnement individuel' } });
  const itService = await prisma.interventionType.create({ data: { code: 'SERVICE', name: 'Service' } });

  // 5. Types d'Écosystèmes (EcosystemType)
  console.log('🌐 Création des Types d\'Écosystèmes...');
  const etEdih = await prisma.ecosystemType.create({ data: { code: 'EDIH', name: 'EDIH' } });
  const etCluster = await prisma.ecosystemType.create({ data: { code: 'CLUSTER', name: 'Cluster d\'innovation' } });
  const etPole = await prisma.ecosystemType.create({ data: { code: 'POLE_COMPETITIVITE', name: 'Pôle de compétitivité' } });
  const etNetwork = await prisma.ecosystemType.create({ data: { code: 'NETWORK', name: 'Réseau' } });
  const etCommunity = await prisma.ecosystemType.create({ data: { code: 'COMMUNITY', name: 'Communauté' } });
  const etHub = await prisma.ecosystemType.create({ data: { code: 'HUB_INNOVATION', name: 'Hub d\'innovation' } });

  // 6. Territoires (Territory)
  console.log('📍 Création de la hiérarchie territoriale...');
  const tWall = await prisma.territory.create({ data: { code: 'WAL', name: 'Wallonie', type: TerritoryType.REGION } });
  
  const provLiege = await prisma.territory.create({ data: { code: 'BE-WLG', name: 'Liège', type: TerritoryType.PROVINCE, parentTerritoryId: tWall.id } });
  const provNamur = await prisma.territory.create({ data: { code: 'BE-WNM', name: 'Namur', type: TerritoryType.PROVINCE, parentTerritoryId: tWall.id } });
  const provHainaut = await prisma.territory.create({ data: { code: 'BE-WHT', name: 'Hainaut', type: TerritoryType.PROVINCE, parentTerritoryId: tWall.id } });
  const provBrabant = await prisma.territory.create({ data: { code: 'BE-WBR', name: 'Brabant Wallon', type: TerritoryType.PROVINCE, parentTerritoryId: tWall.id } });
  const provLux = await prisma.territory.create({ data: { code: 'BE-WLX', name: 'Luxembourg', type: TerritoryType.PROVINCE, parentTerritoryId: tWall.id } });

  const cNamur = await prisma.territory.create({ data: { code: 'COMM-NAMUR', name: 'Ville de Namur', type: TerritoryType.COMMUNE, parentTerritoryId: provNamur.id } });
  const cCharleroi = await prisma.territory.create({ data: { code: 'COMM-CHARLEROI', name: 'Charleroi', type: TerritoryType.COMMUNE, parentTerritoryId: provHainaut.id } });
  const cLiege = await prisma.territory.create({ data: { code: 'COMM-LIEGE', name: 'Ville de Liège', type: TerritoryType.COMMUNE, parentTerritoryId: provLiege.id } });
  const cWavre = await prisma.territory.create({ data: { code: 'COMM-WAVRE', name: 'Wavre', type: TerritoryType.COMMUNE, parentTerritoryId: provBrabant.id } });
  const cBastogne = await prisma.territory.create({ data: { code: 'COMM-BASTOGNE', name: 'Bastogne', type: TerritoryType.COMMUNE, parentTerritoryId: provLux.id } });
  const cLouvain = await prisma.territory.create({ data: { code: 'COMM-LLN', name: 'Louvain-la-Neuve', type: TerritoryType.COMMUNE, parentTerritoryId: provBrabant.id } });
  const cMons = await prisma.territory.create({ data: { code: 'COMM-MONS', name: 'Mons', type: TerritoryType.COMMUNE, parentTerritoryId: provHainaut.id } });
  const cNivelles = await prisma.territory.create({ data: { code: 'COMM-NIVELLES', name: 'Nivelles', type: TerritoryType.COMMUNE, parentTerritoryId: provBrabant.id } });
  const cLibramont = await prisma.territory.create({ data: { code: 'COMM-LIBRAMONT', name: 'Libramont', type: TerritoryType.COMMUNE, parentTerritoryId: provLux.id } });
  const cTournai = await prisma.territory.create({ data: { code: 'COMM-TOURNAI', name: 'Tournai', type: TerritoryType.COMMUNE, parentTerritoryId: provHainaut.id } });
  const cJumet = await prisma.territory.create({ data: { code: 'COMM-JUMET', name: 'Jumet', type: TerritoryType.COMMUNE, parentTerritoryId: provHainaut.id } });

  // 7. Organisations (Stakeholders)
  console.log('🏢 Création des 10 Organisations (Stakeholders)...');
  const orgAdn = await prisma.organization.create({ data: { uri: 'https://pit.wallonie.be/id/organization/adn', name: 'Agence du Numérique', code: 'ORG-ADN', type: 'Opérateur public' } });
  const orgWe = await prisma.organization.create({ data: { uri: 'https://pit.wallonie.be/id/organization/we', name: 'Wallonie Entreprendre', code: 'ORG-WE', type: 'Financeur' } });
  const orgAwex = await prisma.organization.create({ data: { uri: 'https://pit.wallonie.be/id/organization/awex', name: 'AWEX', code: 'ORG-AWEX', type: 'Opérateur public' } });
  const orgSpw = await prisma.organization.create({ data: { uri: 'https://pit.wallonie.be/id/organization/spw', name: 'SPW', code: 'ORG-SPW', type: 'Administration' } });
  const orgForem = await prisma.organization.create({ data: { uri: 'https://pit.wallonie.be/id/organization/forem', name: 'Forem', code: 'ORG-FOREM', type: 'Opérateur public' } });
  const orgSirris = await prisma.organization.create({ data: { uri: 'https://pit.wallonie.be/id/organization/sirris', name: 'Sirris', code: 'ORG-SIRRIS', type: 'Centre de recherche' } });
  const orgCetic = await prisma.organization.create({ data: { uri: 'https://pit.wallonie.be/id/organization/cetic', name: 'CETIC', code: 'ORG-CETIC', type: 'Centre de recherche' } });
  const orgMeca = await prisma.organization.create({ data: { uri: 'https://pit.wallonie.be/id/organization/mecatech', name: 'MecaTech', code: 'ORG-MECATECH', type: 'Pôle de compétitivité' } });
  const orgLog = await prisma.organization.create({ data: { uri: 'https://pit.wallonie.be/id/organization/logistics-in-wallonia', name: 'Logistics in Wallonia', code: 'ORG-LOG', type: 'Pôle de compétitivité' } });
  const orgGreen = await prisma.organization.create({ data: { uri: 'https://pit.wallonie.be/id/organization/greenwin', name: 'GreenWin', code: 'ORG-GREEN', type: 'Pôle de compétitivité' } });

  // 8. Écosystèmes Régionaux (Ecosystems)
  console.log('🌐 Création des Écosystèmes...');
  const ecoEdih = await prisma.ecosystem.create({ data: { name: 'EDIH Wallonia', territory: 'Wallonie', typeId: etEdih.id, actors: { connect: [{ id: orgAdn.id }, { id: orgWe.id }, { id: orgSirris.id }, { id: orgCetic.id }] } } });
  const ecoCirc = await prisma.ecosystem.create({ data: { name: 'Circular Wallonia Network', territory: 'Wallonie', typeId: etNetwork.id, actors: { connect: [{ id: orgWe.id }, { id: orgGreen.id }] } } });
  const ecoBio = await prisma.ecosystem.create({ data: { name: 'BioWin', territory: 'Wallonie', typeId: etPole.id, actors: { connect: [{ id: orgWe.id }, { id: orgCetic.id }] } } });
  const ecoHub = await prisma.ecosystem.create({ data: { name: 'WalHub', territory: 'Wallonie', typeId: etHub.id, actors: { connect: [{ id: orgAdn.id }, { id: orgSirris.id }] } } });
  const ecoCyber = await prisma.ecosystem.create({ data: { name: 'CyberSecurity Coalition Wallonie', territory: 'Wallonie', typeId: etCommunity.id, actors: { connect: [{ id: orgCetic.id }, { id: orgAdn.id }] } } });

  // 9. Nomenclatures NACE
  console.log('🌐 Création des Secteurs NACE...');
  const naceRecyc = await prisma.naceSector.create({ data: { code: '38.32', name: 'Récupération de déchets triés' } });
  const naceWood = await prisma.naceSector.create({ data: { code: '16.23', name: 'Fabrication de charpentes et menuiseries' } });
  const naceLog = await prisma.naceSector.create({ data: { code: '49.41', name: 'Transports routiers de fret' } });
  const nacePharma = await prisma.naceSector.create({ data: { code: '21.20', name: 'Fabrication de préparations pharmaceutiques' } });
  const naceGas = await prisma.naceSector.create({ data: { code: '35.21', name: 'Production de combustibles gazeux' } });
  const naceAgri = await prisma.naceSector.create({ data: { code: '01.61', name: 'Activités de soutien aux cultures' } });
  const naceProg = await prisma.naceSector.create({ data: { code: '62.01', name: 'Programmation informatique' } });
  const naceConsult = await prisma.naceSector.create({ data: { code: '62.02', name: 'Conseil informatique' } });
  const naceTransport = await prisma.naceSector.create({ data: { code: '30.99', name: 'Fabrication d\'autres matériels de transport' } });
  const naceConst = await prisma.naceSector.create({ data: { code: '41.20', name: 'Construction de bâtiments' } });
  const naceFood = await prisma.naceSector.create({ data: { code: '10.89', name: 'Fabrication d\'autres produits alimentaires' } });
  const naceResearch = await prisma.naceSector.create({ data: { code: '72.19', name: 'Recherche-développement' } });
  const naceGlass = await prisma.naceSector.create({ data: { code: '23.11', name: 'Fabrication de verre plat' } });

  // 10. Référentiels Métier (S3 Domains & Challenge Categories & Challenges)
  console.log('🧠 Création des Référentiels S3 et Défis...');
  const s3Num = await prisma.s3Domain.create({ data: { code: 'S3-NUM', name: 'Numérique' } });
  const s3Indus = await prisma.s3Domain.create({ data: { code: 'S3-INDUSTRIE', name: 'Industrie du Futur' } });
  const s3Sante = await prisma.s3Domain.create({ data: { code: 'S3-SANTE', name: 'Santé & Sciences du Vivant' } });
  const s3Circ = await prisma.s3Domain.create({ data: { code: 'S3-CIRCULAR-ECON', name: 'Économie Circulaire' } });
  const s3Ener = await prisma.s3Domain.create({ data: { code: 'S3-ENERGY', name: 'Énergie & Hydrogène' } });
  const s3Mob = await prisma.s3Domain.create({ data: { code: 'S3-MOBILITE', name: 'Logistique & Mobilité' } });

  const vcCirc = await prisma.valueChain.create({ data: { code: 'VC-CIRCULAR-ECON', name: 'Economie circulaire', s3DomainId: s3Circ.id } });
  const vcNum = await prisma.valueChain.create({ data: { code: 'VC-NUMERIQUE', name: 'Numérique', s3DomainId: s3Num.id } });
  const vcSante = await prisma.valueChain.create({ data: { code: 'VC-SANTE', name: 'Santé', s3DomainId: s3Sante.id } });
  const vcHydro = await prisma.valueChain.create({ data: { code: 'VC-HYDROGENE', name: 'Hydrogène', s3DomainId: s3Ener.id } });
  const vcAgri = await prisma.valueChain.create({ data: { code: 'VC-AGROALIMENTAIRE', name: 'Agroalimentaire', s3DomainId: s3Indus.id } });
  const vcIndus = await prisma.valueChain.create({ data: { code: 'VC-INDUSTRIE-FUTUR', name: 'Industrie du Futur', s3DomainId: s3Indus.id } });

  const ccDigital = await prisma.challengeCategory.create({ data: { code: 'CC-DIGITAL', name: 'Transition Numérique' } });
  const ccGreen = await prisma.challengeCategory.create({ data: { code: 'CC-GREEN', name: 'Transition Écologique' } });
  const ccInt = await prisma.challengeCategory.create({ data: { code: 'CC-INT', name: 'Développement International' } });
  const ccFin = await prisma.challengeCategory.create({ data: { code: 'CC-FINGOV', name: 'Gouvernance et Financement' } });

  const chCirc = await prisma.challenge.create({ data: { code: 'CH-CIRCULARITY', name: 'Circularité', challengeCategoryId: ccGreen.id } });
  const chCyber = await prisma.challenge.create({ data: { code: 'CH-CYBER', name: 'Cybersécurité', challengeCategoryId: ccDigital.id } });
  const chIa = await prisma.challenge.create({ data: { code: 'CH-IA', name: 'Intelligence artificielle', challengeCategoryId: ccDigital.id } });
  const chInno = await prisma.challenge.create({ data: { code: 'CH-INNOVATION', name: 'Innovation', challengeCategoryId: ccFin.id } });
  const chDecarb = await prisma.challenge.create({ data: { code: 'CH-DECARBON', name: 'Décarbonation', challengeCategoryId: ccGreen.id } });
  const chDigital = await prisma.challenge.create({ data: { code: 'CH-DIGITAL', name: 'Digitalisation', challengeCategoryId: ccDigital.id } });
  const chComp = await prisma.challenge.create({ data: { code: 'CH-COMPLIANCE', name: 'Conformité', challengeCategoryId: ccFin.id } });
  const chExport = await prisma.challenge.create({ data: { code: 'CH-EXPORT', name: 'Export', challengeCategoryId: ccInt.id } });

  // Rétrocompatibilité Challenge & ValueChain
  const bcCirc = await prisma.businessChallenge.create({ data: { code: 'BC-CIRCULARITY', name: 'Circularité' } });
  const bcCyber = await prisma.businessChallenge.create({ data: { code: 'BC-CYBER', name: 'Cybersécurité' } });
  const bcIa = await prisma.businessChallenge.create({ data: { code: 'BC-IA', name: 'Intelligence artificielle' } });
  const bcInno = await prisma.businessChallenge.create({ data: { code: 'BC-INNOVATION', name: 'Innovation' } });
  const bcDecarb = await prisma.businessChallenge.create({ data: { code: 'BC-DECARBON', name: 'Décarbonation' } });
  const bcDigital = await prisma.businessChallenge.create({ data: { code: 'BC-DIGITAL', name: 'Digitalisation' } });
  const bcComp = await prisma.businessChallenge.create({ data: { code: 'BC-COMPLIANCE', name: 'Conformité' } });
  const bcExport = await prisma.businessChallenge.create({ data: { code: 'BC-EXPORT', name: 'Export' } });

  const svcCirc = await prisma.strategicValueChain.create({ data: { code: 'SVC-CIRCULAR-ECON', name: 'Economie circulaire' } });
  const svcNum = await prisma.strategicValueChain.create({ data: { code: 'SVC-NUMERIQUE', name: 'Numérique' } });
  const svcSante = await prisma.strategicValueChain.create({ data: { code: 'SVC-SANTE', name: 'Santé' } });
  const svcHydro = await prisma.strategicValueChain.create({ data: { code: 'SVC-HYDROGENE', name: 'Hydrogène' } });
  const svcAgri = await prisma.strategicValueChain.create({ data: { code: 'SVC-AGROALIMENTAIRE', name: 'Agroalimentaire' } });
  const svcIndus = await prisma.strategicValueChain.create({ data: { code: 'SVC-INDUSTRIE-FUTUR', name: 'Industrie du Futur' } });

  // 11. Stratégies et Hiérarchies de Gouvernance (Strategies, Priorities, Programs, Measures, Initiatives)
  console.log('🎯 Création des Structures de Gouvernance Stratégique...');
  const stDw = await prisma.strategy.create({ data: { code: 'STRAT-DW2025', name: 'Digital Wallonia 2025', ownerOrganizationId: orgAdn.id } });
  const stS3 = await prisma.strategy.create({ data: { code: 'STRAT-S3', name: 'Stratégie de Spécialisation Intelligente (S3)', ownerOrganizationId: orgWe.id } });
  const stCw = await prisma.strategy.create({ data: { code: 'STRAT-CW', name: 'Circular Wallonia', ownerOrganizationId: orgWe.id } });

  const pDw1 = await prisma.strategicPriority.create({ data: { strategyId: stDw.id, code: 'PRIO-DW-ECONOMY', name: 'Économie numérique & Secteur technologique' } });
  const pS3_1 = await prisma.strategicPriority.create({ data: { strategyId: stS3.id, code: 'PRIO-S3-INNO', name: 'Recherche et Innovation Collaborative' } });
  const pCw1 = await prisma.strategicPriority.create({ data: { strategyId: stCw.id, code: 'PRIO-CW-PROD', name: 'Production et Design circulaire' } });

  // 10 Programmes Cibles
  const prCircDesign = await prisma.program.create({ data: { code: 'PROG-CIRCULAR-DESIGN', name: 'Circular Design & Materials', status: ProgramStatus.ACTIVE, ownerOrganizationId: orgWe.id } });
  const prEdih = await prisma.program.create({ data: { code: 'PROG-EDIH', name: 'EDIH Wallonia', status: ProgramStatus.ACTIVE, ownerOrganizationId: orgAdn.id } });
  const prTartIa = await prisma.program.create({ data: { code: 'PROG-TART-IA', name: 'TART IA (Transition IA)', status: ProgramStatus.ACTIVE, ownerOrganizationId: orgAdn.id } });
  const prSante = await prisma.program.create({ data: { code: 'PROG-S3-SANTE', name: 'S3 Innovation Santé', status: ProgramStatus.ACTIVE, ownerOrganizationId: orgWe.id } });
  const prEnergie = await prisma.program.create({ data: { code: 'PROG-S3-ENERGIE', name: 'S3 Energie & Hydrogène', status: ProgramStatus.ACTIVE, ownerOrganizationId: orgWe.id } });
  const prDw = await prisma.program.create({ data: { code: 'PROG-DIGITAL-WALLONIA', name: 'Digital Wallonia', status: ProgramStatus.ACTIVE, ownerOrganizationId: orgAdn.id } });
  const prData = await prisma.program.create({ data: { code: 'PROG-DATA-WALLONIA', name: 'Data4Wallonia', status: ProgramStatus.ACTIVE, ownerOrganizationId: orgAdn.id } });
  const prMob = await prisma.program.create({ data: { code: 'PROG-S3-MOBILITE', name: 'S3 Mobilité Logistique', status: ProgramStatus.ACTIVE, ownerOrganizationId: orgLog.id } });
  const prPrw = await prisma.program.create({ data: { code: 'PROG-PRW', name: 'Plan de Relance de la Wallonie (PRW)', status: ProgramStatus.ACTIVE, ownerOrganizationId: orgSpw.id } });
  const prCheques = await prisma.program.create({ data: { code: 'PROG-CHEQUES', name: 'Chèques Entreprises', status: ProgramStatus.ACTIVE, ownerOrganizationId: orgWe.id } });

  // Mesures et Initiatives
  const mCirc = await prisma.measure.create({ data: { code: 'MEAS-CIRC', name: 'Mesure Éco-conception', budget: 1000000.0 } });
  const iniTestInvest = await prisma.initiative.create({ data: { measureId: mCirc.id, code: 'INI-TEST-BEFORE-INVEST', name: 'Test Before Invest', leadOrganizationId: orgSirris.id } });
  const iniEcodesign = await prisma.initiative.create({ data: { measureId: mCirc.id, code: 'INI-ECODESIGN-COACHING', name: 'Coaching en Éco-conception', leadOrganizationId: orgWe.id } });

  // 12. Les 22 Services Publics (PublicServices)
  console.log('🛎️ Création des 22 Services Publics...');
  const servicesData = [
    { code: 'S-DIAG-CIRC', name: 'Diagnostic Circularité', desc: 'Audit des flux de matières et d\'économie circulaire', org: orgWe },
    { code: 'S-COACH-ECODESIGN', name: 'Coaching Éco-design', desc: 'Coaching d\'ingénierie et de prototypage éco-conçu', org: orgSirris },
    { code: 'S-FUND-TRANS', name: 'Recherche Financement Transition', desc: 'Soutien financier et aides régionales à la transition durable', org: orgWe },
    { code: 'S-DIAG-CYBER', name: 'Diagnostic Cybersécurité PME', desc: 'Audit de sécurité des vulnérabilités logiques et physiques', org: orgCetic },
    { code: 'S-COACH-CYBER', name: 'Coaching Cybersécurité Implémentation', desc: 'Coaching pratique d\'installation des pare-feux et MFA', org: orgSirris },
    { code: 'S-AUDIT-CYBER-ADV', name: 'Audit de Sécurité Avancé', desc: 'Audit avancé de sécurité NIS2 avec test d\'intrusion', org: orgCetic },
    { code: 'S-DIAG-IA', name: 'Diagnostic IA & Opportunités', desc: 'Audit d\'opportunités d\'automatisation par IA', org: orgCetic },
    { code: 'S-TEST-INVEST-IA', name: 'Test Before Invest - IA', desc: 'Développement de démonstrateur algorithme IA', org: orgSirris },
    { code: 'S-COACH-ALGO-IA', name: 'Coaching Algorithmes IA', desc: 'Accompagnement de l\'équipe technique sur l\'intégration IA', org: orgSirris },
    { code: 'S-PROTO-MED-IA', name: 'Prototype Médical IA', desc: 'Prototypage certifié de modèles IA en santé', org: orgCetic },
    { code: 'S-FUND-INNOV', name: 'Financement Innovation Santé', desc: 'Montage et subventions de dossiers d\'innovation santé', org: orgWe },
    { code: 'S-INNOV-HYDRO', name: 'Accompagnement Innovation Hydrogène', desc: 'Accompagnement technique de fabrication hydrogène', org: orgSirris },
    { code: 'S-MATCH-PARTNERS', name: 'Recherche Partenaires Technologiques', desc: 'Recherche sémantique de sous-traitance territoriale', org: orgMeca },
    { code: 'S-AUDIT-IOT', name: 'Audit Capteurs & IoT', desc: 'Audit de couverture réseau LoRaWAN pour capteurs', org: orgSirris },
    { code: 'S-EXPORT-AWEX', name: 'Aide à l\'Exportation AWEX', desc: 'Accompagnement marketing d\'entrée sur les marchés cibles', org: orgAwex },
    { code: 'S-DIAG-GOV-DATA', name: 'Diagnostic Gouvernance des Données', desc: 'Audit de conformité des architectures data et RGPD', org: orgAdn },
    { code: 'S-COACH-DATA-ARCH', name: 'Coaching Data Architecture', desc: 'Coaching de conception technique de base de données', org: orgCetic },
    { code: 'S-CHEQUE-CYBER', name: 'Chèque Entreprise Cybersécurité', desc: 'Aide financière pour audit cyber agréé', org: orgSpw },
    { code: 'S-CHEQUE-INNOV', name: 'Chèque Entreprise Innovation', desc: 'Aide financière pour la formation aux éco-matériaux', org: orgSpw },
    { code: 'S-AUDIT-DECARBON', name: 'Audit Décarbonation Industrielle', desc: 'Bilan de récupération thermique et de décarbonation', org: orgGreen },
    { code: 'S-INNOV-SURFACE', name: 'Test d\'abrasion de Surface', desc: 'Test d\'usure et d\'abrasion accéléré en laboratoire', org: orgSirris },
    { code: 'S-INNOV-MECH', name: 'Validation Mécanique', desc: 'Validation de sécurité mécanique machine', org: orgSirris },
    { code: 'S-COACH-PITCH', name: 'Coaching Pitch Investisseurs', desc: 'Préparation et coaching au pitch de levée de fonds', org: orgWe }
  ];

  const services: { [key: string]: any } = {};
  for (const s of servicesData) {
    services[s.code] = await prisma.publicService.create({
      data: {
        code: s.code,
        name: s.name,
        description: s.desc,
        organizationId: s.org.id,
        catalogues: { connect: [{ id: cataloguePIT.id }] }
      }
    });
  }

  // 13. Parcours de Transformation (Journeys) & Étapes (Stages)
  console.log('🛣️ Création des 5 Parcours types (Journeys) et de leurs 35 stages...');
  const journeyTypes = [
    { code: 'JOURNEY-DIGITAL', name: 'Transformation Digitale', desc: 'Numérisation globale des processus PME' },
    { code: 'JOURNEY-IA', name: 'Transformation IA', desc: 'Adoption et intégration de l\'intelligence artificielle' },
    { code: 'JOURNEY-CYBERSECURITY', name: 'Cybersécurité PME', desc: 'Mise en conformité et sécurisation NIS2' },
    { code: 'JOURNEY-CIRCULARITE', name: 'Eco-conception & Circularité', desc: 'Éco-conception et boucles de matières durables' },
    { code: 'JOURNEY-INDUSTRIALISATION', name: 'Innovation & Industrialisation', desc: 'Accélération R&D et TRL' }
  ];

  const stageNames = ['Sensibilisation', 'Diagnostic', 'Coaching', 'Planification', 'Expérimentation', 'Déploiement', 'Suivi'];

  const journeys: { [key: string]: any } = {};
  const stages: { [key: string]: any[] } = {};

  for (const j of journeyTypes) {
    journeys[j.code] = await prisma.journey.create({
      data: {
        uri: `https://pit.wallonie.be/id/journey/${j.code.toLowerCase()}`,
        name: j.name,
        provider: 'PIT Wallonie',
        description: j.desc,
        targetAudience: ['PME', 'Startup']
      }
    });

    stages[j.code] = [];
    for (let i = 0; i < stageNames.length; i++) {
      const stage = await prisma.journeyStage.create({
        data: {
          name: stageNames[i],
          position: i + 1,
          journeyId: journeys[j.code].id
        }
      });
      stages[j.code].push(stage);
    }
  }

  // 14. Les 15 Bénéficiaires Territoriaux (Beneficiaries)
  console.log('🏢 Création des 15 Bénéficiaires Territoriaux...');
  const beneficiariesData = [
    { name: 'BioPlast SA', bce: '0812.345.678', size: 'PME', emp: 45, rev: 6200000.0, loc: 'Liège', nace: naceRecyc, s3: s3Circ, mD: 2, mI: 1, mC: 2, mE: 2, mDu: 1, prov: 'Liège', terr: cLiege },
    { name: 'Menuiserie Dupont', bce: '0876.543.210', size: 'TPE', emp: 8, rev: 950000.0, loc: 'Namur', nace: naceWood, s3: s3Num, mD: 2, mI: 1, mC: 1, mE: 1, mDu: 1, prov: 'Namur', terr: cNamur },
    { name: 'LogiTrans', bce: '0845.678.901', size: 'PME', emp: 85, rev: 14500000.0, loc: 'Charleroi', nace: naceLog, s3: s3Num, mD: 3, mI: 1, mC: 2, mE: 2, mDu: 1, prov: 'Hainaut', terr: cCharleroi },
    { name: 'MedTech Namur', bce: '0890.123.456', size: 'Startup', emp: 12, rev: 300000.0, loc: 'Namur', nace: nacePharma, s3: s3Sante, mD: 3, mI: 2, mC: 3, mE: 1, mDu: 1, prov: 'Namur', terr: cNamur },
    { name: 'HydroGreen', bce: '0823.456.789', size: 'Grande Entreprise', emp: 260, rev: 78000000.0, loc: 'Seraing', nace: naceGas, s3: s3Ener, mD: 4, mI: 3, mC: 4, mE: 3, mDu: 2, prov: 'Liège', terr: cLiege },
    { name: 'SmartFarm', bce: '0856.789.012', size: 'PME', emp: 14, rev: 1100000.0, loc: 'Bastogne', nace: naceAgri, s3: s3Num, mD: 1, mI: 1, mC: 1, mE: 1, mDu: 1, prov: 'Luxembourg', terr: cBastogne },
    { name: 'DataWall', bce: '0867.890.123', size: 'Startup', emp: 6, rev: 120000.0, loc: 'Louvain-la-Neuve', nace: naceProg, s3: s3Num, mD: 2, mI: 2, mC: 2, mE: 1, mDu: 1, prov: 'Brabant Wallon', terr: cLouvain },
    { name: 'RecyTech', bce: '0834.567.890', size: 'PME', emp: 38, rev: 4800000.0, loc: 'Mons', nace: naceRecyc, s3: s3Circ, mD: 2, mI: 1, mC: 2, mE: 1, mDu: 2, prov: 'Hainaut', terr: cMons },
    { name: 'CyberForge', bce: '0889.012.345', size: 'PME', emp: 22, rev: 3100000.0, loc: 'Liège', nace: naceConsult, s3: s3Num, mD: 4, mI: 2, mC: 3, mE: 1, mDu: 1, prov: 'Liège', terr: cLiege },
    { name: 'Mobility Next', bce: '0801.234.567', size: 'Startup', emp: 15, rev: 850000.0, loc: 'Nivelles', nace: naceTransport, s3: s3Num, mD: 3, mI: 3, mC: 3, mE: 1, mDu: 1, prov: 'Brabant Wallon', terr: cNivelles },
    { name: 'EcoBâtiment SPRL', bce: '0811.112.222', size: 'PME', emp: 25, rev: 3200000.0, loc: 'Libramont', nace: naceConst, s3: s3Circ, mD: 2, mI: 1, mC: 2, mE: 1, mDu: 1, prov: 'Luxembourg', terr: cLibramont },
    { name: 'AgroFood Wallonia', bce: '0822.223.333', size: 'PME', emp: 55, rev: 9800000.0, loc: 'Tournai', nace: naceFood, s3: s3Indus, mD: 2, mI: 1, mC: 2, mE: 1, mDu: 1, prov: 'Hainaut', terr: cTournai },
    { name: 'NanoTech Lab', bce: '0833.334.444', size: 'Startup', emp: 4, rev: 450000.0, loc: 'Liège', nace: naceResearch, s3: s3Ener, mD: 3, mI: 1, mC: 2, mE: 1, mDu: 1, prov: 'Liège', terr: cLiege },
    { name: 'GlassAlps', bce: '0844.445.555', size: 'Grande Entreprise', emp: 420, rev: 125000000.0, loc: 'Jumet', nace: naceGlass, s3: s3Circ, mD: 3, mI: 1, mC: 3, mE: 2, mDu: 2, prov: 'Hainaut', terr: cJumet },
    { name: 'SmartCity Charleroi', bce: '0855.556.666', size: 'Commune', emp: 1200, rev: 0.0, loc: 'Charleroi', nace: naceLog, s3: s3Num, mD: 2, mI: 1, mC: 2, mE: 1, mDu: 1, prov: 'Hainaut', terr: cCharleroi }
  ];

  const beneficiaries: { [key: string]: any } = {};
  for (const b of beneficiariesData) {
    beneficiaries[b.name] = await prisma.beneficiary.create({
      data: {
        name: b.name,
        bce: b.bce,
        size: b.size,
        employees: b.emp,
        revenue: b.rev,
        location: b.loc,
        province: b.prov,
        primaryNaceSectorId: b.nace.id,
        maturityDigital: b.mD,
        maturityIa: b.mI,
        maturityCyber: b.mC,
        maturityExport: b.mE,
        maturityDurability: b.mDu,
        territoryId: b.terr.id,
        filieresS3: { connect: [{ id: svcCirc.id }] } // Retro-compat
      }
    });
  }

  // 15. Inscriptions de Parcours (JourneyEnrollments - 15 Instances)
  console.log('🛤️ Création des 15 Inscriptions de Parcours (JourneyEnrollments)...');
  const enrollmentMap = [
    { ben: 'BioPlast SA', jCode: 'JOURNEY-CIRCULARITE', stagePos: 3, status: 'IN_PROGRESS', rate: 42.0 },
    { ben: 'Menuiserie Dupont', jCode: 'JOURNEY-CYBERSECURITY', stagePos: 3, status: 'IN_PROGRESS', rate: 28.0 },
    { ben: 'LogiTrans', jCode: 'JOURNEY-IA', stagePos: 3, status: 'IN_PROGRESS', rate: 35.0 },
    { ben: 'MedTech Namur', jCode: 'JOURNEY-INDUSTRIALISATION', stagePos: 3, status: 'IN_PROGRESS', rate: 45.0 },
    { ben: 'HydroGreen', jCode: 'JOURNEY-INDUSTRIALISATION', stagePos: 4, status: 'IN_PROGRESS', rate: 57.0 },
    { ben: 'SmartFarm', jCode: 'JOURNEY-DIGITAL', stagePos: 2, status: 'IN_PROGRESS', rate: 14.0 },
    { ben: 'DataWall', jCode: 'JOURNEY-DIGITAL', stagePos: 3, status: 'IN_PROGRESS', rate: 30.0 },
    { ben: 'RecyTech', jCode: 'JOURNEY-CIRCULARITE', stagePos: 3, status: 'IN_PROGRESS', rate: 40.0 },
    { ben: 'CyberForge', jCode: 'JOURNEY-CYBERSECURITY', stagePos: 7, status: 'COMPLETED', rate: 100.0 },
    { ben: 'Mobility Next', jCode: 'JOURNEY-INDUSTRIALISATION', stagePos: 3, status: 'IN_PROGRESS', rate: 38.0 },
    { ben: 'EcoBâtiment SPRL', jCode: 'JOURNEY-CIRCULARITE', stagePos: 2, status: 'IN_PROGRESS', rate: 15.0 },
    { ben: 'AgroFood Wallonia', jCode: 'JOURNEY-IA', stagePos: 3, status: 'IN_PROGRESS', rate: 32.0 },
    { ben: 'NanoTech Lab', jCode: 'JOURNEY-INDUSTRIALISATION', stagePos: 3, status: 'IN_PROGRESS', rate: 40.0 },
    { ben: 'GlassAlps', jCode: 'JOURNEY-INDUSTRIALISATION', stagePos: 2, status: 'IN_PROGRESS', rate: 20.0 },
    { ben: 'SmartCity Charleroi', jCode: 'JOURNEY-IA', stagePos: 3, status: 'IN_PROGRESS', rate: 30.0 }
  ];

  const enrollments: { [key: string]: any } = {};
  for (const e of enrollmentMap) {
    const stage = stages[e.jCode][e.stagePos - 1];
    enrollments[e.ben] = await prisma.journeyEnrollment.create({
      data: {
        beneficiaryId: beneficiaries[e.ben].id,
        journeyId: journeys[e.jCode].id,
        currentStageId: stage.id,
        status: e.status,
        completionRate: e.rate
      }
    });
  }

  // 16. Réalisations de Prestations Réelles (ServiceDeliveries - 30 Deliveries)
  console.log('📦 Création des 30 Prestations Réelles (ServiceDeliveries)...');
  const deliveriesData = [
    // CAS 1 : BioPlast
    { ben: 'BioPlast SA', sCode: 'S-DIAG-CIRC', jCode: 'JOURNEY-CIRCULARITE', stPos: 2, op: orgWe, date: '2026-04-15', status: ServiceDeliveryStatus.COMPLETED, out: 'Diagnostic circularité terminé', file: 'audit_bioplast_circ.pdf' },
    { ben: 'BioPlast SA', sCode: 'S-COACH-ECODESIGN', jCode: 'JOURNEY-CIRCULARITE', stPos: 3, op: orgSirris, date: '2026-05-10', status: ServiceDeliveryStatus.COMPLETED, out: 'Prototypage plastique recyclable validé', file: 'roadmap_bioplast_ecodesign.pdf' },
    { ben: 'BioPlast SA', sCode: 'S-FUND-TRANS', jCode: 'JOURNEY-CIRCULARITE', stPos: 4, op: orgWe, date: '2026-06-12', status: ServiceDeliveryStatus.IN_PROGRESS, out: 'Planification de la recherche de subventions', file: '' },
    // CAS 2 : Menuiserie Dupont
    { ben: 'Menuiserie Dupont', sCode: 'S-DIAG-CYBER', jCode: 'JOURNEY-CYBERSECURITY', stPos: 2, op: orgCetic, date: '2026-03-12', status: ServiceDeliveryStatus.COMPLETED, out: 'Audit de sécurité logique mené', file: 'audit_dupont_cyber.pdf' },
    { ben: 'Menuiserie Dupont', sCode: 'S-COACH-CYBER', jCode: 'JOURNEY-CYBERSECURITY', stPos: 3, op: orgSirris, date: '2026-05-05', status: ServiceDeliveryStatus.COMPLETED, out: 'Sauvegardes et MFA activés', file: 'attestation_cyber_mfa.pdf' },
    // CAS 3 : LogiTrans
    { ben: 'LogiTrans', sCode: 'S-DIAG-IA', jCode: 'JOURNEY-IA', stPos: 2, op: orgCetic, date: '2026-02-12', status: ServiceDeliveryStatus.COMPLETED, out: 'Rapport de faisabilité IA rédigé', file: 'audit_logitrans_ia.pdf' },
    { ben: 'LogiTrans', sCode: 'S-TEST-INVEST-IA', jCode: 'JOURNEY-IA', stPos: 5, op: orgSirris, date: '2026-04-18', status: ServiceDeliveryStatus.COMPLETED, out: 'Prototype de routage validé', file: 'rapport_prototype_routing.pdf' },
    // CAS 4 : MedTech Namur
    { ben: 'MedTech Namur', sCode: 'S-PROTO-MED-IA', jCode: 'JOURNEY-INDUSTRIALISATION', stPos: 5, op: orgCetic, date: '2026-01-22', status: ServiceDeliveryStatus.COMPLETED, out: 'Validation clinique IA d\'imagerie', file: 'rapport_clinique_ia.pdf' },
    { ben: 'MedTech Namur', sCode: 'S-FUND-INNOV', jCode: 'JOURNEY-INDUSTRIALISATION', stPos: 4, op: orgWe, date: '2026-04-15', status: ServiceDeliveryStatus.COMPLETED, out: 'Fonds FEDER accordés', file: 'decision_financement_feder.pdf' },
    // CAS 5 : HydroGreen
    { ben: 'HydroGreen', sCode: 'S-INNOV-HYDRO', jCode: 'JOURNEY-INDUSTRIALISATION', stPos: 5, op: orgSirris, date: '2026-02-15', status: ServiceDeliveryStatus.COMPLETED, out: 'Ingénierie électrolyseur certifiée', file: 'safety_report_hydrogen.pdf' },
    { ben: 'HydroGreen', sCode: 'S-MATCH-PARTNERS', jCode: 'JOURNEY-INDUSTRIALISATION', stPos: 4, op: orgMeca, date: '2026-04-30', status: ServiceDeliveryStatus.COMPLETED, out: 'Consortium de 5 sous-traitants signé', file: 'consortium_agreement_mecatech.pdf' },
    // CAS 6 : SmartFarm
    { ben: 'SmartFarm', sCode: 'S-AUDIT-IOT', jCode: 'JOURNEY-DIGITAL', stPos: 2, op: orgSirris, date: '2026-03-20', status: ServiceDeliveryStatus.COMPLETED, out: 'Audit couverture LoRa et capteurs', file: 'architect_report_lora.pdf' },
    // CAS 7 : DataWall
    { ben: 'DataWall', sCode: 'S-DIAG-GOV-DATA', jCode: 'JOURNEY-DIGITAL', stPos: 2, op: orgAdn, date: '2026-04-05', status: ServiceDeliveryStatus.COMPLETED, out: 'Audit RGPD et traitement complété', file: 'gdpr_compliance_report.pdf' },
    { ben: 'DataWall', sCode: 'S-COACH-DATA-ARCH', jCode: 'JOURNEY-DIGITAL', stPos: 3, op: orgCetic, date: '2026-05-15', status: ServiceDeliveryStatus.COMPLETED, out: 'Schéma d\'anonymisation validé', file: 'data_encryption_schema.png' },
    // CAS 8 : RecyTech
    { ben: 'RecyTech', sCode: 'S-DIAG-CIRC', jCode: 'JOURNEY-CIRCULARITE', stPos: 2, op: orgWe, date: '2026-03-10', status: ServiceDeliveryStatus.COMPLETED, out: 'Faisabilité tri polymères validée', file: 'feasibility_sorting_polymer.pdf' },
    { ben: 'RecyTech', sCode: 'S-AUDIT-DECARBON', jCode: 'JOURNEY-CIRCULARITE', stPos: 2, op: orgGreen, date: '2026-05-18', status: ServiceDeliveryStatus.COMPLETED, out: 'Audit isolation fours thermiques', file: 'thermal_audit_recytech.pdf' },
    // CAS 9 : CyberForge
    { ben: 'CyberForge', sCode: 'S-AUDIT-CYBER-ADV', jCode: 'JOURNEY-CYBERSECURITY', stPos: 2, op: orgCetic, date: '2026-02-02', status: ServiceDeliveryStatus.COMPLETED, out: 'Conformité NIS2 certifiée', file: 'nis2_audit_report.pdf' },
    { ben: 'CyberForge', sCode: 'S-EXPORT-AWEX', jCode: 'JOURNEY-CYBERSECURITY', stPos: 6, op: orgAwex, date: '2026-05-28', status: ServiceDeliveryStatus.COMPLETED, out: 'Plan export pour l\'Allemagne validé', file: 'german_market_entry_plan.pdf' },
    // CAS 10 : Mobility Next
    { ben: 'Mobility Next', sCode: 'S-INNOV-MECH', jCode: 'JOURNEY-INDUSTRIALISATION', stPos: 5, op: orgSirris, date: '2026-01-10', status: ServiceDeliveryStatus.COMPLETED, out: 'Validation mécanique et marquage CE', file: 'ce_conformity_report.pdf' },
    { ben: 'Mobility Next', sCode: 'S-MATCH-PARTNERS', jCode: 'JOURNEY-INDUSTRIALISATION', stPos: 4, op: orgLog, date: '2026-03-20', status: ServiceDeliveryStatus.COMPLETED, out: 'Contrat d\'expérimentation pilote signé', file: 'pilot_site_contract.pdf' },
    // CAS 11 : EcoBâtiment
    { ben: 'EcoBâtiment SPRL', sCode: 'S-DIAG-CIRC', jCode: 'JOURNEY-CIRCULARITE', stPos: 2, op: orgWe, date: '2026-04-11', status: ServiceDeliveryStatus.COMPLETED, out: 'Analyse circuit court chanvre validée', file: 'feasibility_biosourced_materials.pdf' },
    // CAS 12 : AgroFood Wallonia
    { ben: 'AgroFood Wallonia', sCode: 'S-DIAG-IA', jCode: 'JOURNEY-IA', stPos: 2, op: orgCetic, date: '2026-02-18', status: ServiceDeliveryStatus.COMPLETED, out: 'Faisabilité vibratoire capteurs', file: 'sensor_connectivity_report.pdf' },
    { ben: 'AgroFood Wallonia', sCode: 'S-TEST-INVEST-IA', jCode: 'JOURNEY-IA', stPos: 5, op: orgSirris, date: '2026-05-03', status: ServiceDeliveryStatus.COMPLETED, out: 'Modèle IA alertes pannes vibratoire', file: 'predictive_maintenance_mvp.pdf' },
    // CAS 13 : NanoTech Lab
    { ben: 'NanoTech Lab', sCode: 'S-INNOV-SURFACE', jCode: 'JOURNEY-INDUSTRIALISATION', stPos: 5, op: orgSirris, date: '2026-03-12', status: ServiceDeliveryStatus.COMPLETED, out: 'Vieillissement 1000h UV validé', file: 'aging_test_report_1000h.pdf' },
    { ben: 'NanoTech Lab', sCode: 'S-COACH-PITCH', jCode: 'JOURNEY-INDUSTRIALISATION', stPos: 3, op: orgWe, date: '2026-04-25', status: ServiceDeliveryStatus.COMPLETED, out: 'Deck de présentation d\'amorçage signé', file: 'investment_deck_signed.pdf' },
    // CAS 14 : GlassAlps
    { ben: 'GlassAlps', sCode: 'S-AUDIT-DECARBON', jCode: 'JOURNEY-INDUSTRIALISATION', stPos: 2, op: orgGreen, date: '2026-04-19', status: ServiceDeliveryStatus.COMPLETED, out: 'Audit chaleur fatale verrerie', file: 'thermal_recovery_audit_glass.pdf' },
    // CAS 15 : SmartCity Charleroi
    { ben: 'SmartCity Charleroi', sCode: 'S-DIAG-IA', jCode: 'JOURNEY-IA', stPos: 2, op: orgCetic, date: '2026-03-08', status: ServiceDeliveryStatus.COMPLETED, out: 'Diagnostic tournées collectives', file: 'waste_routing_feasibility.pdf' },
    { ben: 'SmartCity Charleroi', sCode: 'S-TEST-INVEST-IA', jCode: 'JOURNEY-IA', stPos: 5, op: orgSirris, date: '2026-05-24', status: ServiceDeliveryStatus.COMPLETED, out: 'Algorithme d\'itinéraires dynamiques validé', file: 'routing_algorithm_results.pdf' },
    
    // 2 Livraisons Supplémentaires pour atteindre 30
    { ben: 'GlassAlps', sCode: 'S-DIAG-CIRC', jCode: 'JOURNEY-INDUSTRIALISATION', stPos: 2, op: orgWe, date: '2026-05-12', status: ServiceDeliveryStatus.PLANNED, out: 'Planification d\'audit circularité matières', file: '' },
    { ben: 'SmartFarm', sCode: 'S-CHEQUE-INNOV', jCode: 'JOURNEY-DIGITAL', stPos: 3, op: orgSpw, date: '2026-05-22', status: ServiceDeliveryStatus.IN_PROGRESS, out: 'Montage dossier formation IoT', file: '' }
  ];

  for (const d of deliveriesData) {
    const stage = stages[d.jCode][d.stPos - 1];
    const delivery = await prisma.serviceDelivery.create({
      data: {
        beneficiaryId: beneficiaries[d.ben].id,
        serviceId: services[d.sCode].id,
        journeyId: journeys[d.jCode].id,
        journeyStageId: stage.id,
        status: d.status,
        date: new Date(d.date),
        operatorId: d.op.id,
        outputReal: d.out,
        journeyEnrollmentId: enrollments[d.ben] ? enrollments[d.ben].id : null,
        evidenceFiles: d.file ? [d.file] : []
      }
    });

    // Création de l'entité Evidence physique
    if (d.file) {
      await prisma.evidence.create({
        data: {
          name: d.file,
          type: 'PDF',
          file: d.file,
          url: `https://pit-storage.wallonie.be/blobs/${d.file}`,
          serviceDeliveryId: delivery.id
        }
      });
    }
  }

  // 17. Indicateurs d'Impacts & Résultats Rels (OutcomeIndicators & Impacts)
  console.log('📈 Création des Impacts et Indicateurs (ROI Territorial)...');
  const indJobs = await prisma.outcomeIndicator.create({ data: { name: 'Emplois créés', unit: 'ETP' } });
  const indCo2 = await prisma.outcomeIndicator.create({ data: { name: 'Réduction CO2', unit: 'tonnes' } });
  const indRevenue = await prisma.outcomeIndicator.create({ data: { name: 'Chiffre d\'affaires additionnel', unit: 'EUR' } });
  const indMatSaved = await prisma.outcomeIndicator.create({ data: { name: 'Économie de matières premières', unit: 'tonnes' } });

  const impactsData = [
    // CO2
    { ben: 'BioPlast SA', ind: indCo2, val: 45.0, desc: 'Réduction émissions polymères recyclés' },
    { ben: 'LogiTrans', ind: indCo2, val: 110.0, desc: 'Kilométrage routage optimisé IA' },
    { ben: 'RecyTech', ind: indCo2, val: 140.0, desc: 'Réduction process fours décarbonés' },
    { ben: 'GlassAlps', ind: indCo2, val: 1200.0, desc: 'Décarbonation thermique verrerie flat' },
    { ben: 'SmartCity Charleroi', ind: indCo2, val: 12.0, desc: 'Collecte déchets optimisée' },
    // Matières
    { ben: 'BioPlast SA', ind: indMatSaved, val: 120.0, desc: 'Plastique vierge économisé/an' },
    { ben: 'RecyTech', ind: indMatSaved, val: 350.0, desc: 'ABS valorisé localement/an' },
    // Emplois
    { ben: 'MedTech Namur', ind: indJobs, val: 3.0, desc: 'Chercheurs médicaux recrutés' },
    { ben: 'Mobility Next', ind: indJobs, val: 2.0, desc: 'Ingénieurs d\'intégration robotique recrutés' },
    // CA / Financements (Subventions réelles converties en impacts de CA)
    { ben: 'CyberForge', ind: indRevenue, val: 120000.0, desc: 'Contrats exportations Allemagne NIS2' }
  ];

  for (const imp of impactsData) {
    await prisma.impact.create({
      data: {
        beneficiaryId: beneficiaries[imp.ben].id,
        indicatorId: imp.ind.id,
        numericValue: imp.val,
        textValue: imp.desc,
        date: new Date()
      }
    });
  }

  // 18. Catalogues théoriques Outcomes
  console.log('💡 Création des Outcomes attendus théoriques...');
  const outcomeNames = [
    'Rapport de circularité validé',
    'Ingénierie éco-conçue certifiée',
    'Preuve d\'isolation thermique établie',
    'Diagnostic cyber complété',
    'Activation double facteur MFA',
    'Conformité NIS2 auditée',
    'Diagnostic d\'opportunités IA validé',
    'Démonstrateur IA fonctionnel',
    'Pipeline d\'algorithme IA déployé',
    'Prototype clinique IA validé',
    'Ingénierie hydrogène mécanique validée',
    'Consortium industriel répertorié',
    'Réseau d\'architecture LoRa validé',
    'Diagnostic de traitement RGPD documenté',
    'Attestation d\'abrasion UV validée'
  ];

  for (let i = 0; i < outcomeNames.length; i++) {
    // Liaison aux services correspondants
    const sId = services[Object.keys(services)[i % Object.keys(services).length]].id;
    await prisma.outcome.create({
      data: {
        name: outcomeNames[i],
        publicServiceId: sId
      }
    });
  }

  console.log('🏁 Fin du peuplement avec succès. PIT_DEMO_DATASET_1.0 chargé !');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du peuplement :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

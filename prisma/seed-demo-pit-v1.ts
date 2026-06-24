import { PrismaClient, TerritoryType, ProgramStatus } from '@prisma/client';

enum ServiceDeliveryStatus {
  PLANNED = 'planned',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'delivered',
  CANCELLED = 'cancelled'
}

const prisma = new PrismaClient();

async function upsertOutcomeIndicator(name: string, unit: string) {
  let indicator = await prisma.outcomeIndicator.findFirst({ where: { name } });
  if (indicator) {
    indicator = await prisma.outcomeIndicator.update({
      where: { id: indicator.id },
      data: { unit }
    });
  } else {
    indicator = await prisma.outcomeIndicator.create({
      data: { name, unit }
    });
  }
  return indicator;
}

async function main() {
  const isReset = process.argv.includes('--reset');
  console.log(`🌱 Début du peuplement du Dataset Démonstrateur 1.0 (${isReset ? 'RESET' : 'APPEND'})...`);

  // 1. Nettoyage de la base de données en mode RESET
  if (isReset) {
    console.log('🧹 Mode RESET : Nettoyage des anciennes données...');
    
    // Phase 4.2 / Resilience tables (delete order to prevent FK violations)
    await prisma.resilienceAuditLog.deleteMany({});
    await prisma.policyEvidence.deleteMany({});
    await prisma.policyEvidenceSource.deleteMany({});
    await prisma.policyEvaluation.deleteMany({});
    await prisma.policyOutcome.deleteMany({});
    await prisma.policyMeasure.deleteMany({});
    await prisma.policyObjective.deleteMany({});
    await prisma.territorialObservation.deleteMany({});
    await prisma.territorialIndicator.deleteMany({});
    await prisma.impactAssessment.deleteMany({});
    await prisma.impactRule.deleteMany({});
    await prisma.resilienceMeasure.deleteMany({});
    await prisma.resilienceImpact.deleteMany({});
    await prisma.resilienceProfile.deleteMany({});
    await prisma.riskAssessment.deleteMany({});
    await prisma.scenario.deleteMany({});
    await prisma.threat.deleteMany({});
    await prisma.hazard.deleteMany({});
    await prisma.risk.deleteMany({});
    await prisma.riskRegister.deleteMany({});
    await prisma.vulnerability.deleteMany({});
    await prisma.dependency.deleteMany({});
    await prisma.criticalInfrastructure.deleteMany({});
    await prisma.territorialAsset.deleteMany({});
    await prisma.pitRecommendation.deleteMany({});

    // Baseline tables
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
  }

  // 2. Canaux (Channels)
  console.log('📥 Création des Canaux...');
  const chWeb = await prisma.channel.upsert({
    where: { uri: 'https://pit.wallonie.be/id/channel/ch-web' },
    update: {},
    create: { uri: 'https://pit.wallonie.be/id/channel/ch-web', name: 'Plateforme Web', code: 'CH-WEB' }
  });
  const chRdv = await prisma.channel.upsert({
    where: { uri: 'https://pit.wallonie.be/id/channel/ch-rdv' },
    update: {},
    create: { uri: 'https://pit.wallonie.be/id/channel/ch-rdv', name: 'Rendez-vous individuel', code: 'CH-RDV' }
  });

  // 3. Publics Cibles (TargetAudiences)
  console.log('👥 Création des Publics Cibles...');
  const taPme = await prisma.targetAudience.upsert({
    where: { uri: 'https://pit.wallonie.be/id/target-audience/pme' },
    update: {},
    create: { uri: 'https://pit.wallonie.be/id/target-audience/pme', name: 'PME wallonne', code: 'TA-PME' }
  });
  const taStartup = await prisma.targetAudience.upsert({
    where: { uri: 'https://pit.wallonie.be/id/target-audience/startup' },
    update: {},
    create: { uri: 'https://pit.wallonie.be/id/target-audience/startup', name: 'Startup', code: 'TA-STARTUP' }
  });

  // 3b. Catalogue
  console.log('📚 Création du Catalogue de référence...');
  const cataloguePIT = await prisma.catalogue.upsert({
    where: { uri: 'https://pit.wallonie.be/id/catalogue/pit-services' },
    update: {},
    create: {
      uri: 'https://pit.wallonie.be/id/catalogue/pit-services',
      name: 'Catalogue des Services Territoriaux de la PIT',
      description: 'Référentiel des aides, diagnostics et accompagnements pour les entreprises wallonnes.',
      code: 'CAT-PIT',
    },
  });

  // 4. Niveaux d'intervention & Types d'intervention
  console.log('📊 Création des Niveaux d\'Intervention...');
  const ilIndiv = await prisma.interventionLevel.upsert({
    where: { code: 'INDIVIDUAL' },
    update: {},
    create: { code: 'INDIVIDUAL', name: 'Accompagnement individuel' }
  });
  const itService = await prisma.interventionType.upsert({
    where: { code: 'SERVICE' },
    update: {},
    create: { code: 'SERVICE', name: 'Service' }
  });

  // 5. Types d'Écosystèmes
  console.log('🌐 Création des Types d\'Écosystèmes...');
  const etEdih = await prisma.ecosystemType.upsert({ where: { code: 'EDIH' }, update: {}, create: { code: 'EDIH', name: 'EDIH' } });
  const etCluster = await prisma.ecosystemType.upsert({ where: { code: 'CLUSTER' }, update: {}, create: { code: 'CLUSTER', name: 'Cluster d\'innovation' } });
  const etPole = await prisma.ecosystemType.upsert({ where: { code: 'POLE_COMPETITIVITE' }, update: {}, create: { code: 'POLE_COMPETITIVITE', name: 'Pôle de compétitivité' } });
  const etNetwork = await prisma.ecosystemType.upsert({ where: { code: 'NETWORK' }, update: {}, create: { code: 'NETWORK', name: 'Réseau' } });
  const etCommunity = await prisma.ecosystemType.upsert({ where: { code: 'COMMUNITY' }, update: {}, create: { code: 'COMMUNITY', name: 'Communauté' } });
  const etHub = await prisma.ecosystemType.upsert({ where: { code: 'HUB_INNOVATION' }, update: {}, create: { code: 'HUB_INNOVATION', name: 'Hub d\'innovation' } });

  // 6. Territoires
  console.log('📍 Création de la hiérarchie territoriale...');
  const tWall = await prisma.territory.upsert({
    where: { code: 'WAL' },
    update: {},
    create: { code: 'WAL', name: 'Wallonie', type: TerritoryType.REGION, uri: 'https://pit.wallonie.be/id/territory/wal' }
  });
  
  const provLiege = await prisma.territory.upsert({
    where: { code: 'BE-WLG' },
    update: {},
    create: { code: 'BE-WLG', name: 'Liège', type: TerritoryType.PROVINCE, parentTerritoryId: tWall.id, uri: 'https://pit.wallonie.be/id/territory/be-wlg' }
  });
  const provNamur = await prisma.territory.upsert({
    where: { code: 'BE-WNM' },
    update: {},
    create: { code: 'BE-WNM', name: 'Namur', type: TerritoryType.PROVINCE, parentTerritoryId: tWall.id, uri: 'https://pit.wallonie.be/id/territory/be-wnm' }
  });
  const provHainaut = await prisma.territory.upsert({
    where: { code: 'BE-WHT' },
    update: {},
    create: { code: 'BE-WHT', name: 'Hainaut', type: TerritoryType.PROVINCE, parentTerritoryId: tWall.id, uri: 'https://pit.wallonie.be/id/territory/be-wht' }
  });
  const provBrabant = await prisma.territory.upsert({
    where: { code: 'BE-WBR' },
    update: {},
    create: { code: 'BE-WBR', name: 'Brabant Wallon', type: TerritoryType.PROVINCE, parentTerritoryId: tWall.id, uri: 'https://pit.wallonie.be/id/territory/be-wbr' }
  });
  const provLux = await prisma.territory.upsert({
    where: { code: 'BE-WLX' },
    update: {},
    create: { code: 'BE-WLX', name: 'Luxembourg', type: TerritoryType.PROVINCE, parentTerritoryId: tWall.id, uri: 'https://pit.wallonie.be/id/territory/be-wlx' }
  });

  const valVesdre = await prisma.territory.upsert({
    where: { code: 'VAL-VESDRE' },
    update: {},
    create: { code: 'VAL-VESDRE', name: 'Vallée de la Vesdre', type: TerritoryType.ARRONDISSEMENT, parentTerritoryId: provLiege.id, uri: 'https://pit.wallonie.be/id/territory/val-vesdre' }
  });

  const cNamur = await prisma.territory.upsert({ where: { code: 'COMM-NAMUR' }, update: {}, create: { code: 'COMM-NAMUR', name: 'Ville de Namur', type: TerritoryType.COMMUNE, parentTerritoryId: provNamur.id, uri: 'https://pit.wallonie.be/id/territory/comm-namur' } });
  const cCharleroi = await prisma.territory.upsert({ where: { code: 'COMM-CHARLEROI' }, update: {}, create: { code: 'COMM-CHARLEROI', name: 'Charleroi', type: TerritoryType.COMMUNE, parentTerritoryId: provHainaut.id, uri: 'https://pit.wallonie.be/id/territory/comm-charleroi' } });
  const cLiege = await prisma.territory.upsert({ where: { code: 'COMM-LIEGE' }, update: {}, create: { code: 'COMM-LIEGE', name: 'Ville de Liège', type: TerritoryType.COMMUNE, parentTerritoryId: provLiege.id, uri: 'https://pit.wallonie.be/id/territory/comm-liege' } });
  const cWavre = await prisma.territory.upsert({ where: { code: 'COMM-WAVRE' }, update: {}, create: { code: 'COMM-WAVRE', name: 'Wavre', type: TerritoryType.COMMUNE, parentTerritoryId: provBrabant.id, uri: 'https://pit.wallonie.be/id/territory/comm-wavre' } });
  const cBastogne = await prisma.territory.upsert({ where: { code: 'COMM-BASTOGNE' }, update: {}, create: { code: 'COMM-BASTOGNE', name: 'Bastogne', type: TerritoryType.COMMUNE, parentTerritoryId: provLux.id, uri: 'https://pit.wallonie.be/id/territory/comm-bastogne' } });
  const cLouvain = await prisma.territory.upsert({ where: { code: 'COMM-LLN' }, update: {}, create: { code: 'COMM-LLN', name: 'Louvain-la-Neuve', type: TerritoryType.COMMUNE, parentTerritoryId: provBrabant.id, uri: 'https://pit.wallonie.be/id/territory/comm-lln' } });
  const cMons = await prisma.territory.upsert({ where: { code: 'COMM-MONS' }, update: {}, create: { code: 'COMM-MONS', name: 'Mons', type: TerritoryType.COMMUNE, parentTerritoryId: provHainaut.id, uri: 'https://pit.wallonie.be/id/territory/comm-mons' } });
  const cNivelles = await prisma.territory.upsert({ where: { code: 'COMM-NIVELLES' }, update: {}, create: { code: 'COMM-NIVELLES', name: 'Nivelles', type: TerritoryType.COMMUNE, parentTerritoryId: provBrabant.id, uri: 'https://pit.wallonie.be/id/territory/comm-nivelles' } });
  const cLibramont = await prisma.territory.upsert({ where: { code: 'COMM-LIBRAMONT' }, update: {}, create: { code: 'COMM-LIBRAMONT', name: 'Libramont', type: TerritoryType.COMMUNE, parentTerritoryId: provLux.id, uri: 'https://pit.wallonie.be/id/territory/comm-libramont' } });
  const cTournai = await prisma.territory.upsert({ where: { code: 'COMM-TOURNAI' }, update: {}, create: { code: 'COMM-TOURNAI', name: 'Tournai', type: TerritoryType.COMMUNE, parentTerritoryId: provHainaut.id, uri: 'https://pit.wallonie.be/id/territory/comm-tournai' } });
  const cJumet = await prisma.territory.upsert({ where: { code: 'COMM-JUMET' }, update: {}, create: { code: 'COMM-JUMET', name: 'Jumet', type: TerritoryType.COMMUNE, parentTerritoryId: provHainaut.id, uri: 'https://pit.wallonie.be/id/territory/comm-jumet' } });

  // 7. Organisations
  console.log('🏢 Création des 10 Organisations...');
  const orgAdn = await prisma.organization.upsert({ where: { uri: 'https://pit.wallonie.be/id/organization/adn' }, update: {}, create: { uri: 'https://pit.wallonie.be/id/organization/adn', name: 'Agence du Numérique', code: 'ORG-ADN', type: 'Opérateur public' } });
  const orgWe = await prisma.organization.upsert({ where: { uri: 'https://pit.wallonie.be/id/organization/we' }, update: {}, create: { uri: 'https://pit.wallonie.be/id/organization/we', name: 'Wallonie Entreprendre', code: 'ORG-WE', type: 'Financeur' } });
  const orgAwex = await prisma.organization.upsert({ where: { uri: 'https://pit.wallonie.be/id/organization/awex' }, update: {}, create: { uri: 'https://pit.wallonie.be/id/organization/awex', name: 'AWEX', code: 'ORG-AWEX', type: 'Opérateur public' } });
  const orgSpw = await prisma.organization.upsert({ where: { uri: 'https://pit.wallonie.be/id/organization/spw' }, update: {}, create: { uri: 'https://pit.wallonie.be/id/organization/spw', name: 'SPW', code: 'ORG-SPW', type: 'Administration' } });
  const orgForem = await prisma.organization.upsert({ where: { uri: 'https://pit.wallonie.be/id/organization/forem' }, update: {}, create: { uri: 'https://pit.wallonie.be/id/organization/forem', name: 'Forem', code: 'ORG-FOREM', type: 'Opérateur public' } });
  const orgSirris = await prisma.organization.upsert({ where: { uri: 'https://pit.wallonie.be/id/organization/sirris' }, update: {}, create: { uri: 'https://pit.wallonie.be/id/organization/sirris', name: 'Sirris', code: 'ORG-SIRRIS', type: 'Centre de recherche' } });
  const orgCetic = await prisma.organization.upsert({ where: { uri: 'https://pit.wallonie.be/id/organization/cetic' }, update: {}, create: { uri: 'https://pit.wallonie.be/id/organization/cetic', name: 'CETIC', code: 'ORG-CETIC', type: 'Centre de recherche' } });
  const orgMeca = await prisma.organization.upsert({ where: { uri: 'https://pit.wallonie.be/id/organization/mecatech' }, update: {}, create: { uri: 'https://pit.wallonie.be/id/organization/mecatech', name: 'MecaTech', code: 'ORG-MECATECH', type: 'Pôle de compétitivité' } });
  const orgLog = await prisma.organization.upsert({ where: { uri: 'https://pit.wallonie.be/id/organization/logistics-in-wallonia' }, update: {}, create: { uri: 'https://pit.wallonie.be/id/organization/logistics-in-wallonia', name: 'Logistics in Wallonia', code: 'ORG-LOG', type: 'Pôle de compétitivité' } });
  const orgGreen = await prisma.organization.upsert({ where: { uri: 'https://pit.wallonie.be/id/organization/greenwin' }, update: {}, create: { uri: 'https://pit.wallonie.be/id/organization/greenwin', name: 'GreenWin', code: 'ORG-GREEN', type: 'Pôle de compétitivité' } });

  // 8. Écosystèmes Régionaux
  console.log('🌐 Création des Écosystèmes...');
  const ecoEdih = await prisma.ecosystem.upsert({
    where: { uri: 'https://pit.wallonie.be/id/ecosystem/edih' },
    update: {},
    create: { uri: 'https://pit.wallonie.be/id/ecosystem/edih', name: 'EDIH Wallonia', territory: 'Wallonie', typeId: etEdih.id, actors: { connect: [{ id: orgAdn.id }, { id: orgWe.id }, { id: orgSirris.id }, { id: orgCetic.id }] } }
  });
  const ecoCirc = await prisma.ecosystem.upsert({
    where: { uri: 'https://pit.wallonie.be/id/ecosystem/circular' },
    update: {},
    create: { uri: 'https://pit.wallonie.be/id/ecosystem/circular', name: 'Circular Wallonia Network', territory: 'Wallonie', typeId: etNetwork.id, actors: { connect: [{ id: orgWe.id }, { id: orgGreen.id }] } }
  });
  const ecoBio = await prisma.ecosystem.upsert({
    where: { uri: 'https://pit.wallonie.be/id/ecosystem/biowin' },
    update: {},
    create: { uri: 'https://pit.wallonie.be/id/ecosystem/biowin', name: 'BioWin', territory: 'Wallonie', typeId: etPole.id, actors: { connect: [{ id: orgWe.id }, { id: orgCetic.id }] } }
  });
  const ecoHub = await prisma.ecosystem.upsert({
    where: { uri: 'https://pit.wallonie.be/id/ecosystem/walhub' },
    update: {},
    create: { uri: 'https://pit.wallonie.be/id/ecosystem/walhub', name: 'WalHub', territory: 'Wallonie', typeId: etHub.id, actors: { connect: [{ id: orgAdn.id }, { id: orgSirris.id }] } }
  });
  const ecoCyber = await prisma.ecosystem.upsert({
    where: { uri: 'https://pit.wallonie.be/id/ecosystem/cyber' },
    update: {},
    create: { uri: 'https://pit.wallonie.be/id/ecosystem/cyber', name: 'CyberSecurity Coalition Wallonie', territory: 'Wallonie', typeId: etCommunity.id, actors: { connect: [{ id: orgCetic.id }, { id: orgAdn.id }] } }
  });
  const ecoTweed = await prisma.ecosystem.upsert({
    where: { uri: 'https://pit.wallonie.be/id/ecosystem/tweed' },
    update: {},
    create: { uri: 'https://pit.wallonie.be/id/ecosystem/tweed', name: 'TWEED (Technologie Wallonne Énergie Environnement)', territory: 'Wallonie', typeId: etCluster.id, actors: { connect: [{ id: orgSirris.id }, { id: orgGreen.id }] } }
  });

  // 9. Nomenclatures NACE
  console.log('🌐 Création des Secteurs NACE...');
  const naceRecyc = await prisma.naceSector.upsert({ where: { uri: 'https://pit.wallonie.be/id/nace/38.32' }, update: {}, create: { code: '38.32', name: 'Récupération de déchets triés', uri: 'https://pit.wallonie.be/id/nace/38.32' } });
  const naceWood = await prisma.naceSector.upsert({ where: { uri: 'https://pit.wallonie.be/id/nace/16.23' }, update: {}, create: { code: '16.23', name: 'Fabrication de charpentes et menuiseries', uri: 'https://pit.wallonie.be/id/nace/16.23' } });
  const naceLog = await prisma.naceSector.upsert({ where: { uri: 'https://pit.wallonie.be/id/nace/49.41' }, update: {}, create: { code: '49.41', name: 'Transports routiers de fret', uri: 'https://pit.wallonie.be/id/nace/49.41' } });
  const nacePharma = await prisma.naceSector.upsert({ where: { uri: 'https://pit.wallonie.be/id/nace/21.20' }, update: {}, create: { code: '21.20', name: 'Fabrication de préparations pharmaceutiques', uri: 'https://pit.wallonie.be/id/nace/21.20' } });
  const naceGas = await prisma.naceSector.upsert({ where: { uri: 'https://pit.wallonie.be/id/nace/35.21' }, update: {}, create: { code: '35.21', name: 'Production de combustibles gazeux', uri: 'https://pit.wallonie.be/id/nace/35.21' } });
  const naceAgri = await prisma.naceSector.upsert({ where: { uri: 'https://pit.wallonie.be/id/nace/01.61' }, update: {}, create: { code: '01.61', name: 'Activités de soutien aux cultures', uri: 'https://pit.wallonie.be/id/nace/01.61' } });
  const naceProg = await prisma.naceSector.upsert({ where: { uri: 'https://pit.wallonie.be/id/nace/62.01' }, update: {}, create: { code: '62.01', name: 'Programmation informatique', uri: 'https://pit.wallonie.be/id/nace/62.01' } });
  const naceConsult = await prisma.naceSector.upsert({ where: { uri: 'https://pit.wallonie.be/id/nace/62.02' }, update: {}, create: { code: '62.02', name: 'Conseil informatique', uri: 'https://pit.wallonie.be/id/nace/62.02' } });
  const naceTransport = await prisma.naceSector.upsert({ where: { uri: 'https://pit.wallonie.be/id/nace/30.99' }, update: {}, create: { code: '30.99', name: 'Fabrication d\'autres matériels de transport', uri: 'https://pit.wallonie.be/id/nace/30.99' } });
  const naceConst = await prisma.naceSector.upsert({ where: { uri: 'https://pit.wallonie.be/id/nace/41.20' }, update: {}, create: { code: '41.20', name: 'Construction de bâtiments', uri: 'https://pit.wallonie.be/id/nace/41.20' } });
  const naceFood = await prisma.naceSector.upsert({ where: { uri: 'https://pit.wallonie.be/id/nace/10.89' }, update: {}, create: { code: '10.89', name: 'Fabrication d\'autres produits alimentaires', uri: 'https://pit.wallonie.be/id/nace/10.89' } });
  const naceResearch = await prisma.naceSector.upsert({ where: { uri: 'https://pit.wallonie.be/id/nace/72.19' }, update: {}, create: { code: '72.19', name: 'Recherche-développement', uri: 'https://pit.wallonie.be/id/nace/72.19' } });
  const naceGlass = await prisma.naceSector.upsert({ where: { uri: 'https://pit.wallonie.be/id/nace/23.11' }, update: {}, create: { code: '23.11', name: 'Fabrication de verre plat', uri: 'https://pit.wallonie.be/id/nace/23.11' } });
  const naceMetal = await prisma.naceSector.upsert({ where: { uri: 'https://pit.wallonie.be/id/nace/24.10' }, update: {}, create: { code: '24.10', name: 'Sidérurgie et première transformation de l\'acier', uri: 'https://pit.wallonie.be/id/nace/24.10' } });

  // 10. Référentiels Métier S3 et Défis
  console.log('🧠 Création des Référentiels S3 et Défis...');
  const s3Num = await prisma.s3Domain.upsert({ where: { code: 'S3-NUM' }, update: {}, create: { code: 'S3-NUM', name: 'Numérique' } });
  const s3Indus = await prisma.s3Domain.upsert({ where: { code: 'S3-INDUSTRIE' }, update: {}, create: { code: 'S3-INDUSTRIE', name: 'Industrie du Futur' } });
  const s3Sante = await prisma.s3Domain.upsert({ where: { code: 'S3-SANTE' }, update: {}, create: { code: 'S3-SANTE', name: 'Santé & Sciences du Vivant' } });
  const s3Circ = await prisma.s3Domain.upsert({ where: { code: 'S3-CIRCULAR-ECON' }, update: {}, create: { code: 'S3-CIRCULAR-ECON', name: 'Économie Circulaire' } });
  const s3Ener = await prisma.s3Domain.upsert({ where: { code: 'S3-ENERGY' }, update: {}, create: { code: 'S3-ENERGY', name: 'Énergie & Hydrogène' } });
  const s3Mob = await prisma.s3Domain.upsert({ where: { code: 'S3-MOBILITE' }, update: {}, create: { code: 'S3-MOBILITE', name: 'Logistique & Mobilité' } });

  const vcCirc = await prisma.valueChain.upsert({ where: { code: 'VC-CIRCULAR-ECON' }, update: {}, create: { code: 'VC-CIRCULAR-ECON', name: 'Economie circulaire', s3DomainId: s3Circ.id } });
  const vcNum = await prisma.valueChain.upsert({ where: { code: 'VC-NUMERIQUE' }, update: {}, create: { code: 'VC-NUMERIQUE', name: 'Numérique', s3DomainId: s3Num.id } });
  const vcSante = await prisma.valueChain.upsert({ where: { code: 'VC-SANTE' }, update: {}, create: { code: 'VC-SANTE', name: 'Santé', s3DomainId: s3Sante.id } });
  const vcHydro = await prisma.valueChain.upsert({ where: { code: 'VC-HYDROGENE' }, update: {}, create: { code: 'VC-HYDROGENE', name: 'Hydrogène', s3DomainId: s3Ener.id } });
  const vcAgri = await prisma.valueChain.upsert({ where: { code: 'VC-AGROALIMENTAIRE' }, update: {}, create: { code: 'VC-AGROALIMENTAIRE', name: 'Agroalimentaire', s3DomainId: s3Indus.id } });
  const vcIndus = await prisma.valueChain.upsert({ where: { code: 'VC-INDUSTRIE-FUTUR' }, update: {}, create: { code: 'VC-INDUSTRIE-FUTUR', name: 'Industrie du Futur', s3DomainId: s3Indus.id } });
  const vcMetal = await prisma.valueChain.upsert({ where: { code: 'VC-METALLURGY' }, update: {}, create: { code: 'VC-METALLURGY', name: 'Métallurgie', s3DomainId: s3Indus.id } });
  const vcDigitalServices = await prisma.valueChain.upsert({ where: { code: 'VC-DIGITAL-SERVICES' }, update: {}, create: { code: 'VC-DIGITAL-SERVICES', name: 'Prestataires de services numériques', s3DomainId: s3Num.id } });
  const vcIndusProd = await prisma.valueChain.upsert({ where: { code: 'VC-INDUSTRIAL-PRODUCTION' }, update: {}, create: { code: 'VC-INDUSTRIAL-PRODUCTION', name: 'Production industrielle et manufacturière', s3DomainId: s3Indus.id } });

  const ccDigital = await prisma.challengeCategory.upsert({ where: { code: 'CC-DIGITAL' }, update: {}, create: { code: 'CC-DIGITAL', name: 'Transition Numérique' } });
  const ccGreen = await prisma.challengeCategory.upsert({ where: { code: 'CC-GREEN' }, update: {}, create: { code: 'CC-GREEN', name: 'Transition Écologique' } });
  const ccInt = await prisma.challengeCategory.upsert({ where: { code: 'CC-INT' }, update: {}, create: { code: 'CC-INT', name: 'Développement International' } });
  const ccFin = await prisma.challengeCategory.upsert({ where: { code: 'CC-FINGOV' }, update: {}, create: { code: 'CC-FINGOV', name: 'Gouvernance et Financement' } });

  const chCirc = await prisma.challenge.upsert({ where: { code: 'CH-CIRCULARITY' }, update: {}, create: { code: 'CH-CIRCULARITY', name: 'Circularité', challengeCategoryId: ccGreen.id } });
  const chCyber = await prisma.challenge.upsert({ where: { code: 'CH-CYBER' }, update: {}, create: { code: 'CH-CYBER', name: 'Cybersécurité', challengeCategoryId: ccDigital.id } });
  const chIa = await prisma.challenge.upsert({ where: { code: 'CH-IA' }, update: {}, create: { code: 'CH-IA', name: 'Intelligence artificielle', challengeCategoryId: ccDigital.id } });
  const chInno = await prisma.challenge.upsert({ where: { code: 'CH-INNOVATION' }, update: {}, create: { code: 'CH-INNOVATION', name: 'Innovation', challengeCategoryId: ccFin.id } });
  const chDecarb = await prisma.challenge.upsert({ where: { code: 'CH-DECARBON' }, update: {}, create: { code: 'CH-DECARBON', name: 'Décarbonation', challengeCategoryId: ccGreen.id } });
  const chDigital = await prisma.challenge.upsert({ where: { code: 'CH-DIGITAL' }, update: {}, create: { code: 'CH-DIGITAL', name: 'Digitalisation', challengeCategoryId: ccDigital.id } });
  const chComp = await prisma.challenge.upsert({ where: { code: 'CH-COMPLIANCE' }, update: {}, create: { code: 'CH-COMPLIANCE', name: 'Conformité', challengeCategoryId: ccFin.id } });
  const chExport = await prisma.challenge.upsert({ where: { code: 'CH-EXPORT' }, update: {}, create: { code: 'CH-EXPORT', name: 'Export', challengeCategoryId: ccInt.id } });

  // Rétrocompatibilité Challenges & ValueChains
  const bcCirc = await prisma.businessChallenge.upsert({
    where: { uri: 'https://pit.wallonie.be/id/business-challenge/circularity' },
    update: {},
    create: { uri: 'https://pit.wallonie.be/id/business-challenge/circularity', code: 'BC-CIRCULARITY', name: 'Circularité' }
  });
  const bcCyber = await prisma.businessChallenge.upsert({
    where: { uri: 'https://pit.wallonie.be/id/business-challenge/cyber' },
    update: {},
    create: { uri: 'https://pit.wallonie.be/id/business-challenge/cyber', code: 'BC-CYBER', name: 'Cybersécurité' }
  });
  const bcIa = await prisma.businessChallenge.upsert({
    where: { uri: 'https://pit.wallonie.be/id/business-challenge/ia' },
    update: {},
    create: { uri: 'https://pit.wallonie.be/id/business-challenge/ia', code: 'BC-IA', name: 'Intelligence artificielle' }
  });
  const bcInno = await prisma.businessChallenge.upsert({
    where: { uri: 'https://pit.wallonie.be/id/business-challenge/innovation' },
    update: {},
    create: { uri: 'https://pit.wallonie.be/id/business-challenge/innovation', code: 'BC-INNOVATION', name: 'Innovation' }
  });
  const bcDecarb = await prisma.businessChallenge.upsert({
    where: { uri: 'https://pit.wallonie.be/id/business-challenge/decarbonation' },
    update: {},
    create: { uri: 'https://pit.wallonie.be/id/business-challenge/decarbonation', code: 'BC-DECARBON', name: 'Décarbonation' }
  });
  const bcDigital = await prisma.businessChallenge.upsert({
    where: { uri: 'https://pit.wallonie.be/id/business-challenge/digitalisation' },
    update: {},
    create: { uri: 'https://pit.wallonie.be/id/business-challenge/digitalisation', code: 'BC-DIGITAL', name: 'Digitalisation' }
  });
  const bcComp = await prisma.businessChallenge.upsert({
    where: { uri: 'https://pit.wallonie.be/id/business-challenge/compliance' },
    update: {},
    create: { uri: 'https://pit.wallonie.be/id/business-challenge/compliance', code: 'BC-COMPLIANCE', name: 'Conformité' }
  });
  const bcExport = await prisma.businessChallenge.upsert({
    where: { uri: 'https://pit.wallonie.be/id/business-challenge/export' },
    update: {},
    create: { uri: 'https://pit.wallonie.be/id/business-challenge/export', code: 'BC-EXPORT', name: 'Export' }
  });

  const svcCirc = await prisma.strategicValueChain.upsert({
    where: { uri: 'https://pit.wallonie.be/id/strategic-value-chain/circular-economy' },
    update: {},
    create: { uri: 'https://pit.wallonie.be/id/strategic-value-chain/circular-economy', code: 'SVC-CIRCULAR-ECON', name: 'Economie circulaire' }
  });
  const svcNum = await prisma.strategicValueChain.upsert({
    where: { uri: 'https://pit.wallonie.be/id/strategic-value-chain/numeric' },
    update: {},
    create: { uri: 'https://pit.wallonie.be/id/strategic-value-chain/numeric', code: 'SVC-NUMERIQUE', name: 'Numérique' }
  });
  const svcSante = await prisma.strategicValueChain.upsert({
    where: { uri: 'https://pit.wallonie.be/id/strategic-value-chain/health' },
    update: {},
    create: { uri: 'https://pit.wallonie.be/id/strategic-value-chain/health', code: 'SVC-SANTE', name: 'Santé' }
  });
  const svcHydro = await prisma.strategicValueChain.upsert({
    where: { uri: 'https://pit.wallonie.be/id/strategic-value-chain/hydrogen' },
    update: {},
    create: { uri: 'https://pit.wallonie.be/id/strategic-value-chain/hydrogen', code: 'SVC-HYDROGENE', name: 'Hydrogène' }
  });
  const svcAgri = await prisma.strategicValueChain.upsert({
    where: { uri: 'https://pit.wallonie.be/id/strategic-value-chain/agri-food' },
    update: {},
    create: { uri: 'https://pit.wallonie.be/id/strategic-value-chain/agri-food', code: 'SVC-AGROALIMENTAIRE', name: 'Agroalimentaire' }
  });
  const svcIndus = await prisma.strategicValueChain.upsert({
    where: { uri: 'https://pit.wallonie.be/id/strategic-value-chain/industry-of-future' },
    update: {},
    create: { uri: 'https://pit.wallonie.be/id/strategic-value-chain/industry-of-future', code: 'SVC-INDUSTRIE-FUTUR', name: 'Industrie du Futur' }
  });

  // 11. Stratégies et Hiérarchies de Gouvernance
  console.log('🎯 Création des Structures de Gouvernance Stratégique...');
  const stDw = await prisma.strategy.upsert({ where: { code: 'STRAT-DW2025' }, update: {}, create: { code: 'STRAT-DW2025', name: 'Digital Wallonia 2025', ownerOrganizationId: orgAdn.id } });
  const stS3 = await prisma.strategy.upsert({ where: { code: 'STRAT-S3' }, update: {}, create: { code: 'STRAT-S3', name: 'Stratégie de Spécialisation Intelligente (S3)', ownerOrganizationId: orgWe.id } });
  const stCw = await prisma.strategy.upsert({ where: { code: 'STRAT-CW' }, update: {}, create: { code: 'STRAT-CW', name: 'Circular Wallonia', ownerOrganizationId: orgWe.id } });

  const pDw1 = await prisma.strategicPriority.upsert({ where: { code: 'PRIO-DW-ECONOMY' }, update: {}, create: { strategyId: stDw.id, code: 'PRIO-DW-ECONOMY', name: 'Économie numérique & Secteur technologique' } });
  const pS3_1 = await prisma.strategicPriority.upsert({ where: { code: 'PRIO-S3-INNO' }, update: {}, create: { strategyId: stS3.id, code: 'PRIO-S3-INNO', name: 'Recherche et Innovation Collaborative' } });
  const pCw1 = await prisma.strategicPriority.upsert({ where: { code: 'PRIO-CW-PROD' }, update: {}, create: { strategyId: stCw.id, code: 'PRIO-CW-PROD', name: 'Production et Design circulaire' } });

  // 10 Programmes Cibles
  const prCircDesign = await prisma.program.upsert({ where: { code: 'PROG-CIRCULAR-DESIGN' }, update: {}, create: { code: 'PROG-CIRCULAR-DESIGN', name: 'Circular Design & Materials', status: ProgramStatus.ACTIVE, ownerOrganizationId: orgWe.id } });
  const prEdih = await prisma.program.upsert({ where: { code: 'PROG-EDIH' }, update: {}, create: { code: 'PROG-EDIH', name: 'EDIH Wallonia', status: ProgramStatus.ACTIVE, ownerOrganizationId: orgAdn.id } });
  const prTartIa = await prisma.program.upsert({ where: { code: 'PROG-TART-IA' }, update: {}, create: { code: 'PROG-TART-IA', name: 'TART IA (Transition IA)', status: ProgramStatus.ACTIVE, ownerOrganizationId: orgAdn.id } });
  const prSante = await prisma.program.upsert({ where: { code: 'PROG-S3-SANTE' }, update: {}, create: { code: 'PROG-S3-SANTE', name: 'S3 Innovation Santé', status: ProgramStatus.ACTIVE, ownerOrganizationId: orgWe.id } });
  const prEnergie = await prisma.program.upsert({ where: { code: 'PROG-S3-ENERGIE' }, update: {}, create: { code: 'PROG-S3-ENERGIE', name: 'S3 Energie & Hydrogène', status: ProgramStatus.ACTIVE, ownerOrganizationId: orgWe.id } });
  const prDw = await prisma.program.upsert({ where: { code: 'PROG-DIGITAL-WALLONIA' }, update: {}, create: { code: 'PROG-DIGITAL-WALLONIA', name: 'Digital Wallonia', status: ProgramStatus.ACTIVE, ownerOrganizationId: orgAdn.id } });
  const prData = await prisma.program.upsert({ where: { code: 'PROG-DATA-WALLONIA' }, update: {}, create: { code: 'PROG-DATA-WALLONIA', name: 'Data4Wallonia', status: ProgramStatus.ACTIVE, ownerOrganizationId: orgAdn.id } });
  const prMob = await prisma.program.upsert({ where: { code: 'PROG-S3-MOBILITE' }, update: {}, create: { code: 'PROG-S3-MOBILITE', name: 'S3 Mobilité Logistique', status: ProgramStatus.ACTIVE, ownerOrganizationId: orgLog.id } });
  const prPrw = await prisma.program.upsert({ where: { code: 'PROG-PRW' }, update: {}, create: { code: 'PROG-PRW', name: 'Plan de Relance de la Wallonie (PRW)', status: ProgramStatus.ACTIVE, ownerOrganizationId: orgSpw.id } });
  const prCheques = await prisma.program.upsert({ where: { code: 'PROG-CHEQUES' }, update: {}, create: { code: 'PROG-CHEQUES', name: 'Chèques Entreprises', status: ProgramStatus.ACTIVE, ownerOrganizationId: orgWe.id } });

  // Nouveaux programmes pour Scénario 1 (Energy) et 6 (Flood)
  const prEnergyTrans = await prisma.program.upsert({ where: { code: 'PROG-ENERGY-TRANS' }, update: {}, create: { code: 'PROG-ENERGY-TRANS', name: 'Programme de Transition Énergétique Industrielle', status: ProgramStatus.ACTIVE, ownerOrganizationId: orgWe.id } });
  const prCyberResilience = await prisma.program.upsert({ where: { code: 'PROG-CYBER-RESILIENCE' }, update: {}, create: { code: 'PROG-CYBER-RESILIENCE', name: 'Programme Cyber Résilience Wallonie', status: ProgramStatus.ACTIVE, ownerOrganizationId: orgAdn.id } });
  const prResilienceWallonia = await prisma.program.upsert({ where: { code: 'PROG-RESILIENCE-WALLONIA' }, update: {}, create: { code: 'PROG-RESILIENCE-WALLONIA', name: 'Programme de Résilience Territoriale aux Risques Naturels', status: ProgramStatus.ACTIVE, ownerOrganizationId: orgSpw.id } });

  // Mesures et Initiatives
  const mCirc = await prisma.measure.upsert({ where: { code: 'MEAS-CIRC' }, update: {}, create: { code: 'MEAS-CIRC', name: 'Mesure Éco-conception', budget: 1000000.0 } });
  const iniTestInvest = await prisma.initiative.upsert({ where: { code: 'INI-TEST-BEFORE-INVEST' }, update: {}, create: { measureId: mCirc.id, code: 'INI-TEST-BEFORE-INVEST', name: 'Test Before Invest', leadOrganizationId: orgSirris.id } });
  const iniEcodesign = await prisma.initiative.upsert({ where: { code: 'INI-ECODESIGN-COACHING' }, update: {}, create: { measureId: mCirc.id, code: 'INI-ECODESIGN-COACHING', name: 'Coaching en Éco-conception', leadOrganizationId: orgWe.id } });

  // 12. Les Services Publics (PublicServices)
  console.log('🛎️ Création des Services Publics...');
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
    { code: 'S-COACH-PITCH', name: 'Coaching Pitch Investisseurs', desc: 'Préparation et coaching au pitch de levée de fonds', org: orgWe },
    // Nouveaux services pour les scénarios
    { code: 'S-OPTIM-PROCESS', name: 'Optimisation Energétique des Procédés', desc: 'Diagnostic et engineering d\'optimisation de charge thermique', org: orgSirris },
    { code: 'S-CYBER-ASSESSMENT', name: 'AI Cyber Assessment', desc: 'Audit de résilience logique et physique de systèmes complexes', org: orgCetic },
    { code: 'S-INCIDENT-RESPONSE', name: 'Support Réponse sur Incident Cyber', desc: 'Assistance en cas de ransomware et plans de reprise (DRP)', org: orgCetic },
    { code: 'S-AI-READINESS', name: 'Diagnostic IA & Maturité Algorithmique', desc: 'Audit de préparation des infrastructures data pour l\'IA', org: orgCetic },
    { code: 'S-DMAT', name: 'Digital Maturity Assessment Tool (DMAT)', desc: 'Indice de maturité numérique régional unifié', org: orgAdn },
    { code: 'S-MATERIAL-FLOW', name: 'Analyse des Flux de Matières critiques', desc: 'Cartographie sémantique des dépendances en terres rares', org: orgSirris },
    { code: 'S-CIRCULAR-ECON', name: 'Diagnostic Économie Circulaire Global', desc: 'Accompagnement de substitution des composants importés', org: orgWe },
    { code: 'S-BIZ-CONTINUITY', name: 'Aide au Plan de Continuité d\'Activité (PCA)', desc: 'Rédaction et audit de plan de reprise après sinistre naturel', org: orgSpw },
    { code: 'S-EMERGENCY-ASSIST', name: 'Assistance Administrative d\'Urgence Inondation', desc: 'Soutien aux démarches de sinistralité auprès du Fonds des Calamités', org: orgSpw },
    { code: 'S-RECONSTRUCT-ADVISORY', name: 'Conseil en Reconstruction Industrielle Résiliente', desc: 'Audit géospatial de relocalisation sécurisée des machines', org: orgSirris },
    { code: 'S-FUND-SUPPORT', name: 'Support Financement d\'Urgence Calamités', desc: 'Avances et prêts d\'urgence garantis par WE pour PME sinistrées', org: orgWe }
  ];

  const services: { [key: string]: any } = {};
  for (const s of servicesData) {
    const serviceUri = `https://pit.wallonie.be/id/service/${s.code.toLowerCase()}`;
    services[s.code] = await prisma.publicService.upsert({
      where: { uri: serviceUri },
      update: { name: s.name, description: s.desc, organizationId: s.org.id },
      create: {
        code: s.code,
        name: s.name,
        description: s.desc,
        organizationId: s.org.id,
        uri: serviceUri,
        catalogues: { connect: [{ id: cataloguePIT.id }] }
      }
    });
  }

  // 13. Parcours de Transformation & Étapes
  console.log('🛣️ Création des Parcours types...');
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
    const jUri = `https://pit.wallonie.be/id/journey/${j.code.toLowerCase()}`;
    journeys[j.code] = await prisma.journey.upsert({
      where: { uri: jUri },
      update: { name: j.name, description: j.desc },
      create: {
        uri: jUri,
        name: j.name,
        provider: 'PIT Wallonie',
        description: j.desc,
        targetAudience: ['PME', 'Startup']
      }
    });

    stages[j.code] = [];
    for (let i = 0; i < stageNames.length; i++) {
      // Find or create stages to prevent duplicates in append mode
      let stage = await prisma.journeyStage.findFirst({
        where: { name: stageNames[i], position: i + 1, journeyId: journeys[j.code].id }
      });
      if (!stage) {
        stage = await prisma.journeyStage.create({
          data: {
            name: stageNames[i],
            position: i + 1,
            journeyId: journeys[j.code].id
          }
        });
      }
      stages[j.code].push(stage);
    }
  }

  // 14. Les Bénéficiaires Territoriaux
  console.log('🏢 Création des Bénéficiaires Territoriaux...');
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
    { name: 'SmartCity Charleroi', bce: '0855.556.666', size: 'Commune', emp: 1200, rev: 0.0, loc: 'Charleroi', nace: naceLog, s3: s3Num, mD: 2, mI: 1, mC: 2, mE: 1, mDu: 1, prov: 'Hainaut', terr: cCharleroi },
    // Nouveaux bénéficiaires pour les scénarios
    { name: 'Liège Métal SA', bce: '0811.222.333', size: 'PME', emp: 48, rev: 8500000.0, loc: 'Seraing', nace: naceMetal, s3: s3Indus, mD: 2, mI: 1, mC: 2, mE: 1, mDu: 1, prov: 'Liège', terr: cLiege },
    { name: 'LogiShield PME', bce: '0822.333.444', size: 'PME', emp: 18, rev: 2100000.0, loc: 'Wavre', nace: naceConsult, s3: s3Num, mD: 3, mI: 2, mC: 3, mE: 1, mDu: 1, prov: 'Brabant Wallon', terr: cWavre },
    { name: 'Vesdre Métal', bce: '0833.444.555', size: 'PME', emp: 32, rev: 4500000.0, loc: 'Verviers', nace: naceMetal, s3: s3Indus, mD: 2, mI: 1, mC: 2, mE: 1, mDu: 1, prov: 'Liège', terr: cLiege },
    { name: 'LogiVesdre', bce: '0844.555.666', size: 'PME', emp: 15, rev: 1800000.0, loc: 'Pepinster', nace: naceLog, s3: s3Mob, mD: 2, mI: 1, mC: 2, mE: 2, mDu: 1, prov: 'Liège', terr: cLiege }
  ];

  const beneficiaries: { [key: string]: any } = {};
  for (const b of beneficiariesData) {
    beneficiaries[b.name] = await prisma.beneficiary.upsert({
      where: { bce: b.bce },
      update: { name: b.name, size: b.size, employees: b.emp, revenue: b.rev, location: b.loc, province: b.prov },
      create: {
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
        filieresS3: { connect: [{ id: svcCirc.id }] }
      }
    });
  }

  // 15. Inscriptions de Parcours (JourneyEnrollments)
  console.log('🛣️ Création des Inscriptions de Parcours...');
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
    
    // Find or create enrollment
    let enrollment = await prisma.journeyEnrollment.findFirst({
      where: { beneficiaryId: beneficiaries[e.ben].id, journeyId: journeys[e.jCode].id }
    });
    if (!enrollment) {
      enrollment = await prisma.journeyEnrollment.create({
        data: {
          beneficiaryId: beneficiaries[e.ben].id,
          journeyId: journeys[e.jCode].id,
          currentStageId: stage.id,
          status: e.status,
          completionRate: e.rate
        }
      });
    }
    enrollments[e.ben] = enrollment;
  }

  // 16. Réalisations de Prestations Réelles (ServiceDeliveries)
  console.log('📦 Création des Prestations Réelles...');
  const deliveriesData = [
    { ben: 'BioPlast SA', sCode: 'S-DIAG-CIRC', jCode: 'JOURNEY-CIRCULARITE', stPos: 2, op: orgWe, date: '2026-04-15', status: ServiceDeliveryStatus.COMPLETED, out: 'Diagnostic circularité terminé', file: 'audit_bioplast_circ.pdf' },
    { ben: 'BioPlast SA', sCode: 'S-COACH-ECODESIGN', jCode: 'JOURNEY-CIRCULARITE', stPos: 3, op: orgSirris, date: '2026-05-10', status: ServiceDeliveryStatus.COMPLETED, out: 'Prototypage plastique recyclable validé', file: 'roadmap_bioplast_ecodesign.pdf' },
    { ben: 'BioPlast SA', sCode: 'S-FUND-TRANS', jCode: 'JOURNEY-CIRCULARITE', stPos: 4, op: orgWe, date: '2026-06-12', status: ServiceDeliveryStatus.IN_PROGRESS, out: 'Planification de la recherche de subventions', file: '' },
    { ben: 'Menuiserie Dupont', sCode: 'S-DIAG-CYBER', jCode: 'JOURNEY-CYBERSECURITY', stPos: 2, op: orgCetic, date: '2026-03-12', status: ServiceDeliveryStatus.COMPLETED, out: 'Audit de sécurité logique mené', file: 'audit_dupont_cyber.pdf' },
    { ben: 'Menuiserie Dupont', sCode: 'S-COACH-CYBER', jCode: 'JOURNEY-CYBERSECURITY', stPos: 3, op: orgSirris, date: '2026-05-05', status: ServiceDeliveryStatus.COMPLETED, out: 'Sauvegardes et MFA activés', file: 'attestation_cyber_mfa.pdf' },
    { ben: 'LogiTrans', sCode: 'S-DIAG-IA', jCode: 'JOURNEY-IA', stPos: 2, op: orgCetic, date: '2026-02-12', status: ServiceDeliveryStatus.COMPLETED, out: 'Rapport de faisabilité IA rédigé', file: 'audit_logitrans_ia.pdf' },
    { ben: 'LogiTrans', sCode: 'S-TEST-INVEST-IA', jCode: 'JOURNEY-IA', stPos: 5, op: orgSirris, date: '2026-04-18', status: ServiceDeliveryStatus.COMPLETED, out: 'Prototype de routage validé', file: 'rapport_prototype_routing.pdf' },
    { ben: 'MedTech Namur', sCode: 'S-PROTO-MED-IA', jCode: 'JOURNEY-INDUSTRIALISATION', stPos: 5, op: orgCetic, date: '2026-01-22', status: ServiceDeliveryStatus.COMPLETED, out: 'Validation clinique IA d\'imagerie', file: 'rapport_clinique_ia.pdf' },
    { ben: 'MedTech Namur', sCode: 'S-FUND-INNOV', jCode: 'JOURNEY-INDUSTRIALISATION', stPos: 4, op: orgWe, date: '2026-04-15', status: ServiceDeliveryStatus.COMPLETED, out: 'Fonds FEDER accordés', file: 'decision_financement_feder.pdf' },
    { ben: 'HydroGreen', sCode: 'S-INNOV-HYDRO', jCode: 'JOURNEY-INDUSTRIALISATION', stPos: 5, op: orgSirris, date: '2026-02-15', status: ServiceDeliveryStatus.COMPLETED, out: 'Ingénierie électrolyseur certifiée', file: 'safety_report_hydrogen.pdf' },
    { ben: 'HydroGreen', sCode: 'S-MATCH-PARTNERS', jCode: 'JOURNEY-INDUSTRIALISATION', stPos: 4, op: orgMeca, date: '2026-04-30', status: ServiceDeliveryStatus.COMPLETED, out: 'Consortium de 5 sous-traitants signé', file: 'consortium_agreement_mecatech.pdf' },
    { ben: 'SmartFarm', sCode: 'S-AUDIT-IOT', jCode: 'JOURNEY-DIGITAL', stPos: 2, op: orgSirris, date: '2026-03-20', status: ServiceDeliveryStatus.COMPLETED, out: 'Audit couverture LoRa et capteurs', file: 'architect_report_lora.pdf' },
    { ben: 'DataWall', sCode: 'S-DIAG-GOV-DATA', jCode: 'JOURNEY-DIGITAL', stPos: 2, op: orgAdn, date: '2026-04-05', status: ServiceDeliveryStatus.COMPLETED, out: 'Audit RGPD et traitement complété', file: 'gdpr_compliance_report.pdf' },
    { ben: 'DataWall', sCode: 'S-COACH-DATA-ARCH', jCode: 'JOURNEY-DIGITAL', stPos: 3, op: orgCetic, date: '2026-05-15', status: ServiceDeliveryStatus.COMPLETED, out: 'Schéma d\'anonymisation validé', file: 'data_encryption_schema.png' },
    { ben: 'RecyTech', sCode: 'S-DIAG-CIRC', jCode: 'JOURNEY-CIRCULARITE', stPos: 2, op: orgWe, date: '2026-03-10', status: ServiceDeliveryStatus.COMPLETED, out: 'Faisabilité tri polymères validée', file: 'feasibility_sorting_polymer.pdf' },
    { ben: 'RecyTech', sCode: 'S-AUDIT-DECARBON', jCode: 'JOURNEY-CIRCULARITE', stPos: 2, op: orgGreen, date: '2026-05-18', status: ServiceDeliveryStatus.COMPLETED, out: 'Audit isolation fours thermiques', file: 'thermal_audit_recytech.pdf' },
    { ben: 'CyberForge', sCode: 'S-AUDIT-CYBER-ADV', jCode: 'JOURNEY-CYBERSECURITY', stPos: 2, op: orgCetic, date: '2026-02-02', status: ServiceDeliveryStatus.COMPLETED, out: 'Conformité NIS2 certifiée', file: 'nis2_audit_report.pdf' },
    { ben: 'CyberForge', sCode: 'S-EXPORT-AWEX', jCode: 'JOURNEY-CYBERSECURITY', stPos: 6, op: orgAwex, date: '2026-05-28', status: ServiceDeliveryStatus.COMPLETED, out: 'Plan export pour l\'Allemagne validé', file: 'german_market_entry_plan.pdf' },
    { ben: 'Mobility Next', sCode: 'S-INNOV-MECH', jCode: 'JOURNEY-INDUSTRIALISATION', stPos: 5, op: orgSirris, date: '2026-01-10', status: ServiceDeliveryStatus.COMPLETED, out: 'Validation mécanique et marquage CE', file: 'ce_conformity_report.pdf' },
    { ben: 'Mobility Next', sCode: 'S-MATCH-PARTNERS', jCode: 'JOURNEY-INDUSTRIALISATION', stPos: 4, op: orgLog, date: '2026-03-20', status: ServiceDeliveryStatus.COMPLETED, out: 'Contrat d\'expérimentation pilote signé', file: 'pilot_site_contract.pdf' },
    { ben: 'EcoBâtiment SPRL', sCode: 'S-DIAG-CIRC', jCode: 'JOURNEY-CIRCULARITE', stPos: 2, op: orgWe, date: '2026-04-11', status: ServiceDeliveryStatus.COMPLETED, out: 'Analyse circuit court chanvre validée', file: 'feasibility_biosourced_materials.pdf' },
    { ben: 'AgroFood Wallonia', sCode: 'S-DIAG-IA', jCode: 'JOURNEY-IA', stPos: 2, op: orgCetic, date: '2026-02-18', status: ServiceDeliveryStatus.COMPLETED, out: 'Faisabilité vibratoire capteurs', file: 'sensor_connectivity_report.pdf' },
    { ben: 'AgroFood Wallonia', sCode: 'S-TEST-INVEST-IA', jCode: 'JOURNEY-IA', stPos: 5, op: orgSirris, date: '2026-05-03', status: ServiceDeliveryStatus.COMPLETED, out: 'Modèle IA alertes pannes vibratoire', file: 'predictive_maintenance_mvp.pdf' },
    { ben: 'NanoTech Lab', sCode: 'S-INNOV-SURFACE', jCode: 'JOURNEY-INDUSTRIALISATION', stPos: 5, op: orgSirris, date: '2026-03-12', status: ServiceDeliveryStatus.COMPLETED, out: 'Vieillissement 1000h UV validé', file: 'aging_test_report_1000h.pdf' },
    { ben: 'NanoTech Lab', sCode: 'S-COACH-PITCH', jCode: 'JOURNEY-INDUSTRIALISATION', stPos: 3, op: orgWe, date: '2026-04-25', status: ServiceDeliveryStatus.COMPLETED, out: 'Deck de présentation d\'amorçage signé', file: 'investment_deck_signed.pdf' },
    { ben: 'GlassAlps', sCode: 'S-AUDIT-DECARBON', jCode: 'JOURNEY-INDUSTRIALISATION', stPos: 2, op: orgGreen, date: '2026-04-19', status: ServiceDeliveryStatus.COMPLETED, out: 'Audit chaleur fatale verrerie', file: 'thermal_recovery_audit_glass.pdf' },
    { ben: 'SmartCity Charleroi', sCode: 'S-DIAG-IA', jCode: 'JOURNEY-IA', stPos: 2, op: orgCetic, date: '2026-03-08', status: ServiceDeliveryStatus.COMPLETED, out: 'Diagnostic tournées collectives', file: 'waste_routing_feasibility.pdf' },
    { ben: 'SmartCity Charleroi', sCode: 'S-TEST-INVEST-IA', jCode: 'JOURNEY-IA', stPos: 5, op: orgSirris, date: '2026-05-24', status: ServiceDeliveryStatus.COMPLETED, out: 'Algorithme d\'itinéraires dynamiques validé', file: 'routing_algorithm_results.pdf' },
    { ben: 'GlassAlps', sCode: 'S-DIAG-CIRC', jCode: 'JOURNEY-INDUSTRIALISATION', stPos: 2, op: orgWe, date: '2026-05-12', status: ServiceDeliveryStatus.PLANNED, out: 'Planification d\'audit circularité matières', file: '' },
    { ben: 'SmartFarm', sCode: 'S-CHEQUE-INNOV', jCode: 'JOURNEY-DIGITAL', stPos: 3, op: orgSpw, date: '2026-05-22', status: ServiceDeliveryStatus.IN_PROGRESS, out: 'Montage dossier formation IoT', file: '' },
    // Prestations pour les nouveaux scénarios
    { ben: 'Liège Métal SA', sCode: 'S-AUDIT-DECARBON', jCode: 'JOURNEY-CIRCULARITE', stPos: 2, op: orgGreen, date: '2026-05-12', status: ServiceDeliveryStatus.COMPLETED, out: 'Audit de récupération de chaleur fatale des fours effectué', file: 'decarbonation_liege_metal.pdf' },
    { ben: 'Liège Métal SA', sCode: 'S-OPTIM-PROCESS', jCode: 'JOURNEY-CIRCULARITE', stPos: 3, op: orgSirris, date: '2026-06-01', status: ServiceDeliveryStatus.COMPLETED, out: 'Optimisation de charge thermique complétée', file: 'process_opt_liege_metal.pdf' },
    { ben: 'LogiShield PME', sCode: 'S-CYBER-ASSESSMENT', jCode: 'JOURNEY-CYBERSECURITY', stPos: 2, op: orgCetic, date: '2026-05-10', status: ServiceDeliveryStatus.COMPLETED, out: 'Diagnostic de dépendance Cloud réalisé', file: 'cyber_assessment_logishield.pdf' },
    { ben: 'LogiShield PME', sCode: 'S-INCIDENT-RESPONSE', jCode: 'JOURNEY-CYBERSECURITY', stPos: 3, op: orgCetic, date: '2026-06-02', status: ServiceDeliveryStatus.COMPLETED, out: 'Plan de reprise d\'activité multi-cloud (DRP) validé', file: 'incident_response_drp.pdf' },
    { ben: 'Vesdre Métal', sCode: 'S-BIZ-CONTINUITY', jCode: 'JOURNEY-CIRCULARITE', stPos: 2, op: orgSpw, date: '2026-05-20', status: ServiceDeliveryStatus.COMPLETED, out: 'Plan de continuité d\'activité (PCA) rédigé suite aux crues', file: 'pca_vesdre_metal.pdf' },
    { ben: 'LogiVesdre', sCode: 'S-FUND-SUPPORT', jCode: 'JOURNEY-CIRCULARITE', stPos: 4, op: orgWe, date: '2026-06-10', status: ServiceDeliveryStatus.COMPLETED, out: 'Financement calamités d\'urgence accordé', file: 'calamites_funding_logivesdre.pdf' }
  ];

  for (const d of deliveriesData) {
    const stage = stages[d.jCode][d.stPos - 1];
    
    // Find or create delivery to prevent duplicate items
    let delivery = await prisma.serviceDelivery.findFirst({
      where: { beneficiaryId: beneficiaries[d.ben].id, serviceId: services[d.sCode].id, actualStartDate: new Date(d.date) }
    });
    if (!delivery) {
      delivery = await prisma.serviceDelivery.create({
        data: {
          beneficiaryId: beneficiaries[d.ben].id,
          serviceId: services[d.sCode].id,
          journeyId: journeys[d.jCode].id,
          journeyStageId: stage.id,
          status: d.status,
          actualStartDate: new Date(d.date),
          plannedStartDate: new Date(d.date),
          operatorId: d.op.id,
          outputReal: d.out,
          journeyEnrollmentId: enrollments[d.ben] ? enrollments[d.ben].id : null,
          evidenceFiles: d.file ? [d.file] : []
        }
      });
    }

    if (d.file) {
      // Find or create physical Evidence
      const ev = await prisma.evidence.findFirst({ where: { serviceDeliveryId: delivery.id, name: d.file } });
      if (!ev) {
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
  }

  // 17. Indicateurs d'Impacts & Résultats Réels
  console.log('📈 Création des Impacts et Indicateurs...');
  const indJobs = await upsertOutcomeIndicator('Emplois créés', 'ETP');
  const indCo2 = await upsertOutcomeIndicator('Réduction CO2', 'tonnes');
  const indRevenue = await upsertOutcomeIndicator('Chiffre d\'affaires additionnel', 'EUR');
  const indMatSaved = await upsertOutcomeIndicator('Économie de matières premières', 'tonnes');
  const indRiskMitig = await upsertOutcomeIndicator('Emplois industriels sauvegardés', 'ETP');

  const impactsData = [
    { ben: 'BioPlast SA', ind: indCo2, val: 45.0, desc: 'Réduction émissions polymères recyclés' },
    { ben: 'LogiTrans', ind: indCo2, val: 110.0, desc: 'Kilométrage routage optimisé IA' },
    { ben: 'RecyTech', ind: indCo2, val: 140.0, desc: 'Réduction process fours décarbonés' },
    { ben: 'GlassAlps', ind: indCo2, val: 1200.0, desc: 'Décarbonation thermique verrerie flat' },
    { ben: 'SmartCity Charleroi', ind: indCo2, val: 12.0, desc: 'Collecte déchets optimisée' },
    { ben: 'BioPlast SA', ind: indMatSaved, val: 120.0, desc: 'Plastique vierge économisé/an' },
    { ben: 'RecyTech', ind: indMatSaved, val: 350.0, desc: 'ABS valorisé localement/an' },
    { ben: 'MedTech Namur', ind: indJobs, val: 3.0, desc: 'Chercheurs médicaux recrutés' },
    { ben: 'Mobility Next', ind: indJobs, val: 2.0, desc: 'Ingénieurs d\'intégration robotique recrutés' },
    { ben: 'CyberForge', ind: indRevenue, val: 120000.0, desc: 'Contrats exportations Allemagne NIS2' },
    // Nouveaux impacts pour les scénarios
    { ben: 'Liège Métal SA', ind: indCo2, val: 320.0, desc: 'CO2 évité par la décarbonation thermique' },
    { ben: 'Liège Métal SA', ind: indRiskMitig, val: 48.0, desc: 'Emplois industriels sauvegardés par la transition énergétique' },
    { ben: 'Vesdre Métal', ind: indRiskMitig, val: 32.0, desc: 'Maintien de l\'emploi local post-inondations grâce au PCA' },
    { ben: 'LogiVesdre', ind: indRevenue, val: 150000.0, desc: 'Chiffre d\'affaires sécurisé par avances calamités d\'urgence' }
  ];

  for (const imp of impactsData) {
    const existingImp = await prisma.impact.findFirst({
      where: { beneficiaryId: beneficiaries[imp.ben].id, indicatorId: imp.ind.id, textValue: imp.desc }
    });
    if (!existingImp) {
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
  }

  // 18. Catalogues théoriques Outcomes
  console.log('💡 Création des Outcomes attendus...');
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
    const sId = services[Object.keys(services)[i % Object.keys(services).length]].id;
    const existingOut = await prisma.outcome.findFirst({ where: { name: outcomeNames[i], publicServiceId: sId } });
    if (!existingOut) {
      await prisma.outcome.create({
        data: {
          name: outcomeNames[i],
          publicServiceId: sId
        }
      });
    }
  }

  // =========================================================================
  // 19. PEUPLEMENT DES 6 SCÉNARIOS DE RÉSILIENCE & VULNÉRABILITÉS (VNext / Phase 4.2 / 5.1)
  // =========================================================================
  console.log('🛡️ Création des Scénarios de Résilience, Vulnerabilités et Dépendances...');

  // 19a. Dépendances & Hiérarchies
  const depNatGas = await prisma.dependency.upsert({
    where: { uri: 'https://pit.wallonie.be/id/dependency/gas-supply' },
    update: {},
    create: { uri: 'https://pit.wallonie.be/id/dependency/gas-supply', name: 'Approvisionnement en gaz naturel', category: 'ENERGY', criticalLevel: 'CRITICAL', substitutability: 'DIFFICULT', valueChains: { connect: [{ id: vcMetal.id }] } }
  });
  const depGasDist = await prisma.dependency.upsert({
    where: { uri: 'https://pit.wallonie.be/id/dependency/local-gas-station' },
    update: { parentDependencyId: depNatGas.id },
    create: { uri: 'https://pit.wallonie.be/id/dependency/local-gas-station', name: 'Poste de détente de gaz local', category: 'ENERGY', criticalLevel: 'HIGH', substitutability: 'POSSIBLE', parentDependencyId: depNatGas.id }
  });

  const depCloudProv = await prisma.dependency.upsert({
    where: { uri: 'https://pit.wallonie.be/id/dependency/cloud-provider' },
    update: {},
    create: { uri: 'https://pit.wallonie.be/id/dependency/cloud-provider', name: 'Hébergement Cloud principal', category: 'DIGITAL', criticalLevel: 'HIGH', substitutability: 'DIFFICULT', valueChains: { connect: [{ id: vcDigitalServices.id }] } }
  });
  const depLocalBackup = await prisma.dependency.upsert({
    where: { uri: 'https://pit.wallonie.be/id/dependency/local-backup-dns' },
    update: { parentDependencyId: depCloudProv.id },
    create: { uri: 'https://pit.wallonie.be/id/dependency/local-backup-dns', name: 'Serveur local de secours et DNS redondant', category: 'DIGITAL', criticalLevel: 'MEDIUM', substitutability: 'EASY', parentDependencyId: depCloudProv.id }
  });

  const depSpecialWorkforce = await prisma.dependency.upsert({
    where: { uri: 'https://pit.wallonie.be/id/dependency/specialized-workforce' },
    update: {},
    create: { uri: 'https://pit.wallonie.be/id/dependency/specialized-workforce', name: 'Main d\'œuvre qualifiée en ingénierie data', category: 'HUMAN', criticalLevel: 'HIGH', substitutability: 'DIFFICULT', valueChains: { connect: [{ id: vcNum.id }] } }
  });
  const depAiDevs = await prisma.dependency.upsert({
    where: { uri: 'https://pit.wallonie.be/id/dependency/ai-developers' },
    update: { parentDependencyId: depSpecialWorkforce.id },
    create: { uri: 'https://pit.wallonie.be/id/dependency/ai-developers', name: 'Développeurs experts en Deep Learning', category: 'HUMAN', criticalLevel: 'HIGH', substitutability: 'DIFFICULT', parentDependencyId: depSpecialWorkforce.id }
  });

  const depRareMaterials = await prisma.dependency.upsert({
    where: { uri: 'https://pit.wallonie.be/id/dependency/rare-materials' },
    update: {},
    create: { uri: 'https://pit.wallonie.be/id/dependency/rare-materials', name: 'Importation de métaux et terres rares (cobalt, iridium)', category: 'SUPPLY', criticalLevel: 'CRITICAL', substitutability: 'IMPOSSIBLE', valueChains: { connect: [{ id: vcCirc.id }] } }
  });
  const depImportedComp = await prisma.dependency.upsert({
    where: { uri: 'https://pit.wallonie.be/id/dependency/imported-components' },
    update: { parentDependencyId: depRareMaterials.id },
    create: { uri: 'https://pit.wallonie.be/id/dependency/imported-components', name: 'Composants électroniques et aimants permanents', category: 'SUPPLY', criticalLevel: 'HIGH', substitutability: 'DIFFICULT', parentDependencyId: depRareMaterials.id }
  });

  // Dépendances Scenario 6 (Flood)
  const depTransportInfra = await prisma.dependency.upsert({
    where: { uri: 'https://pit.wallonie.be/id/dependency/transport-infrastructure' },
    update: {},
    create: { uri: 'https://pit.wallonie.be/id/dependency/transport-infrastructure', name: 'Infrastructures de transport routier et ferroviaire', category: 'TRANSPORT', criticalLevel: 'HIGH', substitutability: 'POSSIBLE', valueChains: { connect: [{ id: vcIndusProd.id }] } }
  });
  const depLocalElectricity = await prisma.dependency.upsert({
    where: { uri: 'https://pit.wallonie.be/id/dependency/local-electricity-supply' },
    update: { parentDependencyId: depTransportInfra.id },
    create: { uri: 'https://pit.wallonie.be/id/dependency/local-electricity-supply', name: 'Alimentation électrique haute/basse tension locale', category: 'ENERGY', criticalLevel: 'CRITICAL', substitutability: 'DIFFICULT', parentDependencyId: depTransportInfra.id }
  });
  const depLocalTelecom = await prisma.dependency.upsert({
    where: { uri: 'https://pit.wallonie.be/id/dependency/local-telecom-networks' },
    update: { parentDependencyId: depTransportInfra.id },
    create: { uri: 'https://pit.wallonie.be/id/dependency/local-telecom-networks', name: 'Connectivité télécom et réseaux de fibre optique', category: 'DIGITAL', criticalLevel: 'HIGH', substitutability: 'POSSIBLE', parentDependencyId: depTransportInfra.id }
  });
  const depLocalLogistics = await prisma.dependency.upsert({
    where: { uri: 'https://pit.wallonie.be/id/dependency/local-logistics-access' },
    update: { parentDependencyId: depTransportInfra.id },
    create: { uri: 'https://pit.wallonie.be/id/dependency/local-logistics-access', name: 'Accès aux hubs logistiques et entrepôts de stockage', category: 'LOGISTICS', criticalLevel: 'MEDIUM', substitutability: 'POSSIBLE', parentDependencyId: depTransportInfra.id }
  });

  // 19b. Vulnerabilités
  const vulnGasNet = await prisma.vulnerability.upsert({
    where: { code: 'VULN-GAS-NET' },
    update: {},
    create: {
      code: 'VULN-GAS-NET',
      name: 'Dépendance critique au gaz naturel importé',
      description: 'Dépendance structurelle au gaz naturel pour les fours et les procédés industriels à haute température.',
      category: 'ENERGY',
      severity: 'CRITICAL',
      criticalityScore: 95,
      territorialImportance: 'Province de Liège, Bassin de Seraing',
      strategicImportance: 'Critique (Souveraineté industrielle)',
      confidenceLevel: 'HIGH',
      remediationPlan: 'Transition vers des fours électriques et hydrogène vert, audit thermique express.',
      dependencies: { connect: [{ id: depNatGas.id }] },
      valueChains: { connect: [{ id: vcMetal.id }] },
      beneficiaries: { connect: [{ id: beneficiaries['Liège Métal SA'].id }] },
      programs: { connect: [{ id: prEnergyTrans.id }] },
      mitigations: { connect: [{ id: services['S-OPTIM-PROCESS'].id }, { id: services['S-AUDIT-DECARBON'].id }] }
    }
  });

  const vulnCloudSingle = await prisma.vulnerability.upsert({
    where: { code: 'VULN-CLOUD-SINGLE' },
    update: {},
    create: {
      code: 'VULN-CLOUD-SINGLE',
      name: 'Dépendance à un fournisseur Cloud unique',
      description: 'Concentration des outils métiers et des bases de données sur un seul fournisseur cloud sans sauvegarde externe.',
      category: 'DIGITAL',
      severity: 'HIGH',
      criticalityScore: 85,
      territorialImportance: 'ZAE Wavre, Louvain-la-Neuve, Liège',
      strategicImportance: 'Élevée (Continuité d\'activité numérique)',
      confidenceLevel: 'MEDIUM',
      remediationPlan: 'Déploiement d\'architectures de reprise d\'activité multi-cloud (DRP) et audits NIS2.',
      dependencies: { connect: [{ id: depCloudProv.id }] },
      valueChains: { connect: [{ id: vcDigitalServices.id }] },
      beneficiaries: { connect: [{ id: beneficiaries['LogiShield PME'].id }] },
      programs: { connect: [{ id: prCyberResilience.id }] },
      mitigations: { connect: [{ id: services['S-CYBER-ASSESSMENT'].id }, { id: services['S-INCIDENT-RESPONSE'].id }, { id: services['S-DIAG-CYBER'].id }] }
    }
  });

  const vulnAiSkills = await prisma.vulnerability.upsert({
    where: { code: 'VULN-AI-SKILLS' },
    update: {},
    create: {
      code: 'VULN-AI-SKILLS',
      name: 'Pénurie de compétences en intelligence artificielle',
      description: 'Difficulté majeure à recruter et à retenir les talents IA au sein des entreprises et universités wallonnes.',
      category: 'HUMAN',
      severity: 'HIGH',
      criticalityScore: 78,
      territorialImportance: 'Pôles universitaires de Liège et Louvain-la-Neuve',
      strategicImportance: 'Haute (Retard technologique face au reste de l\'UE)',
      confidenceLevel: 'HIGH',
      remediationPlan: 'Financement de chaires industrielles et de bootcamps de formation accélérée.',
      dependencies: { connect: [{ id: depSpecialWorkforce.id }] },
      valueChains: { connect: [{ id: vcNum.id }] },
      beneficiaries: { connect: [{ id: beneficiaries['DataWall'].id }] },
      programs: { connect: [{ id: prEdih.id }, { id: prDw.id }] },
      mitigations: { connect: [{ id: services['S-AI-READINESS'].id }, { id: services['S-DMAT'].id }] }
    }
  });

  const vulnAiAdoption = await prisma.vulnerability.upsert({
    where: { code: 'VULN-AI-ADOPTION' },
    update: {},
    create: {
      code: 'VULN-AI-ADOPTION',
      name: 'Faible taux d\'adoption de l\'IA dans les PME',
      description: 'Faible intégration des algorithmes d\'IA dans les procédés de production des PME traditionnelles.',
      category: 'DIGITAL',
      severity: 'MEDIUM',
      criticalityScore: 72,
      territorialImportance: 'Wallonie',
      strategicImportance: 'Moyenne (Perte de compétitivité industrielle)',
      confidenceLevel: 'MEDIUM',
      remediationPlan: 'Financement de démonstrateurs avec le programme "Test Before Invest" de Sirris.',
      dependencies: { connect: [{ id: depAiDevs.id }] },
      valueChains: { connect: [{ id: vcNum.id }] },
      beneficiaries: { connect: [{ id: beneficiaries['SmartFarm'].id }] },
      programs: { connect: [{ id: prEdih.id }, { id: prTartIa.id }] },
      mitigations: { connect: [{ id: services['S-TEST-INVEST-IA'].id }] }
    }
  });

  const vulnRawMat = await prisma.vulnerability.upsert({
    where: { code: 'VULN-RAW-MAT' },
    update: {},
    create: {
      code: 'VULN-RAW-MAT',
      name: 'Dépendance aux matières premières critiques',
      description: 'Dépendance forte de la manufacture wallonne aux importations de minéraux stratégiques (iridium, cobalt, lithium).',
      category: 'SUPPLY',
      severity: 'HIGH',
      criticalityScore: 88,
      territorialImportance: 'Bassins industriels de Charleroi et Liège',
      strategicImportance: 'Élevée (Transition environnementale et bas-carbone)',
      confidenceLevel: 'HIGH',
      remediationPlan: 'Soutien aux programmes de recyclage locaux et éco-conception.',
      dependencies: { connect: [{ id: depRareMaterials.id }] },
      valueChains: { connect: [{ id: vcCirc.id }] },
      beneficiaries: { connect: [{ id: beneficiaries['BioPlast SA'].id }, { id: beneficiaries['RecyTech'].id }] },
      programs: { connect: [{ id: prCircDesign.id }, { id: prPrw.id }] },
      mitigations: { connect: [{ id: services['S-CIRCULAR-ECON'].id }, { id: services['S-MATERIAL-FLOW'].id }] }
    }
  });

  // Nouvelle vulnérabilité Scenario 6 (Flood)
  const vulnFloodplainExp = await prisma.vulnerability.upsert({
    where: { code: 'VULN-FLOODPLAIN-EXP' },
    update: {},
    create: {
      code: 'VULN-FLOODPLAIN-EXP',
      name: 'Exposition industrielle en zone inondable',
      description: 'Localisation physique d\'usines et de stocks dans des zones à fort aléa de crue sans plans de protection.',
      category: 'GEOGRAPHIC',
      severity: 'HIGH',
      criticalityScore: 90,
      territorialImportance: 'Vallée de la Vesdre (Chaudfontaine, Pepinster, Verviers)',
      strategicImportance: 'Critique (Maintien de l\'emploi local et protection environnementale)',
      confidenceLevel: 'HIGH',
      remediationPlan: 'Financement de digues, rehaussement des équipements de process et audits de continuité d\'activité (PCA).',
      dependencies: { connect: [{ id: depTransportInfra.id }, { id: depLocalElectricity.id }, { id: depLocalTelecom.id }, { id: depLocalLogistics.id }] },
      valueChains: { connect: [{ id: vcIndusProd.id }] },
      beneficiaries: { connect: [{ id: beneficiaries['Vesdre Métal'].id }, { id: beneficiaries['LogiVesdre'].id }] },
      programs: { connect: [{ id: prPrw.id }, { id: prResilienceWallonia.id }] },
      mitigations: { connect: [{ id: services['S-BIZ-CONTINUITY'].id }, { id: services['S-EMERGENCY-ASSIST'].id }, { id: services['S-RECONSTRUCT-ADVISORY'].id }, { id: services['S-FUND-SUPPORT'].id }] }
    }
  });

  // 19c. Risques & Registres
  const registerDemo = await prisma.riskRegister.upsert({
    where: { uri: 'https://pit.wallonie.be/id/risk-register/demo-camp-2026' },
    update: {},
    create: {
      uri: 'https://pit.wallonie.be/id/risk-register/demo-camp-2026',
      name: 'Registre National des Risques Territoriaux 2026'
    }
  });

  const riskGasShock = await prisma.risk.upsert({
    where: { code: 'RISK-GAS-SHOCK' },
    update: {},
    create: {
      code: 'RISK-GAS-SHOCK',
      name: 'Choc des prix du gaz naturel de process',
      description: 'Triplement temporaire ou prolongé du prix du gaz de marché importé impactant l\'industrie lourde.',
      category: 'ECONOMIC',
      subcategory: 'Énergie',
      severity: 5,
      likelihood: 4,
      riskScore: 20,
      uri: 'https://pit.wallonie.be/id/risk/gas-price-shock',
      riskRegisterId: registerDemo.id,
      vulnerabilities: { connect: [{ id: vulnGasNet.id }] },
      territories: { connect: [{ id: provLiege.id }] }
    }
  });

  const riskCyberCloud = await prisma.risk.upsert({
    where: { code: 'RISK-CYBER-CLOUD' },
    update: {},
    create: {
      code: 'RISK-CYBER-CLOUD',
      name: 'Cyberattaque majeure sur le Cloud régional',
      description: 'Attaque par ransomware paralysant le principal fournisseur d\'infrastructure cloud public des PME wallonnes.',
      category: 'CYBER',
      subcategory: 'Sécurité logique',
      severity: 5,
      likelihood: 3,
      riskScore: 15,
      uri: 'https://pit.wallonie.be/id/risk/cyber-cloud-attack',
      riskRegisterId: registerDemo.id,
      vulnerabilities: { connect: [{ id: vulnCloudSingle.id }] },
      territories: { connect: [{ id: provBrabant.id }] }
    }
  });

  const riskAiShortage = await prisma.risk.upsert({
    where: { code: 'RISK-AI-SHORTAGE' },
    update: {},
    create: {
      code: 'RISK-AI-SHORTAGE',
      name: 'Pénurie d\'expertise en intelligence artificielle',
      description: 'Pénurie de profils qualifiés en science de données et ML ralentissant la transition numérique.',
      category: 'ECONOMIC',
      subcategory: 'Capital Humain',
      severity: 4,
      likelihood: 4,
      riskScore: 16,
      uri: 'https://pit.wallonie.be/id/risk/ai-skills-shortage',
      riskRegisterId: registerDemo.id,
      vulnerabilities: { connect: [{ id: vulnAiSkills.id }, { id: vulnAiAdoption.id }] },
      territories: { connect: [{ id: tWall.id }] }
    }
  });

  const riskCrmDisruption = await prisma.risk.upsert({
    where: { code: 'RISK-CRM-DISRUPTION' },
    update: {},
    create: {
      code: 'RISK-CRM-DISRUPTION',
      name: 'Rupture d\'approvisionnement en matières critiques',
      description: 'Rupture ou embargo logistique sur les métaux et terres rares importés requis pour les procédés S3.',
      category: 'ECONOMIC',
      subcategory: 'Chaîne d\'approvisionnement',
      severity: 4,
      likelihood: 4,
      riskScore: 16,
      uri: 'https://pit.wallonie.be/id/risk/crm-disruption',
      riskRegisterId: registerDemo.id,
      vulnerabilities: { connect: [{ id: vulnRawMat.id }] },
      territories: { connect: [{ id: provHainaut.id }] }
    }
  });

  // Nouveau Risque Scenario 6 (Flood)
  const riskFloodValley = await prisma.risk.upsert({
    where: { code: 'RISK-FLOOD-VALLEY' },
    update: {},
    create: {
      code: 'RISK-FLOOD-VALLEY',
      name: 'Crue majeure dans la Vallée de la Vesdre',
      description: 'Épisode météorologique extrême entraînant une crue historique des cours d\'eau et la paralysie des parcs industriels.',
      category: 'NATURAL',
      subcategory: 'Inondation',
      severity: 5,
      likelihood: 3,
      riskScore: 15,
      uri: 'https://pit.wallonie.be/id/risk/vesdre-valley-flood',
      riskRegisterId: registerDemo.id,
      vulnerabilities: { connect: [{ id: vulnFloodplainExp.id }] },
      territories: { connect: [{ id: valVesdre.id }] }
    }
  });

  // 19d. Aléas et Menaces
  await prisma.threat.upsert({
    where: { uri: 'https://pit.wallonie.be/id/threat/gas-speculation' },
    update: {
      name: 'Spéculation géopolitique sur le gaz GNL importé',
      description: 'Fluctuations extrêmes sur les marchés à terme suite à des tensions d\'approvisionnement.',
      threatType: 'ECONOMIC',
      riskId: riskGasShock.id
    },
    create: {
      name: 'Spéculation géopolitique sur le gaz GNL importé',
      description: 'Fluctuations extrêmes sur les marchés à terme suite à des tensions d\'approvisionnement.',
      threatType: 'ECONOMIC',
      uri: 'https://pit.wallonie.be/id/threat/gas-speculation',
      riskId: riskGasShock.id
    }
  });

  await prisma.threat.upsert({
    where: { uri: 'https://pit.wallonie.be/id/threat/cyber-raas' },
    update: {
      name: 'Ransomware-as-a-Service (RaaS) structuré',
      description: 'Infiltration par hameçonnage ciblé et chiffrement à double clé des datacenters.',
      threatType: 'INTENTIONAL',
      riskId: riskCyberCloud.id
    },
    create: {
      name: 'Ransomware-as-a-Service (RaaS) structuré',
      description: 'Infiltration par hameçonnage ciblé et chiffrement à double clé des datacenters.',
      threatType: 'INTENTIONAL',
      uri: 'https://pit.wallonie.be/id/threat/cyber-raas',
      riskId: riskCyberCloud.id
    }
  });

  await prisma.hazard.upsert({
    where: { uri: 'https://pit.wallonie.be/id/hazard/heavy-rain' },
    update: {
      name: 'Pluies diluviennes de type blocage atmosphérique',
      description: 'Précipitations cumulées > 150mm en 48 heures sur des bassins versants saturés.',
      hazardType: 'FLOOD',
      source: 'IRM',
      riskId: riskFloodValley.id
    },
    create: {
      name: 'Pluies diluviennes de type blocage atmosphérique',
      description: 'Précipitations cumulées > 150mm en 48 heures sur des bassins versants saturés.',
      hazardType: 'FLOOD',
      source: 'IRM',
      uri: 'https://pit.wallonie.be/id/hazard/heavy-rain',
      riskId: riskFloodValley.id
    }
  });

  // 19e. Scénarios d'Analyse
  const scenarioGasShock = await prisma.scenario.upsert({
    where: { uri: 'https://pit.wallonie.be/id/scenario/gas-shock-6months' },
    update: {},
    create: {
      uri: 'https://pit.wallonie.be/id/scenario/gas-shock-6months',
      name: 'Hausse tarifaire gaz de process ×3 durant 6 mois',
      description: 'Fermeture d\'un gazoduc majeur combinée à une indisponibilité hivernale de stockage.',
      horizon: 'MEDIUM',
      probability: 0.35,
      severity: 'CRITICAL',
      riskId: riskGasShock.id
    }
  });

  const scenarioCloudFailure = await prisma.scenario.upsert({
    where: { uri: 'https://pit.wallonie.be/id/scenario/cloud-outage-72h' },
    update: {},
    create: {
      uri: 'https://pit.wallonie.be/id/scenario/cloud-outage-72h',
      name: 'Indisponibilité totale d\'un hyperviseur régional pendant 72h',
      description: 'Chiffrement logique des tables de partitionnement virtuelles.',
      horizon: 'SHORT',
      probability: 0.20,
      severity: 'HIGH',
      riskId: riskCyberCloud.id
    }
  });

  const scenarioFloodValley = await prisma.scenario.upsert({
    where: { uri: 'https://pit.wallonie.be/id/scenario/vesdre-flood-2021' },
    update: {},
    create: {
      uri: 'https://pit.wallonie.be/id/scenario/vesdre-flood-2021',
      name: 'Crue décennale de la Vesdre (+1.8m hors lit)',
      description: 'Débordement majeur inondant les zonages industriels de Verviers et Pepinster.',
      horizon: 'IMMEDIATE',
      probability: 0.10,
      severity: 'CRITICAL',
      riskId: riskFloodValley.id
    }
  });

  // 19f. Évaluations des risques (RiskAssessments)
  const raGas = await prisma.riskAssessment.findFirst({
    where: { scenarioId: scenarioGasShock.id, riskId: riskGasShock.id, territoryId: provLiege.id }
  });
  if (!raGas) {
    await prisma.riskAssessment.create({
      data: {
        assessmentType: 'CORTEX',
        methodology: 'Modèle de coût d\'exposition de charge thermique',
        exposureScore: 9,
        vulnerabilityScore: 8,
        consequenceScore: 9,
        overallScore: 8,
        notes: 'La concentration d\'usines de sidérurgie à Seraing concentre l\'impact sur la province de Liège.',
        scenarioId: scenarioGasShock.id,
        riskId: riskGasShock.id,
        territoryId: provLiege.id
      }
    });
  }

  const raCloud = await prisma.riskAssessment.findFirst({
    where: { scenarioId: scenarioCloudFailure.id, riskId: riskCyberCloud.id, territoryId: provBrabant.id }
  });
  if (!raCloud) {
    await prisma.riskAssessment.create({
      data: {
        assessmentType: 'CORTEX',
        methodology: 'Modèle d\'impact de continuité IT unifié',
        exposureScore: 8,
        vulnerabilityScore: 6,
        consequenceScore: 8,
        overallScore: 7,
        notes: 'Le manque de plans de reprise multi-cloud au sein des prestataires augmente la criticité opérationnelle.',
        scenarioId: scenarioCloudFailure.id,
        riskId: riskCyberCloud.id,
        territoryId: provBrabant.id
      }
    });
  }

  const raFlood = await prisma.riskAssessment.findFirst({
    where: { scenarioId: scenarioFloodValley.id, riskId: riskFloodValley.id, territoryId: valVesdre.id }
  });
  if (!raFlood) {
    await prisma.riskAssessment.create({
      data: {
        assessmentType: 'BNRA',
        methodology: 'Modélisation hydraulique de submersion SPW',
        exposureScore: 9,
        vulnerabilityScore: 8,
        consequenceScore: 10,
        overallScore: 9,
        notes: 'La topographie étroite de la vallée accélère la vitesse d\'écoulement et les dégâts mécaniques aux machines.',
        scenarioId: scenarioFloodValley.id,
        riskId: riskFloodValley.id,
        territoryId: valVesdre.id
      }
    });
  }

  // 19g. Profils de Résilience territoriaux (ResilienceProfiles)
  await prisma.resilienceProfile.upsert({
    where: { territoryId: provLiege.id },
    update: {},
    create: {
      exposure: 7.5,
      sensitivity: 8.0,
      vulnerability: 7.75,
      absorptionCapacity: 5.5,
      adaptiveCapacity: 6.0,
      recoveryCapacity: 6.5,
      overallResilience: 6.0,
      methodology: 'Indice de résilience industrielle locale OCDE',
      notes: 'Haute concentration d\'activités intensives en énergie thermique.',
      territoryId: provLiege.id
    }
  });

  await prisma.resilienceProfile.upsert({
    where: { territoryId: valVesdre.id },
    update: {},
    create: {
      exposure: 9.0,
      sensitivity: 7.5,
      vulnerability: 8.25,
      absorptionCapacity: 4.0,
      adaptiveCapacity: 5.0,
      recoveryCapacity: 5.5,
      overallResilience: 4.8,
      methodology: 'Diagnostic de résilience aux inondations de bassin',
      notes: 'Vulnérabilité topographique très élevée requérant des dispositifs physiques renforcés.',
      territoryId: valVesdre.id
    }
  });

  // 19h. Impacts de Résilience (ResilienceImpacts)
  const riGas = await prisma.resilienceImpact.findFirst({
    where: { name: 'Surcoût d\'exploitation sidérurgique Seraing', scenarioId: scenarioGasShock.id, territoryId: provLiege.id }
  });
  const impactGasEco = riGas || await prisma.resilienceImpact.create({
    data: {
      name: 'Surcoût d\'exploitation sidérurgique Seraing',
      description: 'Pression sur la trésorerie et chômage partiel pour 48 ETP chez Liège Métal.',
      category: 'ECONOMIC',
      magnitude: 1.2,
      unit: 'Millions EUR',
      timeHorizon: 'SHORT',
      scenarioId: scenarioGasShock.id,
      territoryId: provLiege.id
    }
  });

  const riFlood = await prisma.resilienceImpact.findFirst({
    where: { name: 'Destruction structurelle d\'ateliers et machines', scenarioId: scenarioFloodValley.id, territoryId: valVesdre.id }
  });
  const impactFloodEco = riFlood || await prisma.resilienceImpact.create({
    data: {
      name: 'Destruction structurelle d\'ateliers et machines',
      description: 'Dégâts matériels lourds sur les ponts roulants et stocks de Vesdre Métal.',
      category: 'ECONOMIC',
      magnitude: 4.5,
      unit: 'Millions EUR',
      timeHorizon: 'IMMEDIATE',
      scenarioId: scenarioFloodValley.id,
      territoryId: valVesdre.id
    }
  });

  // 19i. Mesures de Résilience (ResilienceMeasures)
  await prisma.resilienceMeasure.upsert({
    where: { uri: 'https://pit.wallonie.be/id/resilience-measure/co-generation-funding' },
    update: {},
    create: {
      uri: 'https://pit.wallonie.be/id/resilience-measure/co-generation-funding',
      name: 'Cofinancement de l\'électrification des fours industriels',
      description: 'Subvention facilitée du Plan de Relance pour l\'acquisition d\'inducteurs électriques.',
      measureType: 'PREVENTION',
      targetDimension: 'VULNERABILITY',
      status: 'ACTIVE',
      publicServiceId: services['S-AUDIT-DECARBON'].id,
      resilienceImpacts: { connect: [{ id: impactGasEco.id }] }
    }
  });

  await prisma.resilienceMeasure.upsert({
    where: { uri: 'https://pit.wallonie.be/id/resilience-measure/pca-vesdre-valley' },
    update: {},
    create: {
      uri: 'https://pit.wallonie.be/id/resilience-measure/pca-vesdre-valley',
      name: 'Plan de reprise d\'activité (PCA) et de substitution spatiale',
      description: 'Accompagnement méthodologique de relogement temporaire en ZAE résiliente.',
      measureType: 'RECOVERY',
      targetDimension: 'RECOVERY',
      status: 'PLANNED',
      publicServiceId: services['S-BIZ-CONTINUITY'].id,
      resilienceImpacts: { connect: [{ id: impactFloodEco.id }] }
    }
  });

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

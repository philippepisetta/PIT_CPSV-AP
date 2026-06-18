import { PrismaClient, TerritoryType, KnowledgeAssetType, ProgramStatus, InitiativeStatus, ParticipationRole, ServiceDeliveryStatus, CollectiveDeliveryStatus, SecondLineMissionStatus, ActivityType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du peuplement de la base de données (seeding)...');

  // Nettoyage de la base de données en respectant l'ordre des contraintes d'intégrité référentielle
  console.log('🧹 Nettoyage des anciennes données...');
  await prisma.ecosystemChallenge.deleteMany({});
  await prisma.evidence.deleteMany({});
  await prisma.activity.deleteMany({}); // New Activity table
  await prisma.serviceDelivery.deleteMany({});
  await prisma.collectiveDelivery.deleteMany({});
  await prisma.secondLineMission.deleteMany({});
  await prisma.action.deleteMany({}); // New Action table
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
  await prisma.project.deleteMany({}); // New Project table
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
  await prisma.valueChain.deleteMany({}); // New ValueChain table
  await prisma.strategicValueChain.deleteMany({});
  await prisma.challenge.deleteMany({}); // New Challenge table
  await prisma.businessChallenge.deleteMany({});
  await prisma.challengeCategory.deleteMany({}); // New ChallengeCategory table
  await prisma.capability.deleteMany({}); // New Capability table
  await prisma.capabilityDimension.deleteMany({});
  await prisma.s3Domain.deleteMany({}); // New S3Domain table
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

  // 1. Canaux (Channels)
  console.log('📥 Création des Canaux...');
  const chWeb = await prisma.channel.create({
    data: {
      uri: 'https://pit.wallonie.be/id/channel/plateforme-web',
      name: 'Plateforme Web',
      description: 'Portail en ligne accessible 24/7 pour les démarches des PME.',
      code: 'CH-WEB',
    },
  });

  const chGuichet = await prisma.channel.create({
    data: {
      uri: 'https://pit.wallonie.be/id/channel/guichet-partenaire',
      name: 'Guichet Partenaire',
      description: 'Guichet physique ou bureau partenaire de proximité.',
      code: 'CH-GUICHET',
    },
  });

  const chRdv = await prisma.channel.create({
    data: {
      uri: 'https://pit.wallonie.be/id/channel/rdv-individuel',
      name: 'Rendez-vous individuel',
      description: 'Entretien physique ou visioconférence avec un conseiller spécialisé.',
      code: 'CH-RDV',
    },
  });

  const chPhone = await prisma.channel.create({
    data: {
      uri: 'https://pit.wallonie.be/id/channel/telephone',
      name: 'Support Téléphonique',
      description: "Ligne directe d'assistance pour les entrepreneurs.",
      code: 'CH-PHONE',
    },
  });

  // 2. Publics Cibles (TargetAudiences)
  console.log('👥 Création des Publics Cibles...');
  const taPme = await prisma.targetAudience.create({
    data: {
      uri: 'https://pit.wallonie.be/id/target-audience/pme',
      name: 'PME wallonne',
      description: 'Petites et moyennes entreprises établies en Région wallonne.',
      code: 'TA-PME',
    },
  });

  const taStartup = await prisma.targetAudience.create({
    data: {
      uri: 'https://pit.wallonie.be/id/target-audience/startup',
      name: 'Startup',
      description: 'Jeunes entreprises innovantes à fort potentiel de croissance.',
      code: 'TA-STARTUP',
    },
  });

  const taIndependant = await prisma.targetAudience.create({
    data: {
      uri: 'https://pit.wallonie.be/id/target-audience/independant',
      name: 'Indépendant',
      description: 'Personnes physiques exerçant une activité professionnelle sans contrat de travail.',
      code: 'TA-INDEPENDANT',
    },
  });

  const taResearcher = await prisma.targetAudience.create({
    data: {
      uri: 'https://pit.wallonie.be/id/target-audience/centre-recherche',
      name: 'Centre de recherche',
      description: 'Centres de recherche agréés et universités wallonnes.',
      code: 'TA-RESEARCH',
    },
  });

  // 3. Événements Professionnels (BusinessEvents)
  console.log('💼 Création des Événements Professionnels...');
  const beDigitalTrans = await prisma.businessEvent.create({
    data: {
      uri: 'https://pit.wallonie.be/id/business-event/transformation-digitale',
      name: 'Transformation digitale d’une PME',
      description: "Processus de numérisation des processus, des outils et de la culture d'entreprise.",
      code: 'BE-DIGITAL',
    },
  });

  const beFunding = await prisma.businessEvent.create({
    data: {
      uri: 'https://pit.wallonie.be/id/business-event/recherche-financement',
      name: 'Recherche de financement',
      description: "Recherche d'aides publiques, prêts ou levées de fonds pour un projet.",
      code: 'BE-FUNDING',
    },
  });

  const beInternational = await prisma.businessEvent.create({
    data: {
      uri: 'https://pit.wallonie.be/id/business-event/developpement-international',
      name: 'Développement international',
      description: "Exportation de produits/services ou implantation sur des marchés étrangers.",
      code: 'BE-EXPORT',
    },
  });

  const beCreation = await prisma.businessEvent.create({
    data: {
      uri: 'https://pit.wallonie.be/id/business-event/creation-entreprise',
      name: "Création d'entreprise",
      description: "Lancement d'une nouvelle activité ou constitution d'une société.",
      code: 'BE-CREATION',
    },
  });

  // 4. Événements de Vie (LifeEvents)
  console.log('🧬 Création des Événements de Vie...');
  const leTransmission = await prisma.lifeEvent.create({
    data: {
      uri: 'https://pit.wallonie.be/id/life-event/reprise-entreprise',
      name: "Reprise / Transmission d'entreprise",
      description: "Cession d'une entreprise existante ou rachat d'une activité par un repreneur.",
      code: 'LE-TRANSFER',
    },
  });

  // 5. Catalogue (Dataset)
  console.log('📚 Création du Catalogue / Dataset de référence...');
  const cataloguePIT = await prisma.catalogue.create({
    data: {
      uri: 'https://pit.wallonie.be/id/catalogue/pit-services',
      name: 'Catalogue des Services Territoriaux de la PIT',
      description: 'Référentiel des aides, diagnostics et accompagnements pour les entreprises wallonnes.',
      code: 'CAT-PIT',
    },
  });

  // 6. Niveaux d'Intervention (InterventionLevel)
  console.log('📊 Création des Niveaux d\'Intervention...');
  const ilIndiv = await prisma.interventionLevel.create({
    data: {
      code: 'INDIVIDUAL',
      name: 'Accompagnement individuel',
      description: 'Service délivré à un bénéficiaire précis. Suivi via ServiceDelivery (ex: Diagnostic, coaching, audit).'
    }
  });

  const ilColl = await prisma.interventionLevel.create({
    data: {
      code: 'COLLECTIVE',
      name: 'Accompagnement collectif / animation économique',
      description: 'Action destinée à plusieurs entreprises ou acteurs. Suivi via CollectiveDelivery (ex: Workshop, forum, learning network).'
    }
  });

  const ilSecLine = await prisma.interventionLevel.create({
    data: {
      code: 'SECOND_LINE',
      name: 'Mission de deuxième ligne / écosystème',
      description: 'Mission réalisée au bénéfice de l’écosystème, des opérateurs, clusters ou partenaires. Suivi via SecondLineMission.'
    }
  });

  // 7. Types d'Intervention (InterventionType)
  console.log('⚙️ Création des Types d\'Intervention...');
  const itService = await prisma.interventionType.create({ data: { code: 'SERVICE', name: 'Service', description: 'Accompagnement, diagnostic ou prestation de service public.' } });
  const itFunding = await prisma.interventionType.create({ data: { code: 'FUNDING', name: 'Financement', description: 'Prêt, subvention, chèque ou aide financière.' } });
  const itProject = await prisma.interventionType.create({ data: { code: 'PROJECT', name: 'Projet', description: 'Projet de R&D ou collaboration territoriale.' } });
  const itEvent = await prisma.interventionType.create({ data: { code: 'EVENT', name: 'Événement', description: 'Conférence, atelier, salon.' } });
  const itAsset = await prisma.interventionType.create({ data: { code: 'KNOWLEDGE_ASSET', name: 'Actif de connaissance', description: 'Livre blanc, étude, guide de référence.' } });
  const itMission = await prisma.interventionType.create({ data: { code: 'MISSION', name: 'Mission', description: 'Mission d\'écosystème de deuxième ligne.' } });

  // 8. Types d'Écosystèmes (EcosystemType)
  console.log('🌐 Création des Types d\'Écosystèmes...');
  const etEdih = await prisma.ecosystemType.create({ data: { code: 'EDIH', name: 'EDIH', description: 'European Digital Innovation Hub.' } });
  const etCluster = await prisma.ecosystemType.create({ data: { code: 'CLUSTER', name: 'Cluster d\'innovation', description: 'Réseau d\'entreprises et partenaires.' } });
  const etPole = await prisma.ecosystemType.create({ data: { code: 'POLE_COMPETITIVITE', name: 'Pôle de compétitivité', description: 'Pôle de croissance économique.' } });
  const etLab = await prisma.ecosystemType.create({ data: { code: 'LIVING_LAB', name: 'Living Lab', description: 'Laboratoire d\'innovation ouverte.' } });
  const etHub = await prisma.ecosystemType.create({ data: { code: 'HUB_INNOVATION', name: 'Hub d\'innovation', description: 'Structure locale de support.' } });
  const etNetwork = await prisma.ecosystemType.create({ data: { code: 'NETWORK', name: 'Réseau', description: 'Réseau régional.' } });
  const etCommunity = await prisma.ecosystemType.create({ data: { code: 'COMMUNITY', name: 'Communauté', description: 'Groupe d\'échange informel.' } });

  // 9. Territoires (Territory) - Structure hiérarchique avec Enums
  console.log('📍 Création de la hiérarchie territoriale...');
  const tWall = await prisma.territory.create({
    data: {
      code: 'WAL',
      name: 'Wallonie',
      type: TerritoryType.REGION,
      description: 'Région wallonne dans sa globalité.'
    }
  });

  const tLiege = await prisma.territory.create({
    data: {
      code: 'BE-WLG',
      name: 'Liège',
      type: TerritoryType.PROVINCE,
      parentTerritoryId: tWall.id,
      description: 'Province de Liège'
    }
  });

  const tNamur = await prisma.territory.create({
    data: {
      code: 'BE-WNM',
      name: 'Namur',
      type: TerritoryType.PROVINCE,
      parentTerritoryId: tWall.id,
      description: 'Province de Namur'
    }
  });

  const tHainaut = await prisma.territory.create({
    data: {
      code: 'BE-WHT',
      name: 'Hainaut',
      type: TerritoryType.PROVINCE,
      parentTerritoryId: tWall.id,
      description: 'Province de Hainaut'
    }
  });

  const tBrabant = await prisma.territory.create({
    data: {
      code: 'BE-WBR',
      name: 'Brabant Wallon',
      type: TerritoryType.PROVINCE,
      parentTerritoryId: tWall.id,
      description: 'Province du Brabant Wallon'
    }
  });

  const tLux = await prisma.territory.create({
    data: {
      code: 'BE-WLX',
      name: 'Luxembourg',
      type: TerritoryType.PROVINCE,
      parentTerritoryId: tWall.id,
      description: 'Province de Luxembourg'
    }
  });

  // Communes
  const cNamurCity = await prisma.territory.create({
    data: {
      code: 'COMM-NAMUR',
      name: 'Ville de Namur',
      type: TerritoryType.COMMUNE,
      parentTerritoryId: tNamur.id
    }
  });

  const cCharleroi = await prisma.territory.create({
    data: {
      code: 'COMM-CHARLEROI',
      name: 'Charleroi',
      type: TerritoryType.COMMUNE,
      parentTerritoryId: tHainaut.id
    }
  });

  const cLiegeCity = await prisma.territory.create({
    data: {
      code: 'COMM-LIEGE',
      name: 'Ville de Liège',
      type: TerritoryType.COMMUNE,
      parentTerritoryId: tLiege.id
    }
  });

  const cWavre = await prisma.territory.create({
    data: {
      code: 'COMM-WAVRE',
      name: 'Wavre',
      type: TerritoryType.COMMUNE,
      parentTerritoryId: tBrabant.id
    }
  });

  // Bassins Économiques
  const bBassinSambre = await prisma.territory.create({
    data: {
      code: 'BAS-SAMBRE',
      name: 'Bassin de la Sambre',
      type: TerritoryType.ECONOMIC_BASIN,
      parentTerritoryId: tWall.id,
      description: 'Bassin industriel Sambre et Meuse'
    }
  });

  // 10. Organisations (Acteurs)
  console.log('🏢 Création des Organisations (AdN, WE, AWEX, UCM, Sirris)...');
  const orgAdn = await prisma.organization.create({
    data: {
      uri: 'https://pit.wallonie.be/id/organization/adn',
      name: 'Agence du Numérique',
      description: "L'Agence du Numérique (AdN) est l'organisme public wallon chargé de piloter la stratégie numérique régionale.",
      code: 'ORG-ADN',
      type: 'Opérateur public',
    },
  });

  const orgWe = await prisma.organization.create({
    data: {
      uri: 'https://pit.wallonie.be/id/organization/we',
      name: 'Wallonie Entreprendre',
      description: "Wallonie Entreprendre (WE) est l'outil financier et d'accompagnement de la Wallonie.",
      code: 'ORG-WE',
      type: 'Financeur',
    },
  });

  const orgAwex = await prisma.organization.create({
    data: {
      uri: 'https://pit.wallonie.be/id/organization/awex',
      name: 'AWEX',
      description: "L'AWEX soutient le développement international des entreprises wallonnes.",
      code: 'ORG-AWEX',
      type: 'Opérateur public',
    },
  });

  const orgUcm = await prisma.organization.create({
    data: {
      uri: 'https://pit.wallonie.be/id/organization/ucm',
      name: 'UCM',
      description: "Représentation et accompagnement des indépendants et PME.",
      code: 'ORG-UCM',
      type: 'Association',
    },
  });

  const orgSirris = await prisma.organization.create({
    data: {
      uri: 'https://pit.wallonie.be/id/organization/sirris',
      name: 'Sirris',
      description: 'Centre collectif de recherche de l’industrie technologique belge.',
      code: 'ORG-SIRRIS',
      type: 'Centre de recherche',
    },
  });

  // Clusters & Pôles additionnels
  const orgBioWin = await prisma.organization.create({
    data: {
      uri: 'https://pit.wallonie.be/id/organization/biowin',
      name: 'BioWin',
      description: 'Le pôle de compétitivité santé de la Wallonie.',
      code: 'ORG-BIOWIN',
      type: 'Pôle de compétitivité',
    }
  });

  const orgMecaTech = await prisma.organization.create({
    data: {
      uri: 'https://pit.wallonie.be/id/organization/mecatech',
      name: 'MecaTech',
      description: 'Le pôle de compétitivité en génie mécanique et technologies clés.',
      code: 'ORG-MECATECH',
      type: 'Pôle de compétitivité',
    }
  });

  const orgTweed = await prisma.organization.create({
    data: {
      uri: 'https://pit.wallonie.be/id/organization/tweed',
      name: 'Cluster TWEED',
      description: 'Technologie Wallonne Énergie Environnement et Développement durable.',
      code: 'ORG-TWEED',
      type: 'Cluster',
    }
  });

  // 11. Référentiels Métier
  console.log('🧠 Création des Référentiels (Défis, Chaînes de Valeur, Fonctions, NACE, Maillons)...');
  
  // --- NOUVEAUTÉ V7.0 : S3 Domain et Value Chain ---
  console.log('🌐 Création des nouveaux S3 Domains et Value Chains...');
  const s3Num = await prisma.s3Domain.create({ data: { code: 'S3-NUM', name: 'Numérique', description: 'Transition numérique régionale et technologies de pointe.' } });
  const s3Indus = await prisma.s3Domain.create({ data: { code: 'S3-INDUSTRIE', name: 'Industrie du Futur', description: 'Modernisation industrielle et manufacturing avancé.' } });
  const s3Sante = await prisma.s3Domain.create({ data: { code: 'S3-SANTE', name: 'Santé & Sciences du Vivant', description: 'Biotech, pharma et technologies médicales.' } });
  const s3Circ = await prisma.s3Domain.create({ data: { code: 'S3-CIRCULAR-ECON', name: 'Économie Circulaire', description: 'Transition écologique, décarbonation et circularité.' } });
  const s3Ener = await prisma.s3Domain.create({ data: { code: 'S3-ENERGY', name: 'Énergie & Hydrogène', description: 'Transition énergétique régionale.' } });

  const vcNum = await prisma.valueChain.create({ data: { code: 'VC-NUMERIQUE', name: 'Numérique', uri: 'https://pit.wallonie.be/id/vc/numerique', s3DomainId: s3Num.id } });
  const vcIndus = await prisma.valueChain.create({ data: { code: 'VC-INDUSTRIE-FUTUR', name: 'Industrie du Futur', uri: 'https://pit.wallonie.be/id/vc/industrie-du-futur', s3DomainId: s3Indus.id } });
  const vcSante = await prisma.valueChain.create({ data: { code: 'VC-SANTE', name: 'Santé', uri: 'https://pit.wallonie.be/id/vc/sante', s3DomainId: s3Sante.id } });
  const vcBiotech = await prisma.valueChain.create({ data: { code: 'VC-BIOTECH', name: 'Biotech', uri: 'https://pit.wallonie.be/id/vc/biotech', s3DomainId: s3Sante.id } });
  const vcAgri = await prisma.valueChain.create({ data: { code: 'VC-AGROALIMENTAIRE', name: 'Agroalimentaire', uri: 'https://pit.wallonie.be/id/vc/agroalimentaire', s3DomainId: s3Indus.id } });
  const vcHydro = await prisma.valueChain.create({ data: { code: 'VC-HYDROGENE', name: 'Hydrogène', uri: 'https://pit.wallonie.be/id/vc/hydrogene', s3DomainId: s3Ener.id } });
  const vcEner = await prisma.valueChain.create({ data: { code: 'VC-ENERGIE', name: 'Energie', uri: 'https://pit.wallonie.be/id/vc/energie', s3DomainId: s3Ener.id } });
  const vcConst = await prisma.valueChain.create({ data: { code: 'VC-CONSTRUCTION', name: 'Construction durable', uri: 'https://pit.wallonie.be/id/vc/construction', s3DomainId: s3Circ.id } });
  const vcCirc = await prisma.valueChain.create({ data: { code: 'VC-CIRCULAR-ECON', name: 'Economie circulaire', uri: 'https://pit.wallonie.be/id/vc/economie-circulaire', s3DomainId: s3Circ.id } });

  // Chaînes de valeur S3 V10 (StrategicValueChain) - Rétrocompatibilité
  const svcIndus = await prisma.strategicValueChain.create({ data: { name: 'Industrie du Futur', code: 'SVC-INDUSTRIE-FUTUR', uri: 'https://pit.wallonie.be/id/strategic-vc/industrie-du-futur' } });
  const svcSante = await prisma.strategicValueChain.create({ data: { name: 'Santé', code: 'SVC-SANTE', uri: 'https://pit.wallonie.be/id/strategic-vc/sante' } });
  const svcBiotech = await prisma.strategicValueChain.create({ data: { name: 'Biotech', code: 'SVC-BIOTECH', uri: 'https://pit.wallonie.be/id/strategic-vc/biotech' } });
  const svcAgri = await prisma.strategicValueChain.create({ data: { name: 'Agroalimentaire', code: 'SVC-AGROALIMENTAIRE', uri: 'https://pit.wallonie.be/id/strategic-vc/agroalimentaire' } });
  const svcNum = await prisma.strategicValueChain.create({ data: { name: 'Numérique', code: 'SVC-NUMERIQUE', uri: 'https://pit.wallonie.be/id/strategic-vc/numerique' } });
  const svcHydro = await prisma.strategicValueChain.create({ data: { name: 'Hydrogène', code: 'SVC-HYDROGENE', uri: 'https://pit.wallonie.be/id/strategic-vc/hydrogene' } });
  const svcEner = await prisma.strategicValueChain.create({ data: { name: 'Energie', code: 'SVC-ENERGIE', uri: 'https://pit.wallonie.be/id/strategic-vc/energie' } });
  const svcConst = await prisma.strategicValueChain.create({ data: { name: 'Construction durable', code: 'SVC-CONSTRUCTION', uri: 'https://pit.wallonie.be/id/strategic-vc/construction' } });
  const svcLog = await prisma.strategicValueChain.create({ data: { name: 'Logistique', code: 'SVC-LOGISTIQUE', uri: 'https://pit.wallonie.be/id/strategic-vc/logistique' } });
  const svcTour = await prisma.strategicValueChain.create({ data: { name: 'Tourisme', code: 'SVC-TOURISME', uri: 'https://pit.wallonie.be/id/strategic-vc/tourisme' } });
  const svcCirc = await prisma.strategicValueChain.create({ data: { name: 'Economie circulaire', code: 'SVC-CIRCULAR-ECON', uri: 'https://pit.wallonie.be/id/strategic-vc/economie-circulaire' } });

  // --- NOUVEAUTÉ V7.0 : Challenge Categories & Challenges ---
  console.log('🎯 Création des nouveaux Challenge Categories et Challenges...');
  const ccDigital = await prisma.challengeCategory.create({ data: { code: 'CC-DIGITAL', name: 'Transition Numérique', description: 'Transition numérique et adoption des technologies clés.' } });
  const ccGreen = await prisma.challengeCategory.create({ data: { code: 'CC-GREEN', name: 'Transition Écologique', description: 'Transition bas carbone, efficacité énergétique et économie circulaire.' } });
  const ccInternational = await prisma.challengeCategory.create({ data: { code: 'CC-INT', name: 'Développement International', description: 'Accompagnement export, logistique transfrontalière et marchés.' } });
  const ccFinGov = await prisma.challengeCategory.create({ data: { code: 'CC-FINGOV', name: 'Gouvernance et Financement', description: 'Aides financières, structuration de projets et gouvernance.' } });

  const chDigital = await prisma.challenge.create({ data: { code: 'CH-DIGITAL', name: 'Digitalisation', uri: 'https://pit.wallonie.be/id/challenge/digitalisation', challengeCategoryId: ccDigital.id } });
  const chIa = await prisma.challenge.create({ data: { code: 'CH-IA', name: 'Intelligence artificielle', uri: 'https://pit.wallonie.be/id/challenge/ia', challengeCategoryId: ccDigital.id } });
  const chCyber = await prisma.challenge.create({ data: { code: 'CH-CYBER', name: 'Cybersécurité', uri: 'https://pit.wallonie.be/id/challenge/cyber', challengeCategoryId: ccDigital.id } });
  const chExport = await prisma.challenge.create({ data: { code: 'CH-EXPORT', name: 'Export', uri: 'https://pit.wallonie.be/id/challenge/export', challengeCategoryId: ccInternational.id } });
  const chDecarb = await prisma.challenge.create({ data: { code: 'CH-DECARBON', name: 'Décarbonation', uri: 'https://pit.wallonie.be/id/challenge/decarbonation', challengeCategoryId: ccGreen.id } });
  const chInno = await prisma.challenge.create({ data: { code: 'CH-INNOVATION', name: 'Innovation', uri: 'https://pit.wallonie.be/id/challenge/innovation', challengeCategoryId: ccFinGov.id } });
  const chRh = await prisma.challenge.create({ data: { code: 'CH-RH', name: 'RH', uri: 'https://pit.wallonie.be/id/challenge/rh', challengeCategoryId: ccFinGov.id } });
  const chFund = await prisma.challenge.create({ data: { code: 'CH-FUNDING', name: 'Financement', uri: 'https://pit.wallonie.be/id/challenge/financement', challengeCategoryId: ccFinGov.id } });
  const chCirc = await prisma.challenge.create({ data: { code: 'CH-CIRCULARITY', name: 'Circularité', uri: 'https://pit.wallonie.be/id/challenge/circularite', challengeCategoryId: ccGreen.id } });
  const chConf = await prisma.challenge.create({ data: { code: 'CH-COMPLIANCE', name: 'Conformité', uri: 'https://pit.wallonie.be/id/challenge/conformite', challengeCategoryId: ccFinGov.id } });

  // Défis d'affaires V10 (BusinessChallenges) - Rétrocompatibilité
  const bcDigital = await prisma.businessChallenge.create({ data: { name: 'Digitalisation', code: 'BC-DIGITAL', uri: 'https://pit.wallonie.be/id/challenge/digitalisation' } });
  const bcIa = await prisma.businessChallenge.create({ data: { name: 'Intelligence artificielle', code: 'BC-IA', uri: 'https://pit.wallonie.be/id/challenge/ia' } });
  const bcCyber = await prisma.businessChallenge.create({ data: { name: 'Cybersécurité', code: 'BC-CYBER', uri: 'https://pit.wallonie.be/id/challenge/cyber' } });
  const bcExport = await prisma.businessChallenge.create({ data: { name: 'Export', code: 'BC-EXPORT', uri: 'https://pit.wallonie.be/id/challenge/export' } });
  const bcDecarb = await prisma.businessChallenge.create({ data: { name: 'Décarbonation', code: 'BC-DECARBON', uri: 'https://pit.wallonie.be/id/challenge/decarbonation' } });
  const bcInno = await prisma.businessChallenge.create({ data: { name: 'Innovation', code: 'BC-INNOVATION', uri: 'https://pit.wallonie.be/id/challenge/innovation' } });
  const bcRh = await prisma.businessChallenge.create({ data: { name: 'RH', code: 'BC-RH', uri: 'https://pit.wallonie.be/id/challenge/rh' } });
  const bcFund = await prisma.businessChallenge.create({ data: { name: 'Financement', code: 'BC-FUNDING', uri: 'https://pit.wallonie.be/id/challenge/financement' } });
  const bcCirc = await prisma.businessChallenge.create({ data: { name: 'Circularité', code: 'BC-CIRCULARITY', uri: 'https://pit.wallonie.be/id/challenge/circularite' } });
  const bcConf = await prisma.businessChallenge.create({ data: { name: 'Conformité', code: 'BC-COMPLIANCE', uri: 'https://pit.wallonie.be/id/challenge/conformite' } });

  // --- NOUVEAUTÉ V7.0 : Capabilities & Hiérarchie Circulaire ---
  console.log('🧠 Création des nouvelles Capabilities (Graphe)...');
  const capDigital = await prisma.capability.create({
    data: { uri: 'https://pit.wallonie.be/id/capability/digital', code: 'CAP-DIG', name: 'Compétences Numériques', capabilityType: 'TECHNOLOGICAL', status: 'ACTIVE' }
  });
  const capGreen = await prisma.capability.create({
    data: { uri: 'https://pit.wallonie.be/id/capability/ecology', code: 'CAP-ECO', name: 'Transition Écologique', capabilityType: 'BUSINESS', status: 'ACTIVE' }
  });

  const capIa = await prisma.capability.create({
    data: {
      uri: 'https://pit.wallonie.be/id/capability/ai',
      code: 'CAP-DIG-AI',
      name: 'Intelligence Artificielle',
      capabilityType: 'TECHNOLOGICAL',
      synonyms: ['Machine Learning', 'RAG', 'LLM'],
      parentCapabilityId: capDigital.id,
      challenges: { connect: [{ id: chIa.id }, { id: chDigital.id }] }
    }
  });

  const capCyber = await prisma.capability.create({
    data: {
      uri: 'https://pit.wallonie.be/id/capability/cyber',
      code: 'CAP-DIG-CYBER',
      name: 'Cybersécurité',
      capabilityType: 'TECHNOLOGICAL',
      synonyms: ['Pentest', 'NIS2', 'MFA'],
      parentCapabilityId: capDigital.id,
      challenges: { connect: [{ id: chCyber.id }, { id: chDigital.id }] }
    }
  });

  const capCirc = await prisma.capability.create({
    data: {
      uri: 'https://pit.wallonie.be/id/capability/circularity',
      code: 'CAP-ECO-CIRC',
      name: 'Éco-conception & Circularité',
      capabilityType: 'BUSINESS',
      synonyms: ['Recyclage', 'Réemploi'],
      parentCapabilityId: capGreen.id,
      challenges: { connect: [{ id: chCirc.id }, { id: chDecarb.id }] }
    }
  });

  // Fonctions d'entreprise (EnterpriseFunction)
  const efMkt = await prisma.enterpriseFunction.create({ data: { name: 'Marketing', code: 'EF-MARKETING', uri: 'https://pit.wallonie.be/id/function/marketing' } });
  const efVente = await prisma.enterpriseFunction.create({ data: { name: 'Vente', code: 'EF-VENTE', uri: 'https://pit.wallonie.be/id/function/vente' } });
  const efRh = await prisma.enterpriseFunction.create({ data: { name: 'RH', code: 'EF-RH', uri: 'https://pit.wallonie.be/id/function/rh' } });
  const efProd = await prisma.enterpriseFunction.create({ data: { name: 'Production', code: 'EF-PRODUCTION', uri: 'https://pit.wallonie.be/id/function/production' } });
  const efRd = await prisma.enterpriseFunction.create({ data: { name: 'R&D', code: 'EF-RD', uri: 'https://pit.wallonie.be/id/function/rd' } });
  const efIt = await prisma.enterpriseFunction.create({ data: { name: 'IT', code: 'EF-IT', uri: 'https://pit.wallonie.be/id/function/it' } });
  const efFin = await prisma.enterpriseFunction.create({ data: { name: 'Finance', code: 'EF-FINANCE', uri: 'https://pit.wallonie.be/id/function/finance' } });
  const efLog = await prisma.enterpriseFunction.create({ data: { name: 'Logistique', code: 'EF-LOGISTIQUE', uri: 'https://pit.wallonie.be/id/function/logistique' } });
  const efAchat = await prisma.enterpriseFunction.create({ data: { name: 'Achat', code: 'EF-ACHAT', uri: 'https://pit.wallonie.be/id/function/achat' } });
  const efJur = await prisma.enterpriseFunction.create({ data: { name: 'Juridique', code: 'EF-JURIDIQUE', uri: 'https://pit.wallonie.be/id/function/juridique' } });

  // Secteurs NACE (NaceSector)
  const nsMetal = await prisma.naceSector.create({ data: { code: '24.10', name: 'Fabrication métallique', description: 'Sidérurgie et fabrication de métaux de base.' } });
  const nsAgro = await prisma.naceSector.create({ data: { code: '10.89', name: 'Agroalimentaire', description: 'Fabrication d’autres produits alimentaires divers.' } });
  const nsConst = await prisma.naceSector.create({ data: { code: '41.20', name: 'Construction', description: 'Construction de bâtiments résidentiels et non résidentiels.' } });
  const nsPharma = await prisma.naceSector.create({ data: { code: '21.20', name: 'Fabrication de préparations pharmaceutiques', description: 'Secteur des biotechnologies et sciences du vivant.' } });
  const nsRecyc = await prisma.naceSector.create({ data: { code: '38.32', name: 'Récupération de déchets triés', description: 'Valorisation des matières recyclables.' } });

  // Maillons Transverses (ValueChainStage)
  const stRechF = await prisma.valueChainStage.create({ data: { name: 'Recherche fondamentale', category: 'Innovation', uri: 'https://pit.wallonie.be/id/stage/recherche-fondamentale', valueChainId: vcNum.id } });
  const stRechA = await prisma.valueChainStage.create({ data: { name: 'Recherche appliquée', category: 'Innovation', uri: 'https://pit.wallonie.be/id/stage/recherche-appliquee', valueChainId: vcNum.id } });
  const stDevEx = await prisma.valueChainStage.create({ data: { name: 'Développement expérimental', category: 'Innovation', uri: 'https://pit.wallonie.be/id/stage/developpement-experimental', valueChainId: vcNum.id } });
  const stConcep = await prisma.valueChainStage.create({ data: { name: 'Conception', category: 'Industrialisation', uri: 'https://pit.wallonie.be/id/stage/conception', valueChainId: vcIndus.id } });
  const stProto = await prisma.valueChainStage.create({ data: { name: 'Prototypage', category: 'Industrialisation', uri: 'https://pit.wallonie.be/id/stage/prototypage', valueChainId: vcIndus.id } });
  const stValid = await prisma.valueChainStage.create({ data: { name: 'Validation', category: 'Industrialisation', uri: 'https://pit.wallonie.be/id/stage/validation', valueChainId: vcIndus.id } });
  const stCert = await prisma.valueChainStage.create({ data: { name: 'Certification', category: 'Industrialisation', uri: 'https://pit.wallonie.be/id/stage/certification', valueChainId: vcIndus.id } });
  const stProd = await prisma.valueChainStage.create({ data: { name: 'Production', category: 'Production', uri: 'https://pit.wallonie.be/id/stage/production', valueChainId: vcAgri.id } });
  const stAssem = await prisma.valueChainStage.create({ data: { name: 'Assemblage', category: 'Production', uri: 'https://pit.wallonie.be/id/stage/assemblage', valueChainId: vcAgri.id } });
  const stInteg = await prisma.valueChainStage.create({ data: { name: 'Intégration', category: 'Production', uri: 'https://pit.wallonie.be/id/stage/integration', valueChainId: vcAgri.id } });
  const stDist = await prisma.valueChainStage.create({ data: { name: 'Distribution', category: 'Go-To-Market', uri: 'https://pit.wallonie.be/id/stage/distribution', valueChainId: vcSante.id } });
  const stComm = await prisma.valueChainStage.create({ data: { name: 'Commercialisation', category: 'Go-To-Market', uri: 'https://pit.wallonie.be/id/stage/commercialisation', valueChainId: vcSante.id } });
  const stExport = await prisma.valueChainStage.create({ data: { name: 'Exportation', category: 'Go-To-Market', uri: 'https://pit.wallonie.be/id/stage/exportation', valueChainId: vcSante.id } });
  const stSupp = await prisma.valueChainStage.create({ data: { name: 'Support', category: 'Exploitation', uri: 'https://pit.wallonie.be/id/stage/support', valueChainId: vcBiotech.id } });
  const stMaint = await prisma.valueChainStage.create({ data: { name: 'Maintenance', category: 'Exploitation', uri: 'https://pit.wallonie.be/id/stage/maintenance', valueChainId: vcBiotech.id } });
  const stServ = await prisma.valueChainStage.create({ data: { name: 'Services', category: 'Exploitation', uri: 'https://pit.wallonie.be/id/stage/services', valueChainId: vcBiotech.id } });
  const stReemp = await prisma.valueChainStage.create({ data: { name: 'Réemploi', category: 'Circularité', uri: 'https://pit.wallonie.be/id/stage/reemploi', valueChainId: vcCirc.id } });
  const stRep = await prisma.valueChainStage.create({ data: { name: 'Réparation', category: 'Circularité', uri: 'https://pit.wallonie.be/id/stage/reparation', valueChainId: vcCirc.id } });
  const stRecyc = await prisma.valueChainStage.create({ data: { name: 'Recyclage', category: 'Circularité', uri: 'https://pit.wallonie.be/id/stage/recyclage', valueChainId: vcCirc.id } });

  // Rôles Écosystémiques (EcosystemRole)
  const roleTrans = await prisma.ecosystemRole.create({ data: { name: 'Transformateur', uri: 'https://pit.wallonie.be/id/role/transformateur' } });
  const roleInteg = await prisma.ecosystemRole.create({ data: { name: 'Intégrateur', uri: 'https://pit.wallonie.be/id/role/integrateur' } });
  const roleOper = await prisma.ecosystemRole.create({ data: { name: 'Opérateur S3', uri: 'https://pit.wallonie.be/id/role/operateur-s3' } });

  // 12. Écosystèmes Régionaux (Ecosystems)
  console.log('🌐 Création des Écosystèmes...');
  const ecoEdih = await prisma.ecosystem.create({
    data: {
      name: 'EDIH Wallonia',
      description: 'European Digital Innovation Hub pour le déploiement de l’IA et des technologies de pointe.',
      mission: 'Accompagner la numérisation et l’adoption de l’IA par les entreprises wallonnes.',
      territory: 'Wallonie',
      typeId: etEdih.id,
      actors: { connect: [{ id: orgAdn.id }, { id: orgWe.id }, { id: orgUcm.id }, { id: orgSirris.id }] },
      filieresS3: { connect: [{ id: svcNum.id }, { id: svcIndus.id }] },
      challenges: { connect: [{ id: bcIa.id }, { id: bcDigital.id }] },
      territories: { connect: [{ id: tWall.id }, { id: tLiege.id }, { id: tNamur.id }] }
    }
  });

  const ecoDw = await prisma.ecosystem.create({
    data: {
      name: 'Digital Wallonia',
      description: 'La stratégie numérique de la Wallonie et son écosystème d’acteurs technologiques.',
      mission: 'Faire du numérique un moteur de croissance économique régionale.',
      territory: 'Wallonie',
      typeId: etNetwork.id,
      actors: { connect: [{ id: orgAdn.id }] },
      filieresS3: { connect: [{ id: svcNum.id }] },
      challenges: { connect: [{ id: bcDigital.id }] }
    }
  });

  const ecoBioWin = await prisma.ecosystem.create({
    data: {
      name: 'Écosystème BioWin',
      description: 'Écosystème d\'innovation en sciences du vivant et biotechnologies.',
      mission: 'Structurer et dynamiser la filière santé et biotech wallonne.',
      territory: 'Wallonie',
      typeId: etPole.id,
      actors: { connect: [{ id: orgBioWin.id }, { id: orgSirris.id }, { id: orgWe.id }] },
      filieresS3: { connect: [{ id: svcSante.id }, { id: svcBiotech.id }] },
      challenges: { connect: [{ id: bcInno.id }, { id: bcExport.id }] }
    }
  });

  const ecoTweed = await prisma.ecosystem.create({
    data: {
      name: 'Écosystème TWEED',
      description: 'Écosystème de l\'énergie propre et de l\'hydrogène vert en Wallonie.',
      mission: 'Fédérer les acteurs de l\'énergie durable et propulser la filière Hydrogène.',
      territory: 'Wallonie',
      typeId: etCluster.id,
      actors: { connect: [{ id: orgTweed.id }, { id: orgWe.id }, { id: orgMecaTech.id }] },
      filieresS3: { connect: [{ id: svcHydro.id }, { id: svcEner.id }, { id: svcCirc.id }] },
      challenges: { connect: [{ id: bcDecarb.id }, { id: bcInno.id }] }
    }
  });

  // Ecosystem Memberships
  await prisma.ecosystemMembership.create({
    data: { ecosystemId: ecoEdih.id, organizationId: orgAdn.id, role: 'Coordinateur', status: 'ACTIVE' }
  });
  await prisma.ecosystemMembership.create({
    data: { ecosystemId: ecoEdih.id, organizationId: orgSirris.id, role: 'Expert', status: 'ACTIVE' }
  });
  await prisma.ecosystemMembership.create({
    data: { ecosystemId: ecoEdih.id, organizationId: orgWe.id, role: 'Financeur', status: 'ACTIVE' }
  });
  await prisma.ecosystemMembership.create({
    data: { ecosystemId: ecoEdih.id, organizationId: orgUcm.id, role: 'Partenaire', status: 'ACTIVE' }
  });
  await prisma.ecosystemMembership.create({
    data: { ecosystemId: ecoBioWin.id, organizationId: orgBioWin.id, role: 'Coordinateur', status: 'ACTIVE' }
  });
  await prisma.ecosystemMembership.create({
    data: { ecosystemId: ecoTweed.id, organizationId: orgTweed.id, role: 'Coordinateur', status: 'ACTIVE' }
  });

  // 13. Instruments de Financement (FundingInstrument)
  console.log('💳 Création des Instruments de Financement...');
  const fiFeder = await prisma.fundingInstrument.create({
    data: {
      name: 'FEDER Wallonie 2021-2027',
      type: 'FEDER',
      description: 'Fonds Européen de Développement Régional pour la cohésion économique et sociale en Wallonie.'
    }
  });

  const fiCheques = await prisma.fundingInstrument.create({
    data: {
      name: 'Chèques Entreprises Wallonie',
      type: 'Chèque Entreprise',
      description: 'Subventions de la Région wallonne pour le recours à des experts agréés (cyber, numérique, export...).'
    }
  });

  const fiHorizon = await prisma.fundingInstrument.create({
    data: {
      name: 'Horizon Europe S3',
      type: 'Horizon Europe',
      description: 'Programme européen pour la recherche collaborative et l\'innovation d\'excellence.'
    }
  });

  const fiDigitalEurope = await prisma.fundingInstrument.create({
    data: {
      name: 'Digital Europe Program (DEP)',
      type: 'Digital Europe',
      description: 'Financement européen pour les hubs d\'innovation numérique (EDIH).'
    }
  });

  // 14. Indicateurs de Résultats/Impact (OutcomeIndicator)
  console.log('📈 Création des Indicateurs de Résultats...');
  const indJobs = await prisma.outcomeIndicator.create({
    data: { name: 'Emplois créés', unit: 'ETP', description: 'Nombre d\'emplois équivalents temps plein créés chez les bénéficiaires.' }
  });
  const indCo2 = await prisma.outcomeIndicator.create({
    data: { name: 'Réduction CO2', unit: 'tonnes', description: 'Quantité d\'émissions de gaz à effet de serre évitées en tonnes équivalent CO2.' }
  });
  const indRevenue = await prisma.outcomeIndicator.create({
    data: { name: 'Chiffre d\'affaires additionnel', unit: 'EUR', description: 'Hausse du chiffre d\'affaires direct générée par le projet.' }
  });
  const indMaturity = await prisma.outcomeIndicator.create({
    data: { name: 'Hausse de maturité numérique', unit: 'points', description: 'Points gagnés sur l\'échelle d\'audit de maturité digitale/IA (1 à 5).' }
  });
  const indMatSaved = await prisma.outcomeIndicator.create({
    data: { name: 'Économie de matières premières', unit: 'tonnes', description: 'Volume de déchets ou matières valorisés dans un modèle circulaire.' }
  });

  // 15. Gouvernance Stratégique (Strategies, Priorities, Programs, Measures, Initiatives)
  console.log('🎯 Création des Structures de Gouvernance Stratégique...');
  
  // A. Stratégie 1: Digital Wallonia 2025
  const stDw = await prisma.strategy.create({
    data: {
      code: 'STRAT-DW2025',
      name: 'Digital Wallonia 2025',
      description: 'Stratégie numérique de la Wallonie pour accélérer la transformation de la société et de l\'économie régionale.',
      ownerOrganizationId: orgAdn.id,
      status: 'ACTIVE',
      website: 'https://www.digitalwallonia.be',
      filieresS3: { connect: [{ id: svcNum.id }, { id: svcIndus.id }] },
      fundingInstruments: { connect: [{ id: fiFeder.id }, { id: fiCheques.id }, { id: fiDigitalEurope.id }] }
    }
  });

  const pDw1 = await prisma.strategicPriority.create({
    data: {
      strategyId: stDw.id,
      code: 'PRIO-DW-ECONOMY',
      name: 'Économie numérique & Secteur technologique',
      description: 'Accélérer la numérisation des entreprises wallonnes de tous secteurs et faire grandir le secteur technologique local.'
    }
  });

  const pDw2 = await prisma.strategicPriority.create({
    data: {
      strategyId: stDw.id,
      code: 'PRIO-DW-TALENT',
      name: 'Compétences numériques & Emplois de demain',
      description: 'Développer le capital humain et former les professionnels aux compétences critiques.'
    }
  });

  // B. Stratégie 2: Wallonie S3 (Stratégie de Spécialisation Intelligente)
  const stS3 = await prisma.strategy.create({
    data: {
      code: 'STRAT-S3',
      name: 'Stratégie de Spécialisation Intelligente (S3)',
      description: 'Cadre stratégique pour orienter les investissements publics de recherche et innovation vers les filières industrielles à haute valeur ajoutée.',
      ownerOrganizationId: orgWe.id,
      status: 'ACTIVE',
      website: 'https://s3.wallonie.be',
      filieresS3: { connect: [{ id: svcIndus.id }, { id: svcSante.id }, { id: svcBiotech.id }, { id: svcHydro.id }] },
      fundingInstruments: { connect: [{ id: fiFeder.id }, { id: fiHorizon.id }] }
    }
  });

  const pS3_1 = await prisma.strategicPriority.create({
    data: {
      strategyId: stS3.id,
      code: 'PRIO-S3-INNO',
      name: 'Recherche et Innovation Collaborative',
      description: 'Favoriser les collaborations d\'excellence entre centres de recherche, universités et industriels.'
    }
  });

  const pS3_2 = await prisma.strategicPriority.create({
    data: {
      strategyId: stS3.id,
      code: 'PRIO-S3-TRANSITION',
      name: 'Décarbonation & Transition industrielle',
      description: 'Soutenir la transformation écologique des modes de production par l\'économie circulaire et l\'hydrogène.'
    }
  });

  // C. Stratégie 3: Circular Wallonia
  const stCw = await prisma.strategy.create({
    data: {
      code: 'STRAT-CW',
      name: 'Circular Wallonia',
      description: 'Stratégie régionale de déploiement de l\'économie circulaire en Wallonie.',
      ownerOrganizationId: orgWe.id,
      status: 'ACTIVE',
      website: 'https://circularwallonia.be',
      filieresS3: { connect: [{ id: svcCirc.id }, { id: svcConst.id }] },
      fundingInstruments: { connect: [{ id: fiFeder.id }, { id: fiCheques.id }] }
    }
  });

  const pCw1 = await prisma.strategicPriority.create({
    data: {
      strategyId: stCw.id,
      code: 'PRIO-CW-PROD',
      name: 'Production et Design circulaire',
      description: 'Concevoir des produits et services visant l\'économie de matière et la réparabilité dès la conception.'
    }
  });

  // PROGRAMS
  console.log('🚀 Création des Programmes stratégiques...');
  // Program 1: EDIH Wallonia (Under DW / S3)
  const prEdih = await prisma.program.create({
    data: {
      code: 'PROG-EDIH',
      name: 'EDIH Wallonia (European Digital Innovation Hub)',
      description: 'Guichet unique européen pour accompagner les PME manufacturières wallonnes dans l\'adoption de l\'IA et du calcul haute performance.',
      ownerOrganizationId: orgAdn.id,
      startDate: new Date('2023-01-01'),
      endDate: new Date('2026-12-31'),
      budget: 4500000.0,
      status: ProgramStatus.ACTIVE,
      strategies: { connect: [{ id: stDw.id }, { id: stS3.id }] },
      priorities: { connect: [{ id: pDw1.id }, { id: pDw2.id }, { id: pS3_1.id }] },
      ecosystems: { connect: [{ id: ecoEdih.id }] },
      filieresS3: { connect: [{ id: svcNum.id }, { id: svcIndus.id }] },
      territories: { connect: [{ id: tWall.id }] },
      fundingInstruments: { connect: [{ id: fiDigitalEurope.id }, { id: fiFeder.id }] }
    }
  });

  // Program 2: Chèques Entreprises (Under DW / S3 / CW)
  const prCheques = await prisma.program.create({
    data: {
      code: 'PROG-CHEQUES',
      name: 'Chèques Entreprises',
      description: 'Dispositif de subventions de la Région wallonne permettant aux PME d\'acheter des prestations d\'accompagnement et de conseil.',
      ownerOrganizationId: orgWe.id,
      startDate: new Date('2018-01-01'),
      budget: 12000000.0,
      status: ProgramStatus.ACTIVE,
      strategies: { connect: [{ id: stDw.id }, { id: stCw.id }] },
      priorities: { connect: [{ id: pDw1.id }, { id: pCw1.id }] },
      filieresS3: { connect: [{ id: svcNum.id }, { id: svcCirc.id }] },
      territories: { connect: [{ id: tWall.id }] },
      fundingInstruments: { connect: [{ id: fiCheques.id }] }
    }
  });

  // Program 3: Circular Design
  const prCircDesign = await prisma.program.create({
    data: {
      code: 'PROG-CIRCULAR-DESIGN',
      name: 'Circular Design & Materials',
      description: 'Programme d\'accompagnement collectif et individuel des industriels vers l\'éco-conception.',
      ownerOrganizationId: orgWe.id,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2027-12-31'),
      budget: 3000000.0,
      status: ProgramStatus.ACTIVE,
      strategies: { connect: [{ id: stCw.id }] },
      priorities: { connect: [{ id: pCw1.id }] },
      filieresS3: { connect: [{ id: svcCirc.id }, { id: svcConst.id }] },
      territories: { connect: [{ id: tWall.id }] },
      fundingInstruments: { connect: [{ id: fiFeder.id }] }
    }
  });

  // Program Participations (Consortium)
  await prisma.programParticipation.create({
    data: { programId: prEdih.id, organizationId: orgAdn.id, role: ParticipationRole.COORDINATOR, status: 'ACTIVE' }
  });
  await prisma.programParticipation.create({
    data: { programId: prEdih.id, organizationId: orgSirris.id, role: ParticipationRole.PARTNER, status: 'ACTIVE' }
  });
  await prisma.programParticipation.create({
    data: { programId: prEdih.id, organizationId: orgWe.id, role: ParticipationRole.FUNDER, status: 'ACTIVE' }
  });
  await prisma.programParticipation.create({
    data: { programId: prCheques.id, organizationId: orgWe.id, role: ParticipationRole.COORDINATOR, status: 'ACTIVE' }
  });

  // MEASURES
  console.log('📏 Création des Mesures...');
  // EDIH Measures
  const mEdihTest = await prisma.measure.create({
    data: {
      code: 'MEAS-EDIH-TEST',
      name: 'Test Before Invest',
      description: 'Permettre aux PME de valider techniquement leurs concepts IA / Cloud avant d\'investir.',
      budget: 2000000.0,
      status: 'ACTIVE',
      programs: { connect: [{ id: prEdih.id }] },
      priorities: { connect: [{ id: pDw1.id }] },
      filieresS3: { connect: [{ id: svcNum.id }, { id: svcIndus.id }] },
      fundingInstruments: { connect: [{ id: fiDigitalEurope.id }] }
    }
  });

  const mEdihSkills = await prisma.measure.create({
    data: {
      code: 'MEAS-EDIH-SKILLS',
      name: 'Skills & Training',
      description: 'Formations avancées sur l\'IA et la cybersécurité destinées aux ingénieurs et techniciens de PME.',
      budget: 1500000.0,
      status: 'ACTIVE',
      programs: { connect: [{ id: prEdih.id }] },
      priorities: { connect: [{ id: pDw2.id }] },
      fundingInstruments: { connect: [{ id: fiDigitalEurope.id }] }
    }
  });

  const mEdihNet = await prisma.measure.create({
    data: {
      code: 'MEAS-EDIH-NETWORKING',
      name: 'Networking & Ecosystème',
      description: 'Mise en relation des PME locales avec des offreurs de solutions et hubs européens.',
      budget: 1000000.0,
      status: 'ACTIVE',
      programs: { connect: [{ id: prEdih.id }] },
      priorities: { connect: [{ id: pDw1.id }] }
    }
  });

  // Chèques Measures
  const mChequeCyber = await prisma.measure.create({
    data: {
      code: 'MEAS-CHEQUE-CYBER',
      name: 'Cybersécurité PME',
      description: 'Financement d\'audits de sécurité et plans d\'action cyber.',
      budget: 4000000.0,
      status: 'ACTIVE',
      programs: { connect: [{ id: prCheques.id }] },
      priorities: { connect: [{ id: pDw1.id }] },
      filieresS3: { connect: [{ id: svcNum.id }] },
      fundingInstruments: { connect: [{ id: fiCheques.id }] }
    }
  });

  const mChequeDigi = await prisma.measure.create({
    data: {
      code: 'MEAS-CHEQUE-DIGI',
      name: 'Transformation digitale',
      description: 'Financement de coachs agréés pour l\'accompagnement vers la transition numérique.',
      budget: 8000000.0,
      status: 'ACTIVE',
      programs: { connect: [{ id: prCheques.id }] },
      priorities: { connect: [{ id: pDw1.id }] },
      filieresS3: { connect: [{ id: svcNum.id }] },
      fundingInstruments: { connect: [{ id: fiCheques.id }] }
    }
  });

  // INITIATIVES
  console.log('📌 Création des Initiatives opérationnelles...');
  const initDiagIa = await prisma.initiative.create({
    data: {
      measureId: mEdihTest.id,
      code: 'INIT-DIAG-IA',
      name: 'PoC Vision IA Industrielle',
      description: 'Mise en œuvre concrète de modèles d\'IA de vision par ordinateur pour le contrôle de fabrication.',
      leadOrganizationId: orgAdn.id,
      startDate: new Date('2023-06-01'),
      status: InitiativeStatus.ACTIVE,
      priorities: { connect: [{ id: pDw1.id }] },
      ecosystems: { connect: [{ id: ecoEdih.id }] },
      filieresS3: { connect: [{ id: svcIndus.id }] },
      territories: { connect: [{ id: tWall.id }] },
      fundingInstruments: { connect: [{ id: fiDigitalEurope.id }] }
    }
  });

  const initTrainIa = await prisma.initiative.create({
    data: {
      measureId: mEdihSkills.id,
      code: 'INIT-TRAIN-IA',
      name: 'Formations Continues IA/Cyber',
      description: 'Ateliers et formations intensives en ligne et en présentiel sur le machine learning industriel.',
      leadOrganizationId: orgAdn.id,
      startDate: new Date('2023-09-01'),
      status: InitiativeStatus.ACTIVE,
      priorities: { connect: [{ id: pDw2.id }] },
      ecosystems: { connect: [{ id: ecoEdih.id }] },
      territories: { connect: [{ id: tWall.id }] }
    }
  });

  const initAuditCyber = await prisma.initiative.create({
    data: {
      measureId: mChequeCyber.id,
      code: 'INIT-AUDIT-CYBER',
      name: 'Audit Sécurité PME (Chèques)',
      description: 'Lancement d\'audits et diagnostics de cybersécurité pour renforcer la cyber-résilience.',
      leadOrganizationId: orgWe.id,
      startDate: new Date('2019-01-01'),
      status: InitiativeStatus.ACTIVE,
      priorities: { connect: [{ id: pDw1.id }] },
      filieresS3: { connect: [{ id: svcNum.id }] },
      territories: { connect: [{ id: tWall.id }] },
      fundingInstruments: { connect: [{ id: fiCheques.id }] }
    }
  });

  const initCoachDigi = await prisma.initiative.create({
    data: {
      measureId: mChequeDigi.id,
      code: 'INIT-COACH-DIGI',
      name: 'Coaching Transition Numérique',
      description: 'Conseil stratégique pour la réingénierie des processus internes des PME.',
      leadOrganizationId: orgWe.id,
      startDate: new Date('2018-01-01'),
      status: InitiativeStatus.ACTIVE,
      priorities: { connect: [{ id: pDw1.id }] },
      filieresS3: { connect: [{ id: svcNum.id }] },
      territories: { connect: [{ id: tWall.id }] },
      fundingInstruments: { connect: [{ id: fiCheques.id }] }
    }
  });

  // Initiative Participations
  await prisma.initiativeParticipation.create({
    data: { initiativeId: initDiagIa.id, organizationId: orgSirris.id, role: ParticipationRole.OPERATOR }
  });
  await prisma.initiativeParticipation.create({
    data: { initiativeId: initDiagIa.id, organizationId: orgAdn.id, role: ParticipationRole.COORDINATOR }
  });

  // 16. Services Publics (CPSV-AP) & Liaison avec Initiatives
  console.log('🛠️ Création des Services Publics & associations...');
  
  // Service 1: Diagnostic IA
  const intDiagIa = await prisma.intervention.create({
    data: {
      uri: 'https://pit.wallonie.be/id/intervention/diagnostic-ia',
      title: 'Diagnostic IA',
      description: 'Audit et identification des cas d’usages concrets de l’intelligence artificielle dans votre processus de production.',
      interventionTypeId: itService.id,
      ownerOrganizationId: orgAdn.id
    }
  });

  const sDiagIa = await prisma.publicService.create({
    data: {
      uri: 'https://pit.wallonie.be/id/public-service/diagnostic-ia',
      name: 'Diagnostic IA',
      description: 'Audit et identification des cas d’usages concrets de l’intelligence artificielle dans votre processus de production.',
      code: 'S-IA-DIAG',
      organizationId: orgAdn.id,
      interventionLevelId: ilIndiv.id,
      interventionId: intDiagIa.id,
      channels: { connect: [{ id: chRdv.id }] },
      targetAudiences: { connect: [{ id: taPme.id }, { id: taStartup.id }] },
      businessEvents: { connect: [{ id: beDigitalTrans.id }] },
      catalogues: { connect: [{ id: cataloguePIT.id }] },
      challenges: { connect: [{ id: bcIa.id }, { id: bcDigital.id }] },
      filieresS3: { connect: [{ id: svcIndus.id }, { id: svcSante.id }] },
      impactedFunctions: { connect: [{ id: efProd.id }, { id: efIt.id }] },
      stages: { connect: [{ id: stConcep.id }, { id: stProd.id }] },
      ecosystems: { connect: [{ id: ecoEdih.id }] },
      initiatives: { connect: [{ id: initDiagIa.id }] },
      fundingInstruments: { connect: [{ id: fiDigitalEurope.id }] },
      impacts: { carbon: 30, jobs: 40, sovereignty: 50, resilience: 60, competitiveness: 80, digiscoreBoost: 15 },
      capabilitiesNew: { connect: [{ id: capIa.id }] }
    },
  });

  await prisma.output.create({
    data: {
      uri: 'https://pit.wallonie.be/id/output/rapport-ia-diag',
      name: 'Rapport de diagnostic IA',
      description: 'Rapport d’audit des processus et axes d’intégration IA.',
      code: 'OUT-IA-REPORT',
      publicServiceId: sDiagIa.id
    }
  });

  await prisma.outcome.create({
    data: {
      uri: 'https://pit.wallonie.be/id/outcome/plan-ia-action',
      name: 'Plan d’action IA théorique',
      description: 'Feuille de route théorique pour le déploiement de l’IA.',
      code: 'OCT-IA-PLAN',
      publicServiceId: sDiagIa.id
    }
  });

  // Service 2: Chèque Cybersécurité
  const intCyberCheck = await prisma.intervention.create({
    data: {
      uri: 'https://pit.wallonie.be/id/intervention/cheque-cybersecurite',
      title: 'Chèque Cybersécurité',
      description: 'Subvention pour réaliser un audit de sécurité de vos infrastructures IT et former vos équipes.',
      interventionTypeId: itFunding.id,
      ownerOrganizationId: orgAdn.id
    }
  });

  const sCyberCheck = await prisma.publicService.create({
    data: {
      uri: 'https://pit.wallonie.be/id/public-service/cheque-cybersecurite',
      name: 'Chèque Cybersécurité',
      description: 'Subvention pour réaliser un audit de sécurité de vos infrastructures IT et former vos équipes.',
      code: 'S-CYBER-CHECK',
      organizationId: orgAdn.id,
      interventionLevelId: ilIndiv.id,
      interventionId: intCyberCheck.id,
      channels: { connect: [{ id: chWeb.id }] },
      targetAudiences: { connect: [{ id: taPme.id }, { id: taStartup.id }, { id: taIndependant.id }] },
      businessEvents: { connect: [{ id: beDigitalTrans.id }] },
      catalogues: { connect: [{ id: cataloguePIT.id }] },
      challenges: { connect: [{ id: bcCyber.id }] },
      filieresS3: { connect: [{ id: svcNum.id }] },
      impactedFunctions: { connect: [{ id: efIt.id }] },
      ecosystems: { connect: [{ id: ecoEdih.id }] },
      initiatives: { connect: [{ id: initAuditCyber.id }] },
      fundingInstruments: { connect: [{ id: fiCheques.id }] },
      impacts: { carbon: 10, jobs: 20, sovereignty: 70, resilience: 80, competitiveness: 60, digiscoreBoost: 10 },
      capabilitiesNew: { connect: [{ id: capCyber.id }] }
    },
  });

  await prisma.output.create({
    data: {
      uri: 'https://pit.wallonie.be/id/output/rapport-audit-cyber',
      name: 'Audit de cybersécurité',
      code: 'OUT-CYBER-AUDIT',
      publicServiceId: sCyberCheck.id
    }
  });

  // Service 3: Coaching Export (AWEX)
  const intExportCoach = await prisma.intervention.create({
    data: {
      uri: 'https://pit.wallonie.be/id/intervention/coaching-export',
      title: 'Coaching Export',
      description: 'Accompagnement individuel par un conseiller AWEX pour définir sa stratégie de développement international.',
      interventionTypeId: itService.id,
      ownerOrganizationId: orgAwex.id
    }
  });

  const sExportCoach = await prisma.publicService.create({
    data: {
      uri: 'https://pit.wallonie.be/id/public-service/coaching-export',
      name: 'Coaching Export',
      description: 'Accompagnement individuel par un conseiller AWEX pour définir sa stratégie de développement international.',
      code: 'S-EXPORT-COACH',
      organizationId: orgAwex.id,
      interventionLevelId: ilIndiv.id,
      interventionId: intExportCoach.id,
      channels: { connect: [{ id: chRdv.id }] },
      targetAudiences: { connect: [{ id: taPme.id }, { id: taStartup.id }] },
      businessEvents: { connect: [{ id: beInternational.id }] },
      catalogues: { connect: [{ id: cataloguePIT.id }] },
      challenges: { connect: [{ id: bcExport.id }] },
      impactedFunctions: { connect: [{ id: efVente.id }, { id: efMkt.id }] },
      stages: { connect: [{ id: stExport.id }] },
      impacts: { carbon: 20, jobs: 60, sovereignty: 50, resilience: 60, competitiveness: 90, digiscoreBoost: 5 },
    },
  });

  // Service 4: Diagnostic de maturité numérique (AdN)
  const intDiagNum = await prisma.intervention.create({
    data: {
      uri: 'https://pit.wallonie.be/id/intervention/diagnostic-maturite-numerique',
      title: 'Diagnostic de maturité numérique',
      description: 'Évaluation globale du niveau de maturité digitale de l’entreprise.',
      interventionTypeId: itService.id,
      ownerOrganizationId: orgAdn.id
    }
  });

  const sDiagNum = await prisma.publicService.create({
    data: {
      uri: 'https://pit.wallonie.be/id/public-service/diagnostic-maturite-numerique',
      name: 'Diagnostic de maturité numérique',
      description: 'Évaluation globale du niveau de maturité digitale de l’entreprise.',
      code: 'S-DIGITAL-DIAG',
      organizationId: orgAdn.id,
      interventionLevelId: ilIndiv.id,
      interventionId: intDiagNum.id,
      channels: { connect: [{ id: chWeb.id }, { id: chRdv.id }] },
      targetAudiences: { connect: [{ id: taPme.id }, { id: taStartup.id }, { id: taIndependant.id }] },
      businessEvents: { connect: [{ id: beDigitalTrans.id }] },
      catalogues: { connect: [{ id: cataloguePIT.id }] },
      challenges: { connect: [{ id: bcDigital.id }] },
      filieresS3: { connect: [{ id: svcIndus.id }] },
      impactedFunctions: { connect: [{ id: efIt.id }, { id: efProd.id }] },
      ecosystems: { connect: [{ id: ecoDw.id }] },
      impacts: { carbon: 15, jobs: 30, sovereignty: 50, resilience: 50, competitiveness: 60, digiscoreBoost: 15 },
      capabilitiesNew: { connect: [{ id: capDigital.id }] }
    },
  });

  // Service 5: Accompagnement à la transformation digitale (WE)
  const intAccompDigital = await prisma.intervention.create({
    data: {
      uri: 'https://pit.wallonie.be/id/intervention/accompagnement-transformation-digitale',
      title: 'Accompagnement à la transformation digitale',
      description: 'Soutien par un coach WE agréé pour la réalisation de projets de digitalisation.',
      interventionTypeId: itService.id,
      ownerOrganizationId: orgWe.id
    }
  });

  const sAccompDigital = await prisma.publicService.create({
    data: {
      uri: 'https://pit.wallonie.be/id/public-service/accompagnement-transformation-digitale',
      name: 'Accompagnement à la transformation digitale',
      description: 'Soutien par un coach WE agréé pour la réalisation de projets de digitalisation.',
      code: 'S-DIGITAL-COACH',
      organizationId: orgWe.id,
      interventionLevelId: ilIndiv.id,
      interventionId: intAccompDigital.id,
      channels: { connect: [{ id: chRdv.id }, { id: chGuichet.id }] },
      targetAudiences: { connect: [{ id: taPme.id }, { id: taStartup.id }] },
      businessEvents: { connect: [{ id: beDigitalTrans.id }] },
      catalogues: { connect: [{ id: cataloguePIT.id }] },
      challenges: { connect: [{ id: bcDigital.id }] },
      impactedFunctions: { connect: [{ id: efIt.id }, { id: efRh.id }, { id: efVente.id }] },
      initiatives: { connect: [{ id: initCoachDigi.id }] },
      fundingInstruments: { connect: [{ id: fiCheques.id }] },
      impacts: { carbon: 40, jobs: 50, sovereignty: 60, resilience: 70, competitiveness: 80, digiscoreBoost: 20 },
      capabilitiesNew: { connect: [{ id: capDigital.id }] }
    },
  });

  // Service 6: Workshop IA & PME (AdN) - COLLECTIVE
  const intWorkshopIa = await prisma.intervention.create({
    data: {
      uri: 'https://pit.wallonie.be/id/intervention/workshop-ia',
      title: 'Workshop IA & PME manufacturières',
      description: 'Session collective de sensibilisation et de co-conception de cas d’usage IA.',
      interventionTypeId: itService.id,
      ownerOrganizationId: orgAdn.id
    }
  });

  const sWorkshopIa = await prisma.publicService.create({
    data: {
      uri: 'https://pit.wallonie.be/id/public-service/workshop-ia',
      name: 'Workshop IA & PME manufacturières',
      description: 'Session collective de sensibilisation et de co-conception de cas d’usage IA.',
      code: 'S-IA-WORKSHOP',
      organizationId: orgAdn.id,
      interventionLevelId: ilColl.id,
      interventionId: intWorkshopIa.id,
      channels: { connect: [{ id: chGuichet.id }] },
      targetAudiences: { connect: [{ id: taPme.id }] },
      businessEvents: { connect: [{ id: beDigitalTrans.id }] },
      catalogues: { connect: [{ id: cataloguePIT.id }] },
      challenges: { connect: [{ id: bcIa.id }] },
      filieresS3: { connect: [{ id: svcIndus.id }] },
      impactedFunctions: { connect: [{ id: efProd.id }] },
      stages: { connect: [{ id: stProto.id }] },
      ecosystems: { connect: [{ id: ecoEdih.id }] },
      initiatives: { connect: [{ id: initTrainIa.id }] },
      capabilitiesNew: { connect: [{ id: capIa.id }] }
    }
  });

  // Service 7: Coordination EDIH Wallonia (AdN) - SECOND_LINE
  const intCoordHub = await prisma.intervention.create({
    data: {
      uri: 'https://pit.wallonie.be/id/intervention/coordination-edih',
      title: 'Coordination EDIH Wallonia',
      description: 'Mission de coordination et d’animation de l’écosystème d’opérateurs et d’acteurs de la transition numérique.',
      interventionTypeId: itMission.id,
      ownerOrganizationId: orgAdn.id
    }
  });

  const sCoordHub = await prisma.publicService.create({
    data: {
      uri: 'https://pit.wallonie.be/id/public-service/coordination-edih',
      name: 'Coordination EDIH Wallonia',
      description: 'Mission de coordination et d’animation de l’écosystème d’opérateurs et d’acteurs de la transition numérique.',
      code: 'S-EDIH-COORD',
      organizationId: orgAdn.id,
      interventionLevelId: ilSecLine.id,
      interventionId: intCoordHub.id,
      channels: { connect: [{ id: chRdv.id }] },
      targetAudiences: { connect: [{ id: taResearcher.id }] },
      catalogues: { connect: [{ id: cataloguePIT.id }] },
      challenges: { connect: [{ id: bcDigital.id }] },
      filieresS3: { connect: [{ id: svcNum.id }] },
      ecosystems: { connect: [{ id: ecoEdih.id }] },
      capabilitiesNew: { connect: [{ id: capDigital.id }, { id: capIa.id }, { id: capCyber.id }] }
    }
  });

  // 17. Actifs de Connaissance (KnowledgeAsset)
  console.log('📘 Création des Actifs de Connaissance...');
  const kaCircDesign = await prisma.knowledgeAsset.create({
    data: {
      title: 'Guide Circular Design Wallonia',
      type: KnowledgeAssetType.GUIDE,
      description: 'Méthodologie complète pour initier l\'éco-conception de produits dans l\'industrie wallonne.',
      url: 'https://circularwallonia.be/publications/guide-circular-design',
      programs: { connect: [{ id: prCircDesign.id }] },
      publicServices: { connect: [{ id: sAccompDigital.id }] }
    }
  });

  const kaIaGuide = await prisma.knowledgeAsset.create({
    data: {
      title: 'Guide IA pour les PME wallonnes',
      type: KnowledgeAssetType.GUIDE,
      description: 'Vulgarisation et cas d\'usage pratiques de l\'intelligence artificielle pour les managers d\'entreprises.',
      url: 'https://www.digitalwallonia.be/publications/guide-ia-pme',
      programs: { connect: [{ id: prEdih.id }] },
      initiatives: { connect: [{ id: initDiagIa.id }] },
      publicServices: { connect: [{ id: sDiagIa.id }, { id: sWorkshopIa.id }] },
      ecosystems: { connect: [{ id: ecoEdih.id }] }
    }
  });

  const kaH2Benchmark = await prisma.knowledgeAsset.create({
    data: {
      title: 'Benchmark Filière Hydrogène Wallonie',
      type: KnowledgeAssetType.BENCHMARK,
      description: 'Étude d\'alignement et état des lieux des compétences scientifiques et industrielles sur l\'hydrogène vert.',
      url: 'https://tweed.be/benchmark-hydrogene',
      ecosystems: { connect: [{ id: ecoTweed.id }] }
    }
  });

  // 18. Besoins Métier (BusinessNeed)
  console.log('💡 Création des Besoins Métier...');
  const bnCtrlQual = await prisma.businessNeed.create({
    data: {
      name: 'Automatiser le contrôle qualité',
      uri: 'https://pit.wallonie.be/id/need/automatiser-controle-qualite',
      description: 'Mettre en place des solutions automatisées (IA vision) pour le contrôle qualité.',
      valueChains: { connect: [{ id: svcAgri.id }] },
      valueChainStages: { connect: [{ id: stProd.id }] },
      services: { connect: [{ id: sDiagIa.id }, { id: sAccompDigital.id }] },
      rule: {
        operator: "AND",
        conditions: [
          { field: "sector", operator: "==", value: "Agroalimentaire" },
          { field: "maturityIa", operator: "<", value: 3 }
        ]
      }
    }
  });

  const bnBim = await prisma.businessNeed.create({
    data: {
      name: 'Digitaliser les processus BIM',
      uri: 'https://pit.wallonie.be/id/need/digitaliser-processus-bim',
      description: 'Intégrer les technologies et méthodes de Building Information Modeling.',
      valueChains: { connect: [{ id: svcConst.id }] },
      valueChainStages: { connect: [{ id: stConcep.id }] },
      services: { connect: [{ id: sDiagNum.id }, { id: sAccompDigital.id }] },
      rule: {
        operator: "AND",
        conditions: [
          { field: "sector", operator: "==", value: "Construction" },
          { field: "maturityDigital", operator: "<", value: 3 }
        ]
      }
    }
  });

  const bnCyber = await prisma.businessNeed.create({
    data: {
      name: 'Améliorer la cybersécurité',
      uri: 'https://pit.wallonie.be/id/need/ameliorer-cybersecurite',
      description: 'Sécuriser l’infrastructure informatique et auditer les failles.',
      services: { connect: [{ id: sCyberCheck.id }, { id: sAccompDigital.id }] },
      rule: {
        operator: "AND",
        conditions: [
          { field: "maturityCyber", operator: "<", value: 3 }
        ]
      }
    }
  });

  // 19. Parcours Types (Journeys)
  console.log('🗺️ Création des Parcours Types...');
  const jIa = await prisma.journey.create({
    data: {
      name: 'Parcours IA',
      provider: 'EDIH Wallonia',
      uri: 'https://pit.wallonie.be/id/journey/parcours-ia',
      objective: 'Adopté l’IA au sein des PME manufacturières régionales.',
      description: 'De la sensibilisation au déploiement opérationnel d’outils d’IA.',
      targetAudience: ['PME', 'Startup'],
      filieresS3: { connect: [{ id: svcIndus.id }, { id: svcNum.id }] },
      challenges: { connect: [{ id: bcIa.id }] },
      ecosystems: { connect: [{ id: ecoEdih.id }] }
    }
  });

  const jsSensIa = await prisma.journeyStage.create({
    data: {
      name: 'Sensibilisation',
      position: 1,
      journeyId: jIa.id,
      services: { connect: [{ id: sDiagNum.id }] }
    }
  });

  const jsDiagIa = await prisma.journeyStage.create({
    data: {
      name: 'Diagnostic',
      position: 2,
      journeyId: jIa.id,
      services: { connect: [{ id: sDiagIa.id }] }
    }
  });

  const jsAccIa = await prisma.journeyStage.create({
    data: {
      name: 'Expérimentation',
      position: 3,
      journeyId: jIa.id,
      services: { connect: [{ id: sAccompDigital.id }] }
    }
  });

  const jCyber = await prisma.journey.create({
    data: {
      name: 'Parcours Cybersécurité',
      provider: 'Agence du Numérique',
      uri: 'https://pit.wallonie.be/id/journey/parcours-cyber',
      objective: 'Sécuriser les infrastructures informatiques des entreprises.',
      targetAudience: ['PME', 'Startup', 'Indépendant'],
      filieresS3: { connect: [{ id: svcNum.id }] },
      challenges: { connect: [{ id: bcCyber.id }] }
    }
  });

  const jsAuditCyber = await prisma.journeyStage.create({
    data: {
      name: 'Audit',
      position: 1,
      journeyId: jCyber.id,
      services: { connect: [{ id: sCyberCheck.id }] }
    }
  });

  const jsMiseCyber = await prisma.journeyStage.create({
    data: {
      name: 'Mise en conformité',
      position: 2,
      journeyId: jCyber.id,
      services: { connect: [{ id: sAccompDigital.id }] }
    }
  });

  // 20. Bénéficiaires (Entreprises)
  console.log('🏢 Création des Bénéficiaires territoriaux...');
  
  // Beneficiary 1: Biscuiterie Dupont (Namur, Agroalimentaire)
  const bDupont = await prisma.beneficiary.create({
    data: {
      name: 'Biscuiterie Dupont',
      bce: '0400.123.456',
      size: 'PME',
      employees: 45,
      revenue: 5000000.0,
      location: 'Namur',
      province: 'Namur',
      arrondissement: 'Namur',
      demand: 'Nous souhaitons automatiser le contrôle qualité de nos biscuits en fin de ligne de cuisson.',
      primaryNaceSectorId: nsAgro.id,
      territoryId: cNamurCity.id,
      maturityDigital: 2,
      maturityIa: 1,
      maturityCyber: 2,
      maturityExport: 1,
      maturityDurability: 2,
      challenges: { connect: [{ id: bcIa.id }, { id: bcDigital.id }] },
      filieresS3: { connect: [{ id: svcAgri.id }] },
      stages: { connect: [{ id: stProd.id }] },
      playsRole: { connect: [{ id: roleTrans.id }] },
      needs: { connect: [{ id: bnCtrlQual.id }] },
      enrolledJourneys: { connect: [{ id: jIa.id }] },
      roadmapLogs: [
        { id: "log-1", operator: "AdN", action: "Création du profil", timestamp: "2026-06-08T09:00:00Z", detail: "Profil de la biscuiterie créé dans le graphe." },
        { id: "log-2", operator: "AdN", action: "Recommandation Diagnostic", timestamp: "2026-06-08T09:15:00Z", detail: "Diagnostic IA recommandé suite au faible score IA." }
      ]
    }
  });

  // Beneficiary 2: TechConstruct (Liège, Construction)
  const bTechConstruct = await prisma.beneficiary.create({
    data: {
      name: 'TechConstruct',
      bce: '0500.987.654',
      size: 'PME',
      employees: 30,
      revenue: 3500000.0,
      location: 'Liège',
      province: 'Liège',
      arrondissement: 'Liège',
      demand: 'Nous voulons intégrer le BIM pour mieux collaborer sur nos chantiers de construction.',
      primaryNaceSectorId: nsConst.id,
      territoryId: cLiegeCity.id,
      maturityDigital: 1,
      maturityIa: 1,
      maturityCyber: 1,
      maturityExport: 1,
      maturityDurability: 1,
      challenges: { connect: [{ id: bcDigital.id }] },
      filieresS3: { connect: [{ id: svcConst.id }] },
      stages: { connect: [{ id: stConcep.id }] },
      playsRole: { connect: [{ id: roleInteg.id }] },
      needs: { connect: [{ id: bnBim.id }] },
      roadmapLogs: [
        { id: "log-1", operator: "WE", action: "Création du profil", timestamp: "2026-06-08T09:30:00Z", detail: "Profil initial créé." }
      ]
    }
  });

  // Beneficiary 3: H2Energy (Hainaut, Hydrogène / Énergie)
  const bH2Energy = await prisma.beneficiary.create({
    data: {
      name: 'H2Energy SAS',
      bce: '0700.111.222',
      size: 'Startup',
      employees: 12,
      revenue: 800000.0,
      location: 'Charleroi',
      province: 'Hainaut',
      arrondissement: 'Charleroi',
      demand: 'Développer des piles à combustibles de nouvelle génération pour la logistique lourde.',
      primaryNaceSectorId: nsMetal.id,
      territoryId: cCharleroi.id,
      maturityDigital: 3,
      maturityIa: 2,
      maturityCyber: 2,
      maturityExport: 2,
      maturityDurability: 4,
      challenges: { connect: [{ id: bcInno.id }, { id: bcDecarb.id }, { id: bcFund.id }] },
      filieresS3: { connect: [{ id: svcHydro.id }, { id: svcEner.id }] },
      stages: { connect: [{ id: stRechA.id }, { id: stProto.id }] },
      playsRole: { connect: [{ id: roleOper.id }] },
      roadmapLogs: [
        { id: "log-1", operator: "TWEED", action: "Intégration Cluster", timestamp: "2026-05-12T11:00:00Z", detail: "Enregistrement en tant qu'opérateur hydrogène." }
      ]
    }
  });

  // Beneficiary 4: PharmaPlus (Brabant Wallon, Pharma/Biotech)
  const bPharmaPlus = await prisma.beneficiary.create({
    data: {
      name: 'PharmaPlus Biotech',
      bce: '0800.333.444',
      size: 'Grande Entreprise',
      employees: 250,
      revenue: 75000000.0,
      location: 'Wavre',
      province: 'Brabant Wallon',
      arrondissement: 'Nivelles',
      demand: 'Optimiser le conditionnement stérile par cobotique et renforcer la cybersécurité industrielle (OT).',
      primaryNaceSectorId: nsPharma.id,
      territoryId: cWavre.id,
      maturityDigital: 4,
      maturityIa: 2,
      maturityCyber: 3,
      maturityExport: 4,
      maturityDurability: 3,
      challenges: { connect: [{ id: bcIa.id }, { id: bcCyber.id }, { id: bcInno.id }] },
      filieresS3: { connect: [{ id: svcSante.id }, { id: svcBiotech.id }] },
      stages: { connect: [{ id: stProd.id }, { id: stValid.id }] },
      playsRole: { connect: [{ id: roleTrans.id }] },
      enrolledJourneys: { connect: [{ id: jCyber.id }] }
    }
  });

  // 21. Engagements / Actions (ActionInstance & BeneficiaryEngagement)
  console.log('🎬 Création des Engagements (ActionInstance & BeneficiaryEngagement)...');
  
  // ActionInstance (Retrocompatibilité)
  const actIaDupont = await prisma.actionInstance.create({
    data: {
      title: "Plan de transition IA Biscuiterie",
      objective: "Déployer de la vision par IA pour le tri automatique de biscuits.",
      status: "IN_PROGRESS",
      beneficiaryId: bDupont.id,
      journeyId: jIa.id,
      ecosystemId: ecoEdih.id
    }
  });

  const actCyberPharma = await prisma.actionInstance.create({
    data: {
      title: "Sécurisation OT PharmaPlus",
      objective: "Mettre en conformité les lignes de production par rapport à la directive NIS2.",
      status: "PLANNED",
      beneficiaryId: bPharmaPlus.id,
      journeyId: jCyber.id,
      ecosystemId: ecoEdih.id
    }
  });

  // BeneficiaryEngagement (Nouveau Modèle)
  const engIaDupont = await prisma.beneficiaryEngagement.create({
    data: {
      beneficiaryId: bDupont.id,
      journeyId: jIa.id,
      initiativeId: initDiagIa.id,
      ecosystemId: ecoEdih.id,
      territoryId: tNamur.id,
      title: "Plan de transition IA Biscuiterie",
      objective: "Déployer de la vision par IA pour le tri automatique de biscuits.",
      status: "IN_PROGRESS",
      filieresS3: { connect: [{ id: svcAgri.id }] }
    }
  });

  const engCyberPharma = await prisma.beneficiaryEngagement.create({
    data: {
      beneficiaryId: bPharmaPlus.id,
      journeyId: jCyber.id,
      initiativeId: initAuditCyber.id,
      ecosystemId: ecoEdih.id,
      territoryId: tBrabant.id,
      title: "Sécurisation OT PharmaPlus",
      objective: "Mettre en conformité les lignes de production par rapport à la directive NIS2.",
      status: "PLANNED",
      filieresS3: { connect: [{ id: svcSante.id }, { id: svcBiotech.id }] }
    }
  });

  // 22. Enrôlements de parcours (JourneyEnrollment)
  console.log('📈 Création des Enrôlements de parcours...');
  await prisma.journeyEnrollment.create({
    data: {
      beneficiaryId: bDupont.id,
      journeyId: jIa.id,
      currentStageId: jsDiagIa.id,
      status: "IN_PROGRESS",
      completionRate: 33.3,
      startDate: new Date('2026-06-05T09:00:00Z')
    }
  });

  await prisma.journeyEnrollment.create({
    data: {
      beneficiaryId: bPharmaPlus.id,
      journeyId: jCyber.id,
      currentStageId: jsAuditCyber.id,
      status: "ENROLLED",
      completionRate: 0.0,
      startDate: new Date('2026-06-09T14:00:00Z')
    }
  });

  // 23. Événements Territoriaux (EventResource)
  console.log('📅 Création des Événements Territoriaux...');
  const evtIaAtelier = await prisma.eventResource.create({
    data: {
      uri: 'https://pit.wallonie.be/id/event/atelier-ia-manufacturier',
      title: "Workshop IA & PME manufacturières (Session physique)",
      description: "Session collective d'initiation et de prototypage rapide d'intelligence artificielle.",
      type: "atelier",
      startDate: new Date('2026-06-05T09:30:00Z'),
      location: "Maison de la Microélectronique, Charleroi",
      ecosystems: { connect: [{ id: ecoEdih.id }] },
      publicServices: { connect: [{ id: sWorkshopIa.id }] },
      knowledgeAssets: { connect: [{ id: kaIaGuide.id }] }
    }
  });

  await prisma.eventResource.create({
    data: {
      uri: 'https://pit.wallonie.be/id/event/forum-cyber-wallonie',
      title: "Forum Cyber-Résilience Wallonie 2026",
      description: "Grand rassemblement annuel sur la sécurité des PME.",
      type: "conférence",
      startDate: new Date('2026-06-10T09:00:00Z'),
      location: "Namur Expo",
      ecosystems: { connect: [{ id: ecoEdih.id }, { id: ecoDw.id }] },
      publicServices: { connect: [{ id: sCyberCheck.id }] }
    }
  });

  // 24. Datasets
  console.log('📂 Création des Datasets...');
  await prisma.dataset.create({
    data: {
      title: "Répertoire PIT des Profils PME Wallonnes",
      description: "Dataset contenant les variables d'analyse de maturité numérique, IA, cyber, export et S3 des entreprises.",
      themes: ["Numérique", "Économie"],
      keywords: ["PME", "Maturité", "S3"],
      qualityScore: 4.8,
      updateFrequency: "Mensuel",
      ownerOrganizationId: orgAdn.id
    }
  });

  // 25. Réalisations de Service (ServiceDelivery - Individuel)
  console.log('📦 Création des Réalisations de Service...');
  const sdDupont = await prisma.serviceDelivery.create({
    data: {
      beneficiaryId: bDupont.id,
      serviceId: sDiagIa.id,
      journeyId: jIa.id,
      journeyStageId: jsDiagIa.id,
      actionInstanceId: actIaDupont.id,
      initiativeId: initDiagIa.id,
      engagementId: engIaDupont.id,
      status: ServiceDeliveryStatus.COMPLETED,
      date: new Date('2026-06-12T10:00:00Z'),
      operatorId: orgAdn.id,
      outputReal: 'Rapport PDF de diagnostic IA validé (Audit final)',
      outcomeReal: '3 cas d’usage IA identifiés + PoC recommandé en ligne de cuisson',
      impact: 'Maturité IA passée de 1 à 2',
      maturityBefore: { ia: 1 },
      maturityAfter: { ia: 2 },
      maturityDelta: { ia: { before: 1, after: 2 } }
    }
  });

  // 26. Réalisations Collectives (CollectiveDelivery)
  console.log('👥 Création des Réalisations Collectives...');
  const cdWorkshop = await prisma.collectiveDelivery.create({
    data: {
      serviceId: sWorkshopIa.id,
      eventResourceId: evtIaAtelier.id,
      initiativeId: initTrainIa.id,
      title: 'Workshop IA & Optimisation de Production Manufacturière',
      date: new Date('2026-06-05T09:30:00Z'),
      operatorId: orgAdn.id,
      status: CollectiveDeliveryStatus.COMPLETED,
      participantsCount: 18,
      companiesCount: 11,
      satisfactionScore: 4.7,
      leadsCount: 4,
      nextSteps: 'Lancement de Diagnostics IA individuels programmés pour 4 entreprises volontaires.',
      companies: { connect: [{ id: bDupont.id }, { id: bTechConstruct.id }] },
      notes: 'Excellente session avec des retours très positifs des industriels agroalimentaires.'
    }
  });

  // 27. Missions de Deuxième Ligne (SecondLineMission)
  console.log('⚙️ Création des Missions de Deuxième Ligne...');
  const slmCoord = await prisma.secondLineMission.create({
    data: {
      serviceId: sCoordHub.id,
      initiativeId: initDiagIa.id,
      ecosystemId: ecoEdih.id,
      title: 'Animation & Reporting de l’EDIH Wallonia',
      startDate: new Date('2026-01-15T09:00:00Z'),
      status: SecondLineMissionStatus.IN_PROGRESS,
      leadOperatorId: orgAdn.id,
      operatorsMobilized: { connect: [{ id: orgWe.id }, { id: orgSirris.id }, { id: orgUcm.id }] },
      collaborationsCount: 6,
      deliverables: 'Production du référentiel de maturité et cartographie des compétences.',
      territoryCovered: 'Wallonie',
      ecosystems: { connect: [{ id: ecoEdih.id }] },
      valueChains: { connect: [{ id: svcNum.id }, { id: svcIndus.id }] },
      notes: 'Reporting trimestriel à la Commission Européenne en cours de préparation.',
      knowledgeAssets: { connect: [{ id: kaIaGuide.id }] }
    }
  });

  // 28. Preuves (Evidence)
  console.log('📄 Création des Preuves...');
  await prisma.evidence.create({
    data: {
      uri: 'https://pit.wallonie.be/id/evidence/diag-dupont-pdf',
      name: 'Rapport Diagnostic IA Dupont',
      description: 'Preuve de réalisation du diagnostic individuel de maturité IA.',
      type: 'PDF',
      file: 'diagnostic_ia_dupont.pdf',
      url: 'https://storage.vercel.com/pit-wallonie/diagnostic_ia_dupont.pdf',
      serviceDeliveryId: sdDupont.id
    }
  });

  // 29. Impacts Réels Territorialisés (Impact)
  console.log('🌍 Création des Impacts territoriaux et sectoriels...');
  
  // Impact 1: Création d'emplois Biscuiterie Dupont (Namur, Agroalimentaire, DW2025)
  await prisma.impact.create({
    data: {
      beneficiaryId: bDupont.id,
      indicatorId: indJobs.id,
      numericValue: 3.0,
      textValue: "3 ETP créés grâce à l'automatisation et la croissance de productivité",
      territoryId: tNamur.id,
      valueChainId: svcAgri.id,
      evidence: "Rapport de clôture EDIH Q2 2026"
    }
  });

  // Impact 2: Hausse de maturité Biscuiterie Dupont
  await prisma.impact.create({
    data: {
      beneficiaryId: bDupont.id,
      indicatorId: indMaturity.id,
      numericValue: 1.0,
      textValue: "Passage du niveau 1 au niveau 2 de maturité IA sur l'outil de cuisson",
      territoryId: tNamur.id,
      valueChainId: svcAgri.id,
      evidence: "Rapport d'audit post-diagnostic AdN"
    }
  });

  // Impact 3: Décarbonation H2Energy (Hainaut, Hydrogène/Énergie, S3 Wallonie)
  await prisma.impact.create({
    data: {
      beneficiaryId: bH2Energy.id,
      indicatorId: indCo2.id,
      numericValue: 45.5,
      textValue: "45.5 tonnes de CO2 évitées par an via le prototype de pile à hydrogène",
      territoryId: tHainaut.id,
      valueChainId: svcHydro.id,
      evidence: "Rapport d'analyse d'empreinte environnementale Tweed"
    }
  });

  // Impact 4: Chiffre d'affaires additionnel H2Energy
  await prisma.impact.create({
    data: {
      beneficiaryId: bH2Energy.id,
      indicatorId: indRevenue.id,
      numericValue: 150000.0,
      textValue: "150 000 EUR levés via subvention de recherche S3 pour le PoC",
      territoryId: tHainaut.id,
      valueChainId: svcHydro.id,
      evidence: "Attestation de subvention Wallonie Entreprendre"
    }
  });

  // Impact 5: Cybersécurité PharmaPlus (Brabant Wallon, Biotech, DW2025/S3)
  await prisma.impact.create({
    data: {
      beneficiaryId: bPharmaPlus.id,
      indicatorId: indMaturity.id,
      numericValue: 2.0,
      textValue: "Renforcement cyber sur l'infrastructure OT (lignes stérile Wavre) validé",
      territoryId: tBrabant.id,
      valueChainId: svcBiotech.id,
      evidence: "Audit de conformité NIS2 externe"
    }
  });

  // ==========================================
  // NOUVEAUTÉ SPRINT 4.1 : PROGRAMMES, PROJETS, ACTIONS ET ACTIVITÉS RÉELS
  // (EDIH WallonIA, Digital Wallonia, Circular Wallonia, TART IA, Data4Wallonia)
  // ==========================================
  console.log('🏁 Création des Programmes, Projets, Actions et Activités vNext...');

  // Nouvelles Stratégies
  const stPrw = await prisma.strategy.create({
    data: {
      code: 'STRAT-PRW',
      name: 'Plan de Relance de la Wallonie (PRW)',
      description: 'Plan stratégique régional post-crise pour le redéploiement économique.',
      ownerOrganizationId: orgWe.id,
      status: 'ACTIVE'
    }
  });

  const stWds = await prisma.strategy.create({
    data: {
      code: 'STRAT-WDS',
      name: 'Wallonie Data Space',
      description: 'Valorisation des données territoriales et open data publique.',
      ownerOrganizationId: orgAdn.id,
      status: 'ACTIVE'
    }
  });

  const stIaWall = await prisma.strategy.create({
    data: {
      code: 'STRAT-IA-WALLONIE',
      name: 'Stratégie IA Wallonie (DigitalWallonia4.ai)',
      description: 'Accélération de l\'adoption de l\'IA par les entreprises wallonnes.',
      ownerOrganizationId: orgAdn.id,
      status: 'ACTIVE'
    }
  });

  // Nouveaux Programmes
  const prEdihWallonia = await prisma.program.create({
    data: {
      code: 'PROG-EDIH-WALLONIA',
      name: 'EDIH WallonIA',
      description: 'European Digital Innovation Hub wallon co-financé par l\'UE.',
      ownerOrganizationId: orgAdn.id,
      startDate: new Date('2023-01-01'),
      status: ProgramStatus.ACTIVE,
      strategies: { connect: [{ id: stDw.id }, { id: stS3.id }] }
    }
  });

  const prPit138 = await prisma.program.create({
    data: {
      code: 'PROG-PIT-138',
      name: 'PIT (Fiche 138)',
      description: 'Déploiement Plateforme d\'Intelligence Territoriale.',
      ownerOrganizationId: orgWe.id,
      startDate: new Date('2024-01-01'),
      status: ProgramStatus.ACTIVE,
      strategies: { connect: [{ id: stPrw.id }] }
    }
  });

  const prData4Wallonia = await prisma.program.create({
    data: {
      code: 'PROG-DATA4WALLONIA',
      name: 'Data4Wallonia',
      description: 'Programme d\'aide à l\'ouverture des données publiques.',
      ownerOrganizationId: orgAdn.id,
      startDate: new Date('2024-01-01'),
      status: ProgramStatus.ACTIVE,
      strategies: { connect: [{ id: stWds.id }] }
    }
  });

  const prBasCarbone = await prisma.program.create({
    data: {
      code: 'PROG-BAS-CARBONE',
      name: 'Portefeuille d\'aides à la transition bas carbone (Circular Wallonia)',
      description: 'Transition éco-conception et réduction carbone des industriels.',
      ownerOrganizationId: orgWe.id,
      startDate: new Date('2024-01-01'),
      status: ProgramStatus.ACTIVE,
      strategies: { connect: [{ id: stCw.id }] }
    }
  });

  const prTartIa = await prisma.program.create({
    data: {
      code: 'PROG-TART-IA',
      name: 'TART IA',
      description: 'Qualification rapide du ROI de l\'IA pour les PME.',
      ownerOrganizationId: orgAdn.id,
      startDate: new Date('2025-01-01'),
      status: ProgramStatus.ACTIVE,
      strategies: { connect: [{ id: stIaWall.id }] }
    }
  });

  // Nouveaux Bénéficiaires réels
  const bForem = await prisma.beneficiary.create({
    data: {
      name: 'Le Forem',
      bce: '0800.555.666',
      size: 'Grande Entreprise',
      employees: 4000,
      revenue: 0.0,
      location: 'Charleroi',
      province: 'Hainaut',
      demand: 'Ouvrir nos bases de données emploi au grand public.',
      primaryNaceSectorId: nsRecyc.id // code NACE temporaire pour compatibilité
    }
  });

  const bBioPlast = await prisma.beneficiary.create({
    data: {
      name: 'BioPlast SA',
      bce: '0900.777.888',
      size: 'PME',
      employees: 22,
      revenue: 1200000.0,
      location: 'Liège',
      province: 'Liège',
      demand: 'Transition éco-conception pour remplacer le plastique classique.'
    }
  });

  const bLogiTrans = await prisma.beneficiary.create({
    data: {
      name: 'LogiTrans SA',
      bce: '0999.888.777',
      size: 'PME',
      employees: 15,
      revenue: 2100000.0,
      location: 'Namur',
      province: 'Namur',
      demand: 'Évaluer la faisabilité et le ROI de l\'intégration de l\'IA dans notre chaîne logistique.'
    }
  });

  // Nouveaux Projets
  const prjEdih = await prisma.project.create({
    data: {
      code: 'PRJ-CYBER-DUPONT',
      name: 'Diagnostic & POC Cyber - Menuiserie Dupont',
      description: 'Accompagnement de la menuiserie Dupont pour la sécurisation de ses systèmes.',
      uri: 'https://pit.wallonie.be/id/project/cyber-dupont',
      programId: prEdihWallonia.id,
      beneficiaryId: bDupont.id,
      status: 'ACTIVE'
    }
  });

  const prjPit = await prisma.project.create({
    data: {
      code: 'PRJ-PIT-SEMANTIC',
      name: 'Conception et implémentation du Moteur Sémantique et de la BDD',
      description: 'Mise en place de l\'architecture cible PIT et du Knowledge Graph.',
      uri: 'https://pit.wallonie.be/id/project/pit-semantic',
      programId: prPit138.id,
      status: 'ACTIVE'
    }
  });

  const prjData = await prisma.project.create({
    data: {
      code: 'PRJ-DATA4FOREM',
      name: 'Projet d\'audit de qualité open data de l\'opérateur Forem',
      description: 'Accompagnement pour l\'évaluation de la qualité des données ouvertes du Forem.',
      uri: 'https://pit.wallonie.be/id/project/data4forem',
      programId: prData4Wallonia.id,
      beneficiaryId: bForem.id,
      status: 'ACTIVE'
    }
  });

  const prjCirc = await prisma.project.create({
    data: {
      code: 'PRJ-CIRC-BIOPLAST',
      name: 'Transition éco-conception plastique de la PME BioPlast',
      description: 'Accompagnement pour l\'éco-conception de nouveaux moules recyclables.',
      uri: 'https://pit.wallonie.be/id/project/circ-bioplast',
      programId: prBasCarbone.id,
      beneficiaryId: bBioPlast.id,
      status: 'ACTIVE'
    }
  });

  const prjTart = await prisma.project.create({
    data: {
      code: 'PRJ-TART-LOGITRANS',
      name: 'Audit d\'opportunités IA express de la PME LogiTrans',
      description: 'Qualification rapide du ROI de l\'IA pour les flux logistiques.',
      uri: 'https://pit.wallonie.be/id/project/tart-logitrans',
      programId: prTartIa.id,
      beneficiaryId: bLogiTrans.id,
      status: 'ACTIVE'
    }
  });

  // Nouvelles Actions (Jalons)
  const actEdih1 = await prisma.action.create({ data: { title: 'Jalon 1: Cadrage initial', status: 'COMPLETED', projectId: prjEdih.id } });
  const actEdih2 = await prisma.action.create({ data: { title: 'Jalon 2: Passation de questionnaire', status: 'COMPLETED', projectId: prjEdih.id } });
  const actEdih3 = await prisma.action.create({ data: { title: 'Jalon 3: Audit technique', status: 'IN_PROGRESS', projectId: prjEdih.id } });

  const actPit1 = await prisma.action.create({ data: { title: 'Jalon 1: Rédaction de la validation', status: 'COMPLETED', projectId: prjPit.id } });
  const actPit2 = await prisma.action.create({ data: { title: 'Jalon 2: Codage Prisma', status: 'COMPLETED', projectId: prjPit.id } });
  const actPit3 = await prisma.action.create({ data: { title: 'Jalon 3: Seeding', status: 'IN_PROGRESS', projectId: prjPit.id } });

  const actData1 = await prisma.action.create({ data: { title: 'Jalon 1: Identification des silos de données', status: 'COMPLETED', projectId: prjData.id } });
  const actData2 = await prisma.action.create({ data: { title: 'Jalon 2: Évaluation de la conformité DCAT-AP', status: 'PLANNED', projectId: prjData.id } });

  const actCirc1 = await prisma.action.create({ data: { title: 'Jalon 1: Étude de biodégradabilité', status: 'COMPLETED', projectId: prjCirc.id } });
  const actCirc2 = await prisma.action.create({ data: { title: 'Jalon 2: Prototypage de moules recyclables', status: 'IN_PROGRESS', projectId: prjCirc.id } });

  const actTart1 = await prisma.action.create({ data: { title: 'Jalon 1: Session d\'idéation IA', status: 'COMPLETED', projectId: prjTart.id } });
  const actTart2 = await prisma.action.create({ data: { title: 'Jalon 2: Estimation du coût du modèle de langage', status: 'IN_PROGRESS', projectId: prjTart.id } });

  // Nouvelles Activités
  // 1. EDIH WallonIA (individual diagnostic)
  await prisma.activity.create({
    data: {
      activityType: ActivityType.INDIVIDUAL,
      serviceId: sDiagIa.id,
      status: 'COMPLETED',
      operatorId: orgAdn.id,
      notes: 'Passation du DMAT (activité d\'accompagnement de type diagnostic individuel)',
      beneficiaryId: bDupont.id,
      actionId: actEdih2.id,
      outputReal: 'Rapport DMAT complet sur l\'éligibilité IA de la menuiserie.',
      outcomeReal: 'Cas d\'usage IA validé pour le tri.'
    }
  });

  // 2. PIT (collective animation)
  await prisma.activity.create({
    data: {
      activityType: ActivityType.COLLECTIVE,
      serviceId: sWorkshopIa.id,
      status: 'COMPLETED',
      operatorId: orgWe.id,
      notes: 'Workshop technique inter-opérateurs AdN/WE (activité collective d\'animation)',
      actionId: actPit1.id,
      title: 'Atelier sémantique PIT',
      participantsCount: 10,
      companiesCount: 3,
      companies: { connect: [{ id: bDupont.id }] }
    }
  });

  // 3. Data4Wallonia (second line mission)
  await prisma.activity.create({
    data: {
      activityType: ActivityType.SECOND_LINE,
      serviceId: sCoordHub.id,
      status: 'COMPLETED',
      operatorId: orgAdn.id,
      notes: 'Publication du catalogue de métadonnées du Forem (activité de publication sémantique)',
      actionId: actData1.id,
      deliverables: 'Catalogue de métadonnées Forem au format DCAT-AP.',
      collaborationsCount: 2
    }
  });

  // 4. Circular Wallonia (individual diagnostic)
  await prisma.activity.create({
    data: {
      activityType: ActivityType.INDIVIDUAL,
      serviceId: sAccompDigital.id,
      status: 'COMPLETED',
      operatorId: orgWe.id,
      notes: 'Audit de circularité et diagnostic de cycle de vie',
      beneficiaryId: bBioPlast.id,
      actionId: actCirc1.id,
      outputReal: 'Rapport d\'audit de cycle de vie plastique.'
    }
  });

  // 5. TART IA (individual diagnostic)
  await prisma.activity.create({
    data: {
      activityType: ActivityType.INDIVIDUAL,
      serviceId: sDiagIa.id,
      status: 'COMPLETED',
      operatorId: orgAdn.id,
      notes: 'Remise officielle du rapport de diagnostic d\'éligibilité IA',
      beneficiaryId: bLogiTrans.id,
      actionId: actTart1.id,
      outputReal: 'Rapport de ROI IA rapide.'
    }
  });

  

  

  // ==========================================
  // --- NOUVELLES ACTIVITÉS D'ANIMATION (SoE & SoI) ---
  // ==========================================
  
  // 1. Coaching : Diagnostic Export & FDA (AWEX / PharmaPlus)
  await prisma.activity.create({
    data: {
      activityType: ActivityType.INDIVIDUAL,
      serviceId: sExportCoach.id,
      operatorId: orgAwex.id,
      beneficiaryId: bPharmaPlus.id,
      status: "COMPLETED",
      date: new Date("2026-04-10"),
      title: "Coaching individuel : Diagnostic Export & Conformité FDA",
      notes: "[coaching] Séance individuelle d'évaluation des normes FDA américaines pour PharmaPlus.",
      outputReal: "Feuille de route réglementaire export FDA validée.",
      outcomeReal: "Lancement du dossier d'homologation internationale.",
      impact: "Accès facilité aux marchés nord-américains."
    }
  });

  // 2. Coaching : Cadrage Stratégique IA & Algorithmes de Tri (AdN / Dupont)
  await prisma.activity.create({
    data: {
      activityType: ActivityType.INDIVIDUAL,
      serviceId: sDiagIa.id,
      operatorId: orgAdn.id,
      beneficiaryId: bDupont.id,
      status: "COMPLETED",
      date: new Date("2026-05-12"),
      title: "Coaching individuel : Cadrage Stratégique IA & Algorithmes de Tri",
      notes: "[coaching] Coaching technique individuel pour le déploiement du tri automatisé par vision computer.",
      outputReal: "Spécifications techniques de l'algorithme de computer vision rédigées.",
      outcomeReal: "Validation de la faisabilité sur les lignes de production.",
      impact: "Augmentation de 15% du taux de tri automatique."
    }
  });

  // 3. Atelier : Cybersécurité & Directive NIS2 (MecaTech / LogiTrans + TechConstruct)
  await prisma.activity.create({
    data: {
      activityType: ActivityType.COLLECTIVE,
      serviceId: sCyberCheck.id,
      operatorId: orgMecaTech.id,
      status: "COMPLETED",
      date: new Date("2026-05-20"),
      title: "Atelier : Cybersécurité, NIS2 & Gestion des Risques Industriels",
      notes: "[atelier] Workshop inter-PME sur la conformité NIS2 dans la chaîne de valeur logistique et manufacturière.",
      participantsCount: 18,
      companiesCount: 6,
      satisfactionScore: 4.8,
      leadsCount: 4,
      nextSteps: "Planifier des audits individuels Cyber-Check pour les participants intéressés.",
      companies: { connect: [{ id: bLogiTrans.id }, { id: bTechConstruct.id }] }
    }
  });

  // 4. Webinaire : Opportunités de financement Horizon Europe (BioWin / PharmaPlus)
  await prisma.activity.create({
    data: {
      activityType: ActivityType.COLLECTIVE,
      serviceId: sWorkshopIa.id,
      operatorId: orgBioWin.id,
      status: "COMPLETED",
      date: new Date("2026-06-02"),
      title: "Webinaire : Opportunités de financement Horizon Europe pour les BioTechs",
      notes: "[webinaire] Session d'information sur les appels à projets européens Horizon Europe Cluster 1 (Santé) pour PME.",
      participantsCount: 45,
      companiesCount: 22,
      satisfactionScore: 4.5,
      leadsCount: 8,
      nextSteps: "Envoi des présentations et mise en relation avec le Point de Contact National (PCN).",
      companies: { connect: [{ id: bPharmaPlus.id }] }
    }
  });

  // 5. Groupe de Travail : Interopérabilité des données de santé (AdN / PharmaPlus + Forem)
  await prisma.activity.create({
    data: {
      activityType: ActivityType.COLLECTIVE,
      serviceId: sCoordHub.id,
      operatorId: orgAdn.id,
      status: "IN_PROGRESS",
      date: new Date("2026-06-10"),
      title: "Groupe de travail : Interopérabilité des données de santé",
      notes: "[groupe_de_travail] Premier atelier technique pour définir le standard d'échange de données de santé (HL7/FHIR) en Wallonie.",
      participantsCount: 12,
      companiesCount: 5,
      companies: { connect: [{ id: bPharmaPlus.id }, { id: bForem.id }] }
    }
  });

  // 6. Mission économique : Pavillon Wallon à Hannover Messe (AWEX / H2Energy + TechConstruct)
  await prisma.activity.create({
    data: {
      activityType: ActivityType.COLLECTIVE,
      serviceId: sExportCoach.id,
      operatorId: orgAwex.id,
      status: "PLANNED",
      date: new Date("2026-09-15"),
      title: "Mission économique : Pavillon Wallon à Hannover Messe",
      notes: "[mission_economique] Organisation du pavillon de l'AWEX et de la délégation d'entreprises wallonnes à la foire industrielle de Hanovre.",
      participantsCount: 25,
      companiesCount: 15,
      companies: { connect: [{ id: bH2Energy.id }, { id: bTechConstruct.id }] }
    }
  });

console.log('✅ Base de données initialisée avec succès avec la gouvernance stratégique territoriale et les enums conformes !');
}

main()
  .catch((e) => {
    console.error('❌ Erreur détectée lors de l\'exécution du seed :');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

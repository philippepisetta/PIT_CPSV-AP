import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du peuplement de la base de données (seeding)...');

  // Nettoyage de la base de données pour assurer la répétabilité du seed
  console.log('🧹 Nettoyage des anciennes données...');
  await prisma.serviceDelivery.deleteMany({});
  await prisma.collectiveDelivery.deleteMany({});
  await prisma.secondLineMission.deleteMany({});
  await prisma.journeyStage.deleteMany({});
  await prisma.journey.deleteMany({});
  await prisma.beneficiary.deleteMany({});
  await prisma.businessNeed.deleteMany({});
  await prisma.ecosystemRole.deleteMany({});
  await prisma.valueChainStage.deleteMany({});
  await prisma.strategicValueChain.deleteMany({});
  await prisma.businessChallenge.deleteMany({});
  await prisma.enterpriseFunction.deleteMany({});
  await prisma.naceSector.deleteMany({});
  await prisma.interventionLevel.deleteMany({});
  await prisma.ecosystem.deleteMany({});
  await prisma.catalogue.deleteMany({});
  await prisma.rule.deleteMany({});
  await prisma.criterion.deleteMany({});
  await prisma.contactPoint.deleteMany({});
  await prisma.cost.deleteMany({});
  await prisma.evidence.deleteMany({});
  await prisma.requirement.deleteMany({});
  await prisma.output.deleteMany({});
  await prisma.outcome.deleteMany({});
  await prisma.channel.deleteMany({});
  await prisma.targetAudience.deleteMany({});
  await prisma.businessEvent.deleteMany({});
  await prisma.lifeEvent.deleteMany({});
  await prisma.publicService.deleteMany({});
  await prisma.organization.deleteMany({});

  // 1. Création des Canaux (Channels)
  console.log('📥 Création des Canaux (Channels)...');
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

  // 2. Création des Publics Cibles (TargetAudiences)
  console.log('👥 Création des Publics Cibles (Target Audiences)...');
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

  // 3. Création des Événements Professionnels (BusinessEvents)
  console.log('💼 Création des Événements Professionnels (Business Events)...');
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

  // 4. Création des Événements de Vie (LifeEvents)
  console.log('🧬 Création des Événements de Vie (Life Events)...');
  const leTransmission = await prisma.lifeEvent.create({
    data: {
      uri: 'https://pit.wallonie.be/id/life-event/reprise-entreprise',
      name: "Reprise / Transmission d'entreprise",
      description: "Cession d'une entreprise existante ou rachat d'une activité par un repreneur.",
      code: 'LE-TRANSFER',
    },
  });

  // 5. Création du Catalogue (Dataset)
  console.log('📚 Création du Catalogue / Dataset de référence...');
  const cataloguePIT = await prisma.catalogue.create({
    data: {
      uri: 'https://pit.wallonie.be/id/catalogue/pit-services',
      name: 'Catalogue des Services Territoriaux de la PIT',
      description: 'Référentiel des aides, diagnostics et accompagnements pour les entreprises wallonnes.',
      code: 'CAT-PIT',
    },
  });

  // 5b. Création des Niveaux d'Intervention (InterventionLevel)
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

  // 6. Création des Organisations / Acteurs de l'écosystème typés
  console.log('🏢 Création des Organisations typées...');
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

  // 7. Création des Référentiels Relationnels Métier
  console.log('🧠 Création des Référentiels Relationnels (Challenges, ValueChains, Functions, Secteurs)...');
  
  // A. Défis d'affaires (BusinessChallenges)
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

  // B. Filières Stratégiques (StrategicValueChains)
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

  // C. Fonctions d'entreprise (EnterpriseFunctions)
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

  // D. Secteurs NACE (NaceSectors)
  const nsMetal = await prisma.naceSector.create({ data: { code: '24.10', name: 'Fabrication métallique', description: 'Sidérurgie et fabrication de métaux de base.' } });
  const nsAgro = await prisma.naceSector.create({ data: { code: '10.89', name: 'Agroalimentaire', description: 'Fabrication d’autres produits alimentaires divers.' } });
  const nsConst = await prisma.naceSector.create({ data: { code: '41.20', name: 'Construction', description: 'Construction de bâtiments résidentiels et non résidentiels.' } });

  // E. Maillons Transverses (ValueChainStages)
  console.log('⚙️ Création des Maillons Transverses...');
  // Innovation
  const stRechF = await prisma.valueChainStage.create({ data: { name: 'Recherche fondamentale', category: 'Innovation', uri: 'https://pit.wallonie.be/id/stage/recherche-fondamentale' } });
  const stRechA = await prisma.valueChainStage.create({ data: { name: 'Recherche appliquée', category: 'Innovation', uri: 'https://pit.wallonie.be/id/stage/recherche-appliquee' } });
  const stDevEx = await prisma.valueChainStage.create({ data: { name: 'Développement expérimental', category: 'Innovation', uri: 'https://pit.wallonie.be/id/stage/developpement-experimental' } });
  // Industrialisation
  const stConcep = await prisma.valueChainStage.create({ data: { name: 'Conception', category: 'Industrialisation', uri: 'https://pit.wallonie.be/id/stage/conception' } });
  const stProto = await prisma.valueChainStage.create({ data: { name: 'Prototypage', category: 'Industrialisation', uri: 'https://pit.wallonie.be/id/stage/prototypage' } });
  const stValid = await prisma.valueChainStage.create({ data: { name: 'Validation', category: 'Industrialisation', uri: 'https://pit.wallonie.be/id/stage/validation' } });
  const stCert = await prisma.valueChainStage.create({ data: { name: 'Certification', category: 'Industrialisation', uri: 'https://pit.wallonie.be/id/stage/certification' } });
  // Production
  const stProd = await prisma.valueChainStage.create({ data: { name: 'Production', category: 'Production', uri: 'https://pit.wallonie.be/id/stage/production' } });
  const stAssem = await prisma.valueChainStage.create({ data: { name: 'Assemblage', category: 'Production', uri: 'https://pit.wallonie.be/id/stage/assemblage' } });
  const stInteg = await prisma.valueChainStage.create({ data: { name: 'Intégration', category: 'Production', uri: 'https://pit.wallonie.be/id/stage/integration' } });
  // Go-To-Market
  const stDist = await prisma.valueChainStage.create({ data: { name: 'Distribution', category: 'Go-To-Market', uri: 'https://pit.wallonie.be/id/stage/distribution' } });
  const stComm = await prisma.valueChainStage.create({ data: { name: 'Commercialisation', category: 'Go-To-Market', uri: 'https://pit.wallonie.be/id/stage/commercialisation' } });
  const stExport = await prisma.valueChainStage.create({ data: { name: 'Exportation', category: 'Go-To-Market', uri: 'https://pit.wallonie.be/id/stage/exportation' } });
  // Exploitation
  const stSupp = await prisma.valueChainStage.create({ data: { name: 'Support', category: 'Exploitation', uri: 'https://pit.wallonie.be/id/stage/support' } });
  const stMaint = await prisma.valueChainStage.create({ data: { name: 'Maintenance', category: 'Exploitation', uri: 'https://pit.wallonie.be/id/stage/maintenance' } });
  const stServ = await prisma.valueChainStage.create({ data: { name: 'Services', category: 'Exploitation', uri: 'https://pit.wallonie.be/id/stage/services' } });
  // Circularité
  const stReemp = await prisma.valueChainStage.create({ data: { name: 'Réemploi', category: 'Circularité', uri: 'https://pit.wallonie.be/id/stage/reemploi' } });
  const stRep = await prisma.valueChainStage.create({ data: { name: 'Réparation', category: 'Circularité', uri: 'https://pit.wallonie.be/id/stage/reparation' } });
  const stRecyc = await prisma.valueChainStage.create({ data: { name: 'Recyclage', category: 'Circularité', uri: 'https://pit.wallonie.be/id/stage/recyclage' } });


  // 8. Écosystèmes Régionaux (Ecosystems)
  console.log('🌐 Création des Écosystèmes...');
  const ecoEdih = await prisma.ecosystem.create({
    data: {
      name: 'EDIH Wallonia',
      description: 'European Digital Innovation Hub pour le déploiement de l’IA et des technologies de pointe.',
      mission: 'Accompagner la numérisation et l’adoption de l’IA par les entreprises wallonnes.',
      territory: 'Wallonie',
      actors: { connect: [{ id: orgAdn.id }, { id: orgWe.id }, { id: orgUcm.id }, { id: orgSirris.id }] },
      filieresS3: { connect: [{ id: svcNum.id }, { id: svcIndus.id }] },
      challenges: { connect: [{ id: bcIa.id }, { id: bcDigital.id }] }
    }
  });

  const ecoDw = await prisma.ecosystem.create({
    data: {
      name: 'Digital Wallonia',
      description: 'La stratégie numérique de la Wallonie et son écosystème d’acteurs technologiques.',
      mission: 'Faire du numérique un moteur de croissance économique régionale.',
      territory: 'Wallonie',
      actors: { connect: [{ id: orgAdn.id }] },
      filieresS3: { connect: [{ id: svcNum.id }] },
      challenges: { connect: [{ id: bcDigital.id }] }
    }
  });


  // 9. Création des Services Publics & des relations associées
  console.log('🛠️ Création des Services Publics & relations...');

  // --- SERVICE 1: Diagnostic IA (AdN) ---
  const sDiagIa = await prisma.publicService.create({
    data: {
      uri: 'https://pit.wallonie.be/id/public-service/diagnostic-ia',
      name: 'Diagnostic IA',
      description: 'Audit et identification des cas d’usages concrets de l’intelligence artificielle dans votre processus de production.',
      code: 'S-IA-DIAG',
      organizationId: orgAdn.id,
      interventionLevelId: ilIndiv.id,
      channels: { connect: [{ id: chRdv.id }] },
      targetAudiences: { connect: [{ id: taPme.id }, { id: taStartup.id }] },
      businessEvents: { connect: [{ id: beDigitalTrans.id }] },
      catalogues: { connect: [{ id: cataloguePIT.id }] },
      challenges: { connect: [{ id: bcIa.id }, { id: bcDigital.id }] },
      filieresS3: { connect: [{ id: svcIndus.id }, { id: svcSante.id }] },
      impactedFunctions: { connect: [{ id: efProd.id }, { id: efIt.id }] },
      stages: { connect: [{ id: stConcep.id }, { id: stProd.id }] },
      ecosystems: { connect: [{ id: ecoEdih.id }] },
      impacts: { carbon: 30, jobs: 40, sovereignty: 50, resilience: 60, competitiveness: 80, digiscoreBoost: 15 },
    },
  });

  // Outputs et Outcomes attendus pour Service 1
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


  // --- SERVICE 2: Chèque Cybersécurité (AdN) ---
  const sCyberCheck = await prisma.publicService.create({
    data: {
      uri: 'https://pit.wallonie.be/id/public-service/cheque-cybersecurite',
      name: 'Chèque Cybersécurité',
      description: 'Subvention pour réaliser un audit de sécurité de vos infrastructures IT et former vos équipes.',
      code: 'S-CYBER-CHECK',
      organizationId: orgAdn.id,
      interventionLevelId: ilIndiv.id,
      channels: { connect: [{ id: chWeb.id }] },
      targetAudiences: { connect: [{ id: taPme.id }, { id: taStartup.id }, { id: taIndependant.id }] },
      businessEvents: { connect: [{ id: beDigitalTrans.id }] },
      catalogues: { connect: [{ id: cataloguePIT.id }] },
      challenges: { connect: [{ id: bcCyber.id }] },
      filieresS3: { connect: [{ id: svcNum.id }] },
      impactedFunctions: { connect: [{ id: efIt.id }] },
      ecosystems: { connect: [{ id: ecoEdih.id }] },
      impacts: { carbon: 10, jobs: 20, sovereignty: 70, resilience: 80, competitiveness: 60, digiscoreBoost: 10 },
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


  // --- SERVICE 3: Coaching Export (AWEX) ---
  const sExportCoach = await prisma.publicService.create({
    data: {
      uri: 'https://pit.wallonie.be/id/public-service/coaching-export',
      name: 'Coaching Export',
      description: 'Accompagnement individuel par un conseiller AWEX pour définir sa stratégie de développement international.',
      code: 'S-EXPORT-COACH',
      organizationId: orgAwex.id,
      interventionLevelId: ilIndiv.id,
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


  // --- SERVICE 4: Diagnostic de maturité numérique (AdN) ---
  const sDiagNum = await prisma.publicService.create({
    data: {
      uri: 'https://pit.wallonie.be/id/public-service/diagnostic-maturite-numerique',
      name: 'Diagnostic de maturité numérique',
      description: 'Évaluation globale du niveau de maturité digitale (outils, infrastructures, compétences) de l’entreprise.',
      code: 'S-DIGITAL-DIAG',
      organizationId: orgAdn.id,
      interventionLevelId: ilIndiv.id,
      channels: { connect: [{ id: chWeb.id }, { id: chRdv.id }] },
      targetAudiences: { connect: [{ id: taPme.id }, { id: taStartup.id }, { id: taIndependant.id }] },
      businessEvents: { connect: [{ id: beDigitalTrans.id }] },
      catalogues: { connect: [{ id: cataloguePIT.id }] },
      challenges: { connect: [{ id: bcDigital.id }] },
      filieresS3: { connect: [{ id: svcIndus.id }] },
      impactedFunctions: { connect: [{ id: efIt.id }, { id: efProd.id }] },
      ecosystems: { connect: [{ id: ecoDw.id }] },
      impacts: { carbon: 15, jobs: 30, sovereignty: 50, resilience: 50, competitiveness: 60, digiscoreBoost: 15 },
    },
  });


  // --- SERVICE 5: Accompagnement à la transformation digitale (WE) ---
  const sAccompDigital = await prisma.publicService.create({
    data: {
      uri: 'https://pit.wallonie.be/id/public-service/accompagnement-transformation-digitale',
      name: 'Accompagnement à la transformation digitale',
      description: 'Soutien par un coach WE agréé pour la réalisation et le suivi de projets de digitalisation complexes.',
      code: 'S-DIGITAL-COACH',
      organizationId: orgWe.id,
      interventionLevelId: ilIndiv.id,
      channels: { connect: [{ id: chRdv.id }, { id: chGuichet.id }] },
      targetAudiences: { connect: [{ id: taPme.id }, { id: taStartup.id }] },
      businessEvents: { connect: [{ id: beDigitalTrans.id }] },
      catalogues: { connect: [{ id: cataloguePIT.id }] },
      challenges: { connect: [{ id: bcDigital.id }] },
      impactedFunctions: { connect: [{ id: efIt.id }, { id: efRh.id }, { id: efVente.id }] },
      impacts: { carbon: 40, jobs: 50, sovereignty: 60, resilience: 70, competitiveness: 80, digiscoreBoost: 20 },
    },
  });

  // --- SERVICE 6: Workshop IA & PME (AdN) - COLLECTIVE ---
  const sWorkshopIa = await prisma.publicService.create({
    data: {
      uri: 'https://pit.wallonie.be/id/public-service/workshop-ia',
      name: 'Workshop IA & PME manufacturières',
      description: 'Session collective de sensibilisation et de co-conception de cas d’usage IA.',
      code: 'S-IA-WORKSHOP',
      organizationId: orgAdn.id,
      interventionLevelId: ilColl.id,
      channels: { connect: [{ id: chGuichet.id }] },
      targetAudiences: { connect: [{ id: taPme.id }] },
      businessEvents: { connect: [{ id: beDigitalTrans.id }] },
      catalogues: { connect: [{ id: cataloguePIT.id }] },
      challenges: { connect: [{ id: bcIa.id }] },
      filieresS3: { connect: [{ id: svcIndus.id }] },
      impactedFunctions: { connect: [{ id: efProd.id }] },
      stages: { connect: [{ id: stProto.id }] },
      ecosystems: { connect: [{ id: ecoEdih.id }] }
    }
  });

  // --- SERVICE 7: Coordination EDIH Wallonia (AdN) - SECOND_LINE ---
  const sCoordHub = await prisma.publicService.create({
    data: {
      uri: 'https://pit.wallonie.be/id/public-service/coordination-edih',
      name: 'Coordination EDIH Wallonia',
      description: 'Mission de coordination et d’animation de l’écosystème d’opérateurs et d’acteurs de la transition numérique.',
      code: 'S-EDIH-COORD',
      organizationId: orgAdn.id,
      interventionLevelId: ilSecLine.id,
      channels: { connect: [{ id: chRdv.id }] },
      targetAudiences: { connect: [{ id: taResearcher.id }] },
      catalogues: { connect: [{ id: cataloguePIT.id }] },
      challenges: { connect: [{ id: bcDigital.id }] },
      filieresS3: { connect: [{ id: svcNum.id }] },
      ecosystems: { connect: [{ id: ecoEdih.id }] }
    }
  });

  // 10. Rôles Écosystémiques (EcosystemRoles)
  console.log('🎭 Création des Rôles écosystémiques...');
  const roleTrans = await prisma.ecosystemRole.create({ data: { name: 'Transformateur', uri: 'https://pit.wallonie.be/id/role/transformateur' } });
  const roleInteg = await prisma.ecosystemRole.create({ data: { name: 'Intégrateur', uri: 'https://pit.wallonie.be/id/role/integrateur' } });


  // 11. Création des Besoins Métier (BusinessNeeds) et liens
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


  // 12. Création des Parcours Types (Journeys) et Étapes (JourneyStages)
  console.log('🗺️ Création des Parcours Types et Étapes...');
  const jIa = await prisma.journey.create({
    data: {
      name: 'Parcours IA',
      provider: 'EDIH Wallonia',
      uri: 'https://pit.wallonie.be/id/journey/parcours-ia',
      objective: 'Adopter l’IA au sein des PME manufacturières régionales.',
      description: 'De la sensibilisation au déploiement opérationnel d’outils d’IA.',
      targetAudience: ['PME', 'Startup'],
      filieresS3: { connect: [{ id: svcIndus.id }, { id: svcNum.id }] },
      challenges: { connect: [{ id: bcIa.id }] }
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

  await prisma.journeyStage.create({
    data: {
      name: 'Audit',
      position: 1,
      journeyId: jCyber.id,
      services: { connect: [{ id: sCyberCheck.id }] }
    }
  });

  await prisma.journeyStage.create({
    data: {
      name: 'Mise en conformité',
      position: 2,
      journeyId: jCyber.id,
      services: { connect: [{ id: sAccompDigital.id }] }
    }
  });


  // 13. Création des Bénéficiaires (Beneficiaries)
  console.log('🏢 Création des Bénéficiaires...');
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
        { id: "log-1", operator: "AdN", action: "Création du profil", timestamp: "2026-06-08T09:00:00Z", detail: "Profil initial de l'entreprise créé." },
        { id: "log-2", operator: "AdN", action: "Définition des défis", timestamp: "2026-06-08T09:15:00Z", detail: "Défis IA et Digitalisation associés." }
      ]
    }
  });

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
        { id: "log-1", operator: "WE", action: "Création du profil", timestamp: "2026-06-08T09:30:00Z", detail: "Profil initial de l'entreprise créé." }
      ]
    }
  });


  // 14. Création des Réalisations de Service (ServiceDelivery)
  console.log('📦 Création d’une Réalisation de Service (ServiceDelivery)...');
  await prisma.serviceDelivery.create({
    data: {
      beneficiaryId: bDupont.id,
      serviceId: sDiagIa.id,
      journeyId: jIa.id,
      journeyStageId: jsDiagIa.id,
      status: 'COMPLETED',
      date: new Date('2026-06-12T10:00:00Z'),
      operatorId: orgAdn.id,
      outputReal: 'Rapport PDF de diagnostic IA validé (Audit final)',
      outcomeReal: '3 cas d’usage IA identifiés + PoC recommandé en ligne de cuisson',
      impact: 'Maturité IA passée de 1 à 2',
      maturityBefore: { ia: 1 },
      maturityAfter: { ia: 2 },
      maturityDelta: { ia: { before: 1, after: 2 } },
      evidenceFiles: [
        { name: "diagnostic_ia_dupont.pdf", size: "2.4MB" }
      ]
    }
  });

  // 15. Création des Réalisations Collectives (CollectiveDelivery)
  console.log('👥 Création d’une Réalisation Collective (CollectiveDelivery)...');
  await prisma.collectiveDelivery.create({
    data: {
      serviceId: sWorkshopIa.id,
      title: 'Workshop IA & Optimisation de Production Manufacturière',
      date: new Date('2026-06-05T09:30:00Z'),
      operatorId: orgAdn.id,
      status: 'COMPLETED',
      participantsCount: 18,
      companiesCount: 11,
      satisfactionScore: 4.7, // Échelle 0 à 5
      leadsCount: 4,
      nextSteps: 'Lancement de Diagnostics IA individuels programmés pour 4 entreprises volontaires.',
      companies: { connect: [{ id: bDupont.id }, { id: bTechConstruct.id }] },
      notes: 'Excellente session avec des retours très positifs des industriels agroalimentaires.'
    }
  });

  // 16. Création des Missions de Deuxième Ligne (SecondLineMission)
  console.log('⚙️ Création d’une Mission de Deuxième Ligne (SecondLineMission)...');
  await prisma.secondLineMission.create({
    data: {
      serviceId: sCoordHub.id,
      title: 'Animation & Reporting de l’EDIH Wallonia',
      startDate: new Date('2026-01-15T09:00:00Z'),
      status: 'IN_PROGRESS',
      leadOperatorId: orgAdn.id,
      operatorsMobilized: { connect: [{ id: orgWe.id }, { id: orgSirris.id }, { id: orgUcm.id }] },
      collaborationsCount: 6,
      deliverables: 'Production du référentiel territorial de maturité et cartographie des compétences sémantiques.',
      territoryCovered: 'Wallonie',
      ecosystems: { connect: [{ id: ecoEdih.id }] },
      valueChains: { connect: [{ id: svcNum.id }, { id: svcIndus.id }] },
      notes: 'Reporting trimestriel à la Commission Européenne en cours de préparation.'
    }
  });

  console.log('✅ Base de données initialisée avec succès avec le nouveau modèle conceptuel !');
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

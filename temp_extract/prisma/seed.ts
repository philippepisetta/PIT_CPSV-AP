import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du peuplement de la base de données (seeding)...');

  // Nettoyage de la base de données pour assurer la répétabilité du seed
  console.log('🧹 Nettoyage des anciennes données...');
  await prisma.catalogue.deleteMany({});
  await prisma.rule.deleteMany({});
  await prisma.criterion.deleteMany({});
  await prisma.contactPoint.deleteMany({});
  await prisma.cost.deleteMany({});
  await prisma.evidence.deleteMany({});
  await prisma.requirement.deleteMany({});
  await prisma.output.deleteMany({});
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
      description: 'Ligne directe d\'assistance pour les entrepreneurs.',
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
      description: 'Processus de numérisation des processus, des outils et de la culture d\'entreprise.',
      code: 'BE-DIGITAL',
    },
  });

  const beFunding = await prisma.businessEvent.create({
    data: {
      uri: 'https://pit.wallonie.be/id/business-event/recherche-financement',
      name: 'Recherche de financement',
      description: 'Recherche d\'aides publiques, prêts ou levées de fonds pour un projet.',
      code: 'BE-FUNDING',
    },
  });

  const beInternational = await prisma.businessEvent.create({
    data: {
      uri: 'https://pit.wallonie.be/id/business-event/developpement-international',
      name: 'Développement international',
      description: 'Exportation de produits/services ou implantation sur des marchés étrangers.',
      code: 'BE-EXPORT',
    },
  });

  const beCreation = await prisma.businessEvent.create({
    data: {
      uri: 'https://pit.wallonie.be/id/business-event/creation-entreprise',
      name: 'Création d\'entreprise',
      description: 'Lancement d\'une nouvelle activité ou constitution d\'une société.',
      code: 'BE-CREATION',
    },
  });

  // 4. Création des Événements de Vie (LifeEvents)
  console.log('🧬 Création des Événements de Vie (Life Events)...');
  const leTransmission = await prisma.lifeEvent.create({
    data: {
      uri: 'https://pit.wallonie.be/id/life-event/reprise-entreprise',
      name: 'Reprise / Transmission d\'entreprise',
      description: 'Cession d\'une entreprise existante ou rachat d\'une activité par un repreneur.',
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

  // 6. Création des Organisations / Agents
  console.log('🏢 Création des Organisations (Agents)...');
  const orgAdn = await prisma.organization.create({
    data: {
      uri: 'https://pit.wallonie.be/id/organization/adn',
      name: 'Agence du Numérique',
      description: 'L\'Agence du Numérique (AdN) est l\'organisme public wallon chargé de définir, mettre en oeuvre et piloter la stratégie numérique de la Wallonie (Digital Wallonia).',
      code: 'ORG-ADN',
    },
  });

  const orgWe = await prisma.organization.create({
    data: {
      uri: 'https://pit.wallonie.be/id/organization/we',
      name: 'Wallonie Entreprendre',
      description: 'Wallonie Entreprendre (WE) est l\'outil financier et d\'accompagnement économique au service des entreprises wallonnes (création, croissance, transition).',
      code: 'ORG-WE',
    },
  });

  const orgAwex = await prisma.organization.create({
    data: {
      uri: 'https://pit.wallonie.be/id/organization/awex',
      name: 'AWEX',
      description: 'L\'Agence Wallonne à l\'Exportation et aux Investissements Étrangers (AWEX) soutient le développement international des entreprises wallonnes.',
      code: 'ORG-AWEX',
    },
  });

  const orgUcm = await prisma.organization.create({
    data: {
      uri: 'https://pit.wallonie.be/id/organization/ucm',
      name: 'UCM',
      description: 'L\'Union des Classes Moyennes (UCM) est le principal mouvement patronal francophone de représentation et d\'accompagnement des indépendants et PME.',
      code: 'ORG-UCM',
    },
  });

  // 7. Création des Services Publics & des relations associées
  console.log('🛠️ Création des Services Publics & relations...');

  // --- SERVICE 1: Diagnostic de maturité numérique (AdN) ---
  const sDiagNum = await prisma.publicService.create({
    data: {
      uri: 'https://pit.wallonie.be/id/public-service/diagnostic-maturite-numerique',
      name: 'Diagnostic de maturité numérique',
      description: 'Évaluation complète du niveau de digitalisation de votre entreprise (outils, compétences, infrastructures) avec recommandations d\'un expert agréé.',
      code: 'S-DIGITAL-DIAG',
      organizationId: orgAdn.id,
      channels: {
        connect: [{ id: chWeb.id }, { id: chRdv.id }],
      },
      targetAudiences: {
        connect: [{ id: taPme.id }, { id: taStartup.id }, { id: taIndependant.id }],
      },
      businessEvents: {
        connect: [{ id: beDigitalTrans.id }],
      },
      catalogues: {
        connect: [{ id: cataloguePIT.id }],
      },
    },
  });

  // Exigences & Preuves pour Service 1
  const reqSiegeDiag = await prisma.requirement.create({
    data: {
      uri: 'https://pit.wallonie.be/id/requirement/siege-wallonie-diag',
      name: 'Établissement en Wallonie',
      description: 'L\'entreprise doit posséder un siège d\'activité ou d\'exploitation principal situé sur le territoire de la Wallonie.',
      code: 'REQ-SIEGE-WAL',
      publicServiceId: sDiagNum.id,
    },
  });

  await prisma.evidence.create({
    data: {
      uri: 'https://pit.wallonie.be/id/evidence/extrait-bce-diag',
      name: 'Extrait BCE (Banque Carrefour des Entreprises)',
      description: 'Copie officielle de l\'enregistrement BCE datant de moins de 3 mois prouvant l\'adresse en Wallonie.',
      code: 'EVI-BCE',
      requirementId: reqSiegeDiag.id,
    },
  });

  // Livrables (Outputs) pour Service 1
  await prisma.output.create({
    data: {
      uri: 'https://pit.wallonie.be/id/output/rapport-maturite',
      name: 'Rapport de diagnostic de maturité numérique',
      description: 'Rapport complet détaillant le score de maturité, l\'analyse sectorielle et les axes de progrès préconisés.',
      code: 'OUT-DIAG-REPORT',
      publicServiceId: sDiagNum.id,
    },
  });

  await prisma.output.create({
    data: {
      uri: 'https://pit.wallonie.be/id/output/plan-action-digital',
      name: 'Plan d’action de transformation numérique',
      description: 'Feuille de route stratégique avec des actions prioritaires à mettre en place.',
      code: 'OUT-ACTION-PLAN',
      publicServiceId: sDiagNum.id,
    },
  });

  // Coûts pour Service 1
  await prisma.cost.create({
    data: {
      uri: 'https://pit.wallonie.be/id/cost/gratuit-diag',
      name: 'Prise en charge 100% (Subvention publique)',
      value: 0.0,
      currency: 'EUR',
      description: 'Le diagnostic est entièrement financé par la Région wallonne dans le cadre du programme Digital Wallonia.',
      publicServiceId: sDiagNum.id,
    },
  });

  // Points de contact pour Service 1
  await prisma.contactPoint.create({
    data: {
      uri: 'https://pit.wallonie.be/id/contact/adn-digital-wallonia',
      name: 'Équipe Digital Wallonia (Diagnostic)',
      email: 'diagnostics@digitalwallonia.be',
      telephone: '+32 81 77 80 80',
      description: 'Secrétariat général d\'attribution des audits numériques de l\'AdN.',
      publicServiceId: sDiagNum.id,
    },
  });

  // Critères & Règles pour Service 1
  await prisma.criterion.create({
    data: {
      uri: 'https://pit.wallonie.be/id/criterion/effectif-diag',
      name: 'Moins de 250 ETP',
      description: 'Réservé exclusivement aux micro, petites ou moyennes entreprises (PME).',
      code: 'CRT-ETP-LIMIT',
      publicServiceId: sDiagNum.id,
    },
  });

  await prisma.rule.create({
    data: {
      uri: 'https://pit.wallonie.be/id/rule/de-minimis-diag',
      name: 'Règlement de minimis s\'appliquant aux aides d\'État',
      description: 'Le montant total des aides octroyées à une même entreprise ne doit pas dépasser 300.000 € sur 3 ans.',
      code: 'RUL-DE-MINIMIS',
      publicServiceId: sDiagNum.id,
    },
  });


  // --- SERVICE 2: Accompagnement à la transformation digitale (WE) ---
  const sAccompDigital = await prisma.publicService.create({
    data: {
      uri: 'https://pit.wallonie.be/id/public-service/accompagnement-transformation-digitale',
      name: 'Accompagnement à la transformation digitale',
      description: 'Soutien humain et stratégique personnalisé par un coach WE certifié pour concrétiser vos projets de transition numérique.',
      code: 'S-DIGITAL-COACH',
      organizationId: orgWe.id,
      channels: {
        connect: [{ id: chRdv.id }, { id: chGuichet.id }],
      },
      targetAudiences: {
        connect: [{ id: taPme.id }, { id: taStartup.id }],
      },
      businessEvents: {
        connect: [{ id: beDigitalTrans.id }],
      },
      catalogues: {
        connect: [{ id: cataloguePIT.id }],
      },
    },
  });

  // Exigences pour Service 2
  const reqDiagPrealable = await prisma.requirement.create({
    data: {
      uri: 'https://pit.wallonie.be/id/requirement/diagnostic-prealable',
      name: 'Diagnostic de maturité préalable requis',
      description: 'L\'entreprise doit avoir réalisé un diagnostic numérique approuvé de moins de 12 mois avant de demander un accompagnement.',
      code: 'REQ-DIAG-PREV',
      publicServiceId: sAccompDigital.id,
    },
  });

  await prisma.evidence.create({
    data: {
      uri: 'https://pit.wallonie.be/id/evidence/rapport-diag-valide',
      name: 'Copie du rapport de diagnostic de maturité',
      description: 'Copie PDF du rapport de diagnostic de maturité validé par l\'AdN.',
      code: 'EVI-DIAG-PDF',
      requirementId: reqDiagPrealable.id,
    },
  });

  // Outputs pour Service 2
  await prisma.output.create({
    data: {
      uri: 'https://pit.wallonie.be/id/output/plan-deploiement-valide',
      name: 'Plan de déploiement technologique',
      description: 'Spécifications fonctionnelles, choix des prestataires et calendrier budgétisé de la transformation.',
      code: 'OUT-DEPLOY-PLAN',
      publicServiceId: sAccompDigital.id,
    },
  });

  // Coûts pour Service 2
  await prisma.cost.create({
    data: {
      uri: 'https://pit.wallonie.be/id/cost/tarif-accompagnement',
      name: 'Forfait d\'accompagnement co-financé',
      value: 150.0,
      currency: 'EUR',
      description: 'Forfait unique à charge de l\'entreprise, le solde étant subventionné par Wallonie Entreprendre.',
      publicServiceId: sAccompDigital.id,
    },
  });


  // --- SERVICE 3: Recherche de financement innovation (WE) ---
  const sFinanceInno = await prisma.publicService.create({
    data: {
      uri: 'https://pit.wallonie.be/id/public-service/recherche-financement-innovation',
      name: 'Recherche de financement innovation',
      description: 'Accompagnement à l\'analyse financière et structuration de dossiers de levées de fonds publics (prêts, subsides R&D, capital-risque) pour des projets d\'innovation technologique.',
      code: 'S-FINANCE-INNO',
      organizationId: orgWe.id,
      channels: {
        connect: [{ id: chRdv.id }, { id: chPhone.id }],
      },
      targetAudiences: {
        connect: [{ id: taStartup.id }, { id: taResearcher.id }],
      },
      businessEvents: {
        connect: [{ id: beFunding.id }],
      },
      catalogues: {
        connect: [{ id: cataloguePIT.id }],
      },
    },
  });

  // Outputs pour Service 3
  await prisma.output.create({
    data: {
      uri: 'https://pit.wallonie.be/id/output/orientation-financement',
      name: 'Orientation vers un financement & Dossier de financement',
      description: 'Rapport complet cartographiant les sources de financements optimaux et dossier structuré prêt pour le comité de crédit.',
      code: 'OUT-FUNDING-DOSSIER',
      publicServiceId: sFinanceInno.id,
    },
  });


  // --- SERVICE 4: Support à l’internationalisation digitale (AWEX) ---
  const sExportDigital = await prisma.publicService.create({
    data: {
      uri: 'https://pit.wallonie.be/id/public-service/support-internationalisation-digitale',
      name: 'Support à l’internationalisation digitale',
      description: 'Aide financière et technique pour adapter vos outils digitaux (e-commerce multilingue, SEO international, marketing digital ciblé) aux marchés étrangers.',
      code: 'S-EXPORT-DIGITAL',
      organizationId: orgAwex.id,
      channels: {
        connect: [{ id: chWeb.id }, { id: chRdv.id }],
      },
      targetAudiences: {
        connect: [{ id: taPme.id }, { id: taStartup.id }],
      },
      businessEvents: {
        connect: [{ id: beInternational.id }],
      },
      catalogues: {
        connect: [{ id: cataloguePIT.id }],
      },
    },
  });

  // Exigences pour Service 4
  const reqCodeNaceExport = await prisma.requirement.create({
    data: {
      uri: 'https://pit.wallonie.be/id/requirement/nace-export',
      name: 'Activité éligible à l\'export',
      description: 'L\'entreprise doit posséder un code NACE BEL éligible (secteur marchand productif de biens ou services).',
      code: 'REQ-NACE-EXPORT',
      publicServiceId: sExportDigital.id,
    },
  });

  await prisma.evidence.create({
    data: {
      uri: 'https://pit.wallonie.be/id/evidence/declaration-nace',
      name: 'Déclaration des codes d\'activités BCE',
      description: 'Document officiel affichant la liste des codes NACE BEL actifs enregistrés par l\'entreprise.',
      code: 'EVI-NACE-LIST',
      requirementId: reqCodeNaceExport.id,
    },
  });

  // Outputs pour Service 4
  await prisma.output.create({
    data: {
      uri: 'https://pit.wallonie.be/id/output/subside-decision',
      name: 'Décision d\'octroi de subside de l\'AWEX',
      description: 'Lettre officielle accordant la prise en charge financière des frais de consultants ou de développement.',
      code: 'OUT-GRANT-DECISION',
      publicServiceId: sExportDigital.id,
    },
  });


  // --- SERVICE 5: Assistant administratif PME (UCM) ---
  const sAdminPme = await prisma.publicService.create({
    data: {
      uri: 'https://pit.wallonie.be/id/public-service/assistant-administratif-pme',
      name: 'Assistant administratif PME',
      description: 'Parcours simplifié et personnalisé d\'accompagnement aux démarches de création, reprise ou formalités administratives auprès des guichets d\'entreprises.',
      code: 'S-ADMIN-ASSIST',
      organizationId: orgUcm.id,
      channels: {
        connect: [{ id: chWeb.id }, { id: chGuichet.id }, { id: chPhone.id }],
      },
      targetAudiences: {
        connect: [{ id: taPme.id }, { id: taIndependant.id }],
      },
      businessEvents: {
        connect: [{ id: beCreation.id }],
      },
      lifeEvents: {
        connect: [{ id: leTransmission.id }],
      },
      catalogues: {
        connect: [{ id: cataloguePIT.id }],
      },
    },
  });

  // Outputs pour Service 5
  await prisma.output.create({
    data: {
      uri: 'https://pit.wallonie.be/id/output/certificat-enregistrement',
      name: 'Numéro d\'entreprise BCE & Certificat d\'inscription',
      description: 'Certificat officiel attestant de l\'enregistrement conforme auprès de la Banque Carrefour des Entreprises.',
      code: 'OUT-BCE-REGISTRATION',
      publicServiceId: sAdminPme.id,
    },
  });

  console.log('✅ Base de données initialisée avec succès !');
  console.log('📊 Résumé des insertions :');
  console.log(` - ${await prisma.channel.count()} Canaux.`);
  console.log(` - ${await prisma.targetAudience.count()} Publics Cibles.`);
  console.log(` - ${await prisma.businessEvent.count()} Business Events.`);
  console.log(` - ${await prisma.lifeEvent.count()} Life Events.`);
  console.log(` - ${await prisma.organization.count()} Organisations.`);
  console.log(` - ${await prisma.publicService.count()} Services Publics (CPSV).`);
  console.log(` - ${await prisma.requirement.count()} Exigences (Requirements).`);
  console.log(` - ${await prisma.evidence.count()} Preuves demandées (Evidences).`);
  console.log(` - ${await prisma.output.count()} Livrables générés (Outputs).`);
  console.log(` - ${await prisma.cost.count()} Tarifs configurés.`);
  console.log(` - ${await prisma.contactPoint.count()} Points de contact.`);
  console.log(` - ${await prisma.catalogue.count()} Catalogues créés.`);
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

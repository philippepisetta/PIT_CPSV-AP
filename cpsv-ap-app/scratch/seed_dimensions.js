const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Transversal Dimensions...');

  // 1. TransformationDimensions (DR-BEST)
  const transformations = [
    { code: 'D', name: 'Démonstrateur / Expérimentation', description: 'Projets pilotes et bacs à sable réglementaires / technologiques' },
    { code: 'R', name: 'Readiness / Compétences', description: 'Sensibilisation, formation et montée en compétences des acteurs' },
    { code: 'B', name: 'Business / Modèle économique', description: 'Viabilité financière, nouveaux modèles d’affaires et accès aux financements' },
    { code: 'E', name: 'Ecosystème / Animation', description: 'Mise en réseau, clusters, collaborations et dynamique territoriale' },
    { code: 'S', name: 'Support / Accompagnement', description: 'Accompagnement individuel et conseil direct aux entreprises' },
    { code: 'T', name: 'Technologie / R&D', description: 'Recherche appliquée, transfert de technologie et briques logicielles/matérielles' }
  ];

  for (const t of transformations) {
    await prisma.transformationDimension.upsert({
      where: { code: t.code },
      update: t,
      create: t
    });
  }
  console.log('✔ Seeded TransformationDimensions (DR-BEST)');

  // 2. StrategicDomainDimensions (S3 Domains & Subdomains)
  // Let's create the parents first, then children
  const domains = [
    { code: 'S3_HEALTH', name: 'Innovation Thérapeutique & Santé', level: 'DOMAIN' },
    { code: 'S3_DIGITAL', name: 'Numérique & Intelligence Territoriale', level: 'DOMAIN' },
    { code: 'S3_CIRCULAR', name: 'Economie Circulaire & Transition Ecologique', level: 'DOMAIN' }
  ];

  const domainMap = {};
  for (const d of domains) {
    const record = await prisma.strategicDomainDimension.upsert({
      where: { code: d.code },
      update: d,
      create: d
    });
    domainMap[d.code] = record.id;
  }

  const subdomains = [
    { code: 'S3_BIOTECH', name: 'Biotechnologies & Pharma', level: 'SUBDOMAIN', parentId: domainMap['S3_HEALTH'] },
    { code: 'S3_MEDTECH', name: 'Dispositifs Médicaux', level: 'SUBDOMAIN', parentId: domainMap['S3_HEALTH'] },
    { code: 'S3_AI', name: 'Intelligence Artificielle & Algorithmique', level: 'SUBDOMAIN', parentId: domainMap['S3_DIGITAL'] },
    { code: 'S3_CYBER', name: 'Sécurité des Systèmes & Confiance', level: 'SUBDOMAIN', parentId: domainMap['S3_DIGITAL'] },
    { code: 'S3_ENERGY', name: 'Hydrogène & Energies Vertes', level: 'SUBDOMAIN', parentId: domainMap['S3_CIRCULAR'] }
  ];

  for (const sd of subdomains) {
    await prisma.strategicDomainDimension.upsert({
      where: { code: sd.code },
      update: sd,
      create: sd
    });
  }
  console.log('✔ Seeded StrategicDomainDimensions (S3)');

  // 3. CapabilityDimensions
  const capabilities = [
    { code: 'AI', name: 'Artificial Intelligence', description: 'Machine Learning, Deep Learning, NLP, and Computer Vision solutions.' },
    { code: 'CYBERSECURITY', name: 'Cybersecurity', description: 'Information security, threat detection, audit, and trust architectures.' },
    { code: 'CLOUD', name: 'Cloud Computing', description: 'Serverless architectures, hybrid cloud, and container orchestration.' },
    { code: 'IOT', name: 'Internet of Things', description: 'Edge computing, embedded sensors, and real-time telemetry.' },
    { code: 'AUTOMATION', name: 'Automation & Robotics', description: 'Industrial robotics, RPA, and business process automation.' },
    { code: 'DATA_ANALYTICS', name: 'Data Analytics & Big Data', description: 'Data pipelines, data warehouse, business intelligence, and predictive modeling.' }
  ];

  for (const cap of capabilities) {
    await prisma.capabilityDimension.upsert({
      where: { code: cap.code },
      update: cap,
      create: cap
    });
  }
  console.log('✔ Seeded CapabilityDimensions');

  // 4. ImpactDimensions
  const impacts = [
    { code: 'COMPETITIVENESS', name: 'Compétitivité & Croissance', category: 'REGIONAL', description: 'Amélioration de la productivité et croissance économique.' },
    { code: 'DECARBONIZATION', name: 'Décarbonation', category: 'GREEN_DEAL', description: 'Réduction de l’empreinte carbone et transition bas carbone.' },
    { code: 'CIRCULARITY', name: 'Circularité des ressources', category: 'CIRCULAR_WALLONIA', description: 'Réutilisation, recyclage et écoconception.' },
    { code: 'SOCIAL_INCLUSION', name: 'Inclusion Sociale', category: 'SDG', description: 'Création d’emplois de qualité, accessibilité et développement humain.' }
  ];

  for (const imp of impacts) {
    await prisma.impactDimension.upsert({
      where: { code: imp.code },
      update: imp,
      create: imp
    });
  }
  console.log('✔ Seeded ImpactDimensions');

  // 5. KnowledgeDimensions
  const knowledges = [
    { code: 'REFERENTIAL', name: 'Référentiels', description: 'Référentiels et ontologies officiels pour le territoire.' },
    { code: 'TAXONOMY', name: 'Taxonomies', description: 'Vocabulaires contrôlés, thésaurus et taxonomies d’usage.' },
    { code: 'INDICATOR', name: 'Indicateurs de Pilotage', description: 'Indicateurs de performance, de résultat et d’impact territorial.' },
    { code: 'DATASET_META', name: 'Métadonnées de Données', description: 'Schémas, profils d’application (CPSV-AP, DCAT-AP) et définitions.' }
  ];

  for (const kn of knowledges) {
    await prisma.knowledgeDimension.upsert({
      where: { code: kn.code },
      update: kn,
      create: kn
    });
  }
  console.log('✔ Seeded KnowledgeDimensions');

  console.log('All dimensions seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

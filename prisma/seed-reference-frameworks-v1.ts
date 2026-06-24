import { PrismaClient, ReferenceSourceType, ReferenceStabilityLevel, ReferenceLegalOrMethodologicalStatus, ReferenceApplicability, ClusterRole, ClusterValidationStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Cleaning up new reference tables...');
  
  // Clean up order to avoid foreign key violations
  await prisma.referenceConceptMapping.deleteMany();
  await prisma.sourceDocumentReferenceMapping.deleteMany();
  await prisma.sourceDocumentExtract.deleteMany();
  await prisma.referenceGovernanceNote.deleteMany();
  await prisma.referenceTaxonomyVersion.deleteMany();
  await prisma.referenceConcept.deleteMany();
  await prisma.referenceTaxonomy.deleteMany();
  await prisma.referenceSource.deleteMany();
  await prisma.semanticProfile.deleteMany();
  await prisma.conceptScheme.deleteMany();
  await prisma.vocabulary.deleteMany();
  
  await prisma.s3IndicatorBlock.deleteMany();
  await prisma.s3ScoringCriterion.deleteMany();
  await prisma.clusterMethodologyNote.deleteMany();
  await prisma.clusterDataSource.deleteMany();
  await prisma.dISGrouping.deleteMany();
  
  await prisma.dataSpace.deleteMany();
  await prisma.s3MarketApplication.deleteMany();
  await prisma.s3Cluster.deleteMany();
  await prisma.potentialDIS.deleteMany();
  
  await prisma.commonEuropeanDataSpaceDomain.deleteMany();
  await prisma.interoperabilityStandard.deleteMany();
  await prisma.naceCode.deleteMany();
  await prisma.nabsCode.deleteMany();
  await prisma.sourceDocument.deleteMany();
  await prisma.referenceFramework.deleteMany();

  console.log('🌱 Database cleaned. Seeding stable frameworks...');

  // 1. Reference Frameworks
  const frameworks = [
    {
      code: 'S3_COP',
      labelFr: 'Smart Specialisation Community of Practice',
      labelEn: 'Smart Specialisation Community of Practice',
      description: 'Cadre officiel de la Commission Européenne pour le développement territorial intelligent.',
      sourceName: 'European Commission',
      sourceType: ReferenceSourceType.EU_OFFICIAL,
      stabilityLevel: ReferenceStabilityLevel.STABLE,
      legalOrMethodologicalStatus: ReferenceLegalOrMethodologicalStatus.GUIDE,
      applicableTo: ReferenceApplicability.S3,
    },
    {
      code: 'RIS3_GUIDE',
      labelFr: 'RIS3 Guide',
      labelEn: 'RIS3 Guide',
      description: 'Méthodologie historique de construction des stratégies régionales de spécialisation intelligente.',
      sourceName: 'JRC JRC',
      sourceType: ReferenceSourceType.JRC,
      stabilityLevel: ReferenceStabilityLevel.STABLE,
      legalOrMethodologicalStatus: ReferenceLegalOrMethodologicalStatus.METHODOLOGY,
      applicableTo: ReferenceApplicability.S3,
    },
    {
      code: 'EYE_RIS3',
      labelFr: 'Eye@RIS3 JRC',
      labelEn: 'Eye@RIS3 JRC',
      description: 'Base de données européenne de cartographie des priorités d\'innovation régionales.',
      sourceName: 'JRC',
      sourceType: ReferenceSourceType.JRC,
      stabilityLevel: ReferenceStabilityLevel.EVOLVING,
      legalOrMethodologicalStatus: ReferenceLegalOrMethodologicalStatus.TAXONOMY,
      applicableTo: ReferenceApplicability.S3,
    },
    {
      code: 'NACE_REV2',
      labelFr: 'NACE Rév. 2',
      labelEn: 'NACE Rev. 2',
      description: 'Nomenclature officielle des activités économiques dans la Communauté européenne.',
      sourceName: 'Eurostat',
      sourceType: ReferenceSourceType.EU_OFFICIAL,
      stabilityLevel: ReferenceStabilityLevel.STABLE,
      legalOrMethodologicalStatus: ReferenceLegalOrMethodologicalStatus.TAXONOMY,
      applicableTo: ReferenceApplicability.BENEFICIARY,
    },
    {
      code: 'NABS_2007',
      labelFr: 'NABS 2007',
      labelEn: 'NABS 2007',
      description: 'Nomenclature pour l\'analyse et la comparaison des budgets et programmes scientifiques.',
      sourceName: 'Eurostat',
      sourceType: ReferenceSourceType.EU_OFFICIAL,
      stabilityLevel: ReferenceStabilityLevel.STABLE,
      legalOrMethodologicalStatus: ReferenceLegalOrMethodologicalStatus.TAXONOMY,
      applicableTo: ReferenceApplicability.GOVERNANCE,
    },
    {
      code: 'EU_DATA_STRATEGY',
      labelFr: 'Stratégie européenne pour les données',
      labelEn: 'European Strategy for Data',
      description: 'Cadre politique global visant à créer un marché unique européen de la donnée.',
      sourceName: 'Commission Européenne',
      sourceType: ReferenceSourceType.EU_OFFICIAL,
      stabilityLevel: ReferenceStabilityLevel.STABLE,
      legalOrMethodologicalStatus: ReferenceLegalOrMethodologicalStatus.GUIDE,
      applicableTo: ReferenceApplicability.DATA_SPACE,
    },
    {
      code: 'DSSC_BLUEPRINT',
      labelFr: 'DSSC Blueprint',
      labelEn: 'DSSC Blueprint',
      description: 'Référentiel conceptuel et technique principal pour l\'architecture des espaces de données.',
      sourceName: 'Data Spaces Support Centre',
      sourceType: ReferenceSourceType.DSSC,
      stabilityLevel: ReferenceStabilityLevel.EVOLVING,
      legalOrMethodologicalStatus: ReferenceLegalOrMethodologicalStatus.STANDARD,
      applicableTo: ReferenceApplicability.DATA_SPACE,
    },
    {
      code: 'DCAT_AP',
      labelFr: 'DCAT-AP',
      labelEn: 'DCAT-AP',
      description: 'Profil sémantique européen d\'interopérabilité pour la description des catalogues de données.',
      sourceName: 'SEMIC',
      sourceType: ReferenceSourceType.SEMIC,
      stabilityLevel: ReferenceStabilityLevel.STABLE,
      legalOrMethodologicalStatus: ReferenceLegalOrMethodologicalStatus.STANDARD,
      applicableTo: ReferenceApplicability.DATASET,
    },
    {
      code: 'CPSV_AP',
      labelFr: 'CPSV-AP',
      labelEn: 'Core Public Service Vocabulary Application Profile',
      description: 'Modèle de données sémantiques pour décrire les services publics de manière harmonisée.',
      sourceName: 'SEMIC',
      sourceType: ReferenceSourceType.SEMIC,
      stabilityLevel: ReferenceStabilityLevel.STABLE,
      legalOrMethodologicalStatus: ReferenceLegalOrMethodologicalStatus.STANDARD,
      applicableTo: ReferenceApplicability.SERVICE,
    }
  ];

  const createdFrameworks: { [key: string]: any } = {};
  for (const fw of frameworks) {
    const created = await prisma.referenceFramework.create({ data: fw });
    createdFrameworks[fw.code] = created;
  }
  console.log(`✅ Seeded ${Object.keys(createdFrameworks).length} reference frameworks.`);

  // 2. Data Space Domains (14 sectors)
  const dsDomains = [
    'agriculture', 'cultural heritage', 'energy', 'finance', 'green deal',
    'health', 'manufacturing / industry', 'language', 'media', 'mobility',
    'public administrations', 'research and innovation', 'skills', 'tourism'
  ];

  for (const name of dsDomains) {
    await prisma.commonEuropeanDataSpaceDomain.create({
      data: {
        code: name.replace(/\s+/g, '_').toUpperCase(),
        name: name,
        description: `Espace européen commun de données dans le domaine: ${name}`
      }
    });
  }
  console.log('✅ Seeded 14 Common European Data Space Domains.');

  // 3. Interoperability Standards
  const standards = [
    { code: 'DCAT-AP', name: 'DCAT-AP', description: 'Metadonnées de datasets', frameworkId: createdFrameworks['DCAT_AP'].id },
    { code: 'CPSV-AP', name: 'CPSV-AP', description: 'Metadonnées de services publics', frameworkId: createdFrameworks['CPSV_AP'].id },
    { code: 'NGSI-LD', name: 'NGSI-LD', description: 'Context API standardisé', frameworkId: createdFrameworks['S3_COP'].id },
    { code: 'SKOS', name: 'SKOS', description: 'Simple Knowledge Organization System', frameworkId: createdFrameworks['S3_COP'].id },
  ];

  for (const std of standards) {
    await prisma.interoperabilityStandard.create({ data: std });
  }
  console.log('✅ Seeded Interoperability Standards.');

  // 4. Source Documents (Official & Internal)
  const technopolisDoc = await prisma.sourceDocument.create({
    data: {
      title: 'Définition des DIS de la S3 Wallonie – GTS3 – 11 mai 2026',
      author: 'Technopolis',
      status: 'METHODOLOGICAL_REFERENCE',
      topic: 'S3 / DIS Wallonie',
      description: 'Document de cadrage méthodologique pour la reconstruction sémantique et la définition des DIS.',
      frameworkId: createdFrameworks['S3_COP'].id
    }
  });

  const pwcDoc = await prisma.sourceDocument.create({
    data: {
      title: 'Consultance pour le développement d’un écosystème et de use cases de data spaces',
      author: 'PwC',
      status: 'INTERNAL_PRESENTATION',
      topic: 'Data Spaces',
      description: 'Proposition d\'architecture et de cas d\'usage pour les espaces de données wallons.',
      frameworkId: createdFrameworks['DSSC_BLUEPRINT'].id
    }
  });
  console.log('✅ Seeded Source Documents.');

  // 5. Seeding S3 Taxonomies and Concepts
  const s3Taxonomy = await prisma.referenceTaxonomy.create({
    data: {
      code: 'S3_CONCEPTS',
      name: 'Taxonomie de Spécialisation Intelligente (S3)',
      frameworkId: createdFrameworks['S3_COP'].id
    }
  });

  const s3Concepts = [
    { code: 'SmartSpecialisationStrategy', labelFr: 'Stratégie de Spécialisation Intelligente', labelEn: 'Smart Specialisation Strategy' },
    { code: 'RIS3', labelFr: 'RIS3', labelEn: 'RIS3' },
    { code: 'DIS', labelFr: 'Domaine d\'Innovation Stratégique (DIS)', labelEn: 'Strategic Innovation Domain' },
    { code: 'S3Priority', labelFr: 'Priorité S3', labelEn: 'S3 Priority' },
    { code: 'InvestmentPriority', labelFr: 'Priorité d\'Investissement', labelEn: 'Investment Priority' },
    { code: 'EntrepreneurialDiscoveryProcess', labelFr: 'Processus de Découverte Entrepreneuriale', labelEn: 'Entrepreneurial Discovery Process' },
    { code: 'ValueChain', labelFr: 'Chaîne de valeur', labelEn: 'Value Chain' }
  ];

  const createdS3Concepts: { [key: string]: any } = {};
  for (const c of s3Concepts) {
    const created = await prisma.referenceConcept.create({
      data: {
        code: c.code,
        labelFr: c.labelFr,
        labelEn: c.labelEn,
        taxonomyId: s3Taxonomy.id
      }
    });
    createdS3Concepts[c.code] = created;
  }
  console.log('✅ Seeded S3 Concepts.');

  // 6. Seeding Data Space Concepts
  const dsTaxonomy = await prisma.referenceTaxonomy.create({
    data: {
      code: 'DS_CONCEPTS',
      name: 'Taxonomie des Espaces de Données',
      frameworkId: createdFrameworks['DSSC_BLUEPRINT'].id
    }
  });

  const dsConcepts = [
    { code: 'DataSpace', labelFr: 'Espace de Données', labelEn: 'Data Space' },
    { code: 'DataProduct', labelFr: 'Produit de Données', labelEn: 'Data Product' },
    { code: 'DataProvider', labelFr: 'Fournisseur de Données', labelEn: 'Data Provider' },
    { code: 'DataConsumer', labelFr: 'Consommateur de Données', labelEn: 'Data Consumer' },
    { code: 'TrustFramework', labelFr: 'Cadre de Confiance', labelEn: 'Trust Framework' }
  ];

  const createdDsConcepts: { [key: string]: any } = {};
  for (const c of dsConcepts) {
    const created = await prisma.referenceConcept.create({
      data: {
        code: c.code,
        labelFr: c.labelFr,
        labelEn: c.labelEn,
        taxonomyId: dsTaxonomy.id
      }
    });
    createdDsConcepts[c.code] = created;
  }
  console.log('✅ Seeded Data Space Concepts.');

  // 7. Seed Concept Mappings (DIS -> S3Priority)
  await prisma.referenceConceptMapping.create({
    data: {
      sourceConceptId: createdS3Concepts['DIS'].id,
      targetConceptId: createdS3Concepts['S3Priority'].id,
      mappingType: 'RELATED',
      description: 'Un Domaine d\'Innovation Stratégique est un alignement opérationnel régional d\'une priorité S3 globale.',
      confidenceLevel: 'HIGH'
    }
  });
  console.log('✅ Seeded Concept Mappings.');

  // 8. Seed Potential DIS
  const disMfg = await prisma.potentialDIS.create({
    data: {
      code: 'DIS_MFG',
      name: 'Génie mécanique, matériaux et Industrie du futur (Manufacturing)',
      description: 'DIS centré sur l\'amélioration technologique et la décarbonation industrielle.',
      validationStatus: ClusterValidationStatus.PROXIED,
      version: 'S3 2026',
      isProxy: true,
      limitationNote: 'Proxy issu du clustering Technopolis, nécessite validation.',
      frameworkId: createdFrameworks['S3_COP'].id,
      sourceDocumentId: technopolisDoc.id
    }
  });

  const disCircular = await prisma.potentialDIS.create({
    data: {
      code: 'DIS_CIRC',
      name: 'Circular Wallonia (Économie Circulaire)',
      description: 'DIS transverse pour le recyclage, l\'écoconception et les matériaux durables.',
      validationStatus: ClusterValidationStatus.PROXIED,
      version: 'S3 2026',
      isProxy: true,
      limitationNote: 'Triangulation requise.',
      frameworkId: createdFrameworks['S3_COP'].id,
      sourceDocumentId: technopolisDoc.id
    }
  });
  console.log('✅ Seeded 2 Potential DIS.');

  // 9. NACE and NABS codes
  const nace1 = await prisma.naceCode.create({ data: { code: '26.11', labelFr: 'Fabrication de composants électroniques' } });
  const nace2 = await prisma.naceCode.create({ data: { code: '33.12', labelFr: 'Réparation de machines' } });
  const nabs1 = await prisma.nabsCode.create({ data: { code: 'F_04', labelFr: 'Recherche spatiale ou aéronautique' } });
  console.log('✅ Seeded NACE/NABS codes.');

  // 10. Seed S3 Clusters (20 Clusters with scoring and methodology notes)
  // Let's seed 3 of the 20 clusters in full detail to prove the model
  const clustersDataList = [
    { code: 5, name: 'Numérique & Logiciels', role: ClusterRole.MARKET_CLUSTER, description: 'Cluster d\'activités logicielles, SaaS, et conseil technologique.' },
    { code: 11, name: 'Matériaux avancés & Écoconception', role: ClusterRole.MARKET_CLUSTER, description: 'Filière matériaux et transition verte.' },
    { code: 19, name: 'Systèmes industriels intelligents', role: ClusterRole.MARKET_CLUSTER, description: 'Maintenance prédictive, robotique et cobotique.' }
  ];

  for (const clData of clustersDataList) {
    const cluster = await prisma.s3Cluster.create({
      data: {
        code: clData.code,
        name: clData.name,
        description: clData.description,
        role: clData.role,
        validationStatus: ClusterValidationStatus.PROXIED,
        arbitrationStatus: 'TO_BE_ARBITRATED',
        isProxy: true,
        limitationNote: 'Single assignment KMeans constraint. Potential under-representation of multi-disciplinary activities.',
        potentialDisId: clData.code === 19 ? disMfg.id : clData.code === 11 ? disCircular.id : disMfg.id,
        frameworkId: createdFrameworks['S3_COP'].id,
        sourceDocumentId: technopolisDoc.id,
        naceCodes: { connect: [{ id: nace2.id }] },
        nabsCodes: { connect: [{ id: nabs1.id }] }
      }
    });

    // Seed Scoring Criteria
    const criteria = [
      { name: 'Masse critique', weight: 0.8 },
      { name: 'Intensité RDI', weight: 0.9 },
      { name: 'Potentiel Export', weight: 0.7 },
      { name: 'Contribution S3', weight: 0.85 }
    ];

    for (const crit of criteria) {
      await prisma.s3ScoringCriterion.create({
        data: {
          name: `${crit.name} (Cluster ${cluster.code})`,
          description: `Score de performance sur l\'axe ${crit.name}`,
          weight: crit.weight,
          clusters: { connect: [{ id: cluster.id }] }
        }
      });
    }

    // Seed Methodology Note
    await prisma.clusterMethodologyNote.create({
      data: {
        title: `Note méthodologique Cluster ${cluster.code}`,
        content: `Cluster généré par classification non-supervisée KMeans sur un échantillon de 1 181 entreprises. Triangulation nécessaire.`,
        limitations: 'Triangulation requise.',
        s3ClusterId: cluster.id
      }
    });

    // Seed Data Source Record count
    await prisma.clusterDataSource.create({
      data: {
        name: 'Base d\'étude ORBIS Wallonie',
        recordCount: 120000,
        description: 'Extraction des comptes annuels et informations administratives.',
        s3ClusterId: cluster.id
      }
    });
  }

  console.log('✅ Seeded GTS3 Clusters with Scoring, Indicators, and Methodology notes.');

  // 11. Seed S3 Market Applications
  await prisma.s3MarketApplication.create({
    data: {
      code: 'MA_PRED_MAINT',
      name: 'Maintenance prédictive et Industrie 4.0',
      description: 'Solutions logicielles et IoT de diagnostic à distance et maintenance prédictive.',
      validationStatus: ClusterValidationStatus.PROXIED,
      isProxy: true,
      potentialDisId: disMfg.id,
      frameworkId: createdFrameworks['S3_COP'].id,
      sourceDocumentId: technopolisDoc.id,
      naceCodes: { connect: [{ id: nace2.id }] }
    }
  });

  console.log('✅ Seeded S3 Market Applications.');

  // 12. Connect Exemples Métiers (PME Maintenance prédictive & PME Matériaux biosourcés)
  // Let's verify if there are any existing beneficiaries to connect or mock it
  const ben1 = await prisma.beneficiary.create({
    data: {
      name: 'SmartMaintenance Wallonia S.A.',
      bce: '0987654321',
      size: 'PME',
      location: 'Namur',
      demand: 'Accompagnement EDIH sur la maintenance prédictive',
      beneficiaryType: 'ENTREPRISE',
      status: 'ACTIVE'
    }
  });

  const cluster19 = await prisma.s3Cluster.findFirst({ where: { code: 19 } });
  if (cluster19) {
    await prisma.beneficiary.update({
      where: { id: ben1.id },
      data: {
        s3Clusters: { connect: [{ id: cluster19.id }] }
      }
    });
  }

  console.log('✅ Connected Real-world company mappings (SmartMaintenance).');
  console.log('🎉 Seed reference frameworks v1 completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

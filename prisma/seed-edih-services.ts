import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const servicesData = [
  {
    category: "Test before invest (TBI)",
    categoryCode: "TBI",
    title: "Collective demonstration activity",
    description: "Deep dive session covering a presentation and all the details of a specific infrastructure/demonstrator to see how it can be configured or adapted to meet specific needs",
    type: "Coll.",
    nominalPrice: 1010.00,
    stateAid: 300.00,
    unit: "€"
  },
  {
    category: "Test before invest (TBI)",
    categoryCode: "TBI",
    title: "Deep diagnosis",
    description: "Onsite support highlighting opportunities to improve processes through digitalisation and define a roadmap on how and when to leverage AI and other technologies",
    type: "Indiv.",
    nominalPrice: 990.00,
    stateAid: 300.00,
    unit: "€/ day"
  },
  {
    category: "Test before invest (TBI)",
    categoryCode: "TBI",
    title: "Diagnosis and customer journey orientation",
    description: "Assessing company maturity and orienting them towards the relevant services, mechanisms, demonstrators, …",
    type: "Indiv.",
    nominalPrice: 880.00,
    stateAid: 260.00,
    unit: "€"
  },
  {
    category: "Test before invest (TBI)",
    categoryCode: "TBI",
    title: "Fastrack session (online or onsite)",
    description: "Presentation of technological developments to encourage companies to take actions (plenary session)",
    type: "Coll.",
    nominalPrice: 330.00,
    stateAid: 100.00,
    unit: "€"
  },
  {
    category: "Test before invest (TBI)",
    categoryCode: "TBI",
    title: "First line AI support",
    description: "Support sessions for businesses implementing AI solutions covering legal topics such as AI Act, Data Act, …",
    type: "Coll.",
    nominalPrice: 350.00,
    stateAid: 110.00,
    unit: "€"
  },
  {
    category: "Test before invest (TBI)",
    categoryCode: "TBI",
    title: "Group coaching",
    description: "Group support to bridge the gap between insights and action. Interaction about specific topic(s) with the group in one or two sessions.",
    type: "Coll.",
    nominalPrice: 1020.00,
    stateAid: 310.00,
    unit: "€"
  },
  {
    category: "Test before invest (TBI)",
    categoryCode: "TBI",
    title: "Hands-on workshop",
    description: "Workshop given by expert(s) with a hands-on approach allowing companies to assess the potential and value of a technology or a facet of it.",
    type: "Coll.",
    nominalPrice: 970.00,
    stateAid: 290.00,
    unit: "€"
  },
  {
    category: "Test before invest (TBI)",
    categoryCode: "TBI",
    title: "Individual coaching",
    description: "Individual short to long term support to make a feasibility study or build/prepare a PoC",
    type: "Indiv.",
    nominalPrice: 1040.00,
    stateAid: 310.00,
    unit: "€/ day"
  },
  {
    category: "Test before invest (TBI)",
    categoryCode: "TBI",
    title: "Keynote",
    description: "Keynote given by an expert covering a specific topic from a \"Test before invest\" perspective (more technological approach with some business aspects)",
    type: "Coll.",
    nominalPrice: 50.00,
    stateAid: 20.00,
    unit: "€"
  },
  {
    category: "Test before invest (TBI)",
    categoryCode: "TBI",
    title: "Technology Trends",
    description: "State-of-the-art overview of a technology, assessment of its relevance and impact.",
    type: "Coll.",
    nominalPrice: 890.00,
    stateAid: 270.00,
    unit: "€"
  },
  {
    category: "Test before invest (TBI)",
    categoryCode: "TBI",
    title: "Thematic event",
    description: "Thematic event to inspire on a specific technological topic.",
    type: "Coll.",
    nominalPrice: 260.00,
    stateAid: 80.00,
    unit: "€"
  },
  {
    category: "Skills and training (S&T)",
    categoryCode: "SNT",
    title: "Future skills-oriented workshop",
    description: "Workshop designed for companies focusing on up and reskilling of workers and managers considering digital technologies, innovative approaches and AI-related opportunities",
    type: "Coll.",
    nominalPrice: 970.00,
    stateAid: 290.00,
    unit: "€"
  },
  {
    category: "Skills and training (S&T)",
    categoryCode: "SNT",
    title: "S&T Diagnosis & Orientation",
    description: "Help companies to assess their digital maturity and define a tailored action plan. This includes identifying relevant S&T services and innovation pillars based on each company’s needs",
    type: "Indiv.",
    nominalPrice: 880.00,
    stateAid: 260.00,
    unit: "€"
  },
  {
    category: "Skills and training (S&T)",
    categoryCode: "SNT",
    title: "e-Learning",
    description: "Online training tools to upgrade digital-related skills and enable a relevant AI-use in a work-related environment;",
    type: "Indiv.",
    nominalPrice: 90.00,
    stateAid: 30.00,
    unit: "€"
  },
  {
    category: "Skills and training (S&T)",
    categoryCode: "SNT",
    title: "Fastrack2Training",
    description: "Quick & informal sessions to present digital technologies to inspire and encourage companies to start their up/re-skilling journey",
    type: "Coll.",
    nominalPrice: 330.00,
    stateAid: 100.00,
    unit: "€"
  },
  {
    category: "Skills and training (S&T)",
    categoryCode: "SNT",
    title: "My Training coach",
    description: "Personalised support for companies navigating skills and training opportunities.",
    type: "Indiv.",
    nominalPrice: 1090.00,
    stateAid: 330.00,
    unit: "€/ day"
  },
  {
    category: "Skills and training (S&T)",
    categoryCode: "SNT",
    title: "Learning network",
    description: "Series of group sessions allowing companies to work together to share knowledge and exchange experiences.",
    type: "Coll.",
    nominalPrice: 950.00,
    stateAid: 290.00,
    unit: "€"
  },
  {
    category: "Skills and training (S&T)",
    categoryCode: "SNT",
    title: "Meet & Peek Training",
    description: "Visit to a leading industry or fair and showcase achievements and good practices in S&T to inspire, connect and take action.",
    type: "Coll.",
    nominalPrice: 410.00,
    stateAid: 120.00,
    unit: "€"
  },
  {
    category: "Support to find investment (FIN)",
    categoryCode: "FIN",
    title: "HandsOn Funding",
    description: "Workshop designed for companies ready to move from insight to action on R&I funding. This hands-on session dives deeper into key subsidy opportunities and guides participants through practical steps to align their project and prepare applications.",
    type: "Coll.",
    nominalPrice: 970.00,
    stateAid: 290.00,
    unit: "€"
  },
  {
    category: "Support to find investment (FIN)",
    categoryCode: "FIN",
    title: "Fastrack2Funding",
    description: "Fast-paced session designed for companies seeking R&I funding solutions at regional or EU level. It delivers a rundown of the last funding and subsidy opportunities, enabling participants to access key information & engage.",
    type: "Coll.",
    nominalPrice: 330.00,
    stateAid: 100.00,
    unit: "€"
  },
  {
    category: "Support to find investment (FIN)",
    categoryCode: "FIN",
    title: "MyFundingCoach",
    description: "Personalised support for companies navigating research and innovation subsidies. Support to identify funding opportunities, strengthen project positioning and guidance through application process through one-on-one sessions.",
    type: "Indiv.",
    nominalPrice: 1090.00,
    stateAid: 330.00,
    unit: "€/ day"
  },
  {
    category: "Support to find investment (FIN)",
    categoryCode: "FIN",
    title: "Deep diagnosis Funding",
    description: "Onsite support highlighting opportunities to improve processes from a funding perspective.",
    type: "Indiv.",
    nominalPrice: 990.00,
    stateAid: 300.00,
    unit: "€"
  },
  {
    category: "Innovation ecosystem and networking (ECO)",
    categoryCode: "ECO",
    title: "Fastrack Connexion",
    description: "Presentation of technological developments designed to connect a small number of companies and solution providers, aligning supply and demand around topics such as digital processes, AI, data, etc",
    type: "Coll.",
    nominalPrice: 330.00,
    stateAid: 100.00,
    unit: "€"
  },
  {
    category: "Innovation ecosystem and networking (ECO)",
    categoryCode: "ECO",
    title: "Forum",
    description: "Event in which experts join companies for a full day of inspiration and mobilisation on digitalisation. Designed to be upgraded with other services.",
    type: "Coll.",
    nominalPrice: 110.00,
    stateAid: 30.00,
    unit: "€"
  },
  {
    category: "Innovation ecosystem and networking (ECO)",
    categoryCode: "ECO",
    title: "Ecosystem collaboration coaching",
    description: "Support to bridge the gap between insights and action by fostering interaction on digital oriented topic(s) – such as AI – with a group in one or two sessions.",
    type: "Coll.",
    nominalPrice: 1330.00,
    stateAid: 400.00,
    unit: "€"
  },
  {
    category: "Innovation ecosystem and networking (ECO)",
    categoryCode: "ECO",
    title: "Individual ECO coaching",
    description: "Individual short to long-term support to identify and understand specific challenges, to conduct a feasibility study or a PoC.",
    type: "Indiv.",
    nominalPrice: 1040.00,
    stateAid: 310.00,
    unit: "€"
  },
  {
    category: "Innovation ecosystem and networking (ECO)",
    categoryCode: "ECO",
    title: "ECO Learning network",
    description: "Series of group sessions allowing companies to work together within a targeted ecosystem to foster knowledge sharing, exchange of experiences, and connections between businesses and solution providers.",
    type: "Coll.",
    nominalPrice: 1030.00,
    stateAid: 310.00,
    unit: "€"
  },
  {
    category: "Innovation ecosystem and networking (ECO)",
    categoryCode: "ECO",
    title: "ECO Meet & Peek",
    description: "Visit to a leading industry or a fair to show achievements, inspire, connect and take action.",
    type: "Coll.",
    nominalPrice: 410.00,
    stateAid: 120.00,
    unit: "€"
  },
  {
    category: "Innovation ecosystem and networking (ECO)",
    categoryCode: "ECO",
    title: "Pitch & Connect",
    description: "Pitching events to discover corporate projects, including AI-related projects, ready to be matched by their market-fit-expertise.",
    type: "Coll.",
    nominalPrice: 210.00,
    stateAid: 60.00,
    unit: "€"
  },
  {
    category: "Innovation ecosystem and networking (ECO)",
    categoryCode: "ECO",
    title: "Thematic networking event",
    description: "Thematic event to inspire on a specific topic.",
    type: "Coll.",
    nominalPrice: 270.00,
    stateAid: 80.00,
    unit: "€"
  }
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^a-z0-9]+/g, "-") // replace non-alphanumeric with -
    .replace(/(^-|-$)+/g, ""); // remove leading/trailing -
}

async function main() {
  console.log('🌱 Start seeding EDIH WallonIA services...');

  // 1. Fetch references
  const orgAdn = await prisma.organization.findFirst({
    where: { code: 'ORG-ADN' }
  });
  if (!orgAdn) {
    throw new Error('Required Organization with code ORG-ADN not found in database.');
  }

  const ecoEdih = await prisma.ecosystem.findFirst({
    where: { name: 'EDIH Wallonia' }
  });
  if (!ecoEdih) {
    throw new Error('Required Ecosystem "EDIH Wallonia" not found in database.');
  }

  const levelIndividual = await prisma.interventionLevel.findFirst({
    where: { code: 'INDIVIDUAL' }
  });
  const levelCollective = await prisma.interventionLevel.findFirst({
    where: { code: 'COLLECTIVE' }
  });

  const channelRdv = await prisma.channel.findFirst({
    where: { code: 'CH-RDV' }
  });
  const channelGuichet = await prisma.channel.findFirst({
    where: { code: 'CH-GUICHET' }
  });

  const targetPme = await prisma.targetAudience.findFirst({
    where: { code: 'TA-PME' }
  });
  const targetStartup = await prisma.targetAudience.findFirst({
    where: { code: 'TA-STARTUP' }
  });

  const cataloguePit = await prisma.catalogue.findFirst({
    where: { code: 'CAT-PIT' }
  });

  const challengeIa = await prisma.businessChallenge.findFirst({
    where: { code: 'BC-IA' }
  });
  const challengeDigital = await prisma.businessChallenge.findFirst({
    where: { code: 'BC-DIGITAL' }
  });

  const vcNumerique = await prisma.strategicValueChain.findFirst({
    where: { code: 'SVC-NUMERIQUE' }
  });
  const vcIndustrie = await prisma.strategicValueChain.findFirst({
    where: { code: 'SVC-INDUSTRIE-FUTUR' }
  });

  // 2. Clean old EDIH services to make script idempotent
  console.log('🧹 Cleaning old EDIH services...');
  const deletedServices = await prisma.publicService.deleteMany({
    where: {
      code: {
        startsWith: 'EDIH-'
      }
    }
  });
  console.log(`Deleted ${deletedServices.count} old EDIH services.`);

  // 3. Create services
  console.log('➕ Creating new EDIH services...');
  for (const s of servicesData) {
    const slug = slugify(s.title);
    const code = `EDIH-${s.categoryCode}-${slug.toUpperCase()}`;
    const uri = `https://pit.wallonie.be/id/public-service/edih-${s.categoryCode.toLowerCase()}-${slug}`;

    console.log(`- Creating service: ${s.title} (${code})`);

    // Determine level and channel
    const isIndiv = s.type === 'Indiv.';
    const levelId = isIndiv ? levelIndividual?.id : levelCollective?.id;
    
    // Build channels connection
    const channelIds: { id: number }[] = [];
    if (isIndiv && channelRdv) channelIds.push({ id: channelRdv.id });
    if (!isIndiv && channelGuichet) channelIds.push({ id: channelGuichet.id });

    // Target audiences
    const targetAudienceIds: { id: number }[] = [];
    if (targetPme) targetAudienceIds.push({ id: targetPme.id });
    if (targetStartup) targetAudienceIds.push({ id: targetStartup.id });

    // Challenges
    const challengeIds: { id: number }[] = [];
    if (challengeIa) challengeIds.push({ id: challengeIa.id });
    if (challengeDigital) challengeIds.push({ id: challengeDigital.id });

    // Value chains
    const vcIds: { id: number }[] = [];
    if (vcNumerique) vcIds.push({ id: vcNumerique.id });
    if (vcIndustrie) vcIds.push({ id: vcIndustrie.id });

    // Create service
    const service = await prisma.publicService.create({
      data: {
        uri,
        name: s.title,
        description: s.description,
        code,
        organizationId: orgAdn.id,
        interventionLevelId: levelId || null,
        ecosystems: {
          connect: [{ id: ecoEdih.id }]
        },
        channels: {
          connect: channelIds
        },
        targetAudiences: {
          connect: targetAudienceIds
        },
        catalogues: cataloguePit ? {
          connect: [{ id: cataloguePit.id }]
        } : undefined,
        challenges: challengeIds.length > 0 ? {
          connect: challengeIds
        } : undefined,
        filieresS3: vcIds.length > 0 ? {
          connect: vcIds
        } : undefined,
        costs: {
          create: [
            {
              name: "Nominal Price",
              value: s.nominalPrice,
              currency: "EUR",
              description: `Nominal price of the service. Unit: ${s.unit}`
            },
            {
              name: "State Aid Passed On",
              value: s.stateAid,
              currency: "EUR",
              description: `State aid passed on by EDIH. Unit: ${s.unit}`
            }
          ]
        }
      }
    });

    console.log(`  Created service with ID ${service.id} and 2 costs.`);
  }

  console.log('🎉 Seeding of EDIH WallonIA services completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding EDIH services:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

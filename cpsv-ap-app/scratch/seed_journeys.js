const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const initialJourneyTemplates = [
  {
    name: "Transformation Numérique (Industrie 4.0)",
    provider: "AdN / WE",
    objective: "Lignes de production connectées et automatisation",
    description: "Accompagner les PME manufacturières dans l'intégration des technologies de l'industrie 4.0 et de l'automatisation.",
    targetAudience: ["PME", "Startup"],
    businessEvent: "Operating Business",
    euStrategy: "Décennie Numérique",
    localS3: "Industrie 4.0",
    filiere: "Industrie Manufacturière",
    valueChainSegment: "Production & Industrialisation",
    stages: [
      { name: "Amorçage", position: 1, serviceCodes: ["S-IA-WORKSHOP"] },
      { name: "Diagnostic", position: 2, serviceCodes: ["S-DIGITAL-DIAG"] },
      { name: "Coaching", position: 3, serviceCodes: ["S-CYBER-CHECK"] },
      { name: "Planification", position: 4, serviceCodes: ["S-EDIH-COORD"] },
      { name: "Mise en œuvre", position: 5, serviceCodes: ["S-DIGITAL-COACH"] },
      { name: "Investissement", position: 6, serviceCodes: ["S-IA-DIAG"] }
    ]
  },
  {
    name: "Résilience Cybersécurité",
    provider: "AKT / AdN",
    objective: "Audit de vulnérabilité et formation cyber",
    description: "Renforcer la cybersécurité des entreprises régionales face aux menaces numériques.",
    targetAudience: ["PME", "Startup", "Indépendant"],
    businessEvent: "Operating Business",
    euStrategy: "Souveraineté & Cyber-résilience",
    localS3: "Cybersécurité",
    filiere: "Technologies du Futur",
    valueChainSegment: "Production & Industrialisation",
    stages: [
      { name: "Diagnostic", position: 1, serviceCodes: ["S-DIGITAL-DIAG"] },
      { name: "Coaching", position: 2, serviceCodes: ["S-CYBER-CHECK"] }
    ]
  },
  {
    name: "Accompagnement Économique & Export",
    provider: "WE / AWEX",
    objective: "Levée de fonds R&D et développement international",
    description: "Soutenir la croissance des PME wallonnes sur les marchés internationaux et l'accès aux financements.",
    targetAudience: ["PME", "Grandes Entreprises"],
    businessEvent: "Expanding Business",
    euStrategy: "Décennie Numérique",
    localS3: "Accompagnement Économique & Export",
    filiere: "Industrie Manufacturière",
    valueChainSegment: "Marketing & Export",
    stages: [
      { name: "Coaching", position: 1, serviceCodes: ["S-EXPORT-COACH"] },
      { name: "Investissement", position: 2, serviceCodes: ["S-IA-DIAG"] }
    ]
  },
  {
    name: "Transition Énergétique & Décarbonation",
    provider: "Cluster Tweed",
    objective: "Plan carbone et décarbonation industrielle",
    description: "Accompagner les entreprises dans la décarbonation et l'efficacité énergétique de leurs infrastructures.",
    targetAudience: ["PME", "Grandes Entreprises"],
    businessEvent: "Operating Business",
    euStrategy: "Pacte Vert (Green Deal)",
    localS3: "Transition Énergétique",
    filiere: "Énergies Propres",
    valueChainSegment: "Économie Circulaire & Fin de vie",
    stages: [
      { name: "Diagnostic", position: 1, serviceCodes: ["S-DIGITAL-DIAG"] },
      { name: "Mise en œuvre", position: 2, serviceCodes: ["S-DIGITAL-COACH"] }
    ]
  },
  {
    name: "Recherche & Collaboration S3",
    provider: "SPW EER",
    objective: "Consortiums de recherche clinique et validation TRL",
    description: "Faciliter les consortiums de recherche collaborative et la valorisation industrielle des innovations régionales.",
    targetAudience: ["PME", "Startup", "Universités"],
    businessEvent: "Operating Business",
    euStrategy: "Recherche & Collaboration S3",
    localS3: "Recherche & Collaboration S3",
    filiere: "Sciences de la Vie",
    valueChainSegment: "Recherche & Développement",
    stages: [
      { name: "Amorçage", position: 1, serviceCodes: ["S-EDIH-COORD"] },
      { name: "Diagnostic", position: 2, serviceCodes: ["S-DIGITAL-DIAG"] },
      { name: "Mise en œuvre", position: 3, serviceCodes: ["S-IA-DIAG"] }
    ]
  },
  {
    name: "Données Territoriales",
    provider: "Agence du Numérique",
    objective: "Stratégie de données territoriales ouvertes et souveraines",
    description: "Accompagner la valorisation et la souveraineté des données territoriales de Wallonie.",
    targetAudience: ["PME", "Organisations Publiques"],
    businessEvent: "Operating Business",
    euStrategy: "Souveraineté & Cyber-résilience",
    localS3: "IA & Algorithmes",
    filiere: "Technologies du Futur",
    valueChainSegment: "Approvisionnement & Conception",
    stages: [
      { name: "Amorçage", position: 1, serviceCodes: ["S-EDIH-COORD"] },
      { name: "Planification", position: 2, serviceCodes: ["S-IA-DIAG"] }
    ]
  }
];

async function main() {
  console.log('Seeding Journeys into the database...');

  // Fetch all services to map codes to ids
  const services = await prisma.publicService.findMany();
  const serviceMap = {};
  services.forEach(s => {
    if (s.code) {
      serviceMap[s.code] = s.id;
    }
  });

  // Fetch S3 filieres and value chain stages to connect them
  const filieres = await prisma.strategicValueChain.findMany();
  const valueChainStages = await prisma.valueChainStage.findMany();
  const challenges = await prisma.businessChallenge.findMany();
  const transformations = await prisma.transformationDimension.findMany();
  const domains = await prisma.strategicDomainDimension.findMany();
  const ecosystems = await prisma.ecosystem.findMany();

  for (const t of initialJourneyTemplates) {
    console.log(`Upserting journey: "${t.name}"`);

    // Match S3 filiere by name
    const matchingFiliere = filieres.find(f => f.name.toLowerCase().includes(t.filiere.toLowerCase()));
    
    // Match Value Chain Stage by name prefix
    const matchingVcStage = valueChainStages.find(vc => {
      const segName = t.valueChainSegment.split(" ")[0].toLowerCase();
      return vc.name.toLowerCase().includes(segName);
    });

    // Match Transformation Dimension (e.g. readiness/support/technology)
    const matchingTrans = transformations.find(tr => {
      if (t.localS3 === "Industrie 4.0") return tr.code === "S" || tr.code === "T";
      if (t.localS3 === "Cybersécurité") return tr.code === "S" || tr.code === "R";
      return tr.code === "S";
    });

    // Match Strategic Domain
    const matchingDomain = domains.find(d => d.name.toLowerCase().includes("numérique") || d.name.toLowerCase().includes("écologique"));

    // Find a matching business challenge if any
    const matchingChallenge = challenges.find(c => c.name.toLowerCase().includes("digital") || c.name.toLowerCase().includes("sécurité"));

    // Find matching ecosystem
    const matchingEco = ecosystems.find(e => e.name.toLowerCase().includes("adn") || e.name.toLowerCase().includes("tweed") || e.name.toLowerCase().includes("we"));

    // Check if journey already exists
    let dbJourney = await prisma.journey.findFirst({
      where: { name: t.name }
    });

    if (dbJourney) {
      // Clean old stages
      await prisma.journeyStage.deleteMany({
        where: { journeyId: dbJourney.id }
      });

      // Update journey
      dbJourney = await prisma.journey.update({
        where: { id: dbJourney.id },
        data: {
          provider: t.provider,
          objective: t.objective,
          description: t.description,
          targetAudience: t.targetAudience,
          filieresS3: matchingFiliere ? { set: [{ id: matchingFiliere.id }] } : undefined,
          stagesTransverses: matchingVcStage ? { set: [{ id: matchingVcStage.id }] } : undefined,
          transformationDimensions: matchingTrans ? { set: [{ code: matchingTrans.code }] } : undefined,
          strategicDomains: matchingDomain ? { set: [{ id: matchingDomain.id }] } : undefined,
          challenges: matchingChallenge ? { set: [{ id: matchingChallenge.id }] } : undefined,
          ecosystems: matchingEco ? { set: [{ id: matchingEco.id }] } : undefined,
          stages: {
            create: t.stages.map(st => {
              const connectServices = st.serviceCodes
                .map(code => serviceMap[code])
                .filter(id => id !== undefined)
                .map(id => ({ id }));

              return {
                name: st.name,
                position: st.position,
                services: connectServices.length > 0 ? { connect: connectServices } : undefined
              };
            })
          }
        }
      });
    } else {
      // Create journey
      dbJourney = await prisma.journey.create({
        data: {
          name: t.name,
          provider: t.provider,
          objective: t.objective,
          description: t.description,
          targetAudience: t.targetAudience,
          uri: `https://pit.wallonie.be/id/journey/${t.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
          filieresS3: matchingFiliere ? { connect: [{ id: matchingFiliere.id }] } : undefined,
          stagesTransverses: matchingVcStage ? { connect: [{ id: matchingVcStage.id }] } : undefined,
          transformationDimensions: matchingTrans ? { connect: [{ code: matchingTrans.code }] } : undefined,
          strategicDomains: matchingDomain ? { connect: [{ id: matchingDomain.id }] } : undefined,
          challenges: matchingChallenge ? { connect: [{ id: matchingChallenge.id }] } : undefined,
          ecosystems: matchingEco ? { connect: [{ id: matchingEco.id }] } : undefined,
          stages: {
            create: t.stages.map(st => {
              const connectServices = st.serviceCodes
                .map(code => serviceMap[code])
                .filter(id => id !== undefined)
                .map(id => ({ id }));

              return {
                name: st.name,
                position: st.position,
                services: connectServices.length > 0 ? { connect: connectServices } : undefined
              };
            })
          }
        }
      });
    }
  }

  console.log('✔ Seeded reference Journeys successfully.');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

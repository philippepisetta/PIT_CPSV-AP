const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Testing Segmented Meta Query...");
  try {
    const start = Date.now();

    // Segmented loading of the 42 tables (max 6 parallel queries at once to prevent connection pool exhaustion)
    const [organizations, channels, targetAudiences, businessEvents, lifeEvents, catalogues] = await Promise.all([
      prisma.organization.findMany({ orderBy: { name: 'asc' } }),
      prisma.channel.findMany({ orderBy: { name: 'asc' } }),
      prisma.targetAudience.findMany({ orderBy: { name: 'asc' } }),
      prisma.businessEvent.findMany({ orderBy: { name: 'asc' } }),
      prisma.lifeEvent.findMany({ orderBy: { name: 'asc' } }),
      prisma.catalogue.findMany({ orderBy: { name: 'asc' } })
    ]);

    const [strategicValueChains, stages, roles, needs, services, challenges] = await Promise.all([
      prisma.strategicValueChain.findMany({ orderBy: { name: 'asc' } }),
      prisma.valueChainStage.findMany({ orderBy: { name: 'asc' } }),
      prisma.ecosystemRole.findMany({ orderBy: { name: 'asc' } }),
      prisma.businessNeed.findMany({ orderBy: { name: 'asc' } }),
      prisma.publicService.findMany({
        include: { interventionLevel: true, challenges: true, filieresS3: true, stages: true, initiatives: true },
        orderBy: { name: 'asc' }
      }),
      prisma.businessChallenge.findMany({ orderBy: { name: 'asc' } })
    ]);

    const [functions, sectors, ecosystems, interventionLevels, collectiveDeliveries, secondLineMissions] = await Promise.all([
      prisma.enterpriseFunction.findMany({ orderBy: { name: 'asc' } }),
      prisma.naceSector.findMany({ orderBy: { code: 'asc' } }),
      prisma.ecosystem.findMany({
        include: { actors: true, services: true, journeys: true, filieresS3: true, territories: true },
        orderBy: { name: 'asc' }
      }),
      prisma.interventionLevel.findMany({ orderBy: { id: 'asc' } }),
      prisma.collectiveDelivery.findMany({
        include: { service: true, operator: true, companies: true },
        orderBy: { date: 'desc' }
      }),
      prisma.secondLineMission.findMany({
        include: { service: true, leadOperator: true, operatorsMobilized: true, ecosystems: true, valueChains: true },
        orderBy: { startDate: 'desc' }
      })
    ]);

    const [interventionTypes, ecosystemTypes, territories, eventResources, datasets, knowledgeAssets] = await Promise.all([
      prisma.interventionType.findMany({ orderBy: { name: 'asc' } }),
      prisma.ecosystemType.findMany({ orderBy: { code: 'asc' } }),
      prisma.territory.findMany({
        include: { parentTerritory: true },
        orderBy: { name: 'asc' }
      }),
      prisma.eventResource.findMany({
        include: { ecosystems: true, publicServices: true },
        orderBy: { startDate: 'desc' }
      }),
      prisma.dataset.findMany({
        include: { ownerOrganization: true },
        orderBy: { title: 'asc' }
      }),
      prisma.knowledgeAsset.findMany({
        include: { publicServices: true, ecosystems: true, eventResources: true, programs: true, initiatives: true },
        orderBy: { title: 'asc' }
      })
    ]);

    const [actionInstances, journeyEnrollments, strategies, strategicPriorities, programs, measures] = await Promise.all([
      prisma.actionInstance.findMany({
        include: { beneficiary: true, journey: true, ecosystem: true, deliveries: true },
        orderBy: { startDate: 'desc' }
      }),
      prisma.journeyEnrollment.findMany({
        include: { beneficiary: true, journey: true, currentStage: true },
        orderBy: { startDate: 'desc' }
      }),
      prisma.strategy.findMany({
        include: { priorities: true, ownerOrganization: true },
        orderBy: { name: 'asc' }
      }),
      prisma.strategicPriority.findMany({
        include: { strategy: true, programs: true },
        orderBy: { name: 'asc' }
      }),
      prisma.program.findMany({
        include: { strategies: true, ownerOrganization: true, measures: true },
        orderBy: { name: 'asc' }
      }),
      prisma.measure.findMany({
        include: { programs: true, initiatives: true },
        orderBy: { name: 'asc' }
      })
    ]);

    const [initiatives, beneficiaryEngagements, outcomeIndicators, impacts, fundingInstruments, projects] = await Promise.all([
      prisma.initiative.findMany({
        include: { measure: true, leadOrganization: true, publicServices: true },
        orderBy: { name: 'asc' }
      }),
      prisma.beneficiaryEngagement.findMany({
        include: { beneficiary: true, initiative: true, ecosystem: true, territory: true },
        orderBy: { startDate: 'desc' }
      }),
      prisma.outcomeIndicator.findMany({ orderBy: { name: 'asc' } }),
      prisma.impact.findMany({
        include: { beneficiary: true, indicator: true, territory: true, valueChain: true },
        orderBy: { date: 'desc' }
      }),
      prisma.fundingInstrument.findMany({ orderBy: { name: 'asc' } }),
      prisma.project.findMany({ include: { program: true, initiative: true }, orderBy: { name: 'asc' } })
    ]);

    const [objectives, transformationDimensions, strategicDomainDimensions, capabilityDimensions, impactDimensions, knowledgeDimensions, dataQualityDimensions] = await Promise.all([
      prisma.objective.findMany({ include: { strategy: true, parent: true }, orderBy: { name: 'asc' } }),
      prisma.transformationDimension.findMany({ orderBy: { code: 'asc' } }),
      prisma.strategicDomainDimension.findMany({ include: { parent: true }, orderBy: { name: 'asc' } }),
      prisma.capabilityDimension.findMany({ orderBy: { code: 'asc' } }),
      prisma.impactDimension.findMany({ orderBy: { code: 'asc' } }),
      prisma.knowledgeDimension.findMany({ orderBy: { code: 'asc' } }),
      prisma.dataQualityDimension.findMany()
    ]);

    console.log(`Success! Fetched all 42 tables. Time taken: ${Date.now() - start}ms`);
  } catch (err) {
    console.error("Segmented meta query failed:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();

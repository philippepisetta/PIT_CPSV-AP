const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  try {
    const counts = {
      Program: await prisma.program.count().catch(() => -1),
      Project: await prisma.project.count().catch(() => -1),
      Action: await prisma.action.count().catch(() => -1),
      Activity: await prisma.activity.count().catch(() => -1),
      Challenge: await prisma.challenge.count().catch(() => -1),
      Capability: await prisma.capability.count().catch(() => -1),
      Service: await prisma.publicService.count().catch(() => -1),
      Journey: await prisma.journey.count().catch(() => -1),
      Beneficiary: await prisma.beneficiary.count().catch(() => -1),
      Organization: await prisma.organization.count().catch(() => -1),
      Territory: await prisma.territory.count().catch(() => -1),
      Ecosystem: await prisma.ecosystem.count().catch(() => -1),
      S3Domain: await prisma.s3Domain.count().catch(() => -1),
      ValueChain: await prisma.valueChain.count().catch(() => -1),
      ValueChainStage: await prisma.valueChainStage.count().catch(() => -1),
    };
    console.log("DB_COUNTS_RESULT:", JSON.stringify(counts, null, 2));
  } catch (error) {
    console.error("Error querying database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  try {
    const counts = {
      Program: await prisma.program.count(),
      Capability: await prisma.capability.count(),
      S3Domain: await prisma.s3Domain.count(),
      Ecosystem: await prisma.ecosystem.count(),
      Beneficiary: await prisma.beneficiary.count(),
      Journey: await prisma.journey.count(),
      PublicService: await prisma.publicService.count(),
      Organization: await prisma.organization.count(),
      Territory: await prisma.territory.count()
    };
    console.log("DB_COUNTS_RESULT:", JSON.stringify(counts, null, 2));
  } catch (error) {
    console.error("Error querying database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

// cpsv-ap-app/scratch/count_entities.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const entities = [
    { name: "Program", countFn: () => prisma.program.count() },
    { name: "Project", countFn: () => prisma.project.count() },
    { name: "Action", countFn: () => prisma.action.count() },
    { name: "Activity", countFn: () => prisma.activity.count() },
    { name: "BusinessChallenge", countFn: () => prisma.businessChallenge.count() },
    { name: "Capability", countFn: () => prisma.capability.count() },
    { name: "PublicService", countFn: () => prisma.publicService.count() },
    { name: "Journey", countFn: () => prisma.journey.count() },
    { name: "Beneficiary", countFn: () => prisma.beneficiary.count() },
    { name: "Organization", countFn: () => prisma.organization.count() },
    { name: "Territory", countFn: () => prisma.territory.count() },
    { name: "Ecosystem", countFn: () => prisma.ecosystem.count() },
    { name: "S3Domain", countFn: () => prisma.s3Domain.count() },
    { name: "ValueChain", countFn: () => prisma.valueChain.count() },
    { name: "ValueChainStage", countFn: () => prisma.valueChainStage.count() }
  ];

  console.log("=== DB RECORD INVENTORY ===");
  for (const ent of entities) {
    try {
      const count = await ent.countFn();
      console.log(`${ent.name}: ${count}`);
    } catch (err) {
      console.log(`${ent.name}: ERROR - ${err.message}`);
    }
  }
  await prisma.$disconnect();
}

main();

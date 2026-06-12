const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Testing Journey Query...");
  try {
    const data = await prisma.journey.findMany({
      include: {
        challenges: true,
        filieresS3: true,
        stagesTransverses: true,
        ecosystems: true,
        transformationDimensions: true,
        strategicDomains: true,
        actionInstances: true,
        stages: {
          orderBy: { position: "asc" },
          include: {
            services: {
              include: {
                organization: true,
                capabilities: true,
                knowledgeAssets: true
              }
            }
          }
        }
      },
      orderBy: { name: "asc" }
    });
    console.log("Success! Fetched journeys:", data.length);
  } catch (err) {
    console.error("Prisma query failed:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const journeys = await prisma.journey.findMany({
    include: {
      stages: {
        include: {
          services: true
        }
      }
    }
  });
  console.log("Journeys in database:", JSON.stringify(journeys, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

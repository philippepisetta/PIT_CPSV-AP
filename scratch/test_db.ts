import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    const activityCount = await prisma.activity.count();
    const communityCount = await prisma.community.count();
    const publicServices = await prisma.publicService.count();
    console.log("Database connection successful!");
    console.log("Activity count:", activityCount);
    console.log("Community count:", communityCount);
    console.log("PublicService count:", publicServices);
  } catch (error) {
    console.error("Error connecting to database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

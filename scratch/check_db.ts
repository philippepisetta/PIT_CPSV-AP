import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const countServices = await prisma.publicService.count();
  console.log(`Total PublicServices in DB: ${countServices}`);

  const countEdihServices = await prisma.publicService.count({
    where: {
      code: {
        startsWith: 'EDIH-'
      }
    }
  });
  console.log(`Total EDIH PublicServices: ${countEdihServices}`);

  const countCosts = await prisma.cost.count();
  console.log(`Total Cost records: ${countCosts}`);

  const sampleEdihServices = await prisma.publicService.findMany({
    where: {
      code: {
        startsWith: 'EDIH-'
      }
    },
    take: 5,
    include: {
      costs: true,
      ecosystems: true,
      channels: true,
      targetAudiences: true
    }
  });

  console.log('--- SAMPLE OF 5 EDIH SERVICES ---');
  for (const s of sampleEdihServices) {
    console.log(`- Service: ${s.name} (${s.code})`);
    console.log(`  URI: ${s.uri}`);
    console.log(`  Ecosystems: ${s.ecosystems.map(e => e.name).join(', ')}`);
    console.log(`  Channels: ${s.channels.map(c => c.code).join(', ')}`);
    console.log(`  Target Audiences: ${s.targetAudiences.map(ta => ta.code).join(', ')}`);
    console.log(`  Costs:`);
    for (const c of s.costs) {
      console.log(`    * ${c.name}: ${c.value} ${c.currency} (${c.description})`);
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

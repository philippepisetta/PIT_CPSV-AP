// scratch_db_stats.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("=== DB Connection & Query Stats ===");
  const startTotal = Date.now();
  
  const tables = [
    'organization', 'channel', 'targetAudience', 'businessEvent', 'lifeEvent',
    'catalogue', 'strategicValueChain', 'valueChainStage', 'ecosystemRole',
    'businessNeed', 'publicService', 'businessChallenge', 'enterpriseFunction',
    'naceSector', 'ecosystem', 'interventionLevel', 'collectiveDelivery',
    'secondLineMission', 'interventionType', 'ecosystemType', 'territory',
    'eventResource', 'dataset', 'knowledgeAsset', 'actionInstance',
    'journeyEnrollment', 'strategy', 'strategicPriority', 'program',
    'measure', 'initiative', 'beneficiaryEngagement', 'outcomeIndicator',
    'impact', 'fundingInstrument', 'beneficiary'
  ];
  
  for (const table of tables) {
    const start = Date.now();
    try {
      if (!prisma[table]) {
        console.log(`Table ${table} not found in Prisma client`);
        continue;
      }
      const count = await prisma[table].count();
      const duration = Date.now() - start;
      console.log(`Table: ${table.padEnd(25)} | Count: ${String(count).padStart(6)} | Time: ${duration}ms`);
    } catch (err) {
      console.error(`Error querying table ${table}:`, err.message);
    }
  }
  
  console.log(`Total duration: ${Date.now() - startTotal}ms`);
  await prisma.$disconnect();
}

main();

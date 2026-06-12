const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function run() {
  try {
    const migrationDir = 'prisma/migrations/20260612180807_sprint_4_1_core_prisma';
    const sqlPath = path.resolve(migrationDir, 'migration.sql');
    console.log('Reading migration SQL from:', sqlPath);
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Split SQL into individual statements since PostgreSQL execution might complain on certain multi-statement boundaries
    // We can also execute it as a single block. Let's execute the raw SQL block directly.
    console.log('Applying SQL migration statements to Supabase...');
    
    // We split by semicolon to execute statement by statement to avoid transaction boundary errors in poolers
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`Executing statement ${i + 1}/${statements.length}...`);
      try {
        await prisma.$executeRawUnsafe(statement);
      } catch (err) {
        // If it's a minor warning or duplicate index warning, we can log and continue
        console.error(`Error on statement ${i + 1}:`, err.message);
        if (!err.message.includes('already exists') && !err.message.includes('already a relation')) {
          throw err;
        }
      }
    }

    console.log('Migration applied successfully.');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await prisma.$disconnect();
  }
}

run();

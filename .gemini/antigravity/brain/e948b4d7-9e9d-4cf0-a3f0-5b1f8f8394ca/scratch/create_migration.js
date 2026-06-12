const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const projectRoot = 'c:/Users/Philippe Pisetta/Downloads/testing CPSV-AP';

// 1. Run migrate diff to get the forward SQL script
console.log('Generating forward SQL script...');
const diffCmd = 'npx prisma migrate diff --from-schema-datasource prisma/schema.prisma --to-schema-datamodel prisma/schema.prisma --script';
const forwardSql = execSync(diffCmd, { cwd: projectRoot, encoding: 'utf8' });

// 2. Generate reverse SQL script (rollback script) by flipping from and to
console.log('Generating rollback SQL script...');
const rollbackCmd = 'npx prisma migrate diff --from-schema-datamodel prisma/schema.prisma --to-schema-datasource prisma/schema.prisma --script';
const rollbackSql = execSync(rollbackCmd, { cwd: projectRoot, encoding: 'utf8' });

// 3. Create timestamped migration directory
const now = new Date();
const pad = (n) => String(n).padStart(2, '0');
const timestamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
const migrationName = `${timestamp}_sprint_4_1_core_prisma`;
const migrationDir = path.join(projectRoot, 'prisma/migrations', migrationName);

console.log('Creating migration directory:', migrationDir);
fs.mkdirSync(migrationDir, { recursive: true });

// Add header comments
const forwardWithComments = `-- Migration: Sprint 4.1 Core Prisma Implementation
-- Created at: ${now.toISOString()}
-- Description: Adds S3Domain, ValueChain, Challenge, ChallengeCategory, Capability, Action, Activity tables without dropping deprecated models.

${forwardSql}`;

const rollbackWithComments = `-- Rollback: Sprint 4.1 Core Prisma Implementation
-- Created at: ${now.toISOString()}
-- Description: Drops S3Domain, ValueChain, Challenge, ChallengeCategory, Capability, Action, Activity tables.

${rollbackSql}`;

// Write files
fs.writeFileSync(path.join(migrationDir, 'migration.sql'), forwardWithComments, 'utf8');
fs.writeFileSync(path.join(migrationDir, 'rollback.sql'), rollbackWithComments, 'utf8');

console.log('Migration generated successfully.');
console.log('Forward SQL written to:', path.join(migrationDir, 'migration.sql'));
console.log('Rollback SQL written to:', path.join(migrationDir, 'rollback.sql'));

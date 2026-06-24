const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
let content = fs.readFileSync(schemaPath, 'utf-8');

// Find and replace inside ReferenceFramework to add dataSpaces relation
const target = `  potentialDis                PotentialDIS[]
  s3Clusters                  S3Cluster[]
  marketApps                  S3MarketApplication[]`;

const replacement = `  potentialDis                PotentialDIS[]
  s3Clusters                  S3Cluster[]
  marketApps                  S3MarketApplication[]
  dataSpaces                  DataSpace[]`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync(schemaPath, content, 'utf-8');
  console.log('Successfully fixed ReferenceFramework opposite relation!');
} else {
  console.error('Target relation block not found in ReferenceFramework!');
}

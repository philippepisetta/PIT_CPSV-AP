const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../prisma/schema.prisma');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

lines.forEach((line, idx) => {
  if (line.includes('providerOrganization') || line.includes('model ServiceDelivery')) {
    console.log(`${idx + 1}: ${line}`);
  }
});

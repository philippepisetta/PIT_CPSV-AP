const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../cpsv-ap-app/src/app/api/[...path]/route.ts');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

lines.forEach((line, idx) => {
  if (line.includes('service-deliveries') || line.includes('providerOrganization')) {
    console.log(`L${idx + 1}: ${line}`);
  }
});

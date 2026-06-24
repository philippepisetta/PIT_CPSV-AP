const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../cpsv-ap-app/src/components/services/ServicesContainer.tsx');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

lines.forEach((line, idx) => {
  if (line.includes('avgSatisfaction')) {
    console.log(`${idx + 1}: ${line}`);
  }
});

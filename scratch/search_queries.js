const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../cpsv-ap-app/src/hooks/useV2Queries.ts');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

const functionsToFind = ['useV2Beneficiaries', 'useV2Services', 'useV2Organizations'];

lines.forEach((line, idx) => {
  functionsToFind.forEach(fn => {
    if (line.includes(`export function ${fn}`)) {
      console.log(`L${idx + 1}: ${line}`);
      for (let i = 1; i <= 10; i++) {
        console.log(`  L${idx + 1 + i}: ${lines[idx + i]}`);
      }
    }
  });
});

const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../src/server.ts');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

lines.forEach((line, idx) => {
  if (line.includes("'/api/beneficiaries'") || line.includes("'/api/companies'")) {
    console.log(`L${idx + 1}: ${line}`);
    for (let i = 1; i <= 20; i++) {
      console.log(`  L${idx + 1 + i}: ${lines[idx + i]}`);
    }
  }
});

const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../cpsv-ap-app/src/app/api/[...path]/route.ts');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

lines.forEach((line, idx) => {
  if (line.includes('"v2"') || line.includes("'v2'")) {
    console.log(`L${idx + 1}: ${line}`);
  }
});

const fs = require('fs');
const content = fs.readFileSync('cpsv-ap-app/src/app/api/[...path]/route.ts', 'utf8');
const lines = content.split('\n');
let count = 0;
lines.forEach((line, idx) => {
  if (line.toLowerCase().includes('v2')) {
    count++;
    if (count <= 20) {
      console.log(`${idx + 1}: ${line}`);
    }
  }
});
console.log(`Total occurrences: ${count}`);

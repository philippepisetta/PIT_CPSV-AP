const fs = require('fs');
const content = fs.readFileSync('cpsv-ap-app/src/app/api/[...path]/route.ts', 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('segment1 ===') || line.includes('segment1 ====')) {
    console.log(`${idx + 1}: ${line.trim()}`);
  }
});

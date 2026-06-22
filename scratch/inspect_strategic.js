const fs = require('fs');
const content = fs.readFileSync('cpsv-ap-app/src/app/pilotage/page.tsx', 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('svg') || line.includes('Chart') || line.includes('chart') || line.includes('Recharts') || line.includes('d3') || line.includes('<svg') || line.includes('Bar') || line.includes('bar')) {
    console.log(`${idx + 1}: ${line.trim()}`);
  }
});

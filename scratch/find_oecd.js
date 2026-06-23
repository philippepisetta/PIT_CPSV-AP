const fs = require('fs');
const path = require('path');

const file = path.resolve(__dirname, '../cpsv-ap-app/src/app/resilience/page.tsx');
const content = fs.readFileSync(file, 'utf8');
const lines = content.split('\n');

const terms = ['Exposition', 'Sensibilité', 'Vulnérabilité', 'Absorption', 'Adaptation', 'Rebond'];
lines.forEach((line, index) => {
  terms.forEach(term => {
    if (line.includes(term)) {
      console.log(`${index + 1}: [${term}] ${line.trim()}`);
    }
  });
});

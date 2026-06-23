const fs = require('fs');
const path = require('path');

const file = path.resolve(__dirname, '../cpsv-ap-app/src/app/beneficiaries/page.tsx');
const content = fs.readFileSync(file, 'utf8');
const lines = content.split('\n');

lines.forEach((line, index) => {
  if (line.includes('<form') || line.includes('</form>')) {
    console.log(`${index + 1}: ${line.trim()}`);
  }
});
console.log('=== TAILLE SELECT ===');
for (let i = 355; i <= 375; i++) {
  console.log(`${i}: ${lines[i - 1].trim()}`);
}

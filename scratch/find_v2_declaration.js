const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'server.ts');
const content = fs.readFileSync(filePath, 'utf-8');
const lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('const v2Router') || lines[i].includes('let v2Router')) {
    console.log(`${i + 1}: ${lines[i]}`);
    break;
  }
}

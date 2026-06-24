const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../src/server.ts');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

let found = false;
lines.forEach((line, idx) => {
  if (line.includes('service-deliveries')) {
    found = true;
  }
  if (found && idx < 300) { // Just log some lines around the matches
    if (line.includes('/service-deliveries')) {
      console.log(`L${idx + 1}: ${line}`);
      for (let i = 1; i <= 20; i++) {
        console.log(`  L${idx + 1 + i}: ${lines[idx + i]}`);
      }
    }
  }
});

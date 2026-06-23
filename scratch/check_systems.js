const fs = require('fs');
const path = require('path');

const serverFile = path.resolve(__dirname, '../src/server.ts');
const content = fs.readFileSync(serverFile, 'utf8');

const lines = content.split('\n');
lines.forEach((line, index) => {
  if (line.includes('source-systems') || line.includes('SourceSystem')) {
    console.log(`${index + 1}: ${line}`);
    // Print 5 lines before and after
    for (let i = Math.max(0, index - 5); i < Math.min(lines.length, index + 10); i++) {
      console.log(`   ${i + 1}: ${lines[i]}`);
    }
    console.log('---');
  }
});

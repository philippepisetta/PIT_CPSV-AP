const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../src/server.ts');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

lines.forEach((line, idx) => {
  if (line.includes('app.use') || line.includes('v2') || line.includes('v2Router')) {
    console.log(`L${idx + 1}: ${line}`);
  }
});

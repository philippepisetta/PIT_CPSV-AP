const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../src/server.ts');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

lines.forEach((line, idx) => {
  if (line.toLowerCase().includes('service_deliveries') || line.toLowerCase().includes('servicedelivery') || line.toLowerCase().includes('deliveries')) {
    if (line.includes('app.get') || line.includes('app.post') || line.includes('res.json')) {
      console.log(`L${idx + 1}: ${line}`);
    }
  }
});

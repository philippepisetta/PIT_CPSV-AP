const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../cpsv-ap-app/prisma/schema.prisma');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

lines.forEach((line, idx) => {
  if (idx < 25) {
    console.log(`${idx + 1}: ${line}`);
  }
});

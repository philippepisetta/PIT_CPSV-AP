const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'cpsv-ap-app', 'src');

function searchDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      searchDir(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      if (content.includes('S3Container')) {
        console.log(`Found S3Container in: ${fullPath.replace(srcDir, '')}`);
      }
    }
  }
}

searchDir(srcDir);

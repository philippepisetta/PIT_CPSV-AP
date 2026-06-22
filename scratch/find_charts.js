const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      callback(dirPath);
    }
  });
}

console.log("=== Searching for chart or SVG components ===");
walkDir('cpsv-ap-app/src', (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('chart') || content.includes('Chart') || content.includes('<svg') || content.includes('Radar') || content.includes('radar')) {
      console.log(`Found match in: ${filePath}`);
    }
  }
});

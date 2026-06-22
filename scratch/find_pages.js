const fs = require('fs');
const path = require('path');

function getFiles(dir, files_ = []) {
  const files = fs.readdirSync(dir);
  for (let i in files) {
    const name = path.join(dir, files[i]);
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files_);
    } else {
      if (name.includes('page.tsx') || name.includes('route.ts') || name.includes('layout.tsx')) {
        files_.push(name);
      }
    }
  }
  return files_;
}

const allPages = getFiles('cpsv-ap-app/src/app');
console.log("=== Pages & Routes ===");
allPages.forEach(p => {
  if (p.includes('resilience') || p.includes('interoperability') || p.includes('strategic') || p.includes('analysis-views')) {
    console.log(p);
  }
});

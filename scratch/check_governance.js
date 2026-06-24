const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, '..', 'cpsv-ap-app', 'src', 'app', 'governance');
if (fs.existsSync(dirPath)) {
  console.log('Folder exists. Contents:', fs.readdirSync(dirPath));
  // check recursively for referentiels
  const refPath = path.join(dirPath, 'referentiels');
  if (fs.existsSync(refPath)) {
    console.log('Referentiels folder exists. Contents:', fs.readdirSync(refPath));
  } else {
    console.log('Referentiels folder does NOT exist.');
  }
} else {
  console.log('Governance folder does NOT exist.');
}

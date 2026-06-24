const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '..', 'cpsv-ap-app', 'next.config.js');
if (fs.existsSync(configPath)) {
  console.log(fs.readFileSync(configPath, 'utf-8'));
} else {
  console.log('next.config.js does not exist.');
}
const configMjsPath = path.join(__dirname, '..', 'cpsv-ap-app', 'next.config.mjs');
if (fs.existsSync(configMjsPath)) {
  console.log(fs.readFileSync(configMjsPath, 'utf-8'));
} else {
  console.log('next.config.mjs does not exist.');
}

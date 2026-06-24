const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'cpsv-ap-app', 'src', 'components', 's3', 'S3Container.tsx');
let content = fs.readFileSync(filePath, 'utf-8');

const target = "Les 20 clusters issus du KMeans Technopolis sont assignés comme proxys sémantiques au DIS correspondant (ex: Système intelligent -> Manufacturing).";
const replacement = "Les 20 clusters issus du KMeans Technopolis sont assignés comme proxys sémantiques au DIS correspondant (ex: Système intelligent &rarr; Manufacturing).";

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log('Successfully fixed S3Container.tsx unescaped arrow!');
} else {
  console.error('Target text not found in S3Container.tsx!');
}

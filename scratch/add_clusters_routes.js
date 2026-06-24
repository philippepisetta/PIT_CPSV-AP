const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'server.ts');
let content = fs.readFileSync(filePath, 'utf-8');

const targetLine = "v2Router.get('/reference-frameworks', async (req, res) => {";

const additionalRoutes = `v2Router.get('/s3-clusters', async (req, res) => {
  try {
    const data = await prisma.s3Cluster.findMany({
      include: {
        potentialDis: true,
        marketApps: true,
        indicatorBlocks: true,
        scoringCriteria: true,
        methodologyNotes: true,
        dataSources: true,
        naceCodes: true,
        nabsCodes: true
      }
    });
    res.json({ data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/s3-market-applications', async (req, res) => {
  try {
    const data = await prisma.s3MarketApplication.findMany({
      include: {
        cluster: true,
        potentialDis: true,
        indicatorBlocks: true,
        scoringCriteria: true,
        methodologyNotes: true,
        dataSources: true,
        naceCodes: true,
        nabsCodes: true
      }
    });
    res.json({ data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

`;

if (content.includes(targetLine)) {
  content = content.replace(targetLine, additionalRoutes + "\n" + targetLine);
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log('Successfully appended s3-clusters and s3-market-applications routes!');
} else {
  console.error('Target line not found in src/server.ts');
}

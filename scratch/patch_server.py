import re

with open("src/server.ts", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add fs import at the top
content = "import fs from 'fs';\n" + content

# 2. Update permission middleware to authorize STEWARD
# Find role === 'ANIMATEUR' block and add STEWARD check.
role_pattern = r"(if\s*\(\s*role\s*===\s*'ANIMATEUR'\s*\)\s*\{\s*return\s*next\(\);\s*\})"
match_role = re.search(role_pattern, content)
if match_role:
    steward_check = "\n    if (role === 'STEWARD') {\n      return next();\n    }"
    content = content[:match_role.end()] + steward_check + content[match_role.end():]
    print("Middleware permission patched with STEWARD role.")
else:
    print("Could not find the role check block in middleware.")

# 3. Update the /communities route at line 5534
communities_pattern = r"v2Router\.get\('/communities',\s*async\s*\(req,\s*res\)\s*=>\s*\{\s*try\s*\{\s*const\s*items\s*=\s*await\s*prisma\.community\.findMany\(\{\s*include:\s*\{\s*_count:\s*\{\s*select:\s*\{\s*members:\s*true,\s*projects:\s*true,\s*events:\s*true,\s*opportunities:\s*true\s*\}\s*\}\s*\}\,\s*orderBy:\s*\{\s*name:\s*'asc'\s*\}\s*\}\);\s*res\.json\(\{\s*data:\s*items\s*\}\);\s*\}\s*catch\s*\(err:\s*any\)\s*\{\s*res\.status\(500\)\.json\(\{\s*error:\s*err\.message\s*\}\);\s*\}\s*\}\);"

new_communities_route = """v2Router.get('/communities', async (req, res) => {
  try {
    const list = await prisma.community.findMany({
      include: {
        members: { include: { member: true } },
        projects: { include: { project: true } },
        events: { include: { eventResource: true } },
        opportunities: { include: { opportunity: true } }
      },
      orderBy: { name: 'asc' }
    });
    // Parse themes from description if they exist
    const items = list.map((c: any) => {
      let themes: any[] = [];
      if (c.description && c.description.includes('"__meta__":')) {
        try {
          const parsed = JSON.parse(c.description);
          if (parsed.customProperties && parsed.customProperties.themes) {
            themes = parsed.customProperties.themes;
          }
        } catch (e) {}
      }
      return { ...c, themes };
    });
    res.json({ data: items });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});"""

content, count_comm = re.subn(communities_pattern, new_communities_route, content)
print(f"Patched first /communities route: {count_comm} matches.")

# 4. Remove duplicate /communities route at line 6032
duplicate_pattern = r"v2Router\.get\('/communities',\s*async\s*\(req,\s*res\)\s*=>\s*\{\s*try\s*\{\s*const\s*list\s*=\s*await\s*prisma\.community\.findMany\(\{\s*include:\s*\{\s*members:\s*\{\s*include:\s*\{\s*member:\s*true\s*\}\s*\}\s*\}\,\s*orderBy:\s*\{\s*name:\s*'asc'\s*\}\s*\}\);\s*//\s*Parse\s*themes\s*from\s*description\s*if\s*they\s*exist\s*const\s*items\s*=\s*list\.map\(\(c:\s*any\)\s*=>\s*\{\s*let\s*themes:\s*any\[\]\s*=\s*\[\];\s*if\s*\(c\.description\s*&&\s*c\.description\.includes\('\"__meta__\":'\)\)\s*\{\s*try\s*\{\s*const\s*parsed\s*=\s*JSON\.parse\(c\.description\);\s*if\s*\(parsed\.customProperties\s*&&\s*parsed\.customProperties\.themes\)\s*\{\s*themes\s*=\s*parsed\.customProperties\.themes;\s*\}\s*\}\s*catch\s*\(e\)\s*\{\}\s*\}\s*return\s*\{\s*\.\.\.c,\s*themes\s*\};\s*\}\);\s*res\.json\(\{\s*data:\s*items\s*\}\);\s*\}\s*catch\s*\(err:\s*any\)\s*\{\s*res\.status\(500\)\.json\(\{\s*error:\s*err\.message\s*\}\);\s*\}\s*\}\);"
content, count_dup = re.subn(duplicate_pattern, "", content)
print(f"Removed duplicate /communities route: {count_dup} matches.")

# 5. Insert new endpoints at the bottom, just before v2Router.get('/openapi.json'
new_endpoints = """
// ==========================================
// --- 17. SYSTEM OF RECORD & DATA PRODUCTS APIs (Data Steward) ---
// ==========================================

const getSourceSystemsFilePath = () => path.join(process.cwd(), 'cpsv-ap-app/src/data/source_systems.json');
const getDataProductsFilePath = () => path.join(process.cwd(), 'cpsv-ap-app/src/data/data_products.json');

// Source Systems GET
v2Router.get('/interoperability/source-systems', (req, res) => {
  try {
    const filePath = getSourceSystemsFilePath();
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      res.json({ data: JSON.parse(data) });
    } else {
      res.json({ data: [] });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Source Systems POST
v2Router.post('/interoperability/source-systems', (req, res) => {
  try {
    const filePath = getSourceSystemsFilePath();
    let currentData: any[] = [];
    if (fs.existsSync(filePath)) {
      currentData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
    const newSystem = req.body;
    if (!newSystem.id) {
      return res.status(400).json({ error: "L'identifiant du système source est obligatoire." });
    }
    const idx = currentData.findIndex(s => s.id === newSystem.id);
    if (idx !== -1) {
      currentData[idx] = { ...currentData[idx], ...newSystem };
    } else {
      currentData.push(newSystem);
    }
    fs.writeFileSync(filePath, JSON.stringify(currentData, null, 2), 'utf8');
    res.status(201).json({ data: newSystem });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Data Products GET
v2Router.get('/interoperability/data-products', (req, res) => {
  try {
    const filePath = getDataProductsFilePath();
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      res.json({ data: JSON.parse(data) });
    } else {
      res.json({ data: [] });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Data Products POST
v2Router.post('/interoperability/data-products', (req, res) => {
  try {
    const filePath = getDataProductsFilePath();
    let currentData: any[] = [];
    if (fs.existsSync(filePath)) {
      currentData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
    const newProduct = req.body;
    if (!newProduct.id) {
      return res.status(400).json({ error: "L'identifiant du produit de données est obligatoire." });
    }
    const idx = currentData.findIndex(p => p.id === newProduct.id);
    if (idx !== -1) {
      currentData[idx] = { ...currentData[idx], ...newProduct };
    } else {
      currentData.push(newProduct);
    }
    fs.writeFileSync(filePath, JSON.stringify(currentData, null, 2), 'utf8');
    res.status(201).json({ data: newProduct });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// --- 18. BENEFICIARY 360 SUB-RESOURCE ENDPOINTS ---
// ==========================================

// GET activities for a beneficiary (both individual and collective participations)
v2Router.get('/beneficiaries/:id/activities', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const items = await prisma.activity.findMany({
      where: {
        OR: [
          { beneficiaryId: id },
          { companies: { some: { id } } }
        ]
      },
      include: { service: true, operator: true }
    });
    res.json({ data: items });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET funding instruments (financements) for a beneficiary
v2Router.get('/beneficiaries/:id/financements', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const items = await prisma.fundingInstrument.findMany({
      where: {
        beneficiaries: { some: { id } }
      }
    });
    res.json({ data: items });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// POST to associate a funding instrument (financement) with a beneficiary
v2Router.post('/beneficiaries/:id/financements', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { fundingInstrumentId } = req.body;
    if (!fundingInstrumentId) {
      return res.status(400).json({ error: "L'identifiant du financement est obligatoire." });
    }
    const item = await prisma.beneficiary.update({
      where: { id },
      data: {
        fundingInstruments: {
          connect: { id: parseInt(fundingInstrumentId) }
        }
      },
      include: { fundingInstruments: true }
    });
    res.json({ data: item.fundingInstruments });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET outcomes (impacts) for a beneficiary
v2Router.get('/beneficiaries/:id/outcomes', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const items = await prisma.impact.findMany({
      where: { beneficiaryId: id },
      include: { indicator: true }
    });
    res.json({ data: items });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

"""

openapi_pattern = r"v2Router\.get\('/openapi\.json'"
match_openapi = re.search(openapi_pattern, content)
if match_openapi:
    content = content[:match_openapi.start()] + new_endpoints + content[match_openapi.start():]
    print("New endpoints successfully inserted before openapi.json.")
else:
    print("Could not find openapi.json route block.")

with open("src/server.ts", "w", encoding="utf-8") as f:
    f.write(content)
print("server.ts patching completed!")

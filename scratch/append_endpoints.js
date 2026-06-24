const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'server.ts');
let content = fs.readFileSync(filePath, 'utf-8');

const targetLine = "v2Router.get('/openapi.json', (req, res) => {";

const endpointsCode = `// =========================================================================
// PHASE 6: STABLE REFERENCE FRAMEWORKS, S3/DIS & DATA SPACES GET ENDPOINTS
// =========================================================================

v2Router.get('/reference-frameworks', async (req, res) => {
  try {
    const data = await prisma.referenceFramework.findMany({
      include: {
        sources: true,
        taxonomies: {
          include: {
            versions: true
          }
        }
      }
    });
    res.json({ data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/reference-frameworks/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = await prisma.referenceFramework.findUnique({
      where: { id },
      include: {
        sources: true,
        taxonomies: {
          include: {
            versions: true
          }
        }
      }
    });
    if (!data) return res.status(404).json({ error: 'Framework non trouvé' });
    res.json({ data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/reference-sources', async (req, res) => {
  try {
    const data = await prisma.referenceSource.findMany();
    res.json({ data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/reference-sources/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = await prisma.referenceSource.findUnique({ where: { id } });
    if (!data) return res.status(404).json({ error: 'Source non trouvée' });
    res.json({ data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/reference-taxonomies', async (req, res) => {
  try {
    const data = await prisma.referenceTaxonomy.findMany({
      include: {
        framework: true,
        versions: true,
        concepts: true
      }
    });
    res.json({ data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/reference-taxonomies/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = await prisma.referenceTaxonomy.findUnique({
      where: { id },
      include: {
        framework: true,
        versions: true,
        concepts: true
      }
    });
    if (!data) return res.status(404).json({ error: 'Taxonomie non trouvée' });
    res.json({ data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/reference-concepts', async (req, res) => {
  try {
    const data = await prisma.referenceConcept.findMany({
      include: {
        taxonomy: true,
        parentConcept: true
      }
    });
    res.json({ data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/reference-concepts/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = await prisma.referenceConcept.findUnique({
      where: { id },
      include: {
        taxonomy: true,
        parentConcept: true,
        childConcepts: true
      }
    });
    if (!data) return res.status(404).json({ error: 'Concept non trouvé' });
    res.json({ data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/reference-mappings', async (req, res) => {
  try {
    const data = await prisma.referenceConceptMapping.findMany({
      include: {
        sourceConcept: true,
        targetConcept: true
      }
    });
    res.json({ data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/s3-reference-taxonomies', async (req, res) => {
  try {
    const data = await prisma.referenceTaxonomy.findMany({
      where: {
        framework: {
          applicableTo: 'S3'
        }
      },
      include: {
        framework: true,
        concepts: true
      }
    });
    res.json({ data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/s3-priorities', async (req, res) => {
  try {
    const data = await prisma.referenceConcept.findMany({
      where: {
        taxonomy: {
          framework: {
            applicableTo: 'S3'
          }
        }
      },
      include: {
        taxonomy: true
      }
    });
    res.json({ data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/dis', async (req, res) => {
  try {
    const data = await prisma.potentialDIS.findMany({
      include: {
        framework: true,
        sourceDocument: true,
        clusters: {
          include: {
            indicatorBlocks: true,
            scoringCriteria: true
          }
        }
      }
    });
    res.json({ data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/s3-methodology', async (req, res) => {
  try {
    const data = await prisma.clusterMethodologyNote.findMany({
      include: {
        s3Cluster: true,
        marketApp: true
      }
    });
    res.json({ data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/s3-indicators', async (req, res) => {
  try {
    const data = await prisma.s3IndicatorBlock.findMany({
      include: {
        s3Cluster: true,
        marketApp: true
      }
    });
    res.json({ data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/nace-codes', async (req, res) => {
  try {
    const data = await prisma.naceCode.findMany();
    res.json({ data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/nabs-codes', async (req, res) => {
  try {
    const data = await prisma.nabsCode.findMany();
    res.json({ data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/data-space-reference-frameworks', async (req, res) => {
  try {
    const data = await prisma.referenceFramework.findMany({
      where: {
        applicableTo: 'DATA_SPACE'
      },
      include: {
        sources: true
      }
    });
    res.json({ data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/common-european-data-space-domains', async (req, res) => {
  try {
    const data = await prisma.commonEuropeanDataSpaceDomain.findMany({
      include: {
        dataSpaces: true
      }
    });
    res.json({ data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/data-space-building-blocks', async (req, res) => {
  try {
    const data = await prisma.referenceConcept.findMany({
      where: {
        taxonomy: {
          framework: {
            code: 'DSSC_BLUEPRINT'
          }
        }
      },
      include: {
        taxonomy: true
      }
    });
    res.json({ data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/interoperability-standards', async (req, res) => {
  try {
    const data = await prisma.interoperabilityStandard.findMany({
      include: {
        framework: true,
        semanticProfiles: true,
        vocabularies: true
      }
    });
    res.json({ data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/semantic-profiles', async (req, res) => {
  try {
    const data = await prisma.semanticProfile.findMany({
      include: {
        standard: true
      }
    });
    res.json({ data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/source-documents', async (req, res) => {
  try {
    const data = await prisma.sourceDocument.findMany({
      include: {
        extracts: true,
        referenceMappings: true
      }
    });
    res.json({ data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/source-document-mappings', async (req, res) => {
  try {
    const data = await prisma.sourceDocumentReferenceMapping.findMany({
      include: {
        sourceDocument: true
      }
    });
    res.json({ data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

`;

if (content.includes(targetLine)) {
  content = content.replace(targetLine, endpointsCode + "\n" + targetLine);
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log('Successfully appended all Phase 6 GET endpoints to src/server.ts!');
} else {
  console.error('Target OpenAPI line not found in src/server.ts!');
}

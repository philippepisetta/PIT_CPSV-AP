import express from 'express';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import compression from 'compression';

const app = express();
const port = process.env.PORT || 3001;
const prisma = new PrismaClient();

app.use(compression());

// Middleware pour parser le JSON et encoder les requêtes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques du frontend
app.use(express.static(path.join(__dirname, '../public')));

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// --- IN-MEMORY CACHE FOR ACCELERATING PAGE LOADS ---
let cachedMeta: any = null;
let cachedMetaTime = 0;
let cachedGraph: any = null;
let cachedGraphTime = 0;
let cachedBeneficiaries: any = null;
let cachedBeneficiariesTime = 0;
let cachedServices: any = null;
let cachedServicesTime = 0;
let cachedDeliveries: any = null;
let cachedDeliveriesTime = 0;
let cachedStrategies: any = null;
let cachedStrategiesTime = 0;
let cachedPilotage: any = null;
let cachedPilotageTime = 0;

const CACHE_TTL_MS = 30000; // 30 seconds TTL

// Middleware to invalidate cache on any write operation
app.use((req, res, next) => {
  if (['POST', 'PATCH', 'PUT', 'DELETE'].includes(req.method)) {
    console.log(`⚡ Invalidation du cache suite à une opération d'écriture: ${req.method} ${req.url}`);
    cachedMeta = null;
    cachedGraph = null;
    cachedBeneficiaries = null;
    cachedServices = null;
    cachedDeliveries = null;
    cachedStrategies = null;
    cachedPilotage = null;
  }
  next();
});


// --- SERVICES PUBLICS (CPSV-AP) ---

// 1. GET /api/services
app.get('/api/services', async (req, res) => {
  const now = Date.now();
  if (cachedServices && (now - cachedServicesTime < CACHE_TTL_MS)) {
    return res.json(cachedServices);
  }
  try {
    const services = await prisma.publicService.findMany({
      select: {
        id: true,
        name: true,
        code: true,
        uri: true,
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
        challenges: { select: { id: true, name: true } },
        filieresS3: { select: { id: true, name: true } },
        stages: { select: { id: true } },
        interventionLevel: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    cachedServices = services;
    cachedServicesTime = now;
    res.json(services);
  } catch (error: any) {
    console.error('Erreur lors de la récupération des services:', error);
    res.status(500).json({ error: 'Erreur interne du serveur', details: error.message });
  }
});

// 2. GET /api/meta - Métadonnées enrichies
app.get('/api/meta', async (req, res) => {
  const now = Date.now();
  if (cachedMeta && (now - cachedMetaTime < CACHE_TTL_MS)) {
    return res.json(cachedMeta);
  }
  try {
    const [
      organizations,
      channels,
      targetAudiences,
      businessEvents,
      lifeEvents,
      catalogues,
      strategicValueChains,
      stages,
      roles,
      needs,
      services,
      challenges,
      functions,
      sectors,
      ecosystems,
      interventionLevels,
      collectiveDeliveries,
      secondLineMissions,
      interventionTypes,
      ecosystemTypes,
      territories,
      eventResources,
      datasets,
      knowledgeAssets,
      actionInstances,
      journeyEnrollments,
      strategies,
      strategicPriorities,
      programs,
      measures,
      initiatives,
      beneficiaryEngagements,
      outcomeIndicators,
      impacts,
      fundingInstruments
    ] = await Promise.all([
      prisma.organization.findMany({ orderBy: { name: 'asc' } }),
      prisma.channel.findMany({ orderBy: { name: 'asc' } }),
      prisma.targetAudience.findMany({ orderBy: { name: 'asc' } }),
      prisma.businessEvent.findMany({ orderBy: { name: 'asc' } }),
      prisma.lifeEvent.findMany({ orderBy: { name: 'asc' } }),
      prisma.catalogue.findMany({ orderBy: { name: 'asc' } }),
      prisma.strategicValueChain.findMany({ orderBy: { name: 'asc' } }),
      prisma.valueChainStage.findMany({ orderBy: { name: 'asc' } }),
      prisma.ecosystemRole.findMany({ orderBy: { name: 'asc' } }),
      prisma.businessNeed.findMany({ orderBy: { name: 'asc' } }),
      prisma.publicService.findMany({
        include: { interventionLevel: true, challenges: true, filieresS3: true, stages: true, initiatives: true },
        orderBy: { name: 'asc' }
      }),
      prisma.businessChallenge.findMany({ orderBy: { name: 'asc' } }),
      prisma.enterpriseFunction.findMany({ orderBy: { name: 'asc' } }),
      prisma.naceSector.findMany({ orderBy: { code: 'asc' } }),
      prisma.ecosystem.findMany({
        include: { actors: true, services: true, journeys: true, filieresS3: true, territories: true },
        orderBy: { name: 'asc' }
      }),
      prisma.interventionLevel.findMany({ orderBy: { id: 'asc' } }),
      prisma.collectiveDelivery.findMany({
        include: { service: true, operator: true, companies: true },
        orderBy: { date: 'desc' }
      }),
      prisma.secondLineMission.findMany({
        include: { service: true, leadOperator: true, operatorsMobilized: true, ecosystems: true, valueChains: true },
        orderBy: { startDate: 'desc' }
      }),
      prisma.interventionType.findMany({ orderBy: { name: 'asc' } }),
      prisma.ecosystemType.findMany({ orderBy: { name: 'asc' } }),
      prisma.territory.findMany({
        include: { parentTerritory: true },
        orderBy: { name: 'asc' }
      }),
      prisma.eventResource.findMany({
        include: { ecosystems: true, publicServices: true },
        orderBy: { startDate: 'desc' }
      }),
      prisma.dataset.findMany({
        include: { ownerOrganization: true },
        orderBy: { title: 'asc' }
      }),
      prisma.knowledgeAsset.findMany({
        include: { publicServices: true, ecosystems: true, eventResources: true, programs: true, initiatives: true },
        orderBy: { title: 'asc' }
      }),
      prisma.actionInstance.findMany({
        include: { beneficiary: true, journey: true, ecosystem: true, deliveries: true },
        orderBy: { startDate: 'desc' }
      }),
      prisma.journeyEnrollment.findMany({
        include: { beneficiary: true, journey: true, currentStage: true },
        orderBy: { startDate: 'desc' }
      }),
      prisma.strategy.findMany({
        include: { priorities: true, ownerOrganization: true },
        orderBy: { name: 'asc' }
      }),
      prisma.strategicPriority.findMany({
        include: { strategy: true, programs: true },
        orderBy: { name: 'asc' }
      }),
      prisma.program.findMany({
        include: { strategies: true, ownerOrganization: true, measures: true },
        orderBy: { name: 'asc' }
      }),
      prisma.measure.findMany({
        include: { programs: true, initiatives: true },
        orderBy: { name: 'asc' }
      }),
      prisma.initiative.findMany({
        include: { measure: true, leadOrganization: true, publicServices: true },
        orderBy: { name: 'asc' }
      }),
      prisma.beneficiaryEngagement.findMany({
        include: { beneficiary: true, initiative: true, ecosystem: true, territory: true },
        orderBy: { startDate: 'desc' }
      }),
      prisma.outcomeIndicator.findMany({
        orderBy: { name: 'asc' }
      }),
      prisma.impact.findMany({
        include: { beneficiary: true, indicator: true, territory: true, valueChain: true },
        orderBy: { date: 'desc' }
      }),
      prisma.fundingInstrument.findMany({
        orderBy: { name: 'asc' }
      })
    ]);

    const data = {
      organizations,
      channels,
      targetAudiences,
      businessEvents,
      lifeEvents,
      catalogues,
      strategicValueChains,
      stages,
      roles,
      needs,
      services,
      challenges,
      functions,
      sectors,
      ecosystems,
      interventionLevels,
      collectiveDeliveries,
      secondLineMissions,
      interventionTypes,
      ecosystemTypes,
      territories,
      eventResources,
      datasets,
      knowledgeAssets,
      actionInstances,
      journeyEnrollments,
      strategies,
      strategicPriorities,
      programs,
      measures,
      initiatives,
      beneficiaryEngagements,
      outcomeIndicators,
      impacts,
      fundingInstruments
    };
    cachedMeta = data;
    cachedMetaTime = now;
    res.json(data);
  } catch (error: any) {
    console.error('Erreur lors de la récupération des métadonnées:', error);
    res.status(500).json({ error: 'Erreur interne du serveur', details: error.message });
  }
});

// 3. GET /api/services/:id
app.get('/api/services/:id', async (req, res) => {
  const serviceId = parseInt(req.params.id);
  if (isNaN(serviceId)) {
    res.status(400).json({ error: 'ID de service invalide' });
    return;
  }

  try {
    const service = await prisma.publicService.findUnique({
      where: { id: serviceId },
      include: {
        organization: true,
        channels: true,
        targetAudiences: true,
        businessEvents: true,
        lifeEvents: true,
        requirements: {
          include: {
            evidences: true,
          },
        },
        outputs: true,
        outcomes: true,
        costs: true,
        contactPoints: true,
        criterions: true,
        rules: true,
        catalogues: true,
        supportsBusinessNeed: true,
        challenges: true,
        filieresS3: true,
        impactedFunctions: true,
        stages: true,
        ecosystems: true,
      },
    });

    if (!service) {
      res.status(404).json({ error: 'Service public non trouvé' });
      return;
    }

    res.json(service);
  } catch (error: any) {
    console.error(`Erreur lors de la récupération du service ${serviceId}:`, error);
    res.status(500).json({ error: 'Erreur interne du serveur', details: error.message });
  }
});

// 4. POST /api/services
app.post('/api/services', async (req, res) => {
  try {
    const {
      name,
      description,
      code,
      uri,
      organizationId,
      channels,
      targetAudiences,
      businessEvents,
      lifeEvents,
      catalogues,
      requirements,
      outputs,
      outcomes,
      costs,
      contactPoints,
      supportsBusinessNeedIds,
      challenges,
      filieresS3,
      impactedFunctions,
      stages,
      ecosystemIds,
      interventionLevelId,
    } = req.body;

    if (!name || !organizationId) {
      res.status(400).json({ error: 'Le nom du service et l\'organisation associée sont obligatoires.' });
      return;
    }

    const newService = await prisma.publicService.create({
      data: {
        name,
        description: description || null,
        code: code || null,
        uri: uri || `https://pit.wallonie.be/id/public-service/${(code || name).toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        organizationId: parseInt(organizationId),
        interventionLevelId: interventionLevelId ? parseInt(interventionLevelId) : null,
        
        channels: channels && Array.isArray(channels) ? {
          connect: channels.map((id: any) => ({ id: parseInt(id) })),
        } : undefined,
        
        targetAudiences: targetAudiences && Array.isArray(targetAudiences) ? {
          connect: targetAudiences.map((id: any) => ({ id: parseInt(id) })),
        } : undefined,
        
        businessEvents: businessEvents && Array.isArray(businessEvents) ? {
          connect: businessEvents.map((id: any) => ({ id: parseInt(id) })),
        } : undefined,
        
        lifeEvents: lifeEvents && Array.isArray(lifeEvents) ? {
          connect: lifeEvents.map((id: any) => ({ id: parseInt(id) })),
        } : undefined,
        
        catalogues: catalogues && Array.isArray(catalogues) ? {
          connect: catalogues.map((id: any) => ({ id: parseInt(id) })),
        } : undefined,

        supportsBusinessNeed: supportsBusinessNeedIds && Array.isArray(supportsBusinessNeedIds) ? {
          connect: supportsBusinessNeedIds.map((id: any) => ({ id: parseInt(id) })),
        } : undefined,

        challenges: challenges && Array.isArray(challenges) ? {
          connect: challenges.map((id: any) => ({ id: parseInt(id) })),
        } : undefined,

        filieresS3: filieresS3 && Array.isArray(filieresS3) ? {
          connect: filieresS3.map((id: any) => ({ id: parseInt(id) })),
        } : undefined,

        impactedFunctions: impactedFunctions && Array.isArray(impactedFunctions) ? {
          connect: impactedFunctions.map((id: any) => ({ id: parseInt(id) })),
        } : undefined,

        stages: stages && Array.isArray(stages) ? {
          connect: stages.map((id: any) => ({ id: parseInt(id) })),
        } : undefined,

        ecosystems: ecosystemIds && Array.isArray(ecosystemIds) ? {
          connect: ecosystemIds.map((id: any) => ({ id: parseInt(id) })),
        } : undefined,

        requirements: requirements && Array.isArray(requirements) ? {
          create: requirements.map((req: any) => ({
            name: req.name,
            description: req.description || null,
            code: req.code || null,
            uri: req.uri || `https://pit.wallonie.be/id/requirement/${req.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
            evidences: req.evidences && Array.isArray(req.evidences) ? {
              create: req.evidences.map((evi: any) => ({
                name: evi.name,
                description: evi.description || null,
                code: evi.code || null,
                uri: evi.uri || `https://pit.wallonie.be/id/evidence/${evi.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
              }))
            } : undefined
          }))
        } : undefined,

        outputs: outputs && Array.isArray(outputs) ? {
          create: outputs.map((out: any) => ({
            name: out.name,
            description: out.description || null,
            code: out.code || null,
            uri: out.uri || `https://pit.wallonie.be/id/output/${out.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
          }))
        } : undefined,

        outcomes: outcomes && Array.isArray(outcomes) ? {
          create: outcomes.map((out: any) => ({
            name: out.name,
            description: out.description || null,
            code: out.code || null,
            uri: out.uri || `https://pit.wallonie.be/id/outcome/${out.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
          }))
        } : undefined,

        costs: costs && Array.isArray(costs) ? {
          create: costs.map((c: any) => ({
            name: c.name,
            value: parseFloat(c.value) || 0.0,
            currency: c.currency || 'EUR',
            description: c.description || null,
            uri: c.uri || `https://pit.wallonie.be/id/cost/${c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
          }))
        } : undefined,

        contactPoints: contactPoints && Array.isArray(contactPoints) ? {
          create: contactPoints.map((cp: any) => ({
            name: cp.name,
            email: cp.email || null,
            telephone: cp.telephone || null,
            description: cp.description || null,
            uri: cp.uri || `https://pit.wallonie.be/id/contact-point/${cp.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
          }))
        } : undefined,
      },
      include: {
        organization: true,
        channels: true,
        targetAudiences: true,
        supportsBusinessNeed: true,
      }
    });

    console.log(`✅ Nouveau service public encodé avec succès: ${newService.name} (ID: ${newService.id})`);
    res.status(201).json(newService);
  } catch (error: any) {
    console.error('Erreur lors de la création du service:', error);
    res.status(500).json({ error: 'Erreur lors de l\'encodage du service public', details: error.message });
  }
});


// --- FILIERES / STRATEGIC VALUE CHAINS ---
app.get('/api/value-chains', async (req, res) => {
  try {
    const data = await prisma.strategicValueChain.findMany({
      orderBy: { name: 'asc' }
    });
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/value-chains', async (req, res) => {
  try {
    const { name, description, uri } = req.body;
    const item = await prisma.strategicValueChain.create({
      data: { name, description, uri: uri || `https://pit.wallonie.be/id/strategic-value-chain/${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}` }
    });
    res.status(201).json(item);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


// --- MAILLONS / VALUE CHAIN STAGES ---
app.get('/api/stages', async (req, res) => {
  try {
    const data = await prisma.valueChainStage.findMany({ orderBy: { name: 'asc' } });
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/stages', async (req, res) => {
  try {
    const { name, description, category, uri } = req.body;
    const item = await prisma.valueChainStage.create({
      data: { name, description, category, uri: uri || `https://pit.wallonie.be/id/stage/${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}` }
    });
    res.status(201).json(item);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


// --- DEFIS D'AFFAIRES (BUSINESS CHALLENGES) ---
app.get('/api/challenges', async (req, res) => {
  try {
    const data = await prisma.businessChallenge.findMany({ orderBy: { name: 'asc' } });
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


// --- SECTEURS NACE (NACE SECTORS) ---
app.get('/api/sectors', async (req, res) => {
  try {
    const data = await prisma.naceSector.findMany({ orderBy: { code: 'asc' } });
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


// --- ECOSYSTEMES ---
app.get('/api/ecosystems', async (req, res) => {
  try {
    const data = await prisma.ecosystem.findMany({
      include: { actors: true, services: true, journeys: true, filieresS3: true, challenges: true },
      orderBy: { name: 'asc' }
    });
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/ecosystems/:id', async (req, res) => {
  try {
    const data = await prisma.ecosystem.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { actors: true, services: true, journeys: true, filieresS3: true, challenges: true }
    });
    if (!data) return res.status(404).json({ error: 'Écosystème non trouvé' });
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/ecosystems', async (req, res) => {
  try {
    const { name, description, mission, territory, actorIds, serviceIds, journeyIds, filiereIds, challengeIds } = req.body;
    const item = await prisma.ecosystem.create({
      data: {
        name,
        description,
        mission,
        territory,
        actors: actorIds ? { connect: actorIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        services: serviceIds ? { connect: serviceIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        journeys: journeyIds ? { connect: journeyIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        filieresS3: filiereIds ? { connect: filiereIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        challenges: challengeIds ? { connect: challengeIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
      },
      include: { actors: true, services: true }
    });
    res.status(201).json(item);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


// --- REALISATIONS DE SERVICES (SERVICE DELIVERIES) ---
app.get('/api/service-deliveries', async (req, res) => {
  const beneficiaryId = req.query.beneficiaryId ? parseInt(req.query.beneficiaryId as string) : undefined;
  
  const now = Date.now();
  if (!beneficiaryId && cachedDeliveries && (now - cachedDeliveriesTime < CACHE_TTL_MS)) {
    return res.json(cachedDeliveries);
  }
  
  try {
    const data = await prisma.serviceDelivery.findMany({
      where: beneficiaryId ? { beneficiaryId } : undefined,
      include: { beneficiary: true, service: true, operator: true },
      orderBy: { date: 'desc' }
    });
    
    if (!beneficiaryId) {
      cachedDeliveries = data;
      cachedDeliveriesTime = now;
    }
    
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/service-deliveries', async (req, res) => {
  try {
    const {
      beneficiaryId, serviceId, journeyId, journeyStageId,
      status, date, operatorId, outputReal, outcomeReal, impact,
      maturityBefore, maturityAfter, maturityDelta, evidenceFiles
    } = req.body;

    const mappedStatus = status === 'Terminé' || status === 'COMPLETED' ? 'COMPLETED'
                         : status === 'En cours' || status === 'IN_PROGRESS' ? 'IN_PROGRESS'
                         : status === 'Planifié' || status === 'PLANNED' ? 'PLANNED'
                         : 'CANCELLED';

    const item = await prisma.serviceDelivery.create({
      data: {
        beneficiaryId: parseInt(beneficiaryId),
        serviceId: parseInt(serviceId),
        journeyId: journeyId ? parseInt(journeyId) : null,
        journeyStageId: journeyStageId ? parseInt(journeyStageId) : null,
        status: mappedStatus,
        date: date ? new Date(date) : new Date(),
        operatorId: parseInt(operatorId),
        outputReal,
        outcomeReal,
        impact,
        maturityBefore,
        maturityAfter,
        maturityDelta,
        evidenceFiles
      },
      include: { beneficiary: true, service: true, operator: true }
    });

    // Si le statut est Terminé, mettre à jour dynamiquement la maturité du bénéficiaire !
    if (mappedStatus === 'COMPLETED' && maturityAfter) {
      const bUpdateData: any = {};
      if (maturityAfter.digital !== undefined) bUpdateData.maturityDigital = parseInt(maturityAfter.digital);
      if (maturityAfter.ia !== undefined) bUpdateData.maturityIa = parseInt(maturityAfter.ia);
      if (maturityAfter.cyber !== undefined) bUpdateData.maturityCyber = parseInt(maturityAfter.cyber);
      if (maturityAfter.export !== undefined) bUpdateData.maturityExport = parseInt(maturityAfter.export);
      if (maturityAfter.durability !== undefined) bUpdateData.maturityDurability = parseInt(maturityAfter.durability);

      await prisma.beneficiary.update({
        where: { id: parseInt(beneficiaryId) },
        data: bUpdateData
      });
    }

    res.status(201).json(item);
  } catch (err: any) {
    console.error('Erreur creation service delivery:', err);
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/service-deliveries/:id', async (req, res) => {
  try {
    const { status, outputReal, outcomeReal, impact, maturityAfter, maturityDelta, evidenceFiles } = req.body;
    const deliveryId = parseInt(req.params.id);

    const original = await prisma.serviceDelivery.findUnique({ where: { id: deliveryId } });
    if (!original) return res.status(404).json({ error: 'Réalisation de service non trouvée' });

    const mappedStatus = status === 'Terminé' || status === 'COMPLETED' ? 'COMPLETED'
                         : status === 'En cours' || status === 'IN_PROGRESS' ? 'IN_PROGRESS'
                         : status === 'Planifié' || status === 'PLANNED' ? 'PLANNED'
                         : status === 'Annulé' || status === 'CANCELLED' ? 'CANCELLED'
                         : undefined;

    const updated = await prisma.serviceDelivery.update({
      where: { id: deliveryId },
      data: {
        status: mappedStatus, outputReal, outcomeReal, impact, maturityAfter, maturityDelta, evidenceFiles
      }
    });

    // Si statut passe à Terminé, appliquer la maturité
    if (mappedStatus === 'COMPLETED' && maturityAfter) {
      const bUpdateData: any = {};
      if (maturityAfter.digital !== undefined) bUpdateData.maturityDigital = parseInt(maturityAfter.digital);
      if (maturityAfter.ia !== undefined) bUpdateData.maturityIa = parseInt(maturityAfter.ia);
      if (maturityAfter.cyber !== undefined) bUpdateData.maturityCyber = parseInt(maturityAfter.cyber);
      if (maturityAfter.export !== undefined) bUpdateData.maturityExport = parseInt(maturityAfter.export);
      if (maturityAfter.durability !== undefined) bUpdateData.maturityDurability = parseInt(maturityAfter.durability);

      await prisma.beneficiary.update({
        where: { id: original.beneficiaryId },
        data: bUpdateData
      });
    }

    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


// --- LIVRAISONS COLLECTIVES (COLLECTIVE DELIVERIES) ---
app.get('/api/collective-deliveries', async (req, res) => {
  try {
    const data = await prisma.collectiveDelivery.findMany({
      include: { service: true, operator: true, companies: true },
      orderBy: { date: 'desc' }
    });
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/collective-deliveries', async (req, res) => {
  try {
    const {
      serviceId, title, date, operatorId, status,
      participantsCount, companiesCount, satisfactionScore, leadsCount, nextSteps,
      companyIds, notes
    } = req.body;

    const item = await prisma.collectiveDelivery.create({
      data: {
        serviceId: parseInt(serviceId),
        title,
        date: date ? new Date(date) : new Date(),
        operatorId: parseInt(operatorId),
        status: status || 'PLANNED',
        participantsCount: participantsCount ? parseInt(participantsCount) : 0,
        companiesCount: companiesCount ? parseInt(companiesCount) : 0,
        satisfactionScore: satisfactionScore ? parseFloat(satisfactionScore) : null,
        leadsCount: leadsCount ? parseInt(leadsCount) : 0,
        nextSteps,
        notes,
        companies: companyIds && Array.isArray(companyIds) ? {
          connect: companyIds.map((id: any) => ({ id: parseInt(id) }))
        } : undefined
      },
      include: { service: true, operator: true, companies: true }
    });
    res.status(201).json(item);
  } catch (err: any) {
    console.error('Erreur creation collective delivery:', err);
    res.status(500).json({ error: err.message });
  }
});

// --- MISSIONS DE DEUXIEME LIGNE (SECOND LINE MISSIONS) ---
app.get('/api/second-line-missions', async (req, res) => {
  try {
    const data = await prisma.secondLineMission.findMany({
      include: { service: true, leadOperator: true, operatorsMobilized: true, ecosystems: true, valueChains: true },
      orderBy: { startDate: 'desc' }
    });
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/second-line-missions', async (req, res) => {
  try {
    const {
      serviceId, title, startDate, endDate, status,
      leadOperatorId, operatorIds, collaborationsCount, deliverables, territoryCovered,
      ecosystemIds, valueChainIds, notes
    } = req.body;

    const item = await prisma.secondLineMission.create({
      data: {
        serviceId: parseInt(serviceId),
        title,
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : null,
        status: status || 'PLANNED',
        leadOperatorId: parseInt(leadOperatorId),
        operatorsMobilized: operatorIds && Array.isArray(operatorIds) ? {
          connect: operatorIds.map((id: any) => ({ id: parseInt(id) }))
        } : undefined,
        collaborationsCount: collaborationsCount ? parseInt(collaborationsCount) : 0,
        deliverables,
        territoryCovered,
        ecosystems: ecosystemIds && Array.isArray(ecosystemIds) ? {
          connect: ecosystemIds.map((id: any) => ({ id: parseInt(id) }))
        } : undefined,
        valueChains: valueChainIds && Array.isArray(valueChainIds) ? {
          connect: valueChainIds.map((id: any) => ({ id: parseInt(id) }))
        } : undefined,
        notes
      },
      include: { service: true, leadOperator: true, operatorsMobilized: true }
    });
    res.status(201).json(item);
  } catch (err: any) {
    console.error('Erreur creation second line mission:', err);
    res.status(500).json({ error: err.message });
  }
});


// --- BENEFICIAIRES (BENEFICIARIES) ---
app.get('/api/beneficiaries', async (req, res) => {
  const now = Date.now();
  if (cachedBeneficiaries && (now - cachedBeneficiariesTime < CACHE_TTL_MS)) {
    return res.json(cachedBeneficiaries);
  }
  try {
    const data = await prisma.beneficiary.findMany({
      include: { primaryNaceSector: true, secondaryNaceSectors: true, challenges: true, filieresS3: true, stages: true, needs: true },
      orderBy: { name: 'asc' }
    });
    cachedBeneficiaries = data;
    cachedBeneficiariesTime = now;
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Alias /api/companies pour rétrocompatibilité
app.get('/api/companies', async (req, res) => {
  const now = Date.now();
  if (cachedBeneficiaries && (now - cachedBeneficiariesTime < CACHE_TTL_MS)) {
    return res.json(cachedBeneficiaries);
  }
  try {
    const data = await prisma.beneficiary.findMany({
      include: { primaryNaceSector: true, secondaryNaceSectors: true, challenges: true, filieresS3: true, stages: true, needs: true },
      orderBy: { name: 'asc' }
    });
    cachedBeneficiaries = data;
    cachedBeneficiariesTime = now;
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/beneficiaries/:id', async (req, res) => {
  try {
    const item = await prisma.beneficiary.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        primaryNaceSector: true,
        secondaryNaceSectors: true,
        challenges: true,
        filieresS3: true,
        stages: true,
        needs: true,
        deliveries: { include: { service: true, operator: true } }
      }
    });
    if (!item) return res.status(404).json({ error: 'Bénéficiaire non trouvé' });
    res.json(item);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Alias /api/companies/:id
app.get('/api/companies/:id', async (req, res) => {
  try {
    const item = await prisma.beneficiary.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        primaryNaceSector: true,
        secondaryNaceSectors: true,
        challenges: true,
        filieresS3: true,
        stages: true,
        needs: true,
        deliveries: { include: { service: true, operator: true } }
      }
    });
    if (!item) return res.status(404).json({ error: 'Bénéficiaire non trouvé' });
    res.json(item);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/beneficiaries', async (req, res) => {
  try {
    const {
      name, bce, size, employees, revenue, location, province, arrondissement, demand,
      primaryNaceSectorId, secondaryNaceSectorIds, challengeIds, filiereS3Ids, stageIds, roleIds, needIds,
      maturityDigital, maturityIa, maturityCyber, maturityExport, maturityDurability
    } = req.body;

    const item = await prisma.beneficiary.create({
      data: {
        name,
        bce: bce || null,
        size,
        employees: employees ? parseInt(employees) : null,
        revenue: revenue ? parseFloat(revenue) : null,
        location,
        province,
        arrondissement,
        demand: demand || null,
        primaryNaceSectorId: primaryNaceSectorId ? parseInt(primaryNaceSectorId) : null,
        secondaryNaceSectors: secondaryNaceSectorIds ? { connect: secondaryNaceSectorIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        challenges: challengeIds ? { connect: challengeIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        filieresS3: filiereS3Ids ? { connect: filiereS3Ids.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        stages: stageIds ? { connect: stageIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        playsRole: roleIds ? { connect: roleIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        needs: needIds ? { connect: needIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        maturityDigital: maturityDigital ? parseInt(maturityDigital) : 1,
        maturityIa: maturityIa ? parseInt(maturityIa) : 1,
        maturityCyber: maturityCyber ? parseInt(maturityCyber) : 1,
        maturityExport: maturityExport ? parseInt(maturityExport) : 1,
        maturityDurability: maturityDurability ? parseInt(maturityDurability) : 1
      },
      include: { primaryNaceSector: true, challenges: true, filieresS3: true }
    });
    res.status(201).json(item);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Alias /api/companies (POST)
app.post('/api/companies', async (req, res) => {
  try {
    const {
      name, size, location, demand,
      belongsToValueChainIds, participatesInStageIds, playsRoleIds, needIds
    } = req.body;

    const item = await prisma.beneficiary.create({
      data: {
        name,
        size,
        location,
        demand: demand || null,
        filieresS3: belongsToValueChainIds ? { connect: belongsToValueChainIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        stages: participatesInStageIds ? { connect: participatesInStageIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        playsRole: playsRoleIds ? { connect: playsRoleIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        needs: needIds ? { connect: needIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
      },
      include: { filieresS3: true, stages: true, playsRole: true, needs: true }
    });
    res.status(201).json(item);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Patch Beneficiary
app.patch('/api/beneficiaries/:id', async (req, res) => {
  const beneficiaryId = parseInt(req.params.id);
  if (isNaN(beneficiaryId)) return res.status(400).json({ error: 'ID invalide' });
  try {
    const {
      name, bce, size, employees, revenue, location, province, arrondissement, demand,
      primaryNaceSectorId, secondaryNaceSectorIds, challengeIds, filiereS3Ids, stageIds, roleIds, needIds,
      maturityDigital, maturityIa, maturityCyber, maturityExport, maturityDurability, roadmapLogs
    } = req.body;

    const updated = await prisma.beneficiary.update({
      where: { id: beneficiaryId },
      data: {
        name, bce, size, demand, location, province, arrondissement,
        employees: employees !== undefined ? (employees ? parseInt(employees) : null) : undefined,
        revenue: revenue !== undefined ? (revenue ? parseFloat(revenue) : null) : undefined,
        primaryNaceSectorId: primaryNaceSectorId !== undefined ? (primaryNaceSectorId ? parseInt(primaryNaceSectorId) : null) : undefined,
        secondaryNaceSectors: secondaryNaceSectorIds ? { set: secondaryNaceSectorIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        challenges: challengeIds ? { set: challengeIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        filieresS3: filiereS3Ids ? { set: filiereS3Ids.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        stages: stageIds ? { set: stageIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        playsRole: roleIds ? { set: roleIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        needs: needIds ? { set: needIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        roadmapLogs: roadmapLogs !== undefined ? roadmapLogs : undefined,
        maturityDigital: maturityDigital !== undefined ? parseInt(maturityDigital) : undefined,
        maturityIa: maturityIa !== undefined ? parseInt(maturityIa) : undefined,
        maturityCyber: maturityCyber !== undefined ? parseInt(maturityCyber) : undefined,
        maturityExport: maturityExport !== undefined ? parseInt(maturityExport) : undefined,
        maturityDurability: maturityDurability !== undefined ? parseInt(maturityDurability) : undefined,
      },
      include: { primaryNaceSector: true, secondaryNaceSectors: true, challenges: true, filieresS3: true, stages: true }
    });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Alias Patch /api/companies/:id
app.patch('/api/companies/:id', async (req, res) => {
  const companyId = parseInt(req.params.id);
  if (isNaN(companyId)) return res.status(400).json({ error: 'ID invalide' });
  try {
    const {
      name, size, location, demand,
      belongsToValueChainIds, participatesInStageIds, playsRoleIds, needIds,
      roadmapLogs
    } = req.body;

    const updated = await prisma.beneficiary.update({
      where: { id: companyId },
      data: {
        name, size, location, demand,
        filieresS3: belongsToValueChainIds ? { set: belongsToValueChainIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        stages: participatesInStageIds ? { set: participatesInStageIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        playsRole: playsRoleIds ? { set: playsRoleIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        needs: needIds ? { set: needIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        roadmapLogs: roadmapLogs !== undefined ? roadmapLogs : undefined
      },
      include: { filieresS3: true, stages: true, playsRole: true, needs: true }
    });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


// --- CATALOGUE DES PARCOURS (JOURNEYS) ---
app.get('/api/journeys', async (req, res) => {
  try {
    const data = await prisma.journey.findMany({
      include: {
        challenges: true,
        filieresS3: true,
        stagesTransverses: true,
        stages: { orderBy: { position: 'asc' }, include: { services: { include: { organization: true } } } }
      },
      orderBy: { name: 'asc' }
    });
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


// --- MOTEUR DE RECOMMANDATION INTELLIGENT ---
// Route générique unifiée (supportant alias /api/recommender/:companyId ou /api/recommender/:beneficiaryId)
const runRecommender = async (req: express.Request, res: express.Response) => {
  const idParam = req.params.companyId || req.params.beneficiaryId;
  const beneficiaryId = parseInt(String(idParam));
  if (isNaN(beneficiaryId)) {
    res.status(400).json({ error: 'ID de bénéficiaire invalide' });
    return;
  }
  try {
    const beneficiary = await prisma.beneficiary.findUnique({
      where: { id: beneficiaryId },
      include: {
        primaryNaceSector: true,
        challenges: true,
        filieresS3: true,
        stages: true,
        needs: true,
        deliveries: { include: { service: true } }
      },
    });

    if (!beneficiary) {
      res.status(404).json({ error: 'Bénéficiaire non trouvé' });
      return;
    }

    const beneficiaryChallengeIds = beneficiary.challenges.map(c => c.id);
    const beneficiaryFiliereIds = beneficiary.filieresS3.map(f => f.id);
    const beneficiaryStageIds = beneficiary.stages.map(s => s.id);
    const expressedNeedIds = beneficiary.needs.map(n => n.id);
    const consumedServiceIds = beneficiary.deliveries.filter(d => d.status === 'COMPLETED').map(d => d.serviceId);

    // Évaluation des règles logiques pour le Besoin Builder
    const evaluateRule = (rule: any, b: any): boolean => {
      if (!rule || !rule.conditions || !Array.isArray(rule.conditions)) return false;
      const operator = rule.operator || 'AND';
      const results = rule.conditions.map((cond: any) => {
        const { field, operator: condOp, value } = cond;
        // On résout les champs (y compris NACE principal par code)
        let bValue: any = b[field];
        if (field === 'sector' && b.primaryNaceSector) {
          bValue = b.primaryNaceSector.name;
        }
        if (bValue === undefined || bValue === null) return false;
        switch (condOp) {
          case '==': return bValue == value;
          case '!=': return bValue != value;
          case '<':  return bValue < value;
          case '>':  return bValue > value;
          case '<=': return bValue <= value;
          case '>=': return bValue >= value;
          default: return false;
        }
      });
      return operator === 'OR' ? results.some((r: boolean) => r === true) : results.every((r: boolean) => r === true);
    };

    // Charger les besoins
    const allNeeds = await prisma.businessNeed.findMany({
      include: {
        valueChains: true,
        valueChainStages: true,
        services: { include: { organization: true, challenges: true, filieresS3: true } },
        journeys: { include: { stages: { include: { services: true } } } }
      }
    });

    // Besoins correspondants
    const matchedNeeds = allNeeds.filter(need => {
      if (expressedNeedIds.includes(need.id)) return true;
      if (need.rule) {
        try {
          const ruleObj = typeof need.rule === 'string' ? JSON.parse(need.rule) : need.rule;
          if (evaluateRule(ruleObj, beneficiary)) return true;
        } catch (e) {
          console.error(`Erreur regle besoin ${need.id}:`, e);
        }
      }
      // Croisement sémantique : Si le besoin partage une filière et un maillon
      const hasVc = need.valueChains.some(vc => beneficiaryFiliereIds.includes(vc.id));
      const hasStage = need.valueChainStages.some(st => beneficiaryStageIds.includes(st.id));
      return hasVc && hasStage;
    });

    // Calcul des services recommandés
    const recommendedServices: any[] = [];
    const serviceSet = new Set<number>();

    // 1. Ajouter les services issus des besoins identifiés
    for (const need of matchedNeeds) {
      for (const service of need.services) {
        if (!serviceSet.has(service.id)) {
          serviceSet.add(service.id);
          recommendedServices.push({
            id: service.id,
            name: service.name,
            code: service.code,
            uri: service.uri,
            organization: service.organization,
            challenges: service.challenges,
            filieresS3: service.filieresS3,
            matchedReason: `Répond à votre besoin : "${need.name}"`
          });
        }
      }
    }

    // 2. Proposer des services selon les défis et filières directs de l'entreprise
    const allServices = await prisma.publicService.findMany({
      include: { organization: true, challenges: true, filieresS3: true }
    });

    for (const service of allServices) {
      if (!serviceSet.has(service.id)) {
        const matchesChallenge = service.challenges.some(c => beneficiaryChallengeIds.includes(c.id));
        const matchesFiliere = service.filieresS3.some(f => beneficiaryFiliereIds.includes(f.id));
        if (matchesChallenge || matchesFiliere) {
          serviceSet.add(service.id);
          recommendedServices.push({
            id: service.id,
            name: service.name,
            code: service.code,
            uri: service.uri,
            organization: service.organization,
            challenges: service.challenges,
            filieresS3: service.filieresS3,
            matchedReason: matchesChallenge
              ? `Recommandé pour votre défi : "${service.challenges.find(c => beneficiaryChallengeIds.includes(c.id))?.name}"`
              : `Recommandé pour votre filière S3 : "${service.filieresS3.find(f => beneficiaryFiliereIds.includes(f.id))?.name}"`
          });
        }
      }
    }

    // Calcul des parcours recommandés
    const recommendedJourneys: any[] = [];
    const journeySet = new Set<number>();
    const allJourneys = await prisma.journey.findMany({
      include: {
        challenges: true,
        filieresS3: true,
        stages: { orderBy: { position: 'asc' }, include: { services: { include: { organization: true } } } }
      }
    });

    for (const journey of allJourneys) {
      const matchChallenge = journey.challenges.some(c => beneficiaryChallengeIds.includes(c.id));
      const matchFiliere = journey.filieresS3.some(f => beneficiaryFiliereIds.includes(f.id));
      if (matchChallenge || matchFiliere) {
        journeySet.add(journey.id);
        recommendedJourneys.push({
          id: journey.id,
          name: journey.name,
          provider: journey.provider,
          objective: journey.objective,
          description: journey.description,
          stages: journey.stages,
          matchedReason: matchChallenge
            ? `Parcours aligné avec le défi : "${journey.challenges.find(c => beneficiaryChallengeIds.includes(c.id))?.name}"`
            : `Parcours aligné avec la filière : "${journey.filieresS3.find(f => beneficiaryFiliereIds.includes(f.id))?.name}"`
        });
      }
    }

    // Recommandations d'écosystèmes
    const recommendedEcosystems: any[] = [];
    const allEcosystems = await prisma.ecosystem.findMany({
      include: { actors: true, filieresS3: true, challenges: true }
    });

    for (const eco of allEcosystems) {
      const matchFiliere = eco.filieresS3.some(f => beneficiaryFiliereIds.includes(f.id));
      const matchChallenge = eco.challenges.some(c => beneficiaryChallengeIds.includes(c.id));
      if (matchFiliere || matchChallenge) {
        recommendedEcosystems.push({
          id: eco.id,
          name: eco.name,
          description: eco.description,
          mission: eco.mission,
          actors: eco.actors,
          matchedReason: matchFiliere 
            ? `Hub régional couvrant la filière : "${eco.filieresS3.find(f => beneficiaryFiliereIds.includes(f.id))?.name}"`
            : `Hub régional adressant le défi : "${eco.challenges.find(c => beneficiaryChallengeIds.includes(c.id))?.name}"`
        });
      }
    }

    // Recommandations d'acteurs (Organisations impliquées dans les recommandations)
    const recommendedActors: any[] = [];
    const actorSet = new Set<number>();
    
    // Extraire les acteurs des services et écosystèmes recommandés
    for (const s of recommendedServices) {
      if (s.organization && !actorSet.has(s.organization.id)) {
        actorSet.add(s.organization.id);
        recommendedActors.push(s.organization);
      }
    }
    for (const e of recommendedEcosystems) {
      for (const a of e.actors) {
        if (!actorSet.has(a.id)) {
          actorSet.add(a.id);
          recommendedActors.push(a);
        }
      }
    }

    res.json({
      beneficiary,
      matchedNeeds: matchedNeeds.map(n => ({ id: n.id, name: n.name, description: n.description })),
      recommendedServices: recommendedServices.filter(s => !consumedServiceIds.includes(s.id)), // masquer les déjà consommés
      recommendedJourneys,
      recommendedEcosystems,
      recommendedActors
    });
  } catch (error: any) {
    console.error('Erreur lors du calcul des recommandations:', error);
    res.status(500).json({ error: 'Erreur lors du calcul des recommandations', details: error.message });
  }
};

app.get('/api/recommender/:companyId', runRecommender);
app.get('/api/recommender/beneficiary/:beneficiaryId', runRecommender);


// --- KNOWLEDGE GRAPH (API) ---
app.get('/api/graph', async (req, res) => {
  const now = Date.now();
  if (cachedGraph && (now - cachedGraphTime < CACHE_TTL_MS)) {
    return res.json(cachedGraph);
  }
  try {
    const [
      beneficiaries,
      services,
      journeys,
      ecosystems,
      organizations,
      challenges,
      valueChains,
      datasets,
      knowledgeAssets,
      eventResources,
      actionInstances,
      strategies,
      strategicPriorities,
      programs,
      measures,
      initiatives,
      beneficiaryEngagements,
      outcomeIndicators,
      impacts,
      fundingInstruments,
      territories
    ] = await Promise.all([
      prisma.beneficiary.findMany({
        include: { challenges: true, filieresS3: true, stages: true, needs: true, enrolledJourneys: true, deliveries: true }
      }),
      prisma.publicService.findMany({
        include: { organization: true, challenges: true, filieresS3: true, stages: true, initiatives: true }
      }),
      prisma.journey.findMany({
        include: { challenges: true, filieresS3: true, stages: { include: { services: true } } }
      }),
      prisma.ecosystem.findMany({
        include: { actors: true, services: true, journeys: true, filieresS3: true, territories: true }
      }),
      prisma.organization.findMany(),
      prisma.businessChallenge.findMany(),
      prisma.strategicValueChain.findMany(),
      prisma.dataset.findMany(),
      prisma.knowledgeAsset.findMany({
        include: { publicServices: true, ecosystems: true, eventResources: true, programs: true, initiatives: true }
      }),
      prisma.eventResource.findMany({
        include: { ecosystems: true, publicServices: true }
      }),
      prisma.actionInstance.findMany({
        include: { deliveries: true }
      }),
      prisma.strategy.findMany({
        include: { priorities: true, ownerOrganization: true }
      }),
      prisma.strategicPriority.findMany({
        include: { strategy: true, programs: true, measures: true, initiatives: true }
      }),
      prisma.program.findMany({
        include: { strategies: true, priorities: true, measures: true, territories: true }
      }),
      prisma.measure.findMany({
        include: { programs: true, initiatives: true }
      }),
      prisma.initiative.findMany({
        include: { measure: true, leadOrganization: true, publicServices: true, territories: true }
      }),
      prisma.beneficiaryEngagement.findMany({
        include: { beneficiary: true, initiative: true, ecosystem: true, territory: true, filieresS3: true }
      }),
      prisma.outcomeIndicator.findMany(),
      prisma.impact.findMany({
        include: { beneficiary: true, indicator: true, territory: true, valueChain: true }
      }),
      prisma.fundingInstrument.findMany({
        include: { strategies: true, programs: true, measures: true, initiatives: true, services: true, beneficiaries: true }
      }),
      prisma.territory.findMany({
        include: { parentTerritory: true }
      })
    ]);

    const nodes: any[] = [];
    const edges: any[] = [];
    const nodeSet = new Set<string>();

    const addNode = (id: string, label: string, type: string, extra = {}) => {
      if (!nodeSet.has(id)) {
        nodeSet.add(id);
        nodes.push({ id, label, type, ...extra });
      }
    };

    const addEdge = (source: string, target: string, label: string) => {
      edges.push({ id: `e-${source}-${target}-${label.replace(/\s+/g, '-')}`, source, target, label });
    };

    // 1. Bénéficiaires
    for (const b of beneficiaries) {
      const bId = `beneficiary-${b.id}`;
      addNode(bId, b.name, 'beneficiary', { size: b.size, province: b.province, location: b.location });

      for (const ch of b.challenges) {
        addEdge(bId, `challenge-${ch.id}`, 'ADRESSE');
      }
      for (const f of b.filieresS3) {
        addEdge(bId, `valuechain-${f.id}`, 'APPARTIENT_A');
      }
      for (const st of b.enrolledJourneys) {
        addEdge(bId, `journey-${st.id}`, 'PARTICIPE_A');
      }
      // Suivi de l'utilisation réelle du service (UTILISE)
      for (const del of b.deliveries) {
        if (del.status === 'COMPLETED') {
          addEdge(bId, `service-${del.serviceId}`, 'UTILISE');
        }
      }
      if (b.territoryId) {
        addEdge(bId, `territory-${b.territoryId}`, 'SITUE_DANS');
      }
    }

    // 2. Services
    for (const s of services) {
      const sId = `service-${s.id}`;
      addNode(sId, s.name, 'service', { code: s.code });

      if (s.organization) {
        const orgId = `org-${s.organization.id}`;
        addNode(orgId, s.organization.name, 'organization', { type: s.organization.type });
        addEdge(orgId, sId, 'PROPOSE');
      }
      for (const ch of s.challenges) {
        addEdge(sId, `challenge-${ch.id}`, 'ADRESSE');
      }
      for (const f of s.filieresS3) {
        addEdge(sId, `valuechain-${f.id}`, 'APPARTIENT_A');
      }
    }

    // 3. Défis
    for (const ch of challenges) {
      addNode(`challenge-${ch.id}`, ch.name, 'challenge');
    }

    // 4. Filières S3
    for (const f of valueChains) {
      addNode(`valuechain-${f.id}`, f.name, 'valuechain');
    }

    // 5. Parcours
    for (const j of journeys) {
      const jId = `journey-${j.id}`;
      addNode(jId, j.name, 'journey');

      for (const ch of j.challenges) {
        addEdge(jId, `challenge-${ch.id}`, 'ADRESSE');
      }
      for (const f of j.filieresS3) {
        addEdge(jId, `valuechain-${f.id}`, 'APPARTIENT_A');
      }
      for (const stage of j.stages) {
        const stageNodeId = `journey-stage-${stage.id}`;
        addNode(stageNodeId, `${stage.position}. ${stage.name}`, 'journeystage');
        addEdge(stageNodeId, jId, 'FAIT_PARTIE_DE');
        
        for (const s of stage.services) {
          addEdge(`service-${s.id}`, stageNodeId, 'FAIT_PARTIE_DE');
        }
      }
    }

    // 6. Écosystèmes
    for (const e of ecosystems) {
      const eId = `ecosystem-${e.id}`;
      addNode(eId, e.name, 'ecosystem');

      for (const a of e.actors) {
        addEdge(`org-${a.id}`, eId, 'APPARTIENT_A');
      }
      for (const s of e.services) {
        addEdge(eId, `service-${s.id}`, 'PROPOSE');
      }
      for (const j of e.journeys) {
        addEdge(eId, `journey-${j.id}`, 'PROPOSE');
      }
      for (const f of e.filieresS3) {
        addEdge(eId, `valuechain-${f.id}`, 'APPARTIENT_A');
      }
      for (const t of e.territories) {
        addEdge(eId, `territory-${t.id}`, 'COUVERTURE_TERRITORIALE');
      }
    }

    // 7. Datasets
    for (const d of datasets) {
      const dId = `dataset-${d.id}`;
      addNode(dId, d.title, 'dataset', { qualityScore: d.qualityScore, updateFrequency: d.updateFrequency });
      addEdge(`org-${d.ownerOrganizationId}`, dId, 'PRODUIT');
    }

    // 8. Knowledge Assets
    for (const ka of knowledgeAssets) {
      const kaId = `knowledgeasset-${ka.id}`;
      addNode(kaId, ka.title, 'knowledgeasset', { type: ka.type, url: ka.url });
      for (const s of ka.publicServices) {
        addEdge(kaId, `service-${s.id}`, 'DOCUMENTE');
      }
      for (const eco of ka.ecosystems) {
        addEdge(kaId, `ecosystem-${eco.id}`, 'RATTACHE_A');
      }
      for (const evt of ka.eventResources) {
        addEdge(kaId, `event-${evt.id}`, 'PRODUIT_PAR');
      }
      for (const prog of ka.programs) {
        addEdge(kaId, `program-${prog.id}`, 'DOCUMENTE_PROGRAMME');
      }
      for (const init of ka.initiatives) {
        addEdge(kaId, `initiative-${init.id}`, 'DOCUMENTE_INITIATIVE');
      }
    }

    // 9. Event Resources
    for (const er of eventResources) {
      const erId = `event-${er.id}`;
      addNode(erId, er.title, 'eventresource', { type: er.type, location: er.location, startDate: er.startDate });
      for (const s of er.publicServices) {
        addEdge(`service-${s.id}`, erId, 'MOBILISE');
      }
      for (const eco of er.ecosystems) {
        addEdge(`ecosystem-${eco.id}`, erId, 'PORTE');
      }
    }

    // 10. Action Instances (Engagements Rétrocompatibilité)
    for (const ai of actionInstances) {
      const aiId = `actioninstance-${ai.id}`;
      addNode(aiId, ai.title, 'actioninstance', { status: ai.status, objective: ai.objective });
      addEdge(`beneficiary-${ai.beneficiaryId}`, aiId, 'ENGAGE_DANS');
      if (ai.journeyId) {
        addEdge(aiId, `journey-${ai.journeyId}`, 'REALISE_DANS');
      }
      if (ai.ecosystemId) {
        addEdge(aiId, `ecosystem-${ai.ecosystemId}`, 'ACCOMPAGNE_PAR');
      }
      for (const del of ai.deliveries) {
        addEdge(aiId, `service-${del.serviceId}`, 'CONTIENT_SERVICE');
      }
    }

    // 11. Stratégies
    for (const st of strategies) {
      const stId = `strategy-${st.id}`;
      addNode(stId, st.name, 'strategy', { code: st.code, status: st.status });
      if (st.ownerOrganizationId) {
        addEdge(stId, `org-${st.ownerOrganizationId}`, 'PORTE_PAR');
      }
    }

    // 12. Priorités Stratégiques
    for (const p of strategicPriorities) {
      const pId = `priority-${p.id}`;
      addNode(pId, p.name, 'strategicpriority', { code: p.code });
      addEdge(pId, `strategy-${p.strategyId}`, 'CONTIENT_PRIORITE');
      for (const prog of p.programs) {
        addEdge(pId, `program-${prog.id}`, 'PREVOIT_PROGRAMME');
      }
    }

    // 13. Programmes
    for (const prog of programs) {
      const progId = `program-${prog.id}`;
      addNode(progId, prog.name, 'program', { code: prog.code, budget: prog.budget, status: prog.status });
      for (const strat of prog.strategies) {
        addEdge(progId, `strategy-${strat.id}`, 'APPARTIENT_A');
      }
      for (const prio of prog.priorities) {
        addEdge(progId, `priority-${prio.id}`, 'APPARTIENT_A');
      }
      for (const t of prog.territories) {
        addEdge(progId, `territory-${t.id}`, 'COUVERTURE_TERRITORIALE');
      }
    }

    // 14. Mesures
    for (const m of measures) {
      const mId = `measure-${m.id}`;
      addNode(mId, m.name, 'measure', { code: m.code, budget: m.budget });
      for (const prog of m.programs) {
        addEdge(`program-${prog.id}`, mId, 'CONTIENT_MESURE');
      }
    }

    // 15. Initiatives
    for (const init of initiatives) {
      const initId = `initiative-${init.id}`;
      addNode(initId, init.name, 'initiative', { code: init.code, status: init.status });
      addEdge(initId, `measure-${init.measureId}`, 'CONTIENT_INITIATIVE');
      if (init.leadOrganizationId) {
        addEdge(initId, `org-${init.leadOrganizationId}`, 'PILOTE_PAR');
      }
      for (const s of init.publicServices) {
        addEdge(initId, `service-${s.id}`, 'SOUTIENT_SERVICE');
      }
      for (const t of init.territories) {
        addEdge(initId, `territory-${t.id}`, 'COUVERTURE_TERRITORIALE');
      }
    }

    // 16. Territoires
    for (const t of territories) {
      const tId = `territory-${t.id}`;
      addNode(tId, t.name, 'territory', { code: t.code, type: t.type });
      if (t.parentTerritoryId) {
        addEdge(tId, `territory-${t.parentTerritoryId}`, 'SOUS_TERRITOIRE_DE');
      }
    }

    // 17. Engagements Bénéficiaires (Nouveau modèle)
    for (const eng of beneficiaryEngagements) {
      const engId = `engagement-${eng.id}`;
      addNode(engId, eng.title, 'beneficiaryengagement', { status: eng.status, objective: eng.objective });
      addEdge(`beneficiary-${eng.beneficiaryId}`, engId, 'ENGAGE_BENEFICIAIRE');
      if (eng.initiativeId) {
        addEdge(engId, `initiative-${eng.initiativeId}`, 'REALISE_INITIATIVE');
      }
      if (eng.ecosystemId) {
        addEdge(engId, `ecosystem-${eng.ecosystemId}`, 'ACCOMPAGNE_PAR');
      }
      if (eng.territoryId) {
        addEdge(engId, `territory-${eng.territoryId}`, 'SITUE_DANS');
      }
    }

    // 18. Indicateurs & Impacts Réels
    for (const ind of outcomeIndicators) {
      addNode(`indicator-${ind.id}`, ind.name, 'outcomeindicator', { unit: ind.unit });
    }

    for (const imp of impacts) {
      const impId = `impact-${imp.id}`;
      const label = imp.numericValue !== null ? `${imp.numericValue} ${imp.indicator.unit}` : (imp.textValue || 'Impact');
      addNode(impId, label, 'impact', { textValue: imp.textValue, numericValue: imp.numericValue });
      addEdge(impId, `beneficiary-${imp.beneficiaryId}`, 'CONSTATE_SUR');
      addEdge(impId, `indicator-${imp.indicatorId}`, 'MESURE_PAR');
      if (imp.territoryId) {
        addEdge(impId, `territory-${imp.territoryId}`, 'LIE_AU_TERRITOIRE');
      }
      if (imp.valueChainId) {
        addEdge(impId, `valuechain-${imp.valueChainId}`, 'ORIENTE_FILIERE');
      }
    }

    // 19. Instruments de Financement
    for (const fi of fundingInstruments) {
      const fiId = `funding-${fi.id}`;
      addNode(fiId, fi.name, 'fundinginstrument', { type: fi.type });
      for (const strat of fi.strategies) addEdge(fiId, `strategy-${strat.id}`, 'FINANCE_STRATEGIE');
      for (const prog of fi.programs) addEdge(fiId, `program-${prog.id}`, 'FINANCE_PROGRAMME');
      for (const m of fi.measures) addEdge(fiId, `measure-${m.id}`, 'FINANCE_MESURE');
      for (const init of fi.initiatives) addEdge(fiId, `initiative-${init.id}`, 'FINANCE_INITIATIVE');
      for (const s of fi.services) addEdge(fiId, `service-${s.id}`, 'FINANCE_SERVICE');
      for (const b of fi.beneficiaries) addEdge(fiId, `beneficiary-${b.id}`, 'ATTRIBUE_A');
    }

    const data = { nodes, edges };
    cachedGraph = data;
    cachedGraphTime = now;
    res.json(data);
  } catch (error: any) {
    console.error('Erreur lors de la génération du graphe:', error);
    res.status(500).json({ error: 'Erreur interne lors de la génération du graphe', details: error.message });
  }
});

// --- NEW CRUD API ENDPOINTS ---

// Datasets
app.get('/api/datasets', async (req, res) => {
  try {
    const items = await prisma.dataset.findMany({
      include: { ownerOrganization: true },
      orderBy: { title: 'asc' }
    });
    res.json(items);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/datasets', async (req, res) => {
  try {
    const { title, description, themes, keywords, qualityScore, updateFrequency, ownerOrganizationId } = req.body;
    const item = await prisma.dataset.create({
      data: {
        title,
        description,
        themes: themes || [],
        keywords: keywords || [],
        qualityScore: qualityScore ? parseFloat(qualityScore) : 5.0,
        updateFrequency,
        ownerOrganizationId: parseInt(ownerOrganizationId)
      },
      include: { ownerOrganization: true }
    });
    res.status(201).json(item);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Knowledge Assets
app.get('/api/knowledge-assets', async (req, res) => {
  try {
    const items = await prisma.knowledgeAsset.findMany({
      include: { publicServices: true, ecosystems: true, eventResources: true },
      orderBy: { title: 'asc' }
    });
    res.json(items);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/knowledge-assets', async (req, res) => {
  try {
    const { title, type, description, file, url, serviceIds, ecosystemIds, eventResourceIds } = req.body;
    const item = await prisma.knowledgeAsset.create({
      data: {
        title,
        type,
        description,
        file,
        url,
        publicServices: serviceIds ? { connect: serviceIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        ecosystems: ecosystemIds ? { connect: ecosystemIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        eventResources: eventResourceIds ? { connect: eventResourceIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
      },
      include: { publicServices: true, ecosystems: true, eventResources: true }
    });
    res.status(201).json(item);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Event Resources
app.get('/api/event-resources', async (req, res) => {
  try {
    const items = await prisma.eventResource.findMany({
      include: { ecosystems: true, publicServices: true },
      orderBy: { startDate: 'desc' }
    });
    res.json(items);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/event-resources', async (req, res) => {
  try {
    const { title, description, type, startDate, endDate, location, ecosystemIds, serviceIds } = req.body;
    const item = await prisma.eventResource.create({
      data: {
        title,
        description,
        type,
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : null,
        location,
        ecosystems: ecosystemIds ? { connect: ecosystemIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        publicServices: serviceIds ? { connect: serviceIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
      },
      include: { ecosystems: true, publicServices: true }
    });
    res.status(201).json(item);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Action Instances (Engagements)
app.get('/api/action-instances', async (req, res) => {
  try {
    const items = await prisma.actionInstance.findMany({
      include: { beneficiary: true, journey: true, ecosystem: true, deliveries: { include: { service: true } } },
      orderBy: { startDate: 'desc' }
    });
    res.json(items);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/action-instances', async (req, res) => {
  try {
    const { title, objective, startDate, endDate, status, beneficiaryId, journeyId, ecosystemId } = req.body;
    const item = await prisma.actionInstance.create({
      data: {
        title,
        objective,
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : null,
        status: status || 'PLANNED',
        beneficiaryId: parseInt(beneficiaryId),
        journeyId: journeyId ? parseInt(journeyId) : null,
        ecosystemId: ecosystemId ? parseInt(ecosystemId) : null
      },
      include: { beneficiary: true, journey: true, ecosystem: true }
    });
    res.status(201).json(item);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/action-instances/:id', async (req, res) => {
  try {
    const { title, objective, startDate, endDate, status, journeyId, ecosystemId } = req.body;
    const item = await prisma.actionInstance.update({
      where: { id: parseInt(req.params.id) },
      data: {
        title,
        objective,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate !== undefined ? (endDate ? new Date(endDate) : null) : undefined,
        status,
        journeyId: journeyId !== undefined ? (journeyId ? parseInt(journeyId) : null) : undefined,
        ecosystemId: ecosystemId !== undefined ? (ecosystemId ? parseInt(ecosystemId) : null) : undefined
      },
      include: { beneficiary: true, journey: true, ecosystem: true }
    });
    res.json(item);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Journey Enrollments (Suivi de parcours)
app.get('/api/journey-enrollments', async (req, res) => {
  try {
    const items = await prisma.journeyEnrollment.findMany({
      include: { beneficiary: true, journey: true, currentStage: true },
      orderBy: { startDate: 'desc' }
    });
    res.json(items);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/journey-enrollments', async (req, res) => {
  try {
    const { startDate, endDate, status, completionRate, beneficiaryId, journeyId, currentStageId } = req.body;
    const item = await prisma.journeyEnrollment.create({
      data: {
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : null,
        status: status || 'ENROLLED',
        completionRate: completionRate ? parseFloat(completionRate) : 0.0,
        beneficiaryId: parseInt(beneficiaryId),
        journeyId: parseInt(journeyId),
        currentStageId: currentStageId ? parseInt(currentStageId) : null
      },
      include: { beneficiary: true, journey: true, currentStage: true }
    });
    res.status(201).json(item);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/journey-enrollments/:id', async (req, res) => {
  try {
    const { startDate, endDate, status, completionRate, currentStageId } = req.body;
    const item = await prisma.journeyEnrollment.update({
      where: { id: parseInt(req.params.id) },
      data: {
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate !== undefined ? (endDate ? new Date(endDate) : null) : undefined,
        status,
        completionRate: completionRate ? parseFloat(completionRate) : undefined,
        currentStageId: currentStageId !== undefined ? (currentStageId ? parseInt(currentStageId) : null) : undefined
      },
      include: { beneficiary: true, journey: true, currentStage: true }
    });
    res.json(item);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Territories
app.get('/api/territories', async (req, res) => {
  try {
    const items = await prisma.territory.findMany({
      include: { parentTerritory: true, childTerritories: true },
      orderBy: { name: 'asc' }
    });
    res.json(items);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/territories', async (req, res) => {
  try {
    const { name, type, code, parentTerritoryId, description } = req.body;
    const item = await prisma.territory.create({
      data: {
        name,
        type,
        code,
        parentTerritoryId: parentTerritoryId ? parseInt(parentTerritoryId) : null,
        description
      }
    });
    res.status(201).json(item);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/territories/:id', async (req, res) => {
  try {
    const { name, type, code, parentTerritoryId, description } = req.body;
    const item = await prisma.territory.update({
      where: { id: parseInt(req.params.id) },
      data: {
        name,
        type,
        code,
        parentTerritoryId: parentTerritoryId !== undefined ? (parentTerritoryId ? parseInt(parentTerritoryId) : null) : undefined,
        description
      }
    });
    res.json(item);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Interventions
app.get('/api/interventions', async (req, res) => {
  try {
    const items = await prisma.intervention.findMany({
      include: { interventionType: true, ownerOrganization: true, publicService: true },
      orderBy: { title: 'asc' }
    });
    res.json(items);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/interventions', async (req, res) => {
  try {
    const { title, description, uri, interventionTypeId, ownerOrganizationId } = req.body;
    const item = await prisma.intervention.create({
      data: {
        title,
        description,
        uri: uri || `https://pit.wallonie.be/id/intervention/${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        interventionTypeId: parseInt(interventionTypeId),
        ownerOrganizationId: parseInt(ownerOrganizationId)
      },
      include: { interventionType: true, ownerOrganization: true }
    });
    res.status(201).json(item);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- STRATEGIES ---
app.get('/api/strategies', async (req, res) => {
  const now = Date.now();
  if (cachedStrategies && (now - cachedStrategiesTime < CACHE_TTL_MS)) {
    return res.json(cachedStrategies);
  }
  try {
    const items = await prisma.strategy.findMany({
      include: {
        ownerOrganization: true,
        priorities: {
          include: {
            programs: true,
            measures: true
          }
        },
        programs: {
          include: {
            measures: {
              include: {
                initiatives: true
              }
            }
          }
        },
        filieresS3: true,
        fundingInstruments: true
      },
      orderBy: { name: 'asc' }
    });
    cachedStrategies = items;
    cachedStrategiesTime = now;
    res.json(items);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/strategies/:id', async (req, res) => {
  try {
    const item = await prisma.strategy.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        ownerOrganization: true,
        priorities: {
          include: {
            programs: true,
            measures: true,
            initiatives: true
          }
        },
        programs: {
          include: {
            measures: {
              include: {
                initiatives: true
              }
            },
            participations: {
              include: { organization: true }
            }
          }
        },
        filieresS3: true,
        fundingInstruments: true
      }
    });
    if (!item) return res.status(404).json({ error: 'Stratégie non trouvée' });
    res.json(item);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/strategies', async (req, res) => {
  try {
    const { name, code, description, ownerOrganizationId, startDate, endDate, status, website, filiereS3Ids, fundingIds } = req.body;
    const item = await prisma.strategy.create({
      data: {
        name,
        code,
        description,
        ownerOrganizationId: ownerOrganizationId ? parseInt(ownerOrganizationId) : null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        status: status || 'ACTIVE',
        website,
        filieresS3: filiereS3Ids ? { connect: filiereS3Ids.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        fundingInstruments: fundingIds ? { connect: fundingIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        uri: `https://pit.wallonie.be/id/strategy/${(code || name).toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
      },
      include: { ownerOrganization: true }
    });
    res.status(201).json(item);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/strategies/:id', async (req, res) => {
  try {
    const { name, code, description, ownerOrganizationId, startDate, endDate, status, website, filiereS3Ids, fundingIds } = req.body;
    const item = await prisma.strategy.update({
      where: { id: parseInt(req.params.id) },
      data: {
        name,
        code,
        description,
        ownerOrganizationId: ownerOrganizationId !== undefined ? (ownerOrganizationId ? parseInt(ownerOrganizationId) : null) : undefined,
        startDate: startDate !== undefined ? (startDate ? new Date(startDate) : null) : undefined,
        endDate: endDate !== undefined ? (endDate ? new Date(endDate) : null) : undefined,
        status,
        website,
        filieresS3: filiereS3Ids ? { set: filiereS3Ids.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        fundingInstruments: fundingIds ? { set: fundingIds.map((id: any) => ({ id: parseInt(id) })) } : undefined
      },
      include: { ownerOrganization: true }
    });
    res.json(item);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- STRATEGIC PRIORITIES ---
app.post('/api/strategic-priorities', async (req, res) => {
  try {
    const { strategyId, code, name, description, status } = req.body;
    const item = await prisma.strategicPriority.create({
      data: {
        strategyId: parseInt(strategyId),
        code,
        name,
        description,
        status: status || 'ACTIVE'
      }
    });
    res.status(201).json(item);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/strategic-priorities/:id', async (req, res) => {
  try {
    const { code, name, description, status } = req.body;
    const item = await prisma.strategicPriority.update({
      where: { id: parseInt(req.params.id) },
      data: { code, name, description, status }
    });
    res.json(item);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- PROGRAMS ---
app.get('/api/programs', async (req, res) => {
  try {
    const items = await prisma.program.findMany({
      include: { strategies: true, priorities: true, ownerOrganization: true, measures: true, territories: true },
      orderBy: { name: 'asc' }
    });
    res.json(items);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/programs', async (req, res) => {
  try {
    const { name, code, description, ownerOrganizationId, startDate, endDate, budget, status, strategyIds, priorityIds, territoryIds } = req.body;
    const item = await prisma.program.create({
      data: {
        name,
        code,
        description,
        ownerOrganizationId: ownerOrganizationId ? parseInt(ownerOrganizationId) : null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        budget: budget ? parseFloat(budget) : null,
        status: status || 'PLANNED',
        strategies: strategyIds ? { connect: strategyIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        priorities: priorityIds ? { connect: priorityIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        territories: territoryIds ? { connect: territoryIds.map((id: any) => ({ id: parseInt(id) })) } : undefined
      },
      include: { ownerOrganization: true }
    });
    res.status(201).json(item);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/programs/:id', async (req, res) => {
  try {
    const { name, code, description, ownerOrganizationId, startDate, endDate, budget, status, strategyIds, priorityIds, territoryIds } = req.body;
    const item = await prisma.program.update({
      where: { id: parseInt(req.params.id) },
      data: {
        name,
        code,
        description,
        ownerOrganizationId: ownerOrganizationId !== undefined ? (ownerOrganizationId ? parseInt(ownerOrganizationId) : null) : undefined,
        startDate: startDate !== undefined ? (startDate ? new Date(startDate) : null) : undefined,
        endDate: endDate !== undefined ? (endDate ? new Date(endDate) : null) : undefined,
        budget: budget !== undefined ? (budget ? parseFloat(budget) : null) : undefined,
        status,
        strategies: strategyIds ? { set: strategyIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        priorities: priorityIds ? { set: priorityIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        territories: territoryIds ? { set: territoryIds.map((id: any) => ({ id: parseInt(id) })) } : undefined
      },
      include: { ownerOrganization: true }
    });
    res.json(item);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- MEASURES ---
app.get('/api/measures', async (req, res) => {
  try {
    const items = await prisma.measure.findMany({
      include: { programs: true, priorities: true, initiatives: true },
      orderBy: { name: 'asc' }
    });
    res.json(items);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/measures', async (req, res) => {
  try {
    const { name, code, description, budget, status, programIds, priorityIds } = req.body;
    const item = await prisma.measure.create({
      data: {
        name,
        code,
        description,
        budget: budget ? parseFloat(budget) : null,
        status: status || 'ACTIVE',
        programs: programIds ? { connect: programIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        priorities: priorityIds ? { connect: priorityIds.map((id: any) => ({ id: parseInt(id) })) } : undefined
      }
    });
    res.status(201).json(item);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/measures/:id', async (req, res) => {
  try {
    const { name, code, description, budget, status, programIds, priorityIds } = req.body;
    const item = await prisma.measure.update({
      where: { id: parseInt(req.params.id) },
      data: {
        name,
        code,
        description,
        budget: budget !== undefined ? (budget ? parseFloat(budget) : null) : undefined,
        status,
        programs: programIds ? { set: programIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        priorities: priorityIds ? { set: priorityIds.map((id: any) => ({ id: parseInt(id) })) } : undefined
      }
    });
    res.json(item);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- INITIATIVES ---
app.get('/api/initiatives', async (req, res) => {
  try {
    const items = await prisma.initiative.findMany({
      include: { measure: true, leadOrganization: true, publicServices: true, territories: true },
      orderBy: { name: 'asc' }
    });
    res.json(items);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/initiatives', async (req, res) => {
  try {
    const { measureId, name, code, description, leadOrganizationId, startDate, endDate, status, priorityIds, ecosystemIds, filiereIds, territoryIds, serviceIds } = req.body;
    const item = await prisma.initiative.create({
      data: {
        measureId: parseInt(measureId),
        name,
        code,
        description,
        leadOrganizationId: leadOrganizationId ? parseInt(leadOrganizationId) : null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        status: status || 'PLANNED',
        priorities: priorityIds ? { connect: priorityIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        ecosystems: ecosystemIds ? { connect: ecosystemIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        filieresS3: filiereIds ? { connect: filiereIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        territories: territoryIds ? { connect: territoryIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        publicServices: serviceIds ? { connect: serviceIds.map((id: any) => ({ id: parseInt(id) })) } : undefined
      },
      include: { leadOrganization: true }
    });
    res.status(201).json(item);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/initiatives/:id', async (req, res) => {
  try {
    const { name, code, description, leadOrganizationId, startDate, endDate, status, priorityIds, ecosystemIds, filiereIds, territoryIds, serviceIds } = req.body;
    const item = await prisma.initiative.update({
      where: { id: parseInt(req.params.id) },
      data: {
        name,
        code,
        description,
        leadOrganizationId: leadOrganizationId !== undefined ? (leadOrganizationId ? parseInt(leadOrganizationId) : null) : undefined,
        startDate: startDate !== undefined ? (startDate ? new Date(startDate) : null) : undefined,
        endDate: endDate !== undefined ? (endDate ? new Date(endDate) : null) : undefined,
        status,
        priorities: priorityIds ? { set: priorityIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        ecosystems: ecosystemIds ? { set: ecosystemIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        filieresS3: filiereIds ? { set: filiereIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        territories: territoryIds ? { set: territoryIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        publicServices: serviceIds ? { set: serviceIds.map((id: any) => ({ id: parseInt(id) })) } : undefined
      },
      include: { leadOrganization: true }
    });
    res.json(item);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- PARTICIPATIONS ---
app.post('/api/program-participations', async (req, res) => {
  try {
    const { programId, organizationId, role, startDate, endDate, status } = req.body;
    const item = await prisma.programParticipation.create({
      data: {
        programId: parseInt(programId),
        organizationId: parseInt(organizationId),
        role,
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : null,
        status: status || 'ACTIVE'
      }
    });
    res.status(201).json(item);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/initiative-participations', async (req, res) => {
  try {
    const { initiativeId, organizationId, role, startDate, endDate, status } = req.body;
    const item = await prisma.initiativeParticipation.create({
      data: {
        initiativeId: parseInt(initiativeId),
        organizationId: parseInt(organizationId),
        role,
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : null,
        status: status || 'ACTIVE'
      }
    });
    res.status(201).json(item);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- BENEFICIARY ENGAGEMENTS ---
app.get('/api/beneficiary-engagements', async (req, res) => {
  try {
    const items = await prisma.beneficiaryEngagement.findMany({
      include: { beneficiary: true, initiative: true, ecosystem: true, territory: true, filieresS3: true },
      orderBy: { startDate: 'desc' }
    });
    res.json(items);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/beneficiary-engagements', async (req, res) => {
  try {
    const { beneficiaryId, journeyId, initiativeId, ecosystemId, territoryId, title, objective, status, startDate, endDate, filiereIds } = req.body;
    const item = await prisma.beneficiaryEngagement.create({
      data: {
        beneficiaryId: parseInt(beneficiaryId),
        journeyId: journeyId ? parseInt(journeyId) : null,
        initiativeId: initiativeId ? parseInt(initiativeId) : null,
        ecosystemId: ecosystemId ? parseInt(ecosystemId) : null,
        territoryId: territoryId ? parseInt(territoryId) : null,
        title,
        objective,
        status: status || 'PLANNED',
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : null,
        filieresS3: filiereIds ? { connect: filiereIds.map((id: any) => ({ id: parseInt(id) })) } : undefined
      },
      include: { beneficiary: true, initiative: true }
    });
    res.status(201).json(item);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/beneficiary-engagements/:id', async (req, res) => {
  try {
    const { title, objective, status, startDate, endDate, initiativeId, ecosystemId, territoryId, filiereIds } = req.body;
    const item = await prisma.beneficiaryEngagement.update({
      where: { id: parseInt(req.params.id) },
      data: {
        title,
        objective,
        status,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate !== undefined ? (endDate ? new Date(endDate) : null) : undefined,
        initiativeId: initiativeId !== undefined ? (initiativeId ? parseInt(initiativeId) : null) : undefined,
        ecosystemId: ecosystemId !== undefined ? (ecosystemId ? parseInt(ecosystemId) : null) : undefined,
        territoryId: territoryId !== undefined ? (territoryId ? parseInt(territoryId) : null) : undefined,
        filieresS3: filiereIds ? { set: filiereIds.map((id: any) => ({ id: parseInt(id) })) } : undefined
      },
      include: { beneficiary: true, initiative: true }
    });
    res.json(item);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- OUTCOME INDICATORS ---
app.get('/api/outcome-indicators', async (req, res) => {
  try {
    const items = await prisma.outcomeIndicator.findMany({
      orderBy: { name: 'asc' }
    });
    res.json(items);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/outcome-indicators', async (req, res) => {
  try {
    const { name, unit, description } = req.body;
    const item = await prisma.outcomeIndicator.create({
      data: { name, unit, description }
    });
    res.status(201).json(item);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- IMPACTS ---
app.get('/api/impacts', async (req, res) => {
  try {
    const items = await prisma.impact.findMany({
      include: { beneficiary: true, indicator: true, territory: true, valueChain: true },
      orderBy: { date: 'desc' }
    });
    res.json(items);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/impacts', async (req, res) => {
  try {
    const { beneficiaryId, indicatorId, numericValue, textValue, territoryId, valueChainId, date, evidence } = req.body;
    const item = await prisma.impact.create({
      data: {
        beneficiaryId: parseInt(beneficiaryId),
        indicatorId: parseInt(indicatorId),
        numericValue: numericValue ? parseFloat(numericValue) : null,
        textValue,
        territoryId: territoryId ? parseInt(territoryId) : null,
        valueChainId: valueChainId ? parseInt(valueChainId) : null,
        date: date ? new Date(date) : new Date(),
        evidence
      },
      include: { beneficiary: true, indicator: true }
    });
    res.status(201).json(item);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/impacts/:id', async (req, res) => {
  try {
    const { numericValue, textValue, territoryId, valueChainId, date, evidence } = req.body;
    const item = await prisma.impact.update({
      where: { id: parseInt(req.params.id) },
      data: {
        numericValue: numericValue !== undefined ? (numericValue ? parseFloat(numericValue) : null) : undefined,
        textValue,
        territoryId: territoryId !== undefined ? (territoryId ? parseInt(territoryId) : null) : undefined,
        valueChainId: valueChainId !== undefined ? (valueChainId ? parseInt(valueChainId) : null) : undefined,
        date: date ? new Date(date) : undefined,
        evidence
      },
      include: { beneficiary: true, indicator: true }
    });
    res.json(item);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- FUNDING INSTRUMENTS ---
app.get('/api/funding-instruments', async (req, res) => {
  try {
    const items = await prisma.fundingInstrument.findMany({
      include: { strategies: true, programs: true, measures: true, initiatives: true },
      orderBy: { name: 'asc' }
    });
    res.json(items);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/funding-instruments', async (req, res) => {
  try {
    const { name, type, description, strategyIds, programIds, measureIds, initiativeIds } = req.body;
    const item = await prisma.fundingInstrument.create({
      data: {
        name,
        type,
        description,
        strategies: strategyIds ? { connect: strategyIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        programs: programIds ? { connect: programIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        measures: measureIds ? { connect: measureIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        initiatives: initiativeIds ? { connect: initiativeIds.map((id: any) => ({ id: parseInt(id) })) } : undefined
      }
    });
    res.status(201).json(item);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- PILOTAGE DASHBOARD (ANALYTICS) ---
app.get('/api/pilotage', async (req, res) => {
  const filiereId = req.query.filiereS3Id ? parseInt(req.query.filiereS3Id as string) : undefined;
  const territoryId = req.query.territoryId ? parseInt(req.query.territoryId as string) : undefined;

  const now = Date.now();
  if (!filiereId && !territoryId && cachedPilotage && (now - cachedPilotageTime < CACHE_TTL_MS)) {
    return res.json(cachedPilotage);
  }

  try {
    const beneficiaryWhere: any = {};
    const impactWhere: any = {};
    const initiativeWhere: any = {};

    if (filiereId) {
      beneficiaryWhere.filieresS3 = { some: { id: filiereId } };
      impactWhere.valueChainId = filiereId;
      initiativeWhere.filieresS3 = { some: { id: filiereId } };
    }

    if (territoryId) {
      beneficiaryWhere.territoryId = territoryId;
      impactWhere.territoryId = territoryId;
      initiativeWhere.territories = { some: { id: territoryId } };
    }

    const [
      strategiesCount,
      programsCount,
      measuresCount,
      initiativesCount,
      totalBudgetAgg,
      beneficiariesCount,
      impactsCount,
      allImpacts,
      allBeneficiaries,
      allValueChains,
      allIndicators
    ] = await Promise.all([
      prisma.strategy.count(),
      prisma.program.count(),
      prisma.measure.count(),
      prisma.initiative.count({ where: initiativeWhere }),
      prisma.program.aggregate({ _sum: { budget: true } }),
      prisma.beneficiary.count({ where: beneficiaryWhere }),
      prisma.impact.count({ where: impactWhere }),
      prisma.impact.findMany({
        where: impactWhere,
        include: { beneficiary: true, indicator: true, territory: true, valueChain: true },
        orderBy: { date: 'desc' }
      }),
      prisma.beneficiary.findMany({
        where: beneficiaryWhere,
        include: { territory: true, primaryNaceSector: true, filieresS3: true }
      }),
      prisma.strategicValueChain.findMany({
        include: { _count: { select: { beneficiaries: true, services: true, impacts: true } } }
      }),
      prisma.outcomeIndicator.findMany()
    ]);

    const indicatorSummary = allIndicators.map(ind => {
      const relatedImpacts = allImpacts.filter(imp => imp.indicatorId === ind.id);
      const totalNumeric = relatedImpacts.reduce((sum, imp) => sum + (imp.numericValue || 0), 0);
      const qualitativeText = relatedImpacts.filter(imp => imp.textValue).map(imp => `${imp.beneficiary.name}: ${imp.textValue}`);
      return {
        id: ind.id,
        name: ind.name,
        unit: ind.unit,
        totalValue: totalNumeric,
        impactsCount: relatedImpacts.length,
        examples: qualitativeText.slice(0, 5)
      };
    });

    const provinceDistribution: Record<string, { beneficiaries: number, impacts: number }> = {};
    allBeneficiaries.forEach(b => {
      const prov = b.province || 'Non localisé';
      if (!provinceDistribution[prov]) provinceDistribution[prov] = { beneficiaries: 0, impacts: 0 };
      provinceDistribution[prov].beneficiaries++;
    });
    allImpacts.forEach(imp => {
      const prov = imp.territory?.name || 'Wallonie';
      if (!provinceDistribution[prov]) provinceDistribution[prov] = { beneficiaries: 0, impacts: 0 };
      provinceDistribution[prov].impacts++;
    });

    const valueChainStats = allValueChains.map(vc => ({
      id: vc.id,
      name: vc.name,
      beneficiariesCount: vc._count.beneficiaries,
      servicesCount: vc._count.services,
      impactsCount: vc._count.impacts
    }));

    const result = {
      kpis: {
        strategiesCount,
        programsCount,
        measuresCount,
        initiativesCount,
        totalBudget: totalBudgetAgg._sum.budget || 0,
        beneficiariesCount,
        impactsCount
      },
      indicatorSummary,
      provinceDistribution,
      valueChainStats,
      latestImpacts: allImpacts.slice(0, 10).map(imp => ({
        id: imp.id,
        beneficiaryName: imp.beneficiary.name,
        indicatorName: imp.indicator.name,
        value: imp.numericValue !== null ? `${imp.numericValue} ${imp.indicator.unit}` : imp.textValue,
        territoryName: imp.territory?.name || 'Wallonie',
        valueChainName: imp.valueChain?.name || 'Transverse',
        date: imp.date
      }))
    };

    if (!filiereId && !territoryId) {
      cachedPilotage = result;
      cachedPilotageTime = now;
    }

    res.json(result);
  } catch (err: any) {
    console.error('Erreur API pilotage:', err);
    res.status(500).json({ error: err.message });
  }
});

// Démarrer le serveur
const server = app.listen(port, () => {
  console.log(`🚀 Serveur du Lab CPSV-AP lancé avec succès sur http://localhost:${port}`);
});

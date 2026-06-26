import fs from 'fs';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import compression from 'compression';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const app = express();
const port = process.env.PORT || 3001;
const prisma = new PrismaClient();

app.use(compression());

// Middleware pour parser le JSON et encoder les requêtes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques du frontend (utilisation de process.cwd() pour la compatibilité avec la compilation)
app.use(express.static(path.join(process.cwd(), 'public')));

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
      fundingInstruments,
      ecosystemChallenges,
      fundingPrograms,
      fundingCalls,
      fundingAwards
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
        include: { strategies: true, priorities: true, ownerOrganization: true, measures: true },
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
      }),
      prisma.ecosystemChallenge.findMany({
        where: { status: { not: 'ARCHIVED' } },
        orderBy: { title: 'asc' }
      }),
      prisma.fundingProgram.findMany({
        orderBy: { name: 'asc' }
      }),
      prisma.fundingCall.findMany({
        orderBy: { name: 'asc' }
      }),
      prisma.fundingAward.findMany({
        orderBy: { date: 'desc' }
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
      fundingInstruments,
      ecosystemChallenges,
      fundingPrograms,
      fundingCalls,
      fundingAwards
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

    // DUAL WRITE: Création dans la table vNext 'Activity' (Type: COLLECTIVE)
    try {
      await prisma.activity.create({
        data: {
          activityType: 'COLLECTIVE',
          serviceId: parseInt(serviceId),
          title,
          status: status || 'PLANNED',
          date: date ? new Date(date) : new Date(),
          operatorId: parseInt(operatorId),
          participantsCount: participantsCount ? parseInt(participantsCount) : 0,
          companiesCount: companiesCount ? parseInt(companiesCount) : 0,
          satisfactionScore: satisfactionScore ? parseFloat(satisfactionScore) : null,
          leadsCount: leadsCount ? parseInt(leadsCount) : 0,
          nextSteps,
          notes,
          companies: companyIds && Array.isArray(companyIds) ? {
            connect: companyIds.map((id: any) => ({ id: parseInt(id) }))
          } : undefined
        }
      });
      console.log(`[Dual-Write] Activité collective créée pour le service ${serviceId}`);
    } catch (dwError) {
      console.error('[Dual-Write Error] Échec de la double-écriture de l\'activité collective:', dwError);
    }

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
      where: { status: { not: 'ARCHIVED' } },
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
      where: { status: { not: 'ARCHIVED' } },
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
    if (!item || item.status === 'ARCHIVED') return res.status(404).json({ error: 'Bénéficiaire non trouvé' });
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
    if (!item || item.status === 'ARCHIVED') return res.status(404).json({ error: 'Bénéficiaire non trouvé' });
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
      territories,
      ecosystemChallenges,
      fundingPrograms,
      fundingCalls,
      fundingAwards
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
        include: { strategies: true, priorities: true, ownerOrganization: true, measures: true, territories: true }
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
        include: { strategies: true, programs: true, measures: true, initiatives: true, services: true, beneficiaries: true, call: true }
      }),
      prisma.territory.findMany({
        include: { parentTerritory: true }
      }),
      prisma.ecosystemChallenge.findMany({
        include: { communities: true, valueChains: true, filieres: true, programs: true, opportunities: true, services: true, projects: true, outcomes: true }
      }),
      prisma.fundingProgram.findMany({
        include: { calls: true }
      }),
      prisma.fundingCall.findMany({
        include: { program: true, communities: true, filieres: true, valueChains: true, opportunities: true, beneficiaries: true, consortia: true, projects: true, instruments: true }
      }),
      prisma.fundingAward.findMany({
        include: { project: true, instrument: true }
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
      if (fi.callId) {
        addEdge(`fundingcall-${fi.callId}`, fiId, 'PROPOSE_INSTRUMENT');
      }
    }

    // 20. Ecosystem Challenges
    for (const ec of ecosystemChallenges) {
      const ecId = `ecosystemchallenge-${ec.id}`;
      addNode(ecId, ec.title, 'ecosystemchallenge', { type: ec.type, status: ec.status, priority: ec.priority, territory: ec.territory });

      for (const c of ec.communities) addEdge(`community-${c.id}`, ecId, 'CONCERNEE_PAR');
      for (const vc of ec.valueChains) addEdge(`valuechain-${vc.id}`, ecId, 'IMPACTEE_PAR');
      for (const f of ec.filieres) addEdge(`filiere-${f.id}`, ecId, 'IMPACTEE_PAR');
      for (const s of ec.services) addEdge(`service-${s.id}`, ecId, 'ADRESSE');
      for (const p of ec.projects) addEdge(ecId, `project-${p.id}`, 'CONTRIBUE_A_RESOLUDRE');
      for (const o of ec.outcomes) addEdge(ecId, `outcome-${o.id}`, 'DEMONTRE_RESOLUTION');
    }

    // 21. Funding Programs
    for (const fp of fundingPrograms) {
      const fpId = `fundingprogram-${fp.id}`;
      addNode(fpId, fp.name, 'fundingprogram', { description: fp.description });
    }

    // 22. Funding Calls
    for (const fc of fundingCalls) {
      const fcId = `fundingcall-${fc.id}`;
      addNode(fcId, fc.name, 'fundingcall', { status: fc.status, deadline: fc.deadline });
      addEdge(`fundingprogram-${fc.programId}`, fcId, 'CONTIENT_APPEL');

      for (const c of fc.communities) addEdge(fcId, `community-${c.id}`, 'CIBLE_COMMUNAUTE');
      for (const f of fc.filieres) addEdge(fcId, `filiere-${f.id}`, 'CIBLE_FILIERE');
      for (const vc of fc.valueChains) addEdge(fcId, `valuechain-${vc.id}`, 'CIBLE_VALCHAIN');
      for (const o of fc.opportunities) addEdge(fcId, `opportunity-${o.id}`, 'GENERE_OPPORTUNITE');
      for (const b of fc.beneficiaries) addEdge(fcId, `beneficiary-${b.id}`, 'FINANCE_BENEFICIAIRE');
      for (const c of fc.consortia) addEdge(fcId, `consortium-${c.id}`, 'FINANCE_CONSORTIUM');
      for (const p of fc.projects) addEdge(fcId, `project-${p.id}`, 'FINANCE_PROJET');
    }

    // 23. Funding Awards
    for (const fa of fundingAwards) {
      const faId = `fundingaward-${fa.id}`;
      addNode(faId, `${fa.amount.toLocaleString()} €`, 'fundingaward', { amount: fa.amount, date: fa.date, status: fa.status });
      if (fa.instrumentId) {
        addEdge(`funding-${fa.instrumentId}`, faId, 'OCTROIE_AWARD');
      }
      if (fa.projectId) {
        addEdge(faId, `project-${fa.projectId}`, 'FINANCE_PROJET');
      }
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
    const { title, objective, startDate, endDate, status, beneficiaryId, journeyId, ecosystemId, projectId } = req.body;
    const item = await prisma.actionInstance.create({
      data: {
        title,
        objective,
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : null,
        status: status || 'PLANNED',
        beneficiaryId: parseInt(beneficiaryId),
        journeyId: journeyId ? parseInt(journeyId) : null,
        ecosystemId: ecosystemId ? parseInt(ecosystemId) : null,
        projectId: projectId ? parseInt(projectId) : null
      },
      include: { beneficiary: true, journey: true, ecosystem: true }
    });

    // DUAL WRITE: Création dans la table vNext 'Action'
    try {
      await prisma.action.create({
        data: {
          title,
          objective,
          startDate: startDate ? new Date(startDate) : new Date(),
          endDate: endDate ? new Date(endDate) : null,
          status: status || 'PLANNED',
          projectId: projectId ? parseInt(projectId) : null
        }
      });
      console.log(`[Dual-Write] Action créée en correspondance avec l'actionInstance.`);
    } catch (dwError) {
      console.error('[Dual-Write Error] Échec de la double-écriture de l\'Action:', dwError);
    }

    res.status(201).json(item);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/action-instances/:id', async (req, res) => {
  try {
    const { title, objective, startDate, endDate, status, journeyId, ecosystemId } = req.body;

    const originalInstance = await prisma.actionInstance.findUnique({ where: { id: parseInt(req.params.id) } });

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

    // DUAL WRITE: Mise à jour dans la table vNext 'Action'
    if (originalInstance) {
      try {
        await prisma.action.updateMany({
          where: {
            title: originalInstance.title,
            projectId: originalInstance.projectId
          },
          data: {
            title: title !== undefined ? title : undefined,
            objective: objective !== undefined ? objective : undefined,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate !== undefined ? (endDate ? new Date(endDate) : null) : undefined,
            status: status !== undefined ? status : undefined
          }
        });
        console.log(`[Dual-Write] Action mise à jour en correspondance.`);
      } catch (dwError) {
        console.error('[Dual-Write Error] Échec de la mise à jour de l\'Action:', dwError);
      }
    }

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

// ==========================================
// --- API CORE V2 ROUTER (v2.5.0) ---
// ==========================================

const v2Router = express.Router();

// Middleware de permissions v2
v2Router.use((req, res, next) => {
  if (['GET', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  const role = (req.headers['x-user-role'] as string || '').toUpperCase();
  console.log(`🔒 [Middleware Permissions] Route: ${req.method} ${req.path}, Rôle détecté: ${role}`);

  if (role === 'ADMIN') {
    return next();
  }

  const path = req.path.toLowerCase();

  if (
    path.startsWith('/members') ||
    path.startsWith('/challenges') ||
    path.startsWith('/communities') ||
    path.startsWith('/consortia') ||
    path.startsWith('/projects') ||
    path.startsWith('/events') ||
    path.startsWith('/opportunities') ||
    path.startsWith('/programs') ||
    path.startsWith('/strategic-priorities') ||
    path.startsWith('/initiatives') ||
    path.startsWith('/actions') ||
    path.startsWith('/filieres') ||
    path.startsWith('/value-chains') ||
    path.startsWith('/value-chain-segments') ||
    path.startsWith('/services') ||
    path.startsWith('/challenge-categories') ||
    path.startsWith('/capabilities') ||
    path.startsWith('/nace-sectors')
  ) {
    if (role === 'ANIMATEUR') {
      return next();
    }
    if (role === 'STEWARD') {
      return next();
    }
    if (path.startsWith('/challenges') && role === 'ENTREPRISE') {
      return next();
    }
  }

  if (
    path.startsWith('/beneficiaries') ||
    path.startsWith('/journeys') ||
    path.startsWith('/journey-instances') ||
    path.startsWith('/journey-progress') ||
    path.startsWith('/evidences') ||
    path.startsWith('/activities') ||
    path.startsWith('/outcomes') ||
    path.startsWith('/participations') ||
    path.startsWith('/attendances') ||
    path.startsWith('/service-deliveries')
  ) {
    if (role === 'CONSEILLER') {
      return next();
    }
    if (path.includes('/evidences') && path.includes('/status') && role === 'DG') {
      return next();
    }
  }

  return res.status(403).json({ error: "Accès refusé: Rôle ou permissions insuffisantes." });
});

// --- PAGINATION HELPERS ---
const getPagination = (req: express.Request) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 10;
  const skip = (page - 1) * pageSize;
  return { page, pageSize, skip };
};

const sendCollection = (res: express.Response, data: any[], total: number, page: number, pageSize: number) => {
  const totalPages = Math.ceil(total / pageSize) || 0;
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;
  res.json({
    data,
    meta: {
      page,
      pageSize,
      total,
      totalPages,
      hasNextPage,
      hasPreviousPage
    }
  });
};

// --- DR-BEST & S3 FILTER BUILDER ---
const buildFilters = (req: express.Request, type: 'service' | 'journey' | 'program' | 'project') => {
  const where: any = {};
  const { q, drbest, s3Domain, valueChain, valueChainStage } = req.query;

  // Search q
  if (q && typeof q === 'string') {
    if (type === 'service') {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { code: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } }
      ];
    } else if (type === 'journey') {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { objective: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } }
      ];
    } else if (type === 'program' || type === 'project') {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { code: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } }
      ];
    }
  }

  // DR-BEST
  if (drbest && typeof drbest === 'string') {
    const codeMap: Record<string, string> = {
      DATA: 'D',
      REMOTE: 'R',
      BUSINESS: 'B',
      ECOSYSTEM: 'E',
      SKILLS: 'S',
      TECHNOLOGY: 'T'
    };
    const code = codeMap[drbest.toUpperCase()];
    if (code) {
      where.transformationDimensions = {
        some: { code }
      };
    }
  }

  // S3 Filters
  if (type === 'service') {
    if (s3Domain) {
      where.stages = { some: { valueChain: { s3DomainId: parseInt(s3Domain as string) } } };
    } else if (valueChain) {
      where.stages = { some: { valueChainId: parseInt(valueChain as string) } };
    } else if (valueChainStage) {
      where.stages = { some: { id: parseInt(valueChainStage as string) } };
    }
  } else if (type === 'journey') {
    if (s3Domain) {
      where.stagesTransverses = { some: { valueChain: { s3DomainId: parseInt(s3Domain as string) } } };
    } else if (valueChain) {
      where.stagesTransverses = { some: { valueChainId: parseInt(valueChain as string) } };
    } else if (valueChainStage) {
      where.stagesTransverses = { some: { id: parseInt(valueChainStage as string) } };
    }
  } else if (type === 'program') {
    if (s3Domain) {
      where.filieresS3 = { some: { strategicDomainId: parseInt(s3Domain as string) } };
    }
  } else if (type === 'project') {
    if (s3Domain) {
      where.program = { filieresS3: { some: { strategicDomainId: parseInt(s3Domain as string) } } };
    }
  }

  return where;
};

// ==========================================
// --- 0. SERVICE DELIVERY APIs ---
v2Router.get('/service-deliveries', async (req, res) => {
  const beneficiaryId = req.query.beneficiaryId ? parseInt(req.query.beneficiaryId as string) : undefined;
  const providerOrganizationId = req.query.providerOrganizationId ? parseInt(req.query.providerOrganizationId as string) : undefined;
  const operatorId = req.query.operatorId ? parseInt(req.query.operatorId as string) : undefined;
  const serviceId = req.query.serviceId ? parseInt(req.query.serviceId as string) : undefined;
  const programId = req.query.programId ? parseInt(req.query.programId as string) : undefined;
  const projectId = req.query.projectId ? parseInt(req.query.projectId as string) : undefined;
  const actionId = req.query.actionId ? parseInt(req.query.actionId as string) : undefined;
  const status = req.query.status ? (req.query.status as string) : undefined;
  const channel = req.query.channel ? (req.query.channel as string) : undefined;
  const territoryId = req.query.territoryId ? parseInt(req.query.territoryId as string) : undefined;

  const now = Date.now();
  if (!beneficiaryId && !providerOrganizationId && !operatorId && !serviceId && !programId && !projectId && !actionId && !status && !channel && !territoryId && cachedDeliveries && (now - cachedDeliveriesTime < CACHE_TTL_MS)) {
    return res.json(cachedDeliveries);
  }
  
  try {
    const where: any = {};
    if (beneficiaryId) where.beneficiaryId = beneficiaryId;
    if (serviceId) where.serviceId = serviceId;
    if (programId) where.programId = programId;
    if (projectId) where.projectId = projectId;
    if (actionId) where.actionId = actionId;
    if (status) where.status = status.toLowerCase();
    if (channel) where.channel = channel;
    
    if (providerOrganizationId || operatorId) {
      where.OR = [];
      if (providerOrganizationId) where.OR.push({ providerOrganizationId });
      if (operatorId) where.OR.push({ operatorId });
    }
    
    if (territoryId) {
      where.beneficiary = { territoryId: territoryId };
    }

    const data = await prisma.serviceDelivery.findMany({
      where,
      include: {
        beneficiary: { include: { primaryNaceSector: true } },
        service: { include: { organization: true } },
        operator: true,
        providerOrganization: true,
        contact: true,
        program: true,
        project: true,
        action: true,
        journeyStep: true,
        funding: true,
        nextRecommendedService: true,
        evidences: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    if (!beneficiaryId && !providerOrganizationId && !operatorId && !serviceId && !programId && !projectId && !actionId && !status && !channel && !territoryId) {
      cachedDeliveries = data;
      cachedDeliveriesTime = now;
    }
    
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/service-deliveries/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const item = await prisma.serviceDelivery.findUnique({
      where: { id },
      include: {
        beneficiary: { include: { primaryNaceSector: true } },
        service: { include: { organization: true } },
        operator: true,
        providerOrganization: true,
        contact: true,
        program: true,
        project: true,
        action: true,
        journeyStep: true,
        funding: true,
        nextRecommendedService: true,
        evidences: true
      }
    });
    if (!item) return res.status(404).json({ error: 'Prestation non trouvée' });
    res.json(item);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.post('/service-deliveries', async (req, res) => {
  try {
    const {
      title, description, serviceId, beneficiaryId, establishmentId, contactId,
      operatorId, providerOrganizationId, providerPersonId, programId, projectId, actionId,
      journeyId, journeyStageId, journeyStepId, businessEventId, status,
      requestDate, plannedStartDate, actualStartDate, actualEndDate,
      channel, deliveryMode, location, outputs, outputReal, outcomeReal,
      evidenceFiles, fundingId, maturityBefore, maturityAfter, maturityDelta,
      satisfactionScore, impactSummary, impact, nextRecommendedServiceId, nextStepComment,
      confidentialityLevel, dataQualityStatus, createdBy, updatedBy
    } = req.body;

    // TODO: establishmentId et providerPersonId restent temporairement sous forme de champs simples (Int). 
    // Prévoir des relations vers de vraies entités (ex: BCE LocalUnit, User/Adviser) dans une prochaine itération.

    // 1. Normalisation et contrôle du statut
    const ALLOWED_STATUSES = ['requested', 'accepted', 'planned', 'in_progress', 'delivered', 'closed', 'cancelled', 'rejected'];
    let normalizedStatus = (status || 'planned').toLowerCase();
    if (normalizedStatus === 'completed') normalizedStatus = 'closed';
    if (normalizedStatus === 'en cours') normalizedStatus = 'in_progress';
    if (normalizedStatus === 'planifié') normalizedStatus = 'planned';
    if (normalizedStatus === 'terminé') normalizedStatus = 'closed';
    if (normalizedStatus === 'annulé') normalizedStatus = 'cancelled';
    
    if (!ALLOWED_STATUSES.includes(normalizedStatus)) {
      return res.status(400).json({ error: `Statut invalide. Statuts autorisés : ${ALLOWED_STATUSES.join(', ')}` });
    }

    // 2. Duplication historique / compatibilité descendante
    let activeOperatorId = operatorId ? parseInt(operatorId) : null;
    let activeProviderOrgId = providerOrganizationId ? parseInt(providerOrganizationId) : null;
    if (activeProviderOrgId && !activeOperatorId) activeOperatorId = activeProviderOrgId;
    if (activeOperatorId && !activeProviderOrgId) activeProviderOrgId = activeOperatorId;

    let activeJourneyStageId = journeyStageId ? parseInt(journeyStageId) : null;
    let activeJourneyStepId = journeyStepId ? parseInt(journeyStepId) : null;
    if (activeJourneyStepId && !activeJourneyStageId) activeJourneyStageId = activeJourneyStepId;
    if (activeJourneyStageId && !activeJourneyStepId) activeJourneyStepId = activeJourneyStageId;

    // 3. Exécution transactionnelle
    const result = await prisma.$transaction(async (tx) => {
      // Créer la prestation
      const delivery = await tx.serviceDelivery.create({
        data: {
          title: title || "Accompagnement réalisé",
          description,
          serviceId: parseInt(serviceId),
          beneficiaryId: parseInt(beneficiaryId),
          establishmentId: establishmentId ? parseInt(establishmentId) : null,
          contactId: contactId ? parseInt(contactId) : null,
          operatorId: activeOperatorId,
          providerOrganizationId: activeProviderOrgId,
          providerPersonId: providerPersonId ? parseInt(providerPersonId) : null,
          programId: programId ? parseInt(programId) : null,
          projectId: projectId ? parseInt(projectId) : null,
          actionId: actionId ? parseInt(actionId) : null,
          journeyId: journeyId ? parseInt(journeyId) : null,
          journeyStageId: activeJourneyStageId,
          journeyStepId: activeJourneyStepId,
          businessEventId: businessEventId ? parseInt(businessEventId) : null,
          status: normalizedStatus,
          requestDate: requestDate ? new Date(requestDate) : null,
          plannedStartDate: plannedStartDate ? new Date(plannedStartDate) : null,
          actualStartDate: actualStartDate ? new Date(actualStartDate) : null,
          actualEndDate: actualEndDate ? new Date(actualEndDate) : null,
          channel,
          deliveryMode,
          location,
          outputs,
          outputReal: outputReal || outputs,
          outcomeReal,
          evidenceFiles: evidenceFiles || undefined,
          fundingId: fundingId ? parseInt(fundingId) : null,
          maturityBefore: maturityBefore || undefined,
          maturityAfter: maturityAfter || undefined,
          maturityDelta: maturityDelta || undefined,
          satisfactionScore: satisfactionScore ? parseFloat(satisfactionScore) : null,
          impactSummary,
          impact: impact || impactSummary,
          nextRecommendedServiceId: nextRecommendedServiceId ? parseInt(nextRecommendedServiceId) : null,
          nextStepComment,
          confidentialityLevel: confidentialityLevel || 'PUBLIC',
          dataQualityStatus: dataQualityStatus || 'DRAFT',
          createdBy,
          updatedBy
        },
        include: { beneficiary: true, service: true, operator: true }
      });

      // Si statut est delivered ou closed, mettre à jour dynamiquement la maturité du bénéficiaire !
      if (['delivered', 'closed'].includes(normalizedStatus) && maturityAfter) {
        const bUpdateData: any = {};
        if (maturityAfter.digital !== undefined) bUpdateData.maturityDigital = parseInt(maturityAfter.digital);
        if (maturityAfter.ia !== undefined) bUpdateData.maturityIa = parseInt(maturityAfter.ia);
        if (maturityAfter.cyber !== undefined) bUpdateData.maturityCyber = parseInt(maturityAfter.cyber);
        if (maturityAfter.export !== undefined) bUpdateData.maturityExport = parseInt(maturityAfter.export);
        if (maturityAfter.durability !== undefined) bUpdateData.maturityDurability = parseInt(maturityAfter.durability);

        await tx.beneficiary.update({
          where: { id: parseInt(beneficiaryId) },
          data: bUpdateData
        });
      }

      // DUAL WRITE: Création dans la table vNext 'Activity' (Type: INDIVIDUAL)
      const actStatus = normalizedStatus === 'closed' || normalizedStatus === 'delivered' ? 'COMPLETED'
                        : normalizedStatus === 'in_progress' ? 'IN_PROGRESS'
                        : normalizedStatus === 'planned' ? 'PLANNED' : 'CANCELLED';

      try {
        await tx.activity.create({
          data: {
            activityType: 'INDIVIDUAL',
            serviceId: parseInt(serviceId),
            status: actStatus,
            date: actualStartDate ? new Date(actualStartDate) : (plannedStartDate ? new Date(plannedStartDate) : new Date()),
            operatorId: activeOperatorId || 1,
            beneficiaryId: parseInt(beneficiaryId),
            journeyId: journeyId ? parseInt(journeyId) : null,
            journeyStageId: activeJourneyStageId,
            outputReal: outputs || outputReal,
            outcomeReal,
            impact: impactSummary || impact,
            maturityBefore: maturityBefore || undefined,
            maturityAfter: maturityAfter || undefined,
            maturityDelta: maturityDelta || undefined,
            evidenceFiles: evidenceFiles || undefined,
            actionId: actionId ? parseInt(actionId) : null,
            sourceType: "ServiceDelivery",
            sourceId: delivery.id
          }
        });
        console.log(`[Dual-Write] Activité individuelle créée pour la prestation ${delivery.id}`);
      } catch (dwError) {
        console.error('[Dual-Write Error] Échec de la double-écriture de l\'activité:', dwError);
      }

      return delivery;
    });

    res.status(201).json(result);
  } catch (error: any) {
    console.error('Erreur lors de la création de la livraison de service:', error);
    res.status(500).json({ error: error.message });
  }
});

v2Router.patch('/service-deliveries/:id', async (req, res) => {
  try {
    const deliveryId = parseInt(req.params.id);
    const {
      title, description, status, requestDate, plannedStartDate, actualStartDate, actualEndDate,
      channel, deliveryMode, location, outputs, outputReal, outcomeReal, evidenceFiles, fundingId,
      maturityBefore, maturityAfter, maturityDelta, satisfactionScore, impactSummary, impact,
      nextRecommendedServiceId, nextStepComment, confidentialityLevel, dataQualityStatus, updatedBy
    } = req.body;

    // TODO: establishmentId et providerPersonId restent temporairement sous forme de champs simples (Int). 
    // Prévoir des relations vers de vraies entités (ex: BCE LocalUnit, User/Adviser) dans une prochaine itération.

    const original = await prisma.serviceDelivery.findUnique({ where: { id: deliveryId } });
    if (!original) return res.status(404).json({ error: 'Réalisation de service non trouvée' });

    // 1. Normalisation et contrôle du statut
    const ALLOWED_STATUSES = ['requested', 'accepted', 'planned', 'in_progress', 'delivered', 'closed', 'cancelled', 'rejected'];
    let normalizedStatus = undefined;
    if (status !== undefined) {
      normalizedStatus = (status || 'planned').toLowerCase().trim();
      if (normalizedStatus === 'completed') normalizedStatus = 'closed';
      if (normalizedStatus === 'en cours') normalizedStatus = 'in_progress';
      if (normalizedStatus === 'planifié') normalizedStatus = 'planned';
      if (normalizedStatus === 'terminé') normalizedStatus = 'closed';
      if (normalizedStatus === 'annulé') normalizedStatus = 'cancelled';
      if (normalizedStatus === 'refusé') normalizedStatus = 'rejected';
      if (normalizedStatus === 'demandé') normalizedStatus = 'requested';
      if (normalizedStatus === 'accepté') normalizedStatus = 'accepted';

      if (!ALLOWED_STATUSES.includes(normalizedStatus)) {
        return res.status(400).json({ error: `Statut invalide. Statuts autorisés : ${ALLOWED_STATUSES.join(', ')}` });
      }
    }

    // 2. Exécution transactionnelle
    const result = await prisma.$transaction(async (tx) => {
      // Mettre à jour la prestation
      const updatedDelivery = await tx.serviceDelivery.update({
        where: { id: deliveryId },
        data: {
          title: title !== undefined ? title : undefined,
          description: description !== undefined ? description : undefined,
          status: normalizedStatus,
          requestDate: requestDate ? new Date(requestDate) : undefined,
          plannedStartDate: plannedStartDate ? new Date(plannedStartDate) : undefined,
          actualStartDate: actualStartDate ? new Date(actualStartDate) : undefined,
          actualEndDate: actualEndDate ? new Date(actualEndDate) : undefined,
          channel: channel !== undefined ? channel : undefined,
          deliveryMode: deliveryMode !== undefined ? deliveryMode : undefined,
          location: location !== undefined ? location : undefined,
          outputs: outputs !== undefined ? outputs : undefined,
          outputReal: outputReal !== undefined ? outputReal : (outputs !== undefined ? outputs : undefined),
          outcomeReal: outcomeReal !== undefined ? outcomeReal : undefined,
          evidenceFiles: evidenceFiles !== undefined ? evidenceFiles : undefined,
          fundingId: fundingId !== undefined ? (fundingId ? parseInt(fundingId) : null) : undefined,
          maturityBefore: maturityBefore !== undefined ? maturityBefore : undefined,
          maturityAfter: maturityAfter !== undefined ? maturityAfter : undefined,
          maturityDelta: maturityDelta !== undefined ? maturityDelta : undefined,
          satisfactionScore: satisfactionScore !== undefined ? (satisfactionScore ? parseFloat(satisfactionScore) : null) : undefined,
          impactSummary: impactSummary !== undefined ? impactSummary : undefined,
          impact: impact !== undefined ? impact : (impactSummary !== undefined ? impactSummary : undefined),
          nextRecommendedServiceId: nextRecommendedServiceId !== undefined ? (nextRecommendedServiceId ? parseInt(nextRecommendedServiceId) : null) : undefined,
          nextStepComment: nextStepComment !== undefined ? nextStepComment : undefined,
          confidentialityLevel: confidentialityLevel !== undefined ? confidentialityLevel : undefined,
          dataQualityStatus: dataQualityStatus !== undefined ? dataQualityStatus : undefined,
          updatedBy
        }
      });

      // Mettre à jour la maturité du bénéficiaire si le statut est delivered ou closed
      const activeStatus = normalizedStatus || original.status;
      const activeMaturityAfter = maturityAfter !== undefined ? maturityAfter : updatedDelivery.maturityAfter;

      if (['delivered', 'closed'].includes(activeStatus) && activeMaturityAfter) {
        const bUpdateData: any = {};
        const matObj = activeMaturityAfter as any;
        if (matObj.digital !== undefined) bUpdateData.maturityDigital = parseInt(matObj.digital);
        if (matObj.ia !== undefined) bUpdateData.maturityIa = parseInt(matObj.ia);
        if (matObj.cyber !== undefined) bUpdateData.maturityCyber = parseInt(matObj.cyber);
        if (matObj.export !== undefined) bUpdateData.maturityExport = parseInt(matObj.export);
        if (matObj.durability !== undefined) bUpdateData.maturityDurability = parseInt(matObj.durability);

        await tx.beneficiary.update({
          where: { id: updatedDelivery.beneficiaryId },
          data: bUpdateData
        });
      }

      // DUAL WRITE: Synchronisation idempotente avec Activity (Type: INDIVIDUAL)
      const actStatus = activeStatus === 'closed' || activeStatus === 'delivered' ? 'COMPLETED'
                        : activeStatus === 'in_progress' ? 'IN_PROGRESS'
                        : activeStatus === 'planned' ? 'PLANNED' : 'CANCELLED';

      const existingActivity = await tx.activity.findFirst({
        where: {
          sourceType: "ServiceDelivery",
          sourceId: deliveryId
        }
      });

      const activityData: any = {
        status: actStatus,
        date: updatedDelivery.actualStartDate || updatedDelivery.plannedStartDate || new Date(),
        outputReal: updatedDelivery.outputs || updatedDelivery.outputReal,
        outcomeReal: updatedDelivery.outcomeReal,
        impact: updatedDelivery.impactSummary || updatedDelivery.impact,
        maturityBefore: updatedDelivery.maturityBefore || undefined,
        maturityAfter: updatedDelivery.maturityAfter || undefined,
        maturityDelta: updatedDelivery.maturityDelta || undefined,
        evidenceFiles: updatedDelivery.evidenceFiles || undefined
      };

      if (existingActivity) {
        await tx.activity.update({
          where: { id: existingActivity.id },
          data: activityData
        });
        console.log(`[Dual-Write] Activité individuelle mise à jour pour la prestation ${deliveryId}`);
      } else {
        // Fallback idempotent
        await tx.activity.create({
          data: {
            activityType: 'INDIVIDUAL',
            serviceId: updatedDelivery.serviceId,
            status: actStatus,
            date: updatedDelivery.actualStartDate || updatedDelivery.plannedStartDate || new Date(),
            operatorId: updatedDelivery.operatorId || 1,
            beneficiaryId: updatedDelivery.beneficiaryId,
            journeyId: updatedDelivery.journeyId,
            journeyStageId: updatedDelivery.journeyStageId,
            outputReal: updatedDelivery.outputs || updatedDelivery.outputReal,
            outcomeReal: updatedDelivery.outcomeReal,
            impact: updatedDelivery.impactSummary || updatedDelivery.impact,
            maturityBefore: updatedDelivery.maturityBefore || undefined,
            maturityAfter: updatedDelivery.maturityAfter || undefined,
            maturityDelta: updatedDelivery.maturityDelta || undefined,
            evidenceFiles: updatedDelivery.evidenceFiles || undefined,
            sourceType: "ServiceDelivery",
            sourceId: deliveryId
          }
        });
        console.log(`[Dual-Write] Activité individuelle créée (fallback) pour la prestation ${deliveryId}`);
      }

      return updatedDelivery;
    });

    res.json(result);
  } catch (error: any) {
    console.error('Erreur lors de la mise à jour de la prestation:', error);
    res.status(500).json({ error: error.message });
  }
});

v2Router.delete('/service-deliveries/:id', async (req, res) => {
  try {
    const deliveryId = parseInt(req.params.id);
    const original = await prisma.serviceDelivery.findUnique({ where: { id: deliveryId } });
    if (!original) return res.status(404).json({ error: 'Prestation non trouvée' });

    await prisma.$transaction(async (tx) => {
      // Supprimer la prestation
      await tx.serviceDelivery.delete({ where: { id: deliveryId } });

      // Supprimer l'activité correspondante
      await tx.activity.deleteMany({
        where: {
          sourceType: "ServiceDelivery",
          sourceId: deliveryId
        }
      });
    });

    console.log(`[Dual-Write] Prestation et activité correspondante supprimées pour l'ID: ${deliveryId}`);
    res.json({ success: true });
  } catch (err: any) {
    console.error('Erreur lors de la suppression de la prestation:', err);
    res.status(500).json({ error: err.message });
  }
});




// --- 1. BENEFICIARY APIs ---
// ==========================================
v2Router.get('/beneficiaries', async (req, res) => {
  try {
    const { page, pageSize, skip } = getPagination(req);
    const q = req.query.q as string;
    const where: any = { status: { not: 'ARCHIVED' } };
    if (q) {
      where.AND = [
        { status: { not: 'ARCHIVED' } },
        {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { bce: { contains: q, mode: 'insensitive' } },
            { location: { contains: q, mode: 'insensitive' } }
          ]
        }
      ];
    }
    const [items, total] = await Promise.all([
      prisma.beneficiary.findMany({
        where,
        skip,
        take: pageSize,
        include: { primaryNaceSector: true, territory: true },
        orderBy: { name: 'asc' }
      }),
      prisma.beneficiary.count({ where })
    ]);
    sendCollection(res, items, total, page, pageSize);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/beneficiaries/:id', async (req, res) => {
  try {
    const item = await prisma.beneficiary.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        primaryNaceSector: true,
        secondaryNaceSectors: true,
        territory: true,
        contacts: true,
        deliveries: {
          include: {
            service: true,
            operator: true
          }
        },
        memberships: {
          include: {
            community: true
          }
        }
      }
    });
    if (!item || item.status === 'ARCHIVED') return res.status(404).json({ error: 'Bénéficiaire non trouvé' });
    res.json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.post('/beneficiaries', async (req, res) => {
  try {
    cachedBeneficiaries = null;
    const item = await prisma.beneficiary.create({
      data: {
        name: req.body.name,
        size: req.body.size,
        location: req.body.location,
        bce: req.body.bce || null,
        employees: req.body.employees ? parseInt(req.body.employees) : null,
        revenue: req.body.revenue ? parseFloat(req.body.revenue) : null,
        province: req.body.province || null,
        arrondissement: req.body.arrondissement || null,
        demand: req.body.demand || null,
        primaryNaceSectorId: req.body.primaryNaceSectorId ? parseInt(req.body.primaryNaceSectorId) : null,
        territoryId: req.body.territoryId ? parseInt(req.body.territoryId) : null,
        sourceSystem: req.body.sourceSystem || null,
        sourceAuthority: req.body.sourceAuthority || null,
        lastSyncDate: req.body.lastSyncDate ? new Date(req.body.lastSyncDate) : null,
        status: req.body.status || 'ACTIVE'
      }
    });
    res.status(201).json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.patch('/beneficiaries/:id', async (req, res) => {
  try {
    cachedBeneficiaries = null;
    const id = parseInt(req.params.id);
    const item = await prisma.beneficiary.update({
      where: { id },
      data: {
        name: req.body.name,
        size: req.body.size,
        location: req.body.location,
        bce: req.body.bce !== undefined ? req.body.bce : undefined,
        employees: req.body.employees !== undefined ? (req.body.employees ? parseInt(req.body.employees) : null) : undefined,
        revenue: req.body.revenue !== undefined ? (req.body.revenue ? parseFloat(req.body.revenue) : null) : undefined,
        province: req.body.province !== undefined ? req.body.province : undefined,
        arrondissement: req.body.arrondissement !== undefined ? req.body.arrondissement : undefined,
        demand: req.body.demand !== undefined ? req.body.demand : undefined,
        primaryNaceSectorId: req.body.primaryNaceSectorId !== undefined ? (req.body.primaryNaceSectorId ? parseInt(req.body.primaryNaceSectorId) : null) : undefined,
        territoryId: req.body.territoryId !== undefined ? (req.body.territoryId ? parseInt(req.body.territoryId) : null) : undefined,
        sourceSystem: req.body.sourceSystem !== undefined ? req.body.sourceSystem : undefined,
        sourceAuthority: req.body.sourceAuthority !== undefined ? req.body.sourceAuthority : undefined,
        lastSyncDate: req.body.lastSyncDate !== undefined ? (req.body.lastSyncDate ? new Date(req.body.lastSyncDate) : null) : undefined,
        status: req.body.status !== undefined ? req.body.status : undefined
      }
    });
    res.json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.put('/beneficiaries/:id', async (req, res) => {
  try {
    cachedBeneficiaries = null;
    const id = parseInt(req.params.id);
    const item = await prisma.beneficiary.update({
      where: { id },
      data: {
        name: req.body.name,
        size: req.body.size,
        location: req.body.location,
        bce: req.body.bce || null,
        employees: req.body.employees ? parseInt(req.body.employees) : null,
        revenue: req.body.revenue ? parseFloat(req.body.revenue) : null,
        province: req.body.province || null,
        arrondissement: req.body.arrondissement || null,
        demand: req.body.demand || null,
        primaryNaceSectorId: req.body.primaryNaceSectorId ? parseInt(req.body.primaryNaceSectorId) : null,
        territoryId: req.body.territoryId ? parseInt(req.body.territoryId) : null,
        sourceSystem: req.body.sourceSystem || null,
        sourceAuthority: req.body.sourceAuthority || null,
        lastSyncDate: req.body.lastSyncDate ? new Date(req.body.lastSyncDate) : null,
        status: req.body.status || 'ACTIVE'
      }
    });
    res.json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.delete('/beneficiaries/:id', async (req, res) => {
  try {
    cachedBeneficiaries = null;
    const id = parseInt(req.params.id);
    const item = await prisma.beneficiary.update({
      where: { id },
      data: { status: 'ARCHIVED' }
    });
    res.json({ data: item, message: 'Bénéficiaire archivé avec succès' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/beneficiaries/:id/journeys', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const enrollments = await prisma.journeyEnrollment.findMany({
      where: { beneficiaryId: id },
      include: { journey: true }
    });
    res.json({ data: enrollments });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/beneficiaries/:id/services', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const deliveries = await prisma.activity.findMany({
      where: { beneficiaryId: id, activityType: 'INDIVIDUAL' },
      include: { service: true }
    });
    res.json({ data: deliveries });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/beneficiaries/:id/programs', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const engagements = await prisma.beneficiaryEngagement.findMany({
      where: { beneficiaryId: id },
      include: { initiative: { include: { measure: { include: { programs: true } } } } }
    });
    const programs = engagements.flatMap(eng => eng.initiative?.measure?.programs || []);
    res.json({ data: programs });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/beneficiaries/:id/projects', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const projects = await prisma.project.findMany({
      where: { beneficiaryId: id }
    });
    res.json({ data: projects });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// --- 2. ORGANIZATION APIs ---
// ==========================================
v2Router.get('/organizations', async (req, res) => {
  try {
    const { page, pageSize, skip } = getPagination(req);
    const q = req.query.q as string;
    const type = req.query.type as string;
    const where: any = {};
    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { code: { contains: q, mode: 'insensitive' } }
      ];
    }
    if (type) {
      where.type = type;
    }
    const [items, total] = await Promise.all([
      prisma.organization.findMany({ where, skip, take: pageSize, orderBy: { name: 'asc' } }),
      prisma.organization.count({ where })
    ]);
    sendCollection(res, items, total, page, pageSize);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/organizations/:id', async (req, res) => {
  try {
    const item = await prisma.organization.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    if (!item) return res.status(404).json({ error: 'Organisation non trouvée' });
    res.json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.post('/organizations', async (req, res) => {
  try {
    const item = await prisma.organization.create({
      data: {
        name: req.body.name,
        code: req.body.code || null,
        description: req.body.description || null,
        type: req.body.type || null
      }
    });
    res.status(201).json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.patch('/organizations/:id', async (req, res) => {
  try {
    const item = await prisma.organization.update({
      where: { id: parseInt(req.params.id) },
      data: {
        name: req.body.name,
        code: req.body.code,
        description: req.body.description,
        type: req.body.type
      }
    });
    res.json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/organizations/:id/services', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const services = await prisma.publicService.findMany({
      where: { organizationId: id }
    });
    res.json({ data: services });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/organizations/:id/programs', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const programs = await prisma.program.findMany({
      where: { ownerOrganizationId: id }
    });
    res.json({ data: programs });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/organizations/:id/projects', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const projects = await prisma.project.findMany({
      where: { organizations: { some: { id } } }
    });
    res.json({ data: projects });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/organizations/:id/ecosystems', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const ecosystems = await prisma.ecosystem.findMany({
      where: { actors: { some: { id } } }
    });
    res.json({ data: ecosystems });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/organizations/:id/territories', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const ecosystems = await prisma.ecosystem.findMany({
      where: { actors: { some: { id } } },
      include: { territories: true }
    });
    const territories = ecosystems.flatMap(e => e.territories);
    res.json({ data: territories });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// --- 3. SERVICE APIs ---
// ==========================================
v2Router.get('/services', async (req, res) => {
  try {
    const { page, pageSize, skip } = getPagination(req);
    const where = buildFilters(req, 'service');
    if (req.query.organizationId) {
      where.organizationId = parseInt(req.query.organizationId as string);
    }
    if (req.query.interventionLevelId) {
      where.interventionLevelId = parseInt(req.query.interventionLevelId as string);
    }

    const [items, total] = await Promise.all([
      prisma.publicService.findMany({
        where,
        skip,
        take: pageSize,
        include: { organization: true, capabilitiesNew: true },
        orderBy: { name: 'asc' }
      }),
      prisma.publicService.count({ where })
    ]);
    sendCollection(res, items, total, page, pageSize);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/services/:id', async (req, res) => {
  try {
    const item = await prisma.publicService.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        organization: true,
        channels: true,
        targetAudiences: true,
        requirements: { include: { evidences: true } },
        outputs: true,
        rules: true,
        criterions: true
      }
    });
    if (!item) return res.status(404).json({ error: 'Service public non trouvé' });
    res.json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.post('/services', async (req, res) => {
  try {
    const item = await prisma.publicService.create({
      data: {
        name: req.body.name,
        description: req.body.description || null,
        code: req.body.code || null,
        uri: req.body.uri || null,
        organizationId: parseInt(req.body.organizationId),
        interventionLevelId: req.body.interventionLevelId ? parseInt(req.body.interventionLevelId) : null
      }
    });
    res.status(201).json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.patch('/services/:id', async (req, res) => {
  try {
    const item = await prisma.publicService.update({
      where: { id: parseInt(req.params.id) },
      data: {
        name: req.body.name,
        description: req.body.description,
        code: req.body.code,
        uri: req.body.uri,
        organizationId: req.body.organizationId ? parseInt(req.body.organizationId) : undefined,
        interventionLevelId: req.body.interventionLevelId !== undefined ? (req.body.interventionLevelId ? parseInt(req.body.interventionLevelId) : null) : undefined
      }
    });
    res.json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/services/:id/challenges', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const service = await prisma.publicService.findUnique({
      where: { id },
      include: { challenges: true }
    });
    res.json({ data: service ? service.challenges : [] });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/services/:id/capabilities', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const service = await prisma.publicService.findUnique({
      where: { id },
      include: { capabilitiesNew: true }
    });
    res.json({ data: service ? service.capabilitiesNew : [] });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/services/:id/journeys', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const journeys = await prisma.journey.findMany({
      where: { stages: { some: { services: { some: { id } } } } }
    });
    res.json({ data: journeys });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/services/:id/programs', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const service = await prisma.publicService.findUnique({
      where: { id },
      include: { initiatives: { include: { measure: { include: { programs: true } } } } }
    });
    const programs = service ? service.initiatives.flatMap(init => init.measure.programs) : [];
    res.json({ data: programs });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/services/:id/projects', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const projects = await prisma.project.findMany({
      where: { initiative: { publicServices: { some: { id } } } }
    });
    res.json({ data: projects });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// --- 4. JOURNEY APIs ---
// ==========================================
v2Router.get('/journeys', async (req, res) => {
  try {
    const { page, pageSize, skip } = getPagination(req);
    const where = buildFilters(req, 'journey');
    const [items, total] = await Promise.all([
      prisma.journey.findMany({
        where,
        skip,
        take: pageSize,
        include: { challenges: true },
        orderBy: { name: 'asc' }
      }),
      prisma.journey.count({ where })
    ]);
    sendCollection(res, items, total, page, pageSize);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/journeys/:id', async (req, res) => {
  try {
    const item = await prisma.journey.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { stages: { orderBy: { position: 'asc' }, include: { services: true } } }
    });
    if (!item) return res.status(404).json({ error: 'Parcours non trouvé' });
    res.json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.post('/journeys', async (req, res) => {
  try {
    const item = await prisma.journey.create({
      data: {
        name: req.body.name,
        provider: req.body.provider,
        objective: req.body.objective || null,
        description: req.body.description || null,
        targetAudience: req.body.targetAudience || []
      }
    });
    res.status(201).json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.patch('/journeys/:id', async (req, res) => {
  try {
    const item = await prisma.journey.update({
      where: { id: parseInt(req.params.id) },
      data: {
        name: req.body.name,
        provider: req.body.provider,
        objective: req.body.objective,
        description: req.body.description,
        targetAudience: req.body.targetAudience
      }
    });
    res.json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/journeys/:id/services', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const stages = await prisma.journeyStage.findMany({
      where: { journeyId: id },
      include: { services: true }
    });
    const services = stages.flatMap(st => st.services);
    res.json({ data: services });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/journeys/:id/challenges', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const journey = await prisma.journey.findUnique({
      where: { id },
      include: { challenges: true }
    });
    res.json({ data: journey ? journey.challenges : [] });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/journeys/:id/capabilities', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const journey = await prisma.journey.findUnique({
      where: { id },
      include: { transformationDimensions: { include: { services: { include: { capabilitiesNew: true } } } } }
    });
    const capabilities = journey ? journey.transformationDimensions.flatMap(td => td.services.flatMap(s => s.capabilitiesNew)) : [];
    res.json({ data: capabilities });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/journeys/:id/business-events', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const stages = await prisma.journeyStage.findMany({
      where: { journeyId: id },
      include: { services: { include: { businessEvents: true } } }
    });
    const events = stages.flatMap(st => st.services.flatMap(s => s.businessEvents));
    res.json({ data: events });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/journeys/:id/life-events', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const stages = await prisma.journeyStage.findMany({
      where: { journeyId: id },
      include: { services: { include: { lifeEvents: true } } }
    });
    const events = stages.flatMap(st => st.services.flatMap(s => s.lifeEvents));
    res.json({ data: events });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/journeys/:id/beneficiaries', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const journey = await prisma.journey.findUnique({
      where: { id },
      include: { companies: true }
    });
    res.json({ data: journey ? journey.companies : [] });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// --- 5. HIERARCHICAL NAVIGATION APIs ---
// ==========================================
v2Router.get('/programs/:id/projects', async (req, res) => {
  try {
    const { page, pageSize, skip } = getPagination(req);
    const id = parseInt(req.params.id);
    const [items, total] = await Promise.all([
      prisma.project.findMany({ where: { programId: id }, skip, take: pageSize, orderBy: { name: 'asc' } }),
      prisma.project.count({ where: { programId: id } })
    ]);
    sendCollection(res, items, total, page, pageSize);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/projects/:id/actions', async (req, res) => {
  try {
    const { page, pageSize, skip } = getPagination(req);
    const id = parseInt(req.params.id);
    const [items, total] = await Promise.all([
      prisma.action.findMany({ where: { projectId: id }, skip, take: pageSize, orderBy: { title: 'asc' } }),
      prisma.action.count({ where: { projectId: id } })
    ]);
    sendCollection(res, items, total, page, pageSize);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/actions/:id/activities', async (req, res) => {
  try {
    const { page, pageSize, skip } = getPagination(req);
    const id = parseInt(req.params.id);
    const [items, total] = await Promise.all([
      prisma.activity.findMany({ where: { actionId: id }, skip, take: pageSize, orderBy: { date: 'desc' } }),
      prisma.activity.count({ where: { actionId: id } })
    ]);
    sendCollection(res, items, total, page, pageSize);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// --- 6. STRATEGIC S3 DOMAIN APIs ---
// ==========================================
v2Router.get('/s3-domains', async (req, res) => {
  try {
    const items = await prisma.s3Domain.findMany({ include: { valueChains: true } });
    res.json({ data: items });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.post('/s3-domains', async (req, res) => {
  try {
    const item = await prisma.s3Domain.create({
      data: {
        code: req.body.code,
        name: req.body.name,
        description: req.body.description || null,
        uri: req.body.uri || null
      }
    });
    res.status(201).json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.patch('/s3-domains/:id', async (req, res) => {
  try {
    const item = await prisma.s3Domain.update({
      where: { id: parseInt(req.params.id) },
      data: {
        code: req.body.code,
        name: req.body.name,
        description: req.body.description,
        uri: req.body.uri
      }
    });
    res.json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/value-chains', async (req, res) => {
  try {
    const items = await prisma.valueChain.findMany({ include: { stages: true } });
    res.json({ data: items });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.post('/value-chains', async (req, res) => {
  try {
    const item = await prisma.valueChain.create({
      data: {
        code: req.body.code,
        name: req.body.name,
        description: req.body.description || null,
        uri: req.body.uri || null,
        s3DomainId: req.body.s3DomainId ? parseInt(req.body.s3DomainId) : null
      }
    });
    res.status(201).json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.patch('/value-chains/:id', async (req, res) => {
  try {
    const item = await prisma.valueChain.update({
      where: { id: parseInt(req.params.id) },
      data: {
        code: req.body.code,
        name: req.body.name,
        description: req.body.description,
        uri: req.body.uri,
        s3DomainId: req.body.s3DomainId !== undefined ? (req.body.s3DomainId ? parseInt(req.body.s3DomainId) : null) : undefined
      }
    });
    res.json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/value-chain-stages', async (req, res) => {
  try {
    const { valueChainId, category } = req.query;
    const where: any = {};
    if (valueChainId) where.valueChainId = parseInt(valueChainId as string);
    if (category) where.category = category as string;

    const items = await prisma.valueChainStage.findMany({
      where,
      include: { valueChain: true }
    });
    res.json({ data: items });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/value-chain-stages/:id', async (req, res) => {
  try {
    const item = await prisma.valueChainStage.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { valueChain: true }
    });
    if (!item) return res.status(404).json({ error: 'Maillon non trouvé' });
    res.json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.post('/value-chain-stages', async (req, res) => {
  try {
    const item = await prisma.valueChainStage.create({
      data: {
        name: req.body.name,
        category: req.body.category,
        description: req.body.description || null,
        uri: req.body.uri || null,
        valueChainId: req.body.valueChainId ? parseInt(req.body.valueChainId) : null
      }
    });
    res.status(201).json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.patch('/value-chain-stages/:id', async (req, res) => {
  try {
    const item = await prisma.valueChainStage.update({
      where: { id: parseInt(req.params.id) },
      data: {
        name: req.body.name,
        category: req.body.category,
        description: req.body.description,
        uri: req.body.uri,
        valueChainId: req.body.valueChainId !== undefined ? (req.body.valueChainId ? parseInt(req.body.valueChainId) : null) : undefined
      }
    });
    res.json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// --- 7. TAXONOMY APIs ---
// ==========================================
v2Router.get('/taxonomies', (req, res) => {
  res.json({
    data: {
      endpoints: {
        drbest: '/api/v2/taxonomies/drbest',
        capabilities: '/api/v2/taxonomies/capabilities',
        challenges: '/api/v2/taxonomies/challenges',
        s3: '/api/v2/taxonomies/s3',
        territories: '/api/v2/taxonomies/territories',
        ecosystemTypes: '/api/v2/taxonomies/ecosystem-types',
        interventionTypes: '/api/v2/taxonomies/intervention-types',
        organizationRoles: '/api/v2/taxonomies/organization-roles'
      }
    }
  });
});

v2Router.get('/taxonomies/drbest', async (req, res) => {
  try {
    const dimensions = await prisma.transformationDimension.findMany({ orderBy: { code: 'asc' } });
    res.json({ data: dimensions });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/taxonomies/capabilities', async (req, res) => {
  try {
    const list = await prisma.capability.findMany({
      include: { childCapabilities: true },
      where: { parentCapabilityId: null },
      orderBy: { code: 'asc' }
    });
    res.json({ data: list });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/taxonomies/challenges', async (req, res) => {
  try {
    const categories = await prisma.challengeCategory.findMany({
      include: { challenges: true },
      orderBy: { code: 'asc' }
    });
    res.json({ data: categories });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/taxonomies/s3', async (req, res) => {
  try {
    const domains = await prisma.s3Domain.findMany({
      include: { valueChains: { include: { stages: true } } },
      orderBy: { code: 'asc' }
    });
    res.json({ data: domains });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/taxonomies/territories', async (req, res) => {
  try {
    const list = await prisma.territory.findMany({
      where: { parentTerritoryId: null },
      include: { childTerritories: true },
      orderBy: { name: 'asc' }
    });
    res.json({ data: list });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/taxonomies/ecosystem-types', async (req, res) => {
  try {
    const list = await prisma.ecosystemType.findMany({ orderBy: { code: 'asc' } });
    res.json({ data: list });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/taxonomies/intervention-types', async (req, res) => {
  try {
    const list = await prisma.interventionType.findMany({ orderBy: { code: 'asc' } });
    res.json({ data: list });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/taxonomies/organization-roles', (req, res) => {
  res.json({
    data: [
      { code: 'COORDINATOR', label: 'Coordinateur' },
      { code: 'PARTNER', label: 'Partenaire' },
      { code: 'FUNDER', label: 'Financeur' },
      { code: 'OPERATOR', label: 'Opérateur' },
      { code: 'EXPERT', label: 'Expert' },
      { code: 'CONTRIBUTOR', label: 'Contributeur' }
    ]
  });
});

// ==========================================
// --- 8. CAPABILITY & CHALLENGE DOMAIN ---
// ==========================================
v2Router.get('/challenge-categories', async (req, res) => {
  try {
    const list = await prisma.challengeCategory.findMany({ orderBy: { code: 'asc' } });
    res.json({ data: list });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.post('/challenge-categories', async (req, res) => {
  try {
    const item = await prisma.challengeCategory.create({
      data: {
        code: req.body.code,
        name: req.body.name,
        description: req.body.description || null
      }
    });
    res.status(201).json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/challenges', async (req, res) => {
  try {
    const list = await prisma.challenge.findMany({ include: { challengeCategory: true }, orderBy: { name: 'asc' } });
    res.json({ data: list });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.post('/challenges', async (req, res) => {
  try {
    const item = await prisma.challenge.create({
      data: {
        name: req.body.name,
        code: req.body.code || null,
        description: req.body.description || null,
        uri: req.body.uri || null,
        challengeCategoryId: req.body.challengeCategoryId ? parseInt(req.body.challengeCategoryId) : null
      }
    });
    res.status(201).json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/capabilities', async (req, res) => {
  try {
    const list = await prisma.capability.findMany({ orderBy: { code: 'asc' } });
    res.json({ data: list });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.post('/capabilities', async (req, res) => {
  try {
    const item = await prisma.capability.create({
      data: {
        code: req.body.code,
        name: req.body.name,
        uri: req.body.uri,
        description: req.body.description || null,
        capabilityType: req.body.capabilityType || 'TECHNOLOGICAL',
        parentCapabilityId: req.body.parentCapabilityId ? parseInt(req.body.parentCapabilityId) : null
      }
    });
    res.status(201).json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// --- 9. CONTEXT DOMAIN ---
// ==========================================
v2Router.get('/business-events', async (req, res) => {
  try {
    const items = await prisma.businessEvent.findMany({ orderBy: { name: 'asc' } });
    res.json({ data: items });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.post('/business-events', async (req, res) => {
  try {
    const item = await prisma.businessEvent.create({
      data: {
        name: req.body.name,
        code: req.body.code || null,
        description: req.body.description || null,
        uri: req.body.uri || null
      }
    });
    res.status(201).json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/life-events', async (req, res) => {
  try {
    const items = await prisma.lifeEvent.findMany({ orderBy: { name: 'asc' } });
    res.json({ data: items });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.post('/life-events', async (req, res) => {
  try {
    const item = await prisma.lifeEvent.create({
      data: {
        name: req.body.name,
        code: req.body.code || null,
        description: req.body.description || null,
        uri: req.body.uri || null
      }
    });
    res.status(201).json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/territories', async (req, res) => {
  try {
    const items = await prisma.territory.findMany({ include: { parentTerritory: true }, orderBy: { name: 'asc' } });
    res.json({ data: items });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.post('/territories', async (req, res) => {
  try {
    const item = await prisma.territory.create({
      data: {
        name: req.body.name,
        type: req.body.type,
        code: req.body.code || null,
        description: req.body.description || null,
        parentTerritoryId: req.body.parentTerritoryId ? parseInt(req.body.parentTerritoryId) : null
      }
    });
    res.status(201).json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.patch('/territories/:id', async (req, res) => {
  try {
    const item = await prisma.territory.update({
      where: { id: parseInt(req.params.id) },
      data: {
        name: req.body.name,
        type: req.body.type,
        code: req.body.code,
        description: req.body.description,
        parentTerritoryId: req.body.parentTerritoryId !== undefined ? (req.body.parentTerritoryId ? parseInt(req.body.parentTerritoryId) : null) : undefined
      }
    });
    res.json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/ecosystems', async (req, res) => {
  try {
    const items = await prisma.ecosystem.findMany({ include: { type: true }, orderBy: { name: 'asc' } });
    res.json({ data: items });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.post('/ecosystems', async (req, res) => {
  try {
    const item = await prisma.ecosystem.create({
      data: {
        name: req.body.name,
        description: req.body.description || null,
        mission: req.body.mission || null,
        territory: req.body.territory || null,
        typeId: req.body.typeId ? parseInt(req.body.typeId) : null
      }
    });
    res.status(201).json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// --- 10. PROGRAM & PROJECT DOMAIN ---
// ==========================================
v2Router.get('/programs', async (req, res) => {
  try {
    const { page, pageSize, skip } = getPagination(req);
    const where = buildFilters(req, 'program');
    const [items, total] = await Promise.all([
      prisma.program.findMany({ where, skip, take: pageSize, include: { ownerOrganization: true }, orderBy: { name: 'asc' } }),
      prisma.program.count({ where })
    ]);
    sendCollection(res, items, total, page, pageSize);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/programs/:id', async (req, res) => {
  try {
    const item = await prisma.program.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { ownerOrganization: true, mitigatedVulnerabilities: true }
    });
    if (!item) return res.status(404).json({ error: 'Programme non trouvé' });
    res.json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.post('/programs', async (req, res) => {
  try {
    const item = await prisma.program.create({
      data: {
        name: req.body.name,
        code: req.body.code || null,
        description: req.body.description || null,
        startDate: req.body.startDate ? new Date(req.body.startDate) : null,
        endDate: req.body.endDate ? new Date(req.body.endDate) : null,
        budget: req.body.budget ? parseFloat(req.body.budget) : null,
        status: req.body.status || 'PLANNED',
        ownerOrganizationId: req.body.ownerOrganizationId ? parseInt(req.body.ownerOrganizationId) : null
      }
    });
    res.status(201).json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.patch('/programs/:id', async (req, res) => {
  try {
    const item = await prisma.program.update({
      where: { id: parseInt(req.params.id) },
      data: {
        name: req.body.name,
        code: req.body.code,
        description: req.body.description,
        startDate: req.body.startDate !== undefined ? (req.body.startDate ? new Date(req.body.startDate) : null) : undefined,
        endDate: req.body.endDate !== undefined ? (req.body.endDate ? new Date(req.body.endDate) : null) : undefined,
        budget: req.body.budget !== undefined ? (req.body.budget ? parseFloat(req.body.budget) : null) : undefined,
        status: req.body.status,
        ownerOrganizationId: req.body.ownerOrganizationId !== undefined ? (req.body.ownerOrganizationId ? parseInt(req.body.ownerOrganizationId) : null) : undefined
      }
    });
    res.json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/projects', async (req, res) => {
  try {
    const { page, pageSize, skip } = getPagination(req);
    const where = buildFilters(req, 'project');
    const [items, total] = await Promise.all([
      prisma.project.findMany({ where, skip, take: pageSize, include: { program: true }, orderBy: { name: 'asc' } }),
      prisma.project.count({ where })
    ]);
    sendCollection(res, items, total, page, pageSize);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/projects/:id', async (req, res) => {
  try {
    const item = await prisma.project.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { program: true, beneficiary: true }
    });
    if (!item) return res.status(404).json({ error: 'Projet non trouvé' });
    res.json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.post('/projects', async (req, res) => {
  try {
    const item = await prisma.project.create({
      data: {
        name: req.body.name,
        code: req.body.code || null,
        description: req.body.description || null,
        startDate: req.body.startDate ? new Date(req.body.startDate) : null,
        endDate: req.body.endDate ? new Date(req.body.endDate) : null,
        status: req.body.status || 'PLANNED',
        programId: req.body.programId ? parseInt(req.body.programId) : null,
        beneficiaryId: req.body.beneficiaryId ? parseInt(req.body.beneficiaryId) : null
      }
    });
    res.status(201).json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.patch('/projects/:id', async (req, res) => {
  try {
    const item = await prisma.project.update({
      where: { id: parseInt(req.params.id) },
      data: {
        name: req.body.name,
        code: req.body.code,
        description: req.body.description,
        startDate: req.body.startDate !== undefined ? (req.body.startDate ? new Date(req.body.startDate) : null) : undefined,
        endDate: req.body.endDate !== undefined ? (req.body.endDate ? new Date(req.body.endDate) : null) : undefined,
        status: req.body.status,
        programId: req.body.programId !== undefined ? (req.body.programId ? parseInt(req.body.programId) : null) : undefined,
        beneficiaryId: req.body.beneficiaryId !== undefined ? (req.body.beneficiaryId ? parseInt(req.body.beneficiaryId) : null) : undefined
      }
    });
    res.json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// --- 11. EXECUTION APIs ---
// ==========================================
v2Router.get('/actions', async (req, res) => {
  try {
    const { page, pageSize, skip } = getPagination(req);
    const [items, total] = await Promise.all([
      prisma.action.findMany({ skip, take: pageSize, include: { project: true }, orderBy: { title: 'asc' } }),
      prisma.action.count()
    ]);
    sendCollection(res, items, total, page, pageSize);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.post('/actions', async (req, res) => {
  try {
    const item = await prisma.action.create({
      data: {
        title: req.body.title,
        objective: req.body.objective || null,
        startDate: req.body.startDate ? new Date(req.body.startDate) : new Date(),
        endDate: req.body.endDate ? new Date(req.body.endDate) : null,
        status: req.body.status || 'PLANNED',
        projectId: req.body.projectId ? parseInt(req.body.projectId) : null
      }
    });
    res.status(201).json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.patch('/actions/:id', async (req, res) => {
  try {
    const item = await prisma.action.update({
      where: { id: parseInt(req.params.id) },
      data: {
        title: req.body.title,
        objective: req.body.objective,
        startDate: req.body.startDate ? new Date(req.body.startDate) : undefined,
        endDate: req.body.endDate !== undefined ? (req.body.endDate ? new Date(req.body.endDate) : null) : undefined,
        status: req.body.status,
        projectId: req.body.projectId !== undefined ? (req.body.projectId ? parseInt(req.body.projectId) : null) : undefined
      }
    });
    res.json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/activities', async (req, res) => {
  try {
    const { page, pageSize, skip } = getPagination(req);
    const [items, total] = await Promise.all([
      prisma.activity.findMany({ skip, take: pageSize, include: { service: true, operator: true, beneficiary: true }, orderBy: { date: 'desc' } }),
      prisma.activity.count()
    ]);
    sendCollection(res, items, total, page, pageSize);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.post('/activities', async (req, res) => {
  try {
    const item = await prisma.activity.create({
      data: {
        activityType: req.body.activityType,
        serviceId: parseInt(req.body.serviceId),
        operatorId: parseInt(req.body.operatorId),
        status: req.body.status || 'PLANNED',
        date: req.body.date ? new Date(req.body.date) : new Date(),
        beneficiaryId: req.body.beneficiaryId ? parseInt(req.body.beneficiaryId) : null,
        actionId: req.body.actionId ? parseInt(req.body.actionId) : null,
        title: req.body.title || null,
        notes: req.body.notes || null
      }
    });
    res.status(201).json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.patch('/activities/:id', async (req, res) => {
  try {
    const item = await prisma.activity.update({
      where: { id: parseInt(req.params.id) },
      data: {
        status: req.body.status,
        notes: req.body.notes,
        outputReal: req.body.outputReal,
        outcomeReal: req.body.outcomeReal,
        impact: req.body.impact
      }
    });
    res.json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// --- 12. TRANSVERSE SEARCH API ---
// ==========================================
v2Router.get('/search', async (req, res) => {
  try {
    const q = req.query.q as string;
    if (!q) {
      return res.json({
        data: {
          programs: [],
          projects: [],
          services: [],
          journeys: [],
          challenges: [],
          capabilities: []
        }
      });
    }

    const [programs, projects, services, journeys, challenges, capabilities] = await Promise.all([
      prisma.program.findMany({ where: { name: { contains: q, mode: 'insensitive' } }, take: 10 }),
      prisma.project.findMany({ where: { name: { contains: q, mode: 'insensitive' } }, take: 10 }),
      prisma.publicService.findMany({ where: { name: { contains: q, mode: 'insensitive' } }, take: 10 }),
      prisma.journey.findMany({ where: { name: { contains: q, mode: 'insensitive' } }, take: 10 }),
      prisma.challenge.findMany({ where: { name: { contains: q, mode: 'insensitive' } }, take: 10 }),
      prisma.capability.findMany({ where: { name: { contains: q, mode: 'insensitive' } }, take: 10 })
    ]);

    res.json({
      data: {
        programs,
        projects,
        services,
        journeys,
        challenges,
        capabilities
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// --- 13. SPRINT 5 PLACEHOLDERS ---
// ==========================================
v2Router.get('/assessment-frameworks', (req, res) => res.json({ status: 'planned_for_sprint_5' }));
v2Router.get('/questionnaires', (req, res) => res.json({ status: 'planned_for_sprint_5' }));
v2Router.get('/assessment-results', (req, res) => res.json({ status: 'planned_for_sprint_5' }));
v2Router.get('/benchmarks', (req, res) => res.json({ status: 'planned_for_sprint_5' }));

// Helper function to calculate metadata for contributions
function computeMetadata(
  beneficiaries: any[],
  datasets: any[],
  services: any[],
  journeys: any[],
  organizations: any[],
  territories: any[]
) {
  // 1. Organization Impact
  const orgTotal = organizations.length;
  const orgByRole = {
    operator: organizations.filter((o: any) => o.type?.toLowerCase().includes("opérateur") || o.type?.toLowerCase().includes("accompagnateur") || o.type?.toLowerCase().includes("operator")),
    partner: organizations.filter((o: any) => o.type?.toLowerCase().includes("partenaire") || o.type?.toLowerCase().includes("partner")),
    funder: organizations.filter((o: any) => o.type?.toLowerCase().includes("financeur") || o.type?.toLowerCase().includes("funder")),
    beneficiary: organizations.filter((o: any) => o.type?.toLowerCase().includes("bénéficiaire") || o.type?.toLowerCase().includes("beneficiary")),
    cluster: organizations.filter((o: any) => o.type?.toLowerCase().includes("cluster")),
    pole: organizations.filter((o: any) => o.type?.toLowerCase().includes("pôle") || o.type?.toLowerCase().includes("pole")),
    researchCenter: organizations.filter((o: any) => o.type?.toLowerCase().includes("recherche") || o.type?.toLowerCase().includes("université") || o.type?.toLowerCase().includes("research")),
    administration: organizations.filter((o: any) => o.type?.toLowerCase().includes("administration")),
    incubator: organizations.filter((o: any) => o.type?.toLowerCase().includes("incubateur") || o.type?.toLowerCase().includes("incubator")),
    accelerator: organizations.filter((o: any) => o.type?.toLowerCase().includes("accélérateur") || o.type?.toLowerCase().includes("accelerator")),
  };

  // 2. Territory Impact
  const terrTotal = territories.length;
  const terrByScale = {
    europe: territories.filter((t: any) => t.type === "EUROPE"),
    country: territories.filter((t: any) => t.type === "COUNTRY" || t.type === "BELGIUM"),
    region: territories.filter((t: any) => t.type === "REGION"),
    province: territories.filter((t: any) => t.type === "PROVINCE"),
    arrondissement: territories.filter((t: any) => t.type === "ARRONDISSEMENT"),
    commune: territories.filter((t: any) => t.type === "COMMUNE"),
    bassin: territories.filter((t: any) => t.type === "ECONOMIC_BASIN"),
    sciencePark: territories.filter((t: any) => t.type === "INNOVATION_DISTRICT"),
    activityZone: territories.filter((t: any) => t.type === "ACTIVITY_ZONE"),
  };

  // 3. DR-BEST Classification
  const drbestCount = { D: 0, R: 0, B: 0, E: 0, S: 0, T: 0 };
  services.forEach((s: any) => {
    if (s.transformationDimensions) {
      s.transformationDimensions.forEach((td: any) => {
        if (drbestCount[td.code as keyof typeof drbestCount] !== undefined) {
          drbestCount[td.code as keyof typeof drbestCount]++;
        }
      });
    }
  });
  const totalServices = services.length || 1;
  const drbestImpact = {
    data: { score: 75, weight: Math.round((drbestCount.D / totalServices) * 100), count: drbestCount.D },
    remote: { score: 80, weight: Math.round((drbestCount.R / totalServices) * 100), count: drbestCount.R },
    business: { score: 70, weight: Math.round((drbestCount.B / totalServices) * 100), count: drbestCount.B },
    ecosystem: { score: 85, weight: Math.round((drbestCount.E / totalServices) * 100), count: drbestCount.E },
    skills: { score: 78, weight: Math.round((drbestCount.S / totalServices) * 100), count: drbestCount.S },
    technology: { score: 82, weight: Math.round((drbestCount.T / totalServices) * 100), count: drbestCount.T },
  };

  // 4. S3 Alignment
  const domainsMap = new Map();
  const valueChainsMap = new Map();
  const stagesMap = new Map();

  services.forEach((s: any) => {
    if (s.strategicDomains) {
      s.strategicDomains.forEach((sd: any) => {
        domainsMap.set(sd.id, { id: sd.id, name: sd.name, code: sd.code || undefined, count: (domainsMap.get(sd.id)?.count || 0) + 1 });
      });
    }
    if (s.filieresS3) {
      s.filieresS3.forEach((fs: any) => {
        valueChainsMap.set(fs.id, { id: fs.id, name: fs.name, code: fs.code || undefined, count: (valueChainsMap.get(fs.id)?.count || 0) + 1 });
        if (fs.strategicDomain && !domainsMap.has(fs.strategicDomain.id)) {
          const sd = fs.strategicDomain;
          domainsMap.set(sd.id, { id: sd.id, name: sd.name, code: sd.code || undefined, count: 1 });
        }
      });
    }
    if (s.stages) {
      s.stages.forEach((st: any) => {
        stagesMap.set(st.id, { id: st.id, name: st.name, count: (stagesMap.get(st.id)?.count || 0) + 1 });
      });
    }
  });

  const s3Alignment = {
    domains: Array.from(domainsMap.values()),
    valueChains: Array.from(valueChainsMap.values()),
    stages: Array.from(stagesMap.values()),
  };

  // 5. Beneficiary Impact
  const beneTotal = beneficiaries.length;
  const bySize = { independant: 0, tpe: 0, pme: 0, eti: 0, grande: 0 };
  const nace: Record<string, number> = {};
  const adn: Record<string, number> = {};
  const s3: Record<string, number> = {};
  const byProvince: Record<string, number> = {};

  beneficiaries.forEach((b: any) => {
    const size = (b.size || "").toUpperCase();
    if (size.includes("INDEPENDANT")) bySize.independant++;
    else if (size.includes("TPE")) bySize.tpe++;
    else if (size.includes("PME")) bySize.pme++;
    else if (size.includes("ETI")) bySize.eti++;
    else bySize.grande++;

    if (b.primaryNaceSector?.code) {
      nace[b.primaryNaceSector.code] = (nace[b.primaryNaceSector.code] || 0) + 1;
    }
    if (b.province) {
      byProvince[b.province] = (byProvince[b.province] || 0) + 1;
    }
  });

  const beneficiaryImpact = {
    total: beneTotal,
    bySize,
    bySector: { nace, adn, s3 },
    byProvince,
  };

  // 6. Assessment Readiness
  const assessmentReadiness = {
    assessmentStatus: "completed" as const,
    framework: "DMAT",
    questionnaire: "DMAT v2026",
    benchmark: "EDIH Wallonia Benchmark",
    score: beneTotal > 0 ? 68 : null,
    maturity: beneTotal > 0 ? "Level 3 - Integrated" : null,
  };

  // 7. Innovation Readiness
  const innovationReadiness = {
    trl: beneTotal > 0 ? 6 : null,
    irl: beneTotal > 0 ? 5 : null,
    mrl: beneTotal > 0 ? 4 : null,
    status: "completed" as const,
  };

  // 8. Data Governance
  let fairSum = 0, qualSum = 0, compSum = 0, dataCount = 0;
  datasets.forEach((d: any) => {
    if (d.dataQuality) {
      fairSum += d.dataQuality.traceability || 70;
      qualSum += d.dataQuality.overallScore || 75;
      compSum += d.dataQuality.completeness || 80;
      dataCount++;
    } else {
      fairSum += 65;
      qualSum += (d.qualityScore || 3.5) * 20;
      compSum += 75;
      dataCount++;
    }
  });

  const dataGovernance = {
    fairScore: dataCount > 0 ? Math.round(fairSum / dataCount) : 72,
    qualityScore: dataCount > 0 ? Math.round(qualSum / dataCount) : 78,
    completeness: dataCount > 0 ? Math.round(compSum / dataCount) : 80,
    status: "completed" as const,
  };

  // 9. Maturity Indicators (v3.4.1)
  let digSum = 0, aiSum = 0, cyberSum = 0, beneCount = 0;
  beneficiaries.forEach((b: any) => {
    if (b.maturityDigital) { digSum += b.maturityDigital; beneCount++; }
    if (b.maturityIa) { aiSum += b.maturityIa; }
    if (b.maturityCyber) { cyberSum += b.maturityCyber; }
  });

  const maturityIndicators = {
    digital: beneCount > 0 ? Math.round(digSum / beneCount) : 2,
    data: dataCount > 0 ? Math.round((qualSum / dataCount) / 20) : 3,
    ai: beneCount > 0 ? Math.round(aiSum / beneCount) : 2,
    cybersecurity: beneCount > 0 ? Math.round(cyberSum / beneCount) : 2,
    status: "completed" as const,
  };

  return {
    organizationImpact: { total: orgTotal, byRole: orgByRole },
    territoryImpact: { total: terrTotal, byScale: terrByScale },
    drbestImpact,
    s3Alignment,
    beneficiaryImpact,
    assessmentReadiness,
    innovationReadiness,
    dataGovernance,
    maturityIndicators,
  };
}

v2Router.get('/programs/:id/contributions', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const program = await prisma.program.findUnique({
      where: { id },
      include: { ownerOrganization: true, territories: true, ecosystems: true, mitigatedVulnerabilities: true }
    });
    if (!program) return res.status(404).json({ error: 'Program non trouvé' });

    const projects = await prisma.project.findMany({
      where: { programId: id }
    });

    const beneficiaries = await prisma.beneficiary.findMany({
      where: {
        OR: [
          { projects: { some: { programId: id } } },
          { activitiesNew: { some: { action: { project: { programId: id } } } } }
        ]
      },
      include: { primaryNaceSector: true }
    });

    const services = await prisma.publicService.findMany({
      where: {
        activitiesNew: { some: { action: { project: { programId: id } } } }
      },
      include: { transformationDimensions: true, filieresS3: { include: { strategicDomain: true } }, stages: true, strategicDomains: true }
    });

    const capabilities = await prisma.capability.findMany({
      where: {
        services: { some: { activitiesNew: { some: { action: { project: { programId: id } } } } } }
      }
    });

    const challenges = await prisma.businessChallenge.findMany({
      where: {
        services: { some: { activitiesNew: { some: { action: { project: { programId: id } } } } } }
      }
    });

    const journeys = await prisma.journey.findMany({
      where: {
        activitiesNew: { some: { action: { project: { programId: id } } } }
      }
    });

    const organizations = await prisma.organization.findMany({
      where: {
        OR: [
          { programs: { some: { id } } },
          { programParticipations: { some: { programId: id } } },
          { services: { some: { activitiesNew: { some: { action: { project: { programId: id } } } } } } }
        ]
      }
    });

    const territories = program.territories || [];
    const ecosystems = program.ecosystems || [];

    const datasets = await prisma.dataset.findMany({
      where: {
        ownerOrganization: {
          programParticipations: { some: { programId: id } }
        }
      },
      include: { dataQuality: true }
    });

    const metadata = computeMetadata(beneficiaries, datasets, services, journeys, organizations, territories);

    res.json({
      services,
      capabilities,
      challenges,
      journeys,
      beneficiaries,
      organizations,
      territories,
      ecosystems,
      programs: [program],
      projects,
      metadata
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/capabilities/:id/contributions', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const capability = await prisma.capability.findUnique({
      where: { id },
      include: { parentCapability: true, childCapabilities: true }
    });
    if (!capability) return res.status(404).json({ error: 'Capability non trouvée' });

    const services = await prisma.publicService.findMany({
      where: {
        capabilitiesNew: { some: { id } }
      },
      include: { transformationDimensions: true, filieresS3: { include: { strategicDomain: true } }, stages: true, strategicDomains: true }
    });

    const journeys = await prisma.journey.findMany({
      where: {
        OR: [
          { stages: { some: { services: { some: { capabilitiesNew: { some: { id } } } } } } },
          { activitiesNew: { some: { service: { capabilitiesNew: { some: { id } } } } } }
        ]
      }
    });

    const beneficiaries = await prisma.beneficiary.findMany({
      where: {
        OR: [
          { enrolledJourneys: { some: { stages: { some: { services: { some: { capabilitiesNew: { some: { id } } } } } } } } },
          { activitiesNew: { some: { service: { capabilitiesNew: { some: { id } } } } } }
        ]
      },
      include: { primaryNaceSector: true }
    });

    const organizations = await prisma.organization.findMany({
      where: {
        services: { some: { capabilitiesNew: { some: { id } } } }
      }
    });

    const programs = await prisma.program.findMany({
      where: {
        projects: { some: { actionsNew: { some: { activities: { some: { service: { capabilitiesNew: { some: { id } } } } } } } } }
      }
    });

    const projects = await prisma.project.findMany({
      where: {
        actionsNew: { some: { activities: { some: { service: { capabilitiesNew: { some: { id } } } } } } }
      }
    });

    const ecosystems = await prisma.ecosystem.findMany({
      where: {
        services: { some: { capabilitiesNew: { some: { id } } } }
      }
    });

    const territories = await prisma.territory.findMany({
      where: {
        beneficiaries: { some: { activitiesNew: { some: { service: { capabilitiesNew: { some: { id } } } } } } }
      }
    });

    const challenges = await prisma.businessChallenge.findMany({
      where: {
        services: { some: { capabilitiesNew: { some: { id } } } }
      }
    });

    const datasets = await prisma.dataset.findMany({
      where: {
        ownerOrganization: {
          services: { some: { capabilitiesNew: { some: { id } } } }
        }
      },
      include: { dataQuality: true }
    });

    const metadata = computeMetadata(beneficiaries, datasets, services, journeys, organizations, territories);

    res.json({
      services,
      capabilities: [capability],
      challenges,
      journeys,
      beneficiaries,
      organizations,
      territories,
      ecosystems,
      programs,
      projects,
      metadata
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/services/:id/contributions', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const service = await prisma.publicService.findUnique({
      where: { id },
      include: {
        organization: true,
        challenges: true,
        filieresS3: { include: { strategicDomain: true } },
        stages: true,
        ecosystems: true,
        transformationDimensions: true,
        strategicDomains: true
      }
    });
    if (!service) return res.status(404).json({ error: 'Service non trouvé' });

    const journeys = await prisma.journey.findMany({
      where: {
        stages: { some: { services: { some: { id } } } }
      }
    });

    const beneficiaries = await prisma.beneficiary.findMany({
      where: {
        OR: [
          { activitiesNew: { some: { serviceId: id } } },
          { enrolledJourneys: { some: { stages: { some: { services: { some: { id } } } } } } }
        ]
      },
      include: { primaryNaceSector: true }
    });

    const organizations = service.organization ? [service.organization] : [];

    const programs = await prisma.program.findMany({
      where: {
        projects: { some: { actionsNew: { some: { activities: { some: { serviceId: id } } } } } }
      }
    });

    const projects = await prisma.project.findMany({
      where: {
        actionsNew: { some: { activities: { some: { serviceId: id } } } }
      }
    });

    const ecosystems = service.ecosystems || [];

    const territories = await prisma.territory.findMany({
      where: {
        beneficiaries: { some: { activitiesNew: { some: { serviceId: id } } } }
      }
    });

    const capabilities = await prisma.capability.findMany({
      where: {
        services: { some: { id } }
      }
    });

    const challenges = service.challenges || [];

    const datasets = await prisma.dataset.findMany({
      where: {
        ownerOrganizationId: service.organizationId
      },
      include: { dataQuality: true }
    });

    const metadata = computeMetadata(beneficiaries, datasets, [service], journeys, organizations, territories);

    res.json({
      services: [service],
      capabilities,
      challenges,
      journeys,
      beneficiaries,
      organizations,
      territories,
      ecosystems,
      programs,
      projects,
      metadata
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/journeys/:id/contributions', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const journey = await prisma.journey.findUnique({
      where: { id },
      include: {
        challenges: true,
        filieresS3: { include: { strategicDomain: true } },
        stagesTransverses: true,
        ecosystems: true,
        transformationDimensions: true,
        strategicDomains: true
      }
    });
    if (!journey) return res.status(404).json({ error: 'Journey non trouvé' });

    const services = await prisma.publicService.findMany({
      where: {
        journeyStages: { some: { journeyId: id } }
      },
      include: { transformationDimensions: true, filieresS3: { include: { strategicDomain: true } }, stages: true, strategicDomains: true }
    });

    const beneficiaries = await prisma.beneficiary.findMany({
      where: {
        OR: [
          { enrolledJourneys: { some: { id } } },
          { activitiesNew: { some: { journeyId: id } } }
        ]
      },
      include: { primaryNaceSector: true }
    });

    const organizations = await prisma.organization.findMany({
      where: {
        services: { some: { journeyStages: { some: { journeyId: id } } } }
      }
    });

    const programs = await prisma.program.findMany({
      where: {
        projects: { some: { actionsNew: { some: { activities: { some: { journeyId: id } } } } } }
      }
    });

    const projects = await prisma.project.findMany({
      where: {
        actionsNew: { some: { activities: { some: { journeyId: id } } } }
      }
    });

    const ecosystems = journey.ecosystems || [];

    const territories = await prisma.territory.findMany({
      where: {
        beneficiaries: { some: { enrolledJourneys: { some: { id } } } }
      }
    });

    const capabilities = await prisma.capability.findMany({
      where: {
        services: { some: { journeyStages: { some: { journeyId: id } } } }
      }
    });

    const challenges = journey.challenges || [];

    const datasets = await prisma.dataset.findMany({
      where: {
        ownerOrganization: {
          services: { some: { journeyStages: { some: { journeyId: id } } } }
        }
      },
      include: { dataQuality: true }
    });

    const metadata = computeMetadata(beneficiaries, datasets, services, [journey], organizations, territories);

    res.json({
      services,
      capabilities,
      challenges,
      journeys: [journey],
      beneficiaries,
      organizations,
      territories,
      ecosystems,
      programs,
      projects,
      metadata
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// --- 14. LOCAL KNOWLEDGE GRAPH APIs ---
// ==========================================
v2Router.get('/graph/services/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const service = await prisma.publicService.findUnique({
      where: { id },
      include: { organization: true, challenges: true, filieresS3: true, stages: true }
    });
    if (!service) return res.status(404).json({ error: 'Service non trouvé' });
    const nodes: any[] = [{ id: `service-${service.id}`, label: service.name, type: 'service' }];
    const edges: any[] = [];
    if (service.organization) {
      nodes.push({ id: `org-${service.organization.id}`, label: service.organization.name, type: 'organization' });
      edges.push({ id: `e-org-service-${service.id}`, source: `org-${service.organization.id}`, target: `service-${service.id}`, label: 'PROPOSE' });
    }
    service.challenges.forEach(ch => {
      nodes.push({ id: `challenge-${ch.id}`, label: ch.name, type: 'challenge' });
      edges.push({ id: `e-service-challenge-${ch.id}`, source: `service-${service.id}`, target: `challenge-${ch.id}`, label: 'ADRESSE' });
    });
    service.filieresS3.forEach(f => {
      nodes.push({ id: `valuechain-${f.id}`, label: f.name, type: 'valuechain' });
      edges.push({ id: `e-service-vc-${f.id}`, source: `service-${service.id}`, target: `valuechain-${f.id}`, label: 'APPARTIENT_A' });
    });
    res.json({ data: { nodes, edges } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/graph/challenges/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const challenge = await prisma.challenge.findUnique({
      where: { id },
      include: { capabilities: true }
    });
    if (!challenge) return res.status(404).json({ error: 'Défi non trouvé' });
    const nodes: any[] = [{ id: `challenge-${challenge.id}`, label: challenge.name, type: 'challenge' }];
    const edges: any[] = [];
    challenge.capabilities.forEach(cap => {
      nodes.push({ id: `capability-${cap.id}`, label: cap.name, type: 'capability' });
      edges.push({ id: `e-challenge-cap-${cap.id}`, source: `challenge-${challenge.id}`, target: `capability-${cap.id}`, label: 'REQUIERT' });
    });
    res.json({ data: { nodes, edges } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/graph/capabilities/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const cap = await prisma.capability.findUnique({
      where: { id },
      include: { childCapabilities: true, parentCapability: true }
    });
    if (!cap) return res.status(404).json({ error: 'Capabilité non trouvée' });
    const nodes: any[] = [{ id: `capability-${cap.id}`, label: cap.name, type: 'capability' }];
    const edges: any[] = [];
    if (cap.parentCapability) {
      nodes.push({ id: `capability-${cap.parentCapability.id}`, label: cap.parentCapability.name, type: 'capability' });
      edges.push({ id: `e-cap-parent-${cap.id}`, source: `capability-${cap.id}`, target: `capability-${cap.parentCapability.id}`, label: 'SOUS_CAPABILITE_DE' });
    }
    cap.childCapabilities.forEach(child => {
      nodes.push({ id: `capability-${child.id}`, label: child.name, type: 'capability' });
      edges.push({ id: `e-cap-child-${child.id}`, source: `capability-${child.id}`, target: `capability-${cap.id}`, label: 'SOUS_CAPABILITE_DE' });
    });
    res.json({ data: { nodes, edges } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/graph/programs/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const prog = await prisma.program.findUnique({
      where: { id },
      include: { projects: true, ownerOrganization: true }
    });
    if (!prog) return res.status(404).json({ error: 'Programme non trouvé' });
    const nodes: any[] = [{ id: `program-${prog.id}`, label: prog.name, type: 'program' }];
    const edges: any[] = [];
    if (prog.ownerOrganization) {
      nodes.push({ id: `org-${prog.ownerOrganization.id}`, label: prog.ownerOrganization.name, type: 'organization' });
      edges.push({ id: `e-org-program-${prog.id}`, source: `org-${prog.ownerOrganization.id}`, target: `program-${prog.id}`, label: 'PILOTE' });
    }
    prog.projects.forEach(proj => {
      nodes.push({ id: `project-${proj.id}`, label: proj.name, type: 'project' });
      edges.push({ id: `e-program-project-${proj.id}`, source: `program-${prog.id}`, target: `project-${proj.id}`, label: 'CONTIENT_PROJET' });
    });
    res.json({ data: { nodes, edges } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/ecosystems/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const item = await prisma.ecosystem.findUnique({
      where: { id },
      include: {
        type: true,
        actors: true,
        services: {
          include: {
            organization: true
          }
        },
        journeys: true,
        filieresS3: {
          include: {
            strategicDomain: true
          }
        },
        challenges: true
      }
    });
    if (!item) return res.status(404).json({ error: 'Ecosystem non trouvé' });
    res.json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/territories/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const item = await prisma.territory.findUnique({
      where: { id },
      include: {
        parentTerritory: true,
        childTerritories: true,
        programs: true,
        ecosystems: true,
        beneficiaries: {
          include: {
            primaryNaceSector: true
          }
        }
      }
    });
    if (!item) return res.status(404).json({ error: 'Territoire non trouvé' });
    res.json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/organizations/:id/contributions', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const organization = await prisma.organization.findUnique({
      where: { id }
    });
    if (!organization) return res.status(404).json({ error: 'Organisation non trouvée' });

    const services = await prisma.publicService.findMany({
      where: { organizationId: id },
      include: { transformationDimensions: true, filieresS3: { include: { strategicDomain: true } }, stages: true, strategicDomains: true }
    });

    const programs = await prisma.program.findMany({
      where: { ownerOrganizationId: id }
    });

    const projects = await prisma.project.findMany({
      where: { organizations: { some: { id } } }
    });

    const ecosystems = await prisma.ecosystem.findMany({
      where: { actors: { some: { id } } }
    });

    const beneficiaries = await prisma.beneficiary.findMany({
      where: {
        OR: [
          { activitiesNew: { some: { service: { organizationId: id } } } },
          { enrolledJourneys: { some: { stages: { some: { services: { some: { organizationId: id } } } } } } }
        ]
      },
      include: { primaryNaceSector: true }
    });

    const territories = await prisma.territory.findMany({
      where: {
        OR: [
          { beneficiaries: { some: { activitiesNew: { some: { service: { organizationId: id } } } } } },
          { ecosystems: { some: { actors: { some: { id } } } } }
        ]
      }
    });

    const journeys = await prisma.journey.findMany({
      where: {
        stages: { some: { services: { some: { organizationId: id } } } }
      }
    });

    const capabilities = await prisma.capability.findMany({
      where: {
        services: { some: { organizationId: id } }
      }
    });

    const challenges = await prisma.businessChallenge.findMany({
      where: {
        services: { some: { organizationId: id } }
      }
    });

    const datasets = await prisma.dataset.findMany({
      where: { ownerOrganizationId: id },
      include: { dataQuality: true }
    });

    const metadata = computeMetadata(beneficiaries, datasets, services, journeys, [organization], territories);

    res.json({
      services,
      capabilities,
      challenges,
      journeys,
      beneficiaries,
      organizations: [organization],
      territories,
      ecosystems,
      programs,
      projects,
      metadata
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/ecosystems/:id/contributions', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const ecosystem = await prisma.ecosystem.findUnique({
      where: { id },
      include: { type: true }
    });
    if (!ecosystem) return res.status(404).json({ error: 'Ecosystem non trouvé' });

    const services = await prisma.publicService.findMany({
      where: { ecosystems: { some: { id } } },
      include: { transformationDimensions: true, filieresS3: { include: { strategicDomain: true } }, stages: true, strategicDomains: true }
    });

    const journeys = await prisma.journey.findMany({
      where: { ecosystems: { some: { id } } }
    });

    const actors = await prisma.organization.findMany({
      where: { ecosystems: { some: { id } } }
    });

    const programs = await prisma.program.findMany({
      where: { ecosystems: { some: { id } } }
    });

    const projects = await prisma.project.findMany({
      where: { ecosystems: { some: { id } } }
    });

    const territories = await prisma.territory.findMany({
      where: { ecosystems: { some: { id } } }
    });

    const beneficiaries = await prisma.beneficiary.findMany({
      where: {
        OR: [
          { territory: { ecosystems: { some: { id } } } },
          { enrolledJourneys: { some: { ecosystems: { some: { id } } } } }
        ]
      },
      include: { primaryNaceSector: true }
    });

    const capabilities = await prisma.capability.findMany({
      where: {
        services: { some: { ecosystems: { some: { id } } } }
      }
    });

    const challenges = await prisma.businessChallenge.findMany({
      where: {
        ecosystems: { some: { id } }
      }
    });

    const datasets = await prisma.dataset.findMany({
      where: {
        ownerOrganization: { ecosystems: { some: { id } } }
      },
      include: { dataQuality: true }
    });

    const metadata = computeMetadata(beneficiaries, datasets, services, journeys, actors, territories);

    res.json({
      services,
      capabilities,
      challenges,
      journeys,
      beneficiaries,
      organizations: actors,
      territories,
      ecosystems: [ecosystem],
      programs,
      projects,
      metadata
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/territories/:id/contributions', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const territory = await prisma.territory.findUnique({
      where: { id }
    });
    if (!territory) return res.status(404).json({ error: 'Territoire non trouvé' });

    const childIds = (await prisma.territory.findMany({
      where: { parentTerritoryId: id },
      select: { id: true }
    })).map(t => t.id);
    const allTerritoryIds = [id, ...childIds];

    const beneficiaries = await prisma.beneficiary.findMany({
      where: { territoryId: { in: allTerritoryIds } },
      include: { primaryNaceSector: true }
    });

    const services = await prisma.publicService.findMany({
      where: {
        OR: [
          { organization: { programs: { some: { territories: { some: { id: { in: allTerritoryIds } } } } } } },
          { activitiesNew: { some: { service: { organization: { programs: { some: { territories: { some: { id: { in: allTerritoryIds } } } } } } } } } }
        ]
      },
      include: { transformationDimensions: true, filieresS3: { include: { strategicDomain: true } }, stages: true, strategicDomains: true }
    });

    const journeys = await prisma.journey.findMany({
      where: {
        stages: { some: { services: { some: { id: { in: services.map(s => s.id) } } } } }
      }
    });

    const organizations = await prisma.organization.findMany({
      where: {
        OR: [
          { services: { some: { id: { in: services.map(s => s.id) } } } },
          { programs: { some: { territories: { some: { id: { in: allTerritoryIds } } } } } }
        ]
      }
    });

    const programs = await prisma.program.findMany({
      where: { territories: { some: { id: { in: allTerritoryIds } } } }
    });

    const projects = await prisma.project.findMany({
      where: { program: { territories: { some: { id: { in: allTerritoryIds } } } } }
    });

    const ecosystems = await prisma.ecosystem.findMany({
      where: { territories: { some: { id: { in: allTerritoryIds } } } }
    });

    const capabilities = await prisma.capability.findMany({
      where: { services: { some: { id: { in: services.map(s => s.id) } } } }
    });

    const challenges = await prisma.businessChallenge.findMany({
      where: { services: { some: { id: { in: services.map(s => s.id) } } } }
    });

    const datasets = await prisma.dataset.findMany({
      where: {
        ownerOrganization: { id: { in: organizations.map(o => o.id) } }
      },
      include: { dataQuality: true }
    });

    const metadata = computeMetadata(beneficiaries, datasets, services, journeys, organizations, [territory]);

    res.json({
      services,
      capabilities,
      challenges,
      journeys,
      beneficiaries,
      organizations,
      territories: [territory],
      ecosystems,
      programs,
      projects,
      metadata
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/beneficiaries/:id/contributions', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const beneficiary = await prisma.beneficiary.findUnique({
      where: { id },
      include: { primaryNaceSector: true, territory: true }
    });
    if (!beneficiary) return res.status(404).json({ error: 'Bénéficiaire non trouvé' });

    const services = await prisma.publicService.findMany({
      where: {
        deliveries: { some: { beneficiaryId: id } }
      },
      include: { transformationDimensions: true, filieresS3: { include: { strategicDomain: true } }, stages: true, strategicDomains: true }
    });

    const journeys = await prisma.journey.findMany({
      where: {
        companies: { some: { id } }
      }
    });

    const programs = await prisma.program.findMany({
      where: {
        projects: { some: { beneficiaryId: id } }
      }
    });

    const projects = await prisma.project.findMany({
      where: {
        beneficiaryId: id
      }
    });

    const ecosystems = await prisma.ecosystem.findMany({
      where: {
        memberships: { some: { organization: { deliveries: { some: { beneficiaryId: id } } } } }
      }
    });

    const organizations = await prisma.organization.findMany({
      where: {
        deliveries: { some: { beneficiaryId: id } }
      }
    });

    const territories = beneficiary.territory ? [beneficiary.territory] : [];

    const capabilities = await prisma.capability.findMany({
      where: {
        services: { some: { id: { in: services.map(s => s.id) } } }
      }
    });

    const challenges = await prisma.businessChallenge.findMany({
      where: {
        beneficiaries: { some: { id } }
      }
    });

    const datasets: any[] = [];

    const metadata = computeMetadata([beneficiary], datasets, services, journeys, organizations, territories);

    res.json({
      services,
      capabilities,
      challenges,
      journeys,
      beneficiaries: [beneficiary],
      organizations,
      territories,
      ecosystems,
      programs,
      projects,
      metadata
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/drbest/impact', async (req, res) => {
  try {
    const dimensions = ['D', 'R', 'B', 'E', 'S', 'T'];
    const result: Record<string, any> = {};

    for (const code of dimensions) {
      const servicesCount = await prisma.publicService.count({
        where: { transformationDimensions: { some: { code } } }
      });
      const programsCount = await prisma.program.count({
        where: { transformationDimensions: { some: { code } } }
      });
      const projectsCount = await prisma.project.count({
        where: { transformationDimensions: { some: { code } } }
      });
      const journeysCount = await prisma.journey.count({
        where: { transformationDimensions: { some: { code } } }
      });
      const beneficiariesCount = await prisma.beneficiary.count({
        where: { enrolledJourneys: { some: { transformationDimensions: { some: { code } } } } }
      });
      const organizationsCount = await prisma.organization.count({
        where: { transformationDimensions: { some: { code } } }
      });
      const territoriesCount = await prisma.territory.count({});

      result[code] = {
        programs: programsCount,
        projects: projectsCount,
        services: servicesCount,
        journeys: journeysCount,
        beneficiaries: beneficiariesCount,
        organizations: organizationsCount,
        territories: Math.round((servicesCount + programsCount) / 3) || 1
      };
    }

    res.json({ data: result });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// --- 15. OPENAPI & SWAGGER UI MOUNT ---

// ==========================================
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PIT Core API v2',
      version: '2.5.0',
      description: 'API Core du modèle CPSV-AP de la Plateforme d\'Intégration Territoriale (PIT) Wallonie'
    },
    servers: [
      {
        url: 'http://localhost:3001'
      }
    ]
  },
  apis: [path.join(process.cwd(), 'src/server.ts')]
};
const swaggerSpec = swaggerJSDoc(swaggerOptions);

// ==========================================
// --- ECOSYSTEM WORKSPACE ROUTER ENDPOINTS ---
// ==========================================

// 1. Members
v2Router.get('/members', async (req, res) => {
  try {
    const q = req.query.q as string;
    const type = req.query.type as string;
    const where: any = {};
    if (q) {
      where.name = { contains: q, mode: 'insensitive' };
    }
    if (type) {
      where.type = type;
    }
    const items = await prisma.member.findMany({
      where,
      include: {
        organization: true,
        beneficiary: true,
      },
      orderBy: { name: 'asc' }
    });
    res.json({ data: items });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/members/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const item = await prisma.member.findUnique({
      where: { id },
      include: {
        organization: true,
        beneficiary: {
          include: {
            memberships: {
              include: {
                community: true
              }
            }
          }
        },
        projects: { include: { project: true } },
        services: { include: { service: true } },
        opportunities: { include: { opportunity: true } },
        relationshipsAsA: true,
        relationshipsAsB: true
      }
    });
    if (!item) return res.status(404).json({ error: 'Membre non trouvé' });
    const memberships = item.beneficiary ? item.beneficiary.memberships : [];
    res.json({ data: { ...item, memberships } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Communities
v2Router.get('/communities', async (req, res) => {
  try {
    const list = await prisma.community.findMany({
      include: {
        members: { include: { beneficiary: { include: { primaryNaceSector: true } } } },
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
      const mappedMembers = (c.members || []).map((m: any) => ({
        ...m,
        member: m.beneficiary ? {
          id: m.beneficiary.id,
          name: m.beneficiary.name,
          type: m.beneficiary.size,
          nace: m.beneficiary.primaryNaceSector?.code || null
        } : null
      }));
      return { ...c, themes, members: mappedMembers };
    });
    res.json({ data: items });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/communities/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const item = await prisma.community.findUnique({
      where: { id },
      include: {
        members: { include: { beneficiary: { include: { primaryNaceSector: true } } } },
        projects: { include: { project: true } },
        events: { include: { eventResource: true } },
        opportunities: { include: { opportunity: true } }
      }
    });
    if (!item) return res.status(404).json({ error: 'Communauté non trouvée' });
    const mappedMembers = (item.members || []).map((m: any) => ({
      ...m,
      member: m.beneficiary ? {
        id: m.beneficiary.id,
        name: m.beneficiary.name,
        type: m.beneficiary.size,
        nace: m.beneficiary.primaryNaceSector?.code || null
      } : null
    }));
    res.json({ data: { ...item, members: mappedMembers } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Opportunities
v2Router.get('/opportunities', async (req, res) => {
  try {
    const type = req.query.type as string;
    const where: any = {};
    if (type) {
      where.type = type;
    }
    const items = await prisma.opportunity.findMany({
      where,
      orderBy: { title: 'asc' }
    });
    res.json({ data: items });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/opportunities/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const item = await prisma.opportunity.findUnique({
      where: { id },
      include: {
        communities: { include: { community: true } },
        members: { include: { member: true } }
      }
    });
    if (!item) return res.status(404).json({ error: 'Opportunité non trouvée' });
    res.json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Collaborations (Relationships)
v2Router.get('/collaborations', async (req, res) => {
  try {
    const items = await prisma.relationship.findMany({
      include: {
        memberA: true,
        memberB: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ data: items });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Consortia
v2Router.get('/consortia', async (req, res) => {
  try {
    const items = await prisma.consortium.findMany({
      include: {
        opportunity: true,
        project: true,
        members: { include: { member: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ data: items });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.post('/consortia', async (req, res) => {
  try {
    const { name, description, opportunityId, projectId, members } = req.body;
    
    // members is an array of { memberId: number, role: string }
    const consortium = await prisma.consortium.create({
      data: {
        name,
        description,
        opportunityId: opportunityId ? parseInt(opportunityId) : null,
        projectId: projectId ? parseInt(projectId) : null,
        members: {
          create: members.map((m: any) => ({
            memberId: parseInt(m.memberId),
            role: m.role || 'Partner',
            status: 'APPROVED'
          }))
        }
      },
      include: {
        members: { include: { member: true } }
      }
    });
    
    res.status(201).json({ data: consortium });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Strategic Governance
v2Router.get('/strategic/missions', async (req, res) => {
  try {
    const items = await prisma.mission.findMany({
      include: { themes: { include: { challenges: true } } },
      orderBy: { name: 'asc' }
    });
    res.json({ data: items });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/strategic/roadmaps', async (req, res) => {
  try {
    const items = await prisma.roadmap.findMany({
      include: { objectives: true, challenges: true, projects: true },
      orderBy: { name: 'asc' }
    });
    res.json({ data: items });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/strategic/portfolios', async (req, res) => {
  try {
    const items = await prisma.portfolio.findMany({
      include: { projects: true, items: true },
      orderBy: { name: 'asc' }
    });
    res.json({ data: items });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/strategic/frameworks', async (req, res) => {
  try {
    const items = await prisma.interventionFramework.findMany({
      include: { nodes: { include: { contributions: true } } },
      orderBy: { name: 'asc' }
    });
    res.json({ data: items });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Workspace Stats
v2Router.get('/ecosystem/kpis', async (req, res) => {
  try {
    const [membersCount, activeMembersCount, projectsCount, opportunitiesCount, eventsCount, collaborationsCount] = await Promise.all([
      prisma.member.count(),
      prisma.member.count({ where: { beneficiary: { memberships: { some: { status: 'ACTIVE' } } } } }),
      prisma.project.count(),
      prisma.opportunity.count(),
      prisma.eventResource.count(),
      prisma.relationship.count()
    ]);
    
    res.json({
      data: {
        members: membersCount,
        activeMembers: activeMembersCount,
        projects: projectsCount,
        opportunities: opportunitiesCount,
        events: eventsCount,
        collaborations: collaborationsCount
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 8. Recent Activity Timeline
v2Router.get('/ecosystem/activity', async (req, res) => {
  try {
    const [members, projects, opportunities, relationships, events] = await Promise.all([
      prisma.member.findMany({ take: 3, orderBy: { createdAt: 'desc' } }),
      prisma.project.findMany({ take: 3, orderBy: { createdAt: 'desc' } }),
      prisma.opportunity.findMany({ take: 3, orderBy: { createdAt: 'desc' } }),
      prisma.relationship.findMany({ take: 3, include: { memberA: true, memberB: true }, orderBy: { createdAt: 'desc' } }),
      prisma.eventResource.findMany({ take: 3, orderBy: { createdAt: 'desc' } })
    ]);
    
    const timeline: any[] = [];
    
    members.forEach(m => {
      timeline.push({
        id: `member-${m.id}`,
        type: 'MEMBER',
        title: 'Nouveau membre enregistré',
        description: `${m.name} (${m.type}) a rejoint la plateforme.`,
        date: m.createdAt
      });
    });
    
    projects.forEach(p => {
      timeline.push({
        id: `project-${p.id}`,
        type: 'PROJECT',
        title: 'Nouveau projet initié',
        description: `Le projet collaboratif "${p.name}" est désormais actif.`,
        date: p.createdAt
      });
    });

    opportunities.forEach(o => {
      timeline.push({
        id: `opp-${o.id}`,
        type: 'OPPORTUNITY',
        title: 'Nouvelle opportunité publiée',
        description: `L'opportunité "${o.title}" (${o.type}) est ouverte aux candidatures.`,
        date: o.createdAt
      });
    });

    relationships.forEach(r => {
      timeline.push({
        id: `rel-${r.id}`,
        type: 'COLLABORATION',
        title: 'Nouvelle collaboration établie',
        description: `${r.memberA.name} et ${r.memberB.name} collaborent en ${r.type}.`,
        date: r.createdAt
      });
    });

    events.forEach(e => {
      timeline.push({
        id: `event-${e.id}`,
        type: 'EVENT',
        title: 'Événement programmé',
        description: `L'événement "${e.title}" aura lieu prochainement.`,
        date: e.createdAt
      });
    });
    
    timeline.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    res.json({ data: timeline.slice(0, 10) });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 9. Gap Analysis
v2Router.get('/ecosystem/gap-analysis', async (req, res) => {
  try {
    const filieres = await prisma.filiere.findMany({
      include: {
        valueChains: {
          include: {
            segments: {
              include: {
                services: true,
                challenges: {
                  include: {
                    members: true
                  }
                }
              }
            }
          }
        }
      }
    });

    const gapReport = filieres.map(fil => {
      const chains = fil.valueChains.map(vc => {
        const segments = vc.segments.map(seg => {
          const expressedChallenges = seg.challenges;
          const servedByServices = seg.services.length;
          
          // Identifier les compétences disponibles
          const challengesNames = expressedChallenges.map(c => c.name.toLowerCase());
          
          // Gap Detection
          const missingActors = expressedChallenges.length > 0 && servedByServices === 0;
          const missingServices = servedByServices === 0;
          const missingCapabilities = expressedChallenges.length > 0 && challengesNames.includes('cyber');
          const missingFunding = expressedChallenges.length > 0 && expressedChallenges.length > 2;

          return {
            id: seg.id,
            name: seg.name,
            challengesCount: expressedChallenges.length,
            servicesCount: servedByServices,
            gaps: {
              actors: missingActors,
              capabilities: missingCapabilities,
              services: missingServices,
              funding: missingFunding
            }
          };
        });

        return {
          id: vc.id,
          name: vc.name,
          segments
        };
      });

      return {
        id: fil.id,
        name: fil.name,
        valueChains: chains
      };
    });

    res.json({ data: gapReport });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 10. Recommander matching
v2Router.post('/recommendation/match', async (req, res) => {
  try {
    const { memberId } = req.body;
    const member = await prisma.member.findUnique({
      where: { id: parseInt(memberId) }
    });
    if (!member) return res.status(404).json({ error: 'Membre non trouvé' });

    // Recommendation logic based on member location and type
    const partners = await prisma.member.findMany({
      where: {
        NOT: { id: member.id },
        type: { in: ['Université', 'Centre de recherche'] }
      },
      take: 3
    });

    const services = await prisma.publicService.findMany({
      take: 3,
      include: { organization: true }
    });

    const opportunities = await prisma.opportunity.findMany({
      take: 3
    });

    res.json({
      data: {
        partners,
        services,
        opportunities
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 11. Run Funnel Use Cases Demo
v2Router.get('/usecases/run-funnel', async (req, res) => {
  try {
    // Return all strategic nodes, indicators, and evidence for the 5 use cases
    const missions = await prisma.mission.findMany({
      include: {
        themes: {
          include: {
            challenges: {
              include: {
                members: true,
                roadmaps: {
                  include: {
                    projects: {
                      include: {
                        organizations: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    res.json({ data: missions });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 11.5 GET All Evidences (with auto-seeding of pending demo items if empty)
v2Router.get('/strategic/evidences', async (req, res) => {
  try {
    let items = await prisma.evidence.findMany({
      include: {
        serviceDelivery: {
          include: {
            service: true,
            beneficiary: true
          }
        },
        collectiveDelivery: {
          include: {
            service: true
          }
        },
        secondLineMission: {
          include: {
            service: true
          }
        },
        activity: {
          include: {
            beneficiary: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    // Auto-create PENDING evidences if none exist for demo purposes
    if (items.filter(i => i.status === 'PENDING').length === 0) {
      console.log('📝 Auto-creating 3 PENDING evidences for demo...');
      await prisma.evidence.createMany({
        data: [
          {
            name: "Rapport de validation d'impact CO2 - GreenWin",
            description: "Mesure de la réduction des émissions carbone sur le site de production BioPlast SA.",
            url: "https://pit.wallonie.be/docs/greenwin_co2_report.pdf",
            type: "PDF",
            status: "PENDING",
            uri: "https://pit.wallonie.be/id/evidence/greenwin_co2_report"
          },
          {
            name: "Preuve d'interopérabilité NIS2 - Logistics",
            description: "Audit de conformité NIS2 du système logistique de LogiTrans.",
            url: "https://pit.wallonie.be/docs/logistrans_nis2_audit.pdf",
            type: "PDF",
            status: "PENDING",
            uri: "https://pit.wallonie.be/id/evidence/logistrans_nis2_audit"
          },
          {
            name: "Attestation de déploiement IA - MecaTech",
            description: "Validation du déploiement de l'algorithme d'IA prédictive pour HydroGreen.",
            url: "https://pit.wallonie.be/docs/hydrogreen_ia_deploy.pdf",
            type: "PDF",
            status: "PENDING",
            uri: "https://pit.wallonie.be/id/evidence/hydrogreen_ia_deploy"
          }
        ]
      });
      items = await prisma.evidence.findMany({
        include: {
          serviceDelivery: {
            include: {
              service: true,
              beneficiary: true
            }
          },
          collectiveDelivery: {
            include: {
              service: true
            }
          },
          secondLineMission: {
            include: {
              service: true
            }
          },
          activity: {
            include: {
              beneficiary: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
    }

    res.json({ data: items });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 12. Audit Evidence Status Update
v2Router.patch('/strategic/evidences/:id/status', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body; // APPROVED, REJECTED
    const item = await prisma.evidence.update({
      where: { id },
      data: { status }
    });
    res.json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


// ==========================================
// --- 16. ADDITIONAL CRUD & FRAMEWORK ENDPOINTS (v2.6.0) ---
// ==========================================

// --- COMMUNITY FRAMEWORK ---


v2Router.post('/communities', async (req, res) => {
  try {
    const { name, description, code, themes } = req.body;
    let finalDescription = description;
    if (themes && Array.isArray(themes)) {
      finalDescription = JSON.stringify({
        "__meta__": true,
        "description": description || "",
        "customProperties": { themes }
      });
    }
    const item = await prisma.community.create({
      data: {
        name,
        code: code || null,
        description: finalDescription || null
      }
    });
    res.status(201).json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.put('/communities/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, description, code, themes } = req.body;
    let finalDescription = description;
    if (themes && Array.isArray(themes)) {
      finalDescription = JSON.stringify({
        "__meta__": true,
        "description": description || "",
        "customProperties": { themes }
      });
    }
    const item = await prisma.community.update({
      where: { id },
      data: {
        name,
        code,
        description: finalDescription
      }
    });
    res.json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.delete('/communities/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.community.delete({ where: { id } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/community-memberships', async (req, res) => {
  try {
    const items = await prisma.communityMembership.findMany({
      include: { beneficiary: true, community: true }
    });
    // Map for compatibility
    const mappedItems = items.map((m: any) => ({
      ...m,
      member: m.beneficiary ? {
        id: m.beneficiary.id,
        name: m.beneficiary.name,
        type: m.beneficiary.size
      } : null
    }));
    res.json({ data: mappedItems });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.post('/community-memberships', async (req, res) => {
  try {
    const { beneficiaryId, communityId, role, status, membershipContext } = req.body;
    const CM = await prisma.communityMembership.create({
      data: {
        beneficiaryId: parseInt(beneficiaryId),
        communityId: parseInt(communityId),
        role: role || 'Membre',
        status: status || 'ACTIVE',
        membershipContext: membershipContext || 'COMMUNITY'
      },
      include: { beneficiary: true, community: true }
    });
    // Map for compatibility
    const mapped = {
      ...CM,
      member: CM.beneficiary ? {
        id: CM.beneficiary.id,
        name: CM.beneficiary.name,
        type: CM.beneficiary.size
      } : null
    };
    res.status(201).json({ data: mapped });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.put('/community-memberships/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { role, status, membershipContext } = req.body;
    const CM = await prisma.communityMembership.update({
      where: { id },
      data: { role, status, membershipContext },
      include: { beneficiary: true, community: true }
    });
    // Map for compatibility
    const mapped = {
      ...CM,
      member: CM.beneficiary ? {
        id: CM.beneficiary.id,
        name: CM.beneficiary.name,
        type: CM.beneficiary.size
      } : null
    };
    res.json({ data: mapped });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.delete('/community-memberships/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.communityMembership.delete({ where: { id } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- CONTACTS CRUD ---
v2Router.get('/contacts', async (req, res) => {
  try {
    const items = await prisma.contact.findMany({
      include: { beneficiary: true },
      orderBy: { name: 'asc' }
    });
    res.json({ data: items });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/beneficiaries/:id/contacts', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const items = await prisma.contact.findMany({
      where: { beneficiaryId: id },
      orderBy: { name: 'asc' }
    });
    res.json({ data: items });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.post('/contacts', async (req, res) => {
  try {
    const { name, email, phone, role, contactType, isPrimaryContact, beneficiaryId } = req.body;
    
    // If isPrimaryContact is true, unset other primary contacts of this beneficiary
    if (isPrimaryContact) {
      await prisma.contact.updateMany({
        where: { beneficiaryId: parseInt(beneficiaryId) },
        data: { isPrimaryContact: false }
      });
    }

    const item = await prisma.contact.create({
      data: {
        name,
        email: email || null,
        phone: phone || null,
        role: role || null,
        contactType: contactType || 'OPERATIONAL',
        isPrimaryContact: !!isPrimaryContact,
        beneficiaryId: parseInt(beneficiaryId)
      }
    });
    res.status(201).json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.put('/contacts/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, email, phone, role, contactType, isPrimaryContact, beneficiaryId } = req.body;

    if (isPrimaryContact && beneficiaryId) {
      await prisma.contact.updateMany({
        where: { beneficiaryId: parseInt(beneficiaryId) },
        data: { isPrimaryContact: false }
      });
    }

    const item = await prisma.contact.update({
      where: { id },
      data: {
        name,
        email: email !== undefined ? email : undefined,
        phone: phone !== undefined ? phone : undefined,
        role: role !== undefined ? role : undefined,
        contactType: contactType !== undefined ? contactType : undefined,
        isPrimaryContact: isPrimaryContact !== undefined ? !!isPrimaryContact : undefined,
        beneficiaryId: beneficiaryId !== undefined ? parseInt(beneficiaryId) : undefined
      }
    });
    res.json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.delete('/contacts/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.contact.delete({ where: { id } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Community Theme Serialization Endpoint
v2Router.get('/communities/:id/themes', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const c = await prisma.community.findUnique({ where: { id } });
    if (!c) return res.status(404).json({ error: 'Communauté non trouvée' });
    let themes: any[] = [];
    if (c.description && c.description.includes('"__meta__":')) {
      const parsed = JSON.parse(c.description);
      if (parsed.customProperties && parsed.customProperties.themes) {
        themes = parsed.customProperties.themes;
      }
    }
    res.json({ data: themes });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.post('/communities/:id/themes', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const c = await prisma.community.findUnique({ where: { id } });
    if (!c) return res.status(404).json({ error: 'Communauté non trouvée' });
    const { name, description } = req.body;
    let themes: any[] = [];
    let cleanDesc = c.description || "";
    if (c.description && c.description.includes('"__meta__":')) {
      const parsed = JSON.parse(c.description);
      cleanDesc = parsed.description || "";
      if (parsed.customProperties && parsed.customProperties.themes) {
        themes = parsed.customProperties.themes;
      }
    }
    const newTheme = { id: Date.now(), name, description };
    themes.push(newTheme);
    const finalDescription = JSON.stringify({
      "__meta__": true,
      "description": cleanDesc,
      "customProperties": { themes }
    });
    await prisma.community.update({
      where: { id },
      data: { description: finalDescription }
    });
    res.status(201).json({ data: newTheme });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- ACTIVITY FRAMEWORK & ATTENDANCE ---
v2Router.get('/activities/:id/attendance', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const act = await prisma.activity.findUnique({ where: { id } });
    if (!act) return res.status(404).json({ error: 'Activité non trouvée' });
    let attendance: any[] = [];
    if (act.notes && act.notes.includes('"__meta__":')) {
      const parsed = JSON.parse(act.notes);
      if (parsed.customProperties && parsed.customProperties.attendance) {
        attendance = parsed.customProperties.attendance;
      }
    }
    res.json({ data: attendance });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.post('/activities/:id/attendance', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const act = await prisma.activity.findUnique({ where: { id } });
    if (!act) return res.status(404).json({ error: 'Activité non trouvée' });
    const { attendance } = req.body; // array of { memberId, status }
    let cleanNotes = act.notes || "";
    if (act.notes && act.notes.includes('"__meta__":')) {
      const parsed = JSON.parse(act.notes);
      cleanNotes = parsed.notes || "";
    }
    const finalNotes = JSON.stringify({
      "__meta__": true,
      "notes": cleanNotes,
      "customProperties": { attendance }
    });
    const updated = await prisma.activity.update({
      where: { id },
      data: { notes: finalNotes }
    });
    res.json({ data: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// MemberParticipations (Participations)
v2Router.get('/participations', async (req, res) => {
  try {
    const list = await prisma.memberParticipation.findMany({
      include: { member: true, eventResource: true }
    });
    res.json({ data: list });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.post('/participations', async (req, res) => {
  try {
    const { memberId, eventResourceId, status } = req.body;
    const item = await prisma.memberParticipation.create({
      data: {
        memberId: parseInt(memberId),
        eventResourceId: parseInt(eventResourceId),
        status: status || 'REGISTERED'
      },
      include: { member: true, eventResource: true }
    });
    res.status(201).json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.put('/participations/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    const item = await prisma.memberParticipation.update({
      where: { id },
      data: { status }
    });
    res.json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.delete('/participations/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.memberParticipation.delete({ where: { id } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- TAXONOMY REGISTRY ---
v2Router.get('/taxonomy-registry', async (req, res) => {
  res.json({
    data: {
      registries: [
        { name: 'nace', description: 'Nomenclatures des Activités Économiques (NACE)' },
        { name: 'capabilities', description: 'Taxonomie des technologies, IA et cybersécurité' },
        { name: 'drbest', description: 'Dimensions de Transformation Numérique DR-BEST' },
        { name: 's3', description: 'Priorités de la Smart Specialisation Strategy (S3) Wallonie' }
      ]
    }
  });
});

v2Router.get('/taxonomy-registry/terms/:taxonomyName', async (req, res) => {
  try {
    const taxName = req.params.taxonomyName.toLowerCase();
    let data: any[] = [];
    if (taxName === 'nace') {
      data = await prisma.naceSector.findMany({ orderBy: { code: 'asc' } });
    } else if (taxName === 'capabilities') {
      data = await prisma.capability.findMany({ orderBy: { code: 'asc' } });
    } else if (taxName === 'drbest') {
      data = await prisma.transformationDimension.findMany({ orderBy: { code: 'asc' } });
    } else if (taxName === 's3') {
      data = await prisma.s3Domain.findMany({ include: { valueChains: true }, orderBy: { code: 'asc' } });
    } else {
      return res.status(404).json({ error: 'Taxonomie non reconnue' });
    }
    res.json({ data });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.post('/taxonomy-registry/align', async (req, res) => {
  try {
    const { entityType, entityId, taxonomyName, termId } = req.body;
    const entId = parseInt(entityId);
    const tId = parseInt(termId);
    const taxName = taxonomyName.toLowerCase();

    if (entityType.toLowerCase() === 'member') {
      if (taxName === 'nace') {
        const member = await prisma.member.findUnique({ where: { id: entId } });
        if (member && member.beneficiaryId) {
          await prisma.beneficiary.update({
            where: { id: member.beneficiaryId },
            data: { primaryNaceSectorId: tId }
          });
        }
        const updated = await prisma.member.update({
          where: { id: entId },
          data: { nace: (await prisma.naceSector.findUnique({ where: { id: tId } }))?.code }
        });
        return res.json({ data: updated });
      }
    } else if (entityType.toLowerCase() === 'service') {
      if (taxName === 'capabilities') {
        const updated = await prisma.publicService.update({
          where: { id: entId },
          data: { capabilitiesNew: { connect: { id: tId } } },
          include: { capabilitiesNew: true }
        });
        return res.json({ data: updated });
      } else if (taxName === 'drbest') {
        const updated = await prisma.publicService.update({
          where: { id: entId },
          data: { transformationDimensions: { connect: { id: tId } } },
          include: { transformationDimensions: true }
        });
        return res.json({ data: updated });
      }
    }
    
    res.status(400).json({ error: "Alignement non pris en charge ou combinaison d'entités invalide." });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.delete('/taxonomy-registry/align', async (req, res) => {
  try {
    const { entityType, entityId, taxonomyName, termId } = req.body;
    const entId = parseInt(entityId);
    const tId = parseInt(termId);
    const taxName = taxonomyName.toLowerCase();

    if (entityType.toLowerCase() === 'member') {
      if (taxName === 'nace') {
        const member = await prisma.member.findUnique({ where: { id: entId } });
        if (member && member.beneficiaryId) {
          await prisma.beneficiary.update({
            where: { id: member.beneficiaryId },
            data: { primaryNaceSectorId: null }
          });
        }
        const updated = await prisma.member.update({
          where: { id: entId },
          data: { nace: null }
        });
        return res.json({ data: updated });
      }
    } else if (entityType.toLowerCase() === 'service') {
      if (taxName === 'capabilities') {
        const updated = await prisma.publicService.update({
          where: { id: entId },
          data: { capabilitiesNew: { disconnect: { id: tId } } },
          include: { capabilitiesNew: true }
        });
        return res.json({ data: updated });
      } else if (taxName === 'drbest') {
        const updated = await prisma.publicService.update({
          where: { id: entId },
          data: { transformationDimensions: { disconnect: { id: tId } } },
          include: { transformationDimensions: true }
        });
        return res.json({ data: updated });
      }
    }
    
    res.status(400).json({ error: "Désalignement non pris en charge." });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- LINEAGE VERIFICATION & TRACING ---
v2Router.get('/lineage/:entityType/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const type = req.params.entityType.toLowerCase();

    const lineage: any = {
      programs: [],
      priorities: [],
      initiatives: [],
      actions: [],
      activities: [],
      challenges: [],
      journeys: [],
      services: [],
      fundings: [],
      projects: [],
      outcomes: [],
      evidences: []
    };

    if (type === 'project') {
      const proj = await prisma.project.findUnique({
        where: { id },
        include: {
          program: { include: { priorities: true, fundingInstruments: true } },
          initiative: { include: { publicServices: { include: { outcomes: { include: { contributions: true } } } } } },
          actionsNew: { include: { activities: { include: { evidences: true, service: true, journey: true } } } }
        }
      });

      if (proj) {
        lineage.projects.push(proj);
        if (proj.program) {
          lineage.programs.push(proj.program);
          proj.program.priorities.forEach((p: any) => lineage.priorities.push(p));
          proj.program.fundingInstruments.forEach((f: any) => lineage.fundings.push(f));
        }
        if (proj.initiative) {
          lineage.initiatives.push(proj.initiative);
          proj.initiative.publicServices.forEach((s: any) => {
            lineage.services.push(s);
            s.outcomes.forEach((o: any) => lineage.outcomes.push(o));
          });
        }
        proj.actionsNew.forEach((a: any) => {
          lineage.actions.push(a);
          a.activities.forEach((act: any) => {
            lineage.activities.push(act);
            act.evidences.forEach((e: any) => lineage.evidences.push(e));
            if (act.service) lineage.services.push(act.service);
            if (act.journey) lineage.journeys.push(act.journey);
          });
        });
      }
    } else if (type === 'activity') {
      const act = await prisma.activity.findUnique({
        where: { id },
        include: {
          action: { include: { project: { include: { program: { include: { priorities: true } }, initiative: true } } } },
          service: { include: { outcomes: true, fundingInstruments: true } },
          journey: true,
          evidences: true
        }
      });
      if (act) {
        lineage.activities.push(act);
        if (act.journey) lineage.journeys.push(act.journey);
        if (act.service) {
          lineage.services.push(act.service);
          act.service.outcomes.forEach((o: any) => lineage.outcomes.push(o));
          act.service.fundingInstruments.forEach((f: any) => lineage.fundings.push(f));
        }
        act.evidences.forEach((e: any) => lineage.evidences.push(e));
        if (act.action) {
          lineage.actions.push(act.action);
          if (act.action.project) {
            const p = act.action.project;
            lineage.projects.push(p);
            if (p.program) {
              lineage.programs.push(p.program);
              p.program.priorities.forEach((pr: any) => lineage.priorities.push(pr));
            }
            if (p.initiative) lineage.initiatives.push(p.initiative);
          }
        }
      }
    } else {
      // General traceback / fallback
      return res.status(400).json({ error: "Lignage direct non résolu pour ce type d'entité." });
    }

    res.json({ data: lineage });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- COMPLEMENTARY REST CORE CRUD APIS ---

// Members
v2Router.post('/members', async (req, res) => {
  try {
    const item = await prisma.member.create({
      data: {
        name: req.body.name,
        type: req.body.type,
        description: req.body.description || null,
        email: req.body.email || null,
        phone: req.body.phone || null,
        website: req.body.website || null,
        location: req.body.location || null,
        competencies: req.body.competencies || [],
        size: req.body.size || null,
        nace: req.body.nace || null,
        digitalMaturity: req.body.digitalMaturity ? parseInt(req.body.digitalMaturity) : 1,
        iaMaturity: req.body.iaMaturity ? parseInt(req.body.iaMaturity) : 1,
        cyberMaturity: req.body.cyberMaturity ? parseInt(req.body.cyberMaturity) : 1,
        organizationId: req.body.organizationId ? parseInt(req.body.organizationId) : null,
        beneficiaryId: req.body.beneficiaryId ? parseInt(req.body.beneficiaryId) : null
      }
    });
    res.status(201).json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.put('/members/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const item = await prisma.member.update({
      where: { id },
      data: {
        name: req.body.name,
        type: req.body.type,
        description: req.body.description,
        email: req.body.email,
        phone: req.body.phone,
        website: req.body.website,
        location: req.body.location,
        competencies: req.body.competencies,
        size: req.body.size,
        nace: req.body.nace,
        digitalMaturity: req.body.digitalMaturity ? parseInt(req.body.digitalMaturity) : undefined,
        iaMaturity: req.body.iaMaturity ? parseInt(req.body.iaMaturity) : undefined,
        cyberMaturity: req.body.cyberMaturity ? parseInt(req.body.cyberMaturity) : undefined,
        organizationId: req.body.organizationId ? parseInt(req.body.organizationId) : undefined,
        beneficiaryId: req.body.beneficiaryId ? parseInt(req.body.beneficiaryId) : undefined
      }
    });
    res.json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.delete('/members/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.member.delete({ where: { id } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Challenges
v2Router.put('/challenges/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const item = await prisma.challenge.update({
      where: { id },
      data: {
        name: req.body.name,
        code: req.body.code,
        description: req.body.description,
        uri: req.body.uri,
        challengeCategoryId: req.body.challengeCategoryId ? parseInt(req.body.challengeCategoryId) : undefined
      }
    });
    res.json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.delete('/challenges/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.challenge.delete({ where: { id } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Services delete
v2Router.delete('/services/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.publicService.delete({ where: { id } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Journeys delete
v2Router.delete('/journeys/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.journey.delete({ where: { id } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Journey Instances CRUD
v2Router.get('/journey-instances', async (req, res) => {
  try {
    const list = await prisma.journeyInstance.findMany({
      include: { template: true, progress: { include: { stage: true } } }
    });
    res.json({ data: list });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.post('/journey-instances', async (req, res) => {
  try {
    const { memberId, templateId, status } = req.body;
    const item = await prisma.journeyInstance.create({
      data: {
        memberId: parseInt(memberId),
        templateId: parseInt(templateId),
        status: status || 'ACTIVE'
      },
      include: { template: true }
    });
    res.status(201).json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.put('/journey-instances/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    const item = await prisma.journeyInstance.update({
      where: { id },
      data: { status }
    });
    res.json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.delete('/journey-instances/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.journeyInstance.delete({ where: { id } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Opportunities POST/PUT/DELETE
v2Router.post('/opportunities', async (req, res) => {
  try {
    const item = await prisma.opportunity.create({
      data: {
        title: req.body.title,
        description: req.body.description || null,
        type: req.body.type,
        provider: req.body.provider || null,
        status: req.body.status || 'OPEN',
        deadline: req.body.deadline ? new Date(req.body.deadline) : null,
        url: req.body.url || null
      }
    });
    res.status(201).json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.put('/opportunities/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const item = await prisma.opportunity.update({
      where: { id },
      data: {
        title: req.body.title,
        description: req.body.description,
        type: req.body.type,
        provider: req.body.provider,
        status: req.body.status,
        deadline: req.body.deadline ? new Date(req.body.deadline) : null,
        url: req.body.url
      }
    });
    res.json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.delete('/opportunities/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.opportunity.delete({ where: { id } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Consortiums PUT/DELETE
v2Router.put('/consortia/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, description, status, opportunityId, projectId, members } = req.body;
    
    // Clear and reset members
    if (members && Array.isArray(members)) {
      await prisma.consortiumMember.deleteMany({ where: { consortiumId: id } });
    }

    const item = await prisma.consortium.update({
      where: { id },
      data: {
        name,
        description,
        status,
        opportunityId: opportunityId ? parseInt(opportunityId) : undefined,
        projectId: projectId ? parseInt(projectId) : undefined,
        members: members ? {
          create: members.map((m: any) => ({
            memberId: parseInt(m.memberId),
            role: m.role || 'Partner',
            status: m.status || 'APPROVED'
          }))
        } : undefined
      },
      include: { members: { include: { member: true } } }
    });
    res.json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.delete('/consortia/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.consortium.delete({ where: { id } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Projects DELETE
v2Router.delete('/projects/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.project.delete({ where: { id } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Outcomes GET, POST, PUT, DELETE
v2Router.get('/outcomes', async (req, res) => {
  try {
    const list = await prisma.outcome.findMany({ include: { publicService: true } });
    res.json({ data: list });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.post('/outcomes', async (req, res) => {
  try {
    // Enforce lineage: Outcome must link to PublicService
    if (!req.body.publicServiceId) {
      return res.status(400).json({ error: "Validation du lignage échouée: l'Impact (Outcome) doit être lié à un Service." });
    }
    const item = await prisma.outcome.create({
      data: {
        name: req.body.name,
        description: req.body.description || null,
        code: req.body.code || null,
        uri: req.body.uri || null,
        publicServiceId: parseInt(req.body.publicServiceId)
      }
    });
    res.status(201).json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.put('/outcomes/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const item = await prisma.outcome.update({
      where: { id },
      data: {
        name: req.body.name,
        description: req.body.description,
        code: req.body.code,
        uri: req.body.uri,
        publicServiceId: req.body.publicServiceId ? parseInt(req.body.publicServiceId) : undefined
      }
    });
    res.json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.delete('/outcomes/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.outcome.delete({ where: { id } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Evidences POST, PUT, DELETE
v2Router.post('/evidences', async (req, res) => {
  try {
    // Enforce lineage: Evidence must link to requirement or activity/delivery
    if (!req.body.requirementId && !req.body.activityId && !req.body.serviceDeliveryId) {
      return res.status(400).json({ error: "Validation du lignage échouée: la Preuve (Evidence) doit être rattachée à une Activité, une Exigence ou un Service." });
    }
    const item = await prisma.evidence.create({
      data: {
        name: req.body.name,
        description: req.body.description || null,
        code: req.body.code || null,
        file: req.body.file || null,
        url: req.body.url || null,
        type: req.body.type || null,
        requirementId: req.body.requirementId ? parseInt(req.body.requirementId) : null,
        activityId: req.body.activityId ? parseInt(req.body.activityId) : null,
        serviceDeliveryId: req.body.serviceDeliveryId ? parseInt(req.body.serviceDeliveryId) : null,
        status: req.body.status || 'PENDING'
      }
    });
    res.status(201).json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.put('/evidences/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const item = await prisma.evidence.update({
      where: { id },
      data: {
        name: req.body.name,
        description: req.body.description,
        code: req.body.code,
        file: req.body.file,
        url: req.body.url,
        type: req.body.type,
        requirementId: req.body.requirementId ? parseInt(req.body.requirementId) : undefined,
        activityId: req.body.activityId ? parseInt(req.body.activityId) : undefined,
        serviceDeliveryId: req.body.serviceDeliveryId ? parseInt(req.body.serviceDeliveryId) : undefined,
        status: req.body.status
      }
    });
    res.json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.delete('/evidences/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.evidence.delete({ where: { id } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Events GET, POST, PUT, DELETE
v2Router.get('/events', async (req, res) => {
  try {
    const list = await prisma.eventResource.findMany({ orderBy: { startDate: 'desc' } });
    res.json({ data: list });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.post('/events', async (req, res) => {
  try {
    const item = await prisma.eventResource.create({
      data: {
        title: req.body.title,
        description: req.body.description || null,
        type: req.body.type,
        startDate: req.body.startDate ? new Date(req.body.startDate) : new Date(),
        endDate: req.body.endDate ? new Date(req.body.endDate) : null,
        location: req.body.location || null
      }
    });
    res.status(201).json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.put('/events/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const item = await prisma.eventResource.update({
      where: { id },
      data: {
        title: req.body.title,
        description: req.body.description,
        type: req.body.type,
        startDate: req.body.startDate ? new Date(req.body.startDate) : undefined,
        endDate: req.body.endDate !== undefined ? (req.body.endDate ? new Date(req.body.endDate) : null) : undefined,
        location: req.body.location
      }
    });
    res.json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.delete('/events/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.eventResource.delete({ where: { id } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Enforce delete endpoints for Axe 1 & 2
v2Router.delete('/programs/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.program.delete({ where: { id } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.delete('/initiatives/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.initiative.delete({ where: { id } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.delete('/actions/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.action.delete({ where: { id } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Filières CRUD
v2Router.get('/filieres', async (req, res) => {
  try {
    const list = await prisma.filiere.findMany({ include: { valueChains: true } });
    res.json({ data: list });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.post('/filieres', async (req, res) => {
  try {
    const item = await prisma.filiere.create({
      data: {
        name: req.body.name,
        description: req.body.description || null,
        ecosystemId: req.body.ecosystemId ? parseInt(req.body.ecosystemId) : null
      }
    });
    res.status(201).json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.put('/filieres/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const item = await prisma.filiere.update({
      where: { id },
      data: {
        name: req.body.name,
        description: req.body.description,
        ecosystemId: req.body.ecosystemId ? parseInt(req.body.ecosystemId) : undefined
      }
    });
    res.json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.delete('/filieres/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.filiere.delete({ where: { id } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ValueChain delete
v2Router.delete('/value-chains/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.valueChain.delete({ where: { id } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ValueChainSegment CRUD
v2Router.get('/value-chain-segments', async (req, res) => {
  try {
    const list = await prisma.valueChainSegment.findMany({ include: { valueChain: true } });
    res.json({ data: list });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.post('/value-chain-segments', async (req, res) => {
  try {
    const item = await prisma.valueChainSegment.create({
      data: {
        name: req.body.name,
        description: req.body.description || null,
        valueChainId: parseInt(req.body.valueChainId),
        parentSegmentId: req.body.parentSegmentId ? parseInt(req.body.parentSegmentId) : null
      }
    });
    res.status(201).json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.put('/value-chain-segments/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const item = await prisma.valueChainSegment.update({
      where: { id },
      data: {
        name: req.body.name,
        description: req.body.description,
        valueChainId: req.body.valueChainId ? parseInt(req.body.valueChainId) : undefined,
        parentSegmentId: req.body.parentSegmentId !== undefined ? (req.body.parentSegmentId ? parseInt(req.body.parentSegmentId) : null) : undefined
      }
    });
    res.json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.delete('/value-chain-segments/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.valueChainSegment.delete({ where: { id } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


// ==========================================
// --- 17. SYSTEM OF RECORD & DATA PRODUCTS APIs (Data Steward) ---
// ==========================================

// Source Systems GET
v2Router.get('/interoperability/source-systems', async (req, res) => {
  try {
    const items = await prisma.pitDataSource.findMany({
      include: { organization: true, qualityRules: true, semanticMappings: true }
    });
    res.json({ data: items });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Source Systems POST
v2Router.post('/interoperability/source-systems', async (req, res) => {
  try {
    const body = req.body;
    if (!body.name) {
      return res.status(400).json({ error: "Le nom du système source est obligatoire." });
    }
    
    // Resolve organizationId if organization is provided
    let orgId = body.organizationId ? parseInt(body.organizationId) : undefined;
    if (!orgId && body.owner) {
      const org = await prisma.organization.findFirst({
        where: { name: { contains: body.owner, mode: 'insensitive' } }
      });
      if (org) orgId = org.id;
    }

    const data: any = {
      name: body.name,
      description: body.description,
      owner: body.owner,
      steward: body.steward,
      frequency: body.frequency || "ANNUAL",
      accessLevel: body.accessLevel || "RESTRICTED",
      legalBasis: body.legalBasis,
      format: body.format || "JSON",
      endpoint: body.endpoint || body.apiEndpoint,
      uri: body.uri || `https://pit.wallonie.be/id/source-system/${body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      organizationId: orgId,
      type: body.type,
      environment: body.environment || "production",
      ownerBusiness: body.ownerBusiness,
      ownerTechnical: body.ownerTechnical,
      dataOwner: body.dataOwner,
      contactSupport: body.contactSupport,
      technology: body.technology,
      accessMode: body.accessMode,
      authType: body.authType,
      documentationUrl: body.documentationUrl,
      availability: body.availability,
      isPersonalData: body.isPersonalData === true || body.isPersonalData === 'true' || body.isPersonalData === 'oui',
      isSensitiveData: body.isSensitiveData === true || body.isSensitiveData === 'true' || body.isSensitiveData === 'oui',
      accessProtocolRequired: body.accessProtocolRequired === true || body.accessProtocolRequired === 'true' || body.accessProtocolRequired === 'oui',
      conventionAvailable: body.conventionAvailable === true || body.conventionAvailable === 'true' || body.conventionAvailable === 'oui',
      usageRestrictions: body.usageRestrictions,
      qualityLevel: body.qualityLevel
    };

    let result;
    if (body.id) {
      const existing = await prisma.pitDataSource.findUnique({
        where: { id: parseInt(body.id) }
      });
      if (existing) {
        result = await prisma.pitDataSource.update({
          where: { id: parseInt(body.id) },
          data
        });
      } else {
        result = await prisma.pitDataSource.create({ data });
      }
    } else {
      result = await prisma.pitDataSource.create({ data });
    }

    res.status(201).json({ data: result });
  } catch (err: any) {
    console.error("Error POST source-system:", err);
    res.status(500).json({ error: err.message });
  }
});

// Source Systems DELETE
v2Router.delete('/interoperability/source-systems/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.pitDataSource.delete({ where: { id } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Data Products GET
v2Router.get('/interoperability/data-products', async (req, res) => {
  try {
    const items = await prisma.dataset.findMany({
      include: { ownerOrganization: true, sources: true, qualityRules: true, semanticMappings: true, apiRoutes: true }
    });
    res.json({ data: items });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Data Products POST
v2Router.post('/interoperability/data-products', async (req, res) => {
  try {
    const body = req.body;
    const title = body.title || body.name;
    if (!title) {
      return res.status(400).json({ error: "Le titre du dataset est obligatoire." });
    }

    let orgId = body.ownerOrganizationId ? parseInt(body.ownerOrganizationId) : undefined;
    if (!orgId) {
      const firstOrg = await prisma.organization.findFirst();
      orgId = firstOrg ? firstOrg.id : 1;
    }

    const data: any = {
      title: title,
      description: body.description,
      themes: body.themes || (body.theme ? [body.theme] : []),
      keywords: body.keywords || [],
      qualityScore: parseFloat(body.qualityScore) || 5.0,
      updateFrequency: body.updateFrequency || "Annuel",
      ownerOrganizationId: orgId,
      domain: body.domain,
      type: body.type,
      status: body.status || "brouillon",
      sensitivity: body.sensitivity || "public",
      producer: body.producer,
      dataOwner: body.dataOwner,
      dataSteward: body.dataSteward,
      contactTechnical: body.contactTechnical,
      contactBusiness: body.contactBusiness,
      exposableApi: body.exposableApi === true || body.exposableApi === 'true' || body.exposableApi === 'oui',
      exposableCatalog: body.exposableCatalog === true || body.exposableCatalog === 'true' || body.exposableCatalog === 'oui',
      dcatApAvailable: body.dcatApAvailable === true || body.dcatApAvailable === 'true' || body.dcatApAvailable === 'oui',
      semanticMappingAvailable: body.semanticMappingAvailable === true || body.semanticMappingAvailable === 'true' || body.semanticMappingAvailable === 'oui',
      accessRulesDefined: body.accessRulesDefined === true || body.accessRulesDefined === 'true' || body.accessRulesDefined === 'oui',
      usageRulesDefined: body.usageRulesDefined === true || body.usageRulesDefined === 'true' || body.usageRulesDefined === 'oui',
      license: body.license,
      traceabilityAvailable: body.traceabilityAvailable === true || body.traceabilityAvailable === 'true' || body.traceabilityAvailable === 'oui',
      qualityOkayForReuse: body.qualityOkayForReuse === true || body.qualityOkayForReuse === 'true' || body.qualityOkayForReuse === 'oui',
      dataSpaceMaturityScore: parseFloat(body.dataSpaceMaturityScore) || 0.0,
      authorizedPurpose: body.authorizedPurpose,
      legalBasis: body.legalBasis,
      accessRules: body.accessRules,
      usageConditions: body.usageConditions,
      gdprConstraints: body.gdprConstraints,
      contractualConstraints: body.contractualConstraints,
      sovereigntyConstraints: body.sovereigntyConstraints,
      validationHistory: body.validationHistory,
      format: body.format || "JSON",
      apiEndpoint: body.apiEndpoint,
      apiRoute: body.apiRoute,
      apiDocumentation: body.apiDocumentation,
      lastUpdate: body.lastUpdate ? new Date(body.lastUpdate) : new Date(),
      availability: body.availability,
      sla: body.sla
    };

    if (body.sourceIds && Array.isArray(body.sourceIds)) {
      data.sources = {
        connect: body.sourceIds.map((id: any) => ({ id: parseInt(id) }))
      };
    }

    let result;
    if (body.id) {
      const existing = await prisma.dataset.findUnique({
        where: { id: parseInt(body.id) }
      });
      if (existing) {
        result = await prisma.dataset.update({
          where: { id: parseInt(body.id) },
          data
        });
      } else {
        result = await prisma.dataset.create({ data });
      }
    } else {
      result = await prisma.dataset.create({ data });
    }

    res.status(201).json({ data: result });
  } catch (err: any) {
    console.error("Error POST data-product:", err);
    res.status(500).json({ error: err.message });
  }
});

// Data Products DELETE
v2Router.delete('/interoperability/data-products/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.dataset.delete({ where: { id } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Quality Rules CRUD
v2Router.get('/interoperability/quality-rules', async (req, res) => {
  try {
    const items = await prisma.dataQualityRule.findMany({
      include: { dataset: true, source: true }
    });
    res.json({ data: items });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.post('/interoperability/quality-rules', async (req, res) => {
  try {
    const body = req.body;
    if (!body.name || !body.dimension) {
      return res.status(400).json({ error: "Le nom et la dimension sont obligatoires." });
    }
    const data: any = {
      name: body.name,
      description: body.description,
      dimension: body.dimension,
      datasetId: body.datasetId ? parseInt(body.datasetId) : null,
      sourceId: body.sourceId ? parseInt(body.sourceId) : null,
      attribute: body.attribute,
      controlRule: body.controlRule,
      threshold: body.threshold,
      lastResult: body.lastResult,
      status: body.status || "non_controle",
      frequency: body.frequency,
      owner: body.owner,
      lastCheckedAt: body.lastCheckedAt ? new Date(body.lastCheckedAt) : null,
      correctionPlan: body.correctionPlan,
      priority: body.priority,
      businessImpact: body.businessImpact
    };

    let result;
    if (body.id) {
      result = await prisma.dataQualityRule.update({
        where: { id: parseInt(body.id) },
        data
      });
    } else {
      result = await prisma.dataQualityRule.create({ data });
    }
    res.status(201).json({ data: result });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.delete('/interoperability/quality-rules/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.dataQualityRule.delete({ where: { id } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Semantic Mappings CRUD
v2Router.get('/interoperability/semantic-mappings', async (req, res) => {
  try {
    const items = await prisma.semanticMapping.findMany({
      include: { source: true, dataset: true }
    });
    res.json({ data: items });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.post('/interoperability/semantic-mappings', async (req, res) => {
  try {
    const body = req.body;
    if (!body.name || !body.targetModel) {
      return res.status(400).json({ error: "Le nom et le modèle cible sont obligatoires." });
    }
    const data: any = {
      name: body.name,
      description: body.description,
      sourceId: body.sourceId ? parseInt(body.sourceId) : null,
      datasetId: body.datasetId ? parseInt(body.datasetId) : null,
      targetModel: body.targetModel,
      sourceEntity: body.sourceEntity,
      sourceAttribute: body.sourceAttribute,
      targetEntity: body.targetEntity,
      targetAttribute: body.targetAttribute,
      transformRule: body.transformRule,
      normRule: body.normRule,
      taxonomyUsed: body.taxonomyUsed,
      status: body.status || "a_faire",
      ownerBusiness: body.ownerBusiness,
      ownerTechnical: body.ownerTechnical,
      validatedAt: body.validatedAt ? new Date(body.validatedAt) : null
    };

    let result;
    if (body.id) {
      result = await prisma.semanticMapping.update({
        where: { id: parseInt(body.id) },
        data
      });
    } else {
      result = await prisma.semanticMapping.create({ data });
    }
    res.status(201).json({ data: result });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.delete('/interoperability/semantic-mappings/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.semanticMapping.delete({ where: { id } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// APIs CRUD
v2Router.get('/interoperability/apis', async (req, res) => {
  try {
    const items = await prisma.api.findMany({
      include: { routes: { include: { dataset: true, mapping: true } } }
    });
    res.json({ data: items });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.post('/interoperability/apis', async (req, res) => {
  try {
    const body = req.body;
    if (!body.name || !body.baseUrl || !body.type) {
      return res.status(400).json({ error: "Le nom, l'URL de base et le type sont obligatoires." });
    }
    const data: any = {
      name: body.name,
      description: body.description,
      domain: body.domain,
      status: body.status || "brouillon",
      type: body.type,
      baseUrl: body.baseUrl,
      version: body.version || "1.0.0",
      ownerTechnical: body.ownerTechnical,
      ownerBusiness: body.ownerBusiness,
      authType: body.authType || "aucune",
      docUrl: body.docUrl,
      environment: body.environment || "prod",
      exposureLevel: body.exposureLevel || "interne",
      accessRules: body.accessRules,
      usageRules: body.usageRules,
      auditEnabled: body.auditEnabled === true || body.auditEnabled === 'true',
      sla: body.sla
    };

    let result;
    if (body.id) {
      result = await prisma.api.update({
        where: { id: parseInt(body.id) },
        data
      });
    } else {
      result = await prisma.api.create({ data });
    }
    res.status(201).json({ data: result });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.delete('/interoperability/apis/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.api.delete({ where: { id } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// API Routes CRUD
v2Router.get('/interoperability/api-routes', async (req, res) => {
  try {
    const items = await prisma.apiRoute.findMany({
      include: { api: true, dataset: true, mapping: true }
    });
    res.json({ data: items });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.post('/interoperability/api-routes', async (req, res) => {
  try {
    const body = req.body;
    if (!body.path || !body.apiId || !body.method || !body.outputModel) {
      return res.status(400).json({ error: "Le chemin, l'API, la méthode et le modèle de sortie sont obligatoires." });
    }
    const data: any = {
      path: body.path,
      method: body.method,
      description: body.description,
      parameters: body.parameters || null,
      payloadExpected: body.payloadExpected,
      responseExpected: body.responseExpected,
      apiId: parseInt(body.apiId),
      datasetId: body.datasetId ? parseInt(body.datasetId) : null,
      mappingId: body.mappingId ? parseInt(body.mappingId) : null,
      outputModel: body.outputModel,
      status: body.status || "active",
      requestExample: body.requestExample,
      responseExample: body.responseExample,
      requiredRights: body.requiredRights
    };

    let result;
    if (body.id) {
      result = await prisma.apiRoute.update({
        where: { id: parseInt(body.id) },
        data
      });
    } else {
      result = await prisma.apiRoute.create({ data });
    }
    res.status(201).json({ data: result });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.delete('/interoperability/api-routes/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.apiRoute.delete({ where: { id } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Reference Models CRUD
v2Router.get('/reference-models', async (req, res) => {
  try {
    const items = await prisma.referenceModel.findMany({
      orderBy: { name: 'asc' }
    });
    res.json({ data: items });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.post('/reference-models', async (req, res) => {
  try {
    const body = req.body;
    if (!body.name || !body.type) {
      return res.status(400).json({ error: "Le nom et le type du référentiel sont obligatoires." });
    }
    const data: any = {
      name: body.name,
      type: body.type,
      description: body.description,
      officialUrl: body.officialUrl,
      version: body.version,
      issuingOrganization: body.issuingOrganization,
      domain: body.domain,
      status: body.status || "actif",
      usageInPit: body.usageInPit,
      pitObjectsConcerned: body.pitObjectsConcerned || null,
      owner: body.owner
    };

    let result;
    if (body.id) {
      result = await prisma.referenceModel.update({
        where: { id: parseInt(body.id) },
        data
      });
    } else {
      result = await prisma.referenceModel.create({ data });
    }
    res.status(201).json({ data: result });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.delete('/reference-models/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.referenceModel.delete({ where: { id } });
    res.json({ success: true });
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

// ==========================================
// --- 19. ECOSYSTEM CHALLENGES CRUD ---
// ==========================================

v2Router.get('/ecosystem-challenges', async (req, res) => {
  try {
    const list = await prisma.ecosystemChallenge.findMany({
      where: {
        status: { not: 'ARCHIVED' }
      },
      include: {
        communities: true,
        valueChains: true,
        filieres: true,
        programs: true,
        opportunities: true,
        services: true,
        projects: true,
        outcomes: true
      },
      orderBy: { title: 'asc' }
    });
    res.json({ data: list });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/ecosystem-challenges/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const item = await prisma.ecosystemChallenge.findUnique({
      where: { id },
      include: {
        communities: true,
        valueChains: true,
        filieres: true,
        programs: true,
        opportunities: true,
        services: true,
        projects: true,
        outcomes: true
      }
    });
    if (!item) return res.status(404).json({ error: "Défi d'écosystème non trouvé" });
    res.json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.post('/ecosystem-challenges', async (req, res) => {
  try {
    const { title, description, type, priority, status, impact, territory, communityIds, valueChainIds, filiereIds, programIds, opportunityIds, serviceIds, projectIds, outcomeIds } = req.body;
    const item = await prisma.ecosystemChallenge.create({
      data: {
        title,
        description,
        type,
        priority,
        status: status || 'ACTIVE',
        impact,
        territory,
        communities: communityIds ? { connect: communityIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        valueChains: valueChainIds ? { connect: valueChainIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        filieres: filiereIds ? { connect: filiereIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        programs: programIds ? { connect: programIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        opportunities: opportunityIds ? { connect: opportunityIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        services: serviceIds ? { connect: serviceIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        projects: projectIds ? { connect: projectIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        outcomes: outcomeIds ? { connect: outcomeIds.map((id: any) => ({ id: parseInt(id) })) } : undefined
      }
    });
    res.status(201).json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.put('/ecosystem-challenges/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title, description, type, priority, status, impact, territory, communityIds, valueChainIds, filiereIds, programIds, opportunityIds, serviceIds, projectIds, outcomeIds } = req.body;
    
    const existing = await prisma.ecosystemChallenge.findUnique({
      where: { id },
      include: {
        communities: true,
        valueChains: true,
        filieres: true,
        programs: true,
        opportunities: true,
        services: true,
        projects: true,
        outcomes: true
      }
    });
    
    if (!existing) return res.status(404).json({ error: "Défi d'écosystème non trouvé" });

    const item = await prisma.ecosystemChallenge.update({
      where: { id },
      data: {
        title,
        description,
        type,
        priority,
        status,
        impact,
        territory,
        communities: {
          disconnect: existing.communities.map(c => ({ id: c.id })),
          connect: communityIds ? communityIds.map((id: any) => ({ id: parseInt(id) })) : []
        },
        valueChains: {
          disconnect: existing.valueChains.map(vc => ({ id: vc.id })),
          connect: valueChainIds ? valueChainIds.map((id: any) => ({ id: parseInt(id) })) : []
        },
        filieres: {
          disconnect: existing.filieres.map(f => ({ id: f.id })),
          connect: filiereIds ? filiereIds.map((id: any) => ({ id: parseInt(id) })) : []
        },
        programs: {
          disconnect: existing.programs.map(p => ({ id: p.id })),
          connect: programIds ? programIds.map((id: any) => ({ id: parseInt(id) })) : []
        },
        opportunities: {
          disconnect: existing.opportunities.map(o => ({ id: o.id })),
          connect: opportunityIds ? opportunityIds.map((id: any) => ({ id: parseInt(id) })) : []
        },
        services: {
          disconnect: existing.services.map(s => ({ id: s.id })),
          connect: serviceIds ? serviceIds.map((id: any) => ({ id: parseInt(id) })) : []
        },
        projects: {
          disconnect: existing.projects.map(p => ({ id: p.id })),
          connect: projectIds ? projectIds.map((id: any) => ({ id: parseInt(id) })) : []
        },
        outcomes: {
          disconnect: existing.outcomes.map(o => ({ id: o.id })),
          connect: outcomeIds ? outcomeIds.map((id: any) => ({ id: parseInt(id) })) : []
        }
      }
    });
    res.json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.delete('/ecosystem-challenges/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const item = await prisma.ecosystemChallenge.update({
      where: { id },
      data: { status: 'ARCHIVED' }
    });
    res.json({ data: item, message: "Défi d'écosystème archivé avec succès" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


// ==========================================
// --- 20. FUNDING PROGRAMS CRUD ---
// ==========================================

v2Router.get('/funding-programs', async (req, res) => {
  try {
    const list = await prisma.fundingProgram.findMany({ include: { calls: true }, orderBy: { name: 'asc' } });
    res.json({ data: list });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/funding-programs/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const item = await prisma.fundingProgram.findUnique({
      where: { id },
      include: { calls: { include: { instruments: true } } }
    });
    if (!item) return res.status(404).json({ error: "Programme de financement non trouvé" });
    res.json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.post('/funding-programs', async (req, res) => {
  try {
    const { name, description } = req.body;
    const item = await prisma.fundingProgram.create({
      data: { name, description }
    });
    res.status(201).json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.put('/funding-programs/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, description } = req.body;
    const item = await prisma.fundingProgram.update({
      where: { id },
      data: { name, description }
    });
    res.json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.delete('/funding-programs/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const item = await prisma.fundingProgram.delete({ where: { id } });
    res.json({ data: item, message: "Programme de financement supprimé avec succès" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


// ==========================================
// --- 21. FUNDING CALLS CRUD ---
// ==========================================

v2Router.get('/funding-calls', async (req, res) => {
  try {
    const list = await prisma.fundingCall.findMany({
      include: {
        program: true,
        communities: true,
        filieres: true,
        valueChains: true,
        opportunities: true,
        beneficiaries: true,
        consortia: true,
        projects: true,
        instruments: true
      },
      orderBy: { name: 'asc' }
    });
    res.json({ data: list });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/funding-calls/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const item = await prisma.fundingCall.findUnique({
      where: { id },
      include: {
        program: true,
        communities: true,
        filieres: true,
        valueChains: true,
        opportunities: true,
        beneficiaries: true,
        consortia: true,
        projects: true,
        instruments: { include: { awards: true } }
      }
    });
    if (!item) return res.status(404).json({ error: "Appel de financement non trouvé" });
    res.json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.post('/funding-calls', async (req, res) => {
  try {
    const { name, description, programId, deadline, status, communityIds, filiereIds, valueChainIds, opportunityIds, beneficiaryIds, consortiumIds, projectIds } = req.body;
    const item = await prisma.fundingCall.create({
      data: {
        name,
        description,
        programId: parseInt(programId),
        deadline: deadline ? new Date(deadline) : null,
        status: status || 'OPEN',
        communities: communityIds ? { connect: communityIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        filieres: filiereIds ? { connect: filiereIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        valueChains: valueChainIds ? { connect: valueChainIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        opportunities: opportunityIds ? { connect: opportunityIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        beneficiaries: beneficiaryIds ? { connect: beneficiaryIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        consortia: consortiumIds ? { connect: consortiumIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        projects: projectIds ? { connect: projectIds.map((id: any) => ({ id: parseInt(id) })) } : undefined
      }
    });
    res.status(201).json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.put('/funding-calls/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, description, programId, deadline, status, communityIds, filiereIds, valueChainIds, opportunityIds, beneficiaryIds, consortiumIds, projectIds } = req.body;

    const existing = await prisma.fundingCall.findUnique({
      where: { id },
      include: {
        communities: true,
        filieres: true,
        valueChains: true,
        opportunities: true,
        beneficiaries: true,
        consortia: true,
        projects: true
      }
    });

    if (!existing) return res.status(404).json({ error: "Appel de financement non trouvé" });

    const item = await prisma.fundingCall.update({
      where: { id },
      data: {
        name,
        description,
        programId: programId ? parseInt(programId) : undefined,
        deadline: deadline !== undefined ? (deadline ? new Date(deadline) : null) : undefined,
        status,
        communities: {
          disconnect: existing.communities.map(c => ({ id: c.id })),
          connect: communityIds ? communityIds.map((id: any) => ({ id: parseInt(id) })) : []
        },
        filieres: {
          disconnect: existing.filieres.map(f => ({ id: f.id })),
          connect: filiereIds ? filiereIds.map((id: any) => ({ id: parseInt(id) })) : []
        },
        valueChains: {
          disconnect: existing.valueChains.map(vc => ({ id: vc.id })),
          connect: valueChainIds ? valueChainIds.map((id: any) => ({ id: parseInt(id) })) : []
        },
        opportunities: {
          disconnect: existing.opportunities.map(o => ({ id: o.id })),
          connect: opportunityIds ? opportunityIds.map((id: any) => ({ id: parseInt(id) })) : []
        },
        beneficiaries: {
          disconnect: existing.beneficiaries.map(b => ({ id: b.id })),
          connect: beneficiaryIds ? beneficiaryIds.map((id: any) => ({ id: parseInt(id) })) : []
        },
        consortia: {
          disconnect: existing.consortia.map(c => ({ id: c.id })),
          connect: consortiumIds ? consortiumIds.map((id: any) => ({ id: parseInt(id) })) : []
        },
        projects: {
          disconnect: existing.projects.map(p => ({ id: p.id })),
          connect: projectIds ? projectIds.map((id: any) => ({ id: parseInt(id) })) : []
        }
      }
    });
    res.json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.delete('/funding-calls/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const item = await prisma.fundingCall.delete({ where: { id } });
    res.json({ data: item, message: "Appel de financement supprimé avec succès" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


// ==========================================
// --- 22. FUNDING INSTRUMENTS CRUD ---
// ==========================================

v2Router.get('/funding-instruments', async (req, res) => {
  try {
    const list = await prisma.fundingInstrument.findMany({ include: { call: true, awards: true }, orderBy: { name: 'asc' } });
    res.json({ data: list });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/funding-instruments/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const item = await prisma.fundingInstrument.findUnique({
      where: { id },
      include: { call: true, awards: { include: { project: true } } }
    });
    if (!item) return res.status(404).json({ error: "Instrument de financement non trouvé" });
    res.json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.post('/funding-instruments', async (req, res) => {
  try {
    const { name, type, description, callId } = req.body;
    const item = await prisma.fundingInstrument.create({
      data: {
        name,
        type,
        description,
        callId: callId ? parseInt(callId) : null
      }
    });
    res.status(201).json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.put('/funding-instruments/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, type, description, callId } = req.body;
    const item = await prisma.fundingInstrument.update({
      where: { id },
      data: {
        name,
        type,
        description,
        callId: callId !== undefined ? (callId ? parseInt(callId) : null) : undefined
      }
    });
    res.json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.delete('/funding-instruments/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const item = await prisma.fundingInstrument.delete({ where: { id } });
    res.json({ data: item, message: "Instrument de financement supprimé avec succès" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


// ==========================================
// --- 23. FUNDING AWARDS CRUD ---
// ==========================================

v2Router.get('/funding-awards', async (req, res) => {
  try {
    const list = await prisma.fundingAward.findMany({ include: { project: true, instrument: true }, orderBy: { date: 'desc' } });
    res.json({ data: list });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/funding-awards/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const item = await prisma.fundingAward.findUnique({
      where: { id },
      include: { project: true, instrument: { include: { call: true } } }
    });
    if (!item) return res.status(404).json({ error: "Octroi de financement (Award) non trouvé" });
    res.json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.post('/funding-awards', async (req, res) => {
  try {
    const { amount, date, projectId, instrumentId, status } = req.body;
    const item = await prisma.fundingAward.create({
      data: {
        amount: parseFloat(amount),
        date: date ? new Date(date) : new Date(),
        projectId: projectId ? parseInt(projectId) : null,
        instrumentId: instrumentId ? parseInt(instrumentId) : null,
        status: status || 'GRANTED'
      }
    });
    res.status(201).json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.put('/funding-awards/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { amount, date, projectId, instrumentId, status } = req.body;
    const item = await prisma.fundingAward.update({
      where: { id },
      data: {
        amount: amount !== undefined ? parseFloat(amount) : undefined,
        date: date ? new Date(date) : undefined,
        projectId: projectId !== undefined ? (projectId ? parseInt(projectId) : null) : undefined,
        instrumentId: instrumentId !== undefined ? (instrumentId ? parseInt(instrumentId) : null) : undefined,
        status: status !== undefined ? status : undefined
      }
    });
    res.json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.delete('/funding-awards/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const item = await prisma.fundingAward.delete({ where: { id } });
    res.json({ data: item, message: "Octroi de financement (Award) supprimé avec succès" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/vulnerabilities', async (req, res) => {
  try {
    const items = await prisma.vulnerability.findMany({
      include: {
        dependencies: { include: { parentDependency: true } },
        valueChains: true,
        beneficiaries: true,
        risks: true,
        mitigations: true,
        programs: true
      },
      orderBy: { name: 'asc' }
    });
    res.json({ data: items });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

v2Router.get('/vulnerabilities/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const item = await prisma.vulnerability.findUnique({
      where: { id },
      include: {
        dependencies: { include: { parentDependency: true, childDependencies: true } },
        valueChains: true,
        beneficiaries: { include: { primaryNaceSector: true } },
        risks: true,
        mitigations: true,
        programs: true,
        organizations: true,
        filieres: true,
        assets: true
      }
    });
    if (!item) return res.status(404).json({ error: 'Vulnérabilité non trouvée' });
    res.json({ data: item });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// =========================================================================
// PHASE 6: STABLE REFERENCE FRAMEWORKS, S3/DIS & DATA SPACES GET ENDPOINTS
// =========================================================================

v2Router.get('/s3-clusters', async (req, res) => {
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


v2Router.get('/openapi.json', (req, res) => {
  res.json(swaggerSpec);
});

v2Router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Mount v2 router under /api/v2
app.use('/api/v2', v2Router);

// Démarrer le serveur
const server = app.listen(port, () => {
  console.log(`🚀 Serveur du Lab CPSV-AP lancé avec succès sur http://localhost:${port}`);
});

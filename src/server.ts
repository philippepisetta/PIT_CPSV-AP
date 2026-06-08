import express from 'express';
import { PrismaClient } from '@prisma/client';
import path from 'path';

const app = express();
const port = process.env.PORT || 3001;
const prisma = new PrismaClient();

// Middleware pour parser le JSON et encoder les requêtes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques du frontend
app.use(express.static(path.join(__dirname, '../public')));

// CORS middleware (pour faciliter le dev local si besoin)
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

// --- SERVICES PUBLICS (CPSV-AP) ---

// 1. GET /api/services - Récupérer la liste simplifiée des services publics
app.get('/api/services', async (req, res) => {
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
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.json(services);
  } catch (error: any) {
    console.error('Erreur lors de la récupération des services:', error);
    res.status(500).json({ error: 'Erreur interne du serveur', details: error.message });
  }
});

// 2. GET /api/meta - Récupérer les métadonnées pour alimenter le formulaire d'encodage
app.get('/api/meta', async (req, res) => {
  try {
    const [
      organizations,
      channels,
      targetAudiences,
      businessEvents,
      lifeEvents,
      catalogues,
      valueChains,
      stages,
      roles,
      needs,
      services
    ] = await Promise.all([
      prisma.organization.findMany({ orderBy: { name: 'asc' } }),
      prisma.channel.findMany({ orderBy: { name: 'asc' } }),
      prisma.targetAudience.findMany({ orderBy: { name: 'asc' } }),
      prisma.businessEvent.findMany({ orderBy: { name: 'asc' } }),
      prisma.lifeEvent.findMany({ orderBy: { name: 'asc' } }),
      prisma.catalogue.findMany({ orderBy: { name: 'asc' } }),
      prisma.valueChain.findMany({ orderBy: { name: 'asc' } }),
      prisma.valueChainStage.findMany({ orderBy: { name: 'asc' } }),
      prisma.ecosystemRole.findMany({ orderBy: { name: 'asc' } }),
      prisma.businessNeed.findMany({ orderBy: { name: 'asc' } }),
      prisma.publicService.findMany({ orderBy: { name: 'asc' } })
    ]);

    res.json({
      organizations,
      channels,
      targetAudiences,
      businessEvents,
      lifeEvents,
      catalogues,
      valueChains,
      stages,
      roles,
      needs,
      services
    });
  } catch (error: any) {
    console.error('Erreur lors de la récupération des métadonnées:', error);
    res.status(500).json({ error: 'Erreur interne du serveur', details: error.message });
  }
});

// 3. GET /api/services/:id - Récupérer le graphe complet d'un service public
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
        costs: true,
        contactPoints: true,
        criterions: true,
        rules: true,
        catalogues: true,
        supportsBusinessNeed: true,
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

// 4. POST /api/services - Encoder / Créer un nouveau service public avec ses relations
app.post('/api/services', async (req, res) => {
  try {
    const {
      name,
      description,
      code,
      uri,
      organizationId,
      channels, // array of IDs [1, 2]
      targetAudiences, // array of IDs [1, 2]
      businessEvents, // array of IDs [1, 2]
      lifeEvents, // array of IDs [1, 2]
      catalogues, // array of IDs [1]
      requirements, // array of objects { name, description, code, uri, evidences: [...] }
      outputs, // array of objects { name, description, code, uri }
      costs, // array of objects { name, value, currency, description, uri }
      contactPoints, // array of objects { name, email, telephone, description, uri }
      supportsBusinessNeedIds, // array of IDs [1, 2]
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


// --- FILIERES / VALUE CHAINS ---
app.get('/api/value-chains', async (req, res) => {
  try {
    const data = await prisma.valueChain.findMany({ orderBy: { name: 'asc' } });
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/value-chains', async (req, res) => {
  try {
    const { name, description, uri } = req.body;
    const item = await prisma.valueChain.create({
      data: { name, description, uri: uri || `https://pit.wallonie.be/id/value-chain/${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}` }
    });
    res.status(201).json(item);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/value-chains/:id', async (req, res) => {
  try {
    await prisma.valueChain.delete({ where: { id: parseInt(req.params.id) } });
    res.sendStatus(204);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


// --- MAILLONS / STAGES ---
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
    const { name, description, uri } = req.body;
    const item = await prisma.valueChainStage.create({
      data: { name, description, uri: uri || `https://pit.wallonie.be/id/stage/${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}` }
    });
    res.status(201).json(item);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/stages/:id', async (req, res) => {
  try {
    await prisma.valueChainStage.delete({ where: { id: parseInt(req.params.id) } });
    res.sendStatus(204);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


// --- ROLES ECOSYSTEME ---
app.get('/api/roles', async (req, res) => {
  try {
    const data = await prisma.ecosystemRole.findMany({ orderBy: { name: 'asc' } });
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/roles', async (req, res) => {
  try {
    const { name, description, uri } = req.body;
    const item = await prisma.ecosystemRole.create({
      data: { name, description, uri: uri || `https://pit.wallonie.be/id/role/${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}` }
    });
    res.status(201).json(item);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/roles/:id', async (req, res) => {
  try {
    await prisma.ecosystemRole.delete({ where: { id: parseInt(req.params.id) } });
    res.sendStatus(204);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


// --- BESOINS METIER ---
app.get('/api/business-needs', async (req, res) => {
  try {
    const data = await prisma.businessNeed.findMany({
      include: { valueChains: true, valueChainStages: true, services: true },
      orderBy: { name: 'asc' }
    });
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/business-needs', async (req, res) => {
  try {
    const { name, description, uri, valueChainIds, valueChainStageIds, serviceIds } = req.body;
    const item = await prisma.businessNeed.create({
      data: {
        name,
        description,
        uri: uri || `https://pit.wallonie.be/id/need/${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        valueChains: valueChainIds ? { connect: valueChainIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        valueChainStages: valueChainStageIds ? { connect: valueChainStageIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        services: serviceIds ? { connect: serviceIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
      },
      include: { valueChains: true, valueChainStages: true, services: true }
    });
    res.status(201).json(item);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/business-needs/:id', async (req, res) => {
  try {
    await prisma.businessNeed.delete({ where: { id: parseInt(req.params.id) } });
    res.sendStatus(204);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


// --- ENTREPRISES ---
app.get('/api/companies', async (req, res) => {
  try {
    const data = await prisma.company.findMany({
      include: { belongsToValueChain: true, participatesInStage: true, playsRole: true, needs: true },
      orderBy: { name: 'asc' }
    });
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/companies/:id', async (req, res) => {
  try {
    const item = await prisma.company.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { belongsToValueChain: true, participatesInStage: true, playsRole: true, needs: true }
    });
    if (!item) {
      res.status(404).json({ error: 'Entreprise non trouvée' });
      return;
    }
    res.json(item);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/companies', async (req, res) => {
  try {
    const {
      name, size, sector, location, demand,
      digiscoreScore, digiscoreLevel, digiscoreDate,
      belongsToValueChainIds, participatesInStageIds, playsRoleIds, needIds
    } = req.body;

    const item = await prisma.company.create({
      data: {
        name,
        size,
        sector,
        location,
        demand: demand || null,
        digiscoreScore: digiscoreScore ? parseInt(digiscoreScore) : null,
        digiscoreLevel: digiscoreLevel || null,
        digiscoreDate: digiscoreDate ? new Date(digiscoreDate) : null,
        belongsToValueChain: belongsToValueChainIds ? { connect: belongsToValueChainIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        participatesInStage: participatesInStageIds ? { connect: participatesInStageIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        playsRole: playsRoleIds ? { connect: playsRoleIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        needs: needIds ? { connect: needIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
      },
      include: { belongsToValueChain: true, participatesInStage: true, playsRole: true, needs: true }
    });
    res.status(201).json(item);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/companies/:id', async (req, res) => {
  const companyId = parseInt(req.params.id);
  if (isNaN(companyId)) {
    res.status(400).json({ error: 'ID d\'entreprise invalide' });
    return;
  }
  try {
    const {
      name, size, sector, location, demand,
      digiscoreScore, digiscoreLevel, digiscoreDate,
      belongsToValueChainIds, participatesInStageIds, playsRoleIds, needIds,
      roadmapLogs
    } = req.body;

    const updated = await prisma.company.update({
      where: { id: companyId },
      data: {
        name,
        size,
        sector,
        location,
        demand,
        digiscoreScore: digiscoreScore !== undefined ? (digiscoreScore ? parseInt(digiscoreScore) : null) : undefined,
        digiscoreLevel: digiscoreLevel !== undefined ? digiscoreLevel : undefined,
        digiscoreDate: digiscoreDate !== undefined ? (digiscoreDate ? new Date(digiscoreDate) : null) : undefined,
        belongsToValueChain: belongsToValueChainIds ? {
          set: belongsToValueChainIds.map((id: any) => ({ id: parseInt(id) }))
        } : undefined,
        participatesInStage: participatesInStageIds ? {
          set: participatesInStageIds.map((id: any) => ({ id: parseInt(id) }))
        } : undefined,
        playsRole: playsRoleIds ? {
          set: playsRoleIds.map((id: any) => ({ id: parseInt(id) }))
        } : undefined,
        needs: needIds ? {
          set: needIds.map((id: any) => ({ id: parseInt(id) }))
        } : undefined,
        roadmapLogs: roadmapLogs !== undefined ? roadmapLogs : undefined,
      },
      include: { belongsToValueChain: true, participatesInStage: true, playsRole: true, needs: true }
    });
    res.json(updated);
  } catch (error: any) {
    console.error(`Erreur lors de la mise à jour de l'entreprise ${companyId}:`, error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'entreprise', details: error.message });
  }
});

app.delete('/api/companies/:id', async (req, res) => {
  try {
    await prisma.company.delete({ where: { id: parseInt(req.params.id) } });
    res.sendStatus(204);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


// --- PARCOURS TYPES ---
app.get('/api/journeys', async (req, res) => {
  try {
    const data = await prisma.journey.findMany({
      include: {
        needs: true,
        valueChains: true,
        valueChainStages: true,
        steps: { orderBy: { position: 'asc' }, include: { service: true } }
      },
      orderBy: { name: 'asc' }
    });
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/journeys', async (req, res) => {
  try {
    const { name, provider, objective, uri, needIds, valueChainIds, valueChainStageIds, steps } = req.body;
    
    const item = await prisma.journey.create({
      data: {
        name,
        provider,
        objective: objective || null,
        uri: uri || `https://pit.wallonie.be/id/journey/${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
        needs: needIds ? { connect: needIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        valueChains: valueChainIds ? { connect: valueChainIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        valueChainStages: valueChainStageIds ? { connect: valueChainStageIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        steps: steps && Array.isArray(steps) ? {
          create: steps.map((s: any) => ({
            name: s.name,
            position: parseInt(s.position),
            serviceId: s.serviceId ? parseInt(s.serviceId) : null
          }))
        } : undefined
      },
      include: {
        needs: true,
        valueChains: true,
        valueChainStages: true,
        steps: { orderBy: { position: 'asc' }, include: { service: true } }
      }
    });
    res.status(201).json(item);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/journeys/:id', async (req, res) => {
  try {
    await prisma.journey.delete({ where: { id: parseInt(req.params.id) } });
    res.sendStatus(204);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


// --- MOTEUR DE RECOMMANDATION (API) ---
app.get('/api/recommender/:companyId', async (req, res) => {
  const companyId = parseInt(req.params.companyId);
  if (isNaN(companyId)) {
    res.status(400).json({ error: 'ID d\'entreprise invalide' });
    return;
  }
  try {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      include: {
        belongsToValueChain: true,
        participatesInStage: true,
        playsRole: true,
        needs: true,
      },
    });

    if (!company) {
      res.status(404).json({ error: 'Entreprise non trouvée' });
      return;
    }

    const companyVcIds = company.belongsToValueChain.map(vc => vc.id);
    const companyStageIds = company.participatesInStage.map(s => s.id);
    const expressedNeedIds = company.needs.map(n => n.id);

    // Fonction d'évaluation des règles logiques dynamiques pour le Besoin Builder
    const evaluateRule = (rule: any, comp: any): boolean => {
      if (!rule || !rule.conditions || !Array.isArray(rule.conditions)) {
        return false;
      }
      const operator = rule.operator || 'AND';
      const results = rule.conditions.map((cond: any) => {
        const { field, operator: condOp, value } = cond;
        const companyValue = comp[field];
        if (companyValue === undefined || companyValue === null) {
          return false;
        }
        switch (condOp) {
          case '==': return companyValue == value;
          case '!=': return companyValue != value;
          case '<':  return companyValue < value;
          case '>':  return companyValue > value;
          case '<=': return companyValue <= value;
          case '>=': return companyValue >= value;
          default: return false;
        }
      });
      if (operator === 'OR') {
        return results.some((r: boolean) => r === true);
      }
      return results.every((r: boolean) => r === true);
    };

    // Charger l'ensemble des besoins de la base
    const allNeeds = await prisma.businessNeed.findMany({
      include: {
        valueChains: true,
        valueChainStages: true,
        services: {
          include: {
            organization: true,
          }
        },
        journeys: {
          include: {
            steps: {
              orderBy: { position: 'asc' },
              include: {
                service: true
              }
            }
          }
        }
      }
    });

    // Filtrer sémantiquement les besoins correspondants
    const matchedNeeds = allNeeds.filter(need => {
      // 1. S'il est exprimé explicitement
      if (expressedNeedIds.includes(need.id)) {
        return true;
      }
      // 2. Si une règle dynamique valide le besoin
      if (need.rule) {
        try {
          const ruleObj = typeof need.rule === 'string' ? JSON.parse(need.rule) : need.rule;
          if (evaluateRule(ruleObj, company)) {
            return true;
          }
        } catch (e) {
          console.error(`Erreur d'évaluation pour le besoin ${need.id}:`, e);
        }
      }
      // 3. Sinon, par croisement sémantique par défaut (filière ET maillon)
      const hasVc = need.valueChains.some(vc => companyVcIds.includes(vc.id));
      const hasStage = need.valueChainStages.some(st => companyStageIds.includes(st.id));
      if (hasVc && hasStage) {
        return true;
      }
      return false;
    });

    const recommendedServices: any[] = [];
    const recommendedJourneys: any[] = [];
    const serviceSet = new Set<number>();
    const journeySet = new Set<number>();

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
            matchedReason: `Répond au besoin : "${need.name}"`
          });
        }
      }
      for (const journey of need.journeys) {
        if (!journeySet.has(journey.id)) {
          journeySet.add(journey.id);
          recommendedJourneys.push({
            id: journey.id,
            name: journey.name,
            provider: journey.provider,
            objective: journey.objective,
            steps: journey.steps,
            matchedReason: `Parcours adapté au besoin : "${need.name}"`
          });
        }
      }
    }

    res.json({
      company,
      matchedNeeds: matchedNeeds.map(n => ({ id: n.id, name: n.name, description: n.description })),
      recommendedServices,
      recommendedJourneys,
    });
  } catch (error: any) {
    console.error('Erreur lors du calcul des recommandations:', error);
    res.status(500).json({ error: 'Erreur lors du calcul des recommandations', details: error.message });
  }
});


// --- KNOWLEDGE GRAPH (API) ---
app.get('/api/graph', async (req, res) => {
  try {
    const [companies, needs, journeys, services] = await Promise.all([
      prisma.company.findMany({
        include: { belongsToValueChain: true, participatesInStage: true, needs: true }
      }),
      prisma.businessNeed.findMany({
        include: { journeys: true, services: true }
      }),
      prisma.journey.findMany({
        include: { steps: { include: { service: true } } }
      }),
      prisma.publicService.findMany({
        include: { organization: true }
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
      edges.push({ id: `e-${source}-${target}`, source, target, label });
    };

    // 1. Companies, ValueChains, Stages & Needs
    for (const c of companies) {
      const companyNodeId = `company-${c.id}`;
      addNode(companyNodeId, c.name, 'company', { sector: c.sector, size: c.size, location: c.location });

      for (const vc of c.belongsToValueChain) {
        const vcNodeId = `valuechain-${vc.id}`;
        addNode(vcNodeId, vc.name, 'valuechain');
        addEdge(companyNodeId, vcNodeId, 'belongsToValueChain');
      }

      for (const st of c.participatesInStage) {
        const stNodeId = `stage-${st.id}`;
        addNode(stNodeId, st.name, 'stage');
        addEdge(companyNodeId, stNodeId, 'participatesInStage');
      }

      for (const n of c.needs) {
        const needNodeId = `need-${n.id}`;
        addNode(needNodeId, n.name, 'need');
        addEdge(companyNodeId, needNodeId, 'hasNeed');
      }
    }

    // 2. Needs and relationships
    for (const n of needs) {
      const needNodeId = `need-${n.id}`;
      addNode(needNodeId, n.name, 'need');

      for (const s of n.services) {
        const serviceNodeId = `service-${s.id}`;
        addNode(serviceNodeId, s.name, 'service', { code: s.code });
        addEdge(needNodeId, serviceNodeId, 'recommendsService');
      }

      for (const j of n.journeys) {
        const journeyNodeId = `journey-${j.id}`;
        addNode(journeyNodeId, j.name, 'journey');
        addEdge(needNodeId, journeyNodeId, 'recommendsJourney');
      }
    }

    // 3. Journeys & Steps
    for (const j of journeys) {
      const journeyNodeId = `journey-${j.id}`;
      addNode(journeyNodeId, j.name, 'journey');

      for (const step of j.steps) {
        if (step.service) {
          const serviceNodeId = `service-${step.service.id}`;
          addNode(serviceNodeId, step.service.name, 'service', { code: step.service.code });
          addEdge(journeyNodeId, serviceNodeId, `step ${step.position}: ${step.name}`);
        }
      }
    }

    // 4. Services & Organizations
    for (const s of services) {
      const serviceNodeId = `service-${s.id}`;
      if (s.organization) {
        const orgNodeId = `org-${s.organization.id}`;
        addNode(orgNodeId, s.organization.name, 'organization', { code: s.organization.code });
        addEdge(serviceNodeId, orgNodeId, 'operatedBy');
      }
    }

    res.json({ nodes, edges });
  } catch (error: any) {
    console.error('Erreur lors de la génération du graphe:', error);
    res.status(500).json({ error: 'Erreur interne lors de la génération du graphe', details: error.message });
  }
});


// Démarrer le serveur
const server = app.listen(port, () => {
  console.log(`🚀 Serveur du Lab CPSV-AP lancé avec succès sur http://localhost:${port}`);
  console.log(`🎨 L'interface d'arborescence et d'encodage est disponible à cette adresse.`);
});

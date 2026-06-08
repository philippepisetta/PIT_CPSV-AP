import { Injectable, NotFoundException } from '@nestjs/common';
// Normalement, vous injectez le PrismaService généré dans votre projet NestJS.
// On suppose ici qu'il est disponible au niveau de l'injecteur.
import { PrismaClient } from '@prisma/client';
import { 
  CreateCompanyDto, 
  CreateJourneyDto, 
  CreateBusinessNeedDto,
  CreateValueChainDto,
  CreateValueChainStageDto,
  CreateEcosystemRoleDto
} from './dto/semantic.dto';

@Injectable()
export class SemanticService {
  private prisma = new PrismaClient(); // En NestJS, utilisez un wrapper PrismaService injecté.

  // --- FILIERES / VALUE CHAINS ---
  async createValueChain(dto: CreateValueChainDto) {
    return this.prisma.valueChain.create({
      data: dto,
    });
  }

  async getValueChains() {
    return this.prisma.valueChain.findMany({
      include: {
        needs: true,
        companies: true,
      },
    });
  }

  // --- MAILLONS / VALUE CHAIN STAGES ---
  async createValueChainStage(dto: CreateValueChainStageDto) {
    return this.prisma.valueChainStage.create({
      data: dto,
    });
  }

  async getValueChainStages() {
    return this.prisma.valueChainStage.findMany({
      include: {
        needs: true,
        companies: true,
      },
    });
  }

  // --- ROLES ECOSYSTEME ---
  async createEcosystemRole(dto: CreateEcosystemRoleDto) {
    return this.prisma.ecosystemRole.create({
      data: dto,
    });
  }

  async getEcosystemRoles() {
    return this.prisma.ecosystemRole.findMany({
      include: {
        companies: true,
      },
    });
  }

  // --- BESOINS METIER ---
  async createBusinessNeed(dto: CreateBusinessNeedDto) {
    const { valueChainIds, valueChainStageIds, serviceIds, ...rest } = dto;
    return this.prisma.businessNeed.create({
      data: {
        ...rest,
        valueChains: valueChainIds ? { connect: valueChainIds.map(id => ({ id })) } : undefined,
        valueChainStages: valueChainStageIds ? { connect: valueChainStageIds.map(id => ({ id })) } : undefined,
        services: serviceIds ? { connect: serviceIds.map(id => ({ id })) } : undefined,
      },
    });
  }

  async getBusinessNeeds() {
    return this.prisma.businessNeed.findMany({
      include: {
        valueChains: true,
        valueChainStages: true,
        services: true,
      },
    });
  }

  // --- ENTREPRISES ---
  async createCompany(dto: CreateCompanyDto) {
    const { belongsToValueChainIds, participatesInStageIds, playsRoleIds, needIds, ...rest } = dto;
    return this.prisma.company.create({
      data: {
        ...rest,
        belongsToValueChain: belongsToValueChainIds ? { connect: belongsToValueChainIds.map(id => ({ id })) } : undefined,
        participatesInStage: participatesInStageIds ? { connect: participatesInStageIds.map(id => ({ id })) } : undefined,
        playsRole: playsRoleIds ? { connect: playsRoleIds.map(id => ({ id })) } : undefined,
        needs: needIds ? { connect: needIds.map(id => ({ id })) } : undefined,
      },
    });
  }

  async getCompanies() {
    return this.prisma.company.findMany({
      include: {
        belongsToValueChain: true,
        participatesInStage: true,
        playsRole: true,
        needs: true,
      },
    });
  }

  async getCompanyById(id: number) {
    const company = await this.prisma.company.findUnique({
      where: { id },
      include: {
        belongsToValueChain: true,
        participatesInStage: true,
        playsRole: true,
        needs: true,
      },
    });
    if (!company) throw new NotFoundException(`Company #${id} not found`);
    return company;
  }

  // --- RECOMMANDATION SEMANTIQUE ---
  async getRecommendationsForCompany(companyId: number) {
    const company = await this.getCompanyById(companyId);

    // Extraction des filières et maillons de l'entreprise
    const companyVcIds = company.belongsToValueChain.map(vc => vc.id);
    const companyStageIds = company.participatesInStage.map(s => s.id);
    const expressedNeedIds = company.needs.map(n => n.id);

    // 1. Trouver les besoins pertinents : soit exprimés explicitement,
    // soit qui matchent à la fois une filière ET un maillon de l'entreprise.
    const implicitNeeds = await this.prisma.businessNeed.findMany({
      where: {
        OR: [
          {
            id: { in: expressedNeedIds }
          },
          {
            valueChains: { some: { id: { in: companyVcIds } } },
            valueChainStages: { some: { id: { in: companyStageIds } } }
          }
        ]
      },
      include: {
        services: {
          include: {
            organization: true
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

    // 2. Extraire et dédoublonner les services et parcours recommandés
    const recommendedServices = [];
    const recommendedJourneys = [];
    const serviceSet = new Set<number>();
    const journeySet = new Set<number>();

    for (const need of implicitNeeds) {
      for (const service of need.services) {
        if (!serviceSet.has(service.id)) {
          serviceSet.add(service.id);
          recommendedServices.push({
            service,
            matchedReason: `Recommandé car répond au besoin : "${need.name}"`
          });
        }
      }

      for (const journey of need.journeys) {
        if (!journeySet.has(journey.id)) {
          journeySet.add(journey.id);
          recommendedJourneys.push({
            journey,
            matchedReason: `Parcours suggéré pour le besoin : "${need.name}"`
          });
        }
      }
    }

    return {
      company,
      matchedNeeds: implicitNeeds.map(n => ({ id: n.id, name: n.name, description: n.description })),
      recommendedServices,
      recommendedJourneys,
    };
  }

  // --- PARCOURS TYPES ---
  async createJourney(dto: CreateJourneyDto) {
    const { needIds, valueChainIds, valueChainStageIds, steps, ...rest } = dto;
    return this.prisma.journey.create({
      data: {
        ...rest,
        needs: needIds ? { connect: needIds.map(id => ({ id })) } : undefined,
        valueChains: valueChainIds ? { connect: valueChainIds.map(id => ({ id })) } : undefined,
        valueChainStages: valueChainStageIds ? { connect: valueChainStageIds.map(id => ({ id })) } : undefined,
        steps: {
          create: steps.map(step => ({
            name: step.name,
            position: step.position,
            serviceId: step.serviceId,
          })),
        },
      },
      include: {
        steps: {
          include: {
            service: true,
          },
        },
      },
    });
  }

  async getJourneys() {
    return this.prisma.journey.findMany({
      include: {
        needs: true,
        valueChains: true,
        valueChainStages: true,
        steps: {
          orderBy: { position: 'asc' },
          include: {
            service: true,
          },
        },
      },
    });
  }

  // --- KNOWLEDGE GRAPH STRUCTURE ---
  async getKnowledgeGraph() {
    const companies = await this.prisma.company.findMany({
      include: { belongsToValueChain: true, participatesInStage: true, needs: true }
    });
    const needs = await this.prisma.businessNeed.findMany({
      include: { journeys: true, services: true }
    });
    const journeys = await this.prisma.journey.findMany({
      include: { steps: { include: { service: true } } }
    });
    const services = await this.prisma.publicService.findMany({
      include: { organization: true }
    });

    const nodes = [];
    const edges = [];
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

    // Construction du graphe
    // 1. Nœuds Entreprises
    for (const c of companies) {
      const companyNodeId = `company-${c.id}`;
      addNode(companyNodeId, c.name, 'company', { sector: c.sector, size: c.size });

      // Relations Entreprise -> Filière & Maillon
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

      // Relations Entreprise -> Besoin
      for (const n of c.needs) {
        const needNodeId = `need-${n.id}`;
        addNode(needNodeId, n.name, 'need');
        addEdge(companyNodeId, needNodeId, 'hasNeed');
      }
    }

    // 2. Nœuds Besoins
    for (const n of needs) {
      const needNodeId = `need-${n.id}`;
      addNode(needNodeId, n.name, 'need');

      // Relations Besoin -> Service
      for (const s of n.services) {
        const serviceNodeId = `service-${s.id}`;
        addNode(serviceNodeId, s.name, 'service', { code: s.code });
        addEdge(needNodeId, serviceNodeId, 'recommendsService');
      }

      // Relations Besoin -> Parcours
      for (const j of n.journeys) {
        const journeyNodeId = `journey-${j.id}`;
        addNode(journeyNodeId, j.name, 'journey');
        addEdge(needNodeId, journeyNodeId, 'recommendsJourney');
      }
    }

    // 3. Nœuds Parcours & Étapes
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

    // 4. Services -> Opérateurs (Organizations)
    for (const s of services) {
      const serviceNodeId = `service-${s.id}`;
      if (s.organization) {
        const orgNodeId = `org-${s.organization.id}`;
        addNode(orgNodeId, s.organization.name, 'organization', { code: s.organization.code });
        addEdge(serviceNodeId, orgNodeId, 'operatedBy');
      }
    }

    return { nodes, edges };
  }
}

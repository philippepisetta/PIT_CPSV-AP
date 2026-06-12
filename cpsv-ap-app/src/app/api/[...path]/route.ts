// src/app/api/[...path]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// --- IN-MEMORY CACHE FOR SERVERLESS WARM INSTANCES ---
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

const CACHE_TTL_MS = 30000; // 30 seconds

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

function clearCache() {
  cachedMeta = null;
  cachedGraph = null;
  cachedBeneficiaries = null;
  cachedServices = null;
  cachedDeliveries = null;
  cachedStrategies = null;
  cachedPilotage = null;
}

// --- GET HANDLER ---
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  const segment1 = path[0];
  const segment2 = path[1];
  const segment3 = path[2];
  const now = Date.now();
  const searchParams = request.nextUrl.searchParams;

  try {
    // 1. Meta /api/meta
    if (segment1 === "meta") {
      if (cachedMeta && (now - cachedMetaTime < CACHE_TTL_MS)) {
        return NextResponse.json(cachedMeta);
      }
      const [
        organizations, channels, targetAudiences, businessEvents, lifeEvents,
        catalogues, strategicValueChains, stages, roles, needs,
        services, challenges, functions, sectors, ecosystems,
        interventionLevels, collectiveDeliveries, secondLineMissions,
        interventionTypes, ecosystemTypes, territories, eventResources,
        datasets, knowledgeAssets, actionInstances, journeyEnrollments,
        strategies, strategicPriorities, programs, measures,
        initiatives, beneficiaryEngagements, outcomeIndicators,
        impacts, fundingInstruments, projects, objectives,
        transformationDimensions, strategicDomainDimensions, capabilityDimensions,
        impactDimensions, knowledgeDimensions, dataQualityDimensions
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
        prisma.outcomeIndicator.findMany({ orderBy: { name: 'asc' } }),
        prisma.impact.findMany({
          include: { beneficiary: true, indicator: true, territory: true, valueChain: true },
          orderBy: { date: 'desc' }
        }),
        prisma.fundingInstrument.findMany({ orderBy: { name: 'asc' } }),
        prisma.project.findMany({ include: { program: true, initiative: true }, orderBy: { name: 'asc' } }),
        prisma.objective.findMany({ include: { strategy: true, parent: true }, orderBy: { name: 'asc' } }),
        prisma.transformationDimension.findMany({ orderBy: { code: 'asc' } }),
        prisma.strategicDomainDimension.findMany({ include: { parent: true }, orderBy: { name: 'asc' } }),
        prisma.capabilityDimension.findMany({ orderBy: { code: 'asc' } }),
        prisma.impactDimension.findMany({ orderBy: { code: 'asc' } }),
        prisma.knowledgeDimension.findMany({ orderBy: { code: 'asc' } }),
        prisma.dataQualityDimension.findMany()
      ]);

      const data = {
        organizations, channels, targetAudiences, businessEvents, lifeEvents,
        catalogues, strategicValueChains, stages, roles, needs,
        services, challenges, functions, sectors, ecosystems,
        interventionLevels, collectiveDeliveries, secondLineMissions,
        interventionTypes, ecosystemTypes, territories, eventResources,
        datasets, knowledgeAssets, actionInstances, journeyEnrollments,
        strategies, strategicPriorities, programs, measures,
        initiatives, beneficiaryEngagements, outcomeIndicators,
        impacts, fundingInstruments, projects, objectives,
        transformationDimensions, strategicDomainDimensions, capabilityDimensions,
        impactDimensions, knowledgeDimensions, dataQualityDimensions
      };
      cachedMeta = data;
      cachedMetaTime = now;
      return NextResponse.json(data);
    }

    // 2. Services /api/services
    if (segment1 === "services") {
      if (segment2) {
        const id = parseInt(segment2);
        if (isNaN(id)) return NextResponse.json({ error: "ID de service invalide" }, { status: 400 });

        if (segment3 === "contributions") {
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
          if (!service) return NextResponse.json({ error: "Service public non trouvé" }, { status: 404 });

          const journeys = await prisma.journey.findMany({
            where: { stages: { some: { services: { some: { id } } } } }
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
            where: { projects: { some: { actionsNew: { some: { activities: { some: { serviceId: id } } } } } } }
          });

          const projects = await prisma.project.findMany({
            where: { actionsNew: { some: { activities: { some: { serviceId: id } } } } }
          });

          const ecosystems = service.ecosystems || [];

          const territories = await prisma.territory.findMany({
            where: { beneficiaries: { some: { activitiesNew: { some: { serviceId: id } } } } }
          });

          const capabilities = await prisma.capability.findMany({
            where: { services: { some: { id } } }
          });

          const challenges = service.challenges || [];

          const datasets = await prisma.dataset.findMany({
            where: { ownerOrganizationId: service.organizationId },
            include: { dataQuality: true }
          });

          const metadata = computeMetadata(beneficiaries, datasets, [service], journeys, organizations, territories);

          return NextResponse.json({
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
        }
        const service = await prisma.publicService.findUnique({
          where: { id },
          include: {
            organization: true, channels: true, targetAudiences: true, businessEvents: true, lifeEvents: true,
            requirements: { include: { evidences: true } },
            outputs: true, outcomes: true, costs: true, contactPoints: true, criterions: true,
            rules: true, catalogues: true, supportsBusinessNeed: true, challenges: true,
            filieresS3: true, impactedFunctions: true, stages: true, ecosystems: true,
          }
        });
        if (!service) return NextResponse.json({ error: "Service public non trouvé" }, { status: 404 });
        return NextResponse.json(service);
      }
      if (cachedServices && (now - cachedServicesTime < CACHE_TTL_MS)) {
        return NextResponse.json(cachedServices);
      }
      const services = await prisma.publicService.findMany({
        select: {
          id: true, name: true, code: true, uri: true,
          organization: { select: { id: true, name: true } },
          challenges: { select: { id: true, name: true } },
          filieresS3: { select: { id: true, name: true } },
          stages: { select: { id: true } },
          interventionLevel: true,
        },
        orderBy: { createdAt: "desc" }
      });
      cachedServices = services;
      cachedServicesTime = now;
      return NextResponse.json(services);
    }

    // 3. Simple lists
    if (segment1 === "value-chains") {
      const data = await prisma.strategicValueChain.findMany({ orderBy: { name: "asc" } });
      return NextResponse.json(data);
    }
    if (segment1 === "stages") {
      const data = await prisma.valueChainStage.findMany({ orderBy: { name: "asc" } });
      return NextResponse.json(data);
    }
    if (segment1 === "challenges") {
      const data = await prisma.businessChallenge.findMany({ orderBy: { name: "asc" } });
      return NextResponse.json(data);
    }
    if (segment1 === "sectors") {
      const data = await prisma.naceSector.findMany({ orderBy: { code: "asc" } });
      return NextResponse.json(data);
    }
    if (segment1 === "projects") {
      const data = await prisma.project.findMany({
        include: { program: true, initiative: true, actions: true, organizations: true, ecosystems: true },
        orderBy: { name: "asc" }
      });
      return NextResponse.json(data);
    }
    if (segment1 === "objectives") {
      const data = await prisma.objective.findMany({
        include: { strategy: true, parent: true, children: true, indicators: true },
        orderBy: { name: "asc" }
      });
      return NextResponse.json(data);
    }
    if (segment1 === "transformation-dimensions") {
      const data = await prisma.transformationDimension.findMany({ orderBy: { name: "asc" } });
      return NextResponse.json(data);
    }
    if (segment1 === "strategic-domains") {
      const data = await prisma.strategicDomainDimension.findMany({
        include: { parent: true, children: true, valueChains: true },
        orderBy: { name: "asc" }
      });
      return NextResponse.json(data);
    }
    if (segment1 === "capabilities") {
      if (segment2 && segment3 === "contributions") {
        const id = parseInt(segment2);
        if (isNaN(id)) return NextResponse.json({ error: "ID de capabilité invalide" }, { status: 400 });
        
        const capability = await prisma.capability.findUnique({
          where: { id },
          include: { parentCapability: true, childCapabilities: true }
        });
        if (!capability) return NextResponse.json({ error: "Capability non trouvée" }, { status: 404 });

        const services = await prisma.publicService.findMany({
          where: { capabilitiesNew: { some: { id } } },
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
          where: { services: { some: { capabilitiesNew: { some: { id } } } } }
        });

        const programs = await prisma.program.findMany({
          where: { projects: { some: { actionsNew: { some: { activities: { some: { service: { capabilitiesNew: { some: { id } } } } } } } } } }
        });

        const projects = await prisma.project.findMany({
          where: { actionsNew: { some: { activities: { some: { service: { capabilitiesNew: { some: { id } } } } } } } }
        });

        const ecosystems = await prisma.ecosystem.findMany({
          where: { services: { some: { capabilitiesNew: { some: { id } } } } }
        });

        const territories = await prisma.territory.findMany({
          where: { beneficiaries: { some: { activitiesNew: { some: { service: { capabilitiesNew: { some: { id } } } } } } } }
        });

        const challenges = await prisma.businessChallenge.findMany({
          where: { services: { some: { capabilitiesNew: { some: { id } } } } }
        });

        const datasets = await prisma.dataset.findMany({
          where: { ownerOrganization: { services: { some: { capabilitiesNew: { some: { id } } } } } },
          include: { dataQuality: true }
        });

        const metadata = computeMetadata(beneficiaries, datasets, services, journeys, organizations, territories);

        return NextResponse.json({
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
      }
      const data = await prisma.capabilityDimension.findMany({ orderBy: { name: "asc" } });
      return NextResponse.json(data);
    }
    if (segment1 === "impact-dimensions") {
      const data = await prisma.impactDimension.findMany({ orderBy: { name: "asc" } });
      return NextResponse.json(data);
    }
    if (segment1 === "knowledge-dimensions") {
      const data = await prisma.knowledgeDimension.findMany({ orderBy: { name: "asc" } });
      return NextResponse.json(data);
    }
    if (segment1 === "roles") {
      if (segment2) {
        const id = parseInt(segment2);
        const item = await prisma.ecosystemRole.findUnique({ where: { id } });
        if (!item) return NextResponse.json({ error: "Rôle non trouvé" }, { status: 404 });
        return NextResponse.json(item);
      }
      const data = await prisma.ecosystemRole.findMany({ orderBy: { name: "asc" } });
      return NextResponse.json(data);
    }
    if (segment1 === "business-needs") {
      if (segment2) {
        const id = parseInt(segment2);
        const item = await prisma.businessNeed.findUnique({
          where: { id },
          include: { beneficiaries: true, valueChains: true, valueChainStages: true, journeys: true, services: true }
        });
        if (!item) return NextResponse.json({ error: "Besoin non trouvé" }, { status: 404 });
        return NextResponse.json(item);
      }
      const data = await prisma.businessNeed.findMany({
        include: { beneficiaries: true, valueChains: true, valueChainStages: true, journeys: true, services: true },
        orderBy: { name: "asc" }
      });
      return NextResponse.json(data);
    }

    // 4. Ecosystems
    if (segment1 === "ecosystems") {
      if (segment2) {
        const id = parseInt(segment2);
        const data = await prisma.ecosystem.findUnique({
          where: { id },
          include: { actors: true, services: true, journeys: true, filieresS3: true, challenges: true }
        });
        if (!data) return NextResponse.json({ error: "Écosystème non trouvé" }, { status: 404 });
        return NextResponse.json(data);
      }
      const data = await prisma.ecosystem.findMany({
        include: { actors: true, services: true, journeys: true, filieresS3: true, challenges: true },
        orderBy: { name: "asc" }
      });
      return NextResponse.json(data);
    }

    // 5. Service deliveries
    if (segment1 === "service-deliveries") {
      const beneficiaryId = searchParams.get("beneficiaryId") ? parseInt(searchParams.get("beneficiaryId")!) : undefined;
      if (!beneficiaryId && cachedDeliveries && (now - cachedDeliveriesTime < CACHE_TTL_MS)) {
        return NextResponse.json(cachedDeliveries);
      }
      const data = await prisma.serviceDelivery.findMany({
        where: beneficiaryId ? { beneficiaryId } : undefined,
        include: { beneficiary: true, service: true, operator: true },
        orderBy: { date: "desc" }
      });
      if (!beneficiaryId) {
        cachedDeliveries = data;
        cachedDeliveriesTime = now;
      }
      return NextResponse.json(data);
    }

    // 6. Collective & second line
    if (segment1 === "collective-deliveries") {
      const data = await prisma.collectiveDelivery.findMany({
        include: { service: true, operator: true, companies: true },
        orderBy: { date: "desc" }
      });
      return NextResponse.json(data);
    }
    if (segment1 === "second-line-missions") {
      const data = await prisma.secondLineMission.findMany({
        include: { service: true, leadOperator: true, operatorsMobilized: true, ecosystems: true, valueChains: true },
        orderBy: { startDate: "desc" }
      });
      return NextResponse.json(data);
    }

    // 7. Beneficiaries
    if (segment1 === "beneficiaries" || segment1 === "companies") {
      if (segment2) {
        const id = parseInt(segment2);
        const item = await prisma.beneficiary.findUnique({
          where: { id },
          include: {
            primaryNaceSector: true, secondaryNaceSectors: true, challenges: true, filieresS3: true,
            stages: true, needs: true, deliveries: { include: { service: true, operator: true } }
          }
        });
        if (!item) return NextResponse.json({ error: "Bénéficiaire non trouvé" }, { status: 404 });
        return NextResponse.json(item);
      }
      if (cachedBeneficiaries && (now - cachedBeneficiariesTime < CACHE_TTL_MS)) {
        return NextResponse.json(cachedBeneficiaries);
      }
      const data = await prisma.beneficiary.findMany({
        include: { primaryNaceSector: true, secondaryNaceSectors: true, challenges: true, filieresS3: true, stages: true, needs: true },
        orderBy: { name: "asc" }
      });
      cachedBeneficiaries = data;
      cachedBeneficiariesTime = now;
      return NextResponse.json(data);
    }

    // 8. Journeys
    if (segment1 === "journeys") {
      if (segment2 && segment3 === "contributions") {
        const id = parseInt(segment2);
        if (isNaN(id)) return NextResponse.json({ error: "ID de parcours invalide" }, { status: 400 });
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
        if (!journey) return NextResponse.json({ error: "Journey non trouvé" }, { status: 404 });

        const services = await prisma.publicService.findMany({
          where: { journeyStages: { some: { journeyId: id } } },
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
          where: { services: { some: { journeyStages: { some: { journeyId: id } } } } }
        });

        const programs = await prisma.program.findMany({
          where: { projects: { some: { actionsNew: { some: { activities: { some: { journeyId: id } } } } } } }
        });

        const projects = await prisma.project.findMany({
          where: { actionsNew: { some: { activities: { some: { journeyId: id } } } } }
        });

        const ecosystems = journey.ecosystems || [];

        const territories = await prisma.territory.findMany({
          where: { beneficiaries: { some: { enrolledJourneys: { some: { id } } } } }
        });

        const capabilities = await prisma.capability.findMany({
          where: { services: { some: { journeyStages: { some: { journeyId: id } } } } }
        });

        const challenges = journey.challenges || [];

        const datasets = await prisma.dataset.findMany({
          where: { ownerOrganization: { services: { some: { journeyStages: { some: { journeyId: id } } } } } },
          include: { dataQuality: true }
        });

        const metadata = computeMetadata(beneficiaries, datasets, services, [journey], organizations, territories);

        return NextResponse.json({
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
      }
      const data = await prisma.journey.findMany({
        include: {
          challenges: true,
          filieresS3: true,
          stagesTransverses: true,
          ecosystems: true,
          transformationDimensions: true,
          strategicDomains: true,
          actionInstances: true,
          stages: {
            orderBy: { position: "asc" },
            include: {
              services: {
                include: {
                  organization: true,
                  capabilities: true,
                  knowledgeAssets: true
                }
              }
            }
          }
        },
        orderBy: { name: "asc" }
      });
      return NextResponse.json(data);
    }

    // 9. Recommender
    if (segment1 === "recommender") {
      let beneficiaryIdStr = segment2;
      if (segment2 === "beneficiary" && segment3) beneficiaryIdStr = segment3;
      const beneficiaryId = parseInt(beneficiaryIdStr);
      if (isNaN(beneficiaryId)) return NextResponse.json({ error: "ID de bénéficiaire invalide" }, { status: 400 });
      const recommendations = await getRecommendations(beneficiaryId);
      return NextResponse.json(recommendations);
    }

    // 10. Graph explorer
    if (segment1 === "graph") {
      if (cachedGraph && (now - cachedGraphTime < CACHE_TTL_MS)) {
        return NextResponse.json(cachedGraph);
      }
      const graphData = await generateGraphData();
      cachedGraph = graphData;
      cachedGraphTime = now;
      return NextResponse.json(graphData);
    }

    // 11. Datasets & Knowledge assets
    if (segment1 === "datasets") {
      const items = await prisma.dataset.findMany({
        include: { ownerOrganization: true },
        orderBy: { title: "asc" }
      });
      return NextResponse.json(items);
    }
    if (segment1 === "knowledge-assets") {
      const items = await prisma.knowledgeAsset.findMany({
        include: { publicServices: true, ecosystems: true, eventResources: true },
        orderBy: { title: "asc" }
      });
      return NextResponse.json(items);
    }
    if (segment1 === "event-resources") {
      const items = await prisma.eventResource.findMany({
        include: { ecosystems: true, publicServices: true },
        orderBy: { startDate: "desc" }
      });
      return NextResponse.json(items);
    }
    if (segment1 === "action-instances") {
      const items = await prisma.actionInstance.findMany({
        include: { beneficiary: true, journey: true, ecosystem: true, deliveries: { include: { service: true } } },
        orderBy: { startDate: "desc" }
      });
      return NextResponse.json(items);
    }
    if (segment1 === "journey-enrollments") {
      const items = await prisma.journeyEnrollment.findMany({
        include: { beneficiary: true, journey: true, currentStage: true },
        orderBy: { startDate: "desc" }
      });
      return NextResponse.json(items);
    }
    if (segment1 === "territories") {
      const items = await prisma.territory.findMany({
        include: { parentTerritory: true, childTerritories: true },
        orderBy: { name: "asc" }
      });
      return NextResponse.json(items);
    }
    if (segment1 === "interventions") {
      const items = await prisma.intervention.findMany({
        include: { interventionType: true, ownerOrganization: true, publicService: true },
        orderBy: { title: "asc" }
      });
      return NextResponse.json(items);
    }

    // 12. Strategic governance
    if (segment1 === "strategies") {
      if (segment2) {
        const id = parseInt(segment2);
        const item = await prisma.strategy.findUnique({
          where: { id },
          include: {
            ownerOrganization: true,
            priorities: { include: { programs: true, measures: true, initiatives: true } },
            programs: {
              include: {
                measures: { include: { initiatives: true } },
                participations: { include: { organization: true } }
              }
            },
            filieresS3: true, fundingInstruments: true
          }
        });
        if (!item) return NextResponse.json({ error: "Stratégie non trouvée" }, { status: 404 });
        return NextResponse.json(item);
      }
      if (cachedStrategies && (now - cachedStrategiesTime < CACHE_TTL_MS)) {
        return NextResponse.json(cachedStrategies);
      }
      const items = await prisma.strategy.findMany({
        include: {
          ownerOrganization: true,
          priorities: { include: { programs: true, measures: true } },
          programs: { include: { measures: { include: { initiatives: true } } } },
          filieresS3: true, fundingInstruments: true
        },
        orderBy: { name: "asc" }
      });
      cachedStrategies = items;
      cachedStrategiesTime = now;
      return NextResponse.json(items);
    }
    if (segment1 === "programs") {
      if (segment2 && segment3 === "contributions") {
        const id = parseInt(segment2);
        if (isNaN(id)) return NextResponse.json({ error: "ID de programme invalide" }, { status: 400 });

        const program = await prisma.program.findUnique({
          where: { id },
          include: { ownerOrganization: true, territories: true, ecosystems: true }
        });
        if (!program) return NextResponse.json({ error: "Program non trouvé" }, { status: 404 });

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
          where: { activitiesNew: { some: { action: { project: { programId: id } } } } },
          include: { transformationDimensions: true, filieresS3: { include: { strategicDomain: true } }, stages: true, strategicDomains: true }
        });

        const capabilities = await prisma.capability.findMany({
          where: { services: { some: { activitiesNew: { some: { action: { project: { programId: id } } } } } } }
        });

        const challenges = await prisma.businessChallenge.findMany({
          where: { services: { some: { activitiesNew: { some: { action: { project: { programId: id } } } } } } }
        });

        const journeys = await prisma.journey.findMany({
          where: { activitiesNew: { some: { action: { project: { programId: id } } } } }
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
          where: { ownerOrganization: { programParticipations: { some: { programId: id } } } },
          include: { dataQuality: true }
        });

        const metadata = computeMetadata(beneficiaries, datasets, services, journeys, organizations, territories);

        return NextResponse.json({
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
      }
      const items = await prisma.program.findMany({
        include: { strategies: true, priorities: true, ownerOrganization: true, measures: true, territories: true },
        orderBy: { name: "asc" }
      });
      return NextResponse.json(items);
    }
    if (segment1 === "measures") {
      const items = await prisma.measure.findMany({
        include: { programs: true, priorities: true, initiatives: true },
        orderBy: { name: "asc" }
      });
      return NextResponse.json(items);
    }
    if (segment1 === "initiatives") {
      const items = await prisma.initiative.findMany({
        include: { measure: true, leadOrganization: true, publicServices: true, territories: true },
        orderBy: { name: "asc" }
      });
      return NextResponse.json(items);
    }
    if (segment1 === "beneficiary-engagements") {
      const items = await prisma.beneficiaryEngagement.findMany({
        include: { beneficiary: true, initiative: true, ecosystem: true, territory: true, filieresS3: true },
        orderBy: { startDate: "desc" }
      });
      return NextResponse.json(items);
    }
    if (segment1 === "outcome-indicators") {
      const items = await prisma.outcomeIndicator.findMany({ orderBy: { name: "asc" } });
      return NextResponse.json(items);
    }
    if (segment1 === "impacts") {
      const items = await prisma.impact.findMany({
        include: { beneficiary: true, indicator: true, territory: true, valueChain: true },
        orderBy: { date: "desc" }
      });
      return NextResponse.json(items);
    }
    if (segment1 === "funding-instruments") {
      const items = await prisma.fundingInstrument.findMany({
        include: { strategies: true, programs: true, measures: true, initiatives: true },
        orderBy: { name: "asc" }
      });
      return NextResponse.json(items);
    }

    // 13. Pilotage
    if (segment1 === "pilotage") {
      const filiereId = searchParams.get("filiereS3Id") ? parseInt(searchParams.get("filiereS3Id")!) : undefined;
      const territoryId = searchParams.get("territoryId") ? parseInt(searchParams.get("territoryId")!) : undefined;

      if (!filiereId && !territoryId && cachedPilotage && (now - cachedPilotageTime < CACHE_TTL_MS)) {
        return NextResponse.json(cachedPilotage);
      }
      const data = await getPilotageData(filiereId, territoryId);
      if (!filiereId && !territoryId) {
        cachedPilotage = data;
        cachedPilotageTime = now;
      }
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: "Route non trouvée" }, { status: 404 });
  } catch (err: any) {
    console.error("GET API Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// --- POST HANDLER ---
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  const segment1 = path[0];
  const body = await request.json();
  clearCache();

  try {
    if (segment1 === "services") {
      const {
        name, description, code, uri, organizationId, channels, targetAudiences,
        businessEvents, lifeEvents, catalogues, requirements, outputs, outcomes,
        costs, contactPoints, supportsBusinessNeedIds, challenges, filieresS3,
        impactedFunctions, stages, ecosystemIds, interventionLevelId
      } = body;

      if (!name || !organizationId) {
        return NextResponse.json({ error: "Le nom du service et l'organisation associée sont obligatoires." }, { status: 400 });
      }

      const newService = await prisma.publicService.create({
        data: {
          name,
          description: description || null,
          code: code || null,
          uri: uri || `https://pit.wallonie.be/id/public-service/${(code || name).toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
          organizationId: parseInt(organizationId),
          interventionLevelId: interventionLevelId ? parseInt(interventionLevelId) : null,
          channels: channels && Array.isArray(channels) ? { connect: channels.map((id: any) => ({ id: parseInt(id) })) } : undefined,
          targetAudiences: targetAudiences && Array.isArray(targetAudiences) ? { connect: targetAudiences.map((id: any) => ({ id: parseInt(id) })) } : undefined,
          businessEvents: businessEvents && Array.isArray(businessEvents) ? { connect: businessEvents.map((id: any) => ({ id: parseInt(id) })) } : undefined,
          lifeEvents: lifeEvents && Array.isArray(lifeEvents) ? { connect: lifeEvents.map((id: any) => ({ id: parseInt(id) })) } : undefined,
          catalogues: catalogues && Array.isArray(catalogues) ? { connect: catalogues.map((id: any) => ({ id: parseInt(id) })) } : undefined,
          supportsBusinessNeed: supportsBusinessNeedIds && Array.isArray(supportsBusinessNeedIds) ? { connect: supportsBusinessNeedIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
          challenges: challenges && Array.isArray(challenges) ? { connect: challenges.map((id: any) => ({ id: parseInt(id) })) } : undefined,
          filieresS3: filieresS3 && Array.isArray(filieresS3) ? { connect: filieresS3.map((id: any) => ({ id: parseInt(id) })) } : undefined,
          impactedFunctions: impactedFunctions && Array.isArray(impactedFunctions) ? { connect: impactedFunctions.map((id: any) => ({ id: parseInt(id) })) } : undefined,
          stages: stages && Array.isArray(stages) ? { connect: stages.map((id: any) => ({ id: parseInt(id) })) } : undefined,
          ecosystems: ecosystemIds && Array.isArray(ecosystemIds) ? { connect: ecosystemIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
          requirements: requirements && Array.isArray(requirements) ? {
            create: requirements.map((r: any) => ({
              name: r.name,
              description: r.description || null,
              code: r.code || null,
              uri: r.uri || `https://pit.wallonie.be/id/requirement/${r.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
              evidences: r.evidences && Array.isArray(r.evidences) ? {
                create: r.evidences.map((e: any) => ({
                  name: e.name, description: e.description || null, code: e.code || null,
                  uri: e.uri || `https://pit.wallonie.be/id/evidence/${e.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
                }))
              } : undefined
            }))
          } : undefined,
          outputs: outputs && Array.isArray(outputs) ? {
            create: outputs.map((out: any) => ({
              name: out.name, description: out.description || null, code: out.code || null,
              uri: out.uri || `https://pit.wallonie.be/id/output/${out.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
            }))
          } : undefined,
          outcomes: outcomes && Array.isArray(outcomes) ? {
            create: outcomes.map((out: any) => ({
              name: out.name, description: out.description || null, code: out.code || null,
              uri: out.uri || `https://pit.wallonie.be/id/outcome/${out.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
            }))
          } : undefined,
          costs: costs && Array.isArray(costs) ? {
            create: costs.map((c: any) => ({
              name: c.name, value: parseFloat(c.value) || 0.0, currency: c.currency || 'EUR', description: c.description || null,
              uri: c.uri || `https://pit.wallonie.be/id/cost/${c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
            }))
          } : undefined,
          contactPoints: contactPoints && Array.isArray(contactPoints) ? {
            create: contactPoints.map((cp: any) => ({
              name: cp.name, email: cp.email || null, telephone: cp.telephone || null, description: cp.description || null,
              uri: cp.uri || `https://pit.wallonie.be/id/contact-point/${cp.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
            }))
          } : undefined,
        },
        include: { organization: true, channels: true, targetAudiences: true, supportsBusinessNeed: true }
      });
      return NextResponse.json(newService, { status: 201 });
    }

    if (segment1 === "journeys") {
      const {
        name, provider, objective, description, targetAudience,
        filiereIds, challengeIds, ecosystemIds, transformationIds, domainIds,
        stages
      } = body;

      if (!name || !provider) {
        return NextResponse.json({ error: "Le nom du parcours et le fournisseur sont obligatoires." }, { status: 400 });
      }

      const created = await prisma.journey.create({
        data: {
          name,
          provider,
          objective: objective || null,
          description: description || null,
          targetAudience: targetAudience || [],
          uri: `https://pit.wallonie.be/id/journey/${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
          filieresS3: filiereIds ? { connect: filiereIds.map((fid: any) => ({ id: parseInt(fid) })) } : undefined,
          challenges: challengeIds ? { connect: challengeIds.map((cid: any) => ({ id: parseInt(cid) })) } : undefined,
          ecosystems: ecosystemIds ? { connect: ecosystemIds.map((eid: any) => ({ id: parseInt(eid) })) } : undefined,
          transformationDimensions: transformationIds ? { connect: transformationIds.map((code: any) => ({ code })) } : undefined,
          strategicDomains: domainIds ? { connect: domainIds.map((did: any) => ({ id: parseInt(did) })) } : undefined,
          stages: {
            create: (stages || []).map((st: any) => ({
              name: st.name,
              position: parseInt(st.position),
              services: st.services ? { connect: st.services.map((s: any) => ({ id: parseInt(s.id) })) } : undefined
            }))
          }
        },
        include: {
          stages: { include: { services: true } }
        }
      });
      return NextResponse.json(created, { status: 201 });
    }

    if (segment1 === "value-chains") {
      const { name, description, uri } = body;
      const item = await prisma.strategicValueChain.create({
        data: { name, description, uri: uri || `https://pit.wallonie.be/id/strategic-value-chain/${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}` }
      });
      return NextResponse.json(item, { status: 201 });
    }

    if (segment1 === "stages") {
      const { name, description, category, uri } = body;
      const item = await prisma.valueChainStage.create({
        data: { name, description, category, uri: uri || `https://pit.wallonie.be/id/stage/${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}` }
      });
      return NextResponse.json(item, { status: 201 });
    }

    if (segment1 === "roles") {
      const { name, description, uri } = body;
      const item = await prisma.ecosystemRole.create({
        data: { name, description, uri: uri || `https://pit.wallonie.be/id/ecosystem-role/${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}` }
      });
      return NextResponse.json(item, { status: 201 });
    }

    if (segment1 === "business-needs") {
      const { name, description, uri, valueChainIds, valueChainStageIds, serviceIds, rule } = body;
      const item = await prisma.businessNeed.create({
        data: {
          name, description,
          uri: uri || `https://pit.wallonie.be/id/business-need/${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
          rule: rule || null,
          valueChains: valueChainIds ? { connect: valueChainIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
          valueChainStages: valueChainStageIds ? { connect: valueChainStageIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
          services: serviceIds ? { connect: serviceIds.map((id: any) => ({ id: parseInt(id) })) } : undefined
        }
      });
      return NextResponse.json(item, { status: 201 });
    }

    if (segment1 === "ecosystems") {
      const { name, description, mission, territory, actorIds, serviceIds, journeyIds, filiereIds, challengeIds } = body;
      const item = await prisma.ecosystem.create({
        data: {
          name, description, mission, territory,
          actors: actorIds ? { connect: actorIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
          services: serviceIds ? { connect: serviceIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
          journeys: journeyIds ? { connect: journeyIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
          filieresS3: filiereIds ? { connect: filiereIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
          challenges: challengeIds ? { connect: challengeIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        },
        include: { actors: true, services: true }
      });
      return NextResponse.json(item, { status: 201 });
    }

    if (segment1 === "service-deliveries") {
      const {
        beneficiaryId, serviceId, journeyId, journeyStageId, status, date,
        operatorId, outputReal, outcomeReal, impact, maturityBefore, maturityAfter,
        maturityDelta, evidenceFiles
      } = body;

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
          outputReal, outcomeReal, impact, maturityBefore, maturityAfter, maturityDelta, evidenceFiles
        },
        include: { beneficiary: true, service: true, operator: true }
      });

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
      return NextResponse.json(item, { status: 201 });
    }

    if (segment1 === "collective-deliveries") {
      const {
        serviceId, title, date, operatorId, status, participantsCount,
        companiesCount, satisfactionScore, leadsCount, nextSteps, companyIds, notes
      } = body;

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
          nextSteps, notes,
          companies: companyIds && Array.isArray(companyIds) ? { connect: companyIds.map((id: any) => ({ id: parseInt(id) })) } : undefined
        },
        include: { service: true, operator: true, companies: true }
      });
      return NextResponse.json(item, { status: 201 });
    }

    if (segment1 === "second-line-missions") {
      const {
        serviceId, title, startDate, endDate, status, leadOperatorId,
        operatorIds, collaborationsCount, deliverables, territoryCovered, ecosystemIds, valueChainIds, notes
      } = body;

      const item = await prisma.secondLineMission.create({
        data: {
          serviceId: parseInt(serviceId),
          title,
          startDate: startDate ? new Date(startDate) : new Date(),
          endDate: endDate ? new Date(endDate) : null,
          status: status || 'PLANNED',
          leadOperatorId: parseInt(leadOperatorId),
          operatorsMobilized: operatorIds && Array.isArray(operatorIds) ? { connect: operatorIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
          collaborationsCount: collaborationsCount ? parseInt(collaborationsCount) : 0,
          deliverables, territoryCovered,
          ecosystems: ecosystemIds && Array.isArray(ecosystemIds) ? { connect: ecosystemIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
          valueChains: valueChainIds && Array.isArray(valueChainIds) ? { connect: valueChainIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
          notes
        },
        include: { service: true, leadOperator: true, operatorsMobilized: true }
      });
      return NextResponse.json(item, { status: 201 });
    }

    if (segment1 === "beneficiaries" || segment1 === "companies") {
      const {
        name, bce, size, employees, revenue, location, province, arrondissement, demand,
        primaryNaceSectorId, secondaryNaceSectorIds, challengeIds, filiereS3Ids, stageIds, roleIds, needIds,
        maturityDigital, maturityIa, maturityCyber, maturityExport, maturityDurability,
        belongsToValueChainIds, participatesInStageIds, playsRoleIds
      } = body;

      // Map matching aliases for backward compatibility
      const filiereIds = filiereS3Ids || belongsToValueChainIds;
      const activeStageIds = stageIds || participatesInStageIds;
      const activeRoleIds = roleIds || playsRoleIds;

      const item = await prisma.beneficiary.create({
        data: {
          name,
          bce: bce || null,
          size,
          employees: employees ? parseInt(employees) : null,
          revenue: revenue ? parseFloat(revenue) : null,
          location, province, arrondissement,
          demand: demand || null,
          primaryNaceSectorId: primaryNaceSectorId ? parseInt(primaryNaceSectorId) : null,
          secondaryNaceSectors: secondaryNaceSectorIds ? { connect: secondaryNaceSectorIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
          challenges: challengeIds ? { connect: challengeIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
          filieresS3: filiereIds ? { connect: filiereIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
          stages: activeStageIds ? { connect: activeStageIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
          playsRole: activeRoleIds ? { connect: activeRoleIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
          needs: needIds ? { connect: needIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
          maturityDigital: maturityDigital ? parseInt(maturityDigital) : 1,
          maturityIa: maturityIa ? parseInt(maturityIa) : 1,
          maturityCyber: maturityCyber ? parseInt(maturityCyber) : 1,
          maturityExport: maturityExport ? parseInt(maturityExport) : 1,
          maturityDurability: maturityDurability ? parseInt(maturityDurability) : 1
        },
        include: { primaryNaceSector: true, challenges: true, filieresS3: true }
      });
      return NextResponse.json(item, { status: 201 });
    }

    if (segment1 === "action-instances") {
      const { title, objective, startDate, endDate, status, beneficiaryId, journeyId, ecosystemId } = body;
      const item = await prisma.actionInstance.create({
        data: {
          title, objective,
          startDate: startDate ? new Date(startDate) : new Date(),
          endDate: endDate ? new Date(endDate) : null,
          status: status || 'PLANNED',
          beneficiaryId: parseInt(beneficiaryId),
          journeyId: journeyId ? parseInt(journeyId) : null,
          ecosystemId: ecosystemId ? parseInt(ecosystemId) : null
        },
        include: { beneficiary: true, journey: true, ecosystem: true }
      });
      return NextResponse.json(item, { status: 201 });
    }

    if (segment1 === "journey-enrollments") {
      const { startDate, endDate, status, completionRate, beneficiaryId, journeyId, currentStageId } = body;
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
      return NextResponse.json(item, { status: 201 });
    }

    if (segment1 === "territories") {
      const { name, type, code, parentTerritoryId, description } = body;
      const item = await prisma.territory.create({
        data: {
          name, type, code,
          parentTerritoryId: parentTerritoryId ? parseInt(parentTerritoryId) : null,
          description
        }
      });
      return NextResponse.json(item, { status: 201 });
    }

    if (segment1 === "interventions") {
      const { title, description, uri, interventionTypeId, ownerOrganizationId } = body;
      const item = await prisma.intervention.create({
        data: {
          title, description,
          uri: uri || `https://pit.wallonie.be/id/intervention/${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
          interventionTypeId: parseInt(interventionTypeId),
          ownerOrganizationId: parseInt(ownerOrganizationId)
        },
        include: { interventionType: true, ownerOrganization: true }
      });
      return NextResponse.json(item, { status: 201 });
    }

    if (segment1 === "strategies") {
      const { name, code, description, ownerOrganizationId, startDate, endDate, status, website, filiereS3Ids, fundingIds } = body;
      const item = await prisma.strategy.create({
        data: {
          name, code, description,
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
      return NextResponse.json(item, { status: 201 });
    }

    if (segment1 === "strategic-priorities") {
      const { strategyId, code, name, description, status } = body;
      const item = await prisma.strategicPriority.create({
        data: {
          strategyId: parseInt(strategyId),
          code, name, description,
          status: status || 'ACTIVE'
        }
      });
      return NextResponse.json(item, { status: 201 });
    }

    if (segment1 === "programs") {
      const { name, code, description, ownerOrganizationId, startDate, endDate, budget, status, strategyIds, priorityIds, territoryIds } = body;
      const item = await prisma.program.create({
        data: {
          name, code, description,
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
      return NextResponse.json(item, { status: 201 });
    }

    if (segment1 === "measures") {
      const { name, code, description, budget, status, programIds, priorityIds } = body;
      const item = await prisma.measure.create({
        data: {
          name, code, description,
          budget: budget ? parseFloat(budget) : null,
          status: status || 'ACTIVE',
          programs: programIds ? { connect: programIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
          priorities: priorityIds ? { connect: priorityIds.map((id: any) => ({ id: parseInt(id) })) } : undefined
        }
      });
      return NextResponse.json(item, { status: 201 });
    }

    if (segment1 === "initiatives") {
      const { measureId, name, code, description, leadOrganizationId, startDate, endDate, status, priorityIds, ecosystemIds, filiereIds, territoryIds, serviceIds } = body;
      const item = await prisma.initiative.create({
        data: {
          measureId: parseInt(measureId),
          name, code, description,
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
      return NextResponse.json(item, { status: 201 });
    }

    if (segment1 === "program-participations") {
      const { programId, organizationId, role, startDate, endDate, status } = body;
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
      return NextResponse.json(item, { status: 201 });
    }

    if (segment1 === "initiative-participations") {
      const { initiativeId, organizationId, role, startDate, endDate, status } = body;
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
      return NextResponse.json(item, { status: 201 });
    }

    if (segment1 === "beneficiary-engagements") {
      const { beneficiaryId, journeyId, initiativeId, ecosystemId, territoryId, title, objective, status, startDate, endDate, filiereIds } = body;
      const item = await prisma.beneficiaryEngagement.create({
        data: {
          beneficiaryId: parseInt(beneficiaryId),
          journeyId: journeyId ? parseInt(journeyId) : null,
          initiativeId: initiativeId ? parseInt(initiativeId) : null,
          ecosystemId: ecosystemId ? parseInt(ecosystemId) : null,
          territoryId: territoryId ? parseInt(territoryId) : null,
          title, objective,
          status: status || 'PLANNED',
          startDate: startDate ? new Date(startDate) : new Date(),
          endDate: endDate ? new Date(endDate) : null,
          filieresS3: filiereIds ? { connect: filiereIds.map((id: any) => ({ id: parseInt(id) })) } : undefined
        },
        include: { beneficiary: true, initiative: true }
      });
      return NextResponse.json(item, { status: 201 });
    }

    if (segment1 === "outcome-indicators") {
      const { name, unit, description } = body;
      const item = await prisma.outcomeIndicator.create({
        data: { name, unit, description }
      });
      return NextResponse.json(item, { status: 201 });
    }

    if (segment1 === "impacts") {
      const { beneficiaryId, indicatorId, numericValue, textValue, territoryId, valueChainId, date, evidence } = body;
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
      return NextResponse.json(item, { status: 201 });
    }

    if (segment1 === "funding-instruments") {
      const { name, type, description, strategyIds, programIds, measureIds, initiativeIds } = body;
      const item = await prisma.fundingInstrument.create({
        data: {
          name, type, description,
          strategies: strategyIds ? { connect: strategyIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
          programs: programIds ? { connect: programIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
          measures: measureIds ? { connect: measureIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
          initiatives: initiativeIds ? { connect: initiativeIds.map((id: any) => ({ id: parseInt(id) })) } : undefined
        }
      });
      return NextResponse.json(item, { status: 201 });
    }

    if (segment1 === "datasets") {
      const { title, description, themes, keywords, qualityScore, updateFrequency, ownerOrganizationId } = body;
      const item = await prisma.dataset.create({
        data: {
          title, description,
          themes: themes || [],
          keywords: keywords || [],
          qualityScore: qualityScore ? parseFloat(qualityScore) : 5.0,
          updateFrequency,
          ownerOrganizationId: parseInt(ownerOrganizationId)
        },
        include: { ownerOrganization: true }
      });
      return NextResponse.json(item, { status: 201 });
    }

    if (segment1 === "knowledge-assets") {
      const { title, type, description, file, url, serviceIds, ecosystemIds, eventResourceIds } = body;
      const item = await prisma.knowledgeAsset.create({
        data: {
          title, type, description, file, url,
          publicServices: serviceIds ? { connect: serviceIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
          ecosystems: ecosystemIds ? { connect: ecosystemIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
          eventResources: eventResourceIds ? { connect: eventResourceIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        },
        include: { publicServices: true, ecosystems: true, eventResources: true }
      });
      return NextResponse.json(item, { status: 201 });
    }

    return NextResponse.json({ error: "Route non trouvée" }, { status: 404 });
  } catch (err: any) {
    console.error("POST API Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// --- PATCH HANDLER ---
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  const segment1 = path[0];
  const segment2 = path[1];
  const body = await request.json();
  clearCache();

  if (!segment2) {
    return NextResponse.json({ error: "ID requis pour modification" }, { status: 400 });
  }
  const id = parseInt(segment2);
  if (isNaN(id)) return NextResponse.json({ error: "ID invalide" }, { status: 400 });

  try {
    if (segment1 === "journeys") {
      const journeyId = id;
      const {
        name, provider, objective, description, targetAudience,
        filiereIds, challengeIds, ecosystemIds, transformationIds, domainIds,
        stages
      } = body;

      if (!name || !provider) {
        return NextResponse.json({ error: "Le nom du parcours et le fournisseur sont obligatoires." }, { status: 400 });
      }

      // Delete old stages first
      await prisma.journeyStage.deleteMany({
        where: { journeyId }
      });

      const updated = await prisma.journey.update({
        where: { id: journeyId },
        data: {
          name,
          provider,
          objective: objective || null,
          description: description || null,
          targetAudience: targetAudience || [],
          filieresS3: { set: filiereIds ? filiereIds.map((fid: any) => ({ id: parseInt(fid) })) : [] },
          challenges: { set: challengeIds ? challengeIds.map((cid: any) => ({ id: parseInt(cid) })) : [] },
          ecosystems: { set: ecosystemIds ? ecosystemIds.map((eid: any) => ({ id: parseInt(eid) })) : [] },
          transformationDimensions: { set: transformationIds ? transformationIds.map((code: any) => ({ code })) : [] },
          strategicDomains: { set: domainIds ? domainIds.map((did: any) => ({ id: parseInt(did) })) : [] },
          stages: {
            create: (stages || []).map((st: any) => ({
              name: st.name,
              position: parseInt(st.position),
              services: st.services ? { connect: st.services.map((s: any) => ({ id: parseInt(s.id) })) } : undefined
            }))
          }
        },
        include: {
          stages: { include: { services: true } }
        }
      });
      return NextResponse.json(updated);
    }

    if (segment1 === "service-deliveries") {
      const { status, outputReal, outcomeReal, impact, maturityAfter, maturityDelta, evidenceFiles } = body;
      const original = await prisma.serviceDelivery.findUnique({ where: { id } });
      if (!original) return NextResponse.json({ error: "Réalisation non trouvée" }, { status: 404 });

      const mappedStatus = status === 'Terminé' || status === 'COMPLETED' ? 'COMPLETED'
                           : status === 'En cours' || status === 'IN_PROGRESS' ? 'IN_PROGRESS'
                           : status === 'Planifié' || status === 'PLANNED' ? 'PLANNED'
                           : status === 'Annulé' || status === 'CANCELLED' ? 'CANCELLED'
                           : undefined;

      const updated = await prisma.serviceDelivery.update({
        where: { id },
        data: { status: mappedStatus, outputReal, outcomeReal, impact, maturityAfter, maturityDelta, evidenceFiles }
      });

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
      return NextResponse.json(updated);
    }

    if (segment1 === "beneficiaries" || segment1 === "companies") {
      const {
        name, bce, size, employees, revenue, location, province, arrondissement, demand,
        primaryNaceSectorId, secondaryNaceSectorIds, challengeIds, filiereS3Ids, stageIds, roleIds, needIds,
        maturityDigital, maturityIa, maturityCyber, maturityExport, maturityDurability, roadmapLogs,
        belongsToValueChainIds, participatesInStageIds, playsRoleIds
      } = body;

      const filiereIds = filiereS3Ids || belongsToValueChainIds;
      const activeStageIds = stageIds || participatesInStageIds;
      const activeRoleIds = roleIds || playsRoleIds;

      const updated = await prisma.beneficiary.update({
        where: { id },
        data: {
          name, bce, size, demand, location, province, arrondissement,
          employees: employees !== undefined ? (employees ? parseInt(employees) : null) : undefined,
          revenue: revenue !== undefined ? (revenue ? parseFloat(revenue) : null) : undefined,
          primaryNaceSectorId: primaryNaceSectorId !== undefined ? (primaryNaceSectorId ? parseInt(primaryNaceSectorId) : null) : undefined,
          secondaryNaceSectors: secondaryNaceSectorIds ? { set: secondaryNaceSectorIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
          challenges: challengeIds ? { set: challengeIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
          filieresS3: filiereIds ? { set: filiereIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
          stages: activeStageIds ? { set: activeStageIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
          playsRole: activeRoleIds ? { set: activeRoleIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
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
      return NextResponse.json(updated);
    }

    if (segment1 === "action-instances") {
      const { title, objective, startDate, endDate, status, journeyId, ecosystemId } = body;
      const updated = await prisma.actionInstance.update({
        where: { id },
        data: {
          title, objective,
          startDate: startDate ? new Date(startDate) : undefined,
          endDate: endDate !== undefined ? (endDate ? new Date(endDate) : null) : undefined,
          status,
          journeyId: journeyId !== undefined ? (journeyId ? parseInt(journeyId) : null) : undefined,
          ecosystemId: ecosystemId !== undefined ? (ecosystemId ? parseInt(ecosystemId) : null) : undefined
        },
        include: { beneficiary: true, journey: true, ecosystem: true }
      });
      return NextResponse.json(updated);
    }

    if (segment1 === "journey-enrollments") {
      const { startDate, endDate, status, completionRate, currentStageId } = body;
      const updated = await prisma.journeyEnrollment.update({
        where: { id },
        data: {
          startDate: startDate ? new Date(startDate) : undefined,
          endDate: endDate !== undefined ? (endDate ? new Date(endDate) : null) : undefined,
          status,
          completionRate: completionRate ? parseFloat(completionRate) : undefined,
          currentStageId: currentStageId !== undefined ? (currentStageId ? parseInt(currentStageId) : null) : undefined
        },
        include: { beneficiary: true, journey: true, currentStage: true }
      });
      return NextResponse.json(updated);
    }

    if (segment1 === "territories") {
      const { name, type, code, parentTerritoryId, description } = body;
      const updated = await prisma.territory.update({
        where: { id },
        data: {
          name, type, code,
          parentTerritoryId: parentTerritoryId !== undefined ? (parentTerritoryId ? parseInt(parentTerritoryId) : null) : undefined,
          description
        }
      });
      return NextResponse.json(updated);
    }

    if (segment1 === "roles") {
      const { name, description, uri } = body;
      const updated = await prisma.ecosystemRole.update({
        where: { id },
        data: { name, description, uri }
      });
      return NextResponse.json(updated);
    }

    if (segment1 === "business-needs") {
      const { name, description, uri, valueChainIds, valueChainStageIds, serviceIds, rule } = body;
      const updated = await prisma.businessNeed.update({
        where: { id },
        data: {
          name, description, uri,
          rule: rule !== undefined ? rule : undefined,
          valueChains: valueChainIds ? { set: valueChainIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
          valueChainStages: valueChainStageIds ? { set: valueChainStageIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
          services: serviceIds ? { set: serviceIds.map((id: any) => ({ id: parseInt(id) })) } : undefined
        }
      });
      return NextResponse.json(updated);
    }

    if (segment1 === "strategies") {
      const { name, code, description, ownerOrganizationId, startDate, endDate, status, website, filiereS3Ids, fundingIds } = body;
      const updated = await prisma.strategy.update({
        where: { id },
        data: {
          name, code, description,
          ownerOrganizationId: ownerOrganizationId !== undefined ? (ownerOrganizationId ? parseInt(ownerOrganizationId) : null) : undefined,
          startDate: startDate !== undefined ? (startDate ? new Date(startDate) : null) : undefined,
          endDate: endDate !== undefined ? (endDate ? new Date(endDate) : null) : undefined,
          status, website,
          filieresS3: filiereS3Ids ? { set: filiereS3Ids.map((id: any) => ({ id: parseInt(id) })) } : undefined,
          fundingInstruments: fundingIds ? { set: fundingIds.map((id: any) => ({ id: parseInt(id) })) } : undefined
        },
        include: { ownerOrganization: true }
      });
      return NextResponse.json(updated);
    }

    if (segment1 === "strategic-priorities") {
      const { code, name, description, status } = body;
      const updated = await prisma.strategicPriority.update({
        where: { id },
        data: { code, name, description, status }
      });
      return NextResponse.json(updated);
    }

    if (segment1 === "programs") {
      const { name, code, description, ownerOrganizationId, startDate, endDate, budget, status, strategyIds, priorityIds, territoryIds } = body;
      const updated = await prisma.program.update({
        where: { id },
        data: {
          name, code, description,
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
      return NextResponse.json(updated);
    }

    if (segment1 === "measures") {
      const { name, code, description, budget, status, programIds, priorityIds } = body;
      const updated = await prisma.measure.update({
        where: { id },
        data: {
          name, code, description,
          budget: budget !== undefined ? (budget ? parseFloat(budget) : null) : undefined,
          status,
          programs: programIds ? { set: programIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
          priorities: priorityIds ? { set: priorityIds.map((id: any) => ({ id: parseInt(id) })) } : undefined
        }
      });
      return NextResponse.json(updated);
    }

    if (segment1 === "initiatives") {
      const { name, code, description, leadOrganizationId, startDate, endDate, status, priorityIds, ecosystemIds, filiereIds, territoryIds, serviceIds } = body;
      const updated = await prisma.initiative.update({
        where: { id },
        data: {
          name, code, description,
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
      return NextResponse.json(updated);
    }

    if (segment1 === "beneficiary-engagements") {
      const { title, objective, status, startDate, endDate, initiativeId, ecosystemId, territoryId, filiereIds } = body;
      const updated = await prisma.beneficiaryEngagement.update({
        where: { id },
        data: {
          title, objective, status,
          startDate: startDate ? new Date(startDate) : undefined,
          endDate: endDate !== undefined ? (endDate ? new Date(endDate) : null) : undefined,
          initiativeId: initiativeId !== undefined ? (initiativeId ? parseInt(initiativeId) : null) : undefined,
          ecosystemId: ecosystemId !== undefined ? (ecosystemId ? parseInt(ecosystemId) : null) : undefined,
          territoryId: territoryId !== undefined ? (territoryId ? parseInt(territoryId) : null) : undefined,
          filieresS3: filiereIds ? { set: filiereIds.map((id: any) => ({ id: parseInt(id) })) } : undefined
        },
        include: { beneficiary: true, initiative: true }
      });
      return NextResponse.json(updated);
    }

    if (segment1 === "impacts") {
      const { numericValue, textValue, territoryId, valueChainId, date, evidence } = body;
      const updated = await prisma.impact.update({
        where: { id },
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
      return NextResponse.json(updated);
    }

    return NextResponse.json({ error: "Route non trouvée" }, { status: 404 });
  } catch (err: any) {
    console.error("PATCH API Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// --- DELETE HANDLER ---
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  const segment1 = path[0];
  const segment2 = path[1];
  clearCache();

  if (!segment2) {
    return NextResponse.json({ error: "ID requis pour suppression" }, { status: 400 });
  }
  const id = parseInt(segment2);
  if (isNaN(id)) return NextResponse.json({ error: "ID invalide" }, { status: 400 });

  try {
    if (segment1 === "journeys") {
      // stages are automatically deleted due to onDelete: Cascade on JourneyStage
      await prisma.journey.delete({
        where: { id }
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Route non trouvée" }, { status: 404 });
  } catch (err: any) {
    console.error("DELETE API Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// --- HELPER FUNCTION: RECOMMENDER ALGORITHM ---
async function getRecommendations(beneficiaryId: number) {
  const beneficiary = await prisma.beneficiary.findUnique({
    where: { id: beneficiaryId },
    include: {
      primaryNaceSector: true, challenges: true, filieresS3: true,
      stages: true, needs: true, deliveries: { include: { service: true } }
    },
  });

  if (!beneficiary) throw new Error("Bénéficiaire non trouvé");

  const beneficiaryChallengeIds = beneficiary.challenges.map(c => c.id);
  const beneficiaryFiliereIds = beneficiary.filieresS3.map(f => f.id);
  const beneficiaryStageIds = beneficiary.stages.map(s => s.id);
  const expressedNeedIds = beneficiary.needs.map(n => n.id);
  const consumedServiceIds = beneficiary.deliveries.filter(d => d.status === 'COMPLETED').map(d => d.serviceId);

  const evaluateRule = (rule: any, b: any): boolean => {
    if (!rule || !rule.conditions || !Array.isArray(rule.conditions)) return false;
    const operator = rule.operator || 'AND';
    const results = rule.conditions.map((cond: any) => {
      const { field, operator: condOp, value } = cond;
      let bValue: any = b[field];
      if (field === 'sector' && b.primaryNaceSector) bValue = b.primaryNaceSector.name;
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

  const allNeeds = await prisma.businessNeed.findMany({
    include: {
      valueChains: true, valueChainStages: true,
      services: { include: { organization: true, challenges: true, filieresS3: true } },
      journeys: { include: { stages: { include: { services: true } } } }
    }
  });

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
    const hasVc = need.valueChains.some(vc => beneficiaryFiliereIds.includes(vc.id));
    const hasStage = need.valueChainStages.some(st => beneficiaryStageIds.includes(st.id));
    return hasVc && hasStage;
  });

  const recommendedServices: any[] = [];
  const serviceSet = new Set<number>();

  for (const need of matchedNeeds) {
    for (const service of need.services) {
      if (!serviceSet.has(service.id)) {
        serviceSet.add(service.id);
        recommendedServices.push({
          id: service.id, name: service.name, code: service.code, uri: service.uri,
          organization: service.organization, challenges: service.challenges, filieresS3: service.filieresS3,
          matchedReason: `Répond à votre besoin : "${need.name}"`
        });
      }
    }
  }

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
          id: service.id, name: service.name, code: service.code, uri: service.uri,
          organization: service.organization, challenges: service.challenges, filieresS3: service.filieresS3,
          matchedReason: matchesChallenge
            ? `Recommandé pour votre défi : "${service.challenges.find(c => beneficiaryChallengeIds.includes(c.id))?.name}"`
            : `Recommandé pour votre filière S3 : "${service.filieresS3.find(f => beneficiaryFiliereIds.includes(f.id))?.name}"`
        });
      }
    }
  }

  const recommendedJourneys: any[] = [];
  const allJourneys = await prisma.journey.findMany({
    include: {
      challenges: true, filieresS3: true,
      stages: { orderBy: { position: 'asc' }, include: { services: { include: { organization: true } } } }
    }
  });

  for (const journey of allJourneys) {
    const matchChallenge = journey.challenges.some(c => beneficiaryChallengeIds.includes(c.id));
    const matchFiliere = journey.filieresS3.some(f => beneficiaryFiliereIds.includes(f.id));
    if (matchChallenge || matchFiliere) {
      recommendedJourneys.push({
        id: journey.id, name: journey.name, provider: journey.provider, objective: journey.objective, description: journey.description,
        stages: journey.stages,
        matchedReason: matchChallenge
          ? `Parcours aligné avec le défi : "${journey.challenges.find(c => beneficiaryChallengeIds.includes(c.id))?.name}"`
          : `Parcours aligné avec la filière : "${journey.filieresS3.find(f => beneficiaryFiliereIds.includes(f.id))?.name}"`
      });
    }
  }

  const recommendedEcosystems: any[] = [];
  const allEcosystems = await prisma.ecosystem.findMany({
    include: { actors: true, filieresS3: true, challenges: true }
  });

  for (const eco of allEcosystems) {
    const matchFiliere = eco.filieresS3.some(f => beneficiaryFiliereIds.includes(f.id));
    const matchChallenge = eco.challenges.some(c => beneficiaryChallengeIds.includes(c.id));
    if (matchFiliere || matchChallenge) {
      recommendedEcosystems.push({
        id: eco.id, name: eco.name, description: eco.description, mission: eco.mission, actors: eco.actors,
        matchedReason: matchFiliere
          ? `Hub régional couvrant la filière : "${eco.filieresS3.find(f => beneficiaryFiliereIds.includes(f.id))?.name}"`
          : `Hub régional adressant le défi : "${eco.challenges.find(c => beneficiaryChallengeIds.includes(c.id))?.name}"`
      });
    }
  }

  const recommendedActors: any[] = [];
  const actorSet = new Set<number>();
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

  return {
    beneficiary,
    matchedNeeds: matchedNeeds.map(n => ({ id: n.id, name: n.name, description: n.description })),
    recommendedServices: recommendedServices.filter(s => !consumedServiceIds.includes(s.id)),
    recommendedJourneys,
    recommendedEcosystems,
    recommendedActors
  };
}

// --- HELPER FUNCTION: GRAPH GENERATOR ---
async function generateGraphData() {
  const [
    beneficiaries, services, journeys, ecosystems, organizations,
    challenges, valueChains, datasets, knowledgeAssets, eventResources,
    actionInstances, strategies, strategicPriorities, programs, measures,
    initiatives, beneficiaryEngagements, outcomeIndicators, impacts,
    fundingInstruments, territories, projects, objectives,
    transformationDimensions, strategicDomainDimensions, capabilityDimensions,
    impactDimensions, knowledgeDimensions, dataQualityDimensions
  ] = await Promise.all([
    prisma.beneficiary.findMany({ include: { challenges: true, filieresS3: true, stages: true, needs: true, enrolledJourneys: true, deliveries: true } }),
    prisma.publicService.findMany({ include: { organization: true, challenges: true, filieresS3: true, stages: true, initiatives: true } }),
    prisma.journey.findMany({ include: { challenges: true, filieresS3: true, stages: { include: { services: true } } } }),
    prisma.ecosystem.findMany({ include: { actors: true, services: true, journeys: true, filieresS3: true, territories: true } }),
    prisma.organization.findMany(),
    prisma.businessChallenge.findMany(),
    prisma.strategicValueChain.findMany(),
    prisma.dataset.findMany(),
    prisma.knowledgeAsset.findMany({ include: { publicServices: true, ecosystems: true, eventResources: true, programs: true, initiatives: true } }),
    prisma.eventResource.findMany({ include: { ecosystems: true, publicServices: true } }),
    prisma.actionInstance.findMany({ include: { deliveries: true } }),
    prisma.strategy.findMany({ include: { priorities: true, ownerOrganization: true } }),
    prisma.strategicPriority.findMany({ include: { strategy: true, programs: true, measures: true, initiatives: true } }),
    prisma.program.findMany({ include: { strategies: true, priorities: true, measures: true, territories: true } }),
    prisma.measure.findMany({ include: { programs: true, initiatives: true } }),
    prisma.initiative.findMany({ include: { measure: true, leadOrganization: true, publicServices: true, territories: true } }),
    prisma.beneficiaryEngagement.findMany({ include: { beneficiary: true, initiative: true, ecosystem: true, territory: true, filieresS3: true } }),
    prisma.outcomeIndicator.findMany(),
    prisma.impact.findMany({ include: { beneficiary: true, indicator: true, territory: true, valueChain: true } }),
    prisma.fundingInstrument.findMany({ include: { strategies: true, programs: true, measures: true, initiatives: true, services: true, beneficiaries: true } }),
    prisma.territory.findMany({ include: { parentTerritory: true } }),
    prisma.project.findMany({ include: { program: true, initiative: true, actions: true, organizations: true, ecosystems: true } }),
    prisma.objective.findMany({ include: { strategy: true, parent: true, children: true, indicators: true } }),
    prisma.transformationDimension.findMany({ include: { organizations: true, programs: true, projects: true, actionInstances: true, services: true, ecosystems: true, deliveries: true } }),
    prisma.strategicDomainDimension.findMany({ include: { parent: true, children: true, valueChains: true, organizations: true, programs: true, projects: true, services: true } }),
    prisma.capabilityDimension.findMany({ include: { services: true, programs: true, projects: true, actionInstances: true, organizations: true, ecosystems: true, datasets: true, knowledgeAssets: true } }),
    prisma.impactDimension.findMany({ include: { impacts: true, services: true, programs: true, projects: true, organizations: true, ecosystems: true, datasets: true, knowledgeAssets: true } }),
    prisma.knowledgeDimension.findMany({ include: { datasets: true, knowledgeAssets: true, services: true, projects: true, organizations: true, programs: true } }),
    prisma.dataQualityDimension.findMany()
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

  for (const b of beneficiaries) {
    const bId = `beneficiary-${b.id}`;
    addNode(bId, b.name, 'beneficiary', { size: b.size, province: b.province, location: b.location });
    for (const ch of b.challenges) addEdge(bId, `challenge-${ch.id}`, 'ADRESSE');
    for (const f of b.filieresS3) addEdge(bId, `valuechain-${f.id}`, 'APPARTIENT_A');
    for (const st of b.enrolledJourneys) addEdge(bId, `journey-${st.id}`, 'PARTICIPE_A');
    for (const del of b.deliveries) {
      if (del.status === 'COMPLETED') addEdge(bId, `service-${del.serviceId}`, 'UTILISE');
    }
    if (b.territoryId) addEdge(bId, `territory-${b.territoryId}`, 'SITUE_DANS');
  }

  for (const s of services) {
    const sId = `service-${s.id}`;
    addNode(sId, s.name, 'service', { code: s.code });
    if (s.organization) {
      const orgId = `org-${s.organization.id}`;
      addNode(orgId, s.organization.name, 'organization', { type: s.organization.type });
      addEdge(orgId, sId, 'PROPOSE');
    }
    for (const ch of s.challenges) addEdge(sId, `challenge-${ch.id}`, 'ADRESSE');
    for (const f of s.filieresS3) addEdge(sId, `valuechain-${f.id}`, 'APPARTIENT_A');
  }

  for (const ch of challenges) addNode(`challenge-${ch.id}`, ch.name, 'challenge');
  for (const f of valueChains) addNode(`valuechain-${f.id}`, f.name, 'valuechain');

  for (const j of journeys) {
    const jId = `journey-${j.id}`;
    addNode(jId, j.name, 'journey');
    for (const ch of j.challenges) addEdge(jId, `challenge-${ch.id}`, 'ADRESSE');
    for (const f of j.filieresS3) addEdge(jId, `valuechain-${f.id}`, 'APPARTIENT_A');
    for (const stage of j.stages) {
      const stageNodeId = `journey-stage-${stage.id}`;
      addNode(stageNodeId, `${stage.position}. ${stage.name}`, 'journeystage');
      addEdge(stageNodeId, jId, 'FAIT_PARTIE_DE');
      for (const s of stage.services) addEdge(`service-${s.id}`, stageNodeId, 'FAIT_PARTIE_DE');
    }
  }

  for (const e of ecosystems) {
    const eId = `ecosystem-${e.id}`;
    addNode(eId, e.name, 'ecosystem');
    for (const a of e.actors) addEdge(`org-${a.id}`, eId, 'APPARTIENT_A');
    for (const s of e.services) addEdge(eId, `service-${s.id}`, 'PROPOSE');
    for (const j of e.journeys) addEdge(eId, `journey-${j.id}`, 'PROPOSE');
    for (const f of e.filieresS3) addEdge(eId, `valuechain-${f.id}`, 'APPARTIENT_A');
    for (const t of e.territories) addEdge(eId, `territory-${t.id}`, 'COUVERTURE_TERRITORIALE');
  }

  for (const d of datasets) {
    const dId = `dataset-${d.id}`;
    addNode(dId, d.title, 'dataset', { qualityScore: d.qualityScore, updateFrequency: d.updateFrequency });
    addEdge(`org-${d.ownerOrganizationId}`, dId, 'PRODUIT');
  }

  for (const ka of knowledgeAssets) {
    const kaId = `knowledgeasset-${ka.id}`;
    addNode(kaId, ka.title, 'knowledgeasset', { type: ka.type, url: ka.url });
    for (const s of ka.publicServices) addEdge(kaId, `service-${s.id}`, 'DOCUMENTE');
    for (const eco of ka.ecosystems) addEdge(kaId, `ecosystem-${eco.id}`, 'RATTACHE_A');
    for (const evt of ka.eventResources) addEdge(kaId, `event-${evt.id}`, 'PRODUIT_PAR');
    for (const prog of ka.programs) addEdge(kaId, `program-${prog.id}`, 'DOCUMENTE_PROGRAMME');
    for (const init of ka.initiatives) addEdge(kaId, `initiative-${init.id}`, 'DOCUMENTE_INITIATIVE');
  }

  for (const er of eventResources) {
    const erId = `event-${er.id}`;
    addNode(erId, er.title, 'eventresource', { type: er.type, location: er.location, startDate: er.startDate });
    for (const s of er.publicServices) addEdge(`service-${s.id}`, erId, 'MOBILISE');
    for (const eco of er.ecosystems) addEdge(`ecosystem-${eco.id}`, erId, 'PORTE');
  }

  for (const ai of actionInstances) {
    const aiId = `actioninstance-${ai.id}`;
    addNode(aiId, ai.title, 'actioninstance', { status: ai.status, objective: ai.objective });
    addEdge(`beneficiary-${ai.beneficiaryId}`, aiId, 'ENGAGE_DANS');
    if (ai.journeyId) addEdge(aiId, `journey-${ai.journeyId}`, 'REALISE_DANS');
    if (ai.ecosystemId) addEdge(aiId, `ecosystem-${ai.ecosystemId}`, 'ACCOMPAGNE_PAR');
    for (const del of ai.deliveries) addEdge(aiId, `service-${del.serviceId}`, 'CONTIENT_SERVICE');
  }

  for (const st of strategies) {
    const stId = `strategy-${st.id}`;
    addNode(stId, st.name, 'strategy', { code: st.code, status: st.status });
    if (st.ownerOrganizationId) addEdge(stId, `org-${st.ownerOrganizationId}`, 'PORTE_PAR');
  }

  for (const p of strategicPriorities) {
    const pId = `priority-${p.id}`;
    addNode(pId, p.name, 'strategicpriority', { code: p.code });
    addEdge(pId, `strategy-${p.strategyId}`, 'CONTIENT_PRIORITE');
    for (const prog of p.programs) addEdge(pId, `program-${prog.id}`, 'PREVOIT_PROGRAMME');
  }

  for (const prog of programs) {
    const progId = `program-${prog.id}`;
    addNode(progId, prog.name, 'program', { code: prog.code, budget: prog.budget, status: prog.status });
    for (const strat of prog.strategies) addEdge(progId, `strategy-${strat.id}`, 'APPARTIENT_A');
    for (const prio of prog.priorities) addEdge(progId, `priority-${prio.id}`, 'APPARTIENT_A');
    for (const t of prog.territories) addEdge(progId, `territory-${t.id}`, 'COUVERTURE_TERRITORIALE');
  }

  for (const m of measures) {
    const mId = `measure-${m.id}`;
    addNode(mId, m.name, 'measure', { code: m.code, budget: m.budget });
    for (const prog of m.programs) addEdge(`program-${prog.id}`, mId, 'CONTIENT_MESURE');
  }

  for (const init of initiatives) {
    const initId = `initiative-${init.id}`;
    addNode(initId, init.name, 'initiative', { code: init.code, status: init.status });
    addEdge(initId, `measure-${init.measureId}`, 'CONTIENT_INITIATIVE');
    if (init.leadOrganizationId) addEdge(initId, `org-${init.leadOrganizationId}`, 'PILOTE_PAR');
    for (const s of init.publicServices) addEdge(initId, `service-${s.id}`, 'SOUTIENT_SERVICE');
    for (const t of init.territories) addEdge(initId, `territory-${t.id}`, 'COUVERTURE_TERRITORIALE');
  }

  for (const t of territories) {
    const tId = `territory-${t.id}`;
    addNode(tId, t.name, 'territory', { code: t.code, type: t.type });
    if (t.parentTerritoryId) addEdge(tId, `territory-${t.parentTerritoryId}`, 'SOUS_TERRITOIRE_DE');
  }

  for (const eng of beneficiaryEngagements) {
    const engId = `engagement-${eng.id}`;
    addNode(engId, eng.title, 'beneficiaryengagement', { status: eng.status, objective: eng.objective });
    addEdge(`beneficiary-${eng.beneficiaryId}`, engId, 'ENGAGE_BENEFICIAIRE');
    if (eng.initiativeId) addEdge(engId, `initiative-${eng.initiativeId}`, 'REALISE_INITIATIVE');
    if (eng.ecosystemId) addEdge(engId, `ecosystem-${eng.ecosystemId}`, 'ACCOMPAGNE_PAR');
    if (eng.territoryId) addEdge(engId, `territory-${eng.territoryId}`, 'SITUE_DANS');
  }

  for (const ind of outcomeIndicators) {
    addNode(`indicator-${ind.id}`, ind.name, 'outcomeindicator', { unit: ind.unit });
  }

  for (const imp of impacts) {
    const impId = `impact-${imp.id}`;
    const label = imp.numericValue !== null ? `${imp.numericValue} ${imp.indicator.unit}` : (imp.textValue || 'Impact');
    addNode(impId, label, 'impact', { textValue: imp.textValue, numericValue: imp.numericValue });
    addEdge(impId, `beneficiary-${imp.beneficiaryId}`, 'CONSTATE_SUR');
    addEdge(impId, `indicator-${imp.indicatorId}`, 'MESURE_PAR');
    if (imp.territoryId) addEdge(impId, `territory-${imp.territoryId}`, 'LIE_AU_TERRITOIRE');
    if (imp.valueChainId) addEdge(impId, `valuechain-${imp.valueChainId}`, 'ORIENTE_FILIERE');
  }

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

  // v7.0 Transversal Dimensions and Core Entities in Graph
  for (const proj of projects) {
    const projId = `project-${proj.id}`;
    addNode(projId, proj.name, 'project', { code: proj.code, status: proj.status });
    if (proj.programId) addEdge(projId, `program-${proj.programId}`, 'APPARTIENT_A');
    if (proj.initiativeId) addEdge(projId, `initiative-${proj.initiativeId}`, 'APPARTIENT_A');
    for (const org of proj.organizations) addEdge(`org-${org.id}`, projId, 'CONTRIBUE_A');
    for (const eco of proj.ecosystems) addEdge(projId, `ecosystem-${eco.id}`, 'RATTACHE_A');
  }

  for (const obj of objectives) {
    const objId = `objective-${obj.id}`;
    addNode(objId, obj.name, 'objective', { code: obj.code });
    if (obj.strategyId) addEdge(objId, `strategy-${obj.strategyId}`, 'SOUTIENT_STRATEGIE');
    if (obj.parentId) addEdge(objId, `objective-${obj.parentId}`, 'SOUS_OBJECTIF_DE');
  }

  for (const td of transformationDimensions) {
    const tdId = `transformation-${td.id}`;
    addNode(tdId, td.name, 'transformation', { code: td.code });
    for (const s of td.services) addEdge(`service-${s.id}`, tdId, 'AXE_TRANSFORMATION');
    for (const p of td.programs) addEdge(`program-${p.id}`, tdId, 'AXE_TRANSFORMATION');
    for (const proj of td.projects) addEdge(`project-${proj.id}`, tdId, 'AXE_TRANSFORMATION');
    for (const eco of td.ecosystems) addEdge(`ecosystem-${eco.id}`, tdId, 'AXE_TRANSFORMATION');
    for (const act of td.actionInstances) addEdge(`actioninstance-${act.id}`, tdId, 'AXE_TRANSFORMATION');
  }

  for (const sd of strategicDomainDimensions) {
    const sdId = `strategicdomain-${sd.id}`;
    addNode(sdId, sd.name, 'strategicdomain', { code: sd.code, level: sd.level });
    if (sd.parentId) addEdge(sdId, `strategicdomain-${sd.parentId}`, 'SOUS_DOMAINE_DE');
    for (const vc of sd.valueChains) addEdge(`valuechain-${vc.id}`, sdId, 'MAPPING_S3');
    for (const s of sd.services) addEdge(`service-${s.id}`, sdId, 'ALIGNEMENT_S3');
    for (const p of sd.programs) addEdge(`program-${p.id}`, sdId, 'ALIGNEMENT_S3');
    for (const proj of sd.projects) addEdge(`project-${proj.id}`, sdId, 'ALIGNEMENT_S3');
  }

  for (const cap of capabilityDimensions) {
    const capId = `capability-${cap.id}`;
    addNode(capId, cap.name, 'capability', { code: cap.code });
    for (const s of cap.services) addEdge(`service-${s.id}`, capId, 'REQUIS_CAPABILITE');
    for (const p of cap.programs) addEdge(`program-${p.id}`, capId, 'REQUIS_CAPABILITE');
    for (const proj of cap.projects) addEdge(`project-${proj.id}`, capId, 'DEVELOPPE_CAPABILITE');
    for (const act of cap.actionInstances) addEdge(`actioninstance-${act.id}`, capId, 'DEVELOPPE_CAPABILITE');
    for (const d of cap.datasets) addEdge(`dataset-${d.id}`, capId, 'DONNEE_CAPABILITE');
    for (const ka of cap.knowledgeAssets) addEdge(`knowledgeasset-${ka.id}`, capId, 'CONNAISSANCE_CAPABILITE');
  }

  for (const idim of impactDimensions) {
    const idimId = `impactdimension-${idim.id}`;
    addNode(idimId, idim.name, 'impactdimension', { code: idim.code, category: idim.category });
    for (const imp of idim.impacts) addEdge(`impact-${imp.id}`, idimId, 'CATEGORIE_IMPACT');
    for (const s of idim.services) addEdge(`service-${s.id}`, idimId, 'VISE_IMPACT');
    for (const p of idim.programs) addEdge(`program-${p.id}`, idimId, 'VISE_IMPACT');
    for (const proj of idim.projects) addEdge(`project-${proj.id}`, idimId, 'VISE_IMPACT');
  }

  for (const kd of knowledgeDimensions) {
    const kdId = `knowledgedimension-${kd.id}`;
    addNode(kdId, kd.name, 'knowledgedimension', { code: kd.code });
    for (const d of kd.datasets) addEdge(`dataset-${d.id}`, kdId, 'KNOWLEDGE_TYPE');
    for (const ka of kd.knowledgeAssets) addEdge(`knowledgeasset-${ka.id}`, kdId, 'KNOWLEDGE_TYPE');
    for (const s of kd.services) addEdge(`service-${s.id}`, kdId, 'KNOWLEDGE_TYPE');
  }

  for (const dq of dataQualityDimensions) {
    const dqId = `dataquality-${dq.id}`;
    const label = `Score: ${(dq.overallScore * 100).toFixed(0)}%`;
    addNode(dqId, label, 'dataquality', { score: dq.overallScore });
    if (dq.datasetId) addEdge(`dataset-${dq.datasetId}`, dqId, 'QUALITE_DONNEES');
    if (dq.knowledgeAssetId) addEdge(`knowledgeasset-${dq.knowledgeAssetId}`, dqId, 'QUALITE_DONNEES');
    if (dq.indicatorId) addEdge(`indicator-${dq.indicatorId}`, dqId, 'QUALITE_DONNEES');
  }

  return { nodes, edges };
}

// --- HELPER FUNCTION: PILOTAGE DATA ---
async function getPilotageData(filiereId?: number, territoryId?: number) {
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
    strategiesCount, programsCount, measuresCount, initiativesCount,
    totalBudgetAgg, beneficiariesCount, impactsCount, allImpacts,
    allBeneficiaries, allValueChains, allIndicators
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

  return {
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
}

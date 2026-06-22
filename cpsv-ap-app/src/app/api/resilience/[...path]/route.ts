// cpsv-ap-app/src/app/api/resilience/[...path]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { RESILIENCE_INCLUDES } from "@/lib/resilienceIncludeStrategy";
import { RESILIENCE_VALIDATIONS } from "@/lib/resilienceValidation";

const SOFT_DELETE_MODELS = [
  "risk-registers",
  "risks",
  "scenarios",
  "risk-assessments",
  "resilience-profiles"
];

const RELATION_MAPS: Record<string, Record<string, string>> = {
  "risks": {
    "organizationIds": "organizations",
    "territoryIds": "territories",
    "filiereIds": "filieres",
    "valueChainIds": "valueChains",
    "ecosystemIds": "ecosystems",
    "assetIds": "assets",
    "challengeIds": "territorialChallenges"
  },
  "risk-assessments": {
    "policyEvidenceIds": "policyEvidences"
  },
  "resilience-impacts": {
    "resilienceMeasureIds": "resilienceMeasures"
  },
  "resilience-measures": {
    "resilienceImpactIds": "resilienceImpacts"
  },
  "dependencies": {
    "organizationIds": "organizations",
    "filiereIds": "filieres",
    "valueChainIds": "valueChains",
    "assetIds": "assets"
  },
  "critical-infrastructures": {
    "dependencyIds": "dependencies",
    "territoryIds": "territories"
  },
  "vulnerabilities": {
    "organizationIds": "organizations",
    "filiereIds": "filieres",
    "assetIds": "assets"
  },
  "territorial-assets": {
    "riskIds": "risks",
    "dependencyIds": "dependencies",
    "vulnerabilityIds": "vulnerabilities"
  }
};

function getModelDelegate(segment: string): any {
  switch (segment) {
    case "risk-registers": return prisma.riskRegister;
    case "risks": return prisma.risk;
    case "threats": return prisma.threat;
    case "hazards": return prisma.hazard;
    case "scenarios": return prisma.scenario;
    case "risk-assessments": return prisma.riskAssessment;
    case "resilience-impacts": return prisma.resilienceImpact;
    case "resilience-measures": return prisma.resilienceMeasure;
    case "resilience-profiles": return prisma.resilienceProfile;
    case "dependencies": return prisma.dependency;
    case "critical-infrastructures": return prisma.criticalInfrastructure;
    case "vulnerabilities": return prisma.vulnerability;
    case "territorial-assets": return prisma.territorialAsset;
    default: return null;
  }
}

function getModelName(segment: string): string {
  switch (segment) {
    case "risk-registers": return "RiskRegister";
    case "risks": return "Risk";
    case "threats": return "Threat";
    case "hazards": return "Hazard";
    case "scenarios": return "Scenario";
    case "risk-assessments": return "RiskAssessment";
    case "resilience-impacts": return "ResilienceImpact";
    case "resilience-measures": return "ResilienceMeasure";
    case "resilience-profiles": return "ResilienceProfile";
    case "dependencies": return "Dependency";
    case "critical-infrastructures": return "CriticalInfrastructure";
    case "vulnerabilities": return "Vulnerability";
    case "territorial-assets": return "TerritorialAsset";
    default: return "";
  }
}

async function writeAuditLog(
  entityType: string,
  entityId: number,
  action: "CREATE" | "UPDATE" | "DELETE" | "RESTORE",
  userId: string | null,
  beforeValue: any = null,
  afterValue: any = null
) {
  try {
    await prisma.resilienceAuditLog.create({
      data: {
        entityType,
        entityId,
        action,
        userId,
        beforeValue: beforeValue ? JSON.parse(JSON.stringify(beforeValue)) : null,
        afterValue: afterValue ? JSON.parse(JSON.stringify(afterValue)) : null,
      }
    });
  } catch (err) {
    console.error("Failed to write audit log:", err);
  }
}

function buildPrismaData(modelKey: string, body: any, isUpdate = false) {
  const data: any = {};
  const relMap = RELATION_MAPS[modelKey] || {};

  for (const [key, value] of Object.entries(body)) {
    if (relMap[key]) {
      const relationName = relMap[key];
      if (Array.isArray(value)) {
        if (isUpdate) {
          data[relationName] = {
            set: value.map((id: any) => ({ id: parseInt(id) }))
          };
        } else {
          data[relationName] = {
            connect: value.map((id: any) => ({ id: parseInt(id) }))
          };
        }
      }
    } else {
      data[key] = value;
    }
  }
  return data;
}

// --- GET HANDLER ---
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  const segment1 = path[0];
  const segment2 = path[1];
  const searchParams = request.nextUrl.searchParams;

  const modelDelegate = getModelDelegate(segment1);
  if (!modelDelegate) {
    return NextResponse.json({ error: "Route non trouvée" }, { status: 404 });
  }

  try {
    if (segment2) {
      const id = parseInt(segment2);
      if (isNaN(id)) {
        return NextResponse.json({ error: "ID de ressource invalide" }, { status: 400 });
      }

      const item = await modelDelegate.findUnique({
        where: { id },
        include: RESILIENCE_INCLUDES[segment1] || undefined,
      });

      if (!item || (SOFT_DELETE_MODELS.includes(segment1) && !item.isActive)) {
        return NextResponse.json({ error: "Ressource non trouvée" }, { status: 404 });
      }

      return NextResponse.json(item);
    } else {
      const where: any = {};
      
      if (SOFT_DELETE_MODELS.includes(segment1)) {
        const includeInactive = searchParams.get("includeInactive") === "true";
        if (!includeInactive) {
          where.isActive = true;
        }
      }

      searchParams.forEach((value, key) => {
        if (key === "includeInactive") return;
        const numValue = parseInt(value);
        if (!isNaN(numValue) && String(numValue) === value) {
          where[key] = numValue;
        } else if (value === "true") {
          where[key] = true;
        } else if (value === "false") {
          where[key] = false;
        } else {
          where[key] = value;
        }
      });

      const items = await modelDelegate.findMany({
        where,
        include: RESILIENCE_INCLUDES[segment1] || undefined,
      });

      return NextResponse.json(items);
    }
  } catch (err: any) {
    console.error(`GET resilience/${segment1} error:`, err);
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

  const modelDelegate = getModelDelegate(segment1);
  const validationSchema = RESILIENCE_VALIDATIONS[segment1];
  
  if (!modelDelegate || !validationSchema) {
    return NextResponse.json({ error: "Route non trouvée" }, { status: 404 });
  }

  try {
    const body = await request.json();
    const validationResult = validationSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error.format() }, { status: 400 });
    }

    const parsedBody = validationResult.data;

    // Calculs automatiques pour ResilienceProfile
    if (segment1 === "resilience-profiles") {
      const exposure = (parsedBody.exposure !== undefined && parsedBody.exposure !== null ? parsedBody.exposure : 5.0) as number;
      const sensitivity = (parsedBody.sensitivity !== undefined && parsedBody.sensitivity !== null ? parsedBody.sensitivity : 5.0) as number;
      if (parsedBody.vulnerability === undefined || parsedBody.vulnerability === null) {
        parsedBody.vulnerability = (exposure + sensitivity) / 2;
      }

      const absorptionCapacity = (parsedBody.absorptionCapacity !== undefined && parsedBody.absorptionCapacity !== null ? parsedBody.absorptionCapacity : 5.0) as number;
      const adaptiveCapacity = (parsedBody.adaptiveCapacity !== undefined && parsedBody.adaptiveCapacity !== null ? parsedBody.adaptiveCapacity : 5.0) as number;
      const recoveryCapacity = (parsedBody.recoveryCapacity !== undefined && parsedBody.recoveryCapacity !== null ? parsedBody.recoveryCapacity : 5.0) as number;
      if (parsedBody.overallResilience === undefined || parsedBody.overallResilience === null) {
        parsedBody.overallResilience = (absorptionCapacity + adaptiveCapacity + recoveryCapacity) / 3;
      }
    }

    // Calculs automatiques pour Risk
    if (segment1 === "risks") {
      const severity = (parsedBody.severity !== undefined && parsedBody.severity !== null ? parsedBody.severity : 3) as number;
      const likelihood = (parsedBody.likelihood !== undefined && parsedBody.likelihood !== null ? parsedBody.likelihood : 3) as number;
      if (parsedBody.riskScore === undefined || parsedBody.riskScore === null) {
        parsedBody.riskScore = severity * likelihood;
      }
    }

    const data = buildPrismaData(segment1, parsedBody, false);
    const newItem = await modelDelegate.create({
      data,
      include: RESILIENCE_INCLUDES[segment1] || undefined,
    });

    const userRole = request.headers.get("x-user-role") || "anonymous";
    await writeAuditLog(
      getModelName(segment1),
      newItem.id,
      "CREATE",
      userRole,
      null,
      newItem
    );

    return NextResponse.json(newItem, { status: 201 });
  } catch (err: any) {
    console.error(`POST resilience/${segment1} error:`, err);
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

  const modelDelegate = getModelDelegate(segment1);
  const validationSchema = RESILIENCE_VALIDATIONS[segment1];

  if (!modelDelegate || !validationSchema || !segment2) {
    return NextResponse.json({ error: "Route non trouvée" }, { status: 404 });
  }

  const id = parseInt(segment2);
  if (isNaN(id)) {
    return NextResponse.json({ error: "ID de ressource invalide" }, { status: 400 });
  }

  try {
    const existing = await modelDelegate.findUnique({ where: { id } });
    if (!existing || (SOFT_DELETE_MODELS.includes(segment1) && !existing.isActive)) {
      return NextResponse.json({ error: "Ressource non trouvée" }, { status: 404 });
    }

    const body = await request.json();
    const partialSchema = validationSchema.partial();
    const validationResult = partialSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({ error: validationResult.error.format() }, { status: 400 });
    }

    const parsedBody = validationResult.data;

    // Calculs automatiques pour ResilienceProfile
    if (segment1 === "resilience-profiles") {
      const exposure = (parsedBody.exposure !== undefined && parsedBody.exposure !== null ? parsedBody.exposure : existing.exposure) as number;
      const sensitivity = (parsedBody.sensitivity !== undefined && parsedBody.sensitivity !== null ? parsedBody.sensitivity : existing.sensitivity) as number;
      if (parsedBody.exposure !== undefined || parsedBody.sensitivity !== undefined) {
        if (parsedBody.vulnerability === undefined || parsedBody.vulnerability === null) {
          parsedBody.vulnerability = (exposure + sensitivity) / 2;
        }
      }

      const absorptionCapacity = (parsedBody.absorptionCapacity !== undefined && parsedBody.absorptionCapacity !== null ? parsedBody.absorptionCapacity : existing.absorptionCapacity) as number;
      const adaptiveCapacity = (parsedBody.adaptiveCapacity !== undefined && parsedBody.adaptiveCapacity !== null ? parsedBody.adaptiveCapacity : existing.adaptiveCapacity) as number;
      const recoveryCapacity = (parsedBody.recoveryCapacity !== undefined && parsedBody.recoveryCapacity !== null ? parsedBody.recoveryCapacity : existing.recoveryCapacity) as number;
      if (parsedBody.absorptionCapacity !== undefined || parsedBody.adaptiveCapacity !== undefined || parsedBody.recoveryCapacity !== undefined) {
        if (parsedBody.overallResilience === undefined || parsedBody.overallResilience === null) {
          parsedBody.overallResilience = (absorptionCapacity + adaptiveCapacity + recoveryCapacity) / 3;
        }
      }
    }

    // Calculs automatiques pour Risk
    if (segment1 === "risks") {
      const severity = (parsedBody.severity !== undefined && parsedBody.severity !== null ? parsedBody.severity : existing.severity) as number;
      const likelihood = (parsedBody.likelihood !== undefined && parsedBody.likelihood !== null ? parsedBody.likelihood : existing.likelihood) as number;
      if (parsedBody.severity !== undefined || parsedBody.likelihood !== undefined) {
        parsedBody.riskScore = severity * likelihood;
      }
    }

    const data = buildPrismaData(segment1, parsedBody, true);
    const updatedItem = await modelDelegate.update({
      where: { id },
      data,
      include: RESILIENCE_INCLUDES[segment1] || undefined,
    });

    const userRole = request.headers.get("x-user-role") || "anonymous";
    await writeAuditLog(
      getModelName(segment1),
      id,
      "UPDATE",
      userRole,
      existing,
      updatedItem
    );

    return NextResponse.json(updatedItem);
  } catch (err: any) {
    console.error(`PATCH resilience/${segment1} error:`, err);
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

  const modelDelegate = getModelDelegate(segment1);
  if (!modelDelegate || !segment2) {
    return NextResponse.json({ error: "Route non trouvée" }, { status: 404 });
  }

  const id = parseInt(segment2);
  if (isNaN(id)) {
    return NextResponse.json({ error: "ID de ressource invalide" }, { status: 400 });
  }

  try {
    const existing = await modelDelegate.findUnique({ where: { id } });
    if (!existing || (SOFT_DELETE_MODELS.includes(segment1) && !existing.isActive)) {
      return NextResponse.json({ error: "Ressource non trouvée" }, { status: 404 });
    }

    const userRole = request.headers.get("x-user-role") || "anonymous";

    if (SOFT_DELETE_MODELS.includes(segment1)) {
      // Soft Delete
      const deletedItem = await modelDelegate.update({
        where: { id },
        data: {
          isActive: false,
          deletedAt: new Date(),
          deletedBy: userRole,
        }
      });

      await writeAuditLog(
        getModelName(segment1),
        id,
        "DELETE",
        userRole,
        existing,
        deletedItem
      );
    } else {
      // Hard Delete
      await modelDelegate.delete({ where: { id } });

      await writeAuditLog(
        getModelName(segment1),
        id,
        "DELETE",
        userRole,
        existing,
        null
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error(`DELETE resilience/${segment1} error:`, err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

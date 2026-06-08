import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Rule evaluator for Besoin Builder dynamic rules
function evaluateRule(rule: any, company: any): boolean {
  if (!rule?.conditions || !Array.isArray(rule.conditions)) return false;
  const results = rule.conditions.map((cond: any) => {
    const compVal = company[cond.field];
    if (compVal === undefined || compVal === null) return false;
    switch (cond.operator) {
      case "==": return compVal == cond.value;
      case "!=": return compVal != cond.value;
      case "<": return compVal < cond.value;
      case ">": return compVal > cond.value;
      case "<=": return compVal <= cond.value;
      case ">=": return compVal >= cond.value;
      default: return false;
    }
  });
  return rule.operator === "OR" ? results.some(Boolean) : results.every(Boolean);
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ companyId: string }> }
) {
  try {
    const { companyId } = await params;
    const id = parseInt(companyId);
    if (isNaN(id)) return NextResponse.json({ error: "ID invalide" }, { status: 400 });

    const company = await prisma.company.findUnique({
      where: { id },
      include: { belongsToValueChain: true, participatesInStage: true, playsRole: true, needs: true },
    });
    if (!company) return NextResponse.json({ error: "Entreprise non trouvée" }, { status: 404 });

    const companyVcIds = company.belongsToValueChain.map((vc) => vc.id);
    const companyStageIds = company.participatesInStage.map((s) => s.id);
    const expressedNeedIds = company.needs.map((n) => n.id);

    const allNeeds = await prisma.businessNeed.findMany({
      include: {
        valueChains: true,
        valueChainStages: true,
        services: { include: { organization: true } },
        journeys: { include: { steps: { orderBy: { position: "asc" }, include: { service: true } } } },
      },
    });

    const matchedNeeds = allNeeds.filter((need) => {
      if (expressedNeedIds.includes(need.id)) return true;
      if (need.rule) {
        try {
          const ruleObj = typeof need.rule === "string" ? JSON.parse(need.rule) : need.rule;
          if (evaluateRule(ruleObj, company)) return true;
        } catch (_) {}
      }
      const hasVc = need.valueChains.some((vc) => companyVcIds.includes(vc.id));
      const hasStage = need.valueChainStages.some((st) => companyStageIds.includes(st.id));
      return hasVc && hasStage;
    });

    const serviceSet = new Set<number>();
    const journeySet = new Set<number>();
    const recommendedServices: any[] = [];
    const recommendedJourneys: any[] = [];

    for (const need of matchedNeeds) {
      for (const svc of need.services) {
        if (!serviceSet.has(svc.id)) {
          serviceSet.add(svc.id);
          recommendedServices.push({ ...svc, matchedReason: `Répond au besoin : "${need.name}"` });
        }
      }
      for (const journey of need.journeys) {
        if (!journeySet.has(journey.id)) {
          journeySet.add(journey.id);
          recommendedJourneys.push({ ...journey, matchedReason: `Parcours adapté au besoin : "${need.name}"` });
        }
      }
    }

    return NextResponse.json({
      company,
      matchedNeeds: matchedNeeds.map((n) => ({ id: n.id, name: n.name, description: n.description })),
      recommendedServices,
      recommendedJourneys,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

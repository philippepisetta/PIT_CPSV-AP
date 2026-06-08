import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [companies, needs, journeys, services] = await Promise.all([
      prisma.company.findMany({ include: { belongsToValueChain: true, participatesInStage: true, needs: true } }),
      prisma.businessNeed.findMany({ include: { journeys: true, services: true } }),
      prisma.journey.findMany({ include: { steps: { include: { service: true } } } }),
      prisma.publicService.findMany({ include: { organization: true } }),
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
      edges.push({ id: `e-${source}-${target}-${label}`, source, target, label });
    };

    for (const c of companies) {
      const cId = `company-${c.id}`;
      addNode(cId, c.name, "company", { sector: c.sector, size: c.size, location: c.location });
      for (const vc of c.belongsToValueChain) {
        const vcId = `valuechain-${vc.id}`;
        addNode(vcId, vc.name, "valuechain");
        addEdge(cId, vcId, "belongsToValueChain");
      }
      for (const st of c.participatesInStage) {
        const stId = `stage-${st.id}`;
        addNode(stId, st.name, "stage");
        addEdge(cId, stId, "participatesInStage");
      }
      for (const n of c.needs) {
        const nId = `need-${n.id}`;
        addNode(nId, n.name, "need");
        addEdge(cId, nId, "hasNeed");
      }
    }

    for (const n of needs) {
      const nId = `need-${n.id}`;
      addNode(nId, n.name, "need");
      for (const j of n.journeys) {
        const jId = `journey-${j.id}`;
        addNode(jId, j.name, "journey");
        addEdge(nId, jId, "addressedBy");
      }
      for (const s of n.services) {
        const sId = `service-${s.id}`;
        addNode(sId, s.name, "service");
        addEdge(nId, sId, "supportedBy");
      }
    }

    for (const j of journeys) {
      const jId = `journey-${j.id}`;
      addNode(jId, j.name, "journey");
      for (const step of j.steps) {
        if (step.service) {
          const sId = `service-${step.service.id}`;
          addNode(sId, step.service.name, "service");
          addEdge(jId, sId, `step:${step.position}`);
        }
      }
    }

    for (const s of services) {
      const sId = `service-${s.id}`;
      addNode(sId, s.name, "service", { organization: s.organization?.name });
    }

    return NextResponse.json({ nodes, edges });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

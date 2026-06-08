import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const data = await prisma.journey.findMany({
      include: {
        needs: true,
        valueChains: true,
        valueChainStages: true,
        steps: { orderBy: { position: "asc" }, include: { service: true } },
      },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, provider, objective, uri, needIds, valueChainIds, valueChainStageIds, steps } =
      await req.json();
    const item = await prisma.journey.create({
      data: {
        name,
        provider,
        objective: objective || null,
        uri: uri || `https://pit.wallonie.be/id/journey/${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
        needs: needIds?.length ? { connect: needIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        valueChains: valueChainIds?.length ? { connect: valueChainIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        valueChainStages: valueChainStageIds?.length ? { connect: valueChainStageIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        steps: steps?.length ? {
          create: steps.map((s: any) => ({
            name: s.name,
            position: parseInt(s.position),
            serviceId: s.serviceId ? parseInt(s.serviceId) : null,
          })),
        } : undefined,
      },
      include: {
        needs: true,
        valueChains: true,
        valueChainStages: true,
        steps: { orderBy: { position: "asc" }, include: { service: true } },
      },
    });
    return NextResponse.json(item, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

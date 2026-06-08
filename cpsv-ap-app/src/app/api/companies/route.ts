import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const data = await prisma.company.findMany({
      include: { belongsToValueChain: true, participatesInStage: true, playsRole: true, needs: true },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const {
      name, size, sector, location, demand,
      digiscoreScore, digiscoreLevel, digiscoreDate,
      belongsToValueChainIds, participatesInStageIds, playsRoleIds, needIds,
    } = await req.json();

    const item = await prisma.company.create({
      data: {
        name, size, sector, location,
        demand: demand || null,
        digiscoreScore: digiscoreScore ? parseInt(digiscoreScore) : null,
        digiscoreLevel: digiscoreLevel || null,
        digiscoreDate: digiscoreDate ? new Date(digiscoreDate) : null,
        belongsToValueChain: belongsToValueChainIds?.length ? { connect: belongsToValueChainIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        participatesInStage: participatesInStageIds?.length ? { connect: participatesInStageIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        playsRole: playsRoleIds?.length ? { connect: playsRoleIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        needs: needIds?.length ? { connect: needIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
      },
      include: { belongsToValueChain: true, participatesInStage: true, playsRole: true, needs: true },
    });
    return NextResponse.json(item, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

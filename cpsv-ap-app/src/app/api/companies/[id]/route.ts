import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const item = await prisma.company.findUnique({
      where: { id: parseInt(id) },
      include: { belongsToValueChain: true, participatesInStage: true, playsRole: true, needs: true },
    });
    if (!item) return NextResponse.json({ error: "Entreprise non trouvée" }, { status: 404 });
    return NextResponse.json(item);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const companyId = parseInt(id);
    const {
      name, size, sector, location, demand,
      digiscoreScore, digiscoreLevel, digiscoreDate,
      belongsToValueChainIds, participatesInStageIds, playsRoleIds, needIds,
      roadmapLogs,
    } = await req.json();

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
        belongsToValueChain: belongsToValueChainIds ? { set: belongsToValueChainIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        participatesInStage: participatesInStageIds ? { set: participatesInStageIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        playsRole: playsRoleIds ? { set: playsRoleIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        needs: needIds ? { set: needIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        roadmapLogs: roadmapLogs !== undefined ? roadmapLogs : undefined,
      },
      include: { belongsToValueChain: true, participatesInStage: true, playsRole: true, needs: true },
    });
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.company.delete({ where: { id: parseInt(id) } });
    return new NextResponse(null, { status: 204 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const service = await prisma.publicService.findUnique({
      where: { id: parseInt(id) },
      include: {
        organization: true,
        channels: true,
        targetAudiences: true,
        businessEvents: true,
        lifeEvents: true,
        requirements: { include: { evidences: true } },
        outputs: true,
        costs: true,
        contactPoints: true,
        criterions: true,
        rules: true,
        catalogues: true,
        supportsBusinessNeed: true,
      },
    });
    if (!service) return NextResponse.json({ error: "Service non trouvé" }, { status: 404 });
    return NextResponse.json(service);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

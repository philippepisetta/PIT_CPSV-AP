import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const data = await prisma.businessNeed.findMany({
      include: { valueChains: true, valueChainStages: true, services: true },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, description, uri, valueChainIds, valueChainStageIds, serviceIds, rule } =
      await req.json();
    if (!name) return NextResponse.json({ error: "Nom requis" }, { status: 400 });

    const item = await prisma.businessNeed.create({
      data: {
        name,
        description: description || null,
        uri:
          uri ||
          `https://pit.wallonie.be/id/need/${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
        rule: rule ?? undefined,
        valueChains: valueChainIds?.length
          ? { connect: valueChainIds.map((id: number) => ({ id })) }
          : undefined,
        valueChainStages: valueChainStageIds?.length
          ? { connect: valueChainStageIds.map((id: number) => ({ id })) }
          : undefined,
        services: serviceIds?.length
          ? { connect: serviceIds.map((id: number) => ({ id })) }
          : undefined,
      },
      include: { valueChains: true, valueChainStages: true, services: true },
    });
    return NextResponse.json(item, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [
      organizations,
      channels,
      targetAudiences,
      businessEvents,
      lifeEvents,
      catalogues,
      valueChains,
      stages,
      roles,
      needs,
      services,
    ] = await Promise.all([
      prisma.organization.findMany({ orderBy: { name: "asc" } }),
      prisma.channel.findMany({ orderBy: { name: "asc" } }),
      prisma.targetAudience.findMany({ orderBy: { name: "asc" } }),
      prisma.businessEvent.findMany({ orderBy: { name: "asc" } }),
      prisma.lifeEvent.findMany({ orderBy: { name: "asc" } }),
      prisma.catalogue.findMany({ orderBy: { name: "asc" } }),
      prisma.valueChain.findMany({ orderBy: { name: "asc" } }),
      prisma.valueChainStage.findMany({ orderBy: { name: "asc" } }),
      prisma.ecosystemRole.findMany({ orderBy: { name: "asc" } }),
      prisma.businessNeed.findMany({ orderBy: { name: "asc" } }),
      prisma.publicService.findMany({ orderBy: { name: "asc" } }),
    ]);

    return NextResponse.json({
      organizations,
      channels,
      targetAudiences,
      businessEvents,
      lifeEvents,
      catalogues,
      valueChains,
      stages,
      roles,
      needs,
      services,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const services = await prisma.publicService.findMany({
      select: {
        id: true,
        name: true,
        code: true,
        uri: true,
        organization: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(services);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const {
      name, description, code, uri, organizationId,
      channels, targetAudiences, businessEvents, lifeEvents,
      catalogues, requirements, outputs, costs, contactPoints,
      supportsBusinessNeedIds,
    } = await req.json();

    if (!name || !organizationId) {
      return NextResponse.json(
        { error: "Le nom du service et l'organisation sont obligatoires." },
        { status: 400 }
      );
    }

    const newService = await prisma.publicService.create({
      data: {
        name,
        description: description || null,
        code: code || null,
        uri: uri || `https://pit.wallonie.be/id/public-service/${(code || name).toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
        organizationId: parseInt(organizationId),
        channels: channels?.length ? { connect: channels.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        targetAudiences: targetAudiences?.length ? { connect: targetAudiences.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        businessEvents: businessEvents?.length ? { connect: businessEvents.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        lifeEvents: lifeEvents?.length ? { connect: lifeEvents.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        catalogues: catalogues?.length ? { connect: catalogues.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        supportsBusinessNeed: supportsBusinessNeedIds?.length ? { connect: supportsBusinessNeedIds.map((id: any) => ({ id: parseInt(id) })) } : undefined,
        requirements: requirements?.length ? {
          create: requirements.map((r: any) => ({
            name: r.name,
            description: r.description || null,
            code: r.code || null,
            uri: r.uri || `https://pit.wallonie.be/id/requirement/${r.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
            evidences: r.evidences?.length ? { create: r.evidences.map((e: any) => ({ name: e.name, description: e.description || null, code: e.code || null, uri: e.uri || `https://pit.wallonie.be/id/evidence/${e.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}` })) } : undefined,
          })),
        } : undefined,
        outputs: outputs?.length ? { create: outputs.map((o: any) => ({ name: o.name, description: o.description || null, code: o.code || null, uri: o.uri || `https://pit.wallonie.be/id/output/${o.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}` })) } : undefined,
        costs: costs?.length ? { create: costs.map((c: any) => ({ name: c.name, value: parseFloat(c.value) || 0, currency: c.currency || "EUR", description: c.description || null, uri: c.uri || `https://pit.wallonie.be/id/cost/${c.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}` })) } : undefined,
        contactPoints: contactPoints?.length ? { create: contactPoints.map((cp: any) => ({ name: cp.name, email: cp.email || null, telephone: cp.telephone || null, description: cp.description || null, uri: cp.uri || `https://pit.wallonie.be/id/contact-point/${cp.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}` })) } : undefined,
      },
      include: { organization: true, channels: true, targetAudiences: true, supportsBusinessNeed: true },
    });

    return NextResponse.json(newService, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

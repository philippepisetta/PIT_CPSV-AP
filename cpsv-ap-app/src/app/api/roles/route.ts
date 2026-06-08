import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const data = await prisma.ecosystemRole.findMany({ orderBy: { name: "asc" } });
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, description, uri } = await req.json();
    if (!name) return NextResponse.json({ error: "Nom requis" }, { status: 400 });
    const item = await prisma.ecosystemRole.create({
      data: {
        name,
        description: description || null,
        uri: uri || `https://pit.wallonie.be/id/role/${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      },
    });
    return NextResponse.json(item, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

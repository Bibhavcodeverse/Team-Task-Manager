import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const projects = await prisma.project.findMany({
      where: session.role === "ADMIN" 
        ? undefined // Admins see all projects
        : {
            OR: [
              { ownerId: session.id },
              { members: { some: { userId: session.id } } },
            ],
          },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        _count: { select: { tasks: true, members: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (session.role !== "ADMIN") {
      return NextResponse.json({ error: "Only admins can create projects" }, { status: 403 });
    }

    const { name, description } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Project name is required" }, { status: 400 });
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        ownerId: session.id,
        members: {
          create: {
            userId: session.id,
          },
        },
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

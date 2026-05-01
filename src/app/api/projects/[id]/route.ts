import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        members: { include: { user: { select: { id: true, name: true, email: true } } } },
      },
    });

    if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const isMemberOrAdmin = session.role === "ADMIN" || project.members.some(m => m.userId === session.id) || project.ownerId === session.id;
    if (!isMemberOrAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (session.role !== "ADMIN") {
      return NextResponse.json({ error: "Only admins can delete projects" }, { status: 403 });
    }

    await prisma.project.delete({ where: { id } });

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

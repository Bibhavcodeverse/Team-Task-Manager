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
      include: { members: true },
    });

    if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const isMemberOrAdmin = session.role === "ADMIN" || project.members.some(m => m.userId === session.id) || project.ownerId === session.id;
    if (!isMemberOrAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const tasks = await prisma.task.findMany({
      where: { projectId: id },
      include: {
        assignee: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const project = await prisma.project.findUnique({
      where: { id },
      include: { members: true },
    });

    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

    const isMemberOrAdmin = session.role === "ADMIN" || project.members.some(m => m.userId === session.id) || project.ownerId === session.id;
    if (!isMemberOrAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { title, description, status, dueDate, assigneeId } = await req.json();

    if (!title) {
      return NextResponse.json({ error: "Task title is required" }, { status: 400 });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status: status || "TODO",
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId: id,
        assigneeId: assigneeId || null,
      },
      include: {
        assignee: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

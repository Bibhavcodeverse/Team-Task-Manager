import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const task = await prisma.task.findUnique({
      where: { id },
      include: { project: { include: { members: true } } },
    });

    if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 });

    const isMemberOrAdmin = session.role === "ADMIN" || task.project.members.some((m: any) => m.userId === session.id) || task.project.ownerId === session.id;
    if (!isMemberOrAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { title, description, status, dueDate, assigneeId } = await req.json();

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(status && { status }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
        ...(assigneeId !== undefined && { assigneeId }),
      },
      include: {
        assignee: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const task = await prisma.task.findUnique({
      where: { id },
      include: { project: { include: { members: true } } },
    });

    if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 });

    const isMemberOrAdmin = session.role === "ADMIN" || task.project.members.some((m: any) => m.userId === session.id) || task.project.ownerId === session.id;
    if (!isMemberOrAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await prisma.task.delete({ where: { id } });

    return NextResponse.json({ message: "Task deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

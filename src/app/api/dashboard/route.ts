import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const whereClause = session.role === "ADMIN" ? {} : {
      project: {
        OR: [
          { ownerId: session.id },
          { members: { some: { userId: session.id } } }
        ]
      }
    };

    const tasks = await prisma.task.findMany({
      where: whereClause,
      include: {
        project: { select: { name: true } },
      }
    });

    const now = new Date();
    
    const stats = {
      total: tasks.length,
      todo: tasks.filter(t => t.status === "TODO").length,
      inProgress: tasks.filter(t => t.status === "IN_PROGRESS").length,
      done: tasks.filter(t => t.status === "DONE").length,
      overdue: tasks.filter(t => t.dueDate && new Date(t.dueDate) < now && t.status !== "DONE").length,
    };

    return NextResponse.json({ stats, recentTasks: tasks.slice(0, 10) });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

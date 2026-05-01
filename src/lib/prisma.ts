import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    // With Prisma 7, connection URLs are handled via prisma.config.ts
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

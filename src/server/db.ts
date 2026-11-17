import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

// Singleton para não abrir conexões demais com o hot reload do dev.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function criarClient() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? criarClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

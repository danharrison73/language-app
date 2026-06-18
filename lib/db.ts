import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import path from "path";

function createDb() {
  const adapter = new PrismaLibSql({
    url: `file:${path.join(process.cwd(), "dev.db")}`,
  });
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
export const db = globalForPrisma.prisma ?? createDb();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

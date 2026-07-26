import { PrismaClient } from "@prisma/client";

export type EnquiryInput = {
  name: string;
  email: string;
  company: string | null;
  service: string;
  budget: string;
  message: string;
  ip: string | null;
  userAgent: string | null;
};

export type EnquiryRecord = EnquiryInput & {
  id: string;
  createdAt: Date;
};

export interface EnquiryStore {
  create(input: EnquiryInput): Promise<EnquiryRecord>;
  countRecentByIp(ip: string, since: Date): Promise<number>;
  listAll(limit: number): Promise<EnquiryRecord[]>;
}

/* ---------- Prisma-backed store (production) ---------- */

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function getPrisma(): PrismaClient {
  if (!globalForPrisma.prisma) globalForPrisma.prisma = new PrismaClient();
  return globalForPrisma.prisma;
}

class PrismaStore implements EnquiryStore {
  async create(input: EnquiryInput): Promise<EnquiryRecord> {
    return getPrisma().enquiry.create({ data: input });
  }
  async countRecentByIp(ip: string, since: Date): Promise<number> {
    return getPrisma().enquiry.count({
      where: { ip, createdAt: { gte: since } },
    });
  }
  async listAll(limit: number): Promise<EnquiryRecord[]> {
    return getPrisma().enquiry.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }
}

/* ---------- In-memory store (Playwright suite only, TEST_STORE=memory) ---------- */

const globalForMemory = globalThis as unknown as { fcEnquiries?: EnquiryRecord[] };

function memoryRows(): EnquiryRecord[] {
  if (!globalForMemory.fcEnquiries) globalForMemory.fcEnquiries = [];
  return globalForMemory.fcEnquiries;
}

class MemoryStore implements EnquiryStore {
  async create(input: EnquiryInput): Promise<EnquiryRecord> {
    const record: EnquiryRecord = {
      ...input,
      id: `mem_${Date.now().toString(36)}_${memoryRows().length}`,
      createdAt: new Date(),
    };
    memoryRows().push(record);
    return record;
  }
  async countRecentByIp(ip: string, since: Date): Promise<number> {
    return memoryRows().filter((r) => r.ip === ip && r.createdAt >= since).length;
  }
  async listAll(limit: number): Promise<EnquiryRecord[]> {
    return [...memoryRows()].reverse().slice(0, limit);
  }
}

export function clearMemoryStore(): void {
  globalForMemory.fcEnquiries = [];
}

export function isMemoryStore(): boolean {
  return process.env.TEST_STORE === "memory";
}

/** Returns the configured store, or null when no storage is available. */
export function getStore(): EnquiryStore | null {
  if (isMemoryStore()) return new MemoryStore();
  if (process.env.DATABASE_URL) return new PrismaStore();
  return null;
}

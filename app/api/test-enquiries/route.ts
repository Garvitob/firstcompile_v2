import { NextResponse } from "next/server";
import {
  clearMemoryStore,
  getStore,
  isMemoryStore,
} from "@/lib/enquiry-store";

export const runtime = "nodejs";

/**
 * Test-only introspection endpoint for the Playwright suite. Active ONLY when
 * TEST_STORE=memory (never set in production); otherwise it is a 404.
 */
export async function GET() {
  if (!isMemoryStore()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const rows = await getStore()!.listAll(1000);
  return NextResponse.json({ rows });
}

export async function DELETE() {
  if (!isMemoryStore()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  clearMemoryStore();
  return NextResponse.json({ ok: true });
}

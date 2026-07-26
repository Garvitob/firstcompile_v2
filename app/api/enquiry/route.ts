import { NextRequest, NextResponse } from "next/server";
import { enquirySchema, BUDGET_LABELS } from "@/lib/enquiry-schema";
import { getStore } from "@/lib/enquiry-store";

export const runtime = "nodejs";

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: pretend everything worked, do nothing.
  if (
    typeof body === "object" &&
    body !== null &&
    "_url" in body &&
    String((body as Record<string, unknown>)._url || "")
  ) {
    return NextResponse.json({ ok: true });
  }

  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = String(issue.path[0] ?? "form");
      if (!errors[field]) errors[field] = issue.message;
    }
    return NextResponse.json({ errors }, { status: 400 });
  }

  const data = parsed.data;
  const ip = clientIp(req);
  const userAgent = req.headers.get("user-agent");
  const store = getStore();
  const hasResend = Boolean(process.env.RESEND_API_KEY);

  if (!store && !hasResend) {
    console.warn(
      "[enquiry] Neither DATABASE_URL nor RESEND_API_KEY is configured — rejecting."
    );
    return NextResponse.json(
      {
        error:
          "Enquiry delivery is not configured on this deployment. Email hello@firstcompile.com instead.",
      },
      { status: 501 }
    );
  }

  // Rate limit: max 5 submissions per IP per hour (needs a store to count).
  if (store) {
    try {
      const since = new Date(Date.now() - RATE_WINDOW_MS);
      const recent = await store.countRecentByIp(ip, since);
      if (recent >= RATE_LIMIT) {
        return NextResponse.json(
          {
            error:
              "Too many enquiries from this network in the last hour. Please try again later, or email hello@firstcompile.com.",
          },
          { status: 429 }
        );
      }
    } catch (err) {
      console.warn("[enquiry] rate-limit check failed:", err);
    }
  }

  let stored = false;
  if (store) {
    try {
      await store.create({
        name: data.name,
        email: data.email,
        company: data.company,
        service: data.service,
        budget: data.budget,
        message: data.message,
        ip,
        userAgent,
      });
      stored = true;
    } catch (err) {
      console.error("[enquiry] store failed:", err);
    }
  } else {
    console.warn("[enquiry] DATABASE_URL not set — skipping store, email only.");
  }

  let emailed = false;
  if (hasResend) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      const to = process.env.ENQUIRY_TO || "hello@firstcompile.com";
      const from =
        process.env.ENQUIRY_FROM || "FirstCompile <onboarding@resend.dev>";
      const budgetLabel = BUDGET_LABELS[data.budget] ?? data.budget;
      const lines = [
        `Name:    ${data.name}`,
        `Email:   ${data.email}`,
        `Company: ${data.company ?? "—"}`,
        `Service: ${data.service}`,
        `Budget:  ${budgetLabel}`,
        ``,
        `Project:`,
        data.message,
        ``,
        `IP: ${ip}`,
        `UA: ${userAgent ?? "—"}`,
      ];
      const { error } = await resend.emails.send({
        from,
        to,
        replyTo: data.email,
        subject: `New enquiry — ${data.service} — ${data.name}`,
        text: lines.join("\n"),
      });
      if (error) {
        console.error("[enquiry] Resend error:", error);
      } else {
        emailed = true;
      }
    } catch (err) {
      console.error("[enquiry] email failed:", err);
    }
  } else {
    console.warn("[enquiry] RESEND_API_KEY not set — stored only, no email.");
  }

  if (!stored && !emailed) {
    return NextResponse.json(
      {
        error:
          "Could not record the enquiry. Email hello@firstcompile.com instead.",
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}

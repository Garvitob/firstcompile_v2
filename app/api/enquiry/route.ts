import { NextRequest, NextResponse } from "next/server";
import { enquirySchema, BUDGET_LABELS } from "@/lib/enquiry-schema";
import { getStore } from "@/lib/enquiry-store";
import {
  buildInternalEmail,
  buildAckEmail,
  sendWithRetry,
  type EnquiryEmailInput,
} from "@/lib/email";

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
  const simulateEmailFailure = process.env.TEST_EMAIL === "fail"; // Playwright only
  const hasResend = Boolean(process.env.RESEND_API_KEY) || simulateEmailFailure;

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

  // Store FIRST — an email failure must never lose the lead.
  let stored = false;
  let rowId: string | null = null;
  if (store) {
    try {
      const row = await store.create({
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
      rowId = row.id;
    } catch (err) {
      console.error("[enquiry] store failed:", err);
    }
  } else {
    console.warn("[enquiry] DATABASE_URL not set — skipping store, email only.");
  }

  let emailed = false;
  if (hasResend) {
    if (simulateEmailFailure) {
      console.error("[enquiry] email send failed (simulated for tests)");
    } else {
      const input: EnquiryEmailInput = {
        name: data.name,
        email: data.email,
        company: data.company,
        service: data.service,
        budgetLabel: BUDGET_LABELS[data.budget] ?? data.budget,
        message: data.message,
        ip,
      };
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);

        const internal = buildInternalEmail(input);
        const internalResult = await sendWithRetry(() =>
          resend.emails.send({
            from: internal.from,
            to: internal.to,
            replyTo: internal.replyTo,
            subject: internal.subject,
            text: internal.text,
          })
        );
        if (internalResult.id) {
          emailed = true;
          console.log(
            `[enquiry] internal email sent id=${internalResult.id} row=${rowId ?? "-"}`
          );
        } else {
          console.error(
            `[enquiry] internal email failed row=${rowId ?? "-"}: ${internalResult.error}`
          );
        }

        if (process.env.SEND_ACK === "true") {
          const ack = buildAckEmail(input);
          const ackResult = await sendWithRetry(() =>
            resend.emails.send({
              from: ack.from,
              to: ack.to,
              replyTo: ack.replyTo,
              subject: ack.subject,
              text: ack.text,
            })
          );
          if (ackResult.id) {
            console.log(
              `[enquiry] ack email sent id=${ackResult.id} row=${rowId ?? "-"}`
            );
          } else {
            console.error(
              `[enquiry] ack email failed row=${rowId ?? "-"}: ${ackResult.error}`
            );
          }
        }
      } catch (err) {
        console.error("[enquiry] email step failed:", err);
      }
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

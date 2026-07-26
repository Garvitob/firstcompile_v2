/**
 * Email construction for the enquiry pipeline — Addendum A rules:
 *
 * - Programmatic mail ALWAYS signs as notify.firstcompile.com. The root
 *   domain is reserved for human mail (Google Workspace) and its reputation
 *   must never be touched by this app. resolveFrom() enforces this even
 *   against a misconfigured env var.
 * - Plain text only. No HTML, no images, no attachments, no tracking.
 * - Internal notification: zero links. Acknowledgement: exactly one link
 *   (https://firstcompile.com), body under 70 words.
 * - User input is stripped of CR/LF and control characters before it reaches
 *   any header (subject, reply-to) to prevent header injection.
 */

export type EnquiryEmailInput = {
  name: string;
  email: string;
  company: string | null;
  service: string;
  budgetLabel: string;
  message: string;
  ip?: string | null;
};

export type BuiltEmail = {
  from: string;
  to: string;
  replyTo: string;
  subject: string;
  text: string;
};

const NOTIFY_DOMAIN = "notify.firstcompile.com";
const DEFAULT_FROM = `FirstCompile <hello@${NOTIFY_DOMAIN}>`;

/** Strip anything that could break out of an email header. */
export function sanitizeHeader(value: string): string {
  return value
    .replace(/[\r\n\t]+/g, " ")
    .replace(/[\x00-\x1f\x7f]/g, "")
    .trim();
}

/**
 * The From address for all programmatic mail. Falls back to the notify
 * default, and refuses a root-domain From even if the env var asks for one.
 */
export function resolveFrom(): string {
  const configured = process.env.ENQUIRY_FROM;
  if (!configured) return DEFAULT_FROM;
  if (/@firstcompile\.com\s*>?\s*$/i.test(configured)) {
    console.error(
      `[email] ENQUIRY_FROM signs as the root domain — refused. Using ${DEFAULT_FROM}. ` +
        "Programmatic mail must come from notify.firstcompile.com."
    );
    return DEFAULT_FROM;
  }
  return sanitizeHeader(configured);
}

/** Founder notification. Plain text, zero links. Reply in Gmail → answers the enquirer. */
export function buildInternalEmail(input: EnquiryEmailInput): BuiltEmail {
  const name = sanitizeHeader(input.name);
  const service = sanitizeHeader(input.service);
  return {
    from: resolveFrom(),
    to: process.env.ENQUIRY_TO || "hello@firstcompile.com",
    replyTo: sanitizeHeader(input.email),
    subject: `New enquiry — ${service} — ${name}`,
    text: [
      `Name:    ${name}`,
      `Email:   ${sanitizeHeader(input.email)}`,
      `Company: ${input.company ? sanitizeHeader(input.company) : "-"}`,
      `Service: ${service}`,
      `Budget:  ${sanitizeHeader(input.budgetLabel)}`,
      ``,
      `Project:`,
      input.message,
      ``,
      `IP: ${input.ip ?? "-"}`,
    ].join("\n"),
  };
}

/** Acknowledgement to the enquirer. Transactional, under 70 words, one link. */
export function buildAckEmail(input: EnquiryEmailInput): BuiltEmail {
  const name = sanitizeHeader(input.name);
  const service = sanitizeHeader(input.service);
  return {
    from: resolveFrom(),
    to: sanitizeHeader(input.email),
    replyTo: "hello@firstcompile.com",
    subject: "We received your enquiry — FirstCompile",
    text: [
      `Hi ${name},`,
      ``,
      `We received your enquiry about ${service}. A person reads every message and replies within one working day, usually with a few questions and a rough direction.`,
      ``,
      `This is the only automated email you will get from us. No mailing list, no sequences.`,
      ``,
      `FirstCompile`,
      `https://firstcompile.com`,
    ].join("\n"),
  };
}

type SendOutcome = {
  data: { id: string } | null;
  error: { message: string; name: string } | null;
};

const RETRYABLE_NAMES = new Set(["application_error", "internal_server_error"]);

/**
 * One send attempt plus one retry, but only on 5xx-class failures or network
 * errors — a 4xx (bad payload, bad key) will not improve on retry.
 */
export async function sendWithRetry(
  send: () => Promise<SendOutcome>
): Promise<{ id: string | null; error: string | null }> {
  const attempt = async (): Promise<{
    id: string | null;
    error: string | null;
    retryable: boolean;
  }> => {
    try {
      const { data, error } = await send();
      if (data?.id) return { id: data.id, error: null, retryable: false };
      const statusCode = (error as { statusCode?: number } | null)?.statusCode;
      const retryable =
        (typeof statusCode === "number" && statusCode >= 500) ||
        (error !== null && RETRYABLE_NAMES.has(error.name));
      return {
        id: null,
        error: error ? `${error.name}: ${error.message}` : "unknown send error",
        retryable,
      };
    } catch (err) {
      return {
        id: null,
        error: err instanceof Error ? err.message : String(err),
        retryable: true,
      };
    }
  };

  const first = await attempt();
  if (first.id || !first.retryable) return { id: first.id, error: first.error };
  const second = await attempt();
  return { id: second.id, error: second.error };
}

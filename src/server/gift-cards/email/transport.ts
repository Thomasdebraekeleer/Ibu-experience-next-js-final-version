import fs from "node:fs";
import path from "node:path";
import { Resend } from "resend";

export type OutboundGiftCardEmail = {
  to: string;
  subject: string;
  html: string;
  text: string;
  pdfFilename: string;
  pdfBytes: Buffer;
  idempotencyKey: string;
  replyTo?: string;
};

export type EmailTransportResult =
  | { ok: true; provider: "mock"; simulated: true }
  | { ok: true; provider: "resend"; simulated: false; providerMessageId?: string }
  | { ok: false; transient: boolean; message: string; blockedRecipient?: boolean };

export function getEmailMode(): "mock" | "resend" | "resend_allowlisted" {
  const mode = process.env.GIFT_CARD_EMAIL_MODE?.trim() || "mock";
  if (mode === "resend" || mode === "resend_allowlisted") return mode;
  return "mock";
}

export function getFromAddress(): string {
  return (
    process.env.GIFT_CARD_FROM_EMAIL?.trim() ||
    "IBU Experience <no-reply@ibu-experience.be>"
  );
}

export function getReplyToAddress(): string {
  return process.env.GIFT_CARD_REPLY_TO_EMAIL?.trim() || "info@ibu-experience.be";
}

export function isRealEmailDeliveryConfigured(): boolean {
  const mode = getEmailMode();
  return mode === "resend" || mode === "resend_allowlisted";
}

function parseAllowlistedRecipients(): string[] {
  const raw = process.env.GIFT_CARD_TEST_RECIPIENT_ALLOWLIST?.trim() ?? "";
  return raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export function assertRecipientAllowedForMode(to: string): { allowed: boolean; reason?: string } {
  const mode = getEmailMode();
  if (mode === "mock") {
    return { allowed: true };
  }
  if (mode === "resend") {
    return { allowed: true };
  }
  const allowlist = parseAllowlistedRecipients();
  if (allowlist.length === 0) {
    return {
      allowed: false,
      reason: "GIFT_CARD_TEST_RECIPIENT_ALLOWLIST est obligatoire en mode resend_allowlisted",
    };
  }
  if (!allowlist.includes(to.trim().toLowerCase())) {
    return {
      allowed: false,
      reason: `Destinataire non autorisé (${to}) — la liste de test ne redirige pas les e-mails`,
    };
  }
  return { allowed: true };
}

async function sendWithMock(message: OutboundGiftCardEmail): Promise<EmailTransportResult> {
  const outDir = path.join(process.cwd(), ".gift-card-outbox");
  fs.mkdirSync(outDir, { recursive: true });
  const safeKey = message.idempotencyKey.replace(/[^a-zA-Z0-9-_]/g, "_");
  const base = path.join(outDir, `${Date.now()}_${safeKey}`);
  fs.writeFileSync(
    `${base}.json`,
    JSON.stringify(
      {
        to: message.to,
        subject: message.subject,
        idempotencyKey: message.idempotencyKey,
        simulated: true,
      },
      null,
      2
    )
  );
  fs.writeFileSync(`${base}.html`, message.html);
  fs.writeFileSync(`${base}.txt`, message.text);
  fs.writeFileSync(`${base}.pdf`, message.pdfBytes);
  return { ok: true, provider: "mock", simulated: true };
}

async function sendWithResend(message: OutboundGiftCardEmail): Promise<EmailTransportResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return { ok: false, transient: false, message: "RESEND_API_KEY missing" };
  }

  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send(
    {
      from: getFromAddress(),
      to: [message.to],
      replyTo: message.replyTo ?? getReplyToAddress(),
      subject: message.subject,
      html: message.html,
      text: message.text,
      attachments: [
        {
          filename: message.pdfFilename,
          content: message.pdfBytes,
        },
      ],
    },
    { idempotencyKey: message.idempotencyKey }
  );

  if (error) {
    const transient =
      error.name === "application_error" ||
      (typeof error.message === "string" &&
        /timeout|network|rate|429|5\d\d/i.test(error.message));
    return {
      ok: false,
      transient,
      message: error.message ?? "Resend error",
    };
  }

  return {
    ok: true,
    provider: "resend",
    simulated: false,
    providerMessageId: data?.id,
  };
}

export async function sendGiftCardEmail(
  message: OutboundGiftCardEmail
): Promise<EmailTransportResult> {
  const mode = getEmailMode();

  const recipientCheck = assertRecipientAllowedForMode(message.to);
  if (!recipientCheck.allowed) {
    return {
      ok: false,
      transient: false,
      blockedRecipient: true,
      message: recipientCheck.reason ?? "Recipient not allowed",
    };
  }

  if (mode === "mock") {
    return sendWithMock(message);
  }

  return sendWithResend(message);
}

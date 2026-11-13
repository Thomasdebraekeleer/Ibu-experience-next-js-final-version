import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getDb, isDatabaseConfigured } from "@/server/db/client";
import { handleStripeGiftCardWebhookEvent } from "@/server/gift-cards/fulfillment/handle-stripe-webhook";
import { getStripeClient } from "@/server/gift-cards/stripe/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { message: "Gift card database not configured" },
      { status: 503 }
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!webhookSecret) {
    return NextResponse.json(
      { message: "STRIPE_WEBHOOK_SECRET not configured" },
      { status: 503 }
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ message: "Missing stripe-signature" }, { status: 400 });
  }

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    const stripe = getStripeClient();
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ message }, { status: 400 });
  }

  try {
    getDb();
  } catch {
    return NextResponse.json({ message: "Database unavailable" }, { status: 503 });
  }

  try {
    const result = await handleStripeGiftCardWebhookEvent(event);
    return NextResponse.json(result.body, { status: result.httpStatus });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook handler error";
    console.error("[stripe-webhook]", message);
    return NextResponse.json({ message }, { status: 500 });
  }
}

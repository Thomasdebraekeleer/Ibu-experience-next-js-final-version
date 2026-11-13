import type Stripe from "stripe";
import { sanitizeBuyerName } from "../buyer-name";
import { resolveGiftCardSiteLocale } from "../locale";
import { extractStripeDiscountReferences } from "./discount-refs";
import { resolveGiftCardPaidAtFromStripe } from "./paid-at";
import type { GiftCardLocale } from "@/config/gift-cards/types";
import type { ParsedCheckoutLine } from "../validate-purchase";

export type ParsedGiftCheckoutSession = {
  sessionId: string;
  mode: string | null;
  currency: string | null;
  livemode: boolean;
  paymentStatus: string | null;
  sessionStatus: string | null;
  sessionAmountDiscountCents: number | null;
  stripeDiscountReferences: ReturnType<typeof extractStripeDiscountReferences>;
  buyerEmail: string | null;
  buyerFullName: string | null;
  buyerFirstName: string | null;
  paidAt: Date | null;
  paymentIntentId: string | null;
  customerId: string | null;
  paymentLinkId: string | null;
  locale: GiftCardLocale;
  lines: ParsedCheckoutLine[];
};

function mapLine(item: Stripe.LineItem): ParsedCheckoutLine {
  const price = item.price;
  const priceId = typeof price?.id === "string" ? price.id : "";
  const product = price?.product;
  const productId =
    typeof product === "string"
      ? product
      : product && typeof product === "object" && "id" in product
        ? String(product.id)
        : null;

  return {
    priceId,
    productId,
    quantity: item.quantity ?? 0,
    currency: (item.currency ?? price?.currency ?? "eur").toLowerCase(),
    amountSubtotalCents: item.amount_subtotal ?? 0,
    amountTotalCents: item.amount_total ?? 0,
    amountDiscountCents: item.amount_discount ?? 0,
    amountTaxCents: item.amount_tax ?? 0,
    description: item.description ?? null,
  };
}

/** Récupère tous les articles (pagination Stripe). */
export async function fetchCheckoutSessionLineItems(
  stripe: Stripe,
  sessionId: string,
  initialLines?: Stripe.ApiList<Stripe.LineItem> | null
): Promise<ParsedCheckoutLine[]> {
  const lines: ParsedCheckoutLine[] = [];

  if (initialLines?.data?.length) {
    for (const item of initialLines.data) {
      lines.push(mapLine(item));
    }
    if (!initialLines.has_more) {
      return lines;
    }
  }

  let startingAfter: string | undefined;
  for (;;) {
    const page = await stripe.checkout.sessions.listLineItems(sessionId, {
      limit: 100,
      starting_after: startingAfter,
      expand: ["data.price.product"],
    });

    for (const item of page.data) {
      lines.push(mapLine(item));
    }

    if (!page.has_more) {
      break;
    }
    startingAfter = page.data[page.data.length - 1]?.id;
    if (!startingAfter) {
      break;
    }
  }

  return lines;
}

export function parseCheckoutSession(
  session: Stripe.Checkout.Session,
  lines: ParsedCheckoutLine[],
  options?: { checkoutCompletedAt?: Date | null }
): ParsedGiftCheckoutSession {
  const buyerEmail =
    session.customer_details?.email ??
    session.customer_email ??
    (typeof session.customer === "object" &&
    session.customer &&
    !("deleted" in session.customer) &&
    "email" in session.customer
      ? (session.customer.email as string | null)
      : null);

  const siteLocale = resolveGiftCardSiteLocale(session);
  const buyerFullName = sanitizeBuyerName(session.customer_details?.name ?? null);

  let buyerFirstName: string | null = null;
  if (session.custom_fields?.length) {
    const firstField = session.custom_fields.find((f) => {
      const key = f.key?.toLowerCase() ?? "";
      return key.includes("prenom") || key.includes("first");
    });
    const text = firstField?.text?.value;
    buyerFirstName = sanitizeBuyerName(text ?? null);
  }

  const paymentIntent =
    typeof session.payment_intent === "object" ? session.payment_intent : null;
  const paidAt = resolveGiftCardPaidAtFromStripe({
    session,
    paymentIntent,
    checkoutCompletedAt: options?.checkoutCompletedAt,
  });

  const stripeDiscountReferences = extractStripeDiscountReferences(session);

  return {
    sessionId: session.id,
    mode: session.mode,
    currency: session.currency,
    livemode: session.livemode,
    paymentStatus: session.payment_status,
    sessionStatus: session.status ?? null,
    sessionAmountDiscountCents:
      session.total_details?.amount_discount ?? null,
    stripeDiscountReferences,
    buyerEmail,
    buyerFullName,
    buyerFirstName,
    paidAt,
    paymentIntentId:
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id ?? null,
    customerId:
      typeof session.customer === "string"
        ? session.customer
        : session.customer?.id ?? null,
    paymentLinkId:
      typeof session.payment_link === "string"
        ? session.payment_link
        : session.payment_link?.id ?? null,
    locale: siteLocale,
    lines,
  };
}

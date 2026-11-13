import type Stripe from "stripe";

type PaymentIntentWithTransitions = Stripe.PaymentIntent & {
  status_transitions?: { paid_at?: number | null };
};

export function paymentIntentPaidAt(
  paymentIntent: Stripe.PaymentIntent | string | null | undefined
): Date | null {
  if (!paymentIntent || typeof paymentIntent === "string") {
    return null;
  }
  const transitions = (paymentIntent as PaymentIntentWithTransitions)
    .status_transitions;
  if (transitions?.paid_at) {
    return new Date(transitions.paid_at * 1000);
  }
  return null;
}

/**
 * Date de confirmation de paiement (pas la création de session).
 * Paiements différés : privilégie PaymentIntent.status_transitions.paid_at.
 */
export function resolveGiftCardPaidAtFromStripe(input: {
  session: Stripe.Checkout.Session;
  paymentIntent?: Stripe.PaymentIntent | null;
  /** Horodatage fiable de finalisation (ex. event Stripe checkout.session.completed). */
  checkoutCompletedAt?: Date | null;
}): Date | null {
  if (input.session.payment_status === "paid") {
    const pi =
      input.paymentIntent ??
      (typeof input.session.payment_intent === "object"
        ? input.session.payment_intent
        : null);
    return paymentIntentPaidAt(pi);
  }

  if (
    input.session.payment_status === "no_payment_required" &&
    input.session.status === "complete"
  ) {
    return input.checkoutCompletedAt ?? null;
  }

  return null;
}

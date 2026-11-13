/** Sessions Checkout éligibles au traitement cadeau (hors contenu panier). */
export function isCheckoutSessionStatusEligible(
  status: string | null | undefined
): boolean {
  return status === "complete";
}

export function isCheckoutPaymentStatusEligible(
  paymentStatus: string | null | undefined
): paymentStatus is "paid" | "no_payment_required" {
  return paymentStatus === "paid" || paymentStatus === "no_payment_required";
}

/** Paiement différé : pas d’émission tant que unpaid. */
export function shouldDeferFulfillmentForPaymentStatus(
  paymentStatus: string | null | undefined
): boolean {
  return paymentStatus === "unpaid";
}

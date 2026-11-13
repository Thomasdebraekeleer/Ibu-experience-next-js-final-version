import type Stripe from "stripe";

export type StripeDiscountReferences = {
  promotionCodeIds: string[];
  couponIds: string[];
};

export function extractStripeDiscountReferences(
  session: Stripe.Checkout.Session
): StripeDiscountReferences {
  const promotionCodeIds: string[] = [];
  const couponIds: string[] = [];

  for (const entry of session.discounts ?? []) {
    const discount =
      typeof entry === "object" && entry !== null && "promotion_code" in entry
        ? entry
        : null;
    if (!discount || typeof discount !== "object") continue;

    const pc = discount.promotion_code;
    if (typeof pc === "string") {
      promotionCodeIds.push(pc);
    } else if (pc && typeof pc === "object" && "id" in pc) {
      promotionCodeIds.push(String(pc.id));
    }

    const coupon = discount.coupon;
    if (typeof coupon === "string") {
      couponIds.push(coupon);
    } else if (coupon && typeof coupon === "object" && "id" in coupon) {
      couponIds.push(String(coupon.id));
    }
  }

  return {
    promotionCodeIds: Array.from(new Set(promotionCodeIds)),
    couponIds: Array.from(new Set(couponIds)),
  };
}

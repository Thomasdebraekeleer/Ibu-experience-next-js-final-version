import type { ValidateReason } from "@/config/booking/types";
import type { StayValidationResult } from "./validate-stay";
import type { PublicCoconPricing } from "@/lib/booking/types";

export type ValidateCheckoutOutcomeBody = {
  valid: boolean;
  availableCoconIds: string[];
  reason: ValidateReason | null;
  constraints: StayValidationResult["constraints"];
  checkoutUrls: Record<string, string>;
  checkoutBlocked: Record<string, string>;
  pricingByCocon: Record<string, PublicCoconPricing>;
};

export function buildValidateCheckoutOutcome(input: {
  quoteConfirmedIds: string[];
  checkoutUrls: Record<string, string>;
  checkoutBlocked: Record<string, string>;
  constraints: StayValidationResult["constraints"];
  pricingByCocon: Record<string, PublicCoconPricing>;
}): { status: 200 | 422; body: ValidateCheckoutOutcomeBody } {
  const hasCheckout = Object.keys(input.checkoutUrls).length > 0;

  if (!hasCheckout) {
    return {
      status: 422,
      body: {
        valid: false,
        availableCoconIds: input.quoteConfirmedIds,
        reason: "checkout_not_configured",
        constraints: input.constraints,
        checkoutUrls: {},
        checkoutBlocked: input.checkoutBlocked,
        pricingByCocon: input.pricingByCocon,
      },
    };
  }

  return {
    status: 200,
    body: {
      valid: true,
      availableCoconIds: input.quoteConfirmedIds,
      reason: null,
      constraints: input.constraints,
      checkoutUrls: input.checkoutUrls,
      checkoutBlocked: input.checkoutBlocked,
      pricingByCocon: input.pricingByCocon,
    },
  };
}

import type { ValidateResponse } from "./types";
import type { PublicCoconFilter } from "@/config/booking/public-places";

export type CheckoutFlowResult =
  | { type: "redirect"; url: string }
  | { type: "choose_cocon"; urls: Record<string, string> }
  | { type: "error"; reason: string };

export function resolveCheckoutFlow(
  response: ValidateResponse,
  selectedCocon: PublicCoconFilter
): CheckoutFlowResult {
  const urls = response.checkoutUrls ?? {};
  const keys = Object.keys(urls);

  if (!response.valid || keys.length === 0) {
    return {
      type: "error",
      reason: response.reason ?? "invalid_request",
    };
  }

  if (selectedCocon !== "all") {
    const url = urls[selectedCocon];
    if (url) return { type: "redirect", url };
    return {
      type: "error",
      reason: response.reason ?? "checkout_not_configured",
    };
  }

  if (keys.length === 1) {
    return { type: "redirect", url: urls[keys[0]!]! };
  }

  return { type: "choose_cocon", urls };
}

import { randomUUID } from "node:crypto";

export function fulfillmentWorkerId(prefix: string): string {
  const region = process.env.VERCEL_REGION ?? "local";
  return `${prefix}-${region}-${randomUUID()}`;
}

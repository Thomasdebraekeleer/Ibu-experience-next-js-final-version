export const RESEND_IDEMPOTENCY_WINDOW_MS = 24 * 60 * 60 * 1000;

export function isWithinResendIdempotencyWindow(createdAt: Date): boolean {
  return Date.now() - createdAt.getTime() < RESEND_IDEMPOTENCY_WINDOW_MS;
}

export function isAutomaticRetryAllowed(
  operation: { sendStatus: string; createdAt: Date }
): boolean {
  if (operation.sendStatus === "idempotency_expired") {
    return false;
  }
  if (operation.sendStatus === "unknown") {
    return isWithinResendIdempotencyWindow(operation.createdAt);
  }
  if (operation.sendStatus === "failed") {
    return isWithinResendIdempotencyWindow(operation.createdAt);
  }
  if (operation.sendStatus === "pending" || operation.sendStatus === "sending") {
    return isWithinResendIdempotencyWindow(operation.createdAt);
  }
  return false;
}

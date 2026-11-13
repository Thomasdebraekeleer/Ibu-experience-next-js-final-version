import {
  boolean,
  customType,
  index,
  integer,
  jsonb,
  pgSchema,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

/** Schéma PostgreSQL non exposé via Supabase Data API (révoquer les droits anon/authenticated). */
export const giftCardInternal = pgSchema("gift_card_internal");

const bytea = customType<{ data: Buffer; driverData: Buffer }>({
  dataType() {
    return "bytea";
  },
});

export const stripePurchases = giftCardInternal.table(
  "stripe_purchases",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    stripeCheckoutSessionId: text("stripe_checkout_session_id").notNull(),
    stripePaymentIntentId: text("stripe_payment_intent_id"),
    stripeCustomerId: text("stripe_customer_id"),
    buyerEmail: text("buyer_email").notNull(),
    buyerFullName: text("buyer_full_name"),
    buyerFirstName: text("buyer_first_name"),
    paidAt: timestamp("paid_at", { withTimezone: true }),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    validityRuleVersion: text("validity_rule_version"),
    currency: text("currency").notNull(),
    nominalAmountCents: integer("nominal_amount_cents"),
    discountAmountCents: integer("discount_amount_cents"),
    stripePromotionCodeIds: jsonb("stripe_promotion_code_ids").$type<string[]>(),
    stripeCouponIds: jsonb("stripe_coupon_ids").$type<string[]>(),
    paidAmountCents: integer("paid_amount_cents").notNull(),
    offerId: text("offer_id"),
    stripePriceId: text("stripe_price_id"),
    stripeProductId: text("stripe_product_id"),
    stripePaymentLinkId: text("stripe_payment_link_id"),
    quantity: integer("quantity").notNull().default(1),
    locale: text("locale").notNull().default("fr"),
    livemode: boolean("livemode").notNull(),
    paymentStatus: text("payment_status").notNull(),
    purchaseStatus: text("purchase_status").notNull().default("open"),
    reviewReason: text("review_reason"),
    reviewDetails: jsonb("review_details").$type<Record<string, unknown>>(),
    stripeEnvironment: text("stripe_environment").notNull(),
    documentTemplateVersion: text("document_template_version").notNull(),
    conditionsVersion: text("conditions_version").notNull(),
    processingLeaseOwner: text("processing_lease_owner"),
    processingLeaseExpiresAt: timestamp("processing_lease_expires_at", {
      withTimezone: true,
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("stripe_purchases_session_uidx").on(
      table.stripeCheckoutSessionId
    ),
    index("stripe_purchases_status_idx").on(table.purchaseStatus),
    index("stripe_purchases_buyer_email_idx").on(table.buyerEmail),
  ]
);

export const giftCards = giftCardInternal.table(
  "gift_cards",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    purchaseId: uuid("purchase_id")
      .notNull()
      .references(() => stripePurchases.id),
    code: text("code").notNull(),
    offerId: text("offer_id").notNull(),
    nominalAmountCents: integer("nominal_amount_cents").notNull(),
    paidAmountCents: integer("paid_amount_cents").notNull(),
    currency: text("currency").notNull(),
    locale: text("locale").notNull(),
    documentLocale: text("document_locale").notNull().default("fr"),
    paidAt: timestamp("paid_at", { withTimezone: true }),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    validityRuleVersion: text("validity_rule_version"),
    cardStatus: text("card_status").notNull().default("active"),
    pdfBytes: bytea("pdf_bytes").notNull(),
    pdfSha256: text("pdf_sha256").notNull(),
    pdfFilename: text("pdf_filename").notNull(),
  },
  (table) => [
    uniqueIndex("gift_cards_code_uidx").on(table.code),
    uniqueIndex("gift_cards_purchase_uidx").on(table.purchaseId),
  ]
);

export const emailOperations = giftCardInternal.table(
  "email_operations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    purchaseId: uuid("purchase_id")
      .notNull()
      .references(() => stripePurchases.id),
    giftCardId: uuid("gift_card_id").references(() => giftCards.id),
    operationKind: text("operation_kind").notNull().default("initial"),
    idempotencyKey: text("idempotency_key").notNull(),
    recipientEmail: text("recipient_email").notNull(),
    sendStatus: text("send_status").notNull().default("pending"),
    emailSubject: text("email_subject"),
    emailHtml: text("email_html"),
    emailText: text("email_text"),
    fromEmail: text("from_email"),
    replyToEmail: text("reply_to_email"),
    contentFrozenAt: timestamp("content_frozen_at", { withTimezone: true }),
    resendEmailId: text("resend_email_id"),
    lastError: text("last_error"),
    attemptCount: integer("attempt_count").notNull().default(0),
    lastAttemptAt: timestamp("last_attempt_at", { withTimezone: true }),
    acceptedAt: timestamp("accepted_at", { withTimezone: true }),
    processingLeaseOwner: text("processing_lease_owner"),
    processingLeaseExpiresAt: timestamp("processing_lease_expires_at", {
      withTimezone: true,
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("email_operations_idempotency_uidx").on(table.idempotencyKey),
    index("email_operations_purchase_idx").on(table.purchaseId),
    index("email_operations_status_idx").on(table.sendStatus),
  ]
);

export const stripeWebhookEvents = giftCardInternal.table(
  "stripe_webhook_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    stripeEventId: text("stripe_event_id").notNull(),
    eventType: text("event_type").notNull(),
    checkoutSessionId: text("checkout_session_id"),
    processingStatus: text("processing_status").notNull().default("received"),
    processingLeaseOwner: text("processing_lease_owner"),
    processingLeaseExpiresAt: timestamp("processing_lease_expires_at", {
      withTimezone: true,
    }),
    processingAttempts: integer("processing_attempts").notNull().default(0),
    handlerHttpStatus: integer("handler_http_status"),
    errorMessage: text("error_message"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    processedAt: timestamp("processed_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("stripe_webhook_events_event_uidx").on(table.stripeEventId),
    index("stripe_webhook_events_session_idx").on(table.checkoutSessionId),
  ]
);

export const maintenanceAuditLog = giftCardInternal.table(
  "maintenance_audit_log",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    action: text("action").notNull(),
    actor: text("actor").notNull(),
    targetType: text("target_type").notNull(),
    targetId: text("target_id").notNull(),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("maintenance_audit_target_idx").on(table.targetId)]
);

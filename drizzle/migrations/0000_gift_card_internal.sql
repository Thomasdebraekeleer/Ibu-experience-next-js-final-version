CREATE SCHEMA IF NOT EXISTS gift_card_internal;

CREATE TABLE IF NOT EXISTS gift_card_internal.stripe_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_checkout_session_id text NOT NULL,
  stripe_payment_intent_id text,
  stripe_customer_id text,
  buyer_email text NOT NULL,
  currency text NOT NULL,
  nominal_amount_cents integer,
  paid_amount_cents integer NOT NULL,
  offer_id text,
  stripe_price_id text,
  stripe_product_id text,
  stripe_payment_link_id text,
  quantity integer NOT NULL DEFAULT 1,
  locale text NOT NULL DEFAULT 'fr',
  livemode boolean NOT NULL,
  payment_status text NOT NULL,
  purchase_status text NOT NULL DEFAULT 'open',
  review_reason text,
  review_details jsonb,
  stripe_environment text NOT NULL,
  document_template_version text NOT NULL,
  conditions_version text NOT NULL,
  processing_lease_owner text,
  processing_lease_expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS stripe_purchases_session_uidx
  ON gift_card_internal.stripe_purchases (stripe_checkout_session_id);
CREATE INDEX IF NOT EXISTS stripe_purchases_status_idx
  ON gift_card_internal.stripe_purchases (purchase_status);
CREATE INDEX IF NOT EXISTS stripe_purchases_buyer_email_idx
  ON gift_card_internal.stripe_purchases (buyer_email);

CREATE TABLE IF NOT EXISTS gift_card_internal.gift_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_id uuid NOT NULL REFERENCES gift_card_internal.stripe_purchases (id),
  code text NOT NULL,
  offer_id text NOT NULL,
  nominal_amount_cents integer NOT NULL,
  paid_amount_cents integer NOT NULL,
  currency text NOT NULL,
  locale text NOT NULL,
  card_status text NOT NULL DEFAULT 'active',
  pdf_bytes bytea NOT NULL,
  pdf_sha256 text NOT NULL,
  pdf_filename text NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS gift_cards_code_uidx
  ON gift_card_internal.gift_cards (code);
CREATE UNIQUE INDEX IF NOT EXISTS gift_cards_purchase_uidx
  ON gift_card_internal.gift_cards (purchase_id);

CREATE TABLE IF NOT EXISTS gift_card_internal.email_operations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_id uuid NOT NULL REFERENCES gift_card_internal.stripe_purchases (id),
  gift_card_id uuid REFERENCES gift_card_internal.gift_cards (id),
  operation_kind text NOT NULL DEFAULT 'initial',
  idempotency_key text NOT NULL,
  recipient_email text NOT NULL,
  send_status text NOT NULL DEFAULT 'pending',
  resend_email_id text,
  last_error text,
  attempt_count integer NOT NULL DEFAULT 0,
  last_attempt_at timestamptz,
  accepted_at timestamptz,
  processing_lease_owner text,
  processing_lease_expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS email_operations_idempotency_uidx
  ON gift_card_internal.email_operations (idempotency_key);
CREATE INDEX IF NOT EXISTS email_operations_purchase_idx
  ON gift_card_internal.email_operations (purchase_id);
CREATE INDEX IF NOT EXISTS email_operations_status_idx
  ON gift_card_internal.email_operations (send_status);

CREATE TABLE IF NOT EXISTS gift_card_internal.stripe_webhook_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_event_id text NOT NULL,
  event_type text NOT NULL,
  checkout_session_id text,
  processing_status text NOT NULL DEFAULT 'received',
  handler_http_status integer,
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz
);

CREATE UNIQUE INDEX IF NOT EXISTS stripe_webhook_events_event_uidx
  ON gift_card_internal.stripe_webhook_events (stripe_event_id);
CREATE INDEX IF NOT EXISTS stripe_webhook_events_session_idx
  ON gift_card_internal.stripe_webhook_events (checkout_session_id);

CREATE TABLE IF NOT EXISTS gift_card_internal.maintenance_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action text NOT NULL,
  actor text NOT NULL,
  target_type text NOT NULL,
  target_id text NOT NULL,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS maintenance_audit_target_idx
  ON gift_card_internal.maintenance_audit_log (target_id);

-- Sécurité Supabase : ne pas exposer ce schéma via Data API / PostgREST
REVOKE ALL ON SCHEMA gift_card_internal FROM PUBLIC;
REVOKE ALL ON ALL TABLES IN SCHEMA gift_card_internal FROM PUBLIC;

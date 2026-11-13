ALTER TABLE "gift_card_internal"."stripe_purchases"
  ADD COLUMN IF NOT EXISTS "buyer_full_name" text,
  ADD COLUMN IF NOT EXISTS "buyer_first_name" text,
  ADD COLUMN IF NOT EXISTS "paid_at" timestamptz,
  ADD COLUMN IF NOT EXISTS "expires_at" timestamptz,
  ADD COLUMN IF NOT EXISTS "validity_rule_version" text;

ALTER TABLE "gift_card_internal"."gift_cards"
  ADD COLUMN IF NOT EXISTS "document_locale" text NOT NULL DEFAULT 'fr',
  ADD COLUMN IF NOT EXISTS "paid_at" timestamptz,
  ADD COLUMN IF NOT EXISTS "expires_at" timestamptz,
  ADD COLUMN IF NOT EXISTS "validity_rule_version" text;

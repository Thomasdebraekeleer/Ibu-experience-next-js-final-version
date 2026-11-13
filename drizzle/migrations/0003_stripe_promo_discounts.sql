ALTER TABLE "gift_card_internal"."stripe_purchases"
  ADD COLUMN IF NOT EXISTS "discount_amount_cents" integer,
  ADD COLUMN IF NOT EXISTS "stripe_promotion_code_ids" jsonb,
  ADD COLUMN IF NOT EXISTS "stripe_coupon_ids" jsonb;

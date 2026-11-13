-- Reprise webhook (leases) + contenu e-mail figé pour retries Resend
ALTER TABLE gift_card_internal.stripe_webhook_events
  ADD COLUMN IF NOT EXISTS processing_lease_owner text,
  ADD COLUMN IF NOT EXISTS processing_lease_expires_at timestamptz,
  ADD COLUMN IF NOT EXISTS processing_attempts integer NOT NULL DEFAULT 0;

ALTER TABLE gift_card_internal.email_operations
  ADD COLUMN IF NOT EXISTS email_subject text,
  ADD COLUMN IF NOT EXISTS email_html text,
  ADD COLUMN IF NOT EXISTS email_text text,
  ADD COLUMN IF NOT EXISTS content_frozen_at timestamptz,
  ADD COLUMN IF NOT EXISTS from_email text,
  ADD COLUMN IF NOT EXISTS reply_to_email text;

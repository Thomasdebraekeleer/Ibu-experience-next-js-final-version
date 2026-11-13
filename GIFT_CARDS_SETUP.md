# Bons cadeaux IBÙ Experience — configuration et exploitation

Ce document décrit l’automatisation **Stripe Payment Links → webhook → PDF → e-mail Resend**, avec persistance **PostgreSQL (Supabase)** et traitements **Next.js sur Vercel**. Aucun accès aux données depuis le navigateur.

## Conditions de lancement V1

- Une seule ligne, quantité **1**, devise **EUR**, sans remise ni taxe additionnelle sur le lien.
- Émission uniquement si `payment_status === "paid"`.
- Filtrage strict par **`price_id`** (allowlist).
- Offres **265 €** et **315 €** : conditions commerciales **non validées** (crédit vs prestation non tranché) → `needs_review` tant que `GIFT_CARD_ALLOW_PENDING_COMMERCIAL` n’est pas activé.
- **Validité** : 12 mois calendaires après **paiement confirmé** (`paid_at` Stripe), fuseau **Europe/Brussels** — voir `GIFT_CARD_REAL_PURCHASE_VALIDATION.md`.
- **PDF** : modèles Canva servis depuis `src/server/gift-cards/pdf/templates/` (copie déployable des fichiers `public/assets/PDF/`).
- Pas de validité, remboursement, utilisation partielle ni intégration Lodgify dans cette V1.

## Architecture

| Composant | Rôle |
|-----------|------|
| `src/config/gift-cards/catalog.ts` | Offres, montants, Payment Links |
| `POST /api/webhooks/stripe` | Webhook Stripe (corps brut, signature) |
| Schéma SQL `gift_card_internal` | Achats, bons, envois, audit (non exposé Supabase) |
| `pdf-lib` | Génération PDF serveur Node |
| Resend (ou mode `mock`) | Envoi e-mail + pièce jointe |
| `tsx scripts/gift-card-maintenance.ts` | Opérations serveur (CLI, pas d’UI admin) |

## Supabase — connexions

Dans le projet Supabase :

1. **Settings → Database → Connection string**
2. **Application (Vercel)** : **Transaction pooler** (souvent port **6543**) → `DATABASE_URL`
   - Le client utilise `postgres` avec **`prepare: false`** (obligatoire avec PgBouncer transaction mode).
3. **Migrations / CLI** : **Direct connection** ou **Session pooler** (port **5432**) → `DATABASE_MIGRATION_URL`

Ne jamais commiter les chaînes complètes. Révoquer l’accès `anon` / `authenticated` sur le schéma `gift_card_internal` (inclus dans la migration SQL).

### Migrations

```bash
# Après avoir renseigné DATABASE_MIGRATION_URL (ou DATABASE_URL)
npm run db:migrate
```

- Ne **pas** exécuter automatiquement en preview/build.
- Ordre déploiement : migrations → variables Vercel → webhook Stripe.

## Variables d’environnement

Voir `.env.example`. Résumé :

| Variable | Usage |
|----------|--------|
| `DATABASE_URL` | Runtime app (pooler transactionnel) |
| `DATABASE_MIGRATION_URL` | `npm run db:migrate` |
| `STRIPE_SECRET_KEY` | API Stripe |
| `STRIPE_WEBHOOK_SECRET` | Signature webhook (`whsec_…`) |
| `STRIPE_EXPECTED_LIVEMODE` | `test` ou `live` |
| `GIFT_CARD_STRIPE_PRICE_ID_*` | Allowlist des 4 prix |
| `GIFT_CARD_EMAIL_MODE` | `mock` (défaut), `resend`, `resend_allowlisted` |
| `RESEND_API_KEY` | Si mode Resend |
| `GIFT_CARD_FROM_EMAIL` | ex. `IBU Experience <no-reply@ibu-experience.be>` |
| `GIFT_CARD_REPLY_TO_EMAIL` | `info@ibu-experience.be` |

Domaine d’envoi : **ibu-experience.be** (vérification Resend sur ce domaine, pas de sous-domaine imposé).

## Stripe

### Identifiants à récupérer

Pour chaque Payment Link (50, 100, 265, 315 €) :

- `price_…` associé au lien → variables `GIFT_CARD_STRIPE_PRICE_ID_*`
- (Optionnel) `plink_…` → `GIFT_CARD_STRIPE_PAYMENT_LINK_ID_*`

### Webhook production

URL (domaine canonique `https://ibu-experience.be`) :

```text
https://ibu-experience.be/api/webhooks/stripe
```

Événements :

- `checkout.session.completed`
- `checkout.session.async_payment_succeeded`
- `checkout.session.async_payment_failed` (recommandé)

Le **secret de signature** du endpoint production est différent de celui fourni par **Stripe CLI** en local.

### Local — Stripe CLI

```bash
stripe listen --forward-to http://localhost:3000/api/webhooks/stripe
```

Copier le `whsec_…` affiché → `STRIPE_WEBHOOK_SECRET` dans `.env.local`.

Déclencher un test (après configuration DB + price IDs) :

```bash
stripe trigger checkout.session.completed
```

## Resend

- Vérifier **ibu-experience.be** (DNS SPF/DKIM).
- En **développement** : laisser `GIFT_CARD_EMAIL_MODE=mock` (fichiers dans `.gift-card-outbox/`).
- Pour tester Resend sans risque : `GIFT_CARD_EMAIL_MODE=resend_allowlisted` + `GIFT_CARD_TEST_RECIPIENT_ALLOWLIST`.

Statut d’envoi en base : **`accepted`** = accepté par l’API Resend (pas « livré »). Livraison optionnelle via webhook Resend (non implémenté en V1).

### Idempotence Resend (24 h)

Clé stable : `gift-card-email/{checkout_session_id}/initial`. Après 24 h, utiliser la **base** et la procédure de renvoi manuel (`resend` CLI) avant de réutiliser une clé.

## Vercel

1. Projet Supabase dédié (test vs prod).
2. `DATABASE_URL` = pooler transactionnel sur **Production** et **Preview** (bases séparées recommandées).
3. `STRIPE_EXPECTED_LIVEMODE=live` en production, `test` en preview.
4. `npm run gift-card:maintenance production-check` avant activation.

## Maintenance (CLI)

```bash
npm run gift-card:maintenance -- lookup-code --code IBU-XXXX-XXXX-XXXX
npm run gift-card:maintenance -- lookup-session --session cs_test_...
npm run gift-card:maintenance -- list-review
npm run gift-card:maintenance -- list-email-problems
npm run gift-card:maintenance -- redeem --code IBU-... --note "Réservation Mehaignoul"
npm run gift-card:maintenance -- suspend --code IBU-... --reason "Remboursement Stripe"
npm run gift-card:maintenance -- resend --session cs_... --suffix 2026-03-24T12-00
npm run gift-card:maintenance -- production-check
```

Renvoi manuel : **même PDF et même code**, nouvelle ligne `email_operations` + clé d’idempotence unique.

## Aperçus locaux

```bash
npm run gift-card:preview
```

Génère des **spécimens** dans `gift-card-samples/` (PDF + HTML + texte, FR et NL-BE).

## Reprise après incident

| Situation | Action |
|-----------|--------|
| Webhook Stripe 500 (erreur transitoire) | Stripe réessaie ; vérifier logs Vercel ; `list-email-problems` |
| Bon émis, e-mail `failed` | `resend` CLI avec suffix unique |
| `unknown` (timeout Resend) | Vérifier dashboard Resend ; ne pas réexpédier aveuglément si accepté |
| `needs_review` | Corriger cause ; traitement manuel documenté côté métier |
| Crash après insert bon, avant e-mail | Retry webhook si événement `failed` en base, ou `resend` |

Les octets PDF sont stockés en **`gift_cards.pdf_bytes`** (restitution identique au renvoi).

## Checklist mise en production

- [ ] Projet Supabase prod + `npm run db:migrate`
- [ ] `DATABASE_URL` pooler sur Vercel
- [ ] 4 `GIFT_CARD_STRIPE_PRICE_ID_*` (live)
- [ ] `STRIPE_EXPECTED_LIVEMODE=live`
- [ ] Webhook Stripe pointant vers `https://ibu-experience.be/api/webhooks/stripe`
- [ ] Resend : domaine vérifié, `GIFT_CARD_EMAIL_MODE=resend`
- [ ] Décisions commerciales 265/315 € ou blocage explicite
- [ ] `npm run gift-card:maintenance production-check` → succès
- [ ] Paiement test live contrôlé + contrôle PDF/e-mail

## Décisions commerciales encore requises

Avant émission automatique des offres **265 €** et **315 €** :

- Nature exacte : crédit vs prestation incluse
- Conditions d’utilisation, validité, cocons éligibles
- Politique remboursement / litige / chargeback

Tant qu’elles ne sont pas validées, ces achats payés tombent en **`needs_review`** (aucun bon à valeur supposée).

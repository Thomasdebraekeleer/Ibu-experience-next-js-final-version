# Validation par achat réel (contrôlé)

Ce guide prépare **votre** achat live de validation. L’agent n’effectue pas le paiement.

## Prérequis (Vercel / production)

| Variable | Valeur attendue |
|----------|-----------------|
| `STRIPE_SECRET_KEY` | `sk_live_…` |
| `STRIPE_EXPECTED_LIVEMODE` | `live` |
| `STRIPE_WEBHOOK_SECRET` | secret du endpoint production |
| `DATABASE_URL` | pooler transactionnel Supabase `:6543` |
| `GIFT_CARD_STRIPE_PRICE_ID_*` | prix live des offres utilisées |
| `GIFT_CARD_EMAIL_MODE` | `resend_allowlisted` pendant la validation |
| `GIFT_CARD_TEST_RECIPIENT_ALLOWLIST` | **votre** adresse e-mail uniquement |
| `RESEND_API_KEY` | présent |

Exécuter en local (sans afficher les secrets) :

```bash
npm run db:migrate
npm run gift-card:audit-config
```

`resend_allowlisted` n’envoie qu’aux adresses listées — les autres achats reçoivent un blocage volontaire jusqu’au passage à `GIFT_CARD_EMAIL_MODE=resend` pour l’ouverture générale.

## Offre recommandée pour ce test

- **50 € ou 100 €** (`credit_50` / `credit_100`) — offres déjà validées commercialement.
- **265 € / 315 €** : toujours en `pending_validation` → `needs_review` sans override ; décision crédit/prestation non tranchée.

## Langue du PDF et de l’e-mail

| Parcours | PDF | E-mail |
|----------|-----|--------|
| FR | modèle `carte-cadeau-fr.pdf` | français |
| NL (site) | modèle `carte-cadeau-en.pdf` | anglais |

Transmission fiable (sans état navigateur) :

1. **Payment Link** : paramètre Stripe `?locale=nl` pour le parcours néerlandais, ou repli FR.
2. **Optionnel** : métadonnée `gift_card_locale=nl` sur la session (configuration Payment Link / session).
3. **Optionnel** : `client_reference_id=nl` ou `fr` si vous l’ajoutez au lien côté site.

Collecte du **nom acheteur** : activer « Nom » sur le Payment Link / Checkout Stripe (Dashboard). Sans nom : e-mail « Bonjour, » / « Hello, ». Le champ **FROM** de la carte reste vide (PDF remplissable).

## Avant l’achat

1. Déployer la branche avec migration `0002_validity_buyer_template.sql` appliquée.
2. Vérifier les aperçus locaux : `npm run gift-card:preview` → dossier `gift-card-samples/` (`validation-credit_50-fr.pdf`, e-mails `.html`).
3. Confirmer que votre adresse est seule dans `GIFT_CARD_TEST_RECIPIENT_ALLOWLIST`.

## Pendant l’achat

1. Utiliser le Payment Link **50 ou 100 €** live.
2. Saisir **votre** adresse e-mail allowlistée et un nom de test si vous vérifiez la personnalisation.
3. Finaliser le paiement carte (live).

## Après l’achat — contrôles

Sans modifier les achats existants, inspecter via CLI (lecture seule) :

```bash
npm run gift-card:maintenance -- lookup-session <stripe_checkout_session_id>
```

Vérifier :

- [ ] Webhook reçu (`stripe_webhook_events` → `processed`)
- [ ] Un seul bon / un seul code (`gift_cards` unique par `purchase_id`)
- [ ] `paid_at` = confirmation paiement Stripe (pas date session ou PDF)
- [ ] `expires_at` = +12 mois calendaires (Europe/Brussels)
- [ ] PDF : couverture Canva intacte, verso avec GIFT / VALIDITY remplis, champs TO / FROM / MESSAGE vides et remplissables
- [ ] E-mail reçu dans la boîte allowlistée (pas de mode mock)
- [ ] **Re-livraison** du même `event.id` depuis Stripe Dashboard → pas de doublon (idempotence)

## Après validation réussie — ouverture clients

1. Passer `GIFT_CARD_EMAIL_MODE=resend`.
2. Retirer ou élargir l’allowlist (plus nécessaire en mode `resend`).
3. Ne pas activer `GIFT_CARD_ALLOW_PENDING_COMMERCIAL=true` en production.

## Statut

- **Production validée** : uniquement après les cases ci-dessus cochées avec preuves (captures, IDs Stripe, code bon).

## Récupération — commande 100 % promo sans e-mail

Si une session live a été **finalisée** (`complete`) avec promo à 100 % (`no_payment_required`) mais aucun bon/e-mail :

1. **Diagnostic** (lecture seule Stripe + base) :

```bash
npm run gift-card:maintenance -- diagnose-session --session cs_live_...
```

Vérifier : `paymentStatus`, remise ligne, e-mail acheteur, événements webhook `processed/ignored`, absence de bon.

2. **Reprocess direct** (sans rejouer tous les webhooks) — si **aucun bon** n’existe :

```bash
npm run gift-card:maintenance -- reprocess-session --session cs_live_...
npm run gift-card:maintenance -- reprocess-session --session cs_live_... --confirm
```

Respecte `resend_allowlisted` : seule votre adresse autorisée reçoit l’e-mail.

3. **Rejeu Stripe optionnel** — si événement marqué `processed`/`ignored` sans livraison :

```bash
npm run gift-card:maintenance -- reopen-webhooks --session cs_live_...
```

Puis renvoyer l’événement depuis le Dashboard Stripe (une seule session ciblée).

**Ne pas** exécuter sans la référence exacte `cs_live_…`. **Ne pas** créer un second bon si `gift_card_already_exists`.

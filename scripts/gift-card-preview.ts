import { loadEnvLocal } from "./load-env-local";
loadEnvLocal();

import fs from "node:fs";
import path from "node:path";
import { GIFT_CARD_CATALOG } from "../src/config/gift-cards/catalog";
import { buildGiftCardEmail } from "../src/server/gift-cards/email/templates";
import { generateGiftCardCode } from "../src/server/gift-cards/code";
import { generateGiftCardPdf } from "../src/server/gift-cards/pdf/generate";
import { computeGiftCardExpiresAt } from "../src/server/gift-cards/validity";

async function main() {
  const outDir = path.join(process.cwd(), "gift-card-samples");
  fs.mkdirSync(outDir, { recursive: true });

  const paidAt = new Date("2025-11-13T10:00:00.000Z");
  const expiresAt = computeGiftCardExpiresAt(paidAt);

  const showcase = [
    { offerId: "credit_50" as const, siteLocale: "fr" as const, documentLocale: "fr" as const },
    { offerId: "credit_100" as const, siteLocale: "fr" as const, documentLocale: "fr" as const },
    { offerId: "credit_50" as const, siteLocale: "nl-BE" as const, documentLocale: "en" as const },
  ];

  for (const item of showcase) {
    const offer = GIFT_CARD_CATALOG.find((o) => o.offerId === item.offerId)!;
    const code = generateGiftCardCode();
    const pdf = await generateGiftCardPdf({
      code,
      offerId: offer.offerId,
      nominalAmountCents: offer.nominalAmountCents,
      currency: offer.currency,
      documentLocale: item.documentLocale,
      paidAt,
      expiresAt,
      specimen: true,
    });

    const base = `validation-${offer.offerId}-${item.siteLocale}`;
    fs.writeFileSync(path.join(outDir, `${base}.pdf`), pdf.bytes);

    const email = buildGiftCardEmail({
      siteLocale: item.siteLocale,
      buyerFullName: "Alex Martin",
      buyerFirstName: null,
      code,
      nominalAmountCents: offer.nominalAmountCents,
      currency: offer.currency,
      pdfFilename: pdf.filename,
      paidAt,
      expiresAt,
    });

    fs.writeFileSync(path.join(outDir, `${base}.html`), email.html);
    fs.writeFileSync(path.join(outDir, `${base}.txt`), email.text);
  }

  console.log(`Validation previews written to ${outDir}`);
  console.log("Inspect: validation-credit_50-fr.pdf, validation-credit_50-nl-BE.pdf (EN doc)");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

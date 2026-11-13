import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { getOfferById } from "@/config/gift-cards/catalog";
import type { GiftCardDocumentLocale } from "../document-locale";
import { formatGiftCardDate, formatValiditySentence } from "../validity";
import { CANVA_VERSO_LAYOUT } from "./layout";

const VERSO_TEXT_COLOR = rgb(0.98, 0.97, 0.92);

export type GiftCardPdfInput = {
  code: string;
  offerId: string;
  nominalAmountCents: number;
  currency: string;
  documentLocale: GiftCardDocumentLocale;
  paidAt: Date;
  expiresAt: Date;
  specimen?: boolean;
};

export type GiftCardPdfResult = {
  bytes: Buffer;
  sha256: string;
  filename: string;
};

function templatePath(documentLocale: GiftCardDocumentLocale): string {
  const file =
    documentLocale === "en" ? "carte-cadeau-en.pdf" : "carte-cadeau-fr.pdf";
  return path.join(
    process.cwd(),
    "src",
    "server",
    "gift-cards",
    "pdf",
    "templates",
    file
  );
}

function formatMoney(
  cents: number,
  currency: string,
  documentLocale: GiftCardDocumentLocale
): string {
  const intl = documentLocale === "en" ? "en-GB" : "fr-BE";
  return new Intl.NumberFormat(intl, {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}

function giftLine(
  documentLocale: GiftCardDocumentLocale,
  amount: string
): string {
  if (documentLocale === "en") {
    return `IBÙ Experience gift card — ${amount}`;
  }
  return `Carte cadeau IBÙ Experience — ${amount}`;
}

export async function generateGiftCardPdf(
  input: GiftCardPdfInput
): Promise<GiftCardPdfResult> {
  const offer = getOfferById(input.offerId);
  if (!offer) {
    throw new Error(`Unknown offer: ${input.offerId}`);
  }

  const templateFile = templatePath(input.documentLocale);
  if (!fs.existsSync(templateFile)) {
    throw new Error(`Gift card template missing: ${templateFile}`);
  }

  const templateBytes = fs.readFileSync(templateFile);
  const pdfDoc = await PDFDocument.load(templateBytes, { updateMetadata: false });
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const page = pdfDoc.getPages()[CANVA_VERSO_LAYOUT.pageIndex];
  if (!page) {
    throw new Error("Gift card template page 2 missing");
  }

  const amount = formatMoney(
    input.nominalAmountCents,
    input.currency,
    input.documentLocale
  );

  const giftText = giftLine(input.documentLocale, amount);
  const validityText = formatValiditySentence(
    input.paidAt,
    input.expiresAt,
    input.documentLocale
  );

  page.drawText(giftText, {
    x: CANVA_VERSO_LAYOUT.valueX,
    y: CANVA_VERSO_LAYOUT.lineBaselines.gift,
    size: CANVA_VERSO_LAYOUT.fontSize,
    font,
    color: VERSO_TEXT_COLOR,
  });

  page.drawText(validityText, {
    x: CANVA_VERSO_LAYOUT.valueX,
    y: CANVA_VERSO_LAYOUT.lineBaselines.validity,
    size: CANVA_VERSO_LAYOUT.fontSize - 0.5,
    font,
    color: VERSO_TEXT_COLOR,
  });

  const purchaseShort = formatGiftCardDate(input.paidAt, input.documentLocale);
  const codeLine = `Code ${input.code} · ${purchaseShort}`;
  const codeSize = CANVA_VERSO_LAYOUT.codeFontSize;
  const codeWidth = font.widthOfTextAtSize(codeLine, codeSize);
  const pageWidth = page.getWidth();
  page.drawText(codeLine, {
    x: Math.max(CANVA_VERSO_LAYOUT.valueX, (pageWidth - codeWidth) / 2),
    y: CANVA_VERSO_LAYOUT.codeY,
    size: codeSize,
    font,
    color: VERSO_TEXT_COLOR,
  });

  if (input.specimen) {
    page.drawText(input.documentLocale === "en" ? "SPECIMEN" : "SPÉCIMEN", {
      x: 340,
      y: 265,
      size: 10,
      font,
      color: rgb(0.75, 0.15, 0.15),
    });
  }

  const bytes = Buffer.from(await pdfDoc.save());
  const sha256 = createHash("sha256").update(bytes).digest("hex");
  const lang = input.documentLocale === "en" ? "EN" : "FR";
  const filename = `IBU-gift-card-${lang}-${input.code.replace(/-/g, "")}.pdf`;

  return { bytes, sha256, filename };
}

export async function loadTemplateForVerification(
  documentLocale: GiftCardDocumentLocale
): Promise<boolean> {
  return fs.existsSync(templatePath(documentLocale));
}

/** Pour contrôle qualité : liste des champs remplissables attendus. */
export const GIFT_CARD_FILLABLE_FIELD_NAMES = CANVA_VERSO_LAYOUT.fillableFields.map(
  (f) => f.name
);

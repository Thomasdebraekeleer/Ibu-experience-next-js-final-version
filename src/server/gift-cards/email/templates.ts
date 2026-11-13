import type { GiftCardLocale } from "@/config/gift-cards/types";
import { escapeHtml } from "./escape";
import {
  formatEmailHelloLine,
  resolveEmailGreeting,
  type EmailGreeting,
} from "../buyer-name";
import type { GiftCardDocumentLocale } from "../document-locale";
import { giftCardDocumentLocale } from "../document-locale";
import { formatGiftCardDate } from "../validity";

export type GiftCardEmailContentInput = {
  siteLocale: GiftCardLocale;
  buyerFullName: string | null;
  buyerFirstName: string | null;
  code: string;
  nominalAmountCents: number;
  currency: string;
  pdfFilename: string;
  paidAt: Date;
  expiresAt: Date;
};

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

function buildFrenchEmail(
  greeting: EmailGreeting,
  hello: string,
  amount: string,
  purchaseDate: string,
  expiryDate: string,
  code: string
): { subject: string; html: string; text: string } {
  const subject = "Votre carte cadeau IBÙ Experience";

  const bodyText = `${hello}

Merci beaucoup pour votre commande de carte cadeau chez IBÙ Experience ! :)

Vous trouverez en pièce jointe votre bon cadeau de ${amount}, à imprimer et à offrir à l’heureux bénéficiaire.

Ce bon est valable douze mois à compter du ${purchaseDate}, jusqu’au ${expiryDate}.

Lorsque la personne souhaitera réserver son séjour, il lui suffira de me contacter à l’adresse info@ibu-experience.be, en indiquant le code du bon ${code}, le nom de l’acheteur et la date de séjour souhaitée.

Je reste bien entendu à votre disposition pour toute question.

Je vous souhaite une excellente journée et vous remercie pour votre confiance !

IBÙ Experience`;

  const safeHello = escapeHtml(hello);
  const html = `<!DOCTYPE html>
<html lang="fr">
  <body style="margin:0;padding:0;background:#FCF8E3;font-family:Helvetica,Arial,sans-serif;color:#053725;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FCF8E3;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" style="max-width:560px;background:#ffffff;border-radius:12px;padding:28px;border:1px solid rgba(5,55,37,0.12);">
            <tr><td style="font-size:16px;line-height:1.65;padding-bottom:8px;"><strong>${safeHello}</strong></td></tr>
            <tr><td style="font-size:15px;line-height:1.65;padding-bottom:12px;">Merci beaucoup pour votre commande de carte cadeau chez IBÙ Experience ! :)</td></tr>
            <tr><td style="font-size:15px;line-height:1.65;padding-bottom:12px;">Vous trouverez en pièce jointe votre bon cadeau de <strong>${escapeHtml(amount)}</strong>, à imprimer et à offrir à l’heureux bénéficiaire.</td></tr>
            <tr><td style="font-size:15px;line-height:1.65;padding-bottom:12px;">Ce bon est valable douze mois à compter du <strong>${escapeHtml(purchaseDate)}</strong>, jusqu’au <strong>${escapeHtml(expiryDate)}</strong>.</td></tr>
            <tr><td style="font-size:15px;line-height:1.65;padding-bottom:12px;">Lorsque la personne souhaitera réserver son séjour, il lui suffira de me contacter à <a href="mailto:info@ibu-experience.be" style="color:#053725;">info@ibu-experience.be</a>, en indiquant le code du bon <strong>${escapeHtml(code)}</strong>, le nom de l’acheteur et la date de séjour souhaitée.</td></tr>
            <tr><td style="font-size:15px;line-height:1.65;padding-bottom:12px;">Je reste bien entendu à votre disposition pour toute question.</td></tr>
            <tr><td style="font-size:15px;line-height:1.65;padding-bottom:4px;">Je vous souhaite une excellente journée et vous remercie pour votre confiance !</td></tr>
            <tr><td style="font-size:15px;line-height:1.65;padding-top:16px;font-weight:700;">IBÙ Experience</td></tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { subject, html, text: bodyText };
}

function buildEnglishEmail(
  greeting: EmailGreeting,
  hello: string,
  amount: string,
  purchaseDate: string,
  expiryDate: string,
  code: string
): { subject: string; html: string; text: string } {
  const subject = "Your IBÙ Experience gift card";

  const bodyText = `${hello}

Thank you so much for your gift card order with IBÙ Experience! :)

You will find your ${amount} gift voucher attached as a PDF, ready to print and give to that special someone.

This voucher is valid for twelve months from ${purchaseDate} until ${expiryDate}.

When the recipient is ready to book their stay, they can contact me at info@ibu-experience.be with the voucher code ${code}, the purchaser’s name, and their preferred dates.

I am of course happy to help if you have any questions.

Wishing you a wonderful day, and thank you for your trust!

IBÙ Experience`;

  const safeHello = escapeHtml(hello.replace(/,$/, ""));
  const html = `<!DOCTYPE html>
<html lang="en">
  <body style="margin:0;padding:0;background:#FCF8E3;font-family:Helvetica,Arial,sans-serif;color:#053725;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FCF8E3;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" style="max-width:560px;background:#ffffff;border-radius:12px;padding:28px;border:1px solid rgba(5,55,37,0.12);">
            <tr><td style="font-size:16px;line-height:1.65;padding-bottom:8px;"><strong>${safeHello}</strong></td></tr>
            <tr><td style="font-size:15px;line-height:1.65;padding-bottom:12px;">Thank you so much for your gift card order with IBÙ Experience! :)</td></tr>
            <tr><td style="font-size:15px;line-height:1.65;padding-bottom:12px;">You will find your <strong>${escapeHtml(amount)}</strong> gift voucher attached as a PDF, ready to print and give to that special someone.</td></tr>
            <tr><td style="font-size:15px;line-height:1.65;padding-bottom:12px;">This voucher is valid for twelve months from <strong>${escapeHtml(purchaseDate)}</strong> until <strong>${escapeHtml(expiryDate)}</strong>.</td></tr>
            <tr><td style="font-size:15px;line-height:1.65;padding-bottom:12px;">When the recipient is ready to book, they can contact me at <a href="mailto:info@ibu-experience.be" style="color:#053725;">info@ibu-experience.be</a> with the code <strong>${escapeHtml(code)}</strong>, the purchaser’s name, and their preferred dates.</td></tr>
            <tr><td style="font-size:15px;line-height:1.65;padding-bottom:12px;">I am happy to help if you have any questions.</td></tr>
            <tr><td style="font-size:15px;line-height:1.65;padding-bottom:4px;">Wishing you a wonderful day, and thank you for your trust!</td></tr>
            <tr><td style="font-size:15px;line-height:1.65;padding-top:16px;font-weight:700;">IBÙ Experience</td></tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { subject, html, text: bodyText };
}

export function buildGiftCardEmail(
  input: GiftCardEmailContentInput
): { subject: string; html: string; text: string } {
  const documentLocale = giftCardDocumentLocale(input.siteLocale);
  const amount = formatMoney(
    input.nominalAmountCents,
    input.currency,
    documentLocale
  );
  const purchaseDate = formatGiftCardDate(input.paidAt, documentLocale);
  const expiryDate = formatGiftCardDate(input.expiresAt, documentLocale);

  const greeting = resolveEmailGreeting({
    buyerFirstName: input.buyerFirstName,
    buyerFullName: input.buyerFullName,
    documentLocale,
  });
  const hello = formatEmailHelloLine(greeting, documentLocale);

  if (documentLocale === "en") {
    return buildEnglishEmail(
      greeting,
      hello,
      amount,
      purchaseDate,
      expiryDate,
      input.code
    );
  }

  return buildFrenchEmail(
    greeting,
    hello,
    amount,
    purchaseDate,
    expiryDate,
    input.code
  );
}

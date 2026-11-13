import { randomBytes } from "node:crypto";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/** Génère un code du type IBU-XXXX-XXXX-XXXX (sans 0/O/1/I). */
export function generateGiftCardCode(prefix = "IBU"): string {
  const groups = 3;
  const groupLength = 4;
  const parts: string[] = [];

  for (let g = 0; g < groups; g++) {
    const bytes = randomBytes(groupLength);
    let chunk = "";
    for (let i = 0; i < groupLength; i++) {
      chunk += ALPHABET[bytes[i]! % ALPHABET.length];
    }
    parts.push(chunk);
  }

  return `${prefix}-${parts.join("-")}`;
}

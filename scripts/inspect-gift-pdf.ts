import fs from "node:fs";
import { PDFDocument } from "pdf-lib";

async function inspect(file: string) {
  const bytes = fs.readFileSync(file);
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  console.log("\n===", file, "===");
  console.log("pages", doc.getPageCount());
  for (let i = 0; i < doc.getPageCount(); i++) {
    const p = doc.getPage(i);
    const { width, height } = p.getSize();
    console.log(`page ${i + 1}: ${width} x ${height}`);
  }
  try {
    const form = doc.getForm();
    const fields = form.getFields();
    console.log(
      "fields",
      fields.map((f) => ({ name: f.getName(), type: f.constructor.name }))
    );
  } catch (e) {
    console.log("form error", e);
  }
}

async function main() {
  await inspect("public/assets/PDF/Carte Cadeau - FR.pdf");
  await inspect("public/assets/PDF/Carte Cadeau - EN.pdf");
}

main();

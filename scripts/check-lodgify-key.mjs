import fs from "fs";
import path from "path";

const envPath = path.join(process.cwd(), ".env.local");
if (!fs.existsSync(envPath)) {
  console.log("MISSING_FILE");
  process.exit(2);
}
const content = fs.readFileSync(envPath, "utf8");
const line = content.split(/\r?\n/).find((l) => l.startsWith("LODGIFY_API_KEY="));
if (!line) {
  console.log("KEY_MISSING");
  process.exit(3);
}
const value = line.slice("LODGIFY_API_KEY=".length).trim().replace(/^["']|["']$/g, "");
console.log(value.length > 0 ? "KEY_SET" : "KEY_EMPTY");

import fs from "node:fs";
import path from "node:path";
import { loadEnvLocal } from "./load-env-local";
import {
  createMigrationSqlClient,
  sanitizeDatabaseUrlForLogs,
} from "../src/server/db/migrate-client";

loadEnvLocal();

const MIGRATION_LOCK_KEY = 90421103;

async function main() {
  const migrationsDir = path.join(process.cwd(), "drizzle", "migrations");
  const files = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  if (files.length === 0) {
    console.error("Aucune migration SQL trouvée.");
    process.exit(1);
  }

  const sql = createMigrationSqlClient();
  const url =
    process.env.DATABASE_MIGRATION_URL?.trim() ||
    process.env.DATABASE_URL?.trim() ||
    "";
  console.log(`Connexion migration: ${sanitizeDatabaseUrlForLogs(url)}`);

  const [{ locked }] = await sql<{ locked: boolean }[]>`
    SELECT pg_try_advisory_lock(${MIGRATION_LOCK_KEY}) AS locked
  `;
  if (!locked) {
    console.error("Une autre migration est déjà en cours.");
    process.exit(2);
  }

  try {
    await sql`CREATE SCHEMA IF NOT EXISTS gift_card_internal`;

    await sql`
      CREATE TABLE IF NOT EXISTS gift_card_internal.schema_migrations (
        filename text PRIMARY KEY,
        applied_at timestamptz NOT NULL DEFAULT now()
      )
    `;

    for (const file of files) {
      const [{ exists }] = await sql<{ exists: boolean }[]>`
        SELECT EXISTS (
          SELECT 1 FROM gift_card_internal.schema_migrations WHERE filename = ${file}
        ) AS exists
      `;

      if (exists) {
        console.log(`skip ${file}`);
        continue;
      }

      const fullPath = path.join(migrationsDir, file);
      const contents = fs.readFileSync(fullPath, "utf8");
      console.log(`apply ${file}`);

      await sql.begin(async (tx) => {
        await tx.unsafe(contents);
        await tx`
          INSERT INTO gift_card_internal.schema_migrations (filename) VALUES (${file})
        `;
      });
    }

    console.log("Migrations terminées.");
  } finally {
    await sql`SELECT pg_advisory_unlock(${MIGRATION_LOCK_KEY})`;
    await sql.end({ timeout: 5 });
  }
}

main().catch((err) => {
  const message = err instanceof Error ? err.message : String(err);
  console.error(message.replace(/postgres:\/\/[^@\s]+@/gi, "postgres://***@"));
  process.exit(1);
});

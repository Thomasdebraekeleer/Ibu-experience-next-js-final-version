import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

type SqlClient = ReturnType<typeof postgres>;

let appSql: SqlClient | null = null;
let appDb: ReturnType<typeof drizzle<typeof schema>> | null = null;

/** Connexion application (Supabase Transaction pooler, prepare: false). */
export function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not configured");
  }
  if (!appSql) {
    appSql = postgres(url, {
      prepare: false,
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10,
    });
    appDb = drizzle(appSql, { schema });
  }
  return appDb!;
}

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim());
}

export async function closeAppDb(): Promise<void> {
  if (appSql) {
    await appSql.end({ timeout: 5 });
    appSql = null;
    appDb = null;
  }
}

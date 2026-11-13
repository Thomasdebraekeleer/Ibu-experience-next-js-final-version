import postgres from "postgres";

/** Client SQL migrations (hors bundle Next, sans server-only). */
export function createMigrationSqlClient() {
  const url =
    process.env.DATABASE_MIGRATION_URL?.trim() ||
    process.env.DATABASE_URL?.trim();
  if (!url) {
    throw new Error("DATABASE_MIGRATION_URL or DATABASE_URL is not configured");
  }
  const isTransactionPooler =
    url.includes(":6543") ||
    (url.includes("pooler.supabase.com") && url.includes("6543"));
  return postgres(url, {
    prepare: !isTransactionPooler,
    max: 1,
    connect_timeout: 15,
  });
}

export function sanitizeDatabaseUrlForLogs(url: string): string {
  try {
    const u = new URL(url);
    const user = u.username ? `${u.username.slice(0, 4)}…` : "∅";
    return `${u.protocol}//${user}@${u.hostname}:${u.port || "5432"}${u.pathname}`;
  } catch {
    return "(url invalide)";
  }
}

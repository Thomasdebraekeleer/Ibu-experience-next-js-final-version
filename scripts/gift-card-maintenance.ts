import { loadEnvLocal } from "./load-env-local";
loadEnvLocal();

import { assertGiftCardProductionReady } from "../src/server/gift-cards/config-status";

function usage() {
  console.log(`Usage:
  tsx scripts/gift-card-maintenance.ts lookup-code --code IBU-... 
  tsx scripts/gift-card-maintenance.ts lookup-session --session cs_...
  tsx scripts/gift-card-maintenance.ts list-review
  tsx scripts/gift-card-maintenance.ts list-email-problems
  tsx scripts/gift-card-maintenance.ts redeem --code IBU-... [--note text]
  tsx scripts/gift-card-maintenance.ts suspend --code IBU-... --reason text
  tsx scripts/gift-card-maintenance.ts resend --session cs_... --suffix unique-id
  tsx scripts/gift-card-maintenance.ts diagnose-session --session cs_...
  tsx scripts/gift-card-maintenance.ts reprocess-session --session cs_... [--confirm]
  tsx scripts/gift-card-maintenance.ts reopen-webhooks --session cs_...
  tsx scripts/gift-card-maintenance.ts production-check`);
}

function sanitizeForCli(value: unknown): unknown {
  if (!value || typeof value !== "object") return value;
  if (Buffer.isBuffer(value)) {
    return { byteLength: value.length };
  }
  if (Array.isArray(value)) return value.map(sanitizeForCli);
  const obj = value as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(obj)) {
    if (key === "pdfBytes") {
      out[key] = Buffer.isBuffer(val) ? { byteLength: val.length } : val;
      continue;
    }
    out[key] = sanitizeForCli(val);
  }
  return out;
}

function arg(name: string): string | undefined {
  const idx = process.argv.indexOf(name);
  if (idx === -1) return undefined;
  return process.argv[idx + 1];
}

async function loadOps() {
  return import("../src/server/gift-cards/maintenance/ops");
}

async function main() {
  const cmd = process.argv[2];
  if (!cmd) {
    usage();
    process.exit(1);
  }

  if (cmd === "production-check") {
    const blockers = assertGiftCardProductionReady();
    if (blockers.length) {
      console.error("BLOCKED:\n" + blockers.map((b) => `- ${b}`).join("\n"));
      process.exit(2);
    }
    console.log("Production checks passed.");
    return;
  }

  const ops = await loadOps();

  switch (cmd) {
    case "lookup-code": {
      const code = arg("--code");
      if (!code) throw new Error("--code required");
      console.log(JSON.stringify(sanitizeForCli(await ops.lookupGiftCardByCode(code)), null, 2));
      break;
    }
    case "lookup-session": {
      const session = arg("--session");
      if (!session) throw new Error("--session required");
      console.log(
        JSON.stringify(sanitizeForCli(await ops.lookupGiftCardBySessionId(session)), null, 2)
      );
      break;
    }
    case "list-review":
      console.log(JSON.stringify(await ops.listNeedsReview(), null, 2));
      break;
    case "list-email-problems":
      console.log(JSON.stringify(await ops.listEmailProblems(), null, 2));
      break;
    case "redeem": {
      const code = arg("--code");
      if (!code) throw new Error("--code required");
      console.log(JSON.stringify(await ops.markGiftCardRedeemed(code, arg("--note")), null, 2));
      break;
    }
    case "suspend": {
      const code = arg("--code");
      const reason = arg("--reason") ?? "unspecified";
      if (!code) throw new Error("--code required");
      console.log(JSON.stringify(await ops.suspendGiftCard(code, reason), null, 2));
      break;
    }
    case "resend": {
      const session = arg("--session");
      const suffix = arg("--suffix");
      if (!session || !suffix) throw new Error("--session and --suffix required");
      console.log(JSON.stringify(await ops.resendGiftCardEmail(session, suffix), null, 2));
      break;
    }
    case "diagnose-session": {
      const session = arg("--session");
      if (!session) throw new Error("--session required");
      console.log(JSON.stringify(await ops.diagnoseFulfillmentSession(session), null, 2));
      break;
    }
    case "reprocess-session": {
      const session = arg("--session");
      if (!session) throw new Error("--session required");
      const confirm = process.argv.includes("--confirm");
      console.log(
        JSON.stringify(
          await ops.reprocessFulfillmentSession(session, { confirm }),
          null,
          2
        )
      );
      break;
    }
    case "reopen-webhooks": {
      const session = arg("--session");
      if (!session) throw new Error("--session required");
      console.log(JSON.stringify(await ops.reopenWebhookEventsForSession(session), null, 2));
      break;
    }
    default:
      usage();
      process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

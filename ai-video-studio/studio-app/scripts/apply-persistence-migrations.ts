import { Client } from "pg";
import { applyLivePersistenceMigration, buildLivePersistenceMigrationPlan } from "../src/server/live-persistence-migrations";

function databaseSslConfig() {
  if (process.env.DATABASE_SSL === "1") return { rejectUnauthorized: process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== "0" };
  return undefined;
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const plan = buildLivePersistenceMigrationPlan();

  if (dryRun) {
    console.log("live-persistence-migration dry-run", {
      version: plan.version,
      checksum: plan.checksum,
      statements: plan.statements.length
    });
    return;
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is required to apply live persistence migrations. Use --dry-run to inspect the migration without connecting.");
  }

  const client = new Client({
    connectionString,
    ssl: databaseSslConfig()
  });

  await client.connect();
  try {
    const result = await applyLivePersistenceMigration(client, plan);
    console.log("live-persistence-migration applied", result);
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

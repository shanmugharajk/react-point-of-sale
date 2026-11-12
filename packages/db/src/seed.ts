import { db } from "./db";
import { examples } from "./schema";

async function main(): Promise<void> {
  await db.delete(examples);
  const rows = await db
    .insert(examples)
    .values([{ name: "seed-check" }, { name: "seed-check-2" }])
    .returning();
  console.log(`seeded ${rows.length} example rows`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});

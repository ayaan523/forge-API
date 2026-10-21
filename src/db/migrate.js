import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pool } from "./pool.js";

const directory = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../migrations",
);
const down = process.argv[2] === "down";
const files = (await fs.readdir(directory))
  .filter((file) =>
    down
      ? file.endsWith(".down.sql")
      : file.endsWith(".sql") && !file.endsWith(".down.sql"),
  )
  .sort();
try {
  await pool.query(
    "CREATE TABLE IF NOT EXISTS schema_migrations (name text primary key, applied_at timestamptz not null default now())",
  );
  for (const file of files) {
    if (down && file !== files.at(-1)) continue;
    const exists = await pool.query(
      "SELECT 1 FROM schema_migrations WHERE name = $1",
      [file.replace(".down.sql", ".sql")],
    );
    if (!down && exists.rowCount) continue;
    await pool.query("BEGIN");
    try {
      await pool.query(await fs.readFile(path.join(directory, file), "utf8"));
      if (down)
        await pool.query("DELETE FROM schema_migrations WHERE name = $1", [
          file.replace(".down.sql", ".sql"),
        ]);
      else
        await pool.query("INSERT INTO schema_migrations (name) VALUES ($1)", [
          file,
        ]);
      await pool.query("COMMIT");
      console.log(`${down ? "Rolled back" : "Applied"} ${file}`);
    } catch (error) {
      await pool.query("ROLLBACK");
      throw error;
    }
  }
} catch (error) {
  console.error(`Migration failed: ${error.code || error.message || error}`);
  process.exitCode = 1;
} finally {
  await pool.end();
}

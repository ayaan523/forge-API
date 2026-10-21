import { app } from "./app.js";
import { env } from "./config/env.js";
import { closePool } from "./db/pool.js";
const server = app.listen(env.PORT, () =>
  console.log(`ForgeAPI listening on port ${env.PORT}`),
);
for (const signal of ["SIGINT", "SIGTERM"])
  process.once(signal, async () => {
    server.close(async () => {
      await closePool();
      process.exit(0);
    });
  });

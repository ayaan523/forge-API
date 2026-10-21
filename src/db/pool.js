import pg from "pg";
import { env } from "../config/env.js";

const { Pool } = pg;
export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
});
export const query = (text, params) => pool.query(text, params);
export async function closePool() {
  await pool.end();
}

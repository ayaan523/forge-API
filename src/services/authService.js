import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query } from "../db/pool.js";
import { env } from "../config/env.js";
import { AppError } from "../middleware/errors.js";

const publicUser = (row) => ({
  id: row.id,
  email: row.email,
  created_at: row.created_at,
});
export async function register({ email, password }) {
  const hash = await bcrypt.hash(password, 12);
  try {
    const { rows } = await query(
      "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at",
      [email, hash],
    );
    return publicUser(rows[0]);
  } catch (error) {
    if (error.code === "23505")
      throw new AppError(
        409,
        "An account with that email already exists",
        "EMAIL_EXISTS",
      );
    throw error;
  }
}
export async function login({ email, password }) {
  const { rows } = await query(
    "SELECT id, email, password_hash, created_at FROM users WHERE email = $1",
    [email],
  );
  const user = rows[0];
  if (!user || !(await bcrypt.compare(password, user.password_hash)))
    throw new AppError(401, "Invalid email or password", "INVALID_CREDENTIALS");
  return {
    user: publicUser(user),
    token: jwt.sign({ id: user.id, email: user.email }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
    }),
  };
}
export async function findUser(id) {
  const { rows } = await query(
    "SELECT id, email, created_at FROM users WHERE id = $1",
    [id],
  );
  if (!rows[0]) throw new AppError(404, "User not found", "NOT_FOUND");
  return publicUser(rows[0]);
}

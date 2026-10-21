import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { AppError } from "./errors.js";

export function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer "))
    return next(new AppError(401, "Authentication required", "UNAUTHORIZED"));
  try {
    req.user = jwt.verify(header.slice(7), env.JWT_SECRET);
    next();
  } catch {
    next(new AppError(401, "Invalid or expired token", "UNAUTHORIZED"));
  }
}

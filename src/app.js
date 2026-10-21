import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { env } from "./config/env.js";
import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/tasks.js";
import { notFound, errorHandler } from "./middleware/errors.js";
export const app = express();
app.set("trust proxy", env.NODE_ENV === "production" ? 1 : false);
app.use(helmet());
app.use(
  cors({
    origin:
      env.CORS_ORIGIN === "*"
        ? true
        : env.CORS_ORIGIN.split(",").map((value) => value.trim()),
  }),
);
app.use(express.json({ limit: "100kb" }));
app.get("/api/v1/health", (req, res) =>
  res.json({ data: { status: "ok", service: "forge-api" } }),
);
app.use(
  "/api/v1/auth",
  rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    limit: env.RATE_LIMIT_MAX,
    standardHeaders: "draft-8",
    legacyHeaders: false,
  }),
  authRoutes,
);
app.use("/api/v1/tasks", taskRoutes);
app.use(notFound);
app.use(errorHandler);

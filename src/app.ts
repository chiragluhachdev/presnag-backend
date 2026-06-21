import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { isAllowedOrigin } from "./config/env";
import { notFound, errorHandler } from "./middleware/error";
import { apiLimiter, authLimiter } from "./middleware/rateLimiters";

import authRoutes from "./routes/auth.routes";
import publicRoutes from "./routes/public.routes";
import vendorRoutes from "./routes/vendor.routes";
import adminRoutes from "./routes/admin.routes";
import uploadRoutes from "./routes/upload.routes";
import paymentRoutes from "./routes/payment.routes";

export function createApp() {
  const app = express();

  // Behind Railway's proxy — needed so rate-limit / req.ip see the real client IP.
  app.set("trust proxy", 1);

  app.use(helmet());
  app.use(compression());

  app.use(
    cors({
      origin: (origin, cb) =>
        isAllowedOrigin(origin) ? cb(null, true) : cb(new Error(`CORS blocked: ${origin}`)),
      credentials: true,
    })
  );
  // Capture the raw body so webhook routes can verify HMAC signatures.
  app.use(
    express.json({
      limit: "2mb",
      verify: (req, _res, buf) => {
        (req as any).rawBody = buf.toString();
      },
    })
  );

  // Lightweight request logger (skips health pings to keep logs clean).
  app.use((req, res, next) => {
    if (req.path === "/health" || req.path === "/api/health" || req.path === "/") return next();
    const start = Date.now();
    res.on("finish", () => {
      console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${Date.now() - start}ms`);
    });
    next();
  });

  // Health check — used by uptime monitors to keep the instance warm.
  const health = (_req: express.Request, res: express.Response) =>
    res.json({
      ok: true,
      service: "presnag-api",
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
    });
  app.get("/", health);
  app.get("/health", health);
  app.get("/api/health", health);

  app.use("/api/auth", authLimiter, authRoutes);
  app.use("/api/public", apiLimiter, publicRoutes);
  app.use("/api/vendor", apiLimiter, vendorRoutes);
  app.use("/api/admin", apiLimiter, adminRoutes);
  app.use("/api/uploads", apiLimiter, uploadRoutes);
  app.use("/api/payments", apiLimiter, paymentRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

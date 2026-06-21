import rateLimit from "express-rate-limit";

// Generous global cap — only trips abusive bots, never real customers.
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 200,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Too many requests, please slow down." },
});

// Strict cap on auth to stop brute force / credential stuffing.
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Too many attempts. Please try again later." },
});

// Order placement — lenient enough for real customers, caps spam.
export const orderLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Too many orders too quickly. Please wait a moment." },
});

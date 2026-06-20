import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: parseInt(process.env.PORT || "5008", 10),
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/presnag",
  JWT_SECRET: process.env.JWT_SECRET || "dev_secret",
  // Single-domain frontend (also used to build QR links to /vendor/:slug).
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "",
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "",
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder",
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || "placeholder",
  RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET || "",

  // ---- Cashfree (Payments / Easy Split) ----
  CASHFREE_ENV: process.env.CASHFREE_ENV || "sandbox", // "sandbox" | "production"
  CASHFREE_APP_ID: process.env.CASHFREE_APP_ID || "",
  CASHFREE_SECRET_KEY: process.env.CASHFREE_SECRET_KEY || "",
  CASHFREE_WEBHOOK_SECRET: process.env.CASHFREE_WEBHOOK_SECRET || "",
  // ---- Cashfree Payouts (separate credentials) ----
  CASHFREE_PAYOUT_CLIENT_ID: process.env.CASHFREE_PAYOUT_CLIENT_ID || "",
  CASHFREE_PAYOUT_CLIENT_SECRET: process.env.CASHFREE_PAYOUT_CLIENT_SECRET || "",

  // ---- Interakt (WhatsApp Business) ----
  INTERAKT_API_KEY: process.env.INTERAKT_API_KEY || "",
  INTERAKT_BASE_URL: process.env.INTERAKT_BASE_URL || "https://api.interakt.ai/v1/public/message/",
  INTERAKT_COUNTRY_CODE: process.env.INTERAKT_COUNTRY_CODE || "+91",
  // Exact approved template code-names + their language code from the Interakt dashboard.
  INTERAKT_TEMPLATE_ORDER_CONFIRMATION: process.env.INTERAKT_TEMPLATE_ORDER_CONFIRMATION || "order_confirmation_mo",
  INTERAKT_TEMPLATE_ORDER_DECLINED: process.env.INTERAKT_TEMPLATE_ORDER_DECLINED || "order_declined",
  INTERAKT_TEMPLATE_ORDER_CANCELLATION: process.env.INTERAKT_TEMPLATE_ORDER_CANCELLATION || "order_cancellation_q0",
  INTERAKT_TEMPLATE_VENDOR_NEW_ORDER: process.env.INTERAKT_TEMPLATE_VENDOR_NEW_ORDER || "vendor_new_order_fm",
  INTERAKT_TEMPLATE_LANG: process.env.INTERAKT_TEMPLATE_LANG || "en",
  // Public image URL for the template's image header (leave blank if the template has no media header).
  INTERAKT_TEMPLATE_HEADER_IMAGE:
    process.env.INTERAKT_TEMPLATE_HEADER_IMAGE || "https://www.presnag.com/widex.png",
};

export const cloudinaryEnabled = Boolean(
  env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET
);

// When Cashfree keys are absent (e.g. local dev) the app runs in a safe "demo"
// mode: onboarding / payout / payment calls are simulated instead of hitting Cashfree.
export const cashfreePgEnabled = Boolean(env.CASHFREE_APP_ID && env.CASHFREE_SECRET_KEY);
export const cashfreePayoutEnabled = Boolean(
  env.CASHFREE_PAYOUT_CLIENT_ID && env.CASHFREE_PAYOUT_CLIENT_SECRET
);
// Interakt WhatsApp is usable only when an API key is configured.
export const interaktEnabled = Boolean(env.INTERAKT_API_KEY);
// Razorpay is "enabled" only with real keys (not the placeholder defaults).
export const razorpayEnabled = Boolean(
  env.RAZORPAY_KEY_ID &&
    env.RAZORPAY_KEY_SECRET &&
    !env.RAZORPAY_KEY_ID.includes("placeholder") &&
    env.RAZORPAY_KEY_SECRET !== "placeholder"
);

// Allowed browser origin (the single frontend app). Extend if you add more.
export const allowedOrigins = [
  env.CLIENT_URL,
  "https://presnag.com",
  "https://www.presnag.com",
  "https://presnag.vercel.app",
];

// In local dev, accept any localhost port so the app works even if Vite
// bumps off 5173 (e.g. when another process already holds it).
export function isAllowedOrigin(origin?: string): boolean {
  if (!origin) return true; // non-browser clients (curl, server-to-server)
  if (allowedOrigins.includes(origin)) return true;
  // Any Vercel deployment (production + preview/branch URLs).
  if (/^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin)) return true;
  return /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);
}

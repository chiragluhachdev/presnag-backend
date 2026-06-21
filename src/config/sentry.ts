import * as Sentry from "@sentry/node";
import { env } from "./env";

export const sentryEnabled = Boolean(env.SENTRY_DSN);

/** Initialise Sentry only when a DSN is configured (zero overhead otherwise). */
export function initSentry() {
  if (!sentryEnabled) return;
  Sentry.init({
    dsn: env.SENTRY_DSN,
    environment: env.NODE_ENV,
    tracesSampleRate: 0, // no perf tracing on free tiers — errors only
  });
  console.log("[sentry] error tracking enabled");
}

/** Report a server error (no-op when Sentry is not configured). */
export function captureError(err: unknown) {
  if (sentryEnabled) Sentry.captureException(err);
}

import http from "http";
import mongoose from "mongoose";
import { createApp } from "./app";
import { connectDB } from "./config/db";
import { initIO } from "./realtime/io";
import { scheduleDailyPayout } from "./jobs/dailyPayout";
import { scheduleAutoCancel } from "./jobs/autoCancel";
import { scheduleReconcilePayments } from "./jobs/reconcilePayments";
import { initSentry } from "./config/sentry";
import { env } from "./config/env";

async function main() {
  initSentry(); // error tracking (no-op unless SENTRY_DSN is set)
  const app = createApp();
  const server = http.createServer(app);
  initIO(server);

  // Graceful shutdown — drain in-flight requests/sockets on Railway redeploys.
  function shutdown(signal: string) {
    console.log(`[server] ${signal} received — shutting down…`);
    server.close(() => {
      mongoose.connection.close(false).finally(() => process.exit(0));
    });
    // Hard exit if cleanup hangs.
    setTimeout(() => process.exit(1), 10000).unref();
  }
  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));

  // Bind the port FIRST so the platform (Render) detects a live service and the
  // /health route responds immediately — even before the DB is ready.
  server.listen(env.PORT, "0.0.0.0", () => {
    console.log(`[server] PreSnag API listening on :${env.PORT}`);
    console.log(`[server] Socket.IO ready, CORS → ${env.CLIENT_URL}`);
  });

  // Connect to MongoDB in the background, retrying so a slow/late DB never
  // blocks the deploy from going live.
  async function connectWithRetry(attempt = 1): Promise<void> {
    try {
      await connectDB();
    } catch (err) {
      const delay = Math.min(30000, attempt * 5000);
      console.error(`[db] connection failed (attempt ${attempt}) — retrying in ${delay / 1000}s`, err);
      setTimeout(() => connectWithRetry(attempt + 1), delay);
    }
  }
  await connectWithRetry();

  // Schedule the once-daily managed-vendor settlement payout.
  scheduleDailyPayout();

  // Auto-decline orders the vendor doesn't answer within the response window.
  scheduleAutoCancel();

  // Recover paid-but-unconfirmed orders if a webhook + verify both failed.
  scheduleReconcilePayments();
}

main().catch((err) => {
  console.error("[fatal]", err);
  process.exit(1);
});

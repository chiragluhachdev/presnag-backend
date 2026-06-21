import cron from "node-cron";
import { Order } from "../models/Order";
import { emitOrderStatus } from "../realtime/io";
import { notifyOrderCancelled } from "../notifications/orderWhatsapp";

// A new (paid/COD) order the vendor never accepts within this window is
// automatically declined so the customer isn't left waiting indefinitely.
export const AUTO_CANCEL_SECONDS = 180;

const AUTO_CANCEL_REASON = "Auto-cancelled — the restaurant didn't respond in time.";

/**
 * Cancel every order still in "received" past the response window.
 * Returns the number of orders cancelled. Each cancellation is broadcast so the
 * vendor dashboard and the customer's tracking screen update in real time.
 */
export async function runAutoCancel(): Promise<number> {
  const cutoff = new Date(Date.now() - AUTO_CANCEL_SECONDS * 1000);
  const candidates = await Order.find({
    status: "received",
    createdAt: { $lte: cutoff },
    // Only orders the vendor actually sees/alarms on (paid online or COD).
    $or: [{ paymentStatus: "paid" }, { paymentMethod: "COD" }],
  }).select("_id");

  let cancelled = 0;
  for (const c of candidates) {
    // Atomic guard: only cancel if STILL "received" — so a vendor accept that
    // landed in this window wins and we never clobber an accepted order.
    const order = await Order.findOneAndUpdate(
      { _id: c._id, status: "received" },
      { status: "cancelled", cancelledBy: "system", cancelReason: AUTO_CANCEL_REASON },
      { new: true }
    );
    if (!order) continue; // accepted/changed in the meantime
    cancelled++;
    emitOrderStatus(String(order.vendorId), order.orderNumber, order);
    notifyOrderCancelled(order.id).catch(() => {});
  }
  return cancelled;
}

/** Poll every 15s so an unanswered order is declined within ~15s of its deadline. */
export function scheduleAutoCancel() {
  cron.schedule("*/15 * * * * *", async () => {
    try {
      const n = await runAutoCancel();
      if (n) console.log(`[auto-cancel] declined ${n} unanswered order(s)`);
    } catch (err) {
      console.error("[auto-cancel] run failed", err);
    }
  });
  console.log(`[auto-cancel] watching for orders unanswered beyond ${AUTO_CANCEL_SECONDS}s`);
}

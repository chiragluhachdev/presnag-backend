import cron from "node-cron";
import { Order } from "../models/Order";
import { emitNewOrder, emitOrderStatus } from "../realtime/io";
import { notifyVendorNewOrder } from "../notifications/orderWhatsapp";
import { getPgOrderStatus } from "../services/cashfree";
import { getRazorpayOrderPaid } from "../services/razorpay";
import { cashfreePgEnabled, razorpayEnabled } from "../config/env";

// Safety net for "money taken but order never confirmed": if BOTH the frontend
// /verify call and the gateway webhook fail (network drop, closed tab, webhook
// misconfigured), an actually-paid order would otherwise sit "pending" forever.
// This job re-asks the gateway and confirms any such orders.

// Atomic pending→paid flip (mirrors confirmPaid). Returns the updated order if we won.
async function markPaid(orderId: string) {
  const updated = await Order.findOneAndUpdate(
    { _id: orderId, paymentStatus: "pending" },
    { paymentStatus: "paid" },
    { new: true }
  );
  if (!updated) return;
  emitNewOrder(String(updated.vendorId), updated);
  emitOrderStatus(String(updated.vendorId), updated.orderNumber, updated);
  notifyVendorNewOrder(String(updated._id)).catch(() => {});
  console.log(`[reconcile] recovered paid order ${updated.orderNumber}`);
}

export async function reconcilePendingPayments(): Promise<number> {
  // Give the normal flow ~2 min to confirm first; only look back a few hours
  // (gateways keep order status well beyond that, but old ones are abandoned).
  const now = Date.now();
  const orders = await Order.find({
    paymentStatus: "pending",
    paymentMethod: { $in: ["CASHFREE", "RAZORPAY"] },
    createdAt: { $lte: new Date(now - 2 * 60 * 1000), $gte: new Date(now - 6 * 60 * 60 * 1000) },
  })
    .select("_id orderNumber paymentMethod gatewayOrderId")
    .limit(100);

  let recovered = 0;
  for (const o of orders) {
    try {
      let paid = false;
      if (o.paymentMethod === "RAZORPAY") {
        if (!razorpayEnabled || !o.gatewayOrderId) continue;
        paid = (await getRazorpayOrderPaid(o.gatewayOrderId)).paid;
      } else {
        if (!cashfreePgEnabled) continue;
        paid = (await getPgOrderStatus(o.orderNumber)).paid;
      }
      if (paid) {
        await markPaid(String(o._id));
        recovered++;
      }
    } catch (err) {
      console.error(`[reconcile] check failed for ${o.orderNumber}`, err);
    }
  }
  return recovered;
}

/** Run reconciliation every 5 minutes (only when a real gateway is configured). */
export function scheduleReconcilePayments() {
  if (!cashfreePgEnabled && !razorpayEnabled) {
    console.log("[reconcile] no gateway configured — payment reconciliation disabled");
    return;
  }
  cron.schedule("*/5 * * * *", async () => {
    try {
      const n = await reconcilePendingPayments();
      if (n) console.log(`[reconcile] recovered ${n} paid-but-unconfirmed order(s)`);
    } catch (err) {
      console.error("[reconcile] run failed", err);
    }
  });
  console.log("[reconcile] payment reconciliation scheduled (every 5 min)");
}

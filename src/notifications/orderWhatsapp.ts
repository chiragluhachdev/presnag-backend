import { Order } from "../models/Order";
import { Vendor } from "../models/Vendor";
import { Notification } from "../models/Notification";
import { getSettings } from "../models/Setting";
import { interaktEnabled } from "../config/env";
import { sendOrderConfirmation, sendOrderCancelled, sendVendorNewOrder } from "../services/interakt";

// Shared gate: WhatsApp must be configured (env key) AND switched on by the admin.
async function whatsappOn(): Promise<boolean> {
  if (!interaktEnabled) return false;
  const settings = await getSettings();
  return !!settings.whatsappEnabled;
}

/** Record a notification attempt for the admin Activity panel. */
async function logActivity(entry: {
  type: "vendor_alert" | "confirmation" | "declined" | "cancellation";
  audience: "customer" | "vendor";
  status: "sent" | "failed";
  order: any;
  vendorName: string;
  recipient: string;
  detail?: string;
}) {
  try {
    await Notification.create({
      type: entry.type,
      audience: entry.audience,
      status: entry.status,
      orderNumber: entry.order.orderNumber,
      vendorId: entry.order.vendorId,
      vendorName: entry.vendorName,
      customerName: entry.order.customerName,
      recipient: entry.recipient,
      detail: entry.detail || "",
    });
  } catch (err) {
    console.error("[whatsapp] activity log failed", err);
  }
}

/**
 * Atomically claim a one-shot notification flag so concurrent paths can't double-send.
 * Returns the order if we won the claim.
 */
async function claim(orderId: string, field: "confirmationNotifiedAt" | "cancellationNotifiedAt" | "vendorNotifiedAt") {
  return Order.findOneAndUpdate(
    { _id: orderId, [field]: { $exists: false } },
    { [field]: new Date() },
    { new: true }
  );
}
async function releaseClaim(orderId: string, field: string) {
  await Order.updateOne({ _id: orderId }, { $unset: { [field]: "" } });
}

/** Customer order-confirmation — sent when the VENDOR ACCEPTS. Exactly once. Fire-and-forget. */
export async function notifyOrderConfirmation(orderId: string): Promise<void> {
  try {
    if (!(await whatsappOn())) return;
    const order = await claim(orderId, "confirmationNotifiedAt");
    if (!order) return;

    const vendor = await Vendor.findById(order.vendorId).select("name");
    const vendorName = vendor?.name || "the restaurant";
    try {
      await sendOrderConfirmation({
        phone: order.customerPhone,
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        restaurantName: vendorName,
        total: order.total,
      });
      console.log(`[whatsapp] confirmation sent for ${order.orderNumber}`);
      await logActivity({ type: "confirmation", audience: "customer", status: "sent", order, vendorName, recipient: order.customerPhone });
    } catch (err: any) {
      await releaseClaim(orderId, "confirmationNotifiedAt");
      console.error(`[whatsapp] confirmation failed for ${order.orderNumber}`, err);
      await logActivity({ type: "confirmation", audience: "customer", status: "failed", order, vendorName, recipient: order.customerPhone, detail: err?.message });
    }
  } catch (err) {
    console.error("[whatsapp] notifyOrderConfirmation error", err);
  }
}

/**
 * Customer cancellation — order_declined (rejected before acceptance) or
 * order_cancellation (cancelled after acceptance / by customer). Exactly once.
 */
export async function notifyOrderCancelled(orderId: string): Promise<void> {
  try {
    if (!(await whatsappOn())) return;
    const order = await claim(orderId, "cancellationNotifiedAt");
    if (!order) return;

    const vendor = await Vendor.findById(order.vendorId).select("name");
    const vendorName = vendor?.name || "the restaurant";
    const refundAmount = order.paymentStatus === "paid" && order.paymentMethod !== "COD" ? order.total : 0;
    // "Declined" = never accepted: system auto-decline, or a vendor declining a new order.
    // Everything else (vendor cancels an accepted order, or the customer cancels) = "cancellation".
    const wasAccepted = !!order.acceptedAt;
    const declined = order.cancelledBy === "system" || (order.cancelledBy === "vendor" && !wasAccepted);
    const type = declined ? "declined" : "cancellation";
    try {
      await sendOrderCancelled({
        phone: order.customerPhone,
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        restaurantName: vendorName,
        refundAmount,
        declined,
      });
      console.log(`[whatsapp] ${type} sent for ${order.orderNumber}`);
      await logActivity({ type, audience: "customer", status: "sent", order, vendorName, recipient: order.customerPhone });
    } catch (err: any) {
      await releaseClaim(orderId, "cancellationNotifiedAt");
      console.error(`[whatsapp] ${type} failed for ${order.orderNumber}`, err);
      await logActivity({ type, audience: "customer", status: "failed", order, vendorName, recipient: order.customerPhone, detail: err?.message });
    }
  } catch (err) {
    console.error("[whatsapp] notifyOrderCancelled error", err);
  }
}

/**
 * Vendor new-order alert — sent when the order is successfully placed (online paid
 * or COD), only if the vendor opted in. Exactly once. Fire-and-forget.
 */
export async function notifyVendorNewOrder(orderId: string): Promise<void> {
  try {
    if (!(await whatsappOn())) return;
    const order = await claim(orderId, "vendorNotifiedAt");
    if (!order) return;

    const vendor = await Vendor.findById(order.vendorId).select("name phone whatsappOrderAlerts");
    if (!vendor || !vendor.whatsappOrderAlerts || !vendor.phone) {
      // Not opted in / no number — release so it can fire if enabled later.
      await releaseClaim(orderId, "vendorNotifiedAt");
      return;
    }

    try {
      await sendVendorNewOrder({
        phone: vendor.phone,
        orderNumber: order.orderNumber,
        vendorName: vendor.name,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        orderType: order.orderType === "TAKE_AWAY" ? "Take Away" : "Dine In",
        total: order.total,
      });
      console.log(`[whatsapp] vendor-alert sent to ${vendor.name} for ${order.orderNumber}`);
      await logActivity({ type: "vendor_alert", audience: "vendor", status: "sent", order, vendorName: vendor.name, recipient: vendor.phone });
    } catch (err: any) {
      await releaseClaim(orderId, "vendorNotifiedAt");
      console.error(`[whatsapp] vendor alert failed for ${order.orderNumber}`, err);
      await logActivity({ type: "vendor_alert", audience: "vendor", status: "failed", order, vendorName: vendor.name, recipient: vendor.phone, detail: err?.message });
    }
  } catch (err) {
    console.error("[whatsapp] notifyVendorNewOrder error", err);
  }
}

import { Schema, model, InferSchemaType, Types } from "mongoose";

export const ORDER_STATUSES = [
  "received",
  "accepted",
  "preparing",
  "ready",
  "collected",
  "cancelled",
] as const;

const orderAddonSchema = new Schema(
  { group: { type: String, default: "" }, label: { type: String, required: true }, price: { type: Number, default: 0 } },
  { _id: false }
);

const orderItemSchema = new Schema(
  {
    itemId: { type: Types.ObjectId, ref: "MenuItem" },
    name: { type: String, required: true },
    price: { type: Number, required: true }, // per-unit price INCLUDING chosen add-ons
    qty: { type: Number, required: true, min: 1 },
    instructions: { type: String, default: "" },
    addons: { type: [orderAddonSchema], default: [] },
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    vendorId: { type: Types.ObjectId, ref: "Vendor", required: true, index: true },
    orderNumber: { type: String, required: true, unique: true, index: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    note: { type: String, default: "" },
    orderType: { type: String, enum: ["DINE_IN", "TAKE_AWAY"], default: "DINE_IN" },
    items: { type: [orderItemSchema], required: true },
    subtotal: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    couponCode: { type: String, default: "" },
    paymentMethod: { type: String, enum: ["COD", "RAZORPAY", "CASHFREE"], default: "CASHFREE" },
    paymentStatus: { type: String, enum: ["pending", "paid"], default: "pending" },
    // The payment gateway's order id (Cashfree order_id is our orderNumber; Razorpay returns its own).
    gatewayOrderId: { type: String, default: "" },
    status: { type: String, enum: ORDER_STATUSES, default: "received", index: true },
    pickupTime: { type: String, default: "" },

    // ---- Cancellation metadata ----
    cancelledBy: { type: String, enum: ["vendor", "system", "admin", "customer", ""], default: "" },
    cancelReason: { type: String, default: "" },

    // When the vendor accepted the order (drives confirmation + declined/cancelled distinction).
    acceptedAt: { type: Date },

    // WhatsApp send guards (each sends at most once).
    confirmationNotifiedAt: { type: Date },
    cancellationNotifiedAt: { type: Date },
    vendorNotifiedAt: { type: Date },

    // ---- Settlement (how this order's money reaches the vendor) ----
    settlementMode: { type: String, enum: ["MANAGED", "DIRECT"], default: "MANAGED" },
    // DIRECT orders settle instantly via split → not_applicable.
    // MANAGED orders wait for the once-daily payout → pending → settled.
    settlementStatus: {
      type: String,
      enum: ["not_applicable", "pending", "processing", "settled", "failed"],
      default: "not_applicable",
      index: true,
    },
    payoutId: { type: String, default: "" },
    settledAt: { type: Date },
    settlementRef: { type: String, default: "" }, // UTR / txn ref for manual settlement
  },
  { timestamps: true }
);

// Compound indexes for the hot query paths (vendor lists, admin finance,
// auto-cancel/reconcile crons, settlements). These avoid collection scans and
// in-memory sorts on createdAt as order volume grows.
orderSchema.index({ vendorId: 1, status: 1 });
orderSchema.index({ vendorId: 1, createdAt: -1 });
orderSchema.index({ paymentStatus: 1, createdAt: 1 });
orderSchema.index({ status: 1, createdAt: 1 });
orderSchema.index({ settlementMode: 1, paymentStatus: 1, settlementStatus: 1 });

export type OrderDoc = InferSchemaType<typeof orderSchema>;
export const Order = model("Order", orderSchema);

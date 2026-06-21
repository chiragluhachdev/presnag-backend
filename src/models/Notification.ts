import { Schema, model, InferSchemaType, Types } from "mongoose";

// A record of every WhatsApp notification the platform attempts — surfaced in the
// admin "Activity" panel so the admin can see all messaging activity at a glance.
const notificationSchema = new Schema(
  {
    // What happened: vendor_alert | confirmation | declined | cancellation
    type: { type: String, required: true },
    channel: { type: String, default: "whatsapp" },
    audience: { type: String, enum: ["customer", "vendor"], required: true },
    status: { type: String, enum: ["sent", "failed"], required: true },
    orderNumber: { type: String, index: true },
    vendorId: { type: Types.ObjectId, ref: "Vendor" },
    vendorName: { type: String, default: "" },
    customerName: { type: String, default: "" },
    recipient: { type: String, default: "" }, // phone the message went to
    detail: { type: String, default: "" },     // error text on failure, etc.
  },
  { timestamps: true }
);

// The admin Activity feed sorts newest-first — index createdAt to avoid scans.
notificationSchema.index({ createdAt: -1 });

export type NotificationDoc = InferSchemaType<typeof notificationSchema>;
export const Notification = model("Notification", notificationSchema);

import { env, interaktEnabled } from "../config/env";
import { genOrderNumber } from "../utils/helpers";
import { sendOrderConfirmation, sendOrderCancelled, sendVendorNewOrder } from "../services/interakt";

// One-off: send a test WhatsApp template.
//   npm run test:whatsapp -- <phone> [confirmation|declined|cancellation|vendor]
async function main() {
  const phone = process.argv[2] || "8130809374";
  const kind = (process.argv[3] || "confirmation").toLowerCase();
  const orderNumber = genOrderNumber();

  console.log("Interakt enabled:", interaktEnabled, "| lang:", env.INTERAKT_TEMPLATE_LANG);
  console.log(`Sending "${kind}" to +${env.INTERAKT_COUNTRY_CODE.replace("+", "")} ${phone}, order ${orderNumber}…`);

  if (kind === "confirmation") {
    await sendOrderConfirmation({ phone, orderNumber, customerName: "Chirag", restaurantName: "Farmao Cafe", total: 380 });
  } else if (kind === "declined") {
    await sendOrderCancelled({ phone, orderNumber, customerName: "Chirag", restaurantName: "Farmao Cafe", refundAmount: 380, declined: true });
  } else if (kind === "cancellation") {
    await sendOrderCancelled({ phone, orderNumber, customerName: "Chirag", restaurantName: "Farmao Cafe", refundAmount: 380, declined: false });
  } else if (kind === "vendor") {
    await sendVendorNewOrder({
      phone,
      orderNumber,
      vendorName: "Farmao Cafe",
      customerName: "Chirag",
      customerPhone: "9876543210",
      orderType: "Take Away",
      total: 380,
    });
  } else {
    console.error(`Unknown kind "${kind}". Use: confirmation | declined | cancellation | vendor`);
    process.exit(1);
  }
  console.log("✅ Interakt accepted the request (check WhatsApp on the number).");
}

main().catch((err) => {
  console.error("❌ Send failed:", err?.message || err);
  process.exit(1);
});

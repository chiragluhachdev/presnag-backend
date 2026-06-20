import { env } from "../config/env";

// Interakt WhatsApp Business — send an approved TEMPLATE message.
// Docs: POST https://api.interakt.ai/v1/public/message/  (Authorization: Basic <API_KEY>)

/** 10-digit national number (Interakt wants the country code passed separately). */
function nationalNumber(raw: string): string {
  const digits = (raw || "").replace(/\D/g, "");
  return digits.slice(-10);
}

interface SendTemplateArgs {
  phone: string;            // recipient phone (any format)
  templateName: string;     // approved template code-name
  languageCode: string;     // e.g. "en"
  bodyValues: string[];     // body variables {{1}}, {{2}}, …
  buttonValue?: string;     // dynamic URL button suffix (button index 0) — omit for static buttons
  headerImage?: string;     // image-header media URL — omit for text/no header
  callbackData?: string;    // optional tracking id echoed back in webhooks
}

/** Generic Interakt template sender. Throws on a non-2xx response. */
export async function sendTemplate(args: SendTemplateArgs): Promise<void> {
  const payload: Record<string, unknown> = {
    countryCode: env.INTERAKT_COUNTRY_CODE,
    phoneNumber: nationalNumber(args.phone),
    type: "Template",
    ...(args.callbackData ? { callbackData: args.callbackData } : {}),
    template: {
      name: args.templateName,
      languageCode: args.languageCode,
      ...(args.headerImage ? { headerValues: [args.headerImage] } : {}),
      bodyValues: args.bodyValues,
      ...(args.buttonValue ? { buttonValues: { "0": [args.buttonValue] } } : {}),
    },
  };

  const res = await fetch(env.INTERAKT_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${env.INTERAKT_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Interakt send failed (${res.status}): ${text}`);
  }
}

interface OrderConfirmationArgs {
  phone: string;
  orderNumber: string;    // {{1}} — also the track-button suffix
  customerName: string;   // {{2}}
  restaurantName: string; // {{3}}
  total: number;          // {{4}}
}

/** order_confirmation — sent to the customer when their order is confirmed. */
export async function sendOrderConfirmation(args: OrderConfirmationArgs): Promise<void> {
  await sendTemplate({
    phone: args.phone,
    templateName: env.INTERAKT_TEMPLATE_ORDER_CONFIRMATION,
    languageCode: env.INTERAKT_TEMPLATE_LANG,
    headerImage: env.INTERAKT_TEMPLATE_HEADER_IMAGE || undefined,
    bodyValues: [args.orderNumber, args.customerName, args.restaurantName, String(args.total)],
    buttonValue: args.orderNumber,
    callbackData: `order_${args.orderNumber}`,
  });
}

interface OrderCancelArgs {
  phone: string;
  orderNumber: string;    // {{1}} — also the track-button suffix
  customerName: string;   // {{2}}
  restaurantName: string; // {{3}}
  refundAmount: number;   // {{4}}
  declined: boolean;      // vendor-declined → order_declined, else → order_cancellation
}

/** order_declined / order_cancellation — sent to the customer when an order is cancelled. */
export async function sendOrderCancelled(args: OrderCancelArgs): Promise<void> {
  await sendTemplate({
    phone: args.phone,
    templateName: args.declined
      ? env.INTERAKT_TEMPLATE_ORDER_DECLINED
      : env.INTERAKT_TEMPLATE_ORDER_CANCELLATION,
    languageCode: env.INTERAKT_TEMPLATE_LANG,
    headerImage: env.INTERAKT_TEMPLATE_HEADER_IMAGE || undefined,
    bodyValues: [args.orderNumber, args.customerName, args.restaurantName, String(args.refundAmount)],
    buttonValue: args.orderNumber,
    callbackData: `order_${args.orderNumber}`,
  });
}

interface VendorNewOrderArgs {
  phone: string;          // vendor's WhatsApp number
  orderNumber: string;    // {{1}}
  vendorName: string;     // {{2}}
  customerName: string;   // {{3}}
  customerPhone: string;  // {{4}}
  orderType: string;      // {{5}} — "Dine In" | "Take Away"
  total: number;          // {{6}}
}

/** vendor_new_order — alerts the vendor on WhatsApp. Static "View Orders" button, text header. */
export async function sendVendorNewOrder(args: VendorNewOrderArgs): Promise<void> {
  await sendTemplate({
    phone: args.phone,
    templateName: env.INTERAKT_TEMPLATE_VENDOR_NEW_ORDER,
    languageCode: env.INTERAKT_TEMPLATE_LANG,
    headerImage: env.INTERAKT_TEMPLATE_HEADER_IMAGE || undefined,
    bodyValues: [
      args.orderNumber,
      args.vendorName,
      args.customerName,
      args.customerPhone,
      args.orderType,
      String(args.total),
    ],
    callbackData: `vendor_order_${args.orderNumber}`,
  });
}

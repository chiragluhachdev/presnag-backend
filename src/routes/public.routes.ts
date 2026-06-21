import { Router } from "express";
import { Vendor } from "../models/Vendor";
import { MenuCategory } from "../models/MenuCategory";
import { MenuItem } from "../models/MenuItem";
import { Order } from "../models/Order";
import { Coupon } from "../models/Coupon";
import { getSettings } from "../models/Setting";
import { asyncH, HttpError } from "../middleware/error";
import { genOrderNumber, isStoreOpen } from "../utils/helpers";
import { emitNewOrder, emitOrderStatus } from "../realtime/io";
import { notifyVendorNewOrder, notifyOrderCancelled } from "../notifications/orderWhatsapp";
import { orderLimiter } from "../middleware/rateLimiters";

const router = Router();

// Public platform settings (e.g. maintenance-mode flag for the storefront).
router.get(
  "/settings",
  asyncH(async (_req, res) => {
    const settings = await getSettings();
    res.json({
      maintenanceMode: settings.maintenanceMode,
      paymentsDisabled: settings.paymentsDisabled,
      codEnabled: settings.codEnabled,
      paymentProvider: settings.paymentProvider,
      demoBanner: settings.demoBanner,
    });
  })
);

// List active vendors with optional search + category filter.
router.get(
  "/vendors",
  asyncH(async (req, res) => {
    const { q, category } = req.query;
    const filter: Record<string, unknown> = { status: "active" };
    if (category && category !== "All") filter.category = category;

    if (q) {
      const rx = { $regex: String(q), $options: "i" };
      // Match by vendor name, category, OR by having a menu item that matches.
      const itemVendorIds = await MenuItem.find({ name: rx }).distinct("vendorId");
      filter.$or = [{ name: rx }, { category: rx }, { _id: { $in: itemVendorIds } }];
    }

    const vendors = await Vendor.find(filter)
      .select("name slug logo banner category isOpen openTime closeTime prepTime address description lat lng createdAt isFeatured featuredOrder hideLogo")
      .lean()
      .sort({ isFeatured: -1, featuredOrder: 1, createdAt: -1 });

    const mappedVendors = vendors.map((v) => ({
      ...v,
      logo: v.hideLogo ? "" : v.logo, // respect the vendor's "hide logo" preference
      isOpen: isStoreOpen(v.isOpen as boolean, v.openTime as string, v.closeTime as string),
    }));

    res.json(mappedVendors);
  })
);

// Vendor detail + menu (grouped by category).
router.get(
  "/vendors/:slug",
  asyncH(async (req, res) => {
    // Never expose payout/KYC/PII on the public storefront.
    const vendor = await Vendor.findOne({ slug: req.params.slug, status: "active" })
      .select("-passwordHash -managedPayout -cashfreeBeneficiaryId -cashfreeVendorId -kycStatus -fssaiLicense -ownerName -email")
      .lean();
    if (!vendor) throw new HttpError(404, "Vendor not found");

    if (vendor.hideLogo) vendor.logo = ""; // respect the vendor's "hide logo" preference
    vendor.isOpen = isStoreOpen(vendor.isOpen as boolean, vendor.openTime as string, vendor.closeTime as string);
    const categories = await MenuCategory.find({ vendorId: vendor._id }).sort({ sortOrder: 1 });
    const items = await MenuItem.find({ vendorId: vendor._id });
    res.json({ vendor, categories, items });
  })
);

// Validate a coupon for a vendor.
router.post(
  "/vendors/:slug/coupon",
  asyncH(async (req, res) => {
    const { code, subtotal } = req.body;
    const vendor = await Vendor.findOne({ slug: req.params.slug });
    if (!vendor) throw new HttpError(404, "Vendor not found");
    const coupon = await Coupon.findOne({
      vendorId: vendor.id,
      code: String(code || "").toUpperCase(),
      isActive: true,
    });
    if (!coupon) throw new HttpError(404, "Invalid coupon");
    if (coupon.expiry && coupon.expiry < new Date()) throw new HttpError(400, "Coupon expired");
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      throw new HttpError(400, "Coupon usage limit reached");
    }
    const discount =
      coupon.type === "percent"
        ? Math.round((Number(subtotal) * coupon.value) / 100)
        : Math.min(coupon.value, Number(subtotal));
    res.json({ code: coupon.code, type: coupon.type, value: coupon.value, discount });
  })
);

// Create an order.
router.post(
  "/orders",
  orderLimiter,
  asyncH(async (req, res) => {
    const { slug, customerName, customerPhone, note, orderType, items, paymentMethod, couponCode } = req.body;
    if (!slug || !customerName || !customerPhone || !Array.isArray(items) || items.length === 0) {
      throw new HttpError(400, "Missing required order fields");
    }
    const vendor = await Vendor.findOne({ slug, status: "active" });
    if (!vendor) throw new HttpError(404, "Vendor not found");
    if (!vendor.isOpen) {
      throw new HttpError(400, "This store is currently closed and not accepting orders.");
    }

    // Re-price from DB to avoid trusting client prices.
    const dbItems = await MenuItem.find({
      _id: { $in: items.map((i: any) => i.itemId) },
      vendorId: vendor.id,
    });
    const priceMap = new Map(dbItems.map((d) => [d.id, d]));

    let subtotal = 0;
    const orderItems = items.map((i: any) => {
      const db = priceMap.get(String(i.itemId));
      if (!db) throw new HttpError(400, `Item not available: ${i.itemId}`);
      if (!db.isAvailable) throw new HttpError(400, `Item unavailable: ${db.name}`);
      const qty = Math.max(1, Number(i.qty) || 1);

      // Validate & price chosen add-ons against the item's real customizations
      // (server-authoritative — the client can't inject arbitrary add-on prices).
      const addons: { group: string; label: string; price: number }[] = [];
      let addonTotal = 0;
      const selected = Array.isArray(i.selectedOptions) ? i.selectedOptions : [];
      for (const sel of selected) {
        const group = (db.customizations || []).find((g: any) => g.name === sel.group);
        const opt = group?.options.find((o: any) => o.label === sel.label);
        if (opt) {
          addons.push({ group: group!.name, label: opt.label, price: opt.price });
          addonTotal += opt.price;
        }
      }

      const unitPrice = db.price + addonTotal;
      subtotal += unitPrice * qty;
      return {
        itemId: db.id,
        name: db.name,
        price: unitPrice,
        qty,
        instructions: i.instructions || "",
        addons,
      };
    });

    // Apply coupon if provided.
    let discount = 0;
    let appliedCode = "";
    if (couponCode) {
      const coupon = await Coupon.findOne({
        vendorId: vendor.id,
        code: String(couponCode).toUpperCase(),
        isActive: true,
      });
      if (coupon && (!coupon.expiry || coupon.expiry >= new Date())) {
        // Atomically claim one use, honouring usageLimit (0 = unlimited). This
        // prevents the race where concurrent orders both pass a read-check and
        // push usedCount past the limit.
        const claimed = await Coupon.findOneAndUpdate(
          {
            _id: coupon._id,
            isActive: true,
            $or: [{ usageLimit: 0 }, { $expr: { $lt: ["$usedCount", "$usageLimit"] } }],
          },
          { $inc: { usedCount: 1 } },
          { new: true }
        );
        if (claimed) {
          discount =
            coupon.type === "percent"
              ? Math.round((subtotal * coupon.value) / 100)
              : Math.min(coupon.value, subtotal);
          appliedCode = coupon.code;
        }
      }
    }

    const tax = 0; // No extra charges — customer pays exactly the item total (minus any discount).
    const total = subtotal - discount;
    const method = ["CASHFREE", "RAZORPAY", "COD"].includes(paymentMethod) ? paymentMethod : "CASHFREE";

    // Resolve order type, clamping to one the vendor actually offers.
    let resolvedType: "TAKE_AWAY" | "DINE_IN" = orderType === "TAKE_AWAY" ? "TAKE_AWAY" : "DINE_IN";
    if (resolvedType === "DINE_IN" && vendor.dineInEnabled === false && vendor.takeAwayEnabled !== false) resolvedType = "TAKE_AWAY";
    if (resolvedType === "TAKE_AWAY" && vendor.takeAwayEnabled === false && vendor.dineInEnabled !== false) resolvedType = "DINE_IN";

    // Create the order with a unique 5-digit number. We pre-check for a free
    // number, then create. If two orders grab the same number at the same time,
    // the unique index makes the loser throw E11000 — so we just retry with a
    // fresh number rather than failing the customer's order.
    let order: any;
    for (let attempt = 0; attempt < 6; attempt++) {
      let orderNumber = genOrderNumber();
      for (let i = 0; i < 12 && (await Order.exists({ orderNumber })); i++) {
        orderNumber = genOrderNumber();
      }
      try {
        order = await Order.create({
          vendorId: vendor.id,
          orderNumber,
          customerName,
          customerPhone,
          note: note || "",
          orderType: resolvedType,
          items: orderItems,
          subtotal,
          tax,
          discount,
          total,
          couponCode: appliedCode,
          paymentMethod: method,
          paymentStatus: "pending", // Confirmed via Cashfree webhook (or demo-confirm).
          status: "received",
          pickupTime: `${vendor.prepTime} min`,
        });
        break;
      } catch (e: any) {
        if (e?.code === 11000 && attempt < 5) continue; // number collision — retry
        throw e;
      }
    }
    if (!order) throw new HttpError(500, "Could not place your order. Please try again.");

    // The vendor is alerted only after payment succeeds (payment webhook /
    // demo-confirm calls emitNewOrder). COD orders are alerted immediately.
    if (method === "COD") {
      emitNewOrder(vendor.id, order);
      // WhatsApp: alert the vendor of the new order (opt-in). The customer's
      // confirmation is sent only once the vendor ACCEPTS. Fire-and-forget.
      notifyVendorNewOrder(order.id).catch(() => {});
    }
    res.status(201).json(order);
  })
);

// Track an order by number. PUBLIC — returns only what a tracking link needs and
// NEVER exposes customer PII, payment/internal IDs, or sensitive vendor details.
router.get(
  "/orders/:orderNumber",
  asyncH(async (req, res) => {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber }).populate(
      "vendorId",
      "name slug logo"
    );
    if (!order) throw new HttpError(404, "Order not found");
    const v: any = order.vendorId;
    res.json({
      orderNumber: order.orderNumber,
      status: order.status,
      orderType: order.orderType,
      pickupTime: order.pickupTime,
      createdAt: (order as any).createdAt,
      items: order.items.map((it: any) => ({
        name: it.name,
        qty: it.qty,
        price: it.price,
        addons: it.addons || [],
      })),
      subtotal: order.subtotal,
      discount: order.discount,
      tax: order.tax,
      total: order.total,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      cancelledBy: order.cancelledBy,
      cancelReason: order.cancelReason,
      // Public storefront vendor info only (no phone/address/internal ids).
      vendorId: v ? { name: v.name, slug: v.slug, logo: v.logo } : null,
    });
  })
);

// Customer cancels their own order. Requires a matching phone (or last 4 digits)
// so a tracking link / guessed id alone can't cancel someone else's order.
// Atomic: only succeeds while the order is still "received" or "accepted".
router.post(
  "/orders/:orderNumber/cancel",
  asyncH(async (req, res) => {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber });
    if (!order) throw new HttpError(404, "Order not found");
    if (order.status === "cancelled") return res.json({ ok: true });

    // Verify ownership via phone / last-4.
    const onFile = (order.customerPhone || "").replace(/\D/g, "");
    const provided = String(req.body.phone || "").replace(/\D/g, "");
    const last4 = String(req.body.last4Digits || "").replace(/\D/g, "");
    const ok =
      (provided.length >= 10 && provided.slice(-10) === onFile.slice(-10)) ||
      (last4.length === 4 && onFile.slice(-4) === last4);
    if (!ok) throw new HttpError(403, "Phone number does not match this order.");

    const updated = await Order.findOneAndUpdate(
      { _id: order._id, status: { $in: ["received", "accepted"] } },
      { status: "cancelled", cancelledBy: "customer", cancelReason: "Cancelled by the customer." },
      { new: true }
    );
    if (!updated) {
      throw new HttpError(400, "This order can no longer be cancelled — it's already being prepared.");
    }
    emitOrderStatus(String(updated.vendorId), updated.orderNumber, updated);
    notifyOrderCancelled(updated.id).catch(() => {});
    res.json({ ok: true });
  })
);

export default router;

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function genOrderNumber(): string {
  // Random 5-char uppercase Base36 (A–Z, 0–9) → ~60M combinations, so order IDs
  // can't be enumerated. Uniqueness is still enforced at order creation.
  const CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let out = "";
  for (let i = 0; i < 5; i++) out += CHARS[Math.floor(Math.random() * CHARS.length)];
  return out;
}

export function isStoreOpen(isOpenToggle: boolean, openTime: string, closeTime: string): boolean {
  if (!isOpenToggle) return false;
  if (!openTime || !closeTime) return isOpenToggle;

  const now = new Date();
  const istTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const currentTotal = istTime.getHours() * 60 + istTime.getMinutes();

  const [openH, openM] = openTime.split(":").map(Number);
  const openTotal = openH * 60 + (openM || 0);

  const [closeH, closeM] = closeTime.split(":").map(Number);
  const closeTotal = closeH * 60 + (closeM || 0);

  if (closeTotal < openTotal) {
    // Closes past midnight (e.g., 20:00 to 02:00)
    return currentTotal >= openTotal || currentTotal <= closeTotal;
  }

  return currentTotal >= openTotal && currentTotal <= closeTotal;
}

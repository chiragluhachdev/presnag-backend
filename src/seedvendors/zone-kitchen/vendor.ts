import { slugify } from "../../utils/helpers";

const u = (id: string, w = 600) =>
  `https://images.unsplash.com/${id}?w=${w}&q=80&auto=format&fit=crop`;

export const vendor = {
  name: "Zone Kitchen",
  ownerName: "Zone Kitchen Owner",
  email: "zonekitchen@presnag.com",
  password: "vendor123", // The seed script will hash this
  slug: slugify("Zone Kitchen"),
  phone: "9876543217",
  fssaiLicense: "100000000007",
  category: "Multi-Cuisine",
  description: "Welcome to Zone Kitchen in NIT - 3, Faridabad.",
  address: "NIT - 3, Faridabad",
  logo: u("photo-1555396273-367ea4eb4db5", 200), // generic food
  banner: u("photo-1559925393-8be0ec4767c8", 1200), // banner
  status: "active",
  openingHours: "10:00 - 23:00",
  openTime: "10:00",
  closeTime: "23:00",
  isOpen: true,
  rating: 4.5,
  prepTime: 20,
  lat: 28.3888, // approx NIT 3 Faridabad coordinates
  lng: 77.2974,
  subscriptionPlan: "starter",
  settlementMode: "MANAGED",
  eligibleForDirectMigration: true,
  cashfreeBeneficiaryId: `presnag_demo_${slugify("Zone Kitchen")}`,
  managedPayout: {
    accountHolderName: "Zone Kitchen",
    accountNumber: "123456789017",
    accountNumberLast4: "9017",
    ifsc: "HDFC0001234",
    pan: "ABCDE1234Z",
    panMasked: "ABXXXX1Z",
  },
};

export const coupons = [
  { code: "WELCOME10", type: "percent", value: 10, usageLimit: 0 }
];

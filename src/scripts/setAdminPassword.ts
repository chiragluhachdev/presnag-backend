import mongoose from "mongoose";
import { connectDB } from "../config/db";
import { Admin } from "../models/Admin";
import { hashPassword } from "../utils/auth";

// One-off: set the admin password WITHOUT touching any other data.
//   npm run set-admin-password -- "<newPassword>" ["<email>"]
// Defaults to the admin@presnag.com account if no email is given.
async function main() {
  const newPassword = process.argv[2];
  const email = (process.argv[3] || "admin@presnag.com").toLowerCase();
  if (!newPassword || newPassword.length < 6) {
    console.error("Usage: npm run set-admin-password -- \"<newPassword>\" [email]");
    process.exit(1);
  }

  await connectDB();
  const admin = await Admin.findOne({ email });
  if (!admin) {
    console.error(`No admin found with email ${email}`);
    await mongoose.disconnect();
    process.exit(1);
  }

  admin.passwordHash = await hashPassword(newPassword);
  await admin.save();
  console.log(`✅ Password updated for admin: ${email}`);
  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

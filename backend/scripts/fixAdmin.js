import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { connectDB } from "../src/config/db.js";
import User from "../src/models/User.js";

try {
  const email = process.env.ADMIN_EMAIL?.toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || "CampusFix Admin";

  if (!email || !password || password.length < 8) {
    throw new Error("Check ADMIN_EMAIL and ADMIN_PASSWORD in .env");
  }

  await connectDB();

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("No existing account found with this email");
  }

  user.name = name;
  user.role = "admin";
  user.password = await bcrypt.hash(password, 12);

  await user.save();

  console.log("Admin account updated successfully!");
  console.log("Admin email:", email);
  console.log("Role:", user.role);

} catch (error) {
  console.error("Admin update failed:", error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
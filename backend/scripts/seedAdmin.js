import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { connectDB } from "../src/config/db.js";
import User from "../src/models/User.js";
await connectDB();
const email = (process.env.ADMIN_EMAIL || "admin@campusfix.local").toLowerCase();
const password = process.env.ADMIN_PASSWORD;
if (!password || password === "ChangeMe123!") {
  console.error("Set a strong ADMIN_PASSWORD in backend/.env before running this script.");
  process.exit(1);
}
const existing = await User.findOne({ email });
if (existing) console.log(`Admin already exists: ${email}`);
else {
  const admin = await User.create({ name: process.env.ADMIN_NAME || "CampusFix Admin", email, password: await bcrypt.hash(password, 12), role: "admin" });
  console.log(`Admin created: ${admin.email}`);
}
await mongoose.disconnect();

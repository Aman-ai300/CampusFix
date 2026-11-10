import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { connectDB } from "../src/config/db.js";
import User from "../src/models/User.js";

// Add as many teachers as you want here
const teachers = [
  {
    name: "Rahul Sharma",
    email: "rahul@campusfix.com",
    password: "Rahul@2026"
  },
  {
    name: "Priya Reddy",
    email: "priya@campusfix.com",
    password: "Priya@2026"
  },
  {
    name: "Arjun Kumar",
    email: "arjun@campusfix.com",
    password: "Arjun@2026"
  },
  {
    name: "Sneha Patel",
    email: "sneha@campusfix.com",
    password: "Sneha@2026"
  },
  {
    name: "Karthik Rao",
    email: "karthik@campusfix.com",
    password: "Karthik@2026"
  }
];

async function createTeachers() {
  try {
    await connectDB();

    for (const teacher of teachers) {
      const email = teacher.email.toLowerCase().trim();

      if (teacher.password.length < 8) {
        console.log(`Skipped ${email}: password must be at least 8 characters`);
        continue;
      }

      const existing = await User.findOne({ email });

      if (existing) {
        console.log(`Already exists: ${email}`);
        continue;
      }

      const hashedPassword = await bcrypt.hash(teacher.password, 12);

      await User.create({
        name: teacher.name,
        email,
        password: hashedPassword,
        role: "staff"
      });

      console.log(`Created teacher: ${teacher.name}`);
    }

    console.log("\nTeacher creation process completed!");

  } catch (error) {
    console.error("Error:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

createTeachers();
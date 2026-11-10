import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import issueRoutes from "./routes/issues.js";
import userRoutes from "./routes/users.js";

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json({ limit: "1mb" }));
app.get("/api/health", (_req, res) => res.json({ status: "ok", app: "CampusFix API" }));
app.use("/api/auth", authRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/users", userRoutes);
app.use((req, res) => res.status(404).json({ message: "Route not found" }));
app.use((err, _req, res, _next) => {
  console.error(err);
  if (err.code === 11000) return res.status(409).json({ message: "An account with this email already exists" });
  res.status(500).json({ message: "Server error. Please try again." });
});
const port = process.env.PORT || 5000;
connectDB().then(() => app.listen(port, () => console.log(`CampusFix API running on ${port}`))).catch(err => { console.error("Database connection failed:", err.message); process.exit(1); });

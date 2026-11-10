import { Router } from "express";
import User from "../models/User.js";
import { protect, allowRoles } from "../middleware/auth.js";
const router = Router();
router.get("/staff", protect, allowRoles("admin"), async (_req, res, next) => {
  try { const staff = await User.find({ role: "staff" }).select("name email").sort({ name: 1 }); res.json({ staff }); }
  catch (err) { next(err); }
});
router.post("/staff", protect, allowRoles("admin"), async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password || password.length < 8) return res.status(400).json({ message: "Name, email and password (8+ characters) are required" });
    const bcrypt = await import("bcryptjs");
    const staff = await User.create({ name, email: email.toLowerCase().trim(), password: await bcrypt.default.hash(password, 12), role: "staff" });
    res.status(201).json({ staff: { id: staff.id, name: staff.name, email: staff.email } });
  } catch (err) { next(err); }
});
export default router;

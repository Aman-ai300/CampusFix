import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";

const router = Router();
const makeToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name?.trim() || !email?.trim() || !password || password.length < 8)
      return res.status(400).json({ message: "Name, email and a password of at least 8 characters are required" });
    const normalizedEmail = email.toLowerCase().trim();
    if (await User.exists({ email: normalizedEmail })) return res.status(409).json({ message: "An account with this email already exists" });
    const user = await User.create({ name: name.trim(), email: normalizedEmail, password: await bcrypt.hash(password, 12), role: "student" });
    res.status(201).json({ token: makeToken(user.id), user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) { next(err); }
});

router.post("/login", async (req, res, next) => {
  try {
    const email = req.body.email?.toLowerCase().trim();
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await bcrypt.compare(req.body.password || "", user.password)))
      return res.status(401).json({ message: "Invalid email or password" });
    res.json({ token: makeToken(user.id), user: { id: user.id, name: user.name, email: user.email, role:user.role } });
  } catch (err) { next(err); }
});

router.get("/me", protect, (req, res) => res.json({ user: { id: req.user.id, name: req.user.name, email:req.user.email, role: req.user.role } }));
export default router;
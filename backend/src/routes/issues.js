import { Router } from "express";
import mongoose from "mongoose";
import Issue from "../models/Issue.js";
import User from "../models/User.js";
import { protect, allowRoles } from "../middleware/auth.js";

const router = Router();
const populateIssue = (query) => query.populate("createdBy", "name role").populate("assignedTo", "name email");

// Most-liked issues first. Critical issues are pinned above popularity ranking.
router.get("/", protect, async (req, res, next) => {
  try {
    const { search = "", category = "", status = "", sort = "popular" } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (search.trim()) filter.$or = [
      { title: { $regex: search.trim(), $options: "i" } },
      { description: { $regex: search.trim(), $options: "i" } },
      { location: { $regex: search.trim(), $options: "i" } }
    ];
    const sortStage = sort === "newest" ? { createdAt: -1 } : { priorityRank: -1, likeCount: -1, createdAt: -1 };
    const issues = await Issue.aggregate([
      { $match: filter },
      { $addFields: { likeCount: { $size: "$likes" }, priorityRank: { $cond: [{ $eq: ["$priority", "Critical"] }, 1, 0] } } },
      { $sort: sortStage },
      { $limit: 100 }
    ]);
    const ids = issues.map(issue => issue._id);
    const populated = await Issue.find({ _id: { $in: ids } }).populate("createdBy", "name role").populate("assignedTo", "name email");
    const byId = new Map(populated.map(issue => [issue.id, issue]));
    res.json({ issues: issues.map(item => ({ ...byId.get(String(item._id)).toObject(), likeCount: item.likeCount })) });
  } catch (err) { next(err); }
});

router.post("/", protect, allowRoles("student", "admin"), async (req, res, next) => {
  try {
    const { title, description, category, location } = req.body;
    if (![title, description, category, location].every(value => typeof value === "string" && value.trim()))
      return res.status(400).json({ message: "Title, description, category and location are required" });
    const issue = await Issue.create({ title, description, category, location, createdBy: req.user.id });
    await issue.populate("createdBy", "name role");
    res.status(201).json({ issue });
  } catch (err) { next(err); }
});

router.get("/:id", protect, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid issue ID" });
    const issue = await populateIssue(Issue.findById(req.params.id));
    if (!issue) return res.status(404).json({ message: "Issue not found" });
    res.json({ issue: { ...issue.toObject(), likeCount: issue.likes.length } });
  } catch (err) { next(err); }
});

router.post("/:id/like", protect, async (req, res, next) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: "Issue not found" });
    if (issue.createdBy.toString() === req.user.id) return res.status(400).json({ message: "You cannot like your own issue" });
    const alreadyLiked = issue.likes.some(id => id.toString() === req.user.id);
    const update = alreadyLiked ? { $pull: { likes: req.user._id } } : { $addToSet: { likes: req.user._id } };
    const updated = await Issue.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json({ liked: !alreadyLiked, likeCount: updated.likes.length });
  } catch (err) { next(err); }
});

router.patch("/:id/status", protect, allowRoles("staff", "admin"), async (req, res, next) => {
  try {
    const allowed = ["Open", "Assigned", "In Progress", "Resolved", "Rejected"];
    if (!allowed.includes(req.body.status)) return res.status(400).json({ message: "Invalid status" });
    const issue = await Issue.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true, runValidators: true }).populate("createdBy", "name").populate("assignedTo", "name email");
    if (!issue) return res.status(404).json({ message: "Issue not found" });
    res.json({ issue });
  } catch (err) { next(err); }
});

router.patch("/:id/assign", protect, allowRoles("admin"), async (req, res, next) => {
  try {
    const staff = await User.findOne({
      _id: req.body.staffId,
      role: "staff"
    });

    if (!staff) {
      return res.status(400).json({
        message: "Select a valid staff account"
      });
    }

    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { assignedTo: staff._id },
      { new: true }
    )
      .populate("createdBy", "name")
      .populate("assignedTo", "name email");

    if (!issue) {
      return res.status(404).json({
        message: "Issue not found"
      });
    }

    res.json({ issue });

  } catch (err) {
    next(err);
  }
});
export default router;

import mongoose from "mongoose";

const issueSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, required: true, trim: true, maxlength: 2000 },
  category: { type: String, enum: ["Electrical", "Plumbing", "Internet", "Furniture", "Classroom Equipment", "Cleanliness", "Other"], required: true },
  location: { type: String, required: true, trim: true, maxlength: 120 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  priority: { type: String, enum: ["Low", "Medium", "High", "Critical"], default: "Medium" },
  status: { type: String, enum: ["Open", "Assigned", "In Progress", "Resolved", "Rejected"], default: "Open" }
}, { timestamps: true });

export default mongoose.model("Issue", issueSchema);
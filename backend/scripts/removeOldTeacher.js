import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../src/config/db.js";
import User from "../src/models/User.js";
import Issue from "../src/models/Issue.js";

async function removeOldTeacher() {
  try {
    await connectDB();

    const email = "teacher@campusfix.com";

    const teacher = await User.findOne({ email });

    if (!teacher) {
      console.log("Campus Teacher account not found.");
      return;
    }

    const assignedIssues = await Issue.countDocuments({
      assignedTo: teacher._id
    });

    if (assignedIssues > 0) {
      console.log(
        `Cannot delete: ${assignedIssues} issue(s) are assigned to this teacher.`
      );
      return;
    }

    await User.deleteOne({ _id: teacher._id });

    console.log("Campus Teacher account removed successfully.");

  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

removeOldTeacher();
// import mongoose from "mongoose";

// export async function connectDB() {
//   if (!process.env.MONGO_URI) throw new Error("MONGO_URI is missing");
//   await mongoose.connect(process.env.MONGO_URI);
//   console.log("MongoDB connected");
// }

import mongoose from "mongoose";
import dns from "node:dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

export async function connectDB() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing");
  }

  await mongoose.connect(process.env.MONGO_URI);

  console.log("MongoDB connected");
}
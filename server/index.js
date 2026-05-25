import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import http from "http";
import fs from "fs";
import connectDB from "./config/db.js";
import authRoutes from "./routes/user.js";
import activityRoutes from "./routes/activity.js";
import notificationRoute from "./routes/notification.js";
import messageRoutes from "./routes/message.js";
import { initSocket } from "./socket/socket.js";

// CONFIG
dotenv.config();

// DATABASE CONNECTION
connectDB();

// CREATE UPLOADS FOLDER IF NOT EXISTS (Bypassed on Vercel read-only filesystem)
if (!process.env.VERCEL) {
  if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
  }
}

// EXPRESS APP
const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());

// SERVE UPLOADS STATICALLY
app.use("/uploads", express.static("uploads"));

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Carbon Tracker Backend Running");
});

// ROUTE MOUNTING
app.use("/auth", authRoutes);
app.use("/activity", activityRoutes);
app.use("/notification", notificationRoute);
app.use("/message", messageRoutes);

// PORT
const PORT = process.env.PORT || 5000;

// HTTP SERVER & SOCKET.IO SETUP (Bypassed on Vercel serverless)
if (!process.env.VERCEL) {
  const server = http.createServer(app);
  initSocket(server);

  // SERVER START
  server.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
}

export default app;

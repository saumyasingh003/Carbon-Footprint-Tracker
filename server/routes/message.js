import express from "express";
import {
  getAllMessages,
  sendFileMessage,
} from "../controllers/message.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();

// Route to get all messages for a room
router.get("/all", isAuthenticated, getAllMessages);

// Route to send a file message (uploads to Cloudinary)
router.post(
  "/upload",
  isAuthenticated,
  upload.single("file"),
  sendFileMessage
);

export default router;
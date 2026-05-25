import { Message } from "../models/message.js";
import { getIO } from "../socket/socket.js";
import User from "../models/user.js";
import { createNotification } from "../utils/notificationService.js";

// ==========================
// GET ALL MESSAGES
// ==========================
export const getAllMessages = async (req, res) => {
  try {
    const { room } = req.query;
    const roomName = room || "global";

    // Retrieve all messages for the specified room, ordered by creation time (oldest first)
    const messages = await Message.find({ room: roomName })
      .populate("user", "username email")
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// SEND FILE MESSAGE
// ==========================
export const sendFileMessage = async (req, res) => {
  try {
    const file = req.file;
    const { fileType, room, message } = req.body;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "File required",
      });
    }

    // ==========================
    // SAVE TO DATABASE (LOCAL PATH)
    // ==========================
    const newMessage = await Message.create({
      user: req.user._id,
      fileUrl: `/uploads/${file.filename}`,
      fileType: fileType || "image",
      message: message || "",
      room: room || "global",
    });

    const populatedMessage = await Message.findById(newMessage._id)
      .populate("user", "username email");

    // ==========================
    // BROADCAST VIA SOCKET.IO
    // ==========================
    try {
      const io = getIO();
      io.to(room || "global").emit("receive_message", populatedMessage);
    } catch (socketError) {
      console.warn("Could not broadcast message via Socket.IO:", socketError.message);
    }

    // Generate community notifications for all other users
    const roomName = room || "global";
    if (roomName === "global") {
      try {
        const senderName = req.user.username || "Someone";
        const otherUsers = await User.find({ _id: { $ne: req.user._id } });
        const notifPromises = otherUsers.map((u) =>
          createNotification({
            user: u._id,
            title: "New Community Attachment",
            message: `${senderName} shared an eco ${fileType || "activity"}: ${message || ""}`,
            type: "community",
            link: "/community",
          })
        );
        await Promise.all(notifPromises);
      } catch (notifError) {
        console.error("Could not trigger notifications for file message:", notifError.message);
      }
    }

    res.status(201).json({
      success: true,
      message: populatedMessage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
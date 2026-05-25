import { Server } from "socket.io";
import { Message } from "../models/message.js";
import User from "../models/user.js";
import { createNotification } from "../utils/notificationService.js";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`🔌 User connected: ${socket.id}`);

    // Join a specific room (default: global)
    socket.on("join_room", (roomName) => {
      const room = roomName || "global";
      socket.join(room);
      console.log(`👤 User ${socket.id} joined room: ${room}`);
    });

    // Handle standard text/emoji messages
    socket.on("send_message", async (data) => {
      try {
        const { userId, message, room } = data;

        if (!userId) {
          return socket.emit("error", { message: "User ID is required" });
        }

        // Save text message to Database
        const savedMessage = await Message.create({
          user: userId,
          message: message || "",
          room: room || "global",
          fileType: "text",
        });

        // Populate user details (username and email)
        const populatedMessage = await Message.findById(savedMessage._id)
          .populate("user", "username email");

        // Broadcast the message to the room
        io.to(room || "global").emit("receive_message", populatedMessage);

        // Generate community notifications for all other users
        const roomName = room || "global";
        if (roomName === "global") {
          const senderName = populatedMessage.user?.username || "Someone";
          const otherUsers = await User.find({ _id: { $ne: userId } });
          const notifPromises = otherUsers.map((u) =>
            createNotification({
              user: u._id,
              title: "New Community Message",
              message: `${senderName}: ${message || ""}`,
              type: "community",
              link: "/community",
            })
          );
          await Promise.all(notifPromises);
        }
      } catch (error) {
        console.error("Error sending message via socket:", error.message);
        socket.emit("error", { message: "Failed to send message: " + error.message });
      }
    });

    // Handle file/image messages
    socket.on("send_file_message", async (data) => {
      try {
        const { userId, fileUrl, fileType, message, room } = data;

        if (!userId) {
          return socket.emit("error", { message: "User ID is required" });
        }

        // Save file/image message to Database
        const savedMessage = await Message.create({
          user: userId,
          fileUrl,
          fileType: fileType || "image",
          message: message || "",
          room: room || "global",
        });

        // Populate user details (username and email)
        const populatedMessage = await Message.findById(savedMessage._id)
          .populate("user", "username email");

        // Broadcast the file message to the room
        io.to(room || "global").emit("receive_message", populatedMessage);

        // Generate community notifications for all other users
        const roomName = room || "global";
        if (roomName === "global") {
          const senderName = populatedMessage.user?.username || "Someone";
          const otherUsers = await User.find({ _id: { $ne: userId } });
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
        }
      } catch (error) {
        console.error("Error sending file message via socket:", error.message);
        socket.emit("error", { message: "Failed to send file message: " + error.message });
      }
    });

    // Handle message reactions (WhatsApp-style)
    socket.on("react_message", async (data) => {
      try {
        const { messageId, userId, emoji } = data;

        if (!messageId || !userId || !emoji) {
          return socket.emit("error", { message: "Message ID, User ID, and Emoji are required" });
        }

        const msg = await Message.findById(messageId);
        if (!msg) {
          return socket.emit("error", { message: "Message not found" });
        }

        if (!msg.reactions) {
          msg.reactions = [];
        }

        // Check if user already reacted with the EXACT same emoji
        const existingReactionIndex = msg.reactions.findIndex(
          (r) => r.user.toString() === userId && r.emoji === emoji
        );

        if (existingReactionIndex > -1) {
          // Clicked same emoji: remove reaction
          msg.reactions.splice(existingReactionIndex, 1);
        } else {
          // Clicked different emoji: remove any other reaction this user had on this message
          const otherReactionIndex = msg.reactions.findIndex(
            (r) => r.user.toString() === userId
          );
          if (otherReactionIndex > -1) {
            msg.reactions.splice(otherReactionIndex, 1);
          }
          // Push new reaction
          msg.reactions.push({ user: userId, emoji });
        }

        await msg.save();

        // Broadcast updated reactions array to all connected clients
        io.emit("message_reacted", {
          messageId: msg._id,
          reactions: msg.reactions,
        });
      } catch (error) {
        console.error("Error reacting to message:", error.message);
        socket.emit("error", { message: "Failed to react to message: " + error.message });
      }
    });

    // Handle message deletion
    socket.on("delete_message", async (data) => {
      try {
        const { messageId, userId } = data;

        if (!messageId || !userId) {
          return socket.emit("error", { message: "Message ID and User ID are required" });
        }

        const msg = await Message.findById(messageId);
        if (!msg) {
          return socket.emit("error", { message: "Message not found" });
        }

        // Check if the user is the owner of the message
        if (msg.user.toString() !== userId) {
          return socket.emit("error", { message: "Unauthorized to delete this message" });
        }

        await Message.findByIdAndDelete(messageId);

        // Broadcast deleted message ID to all connected clients
        io.emit("message_deleted", { messageId });
      } catch (error) {
        console.error("Error deleting message:", error.message);
        socket.emit("error", { message: "Failed to delete message: " + error.message });
      }
    });

    socket.on("disconnect", () => {
      console.log(`🔌 User disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};
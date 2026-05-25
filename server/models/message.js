import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    message: {
      type: String,
      default: "",
    },

    fileUrl: {
      type: String,
      default: "",
    },

    fileType: {
      type: String,
      enum: ["text", "image", "video", "audio", "pdf", "docx"],
      default: "text",
    },

    room: {
      type: String,
      default: "global",
    },

    reactions: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        emoji: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Message = mongoose.model("Message", messageSchema);
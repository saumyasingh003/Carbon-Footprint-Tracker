import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      required: true,
    },

    value: {
      type: Number,
      required: true,
    },

    unit: {
      type: String,
      required: true,
    },

    carbonEmission: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Activity = mongoose.model("Activity", activitySchema);

export default Activity;
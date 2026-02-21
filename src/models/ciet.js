import mongoose from "mongoose";

const CIETSchema = new mongoose.Schema(
  {
    name: String,
    month: {
      type: String,
      default: () =>
        new Date().toLocaleString("default", {
          month: "long",
          year: "numeric",
        }),
    },
    reels: {
      type: Number,
      default: 0,
      max: 6, // 🔒 max reels allowed
    },
    posters: {
      type: Number,
      default: 0,
      max: 15, // 🔒 max posters allowed
    },
    pending_reels: {
      type: Number,
      default: 0,
    },
    pending_posters: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "archived"],
      default: "active",
    },
  },
  { timestamps: true },
);

export default mongoose.models.CIET || mongoose.model("CIET", CIETSchema);

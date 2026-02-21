import mongoose from "mongoose";

const CollegeSchema = new mongoose.Schema(
  {
    name: String,
    status: {
      type: String,
      enum: ["active", "inactive", "archived"],
      default: "active",
    },
  },
  { timestamps: true },
);

export default mongoose.models.College || mongoose.model("College", CollegeSchema);

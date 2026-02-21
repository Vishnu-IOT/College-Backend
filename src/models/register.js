import mongoose from "mongoose";

const RegisterSchema = new mongoose.Schema(
  {
    name: String,

    email: {
      type: String,
      required: true,
      unique: true,
    },

    mobilenumber: Number,

    password: {
      type: String,
      required: true,
    },

    dob: String,

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true },
);

export default mongoose.models.Register || mongoose.model("Register", RegisterSchema);

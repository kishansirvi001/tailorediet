import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    mobileNumber: { type: String, required: true, trim: true, unique: true },
    dateOfBirth: { type: Date, required: true },
    passwordHash: { type: String, required: true },
    goal: { type: String, required: true, trim: true },
    dietStyle: { type: String, required: true, trim: true },
    sessionToken: { type: String, default: null, index: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
    versionKey: false,
  }
);

export default mongoose.models.User || mongoose.model("User", userSchema);

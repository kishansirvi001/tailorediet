import mongoose from "mongoose";

const signupVerificationSchema = new mongoose.Schema(
  {
    verificationId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, index: true },
    mobileNumber: { type: String, required: true, trim: true, index: true },
    dateOfBirth: { type: Date, required: true },
    passwordHash: { type: String, required: true },
    goal: { type: String, required: true, trim: true },
    dietStyle: { type: String, required: true, trim: true },
    emailOtp: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  }
);

export default mongoose.models.SignupVerification ||
  mongoose.model("SignupVerification", signupVerificationSchema);

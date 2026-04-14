import mongoose from "mongoose";

const trackerEntrySchema = new mongoose.Schema(
  {
    goalFocus: { type: String, trim: true, default: "" },
    currentWeightKg: { type: Number, min: 0, default: null },
    mealsSummary: { type: String, trim: true, default: "" },
    snacksSummary: { type: String, trim: true, default: "" },
    waterIntakeLiters: { type: Number, min: 0, default: null },
    exerciseSummary: { type: String, trim: true, default: "" },
    walkingMinutes: { type: Number, min: 0, default: 0 },
    joggingMinutes: { type: Number, min: 0, default: 0 },
    sleepHours: { type: Number, min: 0, default: null },
    energyLevel: { type: String, trim: true, default: "" },
    mood: { type: String, trim: true, default: "" },
    appetiteLevel: { type: String, trim: true, default: "" },
    digestionNotes: { type: String, trim: true, default: "" },
    notes: { type: String, trim: true, default: "" },
    recordedAt: { type: Date, default: Date.now },
  },
  {
    _id: false,
    versionKey: false,
  }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    // Keep the legacy field in sync because the production database still has a unique `mobile` index.
    mobile: { type: String, required: true, trim: true, unique: true },
    mobileNumber: { type: String, required: true, trim: true, unique: true },
    dateOfBirth: { type: Date, required: true },
    passwordHash: { type: String, required: true },
    goal: { type: String, required: true, trim: true },
    dietStyle: { type: String, required: true, trim: true },
    sessionToken: { type: String, default: null, index: true },
    tracker: {
      lastCheckIn: { type: trackerEntrySchema, default: null },
      history: { type: [trackerEntrySchema], default: [] },
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
    versionKey: false,
  }
);

export default mongoose.models.User || mongoose.model("User", userSchema);

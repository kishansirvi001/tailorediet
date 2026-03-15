import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Signup Route
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User with this email already exists" });
    }

    // Save user
    const user = new User({ name, email, password }); // For production, hash password
    await user.save();

    res.status(201).json({ message: "Signup successful!" });
  } catch (error) {
    console.error("Signup error:", error.message);
    res.status(500).json({ error: "Server error: " + error.message });
  }
});

export default router;
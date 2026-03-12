import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

/* Temporary user storage (later we will use MongoDB) */
const users = [];

/* ================= SIGNUP ================= */

router.post("/signup", async (req, res) => {

  try {

    const { name, email, password } = req.body;

    /* check if user exists */

    const existingUser = users.find(user => user.email === email);

    if (existingUser) {
      return res.json({ message: "User already exists" });
    }

    /* hash password */

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: Date.now(),
      name,
      email,
      password: hashedPassword
    };

    users.push(newUser);

    res.json({
      message: "Signup successful",
      user: {
        name: newUser.name,
        email: newUser.email
      }
    });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

});

/* ================= LOGIN ================= */

router.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = users.find(u => u.email === email);

    if (!user) {
      return res.json({ message: "Invalid email" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.id },
      "tailoredietsecret",
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

});

export default router;
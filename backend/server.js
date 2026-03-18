import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import { GoogleGenAI } from "@google/genai"; // ✅ FIXED

dotenv.config();

connectDB();

const app = express();

// ✅ Gemini setup (NEW)
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.use(cors());
app.use(express.json());

// ✅ Existing routes
app.use("/api/auth", authRoutes);

// ✅ UPDATED DIET ROUTE
app.post("/diet", async (req, res) => {
  try {
    const { age, gender, height, weight, goal, activity, diet } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ plan: "API key missing" });
    }

  const prompt = `
You are a certified Indian nutritionist.

Create a highly practical, affordable, and realistic Indian diet plan based on the user details.

User Details:
- Age: ${age}
- Gender: ${gender}
- Height: ${height} cm
- Weight: ${weight} kg
- Goal: ${goal}
- Activity Level: ${activity}
- Diet Preference: ${diet}

Instructions:
1. Give a full-day diet plan (Breakfast, Mid-Morning, Lunch, Evening Snack, Dinner).
2. Use common Indian foods (roti, dal, rice, sabzi, fruits, eggs, etc.).
3. Keep it simple and affordable (middle-class Indian budget).
4. Mention approximate quantity (e.g., 2 rotis, 1 bowl dal).
5. Avoid fancy or foreign foods.
6. Make it easy to follow at home (no complex recipes).
7. Align with user's goal:
   - Weight loss → calorie deficit, light meals
   - Muscle gain → high protein foods
   - Maintain → balanced diet
8. Keep it culturally realistic (Indian timings & habits).

Output format:

Breakfast:
- item

Mid-Morning:
- item

Lunch:
- item

Evening Snack:
- item

Dinner:
- item

Also add 3 simple tips at the end.
`;

    // ✅ NEW API CALL (IMPORTANT)
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    // ✅ EASY TEXT ACCESS
    const text = response.text;

    if (!text) {
      return res.status(500).json({ plan: "No response from AI" });
    }

    res.json({ plan: text });

  } catch (err) {
    console.error("FULL ERROR 👉", err);
    res.status(500).json({ plan: err.message });
  }
});

// ✅ Test route
app.get("/", (req, res) => {
  res.send("TailorDiet API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
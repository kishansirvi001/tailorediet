import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import dietPlanRoutes from "./routes/dietPlanRoutes.js";
import exerciseRoutes from "./routes/exerciseRoutes.js";
import mealScanRoutes from "./routes/mealScanRoutes.js";
import workoutPlanRoutes from "./routes/workoutPlanRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, ".env");
const envResult = dotenv.config({ path: envPath });
const loadedEnvPath = envResult.error ? null : envPath;

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Test route
app.get("/", (req, res) => res.send("API running"));

app.use("/api/auth", authRoutes);
app.use("/api/diet-plans", dietPlanRoutes);
app.use("/api/exercise", exerciseRoutes);
app.use("/api/meal-scan", mealScanRoutes);
app.use("/api/workout-plans", workoutPlanRoutes);

// Serve frontend static files
const distPath = path.resolve(__dirname, "../dist");
app.use(express.static(distPath));

// Handle client-side routing - serve index.html for all non-API routes
app.get(/.+/, (req, res, next) => {
  if (req.path.startsWith("/api")) {
    return next();
  }
  res.sendFile(path.join(distPath, "index.html"), (err) => {
    if (err) next(err);
  });
});

async function startServer() {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MongoDB URI is missing. Add MONGODB_URI or MONGO_URI to backend/.env before starting the server.");
  }

  await mongoose.connect(mongoUri);

  app.listen(process.env.PORT || 5000, () => {
    console.log(
      `Server running on port ${process.env.PORT || 5000}. Env loaded from: ${
        loadedEnvPath || "not found"
      }. MongoDB connected: yes. GEMINI_API_KEY present: ${process.env.GEMINI_API_KEY ? "yes" : "no"}`
    );
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error.message);
  process.exit(1);
});

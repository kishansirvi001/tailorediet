import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import dietPlanRoutes from "./routes/dietPlanRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, ".env");
const envResult = dotenv.config({ path: envPath });
const loadedEnvPath = envResult.error ? null : envPath;

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => res.send("API running"));

app.use("/api/auth", authRoutes);
app.use("/api/diet-plans", dietPlanRoutes);

app.listen(process.env.PORT || 5000, () => {
  console.log(
    `Server running on port ${process.env.PORT || 5000}. Env loaded from: ${
      loadedEnvPath || "not found"
    }. GEMINI_API_KEY present: ${process.env.GEMINI_API_KEY ? "yes" : "no"}`
  );
});

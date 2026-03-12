import express from "express";
import cors from "cors";

/* ================= IMPORT ROUTES ================= */

import dietRoutes from "./routes/diet.js";
import authRoutes from "./routes/auth.js";

/* ================= APP SETUP ================= */

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

/* ================= ROUTES ================= */

/* Diet Planner API */
app.use("/diet", dietRoutes);

/* Authentication API (signup/login) */
app.use("/auth", authRoutes);

/* ================= HOME ROUTE ================= */

app.get("/", (req, res) => {
  res.send("TailorDiet API Running");
});

/* ================= SERVER ================= */

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
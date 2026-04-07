import express from "express";
import { scanMeal } from "../controllers/mealScanController.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

router.post("/scan", requireAuth, scanMeal);

export default router;

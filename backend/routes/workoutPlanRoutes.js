import express from "express";
import {
  generateWorkoutPlan,
  getWorkoutPlan,
} from "../controllers/workoutPlanController.js";

const router = express.Router();

router.get("/", getWorkoutPlan);
router.post("/generate", generateWorkoutPlan);

export default router;

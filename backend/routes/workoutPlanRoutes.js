import express from "express";
import { getWorkoutPlan } from "../controllers/workoutPlanController.js";

const router = express.Router();

router.get("/", ...getWorkoutPlan);

export default router;

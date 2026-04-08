import express from "express";
import { getExerciseByName } from "../controllers/exerciseController.js";

const router = express.Router();

router.get("/:name", getExerciseByName);

export default router;

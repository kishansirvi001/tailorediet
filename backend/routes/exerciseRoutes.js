import express from "express";
import { getExerciseByName, getExerciseMedia } from "../controllers/exerciseController.js";

const router = express.Router();

router.get("/media", getExerciseMedia);
router.get("/:name", getExerciseByName);

export default router;

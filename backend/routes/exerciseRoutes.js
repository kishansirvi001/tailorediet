import express from "express";
import {
  getExerciseByName,
  getExerciseGifByName,
  getExerciseMedia,
} from "../controllers/exerciseController.js";

const router = express.Router();

router.get("/media", getExerciseMedia);
router.get("/gif/:name", getExerciseGifByName);
router.get("/:name", getExerciseByName);

export default router;

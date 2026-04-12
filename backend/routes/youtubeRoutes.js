import express from "express";
import { getYouTubeShorts } from "../controllers/youtubeController.js";

const router = express.Router();

router.get("/shorts", getYouTubeShorts);

export default router;

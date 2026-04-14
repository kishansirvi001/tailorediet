import { Router } from "express";
import {
  getCurrentUser,
  login,
  logout,
  requestSignupOtp,
  saveTrackerCheckIn,
  verifySignupOtp,
} from "../controllers/authController.js";

const router = Router();

router.post("/signup/request-otp", requestSignupOtp);
router.post("/signup/verify-otp", verifySignupOtp);
router.post("/login", login);
router.get("/me", getCurrentUser);
router.post("/logout", logout);
router.put("/tracker", saveTrackerCheckIn);

export default router;

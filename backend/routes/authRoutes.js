import { Router } from "express";
import {
  getCurrentUser,
  login,
  logout,
  requestSignupOtp,
  verifySignupOtp,
} from "../controllers/authController.js";

const router = Router();

router.post("/signup/request-otp", requestSignupOtp);
router.post("/signup/verify-otp", verifySignupOtp);
router.post("/login", login);
router.get("/me", getCurrentUser);
router.post("/logout", logout);

export default router;

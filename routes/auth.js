import express from "express";
import { register, login, getMe } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();
import { resetPassword } from '../controllers/authController.js';

router.post('/reset-password', resetPassword);

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe); // middleware runs before controller

export default router;
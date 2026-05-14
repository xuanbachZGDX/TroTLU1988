import express from "express";
import * as authController from "../controllers/Auth/authController";

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/google-login", authController.loginGoogle);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

export default router;

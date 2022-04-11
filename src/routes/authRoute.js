import { Router } from "express";
import authController from "../controllers/authController";
import upload from "../utils/multer";
const router = Router();

router.route("/login").post(authController.login);
router.route("/verify").post(authController.verify);
router.route("/resendVerification").post(authController.resendVerification);
router.route("/register").post(upload.single("profile"), authController.register);
router.route('/resend').post(authController.rsendCode)

router.patch("/updatePassword", authController.updatePassword)

export default router;

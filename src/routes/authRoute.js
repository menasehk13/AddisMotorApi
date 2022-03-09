import { Router } from "express";
import authController from "../controllers/authController";
const router = Router();

router.route("/login").post(authController.login);
router.route("/verify").post(authController.verify);
router.route("/register").post(authController.register);

export default router;

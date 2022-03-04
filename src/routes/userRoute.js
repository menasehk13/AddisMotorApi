import { Router } from "express";
import authController from "../controllers/authController";
import userController from "../controllers/userController";
const router = Router();

router.route("/").get(userController.getUsers).post(userController.createUser);
router.route("/:id").get(userController.getUser).patch(
  // authController.protect,
  // authController.restrictTo("admin"),
  userController.updateUser
);

export default router;

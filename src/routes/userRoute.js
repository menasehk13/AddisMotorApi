import { Router } from "express";
import authController from "../controllers/authController";
import userController from "../controllers/userController";
import upload from "../utils/multer";
const router = Router();

router.post("/createUser", userController.createUserForm)

router
  .route("/")
  .get(userController.getUsers)
  .post(upload.single("userprofile"), userController.createUser);

router.route("/:id").get(userController.getUser).patch(
  // authController.protect,
  // authController.restrictTo("admin"),
  userController.updateUser
);

export default router;

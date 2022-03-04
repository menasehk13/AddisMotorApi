import { Router } from "express";
import authController from "../controllers/authController";
import userController from "../controllers/userController";
import upload from "../utils/multer";
const router = Router();

router.post("/profile", upload.single("profile"), userController.checkMulter);

router
  .route("/")
  .get(userController.getUsers)
  .post(upload.single("profile"), userController.createUser);
router.route("/:id").get(userController.getUser).patch(
  // authController.protect,
  // authController.restrictTo("admin"),
  userController.updateUser
);

export default router;

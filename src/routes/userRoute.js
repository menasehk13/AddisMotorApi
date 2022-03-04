import { Router } from "express";
import multer from "multer";
import authController from "../controllers/authController";
import userController from "../controllers/userController";
const router = Router();

const upload = multer({ dest: "./public/data/uploads/" });

router.post("/profile", upload.single("profile"), userController.checkMulter);

router.route("/").get(userController.getUsers).post(userController.createUser);
router.route("/:id").get(userController.getUser).patch(
  // authController.protect,
  // authController.restrictTo("admin"),
  userController.updateUser
);

export default router;

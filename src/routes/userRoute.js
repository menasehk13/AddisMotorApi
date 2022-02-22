import { Router } from "express";
import userController from "../controllers/userController";
const router = Router();

router.route("/").get(userController.getUsers);
router.route("/:id").get(userController.getUser);

export default router;

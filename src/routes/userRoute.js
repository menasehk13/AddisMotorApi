import { Router } from "express";
import authController from "../controllers/authController";
import userController from "../controllers/userController";
import upload from "../utils/multer";
const router = Router();

router.post("/createUser", userController.createUserForm);

router
  .route("/")
  .get(userController.getUsers)
  .post(upload.single("userprofile"), userController.createUser);
  router.route("/history").get(userController.historyView)
  router.post("/rateDriver",userController.rating)
  router.get("/nearby",userController.nearbyDriver)
  router.get("/driverinfo",userController.driverinfo)
router.get("/service",userController.Service)
router.route("/user").get(userController.getUser).patch(userController.updateUser);


router.route("/:id").patch(
  // authController.protect,
  // authController.restrictTo("admin"),
  userController.updateUser
);  

router.get("/driverlocation", userController.displayDriverLocation)


export default router;

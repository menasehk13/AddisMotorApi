import { Router } from "express";
import userController from "../controllers/userController";
import user from "../queries/user";
import upload from "../utils/multer";
const router = Router();

router.post("/createUser", userController.createUser);

router
  .route("/")
  .get(userController.getUsers)
  .post(upload.single("userprofile"), userController.createUser);
  router.route("/totalprice").get(userController.totalDistance)
  router.route("/updatefirsttime").post(userController.UpdateFirstDrive)
  router.route("/history").get(userController.historyView)
  router.post("/rateDriver",userController.rating)
  router.get("/nearby",userController.nearbyDriver)
  router.get("/driverinfo",userController.driverinfo)
  router.route("/reasons").get(userController.reasons)
router.route("/cancelService").post(userController.cancelService)
router.get("/service",userController.Service)
router.route("/user").get(userController.getUser).patch(userController.updateUser);
router.route("/rating").get(userController.ratingView)
router.route("/socket").post(userController.socket)
router.route("/requestdriver").get(userController.requestDriver)
router.route("/addComplients").post(userController.Complients)
router.route("/:id").patch(
  // authController.protect,
  // authController.restrictTo("admin"),
  userController.updateUser
);  

router.get("/driverlocation", userController.displayDriverLocation)


export default router;

import { Router } from "express";
import driverController from "../controllers/driverController";
import upload from "../utils/multer";

const router = Router();

router
  .route("/")
  .get(driverController.getDrivers)
  .post(upload.single("driverprofile"), driverController.addDriver);

router.route("/:id").get(driverController.getDriver);

router.route("/status/:driverid").get(driverController.displayStatus);

router.route("/history/:driverid").get(driverController.history);

router.route("/updatelocation").post(driverController.updateCurrentLocation);

export default router;

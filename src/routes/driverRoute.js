import { Router } from "express";
import driverController from "../controllers/driverController";
const router = Router();

router
  .route("/")
  .get(driverController.getDrivers)
  .post(driverController.addDriver);

router.route("/:id").get(driverController.getDriver);

router.route("/status/:driverid").get(driverController.displayStatus);

router.route("/history/:driverid").get(driverController.history);

router
  .route("/updatelocation/:driverid")
  .post(driverController.updateCurrentLocation);

export default router;

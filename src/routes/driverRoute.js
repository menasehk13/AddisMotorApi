import { Router } from "express";
import { route } from "express/lib/application";
import driverController from "../controllers/driverController";
import upload from "../utils/multer";

const router = Router();

router
  .route("/")
  .get(driverController.getDrivers)
  .post(upload.single("driverprofile"), driverController.addDriver);

router.route("/driver").get(driverController.getDriver);

router.route("/status/:driverid").get(driverController.displayStatus);

router.route("/history/:driverid").get(driverController.history);
router.route("/totalprice").get(driverController.totalprice);
router.route("/updatestatus").post(driverController.updatestatus);
router.route("/updatelocation").post(driverController.updateCurrentLocation);
router.route("/updatesocket").post(driverController.updateDriverSocket);

export default router;

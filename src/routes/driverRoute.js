import { Router } from "express";
import { route } from "express/lib/application";
import driverController from "../controllers/driverController";
import driver from "../queries/driver";
import upload from "../utils/multer";

const router = Router();

router
  .route("/")
  .get(driverController.getDrivers)
  .post(upload.single("driverprofile"), driverController.addDriver);

router.route("/driver").get(driverController.getDriver);


router.route("/status/:driverid").get(driverController.displayStatus);
router.route("/booking").post(driverController.bookingData);
router.route("/history").get(driverController.history);
router.route("/payment").post(driverController.payment);
router.route("/addhistory").post(driverController.addhistory);
router.route("/priceid").get(driverController.priceid);
router.route("/totalprice").get(driverController.totalprice);
router.route("/updatestatus").post(driverController.updatestatus);
router.route("/journey").post(driverController.journeyStarted);
router.route("/updatelocation").post(driverController.updateCurrentLocation);
router.route("/updatesocket").post(driverController.updateDriverSocket);
router.route("/rating").get(driverController.rating)
router.route("/cardetail").get(driverController.carDetail)
router.route("/driverstatus").get(driverController.driverstatus)
router.route("/checkuser").get(driverController.checkUserexsist)
router.route("/newpassword").post(driverController.updatePassword)
router.route("/notifaction").post(driverController.updateNotification)
router.route("/buyCredit").post(driver.BuyCredit)
export default router;

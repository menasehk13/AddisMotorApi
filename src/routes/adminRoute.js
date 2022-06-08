import { Router } from "express";
import { route } from "express/lib/router";
import adminController from "../controllers/adminController";
import jwt from "jsonwebtoken"
import upload from "../utils/multer";

const router = Router();
router.route('/dispatchdriver').post(upload.any(),adminController.DispatchToDriver)
router.get("/me", adminController.currentAdmin)
router.route("/UpdateProfile").post(upload.single("profile"),adminController.UploadProfilePic)
router.route("/addDriverCar").post(adminController.addDriverweb)
router.route("/addDriverDocuments").post(upload.fields([{name: "licencepic", maxCount:1},{name:"insurancepic", maxCount:1},{name:"registration", maxCount:1},{name:"criminal", maxCount:1}]),adminController.addDriverDocuments)
router.route("/DocumentList").get(adminController.DocumentList)
router.route("/").get(adminController.getAdmins);
router.route("/admin/:email").get(adminController.getAdmin);
router.route("/dashboard").get(adminController.dashboard);
router.route("/drivers").get(adminController.getDrivers)
router.route("/users").get(adminController.getUsers)
router.route("/service").get(adminController.carServices)
router.route("/driver").get(adminController.getDriver)
router.route("/dispatch/select").post(adminController.selectDispatch)
router.route("/driver/order").get(adminController.driverOrder);
router.route("/driver/order/detail").get(adminController.driverOrderDetail)
router.route("/driver/order/review").get(adminController.Rating)
router.route("/driver/:id").get(adminController.driverDocument);
router.route("/accounting/user").get(adminController.accountingUser)
router.route("/dashboard/activedrivers").get(adminController.activeDriver)
router.route("/dashboard/inservice").get(adminController.activeDriver)
router.route("/dashboard/icons").get(adminController.dashboardIcons)
router.route("/accounting").get(adminController.accounting);
router.route("/accounting/drivers").get(adminController.accountingDrivers);
router.route("/accounting/riders").get(adminController.accountingRiders);
router
  .route("/accounting/service")
  .get(adminController.accountingService)
  .post(adminController.addAccountingService);
router.route("/marketing").get(adminController.marketing);
router.route("/marketing/coupon").post(adminController.marketingCoupon);
router.route("/user/compliants").get(adminController.userComplaints);
router
  .route("/user/compliants/:id")
  .get(adminController.selectedComplaints)
router.route("/updateStatus").post(adminController.updatestatus)  
router.route("/dispatch/history").get(adminController.DispatchFromDriver)
router.route("/viewadmin").get(adminController.viewadmins)
router.route("/deleteadmin").get(adminController.deleteadmin)
router.route("/marketing/driver").post(adminController.sendNotificationToDriver)
router.route("/marketing/user").post(adminController.sendNotificationToUser)
router.route('/sendNotification').post(upload.any(),adminController.sendSingleNotification)
router.route("/addCredit").post(adminController.AddCredit)

export default router;

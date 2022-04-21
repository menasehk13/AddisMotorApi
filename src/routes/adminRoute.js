import { Router } from "express";
import { route } from "express/lib/router";
import adminController from "../controllers/adminController";
import jwt from "jsonwebtoken"
import upload from "../utils/multer";

const router = Router();

router.get("/me", adminController.currentAdmin)
router.route("/addDriver").post(adminController.addDriverweb)
router.route("/addDriverDocuments").post(upload.fields([{name: "licencepic", maxCount:1},{name:"insurancepic", maxCount:1},{name:"registration", maxCount:1},{name:"criminal", maxCount:1}]),adminController.addDriverDocuments)
router.route("/DocumentList").get(adminController.DocumentList)
router.route("/").get(adminController.getAdmins);
router.route("/admin/:email").get(adminController.getAdmin);
router.route("/UploadImage").post(upload.single("profile"),adminController.upload)
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


router.route("/dashboard/activedrivers").get(adminController.activeDriver)
router.route("/dashboard/inservice").get(adminController.activeDriver)
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
  .patch(adminController.updateComplaints);

export default router;

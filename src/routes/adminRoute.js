import { Router } from "express";
import { route } from "express/lib/router";
import adminController from "../controllers/adminController";
import authController from "../controllers/authController";

const router = Router();

router.route("/").get(adminController.getAdmins);
router.route("/admin/:email").get(adminController.getAdmin);

router
  .route("/dashboard")
  .get(adminController.dashboard);
  router.route("/drivers").get(adminController.getDrivers)
  router.route("/driver").get(adminController.getDriver)
  router.route("/driver/order").get(adminController.driverOrder);
  router.route("/driver/order/detail").get(adminController.driverOrderDetail)
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
router.route("/marketing/coupon").get(adminController.marketingCoupon);

router.route("/user/compliants").get(adminController.userComplaints);
router
  .route("/user/compliants/:id")
  .get(adminController.selectedComplaints)
  .patch(adminController.updateComplaints);

export default router;

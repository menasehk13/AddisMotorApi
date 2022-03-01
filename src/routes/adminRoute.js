import { Router } from "express";
import adminController from "../controllers/adminController";
import authController from "../controllers/authController";

const router = Router();

router.route("/").get(adminController.getAdmins);
router.route("/admin/:email").get(adminController.getAdmin);

router
  .route("/dashboard")
  .get(authController.protect, adminController.dashboard);
  
router.route("/driver/:id").get(adminController.driverDocument);
router.route("/driver/:id/order").get(adminController.driverOrder);

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

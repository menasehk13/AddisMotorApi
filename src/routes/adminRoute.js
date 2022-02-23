import { Router } from 'express'
import adminController from '../controllers/adminController'

const router = Router();

router.route('/').get(adminController.getDrivers)
router.route("/")


export default router
import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { bloodGroupDetailsController } from "../controllers/analyticsController.js";
const router = Router();

// GET BLOOD DATA
router.get("/blood-group-details", authMiddleware, bloodGroupDetailsController);

export default router;

import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  deleteRecordController,
  getAllDonorController,
  getAllHospitalController,
  getAllOrganizationController,
} from "../controllers/adminController.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";

const router = Router();

// DONOR RECORDS
router.get(
  "/getDonorList",
  authMiddleware,
  adminMiddleware,
  getAllDonorController
);

// HOSPITAL RECORDS
router.get(
  "/getHospitalList",
  authMiddleware,
  adminMiddleware,
  getAllHospitalController
);

// ORGANIZATION RECORDS
router.get(
  "/getOrganizationList",
  authMiddleware,
  adminMiddleware,
  getAllOrganizationController
);

// DELETE ROUTES
router.delete(
  "/deleteRecord/:id",
  authMiddleware,
  adminMiddleware,
  deleteRecordController
);
export default router;

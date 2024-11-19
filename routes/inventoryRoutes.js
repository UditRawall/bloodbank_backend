import { Router } from "express";
import {
  createInventoryController,
  getDonarsController,
  getDonorOrganizationController,
  getHospitalController,
  getHospitalOrganizationController,
  getInventoryController,
  getInventoryHospitalController,
  getLatestInventoryController,
} from "../controllers/inventoryController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

// create inventory route
router.post("/create-inventory", authMiddleware, createInventoryController);

// get all blood records
router.get("/get-inventory", authMiddleware, getInventoryController);

// get all blood records for consumers
router.post(
  "/get-inventory-hospital",
  authMiddleware,
  getInventoryHospitalController
);

// get all donor records
router.get("/donor-records", authMiddleware, getDonarsController);

// get all hospital records
router.get("/hospital-records", authMiddleware, getHospitalController);

// get all donor related organization records
router.get(
  "/organization-records",
  authMiddleware,
  getDonorOrganizationController
);

// get all hospitals related organization records
router.get(
  "/organization-records-hospitals",
  authMiddleware,
  getHospitalOrganizationController
);

// get latest 3 records
router.get(
  "/get-recent-blood-records",
  authMiddleware,
  getLatestInventoryController
);

export default router;

import express from "express";
import {
  createAdmin,
  createSuperAdmin,
  deleteAdmin,
  getAllAdmin,
  getChartData,
  getSuperAdminDetails,
  loginSuperAdmin,
  updateAdmin,
} from "../controllers/superAdmin.controller.js";
import { protectSuperAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", createSuperAdmin);
router.post("/login", loginSuperAdmin);
router.post("/createAdmin", protectSuperAdmin, createAdmin);
router.get("/getAllAdmin", getAllAdmin);
router.get("/details", getSuperAdminDetails);
router.put("/updateAdmin/:id", updateAdmin);
router.delete("/deleteAdmin/:id", deleteAdmin);

export default router;

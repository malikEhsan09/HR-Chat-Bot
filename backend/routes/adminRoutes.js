import express from "express";
import {
  findAdminById,
  createEmployee,
  getAllEmployees,
  loginAdmin,
} from "../controllers/admin.controller.js";
import { protectAdmin } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/login", loginAdmin);
router.post("/createEmployee", createEmployee);
router.get("/getAllEmployees", getAllEmployees);
router.get("/:id", findAdminById);

export default router;

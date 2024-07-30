import express from "express";
import {
  addMessage,
  loginEmployee,
} from "../controllers/employee.controller.js";
import { protectEmployee } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/addMessage", protectEmployee, addMessage);
router.post("/login", loginEmployee);

export default router;

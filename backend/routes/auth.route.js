import express from "express";
// import { login } from "../controllers/admin.controller.js";
import { loginn } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/login", loginn);

export default router;

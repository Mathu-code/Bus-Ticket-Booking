import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/adminMiddleware.js";
import { getDashboardStats } from "../controllers/adminController.js";

const router = express.Router();

router.get("/dashboard-stats", protect, requireAdmin, getDashboardStats);

export default router;

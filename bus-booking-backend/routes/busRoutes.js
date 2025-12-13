import express from "express";
import { createBus, getBuses, getBus, updateBus,deleteBus } from "../controllers/busController.js";
import { requireAdmin } from "../middleware/adminMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

// Protect create/update/delete with both protect and requireAdmin
router.post("/", protect, requireAdmin, createBus);
router.put("/:id", protect, requireAdmin, updateBus);
router.delete("/:id", protect, requireAdmin, deleteBus);
router.get("/", getBuses);
router.get("/:id", getBus);

export default router;

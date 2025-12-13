import express from "express";
// ...existing code...
import { register, login, getUsers, getUserById, updateUser, deleteUser, toggleAdminStatus } from "../controllers/authController.js";
import { requireAdmin } from "../middleware/adminMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// Admin-specific routes
router.get("/admin/users", protect, requireAdmin, getUsers);
router.get("/admin/users/:id", protect, requireAdmin, getUserById);
router.put("/admin/users/:id", protect, requireAdmin, updateUser);
router.delete("/admin/users/:id", protect, requireAdmin, deleteUser);
router.patch("/admin/users/:id/toggle-admin", protect, requireAdmin, toggleAdminStatus);
export default router;
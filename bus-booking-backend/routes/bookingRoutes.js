import express from "express";
import { bookTicket, getMyBookings } from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js"; // See below
const router = express.Router();

router.post("/", protect, bookTicket);
router.get("/me", protect, getMyBookings);

export default router;

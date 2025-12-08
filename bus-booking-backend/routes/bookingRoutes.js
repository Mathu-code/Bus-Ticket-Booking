import express from "express";
import { bookTicket, getMyBookings, createBooking } from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/", protect, bookTicket);
router.post("/create", protect, createBooking);
router.get("/me", protect, getMyBookings);

export default router;
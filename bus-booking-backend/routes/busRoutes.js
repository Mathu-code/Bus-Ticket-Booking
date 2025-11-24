import express from "express";
import { createBus, getBuses, getBus } from "../controllers/busController.js";
// Add admin middleware for createBus if needed
const router = express.Router();

router.post("/", createBus); // TODO: protect with admin middleware
router.get("/", getBuses);
router.get("/:id", getBus);

export default router;

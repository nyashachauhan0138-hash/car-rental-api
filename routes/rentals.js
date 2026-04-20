import express from "express";
import {
  getActiveRentals,
  getRentalById,
  getRentalsByCustomer,
  createRental,
  completeRental,
  cancelRental,
  getRevenueAnalytics
} from "../controllers/rentalController.js";

const router = express.Router();

router.get("/active", getActiveRentals);
router.get("/revenue", getRevenueAnalytics);
router.get("/customer/:id", getRentalsByCustomer);
router.get("/:id", getRentalById);
router.post("/", createRental);
router.put("/:id/complete", completeRental);
router.put("/:id/cancel", cancelRental);

export default router;
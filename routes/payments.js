import express from "express";
import {
  getAllPayments,
  getPaymentByRental,
  getPaymentById
} from "../controllers/paymentController.js";

const router = express.Router();

router.get("/", getAllPayments);
router.get("/rental/:rentalId", getPaymentByRental); // ⚠️ keep this BEFORE :id
router.get("/:id", getPaymentById);

export default router;
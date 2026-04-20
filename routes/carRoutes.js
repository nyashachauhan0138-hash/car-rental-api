import express from "express";
import {
  getAllCars,
  getAvailableCars,
  getCarById
} from "../controllers/carController.js";

const router = express.Router();

router.get("/", getAllCars);
router.get("/available", getAvailableCars);
router.get("/:id", getCarById);

export default router;
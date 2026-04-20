import express from "express";
import dotenv from "dotenv";
import cors from "cors";   
import db from "./db/connection.js";

import carRoutes from "./routes/carRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import rentalRoutes from "./routes/rentals.js";
import paymentRoutes from "./routes/payments.js";
import authRoutes from "./routes/auth.js";

import { protect, adminOnly } from "./middleware/auth.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Public routes
app.use("/auth", authRoutes);
app.use("/cars", carRoutes);

// Protected routes
app.use("/customers", customerRoutes);
app.use("/rentals", protect, rentalRoutes);
app.use("/payments", protect, paymentRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Car Rental API is running!" });
});

// Test DB
app.get("/test-db", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 + 1 AS result");
    res.json({ message: "Database connected!", result: rows[0].result });
  } catch (err) {
    res.status(500).json({
      error: "Database connection failed",
      details: err.message,
    });
  }
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({
    error: 'Something went wrong on the server',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
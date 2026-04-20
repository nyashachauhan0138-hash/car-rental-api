import db from "../db/connection.js";

// Get all payments
export const getAllPayments = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM payment");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get payment by rental ID
export const getPaymentByRental = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM payment WHERE rental_id = ?",
      [req.params.rentalId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        error: "No payment found for this rental",
      });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get payment by ID
export const getPaymentById = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM payment WHERE payment_id = ?",
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Payment not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
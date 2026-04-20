import db from "../db/connection.js";

// Get all active rentals
export const getActiveRentals = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM active_rentals_view");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get rental by ID
export const getRentalById = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM rental WHERE rental_id = ?",
      [req.params.id]
    );
    if (rows.length === 0)
      return res.status(404).json({ error: "Rental not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get rentals by customer
export const getRentalsByCustomer = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM rental WHERE customer_id = ?",
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create rental (calls stored procedure)
export const createRental = async (req, res) => {
  try {
    const { customer_id, car_id, start_date, end_date, points_to_redeem } =
      req.body;

    if (!customer_id || !car_id || !start_date || !end_date) {
      return res.status(400).json({
        error: "Required fields: customer_id, car_id, start_date, end_date",
      });
    }

    const pointsToRedeem = points_to_redeem || 0;

    await db.query("CALL create_rental(?, ?, ?, ?, ?)", [
      customer_id,
      car_id,
      start_date,
      end_date,
      pointsToRedeem,
    ]);

    const [rental] = await db.query(
      "SELECT * FROM rental WHERE customer_id = ? AND car_id = ? ORDER BY rental_id DESC LIMIT 1",
      [customer_id, car_id]
    );

    res.status(201).json({
      message: "Rental created successfully",
      rental: rental[0],
    });
  } catch (err) {
    if (err.sqlState === "45000") {
      return res.status(400).json({ error: err.sqlMessage });
    }
    res.status(500).json({ error: err.message });
  }
};

// Complete rental
export const completeRental = async (req, res) => {
  try {
    const { penalty_amount } = req.body;
    const penalty = penalty_amount || 0;

    const [existing] = await db.query(
      "SELECT * FROM rental WHERE rental_id = ?",
      [req.params.id]
    );

    if (existing.length === 0)
      return res.status(404).json({ error: "Rental not found" });

    await db.query("CALL complete_rental(?, ?, ?)", [req.params.id, "upi" , penalty]);

    const [updated] = await db.query(
      "SELECT * FROM rental WHERE rental_id = ?",
      [req.params.id]
    );

    res.json({
      message: "Rental completed successfully",
      rental: updated[0],
    });
  } catch (err) {
    if (err.sqlState === "45000") {
      return res.status(400).json({ error: err.sqlMessage });
    }
    res.status(500).json({ error: err.message });
  }
};

// Cancel rental
export const cancelRental = async (req, res) => {
  try {
    const [existing] = await db.query(
      "SELECT * FROM rental WHERE rental_id = ?",
      [req.params.id]
    );

    if (existing.length === 0)
      return res.status(404).json({ error: "Rental not found" });

    await db.query("CALL cancel_rental(?)", [req.params.id]);

    res.json({
      message: "Rental cancelled successfully",
      rental_id: req.params.id,
    });
  } catch (err) {
    if (err.sqlState === "45000") {
      return res.status(400).json({ error: err.sqlMessage });
    }
    res.status(500).json({ error: err.message });
  }
};

// Revenue analytics
export const getRevenueAnalytics = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM revenue_summary_view");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
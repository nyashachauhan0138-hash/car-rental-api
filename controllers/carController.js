import db from "../db/connection.js";

// Get all cars
export const getAllCars = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM car");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get only available cars
export const getAvailableCars = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM car WHERE c_status = 'available'"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get car by ID
export const getCarById = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM car WHERE car_id = ?",
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Car not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
import db from "../db/connection.js";

// Get all customers
export const getAllCustomers = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM customer");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get customer by ID
export const getCustomerById = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM customer WHERE customer_id = ?",
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create customer
export const createCustomer = async (req, res) => {
  try {
    const { name, email, phone, dob, license_number } = req.body;

    if (!name || !email || !phone) {
      return res
        .status(400)
        .json({ error: "Name, email and phone are required" });
    }

    const [existing] = await db.query(
      "SELECT customer_id FROM customer WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return res
        .status(409)
        .json({ error: "Customer with this email already exists" });
    }

    const [result] = await db.query(
      "INSERT INTO customer (name, email, phone, license_number, dob) VALUES (?, ?, ?, ?, ?)",
      [name, email, phone, license_number, dob]
    );

    res.status(201).json({
      message: "Customer created successfully",
      customer_id: result.insertId,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Customer loyalty
export const getCustomerLoyalty = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM customer_loyalty_view WHERE customer_id = ?",
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
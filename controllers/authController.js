import db from "../db/connection.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register
export const register = async (req, res) => {
  try {
    const { customer_id, email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters",
      });
    }

    const [existing] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        error: "An account with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      "INSERT INTO users (customer_id, email, password, role) VALUES (?, ?, ?, ?)",
      [customer_id || null, email, hashedPassword, role || "customer"]
    );

    res.status(201).json({
      message: "Account created successfully",
      user_id: result.insertId,
    });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Email already in use" });
    }
    res.status(500).json({ error: err.message });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        user_id: user.user_id,
        role: user.role,
        customer_id: user.customer_id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        user_id: user.user_id,
        email: user.email,
        role: user.role,
        customer_id: user.customer_id,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get current user
export const getMe = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT user_id, email, role, customer_id, created_at FROM users WHERE user_id = ?",
      [req.user.user_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==============================
// 🔐 Reset Password (NEW)
// ==============================

export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        error: "Email and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters",
      });
    }

    // Check if user exists
    const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await db.query(
      "UPDATE users SET password = ? WHERE email = ?",
      [hashedPassword, email]
    );

    res.json({
      message: "Password reset successful",
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
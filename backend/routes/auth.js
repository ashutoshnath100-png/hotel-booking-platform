import express from "express";
import dotenv from "dotenv";
import { connection } from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();

const router = express.Router();

// ✅ REGISTER
router.post("/register", async (req, resp) => {
  try {
    const db = await connection();
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return resp.status(400).json({
        message: "All fields are required"
      });
    }

    const existingUser = await db.collection("users").findOne({ email });

    if (existingUser) {
      return resp.status(400).json({
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.collection("users").insertOne({
      name,
      email,
      password: hashedPassword,
      role: "user"
    });

    resp.status(201).json({
      message: "User Registered Successfully"
    });

  } catch (error) {
    console.error(error);
    resp.status(500).json({
      message: "Internal server error"
    });
  }
});

// ✅ LOGIN
router.post("/login", async (req, resp) => {
  try {
    const db = await connection();
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return resp.status(400).json({
        message: "Email and password required"
      });
    }

    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return resp.status(400).json({
        message: "Invalid email or password"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return resp.status(400).json({
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    resp.status(200).json({
      message: "Login successful",
      token,
      role: user.role,
      name: user.name
    });

  } catch (error) {
    console.error(error);
    resp.status(500).json({
      message: "Internal server error"
    });
  }
});

export default router;
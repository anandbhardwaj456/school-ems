const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

// Test endpoint to verify setup routes are working
router.get("/test", (req, res) => {
  res.json({ 
    success: true, 
    message: "Setup routes are working",
    timestamp: new Date().toISOString()
  });
});

// Create first admin user (only if no admin exists)
router.post("/create-first-admin", async (req, res) => {
  try {
    // Check if any admin exists
    const existingAdmin = await User.findOne({ role: "admin" });
    
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin user already exists. Use the admin account to create more users.",
      });
    }

    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "fullName, email, and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role: "admin",
      isActive: true,
      isVerified: true,
      isAdminApproved: true,
    });

    res.status(201).json({
      success: true,
      message: "Admin user created successfully",
      data: {
        userId: admin.userId,
        email: admin.email,
        fullName: admin.fullName,
      },
    });
  } catch (error) {
    console.error("Create first admin error:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

module.exports = router;


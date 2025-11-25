// controllers/registerController.js
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const sendEmailOTP = require("../utils/sendEmailOTP");
const sendSMSOTP = require("../utils/sendSMSOTP");

exports.registerUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ success: false, errors: errors.array() });

    const { fullName, email, phone, password, role } = req.body;
    if (!email && !phone)
      return res.status(400).json({ success: false, message: "Either email or phone is required" });

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ success: false, message: "User already exists" });

    const hashed = password ? await bcrypt.hash(password, 10) : null;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    const user = await User.create({
      fullName,
      email,
      phone,
      password: hashed,
      role,
      otp,
      otpExpiry
    });

    if (email) await sendEmailOTP(email, otp);
    if (phone) await sendSMSOTP(phone, otp);

    res.status(200).json({ success: true, message: "OTP sent successfully", userId: user.userId });
  } catch (err) {
    console.error("❌ Registration error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

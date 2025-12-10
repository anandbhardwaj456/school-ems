const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    if (!user.isVerified) {
      return res.status(403).json({ success: false, message: "Account not verified. Please verify OTP first." });
    }

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: {
        userId: user.userId,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    console.error("❌ Login error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// controllers/verifyOtpController.js
const User = require("../models/User");

exports.verifyOtp = async (req, res) => {
  const { userId, otp } = req.body;

  const user = await User.findByPk(userId);
  if (!user || user.otp !== otp)
    return res.status(400).json({ success: false, message: "Invalid OTP" });

  if (new Date() > user.otpExpiry)
    return res.status(400).json({ success: false, message: "OTP expired" });

  user.isVerified = true;
  user.otp = null;
  user.otpExpiry = null;
  await user.save();

  res.json({ success: true, message: "OTP verified successfully" });
};

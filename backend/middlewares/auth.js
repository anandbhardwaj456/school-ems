const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"] || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.substring(7)
      : null;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res
        .status(500)
        .json({ success: false, message: "JWT secret not configured" });
    }

    const decoded = jwt.verify(token, secret);

    const user = await User.findByPk(decoded.id);
    if (!user || !user.isActive) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid or inactive user" });
    }

    if (!user.isVerified) {
      return res
        .status(403)
        .json({ success: false, message: "Account not verified" });
    }

    req.user = {
      id: user.userId,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      isVerified: user.isVerified,
    };

    next();
  } catch (err) {
    console.error("Auth middleware error:", err.message);
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

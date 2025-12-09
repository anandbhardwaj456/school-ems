const User = require("../models/User");

exports.makeTeacherAdmin = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Only admins can promote users" });
    }

    const { userId } = req.params;

    const user = await User.findOne({ userId });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.role !== "teacher") {
      return res.status(400).json({
        success: false,
        message: "Only teachers can be promoted to admin",
      });
    }

    user.role = "admin";
    user.isAdminApproved = true;
    user.isActive = true;

    await user.save();

    res.json({
      success: true,
      message: "Teacher promoted to admin successfully",
      data: {
        userId: user.userId,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        isAdminApproved: user.isAdminApproved,
        isActive: user.isActive,
      },
    });
  } catch (err) {
    console.error("Make teacher admin error:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

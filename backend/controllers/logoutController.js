exports.logoutUser = async (req, res) => {
  try {
    // If token is managed by client (frontend/localStorage)
    // just return success and let client remove it.
    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (err) {
    console.error("❌ Logout error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

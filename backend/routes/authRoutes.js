const express = require("express");
const { body } = require("express-validator");
const { registerUser } = require("../controllers/registerController");
const { loginUser } = require("../controllers/loginController");
const { logoutUser } = require("../controllers/logoutController");
const { verifyOtp } = require("../controllers/verifyOtpController");
const { googleAuth, googleAuthCallback } = require("../controllers/googleAuthController");
const { createTeacherInvite, registerTeacherWithInvite } = require("../controllers/inviteController");
const { makeTeacherAdmin } = require("../controllers/adminController");
const auth = require("../middlewares/auth");

const router = express.Router();

// Debug route to verify auth routes are working
router.get("/test", (req, res) => {
  res.json({ message: "Auth routes are working", timestamp: new Date().toISOString() });
});

// Simple login test route (without validation) to debug
router.post("/login-test", async (req, res) => {
  console.log("Login test route hit:", req.body);
  res.json({ 
    success: true, 
    message: "Login route is accessible",
    body: req.body,
    timestamp: new Date().toISOString()
  });
});

router.post(
  "/register",
  [body("fullName").notEmpty(), body("password").isLength({ min: 6 })],
  registerUser
);

router.post(
  "/register/teacher-invite",
  [
    body("token").notEmpty(),
    body("fullName").notEmpty(),
    body("password").isLength({ min: 6 }),
  ],
  registerTeacherWithInvite
);

router.post("/verify-otp", verifyOtp);

// Login route - simplified to avoid express-validator issues
router.post("/login", async (req, res, next) => {
  console.log("Login route accessed - Method:", req.method, "Path:", req.path);
  console.log("Request body:", req.body);
  
  // Basic validation
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required"
    });
  }
  
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email format"
    });
  }
  
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters"
    });
  }
  
  // Pass to login controller
  next();
}, loginUser);

router.post("/logout", logoutUser);

router.get("/me", auth, (req, res) => {
  res.json({ success: true, user: req.user });
});

router.post("/admin/invites", auth, createTeacherInvite);

router.put("/admin/users/:userId/make-admin", auth, makeTeacherAdmin);

router.get("/google", googleAuth);
router.get("/google/callback", googleAuthCallback);

module.exports = router;

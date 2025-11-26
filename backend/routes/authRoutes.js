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

router.post(
  "/login",
  [body("email").isEmail(), body("password").isLength({ min: 6 })],
  loginUser
);

router.post("/logout", logoutUser);

router.get("/me", auth, (req, res) => {
  res.json({ success: true, user: req.user });
});

router.post("/admin/invites", auth, createTeacherInvite);

router.put("/admin/users/:userId/make-admin", auth, makeTeacherAdmin);

router.get("/google", googleAuth);
router.get("/google/callback", googleAuthCallback);

module.exports = router;

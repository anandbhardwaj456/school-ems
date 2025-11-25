const passport = require("../config/passport");
const generateToken = require("../utils/generateToken");

exports.googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
  session: false,
});

exports.googleAuthCallback = [
  passport.authenticate("google", { failureRedirect: "/login", session: false }),
  async (req, res) => {
    console.log("Google callback HIT");  // <-- ADD THIS

    if (!req.user.isVerified) {
      return res.redirect("http://localhost:3000/verify-otp?source=google");
    }

    const token = generateToken(req.user);
    res.redirect(`http://localhost:3000/dashboard?token=${token}`);
  },
];

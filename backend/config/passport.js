// config/passport.js
const dotenv = require("dotenv");
dotenv.config();

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");
const sendEmailOTP = require("../utils/sendEmailOTP");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          const email = profile.emails?.[0]?.value || null;

          const otp = Math.floor(100000 + Math.random() * 900000).toString();
          const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

          user = await User.create({
            fullName: profile.displayName,
            email,
            googleId: profile.id,
            isVerified: false,
            otp,
            otpExpiry,
          });

          if (email) {
            await sendEmailOTP(email, otp);
          }
        }

        return done(null, user);
      } catch (err) {
        console.error("GoogleStrategy verify error:", err);
        if (err && err.parent) {
          console.error("Underlying DB error:", err.parent);
        }
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.userId);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findOne({ userId: id });
    done(null, user || null);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;

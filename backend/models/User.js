const { mongoose } = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const UserSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
    },
    phone: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      enum: ["admin", "teacher", "student", "parent"],
      default: "student",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isAdminApproved: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
    },
    otpExpiry: {
      type: Date,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    refreshToken: {
      type: String,
    },
    refreshTokenExpiry: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);

const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const InviteToken = require("../models/InviteToken");
const User = require("../models/User");
const Teacher = require("../models/Teacher");
const sendEmailOTP = require("../utils/sendEmailOTP");
const sendSMSOTP = require("../utils/sendSMSOTP");

exports.createTeacherInvite = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Only admins can create invites" });
    }

    const { email, expiresAt, maxUses } = req.body || {};

    const token = crypto.randomBytes(32).toString("hex");

    const inviteData = {
      token,
      type: "teacher",
      email: email || null,
      maxUses: maxUses || 1,
    };

    if (expiresAt) {
      inviteData.expiresAt = new Date(expiresAt);
    }

    const invite = await InviteToken.create(inviteData);

    res.status(201).json({
      success: true,
      message: "Teacher invite created successfully",
      data: invite,
    });
  } catch (err) {
    console.error("Create invite error:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

exports.registerTeacherWithInvite = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ success: false, errors: errors.array() });
    }

    const { token, fullName, email, phone, password } = req.body;

    if (!token) {
      return res
        .status(400)
        .json({ success: false, message: "Invite token is required" });
    }

    const invite = await InviteToken.findOne({ where: { token } });

    if (!invite || invite.status !== "ACTIVE") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or inactive invite token" });
    }

    if (invite.type !== "teacher") {
      return res
        .status(400)
        .json({ success: false, message: "Invite token is not for a teacher" });
    }

    if (invite.expiresAt && new Date(invite.expiresAt) < new Date()) {
      return res
        .status(400)
        .json({ success: false, message: "Invite token has expired" });
    }

    if (invite.maxUses && invite.usedCount >= invite.maxUses) {
      return res
        .status(400)
        .json({ success: false, message: "Invite token usage limit reached" });
    }

    if (!email && !phone) {
      return res.status(400).json({
        success: false,
        message: "Either email or phone is required",
      });
    }

    if (invite.email && email && invite.email !== email) {
      return res.status(400).json({
        success: false,
        message: "Email does not match the invite",
      });
    }

    if (email) {
      const existing = await User.findOne({ where: { email } });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: "User with this email already exists",
        });
      }
    }

    const hashed = password ? await bcrypt.hash(password, 10) : null;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    const user = await User.create({
      fullName,
      email,
      phone,
      password: hashed,
      role: "teacher",
      otp,
      otpExpiry,
      isAdminApproved: false,
    });

    await Teacher.create({
      userId: user.userId,
    });

    if (email) await sendEmailOTP(email, otp);
    if (phone) await sendSMSOTP(phone, otp);

    invite.usedCount += 1;
    if (invite.maxUses && invite.usedCount >= invite.maxUses) {
      invite.status = "USED";
    }
    await invite.save();

    res.status(201).json({
      success: true,
      message: "Teacher registered via invite. OTP sent for verification.",
      userId: user.userId,
    });
  } catch (err) {
    console.error("Register teacher with invite error:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

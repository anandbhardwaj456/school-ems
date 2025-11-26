const { validationResult } = require("express-validator");
const AdmissionApplication = require("../models/AdmissionApplication");
const User = require("../models/User");
const Student = require("../models/Student");

exports.applyForAdmission = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ success: false, errors: errors.array() });
    }

    const { fullName, email, phone, dob, classAppliedFor } = req.body;

    const application = await AdmissionApplication.create({
      fullName,
      email,
      phone,
      dob,
      classAppliedFor,
      status: "PENDING",
    });

    res.status(201).json({
      success: true,
      message: "Admission application submitted successfully",
      data: application,
    });
  } catch (err) {
    console.error("Admission apply error:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

exports.moveToAssessment = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Only admins can update admissions" });
    }

    const { id } = req.params;

    const application = await AdmissionApplication.findByPk(id);
    if (!application) {
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });
    }

    if (application.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        message: "Only pending applications can be moved to assessment",
      });
    }

    application.status = "UNDER_ASSESSMENT";
    await application.save();

    res.json({
      success: true,
      message: "Application moved to assessment",
      data: application,
    });
  } catch (err) {
    console.error("Move to assessment error:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

exports.updateAssessment = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Only admins can update admissions" });
    }

    const { id } = req.params;
    const { assessmentDate, assessmentScore, passed, remarks } = req.body;

    const application = await AdmissionApplication.findByPk(id);
    if (!application) {
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });
    }

    if (application.status !== "UNDER_ASSESSMENT") {
      return res.status(400).json({
        success: false,
        message: "Application must be under assessment to update assessment",
      });
    }

    if (assessmentDate) application.assessmentDate = assessmentDate;
    if (assessmentScore !== undefined) {
      application.assessmentScore = assessmentScore;
    }
    if (remarks !== undefined) {
      application.remarks = remarks;
    }

    application.status = passed
      ? "ASSESSMENT_PASSED"
      : "ASSESSMENT_FAILED";

    await application.save();

    res.json({
      success: true,
      message: "Assessment updated",
      data: application,
    });
  } catch (err) {
    console.error("Update assessment error:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

exports.finalDecision = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Only admins can update admissions" });
    }

    const { id } = req.params;
    const { accept } = req.body;

    const application = await AdmissionApplication.findByPk(id);
    if (!application) {
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });
    }

    if (
      application.status !== "ASSESSMENT_PASSED" &&
      application.status !== "ASSESSMENT_FAILED"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Application must have a completed assessment before final decision",
      });
    }

    if (!accept) {
      application.status = "REJECTED";
      await application.save();

      return res.json({
        success: true,
        message: "Application rejected",
        data: application,
      });
    }

    if (application.status !== "ASSESSMENT_PASSED") {
      return res.status(400).json({
        success: false,
        message: "Only passed assessments can be accepted",
      });
    }

    application.status = "ACCEPTED";
    await application.save();

    const [user] = await User.findOrCreate({
      where: { email: application.email },
      defaults: {
        fullName: application.fullName,
        email: application.email,
        phone: application.phone,
        password: null,
        role: "student",
        isVerified: true,
        isAdminApproved: true,
        isActive: true,
      },
    });

    await Student.findOrCreate({
      where: { userId: user.userId },
      defaults: {
        classId: application.classAppliedFor,
      },
    });

    res.json({
      success: true,
      message: "Application accepted and student record created/linked",
      data: { application, userId: user.userId },
    });
  } catch (err) {
    console.error("Final decision error:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const { validationResult } = require("express-validator");
const AttendanceSession = require("../models/AttendanceSession");
const AttendanceEntry = require("../models/AttendanceEntry");
const Student = require("../models/Student");

exports.createSession = async (req, res) => {
  try {
    if (!req.user || (req.user.role !== "teacher" && req.user.role !== "admin")) {
      return res.status(403).json({
        success: false,
        message: "Only teachers and admins can create attendance sessions",
      });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ success: false, errors: errors.array() });
    }

    const { date, classId, sectionId, period, remarks } = req.body;

    const existing = await AttendanceSession.findOne({
      where: { date, classId, sectionId, period: period || null },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Attendance session already exists for this date/class/section/period",
      });
    }

    const session = await AttendanceSession.create({
      date,
      classId,
      sectionId,
      period: period || null,
      teacherId: req.user.id,
      remarks: remarks || null,
    });

    res.status(201).json({
      success: true,
      message: "Attendance session created",
      data: session,
    });
  } catch (err) {
    console.error("Create attendance session error:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

exports.addEntries = async (req, res) => {
  try {
    if (!req.user || (req.user.role !== "teacher" && req.user.role !== "admin")) {
      return res.status(403).json({
        success: false,
        message: "Only teachers and admins can mark attendance",
      });
    }

    const { sessionId } = req.params;
    const { entries } = req.body;

    if (!Array.isArray(entries) || entries.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Entries array is required",
      });
    }

    const session = await AttendanceSession.findByPk(sessionId);
    if (!session) {
      return res
        .status(404)
        .json({ success: false, message: "Attendance session not found" });
    }

    if (session.status === "CLOSED") {
      return res.status(400).json({
        success: false,
        message: "Cannot modify a closed attendance session",
      });
    }

    const validStatuses = ["PRESENT", "ABSENT", "LATE", "HALF_DAY"];

    const results = [];
    for (const e of entries) {
      if (!e.studentId || !validStatuses.includes(e.status)) continue;

      const student = await Student.findByPk(e.studentId);
      if (!student) continue;

      const [entry] = await AttendanceEntry.findOrCreate({
        where: { sessionId, studentId: e.studentId },
        defaults: {
          status: e.status,
          remarks: e.remarks || null,
        },
      });

      if (!entry.isNewRecord) {
        entry.status = e.status;
        entry.remarks = e.remarks || null;
        await entry.save();
      }

      results.push(entry);
    }

    res.json({
      success: true,
      message: "Attendance entries saved",
      data: results,
    });
  } catch (err) {
    console.error("Add attendance entries error:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

exports.listSessions = async (req, res) => {
  try {
    if (!req.user || (req.user.role !== "teacher" && req.user.role !== "admin")) {
      return res.status(403).json({
        success: false,
        message: "Only teachers and admins can view attendance sessions",
      });
    }

    const { date, classId, sectionId } = req.query;

    const where = {};
    if (date) where.date = date;
    if (classId) where.classId = classId;
    if (sectionId) where.sectionId = sectionId;

    const sessions = await AttendanceSession.findAll({
      where,
      order: [["date", "DESC"]],
    });

    res.json({ success: true, data: sessions });
  } catch (err) {
    console.error("List attendance sessions error:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

exports.getSessionEntries = async (req, res) => {
  try {
    if (!req.user || (req.user.role !== "teacher" && req.user.role !== "admin")) {
      return res.status(403).json({
        success: false,
        message: "Only teachers and admins can view attendance entries",
      });
    }

    const { sessionId } = req.params;

    const session = await AttendanceSession.findByPk(sessionId);
    if (!session) {
      return res
        .status(404)
        .json({ success: false, message: "Attendance session not found" });
    }

    const entries = await AttendanceEntry.findAll({ where: { sessionId } });

    res.json({
      success: true,
      data: { session, entries },
    });
  } catch (err) {
    console.error("Get session entries error:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

exports.closeSession = async (req, res) => {
  try {
    if (!req.user || (req.user.role !== "teacher" && req.user.role !== "admin")) {
      return res.status(403).json({
        success: false,
        message: "Only teachers and admins can close attendance sessions",
      });
    }

    const { sessionId } = req.params;

    const session = await AttendanceSession.findByPk(sessionId);
    if (!session) {
      return res
        .status(404)
        .json({ success: false, message: "Attendance session not found" });
    }

    session.status = "CLOSED";
    await session.save();

    res.json({ success: true, message: "Attendance session closed", data: session });
  } catch (err) {
    console.error("Close attendance session error:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

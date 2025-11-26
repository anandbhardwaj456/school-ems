const Exam = require("../models/Exam");
const ExamMark = require("../models/ExamMark");
const Student = require("../models/Student");

exports.listMyExams = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "teacher") {
      return res.status(403).json({
        success: false,
        message: "Only teachers can view their exams",
      });
    }

    const { classId, sectionId, status } = req.query;

    const where = { teacherId: req.user.id };
    if (classId) where.classId = classId;
    if (sectionId) where.sectionId = sectionId;
    if (status) where.status = status;

    const exams = await Exam.findAll({ where, order: [["date", "DESC"]] });

    res.json({ success: true, data: exams });
  } catch (err) {
    console.error("List my exams error:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

exports.enterMarks = async (req, res) => {
  try {
    const { examId } = req.params;

    if (!req.user || (req.user.role !== "teacher" && req.user.role !== "admin")) {
      return res.status(403).json({
        success: false,
        message: "Only teachers and admins can enter marks",
      });
    }

    const exam = await Exam.findByPk(examId);
    if (!exam) {
      return res
        .status(404)
        .json({ success: false, message: "Exam not found" });
    }

    if (exam.status === "PUBLISHED") {
      return res.status(400).json({
        success: false,
        message: "Cannot modify marks for a published exam",
      });
    }

    if (req.user.role === "teacher" && exam.teacherId && exam.teacherId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not assigned to this exam",
      });
    }

    const { entries } = req.body;
    if (!Array.isArray(entries) || entries.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Entries array is required",
      });
    }

    const results = [];
    for (const e of entries) {
      if (!e.studentId) continue;

      const student = await Student.findByPk(e.studentId);
      if (!student) continue;

      const [mark] = await ExamMark.findOrCreate({
        where: { examId, studentId: e.studentId },
        defaults: {
          marksObtained: e.marksObtained,
          attendanceStatus: e.attendanceStatus || null,
          remarks: e.remarks || null,
        },
      });

      if (!mark.isNewRecord) {
        mark.marksObtained = e.marksObtained;
        mark.attendanceStatus = e.attendanceStatus || null;
        mark.remarks = e.remarks || null;
        await mark.save();
      }

      results.push(mark);
    }

    res.json({
      success: true,
      message: "Marks saved",
      data: results,
    });
  } catch (err) {
    console.error("Enter marks error:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

exports.getExamMarks = async (req, res) => {
  try {
    const { examId } = req.params;

    if (!req.user || (req.user.role !== "teacher" && req.user.role !== "admin")) {
      return res.status(403).json({
        success: false,
        message: "Only teachers and admins can view marks",
      });
    }

    const exam = await Exam.findByPk(examId);
    if (!exam) {
      return res
        .status(404)
        .json({ success: false, message: "Exam not found" });
    }

    if (req.user.role === "teacher" && exam.teacherId && exam.teacherId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not assigned to this exam",
      });
    }

    const marks = await ExamMark.findAll({ where: { examId } });

    res.json({ success: true, data: marks });
  } catch (err) {
    console.error("Get exam marks error:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

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

    const filter = { teacherId: req.user.id };
    if (classId) filter.classId = classId;
    if (sectionId) filter.sectionId = sectionId;
    if (status) filter.status = status;

    const exams = await Exam.find(filter).sort({ date: -1 });

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

    const exam = await Exam.findOne({ examId });
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

      const student = await Student.findOne({ studentId: e.studentId });
      if (!student) continue;

      let mark = await ExamMark.findOne({ examId, studentId: e.studentId });

      if (!mark) {
        mark = await ExamMark.create({
          examId,
          studentId: e.studentId,
          marksObtained: e.marksObtained,
          attendanceStatus: e.attendanceStatus || null,
          remarks: e.remarks || null,
        });
      } else {
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

    const marks = await ExamMark.find({ examId });

    res.json({ success: true, data: marks });
  } catch (err) {
    console.error("Get exam marks error:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

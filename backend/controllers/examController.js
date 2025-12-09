const { validationResult } = require("express-validator");
const ExamType = require("../models/ExamType");
const Exam = require("../models/Exam");

exports.createExamType = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Only admins can manage exam types" });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ success: false, errors: errors.array() });
    }

    const { name, weightage, description } = req.body;

    const examType = await ExamType.create({ name, weightage, description });

    res.status(201).json({
      success: true,
      message: "Exam type created",
      data: examType,
    });
  } catch (err) {
    console.error("Create exam type error:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

exports.listExamTypes = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Only admins can view exam types" });
    }

    const { isActive } = req.query;

    const filter = {};
    if (isActive === "true") filter.isActive = true;
    if (isActive === "false") filter.isActive = false;

    const types = await ExamType.find(filter).sort({ createdAt: -1 });

    res.json({ success: true, data: types });
  } catch (err) {
    console.error("List exam types error:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

exports.updateExamType = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Only admins can manage exam types" });
    }

    const { id } = req.params;
    const { name, weightage, description } = req.body;

    const type = await ExamType.findOne({ examTypeId: id });
    if (!type) {
      return res
        .status(404)
        .json({ success: false, message: "Exam type not found" });
    }

    if (name !== undefined) type.name = name;
    if (weightage !== undefined) type.weightage = weightage;
    if (description !== undefined) type.description = description;

    await type.save();

    res.json({ success: true, message: "Exam type updated", data: type });
  } catch (err) {
    console.error("Update exam type error:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

exports.updateExamTypeStatus = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Only admins can manage exam types" });
    }

    const { id } = req.params;
    const { isActive } = req.body;

    const type = await ExamType.findOne({ examTypeId: id });
    if (!type) {
      return res
        .status(404)
        .json({ success: false, message: "Exam type not found" });
    }

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isActive must be a boolean",
      });
    }

    type.isActive = isActive;
    await type.save();

    res.json({ success: true, message: "Exam type status updated", data: type });
  } catch (err) {
    console.error("Update exam type status error:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

exports.createExam = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Only admins can create exams" });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ success: false, errors: errors.array() });
    }

    const {
      examTypeId,
      classId,
      sectionId,
      subject,
      date,
      maxMarks,
      teacherId,
      remarks,
    } = req.body;

    const exam = await Exam.create({
      examTypeId,
      classId,
      sectionId,
      subject,
      date,
      maxMarks,
      teacherId: teacherId || null,
      remarks: remarks || null,
    });

    res.status(201).json({
      success: true,
      message: "Exam created",
      data: exam,
    });
  } catch (err) {
    console.error("Create exam error:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

exports.listExams = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Only admins can view exams" });
    }

    const { classId, sectionId, examTypeId, date, status } = req.query;

    const filter = {};
    if (classId) filter.classId = classId;
    if (sectionId) filter.sectionId = sectionId;
    if (examTypeId) filter.examTypeId = examTypeId;
    if (date) filter.date = date;
    if (status) filter.status = status;

    const exams = await Exam.find(filter).sort({ date: -1 });

    res.json({ success: true, data: exams });
  } catch (err) {
    console.error("List exams error:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

exports.updateExamStatus = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Only admins can update exams" });
    }

    const { id } = req.params;
    const { status } = req.body;

    const allowed = ["SCHEDULED", "ONGOING", "COMPLETED", "PUBLISHED"];
    if (!allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const exam = await Exam.findOne({ examId: id });
    if (!exam) {
      return res
        .status(404)
        .json({ success: false, message: "Exam not found" });
    }

    exam.status = status;
    await exam.save();

    res.json({ success: true, message: "Exam status updated", data: exam });
  } catch (err) {
    console.error("Update exam status error:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

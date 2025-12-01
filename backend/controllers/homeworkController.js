const Homework = require("../models/Homework");
const HomeworkSubmission = require("../models/HomeworkSubmission");
const Class = require("../models/Class");
const Section = require("../models/Section");
const Subject = require("../models/Subject");
const Teacher = require("../models/Teacher");

exports.createHomework = async (req, res) => {
  try {
    if (!req.user || (req.user.role !== "admin" && req.user.role !== "teacher")) {
      return res.status(403).json({
        success: false,
        message: "Only admins and teachers can create homework",
      });
    }

    const { classId, sectionId, subjectId, teacherId, title, description, dueDate, attachments } =
      req.body;

    const klass = await Class.findByPk(classId);
    if (!klass) {
      return res
        .status(404)
        .json({ success: false, message: "Class not found" });
    }

    const section = await Section.findByPk(sectionId);
    if (!section) {
      return res
        .status(404)
        .json({ success: false, message: "Section not found" });
    }

    const subject = await Subject.findByPk(subjectId);
    if (!subject) {
      return res
        .status(404)
        .json({ success: false, message: "Subject not found" });
    }

    const teacher = await Teacher.findByPk(teacherId);
    if (!teacher) {
      return res
        .status(404)
        .json({ success: false, message: "Teacher not found" });
    }

    if (!title) {
      return res
        .status(400)
        .json({ success: false, message: "Homework title is required" });
    }

    const hw = await Homework.create({
      classId,
      sectionId,
      subjectId,
      teacherId,
      title,
      description,
      dueDate,
      attachments,
    });

    res.status(201).json({ success: true, data: hw });
  } catch (err) {
    console.error("Create homework error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.listHomeworkForClass = async (req, res) => {
  try {
    if (!req.user || (req.user.role !== "admin" && req.user.role !== "teacher" && req.user.role !== "student" && req.user.role !== "parent")) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view homework",
      });
    }

    const { classId, sectionId } = req.query;

    const where = {};
    if (classId) where.classId = classId;
    if (sectionId) where.sectionId = sectionId;

    const list = await Homework.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });

    res.json({ success: true, data: list });
  } catch (err) {
    console.error("List homework error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.createSubmission = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Only students can submit homework",
      });
    }

    const { homeworkId, attachments, remarks } = req.body;
    const studentId = req.user.id;

    const hw = await Homework.findByPk(homeworkId);
    if (!hw) {
      return res
        .status(404)
        .json({ success: false, message: "Homework not found" });
    }

    const submission = await HomeworkSubmission.create({
      homeworkId,
      studentId,
      status: "SUBMITTED",
      submittedAt: new Date(),
      attachments,
      remarks,
    });

    res.status(201).json({ success: true, data: submission });
  } catch (err) {
    console.error("Create homework submission error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.listSubmissionsForHomework = async (req, res) => {
  try {
    if (!req.user || (req.user.role !== "admin" && req.user.role !== "teacher")) {
      return res.status(403).json({
        success: false,
        message: "Only admins and teachers can view submissions",
      });
    }

    const { homeworkId } = req.params;

    const subs = await HomeworkSubmission.findAll({
      where: { homeworkId },
      order: [["submittedAt", "DESC"]],
    });

    res.json({ success: true, data: subs });
  } catch (err) {
    console.error("List homework submissions error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

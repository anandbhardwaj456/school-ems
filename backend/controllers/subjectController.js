const { Op } = require("sequelize");
const Subject = require("../models/Subject");
const Class = require("../models/Class");
const Teacher = require("../models/Teacher");
const ClassSubject = require("../models/ClassSubject");
const TeacherSubject = require("../models/TeacherSubject");

// SUBJECT CRUD
exports.createSubject = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Only admins can create subjects" });
    }

    const { name, code, status } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Subject name is required" });
    }

    if (code) {
      const existing = await Subject.findOne({ where: { code } });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: "Subject with this code already exists",
        });
      }
    }

    const subject = await Subject.create({ name, code, status });

    res.status(201).json({
      success: true,
      message: "Subject created successfully",
      data: subject,
    });
  } catch (err) {
    console.error("Create subject error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.listSubjects = async (req, res) => {
  try {
    if (!req.user || (req.user.role !== "admin" && req.user.role !== "teacher")) {
      return res.status(403).json({
        success: false,
        message: "Only admins and teachers can view subjects",
      });
    }

    const { search, status } = req.query;

    const where = {};
    if (status) where.status = status;
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { code: { [Op.like]: `%${search}%` } },
      ];
    }

    const subjects = await Subject.findAll({
      where,
      order: [["name", "ASC"]],
    });

    res.json({ success: true, data: subjects });
  } catch (err) {
    console.error("List subjects error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.updateSubject = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Only admins can update subjects" });
    }

    const { id } = req.params;
    const { name, code, status } = req.body;

    const subject = await Subject.findByPk(id);
    if (!subject) {
      return res
        .status(404)
        .json({ success: false, message: "Subject not found" });
    }

    if (code && code !== subject.code) {
      const existing = await Subject.findOne({ where: { code } });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: "Subject with this code already exists",
        });
      }
    }

    if (name !== undefined) subject.name = name;
    if (code !== undefined) subject.code = code;
    if (status !== undefined) subject.status = status;

    await subject.save();

    res.json({ success: true, message: "Subject updated", data: subject });
  } catch (err) {
    console.error("Update subject error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.deleteSubject = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Only admins can delete subjects" });
    }

    const { id } = req.params;

    const subject = await Subject.findByPk(id);
    if (!subject) {
      return res
        .status(404)
        .json({ success: false, message: "Subject not found" });
    }

    subject.status = "INACTIVE";
    await subject.save();

    res.json({ success: true, message: "Subject deactivated", data: subject });
  } catch (err) {
    console.error("Delete subject error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// CLASS-SUBJECT ASSIGNMENTS
exports.assignSubjectToClass = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can assign subjects to classes",
      });
    }

    const { classId } = req.params;
    const { subjectId } = req.body;

    const klass = await Class.findByPk(classId);
    if (!klass) {
      return res
        .status(404)
        .json({ success: false, message: "Class not found" });
    }

    const subject = await Subject.findByPk(subjectId);
    if (!subject) {
      return res
        .status(404)
        .json({ success: false, message: "Subject not found" });
    }

    const existing = await ClassSubject.findOne({ where: { classId, subjectId } });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Subject already assigned to this class",
      });
    }

    const cs = await ClassSubject.create({ classId, subjectId });

    res.status(201).json({
      success: true,
      message: "Subject assigned to class",
      data: cs,
    });
  } catch (err) {
    console.error("Assign subject to class error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.listSubjectsForClass = async (req, res) => {
  try {
    if (!req.user || (req.user.role !== "admin" && req.user.role !== "teacher")) {
      return res.status(403).json({
        success: false,
        message: "Only admins and teachers can view class subjects",
      });
    }

    const { classId } = req.params;

    const mappings = await ClassSubject.findAll({ where: { classId } });
    const subjectIds = mappings.map((m) => m.subjectId);

    const subjects = subjectIds.length
      ? await Subject.findAll({ where: { subjectId: subjectIds } })
      : [];

    res.json({ success: true, data: subjects });
  } catch (err) {
    console.error("List subjects for class error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// TEACHER-SUBJECT ASSIGNMENTS
exports.assignSubjectToTeacher = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can assign subjects to teachers",
      });
    }

    const { teacherId } = req.params;
    const { subjectId, classId } = req.body;

    const teacher = await Teacher.findByPk(teacherId);
    if (!teacher) {
      return res
        .status(404)
        .json({ success: false, message: "Teacher not found" });
    }

    const subject = await Subject.findByPk(subjectId);
    if (!subject) {
      return res
        .status(404)
        .json({ success: false, message: "Subject not found" });
    }

    if (classId) {
      const klass = await Class.findByPk(classId);
      if (!klass) {
        return res
          .status(404)
          .json({ success: false, message: "Class not found" });
      }
    }

    const existing = await TeacherSubject.findOne({
      where: { teacherId, subjectId, classId: classId || null },
    });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Subject already assigned to this teacher",
      });
    }

    const ts = await TeacherSubject.create({ teacherId, subjectId, classId });

    res.status(201).json({
      success: true,
      message: "Subject assigned to teacher",
      data: ts,
    });
  } catch (err) {
    console.error("Assign subject to teacher error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.listSubjectsForTeacher = async (req, res) => {
  try {
    if (!req.user || (req.user.role !== "admin" && req.user.role !== "teacher")) {
      return res.status(403).json({
        success: false,
        message: "Only admins and teachers can view teacher subjects",
      });
    }

    const { teacherId } = req.params;

    const mappings = await TeacherSubject.findAll({ where: { teacherId } });
    const subjectIds = mappings.map((m) => m.subjectId);

    const subjects = subjectIds.length
      ? await Subject.findAll({ where: { subjectId: subjectIds } })
      : [];

    res.json({ success: true, data: subjects, mappings });
  } catch (err) {
    console.error("List subjects for teacher error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

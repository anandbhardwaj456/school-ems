const TimetableSlot = require("../models/TimetableSlot");
const Class = require("../models/Class");
const Section = require("../models/Section");
const Subject = require("../models/Subject");
const Teacher = require("../models/Teacher");

exports.createSlot = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Only admins can create timetable slots" });
    }

    const {
      classId,
      sectionId,
      subjectId,
      teacherId,
      dayOfWeek,
      startTime,
      endTime,
      room,
    } = req.body;

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

    const slot = await TimetableSlot.create({
      classId,
      sectionId,
      subjectId,
      teacherId,
      dayOfWeek,
      startTime,
      endTime,
      room,
    });

    res.status(201).json({
      success: true,
      message: "Timetable slot created",
      data: slot,
    });
  } catch (err) {
    console.error("Create slot error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.listClassTimetable = async (req, res) => {
  try {
    if (!req.user || (req.user.role !== "admin" && req.user.role !== "teacher" && req.user.role !== "student")) {
      return res.status(403).json({
        success: false,
        message: "Only admins, teachers, and students can view class timetable",
      });
    }

    const { classId, sectionId } = req.query;

    const slots = await TimetableSlot.findAll({
      where: { classId, sectionId },
      order: [["dayOfWeek", "ASC"], ["startTime", "ASC"]],
    });

    res.json({ success: true, data: slots });
  } catch (err) {
    console.error("List class timetable error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.listTeacherTimetable = async (req, res) => {
  try {
    if (!req.user || (req.user.role !== "admin" && req.user.role !== "teacher")) {
      return res.status(403).json({
        success: false,
        message: "Only admins and teachers can view teacher timetable",
      });
    }

    const { teacherId } = req.params;

    const slots = await TimetableSlot.findAll({
      where: { teacherId },
      order: [["dayOfWeek", "ASC"], ["startTime", "ASC"]],
    });

    res.json({ success: true, data: slots });
  } catch (err) {
    console.error("List teacher timetable error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.deleteSlot = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Only admins can delete timetable slots" });
    }

    const { id } = req.params;

    const slot = await TimetableSlot.findByPk(id);
    if (!slot) {
      return res
        .status(404)
        .json({ success: false, message: "Timetable slot not found" });
    }

    await slot.destroy();

    res.json({ success: true, message: "Timetable slot deleted" });
  } catch (err) {
    console.error("Delete slot error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

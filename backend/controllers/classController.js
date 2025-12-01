const { Op } = require("sequelize");
const Class = require("../models/Class");
const Section = require("../models/Section");
const Teacher = require("../models/Teacher");

// Classes
exports.createClass = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Only admins can create classes" });
    }

    const { name, displayName, academicYear, status } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Class name is required" });
    }

    const existing = await Class.findOne({ where: { name, academicYear } });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Class with this name already exists for this academic year",
      });
    }

    const klass = await Class.create({ name, displayName, academicYear, status });

    res.status(201).json({
      success: true,
      message: "Class created successfully",
      data: klass,
    });
  } catch (err) {
    console.error("Create class error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.listClasses = async (req, res) => {
  try {
    if (!req.user || (req.user.role !== "admin" && req.user.role !== "teacher")) {
      return res.status(403).json({
        success: false,
        message: "Only admins and teachers can view classes",
      });
    }

    const { academicYear, status } = req.query;

    const where = {};
    if (academicYear) where.academicYear = academicYear;
    if (status) where.status = status;

    const classes = await Class.findAll({
      where,
      order: [["name", "ASC"]],
    });

    res.json({ success: true, data: classes });
  } catch (err) {
    console.error("List classes error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.getClassById = async (req, res) => {
  try {
    if (!req.user || (req.user.role !== "admin" && req.user.role !== "teacher")) {
      return res.status(403).json({
        success: false,
        message: "Only admins and teachers can view class details",
      });
    }

    const { id } = req.params;

    const klass = await Class.findByPk(id, {
      include: [
        {
          model: Section,
        },
      ],
    });

    if (!klass) {
      return res
        .status(404)
        .json({ success: false, message: "Class not found" });
    }

    res.json({ success: true, data: klass });
  } catch (err) {
    console.error("Get class error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.updateClass = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Only admins can update classes" });
    }

    const { id } = req.params;
    const { name, displayName, academicYear, status } = req.body;

    const klass = await Class.findByPk(id);
    if (!klass) {
      return res
        .status(404)
        .json({ success: false, message: "Class not found" });
    }

    if (name !== undefined) klass.name = name;
    if (displayName !== undefined) klass.displayName = displayName;
    if (academicYear !== undefined) klass.academicYear = academicYear;
    if (status !== undefined) klass.status = status;

    await klass.save();

    res.json({ success: true, message: "Class updated", data: klass });
  } catch (err) {
    console.error("Update class error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.deleteClass = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Only admins can delete classes" });
    }

    const { id } = req.params;

    const klass = await Class.findByPk(id);
    if (!klass) {
      return res
        .status(404)
        .json({ success: false, message: "Class not found" });
    }

    klass.status = "INACTIVE";
    await klass.save();

    res.json({ success: true, message: "Class deactivated", data: klass });
  } catch (err) {
    console.error("Delete class error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Sections
exports.listSectionsForClass = async (req, res) => {
  try {
    if (!req.user || (req.user.role !== "admin" && req.user.role !== "teacher")) {
      return res.status(403).json({
        success: false,
        message: "Only admins and teachers can view sections",
      });
    }

    const { classId } = req.params;

    const sections = await Section.findAll({
      where: { classId },
      order: [["name", "ASC"]],
    });

    res.json({ success: true, data: sections });
  } catch (err) {
    console.error("List sections error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.createSection = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Only admins can create sections" });
    }

    const { classId } = req.params;
    const { name, capacity, classTeacherId, status } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Section name is required" });
    }

    const klass = await Class.findByPk(classId);
    if (!klass) {
      return res
        .status(404)
        .json({ success: false, message: "Class not found" });
    }

    if (classTeacherId) {
      const teacher = await Teacher.findByPk(classTeacherId);
      if (!teacher) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid classTeacherId" });
      }
    }

    const existing = await Section.findOne({ where: { classId, name } });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Section with this name already exists for this class",
      });
    }

    const section = await Section.create({
      classId,
      name,
      capacity,
      classTeacherId,
      status,
    });

    res.status(201).json({
      success: true,
      message: "Section created successfully",
      data: section,
    });
  } catch (err) {
    console.error("Create section error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.updateSection = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Only admins can update sections" });
    }

    const { sectionId } = req.params;
    const { name, capacity, classTeacherId, status } = req.body;

    const section = await Section.findByPk(sectionId);
    if (!section) {
      return res
        .status(404)
        .json({ success: false, message: "Section not found" });
    }

    if (classTeacherId) {
      const teacher = await Teacher.findByPk(classTeacherId);
      if (!teacher) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid classTeacherId" });
      }
    }

    if (name !== undefined) section.name = name;
    if (capacity !== undefined) section.capacity = capacity;
    if (classTeacherId !== undefined) section.classTeacherId = classTeacherId;
    if (status !== undefined) section.status = status;

    await section.save();

    res.json({ success: true, message: "Section updated", data: section });
  } catch (err) {
    console.error("Update section error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.deleteSection = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Only admins can delete sections" });
    }

    const { sectionId } = req.params;

    const section = await Section.findByPk(sectionId);
    if (!section) {
      return res
        .status(404)
        .json({ success: false, message: "Section not found" });
    }

    section.status = "INACTIVE";
    await section.save();

    res.json({ success: true, message: "Section deactivated", data: section });
  } catch (err) {
    console.error("Delete section error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.assignClassTeacher = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can assign class teachers",
      });
    }

    const { sectionId } = req.params;
    const { teacherId } = req.body;

    if (!teacherId) {
      return res.status(400).json({
        success: false,
        message: "teacherId is required",
      });
    }

    const section = await Section.findByPk(sectionId);
    if (!section) {
      return res
        .status(404)
        .json({ success: false, message: "Section not found" });
    }

    const teacher = await Teacher.findByPk(teacherId);
    if (!teacher) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid teacherId" });
    }

    section.classTeacherId = teacherId;
    await section.save();

    res.json({
      success: true,
      message: "Class teacher assigned",
      data: section,
    });
  } catch (err) {
    console.error("Assign class teacher error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

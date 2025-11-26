const { Op } = require("sequelize");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Student = require("../models/Student");

exports.createStudent = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Only admins can create students" });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ success: false, errors: errors.array() });
    }

    const {
      fullName,
      email,
      phone,
      password,
      admissionNo,
      classId,
      sectionId,
      dob,
      gender,
      address,
    } = req.body;

    if (!email && !phone) {
      return res.status(400).json({
        success: false,
        message: "Either email or phone is required",
      });
    }

    if (email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User with this email already exists",
        });
      }
    }

    const hashed = password ? await bcrypt.hash(password, 10) : null;

    const user = await User.create({
      fullName,
      email,
      phone,
      password: hashed,
      role: "student",
      isVerified: true,
      isAdminApproved: true,
      isActive: true,
    });

    const student = await Student.create({
      userId: user.userId,
      admissionNo,
      classId,
      sectionId,
      dob,
      gender,
      address,
    });

    res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: { user, student },
    });
  } catch (err) {
    console.error("Create student error:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

exports.assignClassSection = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can assign class and section",
      });
    }

    const { id } = req.params;
    const { classId, sectionId } = req.body;

    if (!classId || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "classId and sectionId are required",
      });
    }

    const student = await Student.findByPk(id);
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    student.classId = classId;
    student.sectionId = sectionId;
    await student.save();

    res.json({
      success: true,
      message: "Class and section assigned",
      data: student,
    });
  } catch (err) {
    console.error("Assign class/section error:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

exports.listStudents = async (req, res) => {
  try {
    if (!req.user || (req.user.role !== "admin" && req.user.role !== "teacher")) {
      return res.status(403).json({
        success: false,
        message: "Only admins and teachers can view students",
      });
    }

    const { classId, sectionId, search, page = 1, limit = 10 } = req.query;

    const whereStudent = {};
    if (classId) whereStudent.classId = classId;
    if (sectionId) whereStudent.sectionId = sectionId;

    const whereUser = {};
    if (search) {
      whereUser[Op.or] = [
        { fullName: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const offset = (pageNum - 1) * limitNum;

    const result = await Student.findAndCountAll({
      where: whereStudent,
      include: [
        {
          model: User,
          as: "user",
          where: whereUser,
          required: Object.keys(whereUser).length > 0,
          attributes: ["userId", "fullName", "email", "phone", "role"],
        },
      ],
      order: [["createdAt", "DESC"]],
      offset,
      limit: limitNum,
    });

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: result.count,
        totalPages: Math.ceil(result.count / limitNum) || 1,
      },
    });
  } catch (err) {
    console.error("List students error:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

exports.getStudentById = async (req, res) => {
  try {
    if (!req.user || (req.user.role !== "admin" && req.user.role !== "teacher")) {
      return res.status(403).json({
        success: false,
        message: "Only admins and teachers can view student details",
      });
    }

    const { id } = req.params;

    const student = await Student.findByPk(id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["userId", "fullName", "email", "phone", "role"],
        },
      ],
    });

    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    res.json({ success: true, data: student });
  } catch (err) {
    console.error("Get student error:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Only admins can update students" });
    }

    const { id } = req.params;
    const { admissionNo, classId, sectionId, dob, gender, address } = req.body;

    const student = await Student.findByPk(id);
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    if (admissionNo !== undefined) student.admissionNo = admissionNo;
    if (classId !== undefined) student.classId = classId;
    if (sectionId !== undefined) student.sectionId = sectionId;
    if (dob !== undefined) student.dob = dob;
    if (gender !== undefined) student.gender = gender;
    if (address !== undefined) student.address = address;

    await student.save();

    res.json({ success: true, message: "Student updated", data: student });
  } catch (err) {
    console.error("Update student error:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

exports.updateStudentStatus = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can change student status",
      });
    }

    const { id } = req.params;
    const { status } = req.body;

    const allowed = ["ACTIVE", "INACTIVE", "ALUMNI", "TC_ISSUED"];
    if (!allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const student = await Student.findByPk(id);
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    student.status = status;
    await student.save();

    res.json({ success: true, message: "Student status updated", data: student });
  } catch (err) {
    console.error("Update student status error:", err.message);
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

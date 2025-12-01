const { Op } = require("sequelize");
const User = require("../models/User");
const Teacher = require("../models/Teacher");

exports.createTeacher = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Only admins can create teachers" });
    }

    const { fullName, email, phone, password, employeeCode, designation, department } = req.body;

    if (!fullName) {
      return res
        .status(400)
        .json({ success: false, message: "fullName is required" });
    }

    if (!email && !phone) {
      return res.status(400).json({
        success: false,
        message: "Either email or phone is required",
      });
    }

    const existingUser = email ? await User.findOne({ where: { email } }) : null;
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Create user via same pattern as students but directly as verified teacher
    const bcrypt = require("bcryptjs");
    const hashed = password ? await bcrypt.hash(password, 10) : null;

    const user = await User.create({
      fullName,
      email,
      phone,
      password: hashed,
      role: "teacher",
      isVerified: true,
      isAdminApproved: true,
      isActive: true,
    });

    const teacher = await Teacher.create({
      userId: user.userId,
      employeeCode,
      designation,
      department,
    });

    res.status(201).json({
      success: true,
      message: "Teacher created successfully",
      data: { user, teacher },
    });
  } catch (err) {
    console.error("Create teacher error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.listTeachers = async (req, res) => {
  try {
    if (!req.user || (req.user.role !== "admin" && req.user.role !== "teacher")) {
      return res.status(403).json({
        success: false,
        message: "Only admins and teachers can view teachers",
      });
    }

    const { search, page = 1, limit = 10 } = req.query;

    const whereUser = { role: "teacher" };
    if (search) {
      whereUser[Op.or] = [
        { fullName: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const offset = (pageNum - 1) * limitNum;

    const result = await Teacher.findAndCountAll({
      include: [
        {
          model: User,
          as: "user",
          where: whereUser,
          required: true,
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
    console.error("List teachers error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.getTeacherById = async (req, res) => {
  try {
    if (!req.user || (req.user.role !== "admin" && req.user.role !== "teacher")) {
      return res.status(403).json({
        success: false,
        message: "Only admins and teachers can view teacher details",
      });
    }

    const { id } = req.params;

    const teacher = await Teacher.findByPk(id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["userId", "fullName", "email", "phone", "role"],
        },
      ],
    });

    if (!teacher) {
      return res
        .status(404)
        .json({ success: false, message: "Teacher not found" });
    }

    res.json({ success: true, data: teacher });
  } catch (err) {
    console.error("Get teacher error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.updateTeacher = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Only admins can update teachers" });
    }

    const { id } = req.params;
    const { employeeCode, designation, department } = req.body;

    const teacher = await Teacher.findByPk(id);
    if (!teacher) {
      return res
        .status(404)
        .json({ success: false, message: "Teacher not found" });
    }

    if (employeeCode !== undefined) teacher.employeeCode = employeeCode;
    if (designation !== undefined) teacher.designation = designation;
    if (department !== undefined) teacher.department = department;

    await teacher.save();

    res.json({ success: true, message: "Teacher updated", data: teacher });
  } catch (err) {
    console.error("Update teacher error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.deactivateTeacher = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can deactivate teachers",
      });
    }

    const { id } = req.params;

    const teacher = await Teacher.findByPk(id);
    if (!teacher) {
      return res
        .status(404)
        .json({ success: false, message: "Teacher not found" });
    }

    const user = await User.findByPk(teacher.userId);
    if (user) {
      user.isActive = false;
      await user.save();
    }

    res.json({
      success: true,
      message: "Teacher deactivated",
      data: { teacherId: teacher.teacherId, userId: teacher.userId },
    });
  } catch (err) {
    console.error("Deactivate teacher error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Parent = require("../models/Parent");
const ParentStudent = require("../models/ParentStudent");
const Student = require("../models/Student");

// Create a parent + user
exports.createParent = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Only admins can create parents" });
    }

    const { fullName, email, phone, password, address, phoneAlt } = req.body;

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

    const hashed = password ? await bcrypt.hash(password, 10) : null;

    const user = await User.create({
      fullName,
      email,
      phone,
      password: hashed,
      role: "parent",
      isVerified: true,
      isAdminApproved: true,
      isActive: true,
    });

    const parent = await Parent.create({
      userId: user.userId,
      address,
      phoneAlt,
    });

    res.status(201).json({
      success: true,
      message: "Parent created successfully",
      data: { user, parent },
    });
  } catch (err) {
    console.error("Create parent error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// List parents with pagination + search
exports.listParents = async (req, res) => {
  try {
    if (!req.user || (req.user.role !== "admin" && req.user.role !== "teacher")) {
      return res.status(403).json({
        success: false,
        message: "Only admins and teachers can view parents",
      });
    }

    const { search, page = 1, limit = 10 } = req.query;

    const whereUser = { role: "parent" };
    if (search) {
      whereUser[Op.or] = [
        { fullName: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { phone: { [Op.like]: `%${search}%` } },
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const offset = (pageNum - 1) * limitNum;

    const result = await Parent.findAndCountAll({
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
    console.error("List parents error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get parent by id with linked user
exports.getParentById = async (req, res) => {
  try {
    if (!req.user || (req.user.role !== "admin" && req.user.role !== "teacher")) {
      return res.status(403).json({
        success: false,
        message: "Only admins and teachers can view parent details",
      });
    }

    const { id } = req.params;

    const parent = await Parent.findByPk(id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["userId", "fullName", "email", "phone", "role"],
        },
      ],
    });

    if (!parent) {
      return res
        .status(404)
        .json({ success: false, message: "Parent not found" });
    }

    res.json({ success: true, data: parent });
  } catch (err) {
    console.error("Get parent error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Link a parent to a student
exports.linkChild = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can link parents and students",
      });
    }

    const { id } = req.params; // parentId
    const { studentId, relation } = req.body;

    const parent = await Parent.findByPk(id);
    if (!parent) {
      return res
        .status(404)
        .json({ success: false, message: "Parent not found" });
    }

    const student = await Student.findByPk(studentId);
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    const existing = await ParentStudent.findOne({
      where: { parentId: id, studentId },
    });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "This parent is already linked to this student",
      });
    }

    const link = await ParentStudent.create({
      parentId: id,
      studentId,
      relation,
    });

    res.status(201).json({
      success: true,
      message: "Parent linked to student",
      data: link,
    });
  } catch (err) {
    console.error("Link child error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// List children for a parent
exports.listChildrenForParent = async (req, res) => {
  try {
    if (!req.user || (req.user.role !== "admin" && req.user.role !== "parent" && req.user.role !== "teacher")) {
      return res.status(403).json({
        success: false,
        message: "Only admins, parents, and teachers can view children",
      });
    }

    const { id } = req.params; // parentId

    // If parent role, enforce own id later when we add associations between User and Parent

    const links = await ParentStudent.findAll({ where: { parentId: id } });

    const studentIds = links.map((l) => l.studentId);
    const students = studentIds.length
      ? await Student.findAll({ where: { studentId: studentIds } })
      : [];

    res.json({
      success: true,
      data: {
        links,
        students,
      },
    });
  } catch (err) {
    console.error("List children error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const { Op } = require("sequelize");
const FeeCategory = require("../models/FeeCategory");
const FeePlan = require("../models/FeePlan");
const FeePlanItem = require("../models/FeePlanItem");
const StudentFeeAssignment = require("../models/StudentFeeAssignment");
const FeeInvoice = require("../models/FeeInvoice");
const FeePayment = require("../models/FeePayment");
const Student = require("../models/Student");

// CATEGORIES
exports.createCategory = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Only admins can create fee categories" });
    }

    const { name, description, isRecurring } = req.body;
    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Category name is required" });
    }

    const existing = await FeeCategory.findOne({ where: { name } });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Fee category with this name already exists",
      });
    }

    const category = await FeeCategory.create({ name, description, isRecurring });
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    console.error("Create fee category error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.listCategories = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can view fee categories",
      });
    }

    const categories = await FeeCategory.findAll({ order: [["name", "ASC"]] });
    res.json({ success: true, data: categories });
  } catch (err) {
    console.error("List fee categories error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// FEE PLANS
exports.createPlan = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Only admins can create fee plans" });
    }

    const { name, classId, academicYear, items } = req.body;
    if (!name || !academicYear) {
      return res.status(400).json({
        success: false,
        message: "name and academicYear are required",
      });
    }

    const plan = await FeePlan.create({ name, classId, academicYear });

    if (Array.isArray(items) && items.length > 0) {
      const records = items.map((it) => ({
        planId: plan.planId,
        categoryId: it.categoryId,
        amount: it.amount,
      }));
      await FeePlanItem.bulkCreate(records);
    }

    res.status(201).json({ success: true, data: plan });
  } catch (err) {
    console.error("Create fee plan error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.listPlans = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can view fee plans",
      });
    }

    const { academicYear, classId } = req.query;

    const where = {};
    if (academicYear) where.academicYear = academicYear;
    if (classId) where.classId = classId;

    const plans = await FeePlan.findAll({ where, order: [["createdAt", "DESC"]] });
    res.json({ success: true, data: plans });
  } catch (err) {
    console.error("List fee plans error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ASSIGN PLANS TO STUDENTS
exports.assignPlanToStudent = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can assign fee plans",
      });
    }

    const { studentId, planId } = req.body;

    const student = await Student.findByPk(studentId);
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    const plan = await FeePlan.findByPk(planId);
    if (!plan) {
      return res
        .status(404)
        .json({ success: false, message: "Fee plan not found" });
    }

    const existing = await StudentFeeAssignment.findOne({ where: { studentId, planId } });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Plan already assigned to this student",
      });
    }

    const assignment = await StudentFeeAssignment.create({ studentId, planId });
    res.status(201).json({ success: true, data: assignment });
  } catch (err) {
    console.error("Assign fee plan error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// INVOICES
exports.createInvoice = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Only admins can create invoices" });
    }

    const { studentId, dueDate, totalAmount } = req.body;

    const student = await Student.findByPk(studentId);
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    const invoice = await FeeInvoice.create({ studentId, dueDate, totalAmount });
    res.status(201).json({ success: true, data: invoice });
  } catch (err) {
    console.error("Create invoice error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.listInvoicesForStudent = async (req, res) => {
  try {
    if (!req.user || (req.user.role !== "admin" && req.user.role !== "parent" && req.user.role !== "student")) {
      return res.status(403).json({
        success: false,
        message: "Only admins, parents, and students can view invoices",
      });
    }

    const { studentId } = req.params;

    const invoices = await FeeInvoice.findAll({
      where: { studentId },
      order: [["createdAt", "DESC"]],
    });

    res.json({ success: true, data: invoices });
  } catch (err) {
    console.error("List invoices error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// PAYMENTS
exports.recordPayment = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Only admins can record payments" });
    }

    const { invoiceId, amount, mode, transactionRef, gateway, gatewayStatus } =
      req.body;

    const invoice = await FeeInvoice.findByPk(invoiceId);
    if (!invoice) {
      return res
        .status(404)
        .json({ success: false, message: "Invoice not found" });
    }

    const payment = await FeePayment.create({
      invoiceId,
      amount,
      mode,
      transactionRef,
      gateway,
      gatewayStatus,
    });

    // Simple status update: if total payments >= invoice total, mark PAID
    const sum = await FeePayment.sum("amount", { where: { invoiceId } });
    if (sum >= parseFloat(invoice.totalAmount)) {
      invoice.status = "PAID";
    } else if (sum > 0) {
      invoice.status = "PARTIAL";
    }
    await invoice.save();

    res.status(201).json({ success: true, data: payment, invoice });
  } catch (err) {
    console.error("Record payment error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

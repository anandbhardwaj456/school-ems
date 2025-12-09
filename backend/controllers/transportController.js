const Bus = require("../models/Bus");
const Route = require("../models/Route");
const BusRouteAssignment = require("../models/BusRouteAssignment");
const StudentTransport = require("../models/StudentTransport");
const Student = require("../models/Student");

exports.createBus = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can create buses",
      });
    }

    const { busNumber, capacity, driverName, driverPhone } = req.body;

    if (!busNumber) {
      return res
        .status(400)
        .json({ success: false, message: "busNumber is required" });
    }

    const existing = await Bus.findOne({ busNumber });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Bus with this number already exists",
      });
    }

    const bus = await Bus.create({
      busNumber,
      capacity,
      driverName,
      driverPhone,
    });

    res.status(201).json({ success: true, data: bus });
  } catch (err) {
    console.error("Create bus error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.listBuses = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can view buses",
      });
    }

    const buses = await Bus.find().sort({ busNumber: 1 });
    res.json({ success: true, data: buses });
  } catch (err) {
    console.error("List buses error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.createRoute = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can create routes",
      });
    }

    const { name, startPoint, endPoint, stops } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Route name is required" });
    }

    const route = await Route.create({ name, startPoint, endPoint, stops });
    res.status(201).json({ success: true, data: route });
  } catch (err) {
    console.error("Create route error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.listRoutes = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can view routes",
      });
    }

    const routes = await Route.find().sort({ name: 1 });
    res.json({ success: true, data: routes });
  } catch (err) {
    console.error("List routes error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.assignBusToRoute = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can assign buses to routes",
      });
    }

    const { busId, routeId } = req.body;

    const bus = await Bus.findOne({ busId });
    if (!bus) {
      return res
        .status(404)
        .json({ success: false, message: "Bus not found" });
    }

    const route = await Route.findOne({ routeId });
    if (!route) {
      return res
        .status(404)
        .json({ success: false, message: "Route not found" });
    }

    const existing = await BusRouteAssignment.findOne({ busId, routeId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Bus already assigned to this route",
      });
    }

    const assign = await BusRouteAssignment.create({ busId, routeId });
    res.status(201).json({ success: true, data: assign });
  } catch (err) {
    console.error("Assign bus to route error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.assignStudentToRoute = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can assign students to routes",
      });
    }

    const { studentId, routeId, pickupStop, dropStop } = req.body;

    const student = await Student.findOne({ studentId });
    if (!student) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    const route = await Route.findByPk(routeId);
    if (!route) {
      return res
        .status(404)
        .json({ success: false, message: "Route not found" });
    }

    const existing = await StudentTransport.findOne({ studentId });
    if (existing) {
      existing.routeId = routeId;
      existing.pickupStop = pickupStop;
      existing.dropStop = dropStop;
      await existing.save();
      return res.json({ success: true, data: existing });
    }

    const st = await StudentTransport.create({
      studentId,
      routeId,
      pickupStop,
      dropStop,
    });

    res.status(201).json({ success: true, data: st });
  } catch (err) {
    console.error("Assign student to route error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.listStudentsForRoute = async (req, res) => {
  try {
    if (!req.user || (req.user.role !== "admin" && req.user.role !== "teacher")) {
      return res.status(403).json({
        success: false,
        message: "Only admins and teachers can view route students",
      });
    }

    const { routeId } = req.params;

    const assignments = await StudentTransport.find({ routeId });

    res.json({ success: true, data: assignments });
  } catch (err) {
    console.error("List students for route error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

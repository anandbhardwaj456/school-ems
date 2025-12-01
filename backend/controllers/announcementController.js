const { Op } = require("sequelize");
const Announcement = require("../models/Announcement");

exports.createAnnouncement = async (req, res) => {
  try {
    if (!req.user || (req.user.role !== "admin" && req.user.role !== "teacher")) {
      return res.status(403).json({
        success: false,
        message: "Only admins and teachers can create announcements",
      });
    }

    const {
      title,
      message,
      targetType,
      classId,
      sectionId,
      role,
      studentId,
      validFrom,
      validTo,
    } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: "title and message are required",
      });
    }

    const ann = await Announcement.create({
      title,
      message,
      targetType,
      classId,
      sectionId,
      role,
      studentId,
      createdBy: req.user.id,
      validFrom,
      validTo,
    });

    res.status(201).json({ success: true, data: ann });
  } catch (err) {
    console.error("Create announcement error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.listAnnouncements = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const now = new Date();

    const where = {
      [Op.or]: [
        { validFrom: null, validTo: null },
        {
          validFrom: { [Op.lte]: now },
          [Op.or]: [{ validTo: null }, { validTo: { [Op.gte]: now } }],
        },
      ],
    };

    // Simple generic filter; real targeting logic can be added later

    const anns = await Announcement.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });

    res.json({ success: true, data: anns });
  } catch (err) {
    console.error("List announcements error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.deleteAnnouncement = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can delete announcements",
      });
    }

    const { id } = req.params;

    const ann = await Announcement.findByPk(id);
    if (!ann) {
      return res
        .status(404)
        .json({ success: false, message: "Announcement not found" });
    }

    await ann.destroy();

    res.json({ success: true, message: "Announcement deleted" });
  } catch (err) {
    console.error("Delete announcement error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

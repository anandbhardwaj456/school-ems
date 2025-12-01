const express = require("express");
const auth = require("../middlewares/auth");
const {
  createSlot,
  listClassTimetable,
  listTeacherTimetable,
  deleteSlot,
} = require("../controllers/timetableController");

const router = express.Router();

router.post("/slots", auth, createSlot);
router.get("/class", auth, listClassTimetable);
router.get("/teachers/:teacherId", auth, listTeacherTimetable);
router.delete("/slots/:id", auth, deleteSlot);

module.exports = router;

const express = require("express");
const auth = require("../middlewares/auth");
const {
  createHomework,
  listHomeworkForClass,
  createSubmission,
  listSubmissionsForHomework,
} = require("../controllers/homeworkController");

const router = express.Router();

// Teacher/admin creates homework
router.post("/", auth, createHomework);

// List homework for a class/section (admin/teacher/student/parent)
router.get("/", auth, listHomeworkForClass);

// Student submits homework
router.post("/submissions", auth, createSubmission);

// Teacher/admin views submissions for a homework
router.get("/:homeworkId/submissions", auth, listSubmissionsForHomework);

module.exports = router;

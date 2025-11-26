const express = require("express");
const { body } = require("express-validator");
const auth = require("../middlewares/auth");
const {
  createExamType,
  listExamTypes,
  updateExamType,
  updateExamTypeStatus,
  createExam,
  listExams,
  updateExamStatus,
} = require("../controllers/examController");

const router = express.Router();

// Exam types (admin only)
router.post(
  "/types",
  auth,
  [body("name").notEmpty()],
  createExamType
);

router.get("/types", auth, listExamTypes);

router.put("/types/:id", auth, updateExamType);

router.patch("/types/:id/status", auth, updateExamTypeStatus);

// Exams (admin only)
router.post(
  "/",
  auth,
  [
    body("examTypeId").notEmpty(),
    body("classId").notEmpty(),
    body("sectionId").notEmpty(),
    body("subject").notEmpty(),
    body("date").notEmpty(),
    body("maxMarks").isNumeric(),
  ],
  createExam
);

router.get("/", auth, listExams);

router.patch("/:id/status", auth, updateExamStatus);

module.exports = router;

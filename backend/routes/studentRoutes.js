const express = require("express");
const { body } = require("express-validator");
const auth = require("../middlewares/auth");
const {
  createStudent,
  listStudents,
  getStudentById,
  updateStudent,
  updateStudentStatus,
  assignClassSection,
} = require("../controllers/studentController");

const router = express.Router();

router.post(
  "/",
  auth,
  [
    body("fullName").notEmpty(),
  ],
  createStudent
);

router.get("/", auth, listStudents);

router.get("/:id", auth, getStudentById);

router.put("/:id", auth, updateStudent);

router.patch("/:id/status", auth, updateStudentStatus);

router.patch("/:id/class-section", auth, assignClassSection);

module.exports = router;

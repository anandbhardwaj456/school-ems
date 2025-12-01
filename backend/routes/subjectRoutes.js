const express = require("express");
const auth = require("../middlewares/auth");
const {
  createSubject,
  listSubjects,
  updateSubject,
  deleteSubject,
  assignSubjectToClass,
  listSubjectsForClass,
  assignSubjectToTeacher,
  listSubjectsForTeacher,
} = require("../controllers/subjectController");

const router = express.Router();

// Subject CRUD
router.post("/", auth, createSubject);
router.get("/", auth, listSubjects);
router.put("/:id", auth, updateSubject);
router.delete("/:id", auth, deleteSubject);

// Class-subject assignments
router.post("/classes/:classId/assign", auth, assignSubjectToClass);
router.get("/classes/:classId", auth, listSubjectsForClass);

// Teacher-subject assignments
router.post("/teachers/:teacherId/assign", auth, assignSubjectToTeacher);
router.get("/teachers/:teacherId", auth, listSubjectsForTeacher);

module.exports = router;

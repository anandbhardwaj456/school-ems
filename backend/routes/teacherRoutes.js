const express = require("express");
const auth = require("../middlewares/auth");
const {
  createTeacher,
  listTeachers,
  getTeacherById,
  updateTeacher,
  deactivateTeacher,
} = require("../controllers/teacherController");

const router = express.Router();

router.post("/", auth, createTeacher);
router.get("/", auth, listTeachers);
router.get("/:id", auth, getTeacherById);
router.put("/:id", auth, updateTeacher);
router.patch("/:id/deactivate", auth, deactivateTeacher);

module.exports = router;

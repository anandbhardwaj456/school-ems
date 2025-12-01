const express = require("express");
const auth = require("../middlewares/auth");
const {
  createClass,
  listClasses,
  getClassById,
  updateClass,
  deleteClass,
  listSectionsForClass,
  createSection,
  updateSection,
  deleteSection,
  assignClassTeacher,
} = require("../controllers/classController");

const router = express.Router();

// Class routes
router.post("/", auth, createClass);
router.get("/", auth, listClasses);
router.get("/:id", auth, getClassById);
router.put("/:id", auth, updateClass);
router.delete("/:id", auth, deleteClass);

// Section routes (nested under classes)
router.get("/:classId/sections", auth, listSectionsForClass);
router.post("/:classId/sections", auth, createSection);

// Section routes by sectionId
router.put("/sections/:sectionId", auth, updateSection);
router.delete("/sections/:sectionId", auth, deleteSection);
router.put("/sections/:sectionId/assign-class-teacher", auth, assignClassTeacher);

module.exports = router;

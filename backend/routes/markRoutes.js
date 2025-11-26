const express = require("express");
const auth = require("../middlewares/auth");
const {
  listMyExams,
  enterMarks,
  getExamMarks,
} = require("../controllers/markController");

const router = express.Router();

router.get("/exams/my", auth, listMyExams);

router.post("/:examId", auth, enterMarks);

router.get("/exam/:examId", auth, getExamMarks);

module.exports = router;

const express = require("express");
const { body } = require("express-validator");
const auth = require("../middlewares/auth");
const {
  applyForAdmission,
  moveToAssessment,
  updateAssessment,
  finalDecision,
} = require("../controllers/admissionController");

const router = express.Router();

router.post(
  "/apply",
  [
    body("fullName").notEmpty(),
    body("classAppliedFor").notEmpty(),
  ],
  applyForAdmission
);

router.patch("/:id/move-to-assessment", auth, moveToAssessment);

router.patch("/:id/assessment", auth, updateAssessment);

router.patch("/:id/final-decision", auth, finalDecision);

module.exports = router;

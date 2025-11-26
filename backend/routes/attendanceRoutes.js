const express = require("express");
const { body } = require("express-validator");
const auth = require("../middlewares/auth");
const {
  createSession,
  addEntries,
  listSessions,
  getSessionEntries,
  closeSession,
} = require("../controllers/attendanceController");

const router = express.Router();

router.post(
  "/sessions",
  auth,
  [
    body("date").notEmpty(),
    body("classId").notEmpty(),
    body("sectionId").notEmpty(),
  ],
  createSession
);

router.post("/sessions/:sessionId/entries", auth, addEntries);

router.get("/sessions", auth, listSessions);

router.get("/sessions/:sessionId", auth, getSessionEntries);

router.patch("/sessions/:sessionId/close", auth, closeSession);

module.exports = router;

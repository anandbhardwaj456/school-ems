const express = require("express");
const auth = require("../middlewares/auth");
const {
  createAnnouncement,
  listAnnouncements,
  deleteAnnouncement,
} = require("../controllers/announcementController");

const router = express.Router();

router.post("/", auth, createAnnouncement);
router.get("/", auth, listAnnouncements);
router.delete("/:id", auth, deleteAnnouncement);

module.exports = router;

const express = require("express");
const auth = require("../middlewares/auth");
const {
  createParent,
  listParents,
  getParentById,
  linkChild,
  listChildrenForParent,
} = require("../controllers/parentController");

const router = express.Router();

router.post("/", auth, createParent);
router.get("/", auth, listParents);
router.get("/:id", auth, getParentById);
router.post("/:id/children", auth, linkChild);
router.get("/:id/children", auth, listChildrenForParent);

module.exports = router;

const express = require("express");
const auth = require("../middlewares/auth");
const {
  createBook,
  listBooks,
  issueBook,
  returnBook,
  listIssuedBooksForUser,
} = require("../controllers/libraryController");

const router = express.Router();

router.post("/books", auth, createBook);
router.get("/books", auth, listBooks);
router.post("/issues", auth, issueBook);
router.post("/returns", auth, returnBook);
router.get("/users/:userId/issues", auth, listIssuedBooksForUser);

module.exports = router;

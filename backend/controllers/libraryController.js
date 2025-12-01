const { Op } = require("sequelize");
const Book = require("../models/Book");
const BookIssue = require("../models/BookIssue");

exports.createBook = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Only admins can add books" });
    }

    const { title, author, isbn, category, totalCopies } = req.body;

    if (!title) {
      return res
        .status(400)
        .json({ success: false, message: "Book title is required" });
    }

    if (isbn) {
      const existing = await Book.findOne({ where: { isbn } });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: "Book with this ISBN already exists",
        });
      }
    }

    const total = totalCopies || 1;

    const book = await Book.create({
      title,
      author,
      isbn,
      category,
      totalCopies: total,
      availableCopies: total,
    });

    res.status(201).json({ success: true, data: book });
  } catch (err) {
    console.error("Create book error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.listBooks = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized" });
    }

    const { search, category } = req.query;

    const where = {};
    if (category) where.category = category;
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { author: { [Op.like]: `%${search}%` } },
        { isbn: { [Op.like]: `%${search}%` } },
      ];
    }

    const books = await Book.findAll({
      where,
      order: [["title", "ASC"]],
    });

    res.json({ success: true, data: books });
  } catch (err) {
    console.error("List books error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.issueBook = async (req, res) => {
  try {
    if (!req.user || (req.user.role !== "admin" && req.user.role !== "teacher")) {
      return res.status(403).json({
        success: false,
        message: "Only admins and teachers can issue books",
      });
    }

    const { bookId, userId, issuedOn, dueOn } = req.body;

    const book = await Book.findByPk(bookId);
    if (!book) {
      return res
        .status(404)
        .json({ success: false, message: "Book not found" });
    }

    if (book.availableCopies <= 0) {
      return res.status(400).json({
        success: false,
        message: "No copies available for this book",
      });
    }

    const issue = await BookIssue.create({
      bookId,
      userId,
      issuedOn: issuedOn || new Date(),
      dueOn,
    });

    book.availableCopies -= 1;
    await book.save();

    res.status(201).json({ success: true, data: issue });
  } catch (err) {
    console.error("Issue book error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.returnBook = async (req, res) => {
  try {
    if (!req.user || (req.user.role !== "admin" && req.user.role !== "teacher")) {
      return res.status(403).json({
        success: false,
        message: "Only admins and teachers can mark returns",
      });
    }

    const { issueId, returnedOn, fineAmount } = req.body;

    const issue = await BookIssue.findByPk(issueId);
    if (!issue) {
      return res
        .status(404)
        .json({ success: false, message: "Issue record not found" });
    }

    if (issue.returnedOn) {
      return res.status(400).json({
        success: false,
        message: "Book already returned",
      });
    }

    issue.returnedOn = returnedOn || new Date();
    if (fineAmount !== undefined) issue.fineAmount = fineAmount;
    await issue.save();

    const book = await Book.findByPk(issue.bookId);
    if (book) {
      book.availableCopies += 1;
      await book.save();
    }

    res.json({ success: true, data: issue });
  } catch (err) {
    console.error("Return book error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

exports.listIssuedBooksForUser = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized" });
    }

    const { userId } = req.params;

    const issues = await BookIssue.findAll({
      where: { userId },
      order: [["issuedOn", "DESC"]],
    });

    res.json({ success: true, data: issues });
  } catch (err) {
    console.error("List issued books error:", err.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

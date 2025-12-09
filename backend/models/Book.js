const { mongoose } = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const BookSchema = new mongoose.Schema(
  {
    bookId: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
    },
    isbn: {
      type: String,
      unique: true,
    },
    category: {
      type: String,
    },
    totalCopies: {
      type: Number,
      required: true,
      default: 1,
    },
    availableCopies: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Book", BookSchema);

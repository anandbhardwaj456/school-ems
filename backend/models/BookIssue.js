const { mongoose } = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const BookIssueSchema = new mongoose.Schema(
  {
    issueId: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    bookId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    issuedOn: {
      type: String,
      required: true,
    },
    dueOn: {
      type: String,
    },
    returnedOn: {
      type: String,
    },
    fineAmount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("BookIssue", BookIssueSchema);

const { mongoose } = require("../config/db");
const { v4: uuidv4 } = require("uuid");

const ParentSchema = new mongoose.Schema(
  {
    parentId: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    userId: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    phoneAlt: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Parent", ParentSchema);

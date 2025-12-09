// config/db.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const { MONGODB_URI } = process.env;

const connectDB = async () => {
  try {
    const uri = MONGODB_URI || "mongodb://127.0.0.1:27017/ems_school";

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB connected successfully!");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  }
};

module.exports = { mongoose, connectDB };

// config/db.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const { MONGODB_URI } = process.env;

const connectDB = async () => {
  try {
    const uri = MONGODB_URI || "mongodb://127.0.0.1:27017/ems_school";

    if (!uri || uri === "mongodb://127.0.0.1:27017/ems_school") {
      console.warn("⚠️  MONGODB_URI not set, using default local database");
    }

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB connected successfully!");
    return true;
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    console.error("⚠️  Server will continue running but database operations will fail");
    return false;
  }
};

module.exports = { mongoose, connectDB };

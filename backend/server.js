const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const session = require("express-session");
const sequelize = require("./config/db");
const passport = require("passport");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

// Load passport strategies BEFORE using passport
require("./config/passport");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "ems-session-secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());

// Routes
app.use("/api/auth", authRoutes);

// Default Route
app.get("/", (req, res) => {
  res.send("🚀 EMS Backend is running...");
});

// Database Connection + Schema Sync
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ SQL Database connected successfully!");

    // ⚠️ TEMPORARY: Recreate schema in dev (drops and recreates tables)
    await sequelize.sync({ force: true });
    console.log("🔄 Database schema recreated with sync({ force: true })");
  } catch (err) {
    console.error("❌ Database connection failed:", err);
  }
})();

// Start Server
const PORT = process.env.PORT || 5000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

app.listen(PORT, () => {
  console.log(`✅ Server running at ${BASE_URL}`);
});

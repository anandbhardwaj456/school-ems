const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const session = require("express-session");
const sequelize = require("./config/db");
const passport = require("passport");
const authRoutes = require("./routes/authRoutes");
const admissionRoutes = require("./routes/admissionRoutes");
const studentRoutes = require("./routes/studentRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const examRoutes = require("./routes/examRoutes");
const markRoutes = require("./routes/markRoutes");

const classRoutes = require("./routes/classRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const parentRoutes = require("./routes/parentRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const timetableRoutes = require("./routes/timetableRoutes");
const feeRoutes = require("./routes/feeRoutes");
const homeworkRoutes = require("./routes/homeworkRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const messageRoutes = require("./routes/messageRoutes");
const libraryRoutes = require("./routes/libraryRoutes");
const transportRoutes = require("./routes/transportRoutes");

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
app.use("/api/admissions", admissionRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/marks", markRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/parents", parentRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/timetable", timetableRoutes);
app.use("/api/fees", feeRoutes);
app.use("/api/homework", homeworkRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/library", libraryRoutes);
app.use("/api/transport", transportRoutes);

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

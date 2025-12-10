const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const session = require("express-session");
const { connectDB } = require("./config/db");
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
const setupRoutes = require("./routes/setupRoutes");

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

// Log all incoming requests (for debugging in production too)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
console.log("📋 Registering routes...");
app.use("/api/setup", setupRoutes); // Setup routes (create first admin)
console.log("✅ Setup routes registered at /api/setup");
app.use("/api/auth", authRoutes);
console.log("✅ Auth routes registered at /api/auth");
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

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "ok", 
    message: "Server is running",
    timestamp: new Date().toISOString()
  });
});

// Default Route
app.get("/", (req, res) => {
  res.json({ 
    message: "🚀 EMS Backend is running...",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      auth: "/api/auth",
      setup: "/api/setup"
    }
  });
});

// Error handling middleware (should be after routes)
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.path}`,
    availableRoutes: {
      health: "GET /health",
      root: "GET /",
      auth: {
        login: "POST /api/auth/login",
        register: "POST /api/auth/register",
        me: "GET /api/auth/me"
      }
    }
  });
});

app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined
  });
});

// Start Server - try DB connection but don't block server startup
const PORT = process.env.PORT || 5000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

// Start server immediately
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running at ${BASE_URL}`);
  console.log(`📡 Health check: ${BASE_URL}/health`);
  console.log(`🔐 Auth endpoint: ${BASE_URL}/api/auth/login`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  
  // Try to connect to DB in background (non-blocking)
  connectDB()
    .then(() => {
      console.log("✅ Database connected successfully");
    })
    .catch((err) => {
      console.error("⚠️  Database connection failed:", err.message);
      console.error("⚠️  Server is running but database operations may fail");
      console.error("⚠️  Please check your MONGODB_URI environment variable");
    });
});

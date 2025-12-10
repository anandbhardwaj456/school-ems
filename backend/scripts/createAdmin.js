const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../.env") });

const User = require("../models/User");

const createAdmin = async () => {
  try {
    // Connect to database
    const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ems_school";
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    // Check if admin already exists
    const adminEmail = process.env.ADMIN_EMAIL || "admin@smartschool.com";
    const existingAdmin = await User.findOne({ role: "admin", email: adminEmail });
    
    if (existingAdmin) {
      console.log("⚠️  Admin user already exists!");
      console.log(`Email: ${existingAdmin.email}`);
      await mongoose.disconnect();
      process.exit(0);
    }

    // Create admin user
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    const adminName = process.env.ADMIN_NAME || "System Administrator";

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const admin = await User.create({
      fullName: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
      isActive: true,
      isVerified: true,
      isAdminApproved: true,
    });

    console.log("✅ Admin user created successfully!");
    console.log("\n📋 Admin Credentials:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`Email:    ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("\n⚠️  IMPORTANT: Change the default password after first login!");
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

createAdmin();

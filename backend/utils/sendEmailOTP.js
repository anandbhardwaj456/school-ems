// utils/sendEmailOTP.js
// Simple placeholder for sending OTP emails. Replace with real provider.
module.exports = async function sendEmailOTP(email, otp) {
  try {
    console.log(`📧 sendEmailOTP: Sending OTP ${otp} to ${email}`);
    // Integrate a real email provider here (nodemailer, SendGrid, etc.)
    return Promise.resolve();
  } catch (err) {
    console.error("sendEmailOTP error:", err);
    throw err;
  }
};

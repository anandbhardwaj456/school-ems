// utils/sendSMSOTP.js
// Simple placeholder for sending OTP SMS. Replace with real SMS provider.
module.exports = async function sendSMSOTP(phone, otp) {
  try {
    console.log(`📱 sendSMSOTP: Sending OTP ${otp} to ${phone}`);
    // Integrate a real SMS provider here (Twilio, etc.)
    return Promise.resolve();
  } catch (err) {
    console.error("sendSMSOTP error:", err);
    throw err;
  }
};

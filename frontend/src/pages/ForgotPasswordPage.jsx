import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import Button from "../components/Button";
import FormInput from "../components/FormInput";
import { useToast } from "../components/ToastProvider";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState("");
  const { showToast } = useToast();

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setEmailSent(true);
      showToast("Password reset link sent to your email", "success");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to send reset link";
      
      if (errorMessage.includes("not found") || errorMessage.includes("not registered")) {
        setError("Email not registered");
      } else {
        setError(errorMessage);
      }
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-700 mb-2">SmartSkul EMS</h1>
          <h2 className="text-xl font-semibold text-slate-800">Forgot Password</h2>
          <p className="text-sm text-slate-600 mt-2">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-lg border border-slate-200 p-8">
          {!emailSent ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <FormInput
                label="Email Address"
                name="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                placeholder="Enter your registered email"
                error={error}
                required
                disabled={loading}
              />

              <Button
                type="submit"
                className="w-full"
                loading={loading}
                disabled={loading}
              >
                Send Reset Link
              </Button>

              <div className="text-center">
                <Link
                  to="/login"
                  className="text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                  Back to Login
                </Link>
              </div>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800">Check Your Email</h3>
              <p className="text-sm text-slate-600">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <p className="text-xs text-slate-500">
                Please check your inbox and click on the link to reset your password.
                If you don't see the email, check your spam folder.
              </p>
              <div className="pt-4">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setEmailSent(false);
                    setEmail("");
                  }}
                  className="w-full"
                >
                  Send Another Email
                </Button>
              </div>
              <Link
                to="/login"
                className="block text-sm font-medium text-primary-600 hover:text-primary-700 mt-4"
              >
                Back to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


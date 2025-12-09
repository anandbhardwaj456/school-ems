import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../api";

export default function OtpVerificationPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const [identifier, setIdentifier] = useState("");

  useEffect(() => {
    const id = searchParams.get("userId") || "";
    const email = searchParams.get("email") || "";
    setUserId(id);
    setIdentifier(email);

    if (!id) {
      setError("Missing user information. Please register again.");
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!userId) {
      setError("Missing user information. Please register again.");
      return;
    }

    if (!otp.trim()) {
      setError("Please enter the OTP.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/verify-otp", { userId, otp });
      setSuccess(res.data?.message || "OTP verified successfully.");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to verify OTP. Please check the code and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold text-slate-800 mb-1">
          SmartSkul EMS
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          Enter the OTP sent{identifier ? ` to ${identifier}` : ""} to verify
          your account
        </p>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-md px-3 py-2">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              OTP Code
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 tracking-[0.3em] text-center"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
              placeholder="Enter 6-digit OTP"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !userId}
            className="w-full inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <p className="mt-4 text-xs text-slate-500 text-center">
          Already verified?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-primary-600 hover:underline"
          >
            Go to login
          </button>
        </p>
      </div>
    </div>
  );
}

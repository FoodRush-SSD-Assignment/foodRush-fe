import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo2 from "../assets/logo2.png";
import authApi from "../api/authApi.js";
// Assuming you have some kind of toast functions
import { showSuccess, showError } from "../utils/alertService";

const VerifyEmailForm = () => {
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const navigate = useNavigate();
  const [resendCount, setResendCount] = useState(0);
  const [cooldown, setCooldown] = useState(0);
  const [errors, setErrors] = useState({ code: "" });

  useEffect(() => {
    const storedEmail = localStorage.getItem("pendingEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      showError("Email not found. Please register again.");
      navigate("/register");
    }
  }, [navigate]);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { code: "" };

    if (!code.trim() || code.length !== 6) {
      newErrors.code = "Please enter a valid 6-digit code";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await authApi.post(`/auth/verify-email`, { email, code });

      showSuccess("Email verified successfully!");

      localStorage.removeItem("pendingEmail");

      const role = res.data?.role;

      if (role === "customer") {
        navigate("/login");
      } else if (
        ["admin", "restaurantOwner", "deliveryPerson"].includes(role)
      ) {
        navigate("/merchant-login");
      } else {
        navigate("/login");
      }
    } catch (err) {
      showError(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (cooldown > 0 || resendLoading) return;

    if (resendCount >= 2) {
      setCooldown(60);
      setResendCount(0);
      return;
    }

    setResendLoading(true);
    try {
      await authApi.post(`/auth/resend-code`, { email });
      showSuccess("A new code has been sent to your email.");
      setResendCount(resendCount + 1);
    } catch (err) {
      showError(err.response?.data?.message || "Failed to resend code");
    } finally {
      setResendLoading(false);
    }
  };

  const handleChange = (e) => {
    setCode(e.target.value);
    if (errors.code) {
      setErrors({ ...errors, code: "" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md p-8 bg-white/80 backdrop-blur-md rounded-lg shadow-lg">
        <div className="flex justify-center mb-4">
          <div className="w-28 h-12 flex items-center justify-center">
            <img
              src={logo2}
              alt="Logo"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center mb-4">
          Verify Your Email
        </h2>
        <p className="text-gray-600 text-center mb-6">
          A 6-digit code has been sent to your email:
          <span className="font-semibold text-primary block">{email}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label
              htmlFor="code"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Verification Code
            </label>
            <input
              id="code"
              name="code"
              type="text"
              maxLength="6"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white ${
                errors.code ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter 6-digit code"
              value={code}
              onChange={handleChange}
            />
            {errors.code && (
              <p className="mt-1 text-sm text-red-600">{errors.code}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-md text-white font-semibold shadow-md bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Verifying..." : "Verify"}
          </button>

          <div className="text-sm text-center text-gray-500">
            Didn't receive the code?{" "}
            <button
              type="button"
              className={`text-primary font-semibold ${
                cooldown > 0 || resendLoading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:underline"
              }`}
              onClick={handleResendCode}
              disabled={cooldown > 0 || resendLoading}
            >
              {cooldown > 0
                ? `Try again in ${cooldown}s`
                : resendLoading
                ? "Sending..."
                : "Resend Code"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmailForm;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo2 from "../../../assets/logo2.png";
import authApi from "../../../api/authAPI";
import { showSuccess, showError } from "../../../utils/alertService";

const MerchantLoginForm = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { email: "", password: "" };

    // Check email
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    }

    // Check password
    if (!form.password) {
      newErrors.password = "Password is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const res = await authApi.post(`/auth/login`, form);
      const { token, user } = res.data;

      if (user.role === "customer") {
        showError(
          "Access Denied",
          "You are already registered as a customer. Please login through the customer portal."
        );
        return; // Stop further execution
      }

      showSuccess("Logged in!", "Welcome to FoodRush");

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("pendingRole", role);

      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 1000);
    } catch (err) {
      showError(
        "Login failed",
        err.response?.data?.message || "An error occurred"
      );
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white/80 backdrop-blur-md rounded-lg shadow-lg">
      <div className="flex justify-center mb-2">
        <div className="w-28 h-12 flex items-center justify-center">
          <img
            src={logo2}
            alt="Logo"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-center">Merchant Login</h2>
      <p className="text-gray-500 text-center mb-8">
        Please enter your details to sign in
      </p>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.email
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-red-500"
            } bg-white`}
            placeholder="Enter your email"
            onChange={handleChange}
            value={form.email}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type="password"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.password
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-red-500"
              } bg-white`}
              placeholder="••••••••"
              onChange={handleChange}
              value={form.password}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
              onClick={() => {
                const passwordInput = document.getElementById("password");
                passwordInput.type =
                  passwordInput.type === "password" ? "text" : "password";
              }}
            >
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path
                  fillRule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center text-sm">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="mr-2 text-red-600"
            />
            Remember me
          </label>
          <a href="#" className="text-sm text-purple-600 hover:underline">
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 rounded-md text-white font-semibold shadow-md"
          style={{ backgroundColor: "#C83C3C" }}
        >
          Login
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        <a
          href="/merchant-register"
          className="text-purple-600 hover:underline font-medium"
        >
          Create an account
        </a>
      </p>
    </div>
  );
};

export default MerchantLoginForm;

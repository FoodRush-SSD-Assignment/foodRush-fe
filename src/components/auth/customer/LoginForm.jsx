import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo2 from "../../../assets/logo2.png";
import { AuthContext } from "../../../context/AuthContext";
import GoogleLogo from "../../../assets/GoogleLogo.webp";
import FacebookLogo from "../../../assets/FacebookLogo.webp";
import AppleLogo from "../../../assets/AppleLogo.svg";
import authApi from "../../../api/authApi.js";

import { showSuccess, showError } from "../../../utils/alertService";
const LoginForm = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validate = () => {
    let tempErrors = { email: "", password: "" };
    let isValid = true;

    if (!form.email) {
      tempErrors.email = "Email is required";
      isValid = false;
    }

    if (!form.password) {
      tempErrors.password = "Password is required";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check validation before proceeding
    if (!validate()) {
      return;
    }

    try {
      // Call your actual backend API
      const res = await authApi.post(`/auth/login`, form);

      const { token, user } = res.data;

      // Check if the user role is 'customer'
      if (user.role !== "customer") {
        showError(
          "Login failed",
          "This email is not registered as a customer."
        );
        return; // Stop here, don't continue to login
      }

      // Store token and user data
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      showSuccess("Logged in!", "Welcome to FoodRush");

      // Redirect to landing page
      setTimeout(() => {
        navigate("/landing-page", { replace: true });
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

      <h2 className="text-2xl font-bold text-center mb-0">Welcome back</h2>
      <p className="text-gray-500 text-center mb-8">
        Please enter your details to sign in
      </p>

      {/* Social login options */}
      {/* <div className="flex justify-center gap-6 mb-8">
        {[GoogleLogo, FacebookLogo, AppleLogo].map((logo, i) => (
          <button
            key={i}
            className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 bg-white"
          >
            <img src={logo} alt="logo" className="w-6 h-6 object-contain" />
          </button>
        ))}
      </div> */}

      {/* <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">or</span>
        </div>
      </div> */}

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
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 bg-white ${
              errors.email
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-red-500"
            }`}
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
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 bg-white ${
                errors.password
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-red-500"
              }`}
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
        Don't have an account?{" "}
        <a
          href="/register"
          className="text-purple-600 hover:underline font-medium"
        >
          Create one
        </a>
      </p>
      <p className="mt-2 text-center text-xs text-purple-500 ">
        <a
          href="/merchant-login"
          className="text-purple-900 hover:underline font-medium"
        >
          Merchant Login
        </a>
      </p>
    </div>
  );
};

export default LoginForm;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo2 from "../assets/logo2.png";

const VerifyEmailForm = () => {
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem("pendingEmail");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      alert("Email not found. Please register again.");
      navigate("/register");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (code.length !== 6) {
      alert("Please enter a valid 6-digit code.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/auth/verify-email", {
        email,
        code,
      });

      alert("Email verified successfully! You can now log in.");
      localStorage.removeItem("pendingEmail");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Verification failed");
    }
  };

  return (
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

      <h2 className="text-2xl font-bold text-center mb-4">Verify Your Email</h2>
      <p className="text-gray-600 text-center mb-6">
        A 6-digit code has been sent to your email:
        <span className="font-semibold text-purple-600 block">{email}</span>
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
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
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
            placeholder="Enter 6-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 rounded-md text-white font-semibold shadow-md bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          Verify
        </button>
      </form>
    </div>
  );
};

export default VerifyEmailForm;

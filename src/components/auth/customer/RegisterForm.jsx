import React, { useState } from "react";
import logo2 from "../../../assets/logo2.png";
import GoogleLogo from "../../../assets/GoogleLogo.webp";
import FacebookLogo from "../../../assets/FacebookLogo.webp";
import AppleLogo from "../../../assets/AppleLogo.svg";
import { useNavigate } from "react-router-dom";
import authApi from "../../../api/authAPI";
import { showSuccess, showError } from "../../../utils/alertService";

const RegistrationForm = () => {
  // Form data state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNo: "",
    dob: "",
    nic: "",
    address: {
      street: "",
      city: "",
      postalCode: "",
      province: "",
    },
    password: "",
    confirmPassword: "",
  });

  // Errors state
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNo: "",
    dob: "",
    nic: "",
    address: {
      street: "",
      city: "",
      postalCode: "",
      province: "",
    },
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();
  // Current step state
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Special validation for DOB while typing
    if (name === "dob") {
      const dob = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      const monthDifference = today.getMonth() - dob.getMonth();
      const dayDifference = today.getDate() - dob.getDate();
      const actualAge =
        monthDifference > 0 || (monthDifference === 0 && dayDifference >= 0)
          ? age
          : age - 1;

      if (actualAge < 18) {
        setErrors((prev) => ({
          ...prev,
          dob: "You must be at least 18 years old",
        }));
      } else {
        setErrors((prev) => ({ ...prev, dob: "" }));
      }
    } else {
      // Clear the error normally for other fields
      if (errors[name]) {
        setErrors({ ...errors, [name]: "" });
      }
    }
  };

  const validate = () => {
    let tempErrors = {};

    // Example: Checking for empty fields
    if (!formData.dob) {
      tempErrors.dob = "Date of Birth is required";
    } else {
      const dob = new Date(formData.dob);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      const monthDifference = today.getMonth() - dob.getMonth();
      const dayDifference = today.getDate() - dob.getDate();

      // Adjust if birthday hasn't occurred yet this year
      const actualAge =
        monthDifference > 0 || (monthDifference === 0 && dayDifference >= 0)
          ? age
          : age - 1;

      if (actualAge < 16) {
        tempErrors.dob = "You must be at least 16 years old";
      }
    }

    setErrors(tempErrors);

    // Return true if no errors
    return Object.keys(tempErrors).length === 0;
  };

  const validateStep1 = () => {
    let tempErrors = { ...errors };
    let isValid = true;

    if (!formData.firstName) {
      tempErrors.firstName = "First name is required";
      isValid = false;
    }

    if (!formData.lastName) {
      tempErrors.lastName = "Last name is required";
      isValid = false;
    }

    if (!formData.email) {
      tempErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Email is invalid";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const validateStep2 = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (!formData.mobileNo.trim()) {
      newErrors.mobileNo = "Mobile number is required";
      isValid = false;
    }

    if (!formData.dob) {
      newErrors.dob = "Date of birth is required";
      isValid = false;
    } else {
      const dob = new Date(formData.dob);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      const monthDifference = today.getMonth() - dob.getMonth();
      const dayDifference = today.getDate() - dob.getDate();
      const actualAge =
        monthDifference > 0 || (monthDifference === 0 && dayDifference >= 0)
          ? age
          : age - 1;

      if (actualAge < 18) {
        newErrors.dob = "You must be at least 18 years old";
        isValid = false;
      }
    }

    if (!formData.nic.trim()) {
      newErrors.nic = "NIC number is required";
      isValid = false;
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const validateStep3 = () => {
    let tempErrors = { ...errors };
    let isValid = true;

    if (!formData.password) {
      tempErrors.password = "Password is required";
      isValid = false;
    }

    if (!formData.confirmPassword) {
      tempErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      tempErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!validateStep1()) {
        return;
      }
    } else if (currentStep === 2) {
      if (!validateStep2()) {
        return;
      }
    }
    setCurrentStep(currentStep + 1);
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }
    if (!validateStep3()) {
      return;
    }

    try {
      const userData = {
        firstname: formData.firstName,
        lastname: formData.lastName,
        email: formData.email,
        mobileno: formData.mobileNo,
        dateofbirth: formData.dob,
        nic: formData.nic,
        address: formData.address,
        password: formData.password,
      };

      const response = await authApi.post(`/auth/customer-register`, userData);
      showSuccess("Account Created!", "Verify your email and login");

      localStorage.setItem("pendingEmail", formData.email);

      navigate("/verify-email");
    } catch (err) {
      showError(
        "Registration failed",
        err.response?.data?.message || "An error occurred"
      );
    }
  };

  const renderStepIndicator = () => {
    return (
      <div className="flex justify-center mb-6">
        <div className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep >= 1 ? "bg-red-600 text-white" : "bg-gray-200"
            }`}
          >
            1
          </div>
          <div
            className={`w-12 h-1 ${
              currentStep >= 2 ? "bg-red-600" : "bg-gray-200"
            }`}
          ></div>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep >= 2 ? "bg-red-600 text-white" : "bg-gray-200"
            }`}
          >
            2
          </div>
          <div
            className={`w-12 h-1 ${
              currentStep >= 3 ? "bg-red-600" : "bg-gray-200"
            }`}
          ></div>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep >= 3 ? "bg-red-600 text-white" : "bg-gray-200"
            }`}
          >
            3
          </div>
        </div>
      </div>
    );
  };

  const renderStep1 = () => {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-center">
          Personal Information
        </h3>
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            First Name
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 bg-white ${
              errors.firstName
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-red-500"
            }`}
            placeholder="Enter your first name"
            value={formData.firstName}
            onChange={handleChange}
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Last Name
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 bg-white ${
              errors.lastName
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-red-500"
            }`}
            placeholder="Enter your last name"
            value={formData.lastName}
            onChange={handleChange}
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email Address
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
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>
        <div className="pt-4">
          <button
            type="button"
            onClick={handleNext}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white font-semibold"
            style={{ backgroundColor: "#C83C3C" }}
          >
            Continue
          </button>
        </div>
      </div>
    );
  };

  const renderStep2 = () => {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-center">Contact Information</h3>
        <div>
          <label
            htmlFor="mobileNo"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Mobile Number
          </label>
          <input
            id="mobileNo"
            name="mobileNo"
            type="tel"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 bg-white ${
              errors.mobileNo
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-red-500"
            }`}
            placeholder="Enter your mobile number"
            value={formData.mobileNo}
            onChange={handleChange}
          />
          {errors.mobileNo && (
            <p className="mt-1 text-sm text-red-600">{errors.mobileNo}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="dob"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Date of Birth
          </label>
          <input
            id="dob"
            name="dob"
            type="date"
            max={new Date().toISOString().split("T")[0]}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 bg-white ${
              errors.dob
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-red-500"
            }`}
            value={formData.dob}
            onChange={handleChange}
          />
          {errors.dob && (
            <p className="mt-1 text-sm text-red-600">{errors.dob}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="nic"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            NIC Number
          </label>
          <input
            id="nic"
            name="nic"
            type="text"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 bg-white ${
              errors.nic
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-red-500"
            }`}
            placeholder="Enter your NIC number"
            value={formData.nic}
            onChange={handleChange}
          />
          {errors.nic && (
            <p className="mt-1 text-sm text-red-600">{errors.nic}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Address
          </label>
          <textarea
            id="address"
            name="address"
            rows="3"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 bg-white ${
              errors.address
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-red-500"
            }`}
            placeholder="Enter your address"
            value={formData.address}
            onChange={handleChange}
          ></textarea>
          {errors.address && (
            <p className="mt-1 text-sm text-red-600">{errors.address}</p>
          )}
        </div>
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={handlePrevious}
            className="w-1/2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="w-1/2 py-2 px-4 border border-transparent rounded-md shadow-sm text-white font-semibold"
            style={{ backgroundColor: "#C83C3C" }}
          >
            Continue
          </button>
        </div>
      </div>
    );
  };

  const renderStep3 = () => {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-center">Create Password</h3>
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
              type={showPassword ? "text" : "password"}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 bg-white ${
                errors.password
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-red-500"
              }`}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
              onClick={() => setShowPassword(!showPassword)}
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
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 bg-white ${
                errors.confirmPassword
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-red-500"
              }`}
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">
              {errors.confirmPassword}
            </p>
          )}
        </div>
        <div className="pt-4 flex gap-4">
          <button
            type="button"
            onClick={handlePrevious}
            className="w-1/2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Back
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-1/2 py-2 px-4 border border-transparent rounded-md shadow-sm text-white font-semibold"
            style={{ backgroundColor: "#C83C3C" }}
          >
            Register
          </button>
        </div>
      </div>
    );
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

      <h2 className="text-2xl font-bold text-center mb-2">Create Account</h2>
      <p className="text-gray-500 text-center mb-6">
        Join us today! Complete the registration steps below
      </p>

      {renderStepIndicator()}

      {/* Social registration options */}
      {/* <div className="flex justify-center gap-6 mb-8">
        <button className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 bg-white">
          <img
            src={GoogleLogo}
            alt="GoogleLogo"
            className="w-6 h-6 object-contain"
          />
        </button>
        <button className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 bg-white">
          <img
            src={FacebookLogo}
            alt="FacebookLogo"
            className="w-6 h-6 object-contain"
          />
        </button>
        <button className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 bg-white">
          <img
            src={AppleLogo}
            alt="AppleLogo"
            className="w-6 h-6 object-contain"
          />
        </button>
      </div> */}
      {/* 
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">or</span>
        </div>
      </div> */}

      <form className="space-y-4" noValidate>
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account?
        <a
          href="/login"
          className="font-medium text-red-600 hover:text-red-500 ml-1"
        >
          Sign in
        </a>
      </p>
    </div>
  );
};

export default RegistrationForm;

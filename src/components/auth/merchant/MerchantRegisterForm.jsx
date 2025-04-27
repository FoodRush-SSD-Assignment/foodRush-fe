import React, { useState } from "react";
import logo2 from "../../../assets/logo2.png";
import { FaStore, FaMotorcycle } from "react-icons/fa"; // Import icons
import { useNavigate } from "react-router-dom";
import authApi from "../../../api/authAPI";
import { showSuccess, showError } from "../../../utils/alertService";

const MerchantRegistrationForm = () => {
  // Form data state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNo: "",
    dob: "",
    nic: "",
    address: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  // Errors state
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNo: "",
    dob: "",
    nic: "",
    address: "",
    password: "",
    confirmPassword: "",
    role: "",
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
      const actualAge =
        monthDifference > 0 || (monthDifference === 0 && dayDifference >= 0)
          ? age
          : age - 1;

      if (actualAge < 18) {
        tempErrors.dob = "You must be at least 18 years old";
      }
    }

    setErrors(tempErrors);

    // Return true if no errors
    return Object.keys(tempErrors).length === 0;
  };

  const validateStep1 = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (!formData.role) {
      newErrors.role = "Please select a role";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const validateStep2 = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
      isValid = false;
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const validateStep3 = () => {
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

  const validateStep4 = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!validateStep1()) return;
    } else if (currentStep === 2) {
      if (!validateStep2()) return;
    } else if (currentStep === 3) {
      if (!validateStep3()) return;
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
    if (!validateStep4()) return;

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
        role: formData.role,
      };

      const response = await authApi.post(`/auth/merchant-register`, userData);
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
              currentStep >= 1 ? "bg-primary text-white" : "bg-gray-200"
            }`}
          >
            1
          </div>
          <div
            className={`w-12 h-1 ${
              currentStep >= 2 ? "bg-primary" : "bg-gray-200"
            }`}
          ></div>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep >= 2 ? "bg-primary text-white" : "bg-gray-200"
            }`}
          >
            2
          </div>
          <div
            className={`w-12 h-1 ${
              currentStep >= 3 ? "bg-primary" : "bg-gray-200"
            }`}
          ></div>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep >= 3 ? "bg-primary text-white" : "bg-gray-200"
            }`}
          >
            3
          </div>
          <div
            className={`w-12 h-1 ${
              currentStep >= 4 ? "bg-primary" : "bg-gray-200"
            }`}
          ></div>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep >= 4 ? "bg-primary text-white" : "bg-gray-200"
            }`}
          >
            4
          </div>
        </div>
      </div>
    );
  };

  const renderStep1 = () => {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-center">Select Your Role</h3>
        <div className="flex flex-col gap-4">
          <div
            className={`flex items-center p-4 border rounded-lg cursor-pointer ${
              formData.role === "restaurantOwner"
                ? "border-primary bg-primary/10"
                : "border-gray-200"
            }`}
            onClick={() =>
              setFormData({ ...formData, role: "restaurantOwner" })
            }
          >
            <FaStore className="w-8 h-8 mr-4 text-primary" />
            <div>
              <h4 className="font-medium">Restaurant Owner</h4>
              <p className="text-sm text-gray-500">
                Register as a restaurant owner to manage your menu and orders
              </p>
            </div>
          </div>
          <div
            className={`flex items-center p-4 border rounded-lg cursor-pointer ${
              formData.role === "deliveryPerson"
                ? "border-primary bg-primary/10"
                : "border-gray-200"
            }`}
            onClick={() => setFormData({ ...formData, role: "deliveryPerson" })}
          >
            <FaMotorcycle className="w-8 h-8 mr-4 text-primary" />
            <div>
              <h4 className="font-medium">Delivery Person</h4>
              <p className="text-sm text-gray-500">
                Register as a delivery person to accept delivery assignments
              </p>
            </div>
          </div>
        </div>
        {errors.role && (
          <p className="mt-1 text-sm text-red-600 text-center">{errors.role}</p>
        )}
        <div className="pt-4">
          <button
            type="button"
            onClick={handleNext}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            disabled={!formData.role}
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
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white ${
              errors.firstName ? "border-red-500" : "border-gray-300"
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
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white ${
              errors.lastName ? "border-red-500" : "border-gray-300"
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
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white ${
              errors.email ? "border-red-500" : "border-gray-300"
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
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
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
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white ${
              errors.mobileNo ? "border-red-500" : "border-gray-300"
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
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white ${
              errors.dob ? "border-red-500" : "border-gray-300"
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
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white ${
              errors.nic ? "border-red-500" : "border-gray-300"
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
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white ${
              errors.address ? "border-red-500" : "border-gray-300"
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
            className="w-1/2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Back
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="w-1/2 py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Continue
          </button>
        </div>
      </div>
    );
  };

  const renderStep4 = () => {
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
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white ${
                errors.password ? "border-red-500" : "border-gray-300"
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
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
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
            className="w-1/2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Back
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-1/2 py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
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

      <h2 className="text-2xl font-bold text-center">Merchant Registration</h2>
      <p className="text-gray-500 text-center mb-6">
        Join us today! Complete the registration steps below
      </p>

      {renderStepIndicator()}

      <form className="space-y-4" noValidate>
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account?
        <a
          href="/merchant-login"
          className="font-medium text-primary hover:text-primary/90 ml-1"
        >
          Sign in
        </a>
      </p>
    </div>
  );
};

export default MerchantRegistrationForm;

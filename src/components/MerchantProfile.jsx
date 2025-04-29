import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authApi from "../api/authApi.js";
import userAvatar from "../assets/userAvatar.png";
import { showSuccess, showError } from "../utils/alertService.js";

const MerchantProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const userString = localStorage.getItem("user");
        const user = userString ? JSON.parse(userString) : null;
        const userID = user?.id;

        if (!userID) {
          console.error("User ID not found.");
          setError("User ID not found. Please login again.");
          setLoading(false);
          return;
        }

        const res = await authApi.get(`/auth/getuser/${userID}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserData(res.data);
        setEditedUser(res.data);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch user data", error);
        setError("Failed to load user details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing, reset to original values
      setEditedUser(userData);
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const handleSaveChanges = async () => {
    try {
      setIsSaving(true);
      const token = localStorage.getItem("token");
      const userID = userData.id;

      await authApi.put(`/auth/update/${userID}`, editedUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUserData(editedUser);
      showSuccess("Profile updated successfully");
      setIsEditing(false);
      setError(null);

      // Update localStorage with new user data if needed
      const userString = localStorage.getItem("user");
      if (userString) {
        const user = JSON.parse(userString);
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...user,
            firstname: editedUser.firstname,
            lastname: editedUser.lastname,
            email: editedUser.email,
          })
        );
      }
    } catch (error) {
      console.error("Failed to update user:", error);
      setError("Failed to update profile. Please try again.");
      showError("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeactivate = async () => {
    try {
      const token = localStorage.getItem("token");
      const userID = userData.id;

      // Verify password first (if your API requires it)
      // This is optional based on your authentication flow
      const verifyResponse = await authApi.post(
        "/auth/verify-password",
        { password },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (verifyResponse.data.valid) {
        // Call deactivate endpoint instead of delete
        await authApi.put(
          `/auth/deactivate/`,
          {}, // Empty body
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        showSuccess("Account deactivated successfully!");

        // Clear local storage and redirect to login
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      } else {
        showError("Incorrect password. Please try again.");
      }
    } catch (err) {
      console.error(err);
      showError(err.response?.data?.message || "Failed to deactivate account.");
    } finally {
      setShowDeactivateModal(false); // Close the modal
    }
  };

  // Format the date of birth
  const formatDate = (dateString) => {
    if (!dateString) return "Not provided";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  // Get user initials for the avatar
  const getUserInitials = () => {
    if (!userData) return "";
    const firstInitial = userData.firstname
      ? userData.firstname[0].toUpperCase()
      : "";
    const lastInitial = userData.lastname
      ? userData.lastname[0].toUpperCase()
      : "";
    return `${firstInitial}${lastInitial}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 px-8 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h3 className="text-red-500 text-lg font-medium mb-2">Error</h3>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-red-900 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 px-8 py-12">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <h3 className="text-gray-700 text-lg font-medium mb-2">
            Profile Not Found
          </h3>
          <p className="text-gray-600">
            Your profile information could not be loaded. Please try logging in
            again.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-red-900 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-6">
      {/* Header with back button */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-secondary">My Profile</h2>

        <button
          onClick={() => navigate(-1)}
          className="text-primary hover:text-secondary transition-all flex items-center"
        >
          <svg
            className="w-5 h-5 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back
        </button>
      </div>
      <hr className="mb-6 rounded-md" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Summary Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-primary text-white p-6 flex flex-col items-center">
            {userData.profileImage ? (
              <img
                src={userData.profileImage}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-white mb-4"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-white text-primary flex items-center justify-center text-3xl font-bold mb-4">
                {getUserInitials()}
              </div>
            )}
            <h3 className="text-xl font-semibold">
              {userData.firstname} {userData.lastname}
            </h3>
            <span className="mt-2 px-3 py-1 rounded-full text-sm font-medium bg-white text-primary">
              Merchant Account
            </span>
          </div>

          <div className="p-6">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-gray-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  ></path>
                </svg>
                <span className="text-gray-700">{userData.email}</span>
              </div>

              {userData.mobileno && (
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-gray-500 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    ></path>
                  </svg>
                  <span className="text-gray-700">{userData.mobileno}</span>
                </div>
              )}

              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-gray-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
                <span className="text-gray-700">
                  Joined{" "}
                  {userData.createdAt
                    ? formatDate(userData.createdAt)
                    : "Recently"}
                </span>
              </div>

              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-gray-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span className="text-gray-700">
                  {userData.isVerified ? (
                    <span className="text-green-600">Verified Account</span>
                  ) : (
                    <span className="text-red-500">Unverified Account</span>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* User Details Form/Card */}
        <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-secondary mb-6 pb-2 border-b border-gray-200">
            {isEditing ? "Edit Profile Information" : "Profile Information"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="firstname"
                  value={editedUser.firstname || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              ) : (
                <p className="text-gray-800">
                  {userData.firstname || "Not provided"}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="lastname"
                  value={editedUser.lastname || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              ) : (
                <p className="text-gray-800">
                  {userData.lastname || "Not provided"}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={editedUser.email || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              ) : (
                <p className="text-gray-800">
                  {userData.email || "Not provided"}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Number
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="mobileno"
                  value={editedUser.mobileno || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              ) : (
                <p className="text-gray-800">
                  {userData.mobileno || "Not provided"}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                NIC
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="nic"
                  value={editedUser.nic || ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              ) : (
                <p className="text-gray-800">
                  {userData.nic || "Not provided"}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              {isEditing ? (
                <input
                  type="date"
                  name="dateofbirth"
                  value={
                    editedUser.dateofbirth
                      ? new Date(editedUser.dateofbirth)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              ) : (
                <p className="text-gray-800">
                  {userData.dateofbirth
                    ? formatDate(userData.dateofbirth)
                    : "Not provided"}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              {isEditing ? (
                <textarea
                  name="address"
                  value={editedUser.address || ""}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              ) : (
                <p className="text-gray-800">
                  {userData.address || "Not provided"}
                </p>
              )}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap justify-between items-center">
            <button
              onClick={handleEditToggle}
              className={`px-4 py-2 rounded-md flex items-center ${
                isEditing
                  ? "bg-gray-500 hover:bg-gray-600"
                  : "bg-primary hover:bg-red-900"
              } text-white transition-colors mb-4 sm:mb-0`}
              disabled={isSaving}
            >
              {isEditing ? (
                <>
                  <svg
                    className="w-5 h-5 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Cancel
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                  Edit Profile
                </>
              )}
            </button>

            {isEditing && (
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleSaveChanges}
                  className="px-6 py-2 bg-primary text-white rounded-md hover:bg-red-900 transition-colors flex items-center"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Save Changes
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeactivateModal(true)}
                  className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center"
                >
                  <svg
                    className="w-5 h-5 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Deactivate Account
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Deactivate Account Modal */}
      {showDeactivateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-80">
            <h3 className="text-lg font-semibold mb-4">Confirm Deactivation</h3>

            <p className="text-sm mb-4 text-gray-600">
              Are you sure you want to deactivate your account? This action will
              hide your profile but your data will be preserved.
            </p>

            <p className="text-sm mb-4 text-gray-600">
              Please enter your password to confirm:
            </p>

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeactivateModal(false)}
                className="px-4 py-2 rounded bg-gray-300 text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleDeactivate}
                className="px-4 py-2 rounded bg-red-600 text-white"
              >
                Confirm Deactivate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MerchantProfile;

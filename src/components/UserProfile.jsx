import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authApi from "../api/authApi.js";
import userAvatar from "../assets/userAvatar.png";
import { showSuccess, showError } from "../utils/alertService.js";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const userString = localStorage.getItem("user");
        const user = userString ? JSON.parse(userString) : null;
        const userID = user?.id;

        if (!userID) {
          console.error("User ID not found.");
          setLoading(false);
          return;
        }

        const res = await authApi.get(`/auth/getuser/${userID}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserData(res.data);
        setEditedUser(res.data);
      } catch (error) {
        console.error("Failed to fetch user data", error);
        setError("Failed to load user details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser._id) {
      setUserId(storedUser._id); // Assuming you're using useState
    } else {
      console.error("User ID is missing");
    }
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
      const user = localStorage.getItem("user");
      const userID = JSON.parse(localStorage.getItem("user"))?.id;
      console.log(userID);
      await authApi.put(`/auth/update/${userID}`, editedUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUserData(editedUser);
      showSuccess("Profile updated successfully");
      setIsEditing(false);

      // Update the user in localStorage if needed
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
      console.error("Failed to update profile:", error);
      showError("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeactivateAccount = async () => {
    const confirmDeactivate = window.confirm(
      "Are you sure you want to deactivate your account?"
    );
    if (!confirmDeactivate) return;

    try {
      const token = localStorage.getItem("token");

      await authApi.put(
        "/auth/deactivate",
        {}, // Empty body as expected by your controller
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      showSuccess("Your account has been deactivated.");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    } catch (error) {
      console.error("Error deactivating account:", error);
      showError(
        error.response?.data?.message ||
          "Failed to deactivate account. Please try again."
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="text-center py-12 text-gray-500">No user data found.</div>
    );
  }

  return (
    <div className="px-8 pt-2 pb-12 min-h-screen bg-white">
      <div className="flex justify-between items-center mt-2 mb-6">
        <h3 className="text-secondary font-medium text-lg">My Account</h3>
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-primary hover:text-secondary transition-all"
        >
          &larr; Back
        </button>
      </div>

      {/* Divide into 2 sides */}
      <div className="flex gap-8">
        {/* Left side - Sidebar */}
        <div className="w-1/6 bg-gray-50 p-6 rounded-lg shadow-md flex flex-col gap-4">
          <button
            onClick={() => navigate("/myorders")}
            className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-60 transition-all"
          >
            My Orders
          </button>
          <button
            onClick={() => navigate("/order-history")}
            className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-60 transition-all"
          >
            Order History
          </button>
        </div>

        {/* Right side - User details */}
        <div className="w-3/4 bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-center">
            <img
              src={userAvatar}
              alt="userAvatar"
              className="w-24 h-24 object-contain"
            />
          </div>
          <div className="mt-4 text-center">
            <h2 className="text-xl font-semibold text-secondary">
              {userData.firstname} {userData.lastname}
            </h2>
            <p className="text-gray-500">{userData.email}</p>
          </div>

          {/* User information fields */}
          <div className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <div className="text-sm font-medium text-gray-500">
                  First Name
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    name="firstname"
                    value={editedUser.firstname || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                ) : (
                  <div className="text-lg text-secondary">
                    {userData.firstname || "Not provided"}
                  </div>
                )}
              </div>

              <div>
                <div className="text-sm font-medium text-gray-500">
                  Last Name
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    name="lastname"
                    value={editedUser.lastname || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                ) : (
                  <div className="text-lg text-secondary">
                    {userData.lastname || "Not provided"}
                  </div>
                )}
              </div>

              <div>
                <div className="text-sm font-medium text-gray-500">Email</div>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={editedUser.email || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                ) : (
                  <div className="text-lg text-secondary">
                    {userData.email || "Not provided"}
                  </div>
                )}
              </div>

              <div>
                <div className="text-sm font-medium text-gray-500">Phone</div>
                {isEditing ? (
                  <input
                    type="text"
                    name="mobileno"
                    value={editedUser.mobileno || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                ) : (
                  <div className="text-lg text-secondary">
                    {userData.mobileno || "Not provided"}
                  </div>
                )}
              </div>

              <div>
                <div className="text-sm font-medium text-gray-500">NIC</div>
                {isEditing ? (
                  <input
                    type="text"
                    name="nic"
                    value={editedUser.nic || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                ) : (
                  <div className="text-lg text-secondary">
                    {userData.nic || "Not provided"}
                  </div>
                )}
              </div>

              <div>
                <div className="text-sm font-medium text-gray-500">
                  Date of Birth
                </div>
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
                  <div className="text-lg text-secondary">
                    {userData.dateofbirth
                      ? new Date(userData.dateofbirth).toLocaleDateString()
                      : "Not provided"}
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <div className="text-sm font-medium text-gray-500">Address</div>
                {isEditing ? (
                  <textarea
                    name="address"
                    value={editedUser.address || ""}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                ) : (
                  <div className="text-lg text-secondary">
                    {userData.address || "Not provided"}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-6 flex justify-between">
            {isEditing ? (
              <div className="flex gap-4">
                <button
                  onClick={handleEditToggle}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-all flex items-center"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Cancel
                </button>
                <button
                  onClick={handleSaveChanges}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-60 transition-all flex items-center"
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
                  onClick={() => setShowDeleteModal(true)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-all flex items-center"
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
                  Delete Account
                </button>
              </div>
            ) : (
              <button
                onClick={handleEditToggle}
                className="px-6 py-2 bg-primary text-white rounded-md hover:bg-opacity-60 transition-all flex items-center"
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
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">
              Confirm Account Deletion
            </h3>

            <p className="text-sm mb-4 text-gray-600">
              Are you sure you want to delete your account? This action cannot
              be undone. Please enter your password to confirm deletion.
            </p>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setPassword("");
                }}
                className="px-4 py-2 rounded bg-gray-300 text-gray-700 hover:bg-gray-400 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDeactivateAccount}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition-all"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;

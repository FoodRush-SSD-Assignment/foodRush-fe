import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authApi from "../api/authApi.js";
import userAvatar from "../assets/userAvatar.png";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
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
      } catch (error) {
        console.error("Failed to fetch user data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

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
              {userData.firstname} {userData.lastName}
            </h2>
            <p className="text-gray-500">{userData.email}</p>
          </div>
          <div className="mt-6">
            <div className="text-sm font-medium text-gray-500">Phone</div>
            <div className="text-lg text-secondary">
              {userData.mobileno || "Not provided"}
            </div>
          </div>

          <div className="mt-4">
            <div className="text-sm font-medium text-gray-500">Address</div>
            <div className="text-lg text-secondary">
              {userData.address || "No status available"}
            </div>
          </div>

          <div className="mt-4">
            <div className="text-sm font-medium text-gray-500">NIC</div>
            <div className="text-lg text-secondary">
              {userData.nic || "No status available"}
            </div>
          </div>

          <div className="mt-4">
            <div className="text-sm font-medium text-gray-500">Date of Birth</div>
            <div className="text-lg text-secondary">
              {userData.dateofbirth || "No status available"}
            </div>
          </div>

          <div className="mt-6 flex justify-center">
          <button
            onClick={() => navigate("/update-profile")} // Navigate to a profile update page if needed
            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-opacity-60 transition-all"
          >
            Edit Profile
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

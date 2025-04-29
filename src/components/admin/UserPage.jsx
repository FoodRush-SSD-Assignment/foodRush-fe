import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import authApi from "../../api/authAPI";

const UserPage = () => {
  const { id } = useParams(); // Get user id from URL
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token"); // Get token from localStorage
        const response = await authApi.get(`/auth/getuser/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!user) {
    return <div className="p-6 text-red-500">User not found.</div>;
  }

  return (
    <div className="px-8 py-6 min-h-screen">
      <h2 className="text-2xl font-bold text-primary mb-6">User Details</h2>
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <div>
          <span className="font-semibold text-gray-700">Full Name:</span>{" "}
          {user.firstname} {user.lastname}
        </div>
        <div>
          <span className="font-semibold text-gray-700">Email:</span>{" "}
          {user.email}
        </div>
        <div>
          <span className="font-semibold text-gray-700">Mobile No:</span>{" "}
          {user.mobileno}
        </div>
        <div>
          <span className="font-semibold text-gray-700">NIC:</span> {user.nic}
        </div>
        <div>
          <span className="font-semibold text-gray-700">Address:</span>{" "}
          {user.address}
        </div>
        <div>
          <span className="font-semibold text-gray-700">Date of Birth:</span>{" "}
          {new Date(user.dateofbirth).toLocaleDateString()}
        </div>
        <div>
          <span className="font-semibold text-gray-700">Role:</span> {user.role}
        </div>
        <div>
          <span className="font-semibold text-gray-700">Verified:</span>{" "}
          {user.isVerified ? "Yes" : "No"}
        </div>
        <div>
          <span className="font-semibold text-gray-700">Account Created:</span>{" "}
          {new Date(user.createdAt).toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default UserPage;

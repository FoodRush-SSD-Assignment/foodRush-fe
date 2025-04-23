import React, { useEffect, useState } from "react";
import axios from "axios";
import authApi from "../../api/authAPI";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  //   const baseURL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await authApi.get(`/auth/getusers`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(res.data.users || res.data); // Adjust depending on your backend response
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch users", err);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="mt-6 p-4 bg-red-100 border border-red-300 rounded-lg">
      <h2 className="text-lg font-semibold text-red-700 mb-4">Admin Panel</h2>
      <p className="text-sm text-red-600 mb-4">
        Manage users, view reports, and control platform settings.
      </p>

      {loading ? (
        <p className="text-gray-600">Loading users...</p>
      ) : users.length === 0 ? (
        <p className="text-gray-500">No users found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {users.map((user) => (
            <div
              key={user._id}
              className="bg-white rounded shadow-md p-4 border border-gray-200"
            >
              <h3 className="font-semibold text-gray-800">
                {user.firstname} {user.lastname}
              </h3>
              <p className="text-sm text-gray-600">Email: {user.email}</p>
              <p className="text-sm text-gray-600">Role: {user.role}</p>
              <p className="text-sm text-gray-500 mt-2">NIC: {user.nic}</p>
              <p className="text-sm text-gray-500">Mobile: {user.mobileno}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;

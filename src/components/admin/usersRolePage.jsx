import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import authApi from "../../api/authAPI";

const UserRolePage = () => {
  const { role } = useParams();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const formatRoleName = (role) => {
    switch (role) {
      case "customer":
        return "Customers";
      case "restaurantOwner":
        return "Restaurant Owners";
      case "deliveryPerson":
        return "Delivery Drivers";
      default:
        return role.charAt(0).toUpperCase() + role.slice(1);
    }
  };

  useEffect(() => {
    const fetchUsersByRole = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await authApi.get(`/auth/getusers/role/${role}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
        setError(null);
      } catch (err) {
        console.error(`Failed to fetch ${role} users:`, err);
        setError(`Failed to load ${formatRoleName(role)}`);
      } finally {
        setLoading(false);
      }
    };

    if (role) {
      fetchUsersByRole();
    }
  }, [role]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
        );
      case "inactive":
        return (
          <span className="inline-block w-3 h-3 bg-red-500 rounded-full"></span>
        );
      case "pending":
        return (
          <span className="inline-block w-3 h-3 bg-yellow-500 rounded-full"></span>
        );
      default:
        return (
          <span className="inline-block w-3 h-3 bg-gray-400 rounded-full"></span>
        );
    }
  };

  return (
    <div className="pt-4 px-8 min-h-screen">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-primary hover:text-secondary transition-all"
      >
        &larr; Back
      </button>

      <h2 className="text-xl font-semibold text-secondary mb-6">
        {formatRoleName(role)}
      </h2>

      {loading ? (
        <div className="text-center py-10">
          <p className="text-gray-600">Loading users...</p>
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <p className="text-red-500">{error}</p>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600">No {formatRoleName(role)} found</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {users.map((user) => (
            <div
              key={user._id}
              className="bg-white rounded-xl shadow-md p-5 border border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center hover:shadow-lg transition-all"
            >
              <div>
                <div className="text-lg font-semibold text-darkgrey">
                  {user.firstName} {user.lastName}
                </div>
                <div className="text-secondary text-opacity-70 text-sm mt-1">
                  {user.email}
                  {user.phone && (
                    <>
                      <span className="mx-2">•</span>
                      {user.phone}
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 mt-4 sm:mt-0">
                {getStatusBadge(user.isActive ? "active" : "inactive")}
                <span
                  className={`text-sm font-medium ${
                    user.isActive ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {user.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserRolePage;

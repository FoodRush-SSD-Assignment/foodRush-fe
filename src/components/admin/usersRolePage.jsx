import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import authApi from "../../api/authAPI";

const UserRolePage = () => {
  const { role } = useParams();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Format role name for display
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

  // Helper function to render status badge (if needed)
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
          <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
        );
    }
  };

  return (
    <div className="pt-4 px-8 min-h-screen">
      {/* Header with back button */}

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-primary hover:text-secondary transition-all"
      >
        &larr; Back
      </button>
      <div>
        {" "}
        <h2 className="text-xl font-semibold text-secondary">
          {formatRoleName(role)}
        </h2>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <p className="text-gray-600">Loading users...</p>
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <p className="text-red-500">{error}</p>
        </div>
      ) : (
        <div>
          {users.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-600">No {formatRoleName(role)} found</p>
            </div>
          ) : (
            <div className="bg-lightgray rounded border-darkgrey border-[1px]">
              {users.map((user) => (
                <div key={user._id} className="border-b last:border-b-0 p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-secondary text-opacity-50 text-sm flex gap-1">
                        <span>{user.email}</span>
                        {user.phone && (
                          <>
                            <span>•</span>
                            <span>{user.phone}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-secondary">
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                      {getStatusBadge(user.isActive ? "active" : "inactive")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserRolePage;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import authApi from "../../api/authApi.js";

const UserRolePage = () => {
  const { role } = useParams();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
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

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle user card click
  const handleUserClick = (userId) => {
    navigate(`/admin/user/${userId}`);
  };

  // Filter users based on search query
  const filteredUsers = users.filter((user) => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    const fullName = `${user.firstname || ""} ${
      user.lastname || ""
    }`.toLowerCase();

    return (
      fullName.includes(query) || user.email?.toLowerCase().includes(query)
    );
  });

  // Get user initials for avatar
  const getUserInitials = (user) => {
    const firstInitial = user.firstName ? user.firstName[0].toUpperCase() : "";
    const lastInitial = user.lastName ? user.lastName[0].toUpperCase() : "";
    return `${firstInitial}${lastInitial}`;
  };

  return (
    <div className="pt-4 px-8 pb-8 min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className=" sm:items-center mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-secondary mt-2">
            {formatRoleName(role)}
          </h2>
          <button
            onClick={() => navigate(-1)}
            className="text-primary hover:text-secondary transition-all"
          >
            &larr; Back
          </button>
        </div>

        {/* Search Bar */}
        <div className="mt-4 sm:mt-0 w-full sm:w-64 relative">
          <input
            type="text"
            placeholder="Search by name or email"
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <svg
            className="w-5 h-5 text-gray-400 absolute left-3 top-2.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>
      <hr className="mb-6 rounded-md" />

      {/* User Count */}
      <div className="flex items-center mb-4">
        <span className="bg-red-100 text-red-800 py-1 px-3 rounded-full text-sm font-medium">
          {filteredUsers.length} {filteredUsers.length === 1 ? "user" : "users"}{" "}
          found
        </span>
      </div>

      {/* Users List */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        </div>
      ) : error ? (
        <div className="text-center py-10 bg-white rounded-lg shadow-sm p-8">
          <p className="text-red-500">{error}</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg shadow-sm p-8">
          <p className="text-gray-600">
            {searchQuery
              ? "No users match your search criteria."
              : `No ${formatRoleName(role)} found.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-all"
              onClick={() => handleUserClick(user._id)}
            >
              <div className="flex items-center p-4 border-b border-gray-100">
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg mr-3">
                  {getUserInitials(user)}
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-800">
                    {user.firstname} {user.lastname}
                  </h4>
                  <div className="flex items-center mt-1">
                    {getStatusBadge(user.isActive ? "active" : "inactive")}
                    <span
                      className={`text-xs ml-2 ${
                        user.isActive ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 text-gray-500 mr-2"
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
                    <span className="text-sm text-gray-700 truncate max-w-full">
                      {user.email}
                    </span>
                  </div>

                  {user.phone && (
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 text-gray-500 mr-2"
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
                      <span className="text-sm text-gray-700">
                        {user.phone}
                      </span>
                    </div>
                  )}

                  {user.address && (
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 text-gray-500 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        ></path>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        ></path>
                      </svg>
                      <span className="text-sm text-gray-700 truncate max-w-full">
                        {user.address}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex justify-end">
                  <button className="text-xs text-primary hover:text-secondary transition-colors">
                    View Details &rarr;
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserRolePage;

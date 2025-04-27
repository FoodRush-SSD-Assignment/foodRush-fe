import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authApi from "../../api/authAPI";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    role: "",
    email: "",
    address: "",
    nic: "",
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await authApi.get(`/auth/getusers`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = Array.isArray(response.data)
          ? response.data
          : [response.data];
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleUserClick = (userId) => {
    navigate(`/admin/user/${userId}`);
  };

  const clearFilters = () => {
    setFilters({
      name: "",
      role: "",
      email: "",
      address: "",
      nic: "",
    });
  };

  const filteredUsers = users.filter((user) => {
    return (
      (filters.name === "" ||
        user.firstname?.toLowerCase().includes(filters.name.toLowerCase()) ||
        user.lastname?.toLowerCase().includes(filters.name.toLowerCase())) &&
      (filters.role === "" || user.role === filters.role) &&
      (filters.email === "" ||
        user.email?.toLowerCase().includes(filters.email.toLowerCase())) &&
      (filters.address === "" ||
        user.address?.toLowerCase().includes(filters.address.toLowerCase())) &&
      (filters.nic === "" || user.nic?.includes(filters.nic))
    );
  });

  return (
    <div className="px-8 pt-2 min-h-screen bg-white">
      {/* User Filters */}
      <div className="mb-0 pt-1">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-secondary font-medium text-lg">Filter Users</h3>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-2">
          <div className="flex flex-col">
            <label htmlFor="name" className="text-xs font-medium text-gray-600">
              Name
            </label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="Search by name"
              value={filters.name}
              onChange={handleFilterChange}
              className="border border-gray-300 p-1.5 text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="role" className="text-xs font-medium text-gray-600">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={filters.role}
              onChange={handleFilterChange}
              className="border border-gray-300 p-1.5 text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white"
            >
              <option value="">All Roles</option>
              <option value="customer">Customer</option>
              <option value="restaurantOwner">Restaurant Owner</option>
              <option value="deliveryPerson">Delivery Person</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="email"
              className="text-xs font-medium text-gray-600"
            >
              Email
            </label>
            <input
              id="email"
              type="text"
              name="email"
              placeholder="Search by email"
              value={filters.email}
              onChange={handleFilterChange}
              className="border border-gray-300 p-1.5 text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <label
              htmlFor="address"
              className="text-xs font-medium text-gray-600"
            >
              Address
            </label>
            <input
              id="address"
              type="text"
              name="address"
              placeholder="Search by address"
              value={filters.address}
              onChange={handleFilterChange}
              className="border border-gray-300 p-1.5 text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="nic" className="text-xs font-medium text-gray-600">
              NIC
            </label>
            <input
              id="nic"
              type="text"
              name="nic"
              placeholder="Search by NIC"
              value={filters.nic}
              onChange={handleFilterChange}
              className="border border-gray-300 p-1.5 text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </div>
        </div>
        <div className="flex justify-end py-4">
          <button
            onClick={clearFilters}
            className="px-3 py-1 text-sm bg-primary hover:bg-red-900 text-white rounded-md transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      <hr className="border-t border-gray-200 mb-8" />

      {/* User List */}
      <div className="">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-secondary font-semibold text-xl">All Users</h3>
          <span className=" text-red-800 py-1 px-3 rounded-sm text-sm font-medium">
            {filteredUsers.length} users found
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No users match your search criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-lg transition-all"
                onClick={() => handleUserClick(user._id)}
              >
                <div className="h-32 bg-lightgray  relative">
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-xl font-bold text-secondary">
                      {user.firstname} {user.lastname}
                    </span>
                    <div className="text-sm text-white bg-black bg-opacity-20 px-3 py-1 rounded-full mt-2 capitalize">
                      {user.role?.replace("_", " ")}
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex flex-col space-y-2">
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
                      <span className="text-sm text-gray-700">
                        {user.email}
                      </span>
                    </div>
                    {user.nic && (
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
                            d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0"
                          ></path>
                        </svg>
                        <span className="text-sm text-gray-700">
                          {user.nic}
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
                        <span className="text-sm text-gray-700 truncate">
                          {user.address}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllUsers;

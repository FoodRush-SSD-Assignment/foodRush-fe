import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authApi from "../../api/authAPI";
import axios from "axios"; // Add axios for fetching restaurants
import restaurantApi from "../../api/restaurantAPI";

const AdminPanel = () => {
  const [userCounts, setUserCounts] = useState({
    customer: 0,
    restaurantOwner: 0,
    deliveryPerson: 0,
  });
  const [loading, setLoading] = useState(true);
  const [restaurants, setRestaurants] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsersAndRestaurants = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch users
        const usersRes = await authApi.get(`/auth/getusers`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const users = usersRes.data.users || usersRes.data;
        const counts = { customer: 0, restaurantOwner: 0, deliveryPerson: 0 };

        users.forEach((user) => {
          if (counts[user.role] !== undefined) {
            counts[user.role]++;
          }
        });
        setUserCounts(counts);

        // Fetch restaurants
        const restaurantsRes = await restaurantApi.get(`/restaurants/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const restaurants = restaurantsRes.data;
        // sort newest first
        restaurants.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setRestaurants(restaurants); // You should add setRestaurants state
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsersAndRestaurants();
  }, []);

  const handleRoleCardClick = (role) => {
    navigate(`/admin/users/${role}`);
  };

  const driverRegistrations = [
    {
      id: 1,
      name: "Nimal Perera",
      email: "nimalperera@gmail.com",
      date: "2023-03-15",
      status: "needs-reviewing",
    },
    {
      id: 2,
      name: "Nimal Perera",
      email: "nimalperera@gmail.com",
      date: "2023-03-15",
      status: "approved",
    },
    {
      id: 3,
      name: "Nimal Perera",
      email: "nimalperera@gmail.com",
      date: "2023-03-15",
      status: "rejected",
    },
  ];

  // Helper functions
  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return (
          <span className="inline-block w-3 h-3 bg-blue-500 rounded-full"></span>
        );
      case "approved":
        return (
          <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
        );
      case "suspended":
        return (
          <span className="inline-block w-3 h-3 bg-primary rounded-full"></span>
        );
      default:
        return null;
    }
  };

  const getStatusText = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "Pending";
      case "approved":
        return "Approved";
      case "suspended":
        return "Suspended";
      default:
        return "";
    }
  };

  return (
    <div className="pt-4 min-h-screen">
      {/* Active Users */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-secondary font-medium mb-3">Active Users</h3>

          <a
            href="/admin/users"
            className="text-primary text-sm hover:text-blue-500 transition-all"
          >
            See All
          </a>
        </div>

        <div className="flex gap-4">
          <div
            className="bg-primary text-white px-6 py-4 rounded shadow-sm w-1/3 cursor-pointer hover:opacity-90 transition-all hover:scale-105 transform"
            onClick={() => handleRoleCardClick("customer")}
          >
            <p className="text-sm">Customers</p>
            <p className="text-2xl font-bold">{userCounts.customer}</p>
          </div>
          <div
            className="bg-primary text-white px-6 py-4 rounded shadow-sm w-1/3 cursor-pointer hover:opacity-90 transition-all hover:scale-105 transform"
            onClick={() => handleRoleCardClick("restaurantOwner")}
          >
            <p className="text-sm">Restaurant Owners</p>
            <p className="text-2xl font-bold">{userCounts.restaurantOwner}</p>
          </div>
          <div
            className="bg-primary text-white px-6 py-4 rounded shadow-sm w-1/3 cursor-pointer hover:opacity-90 transition-all hover:scale-105 transform"
            onClick={() => handleRoleCardClick("deliveryPerson")}
          >
            <p className="text-sm">Drivers</p>
            <p className="text-2xl font-bold">{userCounts.deliveryPerson}</p>
          </div>
        </div>
      </div>

      {/* Recent Driver Registrations */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-secondary font-medium">
            Recent Driver Registrations
          </h3>
          <a
            href="#"
            className="text-primary text-sm hover:text-blue-500 transition-all"
          >
            See All
          </a>
        </div>
        <div className="bg-lightgray rounded border-darkgrey border-[1px]">
          {driverRegistrations.map((driver) => (
            <div
              key={driver.id}
              className="border-b last:border-b-0 p-3 hover:bg-gray-100 transition-all"
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{driver.name}</div>
                  <div className="text-secondary text-opacity-50 text-sm flex gap-1">
                    <span>{driver.email}</span>
                    <span>•</span>
                    <span>{driver.date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-secondary">
                    {getStatusText(driver.status)}
                  </span>
                  {getStatusBadge(driver.status)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Restaurants */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-secondary font-medium">New Restaurants</h3>
          <a
            href="#"
            className="text-primary text-sm hover:text-blue-500 transition-all"
          >
            See All
          </a>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {restaurants.map((restaurant) => (
            <div
              key={restaurant._id}
              className="bg-white rounded shadow-sm overflow-hidden hover:scale-105 transform hover:shadow-xl transition-all"
              onClick={() => navigate(`/admin/restaurant/${restaurant._id}`)}
            >
              <div className="h-32 bg-gray-300 relative">
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-lg font-bold text-white">
                    {restaurant.restaurantName}
                  </span>
                  <div className="text-sm text-white capitalize">
                    {restaurant.category.replace("_", " ")}
                  </div>
                </div>
              </div>
              <div className="p-3">
                <div className="flex justify-center items-center gap-2 mt-1">
                  <span className="text-sm text-gray-700">
                    {getStatusText(restaurant.status)}
                  </span>
                  {getStatusBadge(restaurant.status)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

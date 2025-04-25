import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authApi from "../../api/authAPI";

const AdminPanel = () => {
  const [userCounts, setUserCounts] = useState({
    customer: 0,
    restaurantOwner: 0,
    deliveryPerson: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await authApi.get(`/auth/getusers`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const users = res.data.users || res.data;
        const counts = {
          customer: 0,
          restaurantOwner: 0,
          deliveryPerson: 0,
        };

        users.forEach((user) => {
          if (counts[user.role] !== undefined) {
            counts[user.role]++;
          }
        });

        setUserCounts(counts);
      } catch (err) {
        console.error("Failed to fetch users", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
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

  const newRestaurants = [
    { id: 1, name: "MasterChef", type: "Fast Food", status: "needs-reviewing" },
    { id: 2, name: "MasterChef", type: "Fast Food", status: "approved" },
    { id: 3, name: "MasterChef", type: "Fast Food", status: "rejected" },
  ];

  // Helper function to render status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "needs-reviewing":
        return (
          <span className="inline-block w-3 h-3 bg-blue-500 rounded-full"></span>
        );
      case "approved":
        return (
          <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
        );
      case "rejected":
        return (
          <span className="inline-block w-3 h-3 bg-primary rounded-full"></span>
        );
      default:
        return null;
    }
  };

  // Helper function to render status text
  const getStatusText = (status) => {
    switch (status) {
      case "needs-reviewing":
        return "Needs Reviewing";
      case "approved":
        return "Approved";
      case "rejected":
        return "Rejected";
      default:
        return "";
    }
  };

  return (
    <div className="pt-4 min-h-screen">
      {/* Active Users */}
      <div className="mb-10">
        <h3 className="text-secondary font-medium mb-3">Active Users</h3>
        <div className="flex gap-4">
          <div
            className="bg-primary text-white px-6 py-4 rounded shadow-sm w-1/3 cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => handleRoleCardClick("customer")}
          >
            <p className="text-sm">Customers</p>
            <p className="text-2xl font-bold">{userCounts.customer}</p>
          </div>
          <div
            className="bg-primary text-white px-6 py-4 rounded shadow-sm w-1/3 cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => handleRoleCardClick("restaurantOwner")}
          >
            <p className="text-sm">Restaurant Owners</p>
            <p className="text-2xl font-bold">{userCounts.restaurantOwner}</p>
          </div>
          <div
            className="bg-primary text-white px-6 py-4 rounded shadow-sm w-1/3 cursor-pointer hover:opacity-90 transition-opacity"
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
          <a href="#" className="text-primary text-sm">
            See All
          </a>
        </div>
        <div className="bg-lightgray rounded border-darkgrey border-[1px]">
          {driverRegistrations.map((driver) => (
            <div key={driver.id} className="border-b last:border-b-0 p-3">
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
                  {driver.status === "needs-reviewing" ? (
                    <span className="text-secondary">Needs Reviewing</span>
                  ) : (
                    <span
                      className={
                        driver.status === "approved"
                          ? "text-secondary"
                          : "text-secondary"
                      }
                    >
                      {getStatusText(driver.status)}
                    </span>
                  )}
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
          <a href="#" className="text-primary text-sm">
            See All
          </a>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {newRestaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className="bg-white rounded shadow-sm overflow-hidden"
            >
              <div className="h-32 bg-gray-300 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-medium text-white">
                    {restaurant.name}
                  </span>
                  <div className="text-center text-white">
                    {restaurant.type}
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

import React, { useEffect, useState } from "react";
import restaurantApi from "../../api/restaurantApi.js";
import orderApi from "../../api/orderApi.js";

const RestaurantManagement = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ownerId, setOwnerId] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));
        const ownerId = user?.id;
        setOwnerId(ownerId);

        const restaurantRes = await restaurantApi.get(
          `/restaurants/owned/${ownerId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setRestaurants(restaurantRes.data);

        let allOrders = [];
        for (const rest of restaurantRes.data) {
          const orderRes = await orderApi.get(
            `/order-service/order/restaurant/${rest._id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          allOrders = [...allOrders, ...orderRes.data];
        }
        setOrders(allOrders);
      } catch (error) {
        console.error("Error loading dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const countByStatus = (status) => {
    return restaurants.filter((r) => r.status?.toLowerCase() === status).length;
  };

  const getCardVisual = (type) => {
    switch (type) {
      case "restaurants":
        return (
          <div className="absolute -top-2 -right-2 w-16 h-16 rounded-full bg-primary bg-opacity-10 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
        );
      case "orders":
        return (
          <div className="absolute -top-2 -right-2 w-16 h-16 rounded-full bg-secondary bg-opacity-10 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-secondary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
        );
      case "pending":
        return (
          <div className="absolute -top-2 -right-2 w-16 h-16 rounded-full bg-primary bg-opacity-10 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        );
      case "approved":
        return (
          <div className="absolute -top-2 -right-2 w-16 h-16 rounded-full bg-secondary bg-opacity-10 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-secondary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        );
      case "suspended":
        return (
          <div className="absolute -top-2 -right-2 w-16 h-16 rounded-full bg-darkgrey bg-opacity-20 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-darkgrey"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <span className="mt-4 text-lg text-secondary">
              Loading your dashboard...
            </span>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {/* Total Restaurants */}
              <div className="relative p-6 bg-white rounded-xl shadow-md border border-darkgrey hover:shadow-lg transition-all">
                <h3 className="text-sm font-medium text-secondary uppercase tracking-wider">
                  Total Restaurants
                </h3>
                <p className="text-4xl font-bold text-primary mt-3">
                  {restaurants.length}
                </p>
                {getCardVisual("restaurants")}
              </div>

              {/* Total Orders */}
              <div className="relative p-6 bg-white rounded-xl shadow-md border border-darkgrey hover:shadow-lg transition-all">
                <h3 className="text-sm font-medium text-secondary uppercase tracking-wider">
                  Total Orders
                </h3>
                <p className="text-4xl font-bold text-secondary mt-3">
                  {orders.length}
                </p>
                {getCardVisual("orders")}
              </div>

              {/* Pending Approvals */}
              <div className="relative p-6 bg-white rounded-xl shadow-md border border-darkgrey hover:shadow-lg transition-all">
                <h3 className="text-sm font-medium text-primary uppercase tracking-wider">
                  Pending Approvals
                </h3>
                <p className="text-4xl font-bold text-primary mt-3">
                  {countByStatus("pending")}
                </p>
                {getCardVisual("pending")}
              </div>

              {/* Approved Restaurants */}
              <div className="relative p-6 bg-white rounded-xl shadow-md border border-darkgrey hover:shadow-lg transition-all">
                <h3 className="text-sm font-medium text-secondary uppercase tracking-wider">
                  Active Restaurants
                </h3>
                <p className="text-4xl font-bold text-secondary mt-3">
                  {countByStatus("approved")}
                </p>
                {getCardVisual("approved")}
              </div>

              {/* Suspended Restaurants */}
              <div className="relative p-6 bg-white rounded-xl shadow-md border border-darkgrey hover:shadow-lg transition-all">
                <h3 className="text-sm font-medium text-darkgrey uppercase tracking-wider">
                  Suspended
                </h3>
                <p className="text-4xl font-bold text-darkgrey mt-3">
                  {countByStatus("suspended")}
                </p>
                {getCardVisual("suspended")}
              </div>
            </div>

            {/* Stats Visualization */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-6 bg-white rounded-xl shadow-md border border-darkgrey">
                <h3 className="text-lg font-semibold text-secondary mb-4">
                  Restaurants by Status
                </h3>
                <div className="h-64 flex items-center justify-center">
                  <div className="w-64 h-64 rounded-full border-8 border-lightgray flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-primary">
                        {restaurants.length}
                      </p>
                      <p className="text-sm text-secondary">Total</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white rounded-xl shadow-md border border-darkgrey">
                <h3 className="text-lg font-semibold text-secondary mb-4">
                  Recent Activity
                </h3>
                <div className="space-y-4">
                  {orders.slice(0, 4).map((order, index) => (
                    <div
                      key={index}
                      className="flex items-center p-3 bg-lightgray rounded-lg"
                    >
                      <div
                        className={`w-3 h-3 rounded-full ${
                          index % 2 === 0 ? "bg-primary" : "bg-secondary"
                        }`}
                      ></div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-secondary">
                          Order #{order.orderId}
                        </p>
                        <p className="text-xs text-darkgrey">
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantManagement;

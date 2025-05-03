import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import restaurantApi from "../../api/restaurantApi.js";

const ViewRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ownerId, setOwnerId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));
        const ownerId = user?.id;

        if (!ownerId) {
          console.error("Owner ID is missing!");
          return;
        }
        setOwnerId(ownerId);

        const res = await restaurantApi.get(`/restaurants/owned/${ownerId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setRestaurants(res.data);
      } catch (err) {
        console.error("Failed to fetch restaurants", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return (
          <span className="w-2.5 h-2.5 bg-blue-500 inline-block rounded-full mr-2"></span>
        );
      case "approved":
        return (
          <span className="w-2.5 h-2.5 bg-emerald-500 inline-block rounded-full mr-2"></span>
        );
      case "suspended":
        return (
          <span className="w-2.5 h-2.5 bg-gray-400 inline-block rounded-full mr-2"></span>
        );
      default:
        return null;
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "Pending Approval";
      case "approved":
        return "Active";
      case "suspended":
        return "Suspended";
      default:
        return "";
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "approved":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "suspended":
        return "bg-gray-50 text-gray-500 border-gray-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const renderRestaurantCard = (restaurant) => (
    <div
      key={restaurant._id}
      onClick={() => navigate(`/merchant/restaurant-details/${restaurant._id}`)}
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-100 hover:border-gray-200 group"
    >
      <div className="relative h-40 bg-gradient-to-r from-gray-50 to-gray-100 overflow-hidden">
        {/* Placeholder for restaurant image - you can replace with actual image */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="h-16 w-16 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        </div>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h4 className="text-lg font-semibold text-gray-900 group-hover:text-primary truncate">
            {restaurant.restaurantName}
          </h4>
          <div
            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(
              restaurant.status
            )} border flex items-center`}
          >
            {getStatusBadge(restaurant.status)}
            {getStatusText(restaurant.status)}
          </div>
        </div>

        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex items-start">
            <svg
              className="h-5 w-5 mr-2 text-gray-400 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="leading-tight">
              {restaurant.location || "Location not specified"}
            </span>
          </div>
          <div className="flex items-start">
            <svg
              className="h-5 w-5 mr-2 text-gray-400 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <span className="leading-tight">
              {restaurant.contactNumber || "No contact number"}
            </span>
          </div>
          <div className="flex items-start">
            <svg
              className="h-5 w-5 mr-2 text-gray-400 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            <span className="leading-tight capitalize">
              {restaurant.category?.replace("_", " ") || "Uncategorized"}
            </span>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-gray-100 flex justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/merchant/restaurant-details/${restaurant._id}`);
            }}
          ></button>
        </div>
      </div>
    </div>
  );

  const groupedRestaurants = {
    approved: restaurants.filter((r) => r.status?.toLowerCase() === "approved"),
    pending: restaurants.filter((r) => r.status?.toLowerCase() === "pending"),
    suspended: restaurants.filter(
      (r) => r.status?.toLowerCase() === "suspended"
    ),
  };

  return (
    <div className="min-h-screen bg-lightgray py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with Back Button */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-secondary">
              My Restaurants
            </h1>
          </div>

          {/* Add Menu Item Button */}
          <button
            onClick={() => navigate(`/merchant/add-restaurant/${ownerId}`)}
            className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-lg flex items-center shadow-sm hover:shadow-md transition-all duration-200"
          >
            <svg
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add new restaurant
          </button>
        </div>

        {/* Divider */}
        <div className="h-px bg-darkgrey mb-8"></div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your restaurants...</p>
          </div>
        ) : restaurants.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-10 text-center max-w-2xl mx-auto shadow-sm">
            <div className="mx-auto h-24 w-24 bg-gray-50 rounded-full flex items-center justify-center mb-5">
              <svg
                className="h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No restaurants found
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              You haven't added any restaurants yet. Get started by adding your
              first restaurant.
            </p>
            <button
              onClick={() => navigate(`/merchant/add-restaurant/${ownerId}`)}
              className="bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-lg transition duration-200 shadow-sm hover:shadow-md"
            >
              Add Your First Restaurant
            </button>
          </div>
        ) : (
          <>
            {["approved", "pending", "suspended"].map(
              (status) =>
                groupedRestaurants[status]?.length > 0 && (
                  <div key={status} className="mb-12">
                    <div className="flex items-center mb-5">
                      <h2 className="text-xl font-semibold text-gray-800 capitalize">
                        {status === "approved"
                          ? "Active"
                          : status === "pending"
                          ? "Pending Approval"
                          : "Suspended"}{" "}
                        Restaurants
                      </h2>
                      <span className="ml-3 bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {groupedRestaurants[status].length}
                      </span>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {groupedRestaurants[status].map(renderRestaurantCard)}
                    </div>
                  </div>
                )
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ViewRestaurants;

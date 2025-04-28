import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import restaurantApi from "../../api/restaurantAPI";

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
        const ownerId = user.id;
  
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
          <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
        );
      case "approved":
        return (
          <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
        );
      case "suspended":
        return (
          <span className="inline-block w-3 h-3 bg-primary rounded-full mr-2"></span>
        );
      default:
        return null;
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
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
    <div className="px-8 pt-6 pb-12 min-h-screen bg-lightgray">
      {/* Header with Add Restaurant button */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-secondary text-2xl font-semibold">My Restaurants</h3>
          <button
            onClick={() => navigate(-1)}
            className="mt-2 text-primary hover:text-secondary transition-all flex items-center"
          >
            <span className="mr-1">&larr;</span> Back
          </button>
        </div>
        <button
          onClick={() => navigate(`/merchant/add-restaurant/${ownerId}`)}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-all flex items-center"
        >
          <span className="mr-1">+</span> Add Restaurant
        </button>
      </div>

      {/* Divider */}
      <div className="h-px bg-darkgrey mb-8"></div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-16">
          <div className="text-secondary text-lg">Loading restaurants...</div>
        </div>
      ) : (
        <>
          {restaurants.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="text-secondary text-lg">No restaurants found.</div>
              <p className="text-gray-500 mt-2">Add your first restaurant to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map((restaurant) => (
                <div
                  key={restaurant._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg cursor-pointer transition-all"
                  onClick={() => navigate(`/merchant/restaurant-details/${restaurant._id}`)}
                >
                  <div className="p-5 relative">
                    {/* Status indicator on top right */}
                    <div className="absolute top-4 right-4 flex items-center bg-lightgray px-3 py-1 rounded-full">
                      {getStatusBadge(restaurant.status)}
                      <span className="text-sm font-medium text-secondary">
                        {getStatusText(restaurant.status)}
                      </span>
                    </div>
                    
                    {/* Restaurant details */}
                    <h4 className="text-xl font-bold text-secondary mb-3 pr-24">{restaurant.restaurantName}</h4>
                    
                    <div className="space-y-2 text-gray-700">
                      <div className="flex items-start">
                        <svg className="w-5 h-5 text-primary mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        <span>{restaurant.location}</span>
                      </div>
                      
                      <div className="flex items-start">
                        <svg className="w-5 h-5 text-primary mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                        </svg>
                        <span>{restaurant.contactNumber}</span>
                      </div>
                      
                      <div className="flex items-start">
                        <svg className="w-5 h-5 text-primary mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                        </svg>
                        <span className="capitalize">{restaurant.category?.replace("_", " ") || "N/A"}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-darkgrey flex justify-end">
                      <button className="text-primary hover:text-secondary text-sm transition-all">View Details</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ViewRestaurants;
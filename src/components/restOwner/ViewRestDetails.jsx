import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import restaurantApi from "../../api/restaurantAPI";

const ViewRestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await restaurantApi.get(`/restaurants/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRestaurant(res.data);
      } catch (err) {
        console.error("Failed to fetch restaurant details", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-lightgray">
        <div className="text-secondary text-xl">Loading restaurant details...</div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="flex justify-center items-center h-screen bg-lightgray">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="text-primary text-2xl mb-4">Restaurant not found</div>
          <p className="text-secondary mb-6">The restaurant you're looking for doesn't exist or was removed.</p>
          <button 
            onClick={() => navigate(-1)}
            className="bg-primary text-white px-6 py-2 rounded-md hover:bg-opacity-90 transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Check if restaurant status is approved
  const isApproved = restaurant.status && restaurant.status.toLowerCase() === "approved";

  return (
    <div className="min-h-screen bg-lightgray py-8 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-primary hover:text-secondary transition-all font-medium"
          >
            <span className="mr-2">&larr;</span> Back to Restaurants
          </button>
        </div>

        {/* Restaurant Details Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-secondary text-white p-6">
            <h1 className="text-2xl font-bold">{restaurant.restaurantName}</h1>
            <div className="flex items-center mt-2">
              <span className="inline-block px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm">
                {restaurant.status?.toUpperCase() || "N/A"}
              </span>
              <span className="text-sm ml-4 text-white text-opacity-80">ID: {id}</span>
            </div>
          </div>

          {/* Details */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Category */}
              <div className="border-b border-darkgrey pb-4">
                <h2 className="font-semibold text-secondary mb-2 text-sm uppercase">Category</h2>
                <p className="text-lg capitalize">
                  {restaurant.category?.replace("_", " ") || "N/A"}
                </p>
              </div>

              {/* Contact Number */}
              <div className="border-b border-darkgrey pb-4">
                <h2 className="font-semibold text-secondary mb-2 text-sm uppercase">Contact Number</h2>
                <p className="text-lg">{restaurant.contactNumber || "N/A"}</p>
              </div>

              {/* Location */}
              <div className="border-b border-darkgrey pb-4">
                <h2 className="font-semibold text-secondary mb-2 text-sm uppercase">Location</h2>
                <p className="text-lg">{restaurant.location || "N/A"}</p>
              </div>

              {/* Joined Date */}
              <div className="border-b border-darkgrey pb-4">
                <h2 className="font-semibold text-secondary mb-2 text-sm uppercase">Joined Date</h2>
                <p className="text-lg">
                  {restaurant.createdAt
                    ? new Date(restaurant.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : "N/A"}
                </p>
              </div>
            </div>

            {/* Action Buttons - Only shown if status is approved */}
            {isApproved && (
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate(`/merchant/restaurants/${id}/menu`)}
                  className="bg-primary text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition-all flex-1 flex justify-center items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                  </svg>
                  View Menu
                </button>

                <button
                  onClick={() => navigate(`/viewOrders/restaurant/${id}`)}
                  className="bg-secondary text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition-all flex-1 flex justify-center items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                  </svg>
                  View Orders
                </button>
              </div>
            )}
            
            {/* Message when restaurant is not approved */}
            {!isApproved && (
              <div className="mt-10 p-4 bg-lightgray rounded-md text-center">
                <p className="text-secondary">
                  You'll be able to view menu and orders once the restaurant is approved.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewRestDetails;
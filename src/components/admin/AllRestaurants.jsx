import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import restaurantApi from "../../api/restaurantAPI.js";

const AllRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await restaurantApi.get("/restaurants", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const sortedRestaurants = res.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setRestaurants(sortedRestaurants);
        setFilteredRestaurants(sortedRestaurants);
      } catch (err) {
        console.error("Failed to fetch restaurants", err);
      } finally {
        // Simulate a delay for smoother UX
        setTimeout(() => {
          setLoading(false);
        }, 300);
      }
    };

    fetchRestaurants();
  }, []);

  useEffect(() => {
    filterRestaurants();
  }, [searchName, searchCategory, restaurants]);

  const filterRestaurants = () => {
    let filtered = restaurants;

    if (searchName) {
      filtered = filtered.filter((r) =>
        r.restaurantName.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    if (searchCategory) {
      filtered = filtered.filter((r) =>
        r.category.toLowerCase().includes(searchCategory.toLowerCase())
      );
    }

    setFilteredRestaurants(filtered);
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
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
    <div className="px-8 pt-4 min-h-screen">
      <div className="flex justify-between items-center">
        <h3 className="text-secondary text-xl mb-4">All Restaurants</h3>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-primary hover:text-secondary transition-all"
        >
          &larr; Back
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by Name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="border border-darkgrey rounded px-3 py-2 w-1/2 focus:outline-primary"
        />
        <input
          type="text"
          placeholder="Search by Category"
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
          className="border border-darkgrey rounded px-3 py-2 w-1/2 focus:outline-primary"
        />
      </div>

      {/* Horizontal Line */}
      <hr className="my-4 border-gray-300" />

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-10 text-secondary">Loading...</div>
      ) : (
        <>
          {filteredRestaurants.length === 0 ? (
            <div className="text-center py-10 text-secondary">
              No restaurants found.
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {filteredRestaurants.map((restaurant) => (
                <div
                  key={restaurant._id}
                  className="bg-white rounded shadow-sm overflow-hidden hover:opacity-90 cursor-pointer transition-opacity"
                  onClick={() =>
                    navigate(`/admin/restaurant/${restaurant._id}`)
                  }
                >
                  <div className="h-32 bg-gray-300 relative">
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-lg font-bold text-white">
                        {restaurant.restaurantName}
                      </span>
                      <div className="text-sm text-white capitalize">
                        {restaurant.category?.replace("_", " ") || ""}
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
          )}
        </>
      )}
    </div>
  );
};

export default AllRestaurants;

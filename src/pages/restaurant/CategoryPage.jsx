import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaArrowLeft, FaSearch } from "react-icons/fa";
import restaurantApi from "../../api/restaurantAPI";
import RestaurantCard from "../../components/restaurant/RestaurantCards";

const categoryTitles = {
  fast_food: "Fast Food",
  traditional: "Traditional Sri Lankan Cuisine Restaurants",
  asian: "Asian Restaurants",
  western: "Western Restaurants",
  healthy: "Healthy & Vegan",
  bakery: "Bakery Delights",
};

const CategoryPage = () => {
  const { type } = useParams();
  const title = categoryTitles[type] || "Unknown Category";

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = `${title} - Foodie`;

    const fetchRestaurants = async () => {
      console.log("Fetching restaurants for category:", type);
      console.log("Using token:", localStorage.getItem("token"));

      try {
        const res = await restaurantApi.get(`/restaurants/category/${type}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        // Check if the response data is an array
        console.log("Response data:", res.data);

        if (Array.isArray(res.data)) {
          setRestaurants(res.data);
        } else {
          console.error("Unexpected response format:", res.data);
          setRestaurants([]);
        }
      } catch (err) {
        console.error("Error fetching restaurants:", err);
        setRestaurants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [type, title]);

  return (
    <div className="w-full">
      {/* Breadcrumb navigation */}
      <div className="flex justify-between items-center px-4 py-2 border-b">
        <div className="text-gray-500">
          <span>Categories</span>
          <span className="mx-2">›</span>
          <span className="text-primary">{title}</span>
        </div>
        <Link to="/" className="text-primary flex items-center">
          <FaArrowLeft className="mr-1" />
          <span>Back</span>
        </Link>
      </div>

      {/* Page title */}
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold px-4 pt-4 text-secondary">
          Restaurants with {title}
        </h1>
      </div>

      {/* Search bar */}
      <div className="px-4 py-4">
        <div className="relative max-w-full">
          <input
            type="text"
            placeholder="Search for a restaurant or a food item"
            className="w-full p-3 pl-12 rounded-lg bg-pink-50 text-gray-700"
          />
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Restaurant listings */}
      <div className="px-4 space-y-4">
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : restaurants.length === 0 ? (
          <p className="text-center text-red-500">
            No restaurants found in this category.
          </p>
        ) : (
          <div className="space-y-4">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant._id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;

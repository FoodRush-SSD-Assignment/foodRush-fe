import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import restaurantApi from "../../api/restaurantApi.js";
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
    <div className="w-full bg-lightgray min-h-screen">
      {/* Breadcrumb navigation with enhanced styling */}
      <div className="flex justify-between items-center px-6 py-4 bg-white shadow-sm">
        <div className="text-gray-600 font-medium flex items-center">
          <Link
            to="/landing-page"
            className="hover:text-primary transition-colors"
          >
            Restaurant Categories
          </Link>
          <span className="mx-2 text-gray-400">›</span>
          <span className="text-primary font-semibold">{title}</span>
        </div>
        <Link
          to="/landing-page"
          className="text-primary hover:text-secondary flex items-center transition-all duration-300 hover:translate-x-[-4px]"
        >
          <FaArrowLeft className="mr-2" />
          <span>Back</span>
        </Link>
      </div>

      {/* Page title */}
      <div className="bg-white border-b shadow-sm mb-6 px-6 py-4">
        <h1 className="text-3xl font-bold text-secondary text-left">{title}</h1>
      </div>

      {/* Restaurant listings */}
      <div className="max-w-5xl mx-auto px-6 pb-12">
        {loading ? (
          <div className="bg-white p-12 rounded-lg shadow-md">
            <p className="text-center text-lg text-gray-600">
              Loading restaurants...
            </p>
          </div>
        ) : restaurants.length === 0 ? (
          <div className="bg-white p-12 rounded-lg shadow-md">
            <p className="text-center text-lg text-red-500">
              No restaurants found in this category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

// src/pages/RestaurantDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import restaurantApi from "../../api/restaurantApi.js";
import ItemCategorySection from "../../components/restaurant/ItemCategorySection";
import { FaArrowLeft } from "react-icons/fa";

const RestaurantDetailPage = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    const getRestaurant = async () => {
      try {
        const res = await restaurantApi.get(`/restaurants/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setRestaurant(res.data);
      } catch (error) {
        console.error("Failed to fetch restaurant:", error);
      }
    };

    getRestaurant();
  }, [id]);

  if (!restaurant) {
    return <p>Loading or not found...</p>;
  }

  return (
    <div className="w-full bg-lightgray min-h-screen">
      {/* Breadcrumb */}
      <div className="flex justify-between items-center px-6 py-4 bg-white shadow-sm">
        <div className="text-gray-600 font-medium flex items-center">
          <Link
            to="/landing-page"
            className="hover:text-primary transition-colors"
          >
            Restaurants
          </Link>
          <span className="mx-2 text-gray-400">›</span>
          <span className="text-primary font-semibold">
            {restaurant.restaurantName}
          </span>
        </div>
        <Link
          to="/landing-page"
          className="text-primary hover:text-secondary flex items-center transition-all duration-300 hover:-translate-x-1"
        >
          <FaArrowLeft className="mr-2" />
          <span>Back</span>
        </Link>
      </div>

      {/* Page title */}
      <div className="bg-white border-b shadow-sm mb-6 px-6 py-4">
        <h1 className="text-3xl font-bold text-secondary text-left">
          {restaurant.restaurantName}
        </h1>
      </div>

      {/* Tabbed category view */}
      <ItemCategorySection restaurantId={id} />
    </div>
  );
};

export default RestaurantDetailPage;

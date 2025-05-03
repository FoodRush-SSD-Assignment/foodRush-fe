import React from "react";
import orderApi from "../../api/orderApi.js";
import { showError, showSuccess } from "../../utils/alertService";

const ItemCard = ({ item }) => {
  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await orderApi.post(
        "/order-service/cart/addToCart",
        { itemIds: [item._id] },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Cart updated:", response.data);
      showSuccess(`Added ${item.itemName} to cart`);
    } catch (error) {
      console.error(
        "Error adding to cart:",
        error.response?.data || error.message
      );
      const errorMessage =
        error.response?.data?.message || "Failed to add item to cart";
      showError(errorMessage);
    }
  };

  return (
    <div className="bg-lightgray rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 w-64 flex flex-col">
      {/* Image Section with gradient overlay */}
      <div className="relative w-full h-48">
        {item.imageUrl ? (
          <>
            <img
              src={item.imageUrl}
              alt={item.itemName}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent h-16 opacity-40"></div>
          </>
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* Show Add button only if item is available */}
        {item.isAvailable && (
          <button
            onClick={handleAddToCart}
            className="absolute bottom-3 right-3 bg-white text-primary w-10 h-10 flex items-center justify-center rounded-full shadow-md hover:bg-primary hover:text-white transition-all duration-200"
            title="Add to cart"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </button>
        )}

        {/* Category badge */}
        {item.itemCategory && (
          <span className="absolute top-3 left-3 px-2 py-1 bg-black bg-opacity-60 text-white text-xs font-medium rounded-full">
            {item.itemCategory}
          </span>
        )}
      </div>

      {/* Content Section below the image */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-bold text-secondary">{item.itemName}</h2>
          <p className="text-base font-bold text-primary">
            LKR {parseFloat(item.itemPrice).toFixed(2)}
          </p>
        </div>
        {/* Description */}
        <p className="text-sm text-secondary/70 mt-2 line-clamp-2">
          {item.itemDescription}
        </p>

        {/* Availability with dot indicator */}
        <div className="flex justify-between items-center">
          <span
            className={`flex items-center ${
              item.isAvailable ? "text-green-600" : "text-red-600"
            }`}
          >
            <span
              className={`inline-block w-2 h-2 rounded-full mr-1 ${
                item.isAvailable ? "bg-green-600" : "bg-red-600"
              }`}
            ></span>
            <span className="text-sm font-medium">
              {item.isAvailable ? "Available" : "Not Available"}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;

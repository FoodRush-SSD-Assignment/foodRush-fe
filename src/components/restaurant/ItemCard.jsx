// src/components/restaurant/MenuItemCard.jsx
import React from 'react';
import orderApi from '../../api/orderApi';

const ItemCard = ({ item }) => {
  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await orderApi.post("/order-service/cart/addToCart",
        { itemIds: [item._id] },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Cart updated:", response.data);
      alert(`Added ${item.itemName} to cart`);
    } catch (error) {
      console.error("Error adding to cart:", error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || "Failed to add item to cart";
      alert(errorMessage);
    }
  }

  return (
    <div className="bg-lightgray rounded-2xl border border-darkgrey shadow-sm w-full p-6 flex flex-col justify-between min-h-[200px]">
      <div>
        <h2 className="text-xl font-bold text-secondary mb-2">{item.itemName}</h2>
        <p className="text-sm text-secondary/70 mb-4">{item.itemDescription}</p>
        <p className="text-lg font-bold text-secondary mb-4">Rs. {item.itemPrice.toFixed(2)}</p>
      </div>
      <div className="flex justify-end mt-auto">
        <button
          onClick={handleAddToCart}
          className="bg-primary hover:bg-primary/90 text-white text-sm font-medium px-3 py-1.5 rounded-md transition-colors duration-200"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ItemCard;

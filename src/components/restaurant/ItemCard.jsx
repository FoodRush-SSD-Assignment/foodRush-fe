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
    <div className="bg-lightgray rounded-2xl border border-darkgrey shadow-sm w-[500px] p-6 flex justify-between items-center">
      
      {/* Left Section */}
      <div className="flex-1 pr-3">
        <h2 className="text-lg font-bold text-secondary mb-1">{item.itemName}</h2>
        <p className="text-base font-semibold text-secondary mb-1">
          LKR {item.itemPrice.toFixed(2)}
        </p>
        <p className="text-sm text-secondary/70 mb-2">{item.itemDescription}</p> 
      </div>

      {/* Right Section */}
      <div className="relative w-24 h-24 flex-shrink-0">
        <img
          src={item.imageUrl}
          alt={item.itemName}
          className="w-full h-full object-cover rounded-xl"
        />
        <button
          onClick={handleAddToCart}
          className="absolute bottom-1 right-1 bg-primary text-white w-7 h-7 flex items-center justify-center rounded-full shadow hover:bg-primary/90 transition"
        >
          +
        </button>
      </div>

    </div>
  );
};

export default ItemCard;

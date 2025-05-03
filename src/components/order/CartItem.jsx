import { useState } from "react";
import { FaPlus, FaMinus, FaTrashAlt } from "react-icons/fa";
import orderApi from "../../api/orderApi.js";

const CartItem = ({ item, onUpdateCart, onDeleteItem }) => {
  const [quantity, setQuantity] = useState(item.quantity);

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 0) return; // Prevent negative quantities

    try {
      const response = await orderApi.put(
        "/order-service/cart/updateItemQuantity",
        {
          itemName: item.name,
          quantity: newQuantity,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setQuantity(newQuantity);
      onUpdateCart(response.data.cart);
    } catch (err) {
      console.error("Failed to update quantity:", err);
    }
  };

  const handleIncrease = () => {
    handleQuantityChange(quantity + 1);
  };

  const handleDecrease = () => {
    handleQuantityChange(quantity - 1);
  };

  const handleDelete = async () => {
    try {
      const response = await orderApi.delete("/order-service/cart/deleteItem", {
        data: {
          itemName: item.name,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      onDeleteItem(response.data.cart);
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-100 transition">
      {/* Item details */}
      <div className="flex-1 max-w-[500px]">
        <div className="font-semibold">{item.name}</div>
        <div className="text-gray-500 text-sm">{item.description}</div>
      </div>

      {/* Quantity controls */}
      <div className="flex items-center gap-2 w-32 justify-center">
        <button
          onClick={handleIncrease}
          className="bg-primary text-white w-8 h-8 rounded-md flex items-center justify-center"
        >
          <FaPlus size={14} />
        </button>
        <span>{quantity}</span>
        <button
          onClick={handleDecrease}
          className="bg-primary text-white w-8 h-8 rounded-md flex items-center justify-center"
        >
          <FaMinus size={14} />
        </button>
      </div>

      {/* Price */}
      <div className="w-32 text-center font-semibold">
        Rs. {item.price.toFixed(2)}
      </div>

      {/* Delete button */}
      <div className="w-16 text-center">
        <button className="text-red-500" onClick={handleDelete}>
          <FaTrashAlt />
        </button>
      </div>
    </div>
  );
};

export default CartItem;

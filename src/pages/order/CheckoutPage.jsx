import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import NavBar from "../../components/NavBar";
import orderApi from "../../api/orderApi";
import OrderSummary from "../../components/order/OrderSummary";
import OrderDetailConfirm from "../../components/order/OrderDetailConfirm";

const CheckoutPage = () => {
  const { orderId } = useParams();
  const [cartItems, setCartItems] = useState([]);
  const [restaurantName, setRestaurantName] = useState("");

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await orderApi.get("/order-service/cart/getCart", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setCartItems(res.data.items || []);
        setRestaurantName(res.data.restaurantName || "");
      } catch (err) {
        console.error("Failed to fetch cart:", err);
      }
    };
    fetchCart();
  }, []);

  return (
    <div className="w-full">
      <NavBar />

      <div className="flex justify-between items-center px-4 py-2 border-b">
        <div className="text-gray-500">
          <span>My Cart</span>
          <span className="mx-2">›</span>
          <span className="text-primary">Checkout</span>
        </div>
        <Link to="/cart" className="text-primary flex items-center">
          <FaArrowLeft className="mr-1" />
          <span>Back</span>
        </Link>
      </div>

      <div className="p-6" style={{ maxWidth: "1500px", margin: "0 auto" }}>
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>

        {/* Cart Summary Section */}
        <OrderSummary cartItems={cartItems} restaurantName={restaurantName} />

        {/* Order Details Section */}
        {orderId && (
          <div className="mb-8">
            <OrderDetailConfirm orderId={orderId} />
          </div>
        )}

<div className="flex justify-between mt-6">
        <Link
          to="/cart"
          className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg"
        >
          Cancel
        </Link>
        <button
          className="bg-primary text-white px-6 py-2 rounded-lg"
        >
          Pay Now
        </button>
      </div>

        
      </div>
    </div>
  );
};

export default CheckoutPage;

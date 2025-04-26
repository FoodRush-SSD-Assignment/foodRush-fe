import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import NavBar from "../../components/NavBar";
import CartItem from "../../components/order/CartItem";
import orderApi from "../../api/orderApi";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [restaurantName, setRestaurantName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await orderApi.get("/order-service/cart/getCart", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Use the token
          },
        });
        setCartItems(res.data.items || []);
        setRestaurantName(res.data.restaurantName || "");
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch cart:", err);
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const updateCart = (updatedCart) => {
    setCartItems(updatedCart.items);
  };

  const deleteItem = (updatedCart) => {
    setCartItems(updatedCart.items);
  };

  return (
    <div className="w-full">
      <NavBar />

      {/* Breadcrumb navigation */}
      <div className="flex justify-between items-center px-4 py-2 border-b">
        <div className="text-gray-500">
          <span>My Cart</span>
          <span className="mx-2">›</span>
        </div>
        <Link to="/" className="text-primary flex items-center">
          <FaArrowLeft className="mr-1" />
          <span>Back</span>
        </Link>
      </div>

      {/* Cart Section */}
      <div className="p-6" style={{ maxWidth: "1600px", margin: "0 auto" }}>
        <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

        {loading ? (
          <p>Loading...</p>
        ) : cartItems.length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          <>
            <div className="text-lg font-semibold mb-4">
              {restaurantName || "Restaurant"}
            </div>

            {/* Cart Items List */}
            <div className="flex flex-col gap-4">
              {cartItems.map((item, idx) => (
                <CartItem key={idx} item={item} onUpdateCart={updateCart} onDeleteItem={deleteItem}/>
              ))}
            </div>

            {/* Total Price */}
            <div className="flex justify-end mt-6 text-lg font-semibold">
              Total Price:{" "}
              <span className="ml-2">Rs. {totalPrice.toFixed(2)}</span>
            </div>

            {/* Checkout Button */}
            <div className="flex justify-end mt-4">
              <button className="bg-primary text-white px-6 py-2 rounded-lg">
                Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;

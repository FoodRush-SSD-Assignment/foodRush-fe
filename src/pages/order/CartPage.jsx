import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
// import NavBar from "../../components/NavBar";
import CartItem from "../../components/order/CartItem";
import orderApi from "../../api/orderApi";
import CheckoutDetailsForm from "../../components/order/CheckoutDetailsForm";
import { showError } from "../../utils/alertService";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [restaurantName, setRestaurantName] = useState("");
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    contactNumber: "",
    deliveryAddress: "",
    paymentMethod: "card",
  });
  const navigate = useNavigate();
  const [cartId, setCartId] = useState("");

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await orderApi.get("/order-service/cart/getCart", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setCartItems(res.data.items || []);
        setRestaurantName(res.data.restaurantName || "");
        setCartId(res.data._id || "");
        setFormData((prev) => ({
          ...prev,
          name: `${res.data.customerName || ""}`,
        }));
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    try {
      const orderData = {
        deliveryAddress: formData.deliveryAddress,
        paymentMethod: formData.paymentMethod,
        customerMobileNo: formData.contactNumber,
      };

      const res = await orderApi.post(
        "/order-service/order/placeOrder",
        orderData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      const createdOrderId = res.data.order.orderId;
      showSuccess("Order placed successfully!");
      navigate(`/checkout/${createdOrderId}`);
    } catch (err) {
      console.error("Failed to place order:", err);
      showError("Failed to place order. Try again.");
    }
  };

  return (
    <div className="w-full">
      {/* <NavBar /> */}

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
      <div className="p-6" style={{ maxWidth: "1500px", margin: "0 auto" }}>
        <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

        {loading ? (
          <p>Loading...</p>
        ) : cartItems.length === 0 ? (
          <p className="text-gray-500">Your cart is empty.</p>
        ) : (
          <>
            <div className="border rounded-lg p-6 mb-6">
              <div className="text-lg font-semibold mb-4">
                {restaurantName || "Restaurant"}
              </div>

              {/* Cart Items List */}
              <div className="flex flex-col gap-4">
                {cartItems.map((item, idx) => (
                  <CartItem
                    key={idx}
                    item={item}
                    onUpdateCart={updateCart}
                    onDeleteItem={deleteItem}
                  />
                ))}
              </div>

              {/* Total Price */}
              <div className="flex justify-end mt-6 text-lg font-semibold">
                Total Price:{" "}
                <span className="ml-2">Rs. {totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="items-end">
              <button
                onClick={() => navigate(`/checkout/${cartId}`)}
                className="bg-primary  text-white px-6 py-2 rounded-md"
              >
                Checkout
              </button>
            </div>

            {/* <CheckoutDetailsForm
              formData={formData}
              handleChange={handleChange}
              handlePlaceOrder={handlePlaceOrder}
            /> */}
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;

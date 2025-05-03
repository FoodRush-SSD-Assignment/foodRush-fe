import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import orderApi from "../../api/orderApi.js";
import OrderSummary from "../../components/order/OrderSummary";
import CheckoutDetailsForm from "../../components/order/CheckoutDetailsForm";
import authApi from "../../api/authApi.js";
import StripeCheckoutButton from "../../components/StripeCheckoutButton";
import { showSuccess, showError } from "../../utils/alertService";

const CheckoutPage = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [cartItems, setCartItems] = useState([{ currency: "lkr" }]);
  const [restaurantName, setRestaurantName] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobileNo: "",
    address: "",
    paymentMethod: "card",
  });
  const navigate = useNavigate();

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const taxAmount = cartItems.reduce(
    (total, item) => total + item.quantity * 2,
    0
  );
  const deliveryFee = 250.0;
  const totalAmount = totalPrice + taxAmount + deliveryFee;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // const handleCardPayment = () => {
  //   console.log("Processing Card Payment...");

  // };

  // const handleCashOrder = () => {
  //   console.log("Processing Cash Order...");
  // };

  const handlePlaceOrder = async () => {
    try {
      // Prepare the order data using the fetched cart and user profile data
      const orderData = {
        orderId: `OR${Math.floor(Math.random() * 1000000)}`, // Generate a random order ID or use another method for this
        customerId: formData._id, // Use the customer ID from the fetched user profile
        customerName: `${formData.firstName} ${formData.lastName}`, // Combine first name and last name
        customerMobileNo: formData.mobileNo, // Mobile number from user profile
        restaurantId: cartItems[0]?.restaurantId, // Assuming the restaurantId is the same for all items
        restaurantName: cartItems[0]?.restaurantName, // Assuming the restaurantName is the same for all items
        restaurantLocation: cartItems[0]?.restaurantLocation, // Assuming restaurant location is available
        deliveryAddress: formData.address, // Delivery address from the user profile
        items: cartItems.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        totalPrice: totalAmount, // Total price computed previously
        totalAmount: totalAmount, // Total amount including tax and delivery fee
        paymentStatus: "pending", // Payment status initially set to "pending"
        paymentMethod: formData.paymentMethod, // Payment method selected by the user
        status: "pending", // Initial status set to "pending"
        isHiddenTrue: false, // Set to false initially
      };

      // Send the order data to the backend
      const res = await orderApi.post(
        "/order-service/order/placeOrder",
        orderData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      const createdOrderId = res.data.order.orderId;
      showSuccess("Order placed successfully!");
      navigate(`/success/${createdOrderId}`);
    } catch (err) {
      console.error("Failed to place order:", err);
      showError("Failed to place order. Try again.");
    }
  };

  const handlePlaceStripeOrder = async () => {
    try {
      const orderData = {
        orderId: `OR${Math.floor(Math.random() * 1000000)}`,
        customerId: formData._id,
        customerName: `${formData.firstName} ${formData.lastName}`,
        customerMobileNo: formData.mobileNo,
        restaurantId: cartItems[0]?.restaurantId,
        restaurantName: cartItems[0]?.restaurantName,
        restaurantLocation: cartItems[0]?.restaurantLocation,
        deliveryAddress: formData.address,
        items: cartItems.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        totalPrice: totalAmount,
        paymentStatus: "pending",
        paymentMethod: formData.paymentMethod,
        status: "pending",
        isHiddenTrue: false,
      };

      const res = await orderApi.post(
        "/order-service/order/placeOrder",
        orderData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      const createdOrderId = res.data.order.orderId;
      return createdOrderId; // return order id if success
    } catch (err) {
      console.error("Failed to place order:", err);
      return null; // return null if fail
    }
  };

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

    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const userString = localStorage.getItem("user");
        const user = userString ? JSON.parse(userString) : null;
        const userID = user?.id;

        if (!userID) {
          console.error("User ID not found.");
          return;
        }

        const res = await authApi.get(`/auth/getuser/${userID}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setFormData((prev) => ({
          ...prev,
          firstName: res.data.firstname || "",
          lastName: res.data.lastname || "",
          mobileNo: res.data.mobileno || "",
          address: res.data.address || "",
        }));
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      }
    };

    fetchCart();
    fetchUserProfile();
  }, []);

  return (
    <div className="w-full">
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

        <OrderSummary
          cartItems={cartItems}
          restaurantName={restaurantName}
          totalAmount={totalAmount}
        />
        <CheckoutDetailsForm
          formData={formData}
          handleChange={handleChange}
          totalAmount={totalAmount}
          handleEditClick={() => setIsEditModalOpen(true)}
        />

        <div className="flex justify-between mt-6">
          <Link
            to="/cart"
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg"
          >
            Cancel
          </Link>

          {/* Conditionally Render Button */}
          {formData.paymentMethod === "cash" ? (
            <button
              onClick={handlePlaceOrder}
              className="bg-green-600 text-white px-6 py-2 rounded-lg"
              disabled={totalAmount > 3000}
            >
              {totalAmount > 3000 ? "Cash Not Allowed" : "Confirm Order"}
            </button>
          ) : (
            <StripeCheckoutButton
              cartItems={cartItems}
              totalAmount={totalAmount}
              taxAmount={taxAmount}
              deliveryFee={deliveryFee}
              handlePlaceOrderBeforeStripe={handlePlaceStripeOrder}
            />
          )}
        </div>
      </div>

      {/* MODAL SHOULD BE INSIDE RETURN */}
      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-xl font-bold mb-4">Edit Delivery Details</h2>

            <div className="mb-4">
              <label className="block mb-1 text-gray-700">Mobile Number</label>
              <input
                type="text"
                name="mobileNo"
                value={formData.mobileNo}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg"
              />
            </div>

            <div className="mb-4">
              <label className="block mb-1 text-gray-700">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded-lg"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="bg-primary text-white px-4 py-2 rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;

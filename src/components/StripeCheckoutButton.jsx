import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { showError } from "../utils/alertService";

// Load Stripe outside the component to avoid reloading on every render
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const StripeCheckoutButton = ({
  cartItems,
  totalAmount,
  handlePlaceOrderBeforeStripe,
}) => {
  const handleClick = async () => {
    try {
      const orderId = await handlePlaceOrderBeforeStripe(); // ✅ First place the order

      if (!orderId) {
        showError("Failed to create order. Try again.");
        return;
      }

      // Store the orderId temporarily
      localStorage.setItem("latestOrderId", orderId);

      const stripe = await stripePromise;

      const response = await axios.post(
        `${
          import.meta.env.VITE_ORDER_SERVICE_URL
        }/order-service/stripe/create-checkout-session`,
        { items: cartItems, orderId: orderId }
      );

      const sessionId = response?.data?.id;

      if (!sessionId) {
        showError("Unable to create Stripe session. Try again.");
        return;
      }

      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error("Stripe Checkout error:", error);
      showError("An error occurred during checkout. Please try again.");
    }
  };

  return (
    <button
      onClick={handleClick}
      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
    >
      Pay with Stripe
    </button>
  );
};

export default StripeCheckoutButton;

import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

// Load Stripe outside the component to avoid reloading on every render
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const StripeCheckoutButton = () => {
  const cartItems = [
    {
      name: "Burger",
      price: 10,
      quantity: 2,
    },
    {
      name: "Fries",
      price: 5,
      quantity: 1,
    },
  ];

  const handleClick = async () => {
    try {
      const stripe = await stripePromise;

      const response = await axios.post(
        `${
          import.meta.env.VITE_ORDER_SERVICE_URL
        }/order-service/stripe/create-checkout-session`,
        { items: cartItems }
      );

      const sessionId = response?.data?.id;

      if (!sessionId) {
        alert("Unable to create a Stripe session. Try again.");
        return;
      }

      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error("Stripe Checkout error:", error);
      alert("An error occurred during checkout. Please try again.");
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

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import orderApi from "../../api/orderApi";

const SuccessPage = () => {
  const { orderId: orderIdFromParams } = useParams(); // get orderId from URL
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      // Prefer URL param, otherwise fallback to localStorage
      const orderId =
        orderIdFromParams || localStorage.getItem("latestOrderId");

      if (!orderId) {
        console.error("No orderId found in URL or localStorage.");
        return;
      }

      try {
        const res = await orderApi.get(
          `/order-service/order/my-orders/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setOrderDetails(res.data);

        // Optional: clear localStorage after fetching
        if (!orderIdFromParams) localStorage.removeItem("latestOrderId");
      } catch (err) {
        console.error("Failed to fetch order details:", err);
      }
    };

    fetchOrder();
  }, [orderIdFromParams]); // rerun if URL orderId changes

  if (!orderDetails) {
    return <div>Loading order details...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Payment Successful!</h1>
      <p>Order ID: {orderDetails.orderId}</p>
      <p>Restaurant: {orderDetails.restaurantName}</p>
      <p>Total Paid: LKR {orderDetails.totalPrice.toFixed(2)}</p>
      {/* Render other order info as you like */}
    </div>
  );
};

export default SuccessPage;

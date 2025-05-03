import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import orderApi from "../../api/orderApi.js";
import { FaCheckCircle } from "react-icons/fa";

const StripeSuccessPage = () => {
  const { orderId: orderIdFromParams } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleSuccessFlow = async () => {
      const orderId =
        orderIdFromParams || localStorage.getItem("latestOrderId");

      if (!orderId) {
        setError("No order ID found.");
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("User not authenticated.");
          setLoading(false);
          return;
        }

        // Step 1: Update payment status to 'Paid'
        await orderApi.put(
          `/order-service/order/updateOrderAfterCheckout/${orderId}`,
          {
            paymentStatus: "paid",
            status: "confirmed",
            paymentCompletedAt: new Date(),
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Step 2: Fetch updated order details
        const res = await orderApi.get(
          `/order-service/order/my-orders/${orderId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOrderDetails(res.data);

        if (!orderIdFromParams) {
          localStorage.removeItem("latestOrderId");
        }
      } catch (err) {
        console.error(err);
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    handleSuccessFlow();
  }, [orderIdFromParams]);

  if (loading) {
    return <div className="p-6">Updating your payment status...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  if (!orderDetails) {
    return <div className="p-6">No order details found.</div>;
  }

  const formattedDate = orderDetails?.createdAt
    ? new Date(orderDetails.createdAt).toLocaleString()
    : "";

  return (
    <div className="pt-4 pb-12 min-h-screen bg-white">
      <div className="flex px-8 justify-between items-center">
        <h3 className="text-secondary text-xl mb-4">Your Order</h3>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-primary hover:text-secondary transition-all"
        >
          &larr; Back
        </button>
      </div>
      <div className="max-w-screen-xl mx-auto">
        {/* Success Header */}
        <div className="bg-white rounded-lg overflow-hidden mb-4">
          <div className="bg-white p-6 flex flex-col items-center justify-center border-b">
            <FaCheckCircle size={80} className="text-green-500 mb-4" />
            <h1 className="text-2xl font-bold text-secondary text-center">
              Payment Successful!
            </h1>
            <p className="text-gray-500 mt-2">
              Your order has been placed successfully
            </p>
          </div>

          <div className="p-6">
            {/* Order Summary Card */}
            <div className="bg-lightgray p-4 rounded-lg mb-6">
              <h2 className="text-lg font-medium text-primary mb-3">
                Order Summary
              </h2>
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">Order ID:</span>
                <span className="font-medium">{orderDetails.orderId}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">Date:</span>
                <span>{formattedDate}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">Status:</span>
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                  {orderDetails.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payment Method:</span>
                <span className="capitalize">{orderDetails.paymentMethod}</span>
              </div>
            </div>

            {/* Restaurant Info */}
            <div className="mb-6">
              <h2 className="text-lg font-medium text-primary mb-3">
                Restaurant
              </h2>
              <div className="bg-lightgray p-4 rounded-lg">
                <div className="font-medium">{orderDetails.restaurantName}</div>
                <div className="text-gray-500 text-sm">
                  {orderDetails.restaurantLocation}
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="mb-6">
              <h2 className="text-lg font-medium text-primary mb-3">
                Delivery Details
              </h2>
              <div className="bg-lightgray p-4 rounded-lg">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <div className="text-gray-500 text-sm">Contact</div>
                    <div>{orderDetails.customerMobileNo}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-sm">Address</div>
                    <div>{orderDetails.deliveryAddress}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Summary */}
            <div>
              <h2 className="text-lg font-medium text-primary mb-3">Amount</h2>
              <div className="bg-lightgray p-4 rounded-lg">
                <div className="flex justify-between items-center font-medium">
                  <span>Total Paid:</span>
                  <span className="text-xl">
                    {typeof orderDetails.totalAmount === "number"
                      ? `LKR ${orderDetails.totalAmount.toFixed(2)}`
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => navigate("/myorders")}
                className="px-8 py-3 bg-primary text-white rounded-full hover:opacity-90 hover:scale-105 transition-all shadow-md"
              >
                Track Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StripeSuccessPage;

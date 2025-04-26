import { useEffect, useState } from "react";
import orderApi from "../../api/orderApi";

const OrderDetailConfirm = ({ orderId }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await orderApi.get(`/order-service/order/my-orders/${orderId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setOrder(response.data);
      } catch (err) {
        console.error("Failed to fetch order:", err);
        setError("Failed to load order details.");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="border rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Order Confirmation</h2>

      <div className="space-y-2">
        <div>
          <span className="font-semibold">Order ID:</span> {order.orderId}
        </div>
        <div>
          <span className="font-semibold">Delivery Address:</span>
          <div className="ml-4">
            <p>Street: {order.deliveryAddress.street}</p>
            <p>City: {order.deliveryAddress.city}</p>
            <p>Province: {order.deliveryAddress.province}</p>
            <p>Postal Code: {order.deliveryAddress.postalCode}</p>
          </div>
        </div>
        <div>
          <span className="font-semibold">Payment Method:</span> {order.paymentMethod}
        </div>
        <div>
          <span className="font-semibold">Customer Mobile No:</span> {order.customerMobileNo}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailConfirm;

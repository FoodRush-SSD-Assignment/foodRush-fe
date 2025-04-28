import React, { useEffect, useState } from "react";
import Modal from "../../components/order/Modal";
import orderApi from "../../api/orderApi";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import StatusBadge from "../../components/order/StatusBadge";

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  const fetchOrderHistory = async () => {
    try {
      const res = await orderApi.get("/order-service/order/order-history", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setOrders(res.data);
    } catch (error) {
      console.error("Error fetching order history:", error);
    }
  };

  const openOrderDetails = async (orderId) => {
    try {
      const res = await orderApi.get(`/order-service/order/my-orders/${orderId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setSelectedOrder(res.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const toggleOrderVisibility = async (orderId, isHidden) => {
    try {
      await orderApi.patch(
        `/order-service/order/${isHidden ? "unhide" : "hide"}/${orderId}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setOrders((prevState) =>
        prevState.map((order) =>
          order.orderId === orderId ? { ...order, isHidden: !isHidden } : order
        )
      );
      window.alert(isHidden ? "Unhid the order." : "Hid the order.");
      fetchOrderHistory();
    } catch (err) {
      console.error("Error toggling order visibility:", err.message);
    }
  };

  return (
    <div>
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-5">Order History</h2>

            {orders.length === 0 ? (
            <p>No orders found in history.</p>
            ) : (
            <div className="grid gap-4">
                {orders.map((order) => (
                <div
                    key={order._id}
                    className="border p-4 rounded-lg hover:shadow-md cursor-pointer"
                    onClick={() => openOrderDetails(order.orderId)}
                >
                    <div className="flex justify-between items-center">
                    {/* First Column */}
                    <div className="flex flex-col">
                        <h3 className="font-semibold">Order ID: {order.orderId}</h3>
                        <p className="text-sm text-gray-600">
                        Restaurant: {order.restaurantName}
                        </p>
                        <div>
                        <hr />
                        <p className="text-sm font-semibold text-gray-600">Items:</p>
                        <ul className="text-sm text-gray-600">
                            {order.items.map((item, index) => (
                            <li key={index}>
                                {item.name} (x{item.quantity})
                            </li>
                            ))}
                        </ul>
                        </div>
                    </div>

                    {/* Second Column */}
                    <div className="flex flex-col items-center">
                        <label className="font-semibold mb-2">Order Status</label>
                        <StatusBadge status={order.status} />
                    </div>

                    <div className="flex items-center gap-60">
                        {/* Price */}
                        <div className="flex flex-col items-end">
                        <p className="text-lg font-bold">
                            Rs. {order.totalPrice.toFixed(2)}
                        </p>
                        </div>

                        {/* Toggle Hide/Unhide Button */}
                        <div>
                        <button
                            className="p-2 text-xl"
                            onClick={(e) => {
                            e.stopPropagation();
                            toggleOrderVisibility(order.orderId, order.isHidden);
                            }}
                        >
                            {order.isHidden ? <FaEyeSlash /> : <FaEye />}
                        </button>
                        </div>
                    </div>
                    </div>
                </div>
                ))}
            </div>
            )}
        </div>

        {isModalOpen && selectedOrder && (
            <Modal onClose={closeModal}>
            <div className="p-4">
                <h2 className="text-xl font-bold mb-4">Order Details</h2>

                <div className="flex space-x-8">
                {/* Left Column */}
                <div className="flex-1">
                    <p><strong>Order ID -</strong> {selectedOrder.orderId}</p>
                    <p><strong>Restaurant -</strong> {selectedOrder.restaurantName}</p>
                    <br />
                    <p><strong>Status -</strong> <StatusBadge status={selectedOrder.status} /></p>
                    <br />
                    <p><strong>Total Price -</strong> Rs. {selectedOrder.totalPrice.toFixed(2)}</p>

                    <h3 className="mt-4 font-semibold">Items</h3>
                    <ul className="list-disc ml-6">
                    {selectedOrder.items.map((item, index) => (
                        <li key={index}>
                        {item.name} - {item.quantity} x Rs. {item.price.toFixed(2)}
                        </li>
                    ))}
                    </ul>
                </div>

                {/* Right Column */}
                <div className="flex-1">
                    <h3 className="mt-4 font-semibold">Delivery Address</h3>
                    <p>
                    {selectedOrder.deliveryAddress.street},{" "}
                    {selectedOrder.deliveryAddress.city},{" "}
                    {selectedOrder.deliveryAddress.province}{" "}
                    {selectedOrder.deliveryAddress.postalCode}
                    </p>

                    <h3 className="mt-4 font-semibold">Payments</h3>
                    <p>Payment Method - {selectedOrder.paymentMethod}</p>
                    <p>Payment Status - {selectedOrder.paymentStatus}</p>
                </div>
                </div>
            </div>
            </Modal>
        )}
    </div>
  );
};

export default OrderHistoryPage;

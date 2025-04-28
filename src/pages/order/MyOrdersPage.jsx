import React, { useEffect, useState } from "react";
import orderApi from "../../api/orderApi";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import StatusBadge from "../../components/order/StatusBadge";
import Modal from "../../components/order/Modal";

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await orderApi.get("/order-service/order/my-orders", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setOrders(res.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
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
      const response = await orderApi.patch(
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
      console.log(response.data.message);
      fetchOrders();
    } catch (err) {
      console.error("Error toggling order visibility:", err.message);
    }
  };

  const cancelOrderByCustomer = async (orderId) => {
    try {
      const response = await orderApi.patch(
        `/order-service/order/cancel/${orderId}`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      window.alert("Order cancelled successfully.");
      fetchOrders(); // Refresh the orders after cancelling
      console.log(response.data.message);
    } catch (error) {
      console.error("Error cancelling order:", error.response?.data?.message || error.message);
      window.alert(error.response?.data?.message || "Failed to cancel order.");
    }
  };  

  return (
    <div>
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-5">My Orders</h2>

        {/* Ongoing Orders Section */}
        <h3 className="text-xl font-semibold mb-2">Ongoing Orders</h3>
        {orders.filter(
          (order) =>
            ![
              "delivered",
              "cancelled_by_customer",
              "cancelled_by_restaurant",
              "cancelled_by_delivery",
            ].includes(order.status)
        ).length === 0 ? (
          <p>No ongoing orders found.</p>
        ) : (
          <div className="grid gap-4">
            {orders
              .filter(
                (order) =>
                  ![
                    "delivered",
                    "cancelled_by_customer",
                    "cancelled_by_restaurant",
                    "cancelled_by_delivery",
                  ].includes(order.status)
              )
              .map((order) => (
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
                    <div className="flex flex-col items-center max-[500px]:text-center">
                      <label className="font-semibold mb-2">Order Status</label>
                      <StatusBadge status={order.status} />
                    </div>

                    <div className="flex items-center gap-40">
                      {/* Cancel Order Button */}
                      <button
                        className={`px-4 py-2 rounded ${
                          order.status === "pending" || order.status === "confirmed"
                            ? "bg-red-500 text-white hover:bg-red-600"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                        disabled={!(order.status === "pending" || order.status === "confirmed")}
                        onClick={(e) => {
                          e.stopPropagation(); // To prevent opening order details
                          if (order.status === "pending" || order.status === "confirmed") {
                            cancelOrderByCustomer(order.orderId);
                          }
                        }}
                      >
                        Cancel Order
                      </button>

                      {/* Price */}
                      <div className="flex flex-col items-end">
                        <p className="text-lg font-bold">
                          Rs. {order.totalPrice.toFixed(2)}
                        </p>
                      </div>

                      {/* Toggle Button */}
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

        {/* Completed Orders Section */}
        <h3 className="text-xl font-semibold mb-2 mt-8">Completed Orders</h3>
        {orders.filter(
          (order) =>
            [
              "delivered",
              "cancelled_by_customer",
              "cancelled_by_restaurant",
              "cancelled_by_delivery",
            ].includes(order.status)
        ).length === 0 ? (
          <p>No completed orders found.</p>
        ) : (
          <div className="grid gap-4">
            {orders
              .filter(
                (order) =>
                  [
                    "delivered",
                    "cancelled_by_customer",
                    "cancelled_by_restaurant",
                    "cancelled_by_delivery",
                  ].includes(order.status)
              )
              .map((order) => (
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

                      {/* Toggle Button */}
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
                  {selectedOrder.deliveryAddress}
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

export default MyOrdersPage;

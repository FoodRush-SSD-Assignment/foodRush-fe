import React, { useState, useEffect } from "react";
import {
  ArrowDownCircle,
  Check,
  X,
  Package,
  User,
  Store,
  ShoppingCart,
  CreditCard,
  Truck,
  Calendar,
} from "lucide-react";
import orderApi from "../../api/orderApi.js";
import restaurantApi from "../../api/restaurantApi.js";

function OrderCard({ order }) {
  const [status, setStatus] = useState(order?.status || "pending");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    title: "",
    message: "",
    type: "success",
  });

  if (!order) return null;

  useEffect(() => {
    if (alert.show) {
      const timer = setTimeout(() => {
        setAlert({ ...alert, show: false });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      // First update the order status
      const statusResponse = await orderApi.put(
        `/order-service/order/status/${order.orderId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (statusResponse.status === 200) {
        setStatus(newStatus);

        if (newStatus.includes("cancelled")) {
          try {
            const emailResponse = await restaurantApi.post(
              `/restaurants/send-order-cancellation-email`,
              {
                customerEmail: order.customerEmail,
                orderId: order.orderId,
                customerName: order.customerName || "Valued Customer",
                cancellationReason:
                  newStatus === "cancelled_by_restaurant"
                    ? "Cancelled by restaurant"
                    : "Cancelled by customer",
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (!emailResponse.data.success) {
              throw new Error(
                emailResponse.data.message || "Email sending failed"
              );
            }
          } catch (emailError) {
            console.error("Email sending failed:", emailError);
            setAlert({
              show: true,
              title: "Status Updated",
              message: `Order status updated, but email failed: ${emailError.message}`,
              type: "warning",
            });
            return;
          }
        }

        setAlert({
          show: true,
          title: "Status Updated",
          message: `Order status updated to "${newStatus}".`,
          type: "success",
        });
      } else {
        throw new Error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      setAlert({
        show: true,
        title: "Update Failed",
        message:
          error.response?.data?.message ||
          error.message ||
          "There was a problem updating the order status.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString();
  };

  // Status badge styling
  const getStatusBadgeClass = (statusValue) => {
    const statusMap = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      confirmed: "bg-blue-100 text-blue-800 border-blue-200",
      preparing: "bg-indigo-100 text-indigo-800 border-indigo-200",
      ready_for_pickup: "bg-purple-100 text-purple-800 border-purple-200",
      out_for_delivery: "bg-orange-100 text-orange-800 border-orange-200",
      delivered: "bg-green-100 text-green-800 border-green-200",
      cancelled_by_customer: "bg-red-100 text-red-800 border-red-200",
      cancelled_by_restaurant: "bg-red-100 text-red-800 border-red-200",
    };
    return (
      statusMap[statusValue] || "bg-gray-100 text-gray-800 border-gray-200"
    );
  };

  return (
    <div className="overflow-x-auto">
      {alert.show && (
        <div
          className={`${
            alert.type === "success"
              ? "bg-green-50 border-green-400"
              : "bg-red-50 border-red-400"
          } border-l-4 p-4 fixed top-4 right-4 z-50 shadow-lg rounded-md`}
        >
          <div className="flex">
            <div className="flex-shrink-0">
              {alert.type === "success" ? (
                <Check className="h-5 w-5 text-green-400" />
              ) : (
                <X className="h-5 w-5 text-red-400" />
              )}
            </div>
            <div className="ml-3">
              <h3
                className={`text-sm font-medium ${
                  alert.type === "success" ? "text-green-800" : "text-red-800"
                }`}
              >
                {alert.title}
              </h3>
              <div
                className={`mt-2 text-sm ${
                  alert.type === "success" ? "text-green-700" : "text-red-700"
                }`}
              >
                <p>{alert.message}</p>
              </div>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  onClick={() => setAlert({ ...alert, show: false })}
                  className={`inline-flex ${
                    alert.type === "success"
                      ? "bg-green-50 text-green-500 hover:bg-green-100 focus:ring-green-600"
                      : "bg-red-50 text-red-500 hover:bg-red-100 focus:ring-red-600"
                  } rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2`}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="border border-gray-200 rounded-lg shadow-md overflow-hidden mb-6">
        <div className="bg-white p-4 flex justify-between items-center border-b border-gray-200">
          <div className="flex items-center">
            <Package className="h-5 w-5 text-blue-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800">
              Order #{order.orderId}
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-600">Status:</span>
            <span
              className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(
                status
              )}`}
            >
              {status.charAt(0).toUpperCase() +
                status.slice(1).replace(/_/g, " ")}
            </span>
          </div>
        </div>

        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-gray-400" />
                  Customer
                </div>
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                <div className="flex items-center">
                  <Store className="h-4 w-4 mr-2 text-gray-400" />
                  Restaurant
                </div>
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                <div className="flex items-center">
                  <ShoppingCart className="h-4 w-4 mr-2 text-gray-400" />
                  Items
                </div>
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                <div className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-2 text-gray-400" />
                  Payment
                </div>
              </th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Actions
              </th>
              {order.deliveryPersonId && (
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  <div className="flex items-center">
                    <Truck className="h-4 w-4 mr-2 text-gray-400" />
                    Delivery Person
                  </div>
                </th>
              )}
              {order.estimatedDeliveryTime && (
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    Estimated Delivery
                  </div>
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              {/* Customer Info */}
              <td className="py-3 px-4">
                <div className="text-sm">
                  <p className="font-medium text-gray-900">
                    {order.customerName}
                  </p>
                  <p className="text-gray-600">{order.customerMobileNo}</p>
                  {order.deliveryAddress && (
                    <div className="mt-2 p-2 bg-gray-50 rounded-md text-xs text-gray-700">
                      <p className="font-medium mb-1">Delivery Address:</p>
                      <p>{order.deliveryAddress}</p>
                    </div>
                  )}
                </div>
              </td>

              {/* Restaurant Info */}
              <td className="py-3 px-4">
                <div className="text-sm">
                  <p className="font-medium text-gray-900">
                    {order.restaurantName}
                  </p>
                  <p className="text-gray-600">{order.restaurantLocation}</p>
                </div>
              </td>

              {/* Items */}
              <td className="py-3 px-4">
                <ul className="text-sm text-gray-700 space-y-2">
                  {order.items.map((item, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center border-b border-gray-100 pb-1 last:border-b-0 last:pb-0"
                    >
                      <span className="flex-1">
                        {item.name}{" "}
                        <span className="text-gray-500">x{item.quantity}</span>
                      </span>
                      <span className="font-medium">
                        Rs.{item.price * item.quantity}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-2 pt-2 border-t border-gray-100 text-right">
                  <span className="text-sm font-bold text-gray-900">
                    Total: Rs.{order.totalPrice}
                  </span>
                </div>
              </td>

              {/* Payment Details */}
              <td className="py-3 px-4">
                <div className="text-sm">
                  <div className="flex items-center mb-2">
                    <span className="text-gray-600 mr-2">Status:</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.paymentStatus === "Paid"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>
                  <p className="text-gray-700">
                    Method:{" "}
                    <span className="font-medium">{order.paymentMethod}</span>
                  </p>
                </div>
              </td>

              {/* Order Status */}
              <td className="py-3 px-4">
                <div className="flex flex-col">
                  <select
                    value={status}
                    onChange={handleStatusChange}
                    disabled={loading}
                    className="border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="ready_for_pickup">Ready for Pickup</option>
                    <option value="out_for_delivery">Out for Delivery</option>
                    <option value="cancelled_by_restaurant">
                      Cancelled by Restaurant
                    </option>
                  </select>
                  {loading && (
                    <div className="mt-2 flex items-center text-xs text-gray-500">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-3 w-3 text-blue-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Updating...
                    </div>
                  )}
                </div>
              </td>

              {/* Delivery Person Info */}
              {order.deliveryPersonId && (
                <td className="py-3 px-4">
                  <div className="text-sm font-medium text-gray-900">
                    {order.deliveryPersonName}
                  </div>
                </td>
              )}

              {/* Estimated Delivery Time */}
              {order.estimatedDeliveryTime && (
                <td className="py-3 px-4">
                  <div className="text-sm text-gray-700">
                    {formatDate(order.estimatedDeliveryTime)}
                  </div>
                </td>
              )}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrderCard;

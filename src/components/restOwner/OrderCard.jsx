import React, { useState } from 'react';
import { showSuccess } from '../../utils/alertService';

function OrderCard({ order }) {
  const [status, setStatus] = useState(order?.status || '');

  if (!order) return null;

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);

    showSuccess("Status Updated", `Order status has been updated to "${newStatus}".`);
  };

  return (
    <div className="bg-lightgray border border-darkgrey rounded-2xl p-6 mb-6 shadow-lg">
      <h2 className="text-2xl font-bold text-primary mb-4">Order ID: {order.orderId}</h2>

      {/* Customer Info */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-secondary mb-2">Customer</h3>
        <div className="text-secondary space-y-1">
          <p><strong>Name:</strong> {order.customerName}</p>
          <p><strong>Mobile:</strong> {order.customerMobileNo}</p>
        </div>
      </div>

      {/* Restaurant Info */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-secondary mb-2">Restaurant</h3>
        <div className="text-secondary space-y-1">
          <p><strong>Name:</strong> {order.restaurantName}</p>
          <p><strong>Location:</strong> {order.restaurantLocation}</p>
        </div>
      </div>

      {/* Items */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-secondary mb-2">Items</h3>
        <ul className="list-disc list-inside text-secondary space-y-1">
          {order.items.map((item, index) => (
            <li key={index}>
              {item.name} x {item.quantity} — Rs.{item.price * item.quantity}
            </li>
          ))}
        </ul>
      </div>

      {/* Delivery Address */}
      {order.deliveryAddress && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-secondary mb-2">Delivery Address</h3>
          <div className="text-secondary space-y-1">
            <p>{order.deliveryAddress.street}, {order.deliveryAddress.city}</p>
            <p>{order.deliveryAddress.province}, {order.deliveryAddress.postalCode}</p>
          </div>
        </div>
      )}

      {/* Payment Details */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-secondary mb-2">Payment Details</h3>
        <div className="text-secondary space-y-1">
          <p><strong>Status:</strong> {order.paymentStatus}</p>
          <p><strong>Method:</strong> {order.paymentMethod}</p>
          <p><strong>Total Price:</strong> Rs.{order.totalPrice}</p>
        </div>
      </div>

      {/* Order Status */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-secondary mb-2">Order Status</h3>
        <select 
          value={status} 
          onChange={handleStatusChange}
          className="border border-gray-400 rounded-md p-2 text-secondary"
        >
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="accepted">Accepted</option>
          <option value="ready_for_pickup">Ready for Pickup</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Delivery Person Info */}
      {order.deliveryPersonId && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-secondary mb-2">Delivery Person</h3>
          <div className="text-secondary">
            <p><strong>Name:</strong> {order.deliveryPersonName}</p>
          </div>
        </div>
      )}

      {/* Estimated Delivery Time */}
      {order.estimatedDeliveryTime && (
        <div className="mb-2 text-secondary">
          <p><strong>Estimated Delivery:</strong> {new Date(order.estimatedDeliveryTime).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
}

export default OrderCard;

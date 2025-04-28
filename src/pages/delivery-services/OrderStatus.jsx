import React, { useEffect, useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import orderApi from '../../api/orderApi'; // Adjust the path as needed
import { AuthContext } from '../../context/AuthContext';

const OrderStatus = () => {
 
  const location = useLocation();
  const { orderId } = location.state || {};
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  // Fetch order details using orderId
  useEffect(() => {
    if (!orderId) {
      setError('Order ID is missing');
      return;
    }

    setLoading(true);
    orderApi.get(`order-service/order/my-orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
        
    )
      .then(response => {
        setOrderDetails(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.response?.data?.error || 'Failed to fetch order details');
        setLoading(false);
      });
  }, [orderId]);

  return (
    <div>
      <h1>Order Status</h1>
      {loading && (
        <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow p-6">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="ml-4 text-gray-600">Loading order details...</p>
        </div>
      )}
      {error && (
        <div className="p-8 bg-red-50 border border-red-300 rounded-lg shadow text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Order Details</h3>
          <p className="text-red-700">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-300"
          >
            Retry
          </button>
        </div>
      )}
      {orderDetails && (
        <div className="p-4 bg-white shadow rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">Order Details</h3>
          <p className="text-gray-700">
            <span className="font-medium">Order ID:</span> {orderDetails.orderId}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Restaurant:</span> {orderDetails.restaurantName}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Customer:</span> {orderDetails.customerName || "Anonymous"}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Status:</span> {orderDetails.status}
          </p>
          {/* Add more details as needed */}
        </div>
      )}
    </div>
  );
};

export default OrderStatus;
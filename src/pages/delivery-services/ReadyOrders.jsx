import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import orderApi from '../../api/orderApi';
import MerchantNavbar from '../../components/navbar/merchantNavbar';

const ReadyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setError("No token found. Please login.");
        setLoading(false);
        return;
      }

      try {
        const response = await orderApi.get('order-service/order/driver/all-orders', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const toggleOrderDetails = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'ready_for_pickup':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'delivered':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAcceptOrder = (e, order) => {
    e.stopPropagation();
    
    // Store restaurant location and order info in localStorage for MapLocation component
    localStorage.setItem('restaurantLocation', order.restaurantLocation);
    localStorage.setItem('currentOrder', JSON.stringify({
      orderId: order.orderId,
      restaurantName: order.restaurantName,
      restaurantLocation: order.restaurantLocation,
      deliveryAddress: order.deliveryAddress,
      customerName: order.customerName,
      customerMobileNo: order.customerMobileNo
    }));
    
    // Navigate to MapLocation component
    navigate('/maplocation');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center p-4">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 w-full max-w-lg rounded shadow-md" role="alert">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-red-700 font-medium">Error</p>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
          <div className="mt-4">
            <button 
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-300"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
    <MerchantNavbar/>
    <div className="max-w-6xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Ready Orders</h1>
        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
          {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="mt-4 text-gray-600">No orders are currently available for pickup.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300">
              <div 
                className="p-4 cursor-pointer hover:bg-gray-50 flex justify-between items-center"
                onClick={() => toggleOrderDetails(order.orderId)}
                aria-expanded={expandedOrder === order.orderId}
                aria-controls={`order-details-${order.orderId}`}
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-800">{order.restaurantName}</h3>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getStatusBadgeClass(order.status)}`}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">Order ID: {order.orderId}</p>
                </div>
                <div className="flex items-center">
                  <span className="font-bold text-gray-800">${order.totalPrice.toFixed(2)}</span>
                  <svg 
                    className={`w-5 h-5 ml-2 text-gray-500 transition-transform duration-300 ${expandedOrder === order.orderId ? 'transform rotate-180' : ''}`} 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              
              {expandedOrder === order.orderId && (
                <div 
                  id={`order-details-${order.orderId}`}
                  className="border-t border-gray-200 p-4 bg-gray-50"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Customer Details</h4>
                      <p className="text-gray-700">{order.customerName || "Anonymous"}</p>
                      <p className="text-gray-700">{order.customerMobileNo}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Delivery Address</h4>
                      <p className="text-gray-700">{order.deliveryAddress?.street}</p>
                      <p className="text-gray-700">{order.deliveryAddress?.city}, {order.deliveryAddress?.postalCode}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Restaurant Location</h4>
                    <p className="text-gray-700">{order.restaurantLocation || "Location not specified"}</p>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Order Items</h4>
                    <ul className="divide-y divide-gray-200">
                      {order.items && order.items.map((item, index) => (
                        <li key={item._id || index} className="py-2 flex justify-between">
                          <div>
                            <span className="font-medium text-gray-800">{item.name}</span>
                            <span className="text-gray-600 ml-2">× {item.quantity}</span>
                          </div>
                          <span className="text-gray-800">${item.price.toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Payment Method</span>
                      <span className="text-gray-800 capitalize">{order.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-gray-600">Payment Status</span>
                      <span className={`capitalize ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                        {order.paymentStatus}
                      </span>
                    </div>
                    <div className="flex justify-between font-medium mt-2">
                      <span className="text-gray-700">Total</span>
                      <span className="text-gray-900">${order.totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="mt-4 text-xs text-gray-500 text-right">
                      Created: {formatDate(order.createdAt)}
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end space-x-3">
                    <button 
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors duration-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Logic for rejecting order
                      }}
                    >
                      Decline
                    </button>
                    <button 
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-300"
                      onClick={(e) => handleAcceptOrder(e, order)}
                    >
                      Accept Order
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
};

export default ReadyOrders;
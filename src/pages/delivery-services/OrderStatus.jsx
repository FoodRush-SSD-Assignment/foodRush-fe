import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import orderApi from '../../api/orderApi';
import MerchantNavbar from '../../components/navbar/merchantNavbar';

const OrderStatus = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId } = location.state || {};
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusTransition, setStatusTransition] = useState(false);
  const token = localStorage.getItem('token');

  // Simplified status steps - only 3 steps as requested
  const statusSteps = ['delivery_accepted', 'delivering', 'delivered'];

  // Handle status change
  const handleStatusChange = (newStatus) => {
    if (!orderDetails || !orderId) return;

    setLoading(true);
    // Animate status change first
    setStatusTransition(true);
    
    // API call to update order status
    orderApi.put(
      `order-service/order/status/${orderId}`,
      { status: newStatus },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then(response => {
        // Update local state with new order details
        setOrderDetails({...orderDetails, status: newStatus});
        setLoading(false);
      })
      .catch(err => {
        setError(err.response?.data?.error || 'Failed to update order status');
        setLoading(false);
      })
      .finally(() => {
        setTimeout(() => setStatusTransition(false), 600);
      });
  };

  // Handle order cancellation
  const handleCancelOrder = () => {
    if (!orderDetails || !orderId) return;

    setLoading(true);
    // Animate status change first
    setStatusTransition(true);
    
    // API call to cancel the order
    orderApi.put(
      `order-service/order/status/${orderId}`,
      { status: 'cancelled_by_delivery' },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then(response => {
        // Update local state with cancelled status
        setOrderDetails({...orderDetails, status: 'cancelled_by_delivery'});
        setLoading(false);
      })
      .catch(err => {
        setError(err.response?.data?.error || 'Failed to cancel order');
        setLoading(false);
      })
      .finally(() => {
        setTimeout(() => setStatusTransition(false), 600);
      });
  };

  // Navigate to ready orders page
  const goToReadyOrders = () => {
    navigate('/readyorders');
  };

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
    })
      .then(response => {
        setOrderDetails(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.response?.data?.error || 'Failed to fetch order details');
        setLoading(false);
      });
  }, [orderId, token]);

  // Get current step index for progress bar
  const getCurrentStepIndex = () => {
    if (!orderDetails || !orderDetails.status) return 0;
    const index = statusSteps.findIndex(step => step === orderDetails.status);
    return index >= 0 ? index : 0;
  };

  // Determine status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'delivery_accepted': return 'bg-orange-500';
      case 'delivering': return 'bg-indigo-500';
      case 'delivered': return 'bg-green-500';
      case 'cancelled_by_delivery': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  // Get next possible status
  const getNextStatus = () => {
    if (orderDetails?.status === 'cancelled_by_delivery') return null;
    
    const currentIndex = getCurrentStepIndex();
    return currentIndex < statusSteps.length - 1 ? statusSteps[currentIndex + 1] : null;
  };

  // Format date for better readability
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <>
    <MerchantNavbar/>

    <div className="max-w-lg mx-auto p-3">
      <h1 className="text-xl font-bold text-gray-800 mb-4 text-center">Order Status</h1>
      
      {loading && (
        <div className="flex justify-center items-center h-40 bg-white rounded-lg shadow p-4" role="alert" aria-live="polite">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="ml-3 text-gray-600 text-sm">Loading...</p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-300 rounded-lg shadow text-center" role="alert">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto text-red-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-base font-medium text-red-800 mb-1">Error Loading Order</h3>
          <p className="text-red-700 text-sm">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            aria-label="Retry loading order details"
          >
            Retry
          </button>
        </div>
      )}

      {orderDetails && (
        <div className={`transition-all duration-500 ease-in-out ${statusTransition ? 'scale-95 opacity-80' : 'scale-100 opacity-100'}`}>
          {/* Animated Order Progress */}
          <div className="mb-5 bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-base font-semibold text-gray-800 mb-3">Order Progress</h2>
            
            {/* Animated Delivery Image */}
            <div className="relative h-24 mb-2 overflow-hidden bg-gray-50 rounded">
              {/* Road */}
              <div className="absolute bottom-6 w-full h-2 bg-gray-300"></div>
              
              {/* Restaurant */}
              <div className="absolute left-2 bottom-8 w-12 h-12">
                <svg className="w-12 h-12 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 1a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 1zM5.05 3.05a.75.75 0 011.06 0l1.06 1.06a.75.75 0 01-1.06 1.06L5.05 4.11a.75.75 0 010-1.06zM10 4a6 6 0 100 12 6 6 0 000-12zm-7.94 7.94a.75.75 0 010-1.06l1.06-1.06a.75.75 0 111.06 1.06l-1.06 1.06a.75.75 0 01-1.06 0zm12.76-1.06a.75.75 0 111.06 1.06l-1.06 1.06a.75.75 0 11-1.06-1.06l1.06-1.06zM10 7a3 3 0 110 6 3 3 0 010-6z" clipRule="evenodd" />
                </svg>
                <span className="text-xs text-center block">Restaurant</span>
              </div>
              
              {/* Home/Destination */}
              <div className="absolute right-2 bottom-8 w-12 h-12">
                <svg className="w-12 h-12 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                <span className="text-xs text-center block">Home</span>
              </div>
              
              {/* Delivery Vehicle - position based on status */}
              <div 
                className="absolute bottom-7 transition-all duration-1000 ease-in-out" 
                style={{ 
                  left: orderDetails.status === 'cancelled_by_delivery' ? '50%' : `${Math.min(90, Math.max(10, (getCurrentStepIndex() / (statusSteps.length - 1)) * 80 + 10))}%`,
                  transform: 'translateX(-50%)'
                }}
              >
                {orderDetails.status === 'cancelled_by_delivery' ? (
                  // Cancelled icon
                  <div className="animate-bounce">
                    <svg className="w-10 h-10 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                ) : getCurrentStepIndex() === 0 ? (
                  // Package for delivery accepted
                  <div className="animate-bounce">
                    <svg className="w-10 h-10 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                      <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                ) : (
                  // Delivery car for later stages
                  <div className={getCurrentStepIndex() < statusSteps.length - 1 ? "animate-pulse" : ""}>
                    <svg className="w-10 h-10 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                      <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H11a1 1 0 001-1v-1h3.5a1 1 0 00.8-.4l2.5-3.33a1 1 0 00.2-.6V8a1 1 0 00-1-1h-3.8L11.35 4.4A1 1 0 0010.6 4H3z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
            
            {/* Status Steps */}
            <div className="flex justify-between mb-1">
              {statusSteps.map((step, index) => (
                <div 
                  key={step} 
                  className="flex flex-col items-center" 
                  style={{ width: `${100 / statusSteps.length}%` }}
                >
                  <div 
                    className={`rounded-full h-4 w-4 flex items-center justify-center mb-1 transition-all duration-500 ${
                      orderDetails.status === 'cancelled_by_delivery' 
                        ? 'bg-gray-300' 
                        : getCurrentStepIndex() >= index 
                          ? getStatusColor(statusSteps[index]) 
                          : 'bg-gray-300'
                    }`}
                  >
                    {!orderDetails.status === 'cancelled_by_delivery' && getCurrentStepIndex() > index && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    )}
                  </div>
                  <span className="text-xs text-center hidden md:block" aria-label={`${step.replace('_', ' ').toLowerCase()}`}>
                    {step.replace(/_/g, ' ')}
                  </span>
                  <span className="text-xs text-center block md:hidden" aria-hidden="true">
                    {step.charAt(0)}
                  </span>
                </div>
              ))}
            </div>
            
            {/* Current Status Indicator */}
            <div className="text-center mt-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(orderDetails.status)} text-white`}>
                {orderDetails.status?.replace(/_/g, ' ')}
              </span>
            </div>
          </div>

          {/* Order Details Card - Compact Version */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="border-b border-gray-200 bg-gray-50 px-4 py-2 flex justify-between items-center">
              <h3 className="text-base font-semibold text-gray-800">Order #{orderDetails.orderId}</h3>
              <span className="text-xs text-gray-500">{formatDate(orderDetails.orderDate)}</span>
            </div>

            <div className="p-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="font-medium text-gray-700 block">Restaurant:</span>
                  <span className="text-gray-800">{orderDetails.restaurantName}</span>
                </div>
                
                <div>
                  <span className="font-medium text-gray-700 block">Customer:</span>
                  <span className="text-gray-800">{orderDetails.customerName}</span>
                </div>
                
                <div>
                  <span className="font-medium text-gray-700 block">Total:</span>
                  <span className="text-gray-800">${orderDetails.totalPrice?.toFixed(2) || '0.00'}</span>
                </div>
                
                <div>
                  <span className="font-medium text-gray-700 block">Items:</span>
                  <span className="text-gray-800">{orderDetails.items?.length || 0}</span>
                </div>
              </div>

              {/* Status Change Buttons */}
              <div className="mt-4 flex justify-between space-x-2">
                {/* Next Status Button - Show only if not cancelled and not delivered */}
                {getNextStatus() && orderDetails.status !== 'cancelled_by_delivery' && (
                  <button
                    onClick={() => handleStatusChange(getNextStatus())}
                    disabled={loading}
                    className="px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center justify-center disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      <span>Update to {getNextStatus().replace(/_/g, ' ')}</span>
                    )}
                  </button>
                )}
                
                {/* Cancel Order Button - Show only if in delivering status */}
                {orderDetails.status === 'delivering' && (
                  <button
                    onClick={handleCancelOrder}
                    disabled={loading}
                    className="px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 flex items-center justify-center disabled:opacity-50"
                  >
                    <svg className="-ml-1 mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cancel Order
                  </button>
                )}
                
                {/* Navigate to Ready Orders - Show for delivered and cancelled orders */}
                {(orderDetails.status === 'delivered' || orderDetails.status === 'cancelled_by_delivery') && (
                  <button
                    onClick={goToReadyOrders}
                    className="px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 flex items-center justify-center"
                  >
                    <svg className="-ml-1 mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Ready Orders
                  </button>
                )}
              </div>
            </div>

            {/* Order Complete Message */}
            {orderDetails.status === 'delivered' && (
              <div className="p-3 border-t border-gray-200 bg-green-50">
                <div className="flex items-center text-center justify-center">
                  <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center mr-2">
                    <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-green-800">Delivered Successfully!</h4>
                    <p className="text-xs text-green-600">Thank you for your order.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Order Cancelled Message */}
            {orderDetails.status === 'cancelled_by_delivery' && (
              <div className="p-3 border-t border-gray-200 bg-red-50">
                <div className="flex items-center text-center justify-center">
                  <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center mr-2">
                    <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-red-800">Order Cancelled</h4>
                    <p className="text-xs text-red-600">This order has been cancelled by delivery.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default OrderStatus;
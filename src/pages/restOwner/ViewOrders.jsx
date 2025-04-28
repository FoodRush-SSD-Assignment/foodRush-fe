import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import OrderCard from '../../components/restOwner/OrderCard';
import orderApi from '../../api/orderApi';

function ViewOrders() {
  const { restaurantId } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      if (!restaurantId) {
        setError('Restaurant ID is missing.');
        setLoading(false);
        return;
      }

      console.log("Restaurant ID from params:", restaurantId);
      setDebugInfo(prev => ({ ...prev, restaurantIdFromParams: restaurantId }));

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication token is missing. Please log in again.');
          setLoading(false);
          return;
        }

        const endpoint = `/order-service/order/restaurant/${restaurantId}`;
        console.log("Making API request to:", endpoint);
        setDebugInfo(prev => ({ ...prev, apiEndpoint: endpoint }));
        
        const response = await orderApi.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        console.log("API Response:", response.data);
        setDebugInfo(prev => ({ ...prev, apiResponse: response.data }));
        
        setOrders(response.data);
      } catch (err) {
        console.error("Error details:", err);
        setDebugInfo(prev => ({ 
          ...prev, 
          errorMessage: err.message,
          errorResponse: err.response?.data,
          errorStatus: err.response?.status
        }));
        
        const errorMessage = err.response 
          ? `Error ${err.response.status}: ${err.response.data?.message || err.response.statusText}` 
          : err.message || 'Error fetching orders.';
          
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [restaurantId]);

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-primary mb-8">Orders for Restaurant</h1>

      {loading ? (
        <div className="p-6 bg-lightgray border border-darkgrey text-secondary rounded-xl">
          <p className="text-lg font-medium">Loading orders...</p>
          <p className="text-sm mt-2">Restaurant ID: {restaurantId || "Not found"}</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-100 border border-red-400 text-red-700 rounded-xl">
          <p className="text-xl font-bold">Error:</p>
          <p className="mt-2">{error}</p>

          <div className="mt-4 border-t border-red-300 pt-4">
            <p className="font-bold text-sm mb-2">Debug Information:</p>
            <p className="text-sm">Restaurant ID: {restaurantId || "Not found"}</p>
            <pre className="text-xs bg-gray-200 p-3 rounded overflow-x-auto">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-6 bg-lightgray border border-darkgrey p-4 rounded-lg">
            <p className="font-semibold text-secondary">Restaurant ID: {restaurantId}</p>
            <p className="text-sm text-secondary">Total Orders: {orders.length}</p>
          </div>

          {orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map((order) => (
                <OrderCard key={order._id} order={order} />
              ))}
            </div>
          ) : (
            <div className="p-6 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-xl">
              <p>No orders found for this restaurant.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ViewOrders;

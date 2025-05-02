import React, { useEffect, useState } from 'react';
import deliveryApi from '../../api/deliveryAPI';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import MerchantNavbar from '../../components/navbar/merchantNavbar';

// Fix default Marker icons issue in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons
const createCustomIcon = (color) => {
  return L.divIcon({
    className: 'custom-icon',
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.5);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  });
};

const driverIcon = createCustomIcon('#4CAF50');  // Green for driver
const restaurantIcon = createCustomIcon('#FF5722');  // Orange for restaurant
const customerIcon = createCustomIcon('#2196F3');  // Blue for customer

// Component to fit bounds to markers
const ChangeView = ({ bounds }) => {
  const map = useMap();
  
  useEffect(() => {
    if (bounds.length > 1) {
      map.fitBounds(bounds);
    }
  }, [bounds, map]);
  
  return null;
};

const MapLocation = () => {
  // Get user and token from localStorage instead of AuthContext
  const [userData, setUserData] = useState(null);
  const [token, setToken] = useState(null);
 
  const navigate = useNavigate();
  const [driver, setDriver] = useState(null);
  const [restaurantLocation, setRestaurantLocation] = useState(null);
  const [deliveryAddress, setDeliveryAddress] = useState(null);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [errors, setErrors] = useState({
    general: '',
    driver: '',
    restaurant: '',
    delivery: '',
    order: ''
  });
  const [loading, setLoading] = useState(true);
  const [bounds, setBounds] = useState([]);

  // Load user data and token from localStorage on component mount
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUserData(JSON.parse(storedUser));
      } else {
        displayError('general', 'User not authenticated. Please login again.');
        // Optional: Redirect to login page
        // navigate('/login');
      }
    } catch (error) {
      displayError('general', 'Error loading authentication data');
      console.error('Error loading auth data from localStorage:', error);
    }
  }, []);

  // Display error toast/notification
  const displayError = (type, message) => {
    setErrors(prev => ({
      ...prev,
      [type]: message
    }));
  };

  // Clear specific error
  const clearError = (type) => {
    setErrors(prev => ({
      ...prev,
      [type]: ''
    }));
  };

  // Fetch driver details from the backend
  const fetchDriverDetails = async () => {
    if (!userData || !token) {
      displayError('driver', 'User not authenticated');
      setLoading(false);
      return;
    }

    try {
      const { data } = await deliveryApi.get(`/delivery-drivers/${userData.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDriver(data);
      clearError('driver');
    } catch (err) {
      console.error("Error fetching driver:", err);
      displayError('driver', err.response?.data?.error || "Failed to load driver data");
    }
  };

  // Get latitude and longitude from address using Nominatim (OpenStreetMap's free geocoding service)
  const getLatLngFromAddress = async (address, type) => {
    if (!address) {
      displayError(type, `No ${type} address provided`);
      return null;
    }

    const encodedAddress = encodeURIComponent(address);

    try {
      // Using Nominatim - OpenStreetMap's free geocoding service
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`, {
        headers: {
          'User-Agent': 'FoodDeliveryApp/1.0' // Required by Nominatim ToS
        }
      });
      
      if (!response.ok) {
        throw new Error(`Geocoding service error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        const locationData = {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        };
        
        if (type === 'restaurant') {
          setRestaurantLocation(locationData);
        } else if (type === 'delivery') {
          setDeliveryAddress(locationData);
        }
        clearError(type);
        return locationData;
      } else {
        const errorMsg = `No location found for this ${type} address.`;
        displayError(type, errorMsg);
        return null;
      }
    } catch (err) {
      const errorMsg = `Failed to fetch location from ${type} address: ${err.message}`;
      console.error(errorMsg, err);
      displayError(type, errorMsg);
      return null;
    }
  };

  useEffect(() => {
    // Only proceed with fetching data if we have userData and token
    if (!userData || !token) return;
    
    // Get current order from localStorage
    const orderData = localStorage.getItem('currentOrder');
    if (!orderData) {
      displayError('order', 'No order information found');
      setLoading(false);
      return;
    }

    try {
      const parsedOrder = JSON.parse(orderData);
      setCurrentOrder(parsedOrder);
      clearError('order');

      // Fetch driver data
      fetchDriverDetails();

      // Get restaurant and delivery address coordinates
      const fetchLocations = async () => {
        try {
          const restaurantLoc = await getLatLngFromAddress(parsedOrder.restaurantLocation, 'restaurant');
          
          const deliveryAddressString = parsedOrder.deliveryAddress ? 
            `${parsedOrder.deliveryAddress.street}, ${parsedOrder.deliveryAddress.city}, ${parsedOrder.deliveryAddress.postalCode}` :
            null;
            
          const deliveryLoc = await getLatLngFromAddress(deliveryAddressString, 'delivery');

          // Calculate bounds for map (only if we have at least two points)
          const boundsPoints = [];
          
          if (driver?.currentLocation) {
            boundsPoints.push([driver.currentLocation.lat, driver.currentLocation.lng]);
          }
          
          if (restaurantLoc) {
            boundsPoints.push([restaurantLoc.lat, restaurantLoc.lng]);
          }
          
          if (deliveryLoc) {
            boundsPoints.push([deliveryLoc.lat, deliveryLoc.lng]);
          }
          
          if (boundsPoints.length > 1) {
            setBounds(boundsPoints);
          }
        } catch (err) {
          displayError('general', 'Error fetching location data');
          console.error('Error in fetchLocations:', err);
        } finally {
          // Once all data fetching attempts are complete, set loading to false
          setLoading(false);
        }
      };

      fetchLocations();
    } catch (err) {
      displayError('order', 'Invalid order data format');
      setLoading(false);
      console.error('Error parsing order data:', err);
    }
  }, [userData, token]); // Dependency on userData and token

  // Update bounds when driver location changes
  useEffect(() => {
    if (driver?.currentLocation && (restaurantLocation || deliveryAddress)) {
      const newBounds = [];
      
      newBounds.push([driver.currentLocation.lat, driver.currentLocation.lng]);
      
      if (restaurantLocation) {
        newBounds.push([restaurantLocation.lat, restaurantLocation.lng]);
      }
      
      if (deliveryAddress) {
        newBounds.push([deliveryAddress.lat, deliveryAddress.lng]);
      }
      
      setBounds(newBounds);
    }
  }, [driver?.currentLocation, restaurantLocation, deliveryAddress]);

  // Default center (Sri Lanka)
  const center = { lat: 7.8731, lng: 80.7718 };

  // Check if there are any errors to display
  const hasErrors = Object.values(errors).some(error => error !== '');

  return (
    <>
 
      <div className="p-4 md:p-6 flex flex-col items-center space-y-6 min-h-screen bg-gray-50">
        <div className="w-full max-w-6xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Delivery Map</h2>
            <button 
              onClick={() => navigate(-1)} 
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors duration-300 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Orders
            </button>
          </div>

          {/* Error Display Section */}
          {hasErrors && (
            <div className="mb-6">
              {Object.entries(errors).map(([type, message]) => (
                message ? (
                  <div key={type} className="p-3 mb-2 bg-red-100 border-l-4 border-red-500 text-red-700 flex justify-between items-center">
                    <div>
                      <span className="font-semibold capitalize">{type}:</span> {message}
                    </div>
                    <button 
                      onClick={() => clearError(type)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ) : null
              ))}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow p-6">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <p className="ml-4 text-gray-600">Loading map data...</p>
            </div>
          ) : errors.general ? (
            <div className="p-8 bg-red-50 border border-red-300 rounded-lg shadow text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Map</h3>
              <p className="text-red-700">{errors.general}</p>
              <button 
                onClick={() => {
                  clearError('general');
                  window.location.reload();
                }}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-300"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              {currentOrder && (
                <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-white shadow rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-2">Order Details</h3>
                    {errors.order ? (
                      <p className="text-red-500">{errors.order}</p>
                    ) : (
                      <>
                        <p className="text-gray-700">
                          <span className="font-medium">Order ID:</span> {currentOrder.orderId}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium">Restaurant:</span> {currentOrder.restaurantName}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium">Customer:</span> {currentOrder.customerName || "Anonymous"}
                        </p>
                      </>
                    )}
                  </div>

                  <div className="p-4 bg-white shadow rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-2">Restaurant Location</h3>
                    {errors.restaurant ? (
                      <div>
                        <p className="text-red-500">{errors.restaurant}</p>
                        <button 
                          onClick={() => getLatLngFromAddress(currentOrder?.restaurantLocation, 'restaurant')}
                          className="mt-2 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                        >
                          Retry
                        </button>
                      </div>
                    ) : (
                      <>
                        <p className="text-gray-700">{currentOrder?.restaurantLocation}</p>
                        {restaurantLocation && (
                          <div className="mt-2 text-sm text-gray-600">
                            <p>Lat: {restaurantLocation.lat.toFixed(6)}</p>
                            <p>Lng: {restaurantLocation.lng.toFixed(6)}</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  <div className="p-4 bg-white shadow rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-2">Delivery Address</h3>
                    {errors.delivery ? (
                      <div>
                        <p className="text-red-500">{errors.delivery}</p>
                        <button 
                          onClick={() => {
                            const addressString = `${currentOrder?.deliveryAddress?.street}, ${currentOrder?.deliveryAddress?.city}, ${currentOrder?.deliveryAddress?.postalCode}`;
                            getLatLngFromAddress(addressString, 'delivery');
                          }}
                          className="mt-2 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                        >
                          Retry
                        </button>
                      </div>
                    ) : (
                      <>
                        <p className="text-gray-700">{currentOrder?.deliveryAddress?.street}</p>
                        <p className="text-gray-700">{currentOrder?.deliveryAddress?.city}, {currentOrder?.deliveryAddress?.postalCode}</p>
                        {deliveryAddress && (
                          <div className="mt-2 text-sm text-gray-600">
                            <p>Lat: {deliveryAddress.lat.toFixed(6)}</p>
                            <p>Lng: {deliveryAddress.lng.toFixed(6)}</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Map Container */}
              <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="rounded-lg overflow-hidden border border-gray-200" style={{ height: "500px", width: "100%" }}>
                  <MapContainer
                    center={[center.lat, center.lng]}
                    zoom={10}
                    scrollWheelZoom={true}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />

                    {bounds.length > 1 && <ChangeView bounds={bounds} />}

                    {/* Driver Marker */}
                    {driver?.currentLocation && (
                      <Marker 
                        position={[driver.currentLocation.lat, driver.currentLocation.lng]} 
                        icon={driverIcon}
                      >
                        <Popup>
                          <div className="text-center">
                            <h3 className="font-semibold">Your Location</h3>
                            <p className="text-sm text-gray-600">Driver: {driver.name || userData?.firstname || "You"}</p>
                          </div>
                        </Popup>
                      </Marker>
                    )}

                    {/* Restaurant Marker */}
                    {restaurantLocation && (
                      <Marker 
                        position={[restaurantLocation.lat, restaurantLocation.lng]} 
                        icon={restaurantIcon}
                      >
                        <Popup>
                          <div className="text-center">
                            <h3 className="font-semibold">{currentOrder?.restaurantName}</h3>
                            <p className="text-sm text-gray-600">Pickup Location</p>
                          </div>
                        </Popup>
                      </Marker>
                    )}

                    {/* Delivery Address Marker */}
                    {deliveryAddress && (
                      <Marker 
                        position={[deliveryAddress.lat, deliveryAddress.lng]} 
                        icon={customerIcon}
                      >
                        <Popup>
                          <div className="text-center">
                            <h3 className="font-semibold">Delivery Address</h3>
                            <p className="text-sm text-gray-600">Customer: {currentOrder?.customerName || "Anonymous"}</p>
                            <p className="text-sm text-gray-600">Phone: {currentOrder?.customerMobileNo || "N/A"}</p>
                          </div>
                        </Popup>
                      </Marker>
                    )}
                  </MapContainer>
                </div>

                <div className="mt-6 flex justify-between">
                  <button 
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors duration-300"
                  >
                    Cancel
                  </button>
                  <button 
                    className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-300"
                    onClick={() => {
                      // Add your delivery start logic here
                      // if (!restaurantLocation) {
                      //   displayError('restaurant', 'Restaurant location is required to start delivery');
                      //   return;
                      // }
                      // if (!deliveryAddress) {
                      //   displayError('delivery', 'Delivery address is required to start delivery');
                      //   return;
                      // }
                      // Navigate to the OrderStatus page
                      navigate('/orderstatus', { state: { orderId: currentOrder.orderId } });
                    }}
                  >
                    Accept order
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default MapLocation;
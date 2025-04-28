import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import deliveryApi from "../../api/deliveryApi";
import { FaCar, FaMotorcycle, FaShuttleVan, FaMapMarkerAlt } from "react-icons/fa";
import { BiLoaderAlt } from "react-icons/bi";
import { MdDirections } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import MerchantNavbar from "../navbar/merchantNavbar";

const DeliveryTasks = () => {
  const { user, token } = useContext(AuthContext);
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  
  const [vehicle, setVehicle] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Current location state
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [locationLoading, setLocationLoading] = useState(false);

  // Fetch driver details
  const fetchDriverDetails = async (userId) => {
    try {
      const { data } = await deliveryApi.get(`/delivery-drivers/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDriver(data);
    } catch (err) {
      console.error("Error fetching driver:", err);
      setError(err.response?.data?.error || "Failed to load driver data");
    } finally {
      setLoading(false);
    }
    console.log(token);
  };

  const handleVehicleSubmit = async (e) => {
    e.preventDefault();
    if (!vehicle || !vehicleNumber) {
      alert("Please select a vehicle type and enter vehicle number");
      return;
    }
    
    try {
      setSubmitting(true);
      await deliveryApi.put(
        `/delivery-drivers/${user.id}`,
        {
          vehicle,
          vehicleNumber,
          approvalStatus: "pending",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Show success message and refresh driver details
      const successMessage = document.getElementById("success-message");
      if (successMessage) {
        successMessage.classList.remove("hidden");
        setTimeout(() => {
          successMessage.classList.add("hidden");
        }, 3000);
      }
      
      fetchDriverDetails(user.id);
    } catch (err) {
      console.error("Error submitting vehicle:", err);
      setError(err.response?.data?.error || "Failed to submit vehicle details");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle getting current location
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setLocation(loc);
        setLocationError('');
        updateLocationInBackend(loc);
      },
      (err) => {
        console.error(err);
        setLocationError('Unable to retrieve your location');
      }
    );
  };
  
  // Update location in backend
  const updateLocationInBackend = async (loc) => {
    if (!user || !token) {
      setLocationError('User not authenticated');
      return;
    }
    
    try {
      setLocationLoading(true);
      await deliveryApi.put(`/delivery-drivers/${user.id}/location`, loc, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Show success message
      const locationSuccessMessage = document.getElementById("location-success-message");
      if (locationSuccessMessage) {
        locationSuccessMessage.classList.remove("hidden");
        setTimeout(() => {
          locationSuccessMessage.classList.add("hidden");
        }, 3000);
      }
    } catch (err) {
      console.error('Error updating location:', err);
      setLocationError(err.response?.data?.error || 'Failed to update location');
    } finally {
      setLocationLoading(false);
    }
  };

  // Navigate to available orders
  const navigateToAvailableOrders = () => {
    // Implement navigation to available orders page
    navigate('/readyorders');
   
    // If using React Router: history.push('/available-orders') or navigate('/available-orders')
  };

  useEffect(() => {
    if (user && token) {
      fetchDriverDetails(user.id);
    }
  }, [user, token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 p-4">
        <BiLoaderAlt className="animate-spin text-blue-600 text-4xl" aria-hidden="true" />
        <span className="sr-only">Loading delivery tasks...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-lg bg-red-50 border border-red-200" role="alert">
        <h2 className="text-lg font-semibold text-red-700 mb-2">Error</h2>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <>
   
    <div className="max-w-4xl mx-auto mt-6 p-6 bg-gradient-to-br from-blue-50 to-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-blue-800 mb-2">Delivery Dashboard</h1>
      <p className="text-blue-600 mb-6 border-b border-blue-100 pb-4">
        Manage your deliveries and update your profile information
      </p>

      {/* Success Message */}
      <div id="success-message" className="hidden mb-4 p-4 bg-green-100 text-green-700 rounded-md" role="alert">
        Vehicle details submitted successfully!
      </div>

      {/* Location Success Message */}
      <div id="location-success-message" className="hidden mb-4 p-4 bg-green-100 text-green-700 rounded-md" role="alert">
        Location updated successfully!
      </div>

      {/* Driver Details Card */}
      {driver && (
        <div className="p-6 bg-white rounded-lg shadow-sm mb-8 transition-all hover:shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="inline-block w-8 h-8 bg-blue-100 rounded-full mr-2 flex items-center justify-center text-blue-600">
              <span className="text-sm font-bold">{driver.driverName?.charAt(0) || "D"}</span>
            </span>
            Driver Profile
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Full Name</span>
                <span className="font-medium text-gray-800">{driver.driverName || "Not provided"}</span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Email Address</span>
                <span className="font-medium text-gray-800">{driver.email || "Not provided"}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Phone Number</span>
                <span className="font-medium text-gray-800">{driver.phone || "Not provided"}</span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-xs text-gray-500">Account Status</span>
                <span className="inline-flex items-center">
                  <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                    driver.approvalStatus === "approved" ? "bg-green-500" :
                    driver.approvalStatus === "pending" ? "bg-yellow-500" :
                    "bg-blue-500"
                  }`}></span>
                  <span className="font-medium capitalize">{driver.approvalStatus || "Registered"}</span>
                </span>
              </div>
            </div>
          </div>
          
          {driver.vehicle && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Vehicle Information</h3>
              <div className="flex items-center">
                <span className="mr-2">
                  {driver.vehicle === "car" ? <FaCar className="text-blue-600" /> :
                   driver.vehicle === "van" ? <FaShuttleVan className="text-blue-600" /> :
                   driver.vehicle === "bike" ? <FaMotorcycle className="text-blue-600" /> : null}
                </span>
                <span className="text-gray-800">{driver.vehicleNumber}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Vehicle Selection Form */}
      {driver?.approvalStatus === "registered" && (
        <form 
          onSubmit={handleVehicleSubmit} 
          className="bg-white rounded-lg shadow-sm p-6 transition-all hover:shadow-md"
          aria-labelledby="vehicle-form-title"
        >
          <h2 id="vehicle-form-title" className="text-lg font-semibold text-gray-800 mb-6">
            Register Your Vehicle
          </h2>
          
          <fieldset className="mb-6">
            <legend className="sr-only">Vehicle Type</legend>
            <div className="text-sm font-medium text-gray-700 mb-3">Select Vehicle Type</div>
            
            <div className="grid grid-cols-3 gap-3 sm:gap-6">
              <button
                type="button"
                className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                  vehicle === "car" 
                    ? "border-blue-500 bg-blue-50 text-blue-700" 
                    : "border-gray-200 hover:border-blue-200 hover:bg-blue-50"
                }`}
                onClick={() => setVehicle("car")}
                aria-pressed={vehicle === "car"}
              >
                <FaCar size={28} className={vehicle === "car" ? "text-blue-600" : "text-gray-500"} />
                <span className="mt-2 text-sm font-medium">Car</span>
              </button>
              
              <button
                type="button"
                className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                  vehicle === "van" 
                    ? "border-blue-500 bg-blue-50 text-blue-700" 
                    : "border-gray-200 hover:border-blue-200 hover:bg-blue-50"
                }`}
                onClick={() => setVehicle("van")}
                aria-pressed={vehicle === "van"}
              >
                <FaShuttleVan size={28} className={vehicle === "van" ? "text-blue-600" : "text-gray-500"} />
                <span className="mt-2 text-sm font-medium">Van</span>
              </button>
              
              <button
                type="button"
                className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                  vehicle === "bike" 
                    ? "border-blue-500 bg-blue-50 text-blue-700" 
                    : "border-gray-200 hover:border-blue-200 hover:bg-blue-50"
                }`}
                onClick={() => setVehicle("bike")}
                aria-pressed={vehicle === "bike"}
              >
                <FaMotorcycle size={28} className={vehicle === "bike" ? "text-blue-600" : "text-gray-500"} />
                <span className="mt-2 text-sm font-medium">Bike</span>
              </button>
            </div>
          </fieldset>

          <div className="mb-6">
            <label htmlFor="vehicleNumber" className="block text-sm font-medium text-gray-700 mb-2">
              Vehicle Number / License Plate
            </label>
            <input
              type="text"
              id="vehicleNumber"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter vehicle registration number"
              required
              aria-describedby="vehicle-number-hint"
            />
            <p id="vehicle-number-hint" className="mt-1 text-xs text-gray-500">
              Enter the official registration number as it appears on your vehicle documents
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
            <button
              type="button"
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              onClick={() => {
                setVehicle("");
                setVehicleNumber("");
              }}
            >
              Reset
            </button>
            
            <button
              type="submit"
              disabled={submitting}
              className={`px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors flex items-center justify-center ${
                submitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {submitting ? (
                <>
                  <BiLoaderAlt className="animate-spin mr-2" />
                  <span>Submitting...</span>
                </>
              ) : (
                "Submit Vehicle Details"
              )}
            </button>
          </div>
        </form>
      )}

      {/* If driver status is pending, show a message */}
      {driver?.approvalStatus === "pending" && (
        <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg text-center" role="alert">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
              <BiLoaderAlt className="text-yellow-500 text-2xl animate-spin" />
            </div>
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">Vehicle Registration Pending</h3>
            <p className="text-yellow-700 mb-4">
              Your vehicle details have been submitted and are pending approval. 
              Our team will review your information shortly.
            </p>
          </div>
        </div>
      )}

      {/* If driver status is approved, show their tasks and location section */}
      {driver?.approvalStatus === "approved" && (
        <>
          <div className="p-6 bg-green-50 border border-green-200 rounded-lg mb-6">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <FaCar className="text-green-500 text-2xl" />
              </div>
              <h3 className="text-lg font-semibold text-green-800 mb-2">You're Ready to Deliver!</h3>
              <p className="text-green-700">
                Your vehicle registration has been approved. You can now start accepting delivery tasks.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-gray-500">No delivery tasks available at the moment.</p>
              <p className="text-sm text-gray-400">Check back soon for new delivery opportunities</p>
            </div>
          </div>

          {/* Current Location Section */}
          <div className="p-6 bg-white rounded-lg shadow-sm mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FaMapMarkerAlt className="text-blue-600 mr-2" />
              Current Location
            </h2>
            
            <div className="flex flex-col items-center space-y-4">
              <button
                onClick={handleGetLocation}
                disabled={locationLoading}
                className={`px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors flex items-center justify-center ${
                  locationLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {locationLoading ? (
                  <>
                    <BiLoaderAlt className="animate-spin mr-2" />
                    <span>Updating Location...</span>
                  </>
                ) : (
                  <>
                    <FaMapMarkerAlt className="mr-2" />
                    <span>Get Current Location</span>
                  </>
                )}
              </button>
              
              {location && (
                <div className="w-full mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">Latitude</span>
                      <span className="font-medium text-gray-800">{location.lat}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">Longitude</span>
                      <span className="font-medium text-gray-800">{location.lng}</span>
                    </div>
                  </div>
                  
                  {/* Navigate to Available Orders Button - Only show after location is obtained */}
                  <button
                    onClick={navigateToAvailableOrders}
                    className="mt-4 w-full px-6 py-3 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
                  >
                    <MdDirections className="mr-2" />
                    View Available Orders
                  </button>
                </div>
              )}
              
              {locationError && (
                <div className="w-full mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  <p className="font-medium">Error</p>
                  <p>{locationError}</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
    </>
  );
};

export default DeliveryTasks;
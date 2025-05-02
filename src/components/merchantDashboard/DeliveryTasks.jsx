import { useEffect, useState } from "react";
import deliveryApi from "../../api/deliveryAPI";
import { FaCar, FaMotorcycle, FaShuttleVan, FaMapMarkerAlt, FaUserAlt, FaEnvelope, FaPhone } from "react-icons/fa";
import { BiLoaderAlt } from "react-icons/bi";
import { MdDirections } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";

const DeliveryTasks = () => {
  // Use localStorage instead of AuthContext
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
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

  // Get user and token from localStorage
  useEffect(() => {
    try {
      // Retrieve auth data from localStorage
      const storedToken = localStorage.getItem('token');
      const storedUser = JSON.parse(localStorage.getItem('user'));
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
      } else {
        // If no auth data found, redirect to login
        navigate('/login');
        setError("Authentication required. Please log in.");
      }
    } catch (err) {
      console.error("Error parsing user data from localStorage:", err);
      setError("Error retrieving authentication data");
    }
  }, [navigate]);

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
    
    setLocationLoading(true);
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
        setLocationLoading(false);
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
    navigate('/readyorders');
  };

  // Fetch driver details when user and token are available
  useEffect(() => {
    if (user && token) {
      fetchDriverDetails(user.id);
    }
  }, [user, token]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen p-4">
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="text-blue-600 text-4xl"
        >
          <BiLoaderAlt aria-hidden="true" />
        </motion.div>
        <span className="sr-only">Loading delivery tasks...</span>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 rounded-lg bg-red-50 border border-red-200 max-w-4xl mx-auto mt-6" 
        role="alert"
      >
        <h2 className="text-lg font-semibold text-red-700 mb-2">Error</h2>
        <p className="text-red-600">{error}</p>
      </motion.div>
    );
  }

  // Helper function to get vehicle icon
  const getVehicleIcon = (vehicleType) => {
    switch(vehicleType) {
      case "car": return <FaCar className="text-blue-600" />;
      case "van": return <FaShuttleVan className="text-blue-600" />;
      case "bike": return <FaMotorcycle className="text-blue-600" />;
      default: return null;
    }
  };

  // Helper function to get status color
  const getStatusColor = (status) => {
    switch(status) {
      case "approved": return "bg-green-500";
      case "pending": return "bg-yellow-500";
      default: return "bg-blue-500";
    }
  };

  return (
    <motion.div 
      className="bg-gray-50 min-h-screen"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Success Messages */}
      <div id="success-message" className="hidden fixed top-4 right-4 z-50 p-4 bg-green-100 text-green-700 rounded-md shadow-lg" role="alert">
        Vehicle details submitted successfully!
      </div>
      <div id="location-success-message" className="hidden fixed top-4 right-4 z-50 p-4 bg-green-100 text-green-700 rounded-md shadow-lg" role="alert">
        Location updated successfully!
      </div>



      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column - Driver Profile */}
          <motion.div 
            className="lg:col-span-5 space-y-6"
            variants={itemVariants}
          >
            {/* Driver Profile Card */}
            {driver && (
              <motion.div
                className="bg-white rounded-xl shadow-lg overflow-hidden"
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 10px 10px -5px rgba(59, 130, 246, 0.04)" }}
                transition={{ duration: 0.3 }}
              >
                <div className="bg-gradient-to-r from-[#ee6b6b] to-[#f25b5b] px-6 py-5 text-white">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                      <span className="text-xl font-bold text-blue-600">{driver.driverName?.charAt(0) || "D"}</span>
                    </div>
                    <div className="ml-4">
                      <h2 className="text-xl font-semibold">{driver.driverName || "Driver"}</h2>
                      <p className="text-blue-100 text-sm">{driver.email || "No email provided"}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                          <FaUserAlt />
                        </div>
                        <div className="ml-4">
                          <span className="text-xs text-gray-500">Full Name</span>
                          <div className="font-medium text-gray-800">{driver.driverName || "Not provided"}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                          <FaEnvelope />
                        </div>
                        <div className="ml-4">
                          <span className="text-xs text-gray-500">Email Address</span>
                          <div className="font-medium text-gray-800">{driver.email || "Not provided"}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                          <FaPhone />
                        </div>
                        <div className="ml-4">
                          <span className="text-xs text-gray-500">Phone Number</span>
                          <div className="font-medium text-gray-800">{driver.phone || "Not provided"}</div>
                        </div>
                      </div>
                    </div>
                    
                    {driver.vehicle && (
                      <div className="border-t border-gray-200 pt-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-3">Vehicle Information</h3>
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                            {getVehicleIcon(driver.vehicle)}
                          </div>
                          <div className="ml-4">
                            <span className="text-xs text-gray-500">Vehicle Type</span>
                            <div className="font-medium text-gray-800 capitalize">{driver.vehicle}</div>
                          </div>
                          <div className="ml-auto">
                            <span className="text-xs text-gray-500">License Plate</span>
                            <div className="font-medium text-gray-800">{driver.vehicleNumber}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Vehicle Selection Form */}
            {driver?.approvalStatus === "registered" && (
              <motion.form 
                onSubmit={handleVehicleSubmit} 
                className="bg-white rounded-xl shadow-lg p-6"
                variants={itemVariants}
                aria-labelledby="vehicle-form-title"
              >
                <h2 id="vehicle-form-title" className="text-xl font-semibold text-gray-800 mb-6 border-b border-gray-200 pb-4">
                  Register Your Vehicle
                </h2>
                
                <fieldset className="mb-6">
                  <legend className="sr-only">Vehicle Type</legend>
                  <div className="text-sm font-medium text-gray-700 mb-3">Select Vehicle Type</div>
                  
                  <div className="grid grid-cols-3 gap-3 sm:gap-4">
                    <motion.button
                      type="button"
                      className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                        vehicle === "car" 
                          ? "border-blue-500 bg-blue-50 text-blue-700" 
                          : "border-gray-200 hover:border-blue-200 hover:bg-blue-50"
                      }`}
                      onClick={() => setVehicle("car")}
                      aria-pressed={vehicle === "car"}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaCar size={28} className={vehicle === "car" ? "text-blue-600" : "text-gray-500"} />
                      <span className="mt-2 text-sm font-medium">Car</span>
                    </motion.button>
                    
                    <motion.button
                      type="button"
                      className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                        vehicle === "van" 
                          ? "border-blue-500 bg-blue-50 text-blue-700" 
                          : "border-gray-200 hover:border-blue-200 hover:bg-blue-50"
                      }`}
                      onClick={() => setVehicle("van")}
                      aria-pressed={vehicle === "van"}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaShuttleVan size={28} className={vehicle === "van" ? "text-blue-600" : "text-gray-500"} />
                      <span className="mt-2 text-sm font-medium">Van</span>
                    </motion.button>
                    
                    <motion.button
                      type="button"
                      className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                        vehicle === "bike" 
                          ? "border-blue-500 bg-blue-50 text-blue-700" 
                          : "border-gray-200 hover:border-blue-200 hover:bg-blue-50"
                      }`}
                      onClick={() => setVehicle("bike")}
                      aria-pressed={vehicle === "bike"}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaMotorcycle size={28} className={vehicle === "bike" ? "text-blue-600" : "text-gray-500"} />
                      <span className="mt-2 text-sm font-medium">Bike</span>
                    </motion.button>
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
                  <motion.button
                    type="button"
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                    onClick={() => {
                      setVehicle("");
                      setVehicleNumber("");
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Reset
                  </motion.button>
                  
                  <motion.button
                    type="submit"
                    disabled={submitting}
                    className={`px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors flex items-center justify-center ${
                      submitting ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                    whileHover={submitting ? {} : { scale: 1.05 }}
                    whileTap={submitting ? {} : { scale: 0.95 }}
                  >
                    {submitting ? (
                      <>
                        <BiLoaderAlt className="animate-spin mr-2" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      "Submit Vehicle Details"
                    )}
                  </motion.button>
                </div>
              </motion.form>
            )}
          </motion.div>
          
          {/* Right Column - Approval Status & Location */}
          <motion.div 
            className="lg:col-span-7 space-y-6"
            variants={itemVariants}
          >
            {/* Approval Status Section */}
            <motion.div 
              className="bg-white rounded-xl shadow-lg overflow-hidden"
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 10px 10px -5px rgba(59, 130, 246, 0.04)" }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-gradient-to-r from-[#ee6b6b] to-[#f25b5b] px-6 py-5 text-white">
                <h2 className="text-xl font-semibold">Account Status</h2>
                <p className="text-blue-100 text-sm">Current verification status of your account</p>
              </div>
              
              <div className="p-6">
                {driver && (
                  <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full mr-3 ${getStatusColor(driver.approvalStatus)}`}></div>
                      <div>
                        <div className="text-sm font-medium text-gray-500">Status</div>
                        <div className="text-lg font-semibold text-gray-800 capitalize">{driver.approvalStatus || "Registered"}</div>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-blue-600">
                      {driver.approvalStatus === "approved" && "Ready to deliver"}
                      {driver.approvalStatus === "pending" && "Awaiting approval"}
                      {driver.approvalStatus === "registered" && "Registration required"}
                    </div>
                  </div>
                )}
                
                {/* If driver status is pending, show a message */}
                {driver?.approvalStatus === "pending" && (
                  <motion.div 
                    className="mt-4 p-6 bg-yellow-50 border border-yellow-200 rounded-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                          <BiLoaderAlt className="text-yellow-500 text-xl animate-spin" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-yellow-800">Vehicle Registration Pending</h3>
                        <p className="text-yellow-700 mt-1">
                          Your vehicle details have been submitted and are pending approval. 
                          Our team will review your information shortly.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {/* If driver status is approved, show approved message */}
                {driver?.approvalStatus === "approved" && (
                  <motion.div 
                    className="mt-4 p-6 bg-green-50 border border-green-200 rounded-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                          <FaCar className="text-green-500 text-xl" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-green-800">You're Ready to Deliver!</h3>
                        <p className="text-green-700 mt-1">
                          Your vehicle registration has been approved. You can now start accepting delivery tasks.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
            
            {/* Location Section */}
            {driver?.approvalStatus === "approved" && (
              <motion.div 
                className="bg-white rounded-xl shadow-lg overflow-hidden"
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 10px 10px -5px rgba(59, 130, 246, 0.04)" }}
                transition={{ duration: 0.3 }}
                variants={itemVariants}
              >
                <div className="bg-gradient-to-r from-[#ee6b6b] to-[#f25b5b] px-6 py-5 text-white">
                  <h2 className="text-xl font-semibold flex items-center">
                    <FaMapMarkerAlt className="mr-2" />
                    Current Location
                  </h2>
                  <p className="text-blue-100 text-sm">Update your location to receive delivery tasks</p>
                </div>
                
                <div className="p-6">
                  <div className="flex flex-col items-center">
                    <motion.button
                      onClick={handleGetLocation}
                      disabled={locationLoading}
                      className={`px-6 py-4 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors flex items-center justify-center w-full ${
                        locationLoading ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                      whileHover={locationLoading ? {} : { scale: 1.05 }}
                      whileTap={locationLoading ? {} : { scale: 0.95 }}
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
                    </motion.button>
                    
                    {location && (
                      <motion.div 
                        className="w-full mt-6 rounded-lg overflow-hidden"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg">
                          <h3 className="text-lg font-semibold text-blue-800 mb-4">Location Updated</h3>
                          
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                              <div className="text-sm font-medium text-gray-500 mb-1">Latitude</div>
                              <div className="text-lg font-semibold text-blue-800">{location.lat.toFixed(6)}</div>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                              <div className="text-sm font-medium text-gray-500 mb-1">Longitude</div>
                              <div className="text-lg font-semibold text-blue-800">{location.lng.toFixed(6)}</div>
                            </div>
                          </div>
                          
                          <motion.button
                            onClick={navigateToAvailableOrders}
                            className="w-full px-6 py-4 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <MdDirections className="mr-2" />
                            View Available Orders
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                    
                    {locationError && (
                      <motion.div 
                        className="w-full mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <p className="font-medium">Error</p>
                        <p>{locationError}</p>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
            

          </motion.div>
        </div>
      </div>
      
      {/* Footer */}
      <motion.div 
        className="bg-white border-t border-gray-200 py-6 px-4 sm:px-6 lg:px-8 mt-8"
        variants={itemVariants}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center mb-4 sm:mb-0">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3">
              <FaCar />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Delivery Dashboard</h3>
              <p className="text-sm text-gray-500">© 2025 Delivery Service</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Help Center</button>
            <span className="hidden sm:inline text-gray-300">|</span>
            <button className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Driver Support</button>
            <span className="hidden sm:inline text-gray-300">|</span>
            <button className="text-sm text-gray-600 hover:text-blue-600 transition-colors">Terms of Service</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DeliveryTasks;